import {initialState, reduce, moods} from './state.js?v=6';
const app = document.querySelector('#app');
const dialog = document.querySelector('#dialog');
const asset = name => `assets/${name}`;
const labels = {calm:'สงบ', anxious:'กังวล', sad:'เศร้า', tired:'เหนื่อยล้า'};
const preparedCharacters = new Map();
const face = mood => `mood-${mood === 'tired' ? 'try' : mood || 'no-select'}.svg`;
const steps = {
  notice:['มองไปรอบๆ','ลองมองสิ่งรอบตัว 3 อย่าง','ค่อยๆ มองซ้ายและขวา แล้วกลับมาเมื่อพร้อม'],
  feel:['รับรู้สัมผัส','สังเกตสิ่งที่ร่างกายสัมผัสอยู่','เช่น เท้าสัมผัสพื้น หรือมือที่วางอยู่บนตัก'],
  listen:['ฟังเสียงรอบตัว','ฟังเสียงที่คุณได้ยิน 2 อย่าง','ฟังอย่างสบายๆ แล้วกลับมาเมื่อพร้อม'],
  awareness:['กลับมาหาตัวเอง','ลองรับรู้ความรู้สึกของตัวเอง','ไม่จำเป็นต้องเปลี่ยนความรู้สึกนั้น ใช้เวลาตามสบาย']
};
const stores = {
  apple:'https://apps.apple.com/th/app/ooca-%E0%B8%9B%E0%B8%A3-%E0%B8%81%E0%B8%A9%E0%B8%B2%E0%B8%9B-%E0%B8%8D%E0%B8%AB%E0%B8%B2%E0%B9%83%E0%B8%88/id1260476046',
  google:'https://play.google.com/store/apps/details?id=co.ooca.user&hl=en'
};
let state = initialState();
let returnFocus = null;
let animations = [];
let characters = new Map();
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const icon = (name, cls='') => `<img class="icon ${cls}" src="${asset(name+'.svg')}" alt="" aria-hidden="true">`;
const primary = (label, action='NEXT', trailing='next-icon') => `<button class="button primary" data-action="${action}">${label}${trailing ? icon(trailing) : ''}</button>`;
const ghost = (label, action) => `<button class="button ghost" data-action="${action}">${label}</button>`;
const outline = (label, action) => `<button class="button outline" data-action="${action}">${label}</button>`;
const moodCard = (mood, selected, summary=false) => {
  const name = mood ? labels[mood] : 'ไม่ได้เลือก';
  const content = `<span class="face-slot"><img src="${asset(face(mood))}" alt="" aria-hidden="true"></span><span>${name}</span>`;
  return summary ? `<div class="mood-card summary-card ${selected ? 'selected' : ''}">${content}</div>` : `<label class="mood-option"><input type="radio" name="mood" value="${mood}" ${selected?'checked':''}><span class="mood-card">${content}</span></label>`;
};
function header() {
  const welcome = state.view === 'welcome';
  const help = state.view === 'help';
  return `<header class="header"><div class="nav-side">${!welcome&&!help ? `<button class="nav-control" data-action="BACK" aria-label="ย้อนกลับ">${icon('back-icon')}<span class="nav-label">ย้อนกลับ</span></button>` : ''}</div><img class="brand" src="${asset('logo.svg')}" width="100" height="40" alt="ooca"><div class="nav-side right"><button class="nav-control" data-action="${help?'BACK':'HELP'}" aria-label="${help?'กลับไปหน้าก่อน':'ช่วยเหลือ'}">${!help?'<span class="nav-label">ช่วยเหลือ</span>':''}${icon(help?'close-icon':'help-icon')}</button></div></header>`;
}
function welcome() {
  return `<main id="main" class="screen welcome" tabindex="-1"><div class="content welcome-content"><div class="welcome-visual"><div class="welcome-marks"><img class="welcome-art" src="${asset('welcome-art-v2.png')}" width="286" height="123" alt="Pause with"><img class="welcome-logo" src="${asset('welcome-logo.svg')}" width="259" height="104" alt="ooca"></div><p class="eyebrow" lang="en">A LITTLE MOMENT FOR YOURSELF</p></div><div class="welcome-copy"><h1>วันนี้เป็นอย่างไรบ้าง?<br>มาพักใจด้วยกันสักครู่ไหม</h1><p class="meta">${icon('clock')}ใช้เวลา 2-3 นาที ไม่ต้องเข้าสู่ระบบ</p></div></div><div class="actions welcome-actions">${primary('เริ่มพักใจ')}<p class="disclaimer">พื้นที่สำหรับพักใจ ไม่ใช่การวินิจฉัยหรือรักษา</p></div></main>`;
}
function checkIn() {
  const post = state.view === 'post';
  const value = post ? state.after : state.before;
  return `<main id="main" class="screen check-in" tabindex="-1"><div class="content checkin-content"><div class="checkin-copy"><h1>คุณรู้สึกอย่างไร?</h1><p class="subtitle">${post?'หลังจากได้พักใจกับ Mooca<br>ลองเลือกสีหน้าอีกครั้ง':'เลือกสีหน้า Mooca ที่ใกล้เคียง<br class="mobile-break">กับความรู้สึกของคุณ'}</p><p class="small">${post?'ไม่จำเป็นต้องรู้สึกดีขึ้น แค่สังเกตตัวเองอีกครั้ง':'ไม่มีคำตอบที่ถูกหรือผิด'}</p></div><fieldset class="mood-grid"><legend class="sr-only">${post?'ความรู้สึกหลังทำกิจกรรม':'ความรู้สึกก่อนเริ่มกิจกรรม'} (เลือกได้หนึ่งรายการ หรือข้ามได้)</legend>${moods.map(m=>moodCard(m,value===m)).join('')}</fieldset></div><div class="actions">${primary(post?'ดูผลการพักใจ':'พร้อมแล้วไปต่อ')}${ghost('ข้ามการตอบ','SKIP')}</div></main>`;
}
function grounding() {
  const [title,subtitle,detail] = steps[state.view];
  return `<main id="main" class="screen grounding" tabindex="-1"><div class="content grounding-content"><div class="character-scene" aria-hidden="true"><img class="cloud-shadow" src="${asset('character-shadow.svg')}" width="366.155" height="63.5" alt=""><img class="ground-shadow" src="${asset('ground-shadow.svg')}" width="272" height="74" alt=""><div class="character-scale"><div class="character-float"><img class="character-static character character-${state.view}" alt="" aria-hidden="true"><object class="character character-${state.view}" data="${asset(state.view+'.svg')}" type="image/svg+xml" tabindex="-1" aria-hidden="true"></object></div></div></div><div class="grounding-copy"><h1>${title}</h1><p class="subtitle">${subtitle}</p><p class="small">${detail}</p></div></div><div class="actions">${primary(state.view==='awareness'?'จบกิจกรรม':'พร้อมแล้วไปต่อ')}<div class="split-actions">${ghost('ยกเลิกกิจกรรม','CANCEL')}<span class="divider" aria-hidden="true"></span>${ghost('ข้ามขั้นตอน','SKIP')}</div></div></main>`;
}
function completion() {
  return `<main id="main" class="screen completion" tabindex="-1"><div class="content completion-content"><div class="completion-copy"><h1>ขอบคุณที่ให้เวลา<br>กับตัวคุณเอง</h1><p class="small">ไม่ว่าความรู้สึกจะเปลี่ยนไปหรือไม่<br>การได้หยุดพักสักครู่ก็มีความหมาย</p></div><section class="summary" aria-labelledby="summary-title"><h2 id="summary-title">สรุปความรู้สึกของคุณ</h2><div class="summary-grid"><div><p class="summary-label">ก่อนเริ่ม</p>${moodCard(state.before,false,true)}</div><div><p class="summary-label after">หลังทำ</p>${moodCard(state.after,Boolean(state.after),true)}</div></div></section></div><div class="actions">${primary('พักใจอีกครั้ง','RESTART','restart-icon')}${ghost('ช่องทางขอความช่วยเหลือ','HELP')}</div></main>`;
}
function help() {
  return `<main id="main" class="screen help" tabindex="-1"><div class="content help-content"><div class="help-copy"><h1>คุณไม่จำเป็นต้องผ่าน<br>เรื่องนี้คนเดียว</h1><p>หากคุณต้องการความช่วยเหลือเพิ่มเติม<br>ลองติดต่อคนที่ไว้ใจหรือผู้เชี่ยวชาญ</p></div><div class="contact-list"><a class="contact-card" href="tel:1323" aria-label="โทร สายด่วนสุขภาพจิต 1323"><span class="contact-symbol">${icon('phone')}</span><span><strong>สายด่วนสุขภาพจิต 1323</strong><span class="small">ปรึกษาปัญหาสุขภาพจิตในประเทศไทย</span></span></a><a class="contact-card" href="tel:1669" aria-label="โทร ฉุกเฉินทางการแพทย์ 1669"><span class="contact-symbol emergency">${icon('alert')}</span><span><strong>ฉุกเฉินทางการแพทย์ 1669</strong><span class="small">หากมีความเสี่ยงต่อความปลอดภัย<br>ของตัวเองหรือผู้อื่น</span></span></a></div></div><div class="actions help-actions">${outline('กลับไปหน้าก่อน','BACK')}<button class="contact-ooca" data-action="DOWNLOAD">ติดต่อเรา <img src="${asset('contact-logo.svg')}" width="59" height="24" alt="ooca"></button></div></main>`;
}
function stopAnimations() { for (const a of animations) a.cancel(); animations=[]; characters.clear(); }
function syncMotion() {
  const paused = document.hidden || dialog.open;
  for (const a of animations) paused ? a.pause() : a.play();
  document.querySelectorAll('.character-float').forEach(n=>n.style.animationPlayState=paused?'paused':'running');
}
function animateCharacter(object) {
  if (!object.isConnected || !object.contentDocument) return;
  const doc=object.contentDocument;
  const root=doc.documentElement;
  root.style.overflow='visible';
  const poster=object.parentElement.querySelector('.character-static');
  if(poster) poster.hidden=true;
  object.classList.add('ready');
  object.contentDocument.querySelectorAll('svg').forEach(n=>n.setAttribute('aria-hidden','true'));
  characters.set(object,doc); object.dataset.ready='true';
  const options = {iterations:Infinity};
  const add=(node,frames,duration,delay=0)=>{
    if (!node) return;
    node.style.transformBox='fill-box';node.style.transformOrigin='center';
    const a=node.animate(frames,{...options,duration,delay,fill:'both'});animations.push(a);
  };
  if (state.view==='notice') {
    const faceNode=doc.getElementById('face');
    const head=doc.getElementById('head');
    // Exported SVG paths include the frame's original x offset. Center the face
    // from the actual head/face boxes before applying local look-around motion.
    const faceBox=faceNode.getBBox(), headBox=head.getBBox();
    const centerOffset=headBox.x+(headBox.width-faceBox.width)/2-faceBox.x;
    const x=value=>`translateX(${centerOffset+value}px)`;
    faceNode.style.transform=x(0);
    if (!reduced.matches) {
      // Sample a sine wave so center crossings retain velocity; only the two
      // symmetric endpoints turn around. The first frame is neutral.
      const frames=Array.from({length:65},(_,i)=>({
        transform:x(-16*Math.sin(i/64*2*Math.PI)),offset:i/64
      }));
      add(faceNode,frames,4800);
    }
    object.dataset.lookRange='-16,16';
    object.dataset.lookCycle='4800';
    object.dataset.centerPause='0';
    object.dataset.centerOffset=String(centerOffset);
  }
  if (reduced.matches) return;
  if (state.view==='listen') ['music-note-1','music-note-2'].forEach((id,i)=>add(doc.getElementById(id),[
    {transform:'scale(.3)',opacity:0,offset:0,easing:'ease-out'},
    {transform:'scale(1)',opacity:1,offset:.8/3},
    {transform:'scale(1)',opacity:1,offset:1.3/3,easing:'ease-in'},
    {transform:'scale(1)',opacity:0,offset:2/3},
    {transform:'scale(.3)',opacity:0,offset:2.01/3},{transform:'scale(.3)',opacity:0,offset:1}
  ],3000,i*600));
  if (state.view==='awareness') add(doc.getElementById('Star 8'),[
    {transform:'scale(.7)',easing:'ease-in-out'},
    {transform:'scale(1)',easing:'ease-in-out'},
    {transform:'scale(.7)'}
  ],2500);
  object.dataset.motionCount=String(animations.length);
  syncMotion();
}
function render(focus=true) {
  stopAnimations();
  document.body.dataset.view=state.view;
  const body=state.view==='welcome'?welcome():['pre','post'].includes(state.view)?checkIn():steps[state.view]?grounding():state.view==='completion'?completion():help();
  app.innerHTML=header()+body;
  const obj=app.querySelector('object');
  if(obj){
    const poster=preparedCharacters.get(state.view);
    if(poster){
      poster.className=`character-static character character-${state.view}`;
      poster.hidden=false;
      obj.dataset.posterReadyAtRender=String(poster.complete&&poster.naturalWidth>0);
      obj.parentElement.querySelector('.character-static').replaceWith(poster);
    }
    obj.addEventListener('load',()=>animateCharacter(obj),{once:true});
    if(obj.contentDocument?.documentElement?.tagName==='svg')animateCharacter(obj);
  }
  if(focus){document.querySelector('#main').focus({preventScroll:true});window.scrollTo(0,0);}
}
function historyRecord(replace=false) {
  history[replace?'replaceState':'pushState']({view:state.view,helpOrigin:state.helpOrigin,epoch:state.epoch},'',`#${state.view}`);
}
function dispatch(action) {
  const previous=state;
  state=reduce(state,action);
  if(state.modal){openDialog();return;}
  if(dialog.open) closeDialog();
  if(state.view!==previous.view || ['EXIT','RESTART'].includes(action.type)) {
    historyRecord(['EXIT','RESTART'].includes(action.type));render();
  }
}
function openDialog() {
  returnFocus=document.activeElement;
  const cancel=state.modal==='cancel';
  dialog.className=cancel?'cancel-dialog':'download-dialog';
  dialog.innerHTML=`<button class="dialog-close" data-action="CLOSE" aria-label="ปิดหน้าต่าง">${icon('close-icon')}</button>${cancel?`<img class="dialog-art" src="${asset('cancel-art.svg')}" width="223" height="168" alt=""><div class="dialog-panel"><div class="dialog-copy"><h2 id="dialog-title">อยากหยุดกิจกรรม<br>ตอนนี้ไหม?</h2><p>คุณสามารถออกจากกิจกรรมได้ทุกเมื่อ<br>โดยไม่จำเป็นต้องทำให้ครบ</p></div><div class="dialog-actions">${primary('กลับไปทำต่อ','CLOSE')}${ghost('ออกจากกิจกรรม','EXIT')}</div></div>`:`<img class="dialog-art" src="${asset('download-art.svg')}" width="244" height="168" alt=""><div class="dialog-panel"><div class="dialog-copy"><h2 id="dialog-title">ดาวน์โหลดแอป ooca</h2><p>สแกน QR code เพื่อดาวน์โหลดแอป</p></div><img class="qr" src="${asset('qr.png')}" width="140" height="140" alt="QR code ดาวน์โหลดแอป ooca"><div class="store-badges"><a href="${stores.apple}" target="_blank" rel="noopener noreferrer"><img src="${asset('app-store.svg')}" width="135" height="40" alt="ดาวน์โหลดบน App Store"></a><a href="${stores.google}" target="_blank" rel="noopener noreferrer"><img src="${asset('play-store.svg')}" width="135" height="40" alt="ดาวน์โหลดบน Google Play"></a></div></div>`}`;
  dialog.showModal();
  dialog.querySelector(cancel?'[data-action="CLOSE"].primary':'.dialog-close').focus();
  syncMotion();
}
function closeDialog() {dialog.close();returnFocus?.isConnected&&returnFocus.focus({preventScroll:true});syncMotion();}
function toggleMood(input){
  state=reduce(state,{type:'TOGGLE_MOOD',mood:input.value});
  const value=state.view==='pre'?state.before:state.after;
  app.querySelectorAll('input[name="mood"]').forEach(n=>n.checked=n.value===value);
}
document.addEventListener('keydown',event=>{
  if(event.code==='Space'&&event.target.matches('input[name="mood"]')){
    event.preventDefault();
    if(!event.repeat)toggleMood(event.target);
  }
});
document.addEventListener('click',event=>{
  const input=event.target.closest('input[name="mood"]');
  if(input){
    toggleMood(input);
    return;
  }
  const control=event.target.closest('[data-action]');
  if(control)dispatch({type:control.dataset.action});
});
document.addEventListener('change',event=>{if(event.target.matches('input[name="mood"]')&&event.target.checked)state=reduce(state,{type:'SELECT',mood:event.target.value});});
dialog.addEventListener('cancel',event=>{event.preventDefault();dispatch({type:'CLOSE'});});
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dispatch({type:'CLOSE'});}});
document.addEventListener('visibilitychange',syncMotion);
reduced.addEventListener('change',()=>render(false));
addEventListener('popstate',event=>{state=reduce(state,{type:'HISTORY',...(event.state||{view:'welcome',epoch:state.epoch})});if(dialog.open)closeDialog();render();});
const criticalImages=['grass.png','logo.svg','welcome-art-v2.png','favicon.png','welcome-logo.svg','mood-calm.svg','mood-anxious.svg','mood-sad.svg','mood-try.svg','mood-no-select.svg','notice.svg','feel.svg','listen.svg','awareness.svg','phone.svg','alert.svg','qr.png','app-store.svg','play-store.svg','ground-shadow.svg','character-shadow.svg','next-icon.svg','back-icon.svg','help-icon.svg','close-icon.svg','restart-icon.svg','contact-logo.svg','clock.svg','cancel-art.svg','download-art.svg'];
async function boot() {
  try {
    await Promise.all(criticalImages.map(async name=>{const r=await fetch(asset(name));if(!r.ok)throw Error(name);await r.arrayBuffer();}));
    await Promise.all(Object.keys(steps).map(async pose=>{
      const image=new Image();
      image.src=asset(pose+'.svg');
      image.alt=''; image.setAttribute('aria-hidden','true');
      await image.decode();
      preparedCharacters.set(pose,image);
    }));
    await Promise.all([document.fonts.load('400 16px Prompt'),document.fonts.load('500 16px Prompt'),document.fonts.load('600 36px Prompt'),document.fonts.load('500 16px "Gotham Rounded"')]);
    historyRecord(true);render(false);
    if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
  } catch(error) {
    app.innerHTML=`<main id="main" class="loading"><h1>เตรียมพื้นที่พักใจไม่สำเร็จ</h1><p>ตรวจสอบการเชื่อมต่อ แล้วลองอีกครั้ง</p><button class="button primary" id="retry">ลองอีกครั้ง</button></main>`;
    document.querySelector('#retry').addEventListener('click',boot,{once:true});
  }
}
boot();
