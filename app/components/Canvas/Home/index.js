import map from "lodash/map";
import { Plane, Transform } from "ogl";
import gsap from "gsap";
import normalizeWheel from "normalize-wheel";

import Media from "./Media";
export default class Home {
  constructor({ gl, scene, sizes }) {
    this.gl = gl;
    this.group = new Transform();
    this.sizes = sizes;

    this.galleryElement = document.querySelector(".home__gallery");
    this.mediaElements = document.querySelectorAll(
      ".home__gallery__media__image",
    );
    this.x = {
      current: 0,
      target: 0,
      lerp: 0.1,
      direction: null,
    };
    this.y = {
      current: 0,
      target: 0,
      lerp: 0.1,
      direction: null,
    };

    // Used to save the scroll x and y after touchdown event
    // to prevent refreshing to zero.
    this.scrollCurrent = {
      x: 0,
      y: 0,
    };
    this.scroll = {
      x: 0,
      y: 0,
    };

    this.createGeometry();
    this.createGallery();

    this.group.setParent(scene);
  }

  createGeometry() {
    this.geometry = new Plane(this.gl);
  }
  createGallery() {
    this.medias = map(this.mediaElements, (element, index) => {
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

  onResize(event) {
    this.galleryBounds = this.galleryElement.getBoundingClientRect();
    this.sizes = event.sizes;
    this.gallerySizes = {
      width: (this.galleryBounds.width / window.innerWidth) * this.sizes.width,
      height:
        (this.galleryBounds.height / window.innerHeight) * this.sizes.height,
    };

    // this.scroll.x = this.x.target = 0;
    // this.scroll.y = this.y.target = 0;

    map(this.medias, (media) => {
      media.onResize(event, this.scroll);
    });
  }

  /**
   *
   * @param {Event} event
   * onTouchDown for canvas
   */
  onTouchDown({ x, y }) {
    this.scrollCurrent.x = this.scroll.x;
    this.scrollCurrent.y = this.scroll.y;
  }
  /**
   *
   * @param {Event} event
   * onTouchMove for canvas
   */
  onTouchMove({ x, y }) {
    const xDistance = x.start - x.end;
    const yDistance = y.start - y.end;

    this.x.target = this.scrollCurrent.x - xDistance;
    this.y.target = this.scrollCurrent.y - yDistance;
  }
  /**
   *
   * @param {Event} event
   * onTouchUp for canvas
   */
  onTouchUp({ x, y }) {}

  onWheel({ pixelY, pixelX }) {
    this.x.target += pixelX;
    this.y.target += pixelY;
  }

  /**
   *
   * @param {{x:number, y:number}} {x, y}
   * Scroll update
   */
  update() {
    if (!this.galleryBounds) return;
    // This updates the current position of scroll with the target after scrolling
    this.x.current = gsap.utils.interpolate(
      this.x.current,
      this.x.target,
      this.x.lerp,
    );
    this.y.current = gsap.utils.interpolate(
      this.y.current,
      this.y.target,
      this.y.lerp,
    );

    // Checks the scroll direction
    if (this.scroll.x < this.x.current) {
      this.x.direction = "right";
    } else if (this.scroll.x > this.x.current) {
      this.x.direction = "left";
    }

    if (this.scroll.y < this.y.current) {
      this.y.direction = "top";
    } else if (this.scroll.y > this.y.current) {
      this.y.direction = "bottom";
    }

    // Updates the scroll x and y with the current x and y after they are updated
    this.scroll.x = this.x.current;
    this.scroll.y = this.y.current;

    map(this.medias, (media, _) => {
      const meshScaleX = media.mesh.scale.x / 2;

      // Infinite scrolling in any direction
      if (this.x.direction === "left") {
        const x = media.mesh.position.x + meshScaleX;
        if (x < -this.sizes.width / 2) {
          media.extra.x += this.gallerySizes.width;
          media.mesh.rotation.z = gsap.utils.random(
            -Math.PI * 0.03,
            Math.PI * 0.03,
          );
        }
      } else if (this.x.direction === "right") {
        const x = media.mesh.position.x - meshScaleX;

        if (x > this.sizes.width / 2) {
          media.extra.x -= this.gallerySizes.width;
          media.mesh.rotation.z = gsap.utils.random(
            -Math.PI * 0.03,
            Math.PI * 0.03,
          );
        }
      }

      const meshScaleY = media.mesh.scale.y / 2;

      if (this.y.direction === "top") {
        const y = media.mesh.position.y + meshScaleY;

        if (y < -this.sizes.height / 2) {
          media.extra.y += this.gallerySizes.height;
          media.mesh.rotation.z = gsap.utils.random(
            -Math.PI * 0.03,
            Math.PI * 0.03,
          );
        }
      } else if (this.y.direction === "bottom") {
        const y = media.mesh.position.y - meshScaleY;

        if (y > this.sizes.height / 2) {
          media.extra.y -= this.gallerySizes.height;
          media.mesh.rotation.z = gsap.utils.random(
            -Math.PI * 0.03,
            Math.PI * 0.03,
          );
        }
      }

      media.update(this.scroll);
    });
  }
}
