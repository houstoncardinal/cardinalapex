import { Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Button } from "@/components/ui/button";

export const FloatingAdminButton = () => {
  const { isAdmin, loading } = useAdminAuth();
  const navigate = useNavigate();

  if (loading || !isAdmin) return null;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <Button
        onClick={() => navigate("/admin")}
        className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg glow-primary"
        size="icon"
        title="Admin Dashboard"
      >
        <Shield className="h-6 w-6" />
      </Button>
    </motion.div>
  );
};
