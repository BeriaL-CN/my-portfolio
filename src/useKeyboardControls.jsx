// src/useKeyboardControls.js

import { useState, useEffect } from 'react';

export function useKeyboardControls() {
    const [keys, setKeys] = useState({ 
        KeyW: false, // W 键 (向前)
        KeyA: false, // A 键 (向左)
        KeyS: false, // S 键 (向后)
        KeyD: false, // D 键 (向右)
        ArrowUp: false,    // 方向键上 (向前)
        ArrowDown: false,  // 方向键下 (向后)
        ArrowLeft: false,  // 方向键左 (向左)
        ArrowRight: false  // 方向键右 (向右)
    });

    useEffect(() => {
        // 键盘按下事件
        const handleKeyDown = (e) => {
            setKeys((prev) => {
                if (Object.prototype.hasOwnProperty.call(prev, e.code)) {
                    return { ...prev, [e.code]: true };
                }
                return prev;
            });
        };

        // 键盘抬起事件
        const handleKeyUp = (e) => {
            setKeys((prev) => {
                if (Object.prototype.hasOwnProperty.call(prev, e.code)) {
                    return { ...prev, [e.code]: false };
                }
                return prev;
            });
        };

        // 绑定事件监听器
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        // 清理函数：组件卸载时移除事件监听器
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    return keys;
}