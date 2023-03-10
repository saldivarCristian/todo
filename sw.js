/*
=======================================
Public Key:
BLHxWiNVmr7ROB8O3KpPRJFAMhMypwe4X9TdWMmhsPSzHszo32PDkndpvWx3H0OY2HwFCQRU98JBpZ_AEsVxWG4
Private Key:
VXcSZD3mdKyXEmDZNrB02WTxgUZmdIpAEo5tnXR4OH4
=======================================
*/

const channel = new BroadcastChannel("notification");

const urlB64ToUint8Array = (base64String) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

// saveSubscription saves the subscription to the backend
const saveSubscription = async (subscription) => {
  const SERVER_URL = "http://localhost:3000/save-subscription";
  const response = await fetch(SERVER_URL, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(subscription),
  });
  return response.json();
};

self.addEventListener("activate", async () => {
  // This will be called only once when the service worker is activated.
  console.log("Hello from service worker.");

  try {
    const applicationServerKey = urlB64ToUint8Array(
      "BLHxWiNVmr7ROB8O3KpPRJFAMhMypwe4X9TdWMmhsPSzHszo32PDkndpvWx3H0OY2HwFCQRU98JBpZ_AEsVxWG4"
    );

    const options = { applicationServerKey, userVisibleOnly: true };

    const subscription = await self.registration.pushManager.subscribe(options);
    console.log("subs: ", JSON.stringify(subscription));

    //   const response = await saveSubscription(subscription);
    //   console.log(response);

    /* LOG OUTPUT: Google
          subs:  {"endpoint":"https://fcm.googleapis.com/fcm/send/c3DsU5n5NOA:APA91bGsQ_RdhGdQX7T2kipw-vILovDZxJlOD4SjlFAWVg2WAf2gTwqbJAnOgJhofW_W7aDFvUaJzrxYOdZUd1XnJZ6d3LO79_4ILUaiNEYmkb0gaCY-NkvU_x2-6_1xIp4bVf-Fg6Ll",
          "expirationTime":null,
          "keys":{"p256dh":"BOkas3eN-2DPbeY8RvR2g7NVOEcsmt5cOYTOSR-rihQKpPJWdODW4TFwk65vegkPDHue1iYbAe8W9mCzHWD67a4","auth":"jFL-bwVPRA_SnMoRIq-V7A"}}
      */

    /* LOG OUTPUT: Firefox
          subs:  {"endpoint":"https://updates.push.services.mozilla.com/wpush/v2/gAAAAABdBgQO2MKPusxFsBeY5DU7XG-dJ1udXvfWoyK7PIcSkeP2p_vBwRBk8RQbWi2xl7h8rkqryqxnUOon_GoOKCfJmC78nptCE60iqryTfpH_5USoLp1GND-ySxE_eBEfOsXaSe6yReOLrQszBo2VHjv6NezaqmwDhLCbnzz7gn_ikQ_UqhA",
          "keys":{"auth":"D3VDFb4jT4Bqn-iH8VzxJw","p256dh":"BE3P_2G0x2aJTmyuUysOrov1_PDJyZ603hraYOZEonCBAdGU5Wi1POHc6_Geseooawzig2zjGNfl6zkIamYEmxs"}} 
      */
  } catch (err) {
    console.log("Error", err);
  }
});

self.addEventListener("push", function (event) {
  if (event.data) {
    console.log("Push event!! ", event.data.text());
  } else {
    console.log("Push event but no data");
  }
});

self.addEventListener("push", function (event) {
  if (event.data) {
    console.log("Push event!! ", event.data.text());
    showLocalNotification("Hurray !", event.data.text(), self.registration);
  } else {
    console.log("Push event but no data");
  }
});


const addResourcesToCache = async (resources) => {
  const cache = await caches.open("v1");
  await cache.addAll(resources);
};

self.addEventListener("install", (event) => {
  event.waitUntil(
    addResourcesToCache([
      "/colegioLaAurora/",
      "/colegioLaAurora/index.html",
      "/colegioLaAurora/main.js",
    ])
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(/* custom content goes here */);
});


const showLocalNotification = (title, body, swRegistration) => {
  const options = {
    body,
    icon: "./image/icon.png",
    vibrate: [200, 100, 200, 100, 200, 100, 200],
    tag: "vibration-sample",

    // here you can add more properties like icon, image, vibrate, etc.
  };
  swRegistration.showNotification(title, options);
};

setInterval(() => {
  channel.postMessage({ status: "pending" });

  console.log("prueba");  
}, 10000);

channel.onmessage = (event) => {
  const value = event.data;
  const message = event.data.message;
  console.log(event)
  if (value.status == "true") {
    showLocalNotification(
      "Agenta Inteligente !",
      message,
      self.registration
    );
  }
};