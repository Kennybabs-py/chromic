import { Camera, Renderer, Transform } from "ogl";
import gsap from "gsap";

import Home from "./Home";
import About from "./About";
import Collections from "./Collections";
import Detail from "./Detail";
import Transition from "./Transition";

export default class Canvas {
  constructor({ template }) {
    this.template = template;

    this.x = {
      start: 0,
      distance: 0,
      end: 0,
    };
    this.y = {
      start: 0,
      distance: 0,
      end: 0,
    };
    this.createRenderer();
    this.createCamera();
    this.createScene();

    this.onResize();
  }

  createRenderer() {
    this.renderer = new Renderer({ alpha: true, antialias: true });
    this.gl = this.renderer.gl;
    document.body.appendChild(this.gl.canvas);
  }

  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.position.z = 5;
  }

  createScene() {
    this.scene = new Transform();
  }

  createHome() {
    this.home = new Home({ gl: this.gl, scene: this.scene, sizes: this.sizes });
  }

  destroyHome() {
    if (!this.home) return;
    this.home.destroy();
    this.home = null;
  }

  createAbout() {
    this.about = new About({
      gl: this.gl,
      scene: this.scene,
      sizes: this.sizes,
    });
  }

  destroyAbout() {
    if (!this.about) return;
    this.about.destroy();
    this.about = null;
  }

  createCollections() {
    this.collections = new Collections({
      gl: this.gl,
      scene: this.scene,
      sizes: this.sizes,
      transition: this.transition,
    });
  }

  destroyCollections() {
    if (!this.collections) return;
    this.collections.destroy();
    this.collections = null;
  }

  createDetail() {
    this.detail = new Detail({
      gl: this.gl,
      scene: this.scene,
      sizes: this.sizes,
      transition: this.transition,
    });
  }

  destroyDetail() {
    if (!this.detail) return;
    this.detail.destroy();
    this.detail = null;
  }

  onPreloaded() {
    this.onChangeEnd(this.template);
  }

  /**
   * for hiding canvas on an active page
   * @argument {template, url} string
   */
  onChangeStart(template, url) {
    this.isFromCollectionstToDetail =
      this.template === "collections" && url.indexOf("detail") > -1;
    this.isFromDetailToCollections =
      this.template === "detail" && url.indexOf("collections") > -1;

    if (this.home) {
      this.home.hide();
    }
    if (this.about) {
      this.about.hide();
    }
    if (this.collections) {
      this.collections.hide();
    }

    if (this.detail) {
      this.detail.hide();
    }

    if (this.isFromCollectionstToDetail || this.isFromDetailToCollections) {
      this.transition = new Transition({
        url: url,
        gl: this.gl,
        scene: this.scene,
        sizes: this.sizes,
      });

      this.transition.setElement(this.collections || this.detail);
    }
  }

  /**
   * creates active page scene on change of route
   * @argument {string} template
   */
  onChangeEnd(template) {
    if (template === "home") {
      this.createHome();
    } else if (this.home) {
      this.destroyHome();
    }

    if (template === "about") {
      this.createAbout();
    } else if (this.about) {
      this.destroyAbout();
    }
    if (template === "collections") {
      this.createCollections();
    } else if (this.collections) {
      this.destroyCollections();
    }

    if (template === "detail") {
      this.createDetail();
    } else if (this.detail) {
      this.destroyDetail();
    }
    this.template = template;
  }

  onResize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.perspective({
      aspect: window.innerWidth / window.innerHeight,
    });
    // fov - field of view
    const fov = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;

    // sizes of the field of view
    this.sizes = {
      height,
      width,
    };
    if (this.home) {
      this.home.onResize({ sizes: this.sizes });
    }
    if (this.about) {
      this.about.onResize({ sizes: this.sizes });
    }
    if (this.collections) {
      this.collections.onResize({ sizes: this.sizes });
    }
    if (this.detail) {
      this.detail.onResize({ sizes: this.sizes });
    }
  }

  /**
   *
   * @param {Event} event
   * onTouchDown for canvas
   */
  onTouchDown(event) {
    this.isDown = true;

    this.x.start = event.touches ? event.touches[0].clientX : event.clientX;
    this.y.start = event.touches ? event.touches[0].clientY : event.clientY;

    if (this.home) {
      this.home.onTouchDown({ x: this.x.start, y: this.y.start });
    }
    if (this.about) {
      this.about.onTouchDown({ x: this.x.start, y: this.y.start });
    }
    if (this.collections) {
      this.collections.onTouchDown({ x: this.x.start, y: this.y.start });
    }
    if (this.detail) {
      this.detail.onTouchDown({ x: this.x.start, y: this.y.start });
    }
  }
  /**
   *
   * @param {Event} event
   * onTouchMove for canvas
   */
  onTouchMove(event) {
    if (!this.isDown) return;

    const x = event.touches ? event.touches[0].clientX : event.clientX;
    const y = event.touches ? event.touches[0].clientY : event.clientY;

    this.x.end = x;
    this.y.end = y;

    if (this.home) {
      this.home.onTouchMove({ x: this.x, y: this.y });
    }

    if (this.about) {
      this.about.onTouchMove({ x: this.x, y: this.y });
    }
    if (this.collections) {
      this.collections.onTouchMove({ x: this.x, y: this.y });
    }
    if (this.detail) {
      this.detail.onTouchMove({ x: this.x, y: this.y });
    }
  }
  /**
   *
   * @param {Event} event
   * onTouchUp for canvas
   */
  onTouchUp(event) {
    this.isDown = false;
    const x = event.changedTouches
      ? event.changedTouches[0].clientX
      : event.clientX;
    const y = event.changedTouches
      ? event.changedTouches[0].clientY
      : event.clientY;

    this.x.end = x;
    this.y.end = y;

    if (this.home) {
      this.home.onTouchUp({ x: this.x, y: this.y });
    }
    if (this.about) {
      this.about.onTouchUp({ x: this.x, y: this.y });
    }
    if (this.collections) {
      this.collections.onTouchUp({ x: this.x, y: this.y });
    }
    if (this.detail) {
      this.detail.onTouchUp({ x: this.x, y: this.y });
    }
  }

  onWheel(event) {
    if (this.home) {
      this.home.onWheel(event);
    }
    if (this.collections) {
      this.collections.onWheel(event);
    }
  }

  update(scroll) {
    if (this.home) {
      this.home.update();
    }
    if (this.about) {
      this.about.update(scroll);
    }
    if (this.collections) {
      this.collections.update();
    }
    if (this.detail) {
      this.detail.update();
    }
    this.renderer.render({ camera: this.camera, scene: this.scene });
    this.renderer.render({ camera: this.camera, scene: this.scene });
  }
}
