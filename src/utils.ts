import path from 'path'
import fs from 'fs-extra'

/**
 * Parse and validate an initial state file
 * @param filePath - Path to the initState.ts file
 * @returns Promise<Record<string, any>> - The parsed initial state object
 * @throws Error if file is invalid or doesn't export proper object
 */
export const parseInitState = async (
  filePath: string
): Promise<Record<string, any>> => {
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
    let imported: any

    if (filePath.endsWith('.ts')) {
      // For TypeScript files, use ts-node to compile and evaluate
      imported = await importTypeScriptFile(filePath)
    } else {
      imported = await import(filePath)
    }

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

    // Note: Empty object validation is handled by generateFilesFromInitState

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
 * Import a TypeScript file using ts-node
 */
// * Testcase: added
export const importTypeScriptFile = async (filePath: string): Promise<any> => {
  try {
    // Use dynamic import with ts-node/esm loader
    const { register } = await import('ts-node')

    // Register ts-node for ESM
    register({
      esm: true,
      experimentalSpecifierResolution: 'node'
    })

    // Import the TypeScript file
    const absolutePath = path.resolve(filePath)
    const fileUrl = `file://${absolutePath}`
    return await import(fileUrl)
  } catch (error) {
    // Fallback: try to compile and evaluate manually
    const tsNode = await import('ts-node')
    const service = tsNode.create({
      compilerOptions: {
        module: 'ESNext',
        target: 'ES2020',
        esModuleInterop: true,
        allowSyntheticDefaultImports: true
      }
    })

    const fileContent = await fs.readFile(filePath, 'utf-8')
    const compiled = service.compile(fileContent, filePath)

    // Create a temporary file to import
    const tempFile = filePath.replace('.ts', '.temp.js')
    await fs.writeFile(tempFile, compiled)

    try {
      const absoluteTempPath = path.resolve(tempFile)
      const result = await import(`file://${absoluteTempPath}`)
      await fs.remove(tempFile)
      return result
    } catch (importError) {
      await fs.remove(tempFile)
      throw importError
    }
  }
}

/**
 * Check if a string is a reserved JavaScript keyword
 */
// * Testcase: added
export const isReservedKeyword = (word: string): boolean => {
  const reservedWords = new Set([
    'break',
    'case',
    'catch',
    'true',
    'false',
    'console',
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
    'null',
    'undefined',
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
    'public',
    'NaN',
    'Infinity',
    'Date',
    'RegExp',
    'Map',
    'Set',
    'Symbol'
  ])

  return reservedWords.has(word)
}
