"use client";

import { useState } from "react";
import { Send, Loader2, AlertCircle } from "lucide-react";
import type { TxResult } from "@/app/page";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface Props {
  onSuccess: (result: TxResult) => void;
}

export function PaymentForm({ onSuccess }: Props) {
  const [form, setForm] = useState({
    senderAddress: "",
    amount: "",
    recipient: "",
    auditRef: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stage, setStage] = useState<string | null>(null);

  const stages = [
    "Generating ZK proof…",
    "Submitting commitment to Soroban…",
    "Settling with proof…",
    "Confirmed.",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    for (const s of stages.slice(0, 3)) {
      setStage(s);
      await new Promise((r) => setTimeout(r, 600));
    }

    try {
      const res = await fetch(`${API_URL}/api/payments/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderAddress: form.senderAddress,
          amount: Math.round(parseFloat(form.amount) * 10_000_000).toString(), // XLM → stroops
          recipient: Buffer.from(form.recipient).toString("hex"),
          auditRef: form.auditRef,
        }),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Unknown error");
      }

      const data: TxResult = await res.json();
      setStage("Confirmed.");
      await new Promise((r) => setTimeout(r, 500));
      onSuccess(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
      setStage(null);
    }
  };

  const fields: { name: keyof typeof form; label: string; placeholder: string; type?: string }[] = [
    { name: "senderAddress", label: "Sender Stellar address", placeholder: "G..." },
    { name: "amount", label: "Amount (XLM)", placeholder: "10000.00", type: "number" },
    { name: "recipient", label: "Recipient identifier", placeholder: "Institution BIC or address — hidden in proof" },
    { name: "auditRef", label: "Audit reference", placeholder: "SWIFT ref / internal ID" },
  ];

  return (
    <div className="glass rounded-3xl p-8">
      <div className="mb-8">
        <h2 className="font-display text-2xl font-semibold text-white">New payment</h2>
        <p className="text-slate-400 text-sm mt-1">
          Amount and recipient are committed privately. Only you and the auditor can reveal them.
        </p>
      </div>

      <div className="space-y-5">
        {fields.map((f) => (
          <div key={f.name}>
            <label className="block text-xs font-medium text-slate-400 mb-1.5 font-mono uppercase tracking-wider">
              {f.label}
            </label>
            <input
              name={f.name}
              type={f.type || "text"}
              value={form[f.name]}
              onChange={handleChange}
              placeholder={f.placeholder}
              className="w-full bg-navy-900 border border-slate-750 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/20 transition-all font-mono"
            />
          </div>
        ))}
      </div>

      {error && (
        <div className="mt-4 flex items-start gap-2 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      {stage && (
        <div className="mt-5 flex items-center gap-2 text-cyan-400 text-sm font-mono">
          <Loader2 className="w-4 h-4 animate-spin" />
          {stage}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading || !form.senderAddress || !form.amount || !form.recipient || !form.auditRef}
        className="mt-8 w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-cyan-400 text-navy-950 font-display font-semibold text-sm hover:bg-cyan-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all glow-cyan"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Send className="w-4 h-4" />
        )}
        {loading ? "Processing…" : "Send private payment"}
      </button>
    </div>
  );
}
