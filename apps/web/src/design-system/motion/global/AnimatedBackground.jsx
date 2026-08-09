import React, { useEffect, useRef } from 'react';

export const AnimatedBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let t = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resize);
    resize();

    // Very subtle, premium noise/gradient wave effect (Vercel/Stripe style)
    const draw = () => {
      t += 0.002;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create a huge soft radial gradient that slowly moves
      const cx = canvas.width / 2 + Math.sin(t) * 200;
      const cy = canvas.height / 2 + Math.cos(t * 0.8) * 200;
      
      const gradient = ctx.createRadialGradient(
        cx, cy, 0,
        cx, cy, canvas.width * 0.8
      );
      
      // Using CSS variables isn't direct in canvas, using hex/rgba that matches our theme
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.08)'); // Blue accent
      gradient.addColorStop(0.5, 'rgba(147, 51, 234, 0.05)'); // Purple accent
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
       {/* Ambient WebGL/Canvas Glow */}
       <canvas 
         ref={canvasRef} 
         className="fixed inset-0 w-full h-full pointer-events-none z-[-1] opacity-60 mix-blend-screen"
       />
       {/* Static Noise Overlay for texture */}
       <div className="fixed inset-0 w-full h-full pointer-events-none z-[-1] opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
    </>
  );
};
