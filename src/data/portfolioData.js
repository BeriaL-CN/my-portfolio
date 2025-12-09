// src/data/portfolioData.js

/**
 * 作品集数据结构
 *
 * id: 唯一标识符
 * title: 项目标题
 * description: 简短描述
 * tags: 涉及的技术栈 (用于筛选或 2D UI)
 * links: 项目链接
 * position: [x, y, z] - 核心！定义它在 3D 场景中的坐标
 * model: 用于该项目的 3D 模型文件名 (例如 'robot.glb')
 */
export const portfolioData = [
    {
        id: 'project-1-chat-app',
        title: '实时聊天应用',
        description: '基于 React 和 Socket.io 的高性能实时聊天平台。',
        tags: ['React', 'Socket.io', 'Node.js'],
        links: {
            github: 'https://github.com/your/chat-app',
            liveDemo: 'https://demo.chat-app.com',
        },
        // 关键：定义 3D 位置，它们将作为 RotatingCube 的坐标
        position: [-3, 0.5, 3], 
        model: 'chat-bubble.glb', 
    },
    {
        id: 'project-2-3d-viz',
        title: 'WebGL 数据可视化',
        description: '使用 Three.js 实现的大规模数据可视化仪表板。',
        tags: ['Three.js', 'D3.js', 'WebGL'],
        links: {
            github: 'https://github.com/your/3d-viz',
        },
        position: [3, 0.5, 3],
        model: 'globe.glb',
    },
    {
        id: 'project-3-e-commerce',
        title: '现代电商平台',
        description: '使用 Vue/Next.js 开发的微服务架构电商网站。',
        tags: ['Vue.js', 'Next.js', 'PostgreSQL'],
        links: {
            github: 'https://github.com/your/ecommerce',
        },
        position: [0, 0.5, -4],
        model: 'shop-cart.glb',
    },
];