import gsap from "gsap";
import each from "lodash/each";

import Animation from "classes/Animation";
import { calculate, split } from "utils/text";

/**
 * @description This class is used to create an animation
 * for an element title
 * @example
 * import Animation from "classes/Animation";
 * new Animation({ element });
 * @exports Animation
 */
export default class Paragraph extends Animation {
  constructor({ element, elements }) {
    super({
      element,
      elements,
    });

    this.elementLinesSpans = split({
      element: this.element,
      append: true,
    });
  }

  animateIn() {
    this.timelineIn = gsap.timeline({
      delay: 0.5,
    });
    this.timelineIn.set(this.element, {
      autoAlpha: 1,
    });
    each(this.elementsLines, (line, index) => {
      this.timelineIn.fromTo(
        line,
        {
          y: "100%",
          autoAlpha: 0,
        },
        {
          y: "0%",
          autoAlpha: 1,
          ease: "expo.out",
          duration: 1.5,
          delay: index * 0.2,
        },
        0,
      );
    });
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
  onResize() {
    this.elementsLines = calculate(this.elementLinesSpans);
  }
}
