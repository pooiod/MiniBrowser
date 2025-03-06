self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open("mini-browser-cache").then((cache) => {
      return cache.addAll(["/app"]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin && !url.hostname.endsWith("allorigins.win") && !url.hostname.endsWith("gist.githubusercontent.com")) {
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(event.request.url)}`;
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
