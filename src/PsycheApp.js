import { useState, useRef, useEffect } from "react";

// ── GOTHIC PALETTE ──────────────────────────────────────────────
const G = {
  bg: "#0d0b0f",
  surface: "#13101a",
  surfaceAlt: "#1a1525",
  border: "#2a2035",
  borderLight: "#3d3050",
  accent: "#c9a96e",        // gold
  accentDim: "#8a6d3f",
  accentSoft: "#2a1f0a",
  purple: "#9b7fcb",
  purpleDim: "#4a3570",
  purpleSoft: "#1a1030",
  text: "#e8e0d5",
  textMid: "#a09080",
  textDim: "#5a5060",
  red: "#c96e6e",
  green: "#6ec9a9",
};

const ANALYSTS_GROUPS = {
  "Базовые модели": [
    { id:"ocean", name:"Big Five / OCEAN", icon:"🌊", short:"Большая пятёрка личностных черт",
      tooltip:"Самая научно-доказанная модель личности. 5 измерений: Открытость, Добросовестность, Экстраверсия, Доброжелательность, Нейротизм. Покажет, где персонаж на каждой шкале и что это значит." },
    { id:"mbti", name:"MBTI + когнитивные функции", icon:"🧩", short:"Тип личности и функциональный стек",
      tooltip:"Myers-Briggs и юнгианские когнитивные функции. Покажет тип (например, INFJ), доминирующую функцию восприятия/суждения и как это влияет на поведение." },
    { id:"enneagram", name:"Эннеаграмма", icon:"⭐", short:"Тип + крылья + уровни развития",
      tooltip:"9 типов личности с глубинными мотивами. Покажет тип, крылья (смесь соседних типов), уровень здоровья и направления роста/стресса." },
    { id:"attachment", name:"Стиль привязанности", icon:"🤝", short:"Детская и взрослая привязанность",
      tooltip:"По Боулби и Эйнсворт. Как первые отношения с родителями сформировали все последующие — надёжный, тревожный, избегающий или дезорганизованный стиль." },
  ],
  "Психоаналитический блок": [
    { id:"freud", name:"Фрейд", icon:"🪞", short:"Ид, Эго, Суперэго + защитные механизмы",
      tooltip:"Отец психоанализа. Расскажет что персонаж подавляет, как устроена его психика на трёх уровнях и откуда внутренние конфликты." },
    { id:"jung", name:"Юнг — архетипы", icon:"🌙", short:"Персона, Тень, Анима/Анимус, Самость",
      tooltip:"Архетипы и коллективное бессознательное. Что в Тени персонажа, его путь к целостности, доминирующий архетип." },
    { id:"objects", name:"Объектные отношения", icon:"🪆", short:"Внутренние объекты и интроекты",
      tooltip:"Кляйн, Фэйрберн, Винникотт. Какие внутренние образы людей живут в психике персонажа и как управляют его реальными отношениями." },
    { id:"ifs", name:"IFS — внутренние части", icon:"🎭", short:"Менеджеры, Пожарные, Изгнанники",
      tooltip:"Internal Family Systems (Шварц). Внутри каждого — множество частей. Покажет менеджеров (контролёров), пожарных (реактивных защитников) и изгнанников (раненые части)." },
    { id:"defenses", name:"Защитные механизмы", icon:"🛡️", short:"Полный список + как проявляются",
      tooltip:"Детальный разбор всех защит: вытеснение, проекция, рационализация, расщепление и другие. Как каждая работает именно у этого персонажа." },
  ],
  "Развитие и путь": [
    { id:"erikson", name:"Эриксон — стадии", icon:"🌱", short:"Незакрытые стадии развития",
      tooltip:"8 стадий психосоциального развития. Покажет на какой стадии застрял персонаж и какой кризис не был разрешён." },
    { id:"campbell", name:"Путь героя (Кэмпбелл)", icon:"⚔️", short:"Где персонаж на мономифе",
      tooltip:"17 этапов героического путешествия. Покажет где персонаж находится сейчас — призыв, испытание, инициация, возвращение." },
    { id:"character", name:"Характерология", icon:"📐", short:"Тип по Личко / Леонгарду",
      tooltip:"Клиническая типология акцентуаций характера. Покажет доминирующий тип (эпилептоид, истероид, шизоид...) и его проявления." },
    { id:"trauma", name:"Травматический профиль", icon:"💔", short:"Типы травм, диссоциация, сценарии",
      tooltip:"Виды травм (простая/сложная/развитийная), диссоциативные паттерны и повторяющиеся сценарии которые персонаж воссоздаёт снова и снова." },
  ],
  "Глубокие модули": [
    { id:"natal", name:"Натальная карта", icon:"✨", short:"Психологическая астрология",
      tooltip:"Психологическая интерпретация астрологической карты персонажа. Солнце (эго), Луна (бессознательное), Асцендент (маска), ключевые аспекты." },
    { id:"shadow", name:"Теневая работа", icon:"🖤", short:"Что персонаж в себе отрицает",
      tooltip:"По Юнгу и Роберту Джонсону. Что персонаж проецирует на других, от чего бежит в себе, и что Тень пытается ему сказать." },
    { id:"existential", name:"Экзистенциальный анализ", icon:"🕯️", short:"Смысл, свобода, одиночество, смерть",
      tooltip:"По Ялому и Хайдеггеру. Как персонаж отвечает на четыре данности существования: смерть, свобода, изоляция, бессмысленность." },
    { id:"narrative", name:"Нарративная терапия", icon:"📖", short:"Какую историю рассказывает о себе",
      tooltip:"По Уайту и Эпстону. Какой доминирующий нарратив управляет жизнью персонажа, и какая альтернативная история возможна." },
    { id:"kafka", name:"Кафка", icon:"🚪", short:"Отчуждение и абсурд власти",
      tooltip:"Отчуждение, абсурдная власть, невозможность быть понятым. Как кафкианский ужас живёт в персонаже." },
    { id:"spielrein", name:"Шпильрейн", icon:"🌹", short:"Разрушение как трансформация",
      tooltip:"Первая женщина-психоаналитик. Влечение к разрушению как источник нового рождения. Что должно умереть в персонаже чтобы он изменился." },
  ],
  "Практические модули": [
    { id:"triggers", name:"Триггеры и кнопки", icon:"⚡", short:"Что выводит из себя",
      tooltip:"Конкретный список триггеров персонажа — ситуации, слова, люди, которые активируют защиты или разрушают самоконтроль." },
    { id:"strengths", name:"Сильные стороны", icon:"💎", short:"Суперсила и ресурсы",
      tooltip:"Что персонаж делает лучше всех, какие качества являются его настоящей силой и как они связаны с его ранами." },
    { id:"disorders", name:"Личностные паттерны", icon:"🔍", short:"Паттерны (мягко, без диагнозов)",
      tooltip:"Не диагноз, а описание устойчивых паттернов — нарциссических, пограничных, параноидных черт. Мягко, как характерологические тенденции." },
    { id:"growth", name:"Потенциал роста", icon:"🌿", short:"Терапия и путь развития",
      tooltip:"Какой вид помощи нужен персонажу, какой терапевт ему подошёл бы, и конкретные шаги к психологическому росту." },
    { id:"relations", name:"В отношениях", icon:"❤️", short:"Любовь, дружба, власть",
      tooltip:"Паттерны поведения в близких отношениях, дружбе и иерархиях власти. Как персонаж любит, предаёт, привязывается и отстраняется." },
  ],
};

const ALL_ANALYSTS = Object.values(ANALYSTS_GROUPS).flat();

const emptyChar = () => ({
  id: Date.now(), name: "", birthdate: "",
  behavior: "", childhood: "", fear: "", desire: "", wound: "", mask: "",
  image: null, analyses: {},
});

// ── COMPONENTS ──────────────────────────────────────────────────

function GothicFrame({ children, style={} }) {
  return (
    <div style={{position:"relative",border:`0.5px solid ${G.border}`,borderRadius:12,background:G.surface,...style}}>
      <div style={{position:"absolute",top:-1,left:20,width:40,height:1,background:G.accent,opacity:0.6}}/>
      <div style={{position:"absolute",bottom:-1,right:20,width:40,height:1,background:G.accent,opacity:0.4}}/>
      {children}
    </div>
  );
}

function Avatar({ char, size=40 }) {
  const initials = char.name ? char.name.split(" ").map(w=>w[0]).slice(0,2).join("").toUpperCase() : "✦";
  if (char.image) return <img src={char.image} alt={char.name} style={{width:size,height:size,borderRadius:"50%",objectFit:"cover",border:`1px solid ${G.border}`}} />;
  return (
    <div style={{width:size,height:size,borderRadius:"50%",background:G.surfaceAlt,border:`1px solid ${G.border}`,color:G.accent,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:500,fontSize:size*0.3,flexShrink:0,letterSpacing:"0.05em"}}>
      {initials}
    </div>
  );
}

function Tooltip({ text, children }) {
  const [show, setShow] = useState(false);
  return (
    <span style={{position:"relative",display:"inline-block"}} onMouseEnter={()=>setShow(true)} onMouseLeave={()=>setShow(false)}>
      {children}
      {show && (
        <div style={{position:"absolute",left:0,top:"110%",zIndex:300,background:"#0d0b0f",border:`0.5px solid ${G.border}`,color:G.textMid,borderRadius:8,padding:"10px 14px",fontSize:11.5,lineHeight:1.65,width:240,boxShadow:"0 8px 30px rgba(0,0,0,0.6)",pointerEvents:"none"}}>
          <div style={{position:"absolute",top:-5,left:12,width:9,height:9,background:"#0d0b0f",border:`0.5px solid ${G.border}`,borderBottom:"none",borderRight:"none",transform:"rotate(45deg)"}}/>
          {text}
        </div>
      )}
    </span>
  );
}

function LoadingDots({ color=G.accent }) {
  return (
    <div style={{display:"flex",gap:5,alignItems:"center",padding:"6px 0"}}>
      {[0,0.2,0.4].map((d,i)=><div key={i} style={{width:5,height:5,borderRadius:"50%",background:color,animation:`pulse 1.2s ease-in-out ${d}s infinite`}}/>)}
      <span style={{fontSize:12,color:G.textDim,marginLeft:6,fontStyle:"italic"}}>обрабатываю...</span>
    </div>
  );
}

function AnalysisBlock({ analyst, text, loading }) {
  const [open, setOpen] = useState(true);
  return (
    <GothicFrame style={{overflow:"hidden"}}>
      <div onClick={()=>setOpen(o=>!o)} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",cursor:"pointer",borderBottom:open?`0.5px solid ${G.border}`:"none"}}>
        <span style={{fontSize:18,opacity:0.85}}>{analyst.icon}</span>
        <Tooltip text={analyst.tooltip}>
          <span style={{fontWeight:500,fontSize:13,color:G.text,borderBottom:`1px dashed ${G.borderLight}`,paddingBottom:1,cursor:"help"}}>{analyst.name}</span>
        </Tooltip>
        <span style={{fontSize:11,color:G.textDim,marginLeft:4}}>{analyst.short}</span>
        <span style={{marginLeft:"auto",color:G.textDim,fontSize:12,transition:"transform 0.2s",display:"inline-block",transform:open?"rotate(180deg)":"rotate(0deg)"}}>▾</span>
      </div>
      {open && (
        <div style={{padding:"14px 16px"}}>
          {loading ? <LoadingDots /> : text ?
            <div style={{fontSize:13,color:G.textMid,lineHeight:1.8,whiteSpace:"pre-wrap"}}>{text}</div> :
            <div style={{fontSize:12,color:G.textDim,fontStyle:"italic"}}>Нажмите «Запустить анализ» чтобы получить разбор</div>
          }
        </div>
      )}
    </GothicFrame>
  );
}

// ── SAVE MODAL ──────────────────────────────────────────────────
function SaveModal({ chars, char, onClose }) {
  const [done, setDone] = useState("");
  const getText = () => {
    const analyses = Object.entries(char.analyses||{}).map(([id,text])=>{
      const a = ALL_ANALYSTS.find(x=>x.id===id);
      return a ? `\n${"═".repeat(40)}\n${a.name.toUpperCase()} — ${a.short}\n${"═".repeat(40)}\n${text}` : "";
    }).join("\n");
    return `✦ ПСИХОЛОГИЧЕСКОЕ ДОСЬЕ ✦\n${"═".repeat(50)}\n${char.name||"Безымянный"}\nДата: ${new Date().toLocaleDateString("ru-RU")}\n${"═".repeat(50)}\n\nДАТА РОЖДЕНИЯ: ${char.birthdate||"—"}\nКЛЮЧЕВОЕ ПОВЕДЕНИЕ:\n${char.behavior||"—"}\n\nДЕТСТВО И ТРАВМЫ:\n${char.childhood||"—"}\n\nГЛАВНЫЙ СТРАХ:\n${char.fear||"—"}\n\nЖЕЛАНИЕ / ЦЕЛЬ:\n${char.desire||"—"}\n\nПСИХОЛОГИЧЕСКАЯ РАНА:\n${char.wound||"—"}\n\nМАСКА / ФАСАД:\n${char.mask||"—"}\n\n${"═".repeat(50)}\nПСИХОАНАЛИТИЧЕСКИЕ РАЗБОРЫ:\n${analyses||"Анализ не проводился"}`;
  };
  const dl = (content, name, mime) => {
    const a = document.createElement("a");
    a.href = `data:${mime};charset=utf-8,`+encodeURIComponent(content);
    a.download = name; document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setDone(name); setTimeout(()=>setDone(""),2500);
  };
  const printPDF = () => {
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${char.name||"Досье"}</title>
<style>body{font-family:Georgia,serif;max-width:800px;margin:40px auto;color:#1a1a1a;line-height:1.7}h1{font-size:22px;border-bottom:2px solid #333;padding-bottom:8px}h2{font-size:15px;margin-top:28px;color:#333;border-left:3px solid #999;padding-left:10px}p{font-size:13px;margin:6px 0}pre{white-space:pre-wrap;font-family:Georgia,serif;font-size:13px}@media print{body{margin:20px}}</style>
</head><body><h1>✦ ${char.name||"Персонаж"}</h1>
<p><b>Дата рождения:</b> ${char.birthdate||"—"}</p>
<h2>Ключевое поведение</h2><p>${char.behavior||"—"}</p>
<h2>Детство и травмы</h2><p>${char.childhood||"—"}</p>
<h2>Главный страх</h2><p>${char.fear||"—"}</p>
<h2>Желание / цель</h2><p>${char.desire||"—"}</p>
<h2>Психологическая рана</h2><p>${char.wound||"—"}</p>
<h2>Маска / фасад</h2><p>${char.mask||"—"}</p>
${Object.entries(char.analyses||{}).map(([id,text])=>{const a=ALL_ANALYSTS.find(x=>x.id===id);return a?`<h2>${a.name}</h2><pre>${text}</pre>`:""}).join("")}
</body></html>`;
    const w = window.open("","_blank"); w.document.write(html); w.document.close();
    setTimeout(()=>w.print(), 600);
  };
  const btns = [
    {icon:"🖨️", label:"PDF — печать / сохранить", fn:printPDF, note:"Откроется окно печати. Выберите «Сохранить как PDF»."},
    {icon:"📄", label:"TXT — текст досье", fn:()=>dl(getText(),`${char.name||"персонаж"}_досье.txt`,"text/plain")},
    {icon:"📋", label:"JSON — все данные", fn:()=>dl(JSON.stringify({version:"1.1",exportedAt:new Date().toISOString(),characters:chars.map(c=>({...c,image:c.image?"[img]":null}))},null,2),`psyche_${char.name||"данные"}.json`,"application/json")},
  ];
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000}} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <GothicFrame style={{width:"min(400px,92vw)",padding:24}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
          <div style={{fontWeight:600,fontSize:15,color:G.text,letterSpacing:"0.05em"}}>✦ Сохранить досье</div>
          <button onClick={onClose} style={{background:"none",border:"none",color:G.textDim,fontSize:20,cursor:"pointer"}}>×</button>
        </div>
        <div style={{fontSize:12,color:G.textDim,marginBottom:14}}>Персонаж: <span style={{color:G.accent}}>{char.name||"Безымянный"}</span></div>
        {done && <div style={{background:G.purpleSoft,border:`0.5px solid ${G.purple}`,borderRadius:8,padding:"8px 12px",fontSize:12,color:G.purple,marginBottom:10}}>✓ Скачано: {done}</div>}
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {btns.map(b=>(
            <div key={b.label}>
              <button onClick={b.fn} style={{width:"100%",padding:"11px 14px",background:G.surfaceAlt,border:`0.5px solid ${G.border}`,borderRadius:9,fontSize:13,cursor:"pointer",textAlign:"left",fontFamily:"inherit",color:G.text,display:"flex",alignItems:"center",gap:10}}>
                <span>{b.icon}</span><span>{b.label}</span>
              </button>
              {b.note&&<div style={{fontSize:11,color:G.textDim,padding:"4px 8px"}}>{b.note}</div>}
            </div>
          ))}
        </div>
      </GothicFrame>
    </div>
  );
}

// ── BIO MODAL ───────────────────────────────────────────────────
function BioModal({ char, updateChar, onClose }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const run = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:800,system:`Из биографии персонажа извлеки ТОЛЬКО JSON без markdown:\n{"name":"","birthdate":"ДД.ММ.ГГГГ или пусто","behavior":"","childhood":"","fear":"","desire":"","wound":"","mask":""}`,messages:[{role:"user",content:`Биография:\n\n${text}`}]})});
      const d = await res.json();
      const p = JSON.parse((d.content?.[0]?.text||"{}").replace(/```json|```/g,"").trim());
      updateChar({
        ...(p.name&&{name:p.name}),
        ...(p.birthdate&&{birthdate:p.birthdate}),
        behavior:p.behavior||char.behavior, childhood:p.childhood||char.childhood,
        fear:p.fear||char.fear, desire:p.desire||char.desire,
        wound:p.wound||char.wound, mask:p.mask||char.mask,
      });
      onClose();
    } catch { alert("Не удалось разобрать. Попробуйте ещё раз."); }
    setLoading(false);
  };
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:16}} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <GothicFrame style={{width:"min(680px,96vw)",maxHeight:"88vh",display:"flex",flexDirection:"column",padding:24,gap:14}}>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12}}>
          <div>
            <div style={{fontWeight:600,fontSize:15,color:G.text}}>📄 Импорт биографии</div>
            <div style={{fontSize:12,color:G.textDim,marginTop:4}}>Вставьте любой текст — анкету, описание, историю. AI разберёт поля сам.</div>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",color:G.textDim,fontSize:20,cursor:"pointer",flexShrink:0}}>×</button>
        </div>
        <textarea value={text} onChange={e=>setText(e.target.value)} placeholder={"Вставьте биографию персонажа — любой объём.\nAI извлечёт имя, дату рождения, поведение, травмы, страхи и всё остальное."} style={{flex:1,minHeight:280,background:G.bg,border:`0.5px solid ${G.border}`,borderRadius:10,padding:"12px 14px",fontSize:13,fontFamily:"inherit",lineHeight:1.7,resize:"vertical",color:G.text,outline:"none"}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap"}}>
          <div style={{fontSize:11,color:G.textDim}}>{text.length} символов</div>
          <div style={{display:"flex",gap:10}}>
            <button onClick={onClose} style={{padding:"8px 16px",background:"none",border:`0.5px solid ${G.border}`,borderRadius:8,fontSize:13,color:G.textMid,cursor:"pointer",fontFamily:"inherit"}}>Отмена</button>
            <button onClick={run} disabled={loading||!text.trim()} style={{padding:"8px 20px",background:G.accent,border:"none",borderRadius:8,fontSize:13,color:"#0d0b0f",fontWeight:600,cursor:loading?"wait":"pointer",fontFamily:"inherit",opacity:loading||!text.trim()?0.6:1}}>
              {loading?"Читаю...":"✦ Заполнить профиль"}
            </button>
          </div>
        </div>
      </GothicFrame>
    </div>
  );
}

// ── MAIN APP ────────────────────────────────────────────────────

export default function PsycheApp({ session }) {
  const [chars, setChars] = useState([]);
  const [dbLoading, setDbLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState('');

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('psyche_chars');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) {
          setChars(parsed);
          setActiveId(parsed[0].id);
        } else {
          const nc = {...emptyChar(), id: Date.now(), name: 'Новый персонаж'};
          setChars([nc]); setActiveId(nc.id);
        }
      } else {
        const nc = {...emptyChar(), id: Date.now(), name: 'Новый персонаж'};
        setChars([nc]); setActiveId(nc.id);
      }
    } catch {
      const nc = {...emptyChar(), id: Date.now(), name: 'Новый персонаж'};
      setChars([nc]); setActiveId(nc.id);
    }
    setDbLoading(false);
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    if (dbLoading || chars.length === 0) return;
    const timer = setTimeout(() => {
      try {
        localStorage.setItem('psyche_chars', JSON.stringify(chars));
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus(''), 2000);
      } catch {
        setSaveStatus('error');
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [chars, dbLoading]);

  const deleteChar = (id) => {
    const remaining = chars.filter(x => x.id !== id);
    if (remaining.length === 0) {
      const nc = {...emptyChar(), id: Date.now(), name: 'Новый персонаж'};
      setChars([nc]); setActiveId(nc.id);
    } else {
      setChars(remaining);
      setActiveId(remaining[0].id);
    }
  };
  const [activeId, setActiveId] = useState(1);
  const [tab, setTab] = useState("profile");
  const [analysisGroup, setAnalysisGroup] = useState(Object.keys(ANALYSTS_GROUPS)[0]);
  const [selectedAnalysts, setSelectedAnalysts] = useState(ALL_ANALYSTS.map(a=>a.id));
  const [loadingAnalysts, setLoadingAnalysts] = useState({});
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [forecastType, setForecastType] = useState("quick");
  const [forecastSituations, setForecastSituations] = useState([]);
  const [forecastStress, setForecastStress] = useState("medium");
  const [forecastTriggers, setForecastTriggers] = useState(false);
  const [forecastTriggersText, setForecastTriggersText] = useState("");
  const [forecastMask, setForecastMask] = useState(true);
  const [forecastCustom, setForecastCustom] = useState("");
  const [forecastResult, setForecastResult] = useState("");
  const [forecastLoading, setForecastLoading] = useState(false);
  const [showBio, setShowBio] = useState(false);
  const [showSave, setShowSave] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dynCharA, setDynCharA] = useState(null);
  const [dynCharB, setDynCharB] = useState(null);
  const [dynAspects, setDynAspects] = useState(["attraction","conflict","power","wounds","growth","shadow","future"]);
  const [dynResult, setDynResult] = useState({});
  const [dynLoading, setDynLoading] = useState({});
  const [chatHistories, setChatHistories] = useState({});
  const fileInputRef = useRef();
  const chatEndRef = useRef();


  const char = chars.find(c=>c.id===activeId);
  const updateChar = (fields) => setChars(cs=>cs.map(c=>c.id===activeId?{...c,...fields}:c));

  const switchChar = (id) => {
    setChatHistories(h=>({...h,[activeId]:chatMessages}));
    setActiveId(id);
    setChatMessages(chatHistories[id]||[]);
    setSidebarOpen(false);
  };

  const addChar = () => {
    setChatHistories(h=>({...h,[activeId]:chatMessages}));
    const nc=emptyChar();
    setChars(cs=>[...cs,nc]);
    setActiveId(nc.id);
    setChatMessages([]);
    setTab("profile");
    setSidebarOpen(false);
  };

  const buildSummary = (c) => `Имя: ${c.name||"Безымянный"}\nДата рождения: ${c.birthdate||"не указана"}\nПоведение: ${c.behavior||"—"}\nДетство/травмы: ${c.childhood||"—"}\nСтрах: ${c.fear||"—"}\nЖелание: ${c.desire||"—"}\nРана: ${c.wound||"—"}\nМаска: ${c.mask||"—"}`;

  // Sequential analysis to avoid rate limits
  const analyzeAll = async () => {
    if (!char.name && !char.behavior) return;
    const summary = buildSummary(char);
    const toAnalyze = ALL_ANALYSTS.filter(a=>selectedAnalysts.includes(a.id));
    const newLoading = Object.fromEntries(toAnalyze.map(a=>[a.id,true]));
    setLoadingAnalysts(newLoading);
    const analyses = {...(char.analyses||{})};
    // Run in small batches of 2 to avoid concurrent limit
    for (let i=0; i<toAnalyze.length; i+=2) {
      const batch = toAnalyze.slice(i, i+2);
      await Promise.all(batch.map(async (analyst) => {
        const prompts = {
          ocean:`Ты эксперт по психологии личности. Проанализируй персонажа по Большой пятёрке (OCEAN). Для каждого измерения (Открытость, Добросовестность, Экстраверсия, Доброжелательность, Нейротизм) дай оценку (Высокий/Средний/Низкий) и 2-3 предложения обоснования с примерами из профиля. Итого: какой тип личности складывается? 150-180 слов.`,
          mbti:`Ты эксперт по MBTI и юнгианским когнитивным функциям. Определи тип MBTI персонажа, назови функциональный стек (например: Ni-Fe-Ti-Se), объясни почему именно этот тип. Покажи как доминирующая и вспомогательная функции проявляются в поведении. 150-180 слов.`,
          enneagram:`Ты эксперт по эннеаграмме. Определи тип (1-9), крылья, вероятный уровень развития (здоровый/средний/нездоровый). Объясни глубинный страх и глубинное желание этого типа применительно к персонажу. Укажи направления стресса и роста. 150-180 слов.`,
          attachment:`Ты специалист по теории привязанности (Боулби, Эйнсворт, Мэйн). Определи стиль привязанности в детстве и взрослом возрасте (они могут различаться). Объясни как ранний опыт сформировал текущие паттерны в отношениях. 150-180 слов.`,
          freud:`Ты фрейдистский аналитик. Разбери Ид/Эго/Суперэго, ключевые защитные механизмы, вытесненные влечения, фиксации, эдипальную динамику. 150-180 слов.`,
          jung:`Ты юнгианский аналитик. Разбери Персону vs Самость, Тень (что вытеснено), Анима/Анимус, доминирующий архетип. Путь к индивидуации. 150-180 слов.`,
          objects:`Ты специалист по теории объектных отношений (Кляйн, Фэйрберн, Винникотт). Опиши внутренние объекты персонажа: какие образы значимых людей живут в его психике, расщепление на хороший/плохой объект, переходные объекты. 150-180 слов.`,
          ifs:`Ты терапевт IFS (Internal Family Systems, Шварц). Опиши систему частей персонажа: какие Менеджеры (контролирующие защиты), какие Пожарники (реактивные защиты в кризисе), какие Изгнанники (раненые части). Что несёт его Сущность? 150-180 слов.`,
          defenses:`Ты психоаналитик. Составь детальный разбор защитных механизмов персонажа: перечисли все выявленные механизмы, объясни как каждый проявляется в его поведении, и какие ситуации их активируют. 150-180 слов.`,
          erikson:`Ты специалист по эпигенетической теории Эриксона. Проанализируй все 8 стадий развития применительно к персонажу: какие успешно пройдены, на какой он застрял, какой кризис не был разрешён. Какую задачу развития он сейчас пытается решить? 150-180 слов.`,
          campbell:`Ты эксперт по мономифу Джозефа Кэмпбелла. Определи где персонаж находится на пути героя сейчас: обычный мир, призыв, отказ от призыва, наставник, порог, испытания, испытание бездной, трансформация, возвращение. Что для него является Святым Граалем и Отцом? 150-180 слов.`,
          character:`Ты клинический психолог. Проведи характерологический анализ по Личко и Леонгарду. Определи тип акцентуации (эпилептоидный, истероидный, шизоидный, параноидный, циклоидный и т.д.), обоснуй через поведение. Как акцентуация проявляется в стрессе и комфорте? 150-180 слов.`,
          trauma:`Ты травматерапевт. Составь травматический профиль: тип травм (простая, сложная, развитийная, реляционная), диссоциативные паттерны, повторяющиеся сценарии которые персонаж воссоздаёт. Как травма управляет его жизнью? 150-180 слов.`,
          natal:`Ты психологический астролог. Используя дату рождения персонажа (если есть), дай психологическую интерпретацию натальной карты: Солнце (эго-идентичность), Луна (бессознательное и эмоциональные нужды), Асцендент (маска/фасад). Если дата не указана — интерпретируй метафорически по характеру. 150-180 слов.`,
          shadow:`Ты специалист по теневой работе (Юнг, Роберт Джонсон). Опиши Тень персонажа подробно: что именно он отрицает в себе, на кого проецирует нежелательные качества, чего боится увидеть. Что Тень пытается ему сказать? Какой дар скрыт в Тени? 150-180 слов.`,
          existential:`Ты экзистенциальный аналитик (Ялом, Хайдеггер, Сартр). Разбери четыре данности: отношение к смерти, к свободе (и ответственности), к экзистенциальному одиночеству, к смыслу/бессмысленности. Как персонаж справляется с каждой? 150-180 слов.`,
          narrative:`Ты нарративный терапевт (Уайт, Эпстон). Какой доминирующий нарратив управляет жизнью персонажа? Какие события отбираются для подтверждения этой истории? Что остаётся "за кадром"? Какая альтернативная история была бы возможна? 150-180 слов.`,
          kafka:`Ты кафкиановед. Разбери отчуждение, абсурдную власть, невозможность быть понятым, вину без преступления. Как кафкианский ужас воплощён в этом персонаже? 150-180 слов.`,
          spielrein:`Ты аналитик по Шпильрейн. Деструктивное влечение как источник трансформации. Что должно умереть в персонаже чтобы он возродился? 150-180 слов.`,
          triggers:`Ты психолог-практик. Составь конкретный список триггеров персонажа: ситуации, слова, типы людей, темы, которые активируют его защиты, гнев, страх или разрушение. Для каждого триггера — что именно происходит внутри и снаружи. 150-180 слов.`,
          strengths:`Ты позитивный психолог. Опиши сильные стороны и суперсилу персонажа: что он делает лучше других, какие качества являются его ресурсом. Как его раны парадоксально питают его силу? 150-180 слов.`,
          disorders:`Ты клинический психолог (описывай мягко, без диагнозов). Опиши устойчивые личностные паттерны: нарциссические черты, пограничные, параноидные, шизоидные, гистрионные — те что реально присутствуют. Как они проявляются в отношениях? 150-180 слов.`,
          growth:`Ты интегративный психотерапевт. Опиши потенциал роста персонажа: что нужно исцелить, какой вид терапии подошёл бы (психоанализ, IFS, гештальт, соматика, EMDR...), какой терапевт как личность. Конкретные шаги к психологическому здоровью. 150-180 слов.`,
          relations:`Ты специалист по психологии отношений. Разбери паттерны персонажа в любви (выбор партнёра, близость, конфликты), дружбе (глубина, предательство, лояльность) и иерархиях власти (подчинение, доминирование, бунт). 150-180 слов.`,
        };
        try {
          const res = await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:800,system:`${prompts[analyst.id]}\n\nОтвечай только на русском. Без markdown — только чистый текст.`,messages:[{role:"user",content:`Профиль:\n${summary}`}]})});
          const d = await res.json();
          if (d.error) throw new Error(d.error.message);
          analyses[analyst.id] = d.content?.[0]?.text || "Нет текста";
        } catch(e) {
          analyses[analyst.id] = `Ошибка: ${e.message}`;
        }
        setLoadingAnalysts(prev=>({...prev,[analyst.id]:false}));
        setChars(cs=>cs.map(c=>c.id===activeId?{...c,analyses:{...c.analyses,[analyst.id]:analyses[analyst.id]}}:c));
      }));
    }
  };

  const sendChat = async () => {
    if (!chatInput.trim()||chatLoading) return;
    const msg = chatInput.trim(); setChatInput("");
    const newMsgs = [...chatMessages,{role:"user",content:msg}];
    setChatMessages(newMsgs); setChatLoading(true);
    const apiMsgs = [];
    for (const m of newMsgs) {
      if (m.role!=="user"&&m.role!=="assistant") continue;
      if (apiMsgs.length>0&&apiMsgs[apiMsgs.length-1].role===m.role) apiMsgs[apiMsgs.length-1].content+="\n"+m.content;
      else apiMsgs.push({role:m.role,content:m.content});
    }
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:1000,system:`Ты персонаж ${char.name||"Безымянный"}. Профиль:\n${buildSummary(char)}\n\nОтвечай от 1-го лица. ОБЯЗАТЕЛЬНО описывай физические детали: взгляд, жест, поза, дыхание — оформляй *курсивом со звёздочками*. После реплики поставь "---" и 2-3 предложения нарратора-психолога. Только русский.`,messages:apiMsgs})});
      const d = await res.json();
      if (d.error) throw new Error(d.error.message);
      setChatMessages([...newMsgs,{role:"assistant",content:d.content?.[0]?.text||"..."}]);
    } catch(e) { setChatMessages([...newMsgs,{role:"assistant",content:`Ошибка: ${e.message}`}]); }
    setChatLoading(false);
    setTimeout(()=>chatEndRef.current?.scrollIntoView({behavior:"smooth"}),100);
  };

  const renderChatMsg = (content) => content.split(/(\*[^*]+\*)/g).map((p,i)=>{
    if (p.startsWith("*")&&p.endsWith("*")) return <em key={i} style={{color:G.accent,fontStyle:"italic"}}>{p.slice(1,-1)}</em>;
    return <span key={i}>{p}</span>;
  });

  const FORECAST_SITUATIONS = [
    {id:"conflict",label:"Конфликт / предательство"},{id:"success",label:"Успех и признание"},
    {id:"failure",label:"Провал / унижение"},{id:"temptation",label:"Соблазн / искушение"},
    {id:"loss",label:"Потеря близкого"},{id:"power",label:"Власть и ответственность"},
    {id:"love",label:"Любовь / близость"},{id:"trauma",label:"Столкновение с травмой"},
    {id:"moral",label:"Моральный выбор"},{id:"extreme",label:"Экстремальная ситуация"},
  ];

  const DYN_ASPECTS = [
    {id:"attraction", icon:"✦", label:"Притяжение и химия", prompt:"Опиши психологическую природу притяжения между персонажами: что именно привлекает их друг в друге на уровне бессознательного, какие части психики откликаются, есть ли проективная идентификация."},
    {id:"conflict", icon:"⚔️", label:"Конфликт и трение", prompt:"Опиши основные точки конфликта: какие ценности, страхи и паттерны сталкиваются. Как они провоцируют друг друга? Что является главным 'полем боя' между ними?"},
    {id:"power", icon:"👑", label:"Власть и иерархия", prompt:"Проанализируй динамику власти: кто доминирует явно и скрыто, как перераспределяется контроль в разных ситуациях, есть ли токсичные паттерны власти."},
    {id:"wounds", icon:"💔", label:"Ранящие паттерны", prompt:"Опиши как их раны взаимодействуют: какие травмы персонажей резонируют, усиливают или эксплуатируют друг друга. Какие старые раны они активируют один у другого?"},
    {id:"growth", icon:"🌿", label:"Рост и исцеление", prompt:"Как эти отношения могут способствовать росту каждого? Что каждый может исцелить или развить через взаимодействие с другим? Каков потенциал трансформации?"},
    {id:"shadow", icon:"🖤", label:"Теневая динамика", prompt:"Что каждый проецирует на другого (юнгианская проекция/Тень)? Что в другом раздражает — и что это говорит о скрытом в себе? Как их Тени взаимодействуют?"},
    {id:"future", icon:"🔮", label:"Вероятное будущее", prompt:"Спрогнозируй три возможных сценария развития отношений: токсичный/разрушительный, нейтральный/паузный, и трансформационный/исцеляющий. Что нужно чтобы попасть в каждый?"},
    {id:"archetype", icon:"🌙", label:"Архетипическая пара", prompt:"Опиши их как архетипическую пару: какой миф или архетип они воплощают вместе (Орфей и Эвридика, Гермиона и Рон, Хищник и Жертва, Учитель и Ученик, Зеркало и Отражение и т.д.)? Что это говорит об их судьбе?"},
    {id:"communication", icon:"💬", label:"Язык и коммуникация", prompt:"Как они общаются: совпадают ли их языки любви и конфликта, есть ли хронические недопонимания, паттерны избегания или слияния в коммуникации?"},
  ];

  const runDynamics = async (aspectId) => {
    const a = chars.find(c=>c.id===dynCharA);
    const b = chars.find(c=>c.id===dynCharB);
    if (!a||!b) return;
    const aspect = DYN_ASPECTS.find(x=>x.id===aspectId);
    if (!aspect) return;
    setDynLoading(p=>({...p,[aspectId]:true}));
    const aSum = buildSummary(a) + (Object.entries(a.analyses||{}).length>0?`\n\nАнализы ${a.name}:\n`+Object.entries(a.analyses).map(([id,t])=>{const an=ALL_ANALYSTS.find(x=>x.id===id);return an?`[${an.name}]: ${t}`:""}).join("\n"):"");
    const bSum = buildSummary(b) + (Object.entries(b.analyses||{}).length>0?`\n\nАнализы ${b.name}:\n`+Object.entries(b.analyses).map(([id,t])=>{const an=ALL_ANALYSTS.find(x=>x.id===id);return an?`[${an.name}]: ${t}`:""}).join("\n"):"");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:900,system:`Ты эксперт по психологии отношений, психоанализу и нарративному анализу. Тебе даны два психологических профиля персонажей. ${aspect.prompt}\n\nПиши глубоко, конкретно, опирайся на данные профилей. 200-250 слов. Только русский. Без markdown.`,messages:[{role:"user",content:`ПЕРСОНАЖ А — ${a.name}:\n${aSum}\n\n${"─".repeat(40)}\n\nПЕРСОНАЖ Б — ${b.name}:\n${bSum}`}]})});
      const d = await res.json();
      if (d.error) throw new Error(d.error.message);
      setDynResult(p=>({...p,[aspectId]:d.content?.[0]?.text||"Нет ответа"}));
    } catch(e) {
      setDynResult(p=>({...p,[aspectId]:`Ошибка: ${e.message}`}));
    }
    setDynLoading(p=>({...p,[aspectId]:false}));
  };

  const runAllDynamics = async () => {
    for (const aspect of DYN_ASPECTS.filter(a=>dynAspects.includes(a.id))) {
      await runDynamics(aspect.id);
    }
  };

  const runForecast = async () => {
    const summary = buildSummary(char);
    const allAnalyses = Object.entries(char.analyses||{}).map(([id,t])=>{const a=ALL_ANALYSTS.find(x=>x.id===id);return a?`[${a.name}]: ${t}`:""}).join("\n");
    const sel = FORECAST_SITUATIONS.filter(s=>forecastSituations.includes(s.id));
    const defs={quick:["conflict","success","failure","loss","moral"],deep:["trauma","moral"],crisis:["extreme","failure","conflict"],daily:["love","power","success"],relations:["love","conflict","temptation"]};
    const situations = forecastType==="custom" ? forecastCustom : (sel.length>0?sel.map(s=>s.label):FORECAST_SITUATIONS.filter(s=>(defs[forecastType]||defs.quick).includes(s.id)).map(s=>s.label)).join("\n");
    setForecastLoading(true); setForecastResult("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:1000,system:`Ты эксперт по психоанализу и поведенческому моделированию. Для каждой ситуации:\n1. Эмоциональная реакция\n2. Защитные механизмы\n3. Маска vs Тень\n4. Вероятные действия\n5. Долгосрочные последствия\nТолько русский. Без markdown.`,messages:[{role:"user",content:`Профиль:\n${summary}\n\nАнализы:${allAnalyses||" нет"}\nСтресс: ${{low:"Низкий",medium:"Средний",high:"Высокий",critical:"Критический"}[forecastStress]}\n${forecastTriggers?`Триггеры: ${forecastTriggersText||"да"}`:""}${forecastMask?"\nУчитывай Маску и Тень":""}\n\nСитуации:\n${situations}`}]})});
      const d = await res.json();
      setForecastResult(d.content?.[0]?.text||"Ошибка");
    } catch { setForecastResult("Ошибка соединения"); }
    setForecastLoading(false);
  };

  // Field component
  const Field = ({label, value, onChange, rows, placeholder}) => (
    <div>
      <div style={{fontSize:10,color:G.textDim,marginBottom:5,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.1em"}}>{label}</div>
      {rows ? (
        <textarea value={value} onChange={e=>onChange(e.target.value)} rows={rows} placeholder={placeholder} style={{width:"100%",background:G.bg,border:`0.5px solid ${G.border}`,borderRadius:8,padding:"8px 11px",fontSize:13,fontFamily:"inherit",lineHeight:1.6,resize:"vertical",color:G.text,outline:"none",boxSizing:"border-box"}} onFocus={e=>e.target.style.borderColor=G.accentDim} onBlur={e=>e.target.style.borderColor=G.border}/>
      ) : (
        <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{width:"100%",background:G.bg,border:`0.5px solid ${G.border}`,borderRadius:8,padding:"8px 11px",fontSize:13,fontFamily:"inherit",color:G.text,outline:"none",boxSizing:"border-box"}} onFocus={e=>e.target.style.borderColor=G.accentDim} onBlur={e=>e.target.style.borderColor=G.border}/>
      )}
    </div>
  );

  const tabs = [{id:"profile",label:"Профиль"},{id:"analysis",label:"Анализ"},{id:"forecast",label:"🔮 Прогноз"},{id:"dynamics",label:"⚭ Динамика"},{id:"chat",label:"Диалог"}];
  const isLoading = Object.values(loadingAnalysts).some(v=>v);
  const groupAnalysts = ANALYSTS_GROUPS[analysisGroup]||[];

  if (dbLoading) return (
    <div style={{minHeight:"100vh",background:G.bg,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16}}>
      <div style={{fontFamily:"Georgia,serif",fontSize:28,color:G.accent,letterSpacing:"0.2em",animation:"pulse 2s ease-in-out infinite"}}>✦</div>
      <div style={{fontSize:13,color:G.textDim}}>Загружаю ваших персонажей...</div>
      <style>{`@keyframes pulse{0%,100%{opacity:0.3}50%{opacity:1}}`}</style>
    </div>
  );

  return (
    <div style={{fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',Georgia,sans-serif",minHeight:"100vh",background:G.bg,color:G.text,display:"flex",flexDirection:"column"}}>
      <style>{`
        @keyframes pulse{0%,100%{opacity:0.25}50%{opacity:1}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:3px;height:3px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:${G.border};border-radius:2px}
        textarea,input{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Georgia,sans-serif}
        .hover-accent:hover{color:${G.accent}!important;border-color:${G.accentDim}!important}
      `}</style>

      {/* TOP BAR */}
      <div style={{background:G.surface,borderBottom:`0.5px solid ${G.border}`,display:"flex",alignItems:"center",padding:"0 16px",height:50,gap:8,position:"sticky",top:0,zIndex:100,flexShrink:0}}>
        {/* Hamburger mobile */}
        <button onClick={()=>setSidebarOpen(o=>!o)} style={{display:"none",background:"none",border:"none",color:G.textMid,fontSize:20,cursor:"pointer",padding:4,lineHeight:1,flexShrink:0}} className="mobile-menu">☰</button>
        <div style={{fontFamily:"Georgia,serif",fontWeight:700,fontSize:16,color:G.accent,letterSpacing:"0.1em",marginRight:20,flexShrink:0}}>✦ PSYCHE</div>
        <div style={{display:"flex",gap:0,overflowX:"auto",flex:1}}>
          {tabs.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{background:"none",border:"none",padding:"0 14px",height:50,fontSize:13,cursor:"pointer",color:tab===t.id?G.accent:G.textDim,borderBottom:tab===t.id?`1.5px solid ${G.accent}`:"1.5px solid transparent",whiteSpace:"nowrap",fontFamily:"inherit",letterSpacing:"0.03em",transition:"color 0.15s"}}>{t.label}</button>
          ))}
        </div>
        <button onClick={()=>setShowSave(true)} style={{background:"none",border:`0.5px solid ${G.border}`,borderRadius:7,padding:"6px 12px",fontSize:12,color:G.textMid,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap",flexShrink:0}} className="hover-accent">✦ Экспорт</button>
        {saveStatus==='saved'&&<div style={{fontSize:11,color:G.green,flexShrink:0}}>✓ сохранено</div>}
        {saveStatus==='error'&&<div style={{fontSize:11,color:G.red,flexShrink:0}}>⚠ ошибка</div>}
      </div>

      <div style={{display:"flex",flex:1,overflow:"hidden"}}>
        {/* SIDEBAR */}
        <div style={{width:200,background:G.surface,borderRight:`0.5px solid ${G.border}`,display:"flex",flexDirection:"column",padding:"12px 8px",gap:4,overflowY:"auto",flexShrink:0}}>
          <div style={{fontSize:9,color:G.textDim,textTransform:"uppercase",letterSpacing:"0.15em",padding:"4px 8px 8px",fontWeight:600}}>Персонажи</div>
          {chars.map(c=>(
            <div key={c.id} style={{display:"flex",alignItems:"center",borderRadius:8,border:`0.5px solid ${c.id===activeId?G.borderLight:"transparent"}`,background:c.id===activeId?G.surfaceAlt:"transparent",transition:"all 0.15s",overflow:"hidden"}}>
              <div onClick={()=>switchChar(c.id)} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",flex:1,cursor:"pointer",minWidth:0}}>
                <Avatar char={c} size={28}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:12,fontWeight:500,color:c.id===activeId?G.accent:G.textMid,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.name||"Безымянный"}</div>
                  {c.analyses&&Object.keys(c.analyses).length>0&&<div style={{fontSize:9,color:G.textDim,marginTop:1}}>✦ {Object.keys(c.analyses).length} анализов</div>}
                </div>
              </div>
              {chars.length>1&&<button onClick={()=>{if(window.confirm(`Удалить «${c.name||"персонажа"}»?`))deleteChar(c.id)}} style={{background:"none",border:"none",color:G.textDim,cursor:"pointer",fontSize:14,padding:"4px 8px",opacity:0.35,flexShrink:0}} title="Удалить">×</button>}
            </div>
          ))}
          <button onClick={addChar} style={{marginTop:8,padding:"7px",background:"none",border:`0.5px dashed ${G.border}`,borderRadius:8,fontSize:12,color:G.textDim,cursor:"pointer",fontFamily:"inherit",transition:"all 0.15s"}} className="hover-accent">＋ Новый</button>
        </div>

        {/* MAIN */}
        <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column"}}>

          {/* PROFILE */}
          {tab==="profile" && (
            <div style={{padding:"28px 24px",maxWidth:660,display:"flex",flexDirection:"column",gap:20,animation:"fadeIn 0.3s ease"}}>
              <div style={{display:"flex",alignItems:"center",gap:20,flexWrap:"wrap"}}>
                <div style={{position:"relative",cursor:"pointer",flexShrink:0}} onClick={()=>fileInputRef.current.click()}>
                  <Avatar char={char} size={76}/>
                  <div style={{position:"absolute",bottom:0,right:0,width:22,height:22,background:G.accent,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:G.bg,fontWeight:700}}>+</div>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>updateChar({image:ev.target.result});r.readAsDataURL(f);}}/>
                <div style={{flex:1,minWidth:200}}>
                  <div style={{fontSize:10,color:G.textDim,marginBottom:5,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.1em"}}>Имя персонажа</div>
                  <input value={char.name} onChange={e=>updateChar({name:e.target.value})} placeholder="Введите имя..." style={{width:"100%",background:"none",border:"none",borderBottom:`0.5px solid ${G.border}`,padding:"4px 0",fontSize:20,fontWeight:600,color:G.text,outline:"none",fontFamily:"Georgia,serif",letterSpacing:"0.02em"}} onFocus={e=>e.target.style.borderBottomColor=G.accent} onBlur={e=>e.target.style.borderBottomColor=G.border}/>
                </div>
              </div>
              <Field label="Дата рождения (для натальной карты)" value={char.birthdate||""} onChange={v=>updateChar({birthdate:v})} placeholder="ДД.ММ.ГГГГ — например: 14.03.1989"/>
              <Field label="Ключевое поведение" value={char.behavior} onChange={v=>updateChar({behavior:v})} rows={3} placeholder="Как персонаж ведёт себя? Контролирует, избегает, атакует..."/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                <Field label="Детство и ранние травмы" value={char.childhood} onChange={v=>updateChar({childhood:v})} rows={3} placeholder="Отец, мать, ключевые события..."/>
                <Field label="Главный страх" value={char.fear} onChange={v=>updateChar({fear:v})} rows={3} placeholder="Чего боится больше всего?"/>
                <Field label="Желание / цель (глубинное)" value={char.desire} onChange={v=>updateChar({desire:v})} rows={3} placeholder="Чего хочет на самом деле?"/>
                <Field label="Психологическая рана" value={char.wound} onChange={v=>updateChar({wound:v})} rows={3} placeholder="Что сломало его в прошлом?"/>
              </div>
              <Field label="Маска / публичный фасад" value={char.mask} onChange={v=>updateChar({mask:v})} rows={2} placeholder="Каким хочет казаться?"/>
              <div style={{display:"flex",gap:10,flexWrap:"wrap",paddingTop:4}}>
                <button onClick={()=>setTab("analysis")} style={{padding:"9px 20px",background:G.accent,border:"none",borderRadius:8,fontSize:13,color:G.bg,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>К анализу →</button>
                <button onClick={()=>setShowBio(true)} style={{padding:"9px 16px",background:"none",border:`0.5px solid ${G.border}`,borderRadius:8,fontSize:13,color:G.textMid,cursor:"pointer",fontFamily:"inherit"}} className="hover-accent">📄 Вставить биографию</button>
              </div>
            </div>
          )}

          {/* ANALYSIS */}
          {tab==="analysis" && (
            <div style={{padding:"24px",display:"flex",flexDirection:"column",gap:18,animation:"fadeIn 0.3s ease"}}>
              {/* Group tabs */}
              <div style={{display:"flex",gap:6,overflowX:"auto",flexWrap:"wrap"}}>
                {Object.keys(ANALYSTS_GROUPS).map(g=>(
                  <button key={g} onClick={()=>setAnalysisGroup(g)} style={{padding:"6px 14px",borderRadius:20,border:`0.5px solid ${analysisGroup===g?G.accentDim:G.border}`,background:analysisGroup===g?G.accentSoft:"none",color:analysisGroup===g?G.accent:G.textDim,fontSize:12,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap",transition:"all 0.15s"}}>{g}</button>
                ))}
              </div>
              {/* Select analysts */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:7}}>
                {groupAnalysts.map(a=>(
                  <div key={a.id} onClick={()=>setSelectedAnalysts(p=>p.includes(a.id)?p.filter(x=>x!==a.id):[...p,a.id])} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 11px",borderRadius:8,cursor:"pointer",border:`0.5px solid ${selectedAnalysts.includes(a.id)?G.accentDim:G.border}`,background:selectedAnalysts.includes(a.id)?G.accentSoft:"none",transition:"all 0.15s"}}>
                    <span style={{fontSize:15}}>{a.icon}</span>
                    <Tooltip text={a.tooltip}>
                      <span style={{fontSize:12,fontWeight:500,color:selectedAnalysts.includes(a.id)?G.accent:G.textMid,borderBottom:`1px dashed ${selectedAnalysts.includes(a.id)?G.accentDim:G.borderLight}`,cursor:"help"}}>{a.name}</span>
                    </Tooltip>
                    {selectedAnalysts.includes(a.id)&&<span style={{marginLeft:"auto",color:G.accent,fontSize:11}}>✓</span>}
                  </div>
                ))}
              </div>
              <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
                <button onClick={analyzeAll} disabled={!selectedAnalysts.some(id=>groupAnalysts.find(a=>a.id===id))||isLoading||(!char.name&&!char.behavior)} style={{padding:"9px 20px",background:G.accent,border:"none",borderRadius:8,fontSize:13,color:G.bg,fontWeight:600,cursor:isLoading?"wait":"pointer",fontFamily:"inherit",opacity:isLoading?0.7:1}}>
                  {isLoading?`⏳ Анализирую...`:`✦ Запустить анализ (${selectedAnalysts.filter(id=>groupAnalysts.find(a=>a.id===id)).length})`}
                </button>
                {isLoading&&<span style={{fontSize:11,color:G.textDim,fontStyle:"italic"}}>запросы идут последовательно, чтобы избежать ошибок...</span>}
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {groupAnalysts.filter(a=>selectedAnalysts.includes(a.id)).map(a=>(
                  <AnalysisBlock key={a.id} analyst={a} text={char.analyses?.[a.id]} loading={!!loadingAnalysts[a.id]}/>
                ))}
              </div>
            </div>
          )}

          {/* FORECAST */}
          {tab==="forecast" && (
            <div style={{padding:"24px",maxWidth:700,display:"flex",flexDirection:"column",gap:18,animation:"fadeIn 0.3s ease"}}>
              <div style={{fontFamily:"Georgia,serif",fontSize:16,color:G.accent,letterSpacing:"0.05em"}}>🔮 Прогноз поведения</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:8}}>
                {[{id:"quick",l:"⚡ Быстрый"},{id:"deep",l:"🔬 Глубокий"},{id:"crisis",l:"🆘 Кризис"},{id:"daily",l:"☀️ Повседневный"},{id:"relations",l:"❤️ Отношения"},{id:"custom",l:"✏️ Свой"}].map(t=>(
                  <div key={t.id} onClick={()=>setForecastType(t.id)} style={{padding:"10px 12px",borderRadius:9,cursor:"pointer",border:`0.5px solid ${forecastType===t.id?G.accentDim:G.border}`,background:forecastType===t.id?G.accentSoft:"none",color:forecastType===t.id?G.accent:G.textMid,fontSize:13,textAlign:"center",transition:"all 0.15s"}}>{t.l}</div>
                ))}
              </div>
              {forecastType==="custom" ? (
                <textarea value={forecastCustom} onChange={e=>setForecastCustom(e.target.value)} rows={4} placeholder="Опишите ситуацию своими словами..." style={{background:G.bg,border:`0.5px solid ${G.border}`,borderRadius:9,padding:"10px 13px",fontSize:13,color:G.text,fontFamily:"inherit",resize:"vertical",outline:"none"}}/>
              ) : (
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                  {FORECAST_SITUATIONS.map(s=>(
                    <div key={s.id} onClick={()=>setForecastSituations(p=>p.includes(s.id)?p.filter(x=>x!==s.id):[...p,s.id])} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",borderRadius:8,cursor:"pointer",border:`0.5px solid ${forecastSituations.includes(s.id)?G.accentDim:G.border}`,background:forecastSituations.includes(s.id)?G.accentSoft:"none",transition:"all 0.15s"}}>
                      <div style={{width:13,height:13,borderRadius:3,border:`1.5px solid ${forecastSituations.includes(s.id)?G.accent:G.textDim}`,background:forecastSituations.includes(s.id)?G.accent:"none",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                        {forecastSituations.includes(s.id)&&<span style={{fontSize:9,color:G.bg,fontWeight:700}}>✓</span>}
                      </div>
                      <span style={{fontSize:12,color:forecastSituations.includes(s.id)?G.accent:G.textMid}}>{s.label}</span>
                    </div>
                  ))}
                </div>
              )}
              <GothicFrame style={{padding:"14px 16px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                <div>
                  <div style={{fontSize:10,color:G.textDim,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8,fontWeight:600}}>Уровень стресса</div>
                  <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                    {[{id:"low",l:"Низкий"},{id:"medium",l:"Средний"},{id:"high",l:"Высокий"},{id:"critical",l:"Критический"}].map(x=>(
                      <button key={x.id} onClick={()=>setForecastStress(x.id)} style={{padding:"4px 10px",borderRadius:6,border:`0.5px solid ${forecastStress===x.id?G.accentDim:G.border}`,background:forecastStress===x.id?G.accentSoft:"none",color:forecastStress===x.id?G.accent:G.textDim,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>{x.l}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <div style={{fontSize:10,color:G.textDim,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8,fontWeight:600}}>Триггеры из прошлого</div>
                  <button onClick={()=>setForecastTriggers(v=>!v)} style={{padding:"4px 12px",borderRadius:6,border:`0.5px solid ${forecastTriggers?G.accentDim:G.border}`,background:forecastTriggers?G.accentSoft:"none",color:forecastTriggers?G.accent:G.textDim,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>{forecastTriggers?"Да":"Нет"}</button>
                  {forecastTriggers&&<input value={forecastTriggersText} onChange={e=>setForecastTriggersText(e.target.value)} placeholder="Какие?" style={{marginTop:6,width:"100%",background:G.bg,border:`0.5px solid ${G.border}`,borderRadius:6,padding:"5px 9px",fontSize:12,color:G.text,outline:"none",fontFamily:"inherit"}}/>}
                </div>
                <div style={{gridColumn:"1/3",display:"flex",alignItems:"center",gap:10}}>
                  <button onClick={()=>setForecastMask(v=>!v)} style={{padding:"4px 12px",borderRadius:6,border:`0.5px solid ${forecastMask?G.accentDim:G.border}`,background:forecastMask?G.accentSoft:"none",color:forecastMask?G.accent:G.textDim,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>{forecastMask?"Вкл":"Выкл"}</button>
                  <span style={{fontSize:12,color:G.textDim}}>Учитывать Маску / Тень / защитные механизмы</span>
                </div>
              </GothicFrame>
              <button onClick={runForecast} disabled={forecastLoading||(!char.name&&!char.behavior)} style={{alignSelf:"flex-start",padding:"10px 22px",background:G.accent,border:"none",borderRadius:8,fontSize:13,color:G.bg,fontWeight:600,cursor:"pointer",fontFamily:"inherit",opacity:forecastLoading?0.7:1}}>
                {forecastLoading?"Генерирую...":"🔮 Создать прогноз"}
              </button>
              {(forecastResult||forecastLoading)&&(
                <GothicFrame style={{padding:"16px 18px"}}>
                  {forecastLoading?<LoadingDots/>:<div style={{fontSize:13,color:G.textMid,lineHeight:1.85,whiteSpace:"pre-wrap"}}>{forecastResult}</div>}
                </GothicFrame>
              )}
            </div>
          )}

          {/* DYNAMICS */}
          {tab==="dynamics" && (
            <div style={{padding:"24px",display:"flex",flexDirection:"column",gap:20,animation:"fadeIn 0.3s ease",maxWidth:760}}>
              <div style={{fontFamily:"Georgia,serif",fontSize:16,color:G.accent,letterSpacing:"0.05em"}}>⚭ Динамика персонажей</div>
              <div style={{fontSize:13,color:G.textDim}}>Выберите двух персонажей — AI проанализирует их психологическое взаимодействие.</div>

              {/* Character selectors */}
              <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:12,alignItems:"center"}}>
                <div>
                  <div style={{fontSize:10,color:G.textDim,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8,fontWeight:600}}>Персонаж А</div>
                  <div style={{display:"flex",flexDirection:"column",gap:5}}>
                    {chars.map(c=>(
                      <div key={c.id} onClick={()=>setDynCharA(c.id)} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 11px",borderRadius:9,cursor:"pointer",border:`0.5px solid ${dynCharA===c.id?G.accentDim:G.border}`,background:dynCharA===c.id?G.accentSoft:"none",transition:"all 0.15s"}}>
                        <Avatar char={c} size={24}/>
                        <span style={{fontSize:13,color:dynCharA===c.id?G.accent:G.textMid,fontWeight:dynCharA===c.id?600:400}}>{c.name||"Безымянный"}</span>
                        {c.analyses&&Object.keys(c.analyses).length>0&&<span style={{marginLeft:"auto",fontSize:10,color:G.textDim}}>✦{Object.keys(c.analyses).length}</span>}
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{textAlign:"center",fontSize:22,color:G.textDim,userSelect:"none"}}>⚭</div>
                <div>
                  <div style={{fontSize:10,color:G.textDim,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8,fontWeight:600}}>Персонаж Б</div>
                  <div style={{display:"flex",flexDirection:"column",gap:5}}>
                    {chars.map(c=>(
                      <div key={c.id} onClick={()=>setDynCharB(c.id)} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 11px",borderRadius:9,cursor:"pointer",border:`0.5px solid ${dynCharB===c.id?G.purpleDim:G.border}`,background:dynCharB===c.id?G.purpleSoft:"none",transition:"all 0.15s",opacity:dynCharB===c.id||dynCharA!==c.id?1:0.5}}>
                        <Avatar char={c} size={24}/>
                        <span style={{fontSize:13,color:dynCharB===c.id?G.purple:G.textMid,fontWeight:dynCharB===c.id?600:400}}>{c.name||"Безымянный"}</span>
                        {c.analyses&&Object.keys(c.analyses).length>0&&<span style={{marginLeft:"auto",fontSize:10,color:G.textDim}}>✦{Object.keys(c.analyses).length}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Aspect selector */}
              {dynCharA && dynCharB && dynCharA!==dynCharB && (
                <>
                  <div>
                    <div style={{fontSize:10,color:G.textDim,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:10,fontWeight:600}}>Аспекты анализа</div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:7}}>
                      {DYN_ASPECTS.map(a=>(
                        <div key={a.id} onClick={()=>setDynAspects(p=>p.includes(a.id)?p.filter(x=>x!==a.id):[...p,a.id])} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 11px",borderRadius:8,cursor:"pointer",border:`0.5px solid ${dynAspects.includes(a.id)?G.accentDim:G.border}`,background:dynAspects.includes(a.id)?G.accentSoft:"none",transition:"all 0.15s"}}>
                          <span style={{fontSize:14}}>{a.icon}</span>
                          <span style={{fontSize:12,color:dynAspects.includes(a.id)?G.accent:G.textMid,fontWeight:dynAspects.includes(a.id)?500:400}}>{a.label}</span>
                          {dynAspects.includes(a.id)&&<span style={{marginLeft:"auto",color:G.accent,fontSize:11}}>✓</span>}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Header with names */}
                  <GothicFrame style={{padding:"14px 18px",display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <Avatar char={chars.find(c=>c.id===dynCharA)} size={32}/>
                      <span style={{fontSize:14,fontWeight:600,color:G.accent,fontFamily:"Georgia,serif"}}>{chars.find(c=>c.id===dynCharA)?.name||"А"}</span>
                    </div>
                    <span style={{fontSize:18,color:G.textDim}}>⚭</span>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <Avatar char={chars.find(c=>c.id===dynCharB)} size={32}/>
                      <span style={{fontSize:14,fontWeight:600,color:G.purple,fontFamily:"Georgia,serif"}}>{chars.find(c=>c.id===dynCharB)?.name||"Б"}</span>
                    </div>
                    <div style={{marginLeft:"auto",display:"flex",gap:8,flexWrap:"wrap"}}>
                      <button onClick={runAllDynamics} disabled={Object.values(dynLoading).some(v=>v)||dynAspects.length===0} style={{padding:"8px 18px",background:G.accent,border:"none",borderRadius:8,fontSize:13,color:G.bg,fontWeight:600,cursor:"pointer",fontFamily:"inherit",opacity:Object.values(dynLoading).some(v=>v)?0.6:1}}>
                        {Object.values(dynLoading).some(v=>v)?"Анализирую...":"✦ Запустить анализ"}
                      </button>
                    </div>
                  </GothicFrame>

                  {/* Results per aspect */}
                  <div style={{display:"flex",flexDirection:"column",gap:10}}>
                    {DYN_ASPECTS.filter(a=>dynAspects.includes(a.id)).map(aspect=>(
                      <GothicFrame key={aspect.id} style={{overflow:"hidden"}}>
                        <div style={{display:"flex",alignItems:"center",gap:10,padding:"11px 16px",borderBottom:dynResult[aspect.id]||dynLoading[aspect.id]?`0.5px solid ${G.border}`:"none"}}>
                          <span style={{fontSize:17}}>{aspect.icon}</span>
                          <span style={{fontSize:13,fontWeight:500,color:G.text}}>{aspect.label}</span>
                          {!dynResult[aspect.id]&&!dynLoading[aspect.id]&&(
                            <button onClick={()=>runDynamics(aspect.id)} style={{marginLeft:"auto",padding:"4px 12px",background:"none",border:`0.5px solid ${G.border}`,borderRadius:6,fontSize:11,color:G.textDim,cursor:"pointer",fontFamily:"inherit"}} className="hover-accent">Запустить</button>
                          )}
                          {dynResult[aspect.id]&&!dynLoading[aspect.id]&&(
                            <button onClick={()=>runDynamics(aspect.id)} style={{marginLeft:"auto",padding:"4px 12px",background:"none",border:`0.5px solid ${G.border}`,borderRadius:6,fontSize:11,color:G.textDim,cursor:"pointer",fontFamily:"inherit"}} className="hover-accent">↺</button>
                          )}
                        </div>
                        {dynLoading[aspect.id]&&(
                          <div style={{padding:"12px 16px"}}><LoadingDots/></div>
                        )}
                        {dynResult[aspect.id]&&!dynLoading[aspect.id]&&(
                          <div style={{padding:"14px 16px",fontSize:13,color:G.textMid,lineHeight:1.85,whiteSpace:"pre-wrap"}}>{dynResult[aspect.id]}</div>
                        )}
                      </GothicFrame>
                    ))}
                  </div>
                </>
              )}

              {chars.length < 2 && (
                <div style={{textAlign:"center",padding:"40px 20px",color:G.textDim}}>
                  <div style={{fontSize:32,marginBottom:12,opacity:0.4}}>⚭</div>
                  <div style={{fontSize:14,color:G.textMid,marginBottom:6}}>Нужно минимум два персонажа</div>
                  <div style={{fontSize:12,color:G.textDim}}>Создайте второго персонажа через боковую панель.</div>
                  <button onClick={addChar} style={{marginTop:16,padding:"9px 20px",background:G.accent,border:"none",borderRadius:8,fontSize:13,color:G.bg,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>＋ Создать персонажа</button>
                </div>
              )}

              {chars.length >= 2 && dynCharA && dynCharB && dynCharA===dynCharB && (
                <div style={{textAlign:"center",padding:"20px",color:G.textDim,fontSize:13}}>Выберите двух <em>разных</em> персонажей</div>
              )}
            </div>
          )}

          {/* CHAT */}
          {tab==="chat" && (
            <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 50px)"}}>
              <div style={{padding:"12px 20px",borderBottom:`0.5px solid ${G.border}`,display:"flex",alignItems:"center",gap:12,background:G.surface,flexShrink:0}}>
                <Avatar char={char} size={34}/>
                <div>
                  <div style={{fontWeight:600,fontSize:13,color:G.text,fontFamily:"Georgia,serif"}}>{char.name||"Безымянный"}</div>
                  <div style={{fontSize:11,color:G.textDim}}>Диалог с персонажем · движения и психология</div>
                </div>
                <button onClick={()=>setChatMessages([])} style={{marginLeft:"auto",background:"none",border:`0.5px solid ${G.border}`,borderRadius:6,padding:"4px 10px",fontSize:11,color:G.textDim,cursor:"pointer",fontFamily:"inherit"}} className="hover-accent">Очистить</button>
              </div>
              <div style={{flex:1,overflowY:"auto",padding:"20px",display:"flex",flexDirection:"column",gap:14}}>
                {chatMessages.length===0&&(
                  <div style={{textAlign:"center",padding:"60px 20px",color:G.textDim,animation:"fadeIn 0.5s ease"}}>
                    <div style={{fontSize:40,marginBottom:16,opacity:0.5}}>✦</div>
                    <div style={{fontFamily:"Georgia,serif",fontSize:14,color:G.textMid,marginBottom:6}}>{char.name||"Персонаж"} ждёт</div>
                    <div style={{fontSize:12,color:G.textDim,lineHeight:1.6}}>Движения и жесты будут показаны курсивом.<br/>После реплики — психологический комментарий.</div>
                  </div>
                )}
                {chatMessages.map((m,i)=>{
                  if (m.role==="user") return (
                    <div key={i} style={{alignSelf:"flex-end",maxWidth:"70%",animation:"fadeIn 0.2s ease"}}>
                      <div style={{background:G.purpleDim,color:G.text,borderRadius:"14px 14px 3px 14px",padding:"10px 14px",fontSize:13,lineHeight:1.65}}>{m.content}</div>
                    </div>
                  );
                  const parts = m.content.split(/\n---\n|\n---$/);
                  return (
                    <div key={i} style={{alignSelf:"flex-start",maxWidth:"85%",display:"flex",flexDirection:"column",gap:8,animation:"fadeIn 0.2s ease"}}>
                      <GothicFrame style={{padding:"12px 16px"}}>
                        <div style={{fontSize:13,color:G.text,lineHeight:1.8}}>{renderChatMsg(parts[0]||"")}</div>
                      </GothicFrame>
                      {parts[1]&&(
                        <div style={{background:G.accentSoft,border:`0.5px solid ${G.accentDim}`,borderRadius:9,padding:"8px 12px",fontSize:12,color:G.accentDim,lineHeight:1.6,fontStyle:"italic"}}>
                          ✦ {parts[1].trim()}
                        </div>
                      )}
                    </div>
                  );
                })}
                {chatLoading&&(
                  <div style={{alignSelf:"flex-start"}}>
                    <GothicFrame style={{padding:"12px 16px",display:"inline-block"}}><LoadingDots/></GothicFrame>
                  </div>
                )}
                <div ref={chatEndRef}/>
              </div>
              <div style={{padding:"12px 16px",borderTop:`0.5px solid ${G.border}`,background:G.surface,display:"flex",gap:8,flexShrink:0}}>
                <input value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&(e.preventDefault(),sendChat())} placeholder={`Скажите что-нибудь ${char.name||"персонажу"}...`} style={{flex:1,background:G.bg,border:`0.5px solid ${G.border}`,borderRadius:10,padding:"9px 14px",fontSize:13,color:G.text,fontFamily:"inherit",outline:"none"}} onFocus={e=>e.target.style.borderColor=G.accentDim} onBlur={e=>e.target.style.borderColor=G.border}/>
                <button onClick={sendChat} disabled={chatLoading||!chatInput.trim()} style={{padding:"9px 18px",background:G.accent,border:"none",borderRadius:9,fontSize:13,color:G.bg,fontWeight:600,cursor:chatLoading?"wait":"pointer",fontFamily:"inherit",opacity:chatLoading||!chatInput.trim()?0.5:1}}>↑</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:50}} onClick={()=>setSidebarOpen(false)}/>}

      {showBio&&<BioModal char={char} updateChar={updateChar} onClose={()=>setShowBio(false)}/>}
      {showSave&&<SaveModal chars={chars} char={char} onClose={()=>setShowSave(false)}/>}
    </div>
  );
}
