/* 제우스의 점심 — 서비스워커 (오프라인 앱셸 캐시) */
const CACHE = "zeus-lunch-v7";
const SHELL = [
  "./",
  "./index.html",
  "./quiz/index.html",
  "./quiz/questions.js",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./apple-touch-icon-180.png",
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // 카카오 SDK 등 외부 출처는 캐시하지 않고 네트워크로 (실시간 데이터)
  if (url.origin !== location.origin) return;

  // HTML 문서: 네트워크 우선 → 실패 시 캐시 (업데이트 즉시 반영, 오프라인도 동작)
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then(res => { const cp = res.clone(); caches.open(CACHE).then(c => c.put(req, cp)); return res; })
        .catch(() => caches.match(req).then(r => r || caches.match("./index.html")))
    );
    return;
  }

  // 동일 출처 정적 자원(아이콘 등): 캐시 우선 → 없으면 네트워크
  e.respondWith(
    caches.match(req).then(r => r || fetch(req).then(res => {
      const cp = res.clone(); caches.open(CACHE).then(c => c.put(req, cp)); return res;
    }))
  );
});
