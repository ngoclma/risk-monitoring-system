export const mockPositions = [
    {
      id: 1,
      symbol: 'AAPL',
      quantity: 100,
      cost_basis: 150.00,
      current_price: 175.00,
      market_value: 17500.00
    },
    {
      id: 2,
      symbol: 'GOOGL',
      quantity: 50,
      cost_basis: 2800.00,
      current_price: 2900.00,
      market_value: 145000.00
    }
  ];
  
  export const mockMarginStatus = {
    portfolio_market_value: 162500.00,
    loan_amount: 50000.00,
    net_equity: 112500.00,
    margin_requirement: 81250.00,
    margin_call_triggered: false,
    margin_shortfall: 0,
    margin_health: 1.38,
    positions: [
        {
            symbol: 'AAPL',
            quantity: 100,
            current_price: 175.00,
            position_value: 17500.00
        },
        {
            symbol: 'GOOGL',
            quantity: 50,
            current_price: 2900.00,
            position_value: 145000.00
        }
    ]
  };