async function getWorks () {
    try
    {
        const response = await fetch("http://localhost:5678/api/works");
        if (!response.ok)
        {
            throw new Error('Erreur réseau : ' + response.status);
        }
        const data = await response.json();
        console.log('Données récupérées :', data);
        // Mettre à jour l'interface avec les données

        const gallery = document.querySelector(".gallery");
        gallery.innerHTML = "";

        data.forEach(work => {
            const figure = document.createElement("figure");
            const img = document.createElement("img");
            img.src = work.imageUrl;
            img.alt = work.title;
            const figCaption = document.createElement("figcaption");
            figCaption.textContent = work.title;

            figure.appendChild(img);
            figure.appendChild(figCaption);
            gallery.appendChild(figure);
        });
    } catch (error)
    {
        console.error('Il y a eu un problème avec la requête fetch :', error);
        // Gérer l'erreur 
    }
}

getWorks();
