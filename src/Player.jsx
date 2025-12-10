// src/Player.jsx

import React, { useRef, useEffect } from 'react'; // 导入 useEffect
import { useFrame } from '@react-three/fiber';
// 导入 useAnimations
import { useGLTF, useAnimations } from '@react-three/drei'; 
import { useKeyboardControls } from './useKeyboardControls'; // 导入自定义的键盘控制钩子
import * as THREE from 'three';

const PLAYER_MODEL_PATH = '/models/player_model.glb'; 

export function Player(props) {
    const groupRef = useRef(); 
    const { scene, animations } = useGLTF(PLAYER_MODEL_PATH);

    // --- 核心：使用 useAnimations 钩子（包含 mixer） ---
    const { actions } = useAnimations(animations, groupRef);
    

    // 选择一个自带的动画作为默认的"待机"动画
    const defaultAnimationName = 'House'; 
    const movementSpeed = 0.1;
    const rotationSpeed = 0.2; // 旋转平滑因子 (0~1，越大越快)
    const keys = useKeyboardControls(); // 使用自定义钩子获取键盘状态

    const currentAction = useRef(null);
    const wasMoving = useRef(false);
    const targetRotation = useRef(0); // 目标旋转角度（弧度）
    
    // 碰撞检测相关
    const collisionRadius = 0.5; // 射线投射碰撞检测半径（可调整精度）
    const previousPosition = useRef(new THREE.Vector3(0, 0, 0)); // 记录上一帧位置用于碰撞回退

    // 切换并播放动作（使用平滑过渡，避免同时播放）
    function playActionByName(name, fade = 0.15) {
        if (!actions) return;
        const next = actions[name];
        if (!next) {
            console.warn('Animation not found:', name);
            return;
        }
        const prev = currentAction.current;
        if (prev === next) return; // 已经在播放

        try {
            next.reset();
            next.play();
            if (prev) {
                prev.crossFadeTo(next, fade, false);
            } else {
                next.fadeIn(fade);
            }
            currentAction.current = next;
        } catch (e) {
            console.error('playAction error:', e);
        }
    }

    // 在组件加载时播放默认动画（如果存在）——直接执行以避免 effect 依赖警告
    useEffect(() => {
        if (!actions) return;
        const next = actions[defaultAnimationName];
        if (next) {
            try {
                next.reset();
                next.play();
                currentAction.current = next;
            } catch (e) {
                console.error('Error playing initial animation:', e);
            }
        }
    }, [actions]); // 依赖项确保只在加载完成后运行

    // ... 运动逻辑将添加到 useFrame 中 ...
    // --- 核心：在每一帧中处理运动 ---
    useFrame(({ scene }) => {
        if (!groupRef.current) return;
        
        // 保存上一帧位置（用于碰撞检测回退）
        previousPosition.current.copy(groupRef.current.position);

        let moved = false;
        let targetRot = groupRef.current.rotation.y; // 初始为当前旋转
        let nextX = groupRef.current.position.x;
        let nextY = groupRef.current.position.y;
        let nextZ = groupRef.current.position.z;
        
        // W / ArrowUp (前后移动 - 向前)
        if (keys.KeyW || keys.ArrowUp) {
            targetRot = Math.PI;
            nextZ -= movementSpeed;
            moved = true;
        } else if (keys.KeyS || keys.ArrowDown) {
            // S / ArrowDown (向后)
            targetRot = 0;
            nextZ += movementSpeed;
            moved = true;
        }
        
        // A / ArrowLeft 和 D / ArrowRight (左右移动)
        if (keys.KeyA || keys.ArrowLeft) {
            // TPS 视角，平滑旋转到目标方向
            targetRot = -Math.PI / 2;
            nextX -= movementSpeed;
            moved = true; 
        } else if (keys.KeyD || keys.ArrowRight) {
            targetRot = Math.PI / 2;
            nextX += movementSpeed;
            moved = true;
        }
        
        // 碰撞检测：检查新位置是否与场景中的物体碰撞（使用射线投射实现精细检测）
        const playerPos = new THREE.Vector3(nextX, nextY, nextZ);
        let hasCollision = false;
        
        // 从当前位置朝新位置投射射线以检测碰撞
        const direction = playerPos.clone().sub(groupRef.current.position).normalize();
        const distance = groupRef.current.position.distanceTo(playerPos);
        
        const raycaster = new THREE.Raycaster(groupRef.current.position, direction, 0, distance + collisionRadius);
        const collidableObjects = [];
        
        // 收集所有可碰撞的物体
        scene.traverse((object) => {
            // 跳过玩家自己
            if (object === groupRef.current || object.parent === groupRef.current) return;
            
            // 跳过标记为不碰撞的物体（如地板）
            if (object.userData?.noCollide) return;
            
            // 只处理有几何体的物体
            if (object.geometry) {
                collidableObjects.push(object);
            }
        });
        
        // 进行射线投射检测
        if (collidableObjects.length > 0) {
            const intersects = raycaster.intersectObjects(collidableObjects, false);
            if (intersects.length > 0) {
                hasCollision = true;
            }
        }
        
        // 如果没有碰撞，更新位置；否则回到上一帧位置
        if (!hasCollision) {
            groupRef.current.position.set(nextX, nextY, nextZ);
        } else {
            // 碰撞发生，保持上一帧位置
            groupRef.current.position.copy(previousPosition.current);
        }
        
        // 平滑旋转：使用 lerp 逐帧插值到目标旋转角度
        targetRotation.current = targetRot;
        const angleDiff = targetRot - groupRef.current.rotation.y;
        // 处理角度环绕（选择最短路径）
        let shortestDiff = angleDiff;
        if (angleDiff > Math.PI) {
            shortestDiff = angleDiff - 2 * Math.PI;
        } else if (angleDiff < -Math.PI) {
            shortestDiff = angleDiff + 2 * Math.PI;
        }
        groupRef.current.rotation.y += shortestDiff * rotationSpeed;
        
        // 根据 moved 状态切换动画（只在状态变化时切换，避免重复播放）
        if (moved && !wasMoving.current) {
            playActionByName('Walking', 0.12);
            // 加快移动动画播放速度
            if (currentAction.current) {
                currentAction.current.timeScale = 1.5; // 调整此值：1.0 为正常，>1.0 为加快
            }
        } else if (!moved && wasMoving.current) {
            playActionByName('House', 0.18);
            // 待机动画保持正常速度
            if (currentAction.current) {
                currentAction.current.timeScale = 1.0;
            }
        }
        wasMoving.current = moved;

    });
    return (
        <group ref={groupRef} {...props}>
            {/* 渲染加载好的玩家模型 */}
            <primitive 
                object={scene}
                // object={scene.clone()} 
                scale={0.7}             
            />
        </group>
    );
}

useGLTF.preload(PLAYER_MODEL_PATH);