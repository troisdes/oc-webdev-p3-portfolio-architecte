document.addEventListener("DOMContentLoaded", async function userLogin() {
  const loginSection = document.getElementById("login");
  loginSection.innerHTML = ""; // Nettoie la section de connexion existante

  // Création du titre du formulaire
  const h2 = document.createElement("h2");
  h2.textContent = "Log In";

  // Création du formulaire principal
  const form = document.createElement("form");
  form.id = "login-form";

  // Création et configuration du champ email avec son libellé
  const emailContainer = document.createElement("div");
  emailContainer.classList.add("email-container");
  const emailLabel = document.createElement("label");
  emailLabel.setAttribute("for", "email");
  emailLabel.textContent = "E-mail";

  const emailInput = document.createElement("input");
  emailInput.type = "email";
  emailInput.id = "email";
  emailInput.name = "email";
  emailInput.autocomplete = "email";
  emailInput.required = true;

  emailContainer.appendChild(emailLabel);
  emailContainer.appendChild(emailInput);

  // Création et configuration du champ mot de passe avec son libellé
  const passwordContainer = document.createElement("div");
  passwordContainer.classList.add("password-container");
  const passwordLabel = document.createElement("label");
  passwordLabel.setAttribute("for", "password");
  passwordLabel.textContent = "Mot de passe";

  const passwordInput = document.createElement("input");
  passwordInput.type = "password";
  passwordInput.id = "password";
  passwordInput.name = "password";
  passwordInput.autocomplete = "current-password";
  passwordInput.required = true;

  passwordContainer.appendChild(passwordLabel);
  passwordContainer.appendChild(passwordInput);

  // Création de la zone des boutons de connexion et lien mot de passe oublié
  const connecter = document.createElement("div");
  connecter.id = "connecter";
  const submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.textContent = "Se connecter";
  submitButton.id = "seConnecter";

  // Création du lien pour le mot de passe oublié
  const forgotPassword = document.createElement("a");
  forgotPassword.href = "#";
  forgotPassword.id = "forgot-password";
  forgotPassword.textContent = "Mot de passe oublié";

  // Assemblage des éléments du formulaire de connexion
  connecter.appendChild(submitButton);
  connecter.appendChild(forgotPassword);

  // Construction de la structure complète du formulaire
  form.appendChild(emailContainer);
  form.appendChild(passwordContainer);
  form.appendChild(connecter);

  // Ajout des éléments dans la section de connexion
  loginSection.appendChild(h2);
  loginSection.appendChild(form);

  // Gestion de la soumission du formulaire et authentification
  form.addEventListener("submit", async function (event) {
    event.preventDefault(); // Empêche le comportement par défaut du formulaire
    console.log("Tentative de connexion en cours"); // Log de la tentative de connexion

    try {
      // Envoi des identifiants à l'API pour vérification
      const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailInput.value,
          password: passwordInput.value,
        }),
      });
      console.log("Statut de la réponse de connexion :", response.status); // Log du statut de la réponse

      if (!response.ok) {
        throw new Error("Identifiants incorrects"); // Erreur si les identifiants sont incorrects
      }

      // Stockage du token et redirection vers la page d'accueil
      const data = await response.json();
      localStorage.setItem("token", data.token); // Stockage du token dans le localStorage
      console.log("Connexion réussie, redirection..."); // Log de la réussite de la connexion
      window.location.href = "../index.html"; // Redirection vers la page d'accueil
    } catch (error) {
      console.error("Erreur de connexion:", error); // Log de l'erreur de connexion
      alert("Erreur lors de la connexion: " + error.message); // Alerte de l'erreur de connexion
    }
  });
});
