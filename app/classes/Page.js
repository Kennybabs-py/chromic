import each from "lodash/each";
import map from "lodash/map";
import gsap from "gsap";
import Prefix from "prefix";
import normalizeWheel from "normalize-wheel";

import Title from "animations/Title";
import Label from "animations/Label";
import Paragraph from "animations/Paragraph";
import Highlight from "animations/Highlight";

import AsyncLoad from "classes/AsyncLoad";
import { ColorManager } from "classes/Colors";

/**
 * @class Page
 * @description This class is the base
 * class for all pages in the application
 * It contains methods that are common to all pages
 * and can be extended by other pages
 * @example
 * import Page from "classes/Page";
 *
 */
export default class Page {
  constructor({ element, elements, id }) {
    this.selector = element;
    this.selectorChildren = {
      ...elements,
      animationsTitles: '[data-animation="title"]',
      animationsLabels: '[data-animation="label"]',
      animationsParagraphs: '[data-animation="paragraph"]',
      animationsHighlights: '[data-animation="highlight"]',

      preloaders: "[data-src]",
    };

    this.id = id;
    this.onMouseWheelEvent = this.onMouseWheel.bind(this);
    this.transformPrefix = Prefix("transform");
  }

  /**
   * @description This method is called to create the
   * page and its elements
   * This method also calls the animations after the oage has been created
   * @returns void
   */
  create() {
    this.element = document.querySelector(this.selector);
    this.elements = {};
    this.scroll = {
      current: 0,
      target: 0,
      last: 0,
      limit: 0,
    };

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
    this.createAnimations();
    this.createPreloaders();
  }

  /**
   * @description This method is called to create the animations
   * for the page elements and stores them in an array of animations
   * @memberof Page
   * @returns void
   *
   */
  createAnimations() {
    this.animations = [];

    //Titles
    this.animationsTitles = map(this.elements.animationsTitles, (element) => {
      return new Title({ element });
    });
    this.animations.push(...this.animationsTitles);

    //Labels
    this.animationsLabels = map(this.elements.animationsLabels, (element) => {
      return new Label({ element });
    });
    this.animations.push(...this.animationsLabels);

    //Paragraphs
    this.animationsParagraphs = map(
      this.elements.animationsParagraphs,
      (element) => {
        return new Paragraph({ element });
      },
    );
    this.animations.push(...this.animationsParagraphs);

    //Highlights
    this.animationsHighlights = map(
      this.elements.animationsHighlights,
      (element) => {
        return new Highlight({ element });
      },
    );
    this.animations.push(...this.animationsHighlights);
  }

  createPreloaders() {
    this.preloaders = map(this.elements.preloaders, (element) => {
      return new AsyncLoad({ element });
    });
  }

  /**
   *
   * @returns Promise
   * @description This method is called to show the page
   */

  show() {
    return new Promise((resolve) => {
      ColorManager.change({
        backgroundColor: this.element.getAttribute("data-background"),
        color: this.element.getAttribute("data-color"),
      });
      this.animateIn = gsap.timeline();

      this.animateIn.fromTo(
        this.element,
        {
          autoAlpha: 0,
        },
        { autoAlpha: 1 },
      );
      this.animateIn.call((_) => {
        this.addEventListeners();
        resolve();
      });
    });
  }
  /**
   *
   * @returns Promise
   * This method is called to hide the page
   */
  hide() {
    return new Promise((resolve) => {
      this.removeEventListeners();

      this.animateOut = gsap.timeline();

      this.animateOut.to(this.element, {
        autoAlpha: 0,
        onComplete: resolve,
      });
    });
  }

  /**
   *
   * @param {*} event
   * This method is called when the mouse wheel is scrolled
   */
  onMouseWheel(event) {
    const { pixelY } = normalizeWheel(event);
    this.scroll.target += pixelY;
  }

  /**
   * @method onResize
   * @description This method is called when the window is resized.
   * It sets the limit of the scroll.
   * The wrapper client height is subtracted from the window height to prevent
   * the page from exceeding the content being displayed.
   * It also calls the onResize method for
   * each animation component
   * @memberof Page
   * @returns void
   */
  onResize() {
    if (this.elements.wrapper) {
      this.scroll.limit =
        this.elements.wrapper.clientHeight - window.innerHeight;
    }
    each(this.animations, (animation) => animation.onResize());
  }

  /**
   * @method update
   * @description This is always being called in the enry point via requestAnimationFrame
   * This makes sure the current frame being rendered is gotten and the scroll
   * target is updated, with a maximum and minimum limit set with gsap utils
   */
  update() {
    this.scroll.target = gsap.utils.clamp(
      0,
      this.scroll.limit,
      this.scroll.target,
    );
    this.scroll.current = gsap.utils.interpolate(
      this.scroll.current,
      this.scroll.target,
      0.1,
    );
    if (this.scroll.current < 0.01) {
      this.scroll.current = 0;
    }

    if (this.elements.wrapper) {
      this.elements.wrapper.style[this.transformPrefix] =
        `translateY(-${this.scroll.current}px)`;
    }
  }

  /**
   * @method addEventListeners
   * @description This method is called to add event listeners to the current page
   */
  addEventListeners() {
    window.addEventListener("mousewheel", this.onMouseWheelEvent);
  }

  /**
   * @method removeEventListeners
   * @description This method is called to remove event listeners
   */
  removeEventListeners() {
    window.removeEventListener("mousewheel", this.onMouseWheelEvent);
  }
}
