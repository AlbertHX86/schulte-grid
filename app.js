(function () {
  'use strict';

  var TEXT = {
    en: {
      title: 'Schulte Grid',
      next: 'Next',
      time: 'Time',
      best: 'Best',
      hint: 'Tap 1 to start. Find the numbers in order.',
      win: 'Done in {t} s',
      newBest: 'New best: {t} s',
      reset: 'Reset',
      records: 'Records',
      clear: 'Clear',
      empty: 'No records for this size yet.',
      local: 'Records are saved only in this browser.',
      confirmClear: 'Clear all records for {n}×{n}?',
      light: 'Light',
      dark: 'Dark',
      copyright: '© 2026 Albert Huang. Released under the MIT License.',
      lit: 'Research: Schulte grids and the prefrontal cortex',
      refs: 'References',
      other: 'Sudoku'
    },
    zh: {
      title: '舒尔特方格',
      next: '下一个',
      time: '用时',
      best: '最佳',
      hint: '点击 1 开始，按顺序找到所有数字。',
      win: '完成，用时 {t} 秒',
      newBest: '新纪录：{t} 秒',
      reset: '重置',
      records: '记录',
      clear: '清空',
      empty: '这个尺寸还没有记录。',
      local: '记录只保存在当前浏览器中。',
      confirmClear: '清空 {n}×{n} 的所有记录？',
      light: '亮色',
      dark: '暗色',
      copyright: '© 2026 Albert Huang. 以 MIT 许可证开源。',
      lit: '文献：舒尔特方格与前额叶',
      refs: '参考文献',
      other: '数独'
    }
  };

  var KEEP = 10; // records shown per size

  var $ = function (id) { return document.getElementById(id); };
  var gridEl = $('grid');
  var nextEl = $('next');
  var timeEl = $('time');
  var bestEl = $('best');
  var hintEl = $('hint');
  var historyEl = $('history');
  var emptyEl = $('empty');

  var store = {
    get: function (k, d) {
      try {
        var v = localStorage.getItem('schulte.' + k);
        return v === null ? d : JSON.parse(v);
      } catch (e) { return d; }
    },
    set: function (k, v) {
      try { localStorage.setItem('schulte.' + k, JSON.stringify(v)); } catch (e) {}
    }
  };

  var lang = store.get('lang', (navigator.language || '').toLowerCase().indexOf('zh') === 0 ? 'zh' : 'en');
  var size = store.get('size', 5);
  if ([3, 4, 5, 6, 7].indexOf(size) < 0) size = 5;

  var next, total, startAt, timer, finished, winKey;

  function t(key, vars) {
    var s = TEXT[lang][key];
    for (var k in vars) s = s.split('{' + k + '}').join(vars[k]);
    return s;
  }

  function fmt(ms) { return (ms / 1000).toFixed(2); }

  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var x = a[i]; a[i] = a[j]; a[j] = x;
    }
    return a;
  }

  function records() { return store.get('records.' + size, []); }

  function stopTimer() {
    if (timer) cancelAnimationFrame(timer);
    timer = null;
  }

  function tick() {
    timeEl.textContent = fmt(performance.now() - startAt);
    timer = requestAnimationFrame(tick);
  }

  function newGame() {
    stopTimer();
    next = 1;
    total = size * size;
    startAt = null;
    finished = false;

    var nums = [];
    for (var i = 1; i <= total; i++) nums.push(i);
    shuffle(nums);

    gridEl.className = 'grid';
    gridEl.style.gridTemplateColumns = 'repeat(' + size + ', 1fr)';
    gridEl.innerHTML = '';
    var fontSize = Math.max(16, Math.round(120 / size) + 6) + 'px';
    nums.forEach(function (n) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'cell';
      b.textContent = n;
      b.dataset.n = n;
      b.style.fontSize = fontSize;
      gridEl.appendChild(b);
    });

    nextEl.textContent = '1';
    timeEl.textContent = fmt(0);
    hintEl.className = 'hint';
    hintEl.textContent = t('hint');
    renderRecords();
  }

  function finish() {
    stopTimer();
    finished = true;
    var ms = performance.now() - startAt;
    timeEl.textContent = fmt(ms);
    nextEl.textContent = '✓';
    gridEl.classList.add('finished');

    var list = records();
    var prevBest = list.length ? Math.min.apply(null, list.map(function (r) { return r.ms; })) : Infinity;
    list.push({ ms: Math.round(ms), at: Date.now() });
    store.set('records.' + size, list);

    hintEl.className = 'hint win';
    winKey = ms < prevBest ? 'newBest' : 'win';
    hintEl.textContent = t(winKey, { t: fmt(ms) });
    renderRecords();
  }

  gridEl.addEventListener('click', function (e) {
    var cell = e.target.closest('.cell');
    if (!cell || finished) return;
    var n = +cell.dataset.n;

    if (n !== next) {
      if (startAt === null || cell.classList.contains('done')) return;
      cell.classList.add('wrong');
      setTimeout(function () { cell.classList.remove('wrong'); }, 180);
      return;
    }

    if (next === 1) {
      startAt = performance.now();
      tick();
    }
    cell.classList.add('done');
    if (next === total) return finish();
    next++;
    nextEl.textContent = next;
  });

  function renderRecords() {
    var list = records();
    var best = list.length ? Math.min.apply(null, list.map(function (r) { return r.ms; })) : null;
    bestEl.textContent = best === null ? '—' : fmt(best);

    var shown = list.slice(-KEEP).reverse();
    var locale = lang === 'zh' ? 'zh-CN' : 'en-US';
    historyEl.innerHTML = '';
    shown.forEach(function (r) {
      var li = document.createElement('li');
      if (r.ms === best) li.className = 'top';
      var when = document.createElement('span');
      when.className = 'when';
      when.textContent = new Date(r.at).toLocaleString(locale, {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });
      var time = document.createElement('span');
      time.className = 't';
      time.textContent = fmt(r.ms) + (lang === 'zh' ? ' 秒' : ' s');
      li.appendChild(when);
      li.appendChild(time);
      historyEl.appendChild(li);
    });
    emptyEl.hidden = list.length > 0;
  }

  function currentTheme() {
    var set = document.documentElement.dataset.theme;
    if (set) return set;
    return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function renderText() {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      el.textContent = t(el.dataset.i18n);
    });
    // The menu always reads "语言 / Language"; the current choice gets a check mark.
    var sel = $('lang');
    Array.prototype.forEach.call(sel.options, function (o) {
      if (o.value) o.textContent = (o.value === lang ? '✓ ' : '\u2003') + (o.value === 'zh' ? '中文' : 'English');
    });
    sel.selectedIndex = 0;
    // The button names the theme you switch to.
    $('theme').textContent = currentTheme() === 'dark' ? t('light') : t('dark');
    if (finished) hintEl.textContent = t(winKey, { t: timeEl.textContent });
  }

  function renderSizes() {
    document.querySelectorAll('.sizes button').forEach(function (b) {
      b.setAttribute('role', 'radio');
      b.setAttribute('aria-checked', String(+b.dataset.size === size));
    });
  }

  document.querySelector('.sizes').addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b) return;
    size = +b.dataset.size;
    store.set('size', size);
    renderSizes();
    newGame();
  });

  $('reset').addEventListener('click', newGame);

  $('clear').addEventListener('click', function () {
    if (!records().length) return;
    if (!confirm(t('confirmClear', { n: size }))) return;
    store.set('records.' + size, []);
    renderRecords();
  });

  $('lang').addEventListener('change', function (e) {
    lang = e.target.value === 'zh' ? 'zh' : 'en';
    store.set('lang', lang);
    renderText();
    renderRecords();
  });

  $('theme').addEventListener('click', function () {
    var to = currentTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = to;
    try { localStorage.setItem('schulte.theme', to); } catch (e) {}
    renderText();
  });

  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', renderText);

  renderSizes();
  newGame();
  renderText();
})();
