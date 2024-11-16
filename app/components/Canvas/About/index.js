import map from "lodash/map";
import { Plane, Transform } from "ogl";
import gsap from "gsap";

import Gallery from "./Gallery";
export default class About {
  constructor({ gl, scene, sizes }) {
    this.gl = gl;
    this.group = new Transform();
    this.sizes = sizes;

    this.createGeometry();
    this.createGalleries();

    this.group.setParent(scene);

    this.show();
  }

  createGeometry() {
    this.geometry = new Plane(this.gl);
  }
  createGalleries() {
    this.galleriesElements = document.querySelectorAll(".about__gallery");

    this.galleries = map(this.galleriesElements, (element, index) => {
      return new Gallery({
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
    map(this.galleries, (gallery) => {
      gallery.show();
    });
  }

  hide() {
    map(this.galleries, (gallery) => {
      gallery.hide();
    });
  }

  onResize(event) {
    map(this.galleries, (gallery) => {
      gallery.onResize(event);
    });
  }

  /**
   *
   * @param {Event} event
   * onTouchDown for galleries
   */
  onTouchDown(event) {
    map(this.galleries, (gallery) => {
      gallery.onTouchDown(event);
    });
  }
  /**
   *
   * @param {Event} event
   * onTouchMove for canvas
   */
  onTouchMove(event) {
    map(this.galleries, (gallery) => {
      gallery.onTouchMove(event);
    });
  }
  /**
   *
   * @param {Event} event
   * onTouchUp for canvas
   */
  onTouchUp(event) {
    map(this.galleries, (gallery) => {
      gallery.onTouchUp(event);
    });
  }

  onWheel({ pixelY, pixelX }) {}

  /**
   *
   * @param {{x:number, y:number}} {x, y}
   * Scroll update
   */
  update(scroll) {
    map(this.galleries, (gallery, _) => {
      gallery.update(scroll);
    });
  }

  destroy() {
    map(this.galleries, (gallery) => {
      gallery.destroy();
    });
  }
}
