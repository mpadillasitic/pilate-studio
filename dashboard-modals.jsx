/* Move Studio — Modals (Reserve + License) */

const H_ = window.MOVE_HELPERS;
const D_ = window.MOVE_DATA;

// ─── Reserve / class detail modal ──────────────────────────
window.ReserveModal = function ReserveModal({ cls, onClose, onReserve, onCancel, onLicense }) {
  if (!cls) return null;
  const mins = H_.minutesUntil(cls.date, cls.start);
  const isPast = mins < 0;
  const isFull = cls.spots_taken >= cls.spots_total;
  const date = new Date(cls.date + 'T12:00');
  const fmtDay = date.toLocaleDateString('es-MX',{weekday:'long',day:'numeric',month:'long'});

  const status = cls.status === 'completed' ? 'completed'
    : cls.mine ? 'reserved'
    : isFull ? 'full' : 'available';

  return (
    <div className="modal-back" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{maxWidth:520}}>
        <div className="modal-head">
          <div style={{flex:1}}>
            <div className="label-row">{fmtDay.toUpperCase()} · {cls.start}–{cls.end}</div>
            <h3>{cls.name}</h3>
          </div>
          <button className="x" onClick={onClose}><Icon name="x" size={14} /></button>
        </div>

        <div className="modal-body">
          {status === 'reserved' && (
            <div className="alert ok" style={{marginBottom:14}}>
              <Icon name="check" className="ico" size={16} />
              <div>Esta clase está reservada en tu calendario. Tu crédito ya fue descontado.</div>
            </div>
          )}
          {status === 'completed' && (
            <div className="alert ok" style={{marginBottom:14}}>
              <Icon name="check" className="ico" size={16} />
              <div>Asististe a esta clase. Andrea V. agregó notas — revísalas en tu historial.</div>
            </div>
          )}
          {status === 'full' && (
            <div className="alert warn" style={{marginBottom:14}}>
              <Icon name="warn" className="ico" size={16} />
              <div>Lista de espera disponible. Te avisaremos si se libera un lugar.</div>
            </div>
          )}

          <div className="bigstat">
            <div className="it">
              <div className="k">INSTRUCTOR/A</div>
              <div className="v">{cls.coach}</div>
            </div>
            <div className="it">
              <div className="k">ESTUDIO</div>
              <div className="v">{cls.room}</div>
            </div>
            <div className="it">
              <div className="k">NIVEL</div>
              <div className="v" style={{fontSize:16}}>{cls.level}</div>
            </div>
            <div className="it">
              <div className="k">LUGARES</div>
              <div className="v">{cls.spots_taken}/{cls.spots_total}</div>
            </div>
          </div>

          <div style={{padding:'14px 16px',background:'var(--bg-2)',borderRadius:12,fontSize:13.5,lineHeight:1.55,color:'var(--ink-soft)'}}>
            <b style={{color:'var(--ink)'}}>Qué llevar:</b> Calcetines antideslizantes, botella de agua y ropa cómoda.
            Llega 10 minutos antes para preparar tu reformer.
          </div>
        </div>

        <div className="modal-foot">
          <button className="btn btn-ghost" onClick={onClose}>Cerrar</button>
          {status === 'available' && !isPast && (
            <button className="btn btn-primary" onClick={() => onReserve(cls)}>
              Reservar · 1 crédito <Icon name="arrow-right" size={14} />
            </button>
          )}
          {status === 'full' && (
            <button className="btn btn-primary">
              Unirme a lista de espera <Icon name="arrow-right" size={14} />
            </button>
          )}
          {status === 'reserved' && !isPast && (
            <div style={{display:'flex',gap:8}}>
              <button className="btn btn-ghost" onClick={() => onLicense(cls)}>Solicitar licencia</button>
              <button className="btn btn-primary" onClick={() => onCancel(cls)}>
                Confirmar asistencia <Icon name="check" size={14} />
              </button>
            </div>
          )}
          {status === 'completed' && (
            <button className="btn btn-primary">Ver notas de la sesión</button>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── License (cancellation) modal ──────────────────────────
window.LicenseModal = function LicenseModal({ cls, onClose, onConfirm }) {
  if (!cls) return null;
  const mins = H_.minutesUntil(cls.date, cls.start);
  const can = H_.canRequestLicense(cls);
  const [reason, setReason] = React.useState('');
  const [stage, setStage] = React.useState('form'); // form | success

  const date = new Date(cls.date + 'T12:00');
  const fmtDay = date.toLocaleDateString('es-MX',{weekday:'long',day:'numeric',month:'long'});

  const formatRemaining = (m) => {
    if (m < 0) {
      const h = Math.floor(Math.abs(m)/60);
      const mm = Math.abs(m)%60;
      return `Pasó hace ${h>0?h+'h ':''}${mm}m`;
    }
    const h = Math.floor(m/60);
    const mm = m%60;
    return `Quedan ${h>0?h+'h ':''}${mm}m`;
  };

  return (
    <div className="modal-back" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{maxWidth:480}}>
        <div className="modal-head">
          <div style={{width:38,height:38,borderRadius:10,background:can?'var(--cream)':'rgba(168,90,74,0.14)',color:can?'var(--ink-2)':'var(--err)',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <Icon name={can?'gift':'warn'} size={18} />
          </div>
          <div style={{flex:1}}>
            <div className="label-row">SOLICITAR LICENCIA</div>
            <h3 style={{fontSize:22}}>{cls.name}</h3>
            <div className="when">{fmtDay.toUpperCase()} · {cls.start}</div>
          </div>
          <button className="x" onClick={onClose}><Icon name="x" size={14} /></button>
        </div>

        {stage === 'form' && (
          <>
            <div className="modal-body">
              {!can ? (
                <>
                  <div className="alert err" style={{marginBottom:16}}>
                    <Icon name="warn" className="ico" size={16} />
                    <div>
                      <b>El plazo de anticipación ya no se cumple.</b><br/>
                      Las licencias deben solicitarse con un mínimo de <b>2 horas</b> antes del inicio de la clase. {formatRemaining(mins)}.
                    </div>
                  </div>
                  <div style={{fontSize:13.5,lineHeight:1.55,color:'var(--ink-soft)'}}>
                    Si tienes una emergencia médica, contacta directamente al estudio al <b>+52 55 1234 5678</b>. El equipo administrativo evaluará tu caso.
                  </div>
                </>
              ) : (
                <>
                  <div className="alert ok" style={{marginBottom:14}}>
                    <Icon name="check" className="ico" size={16} />
                    <div>
                      Puedes solicitar licencia · {formatRemaining(mins)} antes del inicio. Tu crédito se devolverá automáticamente al aprobarse.
                    </div>
                  </div>

                  <div style={{marginBottom:12}}>
                    <div className="label-row">MOTIVO (OPCIONAL)</div>
                    <textarea className="text-area" placeholder="Compartir un motivo nos ayuda a mejorar el servicio." value={reason} onChange={e=>setReason(e.target.value)} />
                  </div>

                  <div style={{display:'flex',gap:6,flexWrap:'wrap',marginTop:6}}>
                    {['Cita médica','Imprevisto laboral','No me siento bien','Viaje'].map(r => (
                      <button key={r} className="btn btn-ghost" style={{padding:'7px 12px',fontSize:12,borderColor:'var(--line)'}} onClick={()=>setReason(r)}>{r}</button>
                    ))}
                  </div>

                  <div style={{marginTop:18,padding:'14px 16px',background:'var(--bg-2)',borderRadius:12,fontSize:13,lineHeight:1.55,color:'var(--ink-soft)'}}>
                    <b style={{color:'var(--ink)'}}>Al aprobarse:</b>
                    <ul style={{paddingLeft:18,margin:'8px 0 0',display:'flex',flexDirection:'column',gap:4}}>
                      <li>Tu crédito vuelve a tu cuenta · expira en 2 meses.</li>
                      <li>El instructor verá tu estado como <b>Licencia</b>, no como ausencia.</li>
                      <li>Recibirás confirmación por correo y notificación.</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
            <div className="modal-foot">
              <button className="btn btn-ghost" onClick={onClose}>{can ? 'Cancelar' : 'Entendido'}</button>
              {can && (
                <button className="btn btn-primary" onClick={() => { onConfirm(cls, reason); setStage('success'); }}>
                  Confirmar solicitud <Icon name="check" size={14} />
                </button>
              )}
            </div>
          </>
        )}

        {stage === 'success' && (
          <>
            <div className="modal-body" style={{textAlign:'center',padding:'32px 24px'}}>
              <div style={{width:64,height:64,borderRadius:'50%',background:'var(--sage)',color:'var(--bg)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px'}}>
                <Icon name="check" size={32} />
              </div>
              <div style={{fontFamily:'var(--font-serif)',fontSize:28,lineHeight:1.1,letterSpacing:'-0.01em',margin:'8px 0 10px'}}>Licencia registrada.</div>
              <div style={{fontSize:14,color:'var(--ink-soft)',lineHeight:1.55,maxWidth:340,margin:'0 auto'}}>
                Tu crédito vuelve a estar disponible. Te enviamos confirmación a <b>valeria@correo.com</b>.
              </div>
              <div style={{marginTop:22,display:'inline-flex',alignItems:'center',gap:8,padding:'10px 18px',background:'var(--bg-2)',borderRadius:999,fontSize:13}}>
                <span style={{color:'var(--muted)',fontFamily:'var(--font-mono)',letterSpacing:'0.04em',fontSize:11}}>NUEVO BALANCE</span>
                <b style={{fontFamily:'var(--font-serif)',fontSize:18}}>6 créditos</b>
              </div>
            </div>
            <div className="modal-foot" style={{justifyContent:'center'}}>
              <button className="btn btn-primary" onClick={onClose}>Volver al dashboard</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ─── Confirm (cancel reserve) ──────────────────────────────
window.ConfirmModal = function ConfirmModal({ title, body, danger, onClose, onConfirm, ctaLabel }) {
  return (
    <div className="modal-back" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{maxWidth:420}}>
        <div className="modal-head">
          <h3 style={{fontSize:22}}>{title}</h3>
          <button className="x" onClick={onClose}><Icon name="x" size={14} /></button>
        </div>
        <div className="modal-body">
          <div style={{fontSize:14,color:'var(--ink-soft)',lineHeight:1.55}}>{body}</div>
        </div>
        <div className="modal-foot">
          <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <button className={`btn ${danger?'btn-primary':'btn-primary'}`} style={danger?{background:'var(--err)'}:{}} onClick={onConfirm}>{ctaLabel || 'Confirmar'}</button>
        </div>
      </div>
    </div>
  );
};
