import { describe, expect, it } from 'vitest'
import { isReservedKeyword } from '../src/utils'

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
