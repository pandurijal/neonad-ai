/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Sparkles, Bell, UserCircle, PlusCircle, ArrowRight, Image as ImageIcon, SlidersHorizontal, Smartphone, Loader2, KeyRound } from 'lucide-react';

// Declare aistudio on window
declare global {
  interface Window {
    aistudio?: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    try {
      if (window.aistudio && !(await window.aistudio.hasSelectedApiKey())) {
        await window.aistudio.openSelectKey();
        // Assuming success after opening dialog
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image-preview',
        contents: {
          parts: [{ text: prompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: "16:9",
            imageSize: "1K"
          }
        }
      });

      let foundImage = false;
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          setImageUrl(`data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`);
          foundImage = true;
          break;
        } else if (part.text) {
          console.log("Model message:", part.text);
        }
      }
      if (!foundImage) {
        setError('No image was generated. Please adjust your prompt and try again.');
      }
    } catch (err: any) {
      console.error(err);
      if (err.message && err.message.includes('API key not valid')) {
        setError("API Key invalid. Please refresh the page and select a valid Paid API Key.");
      } else {
        setError(err.message || 'An error occurred while generating the image.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-body antialiased min-h-screen flex flex-col selection:bg-primary selection:text-[#1a0010]">
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[#0a0a12]/80 backdrop-blur-md border-b border-primary/30 shadow-[0_0_15px_rgba(255,45,120,0.1)]">
        <div className="flex justify-between items-center px-6 py-4 w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <Sparkles className="text-primary w-8 h-8" fill="currentColor" />
            <span className="text-2xl font-black text-primary drop-shadow-[0_0_8px_rgba(255,45,120,0.8)] font-headline tracking-tight">NeonAd AI</span>
          </div>
          <nav className="hidden md:flex gap-8">
            <a className="font-label text-slate-400 hover:text-secondary hover:drop-shadow-[0_0_5px_rgba(0,255,204,0.5)] transition-colors text-sm uppercase tracking-widest" href="#">Features</a>
            <a className="font-label text-slate-400 hover:text-secondary hover:drop-shadow-[0_0_5px_rgba(0,255,204,0.5)] transition-colors text-sm uppercase tracking-widest" href="#">Pricing</a>
          </nav>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex gap-4">
              <button className="text-slate-400 hover:text-primary hover:drop-shadow-[0_0_5px_rgba(255,45,120,0.5)] transition-colors active:scale-95 duration-150 p-2">
                <Bell />
              </button>
              <button className="text-slate-400 hover:text-primary hover:drop-shadow-[0_0_5px_rgba(255,45,120,0.5)] transition-colors active:scale-95 duration-150 p-2">
                <UserCircle />
              </button>
            </div>
            <button className="font-label bg-[#0a0a12] border border-primary text-primary px-6 py-2 rounded font-bold text-xs uppercase tracking-widest neon-button flex items-center gap-2">
              <PlusCircle className="w-4 h-4" />
              Generate New
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-24 pb-20">
        <section className="relative min-h-[819px] flex items-center justify-center overflow-hidden px-6">
          {/* Background Glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none"></div>
          
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-secondary/30 bg-surface-variant/50 backdrop-blur-sm mb-8 text-secondary font-label text-xs tracking-widest uppercase shadow-[inset_0_0_10px_rgba(0,255,204,0.1)]">
              <span className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_rgba(0,255,204,0.8)] animate-pulse"></span>
              MSME Power: AI Ad Engine
            </div>
            <h1 className="font-headline text-5xl md:text-7xl font-extrabold text-on-surface tracking-tight leading-tight mb-6">
              Ads that <span className="text-primary neon-text-primary">Electrify</span><br/>
              Your Local Business.
            </h1>
            <p className="font-body text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto mb-10 leading-relaxed">
              Stop wrestling with design tools. Generate agency-quality, cyberpunk-styled promotional graphics in seconds. Ready for social, print, and the neon-lit streets.
            </p>

            <div className="w-full max-w-2xl mx-auto mb-10 text-left">
               <div className="relative group">
                 <textarea
                   value={prompt}
                   onChange={(e) => setPrompt(e.target.value)}
                   placeholder="e.g. Cyberpunk noodle shop promo with bright neon pink and cyan signs..."
                   className="w-full bg-[#1e1e30]/80 border border-primary/30 rounded-xl p-4 text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-body resize-none shadow-[inset_0_0_15px_rgba(0,0,0,0.5)] z-20 relative"
                   rows={3}
                   disabled={loading}
                 />
                 <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-secondary/30 to-primary/30 rounded-xl blur opacity-25 group-focus-within:opacity-50 transition duration-500 z-10 pointer-events-none"></div>
               </div>
               {error && <p className="text-red-400 text-sm mt-3 font-label px-2 text-center">{error}</p>}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button 
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
                className="w-full sm:w-auto font-label bg-surface border border-primary text-primary px-8 py-4 rounded font-bold text-sm uppercase tracking-widest neon-button flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed z-20 relative">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" fill="currentColor" />}
                {loading ? 'Generating...' : 'Start Generating'}
              </button>
              <button className="w-full sm:w-auto font-label text-on-surface hover:text-secondary px-8 py-4 rounded font-medium text-sm uppercase tracking-widest transition-colors flex items-center justify-center gap-2 group z-20 relative">
                See Gallery
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            {/* Generated Image Result */}
            {imageUrl && (
              <div className="mt-16 w-full max-w-3xl mx-auto relative z-20 animate-in fade-in zoom-in duration-500">
                 <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-xl blur opacity-30"></div>
                 <div className="relative rounded-xl overflow-hidden border border-primary/40 shadow-[0_0_30px_rgba(255,45,120,0.3)] bg-surface-variant flex items-center justify-center p-2">
                    <img src={imageUrl} alt="Generated Ad" className="w-full h-auto rounded-lg" />
                 </div>
              </div>
            )}
          </div>
        </section>

        {/* Features Bento Grid */}
        <section className="max-w-7xl mx-auto px-6 py-24 relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-on-surface mb-4">High-Voltage Output. Zero Friction.</h2>
            <p className="font-body text-on-surface-variant max-w-xl mx-auto">Built for the bold MSME. Our AI engine turns your basic prompts into scroll-stopping visuals.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
             {/* Card 1: Large Span */}
            <div className="neon-card rounded-xl p-8 col-span-1 md:col-span-2 flex flex-col justify-between group overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                    <div className="w-12 h-12 rounded-lg bg-surface flex items-center justify-center border border-primary/40 mb-6 shadow-[0_0_15px_rgba(255,45,120,0.2)]">
                        <ImageIcon className="text-primary w-6 h-6" />
                    </div>
                    <h3 className="font-headline text-2xl font-bold text-on-surface mb-3 group-hover:text-primary transition-colors">AI Image Generation</h3>
                    <p className="font-body text-on-surface-variant max-w-md">Type what you need. "Cyberpunk noodle shop promo." Boom. High-res, gritty, neon-soaked visuals ready in seconds.</p>
                </div>
                <div className="relative z-10 w-full h-32 mt-6 rounded bg-surface-container border border-outline-variant overflow-hidden">
                     <div className="absolute inset-0 bg-cover bg-center opacity-50 transition-opacity group-hover:opacity-75" style={{backgroundImage: `url('${imageUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuCRkvcdQgGrfuuyzdaeRlsaOily523fxEZqckwnvCGb5N72C5jbjKmptxjEPyER0PL8GN6SVF9KmvfcwaiqkwH2-cAWQX77OSinR2YKNSQIhD4BWkSP55Ob5-yDmC_JxetN3i18nNfWTCVvmc6oZWg1a0V4yvZXZmk0kgu8l-17ZA-KG4zPCSQVXQrjcsqkDqkCv9o10ae6icSdCjcmjFq8ve-3C7ySCf1D-hDKW1a46oJ6rIpLWRaJlcw_BdLe0OkyUScoVDJGAPk"}')`}}></div>
                </div>
            </div>

            {/* Card 2: Tall */}
             <div className="neon-card rounded-xl p-8 col-span-1 md:row-span-2 flex flex-col relative group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 flex-grow flex flex-col">
                    <div className="w-12 h-12 rounded-lg bg-surface flex items-center justify-center border border-secondary/40 mb-6 shadow-[0_0_15px_rgba(0,255,204,0.2)]">
                        <SlidersHorizontal className="text-secondary w-6 h-6" />
                    </div>
                    <h3 className="font-headline text-2xl font-bold text-on-surface mb-3 group-hover:text-secondary transition-colors">Easy Customization</h3>
                    <p className="font-body text-on-surface-variant mb-6">Tweak colors, swap fonts, add your logo. The terminal-style editor makes it feel like you're hacking the mainframe.</p>
                    <div className="mt-auto space-y-4">
                        <div className="h-10 rounded border border-outline-variant bg-surface-container-low flex items-center px-4">
                            <span className="w-3 h-3 rounded-full bg-primary mr-3 shadow-[0_0_5px_rgba(255,45,120,0.5)]"></span>
                            <span className="font-label text-xs text-on-surface-variant">Primary Accent</span>
                        </div>
                        <div className="h-10 rounded border border-outline-variant bg-surface-container-low flex items-center px-4">
                            <span className="w-3 h-3 rounded-full bg-secondary mr-3 shadow-[0_0_5px_rgba(0,255,204,0.5)]"></span>
                            <span className="font-label text-xs text-on-surface-variant">Secondary Accent</span>
                        </div>
                        <div className="h-10 rounded border border-outline-variant bg-surface-container-low flex items-center px-4">
                            <span className="w-3 h-3 rounded-full bg-tertiary mr-3 shadow-[0_0_5px_rgba(255,224,74,0.5)]"></span>
                            <span className="font-label text-xs text-on-surface-variant">Tertiary Alert</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Card 3: Small */}
            <div className="neon-card rounded-xl p-8 col-span-1 md:col-span-2 flex flex-col justify-center relative group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-tertiary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 flex items-start gap-6">
                    <div className="w-16 h-16 rounded-lg bg-surface flex-shrink-0 flex items-center justify-center border border-tertiary/40 shadow-[0_0_15px_rgba(255,224,74,0.2)]">
                        <Smartphone className="text-tertiary w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="font-headline text-2xl font-bold text-on-surface mb-2 group-hover:text-tertiary transition-colors">Marketplace Ready</h3>
                        <p className="font-body text-on-surface-variant">One click exports perfectly sized for Instagram, Facebook, TikTok, and local digital billboards. Stop cropping. Start posting.</p>
                    </div>
                </div>
            </div>

          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-background w-full py-8 mt-auto border-t border-primary/20 flex flex-col items-center justify-center gap-4 px-8 relative z-20">
        <div className="text-primary font-bold font-headline text-xl mb-2 drop-shadow-[0_0_8px_rgba(255,45,120,0.5)]">NeonAd AI</div>
        <div className="flex gap-6 mb-2">
            <a className="font-label text-[10px] uppercase text-slate-600 hover:text-secondary transition-colors duration-200" href="#">Privacy Policy</a>
            <a className="font-label text-[10px] uppercase text-slate-600 hover:text-secondary transition-colors duration-200" href="#">Terms of Service</a>
            <a className="font-label text-[10px] uppercase text-slate-600 hover:text-secondary transition-colors duration-200" href="#">Support</a>
        </div>
        <div className="font-label text-[10px] uppercase text-tertiary">
            © 2024 NEON TOKYO AD AI. FOR THE BOLD.
        </div>
      </footer>
    </div>
  );
}
