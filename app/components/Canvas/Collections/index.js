import map from "lodash/map";
import { Plane, Transform } from "ogl";
import gsap from "gsap";
import Prefix from "prefix";
import Media from "./Media";
export default class Collections {
  constructor({ gl, scene, sizes }) {
    this.gl = gl;
    this.scene = scene;
    this.group = new Transform();
    this.sizes = sizes;

    this.transformPrefix = Prefix("transform");

    this.galleryElement = document.querySelector(".collections__gallery");
    this.galleryWrapperElement = document.querySelector(
      ".collections__gallery__wrapper",
    );
    this.collectionArticles = document.querySelectorAll(
      ".collections__article",
    );
    this.collectionTitles = document.querySelector(".collections__titles");
    this.collectionArticlesActive = "collections__article--active";
    this.mediaElements = document.querySelectorAll(
      ".collections__gallery__media",
    );
    this.x = {
      current: 0,
      target: 0,
      lerp: 0.1,
      direction: null,
    };

    this.scroll = {
      start: 0,
      current: 0,
      target: 0,
      lerp: 0.1,
      limit: 0,
      velocity: 1,
    };

    this.createGeometry();
    this.createGallery();

    this.group.setParent(this.scene);
    this.show();
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

  show() {
    map(this.medias, (media) => {
      media.show();
    });
  }

  hide() {
    map(this.medias, (media) => {
      media.hide();
    });
  }

  onResize(event) {
    this.bounds = this.galleryWrapperElement.getBoundingClientRect();
    this.sizes = event.sizes;
    this.scroll.last = this.scroll.target = 0;
    this.scroll.limit = this.bounds.width - this.medias[0].element.clientWidth;

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
    this.scroll.last = this.scroll.current;
  }
  /**
   *
   * @param {Event} event
   * onTouchMove for canvas
   */
  onTouchMove({ x }) {
    const distance = x.start - x.end;
    this.scroll.target = this.scroll.last - distance;
  }
  /**
   *
   * @param {Event} event
   * onTouchUp for canvas
   */
  onTouchUp({ x, y }) {}

  onWheel({ pixelY }) {
    this.scroll.target += pixelY;
  }

  /**
   *
   * @param {number} index
   */
  onChangeCurrent(index) {
    this.index = index;
    const selectedCollection = parseInt(
      this.mediaElements[this.index].getAttribute("data-collection-index"),
      10,
    );
    map(this.collectionArticles, (element, index) => {
      if (index === selectedCollection) {
        element.classList.add(this.collectionArticlesActive);
      } else {
        element.classList.remove(this.collectionArticlesActive);
      }
    });
    this.collectionTitles.style[this.transformPrefix] =
      `translateY(${-25 * selectedCollection}%)  translate(-50%,-50%) rotate(-90deg)`;
  }

  /**
   *
   * @param {{x:number, y:number}} {x, y}
   * Scroll update
   */
  update() {
    if (!this.bounds) return;

    this.scroll.target = gsap.utils.clamp(
      -this.scroll.limit,
      0,
      this.scroll.target,
    );
    // This updates the current position of scroll with the target after scrolling
    this.scroll.current = gsap.utils.interpolate(
      this.scroll.current,
      this.scroll.target,
      this.scroll.lerp,
    );

    this.galleryElement.style[this.transformPrefix] =
      `translateX(-${this.scroll.current}px)`;

    // Checks the scroll direction
    if (this.scroll.last < this.scroll.current) {
      this.scroll.direction = "right";
    } else if (this.scroll.last > this.scroll.current) {
      this.scroll.direction = "left";
    }

    // Updates the scroll x and y with the current x and y after they are updated
    this.scroll.last = this.scroll.current;

    const currentIndex = Math.floor(
      Math.abs(this.scroll.current / this.scroll.limit) * this.medias.length,
    );
    if (this.index !== currentIndex) {
      this.onChangeCurrent(currentIndex);
    }

    map(this.medias, (media, _) => {
      media.update(this.scroll.current);
    });
  }

  destroy() {
    this.scene.removeChild(this.group);
  }
}
