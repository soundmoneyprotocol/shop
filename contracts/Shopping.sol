// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "./PriceConverter.sol";

/**
 * @title Shopping
 * @notice Marketplace for creators to sell products with escrow, authenticity NFTs, and creator governance
 */
contract Shopping is PriceConverter, Ownable, ReentrancyGuard {

    //--------------------------------------------------------------------
    // VARIABLES

    address public creatorTokenAddress; // ERC1155 token for authenticity NFTs

    uint256 public platformFeePercentage = 800; // 8% in basis points
    uint256 public daoTreasuryPercentage = 200; // 2% to DAO (5% platform fee split)
    uint256 private _productIds;
    uint256 private _orderIds;

    struct Creator {
        address wallet;
        string name;
        string shopUrl;
        uint256 totalEarnings;
        uint256 totalSaleCount;
        uint256 rating; // in basis points (e.g., 4500 = 4.5 stars)
        bool verified;
        uint256 createdAt;
    }

    struct Product {
        uint256 id;
        address creator;
        string title;
        string description;
        string imageUrl;
        string category; // sneakers, clothing, art, vintage, etc
        uint256 priceUSD; // in cents
        uint256 stock;
        uint256 sold;
        bool hasAuthenticityNFT; // Mints ERC1155 for each purchase
        uint256 nftTokenId; // If ERC1155, the token ID
        uint256 rating;
        uint256 createdAt;
    }

    struct Order {
        uint256 id;
        uint256 productId;
        address buyer;
        address creator;
        uint256 quantity;
        uint256 totalUSD; // in cents
        string status; // pending, paid, shipped, delivered, disputed, refunded
        uint256 createdAt;
        uint256 paidAt;
        string trackingNumber;
    }

    struct Dispute {
        uint256 orderId;
        address initiator; // buyer or creator
        string reason;
        uint256 createdAt;
        uint256 resolvedAt;
        bool resolved;
        address resolver; // admin who resolved
    }

    mapping(address => Creator) public creators;
    Product[] public products;
    Order[] public orders;
    Dispute[] public disputes;

    mapping(uint256 => Order[]) public productOrders; // product ID → orders
    mapping(address => uint256[]) public creatorProducts; // creator → product IDs
    mapping(address => uint256[]) public buyerOrders; // buyer → order IDs

    mapping(address => uint256) public creatorBalance; // Escrow balance for creators
    mapping(address => uint256) public treasuryBalance; // DAO treasury

    //--------------------------------------------------------------------
    // EVENTS

    event CreatorRegistered(address indexed creator, string name);

    event ProductListed(
        uint256 indexed productId,
        address indexed creator,
        string title,
        string category,
        uint256 priceUSD
    );

    event OrderCreated(
        uint256 indexed orderId,
        uint256 indexed productId,
        address indexed buyer,
        address creator,
        uint256 quantity,
        uint256 totalUSD
    );

    event OrderPaid(
        uint256 indexed orderId,
        address indexed buyer,
        uint256 amountUSD
    );

    event OrderShipped(
        uint256 indexed orderId,
        string trackingNumber
    );

    event OrderDelivered(uint256 indexed orderId);

    event CreatorWithdraw(
        address indexed creator,
        uint256 amount
    );

    event DisputeCreated(
        uint256 indexed orderId,
        address indexed initiator,
        string reason
    );

    event DisputeResolved(
        uint256 indexed orderId,
        bool creatorFavored
    );

    //--------------------------------------------------------------------
    // ERRORS

    error Shopping__InvalidPrice();
    error Shopping__InvalidStock();
    error Shopping__OutOfStock();
    error Shopping__UnauthorizedCreator();
    error Shopping__OrderNotFound();
    error Shopping__TransferFailed();
    error Shopping__AlreadyDisputed();

    //--------------------------------------------------------------------
    // MODIFIERS

    modifier onlyCreator(uint256 _productId) {
        require(products[_productId].creator == msg.sender, "Shopping__UnauthorizedCreator");
        _;
    }

    //--------------------------------------------------------------------
    // CONSTRUCTOR

    constructor(address _priceFeedAddress) {
        priceFeedAddress = _priceFeedAddress;
    }

    //--------------------------------------------------------------------
    // CREATOR FUNCTIONS

    function registerCreator(string calldata _name, string calldata _shopUrl) external {
        creators[msg.sender] = Creator({
            wallet: msg.sender,
            name: _name,
            shopUrl: _shopUrl,
            totalEarnings: 0,
            totalSaleCount: 0,
            rating: 5000, // Start at 5 stars
            verified: false,
            createdAt: block.timestamp
        });

        emit CreatorRegistered(msg.sender, _name);
    }

    //--------------------------------------------------------------------
    // PRODUCT FUNCTIONS

    function listProduct(
        string calldata _title,
        string calldata _description,
        string calldata _imageUrl,
        string calldata _category,
        uint256 _priceUSD, // in cents (e.g., 9999 = $99.99)
        uint256 _stock,
        bool _hasAuthenticityNFT
    ) external {
        require(_priceUSD > 0, "Shopping__InvalidPrice");
        require(_stock > 0, "Shopping__InvalidStock");

        Product memory newProduct = Product({
            id: _productIds,
            creator: msg.sender,
            title: _title,
            description: _description,
            imageUrl: _imageUrl,
            category: _category,
            priceUSD: _priceUSD,
            stock: _stock,
            sold: 0,
            hasAuthenticityNFT: _hasAuthenticityNFT,
            nftTokenId: _productIds, // Use product ID as NFT token ID
            rating: 5000,
            createdAt: block.timestamp
        });

        products.push(newProduct);
        creatorProducts[msg.sender].push(_productIds);

        emit ProductListed(_productIds, msg.sender, _title, _category, _priceUSD);
        _productIds++;
    }

    //--------------------------------------------------------------------
    // ORDER FUNCTIONS

    function createOrder(
        uint256 _productId,
        uint256 _quantity
    ) external {
        require(_productId < products.length, "Shopping__OrderNotFound");
        Product storage product = products[_productId];
        require(product.stock >= _quantity, "Shopping__OutOfStock");

        uint256 totalUSD = product.priceUSD * _quantity;

        Order memory newOrder = Order({
            id: _orderIds,
            productId: _productId,
            buyer: msg.sender,
            creator: product.creator,
            quantity: _quantity,
            totalUSD: totalUSD,
            status: "pending",
            createdAt: block.timestamp,
            paidAt: 0,
            trackingNumber: ""
        });

        orders.push(newOrder);
        productOrders[_productId].push(_orderIds);
        buyerOrders[msg.sender].push(_orderIds);

        // Deduct from stock
        product.stock -= _quantity;
        product.sold += _quantity;

        emit OrderCreated(_orderIds, _productId, msg.sender, product.creator, _quantity, totalUSD);
        _orderIds++;
    }

    function completePayment(uint256 _orderId) external payable nonReentrant {
        require(_orderId < orders.length, "Shopping__OrderNotFound");
        Order storage order = orders[_orderId];

        // Get ETH amount needed (convert USD to ETH)
        uint256 ethAmount = getConversionRate(order.totalUSD);
        require(msg.value >= ethAmount, "Shopping__TransferFailed");

        // Calculate splits
        uint256 platformFee = (order.totalUSD * platformFeePercentage) / 10000;
        uint256 creatorEarnings = order.totalUSD - platformFee;

        // Update balances
        creatorBalance[order.creator] += creatorEarnings;
        treasuryBalance[owner()] += platformFee;

        order.status = "paid";
        order.paidAt = block.timestamp;

        emit OrderPaid(_orderId, msg.sender, order.totalUSD);
    }

    function shipOrder(uint256 _orderId, string calldata _trackingNumber)
        external
        onlyCreator(orders[_orderId].productId)
    {
        require(_orderId < orders.length, "Shopping__OrderNotFound");
        Order storage order = orders[_orderId];

        order.status = "shipped";
        order.trackingNumber = _trackingNumber;

        emit OrderShipped(_orderId, _trackingNumber);
    }

    function confirmDelivery(uint256 _orderId) external {
        require(_orderId < orders.length, "Shopping__OrderNotFound");
        Order storage order = orders[_orderId];
        require(order.buyer == msg.sender, "Shopping__UnauthorizedCreator");

        order.status = "delivered";

        emit OrderDelivered(_orderId);
    }

    //--------------------------------------------------------------------
    // WITHDRAWAL FUNCTIONS

    function withdrawCreatorBalance() external nonReentrant {
        uint256 balance = creatorBalance[msg.sender];
        require(balance > 0, "Shopping__TransferFailed");

        creatorBalance[msg.sender] = 0;

        (bool success, ) = msg.sender.call{value: balance}("");
        require(success, "Shopping__TransferFailed");

        emit CreatorWithdraw(msg.sender, balance);
    }

    function withdrawTreasury(uint256 _amount) external onlyOwner nonReentrant {
        require(_amount <= treasuryBalance[owner()], "Shopping__TransferFailed");

        treasuryBalance[owner()] -= _amount;

        (bool success, ) = owner().call{value: _amount}("");
        require(success, "Shopping__TransferFailed");
    }

    //--------------------------------------------------------------------
    // DISPUTE FUNCTIONS

    function createDispute(uint256 _orderId, string calldata _reason) external {
        require(_orderId < orders.length, "Shopping__OrderNotFound");
        Order storage order = orders[_orderId];
        require(
            msg.sender == order.buyer || msg.sender == order.creator,
            "Shopping__UnauthorizedCreator"
        );

        // Check if already disputed
        for (uint256 i = 0; i < disputes.length; i++) {
            if (disputes[i].orderId == _orderId && !disputes[i].resolved) {
                revert Shopping__AlreadyDisputed();
            }
        }

        Dispute memory newDispute = Dispute({
            orderId: _orderId,
            initiator: msg.sender,
            reason: _reason,
            createdAt: block.timestamp,
            resolvedAt: 0,
            resolved: false,
            resolver: address(0)
        });

        disputes.push(newDispute);

        emit DisputeCreated(_orderId, msg.sender, _reason);
    }

    //--------------------------------------------------------------------
    // QUERY FUNCTIONS

    function getProduct(uint256 _productId) external view returns (Product memory) {
        return products[_productId];
    }

    function getOrder(uint256 _orderId) external view returns (Order memory) {
        return orders[_orderId];
    }

    function getCreatorBalance(address _creator) external view returns (uint256) {
        return creatorBalance[_creator];
    }

    function getProductCount() external view returns (uint256) {
        return products.length;
    }

    function getOrderCount() external view returns (uint256) {
        return orders.length;
    }
}
