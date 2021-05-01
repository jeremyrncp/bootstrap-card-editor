const isUrl = require("is-valid-http-url");

export class DynamicFetcher {
  constructor(
    conf = {
      url: "",
      choice: { type: "", data: "", parent: null },
      refresh: 3600
    }
  ) {
    this.url = conf.url;
    this.data = {};
    this.choice = {
      type: conf.choice.type,
      data: conf.choice.data,
      parent: conf.choice.parent
    };
    this.refresh = conf.refresh;
  }

  /**
   * Render editor in element
   * @param {*} elm : a valid element
   * @example
   * // Render to div
   * const div = document.querySelector("div")
   * const dynamicFetcher = new DynamicFetcher()
   * dynamicFetcher.render(div);
   * @returns {void}
   */
  renderEditor(elm) {
    elm.innerHTML =
      `<input type="text" id="card-editor-flux" class="form-control" placeholder="http ..." /><div class="row mt-3"><div class="col-7"><div id="card-editor-flux-select"></div><div class="form-inline mt-3" id="card-editor-flux-select-more"></div></div><div class="col-5" id="card-editor-flux-result"></div></div>`;

    document
      .querySelector("#card-editor-flux")
      .addEventListener("change", (event) => {
        this.configFlux(event.target);
      });
  }

  configFlux(elm) {
    if (!isUrl(elm.value)) {
      alert("URL isn't valid");
    }

    this.url = elm.value;
    var myInit = { method: "GET", mode: "cors", cache: "default" };
    var context = this;
    fetch(elm.value, myInit)
      .then(function (response) {
        response
          .json()
          .then((data) => {
            context.data = data;
            let options = "";
            Object.getOwnPropertyNames(data).map((value) => {
              let objectType =
                typeof data[value] === "object" ? "array" : "value";
              options +=
                '<option value="' +
                value +
                '">' +
                value +
                " (" +
                objectType +
                ") </option>";
            });

            var select =
              "<select id='card-editor-flux-select-name' class='form-control'><option>Select a value of key or array</option>" +
              options +
              "</select>";

            document.querySelector(
              "#card-editor-flux-select"
            ).innerHTML = select;

            context.listen();
          })
          .catch((error) => {
            alert(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  listen() {
    document
      .querySelector("#card-editor-flux-select-name")
      .addEventListener("change", (event) => {
        if (typeof this.data[event.target.value] === "object") {
          if (Array.isArray(this.data[event.target.value])) {
            this.handleArrayWithObject(event);
          } else {
            /**@handle object */
            this.handleObject(event);
          }
          this.handleOtherElements();
        } else {
          this.choice = {
            type: "value",
            data: event.target.value
          };

          this.run();
        }
      });
  }

  handleObject(event) {
    let options = "";
    Object.getOwnPropertyNames(this.data[event.target.value]).map((value) => {
      if (typeof this.data[event.target.value][value] !== "object") {
        options += "<option value='" + value + "'>" + value + "</option>";
      }
    });
    document.querySelector("#card-editor-flux-select-more").innerHTML =
      `<select class="form-control dynamic-fetcher-select-type"><option>Select type</option><option value='value'>VALUE OF</option></select><select class="form-control dynamic-fetcher-select-name" data-parent="${event.target.value}"><option>Select data</option>${options}</select><input type="number" value="${this.refresh}" class="mt-3 form-control dynamic-fetcher-refresh" placeholder="Refresh every" />`;
  }

  handleArrayWithObject(event) {
    let options = "";
    const first = this.data[event.target.value].shift();
    Object.getOwnPropertyNames(first).map((value) => {
      if (typeof first[value] !== "object") {
        options += "<option value='" + value + "'>" + value + "</option>";
      }
    });
    document.querySelector("#card-editor-flux-select-more").innerHTML =
      `<select class="form-control dynamic-fetcher-select-type"><option>Select type</option><option value='first'>FIRST VALUE OF</option><option value='last'>LAST VALUE OF</option><option value='sum'>SUM OF</option><option value='avg'>AVERAGE OF</option></select><select class="form-control dynamic-fetcher-select-name" data-parent="${event.target.value}"><option>Select data</option>${options}</select><input type="number" value="${this.refresh}" class="mt-3 form-control dynamic-fetcher-refresh" placeholder="Refresh every" />`;
  }

  run() {
    document.querySelector("#card-editor-flux-result").innerHTML =
      "<div class='alert alert-warning'>RESULT</div>";

    this.drawResult(
      document.querySelector("#card-editor-flux-result div"),
      this.getConf()
    );

    document
      .querySelector("#card-editor-flux-result")
      .dispatchEvent(
        new CustomEvent("dynamic-fetcher-update", { detail: this.getConf() })
      );
  }

  getConf() {
    return {
      url: this.url,
      choice: {
        type: this.choice.type,
        data: this.choice.data,
        parent: this.choice.parent
      },
      refresh: this.refresh
    };
  }

  /**
   * Render result in element with configuration, render is refreshed
   * @param {*} elm : a valid element
   * @param {*} conf : a valid configuration or null
   * @example
   * // Render to div
   * const div = document.querySelector("div")
   * const dynamicFetcher = new DynamicFetcher()
   * dynamicFetcher.renderResult(div, {url:"https://gist.githubusercontent.com/rominirani/8235702/raw/a50f7c449c41b6dc8eb87d8d393eeff62121b392/employees.json", choice: { type: "last", data: "preferredFullName", parent: "Employees" }, refresh: 3600});
   * @returns {void}
   */
  renderResult(elm, conf = null) {
    if (conf === null) {
      conf = this.getConf();
    }
    setTimeout(this.drawResult(elm, conf), conf.refresh * 1000);
  }

  drawResult(elm, conf) {
    var myInit = { method: "GET", mode: "cors", cache: "default" };
    var context = this;
    fetch(conf.url, myInit)
      .then(function (response) {
        response
          .json()
          .then((data) => {
            context.result(conf, elm, data);
          })
          .catch((error) => {
            elm.innerHTML = "ERROR WITH DATA";
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  result(conf, elm, data) {
    let value = 0;
    if (conf.choice.type === "value" && conf.choice.parent === undefined) {
      value = data[conf.choice.data];
    } else if (conf.choice.type === "value") {
      value = data[conf.choice.parent][conf.choice.data];
    } else if (conf.choice.type === "last") {
      value = data[conf.choice.parent].pop()[conf.choice.data];
    } else if (conf.choice.type === "first") {
      value = data[conf.choice.parent].shift()[conf.choice.data];
    } else if (conf.choice.type === "sum") {
      value = this.filter(data[conf.choice.parent], conf.choice.data).reduce(
        (acc, current) => {
          return acc + current[conf.choice.data];
        },
        0
      );
    } else if (conf.choice.type === "avg") {
      value =
        this.filter(data[conf.choice.parent], conf.choice.data).reduce(
          (acc, current) => {
            return acc + current[conf.choice.data];
          },
          0
        ) / data[conf.choice.parent].length;
    }
    elm.innerHTML = value;
  }

  filter(arr, key) {
    return arr.filter((data) => {
      if (data[key] === undefined) {
        return false;
      }

      return true;
    });
  }

  handleOtherElements() {
    document
      .querySelector(
        "#card-editor-flux-select-more .dynamic-fetcher-select-type"
      )
      .addEventListener("change", (event) => {
        this.choice.type = event.target.value;
        this.run();
      });
    document
      .querySelector(
        "#card-editor-flux-select-more .dynamic-fetcher-select-name"
      )
      .addEventListener("change", (event) => {
        this.choice.parent = event.target.getAttribute("data-parent");
        this.choice.data = event.target.value;
        this.run();
      });
    document
      .querySelector("#card-editor-flux-select-more .dynamic-fetcher-refresh")
      .addEventListener("change", (event) => {
        this.refresh = event.target.value;
        this.run();
      });
  }
}
