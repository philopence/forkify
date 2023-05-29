import icons from "../../img/icons.svg"
import View from "./View";
import previewView from "./previewView";

class ResultsView extends View {
  _parentElement = document.querySelector(".results");
  _errorMsg = "No recipes found for your query. Please try again!"

  _generateMarkup() {
    // TODO  preview__link--active
    // TODO  user own mark
    const id = location.hash.slice(1)
    return this._data.reduce((markup, r) => markup += previewView.render(r, false), "")
  }
}

export default new ResultsView()
