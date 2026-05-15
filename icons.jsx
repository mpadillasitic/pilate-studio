/* Move Studio — shared icon set
   Stroke-only line icons, weight 1.6 */

const Icon = ({ name, size = 18, className = '', style = {} }) => {
  const props = {
    width: size, height: size, viewBox: '0 0 24 24',
    fill: 'none', stroke: 'currentColor', strokeWidth: 1.6,
    strokeLinecap: 'round', strokeLinejoin: 'round',
    className, style
  };
  switch (name) {
    case 'home':
      return <svg {...props}><path d="M3 12l9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></svg>;
    case 'calendar':
      return <svg {...props}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></svg>;
    case 'history':
      return <svg {...props}><path d="M3 12a9 9 0 109-9 9 9 0 00-6.5 2.7L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l3 2"/></svg>;
    case 'card':
      return <svg {...props}><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18M7 15h4"/></svg>;
    case 'star':
      return <svg {...props}><path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.7L12 16.4 6.8 19l1-5.7L3.5 9.2l5.9-.9z"/></svg>;
    case 'doc':
      return <svg {...props}><path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9z"/><path d="M14 3v6h6"/><path d="M8 13h8M8 17h6"/></svg>;
    case 'bell':
      return <svg {...props}><path d="M6 9a6 6 0 0112 0v5l2 3H4l2-3z"/><path d="M10 21a2 2 0 004 0"/></svg>;
    case 'user':
      return <svg {...props}><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></svg>;
    case 'gift':
      return <svg {...props}><rect x="3" y="9" width="18" height="12" rx="2"/><path d="M3 9h18M12 9v12"/><path d="M7 9c0-2 1-3 2.5-3S12 7 12 9c0-2 1-3 2.5-3S17 7 17 9"/></svg>;
    case 'chat':
      return <svg {...props}><path d="M21 12a8 8 0 01-11.6 7.1L4 21l1.9-5.4A8 8 0 1121 12z"/></svg>;
    case 'settings':
      return <svg {...props}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 00.4 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.6 1.6 0 00-1.8-.4 1.6 1.6 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.6 1.6 0 00-1-1.5 1.6 1.6 0 00-1.8.4l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.6 1.6 0 00.4-1.8 1.6 1.6 0 00-1.5-1H3a2 2 0 110-4h.1a1.6 1.6 0 001.5-1 1.6 1.6 0 00-.4-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.6 1.6 0 001.8.4h.1a1.6 1.6 0 001-1.5V3a2 2 0 114 0v.1a1.6 1.6 0 001 1.5 1.6 1.6 0 001.8-.4l.1-.1a2 2 0 112.8 2.8l-.1.1a1.6 1.6 0 00-.4 1.8v.1a1.6 1.6 0 001.5 1H21a2 2 0 110 4h-.1a1.6 1.6 0 00-1.5 1z"/></svg>;
    case 'search':
      return <svg {...props}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>;
    case 'plus':
      return <svg {...props}><path d="M12 5v14M5 12h14"/></svg>;
    case 'arrow-right':
      return <svg {...props}><path d="M5 12h14M13 6l6 6-6 6"/></svg>;
    case 'arrow-left':
      return <svg {...props}><path d="M19 12H5M11 18l-6-6 6-6"/></svg>;
    case 'check':
      return <svg {...props}><path d="M5 13l4 4L19 7"/></svg>;
    case 'x':
      return <svg {...props}><path d="M6 6l12 12M18 6L6 18"/></svg>;
    case 'clock':
      return <svg {...props}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
    case 'pin':
      return <svg {...props}><path d="M12 21s7-7 7-12a7 7 0 10-14 0c0 5 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>;
    case 'sparkle':
      return <svg {...props}><path d="M12 3l1.8 5L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-2z"/></svg>;
    case 'warn':
      return <svg {...props}><path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18.5v.1"/></svg>;
    case 'info':
      return <svg {...props}><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.1"/></svg>;
    case 'download':
      return <svg {...props}><path d="M12 4v12M6 12l6 6 6-6M4 20h16"/></svg>;
    case 'chev-right':
      return <svg {...props}><path d="M9 6l6 6-6 6"/></svg>;
    case 'chev-left':
      return <svg {...props}><path d="M15 6l-6 6 6 6"/></svg>;
    case 'logout':
      return <svg {...props}><path d="M15 17l5-5-5-5"/><path d="M20 12H9"/><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/></svg>;
    case 'trending':
      return <svg {...props}><path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/></svg>;
    case 'send':
      return <svg {...props}><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4z"/></svg>;
    case 'mic':
      return <svg {...props}><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0014 0M12 19v3"/></svg>;
    case 'menu':
      return <svg {...props}><path d="M3 6h18M3 12h18M3 18h18"/></svg>;
    case 'eye':
      return <svg {...props}><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>;
    default:
      return <svg {...props}><circle cx="12" cy="12" r="9"/></svg>;
  }
};

window.Icon = Icon;
