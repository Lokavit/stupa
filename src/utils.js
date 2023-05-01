/**
  =====<< 卍 · Copyright · 卍 >>=====
  FileName: utils.js
  Directory: src
  Author: Lokavit
  Birthtime: 2023/4/19 22:40:41
  -----
  Mtime: 2023/4/20 20:10:43
  WordCount: 0
  -----
  Copyright © 1911 - 2023 Lokavit
      卍 · 小僧過境　衆生甦醒 · 卍
  =====<< 卍 · Description · 卍 >>=====

*/
const fs = require("fs");
const path = require("path");
const vscode = require("vscode");
/** 引入常量 */
const {
  BASE_SETTING,
  REGEXP_COMMENT_MD,
  REGEXP_COMMENT_JS,
  REGEXP_CHINESE,
  FILE_TYPE_LANG,
} = require("./constants");

/**
 * 获取当前`workspace`的配置
 * @param {*} val
 * @returns
 *  console.info("获取配置对象:", vscode.workspace.getConfiguration("editor"));
 */
const GetConfig = (val) => vscode.workspace.getConfiguration(`${val}`);
/**
 * 是否启用嵌入文件信息注释块
 * @returns
 */
const IsActiveInsert = () => GetConfig(BASE_SETTING).isActive;
/**
 * 是否启用字数统计
 */
const IsAcitveWordCount = () => GetConfig(BASE_SETTING).wordCount.isActive;

/**
 * 是否启用保存后更新某些信息
 */
const IsActiveChangeTrack = () => GetConfig(BASE_SETTING).changeTrack.isActive;

/**
 * 将传入的时间字符串格式化
 * timeZone:时区设置
 * @param {date} val
 * @returns 格式化为易读时间格式
 * @example 2023/04/14 11:11:11
 */
const FormatDateTime = (val) =>
  new Date(val).toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" });

/**
 * 使用fs模块，获取文件信息
 * @param {string} val
 * @returns
 * @example GetFileStat(filename)
 * _stat.atime:文件最近一次被访问的时间
 * _stat.birthtime:文件创建时间
 * _stat.ctime:文件最近一次状态变动的时间(文件内容及属性更改时更新)
 * _stat.mtime:文件最近一次修改的时间(文件内容更改时更新)
 */
const GetFileStat = (val) => fs.statSync(val);

/**
 * 文件名
 * @param {*} val
 * @returns
 */
const FileName = (val) => path.basename(val);

/**
 * 从全路径中截取，留下距离当前文件最近也是最后的一层目录名
 * 在Blog等内容文件中，可以作为文章分类，方便解析
 * @param {*} val
 * @returns
 */
const Directory = (val) => {
  let _temp = path.dirname(val);
  return _temp.replace(_temp.slice(0, _temp.lastIndexOf("\\") + 1), "");
};

/**
 * 文件路径，通常不用。
 * @param {*} val
 * @returns
 */
// const FilePath = (val) => path.dirname(val);

/**
 * 当前`workspace`的名字，通常为项目对应名文件夹名
 * @returns
 */
const ProjectName = () => vscode.workspace.name;

/**
 * 文件创建时间
 * @param {*} val
 * @returns
 */
const FileBirthtime = (val) => FormatDateTime(GetFileStat(val).birthtime);

/**
 * 文件最后一次修改时间
 * @param {*} val
 * @returns
 */
const FileMtime = (val) => FormatDateTime(GetFileStat(val).mtime);

/**
 * 文件作者
 * @param {*} val
 * @returns
 */
const Author = () => GetConfig(BASE_SETTING).author;

/**
 * 传入当前激活文件的语言ID。
 * @param {*} id
 * @returns 返回语言ID对应的正则
 * @Language:`markdown and javascript`
 */
const GetLanguageId = (id) =>
  id == FILE_TYPE_LANG.MARKDOWN
    ? REGEXP_COMMENT_MD
    : id == FILE_TYPE_LANG.JAVASCRIPT
    ? REGEXP_COMMENT_JS
    : "";

/**
 * 文件内容中，是否包含指定注释块
 * @param {string} val
 * @param {RegExp} regexp 正则
 * @returns 未找到注释块，返回true，反之返回false
 */
const FindComment = (val, regexp) => !val.match(regexp) && true;

/**
 * 从文件内容中，获取文件信息注释块
 * @param {string} val
 * @param {RegExp} regexp 正则
 * @returns 未加注释块返回true，已有注释块返回注释块内容
 */
const GetComment = (val, regexp) =>
  FindComment(val, regexp) || val.match(regexp)[0];

/**
 * 获取正文内容。此处使用`replace`将注释块替换为'',留下的就是正文内容
 * TODO:支持多语言，多组合
 * @param {string} val 传入的文档
 * @param {RegExp} regexp 正则
 * @returns 返回正文内容，通常需要用到内容的长度
 * @example GetContext('context',RegexpChinese).length;
 */
const GetContext = (val, regexp) =>
  val.replace(GetComment(val, regexp), "").match(REGEXP_CHINESE) ?? "";

/**
 * 需要一个字数统计规则，根据语言不同，自定义变更字数统计方案
 * markdwon:
 *  1.只统计双字符(中文、中文标点)
 *  2. 中文双字符+英文单词
 *  3. 中英文+所有符号(含空白、非空白、制表、 非制表)
 */

/**
 * 构建文件信息注释块模板
 * @param {string} langId 语言ID，用于判定当前使用什么模板
 * @param {string} filename 文件名
 * @returns 文件注释块模板
 *   Project: ${ProjectName()}
 *   FilePath: ${FilePath(filename)}
 */
const TPLCommon = (langId, filename) => `${
  langId == FILE_TYPE_LANG.MARKDOWN ? "<!--" : "/**"
}
  =====<< 卍 · Copyright · 卍 >>=====
  FileName: ${FileName(filename)}
  Directory: ${Directory(filename)}
  Author: ${Author()}
  Birthtime: ${FileBirthtime(filename)}
  -----
  Mtime: ${FileMtime(filename)}${
  IsAcitveWordCount() ? `\r\n  WordCount: 0` : ``
}
  -----
  Copyright © 1911 - ${new Date().getFullYear()} ${Author()}
      卍 · 小僧過境　衆生甦醒 · 卍
  =====<< 卍 · Description · 卍 >>=====

${langId == FILE_TYPE_LANG.MARKDOWN ? "-->" : "*/"}\r\n`;

/**
 * 动态引入指定为见。或许用于package.json的加载
 * @param {*} filename
 * @returns
 */
const LoadFile = (filename) => require(filename);

module.exports = {
  IsActiveInsert,
  IsAcitveWordCount,
  IsActiveChangeTrack,
  FileMtime,
  FindComment,
  GetContext,
  GetLanguageId,
  TPLCommon,
};
