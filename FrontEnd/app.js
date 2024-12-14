async function getWorks() {
  const galleryElement = document.querySelector(".gallery");

  try {
    galleryElement.innerHTML = "<p>Chargement en cours...</p>";
    const response = await fetch("http://localhost:5678/api/works"); // Récupérer les données de l'API
    if (!response.ok) {
      throw new Error("La réponse du réseau n'était pas correcte");
    }
    const worksData = await response.json(); // Analyser les données JSON
    console.log('Données de "getWorks" récupérées :', worksData);

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
    galleryElement.innerHTML = `
      <div class="error-message">
        <p>Une erreur s'est produite: ${error.message}</p>
        <button onclick="getWorks()">Réessayer</button>
      </div>`;
  }
}

async function getCategories() {
  try {
    const response = await fetch("http://localhost:5678/api/categories"); // Fetch API data
    if (!response.ok) {
      throw new Error("La réponse du réseau n'était pas correcte");
    }
    const categoriesData = await response.json(); // Parse JSON
    console.log('Données de "getCategories" récupérées :', categoriesData);

    const catFilters = document.querySelector(".category-filters"); // Get the container
    if (!catFilters) {
      throw new Error("Élément avec la classe category-filters non trouvé");
    }

    catFilters.innerHTML = ""; // Clear previous content

    // Create the "Tous" button
    const allWorksButton = document.createElement("button");
    allWorksButton.textContent = "Tous";
    allWorksButton.classList.add("filter-btn", "active");
    allWorksButton.addEventListener("click", (event) =>
      filterWorks(event, "Tous")
    );
    catFilters.appendChild(allWorksButton);

    // Iterate over categoriesData to create buttons for each category
    categoriesData.forEach((category) => {
      console.log("Ajout d'un bouton de filtre:", category); // Debug log
      const categoryButton = document.createElement("button");
      categoryButton.textContent = category.name; // Set button label
      categoryButton.classList.add("filter-btn");
      categoryButton.addEventListener("click", (event) =>
        filterWorks(event, category.id)
      );
      catFilters.appendChild(categoryButton); // Append to container
    });

    console.log("Filtres de catégories chargés :", catFilters);
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories :", error); // Handle errors
  }
}

// Fonction pour filtrer les travaux
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

// Appeler les fonctions pour récupérer les travaux et les catégories
getWorks();
getCategories();

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

  const header = document.querySelector("header");
  if (header) {
    header.classList.add("header-with-banner");
  }
}

function updateLoginLogoutButton() {
  const token = localStorage.getItem("token");
  console.log("Token récupéré:", "mise à jour du bouton de connexion");
  const loginButton = document.getElementById("loginBtn");

  if (loginButton) {
    loginButton.textContent = "logout";
    loginButton.href = "login.html";
    loginButton.addEventListener("click", function () {
      localStorage.removeItem("token");
      window.location.reload();
    });
  }
}

function hideFilterBar() {
  const token = localStorage.getItem("token");
  console.log("Token récupéré", "masquage de la barre de filtres");
  const filterBar = document.querySelector(".category-filters");

  if (filterBar) {
    filterBar.style.display = "none";
    console.log("La barre de filtres est cachée");
  }
}

function addButtonModifier() {
  const token = localStorage.getItem("token");
  console.log("Token récupéré");

  const portfolioTitle = document.querySelector("#portfolio h2");
  console.log("Titre du portfolio trouvé:", portfolioTitle);

  if (portfolioTitle) {
    // Réinitialiser la marge du titre
    portfolioTitle.style.marginTop = "0";

    // Créer le conteneur
    const modifierContainer = document.createElement("div");
    modifierContainer.classList.add("modifier-container");

    // Déplacer le titre h2 dans le conteneur
    portfolioTitle.parentNode.insertBefore(modifierContainer, portfolioTitle);
    modifierContainer.appendChild(portfolioTitle);

    // Créer le bouton de modification
    const modifierBtn = document.createElement("button");
    modifierBtn.classList.add("modifier-btn");
    console.log("Bouton de modification créé:");

    // Créer le lien
    const href = document.createElement("a");
    href.classList.add("modifier-btn");
    href.href = "#modal1";
    href.textContent = "modifier";

    // Créer l'icône
    const icon = document.createElement("i");
    icon.classList.add("fa-regular", "fa-pen-to-square");

    // Ajouter l'icône et le texte au bouton
    modifierBtn.appendChild(icon);
    modifierBtn.appendChild(href);

    // Ajouter le bouton au conteneur
    modifierContainer.appendChild(modifierBtn);

    console.log("Conteneur de modification créé:", modifierContainer);

    // Ajouter l'écouteur d'événement pour le bouton de modification
    modifierBtn.addEventListener("click", function () {
      const token = localStorage.getItem("token");

      if (token) {
        document.getElementById("modal1").style.display = "block";
      }
      console.log("Token récupéré:", "Mode édition activé");
    });
  }
}

function createModal() {
  const modal = document.createElement("aside");
  modal.id = "modal1";
  modal.classList.add("modal");

  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");
  modal.appendChild(modalContent);

  const closeBtn = document.createElement("button");
  closeBtn.classList.add("close-btn");
  closeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  closeBtn.addEventListener("click", function () {
    modal.style.display = "none";
  });
  modalContent.appendChild(closeBtn);

  const modalHeader = document.createElement("header");
  modalHeader.classList.add("modal-header");
  modalHeader.innerHTML = "<h2>Galerie photo</h2>";
  modalContent.appendChild(modalHeader);

  const galleryContainer = document.createElement("div");
  galleryContainer.classList.add("modal-gallery-box");
  modalContent.appendChild(galleryContainer);

  const galleryGrid = document.createElement("div");
  galleryGrid.classList.add("modal-gallery");
  galleryContainer.appendChild(galleryGrid);
  // Fetch and display works in modal
  fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((works) => {
      works.forEach((work) => {
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        img.src = work.imageUrl;
        img.alt = work.title;

        const deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
        deleteBtn.classList.add("delete-btn");

        figure.appendChild(img);
        figure.appendChild(deleteBtn);
        galleryGrid.appendChild(figure);
      });
    });

  document.body.appendChild(modal);
}

document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("token");
  console.log("Token récupéré:", "Mode édition activé");

  if (token) {
    createEditionBanner();
    updateLoginLogoutButton();
    hideFilterBar();
    addButtonModifier();
    createModal();
  }
});
