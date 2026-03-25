import { useState } from "react";
import { X, Mail, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [focused, setFocused] = useState(false);
  const { signInWithMagicLink } = useAuth();

  if (!isOpen) return null;

  const handleSend = async () => {
    setStatus("loading");
    setErrorMsg("");
    const { error } = await signInWithMagicLink(email);
    if (error) {
      setErrorMsg(error);
      setStatus("error");
    } else {
      setStatus("sent");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(4px)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#0a0a14",
          border: "1px solid #1e1e2e",
          borderRadius: 12,
          padding: "2rem",
          width: "100%",
          maxWidth: 400,
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "none",
            border: "none",
            color: "#606070",
            cursor: "pointer",
          }}
        >
          <X size={18} />
        </button>

        {status !== "sent" ? (
          <>
            <h2
              style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 700,
                fontSize: "1.25rem",
                color: "#f0ede8",
                marginBottom: "0.25rem",
              }}
            >
              Sign in
            </h2>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "0.875rem",
                color: "#909098",
                marginBottom: "1.25rem",
              }}
            >
              Enter your email to receive a magic link.
            </p>

            {/* INPUT */}
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              style={{
                width: "100%",
                height: 44,
                borderRadius: 8,
                fontFamily: "Inter, sans-serif",
                fontSize: "0.875rem",
                background: "#13131f",
                border: `1px solid ${focused ? "#7c3aed" : "#1e1e2e"}`,
                color: "#f0ede8",
                padding: "0 1rem",
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.15s",
              }}
            />
            <style>{`input::placeholder { color: #606070; }`}</style>

            {/* BUTTON */}
            <button
              onClick={handleSend}
              disabled={status === "loading"}
              style={{
                width: "100%",
                height: 44,
                borderRadius: 8,
                marginTop: "0.75rem",
                background: "#7c3aed",
                color: "#f0ede8",
                fontFamily: "Syne, sans-serif",
                fontWeight: 700,
                fontSize: "0.875rem",
                letterSpacing: "0.05em",
                border: "none",
                cursor: status === "loading" ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                opacity: status === "loading" ? 0.7 : 1,
                transition: "opacity 0.15s",
              }}
            >
              {status === "loading" ? (
                <>
                  Sending… <Loader2 size={16} className="animate-spin" />
                </>
              ) : (
                <>
                  Send magic link <ArrowRight size={16} />
                </>
              )}
            </button>

            {/* ERROR */}
            {status === "error" && errorMsg && (
              <div
                style={{
                  color: "#f87171",
                  fontSize: "0.8rem",
                  marginTop: "0.5rem",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {errorMsg}
              </div>
            )}
          </>
        ) : (
          /* SENT STATE */
          <div style={{ textAlign: "center", padding: "1rem 0" }}>
            <Mail size={32} color="#7c3aed" style={{ marginBottom: "0.75rem" }} />
            <h3
              style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 700,
                color: "#f0ede8",
                fontSize: "1.125rem",
                marginBottom: "0.5rem",
              }}
            >
              Check your inbox
            </h3>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                color: "#909098",
                fontSize: "0.875rem",
                lineHeight: 1.5,
              }}
            >
              If you have a Pro account, check your inbox for a sign-in link. It expires in 10 minutes. Magic link sent
              to <strong style={{ color: "#f0ede8" }}>{email}</strong>. Click it to sign in — the link expires in 10
              minutes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
