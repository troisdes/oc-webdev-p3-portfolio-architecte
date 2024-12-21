function validateElement(element, name) {
  if (!element) {
    throw new Error(`${name} élément absent du DOM`);
  }
  return element;
}

function checkAuthState() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.log("Pas de token trouvé");
    return false;
  }
  return true;
}

async function getWorks() {
  const galleryElement = validateElement(
    document.querySelector(".gallery"),
    "Gallery"
  );

  try {
    galleryElement.innerHTML = "";
    const loadingDiv = document.createElement("div");
    loadingDiv.className = "loading";
    const loadingText = document.createElement("p");
    loadingText.textContent = "Chargement en cours...";
    loadingDiv.appendChild(loadingText);
    galleryElement.innerHTML = "";
    galleryElement.appendChild(loadingDiv);
    const response = await fetch("http://localhost:5678/api/works");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const worksData = await response.json();
    console.log('Données de "getWorks" récupérées :', worksData);

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
    console.error("Erreur lors de la récupération des travaux :", error);

    // Clear existing content
    galleryElement.textContent = "";

    // Create error message container
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";

    // Create error text
    const errorText = document.createElement("p");
    errorText.textContent = `Une erreur s'est produite: ${error.message}`;

    // Create retry button
    const retryButton = document.createElement("button");
    retryButton.textContent = "Réessayer";
    retryButton.onclick = getWorks;

    // Build structure
    errorDiv.appendChild(errorText);
    errorDiv.appendChild(retryButton);
    galleryElement.appendChild(errorDiv);
  }
}

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

    const allWorksButton = document.createElement("button");
    allWorksButton.textContent = "Tous";
    allWorksButton.classList.add("filter-btn", "active");
    allWorksButton.addEventListener("click", (event) =>
      filterWorks(event, "Tous")
    );
    catFilters.appendChild(allWorksButton);

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

function filterWorks(event, categoryId) {
  const figures = document.querySelectorAll(".gallery figure");
  const buttons = document.querySelectorAll(".filter-btn");

  buttons.forEach((button) => button.classList.remove("active"));
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

// Modify updateLoginLogoutButton()
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

function handleLogout() {
  localStorage.removeItem("token");
  window.location.reload();
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

// Modify addButtonModifier()
function addButtonModifier() {
  if (!checkAuthState()) {
    console.log("User not authenticated, skipping modifier button");
    return;
  }

  const portfolioTitle = validateElement(
    document.querySelector("#portfolio h2"),
    "Portfolio title"
  );
  console.log("Titre du portfolio trouvé:", portfolioTitle);

  if (portfolioTitle) {
    portfolioTitle.style.marginTop = "0";

    const modifierContainer = document.createElement("div");
    modifierContainer.classList.add("modifier-container");

    portfolioTitle.parentNode.insertBefore(modifierContainer, portfolioTitle);
    modifierContainer.appendChild(portfolioTitle);

    const modifierBtn = document.createElement("button");
    modifierBtn.classList.add("modifier-btn");
    modifierBtn.classList.add("modal-trigger");
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

// Add initialization wrapper
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
    console.error("Application initialization failed:", error);

    // Clear existing content
    document.body.textContent = "";

    // Create error container
    const errorContainer = document.createElement("div");
    errorContainer.className = "error-message";

    // Create title
    const title = document.createElement("h2");
    title.textContent = "Une erreur est survenue";

    // Create message
    const message = document.createElement("p");
    message.textContent = error.message;

    // Create reload button
    const reloadButton = document.createElement("button");
    reloadButton.textContent = "Recharger la page";
    reloadButton.addEventListener("click", () => window.location.reload());

    // Build structure
    errorContainer.appendChild(title);
    errorContainer.appendChild(message);
    errorContainer.appendChild(reloadButton);
    document.body.appendChild(errorContainer);
  }
}

// Replace individual calls with single initialization
initializeApp();
