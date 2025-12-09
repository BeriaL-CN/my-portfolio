// src/App.jsx

// 请确保这些导入在文件顶部是完整的
import React, { useState } from 'react'; 
import { Canvas } from '@react-three/fiber'; 
import ThreeDScene from './ThreeDScene'; 
import './App.css'; 
import reactLogo from './assets/react.svg'; // 确保这些 logo 导入是正确的
import viteLogo from '/vite.svg';
import ProjectDetailsPanel from './ProjectDetailsPanel'; // 导入项目详情面板组件


function App() {
  const [viewMode, setViewMode] = useState('3D');
  // 确保您将这里的 useState 修复为数字，如果您想使用计数器功能
  const [selectedProject, setSelectedProject] = useState(null);
  const [count, setCount] = useState(0); 

  const uiStyle = { 
    position: 'absolute', 
    top: 20, 
    left: 20, 
    zIndex: 10, 
    padding: '10px 15px', 
    backgroundColor: 'white', 
    border: '1px solid #ccc',
    cursor: 'pointer',
    color: 'black', 
    fontWeight: 'bold'
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      
      {/* 视图模式切换按钮 */}
      <button 
        style={uiStyle}
        onClick={() => setViewMode(viewMode === '3D' ? '2D' : '3D')}
      >
        切换到 {viewMode === '3D' ? '2D' : '3D'} 视图
      </button>

      {/* 3D Canvas 区域 */}
      {viewMode === '3D' ? (
        <Canvas
          camera={{ position: [0, 7, 12], fov: 50 }}
          style={{ background: '#000000ff' }}
        >
          <ThreeDScene 
            onProjectSelect={setSelectedProject}
          />
        </Canvas>
      ) : (
        // 2D 降级视图 (确保这里只有一个顶层 div 容器)
        <div className="view-2d"> 
          
          {/* 内部容器：用于居中和限制内容宽度 (您之前在 CSS 中定义的类) */}
          <div className="content-centered"> 
            
            <h2>这是您的 2D 降级视图/作品列表</h2>
            <p>您可以在这里使用标准的 React 组件来展示作品。</p>
            <div>
              <a href="https://vite.dev" target="_blank">
                <img src={viteLogo} className="logo" alt="Vite logo" />
              </a>
              <a href="https://react.dev" target="_blank">
                <img src={reactLogo} className="logo react" alt="React logo" />
              </a>
            </div>
            <h1>Vite + React</h1>
            <div className="card">
              {/* 修复：这里应该是 setCount(count + 1)，而不是 selectedProject */}
              <button onClick={() => setCount((count) => count + 1)}> 
                count is {count}
              </button>
              <p>
                Edit <code>src/App.jsx</code> and save to test HMR
              </p>
            </div>
            <p className="read-the-docs">
              Click on the Vite and React logos to learn more
            </p>

          </div> {/* content-centered 结束 */}
        </div>  // <-- 2D 视图的顶层 div 结束
      )} 
      
      {/* --- 条件渲染项目详情面板 --- */}
      {selectedProject && (
        <ProjectDetailsPanel 
          project={selectedProject}
          // 传入一个函数，用于将 selectedProject 设回 null，从而关闭面板
          onClose={() => setSelectedProject(null)} 
        />
      )}
      
    </div> // App 组件的顶层 div 结束
  );
}

export default App;