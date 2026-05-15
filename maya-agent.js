/* Floating AI agent — Maya
   Shared across landing + portals
   Persisted open state in localStorage */

(function () {
  const PRESET = [
    {
      q: ['horario', 'horarios', 'cuándo abren', 'cuando abren', 'horario de atencion'],
      a: 'Estamos abiertos de Lunes a Viernes de 6:30 AM a 9:30 PM, y los Sábados de 8:00 AM a 2:00 PM. Los Domingos descansamos. 🌿'
    },
    {
      q: ['membresía', 'membresia', 'planes', 'precios', 'cuánto cuesta', 'cuanto cuesta'],
      a: 'Tenemos tres membresías:\n\n• Essential — 8 clases / mes · $89\n• Flow — 12 clases / mes · $129\n• Boundless — ilimitado · $189\n\n¿Te gustaría que un instructor te recomiende la mejor según tus objetivos?'
    },
    {
      q: ['reservar', 'reserva', 'agendar', 'clase'],
      a: 'Puedes reservar directamente desde tu portal en /dashboard. Si aún no tienes cuenta, te invito a tomar una clase de prueba — la primera es 50% off.'
    },
    {
      q: ['reformer', 'mat', 'motr', 'disciplinas'],
      a: 'Trabajamos tres disciplinas:\n\n• Reformer — resistencia y control mediante resortes\n• Mat Pilates — estabilidad y conciencia corporal\n• MOTR — entrenamiento funcional dinámico\n\n¿Cuál te llama más la atención?'
    },
    {
      q: ['licencia', 'cancelar', 'no puedo asistir'],
      a: 'Puedes solicitar una licencia desde tu portal hasta 2 horas antes del inicio de la clase. El crédito se devuelve automáticamente. Si la clase es de recuperación, también podemos reprogramarla.'
    },
    {
      q: ['instructor', 'profesor', 'maestro', 'equipo'],
      a: 'Nuestro equipo está certificado en Polestar Pilates y Balanced Body, con más de 5 años de experiencia promedio en correctivo y rehabilitación. ¿Quieres conocerlos?'
    },
    {
      q: ['ubicación', 'ubicacion', 'dirección', 'direccion', 'dónde están', 'donde estan'],
      a: 'Estamos en Av. Reforma 412, Polanco — segundo piso del edificio Solaris. Hay valet parking y estación de metro a 4 min caminando.'
    },
    {
      q: ['principiante', 'nunca', 'primera vez', 'empezar'],
      a: '¡Bienvenida/o! Recomendamos comenzar con Mat Pilates Foundations o Reformer Intro. Tu primera clase incluye una evaluación postural sin costo extra. ¿Te agendo una?'
    }
  ];

  const FALLBACK = 'Esa es una excelente pregunta. Déjame conectar con el equipo — mientras tanto, ¿te interesa conocer nuestras membresías o reservar una clase de prueba?';

  function reply(text) {
    const lower = text.toLowerCase();
    for (const item of PRESET) {
      if (item.q.some(k => lower.includes(k))) return item.a;
    }
    return FALLBACK;
  }

  const css = `
    .maya-fab {
      position: fixed; right: 22px; bottom: 22px; z-index: 9000;
      width: 60px; height: 60px; border-radius: 999px;
      background: var(--ink-2); color: var(--bg);
      display: flex; align-items: center; justify-content: center;
      border: none; cursor: pointer;
      box-shadow: 0 16px 40px -10px rgba(31,42,31,0.45), 0 2px 6px rgba(31,42,31,0.2);
      transition: transform .2s ease, box-shadow .2s ease;
    }
    .maya-fab:hover { transform: translateY(-2px) scale(1.03); box-shadow: 0 22px 50px -10px rgba(31,42,31,0.55); }
    .maya-fab .pulse {
      position: absolute; inset: -4px;
      border-radius: 999px;
      border: 1.5px solid var(--sage);
      opacity: 0; animation: mayaPulse 2.6s ease-out infinite;
      pointer-events: none;
    }
    @keyframes mayaPulse {
      0% { transform: scale(0.9); opacity: 0.7; }
      70% { transform: scale(1.4); opacity: 0; }
      100% { opacity: 0; }
    }
    .maya-fab .dot {
      position: absolute; top: 8px; right: 8px;
      width: 10px; height: 10px; border-radius: 999px;
      background: #b9d36a; border: 2px solid var(--ink-2);
    }
    .maya-panel {
      position: fixed; right: 22px; bottom: 96px; z-index: 9001;
      width: 380px; max-width: calc(100vw - 32px);
      height: 560px; max-height: calc(100vh - 130px);
      border-radius: 24px;
      background: rgba(253, 252, 249, 0.88);
      backdrop-filter: blur(28px) saturate(160%);
      -webkit-backdrop-filter: blur(28px) saturate(160%);
      border: 1px solid rgba(255,255,255,0.7);
      box-shadow: 0 40px 100px -30px rgba(31,42,31,0.4), 0 12px 30px rgba(31,42,31,0.1);
      display: flex; flex-direction: column;
      overflow: hidden;
      transform-origin: bottom right;
      transform: translateY(8px) scale(.96); opacity: 0; pointer-events: none;
      transition: transform .28s cubic-bezier(.2,.7,.2,1), opacity .2s ease;
    }
    .maya-panel.open { transform: translateY(0) scale(1); opacity: 1; pointer-events: auto; }
    .maya-head {
      padding: 18px 20px; display: flex; align-items: center; gap: 12px;
      border-bottom: 1px solid var(--line);
    }
    .maya-avatar {
      width: 38px; height: 38px; border-radius: 999px;
      background: linear-gradient(135deg, var(--sage) 0%, var(--ink-2) 100%);
      display: flex; align-items: center; justify-content: center;
      color: var(--bg); font-family: var(--font-serif); font-size: 18px;
    }
    .maya-head .name { font-size: 14px; font-weight: 500; color: var(--ink); letter-spacing: -0.01em; }
    .maya-head .status { font-size: 11px; color: var(--muted); display: flex; align-items: center; gap: 5px; margin-top: 2px; }
    .maya-head .status::before { content: ''; width: 6px; height: 6px; border-radius: 999px; background: #6ea84a; }
    .maya-close {
      margin-left: auto; background: transparent; border: 1px solid var(--line-2);
      width: 28px; height: 28px; border-radius: 999px; cursor: pointer;
      color: var(--muted); display: flex; align-items: center; justify-content: center;
    }
    .maya-close:hover { background: rgba(0,0,0,0.04); }
    .maya-body {
      flex: 1; overflow-y: auto; padding: 18px 18px 8px;
      display: flex; flex-direction: column; gap: 10px;
    }
    .maya-msg {
      max-width: 84%;
      padding: 11px 14px;
      border-radius: 16px;
      font-size: 13.5px; line-height: 1.5;
      white-space: pre-wrap;
      animation: mayaFade .25s ease;
    }
    @keyframes mayaFade {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .maya-msg.bot {
      background: var(--white);
      border: 1px solid var(--line);
      color: var(--ink);
      align-self: flex-start;
      border-bottom-left-radius: 6px;
    }
    .maya-msg.user {
      background: var(--ink-2);
      color: var(--bg);
      align-self: flex-end;
      border-bottom-right-radius: 6px;
    }
    .maya-typing {
      align-self: flex-start;
      display: flex; gap: 4px; padding: 14px;
      background: var(--white); border: 1px solid var(--line);
      border-radius: 16px; border-bottom-left-radius: 6px;
    }
    .maya-typing span {
      width: 6px; height: 6px; border-radius: 999px; background: var(--muted-2);
      animation: mayaTyping 1.2s infinite ease-in-out;
    }
    .maya-typing span:nth-child(2) { animation-delay: .15s; }
    .maya-typing span:nth-child(3) { animation-delay: .3s; }
    @keyframes mayaTyping {
      0%, 60%, 100% { transform: translateY(0); opacity: .4; }
      30% { transform: translateY(-4px); opacity: 1; }
    }
    .maya-quick {
      padding: 0 18px 10px;
      display: flex; gap: 6px; flex-wrap: wrap;
    }
    .maya-quick button {
      background: transparent; border: 1px solid var(--line-2);
      border-radius: 999px; padding: 7px 12px;
      font-family: var(--font-sans); font-size: 12px;
      color: var(--ink); cursor: pointer;
      transition: background .15s ease;
    }
    .maya-quick button:hover { background: var(--bg-2); }
    .maya-input {
      padding: 12px 14px 14px;
      border-top: 1px solid var(--line);
      display: flex; gap: 8px; align-items: center;
      background: rgba(253,252,249,0.4);
    }
    .maya-input input {
      flex: 1; padding: 10px 14px;
      background: var(--white); border: 1px solid var(--line);
      border-radius: 999px; font-family: var(--font-sans); font-size: 13.5px;
      color: var(--ink); outline: none;
    }
    .maya-input input:focus { border-color: var(--sage); }
    .maya-send {
      width: 36px; height: 36px; border-radius: 999px;
      background: var(--ink-2); color: var(--bg);
      border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
    }
    .maya-foot {
      font-size: 10.5px; color: var(--muted);
      text-align: center; padding: 0 0 10px;
      font-family: var(--font-mono); letter-spacing: 0.06em;
    }
  `;

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  const fab = document.createElement('button');
  fab.className = 'maya-fab';
  fab.setAttribute('aria-label', 'Abrir asistente Maya');
  fab.innerHTML = `
    <span class="pulse"></span>
    <span class="dot"></span>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2C7 2 3 5.6 3 10c0 2.3 1.1 4.4 2.9 5.9L5 21l4.8-2.1c.7.1 1.4.2 2.2.2 5 0 9-3.6 9-8s-4-9-9-9z"/>
      <circle cx="9" cy="10" r="1" fill="currentColor"/>
      <circle cx="12" cy="10" r="1" fill="currentColor"/>
      <circle cx="15" cy="10" r="1" fill="currentColor"/>
    </svg>
  `;
  document.body.appendChild(fab);

  const panel = document.createElement('div');
  panel.className = 'maya-panel';
  panel.innerHTML = `
    <div class="maya-head">
      <div class="maya-avatar">M</div>
      <div>
        <div class="name">Maya</div>
        <div class="status">Asistente Move · respondiendo ahora</div>
      </div>
      <button class="maya-close" aria-label="Cerrar">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
    </div>
    <div class="maya-body" id="mayaBody"></div>
    <div class="maya-quick" id="mayaQuick">
      <button data-q="¿Cuáles son sus membresías?">Membresías</button>
      <button data-q="¿Cómo reservo una clase?">Reservar</button>
      <button data-q="¿Cuál es la ubicación?">Ubicación</button>
      <button data-q="Soy principiante, ¿por dónde empiezo?">Soy nueva/o</button>
    </div>
    <div class="maya-input">
      <input type="text" id="mayaInput" placeholder="Pregúntale a Maya..." autocomplete="off"/>
      <button class="maya-send" id="mayaSend" aria-label="Enviar">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 12h14M13 6l6 6-6 6"/>
        </svg>
      </button>
    </div>
    <div class="maya-foot">POTENCIADO POR MOVE · IA</div>
  `;
  document.body.appendChild(panel);

  const body = panel.querySelector('#mayaBody');
  const input = panel.querySelector('#mayaInput');
  const send = panel.querySelector('#mayaSend');
  const close = panel.querySelector('.maya-close');
  const quick = panel.querySelector('#mayaQuick');

  function append(role, text) {
    const m = document.createElement('div');
    m.className = 'maya-msg ' + role;
    m.textContent = text;
    body.appendChild(m);
    body.scrollTop = body.scrollHeight;
  }

  function typing() {
    const t = document.createElement('div');
    t.className = 'maya-typing';
    t.innerHTML = '<span></span><span></span><span></span>';
    body.appendChild(t);
    body.scrollTop = body.scrollHeight;
    return t;
  }

  function ask(q) {
    append('user', q);
    const t = typing();
    setTimeout(() => {
      t.remove();
      append('bot', reply(q));
    }, 700 + Math.random() * 400);
  }

  function open() {
    panel.classList.add('open');
    if (!body.children.length) {
      setTimeout(() => append('bot', 'Hola, soy Maya — tu asistente de Move Studio 🌿\n\n¿En qué puedo ayudarte hoy? Puedo contarte sobre clases, membresías, ubicación o reservar tu primera sesión.'), 200);
    }
    setTimeout(() => input.focus(), 300);
  }
  function closePanel() { panel.classList.remove('open'); }

  fab.addEventListener('click', () => {
    if (panel.classList.contains('open')) closePanel(); else open();
  });
  close.addEventListener('click', closePanel);
  send.addEventListener('click', () => {
    const v = input.value.trim();
    if (!v) return;
    input.value = '';
    ask(v);
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') send.click();
  });
  quick.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-q]');
    if (b) ask(b.dataset.q);
  });

  // Auto-open option via ?maya=1
  if (location.search.includes('maya=1')) setTimeout(open, 800);
})();
