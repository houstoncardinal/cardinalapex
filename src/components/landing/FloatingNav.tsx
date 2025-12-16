import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "Compare", href: "#comparison" },
  { label: "FAQ", href: "#faq" },
];

export const FloatingNav = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);

      // Determine active section
      const sections = navLinks.map(link => link.href.slice(1));
      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Floating Navigation Bar */}
          <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 hidden md:flex"
          >
            <div className="glass rounded-full px-2 py-2 border border-primary/20 shadow-xl shadow-background/50 backdrop-blur-xl">
              <div className="flex items-center gap-1">
                <button
                  onClick={scrollToTop}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent mr-2"
                >
                  <BarChart3 className="h-5 w-5 text-primary-foreground" />
                </button>
                
                {navLinks.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => scrollToSection(link.href)}
                    className={cn(
                      "px-4 py-2 text-sm font-medium rounded-full transition-all",
                      activeSection === link.href.slice(1)
                        ? "bg-primary/20 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    )}
                  >
                    {link.label}
                  </button>
                ))}
                
                <Button
                  size="sm"
                  onClick={() => navigate("/auth?mode=signup")}
                  className="ml-2 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-full px-5"
                >
                  Start Trading
                </Button>
              </div>
            </div>
          </motion.nav>

          {/* Mobile Floating Button */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-20 right-4 z-50 md:hidden"
          >
            <button
              onClick={scrollToTop}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent shadow-xl shadow-primary/30"
            >
              <ChevronUp className="h-6 w-6 text-primary-foreground" />
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
