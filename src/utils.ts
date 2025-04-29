import * as vscode from "vscode";

export function getCurrentPosition(
  textEditor: vscode.TextEditor
): vscode.Position {
  return textEditor.selection.active;
}

export function getCurrentWord(textEditor: vscode.TextEditor): string {
  const range = getCurrentWordRange(textEditor);
  return textEditor.document.getText(range);
}

export function getCurrentWordRange(
  textEditor: vscode.TextEditor
): vscode.Range | undefined {
  const currentPosition = getCurrentPosition(textEditor);
  return textEditor.document.getWordRangeAtPosition(currentPosition);
}