import path from 'path'
import fs from 'fs-extra'
import chalk from 'chalk'
import { parseInitState } from './utils'
import ejs from 'ejs'

export interface GenerateOptions {
  verbose?: boolean
  dryRun?: boolean
}

export async function generateFilesFromInitState(
  initStatePath: string,
  options: GenerateOptions = {}
): Promise<void> {
  try {
    const sliceDir = path.dirname(initStatePath)
    const sliceName = path.basename(sliceDir)
    const reduxDir = path.resolve(sliceDir, '..') // goes to /redux
    const stateFilePath = path.resolve(reduxDir, 'state.ts')

    if (options.verbose) {
      console.log(chalk.blue(`📂 Slice directory: ${sliceDir}`))
      console.log(chalk.blue(`📝 Slice name: ${sliceName}`))
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

    const renderedState = ejs.render(stateTemplate, {
      sliceName,
      interfaceName
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

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function inferType(value: any): string {
  if (value === null) return 'null'
  if (value === undefined) return 'undefined'
  if (Array.isArray(value)) {
    if (value.length === 0) return 'any[]'
    // Try to infer array element type from first element
    const firstElementType = inferType(value[0])
    return `${firstElementType}[]`
  }
  if (typeof value === 'object') {
    // For objects, we could either use a generic Record type or create nested interfaces
    // For now, let's use a more specific type
    if (Object.keys(value).length === 0) return 'Record<string, any>'
    return 'Record<string, any>' // Could be enhanced to generate nested interfaces
  }
  return typeof value
}

function getTypeDescription(value: any): string {
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
