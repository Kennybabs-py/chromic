import { Program, Mesh, Texture } from "ogl";
import gsap from "gsap";

import vertex from "shaders/plane-vertex.vert";
import fragment from "shaders/plane-fragment.frag";

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
  }

  createTexture() {
    this.texture = new Texture(this.gl);
    this.image = new Image();
    this.image.crossOrigin = "anonymous";
    this.image.src = this.element.getAttribute("data-src");
    this.image.onload = (_) => (this.texture.image = this.image);
  }

  createProgram() {
    this.program = new Program(this.gl, {
      vertex: vertex,
      fragment: fragment,
      uniforms: { tMap: { value: this.texture } },
    });
  }

  createMesh() {
    this.mesh = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program,
    });

    this.mesh.setParent(this.scene);

    this.mesh.rotation.z = gsap.utils.random(-Math.PI * 0.03, Math.PI * 0.03);
  }

  createBounds({ sizes }) {
    // The width and height of the canvas field of view
    this.sizes = sizes;
    this.bounds = this.element.getBoundingClientRect();

    this.updateScale();
    this.updateX();
    this.updateY();
  }

  onResize(event, scroll) {
    this.extra = {
      x: 0,
      y: 0,
    };

    this.createBounds(event);
    this.updateX(scroll.x);
    this.updateY(scroll.y);
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
      this.extra.x;
  }

  updateY(y = 0) {
    this.y = (this.bounds.top + y) / window.innerHeight;

    this.mesh.position.y =
      this.sizes.height / 2 -
      this.mesh.scale.y / 2 -
      this.y * this.sizes.height +
      this.extra.y;
  }
  update(scroll) {
    if (!this.bounds) return;

    this.updateX(scroll.x);
    this.updateY(scroll.y);
  }
}
