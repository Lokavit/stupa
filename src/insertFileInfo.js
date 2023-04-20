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
