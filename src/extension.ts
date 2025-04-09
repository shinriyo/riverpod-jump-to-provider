import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

function toPascalCase(input: string): string {
  return input.replace(/(^|_)(\w)/g, (_, __, c) => c.toUpperCase());
}

async function jumpToRiverpodOrigin(document: vscode.TextDocument, position: vscode.Position): Promise<vscode.Location | null> {
  const range = document.getWordRangeAtPosition(position);
  if (!range) return null;

  const word = document.getText(range);
  if (!word.endsWith('Provider')) return null;

  // プロジェクトのルートディレクトリを取得
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) return null;
  const rootPath = workspaceFolders[0].uri.fsPath;

  // プロジェクト内のすべての.g.dartファイルを検索
  const gDartFiles = await vscode.workspace.findFiles('**/*.g.dart');
  console.log('Found .g.dart files:', gDartFiles.map(f => f.fsPath));

  // 各.g.dartファイルをチェック
  for (const gDartFile of gDartFiles) {
    const gDartContent = fs.readFileSync(gDartFile.fsPath, 'utf8');
    console.log('Checking .g.dart file:', gDartFile.fsPath);

    // 定数名が.g.dartファイル内に存在するか確認
    if (gDartContent.includes(word)) {
      console.log('Found provider in .g.dart file:', gDartFile.fsPath);

      // part ofステートメントを探す
      const partOfMatch = gDartContent.match(/part of ['"](.+)['"]/);
      if (!partOfMatch) {
        console.log('No part of statement found in .g.dart file');
        continue;
      }

      const relativePath = partOfMatch[1];
      const gDartDir = path.dirname(gDartFile.fsPath);
      const absoluteTargetPath = path.resolve(gDartDir, relativePath);
      console.log('Absolute target path:', absoluteTargetPath);

      // ファイルが存在するか確認
      if (!fs.existsSync(absoluteTargetPath)) {
        console.log('Target file does not exist');
        continue;
      }

      // クラス名を推定
      const providerForMatch = gDartContent.match(/@ProviderFor\((\w+)\)/);
      const providerName = word.replace(/Provider$/, '');
      const className = providerForMatch ? providerForMatch[1] : toPascalCase(providerName);

      // ファイルを開いてジャンプ
      const uri = vscode.Uri.file(absoluteTargetPath);
      const targetDoc = await vscode.workspace.openTextDocument(uri);
      const lines = targetDoc.getText().split('\n');

      let lineNumber = 0;
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (
          (line.includes(`class ${className}`) || line.includes(`class ${className} `)) &&
          line.includes('extends')
        ) {
          lineNumber = i;
          break;
        }
      }

      return new vscode.Location(uri, new vscode.Position(lineNumber, 0));
    }
  }

  console.log('Provider not found in any .g.dart file');
  return null;
}

export function activate(context: vscode.ExtensionContext) {
  // Cmd+Alt+G でジャンプできるコマンド
  const jumpCommand = vscode.commands.registerCommand(
    'riverpod-jump-to-provider.goToDefinition',
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;
      const document = editor.document;
      const position = editor.selection.active;

      const location = await jumpToRiverpodOrigin(document, position);
      if (location) {
        await vscode.window.showTextDocument(location.uri, {
          selection: new vscode.Range(location.range.start, location.range.start)
        });
      }
    }
  );

  // Cmd+Click / Go to Definition 対応
  const definitionProvider = vscode.languages.registerDefinitionProvider(
    { language: 'dart' },
    {
      async provideDefinition(document, position) {
        return await jumpToRiverpodOrigin(document, position);
      }
    }
  );

  context.subscriptions.push(jumpCommand, definitionProvider);
}

export function deactivate() {}
