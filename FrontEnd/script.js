async function getWorks() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const getWorksData = await response.json();
    console.log("Données récupérées :", getWorksData);

    const getWorksGallery = document.querySelector(".gallery");
    if (!getWorksGallery) {
      throw new Error('Element with class "gallery" not found');
    }

    let gallery = getWorksGallery;
    gallery.innerHTML = "";

    getWorksData.forEach((work) => {
      const figure = document.createElement("figure");
      figure.dataset.categoryId = work.categoryId.toString();
      gallery.appendChild(figure);

      const img = document.createElement("img");
      img.src = work.imageUrl;
      img.alt = work.title;
      figure.appendChild(img);

      const figcaption = document.createElement("figcaption");
      figcaption.textContent = work.title;
      figure.appendChild(figcaption);
    });
    console.log(gallery);
  } catch (error) {
    console.error("Error fetching works:", error);
  }
}
getWorks();

//     const getWorks = await fetch("http://localhost:5678/api/works");
//     console.log(getWorks);

//   const getWorksData = await getWorks.json();
//   console.log("Données récupérées :", getWorksData);

//   console.dir(getWorksData);

//     const getWorksGallery = document.querySelector(".gallery");
//     if (!getWorksGallery) {
//       throw new Error('Element with class "gallery" not found');
//     }

// getWorksGallery.innerHTML = "";
// console.log(getWorksGallery);

// getWorksData.forEach((work) => {
//     const figure = document.createElement("figure");

//     const img = document.createElement("img");
//     const figcaption = document.createElement("figcaption");
//     getWorksGallery.appendChild(figure);
// });

// }
