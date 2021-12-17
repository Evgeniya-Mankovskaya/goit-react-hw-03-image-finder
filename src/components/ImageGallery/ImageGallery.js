import React, { Component } from "react";
import { toast } from "react-toastify";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import s from "./ImageGallery.module.css";
import ImageAPI from "../../services/api";
import ImageGalleryItem from "../ImageGalleryItem/ImageGalleryItem";
import Button from "../Button/Button";
import Modal from "../Modal/Modal";

class ImageGallery extends Component {
  state = {
    gallery: [],
    status: "idle",
    error: null,
    page: 1,
    showModal: false,
  };
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.searchQuery !== this.props.searchQuery) {
      this.setState(() => ({ gallery: [] }), this.getItems);
    }
    if (prevState.page !== this.state.page) {
      this.getItems();
    }
    this.handleScroll();
  }

  getItems = () => {
    this.setState({ status: "pending" });
    ImageAPI(this.props.searchQuery, this.state.page)
      .then((gallery) => {
        if (gallery.hits.length === 0) {
          return Promise.reject(
            new Error(`Nothing were found with ${this.props.searchQuery}`)
          );
        } else {
          this.setState({
            gallery: [...this.state.gallery, ...gallery.hits],
            status: "resolved",
            searchQuery: this.props.searchQuery,
          });
        }
      })
      .catch((error) => {
        this.setState({ error, status: "rejected" });
        toast("Someting went wrong");
      });
  };

  handleScroll = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  loadMore = () => {
    this.setState({
      page: this.state.page + 1,
    });
  };
  images(arr) {
    const newImgArr = [];
    arr.forEach(({ id, largeImageURL, tags }) => {
      newImgArr.push({ id, largeImageURL, tags });
    });
    return newImgArr;
  }

  toggleModal = () => {
    this.setState((prevState) => ({ showModal: !prevState.showModal }));
  };

  onOpen = (src, alt) => {
    this.setState({
      largeImageURL: src,
      alt: alt,
    });
    this.toggleModal();
  };
  onClose = () => {
    this.setState({
      largeImageURL: "",
      alt: "",
    });
  };
  render() {
    const { gallery, status, largeImageURL, alt, showModal } = this.state;

    if (status === "idle") {
      return <div>Enter search query</div>;
    }

    if (status === "pending") {
      return (
        <Loader
          className={s.loader}
          type="Hearts"
          color="#cea8d67a"
          height={80}
          width={80}
        />
      );
    }

    if (status === "rejected") {
      return <div>Nothing were found</div>;
    }

    if (status === "resolved") {
      return (
        <div>
          {showModal && (
            <Modal onClose={this.toggleModal} src={largeImageURL} tags={alt} />
          )}
          <ul className={s.imageGallery}>
            {gallery.map(({ largeImageURL, tags, id }) => {
              return (
                <ImageGalleryItem
                  key={id}
                  src={largeImageURL}
                  alt={tags}
                  onClick={this.onOpen}
                />
              );
            })}
          </ul>
          <Button onClick={this.loadMore} />
        </div>
      );
    }
  }
}

export default ImageGallery;
