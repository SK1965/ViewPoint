// components/ThreeModel.js
import { useEffect, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

const Model = () => {
  const { scene } = useGLTF('model.glb'); // Replace with the path to your model

  return (
    <primitive object={scene} scale={1} position={[0, 0, 0]} />
  );
};

const ThreeDModel = () => {
  return (
    <div style={{ height: '100%', width: '100%', }}>
      <Canvas camera={{ position: [0, 0.4, 1.9], fov: 75 }}>
        {/* Ambient and Directional lighting */}
        
        <ambientLight intensity={2} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
      
        {/* Suspense for loading model */}
        <Suspense fallback={null}>
          <Model />
        </Suspense>

        {/* Camera Controls */}
        <OrbitControls enableZoom={false}/>
       
      </Canvas>
    </div>
  );
};

export default ThreeDModel;
