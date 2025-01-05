import { Program, Mesh, Transform } from "ogl";
import gsap from "gsap";

import Component from "classes/Component";
import MediaDOM from "./MediaDOM";

import vertex from "shaders/collections-vertex.vert";
import fragment from "shaders/collections-fragment.frag";

export default class Media extends Component {
  constructor({ detail, element, index, geometry, gl, scene, sizes }) {
    super({
      element,
      elements: {
        image: ".collections__gallery__media__image",
      },
    });

    this.detail = detail;
    this.gl = gl;
    this.geometry = geometry;
    this.index = index;
    this.scene = scene;
    this.sizes = sizes;

    this.animation = 0;
    this.group = new Transform();
    this.frame = 0;

    this.opacity = {
      current: 0,
      target: 0,
      lerp: 0.1,
      multiplier: 0,
    };

    this.createDetail();
    this.createJewelry();
    this.createModel();

    this.createBounds({ sizes: this.sizes });

    this.original =
      -this.sizes.width / 2 +
      this.jewelry.scale.x / 2 +
      this.x * this.sizes.width;

    this.group.setParent(this.scene);
  }

  createDetail() {
    this.detailDOM = new MediaDOM({
      element: this.detail,
    });

    this.detailDOM.on("close", this.animateOut.bind(this));
  }

  createJewelry() {
    const program = new Program(this.gl, {
      fragment,
      vertex,
      uniforms: {
        uAlpha: { value: 0 },
        tMap: {
          value: window.TEXTURES[this.elements.image.getAttribute("data-src")],
        },
      },
    });

    this.jewelry = new Mesh(this.gl, {
      geometry: this.geometry,
      program,
    });

    this.jewelry.index = this.index;

    this.jewelry.setParent(this.group);
  }

  createModel() {
    const program = new Program(this.gl, {
      fragment,
      vertex,
      uniforms: {
        uAlpha: { value: 0 },
        tMap: {
          value:
            window.TEXTURES[this.elements.image.getAttribute("data-model-src")],
        },
      },
    });

    this.model = new Mesh(this.gl, {
      geometry: this.geometry,
      program,
    });

    this.model.rotation.y = Math.PI;

    this.model.setParent(this.group);
  }

  createBounds({ sizes }) {
    this.sizes = sizes;

    this.collectionsBounds = this.element.getBoundingClientRect();

    this.updateScale();
    this.updateX();
  }

  show() {
    gsap.to(this.opacity, { delay: 0.5, multiplier: 1 });
  }

  hide() {
    gsap.to(this.opacity, { multiplier: 0 });

    this.detailDOM.animateOut();
  }

  onResize(event, scroll) {
    this.detailDOM.onResize();

    this.createBounds(event);
    this.updateX(scroll && scroll.x);
  }

  animateIn() {
    gsap.to(this, {
      animation: 1,
      duration: 2,
      ease: "expo.inOut",
    });

    this.detailDOM.animateIn();

    this.emit("open", this.index);
  }

  animateOut() {
    gsap.to(this, {
      animation: 0,
      duration: 2,
      ease: "expo.inOut",
    });

    this.detailDOM.animateOut();

    this.emit("close", this.index);
  }

  updateScale() {
    // To get the percentage of dom width & height in the window
    const height = gsap.utils.interpolate(
      this.collectionsBounds.height,
      this.detailDOM.bounds.height,
      this.animation,
    );
    const width = gsap.utils.interpolate(
      this.collectionsBounds.width,
      this.detailDOM.bounds.width,
      this.animation,
    );

    this.width = width / window.innerWidth;
    this.height = height / window.innerHeight;

    this.jewelry.scale.x = this.sizes.width * this.width;
    this.jewelry.scale.y = this.sizes.height * this.height;

    this.model.scale.x = this.sizes.width * this.width;
    this.model.scale.y = this.sizes.height * this.height;
  }

  updateX(scroll = 0) {
    const x = gsap.utils.interpolate(
      this.collectionsBounds.left + scroll,
      this.detailDOM.bounds.left,
      this.animation,
    );

    this.x = x / window.innerWidth;

    this.group.position.x =
      -this.sizes.width / 2 +
      this.jewelry.scale.x / 2 +
      this.x * this.sizes.width;

    this.group.position.z = gsap.utils.interpolate(0, 0.1, this.animation);

    this.group.rotation.y = gsap.utils.interpolate(
      0,
      2 * Math.PI,
      this.animation,
    );
  }

  update(scroll, index) {
    this.updateX(scroll);
    this.updateScale();

    const amplitude = 0.5;
    const frequency = 500;

    const sliderY =
      Math.sin((this.original / 10) * (Math.PI * 2) + this.frame / frequency) *
      amplitude;
    const detailY = 0;

    if (this.animation > 0.01) {
      this.jewelry.program.depthTest = false;
      this.jewelry.program.depthWrite = false;

      this.model.program.depthTest = false;
      this.model.program.depthWrite = false;
    } else {
      this.jewelry.program.depthTest = true;
      this.jewelry.program.depthWrite = true;

      this.model.program.depthTest = true;
      this.model.program.depthWrite = true;
    }

    this.group.position.y = gsap.utils.interpolate(
      sliderY,
      detailY,
      this.animation,
    );

    const sliderZ = gsap.utils.mapRange(
      -this.sizes.width * 0.25,
      this.sizes.width * 0.25,
      this.group.position.y * 0.3,
      -this.group.position.y * 0.3,
      this.group.position.x,
    );
    const detailZ = Math.PI * 0.01;

    this.group.rotation.z = gsap.utils.interpolate(
      sliderZ,
      detailZ,
      this.animation,
    );

    // Setting the opacity of the card
    this.opacity.target = index === this.index ? 1 : 0.4;
    this.opacity.current = gsap.utils.interpolate(
      this.opacity.current,
      this.opacity.target,
      this.opacity.lerp,
    );
    this.jewelry.program.uniforms.uAlpha.value =
      this.opacity.multiplier * this.opacity.current;
    this.model.program.uniforms.uAlpha.value =
      this.opacity.multiplier * this.opacity.current;

    this.frame += 1;
  }
}
