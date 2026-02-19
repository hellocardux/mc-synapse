# 🧠 MC Synapse
### Local-First Process Intelligence & RACI Mapping

**MC Synapse** is a powerful, browser-based tool for mapping, analyzing, and governing business processes. Built with a "Local-First" philosophy, it ensures your data never leaves your device unless you choose to share it.

![MC Synapse](https://img.shields.io/badge/Status-Stable-green) ![License](https://img.shields.io/badge/License-MIT-blue) ![Technology](https://img.shields.io/badge/Built%20With-React%20%7C%20Vite%20%7C%20ReactFlow-61DAFB)

## ✨ Key Features

### 1. 🛂 Process Passport (Governance)
Define the core utility of your process before you start mapping.
- **ISO 9001 Compliance**: detailed inputs for Process Owner, Purpose, Triggers, and Outputs.
- **Risk & KPI Definition**: Clearly identify success metrics and potential pitfalls.

### 2. 📋 SIPOC Analysis
High-level scoping tool to identify:
- **S**uppliers
- **I**nputs
- **P**rocess (Macro steps)
- **O**utputs
- **C**ustomers

### 3. 🎨 Interactive Flow Mapping
- **Drag & Drop Interface**: Easily creating flowcharts with Tasks, Decisions, and Start/End nodes.
- **Smart Connections**: Intuitive linking between steps.

### 4. 👥 Integrated RACI Matrix
- **Role Management**: Define custom roles for your organization.
- **Granular Assignment**: Assign **R**esponsible, **A**ccountable, **C**onsulted, and **I**nformed status to every single task directly from the properties panel.
- **Visual Feedback**: See assigned roles directly on the canvas.

### 5. 🚦 Process Indicators
Tag your process steps with visual markers:
- 🔴 **Risk Points**
- 🔵 **Controls**
- 🟢 **KPIs**

## 🔒 Local-First & Privacy
**Your data is yours.**
- MC Synapse runs entirely in your browser.
- No data is sent to the cloud.
- **Save/Load**: Projects are saved as `.json` files locally on your machine.

## 🛠️ Tech Stack
- **Framework**: React + Vite
- **Diagramming**: React Flow
- **Styling**: Tailwind CSS + Shadcn/UI
- **State Management**: Zustand
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/hellocardux/mc-synapse.git
   ```
2. Navigate to the project folder:
   ```bash
   cd mc-synapse
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 📄 License
This project is open source and available under the [MIT License](LICENSE).

---
**Credits**: [cardux.it](https://cardux.it)
