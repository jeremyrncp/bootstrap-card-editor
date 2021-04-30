export const defaultTemplate =
  '<div class="card" style="background-color:{{backgroundColor}}"> <div class="card-body"><h5 class="card-title" style="font-size:{{ titleSize }}em;color:{{titleColor}}">{{ title }}</h5><p class="card-text text-center" style="font-size:{{ contentSize }}em;color:{{contentColor}}">{{ content }}</p></div></div>';

const fontColor =
  '<input class="card-font-color form-control" style="width: 45px;" type="color" value="#000000" />';
const fontSize =
  "<select class='font-size-change form-control'><option value='1'>Size 1</option><option value='2'>Size 2</option><option value='3'>Size 3</option><option value='4'>Size 4</option><option value='5'>Size 5</option><option value='6'>Size 6</option></select>";

const contentSizeAndColor =
  '<div class="card"> <div class="card-body"><h5 class="card-title">Content color & size</h5><div class="form-inline card-text text-center"> ' +
  fontSize +
  fontColor +
  "</div></div></div>";

const staticContent =
  contentSizeAndColor +
  '<div class="card mt-3"> <div class="card-body"><h5 class="card-title">Static content</h5><p class="card-text text-center"><input style="width: 200px;" type="text" placeholder="Content" class="form-control" /></p> ' +
  "</div></div>";

const dynamicContentInformations =
  '<div class="alert alert-info">Indicate a valid JSON data and select key and frequency to update content. You can use CQRS anywhere : https://corsanywhere.chartzou.com/ if necessary</div></div>';
const dynamicContent =
  '<div class="card"> <div class="card-body"><h5 class="card-title">Dynamic content (optional)</h5>' +
  dynamicContentInformations +
  '<div class="card-text text-center p-1" id="card-editor-dynamic-content"></div></div></div>';

export const toolbarTemplate =
  '<div class="row mt-4"><div class="col-12 text-center"><p><h4>Card configuration</h4></p></div></div><div class="row mt-2"><div class="col-6" id="card-editor-title"><div class="form-inline"><input type="text" placeholder="Title" class="form-control" /> ' +
  fontSize +
  fontColor +
  '</div></div><div class="col-6"><b>Background color</b> <input id="card-editor-background" type="color" value="#ffffff" /></div></div><div class="row  mt-3">' +
  '<div class="col-6 mt-3" id="card-editor-content">' +
  staticContent +
  " </div>" +
  '<div class="col-6">' +
  dynamicContent +
  "</div>" +
  "</div>";

export const modalTemplate =
  "<!-- Modal -->" +
  '<div class="modal fade" id="bootstrap-card-editor-modal"  tabindex="-1" role="dialog" aria-labelledby="bootstrap-card-editor-modal" aria-hidden="true">' +
  '<div class="modal-dialog modal-lg" role="document">' +
  '<div class="modal-content">' +
  '<div class="modal-header">' +
  '<h5 class="modal-title">Bootstrap Card Editor</h5>' +
  '<button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
  '<span aria-hidden="true">&times;</span>' +
  "</button>" +
  "</div>" +
  '<div class="modal-body" id="bootstrap-card-editor-modal-body"></div>' +
  "</div>" +
  "</div>" +
  "</div>";
