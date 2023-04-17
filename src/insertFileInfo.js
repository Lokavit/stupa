const vscode = require("vscode");
const {
  FormatDateTime,
  FindComment,
  GetLanguageId,
  TPLCommon,
} = require("./utils");
const fs = require("fs");
const path = require("path");

class InsertFileInfo {
  constructor() {
    // console.info("insert file info!");
    /**
     * Get current activeTextEditor
     */
    this._editor = vscode.window.activeTextEditor;

    // vscode.workspace.onWillCreateFiles((event) => {
    //   console.info("onWillCreateFiles You created file!");
    //   console.info("onWillCreateFiles event:", event);
    //   // console.info("this._editor:", this._editor);
    //   // this._editor = vscode.window.activeTextEditor;
    //   console.info(
    //     "onWillCreateFiles this._editor",
    //     vscode.window.activeTextEditor
    //   );
    //   // this._insertInfo(this._editor.document.fileName);
    // });
    // vscode.workspace.onDidCreateFiles((event) => {
    //   console.info("onDidCreateFiles You created file!");
    //   console.info("onDidCreateFiles event:", event);
    //   console.info(
    //     "onDidCreateFiles this._editor:",
    //     vscode.window.activeTextEditor
    //   );
    //   // this._editor = vscode.window.activeTextEditor;
    //   // console.info("this._editor", this._editor);
    //   // this._insertInfo(this._editor.document.fileName);
    // });

    // vscode.workspace.onDidOpenTextDocument((event) => {
    //   console.info("onDidOpenTextDocument", event);
    //   this._insertInfo(event.fileName);
    // });
    // console.log(vscode.workspace.workspaceFolders);
    // console.log(`URI:${vscode.workspace.workspaceFolders[0].uri}`);

    vscode.window.onDidChangeActiveTextEditor((event) => {
      // console.info("onDidChangeActiveTextEditor", event);
      FindComment(
        event.document.getText(),
        GetLanguageId(event.document.languageId)
      ) && this._editorBuild(event);
    });

    // // 每次保存时，变更最后更新时间
    // vscode.workspace.onWillSaveTextDocument((event) => {
    //   this._mtime(event.document.fileName);
    // });
  }

  _editorBuild(event) {
    event.edit((builder) => {
      builder.replace(
        new vscode.Range(0, 0, 0, 0),
        TPLCommon(
          event.document.languageId,
          this._fileName(event.document.fileName),
          this._filePath(event.document.fileName),
          this._projectName(),
          this._author("stupa.insert"),
          this._birthtime(event.document.fileName),
          this._mtime(event.document.fileName)
        )
      );
    });
  }

  _getConfig(config) {
    // console.info("获取配置对象:", vscode.workspace.getConfiguration("editor"));
    return vscode.workspace.getConfiguration(`${config}`);
  }

  /**
   * 理论来说，此处为文件创建者
   * 在协作中，是否需要文件修改者？
   */
  _author(config) {
    return this._getConfig(`${config}`).author;
  }

  /**
   * 文件全路径
   * @param {string} filename
   * @returns
   */
  _filePath(filename) {
    return path.dirname(filename);
  }

  /**
   * 文件所在项目。暂时取`workspace`的`name`值
   * @param {string} filename
   * 如何准确判断文件所在项目？
   * 1.普通文件夹/文件.后缀名
   * 2.N层目录，找到有package.json文件所在的目录名
   */
  _projectName() {
    // console.log(`项目名:${vscode.workspace.name}`);
    // return "project name";
    return vscode.workspace.name;
  }

  /**
   * 处理传入的文件名
   * @param {string} filename
   * @returns
   */
  _fileName(filename) {
    return path.basename(filename);
  }

  /**
   * 文件创建时间
   * @param {string} filename
   * @returns
   */
  _birthtime(filename) {
    return FormatDateTime(this._getFileStat(filename).birthtime);
  }

  /**
   * 文件最后一次修改时间
   * @param {string} filename
   * @returns
   */
  _mtime(filename) {
    return FormatDateTime(this._getFileStat(filename).mtime);
  }

  /**
   * 使用fs模块，获取文件信息
   * @param {string} filename
   * @returns
   */
  _getFileStat(filename) {
    /**
     * let _stat =fs.statSync(filename);
     * _stat.atime:文件最近一次被访问的时间
     * _stat.birthtime:文件创建时间
     * _stat.ctime:文件最近一次状态变动的时间(文件内容及属性更改时更新)
     * _stat.mtime:文件最近一次修改的时间(文件内容更改时更新)
     */
    return fs.statSync(filename);
  }
}

module.exports = (context) => {
  context.subscriptions.push(new InsertFileInfo());
};
