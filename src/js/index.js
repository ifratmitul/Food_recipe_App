import Search from "./models/Search";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as listView from "./views/listView";
import * as likesView from "./views/likesView";
import { elements, renderLoader, clearLoader } from "./views/base";
import Recipe from "./models/Recipe";
import List from "./models/List";
import Likes from "./models/Likes";
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
    recipeView.clearRecipe();
    renderLoader(elements.recipe);
    if (state.search) searchView.highlightSelected(id);
    state.recipe = new Recipe(id);

    try {
      await state.recipe.getRecipe();
      //console.log(state.recipe.ingredients);
      state.recipe.parseIngredients();
      state.recipe.calcTime();
      state.recipe.calcServings();
      //console.log(state.recipe);
      //console.log(state);
      clearLoader();
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
    } catch (err) {
      alert(err);
    }
  }
};

["hashchange", "load"].forEach((Event) => {
  window.addEventListener(Event, controlRecipe);
});

const controlList = () => {
  if (!state.list) state.list = new List();

  // Add each ingredient to the list and UI
  state.recipe.ingredients.forEach((el) => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  });
};

// Handle delete and update list item events
elements.shopping.addEventListener("click", (e) => {
  const id = e.target.closest(".shopping__item").dataset.itemid;

  // Handle the delete button
  if (e.target.matches(".shopping__delete, .shopping__delete *")) {
    // Delete from state
    state.list.deleteItem(id);

    // Delete from UI
    listView.deleteItem(id);

    // Handle the count update
  } else if (e.target.matches(".shopping__count-value")) {
    const val = parseFloat(e.target.value, 10);
    state.list.updateCount(id, val);
  }
});

// Handling recipe button clicks
elements.recipe.addEventListener("click", (e) => {
  if (e.target.matches(".btn-decrease, .btn-decrease *")) {
    // Decrease button is clicked
    if (state.recipe.servings > 1) {
      state.recipe.updateServings("dec");
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (e.target.matches(".btn-increase, .btn-increase *")) {
    // Increase button is clicked
    state.recipe.updateServings("inc");
    recipeView.updateServingsIngredients(state.recipe);
  } else if (e.target.matches(".recipe__btn--add, .recipe__btn--add *")) {
    // Add ingredients to shopping list
    controlList();
  } else if (e.target.matches(".recipe__love, .recipe__love *")) {
    // Like controller
    controlLike();
  }
});

//Likes Controller
state.likes = new Likes(); //for test
const controlLike = () => {
  if (!state.likes) state.likes = new Likes();

  const currentID = state.recipe.id;
  //user has not yet liked current recipe
  if (!state.likes.isLiked(currentID)) {
    const newLike = state.likes.addLike(
      currentID,
      state.recipe.id,
      state.recipe.author,
      state.recipe.img
    );

    likesView.toggleLikeBtn(true);
    likesView.renderLike(newLike);

    console.log(state.likes);
  }
  //user liked current recipe
  else {
    state.likes.deleteLike(currentID);
    likesView.toggleLikeBtn(false);
    likesView.deleteLike(currentID);
    console.log(state.likes);
  }

  likesView.toggleLikeMenu(state.likes.getNumLikes());
};
