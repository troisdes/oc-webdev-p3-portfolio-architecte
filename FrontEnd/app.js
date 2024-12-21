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

createEditionBanner();
updateLoginLogoutButton();
hideFilterBar();
addButtonModifier();

// Helper function to safely create DOM elements
function createElement(type, attributes = {}, children = []) {
  const element = document.createElement(type);

  for (const [key, value] of Object.entries(attributes)) {
    if (key === "className") {
      element.className = value;
    } else if (key === "textContent") {
      element.textContent = value;
    } else {
      element.setAttribute(key, value);
    }
  }

  children.forEach((child) => {
    if (typeof child === "string") {
      element.appendChild(document.createTextNode(child));
    } else {
      element.appendChild(child);
    }
  });

  return element;
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function populateModalGallery(works) {
  const modalGallery = document.getElementById("modal-gallery");
  clearElement(modalGallery);

  works.forEach((work) => {
    const img = createElement("img", {
      src: work.imageUrl,
      alt: work.title,
    });

    const deleteIcon = createElement("i", {
      className: "fa-solid fa-trash-can",
    });

    const deleteBtn = createElement(
      "button",
      {
        className: "delete-btn",
        "data-id": work.id,
      },
      [deleteIcon]
    );

    const figure = createElement(
      "figure",
      {
        className: "gallery-item",
      },
      [img, deleteBtn]
    );

    modalGallery.appendChild(figure);
  });

  attachDeleteListeners();
}

let deletedWorks = []; // Store deleted works for potential revert

function attachDeleteListeners() {
  const deleteButtons = document.querySelectorAll(".delete-btn");

  deleteButtons.forEach((button) => {
    button.addEventListener("click", async (e) => {
      e.preventDefault();

      if (!confirm("Are you sure you want to delete this work?")) {
        return;
      }

      const workId = button.getAttribute("data-id");
      const figure = button.closest("figure");

      try {
        const response = await fetch(
          `http://localhost:5678/api/works/${workId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.ok) {
          // Store the deleted work
          const deletedWork = {
            id: workId,
            element: figure.cloneNode(true),
          };
          deletedWorks.push(deletedWork);

          // Remove from both galleries
          figure.remove();
          const mainGalleryItem = document.querySelector(
            `.gallery figure[data-category-id="${workId}"]`
          );
          if (mainGalleryItem) mainGalleryItem.remove();

          // Add revert button if not exists
          addRevertButton();
        }
      } catch (error) {
        console.error("Error deleting work:", error);
      }
    });
  });
}

function addRevertButton() {
  if (!document.querySelector(".revert-btn")) {
    const revertBtn = createElement("button", {
      className: "revert-btn",
      textContent: "Undo Delete",
    });

    revertBtn.addEventListener("click", async () => {
      if (deletedWorks.length === 0) return;

      const lastDeleted = deletedWorks.pop();
      const modalGallery = document.getElementById("modal-gallery");
      modalGallery.appendChild(lastDeleted.element);

      // Refresh main gallery
      const worksResponse = await fetch("http://localhost:5678/api/works");
      const works = await worksResponse.json();
      getWorks();

      if (deletedWorks.length === 0) {
        revertBtn.remove();
      }
    });

    document.querySelector(".modal-gallery-container").appendChild(revertBtn);
  }
}

function toggleModal() {
  const modalContainer = document.querySelector(".modal-container");
  const modalTriggers = document.querySelectorAll(".modal-trigger");

  modalTriggers.forEach((trigger) => {
    trigger.addEventListener("click", async () => {
      modalContainer.classList.toggle("active");
      if (modalContainer.classList.contains("active")) {
        // Fetch works data and populate gallery when modal opens
        const response = await fetch("http://localhost:5678/api/works");
        const works = await response.json();
        populateModalGallery(works);
      }
    });
  });
}

function switchModal() {
  const galleryModal = document.querySelector("#gallery-modal");
  const uploadModal = document.querySelector("#upload-modal");
  const addPhotoBtn = document.querySelector(".btn-add-photo");
  const backModalBtn = document.querySelector(".back-modal");
  const closeModalBtn = document.querySelectorAll(".close-modal");
  const overlays = document.querySelectorAll(".overlay");

  // Add overlay click handlers
  overlays.forEach((overlay) => {
    overlay.addEventListener("click", () => {
      galleryModal.classList.remove("active");
      uploadModal.classList.remove("active");
    });
  });

  addPhotoBtn.addEventListener("click", () => {
    galleryModal.classList.remove("active");
    uploadModal.classList.add("active");
  });

  backModalBtn.addEventListener("click", () => {
    uploadModal.classList.remove("active");
    galleryModal.classList.add("active");
  });

  closeModalBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
      galleryModal.classList.remove("active");
      uploadModal.classList.remove("active");
    });
  });
}

function uploadPhotoModal() {
  const uploadForm = document.getElementById("upload-form");

  uploadForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(uploadForm);
    try {
      const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (response.ok) {
        document.querySelector("#upload-modal").classList.remove("active");
        document.querySelector("#gallery-modal").classList.add("active");
        // Refresh gallery
        const works = await fetchWorks();
        populateModalGallery(works);
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
    }
  });
}

async function fetchWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  const works = await response.json();
  return works;
}

toggleModal();
switchModal();
uploadPhotoModal();
fetchWorks();
