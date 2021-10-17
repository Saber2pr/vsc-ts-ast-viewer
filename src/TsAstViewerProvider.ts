import * as vscode from 'vscode'
import { COM_AST_VIEWER_FOCUS } from './constants'
import {
  tsd,
  getChildren,
  getSyntaxKindName,
  parseAst,
  setTs,
} from './TsCompiler'

export class TsAstViewerProvider
  implements vscode.TreeDataProvider<AstNodeItem>
{
  private textEditor?: vscode.TextEditor
  constructor(tslib: any) {
    this.textEditor = vscode.window.activeTextEditor
    setTs(tslib)
  }

  static focusAstNodeRange = (pos: number, end: number) => {
    const textEditor = vscode.window.activeTextEditor
    if (textEditor) {
      const document = textEditor.document
      const startPos = document.positionAt(pos)
      const endPos = document.positionAt(end)
      textEditor.selection = new vscode.Selection(startPos, endPos)
      textEditor.revealRange(new vscode.Range(startPos, endPos))
    }
  }

  createRootNode() {
    if (this.textEditor) {
      const document = this.textEditor.document
      const node = parseAst(document.fileName, document.getText())
      return new AstNodeItem(node, vscode.TreeItemCollapsibleState.Expanded)
    } else {
      return null
    }
  }

  async getChildren(node?: AstNodeItem): Promise<AstNodeItem[]> {
    if (node) {
      const ast = node.ast
      if (ast.getChildCount() > 0) {
        const children = getChildren(ast)
        return children.map(node => {
          let collapsibleState = vscode.TreeItemCollapsibleState.None
          if (node.getChildCount() > 0) {
            collapsibleState = vscode.TreeItemCollapsibleState.Collapsed
          }
          return new AstNodeItem(node, collapsibleState)
        })
      }
    } else {
      return [this.createRootNode()]
    }
  }

  async getTreeItem(node: AstNodeItem): Promise<vscode.TreeItem> {
    const ast = node.ast
    node.command = {
      command: COM_AST_VIEWER_FOCUS,
      title: 'focus ast node',
      arguments: [ast.pos, ast.end],
    }
    return node
  }

  private _onDidChangeTreeData: vscode.EventEmitter<void> =
    new vscode.EventEmitter<void>()

  readonly onDidChangeTreeData: vscode.Event<void> =
    this._onDidChangeTreeData.event

  changeEditor = (textEditor?: vscode.TextEditor) => {
    this.textEditor = textEditor
    this._onDidChangeTreeData.fire()
  }
}

class AstNodeItem extends vscode.TreeItem {
  constructor(
    public readonly ast: tsd.Node,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState = vscode
      .TreeItemCollapsibleState.Collapsed
  ) {
    super(getSyntaxKindName(ast.kind), collapsibleState)
  }
}
