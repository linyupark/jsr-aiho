/**
 * DOM 类型声明
 *
 * 这个文件提供了在 Deno 环境中使用的 DOM 类型声明，
 * 用于解决 Deno 环境中缺少浏览器 API 类型定义的问题。
 *
 * @module
 */

// 定义事件类型
type DOMEvent = { type: string; target: unknown }

/**
 * 声明全局 document 对象
 */
declare global {
  /**
   * Element 接口表示文档中的元素
   */
  interface Element {
    id?: string
  }

  /**
   * HTMLElement 接口表示所有的 HTML 元素
   */
  interface HTMLElement extends Element {
    style: CSSStyleDeclaration
    clientWidth: number
  }

  /**
   * CSSStyleDeclaration 接口表示一个对象，它是一个 CSS 声明块，CSS 属性键值对的集合
   */
  interface CSSStyleDeclaration {
    setProperty(property: string, value: string): void
    fontSize: string
    getPropertyValue(property: string): string
  }

  /**
   * Document 接口表示浏览器中加载的网页
   */
  interface Document {
    documentElement: HTMLElement
  }

  /**
   * 计算样式函数
   */
  function getComputedStyle(element: HTMLElement): CSSStyleDeclaration

  /**
   * 声明全局变量
   */
  interface Window {
    addEventListener(
      type: string,
      listener: (evt: DOMEvent) => void,
      options?: unknown
    ): void
    removeEventListener(
      type: string,
      listener: (evt: DOMEvent) => void,
      options?: unknown
    ): void
    innerWidth: number
  }

  /**
   * 全局变量
   */
  var document: Document
}

// 导出一个空对象，使这个文件成为一个模块
export {}
