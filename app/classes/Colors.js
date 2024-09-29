import gsap from "gsap";

/**
 * @class Colors
 * @description This class is responsible for changing the colors
 * of the page
 * @method change
 * @param {Object} backgroundColor
 * @param {Object} color
 * @returns void
 */
class Colors {
  constructor() {}

  /**
   *
   * @param {{backgroundColor:string, color:string}} {background, color} hex value
   * @param {Object} color hex value
   * @returns void
   */
  change({ backgroundColor, color }) {
    gsap.to(document.documentElement, {
      duration: 1.5,
      backgroundColor,
      color,
    });
  }
}

export const ColorManager = new Colors();
