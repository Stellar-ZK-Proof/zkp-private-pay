"use client";

import { Lock, Cpu, CheckCircle2, Eye } from "lucide-react";

const steps = [
  {
    icon: Lock,
    title: "Commit privately",
    body: "Amount, recipient, and a random salt are hashed into a Pedersen commitment. Only the commitment goes on-chain — not the values.",
  },
  {
    icon: Cpu,
    title: "Generate ZK proof",
    body: "A Groth16 proof is computed off-chain, proving the commitment is well-formed and the nullifier is fresh — without revealing the inputs.",
  },
  {
    icon: CheckCircle2,
    title: "Settle on Stellar",
    body: "The Soroban contract verifies the proof against the on-chain verifier key and marks the payment settled. Takes ~5 seconds.",
  },
  {
    icon: Eye,
    title: "Audit on demand",
    body: "The sender can reveal the preimage to any auditor at any time, enabling full compliance without exposing data to the public ledger.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="py-24 px-6 border-t border-slate-800">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-mono text-xs text-cyan-400 uppercase tracking-widest mb-3">How it works</p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-white">
            Private settlement, zero guesswork.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="glass rounded-2xl p-6 flex flex-col gap-4 hover:border-cyan-400/20 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-400/10 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-cyan-400" strokeWidth={1.5} />
                  </div>
                  <span className="font-mono text-xs text-slate-600">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="font-display font-semibold text-white text-base">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
