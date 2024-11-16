import gsap from "gsap";
// import each from "lodash/each";

import Animation from "classes/Animation";
// import { calculate, split } from "utils/text";

/**
 * @description This class is used to create an animation
 * for an element title
 * @example
 * import Animation from "classes/Animation";
 * new Animation({ element });
 * @exports Animation
 */
export default class Title extends Animation {
  constructor({ element, elements }) {
    super({
      element,
      elements,
    });

    // split({
    //   element: this.element,
    //   append: true,
    // });

    // split({
    //   element: this.element,
    //   append: true,
    // });

    // this.elementLinesSpans = this.element.querySelectorAll("span span");
  }

  animateIn() {
    gsap.fromTo(
      this.element,
      {
        autoAlpha: 0,
        delay: 0.5,
      },
      {
        autoAlpha: 1,
        duration: 1,
      },
    );
  }

  animateOut() {
    gsap.set(this.element, {
      autoAlpha: 0,
    });
  }

  /**
   * @description This method is called to resize the element
   * @memberof Title
   * @returns void
   */
  // onResize() {
  //   this.elementsLines = calculate(this.elementLinesSpans);
  // }
}
