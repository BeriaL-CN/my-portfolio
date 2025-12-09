// src/Player.jsx

import React, { useRef, useEffect } from 'react'; // 导入 useEffect
import { useFrame } from '@react-three/fiber';
// 导入 useAnimations
import { useGLTF, useAnimations } from '@react-three/drei'; 

const PLAYER_MODEL_PATH = '/models/player_model.glb'; 

export function Player(props) {
    const groupRef = useRef(); 
    const { scene, animations } = useGLTF(PLAYER_MODEL_PATH);
    
    // --- 核心：使用 useAnimations 钩子 ---
    const { actions } = useAnimations(animations, groupRef);
    

    // 选择一个自带的动画作为默认的“待机”动画
    const defaultAnimationName = 'Walking'; 
    
    // 在组件加载时播放默认动画
    useEffect(() => {
        // 确保动画动作存在
        if (actions[defaultAnimationName]) {
            actions[defaultAnimationName].reset().play();
        }
    }, [actions, defaultAnimationName]); // 依赖项确保只在加载完成后运行

    // ... 运动逻辑将添加到 useFrame 中 ...

    return (
        <group ref={groupRef} {...props}>
            {/* 渲染加载好的玩家模型 */}
            <primitive 
                object={scene.clone()} 
                scale={0.2}             
            />
        </group>
    );
}

useGLTF.preload(PLAYER_MODEL_PATH);