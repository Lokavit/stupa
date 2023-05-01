/**
  =====<< 卍 · Copyright · 卍 >>=====
  FileName: insertFileInfo.js
  Directory: src
  Author: Lokavit
  Birthtime: 2023/4/19 22:40:41
  -----
  Mtime: 2023/4/20 19:12:56
  WordCount: 28
  -----
  Copyright © 1911 - 2023 Lokavit
      卍 · 小僧過境　衆生甦醒 · 卍
  =====<< 卍 · Description · 卍 >>=====

*/
const vscode = require("vscode");
const {
  FindComment,
  GetLanguageId,
  TPLCommon,
  IsActiveInsert,
} = require("./utils");

class InsertFileInfo {
  constructor() {
    console.info("insert file info!", IsActiveInsert());
    /**
     * Get current activeTextEditor
     */
    this._editor = vscode.window.activeTextEditor;

    /**
     * 激活编辑域后
     */
    vscode.window.onDidChangeActiveTextEditor((event) => {
      FindComment(
        event.document.getText(),
        GetLanguageId(event.document.languageId)
      ) && this._editorBuild(event);
    });
  }

  _editorBuild(event) {
    event.edit((builder) => {
      builder.replace(
        new vscode.Range(0, 0, 0, 0),
        TPLCommon(event.document.languageId, event.document.fileName)
      );
    });
  }
}

module.exports = (context) => {
  /** 只有使用者启用该功能时，才会将其挂载到扩展中 */
  if (IsActiveInsert()) context.subscriptions.push(new InsertFileInfo());
};
