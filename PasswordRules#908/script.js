class PasswordRules extends HTMLElement {
  connectedCallback() {
    this.input = document.getElementById(this.dataset.inputId);

    if (!this.input) return;

    this.rules = [];
    this.setupRules();
    this.input.addEventListener("input", this);
  }

  handleEvent(e) {
    this.score = 0;

    for (let [index, rule] of this.rules.entries()) {
      const match = e.target.value.match(rule);

      if (match) this.score++;

      this.toggleMatchedRuleClass(index, match);
    }

    this.setAttributes("score", this.score);
  }

  setAttributes(name, value) {
    this.dataset[name] = value;
    this.style.setProperty(`--${name}`, value);
  }

  setupRules() {
    const rules = this.dataset.rules;

    if (!rules) return;

    rules.split(this.dataset.separator || ",").forEach((match) => {
      this.rules.push(new RegExp(match.trim()));
    });

    this.setAttributes("total", this.rules.length);
  }

  toggleMatchedRuleClass(index, value) {
    const el = this.querySelector(`[data-rule-index="${index}"]`);

    if (!el) return;

    el.classList.toggle("is-match", value);
  }
}

class PasswordToggle extends HTMLElement {
  connectedCallback() {
    this.input = document.getElementById(this.dataset.inputId);
    this.status = document.getElementById(this.dataset.statusId);
    this.btn = this.querySelector("button");

    if (!this.input || !this.btn) return;

    this.btn.ariaPressed = false;
    this.btn.ariaLabel = "Show password";
    this.btn.setAttribute("aria-controls", this.dataset.inputId);
    this.btn.addEventListener("click", this);
  }

  handleEvent(e) {
    if (this.input.type === "password") {
      this.btn.ariaPressed = true;
      this.btn.ariaLabel = "Hide password";
      this.input.type = "text";

      if (this.status) this.status.textContent = "Password is showing";
    } else {
      this.btn.ariaPressed = false;
      this.btn.ariaLabel = "Show password";
      this.input.type = "password";

      if (this.status) this.status.textContent = "Password is hidden";
    }
  }
}

customElements.define("password-rules", PasswordRules);
customElements.define("password-toggle", PasswordToggle);