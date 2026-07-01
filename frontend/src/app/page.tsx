"use client";

import { useState } from "react";
import { Hero } from "@/components/Hero";
import { PaymentForm } from "@/components/PaymentForm";
import { ProofViewer } from "@/components/ProofViewer";
import { HowItWorks } from "@/components/HowItWorks";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export type TxResult = {
  txId: string;
  commitment: string;
  status: string;
};

export default function Home() {
  const [result, setResult] = useState<TxResult | null>(null);

  return (
    <main className="min-h-screen flex flex-col">
      <Nav />
      <Hero />
      <section id="pay" className="flex-1 py-24 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <PaymentForm onSuccess={setResult} />
          <ProofViewer result={result} />
        </div>
      </section>
      <HowItWorks />
      <Footer />
    </main>
  );
}
