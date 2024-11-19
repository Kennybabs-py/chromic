import { Program, Mesh } from "ogl";
import gsap from "gsap";

import vertex from "shaders/about-vertex.vert";
import fragment from "shaders/about-fragment.frag";

export default class Media {
  constructor({ element, index, geometry, gl, scene, sizes }) {
    this.element = element;
    this.gl = gl;
    this.geometry = geometry;
    this.scene = scene;
    this.sizes = sizes;
    this.index = index;

    this.createTexture();
    this.createProgram();
    this.createMesh();

    // The recurring dom element after scroll
    this.extra = {
      x: 0,
      y: 0,
    };

    this.createBounds({ sizes: this.sizes });
  }

  createTexture() {
    const elementImage = this.element.querySelector("img");
    this.texture = window.TEXTURES[elementImage.getAttribute("data-src")];
  }

  createProgram() {
    this.program = new Program(this.gl, {
      vertex: vertex,
      fragment: fragment,
      uniforms: {
        uAlpha: { value: 0 },
        tMap: { value: this.texture },
        uSpeed: { value: 0 },
        uTime: { value: 0 },
      },
    });
  }

  createMesh() {
    this.mesh = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program,
    });

    this.mesh.setParent(this.scene);
  }

  createBounds({ sizes }) {
    // The width and height of the canvas field of view
    this.sizes = sizes;
    this.bounds = this.element.getBoundingClientRect();

    this.updateScale();
    this.updateX();
    this.updateY();
  }

  show() {
    gsap.fromTo(this.program.uniforms.uAlpha, { value: 0 }, { value: 1 });
  }

  hide() {
    gsap.to(this.program.uniforms.uAlpha, { value: 0 });
  }

  onResize(event, scroll) {
    this.extra = 0;

    this.createBounds(event);
    this.updateX(scroll);
    this.updateY(0);
  }

  /**
   * This maps the width range of the canvas field of view to PI
   * to get an accurate mapped value of rotation based on the x-position
   */
  updateRotation() {
    this.mesh.rotation.z = gsap.utils.mapRange(
      -this.sizes.width / 2,
      this.sizes.width / 2,
      Math.PI * 0.1,
      -Math.PI * 0.1,
      this.mesh.position.x,
    );
  }

  updateScale() {
    // To get the percentage of dom width & height in the window
    this.width = this.bounds.width / window.innerWidth;
    this.height = this.bounds.height / window.innerHeight;

    this.mesh.scale.x = this.sizes.width * this.width;
    this.mesh.scale.y = this.sizes.height * this.height;
  }

  updateX(x = 0) {
    this.x = (this.bounds.left + x) / window.innerWidth;

    this.mesh.position.x =
      -this.sizes.width / 2 +
      this.mesh.scale.x / 2 +
      this.x * this.sizes.width +
      this.extra;
  }

  updateY(y = 0) {
    this.y = (this.bounds.top + y) / window.innerHeight;

    this.mesh.position.y =
      this.sizes.height / 2 -
      this.mesh.scale.y / 2 -
      this.y * this.sizes.height;

    this.mesh.position.y +=
      Math.cos((this.mesh.position.x / this.sizes.width) * Math.PI * 0.1) * 50 -
      50;
  }
  update(scroll) {
    this.updateRotation();

    this.updateX(scroll);
    this.updateY(0);

    // Paper Distortion on Texture
    this.program.uniforms.uTime.value += 0.0002;
    this.program.uniforms.uSpeed.value = scroll * 0.00001;
  }
}
