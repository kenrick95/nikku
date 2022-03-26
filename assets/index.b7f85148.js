var at=(t,e,s)=>{if(!e.has(t))throw TypeError("Cannot "+s)};var o=(t,e,s)=>(at(t,e,"read from private field"),s?s.call(t):e.get(t)),y=(t,e,s)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,s)},l=(t,e,s,i)=>(at(t,e,"write to private field"),i?i.call(t,s):e.set(t,s),s);import{r as ae,t as W,s as re,$ as q,o as ie,n as oe,e as x,a as we,b as he,c as de}from"./vendor.62c2304e.js";const At=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const r of a)if(r.type==="childList")for(const n of r.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&i(n)}).observe(document,{childList:!0,subtree:!0});function s(a){const r={};return a.integrity&&(r.integrity=a.integrity),a.referrerpolicy&&(r.referrerPolicy=a.referrerpolicy),a.crossorigin==="use-credentials"?r.credentials="include":a.crossorigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(a){if(a.ep)return;a.ep=!0;const r=s(a);fetch(a.href,r)}};At();var xt="data:application/javascript;base64,Ly8gQHRzLWNoZWNrDQovLyBDYW5ub3QgYmUgaW4gVHlwZVNjcmlwdCB5ZXQNCi8vIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL3ZpdGVqcy92aXRlL2Rpc2N1c3Npb25zLzM4MDQNCi8qKiBAdHlwZWRlZiB7aW1wb3J0KCdicnN0bScpLlRyYWNrRGVzY3JpcHRpb259IFRyYWNrRGVzY3JpcHRpb24gKi8NCi8qKiBAdHlwZWRlZiB7aW1wb3J0KCcuL2F1ZGlvUGxheWVyJykuQXVkaW9QbGF5ZXJUcmFja1N0YXRlc30gQXVkaW9QbGF5ZXJUcmFja1N0YXRlcyAqLw0KDQpjbGFzcyBBdWRpb01peGVyUHJvY2Vzc29yIGV4dGVuZHMgQXVkaW9Xb3JrbGV0UHJvY2Vzc29yIHsNCiAgLyoqDQogICAqDQogICAqIEBwYXJhbSB7QXVkaW9Xb3JrbGV0Tm9kZU9wdGlvbnM9fSBvcHRpb25zDQogICAqLw0KICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7DQogICAgc3VwZXIoKTsNCiAgICB0aGlzLnRyYWNrU3RhdGVzID0gb3B0aW9ucz8ucHJvY2Vzc29yT3B0aW9ucz8udHJhY2tTdGF0ZXMgfHwge307DQogICAgdGhpcy50cmFja0Rlc2NyaXB0aW9ucyA9IG9wdGlvbnM/LnByb2Nlc3Nvck9wdGlvbnM/LnRyYWNrRGVzY3JpcHRpb25zIHx8IFtdOw0KICAgIHRoaXMucG9ydC5vbm1lc3NhZ2UgPSAoZXZlbnQpID0+IHsNCiAgICAgIGlmIChldmVudC5kYXRhLnRyYWNrU3RhdGVzKSB0aGlzLnRyYWNrU3RhdGVzID0gZXZlbnQuZGF0YS50cmFja1N0YXRlczsNCiAgICAgIGlmIChldmVudC5kYXRhLnRyYWNrRGVzY3JpcHRpb25zKQ0KICAgICAgICB0aGlzLnRyYWNrRGVzY3JpcHRpb25zID0gZXZlbnQuZGF0YS50cmFja0Rlc2NyaXB0aW9uczsNCiAgICB9Ow0KICB9DQoNCiAgLyoqDQogICAqDQogICAqIEBwYXJhbSB7QXJyYXk8QXJyYXk8RmxvYXQzMkFycmF5Pj59IGlucHV0cw0KICAgKiBAcGFyYW0ge0FycmF5PEFycmF5PEZsb2F0MzJBcnJheT4+fSBvdXRwdXRzDQogICAqIEBwYXJhbSB7T2JqZWN0fSBfcGFyYW1ldGVycw0KICAgKi8NCiAgcHJvY2VzcyhpbnB1dHMsIG91dHB1dHMsIF9wYXJhbWV0ZXJzKSB7DQogICAgY29uc3QgaW5wdXQgPSBpbnB1dHNbMF07DQogICAgY29uc3Qgb3V0cHV0ID0gb3V0cHV0c1swXTsNCiAgICBpZiAoIWlucHV0KSB7DQogICAgICByZXR1cm4gZmFsc2U7DQogICAgfQ0KICAgIGNvbnN0IGNoYW5uZWxDb3VudCA9IGlucHV0Lmxlbmd0aDsNCiAgICBpZiAoIWNoYW5uZWxDb3VudCkgew0KICAgICAgcmV0dXJuIGZhbHNlOw0KICAgIH0NCiAgICBjb25zdCBzYW1wbGVDb3VudCA9IGlucHV0WzBdLmxlbmd0aDsNCiAgICBpZiAoIXNhbXBsZUNvdW50KSB7DQogICAgICByZXR1cm4gZmFsc2U7DQogICAgfQ0KDQogICAgZm9yIChsZXQgc2FtcGxlSW5kZXggPSAwOyBzYW1wbGVJbmRleCA8IHNhbXBsZUNvdW50OyBzYW1wbGVJbmRleCsrKSB7DQogICAgICBsZXQgc3VtcyA9IFswLCAwXTsNCg0KICAgICAgZm9yICgNCiAgICAgICAgbGV0IHRyYWNrSW5kZXggPSAwLCBjaGFubmVsSW5kZXggPSAwOw0KICAgICAgICB0cmFja0luZGV4IDwgdGhpcy50cmFja1N0YXRlcy5sZW5ndGg7DQogICAgICAgIHRyYWNrSW5kZXgrKw0KICAgICAgKSB7DQogICAgICAgIGNvbnN0IHRyYWNrQ2hhbm5lbENvdW50ID0NCiAgICAgICAgICB0aGlzLnRyYWNrRGVzY3JpcHRpb25zW3RyYWNrSW5kZXhdLm51bWJlckNoYW5uZWxzOw0KICAgICAgICBpZiAodGhpcy50cmFja1N0YXRlc1t0cmFja0luZGV4XSkgew0KICAgICAgICAgIGNvbnN0IGZpbmFsT2RkVHJhY2tDaGFubmVsQ291bnRJbmRleCA9DQogICAgICAgICAgICB0cmFja0NoYW5uZWxDb3VudCAtICh0cmFja0NoYW5uZWxDb3VudCAlIDIpOw0KDQogICAgICAgICAgLy8gRGlzdHJpYnV0ZSBsZWZ0LXJpZ2h0IGZvciBmaXJzdCAoTiAtIChOICUgMikpDQogICAgICAgICAgZm9yIChsZXQgdGMgPSAwOyB0YyA8IGZpbmFsT2RkVHJhY2tDaGFubmVsQ291bnRJbmRleDsgdGMrKykgew0KICAgICAgICAgICAgc3Vtc1t0YyAlIDJdICs9IGlucHV0W2NoYW5uZWxJbmRleCArIHRjXVtzYW1wbGVJbmRleF07DQogICAgICAgICAgfQ0KDQogICAgICAgICAgLy8gUHV0IHRoZSBmaW5hbCBvZGQgdHJhY2sgaW50byBib3RoIGxlZnQgYW5kIHJpZ2h0IG91dHB1dA0KICAgICAgICAgIGlmICh0cmFja0NoYW5uZWxDb3VudCAlIDIgPT09IDEpIHsNCiAgICAgICAgICAgIHN1bXNbMF0gKz0NCiAgICAgICAgICAgICAgaW5wdXRbY2hhbm5lbEluZGV4ICsgZmluYWxPZGRUcmFja0NoYW5uZWxDb3VudEluZGV4XVtzYW1wbGVJbmRleF07DQogICAgICAgICAgICBzdW1zWzFdICs9DQogICAgICAgICAgICAgIGlucHV0W2NoYW5uZWxJbmRleCArIGZpbmFsT2RkVHJhY2tDaGFubmVsQ291bnRJbmRleF1bc2FtcGxlSW5kZXhdOw0KICAgICAgICAgIH0NCiAgICAgICAgfQ0KICAgICAgICBjaGFubmVsSW5kZXggKz0gdHJhY2tDaGFubmVsQ291bnQ7DQogICAgICB9DQoNCiAgICAgIG91dHB1dFswXVtzYW1wbGVJbmRleF0gPSBjbGFtcChzdW1zWzBdLCAtMSwgMSk7DQogICAgICBvdXRwdXRbMV1bc2FtcGxlSW5kZXhdID0gY2xhbXAoc3Vtc1sxXSwgLTEsIDEpOw0KICAgIH0NCg0KICAgIHJldHVybiB0cnVlOw0KICB9DQp9DQoNCi8qKg0KICoNCiAqIEBwYXJhbSB7bnVtYmVyfSB2YWx1ZQ0KICogQHBhcmFtIHtudW1iZXJ9IG1pbg0KICogQHBhcmFtIHtudW1iZXJ9IG1heA0KICogQHJldHVybnMge251bWJlcn0NCiAqLw0KZnVuY3Rpb24gY2xhbXAodmFsdWUsIG1pbiwgbWF4KSB7DQogIHJldHVybiB2YWx1ZSA8PSBtaW4gPyBtaW4gOiB2YWx1ZSA+PSBtYXggPyBtYXggOiB2YWx1ZTsNCn0NCg0KcmVnaXN0ZXJQcm9jZXNzb3IoJ2F1ZGlvLW1peGVyLXByb2Nlc3NvcicsIEF1ZGlvTWl4ZXJQcm9jZXNzb3IpOw0K",T,v,G,H,b,V,E,Z,Q,B,se,z,J,K,_,j;class Bt{constructor(e,s){y(this,T,void 0);y(this,v,void 0);y(this,G,void 0);y(this,H,void 0);y(this,b,void 0);y(this,V,void 0);y(this,E,void 0);y(this,Z,void 0);y(this,Q,void 0);y(this,B,void 0);y(this,se,void 0);y(this,z,void 0);y(this,J,void 0);y(this,K,void 0);y(this,_,void 0);y(this,j,void 0);this.metadata=null,l(this,T,null),l(this,v,null),l(this,G,[]),l(this,H,null),l(this,b,null),l(this,V,null),l(this,E,null),l(this,Z,null),l(this,Q,null),l(this,B,0),l(this,se,0),l(this,z,!1),l(this,J,!0),l(this,K,!1),l(this,_,!1),l(this,j,0),this.hooks=s,l(this,T,null),this.readyPromise=new Promise(i=>{l(this,T,i)}),this.init(e)}async init(e){e?(this.metadata=e,l(this,v,new AudioContext({sampleRate:e.sampleRate})),o(this,v).audioWorklet&&await o(this,v).audioWorklet.addModule(xt),o(this,T)&&o(this,T).call(this)):(this.metadata=null,l(this,v,null),this.readyPromise=new Promise(s=>{l(this,T,s)})),l(this,G,[!0]),l(this,H,null),l(this,b,null),l(this,E,null),l(this,Z,null),l(this,Q,null),l(this,B,0),l(this,se,0),l(this,z,!0),l(this,J,!0),l(this,K,!1),l(this,_,!1),l(this,j,1),l(this,V,null)}async destroy(){await this.pause(),this.init()}convertToAudioBufferData(e){const s=new Float32Array(e.length);for(let i=0;i<e.length;i++){const a=e[i];s[i]=a<0?a/32768:a/32767}return s}load(e){if(!this.metadata||!o(this,v))return;const s=e.map(r=>this.convertToAudioBufferData(r)),{numberChannels:i,numberTracks:a}=this.metadata;l(this,H,o(this,v).createBuffer(i,s[0].length,o(this,v).sampleRate));for(let r=0;r<i;r++)o(this,H).getChannelData(r).set(s[r]);l(this,G,[]);for(let r=0;r<a;r++)r===0?o(this,G).push(!0):o(this,G).push(!1);this.initPlayback(),l(this,_,!0),this.hooks.onPlay()}initPlayback(e=0){if(!this.metadata||!o(this,v)||!o(this,H)||o(this,j)==null)return;const{loopStartSample:s,totalSamples:i,sampleRate:a,numberTracks:r,trackDescriptions:n}=this.metadata;if(o(this,b)&&(o(this,b).stop(0),l(this,b,null)),l(this,b,o(this,v).createBufferSource()),o(this,b).buffer=o(this,H),l(this,V,o(this,v).createGain()),o(this,V).gain.value=o(this,j),r===1)o(this,b).connect(o(this,V)),o(this,V).connect(o(this,v).destination);else{if(!o(this,v).audioWorklet)throw new Error("Sorry, playback of multi-track BRSTM is not supported in this browser");const g=new AudioWorkletNode(o(this,v),"audio-mixer-processor",{numberOfInputs:1,numberOfOutputs:1,outputChannelCount:[2],processorOptions:{trackStates:o(this,G),trackDescriptions:n}});o(this,b).connect(g),g.connect(o(this,V)),o(this,V).connect(o(this,v).destination)}l(this,E,s/a),l(this,Z,i/a),l(this,Q,o(this,Z)-o(this,E)),o(this,b).loopStart=o(this,E),o(this,b).loopEnd=o(this,Z),o(this,b).loop=!!o(this,z),o(this,b).onended=()=>{o(this,K)?l(this,K,!1):(this.pause(),l(this,J,!0))},o(this,b).start(o(this,v).currentTime,e),l(this,B,Date.now()-e*1e3),l(this,J,!1)}async seek(e){!o(this,v)||(l(this,K,!0),this.initPlayback(e),o(this,_)||(l(this,_,!0),this.hooks.onPlay(),await o(this,v).resume()))}async play(){var e;o(this,_)||!o(this,v)||(l(this,_,!0),this.hooks.onPlay(),await o(this,v).resume(),o(this,J)?this.initPlayback():l(this,B,o(this,B)+Date.now()-((e=o(this,se))!=null?e:0)))}async pause(){!o(this,_)||!o(this,v)||(l(this,_,!1),this.hooks.onPause(),l(this,se,Date.now()),await o(this,v).suspend())}async setTrackStates(e){l(this,G,e),this.seek(this.getCurrrentPlaybackTime())}async setVolume(e){l(this,j,e),o(this,V)&&(o(this,V).gain.value=e)}setLoop(e){l(this,z,e),o(this,b)&&(o(this,b).loop=o(this,z))}getCurrrentPlaybackTime(){if(o(this,Q)==null||o(this,Z)==null)return 0;const e=Date.now();let i=(e-o(this,B))/1e3;for(;i<0;)l(this,B,o(this,B)-o(this,Q)*1e3),i=(e-o(this,B))/1e3;for(;i>o(this,Z);)o(this,z)&&o(this,_)?(l(this,B,o(this,B)+o(this,Q)*1e3),i=(e-o(this,B))/1e3):i=Math.min(i,o(this,Z));return i}}T=new WeakMap,v=new WeakMap,G=new WeakMap,H=new WeakMap,b=new WeakMap,V=new WeakMap,E=new WeakMap,Z=new WeakMap,Q=new WeakMap,B=new WeakMap,se=new WeakMap,z=new WeakMap,J=new WeakMap,K=new WeakMap,_=new WeakMap,j=new WeakMap;var kt=0;function k(t){return"__private_"+kt+++"_"+t}function h(t,e){if(!Object.prototype.hasOwnProperty.call(t,e))throw new TypeError("attempted to use private field on non-instance");return t}function Ge(t,e,s){const i=[];for(let a=e;a<e+s;a++)i.push(t[a]);return i}function d(t,e,s,i=1){const a=Ge(t,e,s);return i===0&&a.reverse(),a.reduce((r,n)=>256*r+n,0)}function Ze(t,e,s){return t<=e?e:t>=s?s:t}function ee(t){return t>=32768?t-65536:t}var w=k("offsetToHead"),p=k("offsetToHeadChunk1"),N=k("offsetToHeadChunk2"),be=k("offsetToHeadChunk3"),O=k("offsetToAdpc"),te=k("offsetToData"),X=k("cachedSamples"),F=k("partitionedAdpcChunkData"),Y=k("cachedChannelInfo"),M=k("cachedBlockResults"),Re=k("getChannelInfo"),$e=k("getMetadata"),Xe=k("getPartitionedBlockData"),Oe=k("getPartitionedAdpcChunkData"),Ce=k("getSamplesAtBlock");class Dt{constructor(e){if(Object.defineProperty(this,Ce,{value:St}),Object.defineProperty(this,Oe,{value:_t}),Object.defineProperty(this,Xe,{value:Vt}),Object.defineProperty(this,$e,{value:Wt}),Object.defineProperty(this,Re,{value:Pt}),Object.defineProperty(this,w,{writable:!0,value:void 0}),Object.defineProperty(this,p,{writable:!0,value:void 0}),Object.defineProperty(this,N,{writable:!0,value:void 0}),Object.defineProperty(this,be,{writable:!0,value:void 0}),Object.defineProperty(this,O,{writable:!0,value:void 0}),Object.defineProperty(this,te,{writable:!0,value:void 0}),Object.defineProperty(this,X,{writable:!0,value:void 0}),Object.defineProperty(this,F,{writable:!0,value:void 0}),Object.defineProperty(this,Y,{writable:!0,value:void 0}),Object.defineProperty(this,M,{writable:!0,value:void 0}),h(this,X)[X]=null,h(this,F)[F]=null,h(this,Y)[Y]=null,h(this,M)[M]=[],this.rawData=new Uint8Array(e),function(s,i,a,r=1){const n=Ge(s,0,4);return r===0&&n.reverse(),String.fromCharCode(...n)}(this.rawData)!=="RSTM")throw new Error("Not a valid BRSTM file");this.endianness=function(s){const i=Ge(s,4,2);return i[0]===255&&i[1]===254?0:1}(this.rawData),h(this,w)[w]=d(this.rawData,16,4,this.endianness),h(this,p)[p]=h(this,w)[w]+d(this.rawData,h(this,w)[w]+12,4,this.endianness)+8,h(this,N)[N]=h(this,w)[w]+d(this.rawData,h(this,w)[w]+20,4,this.endianness)+8,h(this,be)[be]=h(this,w)[w]+d(this.rawData,h(this,w)[w]+28,4,this.endianness)+8,h(this,O)[O]=d(this.rawData,24,4,this.endianness),h(this,te)[te]=d(this.rawData,32,4,this.endianness),this.metadata=h(this,$e)[$e]()}getAllSamples(){if(h(this,X)[X])return h(this,X)[X];const{numberChannels:e,totalSamples:s,totalBlocks:i,samplesPerBlock:a}=this.metadata,r=[];for(let n=0;n<e;n++)r.push(new Int16Array(s));for(let n=0;n<i;n++){const g=h(this,Ce)[Ce](n);for(let c=0;c<e;c++)r[c].set(g[c],n*a)}return h(this,X)[X]=r,r}getBuffer(e,s){return this.getSamples(e,s)}getSamples(e,s){const{numberChannels:i,totalBlocks:a,totalSamples:r,samplesPerBlock:n}=this.metadata,g=Math.max(0,e),c=Math.min(r,e+s),f=Math.max(0,Math.floor(g/n)),I=Math.min(a-1,Math.floor(c/n)),C=[];for(let m=f;m<=I;m++)C.push(h(this,Ce)[Ce](m));const $=[];for(let m=0;m<i;m++)$.push(new Int16Array(c-g));for(let m=f;m<=I;m++){const S=m-f;if(m===f&&m===I)for(let u=0;u<i;u++)$[u].set(C[S][u].slice(g-f*n,g-f*n+s),0);else if(m===f)for(let u=0;u<i;u++){const R=C[S][u].slice(g-f*n);$[u].set(R,0)}else if(m===I)for(let u=0;u<i;u++){const R=C[S][u].slice(0,c-C[S][u].length-f*n);$[u].set(R.length+(m*n-g)>$[u].length?R.slice(0,s-(m*n-g)):R,m*n-g)}else for(let u=0;u<i;u++)$[u].set(C[S][u],m*n-g)}return $}}function Pt(){if(h(this,Y)[Y])return h(this,Y)[Y];const{numberChannels:t}=this.metadata,e=[];for(let s=0;s<t;s++){const i=h(this,w)[w]+d(this.rawData,h(this,be)[be]+8+8*s,4,this.endianness)+8+8,a=[];for(let r=0;r<16;r++){const n=d(this.rawData,i+2*r,2,this.endianness);a.push(ee(n))}e.push({adpcmCoefficients:a,gain:d(this.rawData,i+40,2,this.endianness),initialPredictorScale:d(this.rawData,i+42,2,this.endianness),historySample1:d(this.rawData,i+44,2,this.endianness),historySample2:d(this.rawData,i+46,2,this.endianness),loopPredictorScale:d(this.rawData,i+48,2,this.endianness),loopHistorySample1:d(this.rawData,i+50,2,this.endianness),loopHistorySample2:d(this.rawData,i+52,2,this.endianness)})}return h(this,Y)[Y]=e,e}function Wt(){const t=d(this.rawData,h(this,p)[p]+2,1,this.endianness),e=d(this.rawData,h(this,N)[N],1,this.endianness),s=d(this.rawData,h(this,N)[N]+1,1,this.endianness),i=[];for(let r=0;r<e;r++){const n=h(this,w)[w]+8+d(this.rawData,h(this,N)[N]+4+8*r+4,4,this.endianness),g=d(this.rawData,h(this,N)[N]+4+8*r+1,1,this.endianness);let c=0;g===0?c=d(this.rawData,n,1,this.endianness):g===1&&(c=d(this.rawData,n+8,1,this.endianness)),i.push({numberChannels:c,type:g})}const a={fileSize:d(this.rawData,8,4,this.endianness),endianness:this.endianness,codec:d(this.rawData,h(this,p)[p],1,this.endianness),loopFlag:d(this.rawData,h(this,p)[p]+1,1,this.endianness),numberChannels:t,sampleRate:d(this.rawData,h(this,p)[p]+4,2,this.endianness),loopStartSample:d(this.rawData,h(this,p)[p]+8,4,this.endianness),totalSamples:d(this.rawData,h(this,p)[p]+12,4,this.endianness),totalBlocks:d(this.rawData,h(this,p)[p]+20,4,this.endianness),blockSize:d(this.rawData,h(this,p)[p]+24,4,this.endianness),samplesPerBlock:d(this.rawData,h(this,p)[p]+28,4,this.endianness),finalBlockSize:d(this.rawData,h(this,p)[p]+32,4,this.endianness),finalBlockSizeWithPadding:d(this.rawData,h(this,p)[p]+40,4,this.endianness),totalSamplesInFinalBlock:d(this.rawData,h(this,p)[p]+36,4,this.endianness),adpcTableSamplesPerEntry:d(this.rawData,h(this,p)[p]+44,4,this.endianness),adpcTableBytesPerEntry:d(this.rawData,h(this,p)[p]+48,4,this.endianness),numberTracks:e,trackDescriptionType:s,trackDescriptions:i};return a.loopStartSample>=a.totalSamples&&(a.loopFlag=0,a.loopStartSample=0,console.warn("The loop start sample in this file is invalid.")),a}function Vt(t){const{blockSize:e,totalBlocks:s,numberChannels:i,finalBlockSize:a,finalBlockSizeWithPadding:r}=this.metadata,n=[];for(let c=0;c<i;c++)n.push(new Uint8Array(t===s-1?a:e));let g=t;for(let c=0;c<i;c++){const f=c!==0&&g+1===s?g*i*e+c*r:(g*i+c)*e,I=g+1===s?f+a:f+e,C=this.rawData.slice(h(this,te)[te]+32+f,h(this,te)[te]+32+I);n[c].set(C)}return n}function _t(){if(h(this,F)[F])return h(this,F)[F];const{totalBlocks:t,numberChannels:e}=this.metadata,s=d(this.rawData,h(this,O)[O]+4,4,this.endianness),i=this.rawData.slice(h(this,O)[O]+8,h(this,O)[O]+8+s);let a=0,r=0,n=0;for(let f=0;f<e;f++)r=ee(d(i,a,2,this.endianness)),a+=2,n=ee(d(i,a,2,this.endianness)),a+=2;const g=[];for(let f=0;f<t;f++){g.push([]);for(let I=0;I<e;I++)f>0&&(r=ee(d(i,a,2,this.endianness)),a+=2,n=ee(d(i,a,2,this.endianness)),a+=2),g[f].push({yn1:r,yn2:n})}let c=[];for(let f=0;f<e;f++)c.push(g.map(I=>I[f]));return h(this,F)[F]=c,c}function St(t){if(h(this,M)[M][t])return h(this,M)[M][t];const{numberChannels:e,totalBlocks:s,totalSamplesInFinalBlock:i,samplesPerBlock:a,codec:r}=this.metadata,n=h(this,Re)[Re](),g=h(this,Xe)[Xe](t),c=h(this,Oe)[Oe](),f=[],I=t===s-1?i:a;for(let C=0;C<e;C++)f.push(new Int16Array(I));for(let C=0;C<e;C++){const{adpcmCoefficients:$}=n[C],m=g[C],S=[];if(r===2){const u=m[0],{yn1:R,yn2:It}=c[C][t];let _e=u,Be=R,st=It,Se=0;for(let Ne=0;Ne<I;){let ne=0;Ne%14==0&&(_e=m[Se++]),ne=(1&Ne++)==0?m[Se]>>4:15&m[Se++],ne>=8&&(ne-=16);const it=_e>>4<<1;ne=1024+((1<<(15&_e))*ne<<11)+$[Ze(it,0,15)]*Be+$[Ze(it+1,0,15)]*st>>11,st=Be,Be=Ze(ne,-32768,32767),S.push(Be)}t<s-1&&(c[C][t+1].yn1=S[I-1],c[C][t+1].yn2=S[I-2])}else if(r===1)for(let u=0;u<I;u++){const R=ee(d(m,2*u,2,this.endianness));S.push(R)}else{if(r!==0)throw new Error("Invalid codec");for(let u=0;u<I;u++)S.push(256*ee(m[u]))}f[C].set(S)}return h(this,M)[M][t]=f,f}var ue,U,pe;class Nt{constructor({renderCallback:e}){y(this,ue,!1);y(this,U,null);y(this,pe,void 0);l(this,U,null),l(this,pe,e),this.render=this.render.bind(this)}start(){l(this,ue,!0),l(this,U,requestAnimationFrame(this.render))}stop(){o(this,U)&&cancelAnimationFrame(o(this,U)),l(this,ue,!1)}render(){o(this,pe)&&o(this,pe).call(this),o(this,ue)&&l(this,U,requestAnimationFrame(this.render))}}ue=new WeakMap,U=new WeakMap,pe=new WeakMap;var Zt=Object.defineProperty,$t=Object.getOwnPropertyDescriptor,D=(t,e,s,i)=>{for(var a=i>1?void 0:i?$t(e,s):e,r=t.length-1,n;r>=0;r--)(n=t[r])&&(a=(i?n(e,s,a):n(a))||a);return i&&a&&Zt(e,s,a),a},Lt=(t,e,s)=>{if(!e.has(t))throw TypeError("Cannot "+s)},L=(t,e,s)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,s)},P=(t,e,s)=>(Lt(t,e,"access private method"),s),ce,Ie,je,ht,Fe,dt,ke,Ue,Ye,ct,Me,ut,Te,pt,He,gt,Qe,ft,ze,mt;let A=class extends re{constructor(){super(...arguments);L(this,ce),L(this,je),L(this,Fe),L(this,ke),L(this,Ye),L(this,Me),L(this,Te),L(this,He),L(this,Qe),L(this,ze),this.playPause="play",this.loop="on",this.volume=1,this.muted=!1,this.progressMax=0,this.progressValue=0,this.timeDisplayMax=0,this.timeDisplayValue=0,this.tracksCount=1,this.tracksActive=[!0],this.disabled=!0,this.fileDraggingOver=!1,this.trackTitle="",this.errorMessage="",this.audioPlayer=null,this.timer=new Nt({renderCallback:()=>{if(!this.audioPlayer)return;const t=this.audioPlayer.getCurrrentPlaybackTime();this.progressValue=t,this.timeDisplayValue=t}})}render(){return q`
      <div
        id="error"
        class=${ie({hidden:!this.errorMessage})}
      >
        ${this.errorMessage}
      </div>
      <main id="main">
        <div id="track-title">${this.trackTitle}</div>
        <div id="controls-tracks">
          <controls-tracks
            ?disabled=${this.disabled}
            count=${this.tracksCount}
            .active=${this.tracksActive}
            @tracksActiveChange=${P(this,Ye,ct)}
          ></controls-tracks>
        </div>
        <div id="controls-time-display">
          <controls-time-display
            ?disabled=${this.disabled}
            value=${this.timeDisplayValue}
            max=${this.timeDisplayMax}
          ></controls-time-display>
        </div>
        <div id="controls-progress">
          <controls-progress
            ?disabled=${this.disabled}
            value=${this.progressValue}
            max=${this.progressMax}
            @progressValueChange=${P(this,Te,pt)}
          ></controls-progress>
        </div>
        <label id="controls-select-file-container">
          <input
            type="file"
            id="controls-select-file"
            accept=".brstm"
            @change=${P(this,Fe,dt)}
          />
          <span id="controls-select-file-custom"></span>
        </label>

        <div id="controls-play-pause">
          <controls-play-pause
            ?disabled=${this.disabled}
            mode=${this.playPause}
            @playPauseClick=${P(this,Me,ut)}
          ></controls-play-pause>
        </div>
        <div id="controls-others">
          <controls-loop
            ?disabled=${this.disabled}
            mode=${this.loop}
            @loopClick=${P(this,He,gt)}
          ></controls-loop>
          <controls-volume
            ?disabled=${this.disabled}
            ?muted=${this.muted}
            volume=${this.volume}
            @mutedChange=${P(this,Qe,ft)}
            @volumeChange=${P(this,ze,mt)}
          ></controls-volume>
        </div>
      </main>
      <div
        id="drag-and-drop-overlay"
        class=${ie({hidden:!this.fileDraggingOver})}
      >
        Drop BRSTM file to start playback
      </div>
    `}firstUpdated(){window.addEventListener("dragover",t=>{t.preventDefault(),this.fileDraggingOver=!0}),window.addEventListener("dragend",t=>{this.fileDraggingOver=!1}),window.addEventListener("dragleave",t=>{this.fileDraggingOver=!1}),window.addEventListener("drop",t=>{if(t.preventDefault(),this.fileDraggingOver=!1,!t.dataTransfer||!t.dataTransfer.items||!t.dataTransfer.items[0]||t.dataTransfer.items[0].kind!=="file"){P(this,ce,Ie).call(this,new Error("No file read"));return}const e=t.dataTransfer.items[0].getAsFile();if(!e){P(this,ce,Ie).call(this,new Error("No file read"));return}vt(e).then(P(this,ke,Ue).bind(this))})}};ce=new WeakSet;Ie=function(t){this.errorMessage=t.message};je=new WeakSet;ht=function(){this.errorMessage=""};Fe=new WeakSet;dt=function(t){const e=t.target.files;if(!e||!e.length){P(this,ce,Ie).call(this,new Error("No file read"));return}const s=e[0];vt(s).then(P(this,ke,Ue).bind(this))};ke=new WeakSet;Ue=async function({buffer:t,file:e}){var s;if(P(this,je,ht).call(this),!(!t||!(t instanceof ArrayBuffer))){e.name&&(this.trackTitle=e.name);try{const i=new Dt(t);this.audioPlayer&&await this.audioPlayer.destroy(),this.audioPlayer=new Bt(i.metadata,{onPlay:()=>{},onPause:()=>{}}),console.time("brstm.getAllSamples");const a=i.getAllSamples();console.timeEnd("brstm.getAllSamples");const r=i.metadata.totalSamples/i.metadata.sampleRate,n=i.metadata.numberTracks;await this.audioPlayer.readyPromise,this.audioPlayer.load(a),this.muted?this.audioPlayer.setVolume(0):this.audioPlayer.setVolume(this.volume),this.playPause="pause",this.progressMax=r,this.timeDisplayMax=r,this.tracksCount=n,this.tracksActive=new Array(n).fill(!0).map((g,c)=>c===0),this.disabled=!1,(s=this.audioPlayer)==null||s.play(),this.timer.start()}catch(i){P(this,ce,Ie).call(this,i)}}};Ye=new WeakSet;ct=function(t){var s;const e=t.detail.active;this.tracksActive=e,(s=this.audioPlayer)==null||s.setTrackStates(e)};Me=new WeakSet;ut=function(t){var s,i;const e=t.detail.mode;this.playPause=e,e==="play"?((s=this.audioPlayer)==null||s.pause(),this.timer.stop()):e==="pause"&&((i=this.audioPlayer)==null||i.play(),this.timer.start())};Te=new WeakSet;pt=function(t){var s;const e=t.detail.value;this.progressValue=e,this.timeDisplayValue=e,(s=this.audioPlayer)==null||s.seek(e)};He=new WeakSet;gt=function(t){var s,i;const e=t.detail.mode;this.loop=e,e==="on"?(s=this.audioPlayer)==null||s.setLoop(!0):e==="off"&&((i=this.audioPlayer)==null||i.setLoop(!1))};Qe=new WeakSet;ft=function(t){var s,i;const e=t.detail.muted;this.muted=e,e?(s=this.audioPlayer)==null||s.setVolume(0):(i=this.audioPlayer)==null||i.setVolume(this.volume)};ze=new WeakSet;mt=function(t){var s;const e=t.detail.volume;this.volume=e,this.muted=!1,(s=this.audioPlayer)==null||s.setVolume(e)};A.styles=ae`
    #error {
      padding: 0.6rem;
      margin-top: 0.6rem;
      margin-bottom: 0.6rem;
      color: #ff4136;
      border: 1px solid currentColor;
      padding: 0.6rem;
    }
    #error.hidden {
      display: none;
    }
    #drag-and-drop-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      color: var(--primary);
      font-size: 2rem;
      background: var(--white-lighter);
      z-index: 100;
      user-select: none;
    }
    #drag-and-drop-overlay:before {
      content: ' ';
      position: absolute;
      left: 1rem;
      right: 1rem;
      top: 1rem;
      bottom: 1rem;
      border: 1rem dashed currentColor;
    }
    #drag-and-drop-overlay.hidden {
      display: none;
    }

    #main {
      margin-top: 100px;
      display: grid;
      grid-template-columns: 1fr 80px 1fr;
      grid-template-rows: 20px 15px 24px 80px auto;
      row-gap: 10px;
      column-gap: 2rem;
      margin-bottom: 10px;
    }
    #track-title {
      grid-column: 1 / span 2;
      grid-row: 1;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    #controls-time-display {
      grid-column: 3;
      grid-row: 1;
    }
    #controls-progress {
      grid-column: 1 / span 3;
      grid-row: 2;
    }
    #controls-select-file-container {
      grid-column: 1 / span 3;
      grid-row: 3;
    }
    #controls-tracks {
      grid-column: 1;
      grid-row: 4 / span 2;
    }
    #controls-play-pause {
      grid-column: 2;
      grid-row: 4;
    }
    #controls-others {
      grid-column: 3;
      grid-row: 4;

      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
    }
    controls-loop {
      height: 40px;
    }
    controls-volume {
      margin-inline-start: 10px;
      height: 40px;
    }

    @media (max-width: 640px) {
      #main {
        margin-top: 50px;
        grid-template-rows: 20px 20px 15px 24px 80px auto;
      }
      #track-title {
        grid-column: 1 / span 3;
        grid-row: 1;
      }
      #controls-time-display {
        grid-column: 1 / span 3;
        grid-row: 2;
      }
      #controls-progress {
        grid-column: 1 / span 3;
        grid-row: 3;
      }
      #controls-select-file-container {
        grid-column: 1 / span 3;
        grid-row: 4;
      }
      #controls-play-pause {
        grid-column: 2;
        grid-row: 5;
      }
      #controls-others {
        grid-column: 1 / span 3;
        grid-row: 6;
        justify-content: center;
      }
      #controls-tracks {
        grid-column: 1 / span 3;
        grid-row: 7;
      }
    }

    /* Modified from "file" from https://github.com/mdo/wtf-forms/blob/master/wtf-forms.css */
    #controls-select-file-container {
      position: relative;
      display: inline-block;
      cursor: pointer;
      width: 80px;
    }
    #controls-select-file-container > input {
      margin: 0;
      opacity: 0;
      height: 24px;
      width: 100%;
    }
    #controls-select-file-custom {
      position: absolute;
      top: 0;
      right: 0;
      left: 0;

      z-index: 5;

      box-sizing: border-box;
      border-radius: 5px;
      color: var(--primary);
      background-color: var(--primary-lightest-2);
      user-select: none;
      font-size: 12px;
      line-height: 16px;
      height: 24px;
      display: inline-flex;
      align-items: center;
      padding: 2px 4px;
      text-align: center;
    }
    #controls-select-file-custom:after {
      content: 'Select file...';
    }
    #controls-select-file-custom:hover {
      background-color: var(--primary-lightest-1);
    }

    #controls-select-fileinput:focus ~ #controls-select-file-custom {
      box-shadow: 0 0 0 0.075rem #fff, 0 0 0 0.2rem var(--primary-dark);
    }

    @media (prefers-color-scheme: dark) {
      #controls-select-file-custom {
        color: var(--main-text-color);
      }
    }
  `;D([W()],A.prototype,"playPause",2);D([W()],A.prototype,"loop",2);D([W()],A.prototype,"volume",2);D([W()],A.prototype,"muted",2);D([W()],A.prototype,"progressMax",2);D([W()],A.prototype,"progressValue",2);D([W()],A.prototype,"timeDisplayMax",2);D([W()],A.prototype,"timeDisplayValue",2);D([W()],A.prototype,"tracksCount",2);D([W()],A.prototype,"tracksActive",2);D([W()],A.prototype,"disabled",2);D([W()],A.prototype,"fileDraggingOver",2);D([W()],A.prototype,"trackTitle",2);D([W()],A.prototype,"errorMessage",2);A=D([oe("nikku-main")],A);function vt(t){return new Promise(e=>{const s=new FileReader;s.addEventListener("loadend",i=>{const a=s.result;e({buffer:a,file:t})}),s.readAsArrayBuffer(t)})}var Gt=`<svg width="100" height="100" viewBox="0 0 100 100" fill="#198813" xmlns="http://www.w3.org/2000/svg">\r
<path d="M77.9375 48.2609C79.2874 49.0274 79.2874 50.9726 77.9375 51.7391L38.2376 74.2841C36.9043 75.0413 35.25 74.0783 35.25 72.545L35.25 27.455C35.25 25.9217 36.9044 24.9587 38.2376 25.7159L77.9375 48.2609Z" />\r
</svg>\r
`,Rt=`<svg width="100" height="100" viewBox="0 0 100 100" fill="#198813" xmlns="http://www.w3.org/2000/svg">\r
<rect x="27" y="28" width="16" height="45" rx="2" />\r
<rect x="58" y="28" width="15" height="45" rx="2" />\r
</svg>\r
`,Xt=Object.defineProperty,Ot=Object.getOwnPropertyDescriptor,qe=(t,e,s,i)=>{for(var a=i>1?void 0:i?Ot(e,s):e,r=t.length-1,n;r>=0;r--)(n=t[r])&&(a=(i?n(e,s,a):n(a))||a);return i&&a&&Xt(e,s,a),a},Ft=(t,e,s)=>{if(!e.has(t))throw TypeError("Cannot "+s)},Yt=(t,e,s)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,s)},Mt=(t,e,s)=>(Ft(t,e,"access private method"),s),Ee,Ct;let Ae=class extends re{constructor(){super(...arguments);Yt(this,Ee),this.disabled=!1,this.mode="play"}render(){return q`<button
      class=${ie({button:!0,disabled:this.disabled})}
      ?disabled=${this.disabled}
      @click=${Mt(this,Ee,Ct)}
    >
      ${this.mode==="play"?we(Gt):we(Rt)}
    </button>`}};Ee=new WeakSet;Ct=function(){if(this.disabled)return;const t=this.mode==="play"?"pause":"play";this.dispatchEvent(new CustomEvent("playPauseClick",{detail:{mode:t}})),this.mode=t};Ae.styles=ae`
    .button {
      all: initial;
      width: 80px;
      height: 80px;
      border-radius: 40px;
    }
    svg {
      width: 100%;
      height: 100%;
    }
    .button:not(.disabled):hover {
      background: var(--primary-lightest-1);
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.24);
      cursor: pointer;
    }
    .button.disabled {
      cursor: not-allowed;
    }
  `;qe([x({type:Boolean})],Ae.prototype,"disabled",2);qe([x({type:String})],Ae.prototype,"mode",2);Ae=qe([oe("controls-play-pause")],Ae);var Tt=Object.defineProperty,Ht=Object.getOwnPropertyDescriptor,De=(t,e,s,i)=>{for(var a=i>1?void 0:i?Ht(e,s):e,r=t.length-1,n;r>=0;r--)(n=t[r])&&(a=(i?n(e,s,a):n(a))||a);return i&&a&&Tt(e,s,a),a};let ge=class extends re{constructor(){super(...arguments);this.active=[],this.count=0,this.disabled=!1}render(){return q`
      <div
        id="container"
        class=${ie({hidden:this.count===1||this.disabled})}
      >
        Active tracks:
        <ol id="list">
          ${Array(this.count).fill(0).map((t,e)=>q`<li>
                <label>
                  <input
                    type="checkbox"
                    ?checked="${this.active[e]}"
                    @input=${s=>{const i=s.target.checked,a=[...this.active];a[e]=i,this.active=a,this.dispatchEvent(new CustomEvent("tracksActiveChange",{detail:{active:a}}))}}
                  />
                  Track ${e+1}
                </label>
              </li>`)}
        </ol>
      </div>
    `}};ge.styles=ae`
    .hidden {
      display: none;
    }
    #list {
      list-style: none;
      padding-left: 0;
      margin-top: 6px;
      user-select: none;
    }
    input[type='checkbox'] {
      appearance: none;
      position: relative;
      background: var(--primary-lightest-2);
      border-radius: 2px;
      padding: 2px;
      margin: 0;

      width: 15px;
      height: 15px;
      display: inline-block;
      vertical-align: middle;
      top: -1px;
    }
    input[type='checkbox']:checked:after {
      content: '\u2714';
      position: absolute;
      left: 2px;
      top: 0;

      font-size: 12px;
      line-height: 13px;
      color: var(--primary-darker);
    }
  `;De([x({type:Array})],ge.prototype,"active",2);De([x({type:Number})],ge.prototype,"count",2);De([x({type:Boolean})],ge.prototype,"disabled",2);ge=De([oe("controls-tracks")],ge);var Qt=Object.defineProperty,zt=Object.getOwnPropertyDescriptor,Pe=(t,e,s,i)=>{for(var a=i>1?void 0:i?zt(e,s):e,r=t.length-1,n;r>=0;r--)(n=t[r])&&(a=(i?n(e,s,a):n(a))||a);return i&&a&&Qt(e,s,a),a};let fe=class extends re{constructor(){super(...arguments);this.disabled=!1,this.value=0,this.max=0}render(){return q` <div class="progress-time-display">
      <div class="time" id="current">${rt(this.value)}</div>
      <div class="separator">/</div>
      <div class="time" id="total">${rt(this.max)}</div>
    </div>`}};fe.styles=ae`
    .progress-time-display {
      display: flex;
      justify-content: flex-end;
    }
    .separator {
      margin-inline-start: 4px;
      margin-inline-end: 4px;
    }
    .time {
      width: 3em;
      text-align: center;
    }
    @media (max-width: 640px) {
      .progress-time-display {
        justify-content: flex-start;
      }
      .time {
        text-align: left;
      }
    }
  `;Pe([x({type:Boolean})],fe.prototype,"disabled",2);Pe([x({type:Number})],fe.prototype,"value",2);Pe([x({type:Number})],fe.prototype,"max",2);fe=Pe([oe("controls-time-display")],fe);function rt(t){const e=ot(Math.floor(t/60)),s=ot(Math.floor(t%60));return`${e}:${s}`}function ot(t){return t<10?`0${t}`:t}var Et=Object.defineProperty,Jt=Object.getOwnPropertyDescriptor,We=(t,e,s,i)=>{for(var a=i>1?void 0:i?Jt(e,s):e,r=t.length-1,n;r>=0;r--)(n=t[r])&&(a=(i?n(e,s,a):n(a))||a);return i&&a&&Et(e,s,a),a},yt=(t,e,s)=>{if(!e.has(t))throw TypeError("Cannot "+s)},Kt=(t,e,s)=>(yt(t,e,"read from private field"),s?s.call(t):e.get(t)),jt=(t,e,s)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,s)},nt=(t,e,s,i)=>(yt(t,e,"write to private field"),i?i.call(t,s):e.set(t,s),s),ye;let me=class extends re{constructor(){super(...arguments);this.disabled=!1,this.value=0,this.max=0,jt(this,ye,!1),this._cachedProgressBarOffsetLeft=null,this._cachedProgressBarClientWidth=null,this.progressBar=he(),this.progressActive=he(),this.progressIndicator=he()}get percentage(){return this.max<=0?0:this.value/this.max}render(){return q`
      <div class="progress-bar-container">
        <div
          class=${ie({"progress-bar":!0,disabled:this.disabled})}
          ${de(this.progressBar)}
        >
          <div class="progress-background"></div>
          <div class="progress-active" ${de(this.progressActive)}></div>
          <div class="progress-indicator" ${de(this.progressIndicator)}></div>
        </div>
      </div>
    `}updated(t){t.has("value")&&this.updateStyles()}updateStyles(){var t;this.progressIndicator.value&&(this.progressIndicator.value.style.transform=`translateX(calc(${this.percentage*((t=this._cachedProgressBarClientWidth)!=null?t:0)}px - 50%))`),this.progressActive.value&&(this.progressActive.value.style.transform=`scaleX(${this.percentage})`)}refreshCachedValues(){var t,e,s,i;this._cachedProgressBarOffsetLeft||(this._cachedProgressBarOffsetLeft=(e=(t=this.progressBar.value)==null?void 0:t.offsetLeft)!=null?e:0),(!this._cachedProgressBarClientWidth||this._cachedProgressBarClientWidth===1)&&(this._cachedProgressBarClientWidth=(i=(s=this.progressBar.value)==null?void 0:s.clientWidth)!=null?i:1),this.updateStyles()}firstUpdated(){var e;const t=s=>{var a,r;this.refreshCachedValues();const i=Math.min(1,Math.max(0,(s.clientX-((a=this._cachedProgressBarOffsetLeft)!=null?a:0))/((r=this._cachedProgressBarClientWidth)!=null?r:1)))*this.max;this.dispatchEvent(new CustomEvent("progressValueChange",{detail:{value:i}})),this.value=i};(e=this.progressBar.value)==null||e.addEventListener("mousedown",s=>{this.disabled||(nt(this,ye,!0),t(s))},{passive:!0}),document==null||document.addEventListener("mousemove",s=>{this.disabled||Kt(this,ye)&&t(s)},{passive:!0}),document==null||document.addEventListener("mouseup",s=>{this.disabled||nt(this,ye,!1)},{passive:!0}),window.addEventListener("resize",()=>{this._cachedProgressBarOffsetLeft=null,this._cachedProgressBarClientWidth=null,this.refreshCachedValues()}),this.refreshCachedValues()}};ye=new WeakMap;me.styles=ae`
    .progress-bar-container {
      height: 15px;
    }
    .progress-bar {
      position: relative;
      height: 15px;
      user-select: none;
    }
    .progress-background {
      position: absolute;
      top: 5px;
      width: 100%;
      height: 4px;
      border-radius: 2px;
      background-color: #e0e4e8;
    }
    .progress-active {
      position: absolute;
      top: 5px;
      width: 100%;
      transform-origin: left;
      height: 4px;
      /* NOTE: Because of scaleX transform, this border-radius is also "scaled", need to find a way to have a fixed border-radius*/
      /* border-radius: 2px; */
      background-color: var(--primary);
    }
    .progress-indicator {
      position: absolute;
      width: 15px;
      height: 15px;
      border-radius: 50%;
      background-color: var(--primary);
    }
    .disabled {
      cursor: not-allowed;
    }
  `;We([x({type:Boolean})],me.prototype,"disabled",2);We([x({type:Number})],me.prototype,"value",2);We([x({type:Number})],me.prototype,"max",2);me=We([oe("controls-progress")],me);var Ut=`<svg width="100" height="100" viewBox="0 0 100 100" fill="#198813" xmlns="http://www.w3.org/2000/svg">\r
<path fill-rule="evenodd" clip-rule="evenodd" d="M37.5858 38C37.851 38 38.1054 37.8946 38.2929 37.7071L48.2929 27.7071C48.9229 27.0771 50 27.5233 50 28.4142V71.5858C50 72.4767 48.9229 72.9228 48.2929 72.2929L38.2929 62.2929C38.1054 62.1054 37.851 62 37.5858 62H21C20.4477 62 20 61.5523 20 61V39C20 38.4477 20.4477 38 21 38H37.5858Z"/>\r
<path fill-rule="evenodd" clip-rule="evenodd" d="M71.9382 50.0662C71.7795 42.8723 68.0938 35.4875 61.0359 30.0266C60.5991 29.6887 60.4988 29.0641 60.8236 28.6175L63.1763 25.3825C63.5012 24.9359 64.1276 24.8362 64.5659 25.1722C72.9864 31.628 77.7327 40.6844 77.9368 49.9338C78.1425 59.2585 73.72 68.4296 64.4895 74.9305C64.038 75.2486 63.4157 75.1236 63.1094 74.6641L60.8906 71.3359C60.5842 70.8764 60.71 70.2565 61.16 69.9364C68.7821 64.5159 72.0959 57.2151 71.9382 50.0662Z"/>\r
<path fill-rule="evenodd" clip-rule="evenodd" d="M89.375 50C89.375 35.887 83.3874 22.0191 71.7151 14.0769C71.2585 13.7662 71.1219 13.1482 71.4201 12.6834L73.5799 9.31661C73.8781 8.85175 74.4987 8.71651 74.9565 9.0254C88.6709 18.2782 95.375 34.2625 95.375 50C95.375 65.7375 88.6709 81.7218 74.9565 90.9746C74.4987 91.2835 73.8781 91.1482 73.5799 90.6834L71.4201 87.3166C71.1219 86.8518 71.2585 86.2338 71.7151 85.9231C83.3874 77.9809 89.375 64.113 89.375 50Z"/>\r
</svg>\r
`,qt=`<svg width="100" height="100" viewBox="0 0 100 100" fill="#198813" xmlns="http://www.w3.org/2000/svg">\r
<rect x="81.5937" y="36.1014" width="5.02197" height="34.2892" rx="1" transform="rotate(45 81.5937 36.1014)"/>\r
<rect x="85.1447" y="60.3475" width="5.02197" height="34.2892" rx="1" transform="rotate(135 85.1447 60.3475)"/>\r
<path fill-rule="evenodd" clip-rule="evenodd" d="M37.5858 38C37.851 38 38.1054 37.8946 38.2929 37.7071L48.2929 27.7071C48.9229 27.0771 50 27.5233 50 28.4142V71.5858C50 72.4767 48.9229 72.9228 48.2929 72.2929L38.2929 62.2929C38.1054 62.1053 37.851 62 37.5858 62H21C20.4477 62 20 61.5523 20 61V39C20 38.4477 20.4477 38 21 38L37.5858 38Z"/>\r
</svg>\r
`,es=Object.defineProperty,ts=Object.getOwnPropertyDescriptor,Ve=(t,e,s,i)=>{for(var a=i>1?void 0:i?ts(e,s):e,r=t.length-1,n;r>=0;r--)(n=t[r])&&(a=(i?n(e,s,a):n(a))||a);return i&&a&&es(e,s,a),a},et=(t,e,s)=>{if(!e.has(t))throw TypeError("Cannot "+s)},ss=(t,e,s)=>(et(t,e,"read from private field"),s?s.call(t):e.get(t)),lt=(t,e,s)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,s)},Le=(t,e,s,i)=>(et(t,e,"write to private field"),i?i.call(t,s):e.set(t,s),s),is=(t,e,s)=>(et(t,e,"access private method"),s),le,Je,bt;let ve=class extends re{constructor(){super(...arguments);lt(this,Je),this.disabled=!1,this.muted=!1,this.volume=1,lt(this,le,!1),this._cachedVolumeBarOffsetLeft=null,this._cachedVolumeBarClientWidth=null,this.volumeBarContainer=he(),this.volumeFill=he(),this.volumeIndicator=he()}render(){return q`<div class="volume-container">
      <div class="volume-icon-container" @click=${is(this,Je,bt)}>
        ${this.muted?we(qt):we(Ut)}
      </div>
      <div
        class=${ie({"volume-bar-container":!0,disabled:this.disabled})}
        ${de(this.volumeBarContainer)}
      >
        <div class="volume-bar">
          <div class="volume-background"></div>
          <div class="volume-fill" ${de(this.volumeFill)}></div>
          <div class="volume-indicator" ${de(this.volumeIndicator)}></div>
        </div>
      </div>
    </div>`}updateStyles(){var t;this.volumeIndicator.value&&(this.volumeIndicator.value.style.transform=this.muted?"":`translateX(calc(${this.volume*((t=this._cachedVolumeBarClientWidth)!=null?t:0)}px - 50%))`),this.volumeFill.value&&(this.volumeFill.value.style.transform=this.muted?"scaleX(0)":`scaleX(${this.volume})`)}refreshCachedValues(){var t,e,s,i;this._cachedVolumeBarOffsetLeft||(this._cachedVolumeBarOffsetLeft=(e=(t=this.volumeBarContainer.value)==null?void 0:t.offsetLeft)!=null?e:0),(!this._cachedVolumeBarClientWidth||this._cachedVolumeBarClientWidth===1)&&(this._cachedVolumeBarClientWidth=(i=(s=this.volumeBarContainer.value)==null?void 0:s.clientWidth)!=null?i:1),this.updateStyles()}updated(t){(t.has("muted")||t.has("volume"))&&this.updateStyles()}firstUpdated(){var e;Le(this,le,!1);const t=s=>{var a,r;this.refreshCachedValues();const i=Math.min(1,Math.max(0,(s.clientX-((a=this._cachedVolumeBarOffsetLeft)!=null?a:0))/((r=this._cachedVolumeBarClientWidth)!=null?r:1)));this.volume=i,this.dispatchEvent(new CustomEvent("volumeChange",{detail:{volume:i}}))};(e=this.volumeBarContainer.value)==null||e.addEventListener("mousedown",s=>{this.disabled||(Le(this,le,!0),t(s))},{passive:!0}),document==null||document.addEventListener("mousemove",s=>{this.disabled||ss(this,le)&&t(s)},{passive:!0}),document==null||document.addEventListener("mouseup",s=>{this.disabled||Le(this,le,!1)},{passive:!0}),window.addEventListener("resize",()=>{this._cachedVolumeBarOffsetLeft=null,this._cachedVolumeBarClientWidth=null,this.refreshCachedValues()}),this.refreshCachedValues()}};le=new WeakMap;Je=new WeakSet;bt=function(){const t=!this.muted;this.muted=t,this.dispatchEvent(new CustomEvent("mutedChange",{detail:{muted:t}}))};ve.styles=ae`
    :root {
      margin: 0;
      padding: 0;
    }
    svg {
      width: 100%;
      height: 100%;
    }
    .volume-icon-container {
      width: 40px;
    }
    .volume-container {
      display: flex;
      align-items: center;
    }
    .volume-bar-container {
      height: 40px;
      margin-left: 8px;
      display: flex;
      align-items: center;
      user-select: none;
    }
    .volume-bar {
      position: relative;
      width: 100px;
      height: 10px;
    }
    .volume-background {
      position: absolute;
      top: 4px;
      width: 100%;
      height: 2px;
      border-radius: 1px;
      background-color: #e0e4e8;
    }
    .volume-fill {
      position: absolute;
      top: 4px;
      width: 100%;
      transform-origin: left;
      height: 2px;
      /* NOTE: Because of scaleX transform, this border-radius is also "scaled", need to find a way to have a fixed border-radius*/
      /* border-radius: 1px; */
      background-color: var(--primary);
    }
    .volume-indicator {
      position: absolute;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: var(--primary);
    }
    .disabled {
      cursor: not-allowed;
    }
  `;Ve([x({type:Boolean})],ve.prototype,"disabled",2);Ve([x({type:Boolean})],ve.prototype,"muted",2);Ve([x({type:Number})],ve.prototype,"volume",2);ve=Ve([oe("controls-volume")],ve);var as=`<svg width="100" height="100" viewBox="0 0 100 100" fill="#198813" xmlns="http://www.w3.org/2000/svg">\r
<path d="M20 38C20 29.5 26.5 20 38 20L62 20C72 20 80 28 80 38L80 39L70 39C70 39 70 42.5 70 38C70 33.5 66.5 30 62 30C57.5 30 42.5 30 38 30C33.5 30 30 33.5 30 38C30 42.5 30 41 30 41L20 41L20 38Z"/>\r
<path d="M74.5 54L60.2106 39L88.7894 39L74.5 54Z"/>\r
<path d="M79 61C79 69.5 72.5 79 61 79L37 79C27 79 19 71 19 61L19 60L29 60C29 60 29 56.5 29 61C29 65.5 32.5 69 37 69C41.5 69 56.5 69 61 69C65.5 69 69 65.5 69 61C69 56.5 69 58 69 58L79 58L79 61Z"/>\r
<path d="M24.5 45L38.7894 60H10.2106L24.5 45Z"/>\r
</svg>\r
`,rs=Object.defineProperty,os=Object.getOwnPropertyDescriptor,tt=(t,e,s,i)=>{for(var a=i>1?void 0:i?os(e,s):e,r=t.length-1,n;r>=0;r--)(n=t[r])&&(a=(i?n(e,s,a):n(a))||a);return i&&a&&rs(e,s,a),a},ns=(t,e,s)=>{if(!e.has(t))throw TypeError("Cannot "+s)},ls=(t,e,s)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,s)},hs=(t,e,s)=>(ns(t,e,"access private method"),s),Ke,wt;let xe=class extends re{constructor(){super(...arguments);ls(this,Ke),this.disabled=!1,this.mode="on"}render(){return q`<button
      class=${ie({on:this.mode==="on",off:this.mode==="off",disabled:this.disabled,button:!0})}
      @click="${hs(this,Ke,wt)}"
    >
      ${we(as)}
    </button>`}};Ke=new WeakSet;wt=function(){if(this.disabled)return;const t=this.mode==="on"?"off":"on";this.dispatchEvent(new CustomEvent("loopClick",{detail:{mode:t}})),this.mode=t};xe.styles=ae`
    :root {
      margin: 0;
      padding: 0;
    }
    .button {
      all: initial;
      width: 40px;
      height: 40px;
      border-radius: 20px;
    }
    svg {
      width: 100%;
      height: 100%;
    }
    .button:not(.disabled):hover {
      background: var(--primary-lightest-1);
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.24);
      cursor: pointer;
    }
    .button.off > svg {
      fill: var(--primary-lighter);
    }
    .button.disabled:hover {
      cursor: not-allowed;
    }
  `;tt([x({type:Boolean})],xe.prototype,"disabled",2);tt([x({type:String})],xe.prototype,"mode",2);xe=tt([oe("controls-loop")],xe);
