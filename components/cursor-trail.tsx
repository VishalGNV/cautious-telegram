"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  life: number;
  angle: number;
}

export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, prevX: 0, prevY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Track mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.prevX = mouseRef.current.x;
      mouseRef.current.prevY = mouseRef.current.y;
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;

      // Calculate velocity for more particles on fast movement
      const dx = e.clientX - mouseRef.current.prevX;
      const dy = e.clientY - mouseRef.current.prevY;
      const velocity = Math.sqrt(dx * dx + dy * dy);

      // Create more particles based on velocity
      const particleCount = Math.min(Math.floor(velocity / 5) + 1, 5);
      
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: e.clientX + (Math.random() - 0.5) * 10,
          y: e.clientY + (Math.random() - 0.5) * 10,
          size: Math.random() * 3 + 2,
          speedX: (Math.random() - 0.5) * 1.5,
          speedY: (Math.random() - 0.5) * 1.5,
          life: 1,
          angle: Math.random() * Math.PI * 2,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Animation loop
    let animationFrameId: number;
    const animate = () => {
      // Clear canvas completely - no gray painting effect
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.life -= 0.015;
        particle.angle += 0.1;

        if (particle.life <= 0) return false;

        // Futuristic cyan/electric blue gradient
        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.size * 3
        );
        
        // Cyan to electric blue futuristic colors
        gradient.addColorStop(
          0,
          `rgba(0, 255, 255, ${particle.life * 0.8})` // Bright cyan center
        );
        gradient.addColorStop(
          0.5,
          `rgba(0, 150, 255, ${particle.life * 0.5})` // Electric blue middle
        );
        gradient.addColorStop(
          1,
          `rgba(100, 100, 255, 0)` // Fade to transparent
        );

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
        ctx.fill();

        // Add a small glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = `rgba(0, 200, 255, ${particle.life * 0.5})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        return true;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
    />
  );
}
