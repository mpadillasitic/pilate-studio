/* Alma — Asistente Lumina Pilates · Dashboard · Basado en reglas */
(function () {

  const WHATSAPP_URL = 'https://wa.me/59175050000';

  // ── BASE DE CONOCIMIENTO — contexto de alumna ─────────────
  function buildKB() {
    const D = window.MOVE_DATA || {};
    const creditos = D.credits?.remaining ?? 0;
    const total = D.credits?.total ?? 0;
    const plan = D.user?.plan || 'Sin membresía';
    const vence = D.credits?.cycle_end
      ? new Date(D.credits.cycle_end).toLocaleDateString('es-BO', { day: 'numeric', month: 'long' })
      : null;
    const proximas = (D.upcoming || []);
    const nombre = D.user?.firstName || '';

    return [
      {
        claves: ['crédito', 'credito', 'cuántos', 'cuantos', 'saldo', 'me quedan', 'tengo'],
        respuesta: total === 0
          ? `Actualmente no tenés una membresía activa, por eso no hay créditos disponibles. Hablá con el estudio para activar tu plan.`
          : `Tenés **${creditos} crédito${creditos !== 1 ? 's' : ''}** disponibles de ${total} del mes${vence ? `. Tu plan vence el ${vence}` : ''}.`,
      },
      {
        claves: ['plan', 'membresía', 'membresia', 'suscripción', 'suscripcion', 'mi plan'],
        respuesta: plan === 'Sin membresía'
          ? `Todavía no tenés una membresía activa. Escribinos por WhatsApp o hablá con el administrador del estudio para activar tu plan.`
          : `Tu plan actual es **${plan}**${vence ? `, con vencimiento el ${vence}` : ''}. Tenés **${creditos} crédito${creditos !== 1 ? 's' : ''}** disponibles.`,
      },
      {
        claves: ['vence', 'vencimiento', 'expira', 'hasta cuándo', 'hasta cuando', 'vigencia'],
        respuesta: vence
          ? `Tu membresía vence el **${vence}**. Acordate de renovar antes de esa fecha para no perder tus créditos.`
          : `No tenés una membresía activa en este momento. Contactá al estudio para activar tu plan.`,
      },
      {
        claves: ['reservar', 'reserva', 'anotar', 'inscribir', 'cómo reservo', 'como reservo', 'clase'],
        respuesta: creditos === 0
          ? `Para reservar necesitás créditos disponibles. Actualmente tenés **0 créditos**. Hablá con el estudio para renovar tu plan.`
          : `Para reservar una clase:\n\n1. Andá a **Calendario** en el menú\n2. Elegí el día y horario que quieras\n3. Hacé clic en **Reservar**\n\nCada reserva consume 1 crédito. Tenés ${creditos} disponibles.`,
      },
      {
        claves: ['próxima', 'proxima', 'siguiente', 'tengo reservada', 'mis clases', 'cuándo', 'cuando'],
        respuesta: proximas.length > 0
          ? `Tu próxima clase es **${proximas[0].name}** el ${proximas[0].date} a las ${proximas[0].start}${proximas[0].coach ? ` con ${proximas[0].coach}` : ''}.`
          : `No tenés clases reservadas próximamente. Podés reservar desde el **Calendario** en el menú.`,
      },
      {
        claves: ['licencia', 'cancelar', 'faltar', 'no puedo ir', 'ausencia', 'solicitar'],
        respuesta: `Para solicitar una licencia:\n\n1. Andá a **Calendario**\n2. Encontrá tu clase reservada\n3. Hacé clic en **Solicitar licencia**\n\n⚠️ Tenés que solicitarla **hasta 2 horas antes** de la clase para que el crédito se devuelva automáticamente.`,
      },
      {
        claves: ['recuperar', 'recuperación', 'recuperacion', 'makeup', 'perdí', 'perdi', 'clase perdida'],
        respuesta: `Las clases con licencia aprobada pueden recuperarse según disponibilidad durante el mes.\n\nDesde el menú **Recuperaciones** podés ver las opciones disponibles. Los créditos con licencia aprobada se devuelven automáticamente.`,
      },
      {
        claves: ['historial', 'mis clases pasadas', 'anteriores', 'asistí', 'asisti', 'registro'],
        respuesta: `En la sección **Historial** del menú podés ver todas tus clases anteriores, incluyendo el estado de cada una (asistida, licencia, recuperación).`,
      },
      {
        claves: ['evaluación', 'evaluacion', 'progreso', 'avance', 'mis evaluaciones'],
        respuesta: `En la sección **Evaluaciones** podés ver el registro de tus evaluaciones realizadas por tu instructora. Ahí encontrás observaciones posturales, objetivos y plan de trabajo.`,
      },
      {
        claves: ['perfil', 'datos', 'mi cuenta', 'información personal', 'cambiar'],
        respuesta: `En la sección **Perfil** del menú podés ver y actualizar tus datos personales. Para cambios en tu membresía o plan, contactá directamente al estudio.`,
      },
      {
        claves: ['horario', 'hora', 'turnos', 'lunes', 'martes', 'miércoles', 'miercoles', 'jueves', 'viernes'],
        respuesta: `Los horarios del estudio son:\n\n**Lunes, Miércoles y Viernes:**\n7:30 · 8:30 · 9:30 · 10:30 · 17:30 · 18:30 · 19:30\n\n**Martes y Jueves:**\n8:30 · 9:30 · 16:30 · 17:30 · 18:30 · 19:30`,
      },
      {
        claves: ['hola', 'buenas', 'buenos', 'hey', 'buen día', 'buen dia', 'saludos'],
        respuesta: nombre
          ? `¡Hola, ${nombre}! 🌿 Soy Alma. ¿En qué te puedo ayudar hoy?`
          : `¡Hola! 🌿 Soy Alma. ¿En qué te puedo ayudar?`,
      },
      {
        claves: ['gracias', 'genial', 'perfecto', 'excelente', 'ok', 'okay', 'listo', 'entendí', 'entendi'],
        respuesta: `¡Con gusto! Si tenés más dudas, acá estoy. 🌿`,
      },
      {
        claves: ['contacto', 'whatsapp', 'teléfono', 'telefono', 'llamar', 'escribir', 'hablar', 'comunicar'],
        respuesta: `Podés contactar al estudio por:\n\n• **WhatsApp:** +591 75 050 000\n• **Email:** hola@luminapilates.bo`,
      },
    ];
  }

  const RESPUESTA_DEFAULT = `No tengo información específica sobre eso. Para consultas personalizadas, escribinos directamente por **WhatsApp: +591 75 050 000**.`;

  function responder(texto) {
    const KB = buildKB();
    const lower = texto.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    for (const item of KB) {
      for (const clave of item.claves) {
        const claveNorm = clave.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        if (lower.includes(claveNorm)) return item.respuesta;
      }
    }
    return RESPUESTA_DEFAULT;
  }

  function formatear(texto) {
    return texto
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  }

  function getChipsIniciales() {
    const D = window.MOVE_DATA || {};
    const cred = D.credits?.remaining ?? 0;
    const plan = D.user?.plan || '';
    if (!plan || plan === 'Sin membresía') {
      return ['¿Cómo activo mi plan?', '¿Qué planes hay?', '¿Cómo funciona el portal?'];
    }
    if (cred === 0) {
      return ['¿Cuándo vence mi membresía?', '¿Cómo renuevo?', '¿Qué horarios tienen?'];
    }
    return ['¿Cómo reservo?', '¿Cómo pido licencia?', '¿Cuántos créditos tengo?', '¿Cuándo vence mi plan?'];
  }

  // ── Estilos ───────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    #almad-btn {
      position: fixed; bottom: 28px; right: 28px; z-index: 9000;
      width: 50px; height: 50px; border-radius: 50%;
      background: #1a2e1f; border: none; cursor: pointer;
      box-shadow: 0 4px 20px rgba(26,46,31,0.3);
      display: flex; align-items: center; justify-content: center;
      transition: transform 0.2s, box-shadow 0.2s; font-size: 20px;
    }
    #almad-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(26,46,31,0.4); }
    #almad-bubble {
      position: fixed; bottom: 88px; right: 28px; z-index: 9001;
      width: 360px; max-width: calc(100vw - 40px);
      background: #FDFCFA; border: 1px solid #EDE8DE;
      border-radius: 16px; box-shadow: 0 8px 48px rgba(28,28,26,0.14);
      display: flex; flex-direction: column; overflow: hidden;
      transform: scale(0.92) translateY(12px); opacity: 0; pointer-events: none;
      transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1), opacity 0.18s ease;
      font-family: 'DM Sans', system-ui, sans-serif; -webkit-font-smoothing: antialiased;
    }
    #almad-bubble.open { transform: scale(1) translateY(0); opacity: 1; pointer-events: all; }
    .almad-header {
      background: #1a2e1f; padding: 14px 16px;
      display: flex; align-items: center; gap: 10px;
    }
    .almad-avatar {
      width: 34px; height: 34px; border-radius: 50%;
      background: linear-gradient(135deg, #8C7A5E, #A08545);
      display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0;
    }
    .almad-name { font-size: 13px; font-weight: 500; color: rgba(250,247,242,0.9); }
    .almad-status { font-size: 10px; color: #C4B89A; margin-top: 1px; }
    .almad-close {
      margin-left: auto; background: none; border: none;
      color: rgba(196,184,154,0.5); font-size: 18px; cursor: pointer;
      padding: 2px 4px; line-height: 1; transition: color 0.15s;
    }
    .almad-close:hover { color: rgba(250,247,242,0.7); }
    .almad-messages {
      flex: 1; overflow-y: auto; padding: 16px;
      display: flex; flex-direction: column; gap: 10px;
      max-height: 320px; min-height: 180px;
    }
    .almad-messages::-webkit-scrollbar { width: 3px; }
    .almad-messages::-webkit-scrollbar-thumb { background: #EDE8DE; border-radius: 3px; }
    .almad-msg { display: flex; gap: 8px; animation: almad-in 0.18s ease; }
    @keyframes almad-in { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:none} }
    .almad-msg.user { flex-direction: row-reverse; }
    .almad-msg-av {
      width: 26px; height: 26px; border-radius: 50%;
      background: #1a2e1f; display: flex; align-items: center;
      justify-content: center; font-size: 12px; flex-shrink: 0; margin-top: 2px;
    }
    .almad-msg.user .almad-msg-av { background: #EDE8DE; }
    .almad-bbl {
      max-width: 84%; padding: 9px 12px; border-radius: 12px;
      font-size: 13px; line-height: 1.55; color: #1C1C1A; background: #F0EBE3;
    }
    .almad-msg.user .almad-bbl {
      background: #1a2e1f; color: rgba(250,247,242,0.9);
      border-radius: 12px 12px 2px 12px;
    }
    .almad-msg.alma .almad-bbl { border-radius: 2px 12px 12px 12px; }
    .almad-bbl strong { font-weight: 600; }
    .almad-chips {
      padding: 0 14px 10px; display: flex; flex-wrap: wrap; gap: 6px;
    }
    .almad-chip {
      padding: 5px 11px; background: #FAF7F2;
      border: 1px solid #EDE8DE; border-radius: 99px;
      font-size: 11px; color: #4A4A45; cursor: pointer;
      transition: all 0.15s; font-family: 'DM Sans', sans-serif;
      text-decoration: none; display: inline-block;
    }
    .almad-chip:hover { background: #EDE8DE; color: #1C1C1A; border-color: #C4B89A; }
    .almad-input-row {
      padding: 10px 12px; border-top: 1px solid #EDE8DE;
      display: flex; gap: 8px; align-items: center; background: #FDFCFA;
    }
    .almad-input {
      flex: 1; background: #FAF7F2; border: 1.5px solid #EDE8DE;
      border-radius: 99px; padding: 8px 14px; font-size: 13px;
      font-family: 'DM Sans', sans-serif; color: #1C1C1A; outline: none;
      transition: border-color 0.15s;
    }
    .almad-input:focus { border-color: #C4B89A; }
    .almad-input::placeholder { color: #C4B89A; }
    .almad-send {
      width: 34px; height: 34px; border-radius: 50%;
      background: #1a2e1f; border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      font-size: 14px; transition: all 0.15s; flex-shrink: 0;
    }
    .almad-send:hover { background: #2e2e2b; transform: scale(1.05); }
  `;
  document.head.appendChild(style);

  // ── HTML ──────────────────────────────────────────────────
  document.body.insertAdjacentHTML('beforeend', `
    <button id="almad-btn" onclick="almaDToggle()" aria-label="Abrir Alma">🌿</button>
    <div id="almad-bubble" role="dialog">
      <div class="almad-header">
        <div class="almad-avatar">🌿</div>
        <div>
          <div class="almad-name">Alma</div>
          <div class="almad-status">Tu asistente personal</div>
        </div>
        <button class="almad-close" onclick="almaDToggle()">×</button>
      </div>
      <div class="almad-messages" id="almad-msgs"></div>
      <div class="almad-chips" id="almad-chips"></div>
      <div class="almad-input-row">
        <input class="almad-input" id="almad-input"
          placeholder="¿En qué te ayudo?"
          onkeydown="if(event.key==='Enter')almaDSend()"
          autocomplete="off">
        <button class="almad-send" onclick="almaDSend()">➤</button>
      </div>
    </div>
  `);

  // ── Estado ────────────────────────────────────────────────
  let almaDOpen = false;

  window.almaDToggle = function () {
    almaDOpen = !almaDOpen;
    document.getElementById('almad-bubble').classList.toggle('open', almaDOpen);
    if (almaDOpen && document.getElementById('almad-msgs').children.length === 0) {
      const nombre = window.MOVE_DATA?.user?.firstName || '';
      addMsg('alma', formatear(nombre
        ? `¡Hola, ${nombre}! 🌿 Soy Alma, tu asistente. ¿En qué te puedo ayudar hoy?`
        : `¡Hola! 🌿 Soy Alma. ¿En qué te puedo ayudar?`));
      setChips(getChipsIniciales());
      setTimeout(() => document.getElementById('almad-input').focus(), 200);
    }
  };

  window.almaDSend = function (texto) {
    const input = document.getElementById('almad-input');
    const msg = (texto || input.value).trim();
    if (!msg) return;
    input.value = '';
    setChips([]);
    addMsg('user', msg);
    setTimeout(() => {
      const reply = responder(msg);
      addMsg('alma', formatear(reply));
      if (reply === RESPUESTA_DEFAULT) {
        setChips([{ label: '💬 Escribir a WhatsApp', href: WHATSAPP_URL }]);
      } else {
        setChips(['Otra consulta', '¿Cómo reservo?', { label: '💬 WhatsApp', href: WHATSAPP_URL }]);
      }
    }, 350);
  };

  function setChips(chips) {
    document.getElementById('almad-chips').innerHTML = chips.map(c => {
      if (typeof c === 'object') {
        return `<a href="${c.href}" target="_blank" class="almad-chip">${c.label}</a>`;
      }
      return `<button class="almad-chip" onclick="almaDSend('${c}')">${c}</button>`;
    }).join('');
  }

  function addMsg(from, html) {
    const msgs = document.getElementById('almad-msgs');
    const div = document.createElement('div');
    div.className = `almad-msg ${from === 'alma' ? 'alma' : 'user'}`;
    div.innerHTML = `
      <div class="almad-msg-av">${from === 'alma' ? '🌿' : '👤'}</div>
      <div class="almad-bbl">${html}</div>
    `;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

})();
