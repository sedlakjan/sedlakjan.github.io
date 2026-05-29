(function () {
  const config = window.challengeConfig;
  if (!config) return;

  const state = {};
  const selectedButtons = new Map();

  const formatPrice = (value) =>
    `${Math.round(value).toLocaleString("sk-SK")} €`;

  const totalEl = document.querySelector("[data-total]");
  const linesEl = document.querySelector("[data-cart-lines]");
  const widgetEl = document.querySelector("[data-cart-widget]");
  const orderBtn = document.querySelector("[data-order]");
  const validationEl = document.querySelector("[data-validation]");
  const loadingLayer = document.querySelector("[data-loading-layer]");
  const modalLayer = document.querySelector("[data-modal-layer]");
  const modalTotal = document.querySelector("[data-modal-total]");
  const closeModal = document.querySelector("[data-close-modal]");

  function getTotal() {
    return Object.values(state).reduce((sum, entry) => {
      if (Array.isArray(entry)) {
        return sum + entry.reduce((part, item) => part + item.price, 0);
      }
      return sum + (entry ? entry.price : 0);
    }, 0);
  }

  function getLines() {
    return Object.values(state).flatMap((entry) => {
      if (!entry) return [];
      return Array.isArray(entry) ? entry : [entry];
    });
  }

  function updateCart() {
    const total = getTotal();
    totalEl.textContent = formatPrice(total);
    linesEl.innerHTML = "";

    const lines = getLines();
    linesEl.classList.toggle("is-visible", lines.length > 0);
    lines.forEach((item) => {
      const row = document.createElement("div");
      row.innerHTML = `<span>${item.title}</span><strong>${formatPrice(item.price)}</strong>`;
      linesEl.appendChild(row);
    });

    if (widgetEl) {
      widgetEl.classList.add("bump");
      window.setTimeout(() => widgetEl.classList.remove("bump"), 180);
    }
  }

  function setSelected(button, group, item, mode) {
    validationEl.classList.remove("is-visible");

    if (mode === "multi") {
      const current = state[group] || [];
      const key = `${group}:${item.id}`;
      if (selectedButtons.has(key)) {
        selectedButtons.get(key).classList.remove("is-selected");
        selectedButtons.delete(key);
        state[group] = current.filter((entry) => entry.id !== item.id);
      } else {
        button.classList.add("is-selected");
        selectedButtons.set(key, button);
        state[group] = [...current, item];
      }
    } else {
      document
        .querySelectorAll(`[data-group="${group}"]`)
        .forEach((node) => node.classList.remove("is-selected"));
      button.classList.add("is-selected");
      state[group] = item;
    }

    updateCart();
  }

  function cardTemplate(section, item) {
    const specs = item.specs
      ? `<ul class="specs">${item.specs
          .map((spec) => `<li><span>${spec.label}</span><strong>${spec.value}</strong></li>`)
          .join("")}</ul>`
      : "";

    const features = item.features
      ? `<ul class="feature-list">${item.features
          .map(
            (feature) =>
              `<li><span class="material-symbols-outlined ${feature.ok ? "ok" : "no"}">${feature.ok ? "check" : "close"}</span>${feature.text}</li>`
          )
          .join("")}</ul>`
      : "";

    const media = item.image
      ? `<div class="choice-media"><img class="${item.mediaFit === "contain" ? "contain" : ""}" src="${item.image}" alt="${item.alt || item.title}"><span class="choice-check"><span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1;">check_circle</span></span></div>`
      : `<span class="choice-check"><span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1;">check_circle</span></span>`;

    const badge = item.badge ? `<div class="badge">${item.badge}</div>` : "";
    const icon = item.icon ? `<div class="choice-icon">${item.icon}</div>` : "";
    const extraClass = [item.accent ? `accent-${item.accent}` : "", item.featured ? "featured" : ""].filter(Boolean).join(" ");
    const displayPrice = item.displayPrice || formatPrice(item.price);

    return `
      <button class="choice-card ${extraClass}" type="button" data-group="${section.id}" data-id="${item.id}">
        ${media}
        <div class="choice-body">
          ${badge}
          ${icon}
          <div class="choice-title-row">
            <div>
              <h3>${item.title}</h3>
              ${item.subtitle ? `<p class="choice-subtitle">${item.subtitle}</p>` : ""}
            </div>
          </div>
          ${specs}
          ${features}
          <div class="choice-footer">
            <div class="price">${displayPrice}${item.priceNote ? ` <small>${item.priceNote}</small>` : ""}</div>
            <span class="select-pill">${section.mode === "multi" ? "Pridať" : "Vybrať"}</span>
          </div>
        </div>
      </button>
    `;
  }

  function compactTemplate(section, item) {
    return `
      <button class="compact-choice" type="button" data-group="${section.id}" data-id="${item.id}">
        <span class="compact-icon">${item.icon || '<span class="material-symbols-outlined">add</span>'}</span>
        <span class="compact-copy">
          <h3>${item.title}</h3>
          <p>${item.subtitle || ""}</p>
        </span>
        <span class="compact-price">${formatPrice(item.price)}${item.priceNote ? `<small>${item.priceNote}</small>` : ""}</span>
      </button>
    `;
  }

  function renderSections() {
    const root = document.querySelector("[data-sections]");
    root.innerHTML = config.sections
      .map((section) => {
        const layoutClass = section.layout === "compact" ? "compact-list" : `grid ${section.columns === 2 ? "two" : "three"}`;
        const panelClass = section.panel ? " section-panel" : "";
        const cards = section.items
          .map((item) => (section.layout === "compact" ? compactTemplate(section, item) : cardTemplate(section, item)))
          .join("");

        return `
          <section class="section${panelClass}" id="${section.id}">
            <div class="section-header">
              <span class="material-symbols-outlined">${section.icon}</span>
              <h2>${section.title}</h2>
            </div>
            ${section.intro ? `<p class="section-intro">${section.intro}</p>` : ""}
            <div class="${layoutClass}">${cards}</div>
          </section>
        `;
      })
      .join("");

    config.sections.forEach((section) => {
      state[section.id] = section.mode === "multi" ? [] : null;
      section.items.forEach((item) => {
        const button = document.querySelector(`[data-group="${section.id}"][data-id="${item.id}"]`);
        button.addEventListener("click", () => setSelected(button, section.id, item, section.mode));
      });
    });
  }

  function requiredMissing() {
    return config.sections
      .filter((section) => section.required)
      .filter((section) => {
        const entry = state[section.id];
        if (Array.isArray(entry)) {
          return entry.length < (section.minSelected || 1);
        }
        return !entry;
      });
  }

  function openModal() {
    const total = getTotal();
    modalTotal.textContent = formatPrice(total);
    modalLayer.classList.add("is-open");
    document.body.classList.add("modal-open");
  }

  function startOrder() {
    const missing = requiredMissing();
    if (missing.length > 0) {
      validationEl.textContent = `Ešte vyber: ${missing.map((section) => section.shortTitle || section.title).join(", ")}.`;
      validationEl.classList.add("is-visible");
      validationEl.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    orderBtn.disabled = true;
    loadingLayer.classList.add("is-open");
    document.body.classList.add("modal-open");

    window.setTimeout(() => {
      loadingLayer.classList.remove("is-open");
      orderBtn.disabled = false;
      openModal();
    }, 1250);
  }

  renderSections();
  updateCart();

  orderBtn.addEventListener("click", startOrder);
  closeModal.addEventListener("click", () => {
    modalLayer.classList.remove("is-open");
    document.body.classList.remove("modal-open");
  });
  modalLayer.addEventListener("click", (event) => {
    if (event.target === modalLayer) {
      modalLayer.classList.remove("is-open");
      document.body.classList.remove("modal-open");
    }
  });
})();
