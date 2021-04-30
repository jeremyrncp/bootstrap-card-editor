import $ from "jquery";
import "bootstrap";
import { CardEditor } from "./card-editor.js";
import { DynamicFetcher } from "./dynamic-fetcher.js";

window.$ = $;

const btnModalEditor = document.querySelector("#btn-modal-editor");
btnModalEditor.addEventListener("click", (event) => {
  const myEditor = new CardEditor();
  myEditor.modalEditor();

  document.addEventListener("cardEditorConfigure", (event) => {
    console.log(JSON.stringify(event.detail));
  });
});

const btnInlineEditor = document.querySelector("#btn-inline-editor");
btnInlineEditor.addEventListener("click", (event) => {
  const myEditor = new CardEditor();
  myEditor.inlineEditor(document.querySelector("#inline-editor"));
});

const cardConfigurationStatic = {
  title: "NUMBER OF EMPLOYEE",
  content: "450 250",
  titleSize: 1,
  contentSize: "3",
  backgroundColor: "#89329a",
  titleColor: "#ffffff",
  contentColor: "#ffffff",
  dynamic: {
    url: "",
    choice: { type: "", data: "", parent: null },
    refresh: 3600
  }
};
const myStaticEditor = new CardEditor(cardConfigurationStatic);
myStaticEditor.render(document.querySelector("#bootstrap-card-static"));

const cardConfigurationDynamic = {
  title: "LAST EMPLOYEE NAME",
  content: "",
  titleSize: 1,
  contentSize: "3",
  backgroundColor: "#1f0f4d",
  titleColor: "#ffffff",
  contentColor: "#ffffff",
  dynamic: {
    url:
      "https://gist.githubusercontent.com/rominirani/8235702/raw/a50f7c449c41b6dc8eb87d8d393eeff62121b392/employees.json",
    choice: { type: "last", data: "preferredFullName", parent: "Employees" },
    refresh: 3600
  }
};
const myDynamicEditor = new CardEditor(
  cardConfigurationDynamic,
  new DynamicFetcher(cardConfigurationDynamic.dynamic)
);
myDynamicEditor.render(document.querySelector("#bootstrap-card-dynamic"));
