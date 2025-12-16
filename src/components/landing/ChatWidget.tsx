import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const quickReplies = [
  "How does AI trading work?",
  "Is my money safe?",
  "What are the fees?",
  "How do I get started?",
];

const botResponses: Record<string, string> = {
  "how does ai trading work?": "Our AI agents analyze market patterns 24/7 using advanced algorithms. When they detect high-confidence opportunities (85%+), they automatically execute trades on your behalf through your connected Phantom wallet.",
  "is my money safe?": "Absolutely! Your funds stay in your own Phantom wallet - we never have custody. Our AI includes automatic stop-losses and risk management. All connections use bank-grade encryption.",
  "what are the fees?": "We offer a free Starter plan with 5 trades/day. Pro ($49/mo) and Elite ($149/mo) plans include unlimited trades and advanced features. No hidden fees!",
  "how do i get started?": "It's easy! 1) Sign up for free, 2) Connect your Phantom wallet, 3) Choose an AI trading strategy, 4) Watch your AI trade automatically. Takes under 60 seconds!",
  "default": "Thanks for your question! For detailed support, please sign up and our team will assist you. You can also email us at support@tradeflow.ai",
};

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! 👋 I'm TradeFlow's AI assistant. How can I help you today?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      text: messageText,
      isBot: false,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const lowerText = messageText.toLowerCase();
      let response = botResponses.default;
      
      for (const [key, value] of Object.entries(botResponses)) {
        if (lowerText.includes(key) || key.includes(lowerText)) {
          response = value;
          break;
        }
      }

      const botMessage: Message = {
        id: Date.now() + 1,
        text: response,
        isBot: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 500);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full shadow-xl transition-all",
          isOpen ? "hidden" : "flex"
        )}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="relative">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/30">
            <MessageCircle className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-[10px] text-white font-bold animate-pulse">
            1
          </span>
        </div>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] rounded-2xl border border-primary/20 bg-background shadow-2xl shadow-background/50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-accent p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                    <Bot className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-foreground">TradeFlow Support</h3>
                    <div className="flex items-center gap-1 text-xs text-primary-foreground/80">
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      Online • Replies instantly
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/20 transition-colors"
                >
                  <X className="h-5 w-5 text-primary-foreground" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-4 bg-secondary/30">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex gap-2",
                    message.isBot ? "justify-start" : "justify-end"
                  )}
                >
                  {message.isBot && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 flex-shrink-0">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-2 text-sm",
                      message.isBot
                        ? "bg-card border border-border/50 text-foreground rounded-tl-md"
                        : "bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-tr-md"
                    )}
                  >
                    {message.text}
                  </div>
                  {!message.isBot && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary flex-shrink-0">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 flex-shrink-0">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-card border border-border/50 rounded-2xl rounded-tl-md px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Quick Replies */}
            <div className="px-4 py-3 border-t border-border/50 bg-background">
              <div className="flex flex-wrap gap-2 mb-3">
                {quickReplies.map((reply) => (
                  <button
                    key={reply}
                    onClick={() => handleSend(reply)}
                    className="text-xs px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {reply}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Type your message..."
                  className="flex-1 bg-secondary border-none"
                />
                <Button
                  size="icon"
                  onClick={() => handleSend()}
                  disabled={!inputValue.trim()}
                  className="bg-gradient-to-r from-primary to-accent text-primary-foreground"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
