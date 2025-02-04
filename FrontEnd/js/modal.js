/****************************************
 * CONFIGURATION DE LA MODALE
 ****************************************/
// Éléments de la modale
const galleryModal = document.querySelector("#gallery-modal");
const uploadModal = document.querySelector("#upload-modal");

// Ajouter un écouteur d'événement pour empêcher la soumission du formulaire de fermer la modale
uploadModal.addEventListener("submit", (e) => {
  e.preventDefault();
});

// Boutons de la modale de galerie
const openGalleryBtn = document.querySelector(".open-modal");
const closeGalleryBtn = document.querySelector("#gallery-modal .close-modal");
const openUploadBtn = document.querySelector(".open-add-photo");

// Éléments de la modale d'upload
const uploadForm = document.querySelector("#upload-form");
const uploadArea = document.querySelector(".upload-area");
const photoInput = document.querySelector("#photo-input");
const titleInput = document.querySelector("#photo-title");
const categorySelect = document.querySelector("#photo-category");
const submitBtn = document.querySelector(".btn-submit");
const closeUploadBtn = document.querySelector("#upload-modal .close-modal");
const backToGalleryBtn = document.querySelector(".back-modal");

// Modèle de loader
const uploadAreaLoader = `<span class="loader"></span>`;

// État de la modale
let isModalOpen = false;

// Fonction pour ouvrir la modale
function openModal() {
  if (!isModalOpen) {
    isModalOpen = true;
    galleryModal.showModal();
    galleryModal.addEventListener("click", handleBackdropClick);
  }
}

// Fonction pour fermer la modale
function closeModal() {
  if (galleryModal.open) {
    galleryModal.classList.add("closing");
    galleryModal.classList.remove("closing");
    galleryModal.close();
    galleryModal.removeEventListener("click", handleBackdropClick);
  }
  if (uploadModal.open) {
    uploadModal.classList.add("closing");
    uploadModal.classList.remove("closing");
    uploadModal.close();
    uploadModal.removeEventListener("click", handleBackdropClick);
  }
  if (isModalOpen) {
    galleryModal.close();
    uploadModal.close();
  }
  isModalOpen = false;
  console.log("Modale fermée");
  resetUploadArea();
}

/* Affiche un message de notification à l'utilisateur */
function showNotification(message, type = "success") {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.innerText = message;
  document.body.appendChild(notification);

  // Afficher la notification
  setTimeout(() => {
    notification.classList.add("show");
  }, 100);

  // Masquer après 3 secondes
  setTimeout(() => {
    notification.classList.add("hide");
    notification.addEventListener("transitionend", () => {
      notification.remove();
    });
  }, 3000);
}

function handleBackdropClick(event) {
  if (event.target === galleryModal || event.target === uploadModal) {
    closeModal();
  }
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
      throw new Error(`Erreur HTTP ! statut : ${response.status}`);
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
    console.error("Erreur lors de l'affichage des travaux :", error);
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

  console.log("Début de la soumission du formulaire");
  submitBtn.disabled = true;
  submitBtn.setAttribute("aria-disabled", "true");
  submitBtn.title = "Veuillez remplir tous les champs requis";

  try {
    validateForm();
    console.log("Validation du formulaire réussie");

    const formData = new FormData();
    formData.append("image", photoInput.files[0]);
    formData.append("title", titleInput.value.trim());
    formData.append("category", categorySelect.value);

    console.log("Envoi des données du formulaire à l'API...");

    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Connexion requise");
    }

    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(
        response.status === 401 ? "Non autorisé" : "Erreur du serveur"
      );
    } else {
      showNotification();
    }

    const newWork = await response.json();
    addWorkToDOM(newWork);

    // Réinitialiser le formulaire sans fermer la modale
    resetForm();
    resetUploadArea();
    getWorks();
  } catch (error) {
    console.error("Erreur lors de l'envoi :", error);
    showNotification("Erreur lors de l'ajout du projet", "error");
  } finally {
    submitBtn.disabled = false;
    submitBtn.removeAttribute("aria-disabled");
    submitBtn.title = "";
    console.log("Soumission du formulaire terminée");
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
      throw new Error("Connexion requise");
    }

    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(
      `Statut de la réponse de suppression pour le travail ${id} :`,
      response.status
    );

    if (!response.ok) {
      throw new Error(`Erreur HTTP ! statut : ${response.status}`);
    }

    console.log(`Travail ${id} supprimé avec succès`);
    removeWorkFromDOM(id);
    showNotification("Projet supprimé avec succès");

    document.querySelector(".add-photo-modal").close();
    await getWorks();
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
    showNotification(
      `Erreur lors de la suppression : ${error.message}`,
      "error"
    );

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
  // Fermer uniquement si on clique explicitement sur le bouton de fermeture ou l'arrière-plan de la modale
  if (
    e.target.matches(".close-modal") ||
    (e.target === galleryModal && e.target === e.currentTarget) ||
    (e.target === uploadModal && e.target === e.currentTarget)
  ) {
    e.preventDefault();
    e.stopPropagation();
    closeModal();
  }
});

// Ouvrir la modale de galerie et afficher les travaux
if (openGalleryBtn) {
  openGalleryBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    console.log("Ouverture de la modale de galerie...");
    try {
      await displayGalleryWorks();
      console.log("Travaux de la galerie affichés avec succès");
      openModal();
    } catch (error) {
      console.error("Échec du chargement de la galerie :", error);
      alert("Une erreur est survenue lors du chargement de la galerie");
    }
  });
}

// Événements pour la modale d'upload
openUploadBtn.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("Ouverture de la modale d'upload...");
  galleryModal.close(); // Fermer uniquement la modale de galerie
  isModalOpen = true;
  uploadModal.showModal(); // Ouvrir la modale d'upload
});

backToGalleryBtn.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("Retour à la modale de galerie...");
  closeModal();
  openModal();
});

// Événement pour la soumission du formulaire d'upload
uploadForm.addEventListener("submit", async (e) => {
  console.log("Événement de soumission du formulaire détecté");

  try {
    // Ajouter un délai avant de traiter la soumission du formulaire
    uploadArea.innerHTML = `<span class="submit-loader"></span>`;
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await handleFormSubmission(e);
    // Afficher une notification de succès
    // showNotification("Projet ajouté avec succès");
  } catch (error) {
    console.error("Erreur lors de la soumission:", error);
  }
});

// Ajouter la fonctionnalité de prévisualisation d'image
photoInput.addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (file) {
    console.log("Fichier sélectionné :", file);
    const validFile = ["image/jpeg", "image/png"];
    if (!validFile.includes(file.type)) {
      console.log("Type de fichier non supporté :", file.type);
      uploadArea.innerHTML = `<div class="error" role="alert">Type de fichier non supporté. Utilisez JPG ou PNG.</div>`;
      return;
    }

    const maxSize = 4 * 1024 * 1024; // 4 Mo en octets
    if (file.size > maxSize) {
      console.log("Fichier trop volumineux :", file.size);
      uploadArea.innerHTML = `<div class="error" role="alert">L'image ne doit pas dépasser 4Mo</div>`;
      return;
    }

    console.log("Chargement de l'aperçu...");
    uploadArea.innerHTML = uploadAreaLoader;

    const reader = new FileReader();
    reader.onload = function (e) {
      console.log("Aperçu chargé avec succès");
      setTimeout(() => {
        uploadArea.innerHTML = `
          <img src="${e.target.result}" alt="Preview" class="upload-preview-image">
        `;
        isLoading = false;
      }, 1000);
    };

    reader.readAsDataURL(file);

    reader.onerror = function (error) {
      console.error("Erreur lors de la lecture du fichier :", error);
      uploadArea.innerHTML = `
        <div class="error" role="alert">
          Impossible de charger l'aperçu. Veuillez réessayer.
        </div>
      `;
      isLoading = false;
    };
  } else {
    isLoading = false;
  }
});

let isLoading = false;

uploadArea.addEventListener("click", function (e) {
  if (e.target === uploadArea || e.target.parentElement === uploadArea) {
    if (isLoading) return; // Empêcher les clics multiples pendant le chargement

    isLoading = true;
    const originalContent = uploadArea.innerHTML;
    uploadArea.innerHTML = uploadAreaLoader;

    photoInput.click();

    const handleFileSelect = () => {
      // Garder le loader si un fichier est sélectionné, originalContent sera remplacé par l'aperçu
      if (!photoInput.files.length) {
        isLoading = false;
        uploadArea.innerHTML = originalContent;
      }
      photoInput.removeEventListener("change", handleFileSelect);
      window.removeEventListener("focus", handleFocus);
    };

    const handleFocus = () => {
      setTimeout(() => {
        if (!photoInput.files.length) {
          isLoading = false;
          uploadArea.innerHTML = originalContent;
        }
        photoInput.removeEventListener("change", handleFileSelect);
        window.removeEventListener("focus", handleFocus);
      }, 300);
    };

    photoInput.addEventListener("change", handleFileSelect);
    window.addEventListener("focus", handleFocus);
  }
});

uploadModal.addEventListener("click", handleBackdropClick);
