// src/ThreeDScene.jsx

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber'; 
import { OrbitControls } from '@react-three/drei'; 
// 导入项目数据
import { portfolioData } from './data/portfolioData'; 
import { PokemonCenter } from './PokemonCenter';
import { Player } from './Player';

// --- 新的 3D 组件：项目标记 ProjectMarker ---
// 接收项目数据和 onSelect 回调函数作为 props
const ProjectMarker = ({ data, onProjectSelect, ...props }) => {
  const meshRef = useRef();
  const [hovered, hover] = React.useState(false); // 悬停状态

  // useFrame：每一帧渲染时执行的动画逻辑
  useFrame((state, delta) => {
    if (meshRef.current) {
        // 让标记稍微旋转，表明它是交互式的
        meshRef.current.rotation.y += 0.5 * delta;
    }
  });

  return (
    <mesh 
      {...props} 
      ref={meshRef} 
      // 根据悬停状态改变缩放和颜色，提供视觉反馈
      scale={hovered ? 1.8 : 1.5} 
      onClick={() => onProjectSelect(data)} // 点击时，将项目数据传递给 App.jsx
      onPointerOver={(event) => hover(true)} // 鼠标悬停
      onPointerOut={(event) => hover(false)} // 鼠标离开
    >
      <boxGeometry args={[1, 1, 1]} /> 
      {/* 颜色可以根据项目 ID 或标签动态设置 */}
      <meshStandardMaterial color={hovered ? '#ff0000' : '#4e79a7'} /> 
      {/* 未来这里会是加载的模型而不是立方体 */}
    </mesh>
  );
};

// --- 主 3D 场景组件 ---
const ThreeDScene = ({ onProjectSelect }) => {
  return (
    <>
      <ambientLight intensity={0.5} /> 
      {/* 增加一个更亮的定向光，模拟太阳或室内照明 */}
      <directionalLight position={[10, 10, 5]} intensity={2} castShadow />

      <OrbitControls 
        enableDamping={true} 
        dampingFactor={0.05} 
        // 调整相机目标，确保模型在视野中央
        target={[0, 0, 0]} 
      />

      {/* 1. 渲染宝可梦中心背景模型 */}
      <PokemonCenter />

      {/* 2. 渲染玩家模型 */}
      <Player 
        position={[0, 0, 1]} // 初始位置：位于场景中心附近，略微靠前
      />

      {/* 3. 渲染您的项目标记 (Marker) */}
      {portfolioData.map((project) => (
        <ProjectMarker 
          key={project.id}
          data={project}
          // 这里的 position 需要根据宝可梦中心的结构重新调整
          position={project.position} 
          onProjectSelect={onProjectSelect}
        />
      ))}
    </>
  );
};

export default ThreeDScene;