// Google Analytics 4 — 측정 ID 를 발급받으면 아래 한 줄만 바꾼다.
// ※ 아직 미발급 상태(GA_ID 가 비어 있으면 아무것도 하지 않음). 사이트관리/사이트대장.md 10절에 ID 를 적어둘 것.
(function () {
  var GA_ID = ''; // 예: 'G-XXXXXXXXXX'  (여수과외)
  if (!GA_ID) return;
  var s = document.createElement('script');
  s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  window.gtag = gtag; gtag('js', new Date()); gtag('config', GA_ID);
})();
