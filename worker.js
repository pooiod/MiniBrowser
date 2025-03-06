self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open("mini-browser-cache").then((cache) => {
      return cache.addAll(["/app/index.html", "/settings.html"]);
    })
  );
});

getMiniBrowserSetting = function(id) {
  const cookie = document.cookie.replace(/(?:(?:^|.*;\s*)MiniBrowserSettings\s*\=\s*([^;]*).*$)|^.*$/, "$1");
  let settings = [];

  try {
    settings = cookie ? JSON.parse(decodeURIComponent(cookie)) : [];
  } catch (e) {
    settings = [];
  }

  if (settings.length === 0) {
    return null;
  }

  const setting = settings.find(setting => setting.id === id);
  
  return setting ? setting.value : null;
}

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (!window.document) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
  }

  if (url.origin !== self.location.origin && !url.includes(getMiniBrowserSetting("server")) && !url.hostname.endsWith("gist.githubusercontent.com")) {
    const proxyUrl = getMiniBrowserSetting("server") + encodeURIComponent(event.request.url);
    event.respondWith(fetch(proxyUrl));
  } else {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
  }
});

self.addEventListener("push", (e) => {
  const data = e.data.json();
  let promises = [];

  if ("setAppBadge" in self.navigator) {
    const promise = self.navigator.setAppBadge(1);
    promises.push(promise);
  }

  promises.push(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
    })
  );

  event.waitUntil(Promise.all(promises));
});
