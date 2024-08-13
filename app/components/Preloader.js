import each from "lodash/each";
import gsap from "gsap";

import Component from "classes/Component";
import { split } from "utils/text";

/**
 * @class Preloader
 * @extends Component
 * @exports Preloader
 * @description This class is the base
 * class for the preloader in the application
 * It contains methods that are common to all preloaders
 * and can be extended by other preloaders
 */
export default class Preloader extends Component {
  constructor() {
    super({
      element: ".preloader",
      elements: {
        title: ".preloader__text",
        number: ".preloader__number",
        numberText: ".preloader__number__text",
        images: document.querySelectorAll("img"),
      },
    });

    split({
      element: this.elements.title,
      expression: "<br>",
    });

    split({
      element: this.elements.title,
      expression: "<br>",
    });

    this.elements.titleSpans =
      this.elements.title.querySelectorAll("span span");

    this.length = 0;

    this.createLoader();
  }

  createLoader() {
    each(this.elements.images, (element) => {
      element.onload = () => this.onAssetLoaded(element);
      element.src = element.getAttribute("data-src");
    });
  }

  onAssetLoaded(image) {
    this.length += 1;
    const percent = this.length / this.elements.images.length;

    this.elements.numberText.innerHTML = `${Math.round(percent * 100)}%`;
    if (percent === 1) {
      this.onLoaded();
    }
  }

  onLoaded() {
    return new Promise((resolve) => {
      this.animateOut = gsap.timeline({ delay: 2 });

      this.animateOut.to(this.elements.titleSpans, {
        autoAlpha: 0,
        y: "100%",
        duration: 1.5,
        ease: "expo.out",
        stagger: 0.1,
      });

      this.animateOut.to(
        this.elements.numberText,
        {
          autoAlpha: 0,
          y: "100%",
          duration: 1.5,
          ease: "expo.out",
          stagger: 0.1,
        },
        "-=1.4",
      );
      this.animateOut.to(
        this.element,
        {
          scaleY: 0,
          transformOrigin: "100% 100%",
          duration: 1,
          ease: "expo.out",
        },
        "-=1",
      );
      this.animateOut.call(() => {
        this.emit("completed");
      });
    });
  }

  destroy() {
    this.element.parentNode.removeChild(this.element);
  }
}
