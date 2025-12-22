'use client';

import { useEffect, useRef, useCallback } from 'react';
import { Box } from '@mui/material';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  originalX: number;
  originalY: number;
}

interface InteractiveHeroBackgroundProps {
  isDarkMode: boolean;
}

export const InteractiveHeroBackground = ({ isDarkMode }: InteractiveHeroBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, isActive: false });
  const animationRef = useRef<number | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  // Brand color palette (orange to golden yellow)
  const colors = ['#ff6b35', '#ff7f4a', '#ff9361', '#ffa94d', '#ffb84d', '#ffc857'];

  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = [];
    const numParticles = Math.floor((width * height) / 8000); // Density based on area

    for (let i = 0; i < numParticles; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      particles.push({
        x,
        y,
        originalX: x,
        originalY: y,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.5 + 0.3,
      });
    }

    particlesRef.current = particles;
  }, [colors]);

  const drawConnections = useCallback((ctx: CanvasRenderingContext2D, particles: Particle[]) => {
    const connectionDistance = 120;
    const mouseConnectionDistance = 180;
    const mouse = mouseRef.current;

    for (let i = 0; i < particles.length; i++) {
      // Connect particles to each other
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < connectionDistance) {
          const opacity = (1 - distance / connectionDistance) * 0.4;
          ctx.beginPath();
          // Brand color for connections (orange)
          ctx.strokeStyle = `rgba(255, 107, 53, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }

      // Connect particles to mouse
      if (mouse.isActive) {
        const dx = particles[i].x - mouse.x;
        const dy = particles[i].y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouseConnectionDistance) {
          const opacity = (1 - distance / mouseConnectionDistance) * 0.7;
          ctx.beginPath();
          // Golden yellow for mouse connections
          ctx.strokeStyle = `rgba(255, 200, 87, ${opacity})`;
          ctx.lineWidth = 2;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const mouse = mouseRef.current;
    const particles = particlesRef.current;

    // Clear canvas with softer gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    if (isDarkMode) {
      gradient.addColorStop(0, '#1e1e2e');
      gradient.addColorStop(1, '#2a2a3e');
    } else {
      gradient.addColorStop(0, '#fff5f0');
      gradient.addColorStop(1, '#fff8e8');
    }
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Update and draw particles
    for (const particle of particles) {
      // Mouse interaction - particles get attracted/repelled by mouse
      if (mouse.isActive) {
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 200;

        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance;
          const angle = Math.atan2(dy, dx);

          // Gentle push away from mouse with orbit effect
          particle.vx -= Math.cos(angle) * force * 0.3;
          particle.vy -= Math.sin(angle) * force * 0.3;

          // Add slight tangential movement for orbit effect
          particle.vx += Math.cos(angle + Math.PI / 2) * force * 0.1;
          particle.vy += Math.sin(angle + Math.PI / 2) * force * 0.1;
        }
      }

      // Return to original position
      const returnForce = 0.01;
      particle.vx += (particle.originalX - particle.x) * returnForce;
      particle.vy += (particle.originalY - particle.y) * returnForce;

      // Apply friction
      particle.vx *= 0.95;
      particle.vy *= 0.95;

      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Bounce off walls
      if (particle.x < 0 || particle.x > width) {
        particle.vx *= -0.5;
        particle.x = Math.max(0, Math.min(width, particle.x));
      }
      if (particle.y < 0 || particle.y > height) {
        particle.vy *= -0.5;
        particle.y = Math.max(0, Math.min(height, particle.y));
      }

      // Draw particle with glow effect
      ctx.save();
      ctx.globalAlpha = particle.alpha;

      // Outer glow
      const glowGradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.radius * 3
      );
      glowGradient.addColorStop(0, particle.color);
      glowGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius * 4, 0, Math.PI * 2);
      ctx.fill();

      // Core particle with stronger visibility
      ctx.globalAlpha = Math.min(1, particle.alpha + 0.5);
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius * 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Draw connections between particles
    drawConnections(ctx, particles);

    // Draw mouse glow effect with brand colors
    if (mouse.isActive) {
      const mouseGlow = ctx.createRadialGradient(
        mouse.x, mouse.y, 0,
        mouse.x, mouse.y, 120
      );
      mouseGlow.addColorStop(0, 'rgba(255, 107, 53, 0.35)');
      mouseGlow.addColorStop(0.5, 'rgba(255, 200, 87, 0.15)');
      mouseGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = mouseGlow;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 120, 0, Math.PI * 2);
      ctx.fill();
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [isDarkMode, drawConnections]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      initParticles(rect.width, rect.height);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        isActive: true,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.isActive = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      mouseRef.current = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
        isActive: true,
      };
    };

    const handleTouchEnd = () => {
      mouseRef.current.isActive = false;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', handleTouchEnd);

    // Start animation
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, initParticles]);

  return (
    <Box
      ref={containerRef}
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
        }}
      />
    </Box>
  );
};
