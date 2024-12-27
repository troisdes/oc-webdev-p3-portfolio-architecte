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

// Gallery modal events
openGalleryBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  await displayGalleryWorks();
  galleryModal.showModal();
});

closeGalleryBtn.addEventListener("click", (e) => {
  e.preventDefault();
  galleryModal.close();
});

// Upload modal events
openUploadBtn.addEventListener("click", (e) => {
  e.preventDefault();
  galleryModal.close();
  uploadModal.showModal();
});

closeUploadBtn.addEventListener("click", (e) => {
  e.preventDefault();
  uploadModal.close();
});

backToGalleryBtn.addEventListener("click", (e) => {
  e.preventDefault();
  uploadModal.close();
  galleryModal.showModal();
});

galleryModal.addEventListener("click", (e) => {
  if (e.target === galleryModal) {
    galleryModal.close();
  }
});

uploadModal.addEventListener("click", (e) => {
  if (e.target === uploadModal) {
    uploadModal.close();
  }
});

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

      figure.appendChild(img);
      figure.appendChild(deleteBtn);
      galleryGrid.appendChild(figure);
    });
  } catch (error) {
    console.error("Error displaying works:", error);
  }
}
