if(!self.define){let e,s={};const i=(i,n)=>(i=new URL(i+".js",n).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,r)=>{const o=e||("document"in self?document.currentScript.src:"")||location.href;if(s[o])return;let c={};const t=e=>i(e,o),l={module:{uri:o},exports:c,require:t};s[o]=Promise.all(n.map((e=>l[e]||t(e)))).then((e=>(r(...e),c)))}}define(["./workbox-ec63a76a"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/audio-source.68bef94d.js",revision:null},{url:"assets/index.c67be838.js",revision:null},{url:"assets/index.e3929f89.css",revision:null},{url:"assets/worker.0002d8a4.js",revision:null},{url:"index.html",revision:"3b9c100b8259996c584e77041567e7c3"},{url:"registerSW.js",revision:"42c3bff81e072b0259dea587ccdcbb65"},{url:"./assets/android-launchericon-192-192.png",revision:"56610edb0cbc41b0c274b6c203b1fb37"},{url:"./assets/android-launchericon-512-512.png",revision:"6c92e108574f0ec644225afcaf205749"},{url:"manifest.webmanifest",revision:"9999482dffacf00b89e97a28f9046365"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
