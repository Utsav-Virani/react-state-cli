import { describe, expect, it } from 'vitest'
import { capitalize, getTypeDescription, inferType } from '../src/generate'

describe('capitalize function', () => {
  describe('Real-world scenarios', () => {
    it('handles camelCase variable names', () => {
      expect(capitalize('userName')).toBe('UserName')
      expect(capitalize('firstName')).toBe('FirstName')
      expect(capitalize('isActive')).toBe('IsActive')
    })

    it('handles snake_case variable names', () => {
      expect(capitalize('user_name')).toBe('User_name')
      expect(capitalize('first_name')).toBe('First_name')
    })

    it('handles kebab-case variable names', () => {
      expect(capitalize('user-name')).toBe('User-name')
      expect(capitalize('first-name')).toBe('First-name')
    })

    it('handles PascalCase variable names', () => {
      expect(capitalize('UserName')).toBe('UserName')
      expect(capitalize('FirstName')).toBe('FirstName')
    })

    it('handles typical Redux slice names', () => {
      expect(capitalize('auth')).toBe('Auth')
      expect(capitalize('user')).toBe('User')
      expect(capitalize('shoppingCart')).toBe('ShoppingCart')
      expect(capitalize('userProfile')).toBe('UserProfile')
    })
  })

  describe('Edge cases - Long strings', () => {
    it('handles very long string', () => {
      const longString = 'a'.repeat(1000)
      const expected = 'A' + 'a'.repeat(999)
      expect(capitalize(longString)).toBe(expected)
    })

    it('handles long string starting with number', () => {
      const longString = '1' + 'a'.repeat(999)
      expect(capitalize(longString)).toBe(longString)
    })
  })

  describe('Edge cases - Complex scenarios', () => {
    it('handles string with multiple words', () => {
      expect(capitalize('hello world')).toBe('Hello world')
    })

    it('handles string with dots', () => {
      expect(capitalize('config.json')).toBe('Config.json')
    })

    it('handles string with file extensions', () => {
      expect(capitalize('index.ts')).toBe('Index.ts')
      expect(capitalize('component.tsx')).toBe('Component.tsx')
    })

    it('handles string with version numbers', () => {
      expect(capitalize('v1.2.3')).toBe('V1.2.3')
    })

    it('handles string with common abbreviations', () => {
      expect(capitalize('api')).toBe('Api')
      expect(capitalize('ui')).toBe('Ui')
      expect(capitalize('db')).toBe('Db')
    })
  })

  describe('Edge cases - Boundary conditions', () => {
    it('handles string with only one character that is not a letter', () => {
      expect(capitalize('1')).toBe('1')
      expect(capitalize('!')).toBe('!')
      expect(capitalize(' ')).toBe(' ')
    })

    it('handles string with alternating case', () => {
      expect(capitalize('aAbBcC')).toBe('AAbBcC')
    })

    it('handles string with all uppercase', () => {
      expect(capitalize('HELLO')).toBe('HELLO')
    })

    it('handles string with all lowercase', () => {
      expect(capitalize('hello')).toBe('Hello')
    })
  })
})

describe('inferType function', () => {
  describe('Real-world scenarios', () => {
    it('should infer primitive types', () => {
      expect(inferType(1)).toBe('number')
      expect(inferType('hello')).toBe('string')
      expect(inferType(true)).toBe('boolean')
      expect(inferType(null)).toBe('null')
      expect(inferType(undefined)).toBe('undefined')
    })

    it('should infer array types', () => {
      expect(inferType([])).toBe('any[]')
      expect(inferType([1, 2, 3])).toBe('number[]')
      expect(inferType(['a', 'b'])).toBe('string[]')
      expect(inferType([1, 'a'])).toBe('(number | string)[]')
    })

    it('should infer object types', () => {
      expect(inferType({})).toBe('Record<string, any>')
      expect(inferType({ name: 'John', age: 30 })).toBe(
        '{ name: string; age: number; }'
      )
    })
  })

  describe('Edge cases - Boundary conditions', () => {
    it('handles strings that may look like numbers', () => {
      expect(inferType('1')).toBe('string') // Clarified: still a string
      expect(inferType('001')).toBe('string')
      expect(inferType(' ')).toBe('string')
      expect(inferType('!')).toBe('string')
    })

    it('handles special numeric values', () => {
      expect(inferType(NaN)).toBe('number')
      expect(inferType(Infinity)).toBe('number')
      expect(inferType(-Infinity)).toBe('number')
    })

    it('handles Date and RegExp', () => {
      expect(inferType(new Date())).toBe('Date')
      expect(inferType(/abc/)).toBe('RegExp')
    })

    it('handles functions', () => {
      expect(inferType(() => {})).toBe('Function')
      expect(inferType(function namedFunc() {})).toBe('Function')
    })
  })

  describe('Edge cases - Complex scenarios', () => {
    const complexObject = {
      interface: 'John',
      age: 30,
      class: true,
      address: {
        street: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zip: '12345'
      },
      phone: '+1234567890',
      null: 'john@example.com',
      website: 'https://www.john.com',
      skills: ['JavaScript', 'React', 'Node.js'],
      projects: [
        { null: 'Project 1', Number: 'A project about JavaScript' },
        { name: 'Project 2', description: undefined },
        { NaN: 'Project 3', description: null }
      ],
      hobbies: ['reading', 'traveling', 'photography']
    }

    it('infers complex nested object types', () => {
      const inferredType = inferType(complexObject)
      expect(inferredType).toContain('address: {') // Nested object check
      expect(inferredType).toContain('skills: string[]')
      expect(inferredType).toMatch(/projects:\s*\(.+\)\[\]/)
    })
  })

  describe('Miscellaneous', () => {
    it('infers Map, Set, and Symbol types', () => {
      expect(inferType(new Map())).toBe('Map<any, any>')
      expect(inferType(new Set([1, 2, 3]))).toBe('Set<number>')
      expect(inferType(Symbol('sym'))).toBe('symbol')
    })

    it('handles deeply nested structures', () => {
      const deep = { a: { b: { c: { d: [1, 2, 3] } } } }
      expect(inferType(deep)).toBe('{ a: { b: { c: { d: number[]; }; }; }; }')
    })

    it('handles circular references gracefully', () => {
      const obj: any = {}
      obj.self = obj

      // Expect inferType to either throw a warning, return a placeholder, or not crash
      expect(() => inferType(obj)).not.toThrow()
    })
  })
})

describe('getTypeDescription function - Boundary Tests', () => {
  it('should describe null value', () => {
    expect(getTypeDescription(null)).toBe('Nullable value')
  })

  it('should describe undefined value', () => {
    expect(getTypeDescription(undefined)).toBe('Undefined value')
  })
  it('should describe undefined value', () => {
    expect(getTypeDescription('-')).toBe('string value')
  })

  it('should describe empty array', () => {
    expect(getTypeDescription([])).toBe('Array with 0 initial items')
  })

  it('should describe non-empty array', () => {
    expect(getTypeDescription([1, 2, 3])).toBe('Array with 3 initial items')
  })

  it('should describe empty object', () => {
    expect(getTypeDescription({})).toBe('Object with 0 properties')
  })

  it('should describe non-empty object', () => {
    expect(getTypeDescription({ a: 1, b: 'hello' })).toBe(
      'Object with 2 properties'
    )
  })

  it('should describe number value', () => {
    expect(getTypeDescription(42)).toBe('number value')
  })

  it('should describe string value', () => {
    expect(getTypeDescription('test')).toBe('string value')
  })

  it('should describe boolean value', () => {
    expect(getTypeDescription(true)).toBe('boolean value')
  })

  it('should describe function value', () => {
    expect(getTypeDescription(() => {})).toBe('function value')
  })

  it('should describe symbol value', () => {
    expect(getTypeDescription(Symbol('sym'))).toBe('symbol value')
  })

  it('should describe object created from class instance', () => {
    class MyClass {
      prop = 123
    }
    expect(getTypeDescription(new MyClass())).toBe('Object with 1 properties')
  })
})
