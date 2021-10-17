import type tsd from 'typescript/lib/typescript'
let ts: typeof import('typescript/lib/typescript')

export { tsd }

export function setTs(_ts: typeof ts) {
  ts = _ts
}

export function parseAst(fileName: string, sourceText: string): tsd.Node {
  return ts.createSourceFile(fileName, sourceText, ts.ScriptTarget.ESNext, true)
}

export function getChildren(node: tsd.Node) {
  return node.getChildren()
}

export function getSyntaxKindName(kind: tsd.SyntaxKind) {
  if (_kindNames) {
    return _kindNames[kind]
  }
  _kindNames = getKindNamesForApi()
  return _kindNames[kind]
}

type KindNames = { [kind: number]: string }
let _kindNames: KindNames = null

function getKindNamesForApi() {
  // some SyntaxKinds are repeated, so only use the first one
  const kindNames: KindNames = {}
  for (const name of Object.keys(ts.SyntaxKind).filter(k =>
    isNaN(parseInt(k, 10))
  )) {
    const value = ts.SyntaxKind[name]
    if (kindNames[value] == null) {
      kindNames[value] = name
    }
  }
  return kindNames
}
