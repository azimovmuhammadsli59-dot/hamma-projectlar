import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { StudioEnvironment } from './StudioEnvironment';
import {
  detectWebGLCapabilities,
  useIsMobileViewport,
  usePrefersReducedMotion,
} from '../../utils/webgl';

const _cubeDummy = new THREE.Object3D();

function ArchitecturalMonolith({ reducedMotion }: { reducedMotion: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const knotRef = useRef<THREE.Mesh>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);
  const cubesRef = useRef<THREE.InstancedMesh>(null);
  const [hovered, setHovered] = useState(false);

  const cubeCount = 6;

  useEffect(() => {
    const cubes = cubesRef.current;
    if (!cubes) return;
    for (let i = 0; i < cubeCount; i++) {
      const angle = (i / cubeCount) * Math.PI * 2;
      const radius = 1.85;
      _cubeDummy.position.set(
        Math.cos(angle) * radius,
        ((i % 2 === 0 ? 1 : -1) * 0.45),
        Math.sin(angle) * radius
      );
      _cubeDummy.rotation.set(angle, angle * 0.5, 0);
      _cubeDummy.scale.setScalar(1);
      _cubeDummy.updateMatrix();
      cubes.setMatrixAt(i, _cubeDummy.matrix);
    }
    cubes.instanceMatrix.needsUpdate = true;
    cubes.computeBoundingSphere();
  }, []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const group = groupRef.current;
    if (!group) return;

    const targetScale = hovered ? 1.05 : 1;
    const s = THREE.MathUtils.damp(group.scale.x, targetScale, 6, dt);
    group.scale.setScalar(s);

    if (reducedMotion) return;

    const t = state.clock.elapsedTime;
    group.position.y = Math.sin(t * 0.9) * 0.09;

    if (knotRef.current) {
      knotRef.current.rotation.y += dt * (hovered ? 0.45 : 0.25);
      knotRef.current.rotation.x += dt * 0.1;
    }
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z -= dt * 0.2;
    }
    if (cubesRef.current) {
      cubesRef.current.rotation.y -= dt * 0.18;
    }
  });

  return (
    <group
      ref={groupRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* 1. Brushed Dark Steel Torus Knot */}
      <mesh ref={knotRef}>
        <torusKnotGeometry args={[0.92, 0.23, 160, 28, 2, 3]} />
        <meshPhysicalMaterial
          color="#131316"
          metalness={0.94}
          roughness={0.2}
          clearcoat={1}
          clearcoatRoughness={0.07}
        />
      </mesh>

      {/* 2. Mirror Chrome Inner Wire Accent */}
      <mesh rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[1.45, 0.025, 20, 96]} />
        <meshStandardMaterial color="#f4f4f5" metalness={1} roughness={0.08} />
      </mesh>

      {/* 3. Outer Machined Titanium Ring */}
      <mesh ref={outerRingRef} rotation={[-Math.PI / 3, 0.4, 0]}>
        <torusGeometry args={[1.68, 0.035, 20, 96]} />
        <meshPhysicalMaterial
          color="#52525b"
          metalness={0.96}
          roughness={0.18}
          clearcoat={0.7}
        />
      </mesh>

      {/* 4. Orbiting Chrome Cubes */}
      <instancedMesh ref={cubesRef} args={[undefined, undefined, cubeCount]} frustumCulled={false}>
        <boxGeometry args={[0.16, 0.16, 0.16]} />
        <meshStandardMaterial color="#e4e4e7" metalness={0.98} roughness={0.12} />
      </instancedMesh>
    </group>
  );
}

export function AboutSculptureCanvas() {
  const [{ supported, isSoftwareGl }] = useState(() => detectWebGLCapabilities());
  const [contextLost, setContextLost] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobileViewport();

  if (!supported || contextLost) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#0a0a0c] border border-white/10 rounded-2xl">
        <div className="w-40 h-40 rounded-full border border-white/20 bg-gradient-to-tr from-zinc-900 via-zinc-700/20 to-white/15" />
      </div>
    );
  }

  return (
    <Canvas
      dpr={isSoftwareGl ? 1 : isMobile ? [1, 1.5] : [1, 2]}
      camera={{ position: [0, 0.4, 5.2], fov: 42, near: 0.1, far: 40 }}
      gl={{
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.15,
      }}
      onCreated={({ gl }) => {
        const canvas = gl.domElement;
        const onLost = (event: Event) => {
          event.preventDefault();
          setContextLost(true);
        };
        const onRestored = () => setContextLost(false);
        canvas.addEventListener('webglcontextlost', onLost, false);
        canvas.addEventListener('webglcontextrestored', onRestored, false);
      }}
    >
      <StudioEnvironment />
      <ArchitecturalMonolith reducedMotion={reducedMotion} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableDamping={!isSoftwareGl}
        dampingFactor={0.06}
        rotateSpeed={0.75}
      />
    </Canvas>
  );
}
