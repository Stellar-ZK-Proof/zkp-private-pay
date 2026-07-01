"use client";

import { CheckCircle2, Copy, ExternalLink } from "lucide-react";
import { useState } from "react";
import type { TxResult } from "@/app/page";

interface Props {
  result: TxResult | null;
}

function truncate(s: string, n = 12) {
  return s.length > n * 2 ? s.slice(0, n) + "…" + s.slice(-n) : s;
}

export function ProofViewer({ result }: Props) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (val: string, key: string) => {
    navigator.clipboard.writeText(val);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  if (!result) {
    return (
      <div className="glass rounded-3xl p-8 flex flex-col items-center justify-center min-h-80 text-center">
        <div className="w-16 h-16 rounded-2xl border border-slate-750 flex items-center justify-center mb-4">
          <span className="font-mono text-2xl text-slate-700">∅</span>
        </div>
        <p className="text-slate-500 text-sm max-w-xs">
          Submit a payment to see the ZK commitment and settlement receipt here.
        </p>
      </div>
    );
  }

  const rows = [
    { label: "TX ID", value: result.txId },
    { label: "Commitment", value: result.commitment },
    { label: "Status", value: result.status },
  ];

  return (
    <div className="glass rounded-3xl p-8 animate-slide-up">
      <div className="flex items-center gap-2.5 mb-6">
        <CheckCircle2 className="w-5 h-5 text-cyan-400" />
        <h2 className="font-display text-xl font-semibold text-white">Settlement receipt</h2>
      </div>

      <div className="space-y-4">
        {rows.map((row) => (
          <div key={row.label} className="bg-navy-900 rounded-xl p-4">
            <div className="text-xs font-mono text-slate-500 mb-1 uppercase tracking-wider">{row.label}</div>
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-sm text-cyan-400 break-all">
                {row.label === "Status" ? (
                  <span className="px-2 py-0.5 rounded-full bg-cyan-400/10 text-cyan-400 text-xs capitalize">
                    {row.value}
                  </span>
                ) : (
                  truncate(row.value, 14)
                )}
              </span>
              {row.label !== "Status" && (
                <button
                  onClick={() => copy(row.value, row.label)}
                  className="shrink-0 text-slate-600 hover:text-cyan-400 transition-colors"
                  title="Copy"
                >
                  {copied === row.label ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Privacy note */}
      <div className="mt-6 rounded-xl border border-cyan-400/10 bg-cyan-400/5 px-4 py-3 text-xs text-slate-400 leading-relaxed">
        <strong className="text-cyan-400">ZK proof verified on-chain.</strong> The amount and
        recipient are hidden in the commitment hash. Only the audit key holder can reveal them.
        The Stellar network confirmed settlement without seeing sensitive data.
      </div>

      <a
        href={`https://stellar.expert/explorer/testnet/tx/${result.txId}`}
        target="_blank"
        rel="noreferrer"
        className="mt-5 inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-cyan-400 transition-colors"
      >
        <ExternalLink className="w-3 h-3" />
        View on Stellar Expert
      </a>
    </div>
  );
}
