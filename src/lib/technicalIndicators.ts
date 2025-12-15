// Technical Indicators Library for AI Trading Analysis

export interface HistoricalPrice {
  date: string;
  price: number;
  volume: number;
  timestamp: number;
}

export interface RSIData {
  date: string;
  value: number;
}

export interface MACDData {
  date: string;
  macd: number;
  signal: number;
  histogram: number;
}

export interface BollingerBands {
  date: string;
  upper: number;
  middle: number;
  lower: number;
  price: number;
}

export interface IndicatorData {
  rsi: RSIData[];
  macd: MACDData[];
  bollinger: BollingerBands[];
}

// Calculate Relative Strength Index (RSI)
export const calculateRSI = (data: HistoricalPrice[], period: number = 14): RSIData[] => {
  if (data.length < period + 1) return [];
  
  const rsiData: RSIData[] = [];
  const gains: number[] = [];
  const losses: number[] = [];

  // Calculate price changes
  for (let i = 1; i < data.length; i++) {
    const change = data[i].price - data[i - 1].price;
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? Math.abs(change) : 0);
  }

  // Calculate initial average gain and loss
  let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
  let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;

  // First RSI value
  const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
  rsiData.push({
    date: data[period].date,
    value: 100 - (100 / (1 + rs)),
  });

  // Calculate subsequent RSI values
  for (let i = period; i < gains.length; i++) {
    avgGain = (avgGain * (period - 1) + gains[i]) / period;
    avgLoss = (avgLoss * (period - 1) + losses[i]) / period;
    
    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    rsiData.push({
      date: data[i + 1].date,
      value: 100 - (100 / (1 + rs)),
    });
  }

  return rsiData;
};

// Calculate Exponential Moving Average
const calculateEMA = (prices: number[], period: number): number[] => {
  const ema: number[] = [];
  const multiplier = 2 / (period + 1);

  // First EMA is SMA
  const sma = prices.slice(0, period).reduce((a, b) => a + b, 0) / period;
  ema.push(sma);

  // Calculate EMA
  for (let i = period; i < prices.length; i++) {
    const value = (prices[i] - ema[ema.length - 1]) * multiplier + ema[ema.length - 1];
    ema.push(value);
  }

  return ema;
};

// Calculate MACD (Moving Average Convergence Divergence)
export const calculateMACD = (
  data: HistoricalPrice[],
  fastPeriod: number = 12,
  slowPeriod: number = 26,
  signalPeriod: number = 9
): MACDData[] => {
  if (data.length < slowPeriod + signalPeriod) return [];
  
  const prices = data.map(d => d.price);
  const fastEMA = calculateEMA(prices, fastPeriod);
  const slowEMA = calculateEMA(prices, slowPeriod);

  // MACD line = Fast EMA - Slow EMA
  const macdLine: number[] = [];
  const startIndex = slowPeriod - fastPeriod;
  
  for (let i = 0; i < slowEMA.length; i++) {
    macdLine.push(fastEMA[i + startIndex] - slowEMA[i]);
  }

  // Signal line = EMA of MACD line
  const signalLine = calculateEMA(macdLine, signalPeriod);

  const macdData: MACDData[] = [];
  const dataStartIndex = slowPeriod + signalPeriod - 1;

  for (let i = 0; i < signalLine.length; i++) {
    const macdIndex = i + signalPeriod - 1;
    macdData.push({
      date: data[dataStartIndex + i]?.date || '',
      macd: macdLine[macdIndex],
      signal: signalLine[i],
      histogram: macdLine[macdIndex] - signalLine[i],
    });
  }

  return macdData;
};

// Calculate Bollinger Bands
export const calculateBollingerBands = (
  data: HistoricalPrice[],
  period: number = 20,
  stdDev: number = 2
): BollingerBands[] => {
  if (data.length < period) return [];
  
  const bollingerData: BollingerBands[] = [];

  for (let i = period - 1; i < data.length; i++) {
    const slice = data.slice(i - period + 1, i + 1);
    const prices = slice.map(d => d.price);
    
    // Calculate SMA (middle band)
    const sma = prices.reduce((a, b) => a + b, 0) / period;
    
    // Calculate standard deviation
    const squaredDiffs = prices.map(p => Math.pow(p - sma, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / period;
    const std = Math.sqrt(variance);
    
    bollingerData.push({
      date: data[i].date,
      upper: sma + (stdDev * std),
      middle: sma,
      lower: sma - (stdDev * std),
      price: data[i].price,
    });
  }

  return bollingerData;
};

// Get trading signals from indicators
export interface TradingSignal {
  indicator: string;
  signal: 'buy' | 'sell' | 'neutral';
  strength: number;
  reason: string;
}

export const getIndicatorSignals = (indicators: IndicatorData): TradingSignal[] => {
  const signals: TradingSignal[] = [];

  // RSI signals
  if (indicators.rsi.length > 0) {
    const latestRSI = indicators.rsi[indicators.rsi.length - 1].value;
    if (latestRSI < 30) {
      signals.push({
        indicator: 'RSI',
        signal: 'buy',
        strength: Math.min(100, (30 - latestRSI) * 3),
        reason: `RSI at ${latestRSI.toFixed(1)} - Oversold conditions`,
      });
    } else if (latestRSI > 70) {
      signals.push({
        indicator: 'RSI',
        signal: 'sell',
        strength: Math.min(100, (latestRSI - 70) * 3),
        reason: `RSI at ${latestRSI.toFixed(1)} - Overbought conditions`,
      });
    } else {
      signals.push({
        indicator: 'RSI',
        signal: 'neutral',
        strength: 0,
        reason: `RSI at ${latestRSI.toFixed(1)} - Neutral zone`,
      });
    }
  }

  // MACD signals
  if (indicators.macd.length > 1) {
    const latest = indicators.macd[indicators.macd.length - 1];
    const previous = indicators.macd[indicators.macd.length - 2];
    
    if (latest.histogram > 0 && previous.histogram <= 0) {
      signals.push({
        indicator: 'MACD',
        signal: 'buy',
        strength: Math.min(100, Math.abs(latest.histogram) * 100),
        reason: 'MACD crossover - Bullish signal',
      });
    } else if (latest.histogram < 0 && previous.histogram >= 0) {
      signals.push({
        indicator: 'MACD',
        signal: 'sell',
        strength: Math.min(100, Math.abs(latest.histogram) * 100),
        reason: 'MACD crossover - Bearish signal',
      });
    } else {
      signals.push({
        indicator: 'MACD',
        signal: latest.histogram > 0 ? 'buy' : 'sell',
        strength: Math.min(50, Math.abs(latest.histogram) * 50),
        reason: `MACD ${latest.histogram > 0 ? 'bullish' : 'bearish'} momentum`,
      });
    }
  }

  // Bollinger Bands signals
  if (indicators.bollinger.length > 0) {
    const latest = indicators.bollinger[indicators.bollinger.length - 1];
    const bandWidth = latest.upper - latest.lower;
    const position = (latest.price - latest.lower) / bandWidth;
    
    if (position < 0.1) {
      signals.push({
        indicator: 'Bollinger',
        signal: 'buy',
        strength: Math.min(100, (0.1 - position) * 500),
        reason: 'Price near lower band - Potential reversal',
      });
    } else if (position > 0.9) {
      signals.push({
        indicator: 'Bollinger',
        signal: 'sell',
        strength: Math.min(100, (position - 0.9) * 500),
        reason: 'Price near upper band - Potential reversal',
      });
    } else {
      signals.push({
        indicator: 'Bollinger',
        signal: 'neutral',
        strength: 0,
        reason: 'Price within normal band range',
      });
    }
  }

  return signals;
};

// Calculate all indicators at once
export const calculateAllIndicators = (data: HistoricalPrice[]): IndicatorData => {
  return {
    rsi: calculateRSI(data),
    macd: calculateMACD(data),
    bollinger: calculateBollingerBands(data),
  };
};
