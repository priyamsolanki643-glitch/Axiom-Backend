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
        ctx.fillStyle = 'rgba(235, 31, 41, 1.0)'; // Tron Red base
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

      // Calculate the 3 Gyro Rings dynamically based on time
      // Ring 1: rotateX(70deg) rotateY(time*speed)
      // Ring 2: rotateX(45deg) rotateY(120deg) rotateZ(time)
      // Ring 3: rotateX(60deg) rotateY(240deg) rotateZ(time)
      const ringsToDraw = [
        { rx: 70 * Math.PI/180, ry: 0, rz: time * 2.0 },
        { rx: 45 * Math.PI/180, ry: 120 * Math.PI/180, rz: time * 1.5 },
        { rx: 60 * Math.PI/180, ry: 240 * Math.PI/180, rz: time * 2.5 }
      ].map(rot => {
        const crx = Math.cos(rot.rx), srx = Math.sin(rot.rx);
        const cry = Math.cos(rot.ry), sry = Math.sin(rot.ry);
        const crz = Math.cos(rot.rz), srz = Math.sin(rot.rz);
        
        // Apply rotations to base ring points
        return ringBasePts.map(pt => {
          // Z
          let x1 = pt.x * crz - pt.y * srz;
          let y1 = pt.x * srz + pt.y * crz;
          // X
          let y2 = y1 * crx - pt.z * srx;
          let z1 = y1 * srx + pt.z * crx;
          // Y
          let x2 = x1 * cry + z1 * sry;
          let z2 = -x1 * sry + z1 * cry;
          return project({ x: x2, y: y2, z: z2 });
        });
      });

      // Draw Gyro Rings
      ctx.lineWidth = 1.5;
      ringsToDraw.forEach(projLine => {
        // Find avg Z for the ring to do basic depth fading
        const avgZ = projLine.reduce((sum, v) => sum + v.z, 0) / projLine.length;
        const zNorm = (avgZ + 1) / 2;
        
        // Orbit rings are white to stand out inside the red Tron sphere
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 + (0.7 * (1 - zNorm))})`;
        ctx.beginPath();
        projLine.forEach((v, i) => {
          if (i === 0) ctx.moveTo(v.x, v.y);
          else ctx.lineTo(v.x, v.y);
        });
        ctx.stroke();
      });

      // Draw Center Gyro Core (Pulse)
      const centerProj = project({x:0, y:0, z:0});
      const coreSize = 3.0 * centerProj.scale * (0.8 + 0.2 * Math.sin(time * 4));
      ctx.beginPath();
      ctx.arc(centerProj.x, centerProj.y, coreSize, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${0.4 + 0.6 * Math.sin(time * 4)})`;
      ctx.fill();
      ctx.shadowBlur = 10;
      ctx.shadowColor = "white";
      ctx.fill(); // double fill for glow
      ctx.shadowBlur = 0; // reset

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
