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
        const newWork = await response.json();
        // Dynamically update both galleries
        updateMainGallery([newWork]);
        updateModalGallery([newWork]);

        document.querySelector("#upload-modal").classList.remove("active");
        document.querySelector("#gallery-modal").classList.add("active");
      } else {
        // Handle error response
        const errorData = await response.json();
        console.error("Error uploading photo:", errorData.message);
        alert("Error uploading photo: " + errorData.message);
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
      alert("Error uploading photo: " + error.message);
    }
  });
}

async function fetchWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  currentWorks = await response.json();
  return currentWorks;
}

async function refreshGalleries() {
  const works = await fetchWorks();
  updateMainGallery(works);
  updateModalGallery(works);
}

function updateMainGallery(works) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";
  works.forEach((work) => createWorkElement(work, gallery));
}

function updateModalGallery(works) {
  const modalGallery = document.querySelector("#modal-gallery");
  if (!modalGallery) return;
  modalGallery.innerHTML = "";
  works.forEach((work) => createModalWorkElement(work, modalGallery));
}

async function deleteWork(id) {
  try {
    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (response.ok) {
      await refreshGalleries();
    }
  } catch (error) {
    console.error("Delete failed:", error);
  }
}

function initializeUploadForm() {
  const form = document.querySelector("#upload-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    try {
      const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });
      if (response.ok) {
        await refreshGalleries();
        closeUploadModal();
      }
    } catch (error) {
      console.error("Upload failed:", error);
    }
  });
}

toggleModal();
switchModal();
uploadPhotoModal();
fetchWorks();
initializeUploadForm();
