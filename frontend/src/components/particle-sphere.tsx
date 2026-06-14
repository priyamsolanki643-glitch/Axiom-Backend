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

    // TRON Exact Design Elements
    const particles: {x: number, y: number, z: number}[] = [];
    const radius = Math.min(width, height) * 0.45;

    // 1. Latitude/Longitude Grid for the Sphere (like Tron)
    const rows = 45;
    const cols = 70;
    for (let i = 0; i <= rows; i++) {
      const phi = (i / rows) * Math.PI; // 0 to PI
      for (let j = 0; j < cols; j++) {
        const theta = (j / cols) * Math.PI * 2; // 0 to 2PI
        // Add some noise and gaps to make it look organic like Tron
        if (Math.random() > 0.15) {
          particles.push({
            x: Math.sin(phi) * Math.cos(theta),
            y: Math.cos(phi),
            z: Math.sin(phi) * Math.sin(theta)
          });
        }
      }
    }

    // 2. The Inner Inverted Pyramid (Tron Diamond)
    const pyramidVerts = [
      { x: 0.35, y: 0.3, z: 0.35 },   // Top Front Right
      { x: -0.35, y: 0.3, z: 0.35 },  // Top Front Left
      { x: -0.35, y: 0.3, z: -0.35 }, // Top Back Left
      { x: 0.35, y: 0.3, z: -0.35 },  // Top Back Right
      { x: 0, y: -0.7, z: 0 }         // Sharp Bottom Point
    ];
    const pyramidFaces = [
      [0, 1, 2, 3], // Top Base
      [0, 1, 4],    // Front Face
      [1, 2, 4],    // Left Face
      [2, 3, 4],    // Back Face
      [3, 0, 4]     // Right Face
    ];

    let rotationY = 0;
    const rotationX = 0.15; // Tilt to see the top of the pyramid
    let animationId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      rotationY -= 0.003; // Rotate exactly like Tron

      const cosY = Math.cos(rotationY);
      const sinY = Math.sin(rotationY);
      const cosX = Math.cos(rotationX);
      const sinX = Math.sin(rotationX);

      // Helper function to project 3D to 2D
      const project = (p: {x: number, y: number, z: number}) => {
        // Rotate Y
        let x1 = p.x * cosY - p.z * sinY;
        let z1 = p.z * cosY + p.x * sinY;
        // Rotate X
        let y1 = p.y * cosX - z1 * sinX;
        let z2 = z1 * cosX + p.y * sinX;

        const perspective = radius * 3.5;
        const scale = perspective / (perspective + z2 * radius);
        return {
          x: width / 2 + x1 * radius * scale,
          y: height / 2 - y1 * radius * scale, // Y goes up in 3D, down in Canvas
          z: z2,
          scale
        };
      };

      // Project Sphere Particles
      const projParticles = particles.map(project);
      
      // Separate into back and front
      const backParticles = projParticles.filter(p => p.z > 0);
      const frontParticles = projParticles.filter(p => p.z <= 0);

      const drawParticles = (pts: any[]) => {
        pts.forEach(p => {
          const size = Math.max(0.4, 1.2 * p.scale);
          const zNormalized = (p.z + 1) / 2; // 0 to 1
          const opacity = Math.max(0.05, 0.7 - (zNormalized * 0.5));
          ctx.beginPath();
          ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
          // Tron Red color
          ctx.fillStyle = `rgba(235, 31, 41, ${opacity})`;
          ctx.fill();
        });
      };

      // Project Pyramid
      const projPyramidVerts = pyramidVerts.map(project);

      // Draw Back Particles
      drawParticles(backParticles);

      // Draw Inner Pyramid
      // Calculate face depth and sort
      const faces = pyramidFaces.map(faceIndices => {
        const faceVerts = faceIndices.map(i => projPyramidVerts[i]);
        const avgZ = faceVerts.reduce((sum, v) => sum + v.z, 0) / faceVerts.length;
        return { faceVerts, avgZ };
      });
      faces.sort((a, b) => b.avgZ - a.avgZ); // Painter's algorithm (back to front)

      faces.forEach(face => {
        ctx.beginPath();
        face.faceVerts.forEach((v, i) => {
          if (i === 0) ctx.moveTo(v.x, v.y);
          else ctx.lineTo(v.x, v.y);
        });
        ctx.closePath();
        
        // Tron red styling for the diamond
        // Transparent filled body with bright glowing edges
        const zNorm = (face.avgZ + 1) / 2;
        ctx.fillStyle = `rgba(235, 31, 41, ${0.1 + (0.15 * (1 - zNorm))})`;
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = `rgba(255, 60, 60, ${0.4 + (0.6 * (1 - zNorm))})`;
        ctx.stroke();
      });

      // Draw Front Particles
      drawParticles(frontParticles);

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
