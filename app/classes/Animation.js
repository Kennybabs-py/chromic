import AutoBind from "auto-bind";
import Prefix from "prefix";

/**
 * @description This class is used to create an animation
 * for an element
 * @example
 * import Animation from "classes/Animation";
 * new Animation({ element });
 * @exports Animation
 */
export default class Animation {
  constructor({ element, elements }) {
    AutoBind(this);

    const { animationDelay, animationTarget } = element.dataset;

    this.delay = animationDelay;

    this.element = element;
    this.elements = elements;

    this.target = animationTarget ? element.closest(animationTarget) : element;
    this.transformPrefix = Prefix("transform");

    this.isVisible = false;

    if ("IntersectionObserver" in window) {
      this.createObserver();

      this.animateOut();
    } else {
      this.animateIn();
    }
  }

  /**
   * @description This method is called to create the observer
   * for the animation
   * @returns void
   * @example
   * this.createObserver();
   * @memberof Animation
   */
  createObserver() {
    this.observer = new window.IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!this.isVisible && entry.isIntersecting) {
          this.animateIn();
        } else {
          this.animateOut();
        }
      });
    }).observe(this.target);
  }

  animateIn() {
    this.isVisible = true;
  }

  animateOut() {
    this.isVisible = false;
  }
}
