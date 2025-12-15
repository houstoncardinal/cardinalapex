import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TradeDetails {
  action: 'BUY' | 'SELL';
  inputToken: string;
  outputToken: string;
  amount: number;
  estimatedOutput?: number;
  priceImpact?: number;
}

interface TradeConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  tradeDetails: TradeDetails;
}

export const TradeConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  tradeDetails,
}: TradeConfirmationModalProps) => {
  const [acknowledged, setAcknowledged] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);

  const handleConfirm = async () => {
    if (!acknowledged) return;
    setIsExecuting(true);
    try {
      await onConfirm();
    } finally {
      setIsExecuting(false);
      setAcknowledged(false);
      onClose();
    }
  };

  const handleClose = () => {
    setAcknowledged(false);
    onClose();
  };

  const isBuy = tradeDetails.action === 'BUY';
  const priceImpactHigh = (tradeDetails.priceImpact || 0) > 2;

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Confirm Trade
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              {/* Trade Summary */}
              <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Action</span>
                  <Badge 
                    variant="secondary"
                    className={cn(
                      "flex items-center gap-1",
                      isBuy ? "text-success" : "text-destructive"
                    )}
                  >
                    {isBuy ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {tradeDetails.action}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">From</span>
                  <span className="font-mono font-medium">
                    {tradeDetails.amount} {tradeDetails.inputToken}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">To</span>
                  <span className="font-mono font-medium">
                    {tradeDetails.estimatedOutput?.toFixed(6) || '~'} {tradeDetails.outputToken}
                  </span>
                </div>
                {tradeDetails.priceImpact !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Price Impact</span>
                    <span className={cn(
                      "font-mono font-medium",
                      priceImpactHigh ? "text-destructive" : "text-muted-foreground"
                    )}>
                      {tradeDetails.priceImpact.toFixed(2)}%
                    </span>
                  </div>
                )}
              </div>

              {/* Warning */}
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3">
                <div className="flex gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                  <div className="text-xs text-destructive">
                    <p className="font-semibold mb-1">Real On-Chain Trade Warning</p>
                    <p>
                      This trade will execute immediately on Solana blockchain using real funds from your connected wallet. 
                      Transactions are irreversible. Meme coins are highly volatile and you may lose your entire investment.
                    </p>
                  </div>
                </div>
              </div>

              {/* Acknowledgment */}
              <div className="flex items-start gap-3 pt-2">
                <Checkbox
                  id="acknowledge"
                  checked={acknowledged}
                  onCheckedChange={(checked) => setAcknowledged(checked === true)}
                />
                <label
                  htmlFor="acknowledge"
                  className="text-xs text-muted-foreground cursor-pointer leading-relaxed"
                >
                  I understand this is a real trade using my funds and accept full responsibility for any losses.
                </label>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isExecuting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={!acknowledged || isExecuting}
            className={cn(
              "gap-2",
              isBuy ? "bg-success hover:bg-success/90" : "bg-destructive hover:bg-destructive/90"
            )}
          >
            {isExecuting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Executing...
              </>
            ) : (
              <>Confirm {tradeDetails.action}</>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
