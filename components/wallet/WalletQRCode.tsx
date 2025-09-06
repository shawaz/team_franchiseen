"use client";

import React, { useEffect, useRef } from 'react';
import { QrCode } from 'lucide-react';

interface WalletQRCodeProps {
  url: string;
  size?: number;
  className?: string;
}

const WalletQRCode: React.FC<WalletQRCodeProps> = ({ 
  url, 
  size = 200, 
  className = "" 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Simple QR code generation using a library or service
    // For now, we'll use a QR code service
    generateQRCode();
  }, [url, size]);

  const generateQRCode = async () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = size;
    canvas.height = size;

    try {
      // Use QR Server API for generating QR codes
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}`;
      
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        ctx.clearRect(0, 0, size, size);
        ctx.drawImage(img, 0, 0, size, size);
      };
      
      img.onerror = () => {
        // Fallback: draw a placeholder
        drawPlaceholder(ctx);
      };
      
      img.src = qrUrl;
    } catch (error) {
      console.error('Failed to generate QR code:', error);
      drawPlaceholder(ctx);
    }
  };

  const drawPlaceholder = (ctx: CanvasRenderingContext2D) => {
    // Draw a simple placeholder
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, size, size);
    
    ctx.fillStyle = '#6b7280';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('QR Code', size / 2, size / 2 - 10);
    ctx.fillText('Loading...', size / 2, size / 2 + 10);
  };

  return (
    <div className={`inline-block ${className}`}>
      <canvas
        ref={canvasRef}
        className="border border-gray-200 rounded-lg"
        style={{ width: size, height: size }}
      />
    </div>
  );
};

export default WalletQRCode;
