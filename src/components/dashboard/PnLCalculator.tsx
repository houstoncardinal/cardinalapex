import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, Download, TrendingUp, TrendingDown, FileText, Calendar, DollarSign } from 'lucide-react';
import { useState } from 'react';

interface TaxableEvent {
  id: string;
  date: string;
  type: 'buy' | 'sell' | 'swap';
  asset: string;
  amount: number;
  costBasis: number;
  proceeds: number;
  gainLoss: number;
  holdingPeriod: 'short' | 'long';
}

interface TaxSummary {
  totalGains: number;
  totalLosses: number;
  netGainLoss: number;
  shortTermGains: number;
  longTermGains: number;
  estimatedTax: number;
}

export const PnLCalculator = () => {
  const [taxYear, setTaxYear] = useState('2024');
  const [taxMethod, setTaxMethod] = useState('fifo');

  const [events] = useState<TaxableEvent[]>([
    { id: '1', date: '2024-01-15', type: 'buy', asset: 'SOL', amount: 10, costBasis: 980, proceeds: 0, gainLoss: 0, holdingPeriod: 'short' },
    { id: '2', date: '2024-02-20', type: 'sell', asset: 'SOL', amount: 5, costBasis: 490, proceeds: 750, gainLoss: 260, holdingPeriod: 'short' },
    { id: '3', date: '2024-03-10', type: 'swap', asset: 'SOL→BONK', amount: 2, costBasis: 196, proceeds: 285, gainLoss: 89, holdingPeriod: 'short' },
    { id: '4', date: '2024-04-05', type: 'sell', asset: 'BONK', amount: 1000000, costBasis: 150, proceeds: 95, gainLoss: -55, holdingPeriod: 'short' },
    { id: '5', date: '2024-05-12', type: 'sell', asset: 'WIF', amount: 50, costBasis: 125, proceeds: 210, gainLoss: 85, holdingPeriod: 'short' },
  ]);

  const summary: TaxSummary = {
    totalGains: events.filter(e => e.gainLoss > 0).reduce((sum, e) => sum + e.gainLoss, 0),
    totalLosses: Math.abs(events.filter(e => e.gainLoss < 0).reduce((sum, e) => sum + e.gainLoss, 0)),
    netGainLoss: events.reduce((sum, e) => sum + e.gainLoss, 0),
    shortTermGains: events.filter(e => e.holdingPeriod === 'short' && e.gainLoss > 0).reduce((sum, e) => sum + e.gainLoss, 0),
    longTermGains: events.filter(e => e.holdingPeriod === 'long' && e.gainLoss > 0).reduce((sum, e) => sum + e.gainLoss, 0),
    estimatedTax: 0,
  };
  summary.estimatedTax = summary.shortTermGains * 0.24 + summary.longTermGains * 0.15;

  const exportReport = (format: 'csv' | 'pdf') => {
    // In production, this would generate actual files
    const csvContent = [
      'Date,Type,Asset,Amount,Cost Basis,Proceeds,Gain/Loss,Holding Period',
      ...events.map(e => `${e.date},${e.type},${e.asset},${e.amount},${e.costBasis},${e.proceeds},${e.gainLoss},${e.holdingPeriod}`)
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tax-report-${taxYear}.csv`;
    a.click();
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            P&L Calculator & Tax Report
          </CardTitle>
          <div className="flex gap-2">
            <Select value={taxYear} onValueChange={setTaxYear}>
              <SelectTrigger className="w-20 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
            <div className="flex items-center gap-2 text-emerald-400 text-xs mb-1">
              <TrendingUp className="h-3 w-3" />
              Total Gains
            </div>
            <p className="text-xl font-bold text-emerald-400">${summary.totalGains.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
            <div className="flex items-center gap-2 text-red-400 text-xs mb-1">
              <TrendingDown className="h-3 w-3" />
              Total Losses
            </div>
            <p className="text-xl font-bold text-red-400">${summary.totalLosses.toLocaleString()}</p>
          </div>
        </div>

        {/* Net P&L */}
        <div className={`p-4 rounded-lg border ${
          summary.netGainLoss >= 0 
            ? 'bg-emerald-500/10 border-emerald-500/30' 
            : 'bg-red-500/10 border-red-500/30'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Net Gain/Loss</p>
              <p className={`text-2xl font-bold ${summary.netGainLoss >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {summary.netGainLoss >= 0 ? '+' : ''}{summary.netGainLoss.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Est. Tax Liability</p>
              <p className="text-xl font-bold text-foreground">${summary.estimatedTax.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Tax Method */}
        <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border/30">
          <span className="text-sm text-muted-foreground">Cost Basis Method</span>
          <Select value={taxMethod} onValueChange={setTaxMethod}>
            <SelectTrigger className="w-32 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fifo">FIFO</SelectItem>
              <SelectItem value="lifo">LIFO</SelectItem>
              <SelectItem value="hifo">HIFO</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Holding Period Breakdown */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-background/50 rounded-lg border border-border/30">
            <p className="text-xs text-muted-foreground mb-1">Short-Term Gains (&lt;1yr)</p>
            <p className="font-bold text-foreground">${summary.shortTermGains.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground">Taxed as ordinary income</p>
          </div>
          <div className="p-3 bg-background/50 rounded-lg border border-border/30">
            <p className="text-xs text-muted-foreground mb-1">Long-Term Gains (&gt;1yr)</p>
            <p className="font-bold text-foreground">${summary.longTermGains.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground">Preferential tax rate</p>
          </div>
        </div>

        {/* Transaction History */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Taxable Events</p>
          <div className="max-h-[200px] overflow-y-auto space-y-2">
            {events.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-2 bg-background/30 rounded border border-border/20 text-sm">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-xs">
                    {event.type.toUpperCase()}
                  </Badge>
                  <div>
                    <span className="font-medium text-foreground">{event.asset}</span>
                    <span className="text-muted-foreground ml-2">{event.amount}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-mono ${event.gainLoss >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {event.gainLoss >= 0 ? '+' : ''}{event.gainLoss}
                  </p>
                  <p className="text-[10px] text-muted-foreground">{event.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Export Buttons */}
        <div className="flex gap-2">
          <Button size="sm" className="flex-1" onClick={() => exportReport('csv')}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button size="sm" variant="outline" className="flex-1" onClick={() => exportReport('pdf')}>
            <FileText className="h-4 w-4 mr-2" />
            Tax Report PDF
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
