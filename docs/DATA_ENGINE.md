# DATA ENGINE

## Purpose

Define the data required for MVP decision support.

## First Data Source

Tushare Pro.

## MVP Data Categories

### Market Data

- A-share daily OHLCV
- Index daily OHLCV
- ETF daily OHLCV
- Trading calendar

### Basic Asset Data

- Stock basic information
- Listing date
- Market type
- Industry classification

### Valuation / Daily Basic

- PE
- PB
- turnover rate
- total market cap
- circulating market cap

### Future Data

- announcements
- financial indicators
- fund flow
- news events
- macro indicators

## Data Freshness

MVP assumes end-of-day analysis, not intraday real-time trading.

## Non-goals

- Tick data
- Level-2 data
- Brokerage execution
- Real-time alerts

## Derived Signals

Initial signals:

- 20/60/120-day moving average trend
- 20-day return
- 60-day return
- volatility
- volume change
- drawdown
- market breadth if data available
