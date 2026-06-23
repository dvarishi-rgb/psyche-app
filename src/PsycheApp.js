import { useState, useRef, useEffect } from "react";

const G = {
  bg: "#0d0b0f", surface: "#13101a", surfaceAlt: "#1a1525",
  border: "#2a2035", borderLight: "#3d3050",
  accent: "#c9a96e", accentDim: "#8a6d3f", accentSoft: "#2a1f0a",
  purple: "#9b7fcb", purpleDim: "#4a3570", purpleSoft: "#1a1030",
  text: "#e8e0d5", textMid: "#a09080", textDim: "#5a5060",
  red: "#c96e6e", green: "#6ec9a9",
};

const ANALYSTS_GROUPS = {
  "Базовые модели": [
    { id:"ocean", name:"Big Five / OCEAN", icon:"🌊", short:"Большая пятёрка личностных черт", tooltip:"Самая научно-доказанная модель личности. 5 измерений: Открытость, Добросовестность, Экстраверсия, Доброжелательность, Нейротизм." },
    { id:"mbti", name:"MBTI + когнитивные функции", icon:"🧩", short:"Тип личности и функциональный стек", tooltip:"Myers-Briggs и юнгианские когнитивные функции. Покажет тип (например, INFJ) и как он проявляется в поведении." },
    { id:"enneagram", name:"Эннеаграмма", icon:"⭐", short:"Тип + крылья + уровни развития", tooltip:"9 типов личности с глубинными мотивами. Тип, крылья, уровень здоровья, направления роста/стресса." },
    { id:"attachment", name:"Стиль привязанности", icon:"🤝", short:"Детская и взрослая привязанность", tooltip:"По Боулби и Эйнсворт. Как первые отношения сформировали все последующие." },
  ],
  "Психоаналитический блок": [
    { id:"freud", name:"Фрейд", icon:"🪞", short:"Ид, Эго, Суперэго + защиты", tooltip:"Что персонаж подавляет, как устроена психика на трёх уровнях и откуда внутренние конфликты." },
    { id:"jung", name:"Юнг — архетипы", icon:"🌙", short:"Персона, Тень, Анима/Анимус", tooltip:"Архетипы и коллективное бессознательное. Тень, путь к целостности, доминирующий архетип." },
    { id:"objects", name:"Объектные отношения", icon:"🪆", short:"Внутренние объекты и интроекты", tooltip:"Кляйн, Фэйрберн, Винникотт. Какие образы значимых людей живут в психике." },
    { id:"ifs", name:"IFS — внутренние части", icon:"🎭", short:"Менеджеры, Пожарные, Изгнанники", tooltip:"Internal Family Systems. Менеджеры, пожарники, изгнанники — система частей персонажа." },
    { id:"defenses", name:"Защитные механизмы", icon:"🛡️", short:"Полный список + как проявляются", tooltip:"Вытеснение, проекция, рационализация, расщепление — как каждый работает у этого персонажа." },
  ],
  "Развитие и путь": [
    { id:"erikson", name:"Эриксон — стадии", icon:"🌱", short:"Незакрытые стадии развития", tooltip:"8 стадий психосоциального развития. На какой застрял персонаж, какой кризис не разрешён." },
    { id:"campbell", name:"Путь героя (Кэмпбелл)", icon:"⚔️", short:"Где персонаж на мономифе", tooltip:"17 этапов героического путешествия. Где персонаж сейчас — призыв, испытание, возвращение." },
    { id:"character", name:"Характерология", icon:"📐", short:"Тип по Личко / Леонгарду", tooltip:"Клиническая типология акцентуаций. Эпилептоид, истероид, шизоид и их проявления." },
    { id:"trauma", name:"Травматический профиль", icon:"💔", short:"Типы травм, диссоциация, сценарии", tooltip:"Виды травм, диссоциативные паттерны, повторяющиеся сценарии." },
  ],
  "Глубокие модули": [
    { id:"natal", name:"Натальная карта", icon:"✨", short:"Психологическая астрология", tooltip:"Солнце (эго), Луна (бессознательное), Асцендент (маска) — психологическая интерпретация." },
    { id:"shadow", name:"Теневая работа", icon:"🖤", short:"Что персонаж в себе отрицает", tooltip:"По Юнгу. Проекции, бегство от себя, дар скрытый в Тени." },
    { id:"existential", name:"Экзистенциальный анализ", icon:"🕯️", short:"Смысл, свобода, одиночество, смерть", tooltip:"По Ялому. Четыре данности: смерть, свобода, изоляция, бессмысленность." },
    { id:"narrative", name:"Нарративная терапия", icon:"📖", short:"Какую историю рассказывает о себе", tooltip:"По Уайту. Доминирующий нарратив и альтернативная история." },
    { id:"kafka", name:"Кафка", icon:"🚪", short:"Отчуждение и абсурд власти", tooltip:"Отчуждение, абсурдная власть, невозможность быть понятым." },
    { id:"spielrein", name:"Шпильрейн", icon:"🌹", short:"Разрушение как трансформация", tooltip:"Влечение к разрушению как источник нового рождения." },
  ],
  "Практические модули": [
    { id:"triggers", name:"Триггеры и кнопки", icon:"⚡", short:"Что выводит из себя", tooltip:"Конкретный список триггеров — ситуации, слова, люди." },
    { id:"strengths", name:"Сильные стороны", icon:"💎", short:"Суперсила и ресурсы", tooltip:"Что персонаж делает лучше других, как раны питают силу." },
    { id:"disorders", name:"Личностные паттерны", icon:"🔍", short:"Паттерны (мягко, без диагнозов)", tooltip:"Нарциссические, пограничные, параноидные черты как тенденции." },
    { id:"growth", name:"Потенциал роста", icon:"🌿", short:"Терапия и путь развития", tooltip:"Какой вид терапии подошёл бы, конкретные шаги к психологическому здоровью." },
    { id:"relations", name:"В отношениях", icon:"❤️", short:"Любовь, дружба, власть", tooltip:"Паттерны в любви, дружбе и иерархиях власти." },
  ],
};

const ALL_ANALYSTS = Object.values(ANALYSTS_GROUPS).flat();

const ANALYST_PROMPTS = {
  ocean: "Проанализируй персонажа по Большой пятёрке (OCEAN). Для каждого измерения дай оценку (Высокий/Средний/Низкий) и 2-3 предложения обоснования. Итого: какой тип личности? 150-180 слов.",
  mbti: "Определи тип MBTI, функциональный стек (например: Ni-Fe-Ti-Se), объясни почему. Как доминирующая функция проявляется в поведении? 150-180 слов.",
  enneagram: "Определи тип (1-9), крылья, уровень развития. Глубинный страх и желание применительно к персонажу. Направления стресса и роста. 150-180 слов.",
  attachment: "Определи стиль привязанности в детстве и взрослом возрасте. Как ранний опыт сформировал паттерны в отношениях? 150-180 слов.",
  freud: "Разбери Ид/Эго/Суперэго, ключевые защитные механизмы, вытесненные влечения, фиксации. 150-180 слов.",
  jung: "Разбери Персону vs Самость, Тень (что вытеснено), Анима/Анимус, доминирующий архетип. Путь к индивидуации. 150-180 слов.",
  objects: "Опиши внутренние объекты: образы значимых людей в психике, расщепление на хороший/плохой объект, переходные объекты. 150-180 слов.",
  ifs: "Опиши систему частей: Менеджеры, Пожарники, Изгнанники. Что несёт Сущность персонажа? 150-180 слов.",
  defenses: "Перечисли все защитные механизмы, объясни как каждый проявляется в поведении, какие ситуации их активируют. 150-180 слов.",
  erikson: "Проанализируй все 8 стадий: какие пройдены, на какой застрял, какой кризис не разрешён. Какую задачу развития решает сейчас? 150-180 слов.",
  campbell: "Определи место персонажа на пути героя: обычный мир, призыв, порог, испытания, бездна, трансформация, возвращение. 150-180 слов.",
  character: "Определи тип акцентуации по Личко и Леонгарду (эпилептоидный, истероидный, шизоидный...). Как проявляется в стрессе и комфорте? 150-180 слов.",
  trauma: "Составь травматический профиль: тип травм, диссоциативные паттерны, повторяющиеся сценарии. Как травма управляет жизнью? 150-180 слов.",
  natal: "Психологическая интерпретация натальной карты: Солнце (эго), Луна (бессознательное), Асцендент (маска). Если даты нет — интерпретируй метафорически. 150-180 слов.",
  shadow: "Опиши Тень: что отрицает в себе, на кого проецирует, чего боится увидеть. Что Тень пытается сказать? Дар в Тени? 150-180 слов.",
  existential: "Разбери четыре данности: смерть, свобода, экзистенциальное одиночество, смысл/бессмысленность. Как персонаж справляется с каждой? 150-180 слов.",
  narrative: "Какой доминирующий нарратив управляет жизнью? Что остаётся за кадром? Какая альтернативная история возможна? 150-180 слов.",
  kafka: "Разбери отчуждение, абсурдную власть, невозможность быть понятым, вину без преступления. 150-180 слов.",
  spielrein: "Деструктивное влечение как трансформация. Что должно умереть чтобы персонаж возродился? 150-180 слов.",
  triggers: "Конкретный список триггеров: ситуации, слова, типы людей. Для каждого — что происходит внутри и снаружи. 150-180 слов.",
  strengths: "Сильные стороны и суперсила: что делает лучше других, какие качества — ресурс. Как раны питают силу? 150-180 слов.",
  disorders: "Устойчивые паттерны: нарциссические, пограничные, параноидные черты. Мягко, без диагнозов. Как проявляются в отношениях? 150-180 слов.",
  growth: "Потенциал роста: что исцелить, какая терапия подойдёт (IFS, гештальт, EMDR...), конкретные шаги. 150-180 слов.",
  relations: "Паттерны в любви (выбор партнёра, близость, конфликты), дружбе и иерархиях власти. 150-180 слов.",
};

const emptyChar = () => ({
  id: Date.now(), name: "", birthdate: "",
  behavior: "", childhood: "", fear: "", desire: "", wound: "", mask: "",
  image: null, analyses: {},
});

// ── API ──────────────────────────────────────────────────────────

const API_URL = "/.netlify/functions/claude";

const callClaude = async (system, userContent, maxTokens = 1000) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: maxTokens,
      system,
      messages: [{ role: "user", content: userContent }],
    }),
  });
  const d = await res.json();
  if (d.error) throw new Error(d.error.message);
  return d.content?.[0]?.text || "";
};

const truncateBio = (text) => {
  if (text.length <= 30000) return text;
  return text.slice(0, 20000) + "\n\n[...]\n\n" + text.slice(-8000);
};

// ── STORAGE ──────────────────────────────────────────────────────

const STORAGE_KEY = "psyche_v2_chars";

const saveChars = (chars) => {
  try {
    // Don't save images to avoid quota issues — save separately
    const toSave = chars.map(c => ({ ...c, image: c.image ? "__has_image__" : null }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    // Save images separately per character
    chars.forEach(c => {
      if (c.image && c.image !== "__has_image__") {
        try { localStorage.setItem(`psyche_img_${c.id}`, c.image); } catch {}
      }
    });
    return true;
  } catch { return false; }
};

const loadChars = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const chars = JSON.parse(raw);
    // Restore images
    return chars.map(c => ({
      ...c,
      image: c.image === "__has_image__"
        ? (localStorage.getItem(`psyche_img_${c.id}`) || null)
        : c.image,
    }));
  } catch { return null; }
};

// ── EXPORT HTML ─────────────────────────────────────────────────

const buildExportHTML = (char, dynData = null, charB = null) => {
  const isDyn = !!(dynData && charB);
  const analyses = Object.entries(char.analyses || {});

  const field = (label, value) => value
    ? `<div class="field"><div class="field-label">${label}</div><div class="field-value">${value.replace(/\n/g, "<br>")}</div></div>`
    : "";

  const analysisBlocks = analyses.map(([id, text]) => {
    const a = ALL_ANALYSTS.find(x => x.id === id);
    return a ? `<div class="analysis-block"><div class="analysis-title">${a.icon} ${a.name}<span class="analysis-sub">${a.short}</span></div><div class="analysis-text">${text.replace(/\n/g, "<br>")}</div></div>` : "";
  }).join("");

  const dynBlocks = isDyn ? Object.entries(dynData).map(([id, text]) => {
    const DYN_ASPECTS = [
      { id: "attraction", icon: "✦", label: "Притяжение и химия" },
      { id: "conflict", icon: "⚔️", label: "Конфликт и трение" },
      { id: "power", icon: "👑", label: "Власть и иерархия" },
      { id: "wounds", icon: "💔", label: "Ранящие паттерны" },
      { id: "growth", icon: "🌿", label: "Рост и исцеление" },
      { id: "shadow", icon: "🖤", label: "Теневая динамика" },
      { id: "future", icon: "🔮", label: "Вероятное будущее" },
      { id: "archetype", icon: "🌙", label: "Архетипическая пара" },
      { id: "communication", icon: "💬", label: "Язык и коммуникация" },
    ];
    const asp = DYN_ASPECTS.find(x => x.id === id);
    return asp ? `<div class="analysis-block"><div class="analysis-title">${asp.icon} ${asp.label}</div><div class="analysis-text">${text.replace(/\n/g, "<br>")}</div></div>` : "";
  }).join("") : "";

  return `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${isDyn ? `${char.name} × ${charB.name}` : char.name} — Psyche</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;1,400&family=Cinzel:wght@400;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: #0d0b0f;
    color: #e8e0d5;
    font-family: 'EB Garamond', Georgia, serif;
    min-height: 100vh;
    padding: 0;
  }
  .page {
    max-width: 800px;
    margin: 0 auto;
    padding: 60px 40px;
  }
  .header {
    text-align: center;
    margin-bottom: 60px;
    padding-bottom: 40px;
    border-bottom: 0.5px solid #2a2035;
    position: relative;
  }
  .header::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 1px;
    background: #c9a96e;
  }
  .psyche-brand {
    font-family: 'Cinzel', serif;
    font-size: 11px;
    color: #c9a96e;
    letter-spacing: 0.4em;
    text-transform: uppercase;
    margin-bottom: 32px;
  }
  .avatar-circle {
    width: 96px;
    height: 96px;
    border-radius: 50%;
    border: 1px solid #2a2035;
    background: #1a1525;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Cinzel', serif;
    font-size: 32px;
    color: #c9a96e;
    margin: 0 auto 24px;
    overflow: hidden;
  }
  .avatar-circle img { width: 100%; height: 100%; object-fit: cover; }
  .char-name {
    font-family: 'Cinzel', serif;
    font-size: 32px;
    font-weight: 600;
    color: #e8e0d5;
    letter-spacing: 0.05em;
    margin-bottom: 8px;
  }
  .char-date {
    font-size: 14px;
    color: #5a5060;
    letter-spacing: 0.1em;
  }
  .dyn-names {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    margin: 16px 0;
  }
  .dyn-name { font-family: 'Cinzel', serif; font-size: 20px; }
  .dyn-name.a { color: #c9a96e; }
  .dyn-name.b { color: #9b7fcb; }
  .dyn-sep { font-size: 24px; color: #5a5060; }
  .section { margin-bottom: 50px; }
  .section-title {
    font-family: 'Cinzel', serif;
    font-size: 10px;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: #c9a96e;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 0.5px solid #2a2035;
  }
  .fields-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
  .field { margin-bottom: 4px; }
  .field-label {
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #5a5060;
    margin-bottom: 6px;
  }
  .field-value {
    font-size: 15px;
    color: #a09080;
    line-height: 1.7;
  }
  .field.full { grid-column: 1 / -1; }
  .analysis-block {
    background: #13101a;
    border: 0.5px solid #2a2035;
    border-radius: 10px;
    padding: 20px 22px;
    margin-bottom: 16px;
    position: relative;
  }
  .analysis-block::before {
    content: '';
    position: absolute;
    top: -1px; left: 20px;
    width: 40px; height: 1px;
    background: #c9a96e;
    opacity: 0.5;
  }
  .analysis-title {
    font-family: 'Cinzel', serif;
    font-size: 13px;
    color: #e8e0d5;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .analysis-sub {
    font-family: 'EB Garamond', serif;
    font-size: 12px;
    color: #5a5060;
    font-weight: normal;
    margin-left: 4px;
  }
  .analysis-text {
    font-size: 14px;
    color: #a09080;
    line-height: 1.85;
  }
  .footer {
    text-align: center;
    padding-top: 40px;
    border-top: 0.5px solid #2a2035;
    position: relative;
  }
  .footer::before {
    content: '';
    position: absolute;
    top: -1px; left: 50%;
    transform: translateX(-50%);
    width: 80px; height: 1px;
    background: #c9a96e; opacity: 0.4;
  }
  .footer-text { font-size: 11px; color: #3d3050; letter-spacing: 0.2em; }
  .ornament { color: #c9a96e; margin: 0 8px; opacity: 0.5; }
  @media (max-width: 600px) {
    .page { padding: 40px 20px; }
    .fields-grid { grid-template-columns: 1fr; }
    .char-name { font-size: 24px; }
  }
  @media print {
    body { background: #0d0b0f !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .page { padding: 20px; }
  }
</style>
</head>
<body>
<div class="page">
  <div class="header">
    <div class="psyche-brand">✦ &nbsp; P S Y C H E &nbsp; ✦</div>
    ${isDyn
      ? `<div class="dyn-names">
          <span class="dyn-name a">${char.name || "Персонаж А"}</span>
          <span class="dyn-sep">⚭</span>
          <span class="dyn-name b">${charB.name || "Персонаж Б"}</span>
        </div>
        <div class="char-date">Анализ динамики отношений</div>`
      : `<div class="avatar-circle">
          ${char.image ? `<img src="${char.image}" alt="${char.name}">` : (char.name ? char.name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() : "✦")}
        </div>
        <div class="char-name">${char.name || "Безымянный"}</div>
        ${char.birthdate ? `<div class="char-date">${char.birthdate}</div>` : ""}`
    }
  </div>

  ${!isDyn ? `
  <div class="section">
    <div class="section-title">Психологический профиль</div>
    <div class="fields-grid">
      ${field("Ключевое поведение", char.behavior)}
      ${field("Дата рождения", char.birthdate)}
      ${field("Детство и ранние травмы", char.childhood)}
      ${field("Главный страх", char.fear)}
      ${field("Желание / цель", char.desire)}
      ${field("Психологическая рана", char.wound)}
      ${char.mask ? `<div class="field full">${field("Маска / публичный фасад", char.mask)}</div>` : ""}
    </div>
  </div>` : `
  <div class="section">
    <div class="section-title">Профиль — ${char.name}</div>
    <div class="fields-grid">
      ${field("Поведение", char.behavior)}
      ${field("Страх", char.fear)}
      ${field("Желание", char.desire)}
      ${field("Рана", char.wound)}
    </div>
  </div>
  <div class="section">
    <div class="section-title">Профиль — ${charB.name}</div>
    <div class="fields-grid">
      ${field("Поведение", charB.behavior)}
      ${field("Страх", charB.fear)}
      ${field("Желание", charB.desire)}
      ${field("Рана", charB.wound)}
    </div>
  </div>`}

  ${!isDyn && analysisBlocks ? `
  <div class="section">
    <div class="section-title">Психоаналитические разборы</div>
    ${analysisBlocks}
  </div>` : ""}

  ${isDyn && dynBlocks ? `
  <div class="section">
    <div class="section-title">Динамика отношений</div>
    ${dynBlocks}
  </div>` : ""}

  <div class="footer">
    <div class="footer-text">
      <span class="ornament">✦</span>
      Создано в Psyche
      <span class="ornament">✦</span>
      ${new Date().toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
      <span class="ornament">✦</span>
    </div>
  </div>
</div>
</body>
</html>`;
};

const downloadHTML = (html, filename) => {
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// ── UI COMPONENTS ────────────────────────────────────────────────

function GothicFrame({ children, style = {} }) {
  return (
    <div style={{ position: "relative", border: `0.5px solid ${G.border}`, borderRadius: 12, background: G.surface, ...style }}>
      <div style={{ position: "absolute", top: -1, left: 20, width: 40, height: 1, background: G.accent, opacity: 0.6 }} />
      <div style={{ position: "absolute", bottom: -1, right: 20, width: 40, height: 1, background: G.accent, opacity: 0.4 }} />
      {children}
    </div>
  );
}

function Avatar({ char, size = 40 }) {
  const initials = char.name ? char.name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() : "✦";
  if (char.image) return <img src={char.image} alt={char.name} style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", border: `1px solid ${G.border}` }} />;
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: G.surfaceAlt, border: `1px solid ${G.border}`, color: G.accent, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 500, fontSize: size * 0.3, flexShrink: 0 }}>
      {initials}
    </div>
  );
}

function LoadingDots() {
  return (
    <div style={{ display: "flex", gap: 5, alignItems: "center", padding: "6px 0" }}>
      {[0, 0.2, 0.4].map((d, i) => <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: G.accent, animation: `pulse 1.2s ease-in-out ${d}s infinite` }} />)}
      <span style={{ fontSize: 12, color: G.textDim, marginLeft: 6, fontStyle: "italic" }}>обрабатываю...</span>
    </div>
  );
}

function AnalysisBlock({ analyst, text, loading }) {
  const [open, setOpen] = useState(true);
  return (
    <GothicFrame style={{ overflow: "hidden" }}>
      <div onClick={() => setOpen(o => !o)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", cursor: "pointer", borderBottom: open ? `0.5px solid ${G.border}` : "none" }}>
        <span style={{ fontSize: 18 }}>{analyst.icon}</span>
        <span style={{ fontWeight: 500, fontSize: 13, color: G.text }}>{analyst.name}</span>
        <span style={{ fontSize: 11, color: G.textDim, marginLeft: 4 }} className="hide-mobile">{analyst.short}</span>
        <span style={{ marginLeft: "auto", color: G.textDim, fontSize: 12, transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>▾</span>
      </div>
      {open && (
        <div style={{ padding: "14px 16px" }}>
          {loading ? <LoadingDots /> : text
            ? <div style={{ fontSize: 13, color: G.textMid, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{text}</div>
            : <div style={{ fontSize: 12, color: G.textDim, fontStyle: "italic" }}>Нажмите «Запустить анализ»</div>
          }
        </div>
      )}
    </GothicFrame>
  );
}

// ── BIO MODAL ────────────────────────────────────────────────────

function BioModal({ char, updateChar, onClose }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("");
  const [error, setError] = useState("");
  const fileRef = useRef();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setText(ev.target.result || "");
    reader.onerror = () => setError("Не удалось прочитать файл");
    reader.readAsText(file, "UTF-8");
  };

  const run = async () => {
    if (!text.trim()) return;
    setLoading(true); setError("");
    try {
      const bio = truncateBio(text.trim());
      let content = bio;

      if (text.trim().length > 12000) {
        setStep("Большой текст — сначала извлекаю суть...");
        content = await callClaude(
          "Из биографии персонажа извлеки ключевые психологические факты: имя, дата рождения, детство, страхи, желания, раны, маска, поведение. Будь подробным, не теряй важных деталей.",
          `Биография:\n\n${bio}`,
          2000
        );
      }

      setStep("Заполняю профиль...");
      const result = await callClaude(
        `Из текста извлеки ТОЛЬКО JSON без markdown:
{"name":"","birthdate":"ДД.ММ.ГГГГ или пусто","behavior":"подробно","childhood":"подробно","fear":"подробно","desire":"подробно","wound":"подробно","mask":"подробно"}`,
        `Текст:\n\n${content}`,
        1500
      );

      const p = JSON.parse(result.replace(/```json|```/g, "").trim());
      updateChar({
        ...(p.name && { name: p.name }),
        ...(p.birthdate && { birthdate: p.birthdate }),
        behavior: p.behavior || char.behavior,
        childhood: p.childhood || char.childhood,
        fear: p.fear || char.fear,
        desire: p.desire || char.desire,
        wound: p.wound || char.wound,
        mask: p.mask || char.mask,
      });
      onClose();
    } catch (e) {
      setError(`Ошибка: ${e.message}. Попробуйте ещё раз.`);
    }
    setLoading(false); setStep("");
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 12 }} onClick={e => e.target === e.currentTarget && onClose()}>
      <GothicFrame style={{ width: "min(680px,98vw)", maxHeight: "92vh", display: "flex", flexDirection: "column", padding: 20, gap: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 15, color: G.text }}>📄 Импорт биографии</div>
            <div style={{ fontSize: 12, color: G.textDim, marginTop: 4 }}>Вставьте или загрузите текст. AI разберёт поля сам.</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: G.textDim, fontSize: 20, cursor: "pointer" }}>×</button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <input ref={fileRef} type="file" accept=".txt,.md" style={{ display: "none" }} onChange={handleFile} />
          <button onClick={() => fileRef.current.click()} style={{ padding: "7px 14px", background: "none", border: `0.5px solid ${G.border}`, borderRadius: 7, fontSize: 12, color: G.textMid, cursor: "pointer", fontFamily: "inherit" }}>
            📂 Загрузить .txt файл
          </button>
          <span style={{ fontSize: 11, color: G.textDim }}>или вставьте текст ниже</span>
        </div>

        <textarea value={text} onChange={e => setText(e.target.value)}
          placeholder="Вставьте биографию — анкету, описание, историю. До 40 000 символов."
          style={{ flex: 1, minHeight: 200, maxHeight: "40vh", background: G.bg, border: `0.5px solid ${G.border}`, borderRadius: 10, padding: "12px 14px", fontSize: 13, fontFamily: "inherit", lineHeight: 1.7, resize: "vertical", color: G.text, outline: "none" }}
        />

        {text.length > 12000 && (
          <div style={{ fontSize: 11, color: G.accent, background: G.accentSoft, borderRadius: 6, padding: "6px 10px", border: `0.5px solid ${G.accentDim}` }}>
            ✦ Большой текст ({text.length.toLocaleString()} симв.) — обработка займёт ~15 сек.
          </div>
        )}

        {error && <div style={{ fontSize: 12, color: G.red, background: "rgba(201,110,110,0.1)", borderRadius: 6, padding: "8px 12px", border: `0.5px solid ${G.red}` }}>⚠ {error}</div>}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <div style={{ fontSize: 11, color: text.length > 40000 ? G.red : G.textDim }}>{text.length.toLocaleString()} / 40 000</div>
          {loading && <div style={{ fontSize: 11, color: G.accent, fontStyle: "italic" }}>{step}</div>}
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={onClose} style={{ padding: "8px 16px", background: "none", border: `0.5px solid ${G.border}`, borderRadius: 8, fontSize: 13, color: G.textMid, cursor: "pointer", fontFamily: "inherit" }}>Отмена</button>
            <button onClick={run} disabled={loading || !text.trim()} style={{ padding: "8px 20px", background: G.accent, border: "none", borderRadius: 8, fontSize: 13, color: "#0d0b0f", fontWeight: 600, cursor: loading ? "wait" : "pointer", fontFamily: "inherit", opacity: loading || !text.trim() ? 0.6 : 1 }}>
              {loading ? "Читаю..." : "✦ Заполнить профиль"}
            </button>
          </div>
        </div>
      </GothicFrame>
    </div>
  );
}

// ── EXPORT MODAL ─────────────────────────────────────────────────

function ExportModal({ chars, char, dynResult, dynCharB, onClose }) {
  const [done, setDone] = useState("");
  const charB = chars.find(c => c.id === dynCharB);
  const hasDyn = dynResult && Object.keys(dynResult).length > 0 && charB;

  const exportChar = () => {
    const html = buildExportHTML(char);
    downloadHTML(html, `${char.name || "персонаж"}_досье.html`);
    setDone("Досье скачано!");
    setTimeout(() => setDone(""), 3000);
  };

  const exportDyn = () => {
    if (!hasDyn) return;
    const html = buildExportHTML(char, dynResult, charB);
    downloadHTML(html, `${char.name}_${charB.name}_динамика.html`);
    setDone("Динамика скачана!");
    setTimeout(() => setDone(""), 3000);
  };

  const exportJSON = () => {
    const data = JSON.stringify({ version: "2.0", exportedAt: new Date().toISOString(), characters: chars.map(c => ({ ...c, image: c.image ? "[img]" : null })) }, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "psyche_backup.json";
    document.body.appendChild(a); a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDone("Резервная копия скачана!");
    setTimeout(() => setDone(""), 3000);
  };

  const importJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const data = JSON.parse(ev.target.result);
        if (data.characters) {
          alert(`Будет загружено ${data.characters.length} персонажей. Текущие данные будут заменены.`);
          saveChars(data.characters);
          window.location.reload();
        }
      } catch { alert("Неверный формат файла"); }
    };
    reader.readAsText(file);
  };

  const importRef = useRef();

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 }} onClick={e => e.target === e.currentTarget && onClose()}>
      <GothicFrame style={{ width: "min(440px,96vw)", padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={{ fontWeight: 600, fontSize: 15, color: G.text }}>✦ Экспорт и сохранение</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: G.textDim, fontSize: 20, cursor: "pointer" }}>×</button>
        </div>

        {done && <div style={{ background: "#1a2a1a", border: `0.5px solid ${G.green}`, borderRadius: 8, padding: "8px 12px", fontSize: 12, color: G.green, marginBottom: 14 }}>✓ {done}</div>}

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: 10, color: G.textDim, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 4 }}>Красивые выгрузки</div>

          <button onClick={exportChar} style={{ padding: "12px 16px", background: G.accentSoft, border: `0.5px solid ${G.accentDim}`, borderRadius: 10, fontSize: 13, cursor: "pointer", textAlign: "left", fontFamily: "inherit", color: G.text, display: "flex", alignItems: "center", gap: 10 }}>
            <span>📜</span>
            <div>
              <div style={{ fontWeight: 500 }}>Досье персонажа</div>
              <div style={{ fontSize: 11, color: G.textDim, marginTop: 2 }}>{char.name || "Безымянный"} — красивый HTML файл</div>
            </div>
          </button>

          {hasDyn ? (
            <button onClick={exportDyn} style={{ padding: "12px 16px", background: G.purpleSoft, border: `0.5px solid ${G.purpleDim}`, borderRadius: 10, fontSize: 13, cursor: "pointer", textAlign: "left", fontFamily: "inherit", color: G.text, display: "flex", alignItems: "center", gap: 10 }}>
              <span>⚭</span>
              <div>
                <div style={{ fontWeight: 500 }}>Динамика отношений</div>
                <div style={{ fontSize: 11, color: G.textDim, marginTop: 2 }}>{char.name} × {charB.name} — красивый HTML файл</div>
              </div>
            </button>
          ) : (
            <div style={{ padding: "12px 16px", background: G.surfaceAlt, border: `0.5px solid ${G.border}`, borderRadius: 10, fontSize: 12, color: G.textDim, fontStyle: "italic" }}>
              ⚭ Сделайте анализ динамики чтобы экспортировать
            </div>
          )}

          <div style={{ fontSize: 10, color: G.textDim, textTransform: "uppercase", letterSpacing: "0.15em", marginTop: 8, marginBottom: 4 }}>Резервная копия</div>

          <button onClick={exportJSON} style={{ padding: "12px 16px", background: G.surfaceAlt, border: `0.5px solid ${G.border}`, borderRadius: 10, fontSize: 13, cursor: "pointer", textAlign: "left", fontFamily: "inherit", color: G.text, display: "flex", alignItems: "center", gap: 10 }}>
            <span>💾</span>
            <div>
              <div style={{ fontWeight: 500 }}>Скачать резервную копию</div>
              <div style={{ fontSize: 11, color: G.textDim, marginTop: 2 }}>JSON со всеми персонажами и анализами</div>
            </div>
          </button>

          <input ref={importRef} type="file" accept=".json" style={{ display: "none" }} onChange={importJSON} />
          <button onClick={() => importRef.current.click()} style={{ padding: "12px 16px", background: G.surfaceAlt, border: `0.5px solid ${G.border}`, borderRadius: 10, fontSize: 13, cursor: "pointer", textAlign: "left", fontFamily: "inherit", color: G.textMid, display: "flex", alignItems: "center", gap: 10 }}>
            <span>📂</span>
            <div>
              <div style={{ fontWeight: 500 }}>Восстановить из копии</div>
              <div style={{ fontSize: 11, color: G.textDim, marginTop: 2 }}>Загрузить JSON файл (заменит текущие данные)</div>
            </div>
          </button>
        </div>
      </GothicFrame>
    </div>
  );
}

// ── MAIN APP ─────────────────────────────────────────────────────

export default function PsycheApp() {
  const [chars, setChars] = useState([]);
  const [dbLoading, setDbLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState("");
  const [activeId, setActiveId] = useState(null);
  const [tab, setTab] = useState("profile");
  const [analysisGroup, setAnalysisGroup] = useState(Object.keys(ANALYSTS_GROUPS)[0]);
  const [selectedAnalysts, setSelectedAnalysts] = useState(ALL_ANALYSTS.map(a => a.id));
  const [loadingAnalysts, setLoadingAnalysts] = useState({});
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [showBio, setShowBio] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dynCharA, setDynCharA] = useState(null);
  const [dynCharB, setDynCharB] = useState(null);
  const [dynAspects, setDynAspects] = useState(["attraction", "conflict", "power", "wounds", "growth", "shadow", "future"]);
  const [dynResult, setDynResult] = useState({});
  const [dynLoading, setDynLoading] = useState({});
  const [chatHistories, setChatHistories] = useState({});
  const [forecastResult, setForecastResult] = useState("");
  const [forecastLoading, setForecastLoading] = useState(false);
  const [forecastType, setForecastType] = useState("quick");

  const fileInputRef = useRef();
  const chatEndRef = useRef();

  useEffect(() => {
    const saved = loadChars();
    if (saved && saved.length > 0) {
      setChars(saved);
      setActiveId(saved[0].id);
    } else {
      const nc = { ...emptyChar(), name: "Новый персонаж" };
      setChars([nc]);
      setActiveId(nc.id);
    }
    setDbLoading(false);
  }, []);

  useEffect(() => {
    if (dbLoading || chars.length === 0) return;
    const t = setTimeout(() => {
      const ok = saveChars(chars);
      setSaveStatus(ok ? "saved" : "error");
      setTimeout(() => setSaveStatus(""), 2000);
    }, 800);
    return () => clearTimeout(t);
  }, [chars, dbLoading]);

  const char = chars.find(c => c.id === activeId);
  const updateChar = (fields) => setChars(cs => cs.map(c => c.id === activeId ? { ...c, ...fields } : c));

  const switchChar = (id) => {
    setChatHistories(h => ({ ...h, [activeId]: chatMessages }));
    setActiveId(id);
    setChatMessages(chatHistories[id] || []);
    setSidebarOpen(false);
  };

  const addChar = () => {
    const nc = emptyChar();
    setChars(cs => [...cs, nc]);
    setActiveId(nc.id);
    setChatMessages([]);
    setTab("profile");
    setSidebarOpen(false);
  };

  const deleteChar = (id) => {
    const remaining = chars.filter(x => x.id !== id);
    if (remaining.length === 0) {
      const nc = { ...emptyChar(), name: "Новый персонаж" };
      setChars([nc]); setActiveId(nc.id);
    } else {
      setChars(remaining);
      if (activeId === id) setActiveId(remaining[0].id);
    }
    try { localStorage.removeItem(`psyche_img_${id}`); } catch {}
  };

  const buildSummary = (c) =>
    `Имя: ${c.name || "Безымянный"}\nДата рождения: ${c.birthdate || "—"}\nПоведение: ${c.behavior || "—"}\nДетство/травмы: ${c.childhood || "—"}\nСтрах: ${c.fear || "—"}\nЖелание: ${c.desire || "—"}\nРана: ${c.wound || "—"}\nМаска: ${c.mask || "—"}`;

  const analyzeAll = async () => {
    if (!char) return;
    const summary = buildSummary(char);
    const groupAnalysts = ANALYSTS_GROUPS[analysisGroup] || [];
    const toRun = groupAnalysts.filter(a => selectedAnalysts.includes(a.id));
    if (toRun.length === 0) return;

    setLoadingAnalysts(Object.fromEntries(toRun.map(a => [a.id, true])));

    for (const analyst of toRun) {
      try {
        const text = await callClaude(
          `${ANALYST_PROMPTS[analyst.id]}\n\nОтвечай только на русском. Без markdown — только чистый текст.`,
          `Профиль:\n${summary}`,
          1000
        );
        setChars(cs => cs.map(c => c.id === activeId ? { ...c, analyses: { ...(c.analyses || {}), [analyst.id]: text } } : c));
      } catch (e) {
        setChars(cs => cs.map(c => c.id === activeId ? { ...c, analyses: { ...(c.analyses || {}), [analyst.id]: `Ошибка: ${e.message}` } } : c));
      }
      setLoadingAnalysts(prev => ({ ...prev, [analyst.id]: false }));
      await new Promise(r => setTimeout(r, 400));
    }
  };

  const DYN_ASPECTS = [
    { id: "attraction", icon: "✦", label: "Притяжение и химия", prompt: "Опиши психологическую природу притяжения между персонажами на уровне бессознательного." },
    { id: "conflict", icon: "⚔️", label: "Конфликт и трение", prompt: "Опиши основные точки конфликта: какие ценности, страхи и паттерны сталкиваются." },
    { id: "power", icon: "👑", label: "Власть и иерархия", prompt: "Проанализируй динамику власти: кто доминирует явно и скрыто." },
    { id: "wounds", icon: "💔", label: "Ранящие паттерны", prompt: "Как их раны взаимодействуют, усиливают или эксплуатируют друг друга?" },
    { id: "growth", icon: "🌿", label: "Рост и исцеление", prompt: "Как эти отношения могут способствовать росту каждого?" },
    { id: "shadow", icon: "🖤", label: "Теневая динамика", prompt: "Что каждый проецирует на другого? Как их Тени взаимодействуют?" },
    { id: "future", icon: "🔮", label: "Вероятное будущее", prompt: "Три сценария: токсичный, нейтральный и трансформационный." },
    { id: "archetype", icon: "🌙", label: "Архетипическая пара", prompt: "Какой миф или архетип они воплощают вместе?" },
    { id: "communication", icon: "💬", label: "Коммуникация", prompt: "Как они общаются, есть ли хронические недопонимания?" },
  ];

  const runDynamics = async (aspectId) => {
    const a = chars.find(c => c.id === dynCharA);
    const b = chars.find(c => c.id === dynCharB);
    if (!a || !b) return;
    const aspect = DYN_ASPECTS.find(x => x.id === aspectId);
    if (!aspect) return;

    setDynLoading(p => ({ ...p, [aspectId]: true }));
    try {
      const text = await callClaude(
        `Ты эксперт по психологии отношений. ${aspect.prompt}\n\nПиши глубоко, конкретно, опирайся на профили. 200-250 слов. Только русский. Без markdown.`,
        `ПЕРСОНАЖ А — ${a.name}:\n${buildSummary(a)}\n\n────────────────────────\n\nПЕРСОНАЖ Б — ${b.name}:\n${buildSummary(b)}`,
        1000
      );
      setDynResult(p => ({ ...p, [aspectId]: text }));
    } catch (e) {
      setDynResult(p => ({ ...p, [aspectId]: `Ошибка: ${e.message}` }));
    }
    setDynLoading(p => ({ ...p, [aspectId]: false }));
  };

  const runAllDynamics = async () => {
    for (const aspect of DYN_ASPECTS.filter(a => dynAspects.includes(a.id))) {
      await runDynamics(aspect.id);
    }
  };

  const runForecast = async () => {
    if (!char) return;
    setForecastLoading(true); setForecastResult("");
    const SITUATIONS = {
      quick: "Конфликт, успех, провал, потеря близкого, моральный выбор",
      deep: "Столкновение с травмой, моральный выбор",
      crisis: "Экстремальная ситуация, провал, конфликт",
      daily: "Любовь/близость, власть, успех",
      relations: "Любовь, конфликт, соблазн",
    };
    try {
      const text = await callClaude(
        "Ты эксперт по психоанализу. Для каждой ситуации опиши: эмоциональная реакция, защитные механизмы, маска vs тень, вероятные действия, последствия. Только русский. Без markdown.",
        `Профиль:\n${buildSummary(char)}\n\nСитуации:\n${SITUATIONS[forecastType] || SITUATIONS.quick}`,
        1200
      );
      setForecastResult(text);
    } catch (e) { setForecastResult(`Ошибка: ${e.message}`); }
    setForecastLoading(false);
  };

  const sendChat = async () => {
    if (!chatInput.trim() || chatLoading || !char) return;
    const msg = chatInput.trim(); setChatInput("");
    const newMsgs = [...chatMessages, { role: "user", content: msg }];
    setChatMessages(newMsgs); setChatLoading(true);

    const apiMsgs = [];
    for (const m of newMsgs) {
      if (m.role !== "user" && m.role !== "assistant") continue;
      if (apiMsgs.length > 0 && apiMsgs[apiMsgs.length - 1].role === m.role)
        apiMsgs[apiMsgs.length - 1].content += "\n" + m.content;
      else apiMsgs.push({ role: m.role, content: m.content });
    }

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: `Ты персонаж ${char.name || "Безымянный"}. Профиль:\n${buildSummary(char)}\n\nОтвечай от 1-го лица. Физические детали — *курсивом со звёздочками*. После реплики поставь "---" и 2-3 предложения нарратора-психолога. Только русский.`,
          messages: apiMsgs,
        }),
      });
      const d = await res.json();
      if (d.error) throw new Error(d.error.message);
      setChatMessages([...newMsgs, { role: "assistant", content: d.content?.[0]?.text || "..." }]);
    } catch (e) {
      setChatMessages([...newMsgs, { role: "assistant", content: `Ошибка: ${e.message}` }]);
    }
    setChatLoading(false);
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const renderChatMsg = (content) => content.split(/(\*[^*]+\*)/g).map((p, i) => {
    if (p.startsWith("*") && p.endsWith("*")) return <em key={i} style={{ color: G.accent, fontStyle: "italic" }}>{p.slice(1, -1)}</em>;
    return <span key={i}>{p}</span>;
  });

  const Field = ({ label, value, onChange, rows, placeholder }) => (
    <div>
      <div style={{ fontSize: 10, color: G.textDim, marginBottom: 5, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</div>
      {rows
        ? <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows} placeholder={placeholder} style={{ width: "100%", background: G.bg, border: `0.5px solid ${G.border}`, borderRadius: 8, padding: "8px 11px", fontSize: 13, fontFamily: "inherit", lineHeight: 1.6, resize: "vertical", color: G.text, outline: "none", boxSizing: "border-box" }} onFocus={e => e.target.style.borderColor = G.accentDim} onBlur={e => e.target.style.borderColor = G.border} />
        : <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ width: "100%", background: G.bg, border: `0.5px solid ${G.border}`, borderRadius: 8, padding: "8px 11px", fontSize: 13, fontFamily: "inherit", color: G.text, outline: "none", boxSizing: "border-box" }} onFocus={e => e.target.style.borderColor = G.accentDim} onBlur={e => e.target.style.borderColor = G.border} />
      }
    </div>
  );

  const isLoading = Object.values(loadingAnalysts).some(v => v);
  const groupAnalysts = ANALYSTS_GROUPS[analysisGroup] || [];

  if (dbLoading || !char) return (
    <div style={{ minHeight: "100vh", background: G.bg, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
      <div style={{ fontFamily: "Georgia,serif", fontSize: 28, color: G.accent, animation: "pulse 2s ease-in-out infinite" }}>✦</div>
      <style>{`@keyframes pulse{0%,100%{opacity:0.3}50%{opacity:1}}`}</style>
    </div>
  );

  return (
    <div style={{ fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',Georgia,sans-serif", minHeight: "100vh", background: G.bg, color: G.text, display: "flex", flexDirection: "column" }}>
      <style>{`
        @keyframes pulse{0%,100%{opacity:0.25}50%{opacity:1}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:3px;height:3px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:${G.border};border-radius:2px}
        textarea,input{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Georgia,sans-serif}
        .hov:hover{color:${G.accent}!important;border-color:${G.accentDim}!important}
        @media(max-width:600px){
          .desktop-sidebar{display:none!important}
          .mob-menu{display:flex!important}
          .hide-mobile{display:none!important}
          .profile-grid{grid-template-columns:1fr!important}
          .tab-full{display:none}
          .tab-icon{display:inline}
          .main-pad{padding:14px!important}
        }
        @media(min-width:601px){
          .mob-overlay{display:none!important}
          .mob-menu{display:none!important}
          .tab-icon{display:none}
        }
      `}</style>

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div className="mob-overlay" style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex" }} onClick={() => setSidebarOpen(false)}>
          <div style={{ width: 220, background: G.surface, borderRight: `0.5px solid ${G.border}`, display: "flex", flexDirection: "column", padding: "12px 8px", gap: 4, overflowY: "auto" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 8px 12px" }}>
              <div style={{ fontSize: 9, color: G.textDim, textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 600 }}>Персонажи</div>
              <button onClick={() => setSidebarOpen(false)} style={{ background: "none", border: "none", color: G.textDim, fontSize: 18, cursor: "pointer" }}>×</button>
            </div>
            {chars.map(c => (
              <div key={c.id} style={{ display: "flex", alignItems: "center", borderRadius: 8, border: `0.5px solid ${c.id === activeId ? G.borderLight : "transparent"}`, background: c.id === activeId ? G.surfaceAlt : "transparent" }}>
                <div onClick={() => switchChar(c.id)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", flex: 1, cursor: "pointer", minWidth: 0 }}>
                  <Avatar char={c} size={28} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: c.id === activeId ? G.accent : G.textMid, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name || "Безымянный"}</div>
                  </div>
                </div>
                {chars.length > 1 && <button onClick={() => { if (window.confirm(`Удалить «${c.name}»?`)) deleteChar(c.id); }} style={{ background: "none", border: "none", color: G.textDim, cursor: "pointer", fontSize: 14, padding: "4px 8px", opacity: 0.4 }}>×</button>}
              </div>
            ))}
            <button onClick={addChar} style={{ marginTop: 8, padding: "7px", background: "none", border: `0.5px dashed ${G.border}`, borderRadius: 8, fontSize: 12, color: G.textDim, cursor: "pointer", fontFamily: "inherit" }}>＋ Новый</button>
          </div>
          <div style={{ flex: 1, background: "rgba(0,0,0,0.5)" }} />
        </div>
      )}

      {/* TOP BAR */}
      <div style={{ background: G.surface, borderBottom: `0.5px solid ${G.border}`, display: "flex", alignItems: "center", padding: "0 12px", height: 50, gap: 6, position: "sticky", top: 0, zIndex: 100, flexShrink: 0 }}>
        <button className="mob-menu" onClick={() => setSidebarOpen(o => !o)} style={{ background: "none", border: "none", color: G.textMid, fontSize: 20, cursor: "pointer", padding: 4, lineHeight: 1, flexShrink: 0 }}>☰</button>
        <div style={{ fontFamily: "Georgia,serif", fontWeight: 700, fontSize: 15, color: G.accent, letterSpacing: "0.1em", marginRight: 8, flexShrink: 0 }}>✦ PSYCHE</div>
        <div style={{ display: "flex", gap: 0, flex: 1, overflowX: "auto" }}>
          {[
            { id: "profile", full: "Профиль", icon: "👤" },
            { id: "analysis", full: "Анализ", icon: "🔬" },
            { id: "forecast", full: "Прогноз", icon: "🔮" },
            { id: "dynamics", full: "Динамика", icon: "⚭" },
            { id: "chat", full: "Диалог", icon: "💬" },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ background: "none", border: "none", padding: "0 10px", height: 50, fontSize: 13, cursor: "pointer", color: tab === t.id ? G.accent : G.textDim, borderBottom: tab === t.id ? `1.5px solid ${G.accent}` : "1.5px solid transparent", whiteSpace: "nowrap", fontFamily: "inherit", transition: "color 0.15s" }}>
              <span className="tab-full">{t.full}</span>
              <span className="tab-icon">{t.icon}</span>
            </button>
          ))}
        </div>
        <button onClick={() => setShowExport(true)} style={{ background: "none", border: `0.5px solid ${G.border}`, borderRadius: 7, padding: "6px 12px", fontSize: 12, color: G.textMid, cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }} className="hov">✦ Экспорт</button>
        {saveStatus === "saved" && <div style={{ fontSize: 11, color: G.green, flexShrink: 0 }}>✓</div>}
        {saveStatus === "error" && <div style={{ fontSize: 11, color: G.red, flexShrink: 0 }}>⚠</div>}
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* DESKTOP SIDEBAR */}
        <div className="desktop-sidebar" style={{ width: 190, background: G.surface, borderRight: `0.5px solid ${G.border}`, display: "flex", flexDirection: "column", padding: "12px 8px", gap: 4, overflowY: "auto", flexShrink: 0 }}>
          <div style={{ fontSize: 9, color: G.textDim, textTransform: "uppercase", letterSpacing: "0.15em", padding: "4px 8px 8px", fontWeight: 600 }}>Персонажи</div>
          {chars.map(c => (
            <div key={c.id} style={{ display: "flex", alignItems: "center", borderRadius: 8, border: `0.5px solid ${c.id === activeId ? G.borderLight : "transparent"}`, background: c.id === activeId ? G.surfaceAlt : "transparent", overflow: "hidden" }}>
              <div onClick={() => switchChar(c.id)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", flex: 1, cursor: "pointer", minWidth: 0 }}>
                <Avatar char={c} size={28} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: c.id === activeId ? G.accent : G.textMid, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name || "Безымянный"}</div>
                  {c.analyses && Object.keys(c.analyses).length > 0 && <div style={{ fontSize: 9, color: G.textDim }}>✦ {Object.keys(c.analyses).length} анализов</div>}
                </div>
              </div>
              {chars.length > 1 && <button onClick={() => { if (window.confirm(`Удалить «${c.name}»?`)) deleteChar(c.id); }} style={{ background: "none", border: "none", color: G.textDim, cursor: "pointer", fontSize: 14, padding: "4px 8px", opacity: 0.35 }}>×</button>}
            </div>
          ))}
          <button onClick={addChar} style={{ marginTop: 8, padding: "7px", background: "none", border: `0.5px dashed ${G.border}`, borderRadius: 8, fontSize: 12, color: G.textDim, cursor: "pointer", fontFamily: "inherit" }} className="hov">＋ Новый</button>
        </div>

        {/* MAIN CONTENT */}
        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>

          {/* PROFILE */}
          {tab === "profile" && (
            <div className="main-pad" style={{ padding: "20px", maxWidth: 660, display: "flex", flexDirection: "column", gap: 16, animation: "fadeIn 0.3s ease" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                <div style={{ position: "relative", cursor: "pointer", flexShrink: 0 }} onClick={() => fileInputRef.current.click()}>
                  <Avatar char={char} size={64} />
                  <div style={{ position: "absolute", bottom: 0, right: 0, width: 20, height: 20, background: G.accent, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: G.bg, fontWeight: 700 }}>+</div>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = ev => updateChar({ image: ev.target.result }); r.readAsDataURL(f); }} />
                <div style={{ flex: 1, minWidth: 180 }}>
                  <div style={{ fontSize: 10, color: G.textDim, marginBottom: 5, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>Имя персонажа</div>
                  <input value={char.name} onChange={e => updateChar({ name: e.target.value })} placeholder="Введите имя..."
                    style={{ width: "100%", background: "none", border: "none", borderBottom: `0.5px solid ${G.border}`, padding: "4px 0", fontSize: 20, fontWeight: 600, color: G.text, outline: "none", fontFamily: "Georgia,serif" }}
                    onFocus={e => e.target.style.borderBottomColor = G.accent} onBlur={e => e.target.style.borderBottomColor = G.border} />
                </div>
              </div>
              <Field label="Дата рождения" value={char.birthdate || ""} onChange={v => updateChar({ birthdate: v })} placeholder="ДД.ММ.ГГГГ" />
              <Field label="Ключевое поведение" value={char.behavior} onChange={v => updateChar({ behavior: v })} rows={3} placeholder="Как персонаж ведёт себя?" />
              <div className="profile-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <Field label="Детство и ранние травмы" value={char.childhood} onChange={v => updateChar({ childhood: v })} rows={3} placeholder="Отец, мать, ключевые события..." />
                <Field label="Главный страх" value={char.fear} onChange={v => updateChar({ fear: v })} rows={3} placeholder="Чего боится больше всего?" />
                <Field label="Желание / цель" value={char.desire} onChange={v => updateChar({ desire: v })} rows={3} placeholder="Чего хочет на самом деле?" />
                <Field label="Психологическая рана" value={char.wound} onChange={v => updateChar({ wound: v })} rows={3} placeholder="Что сломало его в прошлом?" />
              </div>
              <Field label="Маска / публичный фасад" value={char.mask} onChange={v => updateChar({ mask: v })} rows={2} placeholder="Каким хочет казаться?" />
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button onClick={() => setTab("analysis")} style={{ padding: "9px 20px", background: G.accent, border: "none", borderRadius: 8, fontSize: 13, color: G.bg, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>К анализу →</button>
                <button onClick={() => setShowBio(true)} style={{ padding: "9px 16px", background: "none", border: `0.5px solid ${G.border}`, borderRadius: 8, fontSize: 13, color: G.textMid, cursor: "pointer", fontFamily: "inherit" }} className="hov">📄 Вставить биографию</button>
                <button onClick={() => setShowExport(true)} style={{ padding: "9px 16px", background: "none", border: `0.5px solid ${G.border}`, borderRadius: 8, fontSize: 13, color: G.textMid, cursor: "pointer", fontFamily: "inherit" }} className="hov">💾 Экспорт</button>
              </div>
            </div>
          )}

          {/* ANALYSIS */}
          {tab === "analysis" && (
            <div className="main-pad" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 14, animation: "fadeIn 0.3s ease" }}>
              <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 2 }}>
                {Object.keys(ANALYSTS_GROUPS).map(g => (
                  <button key={g} onClick={() => setAnalysisGroup(g)} style={{ padding: "6px 12px", borderRadius: 20, border: `0.5px solid ${analysisGroup === g ? G.accentDim : G.border}`, background: analysisGroup === g ? G.accentSoft : "none", color: analysisGroup === g ? G.accent : G.textDim, fontSize: 11, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>{g}</button>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(155px,1fr))", gap: 7 }}>
                {groupAnalysts.map(a => (
                  <div key={a.id} onClick={() => setSelectedAnalysts(p => p.includes(a.id) ? p.filter(x => x !== a.id) : [...p, a.id])} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 11px", borderRadius: 8, cursor: "pointer", border: `0.5px solid ${selectedAnalysts.includes(a.id) ? G.accentDim : G.border}`, background: selectedAnalysts.includes(a.id) ? G.accentSoft : "none" }}>
                    <span style={{ fontSize: 15 }}>{a.icon}</span>
                    <span style={{ fontSize: 12, fontWeight: 500, color: selectedAnalysts.includes(a.id) ? G.accent : G.textMid }}>{a.name}</span>
                    {selectedAnalysts.includes(a.id) && <span style={{ marginLeft: "auto", color: G.accent, fontSize: 11 }}>✓</span>}
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                <button onClick={analyzeAll} disabled={!selectedAnalysts.some(id => groupAnalysts.find(a => a.id === id)) || isLoading || (!char.name && !char.behavior)}
                  style={{ padding: "9px 20px", background: G.accent, border: "none", borderRadius: 8, fontSize: 13, color: G.bg, fontWeight: 600, cursor: isLoading ? "wait" : "pointer", fontFamily: "inherit", opacity: isLoading ? 0.7 : 1 }}>
                  {isLoading ? "⏳ Анализирую..." : `✦ Запустить анализ (${selectedAnalysts.filter(id => groupAnalysts.find(a => a.id === id)).length})`}
                </button>
                {isLoading && <span style={{ fontSize: 11, color: G.textDim, fontStyle: "italic" }}>анализы идут по очереди...</span>}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {groupAnalysts.filter(a => selectedAnalysts.includes(a.id)).map(a => (
                  <AnalysisBlock key={a.id} analyst={a} text={char.analyses?.[a.id]} loading={!!loadingAnalysts[a.id]} />
                ))}
              </div>
            </div>
          )}

          {/* FORECAST */}
          {tab === "forecast" && (
            <div className="main-pad" style={{ padding: "20px", maxWidth: 680, display: "flex", flexDirection: "column", gap: 16, animation: "fadeIn 0.3s ease" }}>
              <div style={{ fontFamily: "Georgia,serif", fontSize: 16, color: G.accent }}>🔮 Прогноз поведения</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 8 }}>
                {[{ id: "quick", l: "⚡ Быстрый" }, { id: "deep", l: "🔬 Глубокий" }, { id: "crisis", l: "🆘 Кризис" }, { id: "daily", l: "☀️ Повседневный" }, { id: "relations", l: "❤️ Отношения" }].map(t => (
                  <div key={t.id} onClick={() => setForecastType(t.id)} style={{ padding: "10px 12px", borderRadius: 9, cursor: "pointer", border: `0.5px solid ${forecastType === t.id ? G.accentDim : G.border}`, background: forecastType === t.id ? G.accentSoft : "none", color: forecastType === t.id ? G.accent : G.textMid, fontSize: 13, textAlign: "center" }}>{t.l}</div>
                ))}
              </div>
              <button onClick={runForecast} disabled={forecastLoading || (!char.name && !char.behavior)}
                style={{ alignSelf: "flex-start", padding: "10px 22px", background: G.accent, border: "none", borderRadius: 8, fontSize: 13, color: G.bg, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", opacity: forecastLoading ? 0.7 : 1 }}>
                {forecastLoading ? "Генерирую..." : "🔮 Создать прогноз"}
              </button>
              {(forecastResult || forecastLoading) && (
                <GothicFrame style={{ padding: "16px 18px" }}>
                  {forecastLoading ? <LoadingDots /> : <div style={{ fontSize: 13, color: G.textMid, lineHeight: 1.85, whiteSpace: "pre-wrap" }}>{forecastResult}</div>}
                </GothicFrame>
              )}
            </div>
          )}

          {/* DYNAMICS */}
          {tab === "dynamics" && (
            <div className="main-pad" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 18, animation: "fadeIn 0.3s ease", maxWidth: 760 }}>
              <div style={{ fontFamily: "Georgia,serif", fontSize: 16, color: G.accent }}>⚭ Динамика персонажей</div>
              {chars.length < 2 ? (
                <div style={{ textAlign: "center", padding: "40px 20px", color: G.textDim }}>
                  <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.4 }}>⚭</div>
                  <div style={{ fontSize: 14, color: G.textMid, marginBottom: 16 }}>Нужно минимум два персонажа</div>
                  <button onClick={addChar} style={{ padding: "9px 20px", background: G.accent, border: "none", borderRadius: 8, fontSize: 13, color: G.bg, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>＋ Создать персонажа</button>
                </div>
              ) : (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 12, alignItems: "start" }}>
                    {[{ label: "Персонаж А", val: dynCharA, set: setDynCharA, color: G.accent, borderColor: G.accentDim, bg: G.accentSoft },
                      null,
                    { label: "Персонаж Б", val: dynCharB, set: setDynCharB, color: G.purple, borderColor: G.purpleDim, bg: G.purpleSoft }].map((side, si) => {
                      if (side === null) return <div key="sep" style={{ textAlign: "center", fontSize: 22, color: G.textDim, paddingTop: 32 }}>⚭</div>;
                      return (
                        <div key={si}>
                          <div style={{ fontSize: 10, color: G.textDim, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8, fontWeight: 600 }}>{side.label}</div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                            {chars.map(c => (
                              <div key={c.id} onClick={() => side.set(c.id)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 11px", borderRadius: 9, cursor: "pointer", border: `0.5px solid ${side.val === c.id ? side.borderColor : G.border}`, background: side.val === c.id ? side.bg : "none" }}>
                                <Avatar char={c} size={24} />
                                <span style={{ fontSize: 12, color: side.val === c.id ? side.color : G.textMid, fontWeight: side.val === c.id ? 600 : 400 }}>{c.name || "Безымянный"}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {dynCharA && dynCharB && dynCharA !== dynCharB && (
                    <>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 7 }}>
                        {DYN_ASPECTS.map(a => (
                          <div key={a.id} onClick={() => setDynAspects(p => p.includes(a.id) ? p.filter(x => x !== a.id) : [...p, a.id])} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 11px", borderRadius: 8, cursor: "pointer", border: `0.5px solid ${dynAspects.includes(a.id) ? G.accentDim : G.border}`, background: dynAspects.includes(a.id) ? G.accentSoft : "none" }}>
                            <span style={{ fontSize: 14 }}>{a.icon}</span>
                            <span style={{ fontSize: 12, color: dynAspects.includes(a.id) ? G.accent : G.textMid }}>{a.label}</span>
                            {dynAspects.includes(a.id) && <span style={{ marginLeft: "auto", color: G.accent, fontSize: 11 }}>✓</span>}
                          </div>
                        ))}
                      </div>

                      <GothicFrame style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                        <Avatar char={chars.find(c => c.id === dynCharA)} size={32} />
                        <span style={{ fontSize: 13, fontWeight: 600, color: G.accent, fontFamily: "Georgia,serif" }}>{chars.find(c => c.id === dynCharA)?.name}</span>
                        <span style={{ fontSize: 18, color: G.textDim }}>⚭</span>
                        <Avatar char={chars.find(c => c.id === dynCharB)} size={32} />
                        <span style={{ fontSize: 13, fontWeight: 600, color: G.purple, fontFamily: "Georgia,serif" }}>{chars.find(c => c.id === dynCharB)?.name}</span>
                        <button onClick={runAllDynamics} disabled={Object.values(dynLoading).some(v => v) || dynAspects.length === 0}
                          style={{ marginLeft: "auto", padding: "8px 18px", background: G.accent, border: "none", borderRadius: 8, fontSize: 13, color: G.bg, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", opacity: Object.values(dynLoading).some(v => v) ? 0.6 : 1 }}>
                          {Object.values(dynLoading).some(v => v) ? "Анализирую..." : "✦ Запустить"}
                        </button>
                      </GothicFrame>

                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {DYN_ASPECTS.filter(a => dynAspects.includes(a.id)).map(aspect => (
                          <GothicFrame key={aspect.id} style={{ overflow: "hidden" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 16px", borderBottom: dynResult[aspect.id] || dynLoading[aspect.id] ? `0.5px solid ${G.border}` : "none" }}>
                              <span style={{ fontSize: 17 }}>{aspect.icon}</span>
                              <span style={{ fontSize: 13, fontWeight: 500, color: G.text }}>{aspect.label}</span>
                              {!dynResult[aspect.id] && !dynLoading[aspect.id] && (
                                <button onClick={() => runDynamics(aspect.id)} style={{ marginLeft: "auto", padding: "4px 12px", background: "none", border: `0.5px solid ${G.border}`, borderRadius: 6, fontSize: 11, color: G.textDim, cursor: "pointer", fontFamily: "inherit" }} className="hov">Запустить</button>
                              )}
                              {dynResult[aspect.id] && !dynLoading[aspect.id] && (
                                <button onClick={() => runDynamics(aspect.id)} style={{ marginLeft: "auto", padding: "4px 12px", background: "none", border: `0.5px solid ${G.border}`, borderRadius: 6, fontSize: 11, color: G.textDim, cursor: "pointer", fontFamily: "inherit" }} className="hov">↺</button>
                              )}
                            </div>
                            {dynLoading[aspect.id] && <div style={{ padding: "12px 16px" }}><LoadingDots /></div>}
                            {dynResult[aspect.id] && !dynLoading[aspect.id] && (
                              <div style={{ padding: "14px 16px", fontSize: 13, color: G.textMid, lineHeight: 1.85, whiteSpace: "pre-wrap" }}>{dynResult[aspect.id]}</div>
                            )}
                          </GothicFrame>
                        ))}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          )}

          {/* CHAT */}
          {tab === "chat" && (
            <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 50px)" }}>
              <div style={{ padding: "10px 16px", borderBottom: `0.5px solid ${G.border}`, display: "flex", alignItems: "center", gap: 12, background: G.surface, flexShrink: 0 }}>
                <Avatar char={char} size={30} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: G.text, fontFamily: "Georgia,serif" }}>{char.name || "Безымянный"}</div>
                  <div style={{ fontSize: 11, color: G.textDim }}>Диалог · психология в ролях</div>
                </div>
                <button onClick={() => setChatMessages([])} style={{ marginLeft: "auto", background: "none", border: `0.5px solid ${G.border}`, borderRadius: 6, padding: "4px 10px", fontSize: 11, color: G.textDim, cursor: "pointer", fontFamily: "inherit" }} className="hov">Очистить</button>
              </div>
              <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 12 }}>
                {chatMessages.length === 0 && (
                  <div style={{ textAlign: "center", padding: "50px 20px", color: G.textDim }}>
                    <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.5 }}>✦</div>
                    <div style={{ fontFamily: "Georgia,serif", fontSize: 14, color: G.textMid, marginBottom: 6 }}>{char.name || "Персонаж"} ждёт</div>
                    <div style={{ fontSize: 12, color: G.textDim, lineHeight: 1.6 }}>Жесты — курсивом. После реплики — психологический комментарий.</div>
                  </div>
                )}
                {chatMessages.map((m, i) => {
                  if (m.role === "user") return (
                    <div key={i} style={{ alignSelf: "flex-end", maxWidth: "80%", animation: "fadeIn 0.2s ease" }}>
                      <div style={{ background: G.purpleDim, color: G.text, borderRadius: "14px 14px 3px 14px", padding: "10px 14px", fontSize: 13, lineHeight: 1.65 }}>{m.content}</div>
                    </div>
                  );
                  const parts = m.content.split(/\n---\n|\n---$/);
                  return (
                    <div key={i} style={{ alignSelf: "flex-start", maxWidth: "88%", display: "flex", flexDirection: "column", gap: 8, animation: "fadeIn 0.2s ease" }}>
                      <GothicFrame style={{ padding: "12px 16px" }}>
                        <div style={{ fontSize: 13, color: G.text, lineHeight: 1.8 }}>{renderChatMsg(parts[0] || "")}</div>
                      </GothicFrame>
                      {parts[1] && <div style={{ background: G.accentSoft, border: `0.5px solid ${G.accentDim}`, borderRadius: 9, padding: "8px 12px", fontSize: 12, color: G.accentDim, lineHeight: 1.6, fontStyle: "italic" }}>✦ {parts[1].trim()}</div>}
                    </div>
                  );
                })}
                {chatLoading && <div style={{ alignSelf: "flex-start" }}><GothicFrame style={{ padding: "12px 16px", display: "inline-block" }}><LoadingDots /></GothicFrame></div>}
                <div ref={chatEndRef} />
              </div>
              <div style={{ padding: "10px 12px", borderTop: `0.5px solid ${G.border}`, background: G.surface, display: "flex", gap: 8, flexShrink: 0 }}>
                <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendChat())}
                  placeholder={`Обратитесь к ${char.name || "персонажу"}...`}
                  style={{ flex: 1, background: G.bg, border: `0.5px solid ${G.border}`, borderRadius: 10, padding: "9px 14px", fontSize: 13, color: G.text, fontFamily: "inherit", outline: "none" }}
                  onFocus={e => e.target.style.borderColor = G.accentDim} onBlur={e => e.target.style.borderColor = G.border}
                />
                <button onClick={sendChat} disabled={chatLoading || !chatInput.trim()} style={{ padding: "9px 16px", background: G.accent, border: "none", borderRadius: 10, fontSize: 13, color: G.bg, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", flexShrink: 0, opacity: chatLoading || !chatInput.trim() ? 0.5 : 1 }}>↑</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showBio && char && <BioModal char={char} updateChar={updateChar} onClose={() => setShowBio(false)} />}
      {showExport && char && <ExportModal chars={chars} char={char} dynResult={dynResult} dynCharB={dynCharB} onClose={() => setShowExport(false)} />}
    </div>
  );
}
