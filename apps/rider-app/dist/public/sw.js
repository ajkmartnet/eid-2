/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-7e5eb42b'], (function (workbox) { 'use strict';

  self.skipWaiting();
  workbox.clientsClaim();
  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "registerSW.js",
    "revision": "90967e554478930269b741699ce0d184"
  }, {
    "url": "push-sw.js",
    "revision": "86282f42c1d5a9a7a6b5fcd374c51fd8"
  }, {
    "url": "opengraph.svg",
    "revision": "87e12c9a1790080bdfb86a6b5b96741e"
  }, {
    "url": "offline.html",
    "revision": "5ecb69973e68a85acd602ae47ee110ad"
  }, {
    "url": "index.html",
    "revision": "d5c3b42e387b33c47a41a55cb3cc5b2b"
  }, {
    "url": "icon-512.png",
    "revision": "2acff30f03ba48a8a2db472764c7221c"
  }, {
    "url": "icon-192.png",
    "revision": "c1f361c05eecffe2a2fa5ad2e53d981f"
  }, {
    "url": "favicon.svg",
    "revision": "b64fcae29024da8ddd2c62678d35ee7c"
  }, {
    "url": "ajkmart-logo.png",
    "revision": "c5319f266abd941d8e8599bf7aba144e"
  }, {
    "url": "fonts/plus-jakarta-sans-latin.woff2",
    "revision": "7660bd9909fb097989b19471a75f1b7a"
  }, {
    "url": "fonts/plus-jakarta-sans-latin-ext.woff2",
    "revision": "341687eeeb6afd29502e2277d9762c7e"
  }, {
    "url": "assets/zap-CZX1z3oU.js",
    "revision": null
  }, {
    "url": "assets/web-CpKr_w2O.js",
    "revision": null
  }, {
    "url": "assets/wallet-CivtdBaD.js",
    "revision": null
  }, {
    "url": "assets/vendor-socket-DnZMiwN9.js",
    "revision": null
  }, {
    "url": "assets/vendor-react-DPKwYc85.js",
    "revision": null
  }, {
    "url": "assets/vendor-query-BEwrEmM8.js",
    "revision": null
  }, {
    "url": "assets/vendor-leaflet-xVwftxLI.js",
    "revision": null
  }, {
    "url": "assets/validate-Dbnd0XXE.js",
    "revision": null
  }, {
    "url": "assets/utensils-crossed-DroxUoX5.js",
    "revision": null
  }, {
    "url": "assets/users-DjDXriil.js",
    "revision": null
  }, {
    "url": "assets/user-x-B8beBV5Y.js",
    "revision": null
  }, {
    "url": "assets/useFeatureGate-D0VZk_hL.js",
    "revision": null
  }, {
    "url": "assets/useAtomicLock-D0PaINPU.js",
    "revision": null
  }, {
    "url": "assets/ur-N8aTG-GZ.js",
    "revision": null
  }, {
    "url": "assets/trash-2-CJpnzNtG.js",
    "revision": null
  }, {
    "url": "assets/timer-CoxYyYKQ.js",
    "revision": null
  }, {
    "url": "assets/target-LsQOgru2.js",
    "revision": null
  }, {
    "url": "assets/sun-DFhwEtoL.js",
    "revision": null
  }, {
    "url": "assets/star-BcIfDpm5.js",
    "revision": null
  }, {
    "url": "assets/sparkles-FgACg4ld.js",
    "revision": null
  }, {
    "url": "assets/smartphone-Bc8If2Vv.js",
    "revision": null
  }, {
    "url": "assets/shopping-cart-CGp9mw-Y.js",
    "revision": null
  }, {
    "url": "assets/shield-check-Bkcz3azW.js",
    "revision": null
  }, {
    "url": "assets/shield-CYn_7ikK.js",
    "revision": null
  }, {
    "url": "assets/settings-ZrLZVOZP.js",
    "revision": null
  }, {
    "url": "assets/roman-C1Hiqt3w.js",
    "revision": null
  }, {
    "url": "assets/rideUtils-C6aURHEk.js",
    "revision": null
  }, {
    "url": "assets/pill-DpaL5ExV.js",
    "revision": null
  }, {
    "url": "assets/pencil-DfaaVlqG.js",
    "revision": null
  }, {
    "url": "assets/package-DcIQeHnz.js",
    "revision": null
  }, {
    "url": "assets/not-found-DYa4EoHC.js",
    "revision": null
  }, {
    "url": "assets/navigation-QyJI9wEt.js",
    "revision": null
  }, {
    "url": "assets/message-square-_RHCS045.js",
    "revision": null
  }, {
    "url": "assets/mail-CgvuUEcy.js",
    "revision": null
  }, {
    "url": "assets/log-out-CGuON-NK.js",
    "revision": null
  }, {
    "url": "assets/loader-circle-CRtP10vk.js",
    "revision": null
  }, {
    "url": "assets/leafletIconFix-DK_VcLxF.js",
    "revision": null
  }, {
    "url": "assets/leaflet-CIGW-MKW.css",
    "revision": null
  }, {
    "url": "assets/info-Bpeim95f.js",
    "revision": null
  }, {
    "url": "assets/index-xx4ZXHRy.js",
    "revision": null
  }, {
    "url": "assets/index-tPox1gKJ.js",
    "revision": null
  }, {
    "url": "assets/index-DgXWzRf1.js",
    "revision": null
  }, {
    "url": "assets/index-D8X2CAAj.js",
    "revision": null
  }, {
    "url": "assets/index-Bn-j-Wc4.css",
    "revision": null
  }, {
    "url": "assets/globe-DbkFqggs.js",
    "revision": null
  }, {
    "url": "assets/eye-DO3ifMe8.js",
    "revision": null
  }, {
    "url": "assets/credit-card-BzxNNCUI.js",
    "revision": null
  }, {
    "url": "assets/clock-D4QGSJiL.js",
    "revision": null
  }, {
    "url": "assets/clipboard-list-DtA3gybX.js",
    "revision": null
  }, {
    "url": "assets/circle-check-eCQacJ5f.js",
    "revision": null
  }, {
    "url": "assets/circle-alert-Dy8TBd_k.js",
    "revision": null
  }, {
    "url": "assets/chevron-up-BrD3xhQu.js",
    "revision": null
  }, {
    "url": "assets/chevron-right-liVjMJIc.js",
    "revision": null
  }, {
    "url": "assets/chevron-left-CEpRvq6s.js",
    "revision": null
  }, {
    "url": "assets/chevron-down-kZ7p3s_9.js",
    "revision": null
  }, {
    "url": "assets/check-check-Dh0ZVqcA.js",
    "revision": null
  }, {
    "url": "assets/check-CbOi1TLU.js",
    "revision": null
  }, {
    "url": "assets/chart-no-axes-column-DgFc9Lmk.js",
    "revision": null
  }, {
    "url": "assets/chart-column-zW7EPQAV.js",
    "revision": null
  }, {
    "url": "assets/car-DY_WEs-l.js",
    "revision": null
  }, {
    "url": "assets/capacitor-native-CRt26s-D.js",
    "revision": null
  }, {
    "url": "assets/capacitor-browser-Da-m3BWE.js",
    "revision": null
  }, {
    "url": "assets/camera-BGEPPKNW.js",
    "revision": null
  }, {
    "url": "assets/bike-zBoacEXJ.js",
    "revision": null
  }, {
    "url": "assets/arrow-left-Cydom8js.js",
    "revision": null
  }, {
    "url": "assets/accordion-Cv3pUEo6.js",
    "revision": null
  }, {
    "url": "assets/Wallet-CaZ1wb4f.js",
    "revision": null
  }, {
    "url": "assets/VanDriver-DR-sGiul.js",
    "revision": null
  }, {
    "url": "assets/TacticalCard-B2N89f5g.js",
    "revision": null
  }, {
    "url": "assets/SplashScreen-BiBHY09S.js",
    "revision": null
  }, {
    "url": "assets/Settings-CQ7jwogq.js",
    "revision": null
  }, {
    "url": "assets/SecuritySettings-DXxipdHY.js",
    "revision": null
  }, {
    "url": "assets/Reviews-CEVQMFy3.js",
    "revision": null
  }, {
    "url": "assets/Register-Dfuk6eQe.js",
    "revision": null
  }, {
    "url": "assets/PullToRefresh-DAd4r7-2.js",
    "revision": null
  }, {
    "url": "assets/Profile-Cjejr45_.js",
    "revision": null
  }, {
    "url": "assets/PhoneInput-BhVRFuBe.js",
    "revision": null
  }, {
    "url": "assets/PenaltyHistory-BjlCl0fA.js",
    "revision": null
  }, {
    "url": "assets/PasswordInput-yvAGeGBD.js",
    "revision": null
  }, {
    "url": "assets/Onboarding-4Gl918sU.js",
    "revision": null
  }, {
    "url": "assets/Notifications-dtUmz6I9.js",
    "revision": null
  }, {
    "url": "assets/MiniMapImpl-DqFaL7y0.js",
    "revision": null
  }, {
    "url": "assets/MetricBadge-DWQJ6Yqp.js",
    "revision": null
  }, {
    "url": "assets/LoginHistory-DR856q98.js",
    "revision": null
  }, {
    "url": "assets/Login-lO8nzJK0.js",
    "revision": null
  }, {
    "url": "assets/JoinSelect-CIROvQLM.js",
    "revision": null
  }, {
    "url": "assets/HomeHeader-CZHUioDK.js",
    "revision": null
  }, {
    "url": "assets/Home-CkqXckeo.js",
    "revision": null
  }, {
    "url": "assets/History-C6qib076.js",
    "revision": null
  }, {
    "url": "assets/Help-eI0II4Ze.js",
    "revision": null
  }, {
    "url": "assets/GuestLanding-IKnvInHz.js",
    "revision": null
  }, {
    "url": "assets/GuestDashboard-C7H4tYBx.js",
    "revision": null
  }, {
    "url": "assets/ForgotUsername-W4JpyMLD.js",
    "revision": null
  }, {
    "url": "assets/ForgotPassword-DsisChxK.js",
    "revision": null
  }, {
    "url": "assets/ErrorState-cQ5jVmMZ.js",
    "revision": null
  }, {
    "url": "assets/EarningsSummary-kjOKBKK5.js",
    "revision": null
  }, {
    "url": "assets/EarningsBarChart-CXqP61CM.js",
    "revision": null
  }, {
    "url": "assets/Earnings-xguWmq81.js",
    "revision": null
  }, {
    "url": "assets/ConfigFeatureGate-D-MgJYyX.js",
    "revision": null
  }, {
    "url": "assets/Chat-EQrTpxx6.js",
    "revision": null
  }, {
    "url": "assets/ActiveHelpersLeaflet-BaxRMhUd.js",
    "revision": null
  }, {
    "url": "assets/Active-aTb4dOnY.js",
    "revision": null
  }, {
    "url": "manifest.webmanifest",
    "revision": "916cb1b03a2a58d2746c2e99677547a9"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("/rider/index.html"), {
    denylist: [/^\/api\//]
  }));

}));
