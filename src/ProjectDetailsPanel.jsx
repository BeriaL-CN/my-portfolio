// src/ProjectDetailsPanel.jsx
// 用来显示项目详细信息的面板组件
import React from 'react';

// 样式定义：使面板浮在 3D 场景之上
const panelStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)', // 居中
    width: '400px',
    maxWidth: '90vw',
    padding: '30px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    zIndex: 20, // 确保它在所有东西之上
    color: '#333',
    maxHeight: '80vh',
    overflowY: 'auto'
};

const ProjectDetailsPanel = ({ project, onClose }) => {
    // 如果没有项目数据，则不渲染（理论上 App.jsx 已经做了检查，但这里是安全防护）
    if (!project) return null;

    return (
        <div style={panelStyle}>
            <button 
                onClick={onClose} 
                style={{ 
                    position: 'absolute', 
                    top: '10px', 
                    right: '10px', 
                    background: 'none', 
                    border: 'none', 
                    fontSize: '1.2rem',
                    color: '#333',
                    cursor: 'pointer',
                }}
            >
                &times; {/* 乘号作为关闭图标 */}
            </button>

            <h2>{project.title}</h2>
            <p style={{ color: '#666' }}>{project.description}</p>
            
            <hr style={{ border: '0', borderTop: '1px solid #eee' }}/>

            <p><strong>技术栈：</strong> {project.tags.join(', ')}</p>

            <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                {project.links.liveDemo && (
                    <a href={project.links.liveDemo} target="_blank" rel="noopener noreferrer">
                        <button style={{ backgroundColor: '#ff69b4', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer' }}>
                            查看 Live Demo
                        </button>
                    </a>
                )}
                {project.links.github && (
                    <a href={project.links.github} target="_blank" rel="noopener noreferrer">
                        <button style={{ backgroundColor: '#4e79a7', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer' }}>
                            GitHub 源码
                        </button>
                    </a>
                )}
            </div>
            
        </div>
    );
};

export default ProjectDetailsPanel;