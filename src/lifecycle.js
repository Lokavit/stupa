/**
 * 测试生命周期
 */
const vscode = require("vscode");

class Lifecycle {
  constructor() {
    console.info("Lifecycle!", this);

    /** vscode启动时，已被激活的编辑域，通常为其项目tab状态 */
    console.info(
      "vscode.workspace.textDocuments:",
      vscode.workspace.textDocuments
    );
    /**
     * 该属性读取的时，当前Workspace的root目录，不能作为Project
     */
    // console.log(vscode.workspace.workspaceFolders);
    // console.log(`URI:${vscode.workspace.workspaceFolders[0].uri}`);

    vscode.workspace.onWillCreateFiles((event) => {
      console.info("onWillCreateFiles You created file!", event);
      /**
       * undefined
       * 编辑域tab一个以上时，新建文件并打开，会触发该函数拿到上一个tab
       */
      console.info("onWillCreateFiles:", vscode.window.activeTextEditor);
    });

    vscode.workspace.onDidCreateFiles((event) => {
      console.info("onDidCreateFiles You created file!", event);
      /**
       * undefined
       * 编辑域tab一个以上时，新建文件并打开，会触发该函数拿到上一个tab
       */
      console.info("onDidCreateFiles:", vscode.window.activeTextEditor);
    });

    /**
     *
     */
    vscode.workspace.onDidOpenTextDocument((event) => {
      console.info("onDidOpenTextDocument", event);
      console.info("onDidOpenTextDocument getText", event.getText()); // ''
    });
  }
}

module.exports = (context) => {
  /** 只有使用者启用该功能时，才会将其挂载到扩展中 */
  context.subscriptions.push(new Lifecycle());
};
