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
 * <!-- Copyright --> 注释
 * Copyright:关键字
 */
const RegexpCommentMD = new RegExp(/^<!--(.|[\r\n])*?Copyright(.|[\r\n])*?-->/);

/**
 * 匹配 js等文件的块注释方式
 * Copyright:关键字
 */
const RegexpCommentJS = new RegExp(
  /^\/\*\*(.|[\r\n])*?Copyright(.|[\r\n])*?\*\//
);

/**
 * 文件类型。
 */
const FileType = {
  /**
   * markdown:<!--  -->
   */
  MARKDOWN: "markdown",
  /**
   * 如此
   */
  JAVASCRIPT: "javascript",
};

/**
 * 匹配双字节字符。如:汉字及中文标点符号
 */
const RegexpChinese = new RegExp(/[^\x00-\xff]/g);

/**
 * 传入当前激活文件的语言ID。
 * @param {*} id
 * @returns 返回语言ID对应的正则
 */
const GetLanguageId = (id) =>
  id == FileType.MARKDOWN ? RegexpCommentMD : RegexpCommentJS;

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
 * @param {string} val 传入的文档
 * @param {RegExp} regexp 正则
 * @returns 返回正文内容，通常需要用到内容的长度
 * @example GetContext('context',RegexpChinese).length;
 */
const GetContext = (val, regexp) =>
  val.replace(GetComment(val, regexp), "").match(regexp);

/**
 * 构建文件信息注释块模板
 * @param {string} langId 语言ID，用于判定当前使用什么模板
 * @param {string} name 文件名
 * @param {string} path 文件路径
 * @param {string} project 项目名
 * @param {string} author 作者
 * @param {string} birthime 创建时间
 * @param {string} mtime 最后更新时间
 * @returns 文件注释块模板
 */
const TPLCommon = (langId, name, path, project, author, birthime, mtime) => `${
  langId == FileType.MARKDOWN ? "<!--" : "/**"
}
  =====<< 卍 · Copyright · 卍 >>=====
  FileName: ${name}
  FilePath: ${path}
  Project: ${project}
  Author: ${author}
  Birthtime: ${birthime}
  -----
  Mtime: ${mtime}
  -----
  Copyright © 1911 - 2023 Lokavit
      卍 · 小僧過境　衆生甦醒 · 卍
  =====<< 卍 · Description · 卍 >>=====

${langId == FileType.MARKDOWN ? "-->" : "*/"}`;

/**
 * 动态引入指定为见。或许用于package.json的加载
 * @param {*} filename
 * @returns
 */
const LoadFile = (filename) => require(filename);

module.exports = {
  RegexpCommentMD,
  RegexpCommentJS,
  RegexpChinese,
  FormatDateTime,
  FindComment,
  GetComment,
  GetContext,
  GetLanguageId,
  TPLCommon,
  LoadFile,
};
