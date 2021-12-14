import React, { Component } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Searchbar from "./components/Searchbar/Searchbar";
import ImageGallery from "./components/ImageGallery/ImageGallery";
import "./App.css";
import Container from "./components/Container/Container";

// Your API key: 24006610-770c029dafc5e505b4312f4f7
//
class App extends Component {
  state = {
    searchQuery: "",
  };
  handleFormSubmit = (searchQuery) => {
    this.setState({ searchQuery });
  };

  render() {
    const { searchQuery } = this.state;
    return (
      <>
        <Container>
          <Searchbar onSubmit={this.handleFormSubmit} />
        </Container>
        <Container>
          <ImageGallery searchQuery={searchQuery} />
        </Container>
        <ToastContainer position="top-center" />
      </>
    );
  }
}

export default App;
