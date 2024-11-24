async function getWorks() {
  try {
    const response = await fetch("http://localhost:5678/api/works");

    if (!response.ok) {
      throw new Error("Erreur réseau : " + response.status);
    }

    const getWorksData = await response.json();
    console.log("Données récupérées :", getWorksData);

    const getWorksGallery = document.querySelector(".gallery");
    if (!getWorksGallery) {
      throw new Error('Element with class "gallery" not found');
    }

    getWorksGallery.innerHTML = "";

    getWorksData.forEach((work) => {
      const figure = document.createElement("figure");
      figure.dataset.categoryId = work.categoryId.toString();

      const img = document.createElement("img");
      img.src = work.imageUrl;
      img.alt = work.title;

      const figCaption = document.createElement("figcaption");
      figCaption.textContent = work.title;

      figure.appendChild(img);
      figure.appendChild(figCaption);

      getWorksGallery.appendChild(figure);
    });
    return getWorksData;
  } catch (error) {
    console.error("Il y a eu un problème avec la requête fetch :", error);
  }
}
getWorks();

async function getCategories() {
  try {
    const response = await fetch("http://localhost:5678/api/categories");

    if (!response.ok) {
      throw new Error("Erreur réseau : " + response.status);
    }

    const getCategoriesData = await response.json();
    console.log("Données récupérées :", getCategoriesData);

    return getCategoriesData;
  } catch (error) {
    console.error("Il y a eu un problème avec la requête fetch :", error);
  }
}
getCategories();

function createFilterButtons(categories) {
  const filterContainer = document.querySelector(".category");

  const btnTous = document.createElement("button");
  btnTous.textContent = "Tous";
  btnTous.classList.add("filter-btn", "active");
  filterContainer.appendChild(btnTous);

  categories.forEach((category) => {
    const bouton = document.createElement("button");
    bouton.textContent = category.name;
    bouton.classList.add("filter-btn");
    bouton.dataset.categoryId = category.id;
    filterContainer.appendChild(bouton);
  });

  const boutons = document.querySelectorAll(".filter-btn");
  boutons.forEach((bouton) => {
    bouton.addEventListener("click", (e) => {
      boutons.forEach((btn) => btn.classList.remove("active"));
      e.target.classList.add("active");

      const categoryId = e.target.dataset.categoryId;
      filterWorks(categoryId);
    });
  });
}

function filterWorks(categoryId) {
  const works = document.querySelectorAll(".gallery figure");

  if (!works.length) {
    console.error("No works found to filter");
    return;
  }

  works.forEach((work) => {
    if (!categoryId || work.dataset.categoryId === categoryId.toString()) {
      work.style.display = "block";
    } else {
      work.style.display = "none";
    }
  });
}

getCategories().then(createFilterButtons);
