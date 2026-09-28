/* 검색·필터 (학교 목록 / 선생님 목록) */
(function(){
  var norm = function(s){ return String(s||'').replace(/\s+/g,'').toLowerCase(); };

  /* 학교 목록 */
  var q = document.getElementById('q');
  if (q) {
    var items = [].slice.call(document.querySelectorAll('.school-item'));
    var lvl = '';
    var cnt = document.getElementById('cnt');
    var apply = function(){
      var v = norm(q.value), shown = 0;
      items.forEach(function(el){
        var ok = (!lvl || el.dataset.t === lvl) && (!v || norm(el.dataset.n).indexOf(v) > -1 || norm(el.textContent).indexOf(v) > -1);
        el.style.display = ok ? '' : 'none'; if (ok) shown++;
      });
      document.querySelectorAll('#schoolSections h2').forEach(function(h){
        var grid = h.nextElementSibling;
        var any = [].slice.call(grid.children).some(function(c){ return c.style.display !== 'none'; });
        h.style.display = any ? '' : 'none'; grid.style.display = any ? '' : 'none';
      });
      if (cnt) cnt.textContent = (v || lvl) ? shown + '개 학교' : '';
    };
    q.addEventListener('input', apply);
    var chips = document.getElementById('lvlChips');
    if (chips) chips.addEventListener('click', function(e){
      var b = e.target.closest('.chip'); if (!b) return;
      lvl = b.dataset.lvl;
      [].slice.call(chips.children).forEach(function(c){ c.setAttribute('aria-pressed', String(c === b)); });
      apply();
    });
  }

  /* 선생님 목록 */
  var list = document.getElementById('tlist');
  if (list) {
    var start = function(){
      var all = window.TEACHERS || [];
      var f = { q:'', mode:'', sub:'', g:'' }, shown = 0, STEP = 24;
      var more = document.getElementById('more'), tcnt = document.getElementById('tcnt');
      var match = function(t){
        if (f.mode === '방문' && t.c.indexOf('방문') < 0) return false;
        if (f.mode === '화상' && t.c.indexOf('화상') < 0) return false;
        if (f.sub && (t.s || []).indexOf(f.sub) < 0) return false;
        if (f.g && t.g !== f.g) return false;
        if (f.q) { var hay = norm((t.tag||'') + (t.s||[]).join('') + (t.c||'') + (t.r||'') + (t.gr||[]).join('')); if (hay.indexOf(norm(f.q)) < 0) return false; }
        return true;
      };
      var card = function(t){
        return '<article class="t-card"><div class="t-top"><div class="av">' + esc(t.n.slice(0,1)) + '</div>' +
          '<div><div class="t-name">' + esc(t.n) + ' 선생님</div><div class="t-meta">' + esc(t.g) + ' · ' + esc(t.c) + (t.r ? ' · ' + esc(t.r) : '') + '</div></div></div>' +
          '<p class="t-tag">' + esc(t.tag || '1:1 맞춤 과외') + '</p>' +
          '<div class="t-sub">' + (t.s||[]).map(function(s){ return '<b>' + esc(s) + '</b>'; }).join('') + '</div>' +
          '<div class="t-meta" style="margin-top:8px">' + esc((t.gr||[]).slice(0,2).join(' / ')) + '</div></article>';
      };
      var esc = function(s){ return String(s==null?'':s).replace(/[<>&"]/g, function(c){ return {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c]; }); };
      var render = function(reset){
        if (reset) { list.innerHTML = ''; shown = 0; }
        var hit = all.filter(match);
        var slice = hit.slice(shown, shown + STEP);
        list.insertAdjacentHTML('beforeend', slice.map(card).join(''));
        shown += slice.length;
        if (tcnt) tcnt.textContent = hit.length + '명의 선생님';
        if (more) more.style.display = shown < hit.length ? '' : 'none';
        if (!hit.length) list.innerHTML = '<p class="muted">조건에 맞는 선생님이 없습니다. 조건을 넓혀 보시거나 ' + '전화로 문의해 주세요.</p>';
      };
      var bind = function(id, key, attrName){
        var box = document.getElementById(id); if (!box) return;
        box.addEventListener('click', function(e){
          var b = e.target.closest('.chip'); if (!b) return;
          f[key] = b.dataset[attrName];
          [].slice.call(box.children).forEach(function(c){ c.setAttribute('aria-pressed', String(c === b)); });
          render(true);
        });
      };
      bind('modeChips','mode','mode'); bind('subChips','sub','sub'); bind('gChips','g','g');
      var tq = document.getElementById('tq');
      if (tq) tq.addEventListener('input', function(){ f.q = tq.value; render(true); });
      if (more) more.addEventListener('click', function(){ render(false); });
      render(true);
    };
    if (window.TEACHERS) start(); else window.addEventListener('load', start);
  }

  /* 홈 미리보기 */
  var home = document.getElementById('homeTeachers');
  if (home && window.HOME_TEACHERS) {
    home.innerHTML = window.HOME_TEACHERS.map(function(t){
      var e = function(s){ return String(s||'').replace(/[<>&"]/g, function(c){ return {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c]; }); };
      return '<article class="t-card"><div class="t-top"><div class="av">' + e(t.n.slice(0,1)) + '</div>' +
        '<div><div class="t-name">' + e(t.n) + ' 선생님</div><div class="t-meta">' + e(t.g) + ' · ' + e(t.c) + '</div></div></div>' +
        '<p class="t-tag">' + e(t.tag) + '</p><div class="t-sub">' + (t.s||[]).map(function(s){ return '<b>' + e(s) + '</b>'; }).join('') + '</div></article>';
    }).join('');
  }
})();
