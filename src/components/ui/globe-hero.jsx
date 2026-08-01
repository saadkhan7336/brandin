"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import React, { useRef, useMemo, useEffect, useState } from "react";
import * as THREE from "three";
import { cn } from "../../lib/utils";

// Pure 2D HTML5 Canvas Fallback Component (Works 100% reliably if WebGL fails/lost)
const Canvas2DFallback = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = canvas.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.offsetHeight || 500);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth || window.innerWidth;
      height = canvas.height = canvas.offsetHeight || 500;
    };
    window.addEventListener("resize", handleResize);

    // Generate 120 nodes for 2D canvas
    const nodes = Array.from({ length: 110 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 2 + 1.5,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw connecting lines
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.25 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw and update node dots
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(37, 99, 235, 0.75)";
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full block opacity-80" />;
};

// Ultra-Smooth Interactive WebGL Constellation Mesh Component
const InteractiveMesh = () => {
  const pointsRef = useRef(null);
  const linesRef = useRef(null);
  const targetMouse = useRef({ x: 0, y: 0 });
  const currentMouse = useRef({ x: 0, y: 0 });

  // Generate 240 nodes spanning boundaries
  const { originalPositions, currentPositions, lineIndices, count } = useMemo(() => {
    const totalPoints = 240;
    const origPos = new Float32Array(totalPoints * 3);
    const currPos = new Float32Array(totalPoints * 3);
    const vecArray = [];

    for (let i = 0; i < totalPoints; i++) {
      const x = (Math.random() - 0.5) * 16;
      const y = (Math.random() - 0.5) * 7.5;
      const z = (Math.random() - 0.5) * 3;

      origPos[i * 3] = x;
      origPos[i * 3 + 1] = y;
      origPos[i * 3 + 2] = z;

      currPos[i * 3] = x;
      currPos[i * 3 + 1] = y;
      currPos[i * 3 + 2] = z;

      vecArray.push(new THREE.Vector3(x, y, z));
    }

    const indices = [];
    const maxDist = 2.2;

    for (let i = 0; i < totalPoints; i++) {
      for (let j = i + 1; j < totalPoints; j++) {
        if (vecArray[i].distanceTo(vecArray[j]) < maxDist) {
          indices.push(i, j);
        }
      }
    }

    return {
      originalPositions: origPos,
      currentPositions: currPos,
      lineIndices: indices,
      count: totalPoints,
    };
  }, []);

  const linePosBuffer = useMemo(() => {
    return new Float32Array(lineIndices.length * 3);
  }, [lineIndices]);

  // Resource Cleanup on Unmount
  useEffect(() => {
    return () => {
      if (pointsRef.current?.geometry) pointsRef.current.geometry.dispose();
      if (linesRef.current?.geometry) linesRef.current.geometry.dispose();
    };
  }, []);

  useFrame(({ mouse, clock }) => {
    const elapsedTime = clock.getElapsedTime();

    targetMouse.current.x = mouse.x * 7.5;
    targetMouse.current.y = mouse.y * 4.0;

    currentMouse.current.x += (targetMouse.current.x - currentMouse.current.x) * 0.28;
    currentMouse.current.y += (targetMouse.current.y - currentMouse.current.y) * 0.28;

    if (pointsRef.current && linesRef.current) {
      const pointsGeo = pointsRef.current.geometry;
      const linesGeo = linesRef.current.geometry;
      const posArray = pointsGeo.attributes.position.array;
      const lineArray = linesGeo.attributes.position.array;

      const mx = currentMouse.current.x;
      const my = currentMouse.current.y;

      for (let i = 0; i < count; i++) {
        const ix = i * 3;
        const iy = i * 3 + 1;
        const iz = i * 3 + 2;

        const ox = originalPositions[ix];
        const oy = originalPositions[iy];
        const oz = originalPositions[iz];

        const waveX = Math.sin(elapsedTime * 0.8 + oy * 0.4) * 0.16;
        const waveY = Math.cos(elapsedTime * 0.7 + ox * 0.4) * 0.16;

        const curX = ox + waveX;
        const curY = oy + waveY;

        const dx = curX - mx;
        const dy = curY - my;
        const distSq = dx * dx + dy * dy;
        const radius = 3.2;

        let pushX = 0;
        let pushY = 0;

        if (distSq < radius * radius) {
          const dist = Math.sqrt(distSq);
          const normDist = dist / radius;
          const force = (1 - normDist) * 1.5;
          pushX = (dx / (dist || 1)) * force;
          pushY = (dy / (dist || 1)) * force;
        }

        posArray[ix] += (curX + pushX - posArray[ix]) * 0.35;
        posArray[iy] += (curY + pushY - posArray[iy]) * 0.35;
        posArray[iz] = oz;
      }

      pointsGeo.attributes.position.needsUpdate = true;

      for (let k = 0; k < lineIndices.length; k++) {
        const pointIdx = lineIndices[k];
        lineArray[k * 3] = posArray[pointIdx * 3];
        lineArray[k * 3 + 1] = posArray[pointIdx * 3 + 1];
        lineArray[k * 3 + 2] = posArray[pointIdx * 3 + 2];
      }

      linesGeo.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={currentPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.09}
          color="#2563eb"
          transparent
          opacity={0.85}
          sizeAttenuation
        />
      </points>

      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={linePosBuffer.length / 3}
            array={linePosBuffer}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#3b82f6"
          transparent
          opacity={0.28}
          linewidth={1}
        />
      </lineSegments>
    </group>
  );
};

// WebGL Error Boundary with Automatic 2D Fallback
class WebGLErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.warn("WebGL Context unavailable. Switching to 2D Canvas fallback.", error);
  }

  render() {
    if (this.state.hasError) {
      return <Canvas2DFallback />;
    }
    return this.props.children;
  }
}

const DotGlobeHero = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    const [isWebGLSupported, setIsWebGLSupported] = useState(true);

    useEffect(() => {
      try {
        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        if (!gl) {
          setIsWebGLSupported(false);
        }
      } catch (e) {
        setIsWebGLSupported(false);
      }
    }, []);

    return (
      <div
        ref={ref}
        className={cn(
          "relative w-full min-h-[60vh] md:min-h-[68vh] bg-gradient-to-b from-slate-50 via-white to-blue-50/30 overflow-hidden flex flex-col justify-center items-center border-b border-slate-200/60 cursor-grab active:cursor-grabbing select-none group",
          className
        )}
        {...props}
      >
        {/* Soft Background Blurs */}
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[380px] bg-gradient-to-tr from-blue-300/20 to-indigo-200/20 rounded-full blur-3xl pointer-events-none z-0" />
        <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-[550px] h-[380px] bg-gradient-to-tl from-blue-300/20 to-cyan-200/20 rounded-full blur-3xl pointer-events-none z-0" />

        {/* Foreground Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full py-10">
          {children}
        </div>

        {/* Interactive WebGL Canvas with Fallback */}
        <div className="absolute inset-0 z-0">
          {isWebGLSupported ? (
            <WebGLErrorBoundary>
              <Canvas
                camera={{ position: [0, 0, 5], fov: 55 }}
                gl={{
                  antialias: true,
                  alpha: true,
                  failIfMajorPerformanceCaveat: false,
                  powerPreference: "high-performance",
                  preserveDrawingBuffer: false,
                }}
                onCreated={({ gl }) => {
                  const handleContextLost = (e) => {
                    e.preventDefault();
                    console.warn("WebGL Context Lost. Preserving state...");
                  };
                  gl.domElement.addEventListener("webglcontextlost", handleContextLost, false);
                }}
                style={{ pointerEvents: "auto" }}
              >
                <ambientLight intensity={1} />
                <InteractiveMesh />
              </Canvas>
            </WebGLErrorBoundary>
          ) : (
            <Canvas2DFallback />
          )}
        </div>
      </div>
    );
  }
);

DotGlobeHero.displayName = "DotGlobeHero";

export { DotGlobeHero };
