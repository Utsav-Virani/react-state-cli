import path from 'path'
import fs from 'fs-extra'
import { expect } from 'chai'
import { generateFilesFromInitState } from '../src/generate'
import { beforeEach, describe, it } from 'vitest'

const tmpDir = path.resolve(__dirname, '..', '__temp__')

async function writeInitState(
  sliceName: string,
  content: string
): Promise<string> {
  const sliceDir = path.join(tmpDir, 'src', 'redux', sliceName)
  const filePath = path.join(sliceDir, 'initState.ts')
  await fs.ensureDir(sliceDir)
  await fs.writeFile(filePath, content)
  return filePath
}

describe('generateFilesFromInitState', () => {
  beforeEach(async () => {
    await fs.emptyDir(tmpDir)
  })

  it('should generate slice, types, reducers, and state files', async () => {
    const initStatePath = await writeInitState(
      'user',
      'export default { name: \'Alice\', age: 25 }'
    )
    await generateFilesFromInitState(initStatePath)

    const expectedFiles = ['slice.ts', 'types.ts', 'reducers.ts']
    for (const file of expectedFiles) {
      const filePath = path.join(tmpDir, 'src', 'redux', 'user', file)
      const exists = await fs.pathExists(filePath)
      expect(exists).to.be.true
    }

    const statePath = path.join(tmpDir, 'src', 'redux', 'state.ts')
    expect(await fs.pathExists(statePath)).to.be.true
  })

  it('should not write any files in dryRun mode', async () => {
    const initStatePath = await writeInitState(
      'user',
      'export default { x: 1 }'
    )
    await generateFilesFromInitState(initStatePath, { dryRun: true })

    const generatedFiles = ['slice.ts', 'types.ts', 'reducers.ts', 'state.ts']
    for (const file of generatedFiles) {
      const fullPath = path.join(tmpDir, 'src', 'redux', 'user', file)
      expect(await fs.pathExists(fullPath)).to.be.false
    }

    const stateFile = path.join(tmpDir, 'src', 'redux', 'state.ts')
    expect(await fs.pathExists(stateFile)).to.be.false
  })

  it('should skip state.ts if it already exists', async () => {
    const initStatePath = await writeInitState(
      'user',
      'export default { test: true }'
    )
    const statePath = path.join(tmpDir, 'src', 'redux', 'state.ts')

    await fs.ensureFile(statePath)
    await fs.writeFile(statePath, '// existing state')

    await generateFilesFromInitState(initStatePath)

    const content = await fs.readFile(statePath, 'utf-8')
    expect(content).to.equal('// existing state')
  })

  it('should throw if initState object is empty', async () => {
    const initStatePath = await writeInitState('User', 'export default {}')

    try {
      await generateFilesFromInitState(initStatePath)
      throw new Error('Expected error was not thrown')
    } catch (err: any) {
      expect(err.message).to.include('Initial state object is empty')
    }
  })

  it('should handle large state object', async () => {
    const largeState = Array.from({ length: 100 })
      .map((_, i) => `key${i}: ${i}`)
      .join(',\n')
    const initStatePath = await writeInitState(
      'big',
      `export default {\n${largeState}\n}`
    )

    await generateFilesFromInitState(initStatePath)

    const typesFile = path.join(tmpDir, 'src', 'redux', 'big', 'types.ts')
    const content = await fs.readFile(typesFile, 'utf-8')
    expect(content).to.include('key99')
  })

  it('should throw if file does not exist', async () => {
    const nonExistentPath = path.join(
      tmpDir,
      'src',
      'redux',
      'missing',
      'initState.ts'
    )

    try {
      await generateFilesFromInitState(nonExistentPath)
      throw new Error('Expected error was not thrown')
    } catch (err: any) {
      expect(err.message).to.include('Failed to generate files')
    }
  })

  it('should throw if file contains invalid JavaScript', async () => {
    const initStatePath = await writeInitState(
      'broken',
      'export default { name:'
    )

    try {
      await generateFilesFromInitState(initStatePath)
      throw new Error('Expected error was not thrown')
    } catch (err: any) {
      expect(err.message).to.include('Failed to generate files')
    }
  })
})
