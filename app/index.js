import each from "lodash/each";
import normalizeWheel from "normalize-wheel";

import Canvas from "components/Canvas";
import Preloader from "components/Preloader";
import Navigation from "components/Navigation";
import Transition from "components/Transition";

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
    this.template = window.location.pathname;

    this.createCanvas();
    this.createPreloader();
    this.createTransition();
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
   * @method createTransition
   *
   */
  createTransition() {
    this.transition = new Transition();
  }

  /**
   * @method createPages
   * @description creates a new instance of each page class and stores the current page in an object
   */
  createPages() {
    this.about = new About();
    this.collections = new Collections();
    this.home = new Home();

    this.pages = {
      "/": this.home,
      "/about": this.about,
      "/collections": this.collections,
    };

    this.page = this.pages[this.template];
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
    url = url.replace(window.location.origin, "");

    const page = this.pages[url];

    await this.transition.show({
      color: page.element.getAttribute("data-color"),
    });

    if (push) {
      window.history.pushState({}, "", url);
    }

    this.template = window.location.pathname;

    this.page.hide();

    this.navigation.onChange(this.template);
    this.canvas.onChange(this.template);

    this.page = page;
    this.page.show();

    this.onResize();

    this.transition.hide();
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

    if (this.page && this.page.onTouchDown) {
      this.page.onTouchDown(event);
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

    if (this.page && this.page.onTouchDown) {
      this.page.onTouchMove(event);
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

    if (this.page && this.page.onTouchDown) {
      this.page.onTouchUp(event);
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

    if (this.page && this.page.onWheel) {
      this.page.onWheel(normalizedWheel);
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
    window.addEventListener("popstate", this.onPopState.bind(this));
    window.addEventListener("mousewheel", this.onWheel.bind(this));

    window.addEventListener("mousedown", this.onTouchDown.bind(this));
    window.addEventListener("mousemove", this.onTouchMove.bind(this));
    window.addEventListener("mouseup", this.onTouchUp.bind(this));

    window.addEventListener("touchstart", this.onTouchDown.bind(this));
    window.addEventListener("touchmove", this.onTouchMove.bind(this));
    window.addEventListener("touchend", this.onTouchUp.bind(this));

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
      const isLocal = link.href.indexOf(window.location.origin) > -1;

      const isNotEmail = link.href.indexOf("mailto") === -1;
      const isNotPhone = link.href.indexOf("tel") === -1;

      if (isLocal) {
        link.onclick = (event) => {
          event.preventDefault();

          this.onChange({
            url: link.href,
          });
        };

        link.onmouseenter = (event) => this.onLinkMouseEnter(link);
        link.onmouseleave = (event) => this.onLinkMouseLeave(link);
      } else if (isNotEmail && isNotPhone) {
        link.rel = "noopener";
        link.target = "_blank";
      }
    });
  }
}
new App();
