async function login () {
    try
    {
        const response = await fetch("http://localhost:5678/api/login")
        if (!response.ok)
        {
            throw new Error("La réponse du réseau n'était pas correcte");
        }

        const loginData = await response.json();

        console.log('Données de "login" récupérées :', loginData);

        const loginElement = document.querySelector(".login");
        if (!loginElement)
        {
            throw new Error("Élément avec la classe login non trouvé");
        }

        loginElement.innerHTML = "";
        console.log("Chargement...");

        const form = document.createElement("form");
        form.method = "post";
        form.action = "http://localhost:5678/api/login";
        loginElement.appendChild(form);

        const emailInput = document.createElement("input");
    }
}