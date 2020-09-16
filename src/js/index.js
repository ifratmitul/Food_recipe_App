import Search from "./models/Search";
import * as searchView from "./views/searchView";
import { elements, renderLoader, clearLoader } from "./views/base";
import Recipe from "./models/Recipe";
const state = {};

const controlSearch = async () => {
  const query = searchView.getInput();

  if (query) {
    state.search = new Search(query);
    //addiing item in the UI
    searchView.clearInput();
    searchView.clearResult();
    renderLoader(elements.searchRes);

    try {
      await state.search.getResults();
      // console.log(state.search.result);
      clearLoader();
      searchView.renderResults(state.search.result);
    } catch (error) {
      clearLoader();
    }
  }
};

elements.searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  controlSearch();
});

elements.searchResPages.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-inline");

  if (btn) {
    const gotoPage = parseInt(btn.dataset.goto, 10);

    searchView.clearResult();
    searchView.renderResults(state.search.result, gotoPage);
    //console.log(gotoPage);
  }
  //console.log(btn);
});

//recipe controller

// const r = new Recipe(47746);
// r.getRecipe();

const controlRecipe = async () => {
  const id = window.location.hash.replace("#", "");
  console.log(id);

  if (id) {
    state.recipe = new Recipe(id);
    window.r = state.recipe;

    try {
      await state.recipe.getRecipe();
      //console.log(state.recipe.ingredients);
      state.recipe.parseIngredients();
      state.recipe.calcTime();
      state.recipe.calcServings();
      //console.log(state.recipe);
      //console.log(state);
    } catch (err) {
      alert(err);
    }
  }
};

["hashchange", "load"].forEach((Event) => {
  window.addEventListener(Event, controlRecipe);
});
