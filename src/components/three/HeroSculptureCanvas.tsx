import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { StudioEnvironment } from './StudioEnvironment';
import {
  detectWebGLCapabilities,
  useIsMobileViewport,
  usePrefersReducedMotion,
} from '../../utils/webgl';

interface PointerScrollState {
  pointerX: number;
  pointerY: number;
  scrollProgress: number;
}

const _dummy = new THREE.Object3D();

function KineticMetallicSculpture({
  stateRef,
  reducedMotion,
  isMobile,
}: {
  stateRef: React.MutableRefObject<PointerScrollState>;
  reducedMotion: boolean;
  isMobile: boolean;
}) {
  const rootRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const studsRef = useRef<THREE.InstancedMesh>(null);
  const satellitesRef = useRef<THREE.InstancedMesh>(null);
  const { size } = useThree();

  // Offset sculpture subtly to the right on wide desktop viewports so typography breathes cleanly on the left
  const basePositionX = useMemo(() => {
    if (isMobile || size.width < 960) return 0;
    return 1.85;
  }, [isMobile, size.width]);

  const baseScale = useMemo(() => {
    if (isMobile) return 0.72;
    if (size.width < 1100) return 0.88;
    return 1.05;
  }, [isMobile, size.width]);

  const edgesGeometry = useMemo(() => {
    const ico = new THREE.IcosahedronGeometry(1.29, 1);
    const edges = new THREE.EdgesGeometry(ico, 1);
    ico.dispose();
    return edges;
  }, []);

  useEffect(() => {
    return () => {
      edgesGeometry.dispose();
    };
  }, [edgesGeometry]);

  // Populate instanced calibration studs on the equatorial ring
  useEffect(() => {
    const studs = studsRef.current;
    if (!studs) return;
    const count = 12;
    const radius = 1.56;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      _dummy.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
      _dummy.rotation.set(0, -angle, 0);
      _dummy.scale.setScalar(1);
      _dummy.updateMatrix();
      studs.setMatrixAt(i, _dummy.matrix);
    }
    studs.instanceMatrix.needsUpdate = true;
    studs.computeBoundingSphere();
  }, []);

  // Populate orbiting micro-satellites
  const satelliteCount = 8;
  useEffect(() => {
    const sats = satellitesRef.current;
    if (!sats) return;
    for (let i = 0; i < satelliteCount; i++) {
      const angle = (i / satelliteCount) * Math.PI * 2;
      const r = 2.45 + (i % 2) * 0.25;
      _dummy.position.set(Math.cos(angle) * r, Math.sin(angle * 2) * 0.45, Math.sin(angle) * r);
      _dummy.rotation.set(0, 0, 0);
      _dummy.scale.setScalar(0.85 + (i % 3) * 0.25);
      _dummy.updateMatrix();
      sats.setMatrixAt(i, _dummy.matrix);
    }
    sats.instanceMatrix.needsUpdate = true;
    sats.computeBoundingSphere();
  }, []);

  useFrame((state, delta) => {
    const root = rootRef.current;
    if (!root) return;

    const dt = Math.min(delta, 0.05);
    const elapsed = state.clock.elapsedTime;
    const { pointerX, pointerY, scrollProgress } = stateRef.current;

    if (reducedMotion) {
      root.position.set(basePositionX, 0.08, 0);
      root.scale.setScalar(baseScale);
      return;
    }

    // Smooth floating & scroll-reactive elevation
    const floatY = Math.sin(elapsed * 0.85) * 0.14;
    const targetY = floatY - scrollProgress * 0.9;
    const targetX = basePositionX + pointerX * 0.28;
    const targetZ = -scrollProgress * 0.8;

    root.position.x = THREE.MathUtils.damp(root.position.x, targetX, 4.5, dt);
    root.position.y = THREE.MathUtils.damp(root.position.y, targetY, 4.5, dt);
    root.position.z = THREE.MathUtils.damp(root.position.z, targetZ, 4.5, dt);

    const targetScale = baseScale * (1 - scrollProgress * 0.14);
    const nextScale = THREE.MathUtils.damp(root.scale.x, targetScale, 5, dt);
    root.scale.setScalar(nextScale);

    // Mouse + Scroll reactive tilt on root assembly
    const desiredRotX = pointerY * 0.35 + scrollProgress * 0.65;
    const desiredRotY = pointerX * 0.45 + elapsed * 0.14;
    root.rotation.x = THREE.MathUtils.damp(root.rotation.x, desiredRotX, 4, dt);
    root.rotation.y = THREE.MathUtils.damp(root.rotation.y, desiredRotY, 4, dt);

    if (coreRef.current) {
      coreRef.current.rotation.y += dt * 0.22;
      coreRef.current.rotation.z += dt * 0.11;
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += dt * 0.18;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x -= dt * 0.26;
      ring2Ref.current.rotation.y += dt * 0.12;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.y -= dt * 0.32;
      ring3Ref.current.rotation.z += dt * 0.15;
    }

    if (satellitesRef.current) {
      satellitesRef.current.rotation.y += dt * 0.24;
      satellitesRef.current.rotation.x = Math.sin(elapsed * 0.4) * 0.22;
    }
  });

  return (
    <group ref={rootRef} position={[basePositionX, 0, 0]} scale={baseScale}>
      {/* 1. Obsidian Faceted Core */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1.12, 1]} />
        <meshPhysicalMaterial
          color="#0a0a0d"
          metalness={0.92}
          roughness={0.22}
          clearcoat={1}
          clearcoatRoughness={0.08}
          flatShading
        />
      </mesh>

      {/* 2. Brushed Silver Geodesic Wireframe Shell */}
      <lineSegments geometry={edgesGeometry}>
        <lineBasicMaterial color="#e4e4e7" transparent opacity={0.48} />
      </lineSegments>

      {/* 3. Polar Precision Spindle & End Caps */}
      <mesh>
        <cylinderGeometry args={[0.022, 0.022, 3.3, 16]} />
        <meshStandardMaterial color="#d4d4d8" metalness={0.98} roughness={0.14} />
      </mesh>
      <mesh position={[0, 1.66, 0]}>
        <sphereGeometry args={[0.065, 16, 16]} />
        <meshStandardMaterial color="#ffffff" metalness={1} roughness={0.08} />
      </mesh>
      <mesh position={[0, -1.66, 0]}>
        <sphereGeometry args={[0.065, 16, 16]} />
        <meshStandardMaterial color="#ffffff" metalness={1} roughness={0.08} />
      </mesh>

      {/* 4. Equatorial Machined Titanium Collar + 12 Instanced Studs */}
      <group ref={ring1Ref} rotation={[Math.PI / 2.2, 0.18, 0]}>
        <mesh>
          <torusGeometry args={[1.56, 0.048, 24, 96]} />
          <meshPhysicalMaterial
            color="#d4d4d8"
            metalness={0.98}
            roughness={0.12}
            clearcoat={0.85}
          />
        </mesh>
        <instancedMesh ref={studsRef} args={[undefined, undefined, 12]} frustumCulled={false}>
          <boxGeometry args={[0.065, 0.095, 0.12]} />
          <meshStandardMaterial color="#ffffff" metalness={1} roughness={0.1} />
        </instancedMesh>
      </group>

      {/* 5. Outer Tilted Dark Obsidian Gyroscopic Ring */}
      <mesh ref={ring2Ref} rotation={[0.85, 0.4, 0.35]}>
        <torusGeometry args={[1.95, 0.036, 24, 108]} />
        <meshPhysicalMaterial
          color="#18181b"
          metalness={0.94}
          roughness={0.16}
          clearcoat={1}
          clearcoatRoughness={0.05}
        />
      </mesh>

      {/* 6. High-Reflectance Silver Hairline Outer Ring */}
      <mesh ref={ring3Ref} rotation={[-0.62, 0.9, 0.25]}>
        <torusGeometry args={[2.22, 0.018, 20, 120]} />
        <meshStandardMaterial color="#f4f4f5" metalness={1} roughness={0.06} />
      </mesh>

      {/* 7. Orbiting Silver Micro-Satellites */}
      <instancedMesh
        ref={satellitesRef}
        args={[undefined, undefined, satelliteCount]}
        frustumCulled={false}
      >
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#e4e4e7" metalness={1} roughness={0.08} />
      </instancedMesh>
    </group>
  );
}

function MonochromeParticles({
  count,
  reducedMotion,
  stateRef,
}: {
  count: number;
  reducedMotion: boolean;
  stateRef: React.MutableRefObject<PointerScrollState>;
}) {
  const pointsRef = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 4.2 + Math.random() * 8.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.72;
      positions[i * 3 + 2] = radius * Math.cos(phi) - 1.5;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [count]);

  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  useFrame((_, delta) => {
    if (reducedMotion || !pointsRef.current) return;
    const dt = Math.min(delta, 0.05);
    pointsRef.current.rotation.y += dt * 0.028;
    pointsRef.current.rotation.x = THREE.MathUtils.damp(
      pointsRef.current.rotation.x,
      stateRef.current.pointerY * 0.08,
      3,
      dt
    );
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        color="#e4e4e7"
        size={0.036}
        sizeAttenuation
        transparent
        opacity={0.55}
        depthWrite={false}
      />
    </points>
  );
}

export function HeroSculptureCanvas() {
  const [{ supported, isSoftwareGl }] = useState(() => detectWebGLCapabilities());
  const [contextLost, setContextLost] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobileViewport();

  const pointerScrollRef = useRef<PointerScrollState>({
    pointerX: 0,
    pointerY: 0,
    scrollProgress: 0,
  });

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const nx = (e.clientX / Math.max(window.innerWidth, 1)) * 2 - 1;
      const ny = -((e.clientY / Math.max(window.innerHeight, 1)) * 2 - 1);
      pointerScrollRef.current.pointerX = THREE.MathUtils.clamp(nx, -1, 1);
      pointerScrollRef.current.pointerY = THREE.MathUtils.clamp(ny, -1, 1);
    };

    const handleScroll = () => {
      const heroHeight = Math.max(window.innerHeight, 1);
      pointerScrollRef.current.scrollProgress = THREE.MathUtils.clamp(
        window.scrollY / heroHeight,
        0,
        1.5
      );
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (!supported || contextLost) {
    return (
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div className="w-72 h-72 md:w-[420px] md:h-[420px] rounded-full border border-white/15 bg-gradient-to-br from-white/10 via-zinc-900 to-[#050505] shadow-[0_0_120px_rgba(255,255,255,0.08)]" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <Canvas
        dpr={isSoftwareGl ? 1 : isMobile ? [1, 1.5] : [1, 2]}
        camera={{ position: [0, 0, 6.2], fov: 42, near: 0.1, far: 50 }}
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
        <KineticMetallicSculpture
          stateRef={pointerScrollRef}
          reducedMotion={reducedMotion}
          isMobile={isMobile}
        />
        <MonochromeParticles
          count={isMobile ? 140 : 320}
          reducedMotion={reducedMotion}
          stateRef={pointerScrollRef}
        />
      </Canvas>
    </div>
  );
}
