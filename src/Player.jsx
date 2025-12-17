// src/Player.jsx

import React, { useRef, useEffect } from 'react'; // 导入 useEffect
import { useFrame } from '@react-three/fiber';
// 导入 useAnimations
import { useGLTF, useAnimations } from '@react-three/drei'; 
import { useKeyboardControls } from './useKeyboardControls'; // 导入自定义的键盘控制钩子
import * as THREE from 'three';

const PLAYER_MODEL_PATH = '/models/player_model.glb'; 

export function Player({ collidableObjects = [],props}) {
    const groupRef = useRef(); 

    // 相机和跟随逻辑的辅助对象
    const cameraTarget = useRef(new THREE.Vector3());
    const cameraPositionTarget = useRef(new THREE.Vector3()); // 目标相机位置
    const cameraDistanceX = 0;  // 相机在X轴上的偏移（可选，用于斜角）
    const cameraDistanceY = 6;  // 相机的高度 (俯视)
    const cameraDistanceZ = 7;  // 相机在Z轴上的偏移
    const cameraSmoothness = 0.05; // 相机跟随的平滑度


    // 动画相关的引用
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


    useFrame((state) => {

        //相机跟随逻辑
        
        const playerPosition = groupRef.current.position;

        // 1. 计算相机目标位置 (相机应该在的位置)
        
        // 目标位置 = 玩家位置 + 固定的偏移量
        cameraPositionTarget.current.set(
            playerPosition.x + cameraDistanceX, 
            playerPosition.y + cameraDistanceY, 
            playerPosition.z + cameraDistanceZ 
        );

        // 2. 计算相机看向的目标 (始终看向主角)
        cameraTarget.current.copy(playerPosition);
        cameraTarget.current.y += 0.5; // 让相机看向主角身体的中心
        
        // 3. 使用插值 (Lerp) 平滑移动相机
        // 注意：我们直接操作 state.camera (R3F 自动提供的 Three.js 相机对象)
        state.camera.position.lerp(cameraPositionTarget.current, cameraSmoothness);
        // 始终让相机看向主角
        state.camera.lookAt(cameraTarget.current);
        // -----------------------------------------------------------------

        // ... 运动逻辑 ...
        // --- 核心：在每一帧中处理运动 ---
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
        
        // 碰撞检测：改为多射线采样
        const playerPos = new THREE.Vector3(nextX, nextY, nextZ);
        let hasCollision = false;

        // 使用传入的可碰撞对象数组，在threedscene.jsx中传入

        // 方向与距离
        const moveDir = playerPos.clone().sub(groupRef.current.position);
        const distance = moveDir.length();
        // 如果没有移动或者没有碰撞对象，跳过检测
        if (distance > 1e-6 && collidableObjects.length > 0) {
            const direction = moveDir.clone().normalize();

            // 采样点：中心 + 左右偏移 + 前方偏移（提高对窄缝和边缘的检测）
            const side = new THREE.Vector3(-direction.z, 0, direction.x).normalize();
            const forward = direction.clone();

            const offsets = [
                new THREE.Vector3(0, 0.4, 0), // 中心（髋部高度略高，以避免地面自身检测）
                side.clone().multiplyScalar(0.25).add(new THREE.Vector3(0, 0.4, 0)), // 左侧
                side.clone().multiplyScalar(-0.25).add(new THREE.Vector3(0, 0.4, 0)), // 右侧
                forward.clone().multiplyScalar(0.15).add(new THREE.Vector3(0, 0.4, 0)), // 前方稍上
                side.clone().multiplyScalar(0.15).add(forward.clone().multiplyScalar(0.15)).add(new THREE.Vector3(0, 0.4, 0)), // 右前
            ];


            // 对每个采样点投射射线，发现任一撞击就认为发生碰撞
            for (let i = 0; i < offsets.length && !hasCollision; i++) {
                const origin = groupRef.current.position.clone().add(offsets[i]);
                const raycaster = new THREE.Raycaster(origin, direction, 0, distance + collisionRadius);
                const intersects = raycaster.intersectObjects(collidableObjects, false);

                if (intersects.length > 0) {
                    // 忽略非常靠近 origin 的自相交（长度接近 0），并忽略标记为 noCollide 的结果
                    const valid = intersects.find(ix => ix.distance > 1e-4 && !ix.object.userData?.noCollide);
                    if (valid) {
                        hasCollision = true;
                        break;
                    }
                }
            }
        }

        // 如果没有碰撞，更新位置；否则回到上一帧位置
        if (!hasCollision) {
            groupRef.current.position.set(nextX, nextY, nextZ);
        } else {
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
            playActionByName( defaultAnimationName, 0.18);
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