import EventEmitter from "events";
import AutoBind from "auto-bind";
import each from "lodash/each";

/**
 * @class Component
 * @description This class is the base
 * class for all components in the application
 * It contains methods that are common to all components
 * and can be extended by other components
 * @extends EventEmitter
 * @exports Component
 * @example
 * import Component from "classes/Component";
 *
 */
export default class Component extends EventEmitter {
  constructor({ classes, element, elements }) {
    super();

    AutoBind(this);

    this.classes = classes;
    this.selector = element;
    this.selectorChildren = { ...elements };

    this.create();

    this.addEventListeners();
  }

  /**
   * This method is called to create the
   * component and its elements
   * @returns void
   */
  create() {
    if (this.selector instanceof window.HTMLElement) {
      this.element = this.selector;
    } else {
      this.element = document.querySelector(this.selector);
    }
    this.elements = {};

    each(this.selectorChildren, (entry, key) => {
      if (
        entry instanceof window.HTMLElement ||
        entry instanceof window.NodeList ||
        Array.isArray(entry)
      ) {
        this.elements[key] = entry;
      } else {
        this.elements[key] = this.element.querySelectorAll(entry);
        if (this.elements[key].length === 0) {
          this.elements[key] = null;
        } else if (this.elements[key].length === 1) {
          this.elements[key] = this.element.querySelector(entry);
        }
      }
    });
  }

  addEventListeners() {}
  removeEventListeners() {}
}
