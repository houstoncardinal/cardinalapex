import { useState, useEffect, useRef } from 'react';
import { BookOpen, Plus, Image, Tag, Trash2, Edit2, Loader2, ChevronDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface JournalEntry {
  id: string;
  title: string;
  notes: string | null;
  strategy_tags: string[];
  screenshot_urls: string[];
  entry_price: number | null;
  exit_price: number | null;
  pnl: number | null;
  emotion: string | null;
  market_condition: string | null;
  lessons_learned: string | null;
  created_at: string;
}

const EMOTIONS = [
  { value: 'confident', label: '😎 Confident', color: 'text-success' },
  { value: 'fearful', label: '😰 Fearful', color: 'text-warning' },
  { value: 'greedy', label: '🤑 Greedy', color: 'text-destructive' },
  { value: 'neutral', label: '😐 Neutral', color: 'text-muted-foreground' },
  { value: 'fomo', label: '😱 FOMO', color: 'text-destructive' },
];

const MARKET_CONDITIONS = [
  { value: 'bullish', label: '🐂 Bullish' },
  { value: 'bearish', label: '🐻 Bearish' },
  { value: 'sideways', label: '➡️ Sideways' },
  { value: 'volatile', label: '🎢 Volatile' },
];

const STRATEGY_PRESETS = ['Scalp', 'Swing', 'DCA', 'Breakout', 'Reversal', 'News', 'Technical', 'Fundamental'];

export const TradeJournal = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [newEntry, setNewEntry] = useState({
    title: '',
    notes: '',
    strategy_tags: [] as string[],
    entry_price: '',
    exit_price: '',
    emotion: '',
    market_condition: '',
    lessons_learned: '',
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [customTag, setCustomTag] = useState('');

  useEffect(() => {
    if (user) fetchEntries();
  }, [user]);

  const fetchEntries = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('trade_journal')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error) {
      setEntries(data || []);
    }
    setIsLoading(false);
  };

  const uploadScreenshots = async (files: File[]): Promise<string[]> => {
    if (!user) return [];
    const urls: string[] = [];
    
    for (const file of files) {
      const fileName = `${user.id}/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage
        .from('journal-screenshots')
        .upload(fileName, file);
      
      if (!error) {
        const { data: urlData } = supabase.storage
          .from('journal-screenshots')
          .getPublicUrl(fileName);
        urls.push(urlData.publicUrl);
      }
    }
    return urls;
  };

  const createEntry = async () => {
    if (!user || !newEntry.title) {
      toast.error('Please enter a title');
      return;
    }

    setIsCreating(true);
    
    // Upload screenshots first
    const screenshotUrls = await uploadScreenshots(selectedFiles);
    
    const entryPrice = newEntry.entry_price ? parseFloat(newEntry.entry_price) : null;
    const exitPrice = newEntry.exit_price ? parseFloat(newEntry.exit_price) : null;
    const pnl = entryPrice && exitPrice ? exitPrice - entryPrice : null;

    const { error } = await supabase.from('trade_journal').insert({
      user_id: user.id,
      title: newEntry.title,
      notes: newEntry.notes || null,
      strategy_tags: newEntry.strategy_tags,
      screenshot_urls: screenshotUrls,
      entry_price: entryPrice,
      exit_price: exitPrice,
      pnl,
      emotion: newEntry.emotion || null,
      market_condition: newEntry.market_condition || null,
      lessons_learned: newEntry.lessons_learned || null,
    });

    if (error) {
      toast.error('Failed to create journal entry');
    } else {
      toast.success('Journal entry created');
      setShowCreateDialog(false);
      resetForm();
      fetchEntries();
    }
    setIsCreating(false);
  };

  const deleteEntry = async (id: string) => {
    const { error } = await supabase
      .from('trade_journal')
      .delete()
      .eq('id', id);

    if (!error) {
      setEntries(prev => prev.filter(e => e.id !== id));
      toast.success('Entry deleted');
    }
  };

  const resetForm = () => {
    setNewEntry({
      title: '',
      notes: '',
      strategy_tags: [],
      entry_price: '',
      exit_price: '',
      emotion: '',
      market_condition: '',
      lessons_learned: '',
    });
    setSelectedFiles([]);
    setCustomTag('');
  };

  const addTag = (tag: string) => {
    if (!newEntry.strategy_tags.includes(tag)) {
      setNewEntry(prev => ({ ...prev, strategy_tags: [...prev.strategy_tags, tag] }));
    }
  };

  const removeTag = (tag: string) => {
    setNewEntry(prev => ({ 
      ...prev, 
      strategy_tags: prev.strategy_tags.filter(t => t !== tag) 
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const getEmotionDisplay = (emotion: string | null) => {
    return EMOTIONS.find(e => e.value === emotion);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20">
            <BookOpen className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <h3 className="font-semibold">Trade Journal</h3>
            <p className="text-xs text-muted-foreground">{entries.length} entries</p>
          </div>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              New Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>New Journal Entry</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  value={newEntry.title}
                  onChange={(e) => setNewEntry(p => ({ ...p, title: e.target.value }))}
                  placeholder="e.g., BONK breakout trade"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Entry Price</Label>
                  <Input
                    type="number"
                    value={newEntry.entry_price}
                    onChange={(e) => setNewEntry(p => ({ ...p, entry_price: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Exit Price</Label>
                  <Input
                    type="number"
                    value={newEntry.exit_price}
                    onChange={(e) => setNewEntry(p => ({ ...p, exit_price: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Emotion</Label>
                  <Select value={newEntry.emotion} onValueChange={(v) => setNewEntry(p => ({ ...p, emotion: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                    <SelectContent>
                      {EMOTIONS.map(e => (
                        <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Market Condition</Label>
                  <Select value={newEntry.market_condition} onValueChange={(v) => setNewEntry(p => ({ ...p, market_condition: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                    <SelectContent>
                      {MARKET_CONDITIONS.map(c => (
                        <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Strategy Tags</Label>
                <div className="flex flex-wrap gap-1 mb-2">
                  {STRATEGY_PRESETS.map(tag => (
                    <Badge
                      key={tag}
                      variant={newEntry.strategy_tags.includes(tag) ? 'default' : 'outline'}
                      className="cursor-pointer text-xs"
                      onClick={() => newEntry.strategy_tags.includes(tag) ? removeTag(tag) : addTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={customTag}
                    onChange={(e) => setCustomTag(e.target.value)}
                    placeholder="Custom tag..."
                    className="flex-1"
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => { if (customTag) { addTag(customTag); setCustomTag(''); }}}
                  >
                    <Tag className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  value={newEntry.notes}
                  onChange={(e) => setNewEntry(p => ({ ...p, notes: e.target.value }))}
                  placeholder="What was your reasoning? What signals did you see?"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Lessons Learned</Label>
                <Textarea
                  value={newEntry.lessons_learned}
                  onChange={(e) => setNewEntry(p => ({ ...p, lessons_learned: e.target.value }))}
                  placeholder="What did you learn from this trade?"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Screenshots</Label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*"
                  multiple
                  className="hidden"
                />
                <Button 
                  variant="outline" 
                  className="w-full gap-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Image className="h-4 w-4" />
                  Add Screenshots ({selectedFiles.length})
                </Button>
                {selectedFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedFiles.map((file, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {file.name.slice(0, 20)}...
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              
              <Button onClick={createEntry} disabled={isCreating} className="w-full">
                {isCreating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Save Entry
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground text-sm">
          <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No journal entries yet</p>
          <p className="text-xs mt-1">Start documenting your trades</p>
        </div>
      ) : (
        <div className="space-y-2">
          {entries.slice(0, 5).map((entry) => (
            <Collapsible 
              key={entry.id}
              open={expandedEntry === entry.id}
              onOpenChange={(open) => setExpandedEntry(open ? entry.id : null)}
            >
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/50 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="text-lg">
                      {getEmotionDisplay(entry.emotion)?.label.split(' ')[0] || '📝'}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{entry.title}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{format(new Date(entry.created_at), 'MMM d, yyyy')}</span>
                        {entry.pnl !== null && (
                          <>
                            <span>•</span>
                            <span className={entry.pnl >= 0 ? 'text-success' : 'text-destructive'}>
                              {entry.pnl >= 0 ? '+' : ''}{entry.pnl.toFixed(4)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {entry.strategy_tags.slice(0, 2).map(tag => (
                      <Badge key={tag} variant="outline" className="text-[10px]">{tag}</Badge>
                    ))}
                    <ChevronDown className={cn(
                      "h-4 w-4 text-muted-foreground transition-transform",
                      expandedEntry === entry.id && "rotate-180"
                    )} />
                  </div>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="p-3 pt-0 space-y-2">
                  {entry.notes && (
                    <p className="text-sm text-muted-foreground">{entry.notes}</p>
                  )}
                  {entry.lessons_learned && (
                    <div className="bg-secondary/50 rounded-lg p-2">
                      <p className="text-xs font-medium mb-1">Lessons Learned:</p>
                      <p className="text-xs text-muted-foreground">{entry.lessons_learned}</p>
                    </div>
                  )}
                  {entry.screenshot_urls.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {entry.screenshot_urls.map((url, i) => (
                        <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                          <img src={url} alt="Screenshot" className="h-16 w-24 object-cover rounded border" />
                        </a>
                      ))}
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive h-7"
                    onClick={() => deleteEntry(entry.id)}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      )}
    </Card>
  );
};
