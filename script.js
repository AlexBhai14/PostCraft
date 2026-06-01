/* ═══════════════════════════════════════════════════════
   PostCraft Pro — script.js v5
   Fixed: Text Background with color, opacity, padding, radius
   Enhanced: Preloaded sticker library, working video editor
═══════════════════════════════════════════════════════ */
'use strict';

/* ══════════════════════════════════════════════════════
   PRELOADED STICKER LIBRARY DATA
══════════════════════════════════════════════════════ */
const STICKER_LIBRARY = {
  emoji:   ['😀','😍','🔥','💯','✨','🎉','💪','👏','🙌','❤️','💀','😎','🤩','💥','⚡','🌟','🏆','🎯','💫','🤝','😂','🥳','🎊','💎','👑','🚀','💡','🎶','📸','🌈'],
  social:  ['📱','💬','📢','📣','🔔','📡','🌐','💻','🖥️','⌨️','🖱️','📲','📧','📨','📩','📪','📫','📬','📭','📮','📰','📄','📝','✉️','📦','📁','📂','🗂️','🗃️','🗄️'],
  arrows:  ['➡️','⬅️','⬆️','⬇️','↗️','↘️','↙️','↖️','↕️','↔️','🔄','🔃','🔁','🔂','⏩','⏪','⏫','⏬','▶️','◀️','🔝','🔛','🔜','🔚','🔙'],
  shapes:  ['⭐','🌟','💫','✨','🔴','🟠','🟡','🟢','🔵','🟣','⚫','⚪','🟤','🔷','🔶','🔹','🔸','🔺','🔻','💠','🔘','🔲','🔳','▪️','▫️','◾','◽','◼️','◻️','⬛'],
  badges:  ['🏅','🥇','🥈','🥉','🏆','🎖️','🎗️','🎫','🎟️','🎪','🎭','🎨','🎬','🎤','🎧','🎼','🎵','🎷','🎸','🎹','🎺','🎻','🥁','🎮','🕹️','🎲','🎯','🎳','🎰','🃏'],
  nature:  ['🌸','🌺','🌻','🌹','🌷','🌼','🌱','🌿','🍀','🌳','🌲','🌴','🌵','🌾','🍄','🌊','🏔️','⛰️','🌋','🏝️','🌙','☀️','⛅','🌤️','🌈','❄️','🌬️','🌪️','⚡','🌧️'],
  food:    ['🍕','🍔','🍟','🌮','🌯','🍜','🍣','🍱','🍩','🎂','🧁','🍰','🍫','🍬','🍭','🍿','☕','🧃','🥤','🧋','🍵','🥂','🍾','🍺','🥗','🍎','🍊','🍋','🍇','🍓'],
  travel:  ['✈️','🚀','🛸','🚂','🚢','🚗','🏎️','🚁','⛵','🏠','🏰','🗼','🗽','🗺️','🧭','🌍','🌏','🌎','⛺','🏕️','🎡','🎢','🎠','🏟️','🌁','🌃','🌆','🌇','🌉','🌌'],
  objects: ['💎','💍','👒','👜','👛','🎒','🌂','☂️','⌚','👓','🕶️','🔮','🧿','💊','🔑','🗝️','🔒','🔓','🔨','⚙️','🔧','🔩','🧲','💡','🔦','🕯️','📱','💰','💳','🧸'],
};

/* ══════════════════════════════════════════════════════
   STATE
══════════════════════════════════════════════════════ */
const state = {
  canvasW: 800,
  canvasH: 600,
  bgType: null,
  bgColor: '#1a1a2e',
  bgImageSrc: null,
  bgVideoSrc: null,
  layout: { type: 'top-bottom', ratio: 0.25, showDivider: true },
  topZone:  { x: 0, y: 0,   w: 800, h: 150 },
  mainZone: { x: 0, y: 150, w: 800, h: 450 },
  topBg: { type: 'color', color: '#0f172a', gradStart: '#1e3a5f', gradEnd: '#3b1f5e', gradDir: 'vertical', imageSrc: null },
  exportFormat:  'png',
  exportQuality: 0.92,
  history:        [],
  maxHistory:     30,
  suppressUpdate: false,
  stickerSrcs:    [],
};

/* ══════════════════════════════════════════════════════
   DOM REFS
══════════════════════════════════════════════════════ */
const dom = {
  fabricCanvas:    document.getElementById('main-canvas'),
  bgVideo:         document.getElementById('bg-video'),
  canvasFrame:     document.getElementById('canvas-frame'),
  canvasWrapper:   document.getElementById('canvas-wrapper'),
  canvasSizeLabel: document.getElementById('canvas-size-label'),
  layoutIndicator: document.getElementById('layout-indicator'),
  zoneBadge:       document.getElementById('zone-badge'),
  btnUndo:         document.getElementById('btn-undo'),
  btnClear:        document.getElementById('btn-clear'),
  btnExportTop:    document.getElementById('btn-export-top'),
  tabBtns:         document.querySelectorAll('.tab-btn'),
  tabPanels:       document.querySelectorAll('.tab-panel'),
  resizeHandle:    document.getElementById('resize-handle'),
  sidebar:         document.getElementById('sidebar'),
  // Background
  uploadBgImageFull: document.getElementById('upload-bg-image-full'),
  uploadBgImage:     document.getElementById('upload-bg-image'),
  uploadBgVideo:     document.getElementById('upload-bg-video'),
  bgColorPicker:     document.getElementById('bg-color-picker'),
  btnApplyBgColor:   document.getElementById('btn-apply-bg-color'),
  mainPresetColors:  document.querySelectorAll('#main-preset-colors .preset-color'),
  btnRemoveBg:       document.getElementById('btn-remove-bg'),
  // Text
  btnAddText:        document.getElementById('btn-add-text'),
  btnAddTextTop2:    document.getElementById('btn-add-text-top2'),
  textContent:       document.getElementById('text-content'),
  textFont:          document.getElementById('text-font'),
  textSize:          document.getElementById('text-size'),
  textSizeVal:       document.getElementById('text-size-val'),
  textColor:         document.getElementById('text-color'),
  toggleBold:        document.getElementById('toggle-bold'),
  toggleItalic:      document.getElementById('toggle-italic'),
  toggleUnderline:   document.getElementById('toggle-underline'),
  textAlignLeft:     document.getElementById('text-align-left'),
  textAlignCenter:   document.getElementById('text-align-center'),
  textAlignRight:    document.getElementById('text-align-right'),
  textOpacity:       document.getElementById('text-opacity'),
  textOpacityVal:    document.getElementById('text-opacity-val'),
  textSpacing:       document.getElementById('text-spacing'),
  textSpacingVal:    document.getElementById('text-spacing-val'),
  textLineHeight:    document.getElementById('text-lineheight'),
  textLineHeightVal: document.getElementById('text-lineheight-val'),
  textRotation:      document.getElementById('text-rotation'),
  textRotationVal:   document.getElementById('text-rotation-val'),
  btnDeleteText:     document.getElementById('btn-delete-text'),
  toggleTextShadow:  document.getElementById('toggle-text-shadow'),
  shadowControls:    document.getElementById('shadow-controls'),
  textShadowColor:   document.getElementById('text-shadow-color'),
  textShadowBlur:    document.getElementById('text-shadow-blur'),
  shadowBlurVal:     document.getElementById('shadow-blur-val'),
  textShadowOx:      document.getElementById('text-shadow-ox'),
  shadowOxVal:       document.getElementById('shadow-ox-val'),
  textShadowOy:      document.getElementById('text-shadow-oy'),
  shadowOyVal:       document.getElementById('shadow-oy-val'),
  toggleCurvedText:  document.getElementById('toggle-curved-text'),
  curveControls:     document.getElementById('curve-controls'),
  curveDirUp:        document.getElementById('curve-dir-up'),
  curveDirDown:      document.getElementById('curve-dir-down'),
  curveRadius:       document.getElementById('curve-radius'),
  curveRadiusVal:    document.getElementById('curve-radius-val'),
  btnApplyCurve:     document.getElementById('btn-apply-curve'),
  btnRemoveCurve:    document.getElementById('btn-remove-curve'),
  // Text BG
  toggleTextBg:     document.getElementById('toggle-text-bg'),
  textBgControls:   document.getElementById('text-bg-controls'),
  textBgColor:      document.getElementById('text-bg-color'),
  textBgOpacity:    document.getElementById('text-bg-opacity'),
  textBgOpacityVal: document.getElementById('text-bg-opacity-val'),
  textBgPadding:    document.getElementById('text-bg-padding'),
  textBgPaddingVal: document.getElementById('text-bg-padding-val'),
  textBgRadius:     document.getElementById('text-bg-radius'),
  textBgRadiusVal:  document.getElementById('text-bg-radius-val'),
  // Stickers
  uploadSticker:       document.getElementById('upload-sticker'),
  stickerOpacity:      document.getElementById('sticker-opacity'),
  stickerOpacityVal:   document.getElementById('sticker-opacity-val'),
  stickerRotation:     document.getElementById('sticker-rotation'),
  stickerRotationVal:  document.getElementById('sticker-rotation-val'),
  btnDuplicateSticker: document.getElementById('btn-duplicate-sticker'),
  btnDeleteSticker:    document.getElementById('btn-delete-sticker'),
  stickerLibrary:      document.getElementById('sticker-library'),
  preloadedStickerGrid: document.getElementById('preloaded-sticker-grid'),
  stickerCatTabs:      document.getElementById('sticker-cat-tabs'),
  // Top Zone
  topBgTypeColor:       document.getElementById('top-bg-type-color'),
  topBgTypeGradient:    document.getElementById('top-bg-type-gradient'),
  topBgTypeImage:       document.getElementById('top-bg-type-image'),
  topBgColorSection:    document.getElementById('top-bg-color-section'),
  topBgGradientSection: document.getElementById('top-bg-gradient-section'),
  topBgImageSection:    document.getElementById('top-bg-image-section'),
  topBgColorPicker:     document.getElementById('top-bg-color-picker'),
  btnApplyTopBgColor:   document.getElementById('btn-apply-top-bg-color'),
  topPresetColors:      document.querySelectorAll('.top-preset'),
  topGradStart:         document.getElementById('top-grad-start'),
  topGradEnd:           document.getElementById('top-grad-end'),
  topGradDir:           document.getElementById('top-grad-dir'),
  btnApplyTopGradient:  document.getElementById('btn-apply-top-gradient'),
  uploadTopBgImage:     document.getElementById('upload-top-bg-image'),
  btnAddTextTop:        document.getElementById('btn-add-text-top'),
  uploadStickerTop:     document.getElementById('upload-sticker-top'),
  btnClearTopZone:      document.getElementById('btn-clear-top-zone'),
  btnResetTopZone:      document.getElementById('btn-reset-top-zone'),
  // Layout
  layoutCards:       document.querySelectorAll('.layout-card'),
  layoutRatio:       document.getElementById('layout-ratio'),
  layoutRatioVal:    document.getElementById('layout-ratio-val'),
  layoutRatioImgVal: document.getElementById('layout-ratio-img-val'),
  ratioBarText:      document.getElementById('ratio-bar-text'),
  ratioBarImage:     document.getElementById('ratio-bar-image'),
  btnSwapSections:   document.getElementById('btn-swap-sections'),
  toggleDividerShow: document.getElementById('toggle-divider-show'),
  toggleDividerHide: document.getElementById('toggle-divider-hide'),
  btnDeleteSelected: document.getElementById('btn-delete-selected'),
  btnBringFront:     document.getElementById('btn-bring-front'),
  btnSendBack:       document.getElementById('btn-send-back'),
  // Zone divider
  zoneDivider:       document.getElementById('zone-divider'),
  zoneDividerHandle: document.getElementById('zone-divider-handle'),
  zoneLabelTop:      document.getElementById('zone-label-top'),
  zoneLabelMain:     document.getElementById('zone-label-main'),
  // Toolbar presets
  toolbarPresetsBtn:      document.getElementById('toolbar-presets-btn'),
  toolbarPresetsDropdown: document.getElementById('toolbar-presets-dropdown'),
  toolbarPresetItems:     document.querySelectorAll('.tp-item'),
  // Export
  canvasWidthInput:  document.getElementById('canvas-width'),
  canvasHeightInput: document.getElementById('canvas-height'),
  btnResizeCanvas:   document.getElementById('btn-resize-canvas'),
  btnExport:         document.getElementById('btn-export'),
  presetBtns:        document.querySelectorAll('.preset-btn'),
  exportFmtPng:      document.getElementById('export-fmt-png'),
  exportFmtJpeg:     document.getElementById('export-fmt-jpeg'),
  exportFmtWebp:     document.getElementById('export-fmt-webp'),
  jpegQualityGroup:  document.getElementById('jpeg-quality-group'),
  jpegQuality:       document.getElementById('jpeg-quality'),
  jpegQualityVal:    document.getElementById('jpeg-quality-val'),
  // Video
  videoControlsPanel: document.getElementById('video-controls-panel'),
  videoOverlayPanel:  document.getElementById('video-overlay-panel'),
  videoExportPanel:   document.getElementById('video-export-panel'),
  btnVideoPlay:       document.getElementById('btn-video-play'),
  timelineTrack:      document.getElementById('timeline-track'),
  timelineProgress:   document.getElementById('timeline-progress'),
  timelinePlayhead:   document.getElementById('timeline-playhead'),
  timelineCurrent:    document.getElementById('timeline-current'),
  timelineDuration:   document.getElementById('timeline-duration'),
  videoVolume:        document.getElementById('video-volume'),
  videoVolumeVal:     document.getElementById('video-volume-val'),
  btnAddTextVideo:    document.getElementById('btn-add-text-video'),
  btnAddStickerVideo: document.getElementById('btn-add-sticker-video'),
  btnExportVideo:     document.getElementById('btn-export-video'),
  btnRemoveVideo:     document.getElementById('btn-remove-video'),
  videoDurationSlider:document.getElementById('video-export-duration'),
  videoDurationVal:   document.getElementById('video-duration-val'),
  videoExportProgress:document.getElementById('video-export-progress'),
  videoExportBar:     document.getElementById('video-export-bar'),
  videoExportLabel:   document.getElementById('video-export-label'),
  toast:              document.getElementById('toast'),
};

let canvas;

/* ══════════════════════════════════════════════════════
   CANVAS INIT
══════════════════════════════════════════════════════ */
function initCanvas() {
  canvas = new fabric.Canvas('main-canvas', {
    width: state.canvasW, height: state.canvasH,
    backgroundColor: 'transparent',
    preserveObjectStacking: true,
    selection: true,
    stopContextMenu: true,
    fireRightClick: false,
  });

  fabric.Object.prototype.set({
    transparentCorners: false,
    cornerColor: '#3b82f6',
    cornerStrokeColor: '#ffffff',
    cornerSize: 10,
    cornerStyle: 'circle',
    borderColor: '#3b82f6',
    borderScaleFactor: 1.5,
    padding: 6,
  });

  canvas.on('selection:created',  syncControlsToSelection);
  canvas.on('selection:updated',  syncControlsToSelection);
  canvas.on('selection:cleared',  onSelectionCleared);
  canvas.on('object:modified',    onObjectModified);
  canvas.on('object:added',       () => { if (!state.suppressUpdate) saveHistory(); });
  canvas.on('object:removed',     () => { if (!state.suppressUpdate) saveHistory(); });
  canvas.on('object:moving',      handleObjectMoving);
  canvas.on('object:rotating',    handleObjectRotating);
  canvas.on('object:scaling',     handleObjectScaling);

  computeZones();
  renderAllZoneBgs();
  fitCanvasToWrapper();
  saveHistory();
}

function onObjectModified(e) {
  saveHistory();
  const obj = e.target;
  if (obj && isTextObj(obj)) {
    updateTextBg(obj);
  }
}

function handleObjectScaling(e) {
  const obj = e.target;
  if (obj && isTextObj(obj)) updateTextBg(obj);
}

/* ══════════════════════════════════════════════════════
   RESPONSIVE FIT
══════════════════════════════════════════════════════ */
function fitCanvasToWrapper() {
  const wrapper = dom.canvasWrapper;
  const pad = 36;
  const maxW = Math.max(100, wrapper.clientWidth  - pad * 2);
  const maxH = Math.max(100, wrapper.clientHeight - pad * 2);
  const scale = Math.min(maxW / state.canvasW, maxH / state.canvasH, 1);
  const dW = Math.round(state.canvasW * scale);
  const dH = Math.round(state.canvasH * scale);

  dom.canvasFrame.style.width  = dW + 'px';
  dom.canvasFrame.style.height = dH + 'px';
  canvas.setZoom(scale);
  canvas.setWidth(dW);
  canvas.setHeight(dH);
  canvas.renderAll();

  dom.canvasSizeLabel.textContent = `${state.canvasW} × ${state.canvasH}`;
  updateDividerDOM();
  updateVideoPosition();
}

window.addEventListener('resize', debounce(fitCanvasToWrapper, 150));

/* ══════════════════════════════════════════════════════
   SIDEBAR RESIZE
══════════════════════════════════════════════════════ */
function initResizeHandle() {
  const handle = dom.resizeHandle;
  const sidebar = dom.sidebar;
  let dragging = false, startX = 0, startW = 0;

  handle.addEventListener('mousedown', (e) => {
    dragging = true; startX = e.clientX; startW = sidebar.offsetWidth;
    handle.classList.add('dragging');
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    e.preventDefault();
  });
  document.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    const newW = Math.min(520, Math.max(220, startW + e.clientX - startX));
    sidebar.style.width = newW + 'px'; sidebar.style.minWidth = newW + 'px';
    fitCanvasToWrapper();
  });
  document.addEventListener('mouseup', () => {
    if (!dragging) return;
    dragging = false; handle.classList.remove('dragging');
    document.body.style.cursor = ''; document.body.style.userSelect = '';
  });
}

/* ══════════════════════════════════════════════════════
   HISTORY / UNDO
══════════════════════════════════════════════════════ */
function saveHistory() {
  if (state.suppressUpdate) return;
  const snap = JSON.stringify(canvas.toJSON(['id','customType','zone','originalText','curveRadius']));
  if (state.history.length >= state.maxHistory) state.history.shift();
  state.history.push(snap);
}

function undo() {
  if (state.history.length <= 1) { showToast('Nothing to undo', 'info'); return; }
  state.history.pop();
  const prev = state.history[state.history.length - 1];
  state.suppressUpdate = true;
  canvas.loadFromJSON(prev, () => {
    fixZoneBgOrder(); canvas.renderAll();
    state.suppressUpdate = false;
    showToast('Undone', 'info');
  });
}
dom.btnUndo.addEventListener('click', undo);

/* ══════════════════════════════════════════════════════
   TABS
══════════════════════════════════════════════════════ */
function initTabs() {
  dom.tabBtns.forEach(btn => btn.addEventListener('click', () => switchTab(btn.dataset.tab)));
}

function switchTab(name) {
  const btn   = document.querySelector(`.tab-btn[data-tab="${name}"]`);
  const panel = document.getElementById(`tab-${name}`);
  if (!btn || !panel) return;
  dom.tabBtns.forEach(b => b.classList.remove('active'));
  dom.tabPanels.forEach(p => p.classList.remove('active'));
  btn.classList.add('active'); panel.classList.add('active');
  btn.scrollIntoView({ behavior:'smooth', block:'nearest', inline:'center' });
}

/* ══════════════════════════════════════════════════════
   ZONE COMPUTATION
══════════════════════════════════════════════════════ */
function computeZones() {
  const W = state.canvasW, H = state.canvasH, r = state.layout.ratio;
  switch (state.layout.type) {
    case 'top-bottom':
      state.topZone  = { x:0, y:0, w:W, h:Math.round(H*r) };
      state.mainZone = { x:0, y:Math.round(H*r), w:W, h:H-Math.round(H*r) };
      break;
    case 'left-right':
      state.topZone  = { x:0, y:0, w:Math.round(W*r), h:H };
      state.mainZone = { x:Math.round(W*r), y:0, w:W-Math.round(W*r), h:H };
      break;
    case 'right-left':
      state.topZone  = { x:W-Math.round(W*r), y:0, w:Math.round(W*r), h:H };
      state.mainZone = { x:0, y:0, w:W-Math.round(W*r), h:H };
      break;
    case 'overlay':
      state.topZone  = { x:0, y:0, w:W, h:H };
      state.mainZone = { x:0, y:0, w:W, h:H };
      break;
    case 'image-only':
      state.topZone  = { x:0, y:0, w:0, h:0 };
      state.mainZone = { x:0, y:0, w:W, h:H };
      break;
    default:
      state.topZone  = { x:0, y:0, w:W, h:Math.round(H*r) };
      state.mainZone = { x:0, y:Math.round(H*r), w:W, h:H-Math.round(H*r) };
  }
}

/* ══════════════════════════════════════════════════════
   ZONE BACKGROUND RENDERING
══════════════════════════════════════════════════════ */
function removeZoneBgs() {
  canvas.getObjects().filter(o=>o.customType&&o.customType.startsWith('zone-bg')).forEach(o=>canvas.remove(o));
}

function renderAllZoneBgs() {
  removeZoneBgs();
  canvas.setBackgroundImage(null, ()=>{});
  canvas.setBackgroundColor('transparent', ()=>{});

  if (state.bgType === 'image' && state.bgImageSrc) {
    buildMainZoneBgImage();
  } else {
    const mainBg = buildMainZoneBgRect();
    if (mainBg) { canvas.add(mainBg); canvas.moveTo(mainBg, 0); }
    buildAndAddTopZoneBg();
  }
}

function buildMainZoneBgRect() {
  const z = state.mainZone;
  if (!z.w || !z.h) return null;
  return new fabric.Rect({
    left:z.x, top:z.y, width:z.w, height:z.h,
    fill: state.bgType === 'color' ? state.bgColor : '#1a1a2e',
    selectable:false, evented:false, customType:'zone-bg-main',
  });
}

function buildMainZoneBgImage() {
  fabric.Image.fromURL(state.bgImageSrc, (img) => {
    const z = state.mainZone;
    img.set({ left:z.x, top:z.y, scaleX:z.w/img.width, scaleY:z.h/img.height, selectable:false, evented:false, customType:'zone-bg-main' });
    canvas.getObjects().filter(o=>o.customType==='zone-bg-main').forEach(o=>canvas.remove(o));
    canvas.add(img); canvas.moveTo(img, 0);
    buildAndAddTopZoneBg();
  }, { crossOrigin:'anonymous' });
}

function buildAndAddTopZoneBg() {
  if (state.layout.type === 'image-only') { canvas.renderAll(); return; }
  buildTopZoneBgObject((topBg) => {
    canvas.getObjects().filter(o=>o.customType==='zone-bg-top').forEach(o=>canvas.remove(o));
    canvas.add(topBg); fixZoneBgOrder(); canvas.renderAll();
  });
}

function buildTopZoneBgObject(callback) {
  const z = state.topZone, tb = state.topBg;
  if (!z.w || !z.h) return;

  if (tb.type === 'image' && tb.imageSrc) {
    fabric.Image.fromURL(tb.imageSrc, (img) => {
      img.set({ left:z.x, top:z.y, scaleX:z.w/img.width, scaleY:z.h/img.height, selectable:false, evented:false, customType:'zone-bg-top' });
      callback(img);
    }, { crossOrigin:'anonymous' });
    return;
  }

  const fill = tb.type === 'gradient'
    ? buildFabricGradient(z, tb.gradDir, tb.gradStart, tb.gradEnd)
    : tb.color;

  callback(new fabric.Rect({ left:z.x, top:z.y, width:z.w, height:z.h, fill, selectable:false, evented:false, customType:'zone-bg-top' }));
}

function buildFabricGradient(zone, dir, c1, c2) {
  const W = zone.w, H = zone.h;
  const coords = {
    horizontal: { x1:0, y1:0, x2:W, y2:0 },
    vertical:   { x1:0, y1:0, x2:0, y2:H },
    diagonal:   { x1:0, y1:0, x2:W, y2:H },
    radial:     { x1:W/2, y1:H/2, r1:0, x2:W/2, y2:H/2, r2:Math.max(W,H)/2 },
  };
  return new fabric.Gradient({ type: dir==='radial'?'radial':'linear', gradientUnits:'pixels', coords:coords[dir]||coords.vertical, colorStops:[{offset:0,color:c1},{offset:1,color:c2}] });
}

function fixZoneBgOrder() {
  const main = canvas.getObjects().find(o=>o.customType==='zone-bg-main');
  const top  = canvas.getObjects().find(o=>o.customType==='zone-bg-top');
  if (main) canvas.moveTo(main, 0);
  if (top)  canvas.moveTo(top, 1);
}

function refreshTopZoneBg() { buildAndAddTopZoneBg(); saveHistory(); }

/* ══════════════════════════════════════════════════════
   ZONE DIVIDER DOM
══════════════════════════════════════════════════════ */
function updateDividerDOM() {
  const divider = dom.zoneDivider;
  const type = state.layout.type;
  const zoom = canvas.getZoom();
  const line   = divider.querySelector('.zone-divider-line');
  const handle = dom.zoneDividerHandle;

  if (type==='overlay' || type==='image-only') {
    divider.className = 'zone-divider hidden'; updateZoneLabels(); return;
  }
  const cls = type==='top-bottom' ? 'horizontal' : 'vertical';
  divider.className = `zone-divider ${cls}${state.layout.showDivider ? '' : ' hidden'}`;

  if (type==='top-bottom') {
    const py = state.topZone.h * zoom;
    line.style.cssText   = `top:${py}px`;
    handle.style.cssText = `top:${py}px; left:50%`;
  } else {
    const px = type==='right-left' ? state.mainZone.w * zoom : state.topZone.w * zoom;
    line.style.cssText   = `left:${px}px`;
    handle.style.cssText = `left:${px}px; top:50%`;
  }
  updateZoneLabels();
}

function updateZoneLabels() {
  const zoom = canvas.getZoom(), type = state.layout.type;
  const tz = state.topZone, mz = state.mainZone;
  if (type==='overlay'||type==='image-only') {
    dom.zoneLabelTop.style.display = 'none';
    dom.zoneLabelMain.style.display = 'none';
    return;
  }
  dom.zoneLabelTop.style.display = '';
  dom.zoneLabelMain.style.display = '';
  dom.zoneLabelTop.style.left  = (tz.x*zoom + 8) + 'px';
  dom.zoneLabelTop.style.top   = (tz.y*zoom + 8) + 'px';
  dom.zoneLabelMain.style.left = (mz.x*zoom + 8) + 'px';
  dom.zoneLabelMain.style.top  = (mz.y*zoom + 8) + 'px';
}

function initDividerDrag() {
  let dragging = false;
  dom.zoneDividerHandle.addEventListener('mousedown', (e) => { e.preventDefault(); dragging = true; document.body.style.cursor = state.layout.type==='top-bottom'?'row-resize':'col-resize'; });
  document.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    const rect = dom.canvasFrame.getBoundingClientRect();
    const zoom = canvas.getZoom(), type = state.layout.type;
    let nr = type==='top-bottom'
      ? (e.clientY - rect.top) / (state.canvasH * zoom)
      : type==='right-left'
        ? 1 - (e.clientX - rect.left) / (state.canvasW * zoom)
        : (e.clientX - rect.left) / (state.canvasW * zoom);
    nr = Math.min(0.9, Math.max(0.1, nr));
    state.layout.ratio = nr;
    dom.layoutRatio.value = Math.round(nr * 100);
    updateRatioUI(nr);
    computeZones(); renderAllZoneBgs(); updateDividerDOM(); updateVideoPosition(); canvas.renderAll();
  });
  document.addEventListener('mouseup', () => { if (!dragging) return; dragging = false; document.body.style.cursor = ''; saveHistory(); });
}

/* ══════════════════════════════════════════════════════
   VIDEO SYSTEM
══════════════════════════════════════════════════════ */
let videoTimelineRAF = null;

function updateVideoPosition() {
  if (!dom.bgVideo.src || dom.bgVideo.style.display==='none') return;
  const zoom = canvas.getZoom(), z = state.mainZone;
  dom.bgVideo.style.left   = (z.x * zoom) + 'px';
  dom.bgVideo.style.top    = (z.y * zoom) + 'px';
  dom.bgVideo.style.width  = (z.w * zoom) + 'px';
  dom.bgVideo.style.height = (z.h * zoom) + 'px';
}

function stopVideo() {
  dom.bgVideo.pause();
  dom.bgVideo.src = '';
  dom.bgVideo.style.display = 'none';
  state.bgType = null; state.bgVideoSrc = null;
  cancelAnimationFrame(videoTimelineRAF);
  dom.videoControlsPanel.style.display  = 'none';
  dom.videoOverlayPanel.style.display   = 'none';
  dom.videoExportPanel.style.display    = 'none';
}

function applyVideoBackground(src) {
  state.bgType = 'video'; state.bgVideoSrc = src;
  dom.bgVideo.src = src;
  dom.bgVideo.muted = false;
  dom.bgVideo.style.display = 'block';
  dom.bgVideo.load();

  dom.bgVideo.onloadedmetadata = () => {
    dom.bgVideo.play().catch(()=>{});
    updateVideoPosition();
    renderAllZoneBgs();
    const dur = dom.bgVideo.duration;
    dom.timelineDuration.textContent = formatTime(dur);
    dom.videoControlsPanel.style.display = '';
    dom.videoOverlayPanel.style.display  = '';
    dom.videoExportPanel.style.display   = '';
    dom.videoDurationSlider.max = Math.min(60, Math.ceil(dur));
    dom.videoDurationSlider.value = Math.min(10, Math.ceil(dur));
    dom.videoDurationVal.textContent = dom.videoDurationSlider.value;
    startVideoTimeline();
    showToast('Video loaded — add overlays above', 'success');
  };
}

function startVideoTimeline() {
  cancelAnimationFrame(videoTimelineRAF);
  function tick() {
    const vid = dom.bgVideo;
    if (!vid.duration) return;
    const pct = (vid.currentTime / vid.duration) * 100;
    dom.timelineProgress.style.width = pct + '%';
    dom.timelinePlayhead.style.left  = pct + '%';
    dom.timelineCurrent.textContent  = formatTime(vid.currentTime);
    videoTimelineRAF = requestAnimationFrame(tick);
  }
  tick();
}

function formatTime(s) {
  const m = Math.floor(s/60), sec = Math.floor(s%60);
  return `${m}:${sec.toString().padStart(2,'0')}`;
}

dom.btnVideoPlay.addEventListener('click', () => {
  const vid = dom.bgVideo;
  if (vid.paused) {
    vid.play();
    dom.btnVideoPlay.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
  } else {
    vid.pause();
    dom.btnVideoPlay.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
  }
});

dom.timelineTrack.addEventListener('click', (e) => {
  const vid = dom.bgVideo;
  if (!vid.duration) return;
  const rect = dom.timelineTrack.getBoundingClientRect();
  const pct  = (e.clientX - rect.left) / rect.width;
  vid.currentTime = pct * vid.duration;
});

dom.videoVolume.addEventListener('input', () => {
  const v = +dom.videoVolume.value;
  dom.videoVolumeVal.textContent = v;
  dom.bgVideo.muted = v === 0;
  dom.bgVideo.volume = v / 100;
});

dom.btnAddTextVideo.addEventListener('click', () => addTextToZone('main'));
dom.btnAddStickerVideo.addEventListener('click', () => {
  placeEmojiSticker('🎬', 'main');
});
dom.btnRemoveVideo.addEventListener('click', () => { stopVideo(); showToast('Video removed', 'info'); });

dom.videoDurationSlider.addEventListener('input', () => {
  dom.videoDurationVal.textContent = dom.videoDurationSlider.value;
});

// Video export with MediaRecorder
dom.btnExportVideo.addEventListener('click', async () => {
  if (!state.bgVideoSrc) { showToast('Load a video first', 'error'); return; }
  if (!window.MediaRecorder) { showToast('MediaRecorder not supported in this browser', 'error'); return; }

  const duration = +dom.videoDurationSlider.value * 1000;
  const vid = dom.bgVideo;

  vid.currentTime = 0;
  await vid.play().catch(()=>{});

  const offW = state.canvasW, offH = state.canvasH;
  const offCanvas = document.createElement('canvas');
  offCanvas.width = offW; offCanvas.height = offH;
  const ctx = offCanvas.getContext('2d');

  const stream = offCanvas.captureStream(30);
  const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
    ? 'video/webm;codecs=vp9'
    : 'video/webm';

  const recorder = new MediaRecorder(stream, { mimeType });
  const chunks = [];
  recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };

  dom.videoExportProgress.style.display = '';
  dom.btnExportVideo.disabled = true;

  let startTime = null;
  function drawFrame(ts) {
    if (!startTime) startTime = ts;
    const elapsed = ts - startTime;
    const pct = Math.min(elapsed / duration, 1);
    dom.videoExportBar.style.width = (pct * 100) + '%';
    dom.videoExportLabel.textContent = `Recording… ${Math.round(pct*100)}%`;

    ctx.clearRect(0, 0, offW, offH);
    const z = state.mainZone;
    try { ctx.drawImage(vid, z.x, z.y, z.w, z.h); } catch(e){}

    const fabricDataURL = canvas.toDataURL({ format:'png', multiplier: offW/canvas.getWidth() });
    const img = new Image();
    img.src = fabricDataURL;
    ctx.drawImage(img, 0, 0, offW, offH);

    if (elapsed < duration && recorder.state === 'recording') {
      requestAnimationFrame(drawFrame);
    } else {
      recorder.stop();
    }
  }

  recorder.onstop = () => {
    const blob = new Blob(chunks, { type: mimeType });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `postcraft-video-${Date.now()}.webm`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    dom.videoExportProgress.style.display = 'none';
    dom.btnExportVideo.disabled = false;
    showToast('Video downloaded!', 'success');
  };

  recorder.start(100);
  requestAnimationFrame(drawFrame);
});

dom.uploadBgVideo.addEventListener('change', (e) => {
  const file = e.target.files[0]; if (!file) return;
  if (!file.type.startsWith('video/')) { showToast('Please upload a video file', 'error'); return; }
  applyVideoBackground(URL.createObjectURL(file));
  e.target.value = '';
});

/* ══════════════════════════════════════════════════════
   BACKGROUND SYSTEM
══════════════════════════════════════════════════════ */
dom.uploadBgImageFull.addEventListener('change', (e) => {
  const file = e.target.files[0]; if (!file) return;
  stopVideo();
  state.bgType = 'image';
  state.bgImageSrc = URL.createObjectURL(file);
  applyLayout('image-only');
  e.target.value = '';
  showToast('Full canvas image applied', 'success');
});

dom.uploadBgImage.addEventListener('change', (e) => {
  const file = e.target.files[0]; if (!file) return;
  applyImageBackground(URL.createObjectURL(file));
  e.target.value = '';
});

function applyImageBackground(src) {
  stopVideo();
  state.bgType = 'image'; state.bgImageSrc = src;
  renderAllZoneBgs();
  showToast('Background image applied', 'success');
}

function applyBgColor() {
  stopVideo();
  state.bgType = 'color'; state.bgColor = dom.bgColorPicker.value;
  renderAllZoneBgs();
  showToast('Background color applied', 'success');
}

dom.btnApplyBgColor.addEventListener('click', applyBgColor);
dom.mainPresetColors.forEach(btn => btn.addEventListener('click', () => {
  dom.bgColorPicker.value = btn.dataset.color; applyBgColor();
}));
dom.btnRemoveBg.addEventListener('click', () => {
  stopVideo();
  state.bgType = null; state.bgImageSrc = null; state.bgColor = '#1a1a2e';
  dom.bgColorPicker.value = '#1a1a2e';
  renderAllZoneBgs();
  showToast('Background removed', 'info');
});

/* ══════════════════════════════════════════════════════
   TOP ZONE BACKGROUND
══════════════════════════════════════════════════════ */
[dom.topBgTypeColor, dom.topBgTypeGradient, dom.topBgTypeImage].forEach(btn => {
  btn.addEventListener('click', () => {
    [dom.topBgTypeColor, dom.topBgTypeGradient, dom.topBgTypeImage].forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const t = btn.dataset.type;
    dom.topBgColorSection.style.display    = t==='color'    ? '' : 'none';
    dom.topBgGradientSection.style.display = t==='gradient' ? '' : 'none';
    dom.topBgImageSection.style.display    = t==='image'    ? '' : 'none';
    state.topBg.type = t;
  });
});
dom.btnApplyTopBgColor.addEventListener('click', () => {
  state.topBg.type = 'color'; state.topBg.color = dom.topBgColorPicker.value;
  refreshTopZoneBg(); showToast('Top zone color applied', 'success');
});
dom.topPresetColors.forEach(btn => btn.addEventListener('click', () => {
  dom.topBgColorPicker.value = btn.dataset.color;
  state.topBg.type = 'color'; state.topBg.color = btn.dataset.color;
  refreshTopZoneBg();
}));
dom.btnApplyTopGradient.addEventListener('click', () => {
  state.topBg.type = 'gradient'; state.topBg.gradStart = dom.topGradStart.value;
  state.topBg.gradEnd = dom.topGradEnd.value; state.topBg.gradDir = dom.topGradDir.value;
  refreshTopZoneBg(); showToast('Gradient applied', 'success');
});
dom.uploadTopBgImage.addEventListener('change', (e) => {
  const file = e.target.files[0]; if (!file) return;
  state.topBg.type = 'image'; state.topBg.imageSrc = URL.createObjectURL(file);
  refreshTopZoneBg(); showToast('Top zone image set', 'success'); e.target.value = '';
});
dom.btnAddTextTop.addEventListener('click', () => addTextToZone('top'));
dom.uploadStickerTop.addEventListener('change', (e) => {
  const file = e.target.files[0]; if (!file) return;
  const url = URL.createObjectURL(file);
  addStickerToLibrary(url, file.name); placeStickerInZone(url, 'top');
  e.target.value = '';
});
dom.btnClearTopZone.addEventListener('click', () => {
  canvas.getObjects().filter(o=>o.zone==='top').forEach(o=>canvas.remove(o));
  canvas.discardActiveObject(); canvas.renderAll(); saveHistory();
  showToast('Top zone cleared', 'info');
});
dom.btnResetTopZone.addEventListener('click', () => {
  state.topBg = {type:'color',color:'#0f172a',gradStart:'#1e3a5f',gradEnd:'#3b1f5e',gradDir:'vertical',imageSrc:null};
  dom.topBgColorPicker.value = '#0f172a'; refreshTopZoneBg();
  showToast('Top zone reset', 'info');
});

/* ══════════════════════════════════════════════════════
   TEXT BG SYSTEM (FULLY WORKING)
══════════════════════════════════════════════════════ */
function isTextObj(obj) { 
  return obj && (obj.type === 'i-text' || obj.type === 'text'); 
}

function hexToRgba(hex, opacity) {
  hex = hex.replace('#', '');
  if (hex.length === 3) {
    hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
  }
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

function getTextBgProps() {
  return {
    color:   dom.textBgColor.value,
    opacity: +dom.textBgOpacity.value / 100,
    padding: +dom.textBgPadding.value,
    radius:  +dom.textBgRadius.value,
  };
}

function removeTextBgForObj(textObj) {
  if (!textObj) return;
  if (textObj._bgRect) {
    canvas.remove(textObj._bgRect);
    textObj._bgRect = null;
  }
  const bgRects = canvas.getObjects().filter(o => 
    o.customType === 'text-bg' && o.linkedTextId === textObj.id
  );
  bgRects.forEach(r => canvas.remove(r));
}

function applyTextBgToObj(textObj) {
  if (!textObj || !isTextObj(textObj)) return;
  removeTextBgForObj(textObj);
  if (!dom.toggleTextBg.checked) return;

  const props = getTextBgProps();
  const bounds = textObj.getBoundingRect();
  
  const rect = new fabric.Rect({
    left:   bounds.left - props.padding,
    top:    bounds.top - props.padding,
    width:  bounds.width + (props.padding * 2),
    height: bounds.height + (props.padding * 2),
    fill:   hexToRgba(props.color, props.opacity),
    rx: props.radius,
    ry: props.radius,
    selectable: false,
    evented: false,
    hasControls: false,
    hasBorders: false,
    lockMovementX: true,
    lockMovementY: true,
    hoverCursor: 'default',
    customType: 'text-bg',
    linkedTextId: textObj.id,
  });

  textObj._bgRect = rect;
  canvas.add(rect);
  const textIndex = canvas.getObjects().indexOf(textObj);
  canvas.moveTo(rect, Math.max(0, textIndex));
  canvas.renderAll();
}

function updateTextBg(textObj) {
  if (!textObj || !isTextObj(textObj)) return;
  if (!dom.toggleTextBg.checked) {
    removeTextBgForObj(textObj);
    canvas.renderAll();
    return;
  }
  if (!textObj._bgRect) {
    applyTextBgToObj(textObj);
    return;
  }
  
  const props = getTextBgProps();
  const bounds = textObj.getBoundingRect();
  
  textObj._bgRect.set({
    left:   bounds.left - props.padding,
    top:    bounds.top - props.padding,
    width:  bounds.width + (props.padding * 2),
    height: bounds.height + (props.padding * 2),
    fill:   hexToRgba(props.color, props.opacity),
    rx: props.radius,
    ry: props.radius,
  });
  textObj._bgRect.setCoords();
  canvas.renderAll();
}

// Text BG Event Listeners
dom.toggleTextBg.addEventListener('change', () => {
  const isOn = dom.toggleTextBg.checked;
  dom.textBgControls.style.display = isOn ? '' : 'none';
  const activeText = getActiveText();
  if (activeText) {
    if (isOn) {
      applyTextBgToObj(activeText);
    } else {
      removeTextBgForObj(activeText);
    }
    canvas.renderAll();
    saveHistory();
  }
});

dom.textBgColor.addEventListener('input', () => {
  const activeText = getActiveText();
  if (activeText && dom.toggleTextBg.checked) {
    updateTextBg(activeText);
  }
});

dom.textBgOpacity.addEventListener('input', () => {
  const val = +dom.textBgOpacity.value;
  dom.textBgOpacityVal.textContent = val;
  const activeText = getActiveText();
  if (activeText && dom.toggleTextBg.checked) {
    updateTextBg(activeText);
  }
});

dom.textBgPadding.addEventListener('input', () => {
  const val = +dom.textBgPadding.value;
  dom.textBgPaddingVal.textContent = val;
  const activeText = getActiveText();
  if (activeText && dom.toggleTextBg.checked) {
    updateTextBg(activeText);
  }
});

dom.textBgRadius.addEventListener('input', () => {
  const val = +dom.textBgRadius.value;
  dom.textBgRadiusVal.textContent = val;
  const activeText = getActiveText();
  if (activeText && activeText._bgRect && dom.toggleTextBg.checked) {
    activeText._bgRect.set({ rx: val, ry: val });
    canvas.renderAll();
  }
});

/* ══════════════════════════════════════════════════════
   TEXT SYSTEM
══════════════════════════════════════════════════════ */
dom.btnAddText.addEventListener('click',     ()=>addTextToZone('main'));
dom.btnAddTextTop2.addEventListener('click', ()=>addTextToZone('top'));

function addTextToZone(zone) {
  const z  = zone==='top' ? state.topZone : state.mainZone;
  const cx = (z.x + z.w/2) || state.canvasW/2;
  const cy = (z.y + z.h/2) || state.canvasH/2;

  const t = new fabric.IText(zone==='top' ? 'Top Text' : 'Double-click to edit', {
    left:cx, top:cy, originX:'center', originY:'center',
    fontFamily:'Space Grotesk', fontSize: zone==='top' ? 28 : 36,
    fill:'#ffffff', fontWeight:'normal', fontStyle:'normal', underline:false,
    textAlign:'center', opacity:1, charSpacing:0, lineHeight:1.2, angle:0, shadow:null,
    customType:'text', zone, id:uid(),
  });

  canvas.add(t);
  canvas.setActiveObject(t);
  canvas.renderAll();
  switchTab('text');
  showToast(`Text added to ${zone==='top'?'top':'main'} zone`, 'success');
}

function getActiveText() {
  const o = canvas.getActiveObject();
  return isTextObj(o) ? o : null;
}

dom.textContent.addEventListener('input', () => {
  const t = getActiveText(); if (!t) return;
  t.set('text', dom.textContent.value);
  canvas.renderAll();
  updateTextBg(t);
});
dom.textFont.addEventListener('change', () => {
  const t = getActiveText(); if (!t) return;
  t.set('fontFamily', dom.textFont.value); canvas.renderAll(); updateTextBg(t);
});
dom.textSize.addEventListener('input', () => {
  const v = +dom.textSize.value; dom.textSizeVal.textContent = v;
  const t = getActiveText(); if (!t) return;
  t.set('fontSize', v); canvas.renderAll(); updateTextBg(t);
});
dom.textColor.addEventListener('input', () => {
  const t = getActiveText(); if (!t) return;
  t.set('fill', dom.textColor.value); canvas.renderAll();
});
dom.toggleBold.addEventListener('click', () => {
  const t = getActiveText(); if (!t) return;
  const b = t.fontWeight==='bold';
  t.set('fontWeight', b?'normal':'bold');
  dom.toggleBold.classList.toggle('active', !b); canvas.renderAll(); updateTextBg(t);
});
dom.toggleItalic.addEventListener('click', () => {
  const t = getActiveText(); if (!t) return;
  const i = t.fontStyle==='italic';
  t.set('fontStyle', i?'normal':'italic');
  dom.toggleItalic.classList.toggle('active', !i); canvas.renderAll();
});
dom.toggleUnderline.addEventListener('click', () => {
  const t = getActiveText(); if (!t) return;
  t.set('underline', !t.underline);
  dom.toggleUnderline.classList.toggle('active', t.underline); canvas.renderAll();
});
[dom.textAlignLeft, dom.textAlignCenter, dom.textAlignRight].forEach(btn => {
  btn.addEventListener('click', () => {
    const t = getActiveText(); if (!t) return;
    const map = {'text-align-left':'left','text-align-center':'center','text-align-right':'right'};
    t.set('textAlign', map[btn.id]);
    [dom.textAlignLeft,dom.textAlignCenter,dom.textAlignRight].forEach(b=>b.classList.remove('active'));
    btn.classList.add('active'); canvas.renderAll();
  });
});
dom.textOpacity.addEventListener('input', () => {
  const v = +dom.textOpacity.value; dom.textOpacityVal.textContent = v;
  const t = getActiveText(); if (!t) return;
  t.set('opacity', v/100); canvas.renderAll();
});
dom.textSpacing.addEventListener('input', () => {
  const v = +dom.textSpacing.value; dom.textSpacingVal.textContent = v;
  const t = getActiveText(); if (!t) return;
  t.set('charSpacing', v*10); canvas.renderAll(); updateTextBg(t);
});
dom.textLineHeight.addEventListener('input', () => {
  const v = parseFloat(dom.textLineHeight.value).toFixed(1);
  dom.textLineHeightVal.textContent = v;
  const t = getActiveText(); if (!t) return;
  t.set('lineHeight', +v); canvas.renderAll(); updateTextBg(t);
});
dom.textRotation.addEventListener('input', () => {
  const v = +dom.textRotation.value; dom.textRotationVal.textContent = v;
  const t = getActiveText(); if (!t) return;
  t.set('angle', v); canvas.renderAll(); updateTextBg(t);
});

// Shadow
dom.toggleTextShadow.addEventListener('change', () => {
  const on = dom.toggleTextShadow.checked;
  dom.shadowControls.style.display = on ? '' : 'none';
  const t = getActiveText(); if (!t) return;
  t.set('shadow', on ? buildShadow() : null); canvas.renderAll();
});

function buildShadow() {
  return new fabric.Shadow({ color:dom.textShadowColor.value, blur:+dom.textShadowBlur.value, offsetX:+dom.textShadowOx.value, offsetY:+dom.textShadowOy.value });
}

[[dom.textShadowBlur, dom.shadowBlurVal],[dom.textShadowOx, dom.shadowOxVal],[dom.textShadowOy, dom.shadowOyVal]].forEach(([sl, vl]) => {
  sl.addEventListener('input', () => {
    vl.textContent = sl.value;
    if (!dom.toggleTextShadow.checked) return;
    const t = getActiveText(); if (!t) return;
    t.set('shadow', buildShadow()); canvas.renderAll();
  });
});
dom.textShadowColor.addEventListener('change', () => {
  if (!dom.toggleTextShadow.checked) return;
  const t = getActiveText(); if (!t) return;
  t.set('shadow', buildShadow()); canvas.renderAll();
});

dom.btnDeleteText.addEventListener('click', ()=>deleteSelected('text'));

/* ══════════════════════════════════════════════════════
   CURVED TEXT
══════════════════════════════════════════════════════ */
dom.toggleCurvedText.addEventListener('change', () => {
  dom.curveControls.style.display = dom.toggleCurvedText.checked ? '' : 'none';
});
dom.curveRadius.addEventListener('input', () => { dom.curveRadiusVal.textContent = dom.curveRadius.value; });
dom.curveDirUp.addEventListener('click', () => { dom.curveDirUp.classList.add('active'); dom.curveDirDown.classList.remove('active'); });
dom.curveDirDown.addEventListener('click', () => { dom.curveDirDown.classList.add('active'); dom.curveDirUp.classList.remove('active'); });
dom.btnApplyCurve.addEventListener('click', applyTextCurve);

function applyTextCurve() {
  const selected = canvas.getActiveObject();
  if (!selected) { showToast('Select a text object first','info'); return; }
  let text, props, zone, cx, cy;
  if (isTextObj(selected)) {
    text=selected.text; props=extractTextProps(selected); zone=selected.zone; cx=selected.left; cy=selected.top;
    removeTextBgForObj(selected);
  } else if (selected.type==='group' && selected.customType==='curved-text') {
    text=selected.originalText||''; props=extractTextProps(selected); zone=selected.zone; cx=selected.left; cy=selected.top;
  } else { showToast('Select a text object','info'); return; }

  const radius = +dom.curveRadius.value;
  const curveUp = dom.curveDirUp.classList.contains('active');
  const group = buildCurvedGroup(text, props, radius, curveUp);
  group.set({ left:cx, top:cy, originX:'center', originY:'center', customType:'curved-text', originalText:text, curveRadius:radius, zone, id:uid(), opacity:props.opacity });
  canvas.remove(selected); canvas.add(group); canvas.setActiveObject(group); canvas.renderAll(); saveHistory();
  showToast('Curve applied!', 'success');
}

function buildCurvedGroup(text, props, radius, curveUp) {
  const chars = text.split('');
  const absR  = Math.abs(radius);
  const cw    = (props.fontSize||36) * 0.58;
  const totalW = cw * chars.length;
  const totalA = totalW / absR;
  const startA = -totalA / 2;
  const stepA  = chars.length > 1 ? totalA / chars.length : 0;
  const items = chars.map((ch, i) => {
    const a   = startA + (i + 0.5) * stepA;
    const x   = Math.sin(a) * absR;
    const y   = curveUp ? -(Math.cos(a) * absR) : (Math.cos(a) * absR);
    const rot = curveUp ? a*(180/Math.PI) : (Math.PI+a)*(180/Math.PI);
    return new fabric.Text(ch===' '?'\u00A0':ch, {
      left:x, top:y, originX:'center', originY:'center',
      fontSize:props.fontSize||36, fontFamily:props.fontFamily||'Space Grotesk',
      fill:props.fill||'#ffffff', fontWeight:props.fontWeight||'normal',
      fontStyle:props.fontStyle||'normal', underline:props.underline||false,
      angle:rot, selectable:false, evented:false,
    });
  });
  return new fabric.Group(items, { opacity:props.opacity||1 });
}

function extractTextProps(obj) {
  return { fontSize:obj.fontSize||36, fontFamily:obj.fontFamily||'Space Grotesk', fill:obj.fill||'#ffffff', fontWeight:obj.fontWeight||'normal', fontStyle:obj.fontStyle||'normal', underline:obj.underline||false, opacity:obj.opacity||1 };
}

dom.btnRemoveCurve.addEventListener('click', ()=>{
  const obj = canvas.getActiveObject();
  if (!obj) { showToast('Select a curved text first','info'); return; }
  const isGroup = obj.type==='group' && obj.customType==='curved-text';
  const isText  = isTextObj(obj);
  if (!isGroup && !isText) { showToast('Select a text object','info'); return; }
  const rawText = isGroup ? (obj.originalText||'') : obj.text;
  const props   = extractTextProps(obj);
  canvas.remove(obj);
  const newT = new fabric.IText(rawText, {
    left:obj.left, top:obj.top, originX:'center', originY:'center', ...props,
    textAlign:'center', charSpacing:0, lineHeight:1.2, angle:0, shadow:null,
    customType:'text', zone:obj.zone, id:uid(),
  });
  canvas.add(newT); canvas.setActiveObject(newT); canvas.renderAll(); saveHistory();
  showToast('Curve removed', 'info');
});

/* ══════════════════════════════════════════════════════
   PRELOADED STICKER LIBRARY
══════════════════════════════════════════════════════ */
function initStickerLibrary() {
  let activeCategory = 'emoji';
  renderStickerCategory(activeCategory);

  dom.stickerCatTabs.querySelectorAll('.sticker-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      dom.stickerCatTabs.querySelectorAll('.sticker-cat-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.dataset.cat;
      renderStickerCategory(activeCategory);
    });
  });
}

function renderStickerCategory(cat) {
  const grid = dom.preloadedStickerGrid;
  grid.innerHTML = '';
  const stickers = STICKER_LIBRARY[cat] || [];
  stickers.forEach(emoji => {
    const item = document.createElement('div');
    item.className = 'sticker-grid-item';
    item.textContent = emoji;
    item.title = `Add ${emoji}`;
    item.addEventListener('click', () => placeEmojiSticker(emoji, 'main'));
    grid.appendChild(item);
  });
}

function placeEmojiSticker(emoji, zone) {
  const z = zone==='top' ? state.topZone : state.mainZone;
  const cx = (z.x + (z.w||state.canvasW)/2);
  const cy = (z.y + (z.h||state.canvasH)/2);
  const fontSize = Math.min((z.w||state.canvasW), (z.h||state.canvasH)) * 0.12;

  const t = new fabric.Text(emoji, {
    left:cx, top:cy, originX:'center', originY:'center',
    fontSize: Math.max(40, Math.min(120, fontSize)),
    selectable:true, evented:true,
    customType:'sticker', zone, id:uid(),
  });
  canvas.add(t);
  canvas.setActiveObject(t);
  canvas.renderAll();
  saveHistory();
  showToast(`${emoji} added`, 'success');
}

/* ══════════════════════════════════════════════════════
   IMAGE STICKER SYSTEM
══════════════════════════════════════════════════════ */
dom.uploadSticker.addEventListener('change', (e) => {
  const file = e.target.files[0]; if (!file) return;
  const url = URL.createObjectURL(file);
  addStickerToLibrary(url, file.name);
  placeStickerInZone(url, 'main');
  e.target.value = '';
});

function addStickerToLibrary(src, name) {
  state.stickerSrcs.push(src);
  const hint = dom.stickerLibrary.querySelector('.empty-hint');
  if (hint) hint.remove();
  const img = document.createElement('img');
  img.src = src; img.className = 'sticker-thumb'; img.title = name||'Sticker';
  img.addEventListener('click', ()=>placeStickerInZone(src, 'main'));
  dom.stickerLibrary.appendChild(img);
}

function placeStickerInZone(src, zone) {
  const z = zone==='top' ? state.topZone : state.mainZone;
  const maxSize = Math.min(z.w||state.canvasW, z.h||state.canvasH) * 0.3;
  fabric.Image.fromURL(src, (img) => {
    const scale = Math.min(maxSize/img.width, maxSize/img.height, 1);
    img.set({
      left: z.x + (z.w||state.canvasW)/2, top: z.y + (z.h||state.canvasH)/2,
      originX:'center', originY:'center', scaleX:scale, scaleY:scale,
      customType:'sticker', zone, id:uid(),
    });
    canvas.add(img); canvas.setActiveObject(img); canvas.renderAll();
    showToast('Sticker placed', 'success');
  }, { crossOrigin:'anonymous' });
}

function getActiveSticker() {
  const o = canvas.getActiveObject();
  return (o && o.customType==='sticker') ? o : null;
}

dom.stickerOpacity.addEventListener('input', () => {
  const v = +dom.stickerOpacity.value; dom.stickerOpacityVal.textContent = v;
  const s = getActiveSticker(); if (!s) return;
  s.set('opacity', v/100); canvas.renderAll();
});
dom.stickerRotation.addEventListener('input', () => {
  const v = +dom.stickerRotation.value; dom.stickerRotationVal.textContent = v;
  const s = getActiveSticker(); if (!s) return;
  s.set('angle', v); canvas.renderAll();
});
dom.btnDuplicateSticker.addEventListener('click', ()=>{
  const obj = canvas.getActiveObject(); if (!obj) { showToast('Select a sticker first','info'); return; }
  obj.clone((cloned)=>{
    cloned.set({ left:obj.left+20, top:obj.top+20, id:uid(), customType:obj.customType, zone:obj.zone });
    canvas.add(cloned); canvas.setActiveObject(cloned); canvas.renderAll();
    showToast('Duplicated!', 'success');
  });
});
dom.btnDeleteSticker.addEventListener('click', ()=>deleteSelected('sticker'));

/* ══════════════════════════════════════════════════════
   LAYOUT SYSTEM
══════════════════════════════════════════════════════ */
function initLayoutControls() {
  dom.layoutCards.forEach(card => {
    card.addEventListener('click', ()=>{
      dom.layoutCards.forEach(c=>c.classList.remove('active'));
      card.classList.add('active');
      applyLayout(card.dataset.layout);
    });
  });
  dom.layoutRatio.addEventListener('input', ()=>{
    const v = +dom.layoutRatio.value/100;
    state.layout.ratio = v; updateRatioUI(v);
    computeZones(); renderAllZoneBgs(); updateDividerDOM(); updateVideoPosition(); canvas.renderAll();
  });
  dom.btnSwapSections.addEventListener('click', swapSections);
  dom.toggleDividerShow.addEventListener('click', ()=>{
    state.layout.showDivider = true;
    dom.toggleDividerShow.classList.add('active'); dom.toggleDividerHide.classList.remove('active');
    updateDividerDOM();
  });
  dom.toggleDividerHide.addEventListener('click', ()=>{
    state.layout.showDivider = false;
    dom.toggleDividerHide.classList.add('active'); dom.toggleDividerShow.classList.remove('active');
    updateDividerDOM();
  });
}

function applyLayout(type) {
  state.layout.type = type;
  const labels = {'top-bottom':'Top / Bottom','left-right':'Left / Right','right-left':'Right / Left','overlay':'Overlay','image-only':'Image Only'};
  dom.layoutIndicator.textContent = labels[type] || type;
  dom.layoutCards.forEach(c => c.classList.toggle('active', c.dataset.layout===type));
  computeZones(); renderAllZoneBgs(); updateDividerDOM(); updateVideoPosition(); canvas.renderAll();
  showToast(`Layout: ${labels[type]}`, 'info');
}

function swapSections() {
  const t = state.layout.type;
  if (t==='left-right') { applyLayout('right-left'); return; }
  if (t==='right-left') { applyLayout('left-right'); return; }
  if (t==='top-bottom') {
    state.layout.ratio = 1 - state.layout.ratio;
    dom.layoutRatio.value = Math.round(state.layout.ratio * 100);
    updateRatioUI(state.layout.ratio);
    computeZones(); renderAllZoneBgs(); updateDividerDOM(); canvas.renderAll();
    showToast('Zones swapped', 'info');
  }
}

function updateRatioUI(ratio) {
  const pct = Math.round(ratio * 100);
  dom.layoutRatioVal.textContent    = pct;
  dom.layoutRatioImgVal.textContent = 100 - pct;
  dom.ratioBarText.style.width  = pct + '%';
  dom.ratioBarImage.style.width = (100 - pct) + '%';
}

/* ══════════════════════════════════════════════════════
   TOOLBAR QUICK PRESETS
══════════════════════════════════════════════════════ */
function initQuickPresets() {
  const btn = dom.toolbarPresetsBtn, dropdown = dom.toolbarPresetsDropdown;
  btn.addEventListener('click', (e)=>{ e.stopPropagation(); dropdown.classList.toggle('show'); });
  document.addEventListener('click', ()=>dropdown.classList.remove('show'));
  dropdown.addEventListener('click', e=>e.stopPropagation());
  dom.toolbarPresetItems.forEach(item => {
    item.addEventListener('click', ()=>{
      const w = +item.dataset.w, h = +item.dataset.h;
      dom.canvasWidthInput.value = w; dom.canvasHeightInput.value = h;
      resizeCanvas(w,h); dropdown.classList.remove('show');
    });
  });
}

/* ══════════════════════════════════════════════════════
   SELECTION SYNC
══════════════════════════════════════════════════════ */
function syncControlsToSelection() {
  const obj = canvas.getActiveObject();
  if (!obj) return;

  dom.zoneBadge.textContent = obj.zone==='top' ? '⊙ Top Zone' : obj.zone==='main' ? '⊙ Main Zone' : '';

  if (isTextObj(obj)) {
    state.suppressUpdate = true;
    dom.textContent.value             = obj.text || '';
    dom.textFont.value                = obj.fontFamily || 'Space Grotesk';
    dom.textSize.value                = Math.round(obj.fontSize||36);
    dom.textSizeVal.textContent       = Math.round(obj.fontSize||36);
    dom.textColor.value               = rgbToHex(obj.fill||'#ffffff');
    dom.textOpacity.value             = Math.round((obj.opacity||1)*100);
    dom.textOpacityVal.textContent    = Math.round((obj.opacity||1)*100);
    dom.textSpacing.value             = Math.round((obj.charSpacing||0)/10);
    dom.textSpacingVal.textContent    = Math.round((obj.charSpacing||0)/10);
    dom.textLineHeight.value          = (obj.lineHeight||1.2).toFixed(1);
    dom.textLineHeightVal.textContent = (obj.lineHeight||1.2).toFixed(1);
    dom.textRotation.value            = Math.round(obj.angle||0);
    dom.textRotationVal.textContent   = Math.round(obj.angle||0);
    dom.toggleBold.classList.toggle('active',      obj.fontWeight==='bold');
    dom.toggleItalic.classList.toggle('active',    obj.fontStyle==='italic');
    dom.toggleUnderline.classList.toggle('active', !!obj.underline);
    const align = obj.textAlign||'center';
    dom.textAlignLeft.classList.toggle('active',   align==='left');
    dom.textAlignCenter.classList.toggle('active', align==='center');
    dom.textAlignRight.classList.toggle('active',  align==='right');
    const hasShadow = !!obj.shadow;
    dom.toggleTextShadow.checked     = hasShadow;
    dom.shadowControls.style.display = hasShadow ? '' : 'none';
    if (hasShadow) {
      dom.textShadowColor.value = rgbToHex(obj.shadow.color||'#000000');
      dom.textShadowBlur.value  = obj.shadow.blur    || 4; dom.shadowBlurVal.textContent  = obj.shadow.blur    || 4;
      dom.textShadowOx.value    = obj.shadow.offsetX || 2; dom.shadowOxVal.textContent    = obj.shadow.offsetX || 2;
      dom.textShadowOy.value    = obj.shadow.offsetY || 2; dom.shadowOyVal.textContent    = obj.shadow.offsetY || 2;
    }
    
    // TEXT BG SYNC
    const hasBg = !!(obj._bgRect);
    dom.toggleTextBg.checked = hasBg;
    dom.textBgControls.style.display = hasBg ? '' : 'none';
    if (hasBg && obj._bgRect) {
      const fillColor = obj._bgRect.fill;
      if (fillColor && fillColor.startsWith('rgba')) {
        const rgbaMatch = fillColor.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
        if (rgbaMatch) {
          const r = parseInt(rgbaMatch[1]).toString(16).padStart(2, '0');
          const g = parseInt(rgbaMatch[2]).toString(16).padStart(2, '0');
          const b = parseInt(rgbaMatch[3]).toString(16).padStart(2, '0');
          dom.textBgColor.value = `#${r}${g}${b}`;
          dom.textBgOpacity.value = Math.round(parseFloat(rgbaMatch[4]) * 100);
          dom.textBgOpacityVal.textContent = dom.textBgOpacity.value;
        }
      } else {
        dom.textBgColor.value = rgbToHex(fillColor || '#000000');
      }
      const bounds = obj.getBoundingRect();
      const padding = Math.round((obj._bgRect.width - bounds.width) / 2);
      dom.textBgPadding.value = Math.max(0, Math.min(40, padding));
      dom.textBgPaddingVal.textContent = dom.textBgPadding.value;
      dom.textBgRadius.value = obj._bgRect.rx || 6;
      dom.textBgRadiusVal.textContent = dom.textBgRadius.value;
    } else {
      dom.textBgColor.value = '#000000';
      dom.textBgOpacity.value = 80;
      dom.textBgOpacityVal.textContent = '80';
      dom.textBgPadding.value = 8;
      dom.textBgPaddingVal.textContent = '8';
      dom.textBgRadius.value = 6;
      dom.textBgRadiusVal.textContent = '6';
    }
    state.suppressUpdate = false;
    switchTab('text');
  }
  else if (obj.type==='group' && obj.customType==='curved-text') { switchTab('text'); }
  else if (obj.customType==='sticker') {
    state.suppressUpdate = true;
    dom.stickerOpacity.value          = Math.round((obj.opacity||1)*100);
    dom.stickerOpacityVal.textContent = dom.stickerOpacity.value;
    dom.stickerRotation.value         = Math.round(obj.angle||0);
    dom.stickerRotationVal.textContent= dom.stickerRotation.value;
    state.suppressUpdate = false;
    switchTab('sticker');
  }
}

function onSelectionCleared() {
  dom.zoneBadge.textContent = '';
  dom.textContent.value = '';
}

/* ══════════════════════════════════════════════════════
   LAYER CONTROLS
══════════════════════════════════════════════════════ */
dom.btnBringFront.addEventListener('click', ()=>{
  const obj = canvas.getActiveObject(); if (!obj) return;
  canvas.bringToFront(obj); canvas.renderAll(); showToast('Brought to front','info');
});
dom.btnSendBack.addEventListener('click', ()=>{
  const obj = canvas.getActiveObject(); if (!obj) return;
  const bgCount = canvas.getObjects().filter(o=>o.customType&&o.customType.startsWith('zone-bg')).length;
  canvas.moveTo(obj, bgCount); canvas.renderAll(); showToast('Sent to back','info');
});

/* ══════════════════════════════════════════════════════
   DELETE / CLEAR
══════════════════════════════════════════════════════ */
function deleteSelected(label) {
  const obj = canvas.getActiveObject();
  if (!obj) { showToast(`Select a ${label||'object'} first`,'info'); return; }
  if (isTextObj(obj)) removeTextBgForObj(obj);
  canvas.remove(obj); canvas.discardActiveObject(); canvas.renderAll();
  showToast('Deleted','info');
}

dom.btnDeleteSelected.addEventListener('click', ()=>deleteSelected('object'));

dom.btnClear.addEventListener('click', ()=>{
  if (!confirm('Clear all objects from the canvas?')) return;
  canvas.getObjects().filter(o=>!o.customType||!o.customType.startsWith('zone-bg')).forEach(o=>canvas.remove(o));
  stopVideo();
  state.bgType = null; state.bgImageSrc = null;
  renderAllZoneBgs(); saveHistory();
  showToast('Canvas cleared','info');
});

window.addEventListener('keydown', (e)=>{
  const tag = document.activeElement.tagName;
  if (tag==='INPUT'||tag==='TEXTAREA'||tag==='SELECT') return;
  if (e.key==='Delete'||e.key==='Backspace') deleteSelected('object');
  if ((e.ctrlKey||e.metaKey) && e.key==='z') { e.preventDefault(); undo(); }
  if ((e.ctrlKey||e.metaKey) && e.key==='d') {
    e.preventDefault();
    const obj = canvas.getActiveObject(); if (!obj) return;
    obj.clone((cloned)=>{
      cloned.set({ left:obj.left+20, top:obj.top+20, id:uid(), customType:obj.customType, zone:obj.zone });
      canvas.add(cloned); canvas.setActiveObject(cloned); canvas.renderAll();
    });
  }
});

/* ══════════════════════════════════════════════════════
   OBJECT EVENTS
══════════════════════════════════════════════════════ */
function handleObjectMoving(e) {
  const obj = e.target;
  if (obj.customType && obj.customType.startsWith('zone-bg')) return;
  if (obj.zone && state.layout.type!=='overlay' && state.layout.type!=='image-only') {
    const z = obj.zone==='top' ? state.topZone : state.mainZone;
    if (!z.w || !z.h) return;
    const b = obj.getBoundingRect(true);
    if (b.left < z.x - b.width*0.5)                     obj.left = obj.left - b.left + z.x - b.width*0.5;
    if (b.top  < z.y - b.height*0.5)                    obj.top  = obj.top  - b.top  + z.y - b.height*0.5;
    if (b.left + b.width  > z.x + z.w + b.width*0.5)  obj.left = z.x + z.w + b.width*0.5  - b.width  + (obj.left - b.left);
    if (b.top  + b.height > z.y + z.h + b.height*0.5) obj.top  = z.y + z.h + b.height*0.5 - b.height + (obj.top  - b.top);
  }
  if (isTextObj(obj)) updateTextBg(obj);
}

function handleObjectRotating(e) {
  const obj = e.target, ang = Math.round(obj.angle);
  if (isTextObj(obj)) { dom.textRotation.value = ang; dom.textRotationVal.textContent = ang; }
  else if (obj.customType==='sticker') { dom.stickerRotation.value = ang; dom.stickerRotationVal.textContent = ang; }
  updateTextBg(obj);
}

/* ══════════════════════════════════════════════════════
   CANVAS RESIZE
══════════════════════════════════════════════════════ */
dom.btnResizeCanvas.addEventListener('click', ()=>{
  const w = +dom.canvasWidthInput.value, h = +dom.canvasHeightInput.value;
  if (!w || !h || w<100 || h<100) { showToast('Min 100 × 100 px','error'); return; }
  if (w>4000 || h>4000) { showToast('Max 4000 × 4000 px','error'); return; }
  resizeCanvas(w,h);
});
function resizeCanvas(w,h) {
  state.canvasW = w; state.canvasH = h;
  computeZones(); renderAllZoneBgs(); fitCanvasToWrapper();
  showToast(`Canvas resized to ${w} × ${h} px`,'success');
}
dom.presetBtns.forEach(btn => btn.addEventListener('click', ()=>{
  const w = +btn.dataset.w, h = +btn.dataset.h;
  dom.canvasWidthInput.value = w; dom.canvasHeightInput.value = h;
  resizeCanvas(w,h);
}));

/* ══════════════════════════════════════════════════════
   EXPORT — PNG / JPEG / WebP
══════════════════════════════════════════════════════ */
[dom.exportFmtPng, dom.exportFmtJpeg, dom.exportFmtWebp].forEach(btn => {
  btn.addEventListener('click', ()=>{
    const fmt = btn.id.replace('export-fmt-','');
    state.exportFormat = fmt;
    [dom.exportFmtPng, dom.exportFmtJpeg, dom.exportFmtWebp].forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    dom.jpegQualityGroup.style.display = (fmt==='png') ? 'none' : '';
  });
});
dom.jpegQuality.addEventListener('input', ()=>{
  state.exportQuality = +dom.jpegQuality.value/100;
  dom.jpegQualityVal.textContent = dom.jpegQuality.value;
});

function exportImage() {
  const activeObj = canvas.getActiveObject();
  canvas.discardActiveObject(); canvas.renderAll();

  const zoom = canvas.getZoom();
  canvas.setZoom(1); canvas.setWidth(state.canvasW); canvas.setHeight(state.canvasH); canvas.renderAll();

  const fmt = state.exportFormat;
  const quality = fmt==='png' ? 1 : state.exportQuality;
  const fabricFmt = fmt==='webp' ? 'webp' : fmt;
  const dataURL = canvas.toDataURL({ format:fabricFmt, quality, multiplier:1 });

  canvas.setZoom(zoom); fitCanvasToWrapper(); canvas.renderAll();
  if (activeObj) { canvas.setActiveObject(activeObj); canvas.renderAll(); }

  const ext = fmt==='jpeg' ? 'jpg' : fmt;
  const a = document.createElement('a');
  a.href = dataURL; a.download = `postcraft-${Date.now()}.${ext}`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  showToast(`${fmt.toUpperCase()} downloaded!`, 'success');
}

dom.btnExport.addEventListener('click', exportImage);
dom.btnExportTop.addEventListener('click', exportImage);

/* ══════════════════════════════════════════════════════
   DRAG-AND-DROP
══════════════════════════════════════════════════════ */
const canvasArea = document.getElementById('canvas-area');
canvasArea.addEventListener('dragover',  (e)=>{ e.preventDefault(); canvasArea.style.outline='2px dashed rgba(59,130,246,0.5)'; });
canvasArea.addEventListener('dragleave', ()=>{ canvasArea.style.outline='none'; });
canvasArea.addEventListener('drop', (e)=>{
  e.preventDefault(); canvasArea.style.outline='none';
  const file = e.dataTransfer.files[0]; if (!file) return;
  const url = URL.createObjectURL(file);
  if (file.type.startsWith('image/') && file.type!=='image/png') applyImageBackground(url);
  else if (file.type==='image/png') { if (e.shiftKey) applyImageBackground(url); else { addStickerToLibrary(url,file.name); placeStickerInZone(url,'main'); } }
  else if (file.type.startsWith('video/')) applyVideoBackground(url);
  else showToast('Unsupported file type','error');
});

/* ══════════════════════════════════════════════════════
   TOAST
══════════════════════════════════════════════════════ */
let toastTimer;
function showToast(msg, type='info') {
  const el = dom.toast;
  el.textContent = msg;
  el.className = `toast ${type} show`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>el.classList.remove('show'), 2800);
}

/* ══════════════════════════════════════════════════════
   UTILS
══════════════════════════════════════════════════════ */
function uid() { return Math.random().toString(36).slice(2,9); }
function debounce(fn, delay) { let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a),delay); }; }
function rgbToHex(color) {
  if (!color) return '#ffffff';
  if (color.startsWith('#')) return color.length===4 ? '#'+color[1]+color[1]+color[2]+color[2]+color[3]+color[3] : color.slice(0,7);
  const m = color.match(/\d+/g);
  if (m && m.length>=3) return '#'+(+m[0]).toString(16).padStart(2,'0')+(+m[1]).toString(16).padStart(2,'0')+(+m[2]).toString(16).padStart(2,'0');
  return '#ffffff';
}

/* ══════════════════════════════════════════════════════
   BOOT
══════════════════════════════════════════════════════ */
(function init() {
  initCanvas();
  initTabs();
  initLayoutControls();
  initDividerDrag();
  initResizeHandle();
  initQuickPresets();
  initStickerLibrary();
  updateRatioUI(state.layout.ratio);
  setTimeout(()=>showToast('PostCraft Pro ✦ Ready to create','info'), 600);
})();