import each from "lodash/each";

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
 * It also updates the current page and listens for resize events
 * @example
 * import App from "app";
 * new App();
 * @exports App
 *
 */
class App {
  constructor() {
    this.createContent();
    this.createPages();

    this.addLinkListeners();
    this.update();
    this.addEventListeners();

    this.createNavigation();
    this.createPreloader();
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
    this.preloader = new Preloader();
    this.preloader.once("completed", this.onPreloaded.bind(this));
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
    this.preloader.destroy();
    this.page.onResize();
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
      this.content.innerHTML = divContent.innerHTML;
      this.template = divContent.getAttribute("data-template");

      this.navigation.onChange(this.template);
      this.content.setAttribute("data-template", this.template);
      this.page = this.pages[this.template];

      this.page.create();
      this.page.onResize();
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
      {
        this.page.onResize();
      }
    }
  }
  /**
   * @method update
   * @description updates the current page and requests the current animation frame
   * @returns void
   */
  update() {
    if (this.page && this.page.update) {
      {
        this.page.update();
      }
      this.frame = window.requestAnimationFrame(this.update.bind(this));
    }
  }

  /**
   * @method addEventListener
   * @description add event listeners to the window entry point
   */
  addEventListeners() {
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
