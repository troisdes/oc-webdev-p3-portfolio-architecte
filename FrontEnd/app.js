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

function createModal1() {
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

  const separator = document.createElement("div");
  separator.classList.add("modal-separator");
  galleryContainer.appendChild(separator);

  const addPhotoBtn = document.createElement("button");
  addPhotoBtn.classList.add("add-photo-btn");
  addPhotoBtn.textContent = "Ajouter une photo";
  separator.appendChild(addPhotoBtn);

  addPhotoBtn.addEventListener("click", () => {
    const modal1 = document.getElementById("modal1");
    modal1.style.display = "none";

    const modal2 = document.getElementById("modal2");
    modal2.style.display = "flex";
  });

  document.body.appendChild(modal);
}

function createModal2() {
  const modal = document.createElement("aside");
  modal.id = "modal2";
  modal.classList.add("modal");

  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");
  modal.appendChild(modalContent);

  const backBtn = document.createElement("button");
  backBtn.classList.add("close-btn", "back-btn");
  backBtn.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';
  backBtn.addEventListener("click", () => {
    switchModal("modal2", "modal1");
  });
  modalContent.appendChild(backBtn);

  const closeBtn = document.createElement("button");
  closeBtn.classList.add("close-btn");
  closeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });
  modalContent.appendChild(closeBtn);

  const modalHeader = document.createElement("header");
  modalHeader.classList.add("modal-header");
  modalHeader.innerHTML = "<h2>Ajout photo</h2>";
  modalContent.appendChild(modalHeader);

  const formContainer = document.createElement("div");
  formContainer.classList.add("modal-gallery-box");
  modalContent.appendChild(formContainer);

  const uploadForm = document.createElement("form");
  uploadForm.classList.add("modal-upload-form");
  formContainer.appendChild(uploadForm);

  const uploadPreview = document.createElement("div");
  uploadPreview.classList.add("upload-preview");
  formContainer.appendChild(uploadPreview);

  const previewIcon = document.createElement("i");
  previewIcon.classList.add("fa-regular", "fa-image");
  uploadPreview.appendChild(previewIcon);

  const previewLabel = document.createElement("label");
  previewLabel.htmlFor = "photoInput";
  previewLabel.classList.add("upload-label");
  previewLabel.textContent = "+ Ajouter photo";
  uploadPreview.appendChild(previewLabel);

  const photoInput = document.createElement("input");
  photoInput.type = "file";
  photoInput.id = "photoInput";
  photoInput.accept = "image/*";
  photoInput.name = "photoInput";
  photoInput.textContent = "jpg, png : 4mo max";
  uploadPreview.appendChild(photoInput);

  const formLabel = document.createElement("label");
  formLabel.textContent = "Titre";
  uploadForm.appendChild(formLabel);

  const formInput = document.createElement("input");
  formInput.type = "text";
  formInput.id = "photoTitle";
  formInput.name = "photoTitle";
  formInput.required = true;
  uploadForm.appendChild(formInput);

  const formCategory = document.createElement("label");
  formCategory.htmlFor = "photoCategory";
  formCategory.textContent = "Catégorie";
  uploadForm.appendChild(formCategory);
  const formSelect = document.createElement("select");
  formSelect.id = "photoCategory";
  formSelect.name = "photoCategory";
  formSelect.required = true;
  uploadForm.appendChild(formSelect);

  const formOption = document.createElement("option");
  formOption.value = "";
  formOption.textContent = "Sélectionner une catégorie";
  formSelect.appendChild(formOption);

  fetch("http://localhost:5678/api/categories")
    .then((response) => response.json())
    .then((categories) => {
      categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        formSelect.appendChild(option);
      });
    });

  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.classList.add("add-photo-btn");
  submitBtn.textContent = "Valider";
  formContainer.appendChild(submitBtn);

  document.body.appendChild(modal);
}

function switchModal(currentModalId, nextModalId) {
  const currentModal = document.getElementById(currentModalId);
  const nextModal = document.getElementById(nextModalId);

  if (currentModal && nextModal) {
    currentModal.style.display = "none";
    nextModal.style.display = "flex";
  } else {
    console.error(`Modal ${currentModalId} or ${nextModalId} not found`);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("token");
  console.log("Token récupéré:", "Mode édition activé");

  if (token) {
    createEditionBanner();
    updateLoginLogoutButton();
    hideFilterBar();
    addButtonModifier();
    createModal1();
    createModal2();

    const addPhotoBtn = document.querySelector(".add-photo-btn");
    if (addPhotoBtn) {
      addPhotoBtn.addEventListener("click", function () {
        try {
          console.log("Add photo button clicked");
          const modal1 = document.querySelector("#modal1");
          const modal2 = document.querySelector("#modal2");

          if (!modal2) {
            console.error("Modal2 not found in DOM");
            return;
          }

          modal1.style.display = "none";
          modal2.style.display = "flex";
          console.log("Modal2 should be visible now");
        } catch (error) {
          console.error("Error switching modals:", error);
        }
      });
    } else {
      console.error("Add photo button not found");
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  createModal1();
  createModal2();
});
