// src/PokemonCenter.jsx

import { useGLTF } from '@react-three/drei';

// 模型文件路径 (注意：从 public 文件夹直接以 / 开头引用)
const MODEL_PATH = '/models/pokemon_center.glb';

export function PokemonCenter(props) {
  // useGLTF 是 Drei 提供的钩子，用于异步加载 GLTF/GLB 模型
  const { scene } = useGLTF(MODEL_PATH);

  return (
    // primitive 允许我们直接渲染一个 Three.js 原生对象 (scene)
    <primitive 
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

// 导出 useGLTF 用于进一步处理模型 (可选)
// export { useGLTF };