import { API_URL, KEY, RES_PER_PAGE } from "./config.js";
import { AJAX } from "./helper.js";

const state = {
  recipe: {},
  search: {
    query: "",
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
};

function createRecipeObject(data) {
  const {
    id,
    title,
    publisher,
    source_url: sourceUrl,
    image_url: image,
    servings,
    cooking_time: cookingTime,
    ingredients,
    key
  } = data;

  return {
    id,
    title,
    publisher,
    sourceUrl,
    image,
    servings,
    cookingTime,
    ingredients,
    // Optional field
    ...(key && {key})
  };
}

/**
 * @param {string} id the id of recipe
 */
async function loadRecipe(recipeId) {
  try {

    const resData = await AJAX(`${API_URL}${recipeId}?key=${KEY}`);

    state.recipe = createRecipeObject(resData.data.recipe);

    state.bookmarks.some(b => b.id === state.recipe.id) &&
      (state.recipe.bookmarked = true);
  } catch (error) {
    throw error;
  }
}

/**
 * @param {string} query User Search Keyword
 */
async function loadSearchResults(query) {
  try {
    state.search.query = query;

    const resData = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    state.search.results = resData.data.recipes.map(r => {
      const { publisher, image_url: image, title, id, key } = r;
      return {
        publisher,
        image,
        title,
        id,
        ...(key && {key})
      };
    });

    // reset default page
    state.search.page = 1;
  } catch (error) {
    throw error;
  }
}

// 根据当前页码，返回对应的 10 个结果
// 1: 0 ... 9
// 2: 10 ... 19
// 3: 20 ... 29
// startIndex = (page - 1) * 10
function getSearchResultsPage(page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = start + state.search.resultsPerPage;
  return [...state.search.results].slice(start, end);
}

function updateServings(newServings) {
  const { servings, ingredients } = state.recipe;

  state.recipe.ingredients = ingredients.map(i => {
    i.quantity *= newServings / servings;
    return i;
  });
  state.recipe.servings = newServings;
}

function persistBookmarks() {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
}

function addBookmark(recipe) {
  state.bookmarks.push(recipe);

  // NOTE  don't know
  // 只会传入 currentRecipe，没必要做判断
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
}

function deleteBookmark(id) {
  const bookmarkIndex = state.bookmarks.findIndex(b => b.id === id);
  state.bookmarks.splice(bookmarkIndex, 1);

  if (id === state.recipe.id) delete state.recipe.bookmarked;
  persistBookmarks();
}

async function uploadRecipe(newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith("ingredient") && entry[1])
      .map(([_, ingredient]) => {
        const ingredientArray = ingredient.split(",");
        if (ingredientArray.length !== 3)
          throw new Error("Wrong ingredient format! :(");
        const [quantity, unit, description] = ingredientArray;
        return {
          quantity: quantity ? Number(quantity) : null,
          unit,
          description,
        };
      });

    const {
      title,
      sourceUrl: source_url,
      image: image_url,
      publisher,
      cookingTime: cooking_time,
      servings,
    } = newRecipe;

    const recipe = {
      title,
      source_url,
      image_url,
      publisher,
      cooking_time: Number(cooking_time),
      servings: Number(servings),
      ingredients,
    };

    const resData = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(resData.data.recipe)

    addBookmark(state.recipe)

  } catch (error) {
    throw error;
  }
}

function init() {
  state.bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
}

init();

export {
  state,
  loadRecipe,
  loadSearchResults,
  getSearchResultsPage,
  updateServings,
  addBookmark,
  deleteBookmark,
  uploadRecipe,
};
