#!/usr/bin/env node

import { Command } from 'commander'
import path from 'path'
import fs from 'fs-extra'
import chalk from 'chalk'
import { generateFilesFromInitState } from './generate.js'

const program = new Command()

program
  .name('react-state-cli')
  .description('CLI to generate Redux boilerplate from initState.ts')
  .version('1.0.1')

program
  .command('generate')
  .argument('<initStatePath>', 'Path to initState.ts file')
  .option('-v, --verbose', 'Enable verbose logging')
  .option('--dry-run', 'Show what would be generated without creating files')
  .action(async (initStatePath, options) => {
    try {
      const fullPath = path.resolve(process.cwd(), initStatePath)

      // Validate input file exists
      if (!(await fs.pathExists(fullPath))) {
        console.error(chalk.red(`❌ Error: File not found: ${fullPath}`))
        process.exit(1)
      }

      // Validate it's a TypeScript file
      if (!fullPath.endsWith('.ts') && !fullPath.endsWith('.js')) {
        console.error(chalk.red('❌ Error: File must be a .ts or .js file'))
        process.exit(1)
      }

      if (options.verbose) {
        console.log(chalk.blue(`🔍 Processing: ${fullPath}`))
      }

      await generateFilesFromInitState(fullPath, options)

      console.log(chalk.green('🎉 Redux boilerplate generated successfully!'))
    } catch (error) {
      console.error(
        chalk.red(
          `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`
        )
      )
      if (options.verbose && error instanceof Error) {
        console.error(chalk.red(error.stack))
      }
      process.exit(1)
    }
  })

program.parse()
