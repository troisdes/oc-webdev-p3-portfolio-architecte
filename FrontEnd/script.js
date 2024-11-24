async function getWorks() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const worksData = await response.json();
    console.log("Données récupérées :", worksData);

    const galleryElement = document.querySelector(".gallery");
    if (!galleryElement) {
      throw new Error('Element with class "gallery" not found');
    }

    galleryElement.innerHTML = "";
    console.log("Chargement...");

    worksData.forEach((work) => {
      const figure = document.createElement("figure");
      figure.dataset.categoryId = work.categoryId.toString();

      const img = document.createElement("img");
      img.src = work.imageUrl;
      img.alt = work.title;
      figure.appendChild(img);

      const figcaption = document.createElement("figcaption");
      figcaption.textContent = work.title;
      figure.appendChild(figcaption);

      galleryElement.appendChild(figure);
    });

    console.log("Chargement complet :", galleryElement);
  } catch (error) {
    console.error("Error fetching works:", error);
  }
}

getWorks();
