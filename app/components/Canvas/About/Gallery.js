import { Transform } from "ogl";
import gsap from "gsap";
import map from "lodash/map";

import Media from "./Media";

export default class Gallery {
  constructor({ element, index, geometry, gl, scene, sizes }) {
    this.element = element;
    this.elementWrapper = this.element.querySelector(
      ".about__gallery__wrapper",
    );
    this.gl = gl;
    this.geometry = geometry;
    this.scene = scene;
    this.sizes = sizes;
    this.index = index;

    this.group = new Transform();

    // this.createTexture();
    // this.createProgram();
    // this.createMesh();

    this.scroll = {
      start: 0,
      current: 0,
      target: 0,
      lerp: 0.1,
      velocity: 1,
    };

    // The recurring dom element after scroll
    this.extra = {
      x: 0,
      y: 0,
    };

    this.createMedias();
    this.group.setParent(this.scene);
  }

  createMedias() {
    this.mediasElements = this.element.querySelectorAll(
      ".about__gallery__media",
    );

    this.medias = map(this.mediasElements, (element, index) => {
      return new Media({
        element: element,
        index: index,
        geometry: this.geometry,
        gl: this.gl,
        scene: this.group,
        sizes: this.sizes,
      });
    });
  }

  show() {
    map(this.medias, (media) => {
      media.show();
    });
  }

  hide() {
    map(this.medias, (media) => {
      media.hide();
    });
  }

  /**
   *
   * @param {Event} event
   * onResize
   */
  onResize(event) {
    this.bounds = this.elementWrapper.getBoundingClientRect();

    this.sizes = event.sizes;

    this.galleryWidth =
      (this.bounds.width / window.innerWidth) * this.sizes.width;

    this.scroll.current = this.scroll.target = 0;

    map(this.medias, (media) => {
      media.onResize(event, this.scroll.current);
    });
  }

  /**
   *
   * @param {{x:number, y:number}}
   * onTouchDown for canvas
   */
  onTouchDown({ x, y }) {
    this.scroll.start = this.scroll.current;
  }
  /**
   *
   * @param {{x:number, y:number}}
   * onTouchMove for canvas
   */
  onTouchMove({ x, y }) {
    const distance = x.start - x.end;

    this.scroll.target = this.scroll.start - distance;
  }
  /**
   *
   * @param {{x:number, y:number}}
   * onTouchUp for canvas
   */
  onTouchUp({ x, y }) {}

  /**
   *
   * Argument y is from the page current scroll
   * @argument {number} y
   * Scroll update
   */
  update(scroll) {
    if (!this.bounds) return;
    // Distance from top of screen to get speed of translation when scrolling
    const distance = (scroll.current - scroll.target) * 0.1;

    const y = scroll.current / window.innerHeight;

    // Checks the scroll direction
    if (this.scroll.current < this.scroll.target) {
      this.direction = "right";
      this.scroll.velocity = -1;
    } else if (this.scroll.current > this.scroll.target) {
      this.direction = "left";
      this.scroll.velocity = 1;
    }

    // For automatic scrolling
    this.scroll.target -= this.scroll.velocity;
    // For automatic translation when scrolling the screen
    this.scroll.target += distance;

    // This updates the current position of scroll with the target after scrolling
    this.scroll.current = gsap.utils.interpolate(
      this.scroll.current,
      this.scroll.target,
      this.scroll.lerp,
    );

    map(this.medias, (media, _) => {
      const meshScaleX = media.mesh.scale.x / 2 + 0.25;

      // Infinite scrolling in any direction
      if (this.direction === "left") {
        const x = media.mesh.position.x + meshScaleX;
        if (x < -this.sizes.width / 2) {
          media.extra += this.galleryWidth;
        }
      } else if (this.direction === "right") {
        const x = media.mesh.position.x - meshScaleX;

        if (x > this.sizes.width / 2) {
          media.extra -= this.galleryWidth;
        }
      }

      media.update(this.scroll.current);

      // This provides a mapped number from 0 -> 1. The closer it is to the center, thr lower it is going to be
      //   media.mesh.position.y =
      //     Math.cos((media.mesh.position.x / this.galleryWidth) * Math.PI) * 75 -
      //     75;
    });
    this.group.position.y = y * this.sizes.height;
  }

  destroy() {
    this.scene.removeChild(this.group);
  }
}
