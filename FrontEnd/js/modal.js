/****************************************
 * CONFIGURATION DE LA MODALE
 ****************************************/
// Éléments principaux des modales
const galleryModal = document.querySelector("#gallery-modal");
const uploadModal = document.querySelector("#upload-modal");

// Ajouter ces éléments après les déclarations de modal
const uploadForm = document.querySelector("#upload-form");
const uploadArea = document.querySelector(".upload-area");
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
  resetUploadArea();
}

/****************************************
 * GESTION DE LA GALERIE
 * - Affichage des travaux
 * - Suppression des éléments
 * - Mise à jour du DOM
 ****************************************/
// Affichage des travaux dans la galerie
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

/****************************************
 * GESTION DU FORMULAIRE
 * - Réinitialisation
 * - Validation
 * - Soumission
 ****************************************/
// Fonction de réinitialisation du formulaire
function resetUploadArea() {
  // Restaurer le contenu original de la zone d'upload
  uploadArea.innerHTML = `
    <i class="far fa-image"></i>
    <label for="photo-input" class="btn-upload">+ Ajouter photo</label>
    <input type="file" id="photo-input" name="photo" accept="image/*" required>
    <p class="upload-info">jpg, png : 4mo max</p>
  `;

  uploadForm.reset();
}

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
      throw new Error(
        response.status === 401 ? "Unauthorized" : "Server error"
      );
    }

    const newWork = await response.json();

    addWorkToDOM(newWork);

    uploadForm.reset();
    closeModal();
  } catch (error) {
    console.error("Erreur lors de l'envoi:", error);
    alert(error.message || "Erreur lors de l'ajout du projet");
  } finally {
    submitBtn.disabled = false;
  }
}

/****************************************
 * APPELS API
 * - Suppression des travaux
 * - Gestion des erreurs
 ****************************************/
// Mettre à jour la fonction deleteWork
async function deleteWork(id) {
  try {
    const deleteBtn = document.querySelector(`button[data-id="${id}"]`);
    if (deleteBtn) {
      deleteBtn.disabled = true; // Éviter les doubles clics
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
    console.error("Erreur lors de la suppression:", error);
    alert("Erreur lors de la suppression");

    // Réactiver le bouton en cas d'erreur
    const deleteBtn = document.querySelector(`button[data-id="${id}"]`);
    if (deleteBtn) {
      deleteBtn.disabled = false;
      deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    }
  }
}

/****************************************
 * ÉCOUTEURS D'ÉVÉNEMENTS
 * - Gestion des modales
 * - Gestion des formulaires
 * - Prévisualisation des images
 ****************************************/
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
  try {
    await displayGalleryWorks();
    openModal();
  } catch (error) {
    console.error("Échec du chargement de la galerie:", error);
    alert("Une erreur est survenue lors du chargement de la galerie");
  }
});

// Événements pour la modale d'upload
openUploadBtn.addEventListener("click", (e) => {
  e.preventDefault();
  galleryModal.close(); // Fermer uniquement la modale de galerie
  isModalOpen = true;
  uploadModal.showModal(); // Ouvrir la modale d'upload
});

backToGalleryBtn.addEventListener("click", (e) => {
  e.preventDefault();
  closeModal();
  openModal();
});

// Événement pour la soumission du formulaire d'upload
uploadForm.addEventListener("submit", handleFormSubmission);

// Ajouter la fonctionnalité de prévisualisation d'image
photoInput.addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (file) {
    const validFile = ["image/jpeg", "image/png"];
    if (!validFile.includes(file.type)) {
      uploadArea.innerHTML = `<div class="error" role="alert">Type de fichier non supporté. Utilisez JPG ou PNG.</div>`;
      return;
    }

    const maxSize = 4 * 1024 * 1024; // 4MB in bytes
    if (file.size > maxSize) {
      uploadArea.innerHTML = `<div class="error" role="alert">L'image ne doit pas dépasser 4Mo</div>`;
      return;
    }

    uploadArea.innerHTML = `
    <div class="loader" role="status" aria-label="Chargement de l'aperçu">
      <span class="loader-spinner"></span>
    </div>
  `;
    const reader = new FileReader();
    reader.onload = function (e) {
      setTimeout(() => {
        uploadArea.innerHTML = `
        <img src="${e.target.result}" alt="Preview" class="upload-preview-image">
      `;
      }, 2000);
    };

    reader.readAsDataURL(file);

    reader.onerror = function (error) {
      console.error("Error reading file:", error);
      uploadArea.innerHTML = `
        <div class="error" role="alert">
          Impossible de charger l'aperçu. Veuillez réessayer.
        </div>
      `;
    };
  }
});
