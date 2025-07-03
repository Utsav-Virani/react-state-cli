export async function parseInitState(filePath: string): Promise<Record<string, any>> {
    const imported = await import(filePath)
    if (!imported.default || typeof imported.default !== 'object') {
      throw new Error('initState.ts must export a default object')
    }
    return imported.default
  }
  