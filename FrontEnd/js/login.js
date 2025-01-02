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

  // Création du lien pour réinitialiser le mot de passe
  const forgotPassword = document.createElement("a");
  forgotPassword.href = "#";
  forgotPassword.id = "forgot-password";
  forgotPassword.textContent = "Mot de passe oublié";

  // Assemblage des éléments de connexion
  connecter.appendChild(submitButton);
  connecter.appendChild(forgotPassword);

  // Construction de la structure du formulaire
  form.appendChild(emailContainer);
  form.appendChild(passwordContainer);
  form.appendChild(connecter);

  // Intégration des éléments dans la section de connexion
  loginSection.appendChild(h2);
  loginSection.appendChild(form);

  // Gestion de la soumission du formulaire et processus d'authentification
  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    try {
      // Envoi des informations d'identification à l'API pour authentification
      const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailInput.value,
          password: passwordInput.value,
        }),
      });

      if (!response.ok) {
        throw new Error("Identifiants incorrects");
      }

      // Sauvegarde du jeton d'authentification et redirection vers la page principale
      const data = await response.json();
      localStorage.setItem("token", data.token);
      window.location.href = "../index.html";
    } catch (error) {
      console.error("Erreur de connexion:", error);
      alert("Erreur lors de la connexion");
    }
  });
});
