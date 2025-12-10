// src/PokemonCenter.jsx

import { useGLTF } from '@react-three/drei';
import { useEffect, useRef } from 'react';

// 模型文件路径 (注意：从 public 文件夹直接以 / 开头引用)
const MODEL_PATH = '/models/pokemon_center.glb';

export function PokemonCenter(props) {
  // useGLTF 是 Drei 提供的钩子，用于异步加载 GLTF/GLB 模型
  const { scene } = useGLTF(MODEL_PATH);
  const sceneRef = useRef(null);

  // 在组件挂载时，遍历场景标记地板和其他不需要碰撞的物体
  useEffect(() => {
    if (!sceneRef.current) return;
    
    sceneRef.current.traverse((object) => {
      // 根据名称标记地板等组件为不碰撞
      if (object.name && (
        object.name.toLowerCase().includes('floor') ||
        object.name.toLowerCase().includes('misc_grp')
      )) {
        object.userData.noCollide = true;
        console.log('Marked as noCollide:', object.name);
      }
    });
  }, []);

  return (
    // primitive 允许我们直接渲染一个 Three.js 原生对象 (scene)
    <primitive 
      ref={sceneRef}
      object={scene} 
      scale={10} // 根据模型大小调整比例
      rotation={[0, 0, 0]} // 旋转模型使其面向相机
      position={[-0.4, 0, 0]} // 根据场景需要调整位置
      {...props}
    />
  );
}

// 预加载模型，提高用户体验
useGLTF.preload(MODEL_PATH);