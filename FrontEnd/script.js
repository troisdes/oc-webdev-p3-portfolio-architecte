async function getCategories () {
    try
    {
        const getCategories = await fetch("http://localhost:5678/api/categories");
        if (!getCategories.ok)
        {
            throw new Error('Erreur réseau : ' + getCategories.status);
        }
        const getCategoriesData = await getCategories.json();
        console.log('Données récupérées :', getCategoriesData);
    } catch (error)
    {
        console.error('Il y a eu un problème avec la requête fetch :', error);
    }
}

async function getWorks () {
    try
    {
        // Effectue une requête HTTP GET vers l'URL spécifiée
        const getWorks = await fetch("http://localhost:5678/api/works");

        // Vérifie si la réponse est correcte (status code 200-299)
        if (!getWorks.ok)
        {
            // Si la réponse n'est pas correcte, lance une erreur avec le status de la réponse
            throw new Error('Erreur réseau : ' + getWorks.status);
        }

        // Convertit la réponse en format JSON
        const getWorksData = await getWorks.json();
        console.log('Données récupérées :', getWorksData);
        // Mettre à jour l'interface avec les données

        // Sélectionne l'élément avec la classe "gallery" dans le DOM
        const getWorksGallery = document.querySelector(".gallery");
        // Vide le contenu actuel de la galerie
        getWorksGallery.innerHTML = "";

        // Parcourt chaque élément de données récupérées
        getWorksData.forEach(work => {
            // Crée un élément <figure>
            const figure = document.createElement("figure");
            // Crée un élément <img> et définit ses attributs src et alt
            const img = document.createElement("img");
            img.src = work.imageUrl;
            img.alt = work.title;
            // Crée un élément <figcaption> et définit son contenu texte
            const figCaption = document.createElement("figcaption");
            figCaption.textContent = work.title;

            // Ajoute l'image et la légende à la figure
            figure.appendChild(img);
            figure.appendChild(figCaption);
            // Ajoute la figure à la galerie
            getWorksGallery.appendChild(figure);
        });
    } catch (error)
    {
        // Affiche une erreur dans la console si la requête échoue
        console.error('Il y a eu un problème avec la requête fetch :', error);
        // Gérer l'erreur (par exemple, afficher un message à l'utilisateur)
    }
}

// Appelle la fonction pour récupérer et afficher les travaux
getWorks();
