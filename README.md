# My Portfolio

[English](#-project-overview-en) | [中文](#-项目概述)

---

## 🎨 Project Overview (EN)

A modern personal portfolio website built with **React** and **Vite**, featuring dual-view mode with **3D scene rendering** and **2D fallback view**.

### Live Demo

The site is deployed on GitHub Pages: https://berial-cn.github.io/my-portfolio/

### Current Status

This project is under active development.

### Core Features

- 🎨 **Dual View Modes**: Seamless switching between immersive 3D view and traditional 2D list view
- 🌐 **3D Rendering**: Real-time 3D scenes powered by Three.js (GLB models via `useGLTF`)
- 🎮 **Third-Person Player**: Player avatar with smooth TPS camera follow, directional movement, and animation blending
- ⌨️ **Input Controls**: Supports `W/A/S/D` and Arrow keys concurrently (custom `useKeyboardControls` hook)
- 🦾 **Animations**: Managed with `useAnimations` (Three.js AnimationMixer) and cross-fade transitions; adjustable `timeScale` for playback speed
- 🛡️ **Collision Detection**: Multi-ray sampling collision checks and `userData.noCollide` tagging to exclude floor/ground
- ⚡ **High Performance**: Vite build tool with instant cold start and fast HMR
- 📱 **Responsive Full-Screen**: Supports full viewport layout
- 🔧 **Modern Tech Stack**: React 19 with TypeScript support

### Technology Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 19.2.0 | UI Framework |
| **React DOM** | 19.2.0 | DOM Rendering |
| **Vite** | 7.2.4 | Build Tool |
| **Three.js** | 0.181.2 | 3D Graphics Library |
| **React Three Fiber** | 9.4.0 | React + Three.js Integration |
| **React Three Drei** | 10.7.7 | 3D Component Library |
| **ESLint** | 9.39.1 | Code Quality |

### Project Structure

```
my-portfolio/
├── src/
│   ├── App.jsx                 # Main app component (view switching, state management)
│   ├── App.css                 # Application styles
│   ├── ThreeDScene.jsx         # 3D scene assembly, loads environment and passes collidables
│   ├── Player.jsx              # Player controller: movement, rotation, animations, camera follow
│   ├── useKeyboardControls.jsx # Custom hook: tracks WASD + Arrow keys
│   ├── PokemonCenter.jsx       # Scene/environment model loader, marks floor with userData.noCollide
│   ├── ProjectDetailsPanel.jsx # Project details panel (optional)
│   ├── main.jsx                # App entry point
│   ├── index.css               # Global styles
│   └── assets/                 # Static resources (images, models, SVG)
├── public/                     # Public resources
├── vite.config.js              # Vite configuration
├── eslint.config.js            # ESLint configuration
├── package.json                # Dependencies and scripts
├── index.html                  # HTML entry
└── README.md                   # Project documentation
```

### Quick Start

#### Prerequisites
- Node.js >= 16.0
- npm >= 8.0 or yarn >= 3.0

#### Installation

```bash
npm install
# or
yarn install
```

#### Development

Start the dev server with HMR support:

```bash
npm run dev
```

Visit `http://localhost:5173`

#### Production Build

```bash
npm run build
```

### Deployment (GitHub Pages)

Two common ways to publish this repository to GitHub Pages:

- Method A — Use the `gh-pages` package (automated, deploys `dist/` to `gh-pages` branch):

```bash
npm install --save-dev gh-pages
# add to package.json:
"homepage": "https://berial-cn.github.io/my-portfolio",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
# then deploy
npm run deploy
```

- Method B — Use `main` branch `/docs` folder (manual):

```bash
npm run build
# move build output to ./docs then push to main branch
mv dist docs
git add docs && git commit -m "chore: add docs for GitHub Pages" && git push
```

Replace the Live Demo URL above if you use a different GitHub Pages configuration.

#### Preview Build

```bash
npm run preview
```

#### Code Linting

```bash
npm run lint
```

### Usage Guide

#### 1. **View Switching**
- Toggle button in top-left corner: "Switch to 2D/3D View"
- Seamless switching between two modes

#### 2. **3D View**
- Immersive Three.js scene
- Interactive operations (rotation, zoom, etc.)
- Real-time 3D model/scene rendering

#### 3. **2D View**
- Traditional list display
- Includes counter example
- Quick browse experience

### Core Code Explanation

```jsx
// View state management
const [viewMode, setViewMode] = useState('3D');
const [selectedProject, setSelectedProject] = useState(0);

// Conditional rendering based on viewMode
{viewMode === '3D' ? (
  <Canvas>
    <ThreeDScene onProjectSelect={setSelectedProject} />
  </Canvas>
) : (
  <div className="content-centered">
    {/* Project list content */}
  </div>
)}

// Player movement (简化示例):
// 支持 WASD + Arrow 键，平滑旋转，动画切换，碰撞检测由 ThreeDScene 提供 collidable 对象数组
// Player.jsx 中使用 useAnimations 管理动画剪辑，并使用多射线采样检测碰撞（提高精度）
```

### Recent Fixes

1. **JSX Syntax Errors**: Fixed spacing in tag names and mismatched closing tags
2. **State Management**: Corrected initialization and setter function calls
3. **JSX Comments**: Using proper comment syntax `{/* comment */}`

### 演示地址

已部署到 GitHub Pages： https://berial-cn.github.io/my-portfolio/

### 部署（GitHub Pages）

两种常见的发布方式：

- 方法一 — 使用 `gh-pages`（自动化，部署 `dist/` 到 `gh-pages` 分支）：

```bash
npm install --save-dev gh-pages
# 在 package.json 中添加：
"homepage": "https://berial-cn.github.io/my-portfolio",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
# 然后执行：
npm run deploy
```

- 方法二 — 使用 `main` 分支的 `/docs` 目录（手动）：

```bash
npm run build
# 将构建输出移动到 ./docs 并推送到 main 分支
mv dist docs
git add docs && git commit -m "chore: add docs for GitHub Pages" && git push
```

如果你的 GitHub Pages 配置不同，请替换上面的演示地址为实际 URL。

### Suggestions for Enhancement

- [ ] Add more 3D models or scenes
- [ ] Implement project detail modal/sidebar
- [ ] Database or API integration
- [ ] Mobile optimization
- [ ] Dark mode theme
- [ ] Analytics integration
- [ ] SEO optimization

### License

MIT License

### Contact

- GitHub: [@BeriaL-CN](https://github.com/BeriaL-CN)
- Repository: [my-portfolio](https://github.com/BeriaL-CN/my-portfolio)

---

# 我的作品集

## 📋 项目概述

这个项目是一个创意的作品展示平台，结合了前沿的 Web 3D 技术（Three.js）和 React 交互能力。用户可以在沉浸式的 3D 环境中浏览作品，或切换到传统的 2D 列表视图。

### 核心特性

- 🎨 **双视图模式**：3D 沉浸式视图和 2D 列表视图无缝切换
- 🌐 **3D 渲染**：基于 Three.js 的实时 3D 场景（通过 `useGLTF` 加载 GLB 模型）
- 🎮 **第三人称玩家**：玩家角色、平滑 TPS 相机跟随、方向移动与动画混合
- ⌨️ **输入支持**：同时支持 `W/A/S/D` 和方向键（由自定义 `useKeyboardControls` 管理）
- 🦾 **动画管理**：使用 `useAnimations`（AnimationMixer）进行动画过渡、cross-fade 与 `timeScale` 控制
- 🛡️ **碰撞检测**：多射线采样 + `userData.noCollide` 标记以排除地面，实现更精细的碰撞检测
- ⚡ **高性能**：Vite 构建工具，极速冷启动和热更新
- 📱 **全屏响应式**：支持全视口布局
- 🔧 **现代开发栈**：React 19 + TypeScript 支持

### 当前状态

本项目处于持续开发中。

---

## 🛠️ 技术栈

| 技术 | 版本 | 用途 |
|-----|------|------|
| **React** | 19.2.0 | UI 框架 |
| **React DOM** | 19.2.0 | DOM 渲染 |
| **Vite** | 7.2.4 | 构建工具 |
| **Three.js** | 0.181.2 | 3D 图形库 |
| **React Three Fiber** | 9.4.0 | React + Three.js 集成 |
| **React Three Drei** | 10.7.7 | 3D 组件库 |
| **ESLint** | 9.39.1 | 代码检查 |

---

## 📂 项目结构

```
my-portfolio/
├── src/
│   ├── App.jsx                 # 主应用组件（视图切换、状态管理）
│   ├── App.css                 # 应用样式
│   ├── ThreeDScene.jsx         # 3D 场景组件
│   ├── ProjectDetailsPanel.jsx # 项目详情面板（可选）
│   ├── main.jsx                # 应用入口
│   ├── index.css               # 全局样式
│   └── assets/                 # 静态资源（图片、SVG）
│       └── react.svg
├── public/                     # 公共资源
├── vite.config.js             # Vite 配置文件
├── eslint.config.js           # ESLint 配置
├── package.json               # 项目依赖和脚本
├── index.html                 # HTML 入口
└── README.md                  # 项目文档
```

---

## 🚀 快速开始

### 前置要求

- Node.js >= 16.0
- npm >= 8.0 或 yarn >= 3.0

### 安装依赖

```bash
npm install
# 或
yarn install
```

### 本地开发

启动开发服务器，支持热更新（HMR）：

```bash
npm run dev
```

访问 `http://localhost:5173` 查看应用

### 生产构建

生成优化的生产版本：

```bash
npm run build
```

输出文件位于 `dist/` 目录

### 预览构建结果

```bash
npm run preview
```

### 代码检查

运行 ESLint 检查代码质量：

```bash
npm run lint
```

---

## 🎮 使用指南

### 主要功能

#### 1. **视图切换**
- 页面左上角提供 "切换到 2D/3D 视图" 按钮
- 点击按钮可在两种视图间无缝切换

#### 2. **3D 视图**
- 沉浸式 Three.js 场景
- 支持交互操作（旋转、缩放等）
- 实时渲染 3D 模型或场景对象

#### 3. **2D 视图**
- 传统列表展示
- 包含计数器示例（点击按钮递增）
- 便于快速浏览作品

---

## 📝 核心代码说明

### App.jsx 主要功能

```jsx
// 视图状态管理
const [viewMode, setViewMode] = useState('3D');     // 当前视图模式
const [selectedProject, setSelectedProject] = useState(0);  // 选中项目（初始化为 0）

// 条件渲染：根据 viewMode 切换 3D Canvas 或 2D 视图
{viewMode === '3D' ? (
  <Canvas>
    <ThreeDScene onProjectSelect={setSelectedProject} />
  </Canvas>
) : (
  // 2D 降级视图
  <div className="content-centered">
    {/* 作品列表内容 */}
  </div>
)}
```

### ThreeDScene.jsx
- 定义 3D 场景内容
- 处理 3D 对象点击事件
- 传递选中项目给父组件

---

## 🔧 配置说明

### Vite 配置 (`vite.config.js`)
- React 插件集成
- 快速热模块替换（HMR）
- 优化的生产构建

### ESLint 配置 (`eslint.config.js`)
- 遵循 React 最佳实践
- React Hooks 规则检查
- 支持 React Refresh

---

## ✨ 已知问题与修复

### 最近修复的问题

1. **JSX 语法错误**：
   - ✅ 修复了 `< div` 的空格错误 → `<div`
   - ✅ 修复了不匹配的 JSX 关闭标签

2. **状态管理**：
   - ✅ `selectedProject` 初始化为 `0` 而非 `null`
   - ✅ 使用 `setSelectedProject()` 正确更新状态而非误调 `selectedProject()`

3. **JSX 注释**：
   - ✅ 在 JSX 中使用正确的注释语法 `{/* comment */}`

---

## 🤝 贡献指南

### 开发工作流

1. **创建功能分支**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **提交更改**
   ```bash
   git commit -m "feat: add your feature description"
   ```

3. **推送代码**
   ```bash
   git push origin feature/your-feature-name
   ```

4. **创建 Pull Request**

### 代码规范

- 遵循 ESLint 规则
- 使用 React Hooks 写法
- 组件文件使用 `.jsx` 扩展名
- 样式文件使用 `.css`，支持 CSS Modules

---

## 📦 依赖更新

检查过时的依赖：

```bash
npm outdated
```

更新依赖：

```bash
npm update
```

---

## 🌟 扩展建议

- [ ] 添加更多 3D 模型或场景
- [ ] 实现项目详情弹窗/侧栏
- [ ] 添加数据库或 API 集成
- [ ] 优化移动端适配
- [ ] 添加深色模式主题
- [ ] 集成分析工具（Google Analytics）
- [ ] 添加 SEO 优化

---

## 📄 许可证

MIT License

---

## 📧 联系方式

- GitHub: [@BeriaL-CN](https://github.com/BeriaL-CN)
- 项目仓库: [my-portfolio](https://github.com/BeriaL-CN/my-portfolio)

---

**最后更新**: 2025年12月

