const vscode = require("vscode");
const { GetContext, GetLanguageId, FileType } = require("./utils");
/**
 * 在`Mtime`关键字之下，插入一行，显示字数统计信息。
 * 若没有文件信息注释块，又想单独使用字数统计——
 * 模板：<!-- WordCount: 5 字 -->
 *  一个类似变量，用于控制该部件的启用/关闭`WordCountAcitve`
 */
class WordCount {
  constructor() {
    // this.active = true;
    console.info("word count!");

    vscode.window.onDidChangeActiveTextEditor((event) => {
      this._editor = vscode.window.activeTextEditor;
      console.info("获取当前激活的编辑域:", this._editor);
      this._updateWordCount(event);
    });

    vscode.workspace.onWillSaveTextDocument((event) => {
      this._updateWordCount(event);
    });
  }
  /**
   * 获取文档内容，计算并更新最新的文档字数
   * @param {string}event 文档内容
   */
  _updateWordCount(event) {
    /**
     * 目前只统计文件内容语言ID=='markdown'的文件内容
     */
    if (event.document.languageId != FileType.MARKDOWN) return;

    /**
     * 获取激活文档中的文档内容
     * _doc.getText():获取文档内容
     * _doc.lineCount：总行数
     */
    let _doc = event.document;

    /**
     * 每次按下保存时，重新统计字数
     * 计算时，去除文件信息注释块后的内容字数
     */
    let _count = GetContext(
      _doc.getText(),
      GetLanguageId(_doc.languageId)
    ).length;

    console.info("_count:", _count);

    /**
     * 只对当前激活的编辑域操作。
     */
    this._editor.edit((builder) => {
      /**
       * 遍历文档总行，逐行寻找所需关键词[WordCount]
       */
      for (let i = 0; i < _doc.lineCount; i++) {
        /**
         * 每行的对象，内中包含
         * _line.text：文本内容
         * _line.firstNonWhitespaceCharacterIndex：当前行非空白字符索引
         * _line.isEmptyOrWhitespace：当前行是否空行
         * _line.lineNumber：当前行的行号（从0开始计）
         * _line.range：当前行的范围（该对象下又有一些范围相关的属性和方法）
         *  _line.range.start.character：当前行字符开始位置
         *  _line.range.end.character：当前行字符结束位置
         *  _line.range.isSingleLine：单行？
         */
        let _line = _doc.lineAt(i);
        // 在每行中寻找字数关键词
        /**
         * 如果当前激活文档编辑域的文件信息注释块中，不含有[WordCount]，
         * 并且在当前行中找到了[Mtime]关键词。
         * 在指定的位置(暂定在最后更新之后)，创建[WordCount]条目。
         */
        if (
          !_doc.getText().includes("WordCount") &&
          _line.text.includes("Mtime")
        ) {
          builder.replace(
            /**
             * 插入行的范围：i+1行的第一个字符位置，到i+行的0位置
             */
            new vscode.Range(i + 1, _line.range.start.character, i + 1, 0),
            `  WordCount: ${_count} 字 \r\n`
          );
        }

        if (_line.text.includes("WordCount")) {
          /**
           * 在当前行，找『:』的位置
           * 范围：第i行的:(冒号)+1字符位置，到第i行的最后一个字符
           * e. WordCount:7。既为从『:』后面开始替换，通常为数字（字数）
           */
          builder.replace(
            new vscode.Range(
              i,
              _line.text.indexOf(":") > 0 && _line.text.indexOf(":") + 1,
              i,
              _line.range.end.character
            ),
            ` ${_count} 字`
          );
        }
      }
    });
  }
}

module.exports = (context) => {
  context.subscriptions.push(new WordCount());
};
