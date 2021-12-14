import React from "react";
import PropTypes from "prop-types";
import s from "./ImageGalleryItem.module.css";

const ImageGalleryItem = ({ src, alt, onClick, id }) => {
  return (
    <li
      className={s.imageGalleryItem}
      onClick={() => {
        onClick(src, alt, id);
      }}
    >
      <img src={src} alt={alt} className={s.imageGalleryItemImage} />
    </li>
  );
};

ImageGalleryItem.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  onClick: PropTypes.func,
};
export default ImageGalleryItem;
