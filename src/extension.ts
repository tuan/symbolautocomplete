// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { showSuggestions } from "./suggest";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "symbolautocomplete.triggerSuggest",
    async () => {
      const textEditor = vscode.window.activeTextEditor;
      if (textEditor == null) {
        return;
      }

      await showSuggestions(textEditor);
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
