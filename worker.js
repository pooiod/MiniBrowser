self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open("mini-browser-cache").then((cache) => {
      return cache.addAll(["/app/index.html", "/settings.html"]);
    })
  );
});

getMiniBrowserSetting = function(id) {
  if (typeof window == 'undefined' || !window.document) {
    return null;
  }

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

setupLinkForFetch = function(url) {
  var corsLinks = MiniBrowserPlugin.getBrowserSetting("CORSdomains") || [];
  var domain = new URL(url).hostname;

  for (var i = 0; i < corsLinks.length; i++) {
    var pattern = corsLinks[i].replace(/\./g, '\\.').replace(/\*/g, '.*');
    var regex = new RegExp("^" + pattern + "$");
    if (regex.test(domain)) {
      return url;
    }
  }

  console.log("Content setup for fetch:", url);
  url = MiniBrowserPlugin.getBrowserSetting("server").replace("[uri]", encodeURIComponent(url)).replace("[url]", url).replace("[b64]", btoa(url))
  return url;
};

setTimeout(function() {
  self.addEventListener("fetch", (event) => {
    const url = new URL(event.request.url);
    if (typeof window == 'undefined' || !window.document) {
      event.respondWith(
        fetch(event.request).catch(() => caches.match(event.request))
      );
    }
  
    if (url.origin !== self.location.origin && !url.includes(getMiniBrowserSetting("server")) && !url.hostname.endsWith("gist.githubusercontent.com")) {
      const proxyUrl = setupLinkForFetch(event.request.url);
      event.respondWith(fetch(proxyUrl));
    } else {
      event.respondWith(
        fetch(event.request).catch(() => caches.match(event.request))
      );
    }
  });
}, 500);

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
