"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowRight, 
  Shield, 
  Menu,
  X,
  Cpu,
  Globe,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#fafaf9] text-[#1a1a1a] selection:bg-indigo-100 font-sans overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[100] p-3 md:p-6 pointer-events-none">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 h-20 md:h-32 bg-white/80 backdrop-blur-md border border-black/5 rounded-full flex justify-between items-center shadow-sm pointer-events-auto">
          <div className="flex items-center gap-2">
            <Image 
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/946d8ec1-7f73-4d97-b50d-4d62b78b31a3/ChatGPT-Image-Jan-23-2026-01_10_45-AM-1769161931046.png?width=8000&height=8000&resize=contain"
              alt="Bilge Logo"
              width={400}
              height={120}
              className="h-20 md:h-28 w-auto object-contain"
              priority
            />
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="/methodology" className="text-[13px] font-semibold text-black/50 hover:text-black transition-colors">Platform</Link>
            <Link href="/academic-tools" className="text-[13px] font-semibold text-black/50 hover:text-black transition-colors">Research</Link>
            <Link href="/login" className="text-[13px] font-semibold text-black/50 hover:text-black transition-colors">Login</Link>
            <Link href="/chat" className="bg-black text-white px-5 py-2 rounded-full text-[13px] font-bold hover:bg-black/80 transition-all active:scale-95">
              Launch App
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-1.5 text-black/60 hover:text-black transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[110] bg-white p-5 flex flex-col md:hidden"
          >
            <div className="flex justify-end items-center mb-10">
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-black/60 hover:text-black transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex flex-col gap-5">
              <Link href="/methodology" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-bold tracking-tight">Platform</Link>
              <Link href="/academic-tools" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-bold tracking-tight">Research</Link>
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-bold tracking-tight text-black/40">Login</Link>
              <div className="h-px bg-black/5 my-2" />
              <Link 
                href="/chat" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="bg-black text-white p-4 rounded-xl text-center text-lg font-bold shadow-lg shadow-black/10"
              >
                Launch App
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 md:pt-60 pb-16 md:pb-32 px-5 overflow-hidden">
          {/* Background Ambient Glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] md:w-[1000px] h-[400px] md:h-[600px] bg-gradient-to-b from-indigo-50/50 to-transparent rounded-full blur-[80px] md:blur-[120px] -z-10" />
          
          <div className="max-w-[1000px] mx-auto text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white border border-black/5 mb-6 md:mb-8 shadow-sm"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-[9px] md:text-[11px] font-bold uppercase tracking-wider text-black/40">v2.0 Research Engine</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-[2.2rem] sm:text-[3.5rem] md:text-[6.5rem] font-bold leading-[1] tracking-tighter mb-6 md:mb-10 text-balance"
            >
              The intelligence <br className="hidden sm:block" />
              <span className="text-black/20">layer for</span> research.
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-base md:text-[1.6rem] text-black/60 leading-tight font-medium max-w-2xl mx-auto mb-8 md:mb-14 text-balance"
            >
              A professional-grade workspace for synthesizing complex literature, 
              clarifying theories, and writing with scholarly precision.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 px-2 sm:px-0"
            >
              <Link 
                href="/chat" 
                className="group relative w-full sm:w-auto bg-black text-white px-7 md:px-10 py-3.5 rounded-xl text-base font-bold hover:bg-black/90 transition-all shadow-xl shadow-black/10 active:scale-[0.98] overflow-hidden"
              >
                <div className="relative z-10 flex items-center justify-center gap-2">
                  Start Research <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
              <button className="w-full sm:w-auto bg-white border border-black/5 text-black px-7 md:px-10 py-3.5 rounded-xl text-base font-bold hover:bg-black/5 transition-all active:scale-[0.98] shadow-sm">
                View Methodology
              </button>
            </motion.div>
          </div>
        </section>

        {/* Bento Grid Features */}
        <section className="max-w-[1200px] mx-auto px-5 pb-16 md:pb-40">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
            {/* Main Feature */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="md:col-span-8 bg-white border border-black/5 rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-10 flex flex-col justify-between overflow-hidden relative group"
            >
              <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-50/50 to-transparent -z-10" />
              <div>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-black rounded-xl md:rounded-2xl flex items-center justify-center mb-5 md:mb-8">
                  <Cpu className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <h3 className="text-2xl md:text-4xl font-bold tracking-tight mb-3 md:mb-4">Neural Synthesis</h3>
                <p className="text-base md:text-xl text-black/40 font-medium max-w-md">
                  Process thousands of pages of peer-reviewed literature in seconds. Identify core arguments and methodology gaps with high precision.
                </p>
              </div>
              <div className="mt-6 md:mt-12 flex flex-wrap gap-2 md:gap-4">
                <div className="px-3 py-1.5 bg-black/5 rounded-full text-[9px] md:text-xs font-bold uppercase tracking-widest text-black/40">Semantic Mapping</div>
                <div className="px-3 py-1.5 bg-black/5 rounded-full text-[9px] md:text-xs font-bold uppercase tracking-widest text-black/40">Source Attribution</div>
              </div>
            </motion.div>

            {/* Side Feature 1 */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="md:col-span-4 bg-[#0a0a0a] rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-10 text-white flex flex-col justify-between min-h-[240px] md:min-h-[300px]"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl flex items-center justify-center mb-6 md:mb-8">
                <Globe className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl md:text-3xl font-bold tracking-tight mb-3 md:mb-4">Global Access</h3>
                <p className="text-sm md:text-lg text-white/40 font-medium">
                  Connected to over 200 million academic papers and journals worldwide.
                </p>
              </div>
            </motion.div>

            {/* Side Feature 2 */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="md:col-span-4 bg-white border border-black/5 rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-10 flex flex-col justify-between min-h-[240px] md:min-h-[300px]"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-500 rounded-xl md:rounded-2xl flex items-center justify-center mb-6 md:mb-8">
                <Zap className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl md:text-3xl font-bold tracking-tight mb-3 md:mb-4">Low Latency</h3>
                <p className="text-sm md:text-lg text-black/40 font-medium">
                  Instant clarification of advanced theoretical frameworks.
                </p>
              </div>
            </motion.div>

            {/* Long Bottom Feature */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="md:col-span-8 bg-white border border-black/5 rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12 overflow-hidden"
            >
              <div className="max-w-sm">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-500 rounded-xl md:rounded-2xl flex items-center justify-center mb-5 md:mb-8">
                  <Shield className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <h3 className="text-xl md:text-3xl font-bold tracking-tight mb-3 md:mb-4">Ethical Guardrails</h3>
                <p className="text-sm md:text-lg text-black/40 font-medium">
                  Reinforcing original thought and academic integrity through advanced citation tracking.
                </p>
              </div>
              <div className="flex-1 w-full h-24 md:h-40 bg-black/5 rounded-xl md:rounded-2xl flex items-center justify-center italic text-black/20 font-serif text-[10px] md:text-base px-6 text-center">
                Advanced Citation Engine v2.0.4-stable
              </div>
            </motion.div>
          </div>
        </section>

        {/* Philosophy */}
        <section className="max-w-[900px] mx-auto px-5 text-center pb-24 md:pb-60">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-[1.8rem] sm:text-[3.5rem] md:text-[5rem] font-bold tracking-tighter mb-6 md:mb-12 leading-[1] text-balance">
              Designed for <br />
              <span className="text-black/20">high-output</span> scholars.
            </h2>
            <p className="text-base md:text-2xl text-black/50 leading-tight max-w-xl mx-auto mb-8 md:mb-16 font-medium text-balance">
              We build tools for the academic elite who require depth, precision, and zero-distraction workspaces.
            </p>
            <Link href="/about" className="inline-flex items-center gap-2.5 text-black font-bold border-b-2 border-black pb-0.5 hover:gap-4 transition-all group text-sm md:text-base">
              Our Vision <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-black/10 py-12 md:py-24">
        <div className="max-w-[1200px] mx-auto px-5 md:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-12 mb-12 md:mb-24">
            <div className="sm:col-span-2 space-y-5 md:space-y-8">
              <div className="flex items-center gap-2">
                <Image 
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/946d8ec1-7f73-4d97-b50d-4d62b78b31a3/ChatGPT-Image-Jan-23-2026-01_10_45-AM-1769161931046.png?width=8000&height=8000&resize=contain"
                  alt="Bilge Logo"
                  width={500}
                  height={150}
                  className="h-32 md:h-44 w-auto object-contain -ml-2"
                />
              </div>
              <p className="text-black/40 text-base md:text-xl font-medium leading-tight max-w-xs md:max-w-sm">
                Empowering the next generation of academic discovery through professional AI systems.
              </p>
            </div>
            
            <div className="space-y-6 md:space-y-10">
              <h4 className="text-[9px] md:text-[11px] font-bold uppercase tracking-widest text-black/20">System</h4>
              <ul className="space-y-6 md:space-y-8 text-[13px] md:text-sm font-bold">
                <li><Link href="/chat" className="hover:text-black transition-colors">Launch Engine</Link></li>
                <li><Link href="/docs" className="hover:text-black transition-colors">Documentation</Link></li>
                <li><Link href="/changelog" className="hover:text-black transition-colors">Changelog</Link></li>
              </ul>
            </div>
            
            <div className="space-y-6 md:space-y-10">
              <h4 className="text-[9px] md:text-[11px] font-bold uppercase tracking-widest text-black/20">Organization</h4>
              <ul className="space-y-6 md:space-y-8 text-[13px] md:text-sm font-bold">
                <li><Link href="/ethics" className="hover:text-black transition-colors">Academic Ethics</Link></li>
                <li><Link href="/privacy" className="hover:text-black transition-colors">Privacy</Link></li>
                <li><Link href="/contact" className="hover:text-black transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-10 border-t border-black/10 text-[9px] md:text-[11px] text-black/30 font-bold uppercase tracking-widest">
            <p className="text-center md:text-left">© 2026 Bilge Labs Inc. All rights reserved.</p>
            <div className="flex gap-4 md:gap-8">
              <a href="#" className="hover:text-black">Twitter</a>
              <a href="#" className="hover:text-black">LinkedIn</a>
              <a href="#" className="hover:text-black">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
