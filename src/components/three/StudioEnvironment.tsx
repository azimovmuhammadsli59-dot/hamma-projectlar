import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export function StudioEnvironment() {
  const { gl, scene } = useThree();

  useEffect(() => {
    const pmremGenerator = new THREE.PMREMGenerator(gl);
    pmremGenerator.compileEquirectangularShader();
    const roomEnv = new RoomEnvironment();
    const envTarget = pmremGenerator.fromScene(roomEnv, 0.04);
    const prevEnv = scene.environment;
    const prevFog = scene.fog;

    scene.environment = envTarget.texture;
    scene.fog = new THREE.FogExp2('#050505', 0.042);

    return () => {
      scene.environment = prevEnv;
      scene.fog = prevFog;
      envTarget.dispose();
      roomEnv.dispose();
      pmremGenerator.dispose();
    };
  }, [gl, scene]);

  return (
    <>
      <hemisphereLight args={['#f4f4f5', '#09090b', 0.85]} />
      <directionalLight position={[6, 7, 6]} intensity={2.8} color="#ffffff" />
      <directionalLight position={[-6, -2, -5]} intensity={1.9} color="#d4d4d8" />
      <pointLight position={[0, 3.5, 4.5]} intensity={2.2} distance={16} color="#ffffff" />
    </>
  );
}
