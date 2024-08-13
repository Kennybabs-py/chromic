import Page from "classes/Page";

export default class Home extends Page {
  constructor() {
    super({
      id: "home",
      element: ".home",
      elements: {
        navigation: document.querySelector(".navigation"),
        button: ".home__link",
        // wrapper: ".home__wrapper",
      },
    });
  }

  create() {
    super.create();

    this.elements.button.addEventListener("click", () => {
      console.log("clicked");
    });
  }
}
