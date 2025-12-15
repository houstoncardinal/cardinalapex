import { useState } from 'react';
import { AlertTriangle, X, ExternalLink, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface RiskDisclaimerProps {
  variant?: 'banner' | 'card' | 'inline';
  dismissible?: boolean;
  className?: string;
}

export const RiskDisclaimer = ({ 
  variant = 'banner', 
  dismissible = true,
  className 
}: RiskDisclaimerProps) => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  if (variant === 'banner') {
    return (
      <div className={cn(
        "bg-warning/10 border-b border-warning/30 px-4 py-2",
        className
      )}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-warning">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <p className="text-xs font-medium">
              <span className="font-bold">RISK WARNING:</span> Trading involves substantial risk. 
              Only trade with funds you can afford to lose. Past performance does not guarantee future results.
            </p>
          </div>
          {dismissible && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-warning hover:text-warning/80"
              onClick={() => setIsDismissed(true)}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={cn(
        "glass rounded-2xl p-4 border border-warning/30 bg-warning/5",
        className
      )}>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/20 shrink-0">
            <ShieldAlert className="h-5 w-5 text-warning" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-warning mb-1">Trading Risk Disclosure</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Cryptocurrency trading carries high risk of financial loss</li>
              <li>• Meme coins are extremely volatile and speculative</li>
              <li>• AI trading signals are not financial advice</li>
              <li>• Never invest more than you can afford to lose</li>
              <li>• Do your own research (DYOR) before trading</li>
            </ul>
            <div className="mt-3 flex items-center gap-2">
              <a
                href="https://www.sec.gov/investor/pubs/investorpubsrisks.htm"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                Learn about trading risks
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
          {dismissible && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
              onClick={() => setIsDismissed(true)}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Inline variant
  return (
    <div className={cn(
      "flex items-center gap-2 text-xs text-muted-foreground bg-secondary/50 rounded-lg px-3 py-2",
      className
    )}>
      <AlertTriangle className="h-3 w-3 text-warning shrink-0" />
      <span>Trading involves risk. Only trade what you can afford to lose.</span>
    </div>
  );
};

export const TradingWarningFooter = () => (
  <div className="text-center text-[10px] text-muted-foreground/60 py-2 border-t border-border mt-4">
    <p>
      Trading cryptocurrencies involves significant risk and may not be suitable for all investors. 
      Past performance is not indicative of future results. Not financial advice.
    </p>
  </div>
);
