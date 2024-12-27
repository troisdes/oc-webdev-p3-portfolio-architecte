// Modal elements
const galleryModal = document.querySelector("#gallery-modal");
const uploadModal = document.querySelector("#upload-modal");

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

// Delete work handler
async function deleteWork(id) {
  try {
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

    // Refresh both galleries
    await displayGalleryWorks();
    await getWorks(); // Refresh main gallery
  } catch (error) {
    console.error("Error deleting work:", error);
    alert("Erreur lors de la suppression");
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
