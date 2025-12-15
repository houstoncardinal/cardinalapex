-- Notification webhooks table for Telegram/Discord
CREATE TABLE public.notification_webhooks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  webhook_type TEXT NOT NULL CHECK (webhook_type IN ('telegram', 'discord')),
  webhook_url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  notify_trades BOOLEAN DEFAULT true,
  notify_alerts BOOLEAN DEFAULT true,
  notify_dca BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Backtest results table
CREATE TABLE public.backtest_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  strategy_name TEXT NOT NULL,
  token_symbol TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  initial_capital NUMERIC NOT NULL,
  final_capital NUMERIC NOT NULL,
  total_return NUMERIC NOT NULL,
  win_rate NUMERIC NOT NULL,
  total_trades INTEGER NOT NULL,
  max_drawdown NUMERIC NOT NULL,
  sharpe_ratio NUMERIC,
  parameters JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Social leaderboard view (public rankings)
CREATE TABLE public.leaderboard (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  total_pnl NUMERIC DEFAULT 0,
  win_rate NUMERIC DEFAULT 0,
  total_trades INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  best_trade NUMERIC DEFAULT 0,
  rank_position INTEGER,
  is_public BOOLEAN DEFAULT false,
  badge TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notification_webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.backtest_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;

-- Webhook policies
CREATE POLICY "Users can view their webhooks" ON public.notification_webhooks
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create webhooks" ON public.notification_webhooks
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their webhooks" ON public.notification_webhooks
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their webhooks" ON public.notification_webhooks
  FOR DELETE USING (auth.uid() = user_id);

-- Backtest policies
CREATE POLICY "Users can view their backtests" ON public.backtest_results
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create backtests" ON public.backtest_results
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their backtests" ON public.backtest_results
  FOR DELETE USING (auth.uid() = user_id);

-- Leaderboard policies (public view, user can update own)
CREATE POLICY "Anyone can view public leaderboard" ON public.leaderboard
  FOR SELECT USING (is_public = true OR auth.uid() = user_id);
CREATE POLICY "Users can create their leaderboard entry" ON public.leaderboard
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their leaderboard" ON public.leaderboard
  FOR UPDATE USING (auth.uid() = user_id);

-- Triggers
CREATE TRIGGER update_webhooks_updated_at BEFORE UPDATE ON public.notification_webhooks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_leaderboard_updated_at BEFORE UPDATE ON public.leaderboard
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();