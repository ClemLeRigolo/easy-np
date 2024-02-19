import React from "react";

import "../styles/schoolChoose.css";

export function handleImageChange(event) {
  const selectedImage = event.target.value;
  let selectedColor = "";

  changeColor(selectedImage);
  this.setState({
    selectedImage: selectedImage,
    selectedColor: selectedColor,
  });
}

export function changeColor(selectedImage) {
  let selectedColor = "";

  switch (selectedImage) {
    case "ensimag":
      selectedColor = "#008437";
      break;
    case "phelma":
      selectedColor = "#bc1d1d";
      break;
    case "ense3":
      selectedColor = "#2c519f";
      break;
    case "gi":
      selectedColor = "#249fda";
      break;
    case "pagora":
      selectedColor = "#eb6608";
      break;
    case "esisar":
      selectedColor = "#862c86";
      break;
    default:
      selectedColor = ""; // Couleur par défaut en cas de correspondance non trouvée
  }
  document.documentElement.style.setProperty('--selected-color', selectedColor);
}

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
                  <img src={require("../images/écoles/ensimag.png")} alt="Ensimag" />
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
                  <img src={require("../images/écoles/phelma.png")} alt="Phelma" />
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
                  <img src={require("../images/écoles/ense3.jpeg")} alt="Ense3" />
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
                  <img src={require("../images/écoles/gi.jpeg")} alt="GI" />
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
                  <img src={require("../images/écoles/pagora.png")} alt="Pagora" />
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
                  <img src={require("../images/écoles/esisar.jpeg")} alt="Esisar" />
                </label>
  </div>;
}
