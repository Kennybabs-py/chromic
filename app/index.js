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

    // this.page.show();
  }

  // /**
  //  *  @method this.page.show was moved back to createPages because I don't
  //  *  want white screen to show up milliseconds before autoalpha to page is applied
  //  *  just after preloader animates out
  //  */
  onPreloaded() {
    this.preloader.destroy();
    this.page.onResize();
    this.page.show();
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
  async onChange(url) {
    await this.page.hide();
    const request = await window.fetch(url);

    if (request.status === 200) {
      const html = await request.text();
      const div = document.createElement("div");
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
        this.onChange(href);
      };
    });
  }
}
new App();
