import View from "./View.js";
import icons from "../../img/icons.svg"

class PaginationView extends View {
  _parentElement = document.querySelector(".pagination");

  _generateMarkup() {
    const {results, resultsPerPage, page} = this._data
    const numPages = Math.ceil(results.length / resultsPerPage)

    if (page === 1 && numPages === 1) return ""

    if (page === 1) return this._generateMarkupButton(page + 1)

    if (page === numPages) return this._generateMarkupButton( page - 1 )

    return `
      ${this._generateMarkupButton(page - 1)}
      ${this._generateMarkupButton(page + 1)}
    `
  }

  _generateMarkupButton(page) {
    const {page: curPage} = this._data

    if (page < curPage) return `
      <button class="btn--inline pagination__btn--prev" data-goto="${page}">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${page}</span>
      </button>
    `;

    return `
      <button class="btn--inline pagination__btn--next" data-goto="${page}">
        <span>Page ${page}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>
    `

  }

  // TODO  add click handler
  addHandlerClick(handler) {
    this._parentElement.addEventListener("click", function(e) {
      const btn = e.target.closest(".btn--inline")

      if (!btn) return

      const goToPage = Number(btn.dataset.goto)
      handler(goToPage)
    })
  }
}

export default new PaginationView()
