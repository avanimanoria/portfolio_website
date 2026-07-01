import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, MeshTransmissionMaterial, Sparkles, Stars } from "@react-three/drei";
import * as THREE from "three";

function GoldKnot() {
  const ref = useRef();
  const light = useRef();

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 0.15;
      ref.current.rotation.y += delta * 0.22;
      const t = state.clock.getElapsedTime();
      ref.current.position.y = Math.sin(t * 0.6) * 0.08;
    }
    if (light.current) {
      const { x, y } = state.mouse;
      light.current.position.x = x * 4;
      light.current.position.y = y * 3;
    }
  });

  return (
    <>
      <pointLight ref={light} intensity={2.2} distance={9} color="#F2DDB6" />
      <Float speed={1.2} floatIntensity={0.6} rotationIntensity={0.4}>
        <mesh ref={ref} scale={1.35}>
          <torusKnotGeometry args={[0.9, 0.28, 220, 40, 2, 3]} />
          <MeshTransmissionMaterial
            samples={4}
            resolution={256}
            transmission={0.85}
            roughness={0.15}
            thickness={1.2}
            ior={1.6}
            chromaticAberration={0.35}
            anisotropy={0.4}
            distortion={0.25}
            distortionScale={0.35}
            temporalDistortion={0.12}
            color="#F5E1B8"
            attenuationColor="#D4AF37"
            attenuationDistance={1.2}
            background={new THREE.Color("#050505")}
          />
        </mesh>
      </Float>
    </>
  );
}

function InnerCore() {
  const ref = useRef();
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta * 0.1;
      ref.current.rotation.z += delta * 0.08;
    }
  });
  return (
    <mesh ref={ref} scale={0.55}>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial
        color="#D4AF37"
        metalness={1}
        roughness={0.15}
        emissive="#8A6D1A"
        emissiveIntensity={0.35}
      />
    </mesh>
  );
}

export default function Scene3D() {
  return (
    <Canvas
      data-testid="hero-3d-canvas"
      camera={{ position: [0, 0, 5], fov: 40 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <color attach="background" args={["#050505"]} />
      <ambientLight intensity={0.25} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} color="#F2DDB6" />
      <directionalLight position={[-4, -3, 2]} intensity={0.5} color="#ffffff" />
      <Suspense fallback={null}>
        <GoldKnot />
        <InnerCore />
        <Sparkles count={90} scale={7} size={2.2} speed={0.35} color="#F2DDB6" opacity={0.6} />
        <Stars radius={40} depth={30} count={1200} factor={2} saturation={0} fade speed={0.4} />
        <Environment preset="night" />
      </Suspense>
    </Canvas>
  );
}
