async function getWorks() {
  const galleryElement = document.querySelector(".gallery");

  try {
    galleryElement.innerHTML = "<p>Chargement en cours...</p>";
    const response = await fetch("http://localhost:5678/api/works");
    if (!response.ok) {
      throw new Error("La réponse du réseau n'était pas correcte");
    }
    const worksData = await response.json();
    console.log('Données de "getWorks" récupérées :', worksData);

    if (!galleryElement) {
      throw new Error("Élément avec la classe gallery non trouvé");
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
    console.error("Erreur lors de la récupération des travaux :", error);
    galleryElement.innerHTML = `
      <div class="error-message">
        <p>Une erreur s'est produite: ${error.message}</p>
        <button onclick="getWorks()">Réessayer</button>
      </div>`;
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
    portfolioTitle.style.marginTop = "0";

    const modifierContainer = document.createElement("div");
    modifierContainer.classList.add("modifier-container");

    portfolioTitle.parentNode.insertBefore(modifierContainer, portfolioTitle);
    modifierContainer.appendChild(portfolioTitle);

    const modifierBtn = document.createElement("button");
    modifierBtn.classList.add("modifier-btn");
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

    modifierBtn.addEventListener("click", function () {
      const token = localStorage.getItem("token");

      if (token) {
        document.getElementById("modal1").style.display = "block";
      }
      console.log("Token récupéré:", "Mode édition activé");
    });
  }
}

createEditionBanner();
updateLoginLogoutButton();
hideFilterBar();
addButtonModifier();
