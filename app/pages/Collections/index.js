import Page from "classes/Page";

export default class Collections extends Page {
  constructor() {
    super({
      id: "collections",
      element: ".collections",
      elements: {
        navigation: document.querySelector(".navigation"),
        wrapper: ".collections__wrapper",
      },
    });
  }
}
