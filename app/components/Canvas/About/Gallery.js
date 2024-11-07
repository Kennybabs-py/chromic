import { Program, Mesh, Texture } from "ogl";
import gsap from "gsap";

import vertex from "shaders/plane-vertex.vert";
import fragment from "shaders/plane-fragment.frag";
import Media from "./Media";

export default class Gallery {
  constructor({ element, index, geometry, gl, scene, sizes }) {
    this.element = element;
    this.gl = gl;
    this.geometry = geometry;
    this.scene = scene;
    this.sizes = sizes;
    this.index = index;

    this.createMedias();

    // this.createTexture();
    // this.createProgram();
    // this.createMesh();

    // The recurring dom element after scroll
    this.extra = {
      x: 0,
      y: 0,
    };
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
}
