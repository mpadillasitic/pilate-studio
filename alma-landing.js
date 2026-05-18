/* Alma — Asistente Lumina Pilates · Landing · Basado en reglas */
(function () {

  // ── BASE DE CONOCIMIENTO ──────────────────────────────────
  const KB = [
    {
      claves: ['precio', 'costo', 'cuánto', 'cuanto', 'vale', 'valor', 'plan', 'membresía', 'membresia', 'tarifa', 'bs'],
      respuesta: `Los planes son:\n\n• **Lunes, Miércoles y Viernes** — Bs 760/mes\n• **Martes y Jueves** — Bs 550/mes\n\nCada plan incluye acceso a todos los horarios disponibles esos días. ¿Querés más información?`,
    },
    {
      claves: ['horario', 'hora', 'turno', 'cuando', 'cuándo', 'días', 'dias', 'lunes', 'martes', 'miércoles', 'miercoles', 'jueves', 'viernes'],
      respuesta: `Nuestros horarios son:\n\n**Lunes, Miércoles y Viernes:**\n7:30 · 8:30 · 9:30 · 10:30 · 17:30 · 18:30 · 19:30\n\n**Martes y Jueves:**\n8:30 · 9:30 · 16:30 · 17:30 · 18:30 · 19:30\n\nCada clase dura 50 minutos. ¿Te interesa algún turno en particular?`,
    },
    {
      claves: ['reformer', 'mat', 'terapéutico', 'terapeutico', 'clase', 'tipo', 'disciplina', 'modalidad', 'diferencia'],
      respuesta: `Ofrecemos tres tipos de clase:\n\n• **Reformer** — Trabajo en máquina con resistencia. Fortalece y tonifica sin impacto.\n• **Mat** — En colchoneta usando el peso corporal. Base del método Pilates.\n• **Pilates Terapéutico** — Sesiones personalizadas para rehabilitación o necesidades específicas.\n\nTodas duran 50 minutos. ¿Cuál te interesa?`,
    },
    {
      claves: ['inscrib', 'registr', 'empezar', 'empez', 'comenzar', 'unir', 'entrar', 'inicio', 'nueva', 'nuevo'],
      respuesta: `¡Es muy fácil inscribirse! Podés:\n\n• Crear tu cuenta en el portal: hacé clic en **"Ingresar"** arriba\n• O escribirnos por WhatsApp y te ayudamos personalmente\n\n¿Querés que te enviemos el link de registro?`,
    },
    {
      claves: ['prueba', 'gratis', 'primera', 'probar', 'conocer', 'visita', 'demo'],
      respuesta: `¡Sí! Ofrecemos una **clase de prueba al 50% off** — Bs 140 en vez de Bs 280.\n\nSin compromiso, sin necesidad de inscribirse antes. Coordinalo directamente por WhatsApp con nosotros.`,
    },
    {
      claves: ['traer', 'necesito', 'ropa', 'equipo', 'medias', 'calzado', 'qué llevar', 'que llevar'],
      respuesta: `Solo necesitás:\n\n• Ropa cómoda deportiva\n• Medias antideslizantes\n\nEl estudio cuenta con todos los equipos (Reformers, colchonetas, etc.). No hace falta traer nada más.`,
    },
    {
      claves: ['duración', 'duracion', 'dura', 'tiempo', 'minutos'],
      respuesta: `Cada clase dura **50 minutos**. Te recomendamos llegar 5 minutos antes, especialmente la primera vez.`,
    },
    {
      claves: ['experiencia', 'principiante', 'nunca', 'primera vez', 'nivel', 'sé', 'se hacer'],
      respuesta: `¡No necesitás experiencia previa! Tenemos clases para todos los niveles.\n\nEn tu primera sesión la instructora te orienta y adapta los ejercicios a tu cuerpo. Empezamos desde cero sin problema.`,
    },
    {
      claves: ['ubicación', 'ubicacion', 'dirección', 'direccion', 'dónde', 'donde', 'lugar', 'llegar'],
      respuesta: `Estamos en **Santa Cruz de la Sierra, Bolivia** — zona Equipetrol / zona norte.\n\nPara la dirección exacta y cómo llegar, escribinos por WhatsApp y te mandamos el pin de ubicación.`,
    },
    {
      claves: ['cancelar', 'licencia', 'faltar', 'no puedo', 'ausencia', 'cambiar', 'recuperar'],
      respuesta: `Podés solicitar **licencia hasta 2 horas antes** de tu clase y el crédito se devuelve automáticamente.\n\nLas cancelaciones fuera de plazo no recuperan el crédito. Podés gestionar todo desde tu portal de alumna.`,
    },
    {
      claves: ['contacto', 'whatsapp', 'teléfono', 'telefono', 'llamar', 'escribir', 'comunicar', 'hablar'],
      respuesta: `Podés contactarnos por:\n\n• **WhatsApp:** +591 75 050 000\n• **Email:** hola@luminapilates.bo\n\nEstamos disponibles para responder tus dudas.`,
    },
    {
      claves: ['hola', 'buenas', 'buenos', 'hey', 'buen día', 'buen dia', 'saludos'],
      respuesta: `¡Hola! 🌿 Soy Alma, la asistente de Lumina Pilates. Estoy aquí para contarte todo sobre nuestras clases, horarios y planes.\n\n¿En qué te puedo ayudar?`,
    },
    {
      claves: ['gracias', 'genial', 'perfecto', 'excelente', 'ok', 'okay', 'entendí', 'entendi', 'claro'],
      respuesta: `¡Con gusto! Si tenés más preguntas, acá estoy. También podés escribirnos directamente por WhatsApp cuando quieras. 🌿`,
    },
  ];

  const RESPUESTA_DEFAULT = `No tengo información específica sobre eso, pero nuestro equipo puede ayudarte.\n\n📱 Escribinos por **WhatsApp: +591 75 050 000** y te respondemos enseguida.`;

  const WHATSAPP_URL = 'https://wa.me/59175050000';

  const CHIPS_INICIAL = [
    '¿Cuánto cuesta?',
    '¿Qué horarios tienen?',
    '¿Qué tipos de clase hay?',
    '¿Cómo me inscribo?',
    'Clase de prueba',
  ];

  // ── Lógica de respuesta ───────────────────────────────────
  function responder(texto) {
    const lower = texto.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // quitar tildes para comparar

    for (const item of KB) {
      for (const clave of item.claves) {
        const claveNorm = clave.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        if (lower.includes(claveNorm)) {
          return item.respuesta;
        }
      }
    }
    return RESPUESTA_DEFAULT;
  }

  // Convertir **negrita** y saltos de línea a HTML
  function formatear(texto) {
    return texto
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  }

  // ── Estilos ───────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    #alma-btn {
      position: fixed; bottom: 28px; right: 28px; z-index: 9000;
      width: 54px; height: 54px; border-radius: 50%;
      background: #1a2e1f; border: none; cursor: pointer;
      box-shadow: 0 4px 20px rgba(26,46,31,0.35);
      display: flex; align-items: center; justify-content: center;
      transition: transform 0.2s, box-shadow 0.2s; font-size: 22px;
    }
    #alma-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(26,46,31,0.45); }
    #alma-btn .alma-pulse {
      position: absolute; inset: -4px; border-radius: 50%;
      border: 2px solid rgba(201,169,110,0.4);
      animation: alma-pulse 2.5s ease-out infinite;
    }
    @keyframes alma-pulse {
      0% { transform: scale(1); opacity: 0.6; }
      100% { transform: scale(1.5); opacity: 0; }
    }
    #alma-bubble {
      position: fixed; bottom: 92px; right: 28px; z-index: 9001;
      width: 360px; max-width: calc(100vw - 40px);
      background: #FDFCFA; border: 1px solid #EDE8DE;
      border-radius: 16px; box-shadow: 0 8px 48px rgba(28,28,26,0.14);
      display: flex; flex-direction: column; overflow: hidden;
      transform: scale(0.92) translateY(12px); opacity: 0; pointer-events: none;
      transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1), opacity 0.18s ease;
      font-family: 'DM Sans', system-ui, sans-serif; -webkit-font-smoothing: antialiased;
    }
    #alma-bubble.open { transform: scale(1) translateY(0); opacity: 1; pointer-events: all; }
    .alma-header {
      background: #1a2e1f; padding: 14px 16px;
      display: flex; align-items: center; gap: 10px;
    }
    .alma-avatar {
      width: 34px; height: 34px; border-radius: 50%;
      background: linear-gradient(135deg, #8C7A5E, #A08545);
      display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0;
    }
    .alma-name { font-size: 13px; font-weight: 500; color: rgba(250,247,242,0.9); }
    .alma-status { font-size: 10px; color: #C4B89A; margin-top: 1px; }
    .alma-close {
      margin-left: auto; background: none; border: none;
      color: rgba(196,184,154,0.5); font-size: 18px; cursor: pointer;
      padding: 2px 4px; line-height: 1; transition: color 0.15s;
    }
    .alma-close:hover { color: rgba(250,247,242,0.7); }
    .alma-messages {
      flex: 1; overflow-y: auto; padding: 16px;
      display: flex; flex-direction: column; gap: 10px;
      max-height: 320px; min-height: 180px;
    }
    .alma-messages::-webkit-scrollbar { width: 3px; }
    .alma-messages::-webkit-scrollbar-thumb { background: #EDE8DE; border-radius: 3px; }
    .alma-msg { display: flex; gap: 8px; animation: alma-in 0.18s ease; }
    @keyframes alma-in { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:none} }
    .alma-msg.user { flex-direction: row-reverse; }
    .alma-msg-av {
      width: 26px; height: 26px; border-radius: 50%;
      background: #1a2e1f; display: flex; align-items: center;
      justify-content: center; font-size: 12px; flex-shrink: 0; margin-top: 2px;
    }
    .alma-msg.user .alma-msg-av { background: #EDE8DE; }
    .alma-bbl {
      max-width: 84%; padding: 9px 12px; border-radius: 12px;
      font-size: 13px; line-height: 1.55; color: #1C1C1A; background: #F0EBE3;
    }
    .alma-msg.user .alma-bbl {
      background: #1a2e1f; color: rgba(250,247,242,0.9);
      border-radius: 12px 12px 2px 12px;
    }
    .alma-msg.alma .alma-bbl { border-radius: 2px 12px 12px 12px; }
    .alma-bbl strong { font-weight: 600; }
    .alma-chips {
      padding: 0 14px 10px; display: flex; flex-wrap: wrap; gap: 6px;
    }
    .alma-chip {
      padding: 5px 11px; background: #FAF7F2;
      border: 1px solid #EDE8DE; border-radius: 99px;
      font-size: 11px; color: #4A4A45; cursor: pointer;
      transition: all 0.15s; font-family: 'DM Sans', sans-serif;
      text-decoration: none; display: inline-block;
    }
    .alma-chip:hover { background: #EDE8DE; color: #1C1C1A; border-color: #C4B89A; }
    .alma-input-row {
      padding: 10px 12px; border-top: 1px solid #EDE8DE;
      display: flex; gap: 8px; align-items: center; background: #FDFCFA;
    }
    .alma-input {
      flex: 1; background: #FAF7F2; border: 1.5px solid #EDE8DE;
      border-radius: 99px; padding: 8px 14px; font-size: 13px;
      font-family: 'DM Sans', sans-serif; color: #1C1C1A; outline: none;
      transition: border-color 0.15s;
    }
    .alma-input:focus { border-color: #C4B89A; }
    .alma-input::placeholder { color: #C4B89A; }
    .alma-send {
      width: 34px; height: 34px; border-radius: 50%;
      background: #1a2e1f; border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      font-size: 14px; transition: all 0.15s; flex-shrink: 0;
    }
    .alma-send:hover { background: #2e2e2b; transform: scale(1.05); }
  `;
  document.head.appendChild(style);

  // ── HTML ──────────────────────────────────────────────────
  document.body.insertAdjacentHTML('beforeend', `
    <button id="alma-btn" onclick="almaToggle()" aria-label="Abrir asistente Alma">
      <span class="alma-pulse"></span>🌿
    </button>
    <div id="alma-bubble" role="dialog" aria-label="Chat con Alma">
      <div class="alma-header">
        <div class="alma-avatar">🌿</div>
        <div>
          <div class="alma-name">Alma</div>
          <div class="alma-status">Asistente de Lumina Pilates</div>
        </div>
        <button class="alma-close" onclick="almaToggle()">×</button>
      </div>
      <div class="alma-messages" id="alma-msgs"></div>
      <div class="alma-chips" id="alma-chips"></div>
      <div class="alma-input-row">
        <input class="alma-input" id="alma-input"
          placeholder="Escribí tu pregunta…"
          onkeydown="if(event.key==='Enter')almaSend()"
          autocomplete="off">
        <button class="alma-send" onclick="almaSend()">➤</button>
      </div>
    </div>
  `);

  // ── Estado ────────────────────────────────────────────────
  let almaOpen = false;

  window.almaToggle = function () {
    almaOpen = !almaOpen;
    document.getElementById('alma-bubble').classList.toggle('open', almaOpen);
    if (almaOpen && document.getElementById('alma-msgs').children.length === 0) {
      addMsg('alma', '¡Hola! Soy Alma 🌿 Estoy aquí para contarte todo sobre Lumina Pilates. ¿En qué te puedo ayudar?');
      setChips(CHIPS_INICIAL);
      setTimeout(() => document.getElementById('alma-input').focus(), 200);
    }
  };

  window.almaSend = function (texto) {
    const input = document.getElementById('alma-input');
    const msg = (texto || input.value).trim();
    if (!msg) return;
    input.value = '';
    setChips([]);
    addMsg('user', msg);

    // Simular pequeño delay de "escritura"
    setTimeout(() => {
      const reply = responder(msg);
      addMsg('alma', formatear(reply));

      // Chips post-respuesta contextuales
      if (reply === RESPUESTA_DEFAULT) {
        setChips([{ label: '💬 Escribir a WhatsApp', href: WHATSAPP_URL }]);
      } else {
        setChips(['¿Algo más?', '¿Cómo me inscribo?', { label: '💬 WhatsApp', href: WHATSAPP_URL }]);
      }
    }, 400);
  };

  function setChips(chips) {
    document.getElementById('alma-chips').innerHTML = chips.map(c => {
      if (typeof c === 'object') {
        return `<a href="${c.href}" target="_blank" class="alma-chip">${c.label}</a>`;
      }
      return `<button class="alma-chip" onclick="almaSend('${c}')">${c}</button>`;
    }).join('');
  }

  function addMsg(from, html) {
    const msgs = document.getElementById('alma-msgs');
    const div = document.createElement('div');
    div.className = `alma-msg ${from}`;
    div.innerHTML = `
      <div class="alma-msg-av">${from === 'alma' ? '🌿' : '👤'}</div>
      <div class="alma-bbl">${html}</div>
    `;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

})();
