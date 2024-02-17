import React from "react";

import "../styles/schoolChoose.css";

export default function SchoolChoose({selectedImage, handleImageChange}) {
  return <div className="schoolChoose">
                <label className={`image-button-label ${selectedImage === "ensimag" ? "active" : ""}`}>
                  <input
                    type="radio"
                    name="image"
                    value="ensimag"
                    checked={selectedImage === "ensimag"}
                    onChange={handleImageChange}
                    className="image-button"
                  />
                  <img src={require("../images/écoles/ensimag.png")} alt="Image 1" />
                </label>
                <label className={`image-button-label ${selectedImage === "phelma" ? "active" : ""}`}>
                  <input
                    type="radio"
                    name="image"
                    value="phelma"
                    checked={selectedImage === "phelma"}
                    onChange={handleImageChange}
                    className="image-button"
                  />
                  <img src={require("../images/écoles/phelma.png")} alt="Image 2" />
                </label>
                <label className={`image-button-label ${selectedImage === "ense3" ? "active" : ""}`}>
                  <input
                    type="radio"
                    name="image"
                    value="ense3"
                    checked={selectedImage === "ense3"}
                    onChange={handleImageChange}
                    className="image-button"
                  />
                  <img src={require("../images/écoles/ense3.jpeg")} alt="Image 3" />
                </label>
                <label className={`image-button-label ${selectedImage === "gi" ? "active" : ""}`}>
                  <input
                    type="radio"
                    name="image"
                    value="gi"
                    checked={selectedImage === "gi"}
                    onChange={handleImageChange}
                    className="image-button"
                  />
                  <img src={require("../images/écoles/gi.jpeg")} alt="Image 4" />
                </label>
                <label className={`image-button-label ${selectedImage === "pagora" ? "active" : ""}`}>
                  <input
                    type="radio"
                    name="image"
                    value="pagora"
                    checked={selectedImage === "pagora"}
                    onChange={handleImageChange}
                    className="image-button"
                  />
                  <img src={require("../images/écoles/pagora.png")} alt="Image 5" />
                </label>
                <label className={`image-button-label ${selectedImage === "esisar" ? "active" : ""}`}>
                  <input
                    type="radio"
                    name="image"
                    value="esisar"
                    checked={selectedImage === "esisar"}
                    onChange={handleImageChange}
                    className="image-button"
                  />
                  <img src={require("../images/écoles/esisar.jpeg")} alt="Image 6" />
                </label>
  </div>;
}
