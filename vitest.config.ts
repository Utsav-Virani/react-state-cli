import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true, // so you can use `describe`, `it`, `expect` globally like Jest
    environment: 'node'
  }
})
