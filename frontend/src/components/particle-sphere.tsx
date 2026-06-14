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
    const particles: {
      x: number, y: number, z: number, 
      origX: number, origY: number, origZ: number,
      randX: number, randY: number, randZ: number
    }[] = [];

    const rows = 120;
    const cols = 120;
    const sliceAngle = Math.PI * 0.85; 
    
    // Generate base coordinates with random offsets for the "Big Bang" entrance
    const addParticle = (x: number, y: number, z: number) => {
      particles.push({ 
        x, y, z, origX: x, origY: y, origZ: z,
        randX: (Math.random() - 0.5) * 8, // Random explosion spread
        randY: (Math.random() - 0.5) * 8,
        randZ: (Math.random() - 0.5) * 8
      });
    };

    for (let i = 0; i <= rows; i++) {
      const phi = (i / rows) * Math.PI;
      if (phi > sliceAngle) continue;
      for (let j = 0; j < cols; j++) {
        const theta = (j / cols) * Math.PI * 2;
        addParticle(Math.sin(phi) * Math.cos(theta), Math.cos(phi), Math.sin(phi) * Math.sin(theta));
      }
    }

    const bottomY = Math.cos(sliceAngle);
    const bottomR = Math.sin(sliceAngle);
    for (let i = 0; i < 2000; i++) {
      const r = Math.sqrt(Math.random()) * bottomR;
      const t = Math.random() * Math.PI * 2;
      addParticle(Math.cos(t) * r, bottomY, Math.sin(t) * r);
    }

    // Physics & Interaction State
    let rotationY = 0;
    let rotationX = 0.15;
    let velocity = { x: 0.002, y: 0 };
    let isDragging = false;
    let previousMouse = { x: 0, y: 0 };

    // The Singularity State
    let isHolding = false;
    let touchX = width / 2;
    let touchY = height / 2;
    let singularityTarget = 0;
    let singularityStrength = 0;
    let shockwaveRadius = 0;
    let shockwaveStrength = 0;
    let hapticInterval: number | null = null;

    const getCanvasPos = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: (e.clientX - rect.left) * (width / rect.width),
        y: (e.clientY - rect.top) * (height / rect.height)
      };
    };

    const handlePointerDown = (e: PointerEvent) => {
      isDragging = true;
      isHolding = true;
      const pos = getCanvasPos(e);
      touchX = pos.x;
      touchY = pos.y;
      previousMouse = { x: e.clientX, y: e.clientY };
      
      singularityTarget = 1.0;

      // Ultra-premium subtle haptic tap on touch (Android natively)
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(15); 
        
        // Continuous Heartbeat Engine while holding
        let beatCount = 0;
        hapticInterval = window.setInterval(() => {
          beatCount++;
          // Increase intensity as it builds up
          const intensity = Math.min(50, 10 + beatCount * 5);
          navigator.vibrate(intensity);
        }, 150);
      }
    };
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const pos = getCanvasPos(e);
      touchX = pos.x;
      touchY = pos.y;
      const deltaX = e.clientX - previousMouse.x;
      const deltaY = e.clientY - previousMouse.y;
      velocity.x = deltaX * 0.003; 
      velocity.y = deltaY * 0.003; 
      previousMouse = { x: e.clientX, y: e.clientY };
    };
    const handlePointerUp = () => { 
      isDragging = false; 
      if (isHolding) {
        isHolding = false;
        singularityTarget = 0;
        
        // Trigger Explosion Shockwave if it was held long enough
        if (singularityStrength > 0.2) {
           shockwaveStrength = singularityStrength;
           shockwaveRadius = 0;
           if (typeof navigator !== 'undefined' && navigator.vibrate) {
             navigator.vibrate([100, 50, 100]); // Big bang haptic
           }
        }
      }
      if (hapticInterval) {
        window.clearInterval(hapticInterval);
        hapticInterval = null;
      }
    };

    // Gyroscope Parallax (Mobile God Level)
    let gyroX = 0;
    let gyroY = 0;
    let currentGyroX = 0;
    let currentGyroY = 0;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        const tiltY = Math.max(-45, Math.min(45, e.gamma));
        const tiltX = Math.max(-45, Math.min(45, e.beta - 40));
        gyroY = (tiltY / 45) * 0.7; 
        gyroX = (tiltX / 45) * 0.7;
      }
    };

    canvas.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    
    if (typeof window !== 'undefined' && window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    }

    const startTime = Date.now();
    let animationId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Intro Animation (Ease Out Exponential)
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / 2500); 
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      // Physics Loop
      if (!isDragging) {
        velocity.x *= 0.95; // Friction
        velocity.y *= 0.92;
        if (Math.abs(velocity.x) < 0.001) velocity.x += (0.0015 - velocity.x) * 0.05;
        if (Math.abs(velocity.y) < 0.0001) velocity.y *= 0.9;
      }

      rotationY -= velocity.x;
      rotationX -= velocity.y;
      rotationX = Math.max(-0.6, Math.min(0.6, rotationX));

      // Smoothly interpolate Gyro
      currentGyroX += (gyroX - currentGyroX) * 0.05;
      currentGyroY += (gyroY - currentGyroY) * 0.05;

      // Interpolate Singularity
      singularityStrength += (singularityTarget - singularityStrength) * 0.05;

      // Update Shockwave Physics
      if (shockwaveStrength > 0) {
        shockwaveRadius += 40; // expand rapidly
        shockwaveStrength *= 0.92; // decay
        if (shockwaveStrength < 0.01) shockwaveStrength = 0;
      }

      const finalRotY = rotationY + currentGyroY;
      const finalRotX = rotationX + currentGyroX;
      const cosY = Math.cos(finalRotY);
      const sinY = Math.sin(finalRotY);
      const cosX = Math.cos(finalRotX);
      const sinX = Math.sin(finalRotX);
      const time = Date.now() * 0.0005;

      const project = (p: typeof particles[0]) => {
        const currX = p.origX + p.randX * (1 - easeProgress);
        const currY = p.origY + p.randY * (1 - easeProgress);
        const currZ = p.origZ + p.randZ * (1 - easeProgress);

        let x1 = currX * cosY - currZ * sinY;
        let z1 = currZ * cosY + currX * sinY;
        let y1 = currY * cosX - z1 * sinX;
        let z2 = z1 * cosX + currY * sinX;

        const perspective = radius * 4.5;
        const scale = perspective / (perspective + z2 * radius);
        
        let flowOpacity = 1.0;
        const n1 = Math.sin(p.origX * 3.5 + time) * Math.cos(p.origY * 3.5 + time) * Math.sin(p.origZ * 3.5);
        const n2 = Math.sin(p.origX * 7.0 - time) * Math.cos(p.origY * 7.0 + time) * Math.sin(p.origZ * 7.0);
        const noise = n1 * 0.7 + n2 * 0.3;
        
        flowOpacity = 0.05; 
        if (noise > 0.1) flowOpacity += Math.min(0.85, (noise - 0.1) * 2.5); 
        flowOpacity *= easeProgress;

        let finalX = width / 2 + x1 * radius * scale;
        let finalY = height / 2 - y1 * radius * scale;

        // 1. The Singularity Warp Math
        if (singularityStrength > 0.01) {
           const dx = finalX - touchX;
           const dy = finalY - touchY;
           const dist = Math.sqrt(dx * dx + dy * dy);
           const vortexRadius = Math.min(width, height) * 1.5; // Huge influence
           
           if (dist < vortexRadius) {
             const normalizedDist = dist / vortexRadius;
             const pinch = Math.pow(1 - normalizedDist, 2) * singularityStrength;
             const angle = Math.atan2(dy, dx);
             const swirlAngle = angle + (pinch * 12.0); // Insane Swirl
             
             // Suck aggressively into center event horizon
             const newDist = dist * (1 - pinch * 0.95); 
             
             finalX = touchX + Math.cos(swirlAngle) * newDist;
             finalY = touchY + Math.sin(swirlAngle) * newDist;
             
             // Blindly bright near the event horizon
             flowOpacity = Math.max(flowOpacity, pinch * 4.0);
           }
        }

        // 2. The Shockwave Math
        if (shockwaveStrength > 0.01) {
           const dx = finalX - touchX;
           const dy = finalY - touchY;
           const dist = Math.sqrt(dx * dx + dy * dy);
           const distFromWave = Math.abs(dist - shockwaveRadius);
           
           if (distFromWave < 120) {
              const push = (1 - (distFromWave / 120)) * shockwaveStrength * 250;
              const angle = Math.atan2(dy, dx);
              finalX += Math.cos(angle) * push;
              finalY += Math.sin(angle) * push;
              // Flash of light at the shockwave rim
              flowOpacity = Math.max(flowOpacity, push * 0.02);
           }
        }

        return { x: finalX, y: finalY, z: z2, scale, flowOpacity };
      };

      const projParticles = particles.map(project);
      
      const drawParticles = (pts: any[]) => {
        ctx.fillStyle = 'rgba(255, 255, 255, 1.0)';
        pts.forEach(p => {
          const size = Math.max(0.6, 1.8 * p.scale);
          const zNormalized = (p.z + 1) / 2;
          const depthOpacity = Math.max(0.05, 0.6 - (zNormalized * 0.4));
          
          ctx.globalAlpha = Math.min(1.0, depthOpacity * p.flowOpacity);
          ctx.fillRect(p.x, p.y, size, size);
        });
        ctx.globalAlpha = 1.0;
      };

      drawParticles(projParticles.filter(p => p.z > 0));
      drawParticles(projParticles.filter(p => p.z <= 0));

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      if (typeof window !== 'undefined' && window.DeviceOrientationEvent) {
        window.removeEventListener('deviceorientation', handleOrientation);
      }
      if (hapticInterval) window.clearInterval(hapticInterval);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] sm:w-[100vw] sm:h-[100vw] max-w-[750px] max-h-[750px] cursor-grab active:cursor-grabbing z-0 mix-blend-screen opacity-90"
      style={{ touchAction: 'none' }}
    />
  );
}
