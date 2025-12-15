-- DCA Strategies table
CREATE TABLE public.dca_strategies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  token_symbol TEXT NOT NULL,
  amount_per_interval NUMERIC NOT NULL,
  interval_type TEXT NOT NULL CHECK (interval_type IN ('hourly', 'daily', 'weekly', 'monthly')),
  is_active BOOLEAN DEFAULT true,
  total_invested NUMERIC DEFAULT 0,
  total_tokens_bought NUMERIC DEFAULT 0,
  last_execution TIMESTAMP WITH TIME ZONE,
  next_execution TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Top Traders table (for copy trading)
CREATE TABLE public.top_traders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  total_pnl NUMERIC DEFAULT 0,
  win_rate NUMERIC DEFAULT 0,
  total_trades INTEGER DEFAULT 0,
  followers_count INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT false,
  strategy_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Copy Trading relationships
CREATE TABLE public.copy_trading (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_user_id UUID NOT NULL,
  trader_id UUID NOT NULL REFERENCES public.top_traders(id) ON DELETE CASCADE,
  allocation_percentage NUMERIC DEFAULT 10 CHECK (allocation_percentage >= 1 AND allocation_percentage <= 100),
  max_trade_size NUMERIC DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  total_copied_trades INTEGER DEFAULT 0,
  total_pnl NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(follower_user_id, trader_id)
);

-- Trade Journal entries
CREATE TABLE public.trade_journal (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  trade_id UUID REFERENCES public.trades(id),
  title TEXT NOT NULL,
  notes TEXT,
  strategy_tags TEXT[] DEFAULT '{}',
  screenshot_urls TEXT[] DEFAULT '{}',
  entry_price NUMERIC,
  exit_price NUMERIC,
  pnl NUMERIC,
  emotion TEXT CHECK (emotion IN ('confident', 'fearful', 'greedy', 'neutral', 'fomo')),
  market_condition TEXT CHECK (market_condition IN ('bullish', 'bearish', 'sideways', 'volatile')),
  lessons_learned TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.dca_strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.top_traders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.copy_trading ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trade_journal ENABLE ROW LEVEL SECURITY;

-- DCA Strategies policies
CREATE POLICY "Users can view their own DCA strategies" ON public.dca_strategies
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own DCA strategies" ON public.dca_strategies
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own DCA strategies" ON public.dca_strategies
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own DCA strategies" ON public.dca_strategies
  FOR DELETE USING (auth.uid() = user_id);

-- Top Traders policies (public profiles viewable by all authenticated users)
CREATE POLICY "Anyone can view public traders" ON public.top_traders
  FOR SELECT USING (is_public = true OR auth.uid() = user_id);
CREATE POLICY "Users can create their own trader profile" ON public.top_traders
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own trader profile" ON public.top_traders
  FOR UPDATE USING (auth.uid() = user_id);

-- Copy Trading policies
CREATE POLICY "Users can view their copy trading" ON public.copy_trading
  FOR SELECT USING (auth.uid() = follower_user_id);
CREATE POLICY "Users can create copy trading" ON public.copy_trading
  FOR INSERT WITH CHECK (auth.uid() = follower_user_id);
CREATE POLICY "Users can update their copy trading" ON public.copy_trading
  FOR UPDATE USING (auth.uid() = follower_user_id);
CREATE POLICY "Users can delete their copy trading" ON public.copy_trading
  FOR DELETE USING (auth.uid() = follower_user_id);

-- Trade Journal policies
CREATE POLICY "Users can view their own journal" ON public.trade_journal
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create journal entries" ON public.trade_journal
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own journal" ON public.trade_journal
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own journal" ON public.trade_journal
  FOR DELETE USING (auth.uid() = user_id);

-- Create storage bucket for journal screenshots
INSERT INTO storage.buckets (id, name, public) VALUES ('journal-screenshots', 'journal-screenshots', true);

-- Storage policies for journal screenshots
CREATE POLICY "Users can upload their screenshots" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'journal-screenshots' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Anyone can view screenshots" ON storage.objects
  FOR SELECT USING (bucket_id = 'journal-screenshots');
CREATE POLICY "Users can delete their own screenshots" ON storage.objects
  FOR DELETE USING (bucket_id = 'journal-screenshots' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Triggers for updated_at
CREATE TRIGGER update_dca_strategies_updated_at BEFORE UPDATE ON public.dca_strategies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_top_traders_updated_at BEFORE UPDATE ON public.top_traders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_copy_trading_updated_at BEFORE UPDATE ON public.copy_trading
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_trade_journal_updated_at BEFORE UPDATE ON public.trade_journal
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();