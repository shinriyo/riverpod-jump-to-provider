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

  // Get the project root directory
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) return null;
  const rootPath = workspaceFolders[0].uri.fsPath;

  // Search for all .g.dart files in the project
  const gDartFiles = await vscode.workspace.findFiles('**/*.g.dart');
  console.log('Found .g.dart files:', gDartFiles.map(f => f.fsPath));

  // Check each .g.dart file
  for (const gDartFile of gDartFiles) {
    const gDartContent = fs.readFileSync(gDartFile.fsPath, 'utf8');
    console.log('Checking .g.dart file:', gDartFile.fsPath);

    // Check if the constant name exists in the .g.dart file
    if (gDartContent.includes(word)) {
      console.log('Found provider in .g.dart file:', gDartFile.fsPath);

      // Look for the part of statement
      const partOfMatch = gDartContent.match(/part of ['"](.+)['"]/);
      if (!partOfMatch) {
        console.log('No part of statement found in .g.dart file');
        continue;
      }

      const relativePath = partOfMatch[1];
      const gDartDir = path.dirname(gDartFile.fsPath);
      const absoluteTargetPath = path.resolve(gDartDir, relativePath);
      console.log('Absolute target path:', absoluteTargetPath);

      // Check if the file exists
      if (!fs.existsSync(absoluteTargetPath)) {
        console.log('Target file does not exist');
        continue;
      }

      // Infer the class name
      const providerForMatch = gDartContent.match(/@ProviderFor\((\w+)\)/);
      const providerName = word.replace(/Provider$/, '');
      const className = providerForMatch ? providerForMatch[1] : toPascalCase(providerName);

      // Open the file and jump to the definition
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
  // Command for Cmd+Shift+P jump
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
  )

  // Support for Cmd+Click / Go to Definition
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
