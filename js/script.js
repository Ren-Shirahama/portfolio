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
