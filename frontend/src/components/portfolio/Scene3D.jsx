import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles, Stars, Float } from "@react-three/drei";
import * as THREE from "three";

/**
 * Elegant, low-visual-noise hero backdrop:
 *  - a slowly rotating wireframe icosahedron (gold hairlines)
 *  - a thin counter-rotating wireframe torus (sapphire hairlines)
 *  - orbiting golden dots (small spheres on an orbit ring)
 *  - subtle sparkles + stars
 *
 * No transmissive material, no glossy melted blobs — just clean geometry.
 */

function WireIcosahedron() {
  const group = useRef();
  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.x += delta * 0.08;
      group.current.rotation.y += delta * 0.12;
      const t = state.clock.getElapsedTime();
      group.current.position.y = Math.sin(t * 0.4) * 0.05;
    }
  });

  // Precompute edges once
  const [wireGeom, glowGeom] = useMemo(() => {
    const g = new THREE.IcosahedronGeometry(1.55, 1);
    return [new THREE.EdgesGeometry(g), g];
  }, []);

  return (
    <group ref={group}>
      {/* Faint filled glow shell */}
      <mesh geometry={glowGeom}>
        <meshBasicMaterial color="#0B1E3F" transparent opacity={0.35} />
      </mesh>
      {/* Gold wireframe */}
      <lineSegments geometry={wireGeom}>
        <lineBasicMaterial color="#D4AF37" transparent opacity={0.9} />
      </lineSegments>
    </group>
  );
}

function WireTorus() {
  const ref = useRef();
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta * 0.1;
      ref.current.rotation.z += delta * 0.06;
    }
  });
  const geom = useMemo(() => {
    const t = new THREE.TorusGeometry(2.3, 0.02, 8, 160);
    return t;
  }, []);
  return (
    <mesh ref={ref} geometry={geom} rotation={[Math.PI / 3, 0, 0]}>
      <meshBasicMaterial color="#3B7DDD" transparent opacity={0.7} />
    </mesh>
  );
}

function OrbitDots({ count = 14, radius = 2.7, y = 0, tilt = 0.35 }) {
  const group = useRef();
  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.18;
  });
  const dots = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      arr.push([Math.cos(a) * radius, y + Math.sin(a) * 0.06, Math.sin(a) * radius]);
    }
    return arr;
  }, [count, radius, y]);
  return (
    <group ref={group} rotation={[tilt, 0, 0]}>
      {dots.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.025, 12, 12]} />
          <meshBasicMaterial color={i % 3 === 0 ? "#F2DDB6" : "#7BAAF7"} />
        </mesh>
      ))}
    </group>
  );
}

function Innards() {
  return (
    <Float speed={1.1} floatIntensity={0.45} rotationIntensity={0.25}>
      <WireIcosahedron />
      <WireTorus />
      <OrbitDots count={16} radius={2.4} tilt={0.4} />
      <OrbitDots count={10} radius={3.1} tilt={-0.25} />
    </Float>
  );
}

function CameraParallax() {
  useFrame((state) => {
    const { mouse, camera } = state;
    camera.position.x += (mouse.x * 0.6 - camera.position.x) * 0.04;
    camera.position.y += (-mouse.y * 0.4 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function Scene3D() {
  return (
    <Canvas
      data-testid="hero-3d-canvas"
      camera={{ position: [0, 0, 6.2], fov: 42 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.4} />
      <Suspense fallback={null}>
        <Innards />
        <CameraParallax />
        <Sparkles count={80} scale={[10, 6, 10]} size={2} speed={0.25} color="#F2DDB6" opacity={0.55} />
        <Sparkles count={60} scale={[12, 7, 12]} size={1.3} speed={0.18} color="#3B7DDD" opacity={0.5} />
        <Stars radius={40} depth={30} count={1500} factor={2} saturation={0} fade speed={0.35} />
      </Suspense>
    </Canvas>
  );
}
