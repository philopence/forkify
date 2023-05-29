import icons from "../../img/icons.svg"

export default class View {
  _data

  render(data, render = true) {

    if (!data || Array.isArray(data) && !(data.length)) {
      return this.renderError()
    }

    this._data = data;

    const markup = this._generateMarkup()

    if (!render) return markup

    this._clear()

    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  update(data) {
    // if (!data || Array.isArray(data) && !(data.length)) {
    //   return this.renderError()
    // }

    this._data = data;

    const newMarkup = this._generateMarkup()

    const newDOM = document.createRange().createContextualFragment(newMarkup)
    const newElements =  Array.from(newDOM.querySelectorAll("*"))
    const curElements =  Array.from(this._parentElement.querySelectorAll("*"))

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i]
      if (!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim()) {
        curEl.textContent = newEl.textContent
      }
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr => {
          curEl.setAttribute(attr.name, attr.value)
        })
      }
    })
  }

  renderSpinner() {
    const markup = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>
    `;

    this._clear()

    this._parentElement.insertAdjacentHTML("afterbegin", markup)
  }

  renderError(errorMsg = this._errorMsg) {
    const markup = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${errorMsg}</p>
      </div>
    `;
    this._clear()
    this._parentElement.insertAdjacentHTML("afterbegin", markup)
  }

  renderMessage(msg = this._message) {
    const markup = `
      <div class="message">
        <div>
          <svg>
            <use href="src/img/icons.svg#icon-smile"></use>
          </svg>
        </div>
        <p>${msg}</p>
      </div>
    `
    this._clear()
    this._parentElement.insertAdjacentHTML("afterbegin", markup)
  }

  _clear() {
    this._parentElement.innerHTML = "";
  }

}
