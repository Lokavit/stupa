/**
  =====<< 卍 · Copyright · 卍 >>=====
  FileName: extension.js
  Directory: stupa
  Author: UserName
  Birthtime: 2023/4/19 22:40:41
  -----
  Mtime: 2023/4/20 19:34:44
  WordCount: 0
  -----
  Copyright © 1911 - 2023 UserName
      卍 · 小僧過境　衆生甦醒 · 卍
  =====<< 卍 · Description · 卍 >>=====

*/
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "stupa" is now active!');

  /**
   * Add some ext for dynamic imoprt
   */
  // require("./src/lifecycle")(context);
  require("./src/insertFileInfo")(context);
  // require("./src/wordCount")(context);
  require("./src/changeTrack")(context);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
