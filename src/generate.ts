import path from 'path'
import fs from 'fs-extra'
import chalk from 'chalk'
import { parseInitState } from './utils.js'
import ejs from 'ejs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export interface GenerateOptions {
  verbose?: boolean
  dryRun?: boolean
}

export const generateFilesFromInitState = async (
  initStatePath: string,
  options: GenerateOptions = {}
): Promise<void> => {
  try {
    const originalSliceDir = path.dirname(initStatePath)
    const sliceName = path.basename(originalSliceDir)

    // Determine Redux structure and slice directory
    let stateFilePath: string
    let reduxRootDir: string
    let sliceDir: string

    // Check if we're already in a Redux structure
    const parentDir = path.dirname(originalSliceDir)
    const parentDirName = path.basename(parentDir)

    if (parentDirName === 'redux' || parentDirName === 'store') {
      // We're in src/redux/user/ structure - keep existing structure
      reduxRootDir = parentDir
      sliceDir = originalSliceDir
      stateFilePath = path.resolve(reduxRootDir, 'state.ts')
    } else {
      // We need to create/find the redux structure
      // Look for existing src/redux or create it
      const cwd = process.cwd()
      const srcReduxPath = path.resolve(cwd, 'src', 'redux')
      const srcStorePath = path.resolve(cwd, 'src', 'store')

      if (await fs.pathExists(srcReduxPath)) {
        reduxRootDir = srcReduxPath
      } else if (await fs.pathExists(srcStorePath)) {
        reduxRootDir = srcStorePath
      } else {
        // Create src/redux structure
        reduxRootDir = srcReduxPath
        await fs.ensureDir(reduxRootDir)
        if (options.verbose) {
          console.log(chalk.blue(`📁 Created Redux directory: ${reduxRootDir}`))
        }
      }

      // Create the slice directory in the Redux structure
      sliceDir = path.resolve(reduxRootDir, sliceName)
      await fs.ensureDir(sliceDir)
      stateFilePath = path.resolve(reduxRootDir, 'state.ts')
    }

    if (options.verbose) {
      console.log(chalk.blue(`📂 Original directory: ${originalSliceDir}`))
      console.log(chalk.blue(`📂 Slice directory: ${sliceDir}`))
      console.log(chalk.blue(`📝 Slice name: ${sliceName}`))
      console.log(chalk.blue(`📁 Redux root directory: ${reduxRootDir}`))
      console.log(chalk.blue(`📄 State file path: ${stateFilePath}`))
    }

    const initState = await parseInitState(initStatePath)
    const keys = Object.keys(initState)

    if (keys.length === 0) {
      throw new Error('Initial state object is empty')
    }

    // --- Generate slice.ts ---
    const actionCases = keys
      .map(
        key =>
          `    set${capitalize(
            key
          )}: (state, action: PayloadAction<${inferType(initState[key])}>) => { 
      state.${key} = action.payload 
    },`
      )
      .join('\n')

    const actionExports = keys.map(key => `set${capitalize(key)}`).join(', ')

    const sliceTemplate = await fs.readFile(
      path.resolve(__dirname, '../templates/slice.ts.tpl'),
      'utf-8'
    )
    const interfaceName = `${capitalize(sliceName)}State`

    const renderedSlice = ejs.render(sliceTemplate, {
      sliceName,
      initialStateString: JSON.stringify(initState, null, 2),
      actionCases,
      actionExports,
      interfaceName
    })

    if (options.dryRun) {
      console.log(chalk.yellow('🔍 [DRY RUN] Would generate slice.ts:'))
      console.log(chalk.gray(renderedSlice))
    } else {
      await fs.writeFile(path.resolve(sliceDir, 'slice.ts'), renderedSlice)
      console.log(chalk.green(`✅ slice.ts generated at ${sliceDir}`))
    }

    // --- Generate reducers.ts ---
    const reducersTemplate = await fs.readFile(
      path.resolve(__dirname, '../templates/reducers.ts.tpl'),
      'utf-8'
    )

    if (options.dryRun) {
      console.log(chalk.yellow('🔍 [DRY RUN] Would generate reducers.ts'))
    } else {
      await fs.writeFile(
        path.resolve(sliceDir, 'reducers.ts'),
        reducersTemplate
      )
      console.log(chalk.green(`✅ reducers.ts generated at ${sliceDir}`))
    }

    // --- Generate types.ts ---
    const interfaceLines = Object.entries(initState).map(([key, value]) => {
      const type = inferType(value)
      return `  /** ${getTypeDescription(value)} */\n  ${key}: ${type}`
    })

    const interfaceString = `export interface ${interfaceName} {\n${interfaceLines.join(
      '\n'
    )}\n}`

    const typesPath = path.resolve(sliceDir, 'types.ts')

    if (options.dryRun) {
      console.log(chalk.yellow('🔍 [DRY RUN] Would generate types.ts:'))
      console.log(chalk.gray(interfaceString))
    } else {
      await fs.writeFile(typesPath, interfaceString)
      console.log(chalk.green(`✅ types.ts generated at ${typesPath}`))
    }

    // --- Generate or update state.ts ---
    const stateTemplatePath = path.resolve(
      __dirname,
      '../templates/state.ts.tpl'
    )
    const stateTemplate = await fs.readFile(stateTemplatePath, 'utf-8')

    // Determine the correct import path for the types file
    // Calculate relative path from state.ts location to types.ts location
    const typesFilePath = path.resolve(sliceDir, 'types.ts')
    const stateDir = path.dirname(stateFilePath)
    const relativePath = path.relative(stateDir, typesFilePath)

    // Convert to proper import path (use forward slashes and remove .ts extension)
    const importPath = relativePath.replace(/\\/g, '/').replace(/\.ts$/, '')

    const renderedState = ejs.render(stateTemplate, {
      sliceName,
      interfaceName,
      importPath: `./${importPath}`
    })

    const stateExists = await fs.pathExists(stateFilePath)

    if (!stateExists) {
      if (options.dryRun) {
        console.log(chalk.yellow('🔍 [DRY RUN] Would create state.ts:'))
        console.log(chalk.gray(renderedState))
      } else {
        await fs.writeFile(stateFilePath, renderedState)
        console.log(chalk.green(`✅ state.ts created at ${stateFilePath}`))
      }
    } else {
      if (options.verbose) {
        console.log(
          chalk.yellow(`⚠️  state.ts already exists at ${stateFilePath}`)
        )
        console.log(
          chalk.blue(
            `💡 Consider manually adding: ${sliceName}: ${interfaceName}`
          )
        )
      }
    }

    // Summary
    if (options.verbose && !options.dryRun) {
      console.log(chalk.cyan('\n📊 Generated files summary:'))
      console.log(
        chalk.cyan(`   • slice.ts - Redux slice with ${keys.length} actions`)
      )
      console.log(chalk.cyan('   • reducers.ts - Reducer export'))
      console.log(chalk.cyan('   • types.ts - TypeScript interface'))
      console.log(
        chalk.cyan(
          `   • state.ts - ${stateExists ? 'already exists' : 'created'}`
        )
      )
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to generate files: ${error.message}`)
    }
    throw error
  }
}

// * Test added
export const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1)

// export const inferType = (value: unknown): string => {
//   if (value === null) return 'null'
//   if (value === undefined) return 'undefined'
//   if (Array.isArray(value)) {
//     if (value.length === 0) return 'any[]'
//     // Try to infer array element type from first element
//     const firstElementType = inferType(value[0])
//     return `${firstElementType}[]`
//   }
//   if (typeof value === 'object') {
//     // For objects, we could either use a generic Record type or create nested interfaces
//     // For now, let's use a more specific type
//     if (Object.keys(value).length === 0) return 'Record<string, any>'
//     return 'Record<string, any>' // Could be enhanced to generate nested interfaces
//   }
//   return typeof value
// }

// * Test added
export const inferType = (value: unknown): string => {
  const seen = new WeakSet()

  const helper = (val: unknown): string => {
    if (val === null) return 'null'
    if (val === undefined) return 'undefined'

    // Detect special built-in types
    if (val instanceof Date) return 'Date'
    if (val instanceof RegExp) return 'RegExp'
    if (val instanceof Map) {
      // For Map, try to infer key and value types if possible
      if (val.size === 0) return 'Map<any, any>'

      const keyTypes = new Set<string>()
      const valueTypes = new Set<string>()
      val.forEach((v, k) => {
        keyTypes.add(helper(k))
        valueTypes.add(helper(v))
      })

      const keyType =
        keyTypes.size === 1
          ? [...keyTypes][0]
          : '(' + [...keyTypes].join(' | ') + ')'
      const valueType =
        valueTypes.size === 1
          ? [...valueTypes][0]
          : '(' + [...valueTypes].join(' | ') + ')'

      return `Map<${keyType}, ${valueType}>`
    }
    if (val instanceof Set) {
      if (val.size === 0) return 'Set<any>'

      const elemTypes = new Set<string>()
      val.forEach(v => elemTypes.add(helper(v)))
      const elemType =
        elemTypes.size === 1
          ? [...elemTypes][0]
          : '(' + [...elemTypes].join(' | ') + ')'

      return `Set<${elemType}>`
    }

    const type = typeof val

    if (Array.isArray(val)) {
      if (val.length === 0) return 'any[]'

      // Infer types of all elements (not just first)
      const elementTypes = Array.from(new Set(val.map(item => helper(item))))
      const joinedTypes =
        elementTypes.length === 1
          ? elementTypes[0]
          : `(${elementTypes.join(' | ')})`
      return `${joinedTypes}[]`
    }

    if (type === 'object') {
      if (seen.has(val)) return 'any /* circular */'
      seen.add(val)

      const obj = val as Record<string, unknown>
      const keys = Object.keys(obj)
      if (keys.length === 0) return 'Record<string, any>'

      const props = keys.map(key => {
        const propType = helper(obj[key])
        return `${key}: ${propType};`
      })

      return `{ ${props.join(' ')} }`
    }

    if (type === 'function') return 'Function'
    if (type === 'symbol') return 'symbol'

    return type
  }

  return helper(value)
}

// * Test added
export const getTypeDescription = (value: unknown): string => {
  if (value === null) return 'Nullable value'
  if (value === undefined) return 'Undefined value'
  if (Array.isArray(value)) {
    return `Array with ${value.length} initial items`
  }
  if (typeof value === 'object') {
    return `Object with ${Object.keys(value).length} properties`
  }
  return `${typeof value} value`
}
