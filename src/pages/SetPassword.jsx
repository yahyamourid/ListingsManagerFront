import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Lock, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Ban } from "lucide-react";

const SetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { set_password, verify_token } = useAuth();

  const userId = searchParams.get("user");
  const token = searchParams.get("token");

  const [isValidToken, setIsValidToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const is_page_valid = async () => {
      const result = await verify_token(userId);
      setIsValidToken(result.success);
      setLoading(false);
    };

    is_page_valid();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      toast({
        title: "Error",
        description: "Fill all fields"
      });
      return;
    }
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
      });
      return;
    }

    if (password.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters",
      });
      return;
    }

    setSubmitting(true);

    const result = await set_password(userId, token, password);
    if (result.success) {
      toast({
        title: "Success",
        description: "Password set successfully!",
      });
      navigate("/login");
      setSubmitting(false);
    } else {
      toast({
        title: "Error",
        description: result.error
      });
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-muted">
        <Ban size={45} className="mb-3 text-muted-foreground"/>
        <p className="text-lg text-muted-foreground font-semibold">
          You cannot perform this operation. Invalid or expired token.
        </p>
        <Button className="mt-4 px-4" onClick={() => navigate("/login")}>
          Go to login page
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-xl">
        <h1 className="text-2xl font-bold text-foreground mb-6 text-center">
          Set Your Password
        </h1>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-11"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-11"
              />
            </div>
          </div>
          <Button
            className="w-full btn-gradient"
            disabled={submitting}
            onClick={handleSubmit}
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Set Password
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SetPassword;
