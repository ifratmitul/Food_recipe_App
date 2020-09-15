import Search from "./models/Search";
import * as searchView from "./views/searchView";
import { elements, renderLoader, clearLoader } from "./views/base";
const state = {};

const controlSearch = async () => {
  const query = searchView.getInput();

  if (query) {
    state.search = new Search(query);
    //addiing item in the UI
    searchView.clearInput();
    searchView.clearResult();
    renderLoader(elements.searchRes);

    await state.search.getResults();
    // console.log(state.search.result);
    clearLoader();
    searchView.renderResults(state.search.result);
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

// const search = new Search("pizza");
// console.log(search);
