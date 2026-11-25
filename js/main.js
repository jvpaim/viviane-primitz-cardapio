/* ==========================================================================
   Viviane Primitz Confeitaria — interações do cardápio
   Sem dependências. Cada recurso só roda se o elemento existir na página.
   ========================================================================== */
(() => {
  "use strict";

  /* ---------- Configuração ---------- */
  const CONFIG = {
    whatsapp: "5588996527350", // DDI 55 + DDD 88 + número
    pix: "88996527350",
  };

  const doc = document.documentElement;
  doc.classList.remove("no-js");

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /** Monta o link do WhatsApp com a mensagem já preenchida. */
  const waLink = (message) =>
    `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(message)}`;

  /** Formata número como moeda brasileira: 7.5 -> "R$ 7,50" */
  const brl = (value) =>
    value
    .toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
    .replace(/\u00a0/g, " ");

  /** Aplica a mensagem a um link de WhatsApp. */
  const setWa = (el, message) => {
    el.dataset.wa = message;
    el.href = waLink(message);
  };

  /* ---------- Links de WhatsApp ---------- */
  document.querySelectorAll("[data-wa]").forEach((el) => {
    setWa(el, el.dataset.wa);
    el.target = "_blank";
    el.rel = "noopener";
  });

  /* ---------- Header com sombra ao rolar ---------- */
  const header = document.querySelector(".site-header");
  if (header) {
    const onScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
      document.body.classList.toggle("is-past-hero", window.scrollY > window.innerHeight * 0.6);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Animação de entrada ao rolar ---------- */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Toast ---------- */
  const toast = (text) => {
    let el = document.querySelector(".toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "toast";
      el.setAttribute("role", "status");
      document.body.appendChild(el);
    }
    el.textContent = text;
    el.classList.add("is-visible");
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove("is-visible"), 2400);
  };

  /* ---------- Produtos com tamanhos (Pequeno / Médio / Grande) ----------
     Cada card tem data-product="Chocotone tradicional" e inputs com
     data-price. O botão de pedido é atualizado com o tamanho escolhido. */
  document.querySelectorAll("[data-product]").forEach((card) => {
    const inputs = card.querySelectorAll('input[type="radio"]');
    const priceEl = card.querySelector("[data-price-value]");
    const button = card.querySelector("[data-order]");
    if (!card.querySelector("input[data-price]") || !button) return;

    const article = card.dataset.article || "um";
    const update = () => {
      const checked = card.querySelector('input[type="radio"][data-price]:checked');
      if (!checked) return;
      const flavor = card.querySelector("input[data-flavor-option]:checked");
      const price = Number(checked.dataset.price);
      const size = checked.value; // ex.: "pequeno"
      const weight = checked.dataset.weight ? ` de ${checked.dataset.weight}` : ""; // ex.: " de 130 g"
      const flavorText = flavor ? ` sabor ${flavor.value}` : ""; // ex.: " sabor Kit Kat"
      const item = `${card.dataset.product} ${size}${weight}${flavorText}`;
      if (priceEl) priceEl.textContent = brl(price);
      setWa(button, `Olá! Quero ${article} ${item} (${brl(price)}). 😊`);
      button.setAttribute("aria-label", `Pedir ${item} pelo WhatsApp`);
    };
    inputs.forEach((input) => input.addEventListener("change", update));
    update();
  });

  /* ---------- Copiar chave Pix ---------- */
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const value = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(value);
      } catch {
        const tmp = document.createElement("textarea");
        tmp.value = value;
        tmp.setAttribute("readonly", "");
        tmp.style.position = "absolute";
        tmp.style.left = "-9999px";
        document.body.appendChild(tmp);
        tmp.select();
        document.execCommand("copy");
        tmp.remove();
      }
      const label = btn.querySelector("span");
      const original = label.textContent;
      btn.classList.add("is-copied");
      label.textContent = "Chave copiada!";
      toast("Chave Pix copiada ✓");
      setTimeout(() => {
        btn.classList.remove("is-copied");
        label.textContent = original;
      }, 2200);
    });
  });

  /* ---------- Caixa de alfajores (monte seu pedido) ---------- */
  const box = document.querySelector("[data-box]");
  if (box) {
    const rows = [...box.querySelectorAll("[data-flavor]")];
    const totalEls = document.querySelectorAll("[data-box-total]");
    const countEls = document.querySelectorAll("[data-box-count]");
    const orderBtns = document.querySelectorAll("[data-box-order]");
    const orderBar = document.querySelector(".order-bar");
    const summary = document.querySelector(".box-summary");
    const MAX = 99;
    const qty = new Map(rows.map((r) => [r, 0]));

    const render = () => {
      let count = 0;
      let total = 0;
      const lines = [];
      rows.forEach((row) => {
        const n = qty.get(row);
        const price = Number(row.dataset.price);
        row.querySelector("output").textContent = n;
        row.querySelector('[data-step="-1"]').disabled = n === 0;
        row.querySelector('[data-step="1"]').disabled = n === MAX;
        if (n > 0) {
          count += n;
          total += n * price;
          lines.push(`• ${n}x ${row.dataset.flavor} (${brl(price)} cada)`);
        }
      });

      totalEls.forEach((el) => (el.textContent = brl(total)));
      countEls.forEach(
        (el) => (el.textContent = count === 1 ? "1 alfajor" : `${count} alfajores`)
      );

      const message = count
        ? `Olá! Quero encomendar alfajores:\n${lines.join("\n")}\nTotal: ${brl(total)} 😊`
        : "Olá! Quero alfajores. Pode me ajudar a escolher os sabores? 😊";
      orderBtns.forEach((btn) => setWa(btn, message));

      // Barra fixa aparece quando há itens e o resumo não está visível
      if (orderBar) orderBar.dataset.hasItems = count > 0 ? "1" : "";
      updateBar();
    };

    let summaryVisible = false;
    const updateBar = () => {
      if (!orderBar) return;
      const show = orderBar.dataset.hasItems === "1" && !summaryVisible;
      orderBar.classList.toggle("is-visible", show);
      orderBar.setAttribute("aria-hidden", show ? "false" : "true");
      orderBar.querySelectorAll("a").forEach((a) => (a.tabIndex = show ? 0 : -1));
      document.body.classList.toggle("has-order-bar", show);
    };

    if (summary && "IntersectionObserver" in window) {
      new IntersectionObserver(([entry]) => {
        summaryVisible = entry.isIntersecting;
        updateBar();
      }).observe(summary);
    }

    box.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-step]");
      if (!btn) return;
      const row = btn.closest("[data-flavor]");
      const next = Math.min(MAX, Math.max(0, qty.get(row) + Number(btn.dataset.step)));
      qty.set(row, next);
      render();
    });

    render();
  }

  /* ---------- Quiz "Qual doce é a sua cara?" ---------- */
  const quiz = document.querySelector("[data-quiz]");
  if (quiz) {
    const RESULTS = {
      tradicional: {
        name: "Chocotone Tradicional",
        img: "assets/img/chocotone-tradicional-sm.webp",
        text: "Você é do aconchego: café passado, conversa boa e aquela fatia fofinha com gotas de chocolate. Clássico que nunca sai de moda.",
        price: "a partir de R$ 10,00",
        msg: "Olá! Fiz o quiz do site e deu Chocotone Tradicional. Quero encomendar um! 😊",
        page: "chocotones.html",
      },
      cobertura: {
        name: "Chocotone com Cobertura",
        img: "assets/img/chocotone-cobertura-sm.webp",
        text: "Você gosta de capricho: o fofinho de sempre, mas com uma capa generosa de chocolate e granulado crocante por cima.",
        price: "a partir de R$ 13,00",
        msg: "Olá! Fiz o quiz do site e deu Chocotone com Cobertura. Quero encomendar um! 😊",
        page: "chocotones.html",
      },
      trufado: {
        name: "Chocotone Trufado",
        img: "assets/img/chocotone-trufado-sm.webp",
        text: "Chocolate nunca é demais para você. O trufado é intenso, cremoso por dentro e por fora, e é o orgulho da casa.",
        price: "a partir de R$ 23,00",
        msg: "Olá! Fiz o quiz do site e deu Chocotone Trufado. Quero encomendar um! 😊",
        page: "chocotones.html",
      },
      chocomimo: {
        name: "ChocoMimo",
        img: "assets/img/chocomimo-sm.webp",
        text: "Você adora presentear. O ChocoMimo chega no pote de vidro com laço, pronto para fazer alguém sorrir.",
        price: "R$ 35,00",
        msg: "Olá! Fiz o quiz do site e deu ChocoMimo. Quero encomendar um! 😊",
        page: "chocotones.html",
      },
      sobremesa: {
        name: "Sobremesa Natalina",
        img: "assets/img/sobremesa-uva-sm.webp",
        text: "Você é o coração da ceia. Uma sobremesa cremosa para dividir com a família, em quatro sabores de fazer brilhar a mesa.",
        price: "R$ 92,00",
        msg: "Olá! Fiz o quiz do site e deu Sobremesa Natalina. Quero saber os sabores disponíveis! 😊",
        page: "sobremesas.html",
      },
      alfajor: {
        name: "Alfajor",
        img: "assets/img/alfajor-sm.webp",
        text: "Você ama um docinho a qualquer hora. Massa macia, recheio generoso e banho de chocolate, em seis sabores.",
        price: "a partir de R$ 7,50",
        msg: "Olá! Fiz o quiz do site e deu Alfajor. Quero encomendar! 😊",
        page: "alfajores.html",
      },
    };

    const steps = [...quiz.querySelectorAll(".quiz-step")];
    const bars = [...quiz.querySelectorAll(".quiz-progress span")];
    const result = quiz.querySelector(".quiz-result");
    const scores = {};
    let current = 0;

    const show = (index) => {
      steps.forEach((s, i) => s.classList.toggle("is-active", i === index));
      bars.forEach((b, i) => {
        b.classList.toggle("is-done", i < index);
        b.classList.toggle("is-active", i === index);
      });
    };

    const finish = () => {
      // Maior pontuação vence; empate fica com a primeira opção escolhida
      const winner = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
      const r = RESULTS[winner];
      result.querySelector("img").src = r.img;
      result.querySelector("img").alt = r.name;
      result.querySelector("[data-result-name]").textContent = r.name;
      result.querySelector("[data-result-text]").textContent = r.text;
      result.querySelector("[data-result-price]").textContent = r.price;
      setWa(result.querySelector("[data-result-order]"), r.msg);
      result.querySelector("[data-result-page]").href = r.page;

      steps.forEach((s) => s.classList.remove("is-active"));
      bars.forEach((b) => {
        b.classList.remove("is-active");
        b.classList.add("is-done");
      });
      result.classList.add("is-active");
      result.querySelector("[data-result-name]").focus({ preventScroll: true });
    };

    quiz.addEventListener("click", (e) => {
      const option = e.target.closest(".quiz-option");
      if (option) {
        option.dataset.score.split(" ").forEach((key, i) => {
          scores[key] = (scores[key] || 0) + (i === 0 ? 2 : 1);
        });
        current += 1;
        if (current < steps.length) show(current);
        else finish();
        return;
      }
      if (e.target.closest("[data-quiz-restart]")) {
        Object.keys(scores).forEach((k) => delete scores[k]);
        current = 0;
        result.classList.remove("is-active");
        show(0);
        steps[0].querySelector(".quiz-option").focus({ preventScroll: true });
      }
    });

    show(0);
  }

  /* ---------- Brilhos caindo (página inicial) ---------- */
  const canvas = document.getElementById("sparkles");
  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext("2d");
    const colors = ["#CBA97B", "#C98E82", "#E8CFA8", "#F0C9C0"];
    let w, h, dpr, particles, raf;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const amount = Math.round(Math.min(70, (w * h) / 16000));
      particles = Array.from({ length: amount }, () => spawn(true));
    };

    const spawn = (anywhere) => ({
      x: Math.random() * w,
      y: anywhere ? Math.random() * h : -10,
      r: Math.random() * 2.6 + 0.8,
      vy: Math.random() * 0.45 + 0.15,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: Math.random() * 0.02 + 0.005,
      color: colors[(Math.random() * colors.length) | 0],
      star: Math.random() < 0.25,
      alpha: Math.random() * 0.5 + 0.35,
    });

    const drawStar = (x, y, r) => {
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const radius = i % 2 === 0 ? r * 2.4 : r * 0.6;
        const angle = (Math.PI / 4) * i;
        ctx.lineTo(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius);
      }
      ctx.closePath();
      ctx.fill();
    };

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p, i) => {
        p.y += p.vy;
        p.sway += p.swaySpeed;
        p.x += Math.sin(p.sway) * 0.3;
        if (p.y > h + 10) particles[i] = spawn(false);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        if (p.star) drawStar(p.x, p.y, p.r);
        else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      raf = requestAnimationFrame(tick);
    };

    resize();
    tick();
    window.addEventListener("resize", () => {
      cancelAnimationFrame(raf);
      resize();
      tick();
    });
    document.addEventListener("visibilitychange", () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) tick();
    });
  }
})();
