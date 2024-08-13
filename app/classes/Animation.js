import Component from "classes/Component";

/**
 * @description This class is used to create an animation
 * for an element
 * @example
 * import Animation from "classes/Animation";
 * new Animation({ element });
 * @exports Animation
 */
export default class Animation extends Component {
  constructor({ element, elements }) {
    super({
      element,
      elements,
    });
    this.createObserver();
    this.animateOut();
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
        if (entry.isIntersecting) {
          this.animateIn();
        } else {
          this.animateOut();
        }
      });
    });
    this.observer.observe(this.element);
  }

  animateIn() {}
  animateOut() {}
}
