import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, MeshTransmissionMaterial, Sparkles, Stars } from "@react-three/drei";
import * as THREE from "three";

function GoldKnot() {
  const ref = useRef();
  const goldLight = useRef();
  const sapphireLight = useRef();

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 0.14;
      ref.current.rotation.y += delta * 0.21;
      const t = state.clock.getElapsedTime();
      ref.current.position.y = Math.sin(t * 0.6) * 0.08;
    }
    if (goldLight.current) {
      const { x, y } = state.mouse;
      goldLight.current.position.x = x * 4;
      goldLight.current.position.y = y * 3;
    }
    if (sapphireLight.current) {
      const { x, y } = state.mouse;
      sapphireLight.current.position.x = -x * 3.5;
      sapphireLight.current.position.y = -y * 2.5;
    }
  });

  return (
    <>
      <pointLight ref={goldLight} intensity={2.4} distance={9} color="#F2DDB6" />
      <pointLight ref={sapphireLight} intensity={2.6} distance={10} color="#3B7DDD" />
      <Float speed={1.2} floatIntensity={0.6} rotationIntensity={0.4}>
        <mesh ref={ref} scale={1.35}>
          <torusKnotGeometry args={[0.9, 0.28, 220, 40, 2, 3]} />
          <MeshTransmissionMaterial
            samples={4}
            resolution={256}
            transmission={0.85}
            roughness={0.16}
            thickness={1.2}
            ior={1.6}
            chromaticAberration={0.4}
            anisotropy={0.4}
            distortion={0.28}
            distortionScale={0.35}
            temporalDistortion={0.14}
            color="#F5E1B8"
            attenuationColor="#0F52BA"
            attenuationDistance={1.1}
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
        roughness={0.18}
        emissive="#0F52BA"
        emissiveIntensity={0.5}
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
      <ambientLight intensity={0.28} />
      <directionalLight position={[5, 5, 5]} intensity={1.1} color="#F2DDB6" />
      <directionalLight position={[-4, -3, 2]} intensity={0.55} color="#3B7DDD" />
      <Suspense fallback={null}>
        <GoldKnot />
        <InnerCore />
        <Sparkles count={120} scale={7.5} size={2.2} speed={0.35} color="#F2DDB6" opacity={0.6} />
        <Sparkles count={80} scale={9} size={1.6} speed={0.25} color="#3B7DDD" opacity={0.55} />
        <Stars radius={40} depth={30} count={1400} factor={2.1} saturation={0} fade speed={0.4} />
        <Environment preset="night" />
      </Suspense>
    </Canvas>
  );
}
