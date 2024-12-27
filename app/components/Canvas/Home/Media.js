import { Program, Mesh } from "ogl";
import gsap from "gsap";

import vertex from "shaders/home-vertex.vert";
import fragment from "shaders/home-fragment.frag";

export default class Media {
  constructor({ element, index, geometry, gl, scene, sizes }) {
    this.element = element;
    this.gl = gl;
    this.geometry = geometry;
    this.scene = scene;
    this.sizes = sizes;
    this.index = index;

    // The recurring dom element after scroll
    this.extra = {
      x: 0,
      y: 0,
    };

    this.createTexture();
    this.createProgram();
    this.createMesh();
    this.createBounds({ sizes: this.sizes });
  }

  createTexture() {
    const image = this.element;

    this.texture = window.TEXTURES[image.getAttribute("data-src")];
  }

  createProgram() {
    this.program = new Program(this.gl, {
      vertex: vertex,
      fragment: fragment,
      uniforms: {
        uAlpha: { value: 0 },
        uSpeed: { value: 0 },
        uViewportSizes: { value: [this.sizes.width, this.sizes.height] },
        tMap: { value: this.texture },
      },
    });
  }

  createMesh() {
    this.mesh = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program,
    });

    this.mesh.setParent(this.scene);

    // this.mesh.rotation.z = gsap.utils.random(-Math.PI * 0.03, Math.PI * 0.03);
  }

  createBounds({ sizes }) {
    // The width and height of the canvas field of view
    this.sizes = sizes;

    this.bounds = this.element.getBoundingClientRect();

    this.updateScale();
    this.updateX();
    this.updateY();
  }

  show(isPreloaded) {
    const delay = isPreloaded ? 2.5 : 0;

    this.timelineIn = GSAP.timeline({
      delay: gsap.utils.random(delay, delay + 1.5),
    });

    this.timelineIn.fromTo(
      this.program.uniforms.uAlpha,
      {
        value: 0,
      },
      {
        duration: 2,
        ease: "expo.inOut",
        value: 0.4,
      },
      "start",
    );

    this.timelineIn.fromTo(
      this.mesh.position,
      {
        z: GSAP.utils.random(2, 6),
      },
      {
        duration: 2,
        ease: "expo.inOut",
        z: 0,
      },
      "start",
    );
  }

  hide() {
    // gsap.to(this.program.uniforms.uAlpha, { value: 0 });
  }

  onResize(event, scroll) {
    this.extra = {
      x: 0,
      y: 0,
    };

    this.createBounds(event);
    this.updateX(scroll && scroll.x);
    this.updateY(scroll && scroll.y);
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
  update(scroll, speed) {
    this.updateX(scroll.x);
    this.updateY(scroll.y);

    this.program.uniforms.uSpeed.value = speed;
  }
}
