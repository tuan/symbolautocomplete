import * as vscode from "vscode";
import path from "path";
import { getCurrentWord, getCurrentWordRange } from "./utils";

export async function showSuggestions(
  textEditor: vscode.TextEditor
): Promise<string | undefined> {
  const currentWord = getCurrentWord(textEditor);

  const currentWordRange = getCurrentWordRange(textEditor);
  if (currentWordRange == null) {
    return undefined;
  }

  const allSymbols = await vscode.commands.executeCommand<
    vscode.SymbolInformation[]
  >("vscode.executeWorkspaceSymbolProvider", currentWord);
  const symbolNames = allSymbols.reduce((acc, symbol) => {
    const symbolName = symbol.name.replace(/\(\)/g, "");
    if (acc.has(symbolName)) {
      return acc;
    }

    const symbolFilePath = symbol.location.uri.fsPath;
    const symbolFileName = path.basename(symbolFilePath);
    acc.set(symbolName, symbolFileName);

    return acc;
  }, new Map<string, string>());

  const result = new Set<vscode.QuickPickItem>();
  Array.from(symbolNames.keys()).forEach((symbolName) => {
    result.add({
      label: symbolName,
      description: symbolNames.get(symbolName),
    });
  });

  if (result.size === 0) {
    return undefined;
  }

  const picked = await vscode.window.showQuickPick([...result], {
    matchOnDescription: true,
  });
  if (picked == null) {
    return;
  }

  textEditor.edit((builder) =>
    builder.replace(currentWordRange!, picked.label)
  );

  // Move cursor to end of replaced word
  const newPosition = currentWordRange!.start.translate(0, picked.label.length);
  textEditor.selection = new vscode.Selection(newPosition, newPosition);
}
