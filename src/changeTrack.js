/**
  =====<< 卍 · Copyright · 卍 >>=====
  FileName: changeTrack.js
  Directory: src
  Author: Lokavit
  Birthtime: 2023/4/19 22:42:03
  -----
  Mtime: 2023/4/20 20:10:53
  WordCount: 0
  -----
  Copyright © 1911 - 2023 Lokavit
      卍 · 小僧過境　衆生甦醒 · 卍
  =====<< 卍 · Description · 卍 >>=====
 * 作用于在使用者每次按下保存时，对部分信息跟踪并更新
 * 注意处理当前文件保存的一些必要先决条件：
 * a).必须是在文件信息注释块中包含指定关键字
*/

const vscode = require("vscode");
const {
  IsActiveChangeTrack,
  FileMtime,
  FileBirthtime,
  GetContext,
  GetLanguageId,
  IsAcitveWordCount,
} = require("./utils");

class ChangeTrack {
  constructor() {
    console.info("ChangeTrack!", IsActiveChangeTrack());
    /**
     * 每次保存前
     */
    vscode.workspace.onWillSaveTextDocument((event) => {
      this._editor = vscode.window.activeTextEditor;
      if (!this._editor) return;
      this._updateBuilder(event);
    });
  }

  /**
   * 更新文件信息注释块内容
   * @param {*} event
   * 拆分函数，会在保存调用时冲突
   */
  _updateBuilder(event) {
    let _doc = event.document;
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
        /**
         * 如果当前激活文档编辑域的文件信息注释块中，不含有[WordCount]，
         * 并且在当前行中找到了[Mtime]关键词。
         * 在指定的位置(暂定在最后更新之后)，创建[WordCount]条目。
         */
        if (_line.text.includes(`Mtime`)) {
          /**
           * 在当前行，找『:』的位置
           * 范围：第i行的:(冒号)+1字符位置，到第i行的最后一个字符
           * e. Mtime: 2023/4/19 23:18:57
           */
          builder.replace(
            new vscode.Range(
              i,
              _line.text.indexOf(":") > 0 && _line.text.indexOf(":") + 1,
              i,
              _line.range.end.character
            ),
            ` ${FileMtime(_doc.fileName)}`
          );
        }

        /** 找到 `WordCount`所在的行 */
        if (IsAcitveWordCount() && _line.text.includes(`WordCount`)) {
          /**
           * 在当前行，找『:』的位置
           * 范围：第i行的:(冒号)+1字符位置，到第i行的最后一个字符
           * e. WordCount: 1 字
           */
          builder.replace(
            new vscode.Range(
              i,
              _line.text.indexOf(":") > 0 && _line.text.indexOf(":") + 1,
              i,
              _line.range.end.character
            ),
            ` ${
              GetContext(_doc.getText(), GetLanguageId(_doc.languageId)).length
            }`
          );
        }
      }
    });
  }
}

module.exports = (context) => {
  if (IsActiveChangeTrack()) context.subscriptions.push(new ChangeTrack());
};
