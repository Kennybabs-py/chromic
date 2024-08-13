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
    this.timelineIn = gsap.timeline({
      delay: 0.5,
    });
    this.timelineIn.fromTo(
      this.element,
      {
        autoAlpha: 0,
        scale: 1.2,
      },
      {
        autoAlpha: 1,
        ease: "expo.out",
        scale: 1,
        duration: 1.5,
      },
      0,
    );
  }

  animateOut() {
    gsap.set(this.element, {
      autoAlpha: 0,
    });
  }

  onResize() {}
}
