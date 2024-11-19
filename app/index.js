import each from "lodash/each";
import normalizeWheel from "normalize-wheel";

import Canvas from "components/Canvas";

import Preloader from "components/Preloader";
import Navigation from "components/Navigation";

import Home from "pages/Home";
import About from "pages/About";
import Collections from "pages/Collections";
import Detail from "pages/Detail";

/**
 * @class App
 * @description This class is the entry point of the application
 * It creates the preloader, the content, the pages and the link listeners
 * It also updates the current page and listens for resize events.
 * It also creates the canvas for animations
 * @example
 * import App from "app";
 * new App();
 * @exports App
 *
 */
class App {
  constructor() {
    this.createContent();

    this.createCanvas();
    this.createPreloader();
    this.createNavigation();
    this.createPages();

    this.addLinkListeners();
    this.addEventListeners();

    this.onResize();
    this.update();
  }

  createNavigation() {
    this.navigation = new Navigation({ template: this.template });
  }

  /**
   * @method createPreloader
   * @description creates a new instance of the Preloader class
   * @returns void
   */
  createPreloader() {
    this.preloader = new Preloader({ canvas: this.canvas });
    this.preloader.once("completed", this.onPreloaded.bind(this));
  }

  /**
   * @method createCanvas
   * Creates canvas for app webgl elements
   */
  createCanvas() {
    this.canvas = new Canvas({ template: this.template });
  }
  /**
   *
   * @method createContent
   * @description targets the content element and gets the data-template attribute
   */
  createContent() {
    this.content = document.querySelector(".content");
    this.template = this.content.getAttribute("data-template");
  }

  /**
   * @method createPages
   * @description creates a new instance of each page class and stores the current page in an object
   */
  createPages() {
    this.pages = {
      about: new About(),
      collections: new Collections(),
      detail: new Detail(),
      home: new Home(),
    };
    this.page = this.pages[this.template];
    this.page.create();
  }

  /**
   * @method onPreloaded
   * @description This method is called when the preloader has finished
   * loading the content
   * It destroys the preloader and shows the page
   * @returns void
   * @example
   * this.preloader.destroy();
   * this.page.onResize();
   * this.page.show();
   * @memberof App
   */
  onPreloaded() {
    this.onResize();
    this.canvas.onPreloaded();
    this.page.show();
  }

  /**
   * @method onPopState
   * @description This method is called when the popstate event is triggered
   * It calls the onChange method with the current pathname and navigates
   * the history of the active session of the current window.
   * The push parameter is set to false to prevent the page from being pushed to the history stack
   * @returns void
   */
  onPopState() {
    this.onChange({ url: window.location.pathname, push: false });
  }
  /**
   *
   * @param {*} url
   * @returns void
   * @description This method is called when a link is clicked
   * It fetches the new page and updates the content
   * with the new page content
   * It also updates the template and the current page
   *
   */
  async onChange({ url, push = true }) {
    this.canvas.onChangeStart(this.template, url);

    await this.page.hide();
    const request = await window.fetch(url);

    if (request.status === 200) {
      const html = await request.text();
      const div = document.createElement("div");

      if (push) {
        window.history.pushState({}, "", url);
      }

      div.innerHTML = html;
      const divContent = div.querySelector(".content");
      this.template = divContent.getAttribute("data-template");

      this.navigation.onChange(this.template);

      this.content.innerHTML = divContent.innerHTML;
      this.content.setAttribute("data-template", this.template);

      this.canvas.onChangeEnd(this.template);

      this.page = this.pages[this.template];
      this.page.create();
      this.onResize();
      await this.page.show();

      this.addLinkListeners();
    } else {
      console.log("Error", request.status);
    }
  }

  /**
   * @method onResize
   * @description checks if page is defined and calls the onResize method
   */
  onResize() {
    if (this.page && this.page.onResize) {
      this.page.onResize();
    }

    window.requestAnimationFrame(() => {
      if (this.canvas && this.canvas.onResize) {
        this.canvas.onResize();
      }
    });
  }

  /**
   *
   * @param {Event} event
   * onTouchDown for canvas
   */
  onTouchDown(event) {
    if (this.canvas && this.canvas.onTouchDown) {
      this.canvas.onTouchDown(event);
    }
  }
  /**
   *
   * @param {Event} event
   * onTouchMove for canvas
   */
  onTouchMove(event) {
    if (this.canvas && this.canvas.onTouchMove) {
      this.canvas.onTouchMove(event);
    }
  }
  /**
   *
   * @param {Event} event
   * onTouchUp for canvas
   */
  onTouchUp(event) {
    if (this.canvas && this.canvas.onTouchUp) {
      this.canvas.onTouchUp(event);
    }
  }

  /**
   *
   * @param {Event} event
   * onWheel event
   */
  onWheel(event) {
    const normalizedWheel = normalizeWheel(event);
    if (this.page && this.page.onWheel) {
      this.page.onWheel(normalizedWheel);
    }
    if (this.canvas && this.canvas.onWheel) {
      this.canvas.onWheel(normalizedWheel);
    }
  }
  /**
   * @method update
   * @description updates the current page and requests the current animation frame
   * @returns void
   */
  update() {
    if (this.page && this.page.update) {
      this.page.update();
    }

    if (this.canvas && this.canvas.update) {
      // The argument is passed to get the current page scroll so as to translate the
      // canvas gallery in sections that needs to be transalated
      this.canvas.update(this.page.scroll);
    }

    this.frame = window.requestAnimationFrame(this.update.bind(this));
  }

  /**
   * @method addEventListener
   * @description add event listeners to the window entry point
   */
  addEventListeners() {
    window.addEventListener("wheel", this.onWheel.bind(this));

    window.addEventListener("mousedown", this.onTouchDown.bind(this));
    window.addEventListener("mousemove", this.onTouchMove.bind(this));
    window.addEventListener("mouseup", this.onTouchUp.bind(this));

    window.addEventListener("touchstart", this.onTouchDown.bind(this));
    window.addEventListener("touchmove", this.onTouchMove.bind(this));
    window.addEventListener("touchend", this.onTouchUp.bind(this));

    window.addEventListener("popstate", this.onPopState.bind(this));
    window.addEventListener("resize", this.onResize.bind(this));
  }

  /**
   * @method addLinkListeners
   * @description adds event listeners to all anchor tags
   * @returns void
   */
  addLinkListeners() {
    const links = document.querySelectorAll("a");
    each(links, (link) => {
      link.onclick = (event) => {
        event.preventDefault();
        const { href } = link;
        this.onChange({ url: href });
      };
    });
  }
}
new App();
