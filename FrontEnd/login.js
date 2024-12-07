document.addEventListener("DOMContentLoaded", async function userLogin() {
  const loginSection = document.querySelector(".login");
  loginSection.innerHTML = ""; // Clear placeholder

  // Create form structure
  const h2 = document.createElement("h2");
  h2.textContent = "Log In";

  const form = document.createElement("form");
  form.id = "login-form";

  // Email field
  const emailLabel = document.createElement("label");
  emailLabel.setAttribute("for", "email");
  emailLabel.textContent = "E-mail";

  const emailInput = document.createElement("input");
  emailInput.type = "email";
  emailInput.id = "email";
  emailInput.name = "email";
  emailInput.autocomplete = "email";
  emailInput.required = true;

  // Password field
  const passwordLabel = document.createElement("label");
  passwordLabel.setAttribute("for", "password");
  passwordLabel.textContent = "Mot de passe";

  const passwordInput = document.createElement("input");
  passwordInput.type = "password";
  passwordInput.id = "password";
  passwordInput.name = "password";
  passwordInput.autocomplete = "current-password";
  passwordInput.required = true;

  // Submit button
  const submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.textContent = "Se connecter";

  // Forgot password link
  const forgotPassword = document.createElement("a");
  forgotPassword.href = "#";
  forgotPassword.className = "forgot-password";
  forgotPassword.textContent = "Mot de passe oublié";

  // Append elements
  form.appendChild(emailLabel);
  form.appendChild(emailInput);
  form.appendChild(passwordLabel);
  form.appendChild(passwordInput);
  form.appendChild(submitButton);
  form.appendChild(forgotPassword);

  loginSection.appendChild(h2);
  loginSection.appendChild(form);

  // Handle form submission
  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    try {
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

      const data = await response.json();
      localStorage.setItem("token", data.token);
      window.location.href = "index.html";
    } catch (error) {
      console.error("Erreur de connexion:", error);
      alert("Erreur lors de la connexion");
    }
  });
});
