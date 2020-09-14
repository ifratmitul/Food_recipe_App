import Search from "./models/Search";
import * as searchView from "./views/searchView";
import { elements } from "./views/base";
const state = {};

const controlSearch = async () => {
  const query = searchView.getInput(); // Will get it from the view late.

  if (query) {
    state.search = new Search(query);

    searchView.clearInput();
    searchView.clearResult();
    await state.search.getResults();
    console.log(state.search.result);
    searchView.renderResults(state.search.result);
  }
};

elements.searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  controlSearch();
});

// const search = new Search("pizza");
// console.log(search);
