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
    const prevQuery = prevProps.searchQuery;
    const nextQuery = this.props.searchQuery;

    if (prevQuery !== nextQuery) {
      this.setState({ status: "pending" });
      ImageAPI(nextQuery)
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          return Promise.reject(
            new Error(`Nothing were found with ${nextQuery}`)
          );
        })
        .then(({ hits }) => {
          if (hits.length === 0) {
            this.setState({ status: "rejected" });
          } else {
            const addHits = this.images(hits);
            this.setState({
              gallery: addHits,
              status: "resolved",
              page: this.state.page + 1,
              searchQuery: nextQuery,
            });
          }
        })
        .catch((error) => {
          this.setState({ error, status: "rejected" });
          toast("Someting went wrong");
        });
    }
  }

  loadMore = () => {
    const { searchQuery, page } = this.state;
    ImageAPI(searchQuery, page)
      .then((response) => {
        return response.json();
      })
      .then(({ hits }) => {
        const addHits = this.images(hits);
        this.setState((prevState) => ({
          gallery: [...prevState.gallery, ...addHits],
          page: page + 1,
        }));
      })

      .then(() => {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: "smooth",
        });
      })
      .catch((error) => {
        this.setState({ error, status: "rejected" });
        toast("Someting went wrong");
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
