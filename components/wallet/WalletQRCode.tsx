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
      // Create a proper Phantom deep link for connection (not webview)
      const dappUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const phantomUrl = `phantom://v1/connect?dapp_encryption_public_key=&cluster=devnet&app_url=${encodeURIComponent(dappUrl)}`;

      // Use QR Server API for generating QR codes with the Phantom connection URL
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(phantomUrl)}&format=png&margin=10`;

      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        ctx.clearRect(0, 0, size, size);

        // Draw white background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, size, size);

        // Draw QR code
        ctx.drawImage(img, 0, 0, size, size);

        // Add Phantom logo in center if size is large enough
        if (size >= 200) {
          drawPhantomLogo(ctx);
        }
      };

      img.onerror = () => {
        console.error('QR code generation failed, using fallback');
        drawPlaceholder(ctx);
      };

      img.src = qrApiUrl;
    } catch (error) {
      console.error('Failed to generate QR code:', error);
      drawPlaceholder(ctx);
    }
  };

  const drawPhantomLogo = (ctx: CanvasRenderingContext2D) => {
    const centerX = size / 2;
    const centerY = size / 2;
    const logoSize = size * 0.15; // 15% of QR code size

    // Draw white background circle for logo
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(centerX, centerY, logoSize + 4, 0, 2 * Math.PI);
    ctx.fill();

    // Draw purple circle for Phantom logo
    ctx.fillStyle = '#AB9FF2';
    ctx.beginPath();
    ctx.arc(centerX, centerY, logoSize, 0, 2 * Math.PI);
    ctx.fill();

    // Draw "P" for Phantom
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${logoSize}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('P', centerX, centerY);
  };

  const drawPlaceholder = (ctx: CanvasRenderingContext2D) => {
    // Draw a simple placeholder with Phantom branding
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, size, size);

    // Draw border
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, size - 2, size - 2);

    // Draw Phantom-style placeholder
    ctx.fillStyle = '#AB9FF2';
    const centerX = size / 2;
    const centerY = size / 2;

    // Draw circle
    ctx.beginPath();
    ctx.arc(centerX, centerY - 20, 30, 0, 2 * Math.PI);
    ctx.fill();

    // Draw "P"
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('P', centerX, centerY - 20);

    // Draw text
    ctx.fillStyle = '#6b7280';
    ctx.font = '14px sans-serif';
    ctx.fillText('Scan with', centerX, centerY + 15);
    ctx.fillText('Phantom App', centerX, centerY + 35);
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
