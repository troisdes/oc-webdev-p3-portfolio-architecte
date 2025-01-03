// Éléments de la modale
const galleryModal = document.querySelector("#gallery-modal");
const uploadModal = document.querySelector("#upload-modal");

// Ajouter ces éléments après les déclarations de modal
const uploadForm = document.querySelector("#upload-form");
const photoInput = document.querySelector("#photo-input");
const titleInput = document.querySelector("#photo-title");
const categorySelect = document.querySelector("#photo-category");
const submitBtn = document.querySelector(".btn-submit");

// Boutons de la modale de galerie
const openGalleryBtn = document.querySelector(".open-modal");
const closeGalleryBtn = document.querySelector("#gallery-modal .close-modal");
const openUploadBtn = document.querySelector(".open-add-photo");

// Boutons de la modale d'upload
const closeUploadBtn = document.querySelector("#upload-modal .close-modal");
const backToGalleryBtn = document.querySelector(".back-modal");

let isModalOpen = false;

// Fonction pour ouvrir la modale
function openModal() {
  if (!isModalOpen) {
    isModalOpen = true;
    galleryModal.showModal();
  }
}

// Fonction pour fermer la modale
function closeModal() {
  isModalOpen = false;
  galleryModal.close();
  uploadModal.close();
}

// Événement pour fermer la modale en cliquant à l'extérieur ou sur le bouton de fermeture
document.addEventListener("click", (e) => {
  if (
    e.target.matches(".close-modal") ||
    e.target === galleryModal ||
    e.target === uploadModal
  ) {
    closeModal();
  }
});

// Ouvrir la modale de galerie et afficher les travaux
openGalleryBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  await displayGalleryWorks();
  openModal();
});

// Événements pour la modale d'upload
openUploadBtn.addEventListener("click", (e) => {
  e.preventDefault();
  closeModal();
  uploadModal.showModal();
});

backToGalleryBtn.addEventListener("click", (e) => {
  e.preventDefault();
  closeModal();
  openModal();
});

// Ajouter la fonctionnalité de prévisualisation d'image
photoInput.addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const uploadArea = document.querySelector(".upload-area");
      uploadArea.innerHTML = `
        <img src="${e.target.result}" alt="Preview" style="max-height: 100%; max-width: 100%; object-fit: contain;">
      `;
    };
    reader.readAsDataURL(file);
  }
});

// Validation du formulaire
function validateForm() {
  const file = photoInput.files[0];
  const title = titleInput.value.trim();
  const category = categorySelect.value;

  if (!file) {
    alert("Veuillez sélectionner une image");
    throw new Error("Veuillez sélectionner une image");
  }
  if (!title) {
    alert("Veuillez entrer un titre");
    throw new Error("Veuillez entrer un titre");
  }
  if (category === "0") {
    alert("Veuillez sélectionner une catégorie");
    throw new Error("Veuillez sélectionner une catégorie");
  }

  if (file.size > 4 * 1024 * 1024) {
    alert("L'image ne doit pas dépasser 4Mo");
    throw new Error("L'image ne doit pas dépasser 4Mo");
  }
}

// Gestion de la soumission du formulaire
async function handleFormSubmission(e) {
  e.preventDefault();
  submitBtn.disabled = true;

  try {
    validateForm();

    const formData = new FormData();
    formData.append("image", photoInput.files[0]);
    formData.append("title", titleInput.value.trim());
    formData.append("category", categorySelect.value);

    const token = localStorage.getItem("token");
    if (!token) throw new Error("Authentication required");

    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized: Please log in again.");
      } else if (response.status === 500) {
        throw new Error("Server error: Please try again later.");
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }

    const newWork = await response.json();

    addWorkToDOM(newWork);

    const notification = document.createElement("div");
    notification.classList.add("notification", "success");
    notification.textContent = "Projet ajouté avec succès";
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);

    uploadForm.reset();
    closeModal();
  } catch (error) {
    console.error("Error uploading work:", error);
    alert(error.message || "Erreur lors de l'ajout du projet");
  } finally {
    submitBtn.disabled = false;
  }
}

// Événement pour la soumission du formulaire d'upload
uploadForm.addEventListener("submit", handleFormSubmission);

// Supprimer un travail du DOM (modal et galerie principale)
function removeWorkFromDOM(id) {
  // Supprimer de la galerie de la modal
  const modalItem = document.querySelector(`.gallery-item[data-id="${id}"]`);
  if (modalItem) modalItem.remove();

  // Supprimer de la galerie principale
  const mainItem = document.querySelector(
    `#main-gallery figure[data-id="${id}"]`
  );
  if (mainItem) mainItem.remove();
}

// Mettre à jour la fonction deleteWork
async function deleteWork(id) {
  try {
    const deleteBtn = document.querySelector(`button[data-id="${id}"]`);
    if (deleteBtn) {
      deleteBtn.disabled = true; // Empêcher les doubles clics
      deleteBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
    }

    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    removeWorkFromDOM(id);

    // Afficher une notification de succès
    const notification = document.createElement("div");
    notification.classList.add("notification", "success");
    notification.textContent = "Projet supprimé avec succès";
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  } catch (error) {
    console.error("Error deleting work:", error);
    alert("Erreur lors de la suppression");

    // Réactiver le bouton en cas d'erreur
    const deleteBtn = document.querySelector(`button[data-id="${id}"]`);
    if (deleteBtn) {
      deleteBtn.disabled = false;
      deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    }
  }
}

// Peupler la modal de galerie et ajouter le bouton de suppression
async function displayGalleryWorks() {
  try {
    const galleryGrid = document.querySelector("#gallery-grid");
    const response = await fetch("http://localhost:5678/api/works");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const works = await response.json();
    galleryGrid.innerHTML = "";

    works.forEach((work) => {
      const figure = document.createElement("figure");
      figure.classList.add("gallery-item");
      figure.dataset.id = work.id; // Ajouter cette ligne

      const img = document.createElement("img");
      img.src = work.imageUrl;
      img.alt = work.title;

      const deleteBtn = document.createElement("button");
      deleteBtn.classList.add("delete-btn");
      deleteBtn.setAttribute("data-id", work.id);
      deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';

      // Ajouter un gestionnaire de clic pour le bouton de suppression
      deleteBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        if (confirm("Voulez-vous vraiment supprimer cet élément ?")) {
          await deleteWork(work.id);
        }
      });

      figure.appendChild(img);
      figure.appendChild(deleteBtn);
      galleryGrid.appendChild(figure);
    });
  } catch (error) {
    console.error("Error displaying works:", error);
    galleryGrid.innerHTML =
      '<p class="error">Erreur lors du chargement des travaux</p>';
  }
}

// Mettre à jour les galeries (modal et principale) avec un nouveau travail
function addWorkToDOM(work) {
  // Mettre à jour la galerie principale
  const mainGallery = document.querySelector("#main-gallery");
  if (mainGallery) {
    const figure = document.createElement("figure");
    figure.dataset.id = work.id;
    figure.dataset.categoryId = work.categoryId; // Ajouter categoryId

    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    const figcaption = document.createElement("figcaption");
    figcaption.textContent = work.title;

    figure.appendChild(img);
    figure.appendChild(figcaption);
    mainGallery.appendChild(figure);
  }

  // Mettre à jour la galerie de la modal
  const modalGallery = document.querySelector("#gallery-grid");
  if (modalGallery) {
    const figure = document.createElement("figure");
    figure.classList.add("gallery-item");
    figure.dataset.id = work.id;
    figure.dataset.categoryId = work.categoryId; // Ajouter categoryId

    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.setAttribute("data-id", work.id);
    deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';

    deleteBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      if (confirm("Voulez-vous vraiment supprimer cet élément ?")) {
        await deleteWork(work.id);
      }
    });

    figure.appendChild(img);
    figure.appendChild(deleteBtn);
    modalGallery.appendChild(figure);
  }
}
