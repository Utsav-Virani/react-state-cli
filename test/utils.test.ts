import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import {
  importTypeScriptFile,
  isReservedKeyword,
  parseInitState
} from '../src/utils'

import fs from 'fs-extra'
import path from 'path'
import os from 'os'

describe('isReservedKeyword function', () => {
  describe('Real-world scenarios', () => {
    it('should return true for reserved JavaScript keywords', () => {
      expect(isReservedKeyword('for')).toBe(true)
      expect(isReservedKeyword('while')).toBe(true)
      expect(isReservedKeyword('if')).toBe(true)
      expect(isReservedKeyword('else')).toBe(true)
      expect(isReservedKeyword('return')).toBe(true)
      expect(isReservedKeyword('class')).toBe(true)
      expect(isReservedKeyword('const')).toBe(true)
      expect(isReservedKeyword('let')).toBe(true)
      expect(isReservedKeyword('var')).toBe(true)
      expect(isReservedKeyword('function')).toBe(true)
      expect(isReservedKeyword('try')).toBe(true)
      expect(isReservedKeyword('catch')).toBe(true)
      expect(isReservedKeyword('new')).toBe(true)
      expect(isReservedKeyword('null')).toBe(true)
      expect(isReservedKeyword('true')).toBe(true)
      expect(isReservedKeyword('false')).toBe(true)
    })

    it('should return false for non-keywords and identifiers', () => {
      expect(isReservedKeyword('hello')).toBe(false)
      expect(isReservedKeyword('myVar')).toBe(false)
      expect(isReservedKeyword('returnValue')).toBe(false)
      expect(isReservedKeyword('functionName')).toBe(false)
      expect(isReservedKeyword('letmein')).toBe(false)
    })

    it('should handle case sensitivity correctly', () => {
      expect(isReservedKeyword('Function')).toBe(false)
      expect(isReservedKeyword('Class')).toBe(false)
      expect(isReservedKeyword('Var')).toBe(false)
    })

    it('should handle edge cases', () => {
      expect(isReservedKeyword('')).toBe(false)
      expect(isReservedKeyword('123')).toBe(false)
      expect(isReservedKeyword('$for')).toBe(false)
      expect(isReservedKeyword('while1')).toBe(false)
      expect(isReservedKeyword('_var')).toBe(false)
    })
  })
})

describe('importTypeScriptFile function', () => {
  const tmpDir = path.join(os.tmpdir(), 'ts-import-test')

  beforeAll(async () => {
    await fs.ensureDir(tmpDir)
  })

  afterAll(async () => {
    await fs.remove(tmpDir)
  })

  const createTempTSFile = async (
    name: string,
    content: string
  ): Promise<string> => {
    const filePath = path.join(tmpDir, name)
    await fs.writeFile(filePath, content)
    return filePath
  }

  describe('Real-world usage', () => {
    it('should import a valid TypeScript module with default export', async () => {
      const filePath = await createTempTSFile(
        'defaultExport.ts',
        `
        const data = { message: 'hello world' }
        export default data
      `
      )
      const module = await importTypeScriptFile(filePath)
      expect(module.default.message).toBe('hello world')
    })

    it('should import named exports from a TypeScript file', async () => {
      const filePath = await createTempTSFile(
        'namedExport.ts',
        `
        export const value = 42
      `
      )
      const module = await importTypeScriptFile(filePath)
      expect(module.value).toBe(42)
    })

    it('should import mixed exports (default + named)', async () => {
      const filePath = await createTempTSFile(
        'mixedExport.ts',
        `
        const config = { env: 'test' }
        export default config
        export const version = '1.0.0'
      `
      )
      const module = await importTypeScriptFile(filePath)
      expect(module.default.env).toBe('test')
      expect(module.version).toBe('1.0.0')
    })
  })

  describe('Edge cases', () => {
    it('should throw if the file has syntax error', async () => {
      const filePath = await createTempTSFile(
        'badSyntax.ts',
        `
        export const x == 5
      `
      )
      await expect(importTypeScriptFile(filePath)).rejects.toThrow()
    })

    it('should throw if the file does not exist', async () => {
      const filePath = path.join(tmpDir, 'nonexistent.ts')
      await expect(importTypeScriptFile(filePath)).rejects.toThrow()
    })

    it('should handle file with no exports', async () => {
      const filePath = await createTempTSFile(
        'noExports.ts',
        `
        const secret = 'internal only'
      `
      )
      const module = await importTypeScriptFile(filePath)
      expect(Object.keys(module)).toEqual([])
    })
  })
  describe('Boundary and unusual conditions', () => {
    it('should work with a large file with many exports', async () => {
      const manyExports = Array.from(
        { length: 100 },
        (_, i) => `export const val${i} = ${i}`
      ).join('\n')
      const filePath = await createTempTSFile('manyExports.ts', manyExports)
      const module = await importTypeScriptFile(filePath)
      expect(module.val0).toBe(0)
      expect(module.val99).toBe(99)
    })

    it('should support exporting functions and classes', async () => {
      const filePath = await createTempTSFile(
        'functionsAndClasses.ts',
        `
        export function greet(name: string) {
          return 'Hello, ' + name
        }
        export class Greeter {
          greet(name: string) {
            return 'Hi, ' + name
          }
        }
      `
      )
      const module = await importTypeScriptFile(filePath)
      expect(module.greet('Alice')).toBe('Hello, Alice')
      const greeter = new module.Greeter()
      expect(greeter.greet('Bob')).toBe('Hi, Bob')
    })
  })
})

describe('parseInitState function', () => {
  const tmpDir = path.join(os.tmpdir(), 'parse-init-state-test')

  beforeAll(async () => {
    await fs.ensureDir(tmpDir)
  })

  afterAll(async () => {
    await fs.remove(tmpDir)
  })

  const createTempFile = async (
    name: string,
    content: string
  ): Promise<string> => {
    const filePath = path.join(tmpDir, name)
    await fs.writeFile(filePath, content)
    return filePath
  }

  describe('Real-world usage', () => {
    it('should parse a valid JS file with default object export', async () => {
      const filePath = await createTempFile(
        'validExport.js',
        `
        export default {
          foo: 'bar',
          baz: 123
        }
        `
      )
      const result = await parseInitState(filePath)
      expect(result).toEqual({ foo: 'bar', baz: 123 })
    })

    it('should throw if file does not exist', async () => {
      const filePath = path.join(tmpDir, 'nonexistent.js')
      await expect(parseInitState(filePath)).rejects.toThrow(/File not found/)
    })

    it('should throw if path is not a file', async () => {
      const dirPath = path.join(tmpDir, 'aDirectory')
      await fs.ensureDir(dirPath)
      await expect(parseInitState(dirPath)).rejects.toThrow(/not a file/)
    })
  })

  describe('Validation of exports', () => {
    it('should throw if default export is missing', async () => {
      const filePath = await createTempFile(
        'noDefaultExport.js',
        `
        export const foo = 1
      `
      )
      await expect(parseInitState(filePath)).rejects.toThrow(/default object/)
    })

    it('should throw if default export is not an object', async () => {
      const filePath = await createTempFile(
        'defaultIsNotObject.js',
        `
        export default 42
      `
      )
      await expect(parseInitState(filePath)).rejects.toThrow(
        /must be an object/
      )
    })

    it('should throw if default export is an array', async () => {
      const filePath = await createTempFile(
        'defaultIsArray.js',
        `
        export default [1, 2, 3]
      `
      )
      await expect(parseInitState(filePath)).rejects.toThrow(/not an array/)
    })
  })

  describe('Object structure validation', () => {
    it('should throw if property key is empty string or not a string', async () => {
      const filePath = await createTempFile(
        'invalidKey.js',
        `
        export default {
          '': 'empty',
          123: 'number key'
        }
      `
      )
      // Because JS keys are always strings, the number key is coerced, so we only test empty string key.
      await expect(parseInitState(filePath)).rejects.toThrow(
        /Invalid property key/
      )
    })

    it('should throw if property key is a reserved JavaScript keyword', async () => {
      // Assuming isReservedKeyword('for') === true
      const filePath = await createTempFile(
        'reservedKeyword.js',
        `
        export default {
          for: 'loop'
        }
      `
      )
      await expect(parseInitState(filePath)).rejects.toThrow(
        /reserved JavaScript keyword/
      )
    })

    it('should pass if all keys are valid and non-reserved', async () => {
      const filePath = await createTempFile(
        'validKeys.js',
        `
        export default {
          name: 'ChatGPT',
          age: 4,
          _private: true
        }
      `
      )
      const result = await parseInitState(filePath)
      expect(result).toEqual({
        name: 'ChatGPT',
        age: 4,
        _private: true
      })
    })
  })

  describe('Handling TypeScript files', () => {
    it('should parse a valid TypeScript file with default export', async () => {
      const filePath = await createTempFile(
        'validTS.ts',
        `
        const state = { ready: true }
        export default state
      `
      )
      const result = await parseInitState(filePath)
      expect(result).toEqual({ ready: true })
    })
  })
  describe('Empty and Half State Cases', () => {
    it('should accept an empty object as default export', async () => {
      const filePath = await createTempFile(
        'emptyState.js',
        `
        export default {}
      `
      )
      const result = await parseInitState(filePath)
      expect(result).toEqual({})
    })

    it('should accept an object with keys having null or undefined values (half state)', async () => {
      const filePath = await createTempFile(
        'halfState.js',
        `
        export default {
          foo: null,
          bar: undefined,
          baz: 'valid'
        }
      `
      )
      const result = await parseInitState(filePath)
      expect(result).toEqual({
        foo: null,
        bar: undefined,
        baz: 'valid'
      })
    })

    it('should throw if object has keys that are empty strings', async () => {
      const filePath = await createTempFile(
        'emptyKey.js',
        `
        export default {
          "": 'empty key'
        }
      `
      )
      await expect(parseInitState(filePath)).rejects.toThrow(
        /Invalid property key/
      )
    })
  })
})
