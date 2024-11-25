async function getWorks() {
  try {
    // Récupérer les données de l'API
    const response = await fetch("http://localhost:5678/api/works");
    if (!response.ok) {
      throw new Error("La réponse du réseau n'était pas correcte");
    }
    // Analyser les données JSON
    const worksData = await response.json();
    console.log('Données de "getWorks" récupérées :', worksData);

    // Sélectionner l'élément de la galerie
    const galleryElement = document.querySelector(".gallery");
    if (!galleryElement) {
      throw new Error("Élément avec la classe gallery non trouvé");
    }

    // Vider le contenu de la galerie
    galleryElement.innerHTML = "";
    console.log("Chargement...");

    // Remplir la galerie avec les données récupérées
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
    // Gérer les erreurs
    console.error("Erreur lors de la récupération des travaux :", error);
    if (galleryElement) {
      galleryElement.innerHTML =
        "<p>Une erreur s'est produite. Veuillez réessayer plus tard.</p>";
    }
  }
}

async function getCategories() {
  try {
    // Récupérer les données de l'API
    const response = await fetch("http://localhost:5678/api/categories");
    if (!response.ok) {
      throw new Error("La réponse du réseau n'était pas correcte");
    }
    // Analyser les données JSON
    const categoriesData = await response.json();
    console.log('Données de "getCategories" récupérées :', categoriesData);
    const catFilters = document.querySelector(".category-filters");
    if (!catFilters) {
      throw new Error("Élément avec la classe category-filters non trouvé");
    }

    // Vider le contenu des filtres de catégorie
    catFilters.innerHTML = "";
    console.log("Chargement...");

    // Remplir la galerie avec les données récupérées
    const tousButton = document.createElement("button");
    tousButton.textContent = "Tous";
    tousButton.classList.add("filter-btn", "active");
    tousButton.addEventListener("click", () => filterWorks("Tous"));
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
  } catch (error) {
    console.error("Il y eu un problème pour récupérer les données :", error);
  }
}

function filterWorks(event, categoryId) {
  const figures = document.querySelectorAll(".gallery figure");
  const buttons = document.querySelectorAll(".filter-btn");

  // Update active button
  buttons.forEach((button) => button.classList.remove("active"));
  event.currentTarget.classList.add("active");

  // Filter works
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

// Appeler les fonctions pour afficher les travaux et les catégories
getWorks();
getCategories();
