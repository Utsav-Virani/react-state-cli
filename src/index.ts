#!/usr/bin/env node

import { Command } from 'commander' //CLI framework
import path from 'path' // Helps resolve full file paths
import fs from 'fs-extra' // Extends fs with more features
import chalk from 'chalk' // Colored console output
import { generateFilesFromInitState } from './generate.js' //Function to generate files from initState.ts

//Setup CLI Program
const program = new Command()

program
  .name('react-state-cli')
  .description('CLI to generate Redux boilerplate from initState.ts')
  .version('1.1.0')

// Generate Command
program
  .command('generate')
  .argument('<initStatePath>', 'Path to initState.ts file')
  .option('-v, --verbose', 'Enable verbose logging') //Prints extra debug output
  .option('--dry-run', 'Show what would be generated without creating files') // Simulates generation, doesn't actually write files
  //Command Logic
  .action(async (initStatePath, options) => {
    try {
      const fullPath = path.resolve(process.cwd(), initStatePath)

      //? Validate input file exists
      if (!(await fs.pathExists(fullPath))) {
        console.error(chalk.red(`❌ Error: File not found: ${fullPath}`))
        process.exit(1)
      }

      //? Validate it's a TypeScript file
      if (!fullPath.endsWith('.ts') && !fullPath.endsWith('.js')) {
        console.error(chalk.red('❌ Error: File must be a .ts or .js file'))
        process.exit(1)
      }

      if (options.verbose) {
        console.log(chalk.blue(`🔍 Processing: ${fullPath}`))
      }

      //? Main task Execution
      await generateFilesFromInitState(fullPath, options)

      // * Success Message
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

// ? Executes the CLI command
program.parse()
