# BrainBridge Presentation Website

A modern, interactive presentation website for the BrainBridge project, built with React, TypeScript, Vite, and Framer Motion.

## Features

- 🎨 Modern, responsive design with dark theme
- ✨ Smooth animations and transitions using Framer Motion
- 🖱️ Interactive sections with scroll-based animations
- ⌨️ Keyboard navigation support (↑/↓ arrows)
- 📱 Mobile-friendly navigation menu
- 🚀 Optimized for performance

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn/pnpm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   # or
   pnpm install
   ```
3. Install additional dependencies:
   ```bash
   npm install framer-motion react-icons @types/node
   ```

### Development

Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

### Building for Production

```bash
npm run build
# or
yarn build
# or
pnpm build
```

## Project Structure

- `/src/components/sections` - Individual page sections
- `/src/App.tsx` - Main application component with routing and layout
- `/src/index.css` - Global styles and Tailwind configuration
- `/tailwind.config.js` - Tailwind CSS configuration

## Technologies Used

- ⚛️ React 18
- 📝 TypeScript
- ⚡ Vite
- 🎨 Tailwind CSS
- ✨ Framer Motion
- 🌟 React Icons

## Deployment

This project is configured for deployment on GitHub Pages. To deploy:

1. Build the project: `npm run build`
2. Deploy to GitHub Pages: `npm run deploy`

## License

MIT

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
