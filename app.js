const state = {
  step: 1,
  data: { name: "", email: "", workspace: "" },
  errors: {},
};

function validate() {
  const errors = {};

  if (!state.data.name.trim() || state.data.name.trim().length < 3) {
    errors.name = "Name must be at least 3 characters";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(state.data.email.trim())) {
    errors.email = "Please enter a valid email address";
  }

  if (!state.data.workspace.trim() || state.data.workspace.trim().length < 3) {
    errors.workspace = "Workspace name must be at least 3 characters";
  }

  return errors;
}
// Render UI
function render() {
  const app = document.getElementById("app");

  if (state.step === "success") {
    app.innerHTML = `
        <div class="card success" role="alert" aria-live="polite">
          <div class="success-icon" aria-hidden="true">✔</div>
          <div class="success-title">Workspace Created Successfully!</div>
          <div class="success-subtitle">
            Your workspace <strong>${state.data.workspace}</strong> is ready.<br/>
            A confirmation was sent to <strong>${state.data.email}</strong>.
          </div>
          <p>Thank you for using our multi-step form!</p>
        </div>
      `;
    return;
  }

  const step1Class = state.step === 1 ? "step active" : "step completed";
  const step2Class =
    state.step === 2
      ? "step active"
      : state.step === "success"
      ? "step completed"
      : "step";

  app.innerHTML = `
      <div class="card" role="form" aria-labelledby="form-title">
        <div class="steps" aria-label="Progress">
          <div class="${step1Class}">1</div>
          <div class="${step2Class}">2</div>
        </div>

        <div class="body">
          ${
            state.step === 1
              ? `
            <div class="form-group ${state.errors.name ? "error" : ""}">
              <label for="name">Full Name</label>
              <input id="name" type="text" value="${
                state.data.name
              }" autocomplete="off" aria-describedby="name-error" />
              ${
                state.errors.name
                  ? `<div id="name-error" class="error-message">${state.errors.name}</div>`
                  : ""
              }
            </div>

            <div class="form-group ${state.errors.email ? "error" : ""}">
              <label for="email">Email</label>
              <input id="email" type="email" value="${
                state.data.email
              }" autocomplete="off" aria-describedby="email-error" />
              ${
                state.errors.email
                  ? `<div id="email-error" class="error-message">${state.errors.email}</div>`
                  : ""
              }
            </div>

            <div class="actions">
              <button id="btnNext" type="button">Next</button>
            </div>
          `
              : `
            <div class="form-group ${state.errors.workspace ? "error" : ""}">
              <label for="workspace">Workspace Name</label>
              <input id="workspace" type="text" value="${
                state.data.workspace
              }" autocomplete="off" aria-describedby="workspace-error" />
              ${
                state.errors.workspace
                  ? `<div id="workspace-error" class="error-message">${state.errors.workspace}</div>`
                  : ""
              }
            </div>

            <div class="actions">
              <button id="btnSubmit" type="button" class="secondary">Submit</button>
            </div>
          `
          }
        </div>
      </div>
    `;

  if (state.step === 1) {
    document.getElementById("name").addEventListener("input", (e) => {
      state.data.name = e.target.value;
      state.errors.name = "";
    });
    document.getElementById("email").addEventListener("input", (e) => {
      state.data.email = e.target.value;
      state.errors.email = "";
    });
    document.getElementById("btnNext").addEventListener("click", () => {
      state.step = 2;
      render();
    });
  } else if (state.step === 2) {
    document.getElementById("workspace").addEventListener("input", (e) => {
      state.data.workspace = e.target.value;
      state.errors.workspace = "";
    });
    document.getElementById("btnSubmit").addEventListener("click", () => {
      state.errors = validate();

      if (state.errors.name || state.errors.email) {
        state.step = 1;
      } else if (state.errors.workspace) {
        state.step = 2;
      } else {
        state.step = "success";
      }
      render();
    });
  }
}

render();
