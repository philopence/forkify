import icons from "../../img/icons.svg"
import View from "./View";
import previewView from "./previewView";

class BookmarksView extends View {
  _parentElement = document.querySelector(".bookmarks__list");
  _errorMsg = "No bookmarks yet. Find a nice recipe and bookmark it! :)"

  addHandlerRender(handler) {
    window.addEventListener("load", handler)
  }

  _generateMarkup() {
    // TODO  user own mark
    const id = location.hash.slice(1)
    return this._data.reduce((markup, b) => markup += previewView.render(b, false), "")
  }
}

export default new BookmarksView()
