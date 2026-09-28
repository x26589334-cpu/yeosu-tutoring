/* 여수과외 — 상담 신청 → 구글 시트 "웹 문의"
   허브 Apps Script 로 보내고 sheet= 값으로 탭을 고른다. (사이트관리/사이트대장.md 2절)
   ※ 탭 이름을 바꾸려면 아래 SHEET_TAB 한 줄만 고칠 것. 오타가 나면 새 탭이 조용히 생긴다. */
var SHEET_ENDPOINT = "https://script.google.com/macros/s/AKfycbznAb0ZOODlNp-ckR5fvkqtVQijwuJ9Gl0G4KxDrfp-K7zM4fcfMMp5qDhAbwNkvYQG/exec";
var SHEET_TAB = "지역과외";
var SITE_NAME = "여수과외";

(function(){
  function val(id){ var el = document.getElementById(id); return el ? String(el.value).trim() : ""; }
  function send(payload){
    return fetch(SHEET_ENDPOINT, {
      method: "POST", mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body: new URLSearchParams(payload).toString()
    });
  }
  [].slice.call(document.querySelectorAll("form[id]")).forEach(function(form){
    var id = form.id;
    if (!document.getElementById(id + "_name")) return;
    form.addEventListener("submit", async function(e){
      e.preventDefault();
      var req = ["_name","_phone","_school","_grade","_subject"];
      for (var i = 0; i < req.length; i++){
        if (!val(id + req[i])) { alert("필수 항목을 모두 입력해 주세요."); var el = document.getElementById(id + req[i]); if (el) el.focus(); return; }
      }
      var payload = {
        sheet: SHEET_TAB, _form: SITE_NAME,
        _time: new Date().toLocaleString("ko-KR"),
        사이트: SITE_NAME, 지역: "전라남도 여수시",
        이름: val(id+"_name"), 연락처: val(id+"_phone"), 학교: val(id+"_school"),
        학년: val(id+"_grade"), 과목: val(id+"_subject"), 수업방식: val(id+"_mode"),
        읍면동: val(id+"_area"), 선생님성별: val(id+"_gender"), 남길말: val(id+"_memo"),
        // 허브는 _ 로 시작하는 항목을 버린다 → 어느 페이지에서 신청했는지 남기려면 이름에 _ 를 붙이지 말 것
        신청페이지: location.origin + location.pathname
      };
      var btn = form.querySelector('button[type="submit"]');
      var orig = btn ? btn.textContent : "";
      if (btn) { btn.disabled = true; btn.textContent = "접수 중…"; }
      try { await send(payload); } catch (_) {}
      var ok = document.getElementById(id + "_ok");
      if (ok) ok.style.display = "block";
      if (btn) btn.textContent = "신청 완료 ✓";
    });
  });
})();
