// Vérifie si un élément du DOM existe et le renvoie, sinon lance une erreur
function validateElement(element, name) {
  if (!element) {
    throw new Error(`${name} élément absent du DOM`);
  }
  return element;
}

// Vérifie si l'utilisateur est authentifié en vérifiant la présence du token
function checkAuthState() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.log("Pas de token trouvé");
    return false;
  }
  return true;
}

// Récupère et affiche les travaux depuis l'API
// Crée les éléments HTML pour chaque projet dans la galerie principale
async function getWorks() {
  const galleryElement = validateElement(
    document.querySelector("#main-gallery"),
    "Gallery"
  );

  try {
    const response = await fetch("http://localhost:5678/api/works");
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const works = await response.json();
    galleryElement.innerHTML = "";

    works.forEach((work) => {
      const figure = document.createElement("figure");
      figure.dataset.id = work.id;
      figure.dataset.categoryId = work.categoryId; // Stocke l'ID de catégorie pour le filtrage

      const img = document.createElement("img");
      img.src = work.imageUrl;
      img.alt = work.title;

      const figcaption = document.createElement("figcaption");
      figcaption.textContent = work.title;

      figure.appendChild(img);
      figure.appendChild(figcaption);
      galleryElement.appendChild(figure);
    });
  } catch (error) {
    console.error("Error fetching works:", error);
    galleryElement.innerHTML =
      '<p class="error">Erreur lors du chargement des travaux</p>';
  }
}

// Récupère les catégories depuis l'API et crée les boutons de filtrage
async function getCategories() {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    if (!response.ok) {
      throw new Error("La réponse du réseau n'était pas correcte");
    }
    const categoriesData = await response.json();
    console.log('Données de "getCategories" récupérées :', categoriesData);

    const catFilters = document.querySelector(".category-filters");
    if (!catFilters) {
      throw new Error("Élément avec la classe category-filters non trouvé");
    }

    catFilters.innerHTML = "";

    // Création du bouton "Tous" qui affiche tous les projets
    const allWorksButton = document.createElement("button");
    allWorksButton.textContent = "Tous";
    allWorksButton.classList.add("filter-btn", "active");
    allWorksButton.addEventListener("click", (event) =>
      filterWorks(event, "Tous")
    );
    catFilters.appendChild(allWorksButton);

    // Création des boutons pour chaque catégorie
    categoriesData.forEach((category) => {
      console.log("Ajout d'un bouton de filtre:", category);
      const categoryButton = document.createElement("button");
      categoryButton.textContent = category.name;
      categoryButton.classList.add("filter-btn");
      categoryButton.addEventListener("click", (event) =>
        filterWorks(event, category.id)
      );
      catFilters.appendChild(categoryButton);
    });

    console.log("Filtres de catégories chargés :", catFilters);
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories :", error);
  }
}

// Filtre les projets affichés selon la catégorie sélectionnée
function filterWorks(event, categoryId) {
  const figures = document.querySelectorAll(".gallery figure");
  const buttons = document.querySelectorAll(".filter-btn");

  // Gestion de l'état actif des boutons de filtrage
  buttons.forEach((button) => button.classList.remove("active"));
  event.currentTarget.classList.add("active");

  // Affiche ou masque les projets selon la catégorie
  figures.forEach((figure) => {
    const figureCategoryId = figure.dataset.categoryId;
    if (categoryId === "Tous" || figureCategoryId === categoryId.toString()) {
      figure.style.display = "block";
    } else {
      figure.style.display = "none";
    }
  });
}

// Crée la bannière d'édition pour les utilisateurs authentifiés
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

// Met à jour le bouton login/logout selon l'état de l'authentification
function updateLoginLogoutButton() {
  const loginButton = validateElement(
    document.getElementById("loginBtn"),
    "Login button"
  );

  const isAuthenticated = checkAuthState();
  if (isAuthenticated) {
    loginButton.textContent = "logout";
    loginButton.href = "login.html";
    loginButton.addEventListener("click", handleLogout);
  }
}

// Gère la déconnexion de l'utilisateur
function handleLogout(event) {
  event.preventDefault();
  localStorage.removeItem("token");
  window.location.href = "./html/login.html";
}

// Cache la barre de filtres pour les utilisateurs authentifiés
function hideFilterBar() {
  const token = localStorage.getItem("token");
  console.log("Token récupéré", "masquage de la barre de filtres");
  const filterBar = document.querySelector(".category-filters");

  if (filterBar) {
    filterBar.style.display = "none";
    console.log("La barre de filtres est cachée");
  }
}

// Ajoute le bouton modifier pour les utilisateurs authentifiés
function addButtonModifier() {
  if (!checkAuthState()) {
    console.log("Utilisateur non authentifié, bouton modifier ignoré");
    return;
  }

  const portfolioTitle = validateElement(
    document.querySelector("#portfolio h2"),
    "Portfolio title"
  );
  console.log("Titre du portfolio trouvé:", portfolioTitle);

  if (portfolioTitle) {
    // portfolioTitle.style.marginTop = "0";

    const modifierContainer = document.createElement("div");
    modifierContainer.classList.add("modifier-container");

    portfolioTitle.parentNode.insertBefore(modifierContainer, portfolioTitle);
    modifierContainer.appendChild(portfolioTitle);

    const modifierBtn = document.createElement("button");
    modifierBtn.classList.add("button");
    modifierBtn.classList.add("open-modal");
    console.log("Bouton de modification créé:");

    const href = document.createElement("a");
    href.classList.add("modifier-btn");
    href.href = "#modal1";
    href.textContent = "modifier";

    const icon = document.createElement("i");
    icon.classList.add("fa-regular", "fa-pen-to-square");

    modifierBtn.appendChild(icon);
    modifierBtn.appendChild(href);

    modifierContainer.appendChild(modifierBtn);

    console.log("Conteneur de modification créé:", modifierContainer);
  }
}

// Initialise l'application avec toutes les fonctionnalités nécessaires
// Gère également l'affichage des erreurs en cas de problème
function initializeApp() {
  try {
    getWorks();
    getCategories();

    if (checkAuthState()) {
      createEditionBanner();
      updateLoginLogoutButton();
      hideFilterBar();
      addButtonModifier();
    }
  } catch (error) {
    console.error("Échec de l'initialisation de l'application:", error);

    // Affichage d'une page d'erreur conviviale
    document.body.textContent = "";

    const errorContainer = document.createElement("div");
    errorContainer.className = "error-message";

    const title = document.createElement("h2");
    title.textContent = "Une erreur est survenue";

    const message = document.createElement("p");
    message.textContent = error.message;

    const reloadButton = document.createElement("button");
    reloadButton.textContent = "Recharger la page";
    reloadButton.addEventListener("click", () => window.location.reload());

    errorContainer.appendChild(title);
    errorContainer.appendChild(message);
    errorContainer.appendChild(reloadButton);
    document.body.appendChild(errorContainer);
  }
}

// Démarrage de l'application
initializeApp();
