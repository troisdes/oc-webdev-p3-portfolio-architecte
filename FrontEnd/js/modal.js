// Modal elements
const galleryModal = document.querySelector("#gallery-modal");
const uploadModal = document.querySelector("#upload-modal");

// Add these after modal declarations
const uploadForm = document.querySelector("#upload-form");
const photoInput = document.querySelector("#photo-input");
const titleInput = document.querySelector("#photo-title");
const categorySelect = document.querySelector("#photo-category");
const submitBtn = document.querySelector(".btn-submit");

// Gallery modal buttons
const openGalleryBtn = document.querySelector(".open-modal");
const closeGalleryBtn = document.querySelector("#gallery-modal .close-modal");
const openUploadBtn = document.querySelector(".open-add-photo");

// Upload modal buttons
const closeUploadBtn = document.querySelector("#upload-modal .close-modal");
const backToGalleryBtn = document.querySelector(".back-modal");

let isModalOpen = false;

function openModal() {
  if (!isModalOpen) {
    isModalOpen = true;
    galleryModal.showModal();
  }
}

function closeModal() {
  isModalOpen = false;
  galleryModal.close();
  uploadModal.close();
}

// Gallery modal events
openGalleryBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  await displayGalleryWorks();
  openModal();
});

closeGalleryBtn.addEventListener("click", (e) => {
  e.preventDefault();
  closeModal();
});

// Upload modal events
openUploadBtn.addEventListener("click", (e) => {
  e.preventDefault();
  closeModal();
  uploadModal.showModal();
});

closeUploadBtn.addEventListener("click", (e) => {
  e.preventDefault();
  closeModal();
});

backToGalleryBtn.addEventListener("click", (e) => {
  e.preventDefault();
  closeModal();
  openModal();
});

galleryModal.addEventListener("click", (e) => {
  if (e.target === galleryModal) {
    closeModal();
  }
});

uploadModal.addEventListener("click", (e) => {
  if (e.target === uploadModal) {
    closeModal();
  }
});

// Add image preview functionality
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

// Form validation
function validateForm() {
  const file = photoInput.files[0];
  const title = titleInput.value.trim();
  const category = categorySelect.value;

  if (!file) {
    throw new Error("Veuillez sélectionner une image");
  }
  if (!title) {
    throw new Error("Veuillez entrer un titre");
  }
  if (category === "0") {
    throw new Error("Veuillez sélectionner une catégorie");
  }

  if (file.size > 4 * 1024 * 1024) {
    // 4MB limit
    throw new Error("L'image ne doit pas dépasser 4Mo");
  }
}

// Handle form submission
uploadForm.addEventListener("submit", async function (e) {
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
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const newWork = await response.json();

    // Add new work directly to DOM
    addWorkToDOM(newWork);

    // Show success notification
    const notification = document.createElement("div");
    notification.classList.add("notification", "success");
    notification.textContent = "Projet ajouté avec succès";
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);

    // Reset form and close modal
    uploadForm.reset();
    closeModal();
  } catch (error) {
    console.error("Error uploading work:", error);
    alert(error.message || "Erreur lors de l'ajout du projet");
  } finally {
    submitBtn.disabled = false;
  }
});

/**
 * Removes a work from both modal and main galleries
 * @param {string|number} id Work ID to remove
 */
function removeWorkFromDOM(id) {
  // Remove from modal gallery
  const modalItem = document.querySelector(`.gallery-item[data-id="${id}"]`);
  if (modalItem) modalItem.remove();

  // Remove from main gallery
  const mainItem = document.querySelector(
    `#main-gallery figure[data-id="${id}"]`
  );
  if (mainItem) mainItem.remove();
}

// Update deleteWork function
async function deleteWork(id) {
  try {
    const deleteBtn = document.querySelector(`button[data-id="${id}"]`);
    if (deleteBtn) {
      deleteBtn.disabled = true; // Prevent double-clicks
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

    // Show success notification
    const notification = document.createElement("div");
    notification.classList.add("notification", "success");
    notification.textContent = "Projet supprimé avec succès";
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  } catch (error) {
    console.error("Error deleting work:", error);
    alert("Erreur lors de la suppression");

    // Re-enable button if error
    const deleteBtn = document.querySelector(`button[data-id="${id}"]`);
    if (deleteBtn) {
      deleteBtn.disabled = false;
      deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    }
  }
}

// Populate Gallery modal and add delete button
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
      figure.dataset.id = work.id; // Add this line

      const img = document.createElement("img");
      img.src = work.imageUrl;
      img.alt = work.title;

      const deleteBtn = document.createElement("button");
      deleteBtn.classList.add("delete-btn");
      deleteBtn.setAttribute("data-id", work.id);
      deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';

      // Add click handler for delete button
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

/**
 * Updates both modal and main galleries with new work
 * @param {Object} work - The new work object from API
 */
function addWorkToDOM(work) {
  // Update main gallery
  const mainGallery = document.querySelector("#main-gallery");
  if (mainGallery) {
    const figure = document.createElement("figure");
    figure.dataset.id = work.id;

    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    const figcaption = document.createElement("figcaption");
    figcaption.textContent = work.title;

    figure.appendChild(img);
    figure.appendChild(figcaption);
    mainGallery.appendChild(figure);
  }

  // Update modal gallery
  const modalGallery = document.querySelector("#gallery-grid");
  if (modalGallery) {
    const figure = document.createElement("figure");
    figure.classList.add("gallery-item");
    figure.dataset.id = work.id;

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
