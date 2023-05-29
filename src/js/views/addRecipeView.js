import View from "./View.js";
import icons from "../../img/icons.svg"

class AddRecipeView extends View {
  _parentElement = document.querySelector(".upload");
  _window = document.querySelector(".add-recipe-window");
  _overlay = document.querySelector(".overlay");
  _btnOpen = document.querySelector(".nav__btn--add-recipe");
  _btnClose = document.querySelector(".btn--close-modal");
  _message = "Recipe was successfully uploaded :D"

  constructor() {
    super()
    this._addHandlerShowWindow()
    this._addHandlerCloseWindow()
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener("submit", function (e) {
      e.preventDefault()
      const data = Object.fromEntries([...new FormData(this)])

      handler(data)

    })
  }

  closeWindow() {
    this._overlay.classList.add("hidden")
    this._window.classList.add("hidden")
  }

  _addHandlerShowWindow() {
    const _this = this
    this._btnOpen.addEventListener("click", function() {
      _this._overlay.classList.remove("hidden")
      _this._window.classList.remove("hidden")
    })
  }

  _addHandlerCloseWindow() {
    this._btnClose.addEventListener("click", this.closeWindow.bind(this))
    this._overlay.addEventListener("click", this.closeWindow.bind(this))
  }

  _generateMarkup() {}
}

export default new AddRecipeView()
