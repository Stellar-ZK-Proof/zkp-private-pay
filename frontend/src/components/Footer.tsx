export function Footer() {
  return (
    <footer className="border-t border-slate-800 py-8 px-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-600">
        <span className="font-mono">zkp-private-pay · Stellar-ZK-Proof org · MIT License</span>
        <div className="flex gap-6">
          <a href="https://stellar.org/developers" target="_blank" rel="noreferrer" className="hover:text-slate-400 transition-colors">Stellar Docs</a>
          <a href="https://github.com/Stellar-ZK-Proof" target="_blank" rel="noreferrer" className="hover:text-slate-400 transition-colors">GitHub</a>
          <a href="https://stellar.org/grants-and-funding" target="_blank" rel="noreferrer" className="hover:text-slate-400 transition-colors">SCF Grants</a>
        </div>
      </div>
    </footer>
  );
}
