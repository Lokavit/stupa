const vscode = require("vscode");
const { GetContext, RegexpChinese } = require("./utils");
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
      //   console.info("?", GetContext(event.document.getText(), RegexpChinese));
      console.info(
        "统计字数:",
        GetContext(event.document.getText(), RegexpChinese).length
      );
      //   GetContext(event.document.getText(), RegexpChinese);
    });
  }
}

module.exports = (context) => {
  context.subscriptions.push(new WordCount());
};
