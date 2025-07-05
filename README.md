# React State CLI

🧠 **Effortless Redux boilerplate generation from initial state files**

[![npm version](https://badge.fury.io/js/react-state-cli.svg)](https://badge.fury.io/js/react-state-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A powerful CLI tool that automatically generates Redux Toolkit slices, reducers, TypeScript interfaces, and state management boilerplate from your initial state definitions. Say goodbye to repetitive Redux setup!

## ✨ Features

- **🚀 Zero Configuration** - Works out of the box with sensible defaults
- **📝 TypeScript First** - Generates fully typed Redux code
- **🔧 Redux Toolkit** - Uses modern Redux patterns with RTK
- **⚡ Lightning Fast** - Instant boilerplate generation
- **🎯 Smart Type Inference** - Automatically infers types from your initial state
- **📁 Organized Structure** - Generates clean, maintainable file organization
- **🔄 Action Creators** - Auto-generates setter actions for each state property

## 📦 Installation

### Global Installation (Recommended)

```bash
npm install -g react-state-cli
```

### Local Installation

```bash
npm install --save-dev react-state-cli
```

### Using npx (No Installation Required)

```bash
npx react-state-cli generate ./src/redux/product/initState.ts
```

## 🚀 Quick Start

### 1. Create your initial state file

Create an `initState.ts` file that exports a default object:

```typescript
// src/redux/product/initState.ts
export default {
  items: [],
  loading: false,
  error: null,
  selectedId: 0,
  filters: {
    category: '',
    priceRange: [0, 1000]
  }
}
```

### 2. Generate Redux boilerplate

```bash
react-state-cli generate ./src/redux/product/initState.ts
```

### 3. ✨ Magic happens!

The CLI will generate:

```
src/redux/product/
├── initState.ts          # Your original file
├── slice.ts              # Redux Toolkit slice
├── reducers.ts           # Exported reducer
├── types.ts              # TypeScript interfaces
└── ...

src/redux/
└── state.ts              # Root state interface (if new)
```

## 📚 Generated Code Examples

### Generated Slice (`slice.ts`)

```typescript
import { createSlice } from '@reduxjs/toolkit'
import { ProductState } from './types'

const initialState: ProductState = {
  items: [],
  loading: false,
  error: null,
  selectedId: 0,
  filters: {
    category: '',
    priceRange: [0, 1000]
  }
}

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setItems: (state, action) => { state.items = action.payload },
    setLoading: (state, action) => { state.loading = action.payload },
    setError: (state, action) => { state.error = action.payload },
    setSelectedId: (state, action) => { state.selectedId = action.payload },
    setFilters: (state, action) => { state.filters = action.payload },
  }
})

export const { setItems, setLoading, setError, setSelectedId, setFilters } = productSlice.actions
export default productSlice.reducer
```

### Generated Types (`types.ts`)

```typescript
export interface ProductState {
  items: any[]
  loading: boolean
  error: any
  selectedId: number
  filters: object
}
```

### Generated Root State (`state.ts`)

```typescript
import { ProductState } from './product/types'

export interface RootState {
  product: ProductState
}
```

## 🛠️ CLI Commands

### `generate`

Generates Redux boilerplate from an initial state file.

```bash
react-state-cli generate <initStatePath>
```

**Arguments:**
- `<initStatePath>` - Path to your `initState.ts` file (relative or absolute)

**Examples:**
```bash
# Relative path
react-state-cli generate ./src/redux/user/initState.ts

# Absolute path
react-state-cli generate /Users/dev/project/src/redux/auth/initState.ts

# Using npx
npx react-state-cli generate ./src/store/products/initState.ts
```

## 📋 Requirements

- **Node.js** >= 14.0.0
- **TypeScript** project setup
- **Redux Toolkit** in your dependencies

## 🎯 Use Cases

### Perfect for:
- 🏗️ **New Redux slices** - Quickly scaffold new state management
- 🔄 **Rapid prototyping** - Generate boilerplate for quick testing
- 📚 **Learning Redux** - See best practices in generated code
- 🏢 **Team consistency** - Ensure uniform Redux patterns across teams
- ⚡ **Time-saving** - Eliminate repetitive boilerplate writing

### Example Project Structure

```
src/
├── redux/
│   ├── user/
│   │   ├── initState.ts
│   │   ├── slice.ts          # Generated
│   │   ├── reducers.ts       # Generated
│   │   └── types.ts          # Generated
│   ├── products/
│   │   ├── initState.ts
│   │   ├── slice.ts          # Generated
│   │   ├── reducers.ts       # Generated
│   │   └── types.ts          # Generated
│   └── state.ts              # Generated root state
├── components/
└── pages/
```

## ⚙️ Configuration

Currently, the CLI uses sensible defaults and doesn't require configuration. Future versions may include:

- Custom template support
- Configurable naming conventions
- Output directory customization
- Advanced type inference options

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### Development Setup

```bash
# Clone the repository
git clone https://github.com/Utsav-Virani/react-state-cli.git
cd react-state-cli

# Install dependencies
npm install

# Build the project
npm run build

# Link for local development
npm link

# Test your changes
react-state-cli generate ./examples/initState.ts
```

### Project Structure

```
react-state-cli/
├── src/
│   ├── index.ts          # CLI entry point
│   ├── generate.ts       # Core generation logic
│   └── utils.ts          # Utility functions
├── templates/
│   ├── slice.ts.tpl      # Redux slice template
│   ├── reducers.ts.tpl   # Reducer export template
│   └── state.ts.tpl      # Root state template
├── dist/                 # Compiled output
└── package.json
```

### Contributing Guidelines

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Issues & Support

- 🐛 **Bug reports**: [GitHub Issues](https://github.com/Utsav-Virani/react-state-cli/issues)
- 💡 **Feature requests**: [GitHub Issues](https://github.com/Utsav-Virani/react-state-cli/issues)
- 📖 **Documentation**: [GitHub Wiki](https://github.com/Utsav-Virani/react-state-cli/wiki)

## 🗺️ Roadmap

- [ ] **Custom templates** - Support for user-defined templates
- [ ] **Advanced type inference** - Better handling of complex nested objects
- [ ] **Multiple slice generation** - Batch processing of multiple state files
- [ ] **Integration plugins** - VS Code extension, IDE plugins
- [ ] **Configuration file** - `.react-state-cli.json` for project settings
- [ ] **Testing utilities** - Generate test files alongside Redux code

## 🙋 FAQ

**Q: Can I use this with existing Redux setups?**
A: Yes! The CLI generates standard Redux Toolkit code that integrates seamlessly with existing Redux stores.

**Q: Does it work with JavaScript projects?**
A: Currently, the CLI is designed for TypeScript projects. JavaScript support is planned for future releases.

**Q: Can I customize the generated code?**
A: The CLI uses EJS templates that can be modified. Future versions will support custom templates.

**Q: What if my initial state has complex nested objects?**
A: The CLI handles nested objects but may infer them as `object` type. You can manually refine the generated types.

---

**Made with ❤️ by Utsav Virani**

*Star ⭐ this repo if you find it useful!*
