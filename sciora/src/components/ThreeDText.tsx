import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';

export default function ThreeDText() {
  return (
    <div style={{ height: '300px', width: '100%' }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[0, 5, 5]} intensity={1} />
        <OrbitControls enableZoom={false} />

        <Text
          position={[0, 0, 0]}
          fontSize={2}
          color="#4ECDC4"
          anchorX="center"
          anchorY="middle"
          bevelEnabled
        >
          Sciora
        </Text>
      </Canvas>
    </div>
  );
}
