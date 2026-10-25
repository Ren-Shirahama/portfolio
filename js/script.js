/*
ローディングから画面遷移
================================================ */
const loadingAreaFog = document.querySelector('#loading');
const loadingText = document.querySelector('#loading p');

//ページのすべての要素が完全に読み込まれたら動きをスタート
window.addEventListener('load', () => {

  //テキストをじわっと先に消す
  loadingText.animate(
    [
      { opacity: 1 },
      { opacity: 0 }
    ], 
    {
      duration: 1000,
      easing: 'ease',
      fill: 'forwards'
    }
  );

  //白い霧をもわっと透明にする
  loadingAreaFog.animate(
    [
      { opacity: 1, visibility: 'visible' },
      { opacity: 0, visibility: 'hidden' }
    ],
    {
      duration: 3000,
      delay: 500,
      easing: 'ease-out',
      fill: 'forwards'
    }
  );  
});

/*
ナビゲーションのドロップダウン
================================================ */

const dropdown = document.querySelector('.dropdown');
const dropdownMenu = document.querySelector('.dropdown-menu');

//マウスが「works」に乗ったとき
dropdown.addEventListener('mouseenter', () => {
  dropdownMenu.style.display = 'block';
  
  dropdownMenu.animate(
    [
      { transform: 'scaleX(0.8)', opacity: 0 },
      { transform: 'scaleX(1)', opacity: 1 }
    ],
    {
      duration: 400,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
      fill: 'forwards'
    }
  );
});

//マウスが「works」から離れたとき
dropdown.addEventListener('mouseleave', () => {
  dropdownMenu.animate(
    [
      { opacity: 1 },
      { opacity: 0 }
    ],
    {
      duration: 300,
      easing: 'ease-in',
      fill: 'forwards'
    }
  ).onfinish = () => {
    dropdownMenu.style.display = 'none';
  };
});

/*
Worksのスクロール
================================================ */
const box  = document.querySelector('.works-box');
const root = document.documentElement;

let locked  = false;
let lockedY = 0;
let prevY   = window.scrollY;
let touchY  = 0;

let target = 0;          // 作品リストが行きたい位置
let current = 0;         // 今の位置(滑らかに追従させる)
let rafId = null;
let edgeSince = 0;       // 端に着いた時刻

const lockY     = () => Math.round(box.getBoundingClientRect().top + window.scrollY);
const maxScroll = () => box.scrollHeight - box.clientHeight;

// 作品リストを滑らかに動かす
function tick() {
  current += (target - current) * 0.18;
  if (Math.abs(target - current) < 0.5) current = target;
  box.scrollTop = current;
  rafId = current === target ? null : requestAnimationFrame(tick);
}
function setTarget(v) {
  target = Math.min(Math.max(v, 0), maxScroll());
  if (!rafId) rafId = requestAnimationFrame(tick);
}

function lock(fromAbove) {
  lockedY = lockY();
  locked = true;
  edgeSince = 0;
  root.style.scrollBehavior = 'auto'; // ロック中はsmoothを無効にする
  root.style.overflow = 'hidden';
  window.scrollTo({ top: lockedY, behavior: 'instant' });
  prevY = lockedY;
  current = target = fromAbove ? 0 : maxScroll();
  box.scrollTop = current;
}

function unlock(dir) {
  locked = false;
  root.style.overflow = '';
  const y = lockedY + dir * 2;
  window.scrollTo({ top: y, behavior: 'instant' });
  root.style.scrollBehavior = ''; // smoothを元に戻す
  prevY = y;
}

window.addEventListener('scroll', () => {
  // ロック中は、ずれたら毎回同じ位置に戻す
  if (locked) {
    if (window.scrollY !== lockedY) window.scrollTo({ top: lockedY, behavior: 'instant' });
    return;
  }
  const y = window.scrollY;
  const t = lockY();
  if (prevY < t && y >= t)      lock(true);   // 上から下へ通過
  else if (prevY > t && y <= t) lock(false);  // 下から上へ通過
  else prevY = y;
}, { passive: true });

function move(delta) {
  const max = maxScroll();
  const atEnd   = delta > 0 && box.scrollTop >= max - 1;
  const atStart = delta < 0 && box.scrollTop <= 1;

  if (atEnd || atStart) {
    // 端に着いてから少し待って解除(勢いでそのまま抜けないように)
    const now = performance.now();
    if (!edgeSince) edgeSince = now;
    if (now - edgeSince > 200) unlock(delta > 0 ? 1 : -1);
    return;
  }
  edgeSince = 0;
  setTarget(target + delta);
}

window.addEventListener('wheel', (e) => {
  if (!locked) return;
  e.preventDefault();
  let d = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
  d = Math.max(-120, Math.min(120, d));
  move(d);
}, { passive: false });

window.addEventListener('touchstart', (e) => {
  touchY = e.touches[0].clientY;
}, { passive: true });

window.addEventListener('touchmove', (e) => {
  if (!locked) return;
  e.preventDefault();
  const y = e.touches[0].clientY;
  move((touchY - y) * 1.5);
  touchY = y;
}, { passive: false });

window.addEventListener('resize', () => setTarget(target));