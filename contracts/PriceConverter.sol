// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "@openzeppelin/contracts/interfaces/AggregatorV3Interface.sol";

/**
 * @title PriceConverter
 * @notice Chainlink oracle integration for ETH/USD conversion
 */
contract PriceConverter {
    AggregatorV3Interface internal priceFeed;
    address internal priceFeedAddress;

    /**
     * @notice Get latest ETH/USD price from Chainlink
     * @return Latest ETH price in USD (with 8 decimals)
     */
    function getLatestPrice() internal view returns (uint256) {
        (, int256 answer, , , ) = priceFeed.latestRoundData();
        return uint256(answer) * 10000000000; // Scale to 18 decimals
    }

    /**
     * @notice Convert USD amount (cents) to ETH amount
     * @param _usdAmountInCents Amount in USD cents (e.g., 9999 = $99.99)
     * @return Amount in Wei (1 ETH = 10^18 Wei)
     */
    function getConversionRate(uint256 _usdAmountInCents) internal view returns (uint256) {
        uint256 ethPrice = getLatestPrice();
        uint256 ethAmountInWei = (_usdAmountInCents * 1e18) / ethPrice;
        return ethAmountInWei;
    }

    /**
     * @notice Convert ETH to USD cents
     * @param _weiAmount Amount in Wei
     * @return USD amount in cents
     */
    function getEthToUsd(uint256 _weiAmount) internal view returns (uint256) {
        uint256 ethPrice = getLatestPrice();
        uint256 usdAmountInCents = (_weiAmount * ethPrice) / 1e18;
        return usdAmountInCents;
    }
}
