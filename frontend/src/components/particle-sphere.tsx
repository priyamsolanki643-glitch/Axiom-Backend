"use client";

import { useEffect, useRef } from 'react';

export function ParticleSphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;
    
    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    const radius = Math.min(width, height) * 0.45;
    const particles: {x: number, y: number, z: number, origX: number, origY: number, origZ: number}[] = [];

    // 1. Ultra-Dense TRON Grid (12,000+ points)
    const rows = 120;
    const cols = 120;
    const sliceAngle = Math.PI * 0.85; // Bottom hole
    
    for (let i = 0; i <= rows; i++) {
      const phi = (i / rows) * Math.PI;
      if (phi > sliceAngle) continue;
      
      for (let j = 0; j < cols; j++) {
        // Strict latitude/longitude grid matching the Tron image
        const theta = (j / cols) * Math.PI * 2;
        const x = Math.sin(phi) * Math.cos(theta);
        const y = Math.cos(phi);
        const z = Math.sin(phi) * Math.sin(theta);
        
        particles.push({ x, y, z, origX: x, origY: y, origZ: z });
      }
    }

    // Flat bottom disk
    const bottomY = Math.cos(sliceAngle);
    const bottomR = Math.sin(sliceAngle);
    for (let i = 0; i < 2000; i++) {
      const r = Math.sqrt(Math.random()) * bottomR;
      const t = Math.random() * Math.PI * 2;
      particles.push({
        x: Math.cos(t) * r, y: bottomY, z: Math.sin(t) * r,
        origX: Math.cos(t) * r, origY: bottomY, origZ: Math.sin(t) * r
      });
    }

    // 2. Exact Flash Screen Orbit/Gyro Rings
    const numRingPts = 64;
    const ringRadius = 0.35;
    const ringBasePts: {x: number, y: number, z: number}[] = [];
    for (let i = 0; i <= numRingPts; i++) {
      const a = (i / numRingPts) * Math.PI * 2;
      ringBasePts.push({ x: Math.cos(a) * ringRadius, y: 0, z: Math.sin(a) * ringRadius });
    }

    let rotationY = 0;
    const rotationX = 0.15;
    let animationId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      rotationY -= 0.002;

      const cosY = Math.cos(rotationY);
      const sinY = Math.sin(rotationY);
      const cosX = Math.cos(rotationX);
      const sinX = Math.sin(rotationX);
      const time = Date.now() * 0.0005;

      const project = (p: {x: number, y: number, z: number, origX?: number, origY?: number, origZ?: number}) => {
        let x1 = p.x * cosY - p.z * sinY;
        let z1 = p.z * cosY + p.x * sinY;
        let y1 = p.y * cosX - z1 * sinX;
        let z2 = z1 * cosX + p.y * sinX;

        const perspective = radius * 4.5;
        const scale = perspective / (perspective + z2 * radius);
        
        let flowOpacity = 1.0;
        if (p.origX !== undefined) {
           const n1 = Math.sin(p.origX * 3.5 + time) * Math.cos(p.origY * 3.5 + time) * Math.sin(p.origZ * 3.5);
           const n2 = Math.sin(p.origX * 7.0 - time) * Math.cos(p.origY * 7.0 + time) * Math.sin(p.origZ * 7.0);
           const noise = n1 * 0.7 + n2 * 0.3;
           
           flowOpacity = 0.05; 
           if (noise > 0.1) {
             flowOpacity += Math.min(0.85, (noise - 0.1) * 2.5); 
           }
        }

        return {
          x: width / 2 + x1 * radius * scale,
          y: height / 2 - y1 * radius * scale, 
          z: z2,
          scale,
          flowOpacity
        };
      };

      const projParticles = particles.map(project);
      
      const drawParticles = (pts: any[]) => {
        ctx.fillStyle = 'rgba(255, 255, 255, 1.0)'; // Clean White
        pts.forEach(p => {
          const size = Math.max(0.6, 1.8 * p.scale);
          const zNormalized = (p.z + 1) / 2;
          const depthOpacity = Math.max(0.05, 0.6 - (zNormalized * 0.4));
          
          ctx.globalAlpha = depthOpacity * p.flowOpacity;
          ctx.fillRect(p.x, p.y, size, size);
        });
        ctx.globalAlpha = 1.0;
      };

      // Draw Back Particles
      drawParticles(projParticles.filter(p => p.z > 0));

      // Draw Front Particles
      drawParticles(projParticles.filter(p => p.z <= 0));

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vw] max-w-[650px] max-h-[650px] pointer-events-none z-0 mix-blend-screen opacity-90"
    />
  );
}
