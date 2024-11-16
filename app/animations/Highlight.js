import gsap from "gsap";

import Animation from "classes/Animation";

/**
 * @description This class is used to create an animation
 * for an element title
 * @example
 * import Animation from "classes/Animation";
 * new Animation({ element });
 * @exports Animation
 */
export default class Highlight extends Animation {
  constructor({ element, elements }) {
    super({
      element,
      elements,
    });
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

  onResize() {}
}
