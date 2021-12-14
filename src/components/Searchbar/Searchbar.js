import { Component } from "react";
import { GoSearch } from "react-icons/go";
import { toast } from "react-toastify";
import s from "./Searchbar.module.css";

class SearchBar extends Component {
  state = {
    searchQuery: "",
  };

  handleQueryChange = (event) => {
    this.setState({ searchQuery: event.currentTarget.value.toLowerCase() });
  };
  handleSubmit = (event) => {
    event.preventDefault();
    if (this.state.searchQuery.trim() === "") {
      toast("Enter query in the search field.");
      return;
    }
    this.props.onSubmit(this.state.searchQuery);
    this.setState({ searchQuery: "" });
  };
  render() {
    return (
      <header className={s.searchbar}>
        <form onSubmit={this.handleSubmit} className={s.searchForm}>
          <button type="submit" className={s.button}>
            <span className={s.buttonLabel}>Search</span>
            <GoSearch />
          </button>

          <input
            value={this.state.searchQuery}
            onChange={this.handleQueryChange}
            className={s.input}
            type="text"
            autoComplete="off"
            autoFocus
            placeholder="Search images and photos"
          />
        </form>
      </header>
    );
  }
}

export default SearchBar;
