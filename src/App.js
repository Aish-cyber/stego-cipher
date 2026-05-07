import React, { useState, useRef, useEffect } from 'react';
import { Shield, Eye, Lock, Download, AlertCircle } from 'lucide-react';
import { 
  encryptText, 
  textToBinary, 
  hideDataInPixels, 
  extractDataFromPixels, 
  decryptText 
} from './stegoUtils';

function App() {

  useEffect(() => {
    console.log("%c STEGO-CIPHER INITIALIZED. SYSTEM SECURE.", "color: #22d3ee; font-weight: bold; font-size: 14px;");
  }, []);
  
  const [image, setImage] = useState(null);
  const [secret, setSecret] = useState("");
  const [pass, setPass] = useState("");
  const [decodePass, setDecodePass] = useState("");
  const [revealedMsg, setRevealedMsg] = useState("");
  const canvasRef = useRef(null);

  const handleImageUpload = (e) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        // Draw image immediately on upload for preview
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
      };
      img.src = event.target.result;
    };
    if(e.target.files[0]) reader.readAsDataURL(e.target.files[0]);
  };

  const processImage = () => {
    if (!image || !secret || !pass) return alert("All fields required for Encryption.");
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const encrypted = encryptText(secret, pass);
    const binary = textToBinary(encrypted);
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    hideDataInPixels(imgData.data, binary);
    ctx.putImageData(imgData, 0, 0);
    alert("Encryption Complete: Data layered into pixels.");
  };

  const revealSecret = () => {
    if (!image) return alert("Please upload an image first.");
    setRevealedMsg(""); 
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    const extracted = extractDataFromPixels(imgData.data);
    
    if (extracted === "ERROR_NO_PAYLOAD") {
      alert("Verification Failed: No hidden data found in this image.");
      return;
    }

    const decrypted = decryptText(extracted, decodePass);
    if (decrypted) {
      setRevealedMsg(decrypted);
    } else {
      alert("Access Denied: Incorrect Master Key.");
    }
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'stego_payload.png';
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-cyan-500 p-6 md:p-10 font-mono selection:bg-cyan-500 selection:text-black">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-10 border-b border-cyan-900 pb-6 flex justify-between items-end">
        <h1 className="text-4xl font-black tracking-tighter flex items-center gap-3 italic">
          <Shield className="text-cyan-400 animate-pulse" size={40} /> 
          STEGO-CIPHER <span className="text-[10px] bg-cyan-900 px-2 py-1 rounded text-cyan-300 not-italic tracking-widest">PRO-V1.1</span>
        </h1>
        <div className="hidden md:block text-[10px] text-cyan-800 text-right uppercase tracking-widest">
          L.S.B Bitwise Protocol<br/>AES-256 GCM Standards
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ENCODER */}
        <div className="lg:col-span-4 bg-slate-900/50 border border-cyan-900 p-6 rounded-2xl shadow-2xl backdrop-blur-sm">
          <h2 className="text-xl font-bold flex items-center gap-2 text-cyan-300 mb-6"><Lock size={18}/> ENCODER</h2>
          <div className="space-y-4">
            <input type="file" onChange={handleImageUpload} className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-cyan-950 file:text-cyan-400 hover:file:bg-cyan-900 cursor-pointer" />
            <textarea placeholder="Input Secret Intel..." className="w-full bg-black border border-cyan-950 p-3 rounded-lg text-sm h-32 focus:border-cyan-500 outline-none transition-all" onChange={(e) => setSecret(e.target.value)} />
            <input type="password" placeholder="Access Password" className="w-full bg-black border border-cyan-950 p-3 rounded-lg text-sm focus:border-cyan-500 outline-none" onChange={(e) => setPass(e.target.value)} />
            <button onClick={processImage} className="w-full bg-cyan-600 hover:bg-cyan-400 text-black font-black py-4 rounded-lg shadow-lg shadow-cyan-900/20 uppercase tracking-widest transition-all">Inject Secret</button>
          </div>
        </div>

        {/* VISUALIZER - CANVAS RESET APPLIED HERE */}
        <div className="lg:col-span-4 flex flex-col items-center">
          <div className="w-full bg-black border-2 border-slate-900 rounded-3xl p-4 flex items-center justify-center h-[450px] shadow-2xl relative">
            <canvas ref={canvasRef} className="max-w-full max-h-full object-contain z-10 rounded shadow-2xl" />
            {!image && (
              <div className="absolute text-center opacity-30">
                <Shield size={60} className="mx-auto mb-4 animate-spin-slow text-slate-800" />
                <p className="text-[10px] tracking-[0.5em] uppercase">Offline</p>
              </div>
            )}
          </div>
          {image && (
            <button onClick={downloadImage} className="mt-4 flex items-center gap-2 text-cyan-800 hover:text-cyan-400 transition-all text-xs uppercase font-bold tracking-widest">
              <Download size={14} /> Download PNG Payload
            </button>
          )}
        </div>

        {/* DECODER */}
        <div className="lg:col-span-4 bg-slate-900/50 border border-emerald-900 p-6 rounded-2xl shadow-2xl backdrop-blur-sm">
          <h2 className="text-xl font-bold flex items-center gap-2 text-emerald-400 mb-6"><Eye size={18}/> DECODER</h2>
          <div className="space-y-4">
            <div className="bg-emerald-950/10 border border-emerald-900/30 p-3 rounded-lg flex items-center gap-2 text-[9px] text-emerald-800 uppercase font-bold tracking-tighter">
              <AlertCircle size={14}/> Signature verification required
            </div>
            <input type="password" placeholder="Master Key" className="w-full bg-black border border-emerald-950 p-3 rounded-lg text-sm focus:border-emerald-500 outline-none" onChange={(e) => setDecodePass(e.target.value)} />
            <button onClick={revealSecret} className="w-full bg-emerald-800 hover:bg-emerald-600 text-white font-black py-4 rounded-lg shadow-lg shadow-emerald-900/20 uppercase tracking-widest transition-all">Run Extraction</button>
            {revealedMsg && (
              <div className="mt-4 p-4 bg-emerald-950/20 border-l-2 border-emerald-500 rounded animate-in fade-in slide-in-from-top-2">
                <p className="text-[10px] text-emerald-700 font-bold mb-2">EXTRACTED INTEL:</p>
                <p className="text-emerald-300 text-sm break-all font-sans">{revealedMsg}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
  
}

export default App;