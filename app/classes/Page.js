import each from "lodash/each";
import EventEmitter from "events";
import AutoBind from "auto-bind";
import map from "lodash/map";
import gsap from "gsap";
import Prefix from "prefix";

import Title from "animations/Title";
import Label from "animations/Label";
import Paragraph from "animations/Paragraph";
import Highlight from "animations/Highlight";
import Button from "animations/Button";
import Link from "animations/Link";
import Magnetic from "animations/Magnetic";
import Parallax from "animations/Parallax";
import Rotation from "animations/Rotation";
import Translate from "animations/Translate";

import AsyncLoad from "classes/AsyncLoad";
import Detection from "classes/Detection";
import { ColorManager } from "classes/Colors";

import { mapEach } from "utils/dom";
import { clamp, lerp } from "utils/math";

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
export default class Page extends EventEmitter {
  constructor({ classes, element, elements, id, isScrollable = true }) {
    super();

    AutoBind(this);

    this.classes = {
      ...classes,
    };

    this.selectors = {
      element,
      elements: {
        preloaders: "[data-src]",

        animationsButtons: '[data-animation="button"]',
        animationsLinks: '[data-animation="link"]',
        animationsMagnetics: '[data-animation="magnetic"]',
        animationsParallaxes: '[data-animation="parallax"]',
        animationsParagraphs: '[data-animation="paragraph"]',
        animationsRotations: '[data-animation="rotation"]',
        animationsTranslates: '[data-animation="translate"]',

        footer: ".footer",
        footerCredits: ".footer__credits",

        ...elements,
      },
    };

    this.scroll = {
      ease: 0.07,
      position: 0,
      current: 0,
      target: 0,
      limit: 0,
    };

    this.isScrollable = isScrollable;

    this.id = id;
    this.onMouseWheelEvent = this.onWheel.bind(this);
    this.transformPrefix = Prefix("transform");

    this.create();
  }

  /**
   * @description This method is called to create the
   * page and its elements
   * This method also calls the animations after the oage has been created
   * @returns void
   */
  create() {
    this.animations = [];

    this.element = document.querySelector(this.selectors.element);
    this.elements = {};

    each(this.selectors.elements, (selector, key) => {
      if (
        selector instanceof window.HTMLElement ||
        selector instanceof window.NodeList
      ) {
        this.elements[key] = selector;
      } else if (Array.isArray(selector)) {
        this.elements[key] = selector;
      } else {
        this.elements[key] = this.element.querySelectorAll(selector);

        if (this.elements[key].length === 0) {
          this.elements[key] = null;
        } else if (this.elements[key].length === 1) {
          this.elements[key] = this.element.querySelector(selector);
        }
      }
    });

    if (this.isScrollable) {
      this.scroll = {
        ease: 0.07,
        position: 0,
        current: 0,
        target: 0,
        limit: this.elements.wrapper.clientHeight - window.innerHeight,
      };
    }

    this.createAnimations();
    this.createObserver();
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
    /**
     * Buttons.
     */
    this.animationsButtons = mapEach(
      this.elements.animationsButtons,
      (element, index) => {
        return new Button({
          element,
        });
      },
    );

    this.animations.push(...this.animationsButtons);

    /**
     * Links.
     */
    this.animationsLinks = mapEach(
      this.elements.animationsLinks,
      (element, index) => {
        return new Link({
          element,
        });
      },
    );

    this.animations.push(...this.animationsLinks);

    /**
     * Magnetics.
     */
    this.animationsMagnetics = mapEach(
      this.elements.animationsMagnetics,
      (element, index) => {
        return new Magnetic({
          element,
        });
      },
    );

    this.animations.push(...this.animationsMagnetics);

    /**
     * Parallaxes.
     */
    this.animationsParallaxes = mapEach(
      this.elements.animationsParallaxes,
      (element) => {
        return new Parallax({ element });
      },
    );

    this.animations.push(...this.animationsParallaxes);

    /**
     * Paragraphs.
     */
    this.animationsParagraphs = mapEach(
      this.elements.animationsParagraphs,
      (element) => {
        return new Paragraph({ element });
      },
    );

    this.animations.push(...this.animationsParagraphs);

    /**
     * Rotations.
     */
    this.animationsRotations = mapEach(
      this.elements.animationsRotations,
      (element) => {
        return new Rotation({ element });
      },
    );

    this.animations.push(...this.animationsRotations);

    /**
     * Translates.
     */
    this.animationsTranslates = mapEach(
      this.elements.animationsTranslates,
      (element) => {
        return new Translate({ element });
      },
    );

    this.animations.push(...this.animationsTranslates);
  }

  /**
   * @description This method is called to create the observer for the page
   * @memberof Page
   * @returns void
   * @example
   * createObserver()
   */
  createObserver() {
    this.observer = new window.ResizeObserver((entries) => {
      for (const entry of entries) {
        // eslint-disable-line
        window.requestAnimationFrame((_) => {
          this.scroll.limit =
            this.elements.wrapper.clientHeight - window.innerHeight;
        });
      }
    });

    this.observer.observe(this.elements.wrapper);
  }

  /**
   * @description This method is called to create the images on the page asynchronously
   * @memberof Page
   * @returns void
   */
  createPreloaders() {
    this.preloaders = mapEach(this.elements.preloaders, (element) => {
      return new AsyncLoad({ element });
    });
  }
  /**
   *
   */
  reset() {
    this.scroll = {
      ease: 0.07,
      position: 0,
      current: 0,
      target: 0,
      limit: 0,
    };
  }

  /**
   *
   * @param {*} value
   *
   */
  set(value) {
    this.scroll.current = this.scroll.target = this.scroll.last = value;

    this.transform(this.elements.wrapper, this.scroll.current);
  }

  /**
   *
   * @returns Promise
   * @description This method is called to show the page
   */

  show(url) {
    this.reset();

    this.isVisible = true;

    this.addEventListeners();

    GSAP.set(document.documentElement, {
      backgroundColor: this.element.getAttribute("data-background"),
      color: this.element.getAttribute("data-color"),
    });

    return Promise.resolve();
  }
  /**
   *
   * @returns Promise
   * This method is called to hide the page
   */
  hide(url) {
    this.isVisible = false;

    this.removeEventListeners();

    return Promise.resolve();
  }

  transform(element, y) {
    element.style[this.transformPrefix] = `translate3d(0, ${-Math.round(
      y,
    )}px, 0)`;
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
    if (!this.elements.wrapper) return;

    window.requestAnimationFrame((_) => {
      this.scroll.limit =
        this.elements.wrapper.clientHeight - window.innerHeight;

      each(this.animations, (animation) => {
        animation.onResize && animation.onResize();
      });
    });
  }

  onTouchDown(event) {
    if (!Detection.isPhone()) return;

    this.isDown = true;

    this.scroll.position = this.scroll.current;
    this.start = event.touches ? event.touches[0].clientY : event.clientY;
  }

  onTouchMove(event) {
    if (!Detection.isPhone() || !this.isDown) return;

    const y = event.touches ? event.touches[0].clientY : event.clientY;
    const distance = (this.start - y) * 3;

    this.scroll.target = this.scroll.position + distance;
  }

  onTouchUp(event) {
    if (!Detection.isPhone()) return;

    this.isDown = false;
  }

  onWheel(normalized) {
    const speed = normalized.pixelY;

    this.scroll.target += speed;

    return speed;
  }

  /**
   * Listeners.
   */
  addEventListeners() {}

  removeEventListeners() {}

  /**
   * @method update
   * @description This is always being called in the enry point via requestAnimationFrame
   * This makes sure the current frame being rendered is gotten and the scroll
   * target is updated, with a maximum and minimum limit set with gsap utils
   */
  update() {
    this.scroll.target = clamp(0, this.scroll.limit, this.scroll.target);

    this.scroll.current = lerp(
      this.scroll.current,
      this.scroll.target,
      this.scroll.ease,
    );
    this.scroll.current = Math.floor(this.scroll.current);

    if (this.scroll.current < 0.1) {
      this.scroll.current = 0;
    }

    if (this.elements.wrapper) {
      this.transform(this.elements.wrapper, this.scroll.current);
    }

    each(this.animations, (animation) => {
      animation.update && animation.update(this.scroll);
    });

    this.scroll.last = this.scroll.current;
  }
}
