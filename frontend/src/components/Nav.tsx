"use client";
import { Shield } from "lucide-react";

export function Nav() {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 glass border-b border-cyan-400/10">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Shield className="w-5 h-5 text-cyan-400" strokeWidth={1.5} />
          <span className="font-display font-semibold tracking-tight text-white">
            ZKP<span className="text-cyan-400">PrivatePay</span>
          </span>
        </div>
        <div className="flex items-center gap-6 text-sm text-slate-400">
          <a href="#pay" className="hover:text-cyan-400 transition-colors">Send</a>
          <a href="#how" className="hover:text-cyan-400 transition-colors">How it works</a>
          <a
            href="https://github.com/Stellar-ZK-Proof/zkp-private-pay"
            target="_blank"
            rel="noreferrer"
            className="hover:text-cyan-400 transition-colors"
          >
            GitHub
          </a>
          <a
            href="#pay"
            className="px-4 py-1.5 rounded-full border border-cyan-400/40 text-cyan-400 hover:bg-cyan-400/10 transition-all text-xs font-medium"
          >
            Launch App
          </a>
        </div>
      </div>
    </nav>
  );
}
