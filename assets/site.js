/* ============================================================
   陈敏妮 · 个人作品集 — 交互逻辑
   ============================================================ */
(function () {
  "use strict";

  var DATA = window.PORTFOLIO_DATA || { series: [], videos: [] };

  /* ---------- 工具 ---------- */
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (m) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m];
    });
  }

  /* ---------- 滚动显现 ---------- */
  var io = "IntersectionObserver" in window
    ? new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" })
    : null;

  function observeReveals(root) {
    $$(".reveal", root || document).forEach(function (el) {
      if (io) io.observe(el);
      else el.classList.add("visible");
    });
  }

  /* ---------- 图文作品网格 ---------- */
  var groups = [];
  DATA.series.forEach(function (s) {
    if (groups.indexOf(s.group) === -1) groups.push(s.group);
  });

  var filtersEl = $("#filters");
  var gridEl = $("#seriesGrid");

  function renderFilters() {
    if (!filtersEl) return;
    var html = '<button class="chip on" data-g="">全部 · ' + DATA.series.length + "</button>";
    groups.forEach(function (g) {
      var n = DATA.series.filter(function (s) { return s.group === g; }).length;
      html += '<button class="chip" data-g="' + esc(g) + '">' + esc(g) + " · " + n + "</button>";
    });
    filtersEl.innerHTML = html;
    $$(".chip", filtersEl).forEach(function (btn) {
      btn.addEventListener("click", function () {
        $$(".chip", filtersEl).forEach(function (b) { b.classList.remove("on"); });
        btn.classList.add("on");
        renderSeries(btn.getAttribute("data-g"));
      });
    });
  }

  function renderSeries(group) {
    if (!gridEl) return;
    var list = DATA.series.filter(function (s) { return !group || s.group === group; });
    gridEl.innerHTML = list.map(function (s, i) {
      return (
        '<figure class="scard reveal" data-name="' + esc(s.name) + '" style="transition-delay:' + (i % 8) * 70 + 'ms" tabindex="0" role="button" aria-label="查看 ' + esc(s.name) + '">' +
          '<div class="lqip">' +
            '<span class="ph" style="background-image:url(\'' + esc(s.thumb) + '\')"></span>' +
            '<img src="' + esc(s.cover) + '" alt="' + esc(s.name) + '" loading="lazy" onload="this.parentNode.classList.add(\'loaded\')">' +
          "</div>" +
          '<span class="peek">' + s.pages + " 页 →</span>" +
          "<figcaption><b>" + esc(s.name) + "</b><span>" + esc(s.group) + " · " + s.pages + " 页</span></figcaption>" +
        "</figure>"
      );
    }).join("");
    $$(".scard", gridEl).forEach(function (card) {
      function open() { openLightbox(card.getAttribute("data-name"), 0); }
      card.addEventListener("click", open);
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
      });
    });
    observeReveals(gridEl);
  }

  /* ---------- 视频网格 ---------- */
  var vgridEl = $("#videoGrid");

  function renderVideos() {
    if (!vgridEl) return;
    vgridEl.innerHTML = DATA.videos.map(function (v, i) {
      return (
        '<article class="vcard reveal" data-i="' + i + '" style="transition-delay:' + (i % 4) * 80 + 'ms" tabindex="0" role="button" aria-label="播放 ' + esc(v.title) + '">' +
          '<div class="vthumb">' +
            '<img src="' + esc(v.poster) + '" alt="' + esc(v.title) + '" loading="lazy">' +
            '<span class="vplay"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span>' +
            '<span class="vdur">' + esc(v.duration) + "</span>" +
          "</div>" +
          '<div class="vmeta">' +
            '<span class="vtag">' + esc(v.tag) + "</span>" +
            "<h3>" + esc(v.title) + "</h3>" +
            '<p class="vsub">' + esc(v.subtitle) + "</p>" +
            '<p class="vnote">' + esc(v.note) + "</p>" +
          "</div>" +
        "</article>"
      );
    }).join("");
    $$(".vcard", vgridEl).forEach(function (card) {
      function open() { openVideo(DATA.videos[parseInt(card.getAttribute("data-i"), 10)]); }
      card.addEventListener("click", open);
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
      });
    });
    observeReveals(vgridEl);
  }

  /* ---------- 口播视频网格（竖版） ---------- */
  var kbGrid = $("#kouboGrid");
  function renderKoubo() {
    if (!kbGrid || !DATA.koubo) return;
    kbGrid.innerHTML = DATA.koubo.map(function (v, i) {
      return '<article class="vcard v reveal" data-i="' + i + '" style="transition-delay:' + (i % 3) * 80 + 'ms" tabindex="0" role="button" aria-label="播放 ' + esc(v.title) + '">' +
        '<div class="vthumb">' +
          '<img src="' + esc(v.poster) + '" alt="' + esc(v.title) + '" loading="lazy">' +
          '<span class="vplay"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span>' +
          '<span class="vdur">' + esc(v.duration) + '</span>' +
        '</div>' +
        '<div class="vmeta">' +
          '<span class="vtag">' + esc(v.tag) + '</span>' +
          '<h3>' + esc(v.title) + '</h3>' +
          '<p class="vsub">' + esc(v.subtitle) + '</p>' +
          '<p class="vnote">' + esc(v.note) + '</p>' +
        '</div>' +
      '</article>';
    }).join("");
    $$(".vcard", kbGrid).forEach(function (card) {
      function open() { openVideo(DATA.koubo[parseInt(card.getAttribute("data-i"), 10)]); }
      card.addEventListener("click", open);
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
      });
    });
    observeReveals(kbGrid);
  }

  /* ---------- 图文灯箱 ---------- */
  var lb = $("#seriesLightbox");
  var lbImg = $("#lbImg");
  var lbName = $("#lbName");
  var lbCount = $("#lbCount");
  var lbThumbs = $("#lbThumbs");
  var curSeries = null, curPage = 0;

  function openLightbox(name, page) {
    curSeries = DATA.series.filter(function (s) { return s.name === name; })[0];
    if (!curSeries) return;
    curPage = Math.max(0, Math.min(page, curSeries.pages - 1));
    lbName.textContent = curSeries.name;
    lbThumbs.innerHTML = "";
    for (var i = 0; i < curSeries.pages; i++) {
      var t = document.createElement("img");
      t.src = curSeries.dir + "/" + (i + 1) + ".webp";
      t.alt = "第 " + (i + 1) + " 页";
      t.setAttribute("data-i", i);
      t.addEventListener("click", function () { showPage(parseInt(this.getAttribute("data-i"), 10)); });
      lbThumbs.appendChild(t);
    }
    lb.hidden = false;
    document.body.style.overflow = "hidden";
    showPage(curPage);
    var on = lbThumbs.children[curPage];
    if (on) { on.classList.add("on"); on.scrollIntoView({ block: "nearest", inline: "center" }); }
  }

  function showPage(i) {
    if (!curSeries) return;
    curPage = (i + curSeries.pages) % curSeries.pages;
    lbImg.classList.remove("show");
    var src = curSeries.dir + "/" + (curPage + 1) + ".webp";
    var img = new Image();
    img.onload = function () {
      lbImg.src = src;
      requestAnimationFrame(function () { lbImg.classList.add("show"); });
    };
    img.src = src;
    lbCount.textContent = (curPage + 1) + " / " + curSeries.pages + " · " + curSeries.group;
    $$("img", lbThumbs).forEach(function (t, idx) { t.classList.toggle("on", idx === curPage); });
    var on = lbThumbs.children[curPage];
    if (on) on.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }

  function closeLightbox() {
    lb.hidden = true;
    document.body.style.overflow = "";
    curSeries = null;
  }

  if (lb) {
    $("#lbClose").addEventListener("click", closeLightbox);
    $(".lb-backdrop", lb).addEventListener("click", closeLightbox);
    $(".lb-arrow.prev", lb).addEventListener("click", function () { showPage(curPage - 1); });
    $(".lb-arrow.next", lb).addEventListener("click", function () { showPage(curPage + 1); });

    /* 触摸滑动 */
    var touchX = null;
    lb.addEventListener("touchstart", function (e) { touchX = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener("touchend", function (e) {
      if (touchX === null) return;
      var dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 44) showPage(curPage + (dx < 0 ? 1 : -1));
      touchX = null;
    }, { passive: true });
  }

  /* ---------- 视频灯箱 ---------- */
  var vm = $("#videoModal");
  var vmPlayer = $(".vm-player", vm);
  var vmVideo = $("#vmVideo");
  var vmTitle = $("#vmTitle");
  var vmSub = $("#vmSub");
  var vmNote = $("#vmNote");

  function openVideo(v) {
    if (!v) return;
    vmTitle.textContent = v.title;
    vmSub.textContent = v.subtitle + " · " + v.duration;
    vmNote.textContent = v.note;
    vmPlayer.classList.toggle("tall", v.src.indexOf("video-kb") !== -1);
    vmVideo.src = v.src;
    vmVideo.poster = v.poster;
    vm.hidden = false;
    document.body.style.overflow = "hidden";
    var p = vmVideo.play();
    if (p && p.catch) p.catch(function () {});
  }

  function closeVideo() {
    vm.hidden = true;
    document.body.style.overflow = "";
    vmVideo.pause();
    vmVideo.removeAttribute("src");
    vmVideo.load();
  }

  if (vm) {
    $("#vmClose").addEventListener("click", closeVideo);
    $(".vm-backdrop", vm).addEventListener("click", closeVideo);
  }

  /* ---------- 键盘 ---------- */
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (vm && !vm.hidden) closeVideo();
      else if (lb && !lb.hidden) closeLightbox();
    }
    if (lb && !lb.hidden && curSeries) {
      if (e.key === "ArrowRight") showPage(curPage + 1);
      if (e.key === "ArrowLeft") showPage(curPage - 1);
    }
  });

  /* ---------- 导航 / 进度线 ---------- */
  var progress = $("#progress");
  var navLinks = $$(".nav-link");
  /* 仅单页锚点导航才做滚动高亮；多页站点保持 HTML 里写死的 active */
  var anchorLinks = navLinks.filter(function (a) { return (a.getAttribute("href") || "").charAt(0) === "#"; });
  var sections = anchorLinks.map(function (a) { return $(a.getAttribute("href")); });

  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    progress.style.transform = "scaleX(" + (max > 0 ? h.scrollTop / max : 0) + ")";
    if (!anchorLinks.length) return;
    var y = h.scrollTop + 140, idx = -1;
    sections.forEach(function (sec, i) { if (sec && sec.offsetTop <= y) idx = i; });
    anchorLinks.forEach(function (a, i) { a.classList.toggle("active", i === idx); });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Hero 鼠标视差 ---------- */
  var orbs = $$(".orb");
  var hero = $(".hero");
  if (hero && window.matchMedia("(pointer: fine)").matches) {
    hero.addEventListener("mousemove", function (e) {
      var r = hero.getBoundingClientRect();
      var mx = (e.clientX - r.left) / r.width - 0.5;
      var my = (e.clientY - r.top) / r.height - 0.5;
      orbs.forEach(function (o, i) {
        var f = (i + 1) * 9;
        o.style.translate = (mx * f) + "px " + (my * f) + "px";
      });
    });
  }

  /* ---------- 跑马灯 ---------- */
  var mq = $("#marqueeTrack");
  if (mq) {
    var words = ["内容运营", "短视频策划", "图文内容", "数据复盘", "数字人口播", "AIGC 辅助创作", "把复杂的事讲简单"];
    var one = words.map(function (w) {
      return '<span class="marquee-item">' + esc(w) + "</span>";
    }).join("");
    mq.innerHTML = one + one;
  }

  /* ---------- 作品九宫格 ---------- */
  var instaGrid = $("#instaGrid");
  var PICKS = [
    { t: "s", n: "入门指南" }, { t: "s", n: "期货vs现货" }, { t: "s", n: "保证金" },
    { t: "s", n: "均线" }, { t: "v", i: 2 }, { t: "s", n: "支撑压力" },
    { t: "s", n: "期权品种" }, { t: "s", n: "趋势交易" }, { t: "k", i: 2 },
    { t: "v", i: 0 }, { t: "s", n: "黄金牛市历史" }, { t: "s", n: "基本面" },
    { t: "k", i: 0 }, { t: "s", n: "套期保值" }, { t: "k", i: 7 }
  ];
  function renderInsta() {
    if (!instaGrid) return;
    instaGrid.innerHTML = PICKS.map(function (p, idx) {
      var img, like, label, attrs;
      if (p.t === "s") {
        var s = DATA.series.filter(function (x) { return x.name === p.n; })[0];
        if (!s) return "";
        img = s.cover; like = s.pages + " 页"; label = s.name;
        attrs = 'data-t="s" data-n="' + esc(s.name) + '"';
      } else if (p.t === "k") {
        var kv = DATA.koubo && DATA.koubo[p.i];
        if (!kv) return "";
        img = kv.poster; like = kv.duration; label = kv.title;
        attrs = 'data-t="k" data-i="' + p.i + '"';
      } else {
        var v = DATA.videos[p.i];
        if (!v) return "";
        img = v.poster; like = v.duration; label = v.title;
        attrs = 'data-t="v" data-i="' + p.i + '"';
      }
      return '<figure class="ig-cell reveal" ' + attrs + ' style="transition-delay:' + (idx % 6) * 60 + 'ms" tabindex="0" role="button" aria-label="' + esc(label) + '">' +
        '<img src="' + esc(img) + '" alt="' + esc(label) + '" loading="lazy">' +
        '<span class="ig-overlay"><span><img src="assets/deco/heart-white.svg" alt="">' + esc(like) + "</span></span>" +
        "</figure>";
    }).join("");
    $$(".ig-cell", instaGrid).forEach(function (cell) {
      function go() {
        var t = cell.getAttribute("data-t");
        if (t === "s") openLightbox(cell.getAttribute("data-n"), 0);
        else if (t === "k") openVideo(DATA.koubo[parseInt(cell.getAttribute("data-i"), 10)]);
        else openVideo(DATA.videos[parseInt(cell.getAttribute("data-i"), 10)]);
      }
      cell.addEventListener("click", go);
      cell.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); }
      });
    });
    observeReveals(instaGrid);
  }

  /* ---------- 启动 ---------- */
  renderFilters();
  renderSeries("");
  renderVideos();
  renderKoubo();
  renderInsta();
  observeReveals(document);

  /* 页脚年份 */
  var yr = $("#year");
  if (yr) yr.textContent = new Date().getFullYear();
})();
