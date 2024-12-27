import map from "lodash/map";
import { Plane, Transform } from "ogl";
import gsap from "gsap";

import Media from "./Media";
export default class Home {
  constructor({ gl, scene, sizes }) {
    this.gl = gl;
    this.scene = scene;
    this.sizes = sizes;
    this.group = new Transform();

    this.galleryElement = document.querySelector(".home__gallery");
    this.mediaElements = document.querySelectorAll(
      ".home__gallery__media__image",
    );

    this.y = {
      current: 0,
      target: 0,
      lerp: 0.1,
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

    // Speed of the mouse dragging
    this.speed = {
      current: 0,
      target: 0,
      lerp: 0.1,
    };

    this.velocity = 2;

    this.createGeometry();
    this.createGallery();

    this.onResize({ sizes: this.sizes });
  }

  createGeometry() {
    // The heightSegment & widthSegment gives more vertices to the plane
    this.geometry = new Plane(this.gl, {
      heightSegments: 20,
      widthSegments: 20,
    });
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

  show(isPreloaded) {
    this.group.setParent(this.scene);

    map(this.medias, (media) => media.show(isPreloaded));
  }

  hide() {
    this.group.setParent(null);

    map(this.medias, (media) => {
      media.hide();
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

    this.scroll.y = this.y.target = 0;

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
    // this.speed.target = 1;

    this.scrollCurrent.x = this.scroll.x;
    this.scrollCurrent.y = this.scroll.y;
  }
  /**
   *
   * @param {Event} event
   * onTouchMove for canvas
   */
  onTouchMove({ x, y }) {
    const yDistance = y.start - y.end;

    this.y.target = this.scrollCurrent.y - yDistance;
  }
  /**
   *
   * @param {Event} event
   * onTouchUp for canvas
   */
  onTouchUp({ x, y }) {
    // this.speed.target = 0;
  }

  onWheel({ pixelY, pixelX }) {
    this.y.target += pixelY;

    this.velocity = pixelY > 0 ? 2 : -2;
  }

  /**
   *
   * @param {{x:number, y:number}} {x, y}
   * Scroll update
   */
  update() {
    // Using pythagoras to get the speed of cursor or touch movement from a current
    // to a target position
    // const a = this.x.target - this.x.current;
    // const b = this.y.target - this.y.current;
    // this.speed.target = Math.sqrt(a * a + b * b) * 0.001;

    this.y.target += this.velocity;

    this.speed.target = (this.y.target - this.y.current) * 0.001;
    this.speed.current = gsap.utils.interpolate(
      this.speed.current,
      this.speed.target,
      this.speed.lerp,
    );

    // This updates the current position of scroll with the target after scrolling
    // this.x.current = gsap.utils.interpolate(
    //   this.x.current,
    //   this.x.target,
    //   this.x.lerp,
    // );
    this.y.current = gsap.utils.interpolate(
      this.y.current,
      this.y.target,
      this.y.lerp,
    );

    // Checks the scroll direction
    // if (this.scroll.x < this.x.current) {
    //   this.x.direction = "right";
    // } else if (this.scroll.x > this.x.current) {
    //   this.x.direction = "left";
    // }

    if (this.scroll.y < this.y.current) {
      this.y.direction = "top";
    } else if (this.scroll.y > this.y.current) {
      this.y.direction = "bottom";
    }

    // Updates the scroll x and y with the current x and y after they are updated
    // this.scroll.x = this.x.current;
    this.scroll.y = this.y.current;

    map(this.medias, (media, _) => {
      // const meshScaleX = media.mesh.scale.x / 2;
      // const offsetX = this.sizes.width * 0.6;

      // Infinite scrolling in any direction
      // if (this.x.direction === "left") {
      //   const x = media.mesh.position.x + meshScaleX;
      //   if (x < -offsetX) {
      //     media.extra.x += this.gallerySizes.width;
      //     media.mesh.rotation.z = gsap.utils.random(
      //       -Math.PI * 0.03,
      //       Math.PI * 0.03,
      //     );
      //   }
      // } else if (this.x.direction === "right") {
      //   const x = media.mesh.position.x - meshScaleX;

      //   if (x > offsetX) {
      //     media.extra.x -= this.gallerySizes.width;
      //     media.mesh.rotation.z = gsap.utils.random(
      //       -Math.PI * 0.03,
      //       Math.PI * 0.03,
      //     );
      //   }
      // }

      const scaleY = media.mesh.scale.y / 2;
      const offsetY = this.sizes.height * 0.6;

      if (this.y.direction === "top") {
        const y = media.mesh.position.y + scaleY;

        if (y < -offsetY) {
          media.extra.y += this.gallerySizes.height;
          // media.mesh.rotation.z = gsap.utils.random(
          //   -Math.PI * 0.03,
          //   Math.PI * 0.03,
          // );
        }
      } else if (this.y.direction === "bottom") {
        const y = media.mesh.position.y - scaleY;

        if (y > offsetY) {
          media.extra.y -= this.gallerySizes.height;
          // media.mesh.rotation.z = gsap.utils.random(
          //   -Math.PI * 0.03,
          //   Math.PI * 0.03,
          // );
        }
      }

      media.update(this.scroll, this.speed.current);
    });
  }

  destroy() {
    this.scene.removeChild(this.group);
  }
}
