document.addEventListener("DOMContentLoaded", () => {
  const state = {
    currentStep: 1,
    formData: { name: "", email: "", workspace: "" },
    errors: { name: "", email: "", workspace: "" },
  };

  const actions = {
    updateField(field, value) {
      state.formData[field] = value;
      return false;
    },
    nextStep() {
      state.currentStep = 2;
      return true;
    },
    submit() {
      state.errors = { name: "", email: "", workspace: "" };

      if (!state.formData.name || state.formData.name.trim().length < 3) {
        state.errors.name = "Name must be at least 3 characters";
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (
        !state.formData.email ||
        !emailRegex.test(state.formData.email.trim())
      ) {
        state.errors.email = "Please enter a valid email address";
      }
      if (
        !state.formData.workspace ||
        state.formData.workspace.trim().length < 3
      ) {
        state.errors.workspace = "Workspace name must be at least 3 characters";
      }

      const hasStep1Errors = !!(state.errors.name || state.errors.email);
      const hasStep2Errors = !!state.errors.workspace;

      if (hasStep1Errors) {
        state.currentStep = 1;
        return false;
      }
      if (hasStep2Errors) {
        state.currentStep = 2;
        return false;
      }

      state.currentStep = "success";
      return true;
    },
    reset() {
      state.currentStep = 1;
      state.formData = { name: "", email: "", workspace: "" };
      state.errors = { name: "", email: "", workspace: "" };
      return true;
    },
  };

  function renderUI() {
    const app = document.getElementById("app");

    if (state.currentStep === "success") {
      app.innerHTML = `
            <div class="card">
              <div class="success" role="alert" aria-live="polite">
                <div class="success-icon" aria-hidden="true">✔</div>
                <div class="success-title">Workspace Created Successfully!</div>
                <div class="success-subtitle">
                  Your workspace <strong>${escapeHtml(
                    state.formData.workspace
                  )}</strong> is ready.<br/>
                  A confirmation was sent to <strong>${escapeHtml(
                    state.formData.email
                  )}</strong>.
                </div>
                <p>Thank you for using our multi-step form!</p>
              </div>
            </div>
          `;
      return;
    }

    const s1 =
      state.currentStep === 1
        ? "step active"
        : state.currentStep === 2 || state.currentStep === "success"
        ? "step completed"
        : "step";
    const s2 =
      state.currentStep === 2
        ? "step active"
        : state.currentStep === "success"
        ? "step completed"
        : "step";

    app.innerHTML = `
          <div class="card" role="form" aria-labelledby="form-title">
            <div class="steps" aria-label="Progress">
              <div class="${s1}" aria-current="${
      state.currentStep === 1 ? "step" : false
    }">1</div>
              <div class="${s2}" aria-current="${
      state.currentStep === 2 ? "step" : false
    }">2</div>
            </div>

            <div class="body">
              <div class="form-body">
                ${
                  state.currentStep === 1
                    ? `
                  <div class="form-group ${state.errors.name ? "error" : ""}">
                    <label for="name">Full Name</label>
                    <input id="name" type="text" value="${escapeHtml(
                      state.formData.name
                    )}" autocomplete="off" aria-describedby="name-error" />
                    ${
                      state.errors.name
                        ? `<div id="name-error" class="error-message">${escapeHtml(
                            state.errors.name
                          )}</div>`
                        : ""
                    }
                  </div>

                  <div class="form-group ${state.errors.email ? "error" : ""}">
                    <label for="email">Email</label>
                    <input id="email" type="email" value="${escapeHtml(
                      state.formData.email
                    )}" autocomplete="off" aria-describedby="email-error" />
                    ${
                      state.errors.email
                        ? `<div id="email-error" class="error-message">${escapeHtml(
                            state.errors.email
                          )}</div>`
                        : ""
                    }
                  </div>

                  <div class="actions">
                    <button id="btnNext" type="button" aria-label="Go to next step">Next</button>
                  </div>
                `
                    : `
                  <div class="form-group ${
                    state.errors.workspace ? "error" : ""
                  }">
                    <label for="workspace">Workspace Name</label>
                    <input id="workspace" type="text" value="${escapeHtml(
                      state.formData.workspace
                    )}" autocomplete="off" aria-describedby="workspace-error" />
                    ${
                      state.errors.workspace
                        ? `<div id="workspace-error" class="error-message">${escapeHtml(
                            state.errors.workspace
                          )}</div>`
                        : ""
                    }
                  </div>

                  <div class="actions">
                    <button id="btnSubmit" class="secondary" type="button" aria-label="Submit form">Submit</button>
                  </div>
                `
                }
              </div>
            </div>
          </div>
        `;

    if (state.currentStep === 1) {
      document.getElementById("name").addEventListener("input", (e) => {
        actions.updateField("name", e.target.value);
      });
      document.getElementById("email").addEventListener("input", (e) => {
        actions.updateField("email", e.target.value);
      });
      document.getElementById("btnNext").addEventListener("click", () => {
        if (actions.nextStep()) renderUI();
      });
    } else if (state.currentStep === 2) {
      document.getElementById("workspace").addEventListener("input", (e) => {
        actions.updateField("workspace", e.target.value);
      });
      document.getElementById("btnSubmit").addEventListener("click", (ev) => {
        ev.preventDefault();
        if (actions.submit()) renderUI();
        else renderUI();
      });
    }
  }

  renderUI();
});
