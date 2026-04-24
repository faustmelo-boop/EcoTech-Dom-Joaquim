import React, { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { X, Camera } from 'lucide-react';
import { motion } from 'motion/react';

interface QRScannerProps {
  onScan: (decodedText: string) => void;
  onClose: () => void;
}

export default function QRScanner({ onScan, onClose }: QRScannerProps) {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    scanner.render(
      (decodedText) => {
        scanner.clear();
        onScan(decodedText);
      },
      (error) => {
        // Silent error for scanning frames
      }
    );

    return () => {
      scanner.clear().catch(err => console.error("Failed to clear scanner", err));
    };
  }, [onScan]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-stone-950/90 z-[300] flex flex-col items-center justify-center p-6 backdrop-blur-sm"
    >
      <div className="w-full max-w-md bg-white rounded-[2.5rem] overflow-hidden relative shadow-2xl">
        <header className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 p-2 rounded-xl">
              <Camera className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="font-black text-stone-900 uppercase tracking-tight">Escanear QR Code</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-stone-200 rounded-full transition-all"
          >
            <X className="w-6 h-6 text-stone-400" />
          </button>
        </header>

        <div className="p-6">
          <div id="qr-reader" className="w-full rounded-2xl overflow-hidden border-2 border-dashed border-stone-200" />
          
          <div className="mt-8 text-center space-y-2">
            <p className="text-sm font-bold text-stone-600">Aponte para a tela do computador</p>
            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">O vínculo será automático</p>
          </div>
        </div>

        <div className="bg-emerald-50 p-6 flex items-center gap-4">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <p className="text-xs font-bold text-emerald-700">Câmera ativa e procurando QR Code...</p>
        </div>
      </div>
    </motion.div>
  );
}
