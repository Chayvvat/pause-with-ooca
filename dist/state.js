export const journey = ['welcome', 'pre', 'notice', 'feel', 'listen', 'awareness', 'post', 'completion'];
export const moods = ['calm', 'anxious', 'sad', 'tired'];
export const initialState = () => ({view:'welcome', before:null, after:null, helpOrigin:null, modal:null, epoch:0});
export function reduce(state, action) {
  const s = {...state};
  switch (action.type) {
    case 'SELECT':
      if (!moods.includes(action.mood)) return state;
      if (s.view === 'pre') s.before = action.mood;
      if (s.view === 'post') s.after = action.mood;
      return s;
    case 'TOGGLE_MOOD':
      if (!moods.includes(action.mood)) return state;
      if (s.view === 'pre') s.before = s.before === action.mood ? null : action.mood;
      if (s.view === 'post') s.after = s.after === action.mood ? null : action.mood;
      return s;
    case 'SKIP':
      if (s.view === 'pre') s.before = null;
      if (s.view === 'post') s.after = null;
      // Intentional fallthrough: every optional response/grounding Skip advances.
    case 'NEXT': {
      const index = journey.indexOf(s.view);
      if (index >= 0 && index < journey.length - 1) s.view = journey[index + 1];
      return s;
    }
    case 'BACK': {
      if (s.view === 'help') {s.view = s.helpOrigin || 'welcome'; s.helpOrigin = null;}
      else s.view = journey[Math.max(0, journey.indexOf(s.view)-1)];
      return s;
    }
    case 'HELP':
      if (s.view !== 'help') {s.helpOrigin = s.view; s.view = 'help';}
      return s;
    case 'CANCEL': return {...s, modal:'cancel'};
    case 'DOWNLOAD': return {...s, modal:'download'};
    case 'CLOSE': return {...s, modal:null};
    case 'EXIT':
    case 'RESTART': return {...initialState(), epoch:s.epoch+1};
    case 'HISTORY': {
      if (![...journey,'help'].includes(action.view)) return s;
      if (action.epoch !== s.epoch) return {...s, view:'welcome', modal:null, helpOrigin:null};
      return {...s, view:action.view, helpOrigin:action.helpOrigin ?? null, modal:null};
    }
    default: return s;
  }
}
