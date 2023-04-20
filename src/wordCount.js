const vscode = require("vscode");
const { GetContext, GetLanguageId, IsAcitveWordCount } = require("./utils");
const { FILE_TYPE_LANG } = require("./constants");
/**
 * 在`Mtime`关键字之下，插入一行，显示字数统计信息。
 * 若没有文件信息注释块，又想单独使用字数统计——
 * 模板：<!-- WordCount: 5 字 -->
 *  一个类似变量，用于控制该部件的启用/关闭`WordCountAcitve`
 */
class WordCount {
  constructor() {
    console.info("word count!", IsAcitveWordCount());

    vscode.window.onDidChangeActiveTextEditor((event) => {
      this._editor = vscode.window.activeTextEditor;
      this._insertWordCount(event);
    });
    /**
     * 理论来说，这里只执行一次。后续保存走`ChangeTrack`
     */
    // vscode.workspace.onWillSaveTextDocument((event) => {
    //   if (event.document.getText().includes("WordCount")) return;
    //   this._insertWordCount(event);
    // });
  }
  /**
   * 在文件信息注释块中，嵌入字数统计功能
   * @param {string}event 文档内容
   */
  _insertWordCount(event) {
    console.info("_insertWordCount:", event);
    /**
     * 目前只统计文件内容语言ID=='markdown'的文件内容
     */
    if (event.document.languageId != FILE_TYPE_LANG.MARKDOWN) return;

    /**
     * 获取激活文档中的文档内容
     * _doc.getText():获取文档内容
     * _doc.lineCount：总行数
     */
    let _doc = event.document || "";

    /**
     * 每次按下保存时，重新统计字数
     * 计算时，去除文件信息注释块后的内容字数
     */
    let _count = GetContext(
      _doc.getText(),
      GetLanguageId(_doc.languageId)
    ).length;

    console.info("_count:", _count);

    this._editor.edit((builder) => {
      for (let i = 0; i < _doc.lineCount; i++) {
        let _line = _doc.lineAt(i);
        // 在每行中寻找字数关键词

        // console.info("_line:", _line);
        if (
          !_doc.getText().includes("WordCount") &&
          _line.text.includes("Mtime")
        ) {
          builder.replace(
            /**
             * 插入行的范围：i+1行的第一个字符位置，到i+行的0位置
             */
            new vscode.Range(i + 1, _line.range.start.character, i + 1, 0),
            `  WordCount: ${_count || 0} 字 \r\n`
          );
        }
      }
    });
  }
}

module.exports = (context) => {
  /** 只有使用者启用该功能时，才会将其挂载到扩展中 */
  if (IsAcitveWordCount()) context.subscriptions.push(new WordCount());
};
