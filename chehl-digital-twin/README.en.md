# 🏭 MF-StationMonitor

<div align="center">
  <h3>Substation Digital Twin Large-Screen Monitoring System</h3>
  <p>A modern substation visualization monitoring platform built with Vue 3 + TypeScript + Three.js</p>
  
  <p>
    <a href="https://fengtianxi001.github.io/MF-StationMonitor">🌐 Online Demo</a> |
    <a href="#quick-start">🚀 Quick Start</a> |
    <a href="#features">✨ Features</a>
  </p>
</div>

<div align="center">
  <img src="https://raw.githubusercontent.com/fengtianxi001/MF-StationMonitor/main/screenshots/screenshot01.png" alt="Main interface screenshot" width="800">
</div>

## 📖 Project Overview

SMART-ELE (chehlDigitalTwin) is a professional substation digital twin large-screen monitoring system built with a modern front-end tech stack. Through 3D visualization, it displays substation operation status, equipment monitoring data, and alarm information in real time, providing power operation staff with an intuitive and efficient monitoring experience.

## ✨ Features

### 🎯 Core Features
- **3D Digital Twin**: High-fidelity 3D substation model built with Three.js
- **Real-time Monitoring**: Live display of equipment status and key parameters
- **Data Visualization**: ECharts for various monitoring charts
- **Smart Alerts**: Real-time alarm and visual indication for abnormal equipment states
- **Responsive Design**: Supports multiple screen sizes with adaptive layout

### 🛠 Technical Highlights
- **Modern Stack**: Vue 3 + Composition API + TypeScript
- **3D Rendering**: Three.js for high-performance 3D scene rendering
- **Charts**: ECharts supporting multiple chart types
- **Animation**: GSAP and Animate.css for smooth animations
- **Screen Adaptation**: autofit.js for multi-resolution support
- **Code Quality**: ESLint + Prettier + Stylelint

## 🏗 Tech Architecture

```
MF-StationMonitor/
├── src/
│   ├── components/          # Vue components
│   │   ├── Layout*.vue      # Layout components
│   │   └── WidgetPanel*.vue # Widget panel components
│   ├── hooks/               # Custom hooks
│   │   ├── useEcharts.ts    # ECharts chart logic
│   │   ├── useStation.ts    # Substation business logic
│   │   └── useThree.ts      # Three.js 3D scene logic
│   ├── assets/              # Static assets
│   ├── App.vue              # Root component
│   └── main.ts              # Application entry
├── public/                  # Public assets
├── docs/                    # Build output directory
└── screenshots/             # Project screenshots
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm / yarn / pnpm

### Install Dependencies

```bash
# Using npm
npm install

# Using yarn
yarn install

# Using pnpm
pnpm install
```

### Development

```bash
# Start dev server
npm run dev

# Or with yarn
yarn dev

# Or with pnpm
pnpm dev
```

Open http://localhost:8090 in your browser.

### Production Build

```bash
# Build for production
npm run build

# Preview build output
npm run preview
```

## 📦 Main Dependencies

### Core
- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Typed superset of JavaScript
- **Three.js** - 3D graphics library for 3D scenes
- **ECharts** - Data visualization chart library
- **GSAP** - High-performance animation library
- **autofit.js** - Screen adaptation utility

### Dev Tools
- **Vite** - Modern build tool
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Stylelint** - CSS linting

## 🎨 Screenshots

<div align="center">
  <img src="https://raw.githubusercontent.com/fengtianxi001/MF-StationMonitor/main/screenshots/screenshot02.png" alt="Detailed interface screenshot" width="800">
</div>

## 📋 Available Scripts

```bash
# Development
npm run dev              # Start dev server

# Build
npm run build            # Build for production
npm run build-only       # Build only (no type check)
npm run preview          # Preview production build

# Code quality
npm run type-check       # TypeScript type check
npm run lint             # ESLint
npm run format           # Prettier format
npm run lint:style       # Stylelint
```

## 🔧 Configuration

### Screen Adaptation

Supported resolutions are configured in `src/main.ts`:

```typescript
const ScreenSize = {
  big: [2560, 1440],      // Large screen
  normal: [1920, 1080],   // Standard screen
  small: [1280, 720],     // Small screen
}['normal']  // Current resolution
```

### Dev Server

Edit `vite.config.ts` for dev server and proxy:

```typescript
server: {
  host: '0.0.0.0',
  port: 8090,
  open: true,
  proxy: {
    '/bridge': {
      target: 'http://your-api-server:port',
      changeOrigin: true,
    },
  },
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Vue.js](https://vuejs.org/) - Progressive JavaScript framework
- [Three.js](https://threejs.org/) - 3D graphics library
- [ECharts](https://echarts.apache.org/) - Data visualization
- [Vite](https://vitejs.dev/) - Build tool

---

<div align="center">
  <p>If this project helps you, please give it a ⭐️</p>
</div>
