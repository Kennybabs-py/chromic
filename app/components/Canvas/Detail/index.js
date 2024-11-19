import { Program, Mesh, Plane } from "ogl";
import gsap from "gsap";

import vertex from "shaders/plane-vertex.vert";
import fragment from "shaders/plane-fragment.frag";

export default class Detail {
  constructor({ gl, scene, sizes, transition }) {
    this.id = "detail";
    this.element = document.querySelector(".detail__media__image");
    this.gl = gl;
    this.scene = scene;
    this.sizes = sizes;
    this.transition = transition;

    this.geometry = new Plane(this.gl);

    this.createTexture();
    this.createProgram();
    this.createMesh();
    this.createBounds({ sizes: this.sizes });

    this.show();
  }

  createTexture() {
    const elementImageSrc = this.element.getAttribute("data-src");
    this.texture = window.TEXTURES[elementImageSrc];
  }

  createProgram() {
    this.program = new Program(this.gl, {
      vertex: vertex,
      fragment: fragment,
      uniforms: { uAlpha: { value: 0 }, tMap: { value: this.texture } },
    });
  }

  createMesh() {
    this.mesh = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program,
    });

    this.mesh.rotation.z = Math.PI * 0.01;
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
    if (this.transition) {
      this.transition.animate(this.mesh, (_) => {
        this.program.uniforms.uAlpha.value = 1;
      });
    } else {
      gsap.to(this.program.uniforms.uAlpha, { value: 1 });
    }
  }

  hide() {
    gsap.to(this.program.uniforms.uAlpha, { value: 0 });
  }

  onResize(event) {
    this.createBounds(event);
    this.updateX();
    this.updateY();
  }

  /**
   *
   * @param {Event} event
   */
  onTouchDown(event) {}
  /**
   *
   * @param {Event} event
   */
  onTouchMove(event) {}
  /**
   *
   * @param {Event} event
   */
  onTouchUp(event) {}

  updateScale() {
    // To get the percentage of dom width & height in the window
    this.width = this.bounds.width / window.innerWidth;
    this.height = this.bounds.height / window.innerHeight;

    this.mesh.scale.x = this.sizes.width * this.width;
    this.mesh.scale.y = this.sizes.height * this.height;
  }

  updateX() {
    this.x = this.bounds.left / window.innerWidth;

    this.mesh.position.x =
      -this.sizes.width / 2 + this.mesh.scale.x / 2 + this.x * this.sizes.width;
  }

  updateY() {
    this.y = this.bounds.top / window.innerHeight;

    this.mesh.position.y =
      this.sizes.height / 2 -
      this.mesh.scale.y / 2 -
      this.y * this.sizes.height;
  }
  update() {
    this.updateX();
    this.updateY();
  }

  destroy() {
    this.scene.removeChild(this.mesh);
  }
}
