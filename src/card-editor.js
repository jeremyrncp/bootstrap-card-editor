import $ from "jquery";
import "bootstrap";
import Mustache from "mustache";
import { defaultTemplate, toolbarTemplate, modalTemplate } from "./templates";
import { DynamicFetcher } from "./dynamic-fetcher";

export class CardEditor {
  constructor(
    conf = {
      title: "",
      content: "",
      titleSize: 1,
      contentSize: 1,
      backgroundColor: "#ffffff",
      titleColor: "#000000",
      contentColor: "#000000"
    },
    dynamicFetcher = new DynamicFetcher()
  ) {
    this.title = conf.title;
    this.content = conf.content;
    this.contentSize = conf.contentSize;
    this.titleSize = conf.titleSize;
    this.contentColor = conf.contentColor;
    this.titleColor = conf.titleColor;
    this.backgroundColor = conf.backgroundColor;
    this.dynamicFetcher = dynamicFetcher;
  }

  /**
   * Render editor in modal
   * @example
   * // Render editor in modal
   * const cardEditor = new CardEditor()
   * cardEditor.modalEditor()
   * @returns {void}
   */
  modalEditor() {
    const div = document.createElement("div");
    const content = Mustache.render(modalTemplate);
    div.innerHTML = content;

    document.querySelector("body").append(div);
    this.inlineEditor(
      document.querySelector("#bootstrap-card-editor-modal-body")
    );

    $("#bootstrap-card-editor-modal").modal("show");

    document.addEventListener("cardEditorConfigure", (event) => {
      $("#bootstrap-card-editor-modal").modal("hide");
    });
  }

  /**
   * Render editor in element
   * @param {*} elm : a valid element
   * @example
   * // Render editor in element
   * const cardEditor = new CardEditor()
   * const elm = document.querySelector("div")
   * cardEditor.inlineEditor(elm)
   * @returns {void}
   */
  inlineEditor(elm) {
    elm.innerHTML =
      "<div>" +
      "<div class='row'>" +
      "<div class='col-12'>" +
      "<p class='text-center'><button class='btn btn-primary' id='card-editor-btn-closeuse'>Close & use</button></p><div id='card-editor-display' style='margin:auto;width:400px'></div>" +
      "</div></div>" +
      "<div class='row'>" +
      "<div class='col-12'>" +
      toolbarTemplate +
      "</div>" +
      "</div>" +
      "</div>";

    this.dynamicFetcher.renderEditor(
      document.querySelector("#card-editor-dynamic-content")
    );

    this.listen();
  }

  listen() {
    document
      .querySelector("#card-editor-btn-closeuse")
      .addEventListener("click", (event) => {
        event.target.parentElement.parentElement.parentElement.parentElement.innerHTML =
          "";
        document.dispatchEvent(
          new CustomEvent("cardEditorConfigure", { detail: this.getConf() })
        );
      });
    document
      .querySelector("body")
      .addEventListener("dynamic-fetcher-update", (event) => {
        this.dynamicFetcher.getConf();
        this.render(document.querySelector("#card-editor-display"));
      });
    document
      .querySelector("#card-editor-title .card-font-color")
      .addEventListener("change", (event) => {
        this.titleColor = event.target.value;
        this.render(document.querySelector("#card-editor-display"));
      });
    document
      .querySelector("#card-editor-content .card-font-color")
      .addEventListener("change", (event) => {
        this.contentColor = event.target.value;
        this.render(document.querySelector("#card-editor-display"));
      });
    document
      .querySelector("#card-editor-background")
      .addEventListener("change", (event) => {
        this.backgroundColor = event.target.value;
        this.render(document.querySelector("#card-editor-display"));
      });
    document
      .querySelector("#card-editor-title select")
      .addEventListener("change", (event) => {
        this.titleSize = event.target.value;
        this.render(document.querySelector("#card-editor-display"));
      });
    document
      .querySelector("#card-editor-content select")
      .addEventListener("change", (event) => {
        this.contentSize = event.target.value;
        this.render(document.querySelector("#card-editor-display"));
      });
    document
      .querySelector("#card-editor-title input[type=text]")
      .addEventListener("keyup", (event) => {
        this.title = event.target.value;
        this.render(document.querySelector("#card-editor-display"));
      });
    document
      .querySelector("#card-editor-content input[type=text]")
      .addEventListener("keyup", (event) => {
        this.content = event.target.value;
        this.render(document.querySelector("#card-editor-display"));
      });
  }

  /**
   * Get render editor configuration
   * @returns {object}
   */
  getConf() {
    return {
      title: this.title,
      content: this.content,
      titleSize: this.titleSize,
      contentSize: this.contentSize,
      backgroundColor: this.backgroundColor,
      titleColor: this.titleColor,
      contentColor: this.contentColor,
      dynamic: this.dynamicFetcher.getConf()
    };
  }

  /**
   * Render card in element with card editor configuration
   * @example
   * // Render editor in element
   * const cardEditor = new CardEditor()
   * const elm = document.querySelector("div")
   * cardEditor.inlineEditor(elm)
   *
   * elm.addEventListener("cardEditorConfigure", (event) => {
   *   const elementToRendered = document.querySelector("#element")
   *   const newCardEditor = new CardEditor(event.detail)
   *   newCardEditor.render(elm)
   * })
   * @param {*} elm : a valid element
   */
  render(elm) {
    const content = Mustache.render(defaultTemplate, this.getConf());
    elm.innerHTML = content;

    if (this.getConf().dynamic.url !== "") {
      this.dynamicFetcher.renderResult(elm.querySelector(".card-text"));
    }
  }
}
