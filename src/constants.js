/**
  =====<< 卍 · Copyright · 卍 >>=====
  FileName: constants.js
  Directory: src
  Author: Lokavit
  Birthtime: 2023/4/19 23:32:23
  -----
  Mtime: 2023/9/16 17:07:19
  WordCount: 44
  -----
  Copyright © 1911 - 2023 Lokavit
      卍 · 小僧過境　衆生甦醒 · 卍
  =====<< 卍 · Description · 卍 >>=====
  some config
*/
const BASE_SETTING = `stupa.insert`;

const REGEXP_COMMENT_MD = new RegExp(/^---(.|[\r\n])*?title(.|[\r\n])*?---/);

/**
 * <!-- Copyright --> 注释
 * FileName:关键字
 */
// const REGEXP_COMMENT_HTML = new RegExp(/^<!--(.|[\r\n])*?FileName(.|[\r\n])*?-->/);

/**
 * 匹配 js等文件的块注释方式
 * FileName:关键字
 */
const REGEXP_COMMENT_JS = new RegExp(/^\/\*\*(.|[\r\n])*?FileName(.|[\r\n])*?\*\//);

/**
 * 匹配双字节字符。如:汉字及中文标点符号
 */
const REGEXP_CHINESE = new RegExp(/[^\x00-\xff]/g);

/**
 * 文件类型。
 */
const FILE_TYPE_LANG = {
  /** 
   * markdown: ---  ---
   */
  MARKDOWN: "markdown",
  /**
   * html:<!--  -->
   */
  HTML: "html",
  /**
   * 如此
   */
  JAVASCRIPT: "javascript",
};

module.exports = {
  BASE_SETTING,
  REGEXP_COMMENT_MD,
  REGEXP_COMMENT_JS,
  REGEXP_CHINESE,
  FILE_TYPE_LANG,
};
