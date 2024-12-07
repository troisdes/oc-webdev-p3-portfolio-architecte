async function getWorks() {
  try {
    const response = await fetch("http://localhost:5678/api/works"); // Récupérer les données de l'API
    if (!response.ok) {
      throw new Error("La réponse du réseau n'était pas correcte");
    }
    const worksData = await response.json(); // Analyser les données JSON
    console.log('Données de "getWorks" récupérées :', worksData);

    const galleryElement = document.querySelector(".gallery"); // Sélectionner l'élément de la galerie
    if (!galleryElement) {
      throw new Error("Élément avec la classe gallery non trouvé");
    }

    galleryElement.innerHTML = ""; // Vider le contenu de la galerie
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
    console.error("Erreur lors de la récupération des travaux :", error); // Gérer les erreurs
    if (galleryElement) {
      galleryElement.innerHTML =
        "<p>Une erreur s'est produite. Veuillez réessayer plus tard.</p>";
    }
  }
}

async function getCategories() {
  try {
    const response = await fetch("http://localhost:5678/api/categories"); // Récupérer les données de l'API
    if (!response.ok) {
      throw new Error("La réponse du réseau n'était pas correcte");
    }
    const categoriesData = await response.json(); // Analyser les données JSON
    console.log('Données de "getCategories" récupérées :', categoriesData);
    const catFilters = document.querySelector(".category-filters"); // Sélectionner l'élément des filtres de catégorie
    if (!catFilters) {
      throw new Error("Élément avec la classe category-filters non trouvé");
    }

    catFilters.innerHTML = ""; // Vider le contenu des filtres de catégorie
    console.log("Chargement...");

    const tousButton = document.createElement("button");
    tousButton.textContent = "Tous";
    tousButton.classList.add("filter-btn", "active");
    tousButton.addEventListener("click", (event) => filterWorks(event, "Tous"));
    catFilters.appendChild(tousButton);

    categoriesData.forEach((category) => {
      const button = document.createElement("button");
      button.textContent = category.name;
      button.classList.add("filter-btn");
      button.addEventListener("click", (event) =>
        filterWorks(event, category.id)
      );
      catFilters.appendChild(button);
    });

    console.log("Chargement complet :", catFilters);
  } catch (error) {
    console.error("Il y eu un problème pour récupérer les données :", error);
  }
}

function filterWorks(event, categoryId) {
  const figures = document.querySelectorAll(".gallery figure");
  const buttons = document.querySelectorAll(".filter-btn");

  buttons.forEach((button) => button.classList.remove("active")); // Update active button
  event.currentTarget.classList.add("active");

  figures.forEach((figure) => {
    if (
      categoryId === "Tous" ||
      figure.dataset.categoryId === categoryId.toString()
    ) {
      figure.style.display = "block";
    } else {
      figure.style.display = "none";
    }
  });
}

getWorks(); // Appeler les fonctions pour afficher les travaux
getCategories(); // Appeler les fonctions pour afficher les catégories

document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("token");

  if (token) {
    createEditionBanner();
    document.body.classList.add("edit-mode");
  }
});

function createEditionBanner() {
  const banner = document.createElement("div");
  banner.classList.add("edition-banner");

  const bannerContent = document.createElement("div");
  bannerContent.classList.add("banner-content");

  const icon = document.createElement("i");
  icon.classList.add("fa-regular", "fa-pen-to-square");

  const text = document.createElement("span");
  text.textContent = "Mode édition";

  bannerContent.appendChild(icon);
  bannerContent.appendChild(text);
  banner.appendChild(bannerContent);

  document.body.insertBefore(banner, document.body.firstChild);
}
