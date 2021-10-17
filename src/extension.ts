import * as vscode from 'vscode'
import { COM_AST_VIEWER_FOCUS } from './constants'

import { TsAstViewerProvider } from './TsAstViewerProvider'
import { getWorkspaceTsCompiler } from './utils/getWorkspaceTsCompiler'

// install
export function activate(context: vscode.ExtensionContext) {
  const tslib = getWorkspaceTsCompiler()
  vscode.commands.executeCommand('setContext', 'no-tslib', !tslib)
  if (!tslib) return
  const Provider = new TsAstViewerProvider(tslib)

  const TreeView = vscode.window.createTreeView('ts-ast-viewer', {
    treeDataProvider: Provider,
  })

  context.subscriptions.push(
    TreeView,
    vscode.commands.registerCommand(
      COM_AST_VIEWER_FOCUS,
      TsAstViewerProvider.focusAstNodeRange
    ),
    vscode.window.onDidChangeActiveTextEditor(Provider.changeEditor)
  )
}

// uninstall
export function deactivate() {}
