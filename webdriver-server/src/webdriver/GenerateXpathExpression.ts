import { ChainablePromiseElement, Mock } from 'webdriverio';
import logger from '../util/logger';


class GenerateXpathExpression {

  /**
   * Este código javascript de abajo
   * necesita pasar por un minifier
   * antes de injectarse en las páginas web
   * Recurso de: https://github.com/thiagodp/get-xpath/blob/master/src/index.ts
   */
  /*
    function pekomonitorGetXpath(el) {
      const options = {
          ignoreId: true
      };
      let nodeElem = el;
      if (nodeElem && nodeElem.id && !options.ignoreId) {
          return "//*[@id=\"" + nodeElem.id + "\"]";
      }
      let parts = [];
      while (nodeElem && Node.ELEMENT_NODE === nodeElem.nodeType) {
          let nbOfPreviousSiblings = 0;
          let hasNextSiblings = false;
          let sibling = nodeElem.previousSibling;
          while (sibling) {
              if (sibling.nodeType !== Node.DOCUMENT_TYPE_NODE &&
                  sibling.nodeName === nodeElem.nodeName
              ) {
                  nbOfPreviousSiblings++;
              }
              sibling = sibling.previousSibling;
          }
          sibling = nodeElem.nextSibling;
          while (sibling) {
              if (sibling.nodeName === nodeElem.nodeName) {
                  hasNextSiblings = true;
                  break;
              }
              sibling = sibling.nextSibling;
          }
          let prefix = nodeElem.prefix ? nodeElem.prefix + ":" : "";
          let nth = nbOfPreviousSiblings || hasNextSiblings ?
              "[" + (nbOfPreviousSiblings + 1) + "]" :
              "";
          parts.push(prefix + nodeElem.localName + nth);
          nodeElem = nodeElem.parentNode;
      }
      return parts.length ? "/" + parts.reverse().join("/") : "";
    }
  */
  private browser: WebdriverIO.Browser;
  private readonly genXpathExpression = `
  (function(d, nodeElement) {
    function pekomonitorGetXpath(e){let o=e;o&&o.id;let n=[];for(;o&&Node.ELEMENT_NODE===o.nodeType;){let e=0,i=!1,r=o.previousSibling;for(;r;)r.nodeType!==Node.DOCUMENT_TYPE_NODE&&r.nodeName===o.nodeName&&e++,r=r.previousSibling;for(r=o.nextSibling;r;){if(r.nodeName===o.nodeName){i=!0;break}r=r.nextSibling}let t=o.prefix?o.prefix+":":"",N=e||i?"["+(e+1)+"]":"";n.push(t+o.localName+N),o=o.parentNode}return n.length?"/"+n.reverse().join("/"):""}
    return pekomonitorGetXpath(nodeElement);
  }(document, arguments[0]));`;

  constructor(browser: WebdriverIO.Browser) {
    this.browser = browser;
  }

  public getXpath = async (query: WebdriverIO.Element): Promise<Array<string>[]> => {
    const scriptExecutionResult = await this.browser.executeScript(this.genXpathExpression, [query]);
    return scriptExecutionResult;
  }

}

export default GenerateXpathExpression;
