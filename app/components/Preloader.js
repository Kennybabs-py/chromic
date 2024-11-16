import gsap from "gsap";
import { Texture } from "ogl";

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
  constructor({ canvas }) {
    super({
      element: ".preloader",
      elements: {
        title: ".preloader__text",
        number: ".preloader__number",
        numberText: ".preloader__number__text",
      },
    });
    this.canvas = canvas;

    window.TEXTURES = {};

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
    window.ASSETS.forEach((image) => {
      const texture = new Texture(this.canvas.gl, {
        generateMipmaps: false,
      });

      const newImage = new window.Image();
      newImage.crossOrigin = "anonymous";
      newImage.src = image;

      newImage.onload = () => {
        texture.image = newImage;
        this.onAssetLoaded();
      };

      window.TEXTURES[image] = texture;
    });
  }

  onAssetLoaded() {
    this.length += 1;
    const percent = this.length / window.ASSETS.length;

    this.elements.numberText.innerHTML = `${Math.round(percent * 100)}%`;
    if (percent === 1) {
      this.onLoaded();
    }
  }

  onLoaded() {
    return new Promise((resolve) => {
      this.emit("completed");

      this.animateOut = gsap.timeline({ delay: 1 });

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
          autoAlpha: 0,
          duration: 1,
        },
        "-=1",
      );

      this.animateOut.call(() => this.destroy());
    });
  }

  destroy() {
    this.element.parentNode.removeChild(this.element);
  }
}
