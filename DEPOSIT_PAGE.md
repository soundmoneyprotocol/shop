# Deposit Page Documentation

## Overview

Comprehensive deposit/funding page at `/deposit` enabling users to add funds to their SoundMoney account through multiple payment methods.

## Features

### 1. **Three-Tab Interface**

#### Deposit Tab (Primary)
- Amount input with validation
- Payment method selection
- Real-time fee calculation
- Total charge breakdown
- Submit button with loading state

#### Withdraw Tab
- Coming soon indicator
- Bank account verification prompt
- Link to account settings

#### History Tab
- Transaction list with status badges
- Transaction details (amount, method, date)
- Transaction hash with copy/external link buttons
- Status indicators (pending/completed/failed)

### 2. **Payment Methods**

| Method | Icon | Fee | Min | Max |
|--------|------|-----|-----|-----|
| **Credit/Debit Card** | 💳 | 2.9% | $5 | $10,000 |
| **USDC (Polygon)** | 👛 | 0.5% | $10 | $50,000 |
| **ETH (Ethereum)** | ➤ | Free | 0.01 | 100 |

### 3. **Fee Breakdown**
```
Deposit Amount:        $500.00
Transaction Fee (2.9%): $14.50
─────────────────────────────
Total Charge:          $514.50
```

### 4. **Account Sidebar**
- **Account Balance Card** (Dark gradient)
  - Current balance: $2,450.32
  - Available breakdown
  - Pending transactions
  - Total funds

- **Why Deposit Section**
  - Bid on auctions instantly
  - Receive seller payouts
  - Access exclusive drops
  - Earn rewards faster

- **Crypto Wallet Section**
  - USDC address display
  - Copy address button
  - Polygon network info

- **Support Section**
  - FAQ link
  - Support contact info

## Design

### Layout
- **Main Area**: Deposit form with tabs
- **Sidebar**: Account info + helpful guides
- **Responsive**: Stacks on mobile (1 column), side-by-side on desktop (3:1 grid)

### Visual Design
- **Colors**: Black primary, green accents for deposits, red for withdrawals
- **Cards**: White background with subtle shadows
- **Inputs**: Border-based with focus states
- **Buttons**: Black filled (primary), bordered (secondary), green (CTA)

### Animations
- Entry animations: Fade in + slide up
- Button loading state: Spinning loader
- Tab transitions: Smooth opacity

## Integration Points

### Navigation
✅ Desktop dropdown menu: "Deposit Funds"  
✅ Mobile hamburger menu: "Deposit Funds"  
✅ Account page header: Green "Deposit" button  
✅ Footer: "Deposit Funds" link in Explore section  

### Links
```
/deposit              - Main deposit page
/account              - User account dashboard
/checkout             - Shopping cart/payment
/seller/dashboard     - Seller management
```

## Mock Data Structure

### Transactions
```typescript
{
  id: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  method: string;
  status: 'pending' | 'completed' | 'failed';
  date: string;
  txHash?: string;
}
```

### Deposit Methods
```typescript
{
  id: string;
  name: string;
  icon: ReactNode;
  description: string;
  minAmount: number;
  maxAmount: number;
  fee: number;
}
```

## User Flows

### Deposit Flow
```
1. Navigate to /deposit
2. Enter amount ($5-$10,000)
3. Select payment method
4. View fee breakdown
5. Click "Deposit [Amount]"
6. Process payment
7. See success message
8. Transaction appears in history
```

### View Transaction History
```
1. Open /deposit
2. Click "History" tab
3. See all past transactions
4. Copy tx hash or view on explorer
5. Filter by status/method (future)
```

## Technical Details

### Component: `src/app/deposit/page.tsx`

**Key State**
- `depositAmount`: User input amount
- `selectedMethod`: Selected payment method
- `activeTab`: Current tab (deposit/withdraw/history)
- `loading`: API call state
- `success`: Success message
- `error`: Error message

**Key Functions**
- `handleDeposit()`: Process deposit submission
- `handleTransactionCopy()`: Copy tx hash to clipboard
- `validateAmount()`: Check min/max bounds

**Dependencies**
- `next/link`: Navigation
- `framer-motion`: Animations
- `lucide-react`: Icons
- `react-hot-toast`: Notifications (import available)

## Styling

### Classes
- `.card` - Reusable card component (from globals.css)
- `.btn-primary` - Primary button style
- `.btn-outline` - Outline button style
- Tailwind utilities for responsive design

### Color Scheme
- **Primary**: Black (#000000)
- **Success**: Green (#16a34a)
- **Error**: Red (#dc2626)
- **Warning**: Orange (#ea580c)
- **Info**: Blue (#2563eb)
- **Neutral**: Gray (various shades)

## Future Enhancements

### Phase 1 (MVP - Current)
- ✅ Deposit form with 3 methods
- ✅ Transaction history display
- ✅ Fee calculation
- ⏳ Payment processing integration

### Phase 2
- [ ] Real Stripe integration
- [ ] Real crypto wallet connection
- [ ] Withdrawal functionality
- [ ] Bank account verification
- [ ] Transaction filtering/search

### Phase 3
- [ ] Recurring deposits
- [ ] Deposit limits
- [ ] Payment method management
- [ ] Transaction receipts/PDF
- [ ] Multi-currency support

### Phase 4
- [ ] Advanced analytics
- [ ] Preferred payment method
- [ ] Quick deposit shortcuts
- [ ] Deposit promotion bonuses
- [ ] Referral rewards

## Security Considerations

⚠️ **Current State**: Mock data only
- Payment processing not implemented
- No real transactions processed
- No payment gateway connected

🔒 **When Implementing**
- Use Stripe/Privy for payment processing
- Encrypt all sensitive data at rest
- Use HTTPS for all API calls
- Validate all inputs server-side
- Rate limit API endpoints
- Log all transaction attempts
- Implement 3D Secure for cards
- PCI DSS compliance required
- SOC 2 audit recommended

## Testing Checklist

- [ ] Form validation (amount bounds)
- [ ] Fee calculation (all methods)
- [ ] Tab switching (smooth transitions)
- [ ] Responsive design (mobile/tablet/desktop)
- [ ] Loading states (button disabled, spinner shows)
- [ ] Error messages (amount too low/high)
- [ ] Success messages (clear and actionable)
- [ ] Transaction display (history tab)
- [ ] Copy to clipboard (tx hash)
- [ ] External links (explorer links)
- [ ] Navigation integration (all links work)
- [ ] Animations (smooth, not jarring)

## Deployment

### Pre-deployment
- [ ] Connect Stripe API
- [ ] Connect Privy for crypto
- [ ] Setup database for transactions
- [ ] Configure payment webhooks
- [ ] Test all payment methods
- [ ] Load test concurrent deposits
- [ ] Security audit
- [ ] Error monitoring setup

### Post-deployment
- [ ] Monitor error logs
- [ ] Check transaction success rate
- [ ] Verify fee calculations
- [ ] Monitor support tickets
- [ ] Analyze user behavior
- [ ] Gather feedback
- [ ] Plan Phase 2 features

## Support

For questions or issues:
1. Check this documentation
2. Review component code: `src/app/deposit/page.tsx`
3. Check navigation integration: `src/components/Navigation.tsx`
4. Check account page: `src/app/account/page.tsx`
5. Review globals.css for styling

## Status

✅ **Frontend**: Complete  
⏳ **Backend Integration**: Pending payment gateway setup  
⏳ **Real Transactions**: Pending Stripe/Privy connection  
⏳ **Withdrawal**: Coming in Phase 2  

---

**Created**: 2026-04-05  
**Last Updated**: 2026-04-05  
**Owner**: Casmir Patterson
