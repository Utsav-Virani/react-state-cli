#!/usr/bin/env ts-node

import { Command } from 'commander'
import path from 'path'
import { generateFilesFromInitState } from './generate'

const program = new Command()

program
  .name('redux-generator')
  .description('CLI to generate Redux boilerplate from initState.ts')
  .version('1.0.0')

program
  .command('generate')
  .argument('<initStatePath>', 'Path to initState.ts file')
  .action((initStatePath) => {
    const fullPath = path.resolve(process.cwd(), initStatePath)
    generateFilesFromInitState(fullPath)
  })

program.parse()
