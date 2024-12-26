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
openGalleryBtn.addEventListener("click", () => {
  galleryModal.showModal();
});

closeGalleryBtn.addEventListener("click", () => {
  galleryModal.close();
});

// Upload modal events
openUploadBtn.addEventListener("click", () => {
  galleryModal.close();
  uploadModal.showModal();
});

closeUploadBtn.addEventListener("click", () => {
  uploadModal.close();
});

backToGalleryBtn.addEventListener("click", () => {
  uploadModal.close();
  galleryModal.showModal();
});
