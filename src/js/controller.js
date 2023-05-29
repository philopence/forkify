// if (module.hot) {
//   module.hot.accept();
// }

import * as model from "./model.js"
import recipeView from "./views/recipeView.js";
import resultsView from "./views/resultsView.js";
import searchView from "./views/searchView.js";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarksView.js";
import addRecipeView from "./views/addRecipeView.js";
import { MODAL_CLOSE_SEC } from "./config.js";


// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

async function controlRecipes() {
  try {

    const recipeId = location.hash.slice(1)

    if (!recipeId) return

    resultsView.update(model.getSearchResultsPage())

    bookmarksView.render(model.state.bookmarks)

    // render spinner
    recipeView.renderSpinner()

    // load recipe
    await model.loadRecipe(recipeId)

    // TODO  request timeout

    // Render recipe
    recipeView.render(model.state.recipe)


  } catch(error) {
    recipeView.renderError()
  }
}

async function controlSearchResults() {
  try {
    const query = searchView.getQuery()

    if (!query) return

    resultsView.renderSpinner()

    await model.loadSearchResults(query)

    resultsView.render(model.getSearchResultsPage())

    paginationView.render(model.state.search)

  } catch (error) {
    // TODO  ERROR
    console.error(`BUG: ${error.message}`)
  }
}

function controlPagination(goToPage) {

  resultsView.render(model.getSearchResultsPage(goToPage))

  paginationView.render(model.state.search)
}

function controlServings(newServings) {
  model.updateServings(newServings)
  recipeView.update(model.state.recipe)
}

function controlAddBookmark() {
  model.state.recipe.bookmarked
    ? model.deleteBookmark(model.state.recipe.id)
    : model.addBookmark(model.state.recipe)

  recipeView.update(model.state.recipe)

  bookmarksView.render(model.state.bookmarks)
}

function controlBookmarks() {
  bookmarksView.render(model.state.bookmarks)
}

async function controlAddRecipe(newRecipe) {
  try {

    addRecipeView.renderSpinner()

    await model.uploadRecipe(newRecipe)

    addRecipeView.renderMessage()

    recipeView.render(model.state.recipe)

    bookmarksView.render(model.state.bookmarks)

    history.pushState(null, "", `#${model.state.recipe.id}`)

    setTimeout(function() {
      addRecipeView.closeWindow()
    }, MODAL_CLOSE_SEC * 1000)
  } catch(error) {
    addRecipeView.renderError(error.message)
  }
}

function init() {
  recipeView.addHandlerRender(controlRecipes)

  recipeView.addHandlerUpdateServings(controlServings)

  recipeView.addHandlerAddBookmark(controlAddBookmark)

  searchView.addHandlerSearch(controlSearchResults)

  paginationView.addHandlerClick(controlPagination)

  bookmarksView.addHandlerRender(controlBookmarks)

  addRecipeView.addHandlerUpload(controlAddRecipe)
}

init()
