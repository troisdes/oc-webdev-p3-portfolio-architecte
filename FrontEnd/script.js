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

// Appeler la fonction pour récupérer et afficher les travaux
getWorks();

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
  } catch (error) {
    console.error(" Il y eu un problème pour récupérer les données :", error);
  }
}

// Appeler la fonction pour récupérer les catégories
getCategories();
