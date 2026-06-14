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

    // 2. Exact TRON Inverted Pyramid
    const pyramidVerts = [
      { x: 0.35, y: 0.3, z: 0.35 },
      { x: -0.35, y: 0.3, z: 0.35 },
      { x: -0.35, y: 0.3, z: -0.35 },
      { x: 0.35, y: 0.3, z: -0.35 },
      { x: 0, y: -0.7, z: 0 }
    ];
    const pyramidFaces = [
      [0, 1, 2, 3], // Top Base
      [0, 1, 4],    // Front Face
      [1, 2, 4],    // Left Face
      [2, 3, 4],    // Back Face
      [3, 0, 4]     // Right Face
    ];

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
           // Flowing 3D continents simulation (Motion Noise)
           const n1 = Math.sin(p.origX * 3.5 + time) * Math.cos(p.origY * 3.5 + time) * Math.sin(p.origZ * 3.5);
           const n2 = Math.sin(p.origX * 7.0 - time) * Math.cos(p.origY * 7.0 + time) * Math.sin(p.origZ * 7.0);
           const noise = n1 * 0.7 + n2 * 0.3;
           
           // Base faint visibility with moving dense bright continents
           flowOpacity = 0.05; // very faint background grid
           if (noise > 0.1) {
             flowOpacity += Math.min(0.85, (noise - 0.1) * 2.5); // flowing bright patches
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
        ctx.fillStyle = 'rgba(235, 31, 41, 1.0)'; // Tron Red base
        pts.forEach(p => {
          const size = Math.max(0.6, 1.8 * p.scale);
          const zNormalized = (p.z + 1) / 2;
          const depthOpacity = Math.max(0.05, 0.6 - (zNormalized * 0.4));
          
          // Combine depth fading with the flowing noise continents
          ctx.globalAlpha = depthOpacity * p.flowOpacity;
          ctx.fillRect(p.x, p.y, size, size);
        });
        ctx.globalAlpha = 1.0;
      };

      // Draw Back Particles
      drawParticles(projParticles.filter(p => p.z > 0));

      // Project & Draw Pyramid
      const projPyramidVerts = pyramidVerts.map(project);
      const faces = pyramidFaces.map(faceIndices => {
        const faceVerts = faceIndices.map(i => projPyramidVerts[i]);
        const avgZ = faceVerts.reduce((sum, v) => sum + v.z, 0) / faceVerts.length;
        return { faceVerts, avgZ };
      });
      faces.sort((a, b) => b.avgZ - a.avgZ);

      faces.forEach(face => {
        ctx.beginPath();
        face.faceVerts.forEach((v, i) => {
          if (i === 0) ctx.moveTo(v.x, v.y);
          else ctx.lineTo(v.x, v.y);
        });
        ctx.closePath();
        
        const zNorm = (face.avgZ + 1) / 2;
        // Solid semi-transparent face fill
        ctx.fillStyle = `rgba(235, 31, 41, ${0.1 + (0.15 * (1 - zNorm))})`;
        ctx.fill();
        // Bright glowing edges
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = `rgba(255, 60, 60, ${0.4 + (0.6 * (1 - zNorm))})`;
        ctx.stroke();
      });

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
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] max-w-[800px] max-h-[800px] pointer-events-none z-0 mix-blend-screen opacity-90"
    />
  );
}
