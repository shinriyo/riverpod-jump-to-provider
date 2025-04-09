import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

function toPascalCase(input: string): string {
  return input.replace(/(^|_)(\w)/g, (_, __, c) => c.toUpperCase());
}

// キャッシュ用の変数
let lastSearchTime = 0;
let cachedFiles: vscode.Uri[] = [];
const CACHE_DURATION = 300000; // 5分間キャッシュを保持

// ファイル内容のキャッシュ
const fileContentCache = new Map<string, { content: string, timestamp: number }>();
const FILE_CACHE_DURATION = 60000; // 1分間ファイル内容をキャッシュ

export function activate(context: vscode.ExtensionContext) {
  console.log('Riverpod Jump to Provider extension is now active!');
  
  // ✅ Cmd+Alt+G用のコマンド登録
  const jumpCommand = vscode.commands.registerCommand(
    'riverpod-jump-to-provider.goToDefinition',
    async () => {
      console.log('Jump command triggered');
      
      // コマンドが実行されたことを通知
      vscode.window.showInformationMessage('Riverpod Jump to Provider: コマンドが実行されました');
      
      const editor = vscode.window.activeTextEditor;
  
      if (!editor) {
        console.log('No active editor');
        vscode.window.showWarningMessage('❌ アクティブなエディタがありません');
        return;
      }
  
      const document = editor.document;
      const position = editor.selection.active;
  
      const range = document.getWordRangeAtPosition(position);
      if (!range) {
        console.log('No word range at position');
        vscode.window.showWarningMessage('❌ 単語が選択されていません');
        return;
      }
      
      const word = document.getText(range);
      console.log('Selected word:', word);
      
      if (!word.endsWith('Provider')) {
        console.log('Word does not end with Provider');
        vscode.window.showWarningMessage('❌ 選択された単語はProviderで終わっていません');
        return;
      }
  
      // プロバイダー名からクラス名を推測
      const providerName = word.replace(/Provider$/, '');
      const className = toPascalCase(providerName);
      console.log('Looking for class:', className);
      
      // 現在のファイルのディレクトリを取得
      const currentDir = path.dirname(document.uri.fsPath);
      console.log('Current directory:', currentDir);
      
      // プロジェクト内のすべての.dartファイルを検索
      vscode.window.showInformationMessage(`🔍 ${className}クラスを検索中...`);
      
      // キャッシュを使用するかどうかを判断
      const now = Date.now();
      let dartFiles: vscode.Uri[] = [];
      
      if (now - lastSearchTime < CACHE_DURATION && cachedFiles.length > 0) {
        console.log('Using cached files');
        dartFiles = cachedFiles;
      } else {
        console.log('Searching for dart files');
        // 検索範囲を絞り込む
        // 1. 現在のファイルと同じディレクトリ内のファイルを優先
        // 2. プロジェクト内のすべての.dartファイルを検索
        const currentDirFiles = await vscode.workspace.findFiles(
          new vscode.RelativePattern(currentDir, '**/*.dart'),
          '**/build/**'
        );
        
        const allFiles = await vscode.workspace.findFiles(
          '**/*.dart',
          '**/build/**'
        );
        
        // 重複を除去
        const uniqueFiles = new Set([...currentDirFiles, ...allFiles]);
        dartFiles = Array.from(uniqueFiles);
        
        // キャッシュを更新
        cachedFiles = dartFiles;
        lastSearchTime = now;
      }
      
      console.log('Found dart files:', dartFiles.length);
      
      // 各ファイルをチェック
      for (const file of dartFiles) {
        const filePath = file.fsPath;
        console.log('Checking file:', filePath);
        
        // .g.dartファイルはスキップ
        if (filePath.endsWith('.g.dart')) {
          console.log('Skipping .g.dart file');
          continue;
        }
        
        try {
          // ファイル内容をキャッシュから取得するか、読み込む
          let text: string;
          const cachedFile = fileContentCache.get(filePath);
          
          if (cachedFile && now - cachedFile.timestamp < FILE_CACHE_DURATION) {
            console.log('Using cached file content for:', filePath);
            text = cachedFile.content;
          } else {
            const fileContent = await vscode.workspace.fs.readFile(file);
            text = Buffer.from(fileContent).toString('utf8');
            
            // キャッシュを更新
            fileContentCache.set(filePath, { content: text, timestamp: now });
          }
          
          // クラス名が含まれているかどうかを最初にチェック
          if (!text.includes(`class ${className}`) && !text.includes('@riverpod')) {
            continue;
          }
          
          const lines = text.split('\n');
          
          // クラスを探す
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.includes(`class ${className}`)) {
              console.log('Found class at line:', i, 'in file:', filePath);
              
              // ファイルを開く処理を改善
              try {
                // ファイルが存在するか確認
                if (!fs.existsSync(filePath)) {
                  console.error('File does not exist:', filePath);
                  vscode.window.showErrorMessage(`❌ ファイルが見つかりません: ${filePath}`);
                  continue;
                }
                
                // ファイルを開く
                const uri = vscode.Uri.file(filePath);
                const pos = new vscode.Position(i, 0);
                
                // ファイルを開いて位置を設定
                const doc = await vscode.workspace.openTextDocument(uri);
                await vscode.window.showTextDocument(doc, {
                  selection: new vscode.Range(pos, pos),
                  viewColumn: vscode.ViewColumn.One
                });
                
                vscode.window.showInformationMessage(`✅ ${className}クラスを見つけました: ${filePath}`);
                return;
              } catch (error) {
                console.error('Error opening file:', filePath, error);
                vscode.window.showErrorMessage(`❌ ファイルを開けませんでした: ${filePath}`);
              }
            }
          }
          
          // クラスが見つからない場合、@riverpodアノテーションを探す
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.includes('@riverpod')) {
              console.log('Found @riverpod at line:', i, 'in file:', filePath);
              // @riverpodの近くにクラス定義がある可能性がある
              for (let j = 1; j <= 10; j++) {
                const nextLine = lines[i + j];
                if (nextLine?.includes(`class ${className}`)) {
                  console.log('Found class near @riverpod at line:', i + j, 'in file:', filePath);
                  
                  // ファイルを開く処理を改善
                  try {
                    // ファイルが存在するか確認
                    if (!fs.existsSync(filePath)) {
                      console.error('File does not exist:', filePath);
                      vscode.window.showErrorMessage(`❌ ファイルが見つかりません: ${filePath}`);
                      continue;
                    }
                    
                    // ファイルを開く
                    const uri = vscode.Uri.file(filePath);
                    const pos = new vscode.Position(i + j, 0);
                    
                    // ファイルを開いて位置を設定
                    const doc = await vscode.workspace.openTextDocument(uri);
                    await vscode.window.showTextDocument(doc, {
                      selection: new vscode.Range(pos, pos),
                      viewColumn: vscode.ViewColumn.One
                    });
                    
                    vscode.window.showInformationMessage(`✅ ${className}クラスを見つけました: ${filePath}`);
                    return;
                  } catch (error) {
                    console.error('Error opening file:', filePath, error);
                    vscode.window.showErrorMessage(`❌ ファイルを開けませんでした: ${filePath}`);
                  }
                }
              }
            }
          }
        } catch (error) {
          console.error('Error reading file:', filePath, error);
        }
      }
      
      // 見つからなかった場合
      vscode.window.showWarningMessage(`🔍 対応する class ${className} が見つかりませんでした`);
    }
  );
  
  context.subscriptions.push(jumpCommand);
  console.log('Jump command registered');

  // Cmd+Click 用の定義ジャンプ（これはそのままでOK）
  const provider = vscode.languages.registerDefinitionProvider(
    { language: 'dart' },
    {
      async provideDefinition(document, position) {
        const range = document.getWordRangeAtPosition(position);
        const word = document.getText(range);

        if (!word.endsWith('Provider')) return;

        const providerName = word.replace(/Provider$/, '');
        const className = toPascalCase(providerName);

        // プロジェクト内のすべての.dartファイルを検索
        const dartFiles = await vscode.workspace.findFiles('**/*.dart', '**/build/**');
        
        // 各ファイルをチェック
        for (const file of dartFiles) {
          const filePath = file.fsPath;
          
          // .g.dartファイルはスキップ
          if (filePath.endsWith('.g.dart')) {
            continue;
          }
          
          try {
            const fileContent = await vscode.workspace.fs.readFile(file);
            const text = Buffer.from(fileContent).toString('utf8');
            const lines = text.split('\n');
            
            // クラスを探す
            for (let i = 0; i < lines.length; i++) {
              const line = lines[i];
              if (line.includes(`class ${className}`)) {
                const pos = new vscode.Position(i, 0);
                return new vscode.Location(file, pos);
              }
            }
            
            // クラスが見つからない場合、@riverpodアノテーションを探す
            for (let i = 0; i < lines.length; i++) {
              const line = lines[i];
              if (line.includes('@riverpod')) {
                // @riverpodの近くにクラス定義がある可能性がある
                for (let j = 1; j <= 10; j++) {
                  const nextLine = lines[i + j];
                  if (nextLine?.includes(`class ${className}`)) {
                    const pos = new vscode.Position(i + j, 0);
                    return new vscode.Location(file, pos);
                  }
                }
              }
            }
          } catch (error) {
            console.error('Error reading file:', filePath, error);
          }
        }
        
        return null;
      }
    }
  );

  context.subscriptions.push(provider);
}

export function deactivate() {}
