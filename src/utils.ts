import path from 'path'
import fs from 'fs-extra'

/**
 * Parse and validate an initial state file
 * @param filePath - Path to the initState.ts file
 * @returns Promise<Record<string, any>> - The parsed initial state object
 * @throws Error if file is invalid or doesn't export proper object
 */
export async function parseInitState(
  filePath: string
): Promise<Record<string, any>> {
  try {
    // Verify file exists
    if (!(await fs.pathExists(filePath))) {
      throw new Error(`File not found: ${filePath}`)
    }

    // Get file stats
    const stats = await fs.stat(filePath)
    if (!stats.isFile()) {
      throw new Error(`Path is not a file: ${filePath}`)
    }

    // Import the file
    const imported = await import(filePath)

    // Validate default export exists
    if (!imported.default) {
      throw new Error(
        `File must export a default object. Found: ${typeof imported.default}`
      )
    }

    // Validate it's an object
    if (typeof imported.default !== 'object' || imported.default === null) {
      throw new Error(
        `Default export must be an object. Found: ${typeof imported.default}`
      )
    }

    // Validate it's not an array
    if (Array.isArray(imported.default)) {
      throw new Error('Default export must be an object, not an array')
    }

    // Validate it's not empty
    const keys = Object.keys(imported.default)
    if (keys.length === 0) {
      throw new Error('Default export object cannot be empty')
    }

    // Validate object structure
    for (const [key] of Object.entries(imported.default)) {
      if (typeof key !== 'string' || key.trim() === '') {
        throw new Error(`Invalid property key: ${key}`)
      }

      // Check for reserved JavaScript keywords
      if (isReservedKeyword(key)) {
        throw new Error(
          `Property name "${key}" is a reserved JavaScript keyword`
        )
      }
    }

    return imported.default as Record<string, any>
  } catch (error) {
    if (error instanceof Error) {
      // Re-throw with more context
      throw new Error(
        `Failed to parse initial state from ${path.basename(filePath)}: ${error.message}`
      )
    }
    throw error
  }
}

/**
 * Check if a string is a reserved JavaScript keyword
 */
function isReservedKeyword(word: string): boolean {
  const reservedWords = [
    'break',
    'case',
    'catch',
    'class',
    'const',
    'continue',
    'debugger',
    'default',
    'delete',
    'do',
    'else',
    'export',
    'extends',
    'finally',
    'for',
    'function',
    'if',
    'import',
    'in',
    'instanceof',
    'new',
    'return',
    'super',
    'switch',
    'this',
    'throw',
    'try',
    'typeof',
    'var',
    'void',
    'while',
    'with',
    'yield',
    'let',
    'static',
    'enum',
    'implements',
    'interface',
    'package',
    'private',
    'protected',
    'public'
  ]
  return reservedWords.includes(word.toLowerCase())
}

/**
 * Validate that a string is a valid TypeScript identifier
 */
export function isValidIdentifier(name: string): boolean {
  // Must start with letter, underscore, or dollar sign
  // Can contain letters, digits, underscores, or dollar signs
  const identifierRegex = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/
  return identifierRegex.test(name) && !isReservedKeyword(name)
}
