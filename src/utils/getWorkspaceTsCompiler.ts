import { join } from 'path'
import { getRootPath } from './getRootPath'

export function getWorkspaceTsCompiler() {
  const workspace = getRootPath()
  const tslibPath = join(workspace, 'node_modules/typescript/lib/typescript.js')
  try {
    return require(tslibPath)
  } catch (error) {
    console.log(error)
    return null
  }
}
