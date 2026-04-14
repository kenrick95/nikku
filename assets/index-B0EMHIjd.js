var lt=t=>{throw TypeError(t)};var Re=(t,e,s)=>e.has(t)||lt("Cannot "+s);var l=(t,e,s)=>(Re(t,e,"read from private field"),s?s.call(t):e.get(t)),$=(t,e,s)=>e.has(t)?lt("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,s),d=(t,e,s,i)=>(Re(t,e,"write to private field"),i?i.call(t,s):e.set(t,s),s),be=(t,e,s)=>(Re(t,e,"access private method"),s);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function s(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(r){if(r.ep)return;r.ep=!0;const n=s(r);fetch(r.href,n)}})();/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const we=globalThis,Ge=we.ShadowRoot&&(we.ShadyCSS===void 0||we.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Qe=Symbol(),ht=new WeakMap;let Pt=class{constructor(e,s,i){if(this._$cssResult$=!0,i!==Qe)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=s}get styleSheet(){let e=this.o;const s=this.t;if(Ge&&e===void 0){const i=s!==void 0&&s.length===1;i&&(e=ht.get(s)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&ht.set(s,e))}return e}toString(){return this.cssText}};const ps=t=>new Pt(typeof t=="string"?t:t+"",void 0,Qe),B=(t,...e)=>{const s=t.length===1?t[0]:e.reduce(((i,r,n)=>i+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+t[n+1]),t[0]);return new Pt(s,t,Qe)},fs=(t,e)=>{if(Ge)t.adoptedStyleSheets=e.map((s=>s instanceof CSSStyleSheet?s:s.styleSheet));else for(const s of e){const i=document.createElement("style"),r=we.litNonce;r!==void 0&&i.setAttribute("nonce",r),i.textContent=s.cssText,t.appendChild(i)}},dt=Ge?t=>t:t=>t instanceof CSSStyleSheet?(e=>{let s="";for(const i of e.cssRules)s+=i.cssText;return ps(s)})(t):t;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:ms,defineProperty:gs,getOwnPropertyDescriptor:vs,getOwnPropertyNames:ys,getOwnPropertySymbols:_s,getPrototypeOf:bs}=Object,R=globalThis,ct=R.trustedTypes,$s=ct?ct.emptyScript:"",Ue=R.reactiveElementPolyfillSupport,le=(t,e)=>t,Ce={toAttribute(t,e){switch(e){case Boolean:t=t?$s:null;break;case Object:case Array:t=t==null?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=t!==null;break;case Number:s=t===null?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch{s=null}}return s}},Je=(t,e)=>!ms(t,e),ut={attribute:!0,type:String,converter:Ce,reflect:!1,hasChanged:Je};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),R.litPropertyMetadata??(R.litPropertyMetadata=new WeakMap);class G extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??(this.l=[])).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,s=ut){if(s.state&&(s.attribute=!1),this._$Ei(),this.elementProperties.set(e,s),!s.noAccessor){const i=Symbol(),r=this.getPropertyDescriptor(e,i,s);r!==void 0&&gs(this.prototype,e,r)}}static getPropertyDescriptor(e,s,i){const{get:r,set:n}=vs(this.prototype,e)??{get(){return this[s]},set(o){this[s]=o}};return{get(){return r==null?void 0:r.call(this)},set(o){const h=r==null?void 0:r.call(this);n.call(this,o),this.requestUpdate(e,h,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??ut}static _$Ei(){if(this.hasOwnProperty(le("elementProperties")))return;const e=bs(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(le("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(le("properties"))){const s=this.properties,i=[...ys(s),..._s(s)];for(const r of i)this.createProperty(r,s[r])}const e=this[Symbol.metadata];if(e!==null){const s=litPropertyMetadata.get(e);if(s!==void 0)for(const[i,r]of s)this.elementProperties.set(i,r)}this._$Eh=new Map;for(const[s,i]of this.elementProperties){const r=this._$Eu(s,i);r!==void 0&&this._$Eh.set(r,s)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const s=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const r of i)s.unshift(dt(r))}else e!==void 0&&s.push(dt(e));return s}static _$Eu(e,s){const i=s.attribute;return i===!1?void 0:typeof i=="string"?i:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var e;this._$ES=new Promise((s=>this.enableUpdating=s)),this._$AL=new Map,this._$E_(),this.requestUpdate(),(e=this.constructor.l)==null||e.forEach((s=>s(this)))}addController(e){var s;(this._$EO??(this._$EO=new Set)).add(e),this.renderRoot!==void 0&&this.isConnected&&((s=e.hostConnected)==null||s.call(e))}removeController(e){var s;(s=this._$EO)==null||s.delete(e)}_$E_(){const e=new Map,s=this.constructor.elementProperties;for(const i of s.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return fs(e,this.constructor.elementStyles),e}connectedCallback(){var e;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$EO)==null||e.forEach((s=>{var i;return(i=s.hostConnected)==null?void 0:i.call(s)}))}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$EO)==null||e.forEach((s=>{var i;return(i=s.hostDisconnected)==null?void 0:i.call(s)}))}attributeChangedCallback(e,s,i){this._$AK(e,i)}_$EC(e,s){var n;const i=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,i);if(r!==void 0&&i.reflect===!0){const o=(((n=i.converter)==null?void 0:n.toAttribute)!==void 0?i.converter:Ce).toAttribute(s,i.type);this._$Em=e,o==null?this.removeAttribute(r):this.setAttribute(r,o),this._$Em=null}}_$AK(e,s){var n;const i=this.constructor,r=i._$Eh.get(e);if(r!==void 0&&this._$Em!==r){const o=i.getPropertyOptions(r),h=typeof o.converter=="function"?{fromAttribute:o.converter}:((n=o.converter)==null?void 0:n.fromAttribute)!==void 0?o.converter:Ce;this._$Em=r,this[r]=h.fromAttribute(s,o.type),this._$Em=null}}requestUpdate(e,s,i){if(e!==void 0){if(i??(i=this.constructor.getPropertyOptions(e)),!(i.hasChanged??Je)(this[e],s))return;this.P(e,s,i)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(e,s,i){this._$AL.has(e)||this._$AL.set(e,s),i.reflect===!0&&this._$Em!==e&&(this._$Ej??(this._$Ej=new Set)).add(e)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(s){Promise.reject(s)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var i;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const r=this.constructor.elementProperties;if(r.size>0)for(const[n,o]of r)o.wrapped!==!0||this._$AL.has(n)||this[n]===void 0||this.P(n,this[n],o)}let e=!1;const s=this._$AL;try{e=this.shouldUpdate(s),e?(this.willUpdate(s),(i=this._$EO)==null||i.forEach((r=>{var n;return(n=r.hostUpdate)==null?void 0:n.call(r)})),this.update(s)):this._$EU()}catch(r){throw e=!1,this._$EU(),r}e&&this._$AE(s)}willUpdate(e){}_$AE(e){var s;(s=this._$EO)==null||s.forEach((i=>{var r;return(r=i.hostUpdated)==null?void 0:r.call(i)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Ej&&(this._$Ej=this._$Ej.forEach((s=>this._$EC(s,this[s])))),this._$EU()}updated(e){}firstUpdated(e){}}G.elementStyles=[],G.shadowRootOptions={mode:"open"},G[le("elementProperties")]=new Map,G[le("finalized")]=new Map,Ue==null||Ue({ReactiveElement:G}),(R.reactiveElementVersions??(R.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const he=globalThis,Ee=he.trustedTypes,pt=Ee?Ee.createPolicy("lit-html",{createHTML:t=>t}):void 0,kt="$lit$",T=`lit$${Math.random().toFixed(9).slice(2)}$`,Ot="?"+T,ws=`<${Ot}>`,K=document,ce=()=>K.createComment(""),ue=t=>t===null||typeof t!="object"&&typeof t!="function",et=Array.isArray,xs=t=>et(t)||typeof(t==null?void 0:t[Symbol.iterator])=="function",Be=`[ 	
\f\r]`,ae=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ft=/-->/g,mt=/>/g,H=RegExp(`>|${Be}(?:([^\\s"'>=/]+)(${Be}*=${Be}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),gt=/'/g,vt=/"/g,Mt=/^(?:script|style|textarea|title)$/i,As=t=>(e,...s)=>({_$litType$:t,strings:e,values:s}),O=As(1),U=Symbol.for("lit-noChange"),m=Symbol.for("lit-nothing"),yt=new WeakMap,F=K.createTreeWalker(K,129);function Tt(t,e){if(!et(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return pt!==void 0?pt.createHTML(e):e}const Cs=(t,e)=>{const s=t.length-1,i=[];let r,n=e===2?"<svg>":e===3?"<math>":"",o=ae;for(let h=0;h<s;h++){const a=t[h];let c,p,u=-1,f=0;for(;f<a.length&&(o.lastIndex=f,p=o.exec(a),p!==null);)f=o.lastIndex,o===ae?p[1]==="!--"?o=ft:p[1]!==void 0?o=mt:p[2]!==void 0?(Mt.test(p[2])&&(r=RegExp("</"+p[2],"g")),o=H):p[3]!==void 0&&(o=H):o===H?p[0]===">"?(o=r??ae,u=-1):p[1]===void 0?u=-2:(u=o.lastIndex-p[2].length,c=p[1],o=p[3]===void 0?H:p[3]==='"'?vt:gt):o===vt||o===gt?o=H:o===ft||o===mt?o=ae:(o=H,r=void 0);const A=o===H&&t[h+1].startsWith("/>")?" ":"";n+=o===ae?a+ws:u>=0?(i.push(c),a.slice(0,u)+kt+a.slice(u)+T+A):a+T+(u===-2?h:A)}return[Tt(t,n+(t[s]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),i]};class pe{constructor({strings:e,_$litType$:s},i){let r;this.parts=[];let n=0,o=0;const h=e.length-1,a=this.parts,[c,p]=Cs(e,s);if(this.el=pe.createElement(c,i),F.currentNode=this.el.content,s===2||s===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(r=F.nextNode())!==null&&a.length<h;){if(r.nodeType===1){if(r.hasAttributes())for(const u of r.getAttributeNames())if(u.endsWith(kt)){const f=p[o++],A=r.getAttribute(u).split(T),_e=/([.?@])?(.*)/.exec(f);a.push({type:1,index:n,name:_e[2],strings:A,ctor:_e[1]==="."?Ss:_e[1]==="?"?Ps:_e[1]==="@"?ks:Te}),r.removeAttribute(u)}else u.startsWith(T)&&(a.push({type:6,index:n}),r.removeAttribute(u));if(Mt.test(r.tagName)){const u=r.textContent.split(T),f=u.length-1;if(f>0){r.textContent=Ee?Ee.emptyScript:"";for(let A=0;A<f;A++)r.append(u[A],ce()),F.nextNode(),a.push({type:2,index:++n});r.append(u[f],ce())}}}else if(r.nodeType===8)if(r.data===Ot)a.push({type:2,index:n});else{let u=-1;for(;(u=r.data.indexOf(T,u+1))!==-1;)a.push({type:7,index:n}),u+=T.length-1}n++}}static createElement(e,s){const i=K.createElement("template");return i.innerHTML=e,i}}function se(t,e,s=t,i){var o,h;if(e===U)return e;let r=i!==void 0?(o=s.o)==null?void 0:o[i]:s.l;const n=ue(e)?void 0:e._$litDirective$;return(r==null?void 0:r.constructor)!==n&&((h=r==null?void 0:r._$AO)==null||h.call(r,!1),n===void 0?r=void 0:(r=new n(t),r._$AT(t,s,i)),i!==void 0?(s.o??(s.o=[]))[i]=r:s.l=r),r!==void 0&&(e=se(t,r._$AS(t,e.values),r,i)),e}class Es{constructor(e,s){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=s}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:s},parts:i}=this._$AD,r=((e==null?void 0:e.creationScope)??K).importNode(s,!0);F.currentNode=r;let n=F.nextNode(),o=0,h=0,a=i[0];for(;a!==void 0;){if(o===a.index){let c;a.type===2?c=new ye(n,n.nextSibling,this,e):a.type===1?c=new a.ctor(n,a.name,a.strings,this,e):a.type===6&&(c=new Os(n,this,e)),this._$AV.push(c),a=i[++h]}o!==(a==null?void 0:a.index)&&(n=F.nextNode(),o++)}return F.currentNode=K,r}p(e){let s=0;for(const i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(e,i,s),s+=i.strings.length-2):i._$AI(e[s])),s++}}class ye{get _$AU(){var e;return((e=this._$AM)==null?void 0:e._$AU)??this.v}constructor(e,s,i,r){this.type=2,this._$AH=m,this._$AN=void 0,this._$AA=e,this._$AB=s,this._$AM=i,this.options=r,this.v=(r==null?void 0:r.isConnected)??!0}get parentNode(){let e=this._$AA.parentNode;const s=this._$AM;return s!==void 0&&(e==null?void 0:e.nodeType)===11&&(e=s.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,s=this){e=se(this,e,s),ue(e)?e===m||e==null||e===""?(this._$AH!==m&&this._$AR(),this._$AH=m):e!==this._$AH&&e!==U&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):xs(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==m&&ue(this._$AH)?this._$AA.nextSibling.data=e:this.T(K.createTextNode(e)),this._$AH=e}$(e){var n;const{values:s,_$litType$:i}=e,r=typeof i=="number"?this._$AC(e):(i.el===void 0&&(i.el=pe.createElement(Tt(i.h,i.h[0]),this.options)),i);if(((n=this._$AH)==null?void 0:n._$AD)===r)this._$AH.p(s);else{const o=new Es(r,this),h=o.u(this.options);o.p(s),this.T(h),this._$AH=o}}_$AC(e){let s=yt.get(e.strings);return s===void 0&&yt.set(e.strings,s=new pe(e)),s}k(e){et(this._$AH)||(this._$AH=[],this._$AR());const s=this._$AH;let i,r=0;for(const n of e)r===s.length?s.push(i=new ye(this.O(ce()),this.O(ce()),this,this.options)):i=s[r],i._$AI(n),r++;r<s.length&&(this._$AR(i&&i._$AB.nextSibling,r),s.length=r)}_$AR(e=this._$AA.nextSibling,s){var i;for((i=this._$AP)==null?void 0:i.call(this,!1,!0,s);e&&e!==this._$AB;){const r=e.nextSibling;e.remove(),e=r}}setConnected(e){var s;this._$AM===void 0&&(this.v=e,(s=this._$AP)==null||s.call(this,e))}}class Te{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,s,i,r,n){this.type=1,this._$AH=m,this._$AN=void 0,this.element=e,this.name=s,this._$AM=r,this.options=n,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=m}_$AI(e,s=this,i,r){const n=this.strings;let o=!1;if(n===void 0)e=se(this,e,s,0),o=!ue(e)||e!==this._$AH&&e!==U,o&&(this._$AH=e);else{const h=e;let a,c;for(e=n[0],a=0;a<n.length-1;a++)c=se(this,h[i+a],s,a),c===U&&(c=this._$AH[a]),o||(o=!ue(c)||c!==this._$AH[a]),c===m?e=m:e!==m&&(e+=(c??"")+n[a+1]),this._$AH[a]=c}o&&!r&&this.j(e)}j(e){e===m?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class Ss extends Te{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===m?void 0:e}}class Ps extends Te{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==m)}}class ks extends Te{constructor(e,s,i,r,n){super(e,s,i,r,n),this.type=5}_$AI(e,s=this){if((e=se(this,e,s,0)??m)===U)return;const i=this._$AH,r=e===m&&i!==m||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,n=e!==m&&(i===m||r);r&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var s;typeof this._$AH=="function"?this._$AH.call(((s=this.options)==null?void 0:s.host)??this.element,e):this._$AH.handleEvent(e)}}class Os{constructor(e,s,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=s,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){se(this,e)}}const Ve=he.litHtmlPolyfillSupport;Ve==null||Ve(pe,ye),(he.litHtmlVersions??(he.litHtmlVersions=[])).push("3.2.0");const Ms=(t,e,s)=>{const i=(s==null?void 0:s.renderBefore)??e;let r=i._$litPart$;if(r===void 0){const n=(s==null?void 0:s.renderBefore)??null;i._$litPart$=r=new ye(e.insertBefore(ce(),n),n,void 0,s??{})}return r._$AI(t),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class E extends G{constructor(){super(...arguments),this.renderOptions={host:this},this.o=void 0}createRenderRoot(){var s;const e=super.createRenderRoot();return(s=this.renderOptions).renderBefore??(s.renderBefore=e.firstChild),e}update(e){const s=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this.o=Ms(s,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this.o)==null||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this.o)==null||e.setConnected(!1)}render(){return U}}var St;E._$litElement$=!0,E.finalized=!0,(St=globalThis.litElementHydrateSupport)==null||St.call(globalThis,{LitElement:E});const He=globalThis.litElementPolyfillSupport;He==null||He({LitElement:E});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const V=t=>(e,s)=>{s!==void 0?s.addInitializer((()=>{customElements.define(t,e)})):customElements.define(t,e)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ts={attribute:!0,type:String,converter:Ce,reflect:!1,hasChanged:Je},Ls=(t=Ts,e,s)=>{const{kind:i,metadata:r}=s;let n=globalThis.litPropertyMetadata.get(r);if(n===void 0&&globalThis.litPropertyMetadata.set(r,n=new Map),n.set(s.name,t),i==="accessor"){const{name:o}=s;return{set(h){const a=e.get.call(this);e.set.call(this,h),this.requestUpdate(o,a,t)},init(h){return h!==void 0&&this.P(o,void 0,t),h}}}if(i==="setter"){const{name:o}=s;return function(h){const a=this[o];e.call(this,h),this.requestUpdate(o,a,t)}}throw Error("Unsupported decorator location: "+i)};function _(t){return(e,s)=>typeof s=="object"?Ls(t,e,s):((i,r,n)=>{const o=r.hasOwnProperty(n);return r.constructor.createProperty(n,o?{...i,wrapped:!0}:i),o?Object.getOwnPropertyDescriptor(r,n):void 0})(t,e,s)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function w(t){return _({...t,state:!0,attribute:!1})}/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ds=t=>t.strings===void 0;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const tt={ATTRIBUTE:1,CHILD:2},st=t=>(...e)=>({_$litDirective$:t,values:e});class rt{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,s,i){this.t=e,this._$AM=s,this.i=i}_$AS(e,s){return this.update(e,s)}update(e,s){return this.render(...s)}}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const de=(t,e)=>{var i;const s=t._$AN;if(s===void 0)return!1;for(const r of s)(i=r._$AO)==null||i.call(r,e,!1),de(r,e);return!0},Se=t=>{let e,s;do{if((e=t._$AM)===void 0)break;s=e._$AN,s.delete(t),t=e}while((s==null?void 0:s.size)===0)},Lt=t=>{for(let e;e=t._$AM;t=e){let s=e._$AN;if(s===void 0)e._$AN=s=new Set;else if(s.has(t))break;s.add(t),Rs(e)}};function Is(t){this._$AN!==void 0?(Se(this),this._$AM=t,Lt(this)):this._$AM=t}function Ns(t,e=!1,s=0){const i=this._$AH,r=this._$AN;if(r!==void 0&&r.size!==0)if(e)if(Array.isArray(i))for(let n=s;n<i.length;n++)de(i[n],!1),Se(i[n]);else i!=null&&(de(i,!1),Se(i));else de(this,t)}const Rs=t=>{t.type==tt.CHILD&&(t._$AP??(t._$AP=Ns),t._$AQ??(t._$AQ=Is))};class Us extends rt{constructor(){super(...arguments),this._$AN=void 0}_$AT(e,s,i){super._$AT(e,s,i),Lt(this),this.isConnected=e._$AU}_$AO(e,s=!0){var i,r;e!==this.isConnected&&(this.isConnected=e,e?(i=this.reconnected)==null||i.call(this):(r=this.disconnected)==null||r.call(this)),s&&(de(this,e),Se(this))}setValue(e){if(Ds(this.t))this.t._$AI(e,this);else{const s=[...this.t._$AH];s[this.i]=e,this.t._$AI(s,this,0)}}disconnected(){}reconnected(){}}/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Y=()=>new Bs;class Bs{}const We=new WeakMap,Z=st(class extends Us{render(t){return m}update(t,[e]){var i;const s=e!==this.Y;return s&&this.Y!==void 0&&this.rt(void 0),(s||this.lt!==this.ct)&&(this.Y=e,this.ht=(i=t.options)==null?void 0:i.host,this.rt(this.ct=t.element)),m}rt(t){if(this.isConnected||(t=void 0),typeof this.Y=="function"){const e=this.ht??globalThis;let s=We.get(e);s===void 0&&(s=new WeakMap,We.set(e,s)),s.get(this.Y)!==void 0&&this.Y.call(this.ht,void 0),s.set(this.Y,t),t!==void 0&&this.Y.call(this.ht,t)}else this.Y.value=t}get lt(){var t,e;return typeof this.Y=="function"?(t=We.get(this.ht??globalThis))==null?void 0:t.get(this.Y):(e=this.Y)==null?void 0:e.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});var Vs=Object.defineProperty,Hs=Object.getOwnPropertyDescriptor,Dt=t=>{throw TypeError(t)},It=(t,e,s,i)=>{for(var r=i>1?void 0:i?Hs(e,s):e,n=t.length-1,o;n>=0;n--)(o=t[n])&&(r=(i?o(e,s,r):o(r))||r);return i&&r&&Vs(e,s,r),r},Ws=(t,e,s)=>e.has(t)||Dt("Cannot "+s),zs=(t,e,s)=>e.has(t)?Dt("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,s),_t=(t,e,s)=>(Ws(t,e,"access private method"),s),xe,Nt,Rt;let Pe=class extends E{constructor(){super(...arguments),zs(this,xe),this.dialogOpen=!1,this.dialog=Y(),this.isDialogSupported=!!self.HTMLDialogElement,this.explanations=["BRSTM is a file format that contains audio data that's being used for some Nintendo consoles. One of the differences with the usual audio format (MP3, etc) is that this format can contain a loop point, making it suitable for usage in games.","BRSTM file is not included in the repository."]}render(){return this.isDialogSupported?O`
      <span
        id="help"
        @click=${_t(this,xe,Nt)}
        title="Click to open explanation"
        ><slot></slot
      ></span>
      <dialog
        id="brstm-explanation"
        ?open=${this.dialogOpen}
        ${Z(this.dialog)}
      >
        ${this.explanations.map(t=>O`<p>${t}</p>`)}

        <button @click=${_t(this,xe,Rt)}>OK</button>
      </dialog>
    `:O`<span id="help" title=${this.explanations.join(`
`)}
        ><slot></slot>
      </span>`}};xe=new WeakSet;Nt=function(){var t;(t=this.dialog.value)==null||t.showModal()};Rt=function(){var t;(t=this.dialog.value)==null||t.close()};Pe.styles=B`
    #brstm-explanation {
      max-width: var(--max-width);
      background-color: var(--main-bg-color);
      color: var(--main-text-color);

      border: none;
      border-radius: 5px;
    }
    #brstm-explanation::backdrop {
      background-color: rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(5px);
    }
    #help {
      text-decoration: underline;
    }
    #help:hover {
      cursor: help;
    }
    button {
      box-sizing: border-box;
      border-radius: 5px;
      color: var(--primary);
      background-color: var(--primary-lightest-2);
      outline-color: currentColor;

      min-width: 4rem;
      min-height: 1.6rem;
      border: none;
      border-radius: 5px;
      outline-style: solid;
    }
    button:hover {
      background-color: var(--primary-lightest-1);
    }

    @media (prefers-color-scheme: dark) {
      #brstm-explanation::backdrop {
        background-color: rgba(255, 255, 255, 0.3);
        backdrop-filter: blur(5px);
      }
      button {
        color: var(--main-text-color);
      }
    }
  `;It([w()],Pe.prototype,"dialogOpen",2);Pe=It([V("nikku-help")],Pe);/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Ut=Symbol("Comlink.proxy"),Fs=Symbol("Comlink.endpoint"),js=Symbol("Comlink.releaseProxy"),ze=Symbol("Comlink.finalizer"),Ae=Symbol("Comlink.thrown"),Bt=t=>typeof t=="object"&&t!==null||typeof t=="function",Ys={canHandle:t=>Bt(t)&&t[Ut],serialize(t){const{port1:e,port2:s}=new MessageChannel;return Ht(t,e),[s,[s]]},deserialize(t){return t.start(),zt(t)}},Zs={canHandle:t=>Bt(t)&&Ae in t,serialize({value:t}){let e;return t instanceof Error?e={isError:!0,value:{message:t.message,name:t.name,stack:t.stack}}:e={isError:!1,value:t},[e,[]]},deserialize(t){throw t.isError?Object.assign(new Error(t.value.message),t.value):t.value}},Vt=new Map([["proxy",Ys],["throw",Zs]]);function Ks(t,e){for(const s of t)if(e===s||s==="*"||s instanceof RegExp&&s.test(e))return!0;return!1}function Ht(t,e=globalThis,s=["*"]){e.addEventListener("message",function i(r){if(!r||!r.data)return;if(!Ks(s,r.origin)){console.warn(`Invalid origin '${r.origin}' for comlink proxy`);return}const{id:n,type:o,path:h}=Object.assign({path:[]},r.data),a=(r.data.argumentList||[]).map(z);let c;try{const p=h.slice(0,-1).reduce((f,A)=>f[A],t),u=h.reduce((f,A)=>f[A],t);switch(o){case"GET":c=u;break;case"SET":p[h.slice(-1)[0]]=z(r.data.value),c=!0;break;case"APPLY":c=u.apply(p,a);break;case"CONSTRUCT":{const f=new u(...a);c=Js(f)}break;case"ENDPOINT":{const{port1:f,port2:A}=new MessageChannel;Ht(t,A),c=Yt(f,[f])}break;case"RELEASE":c=void 0;break;default:return}}catch(p){c={value:p,[Ae]:0}}Promise.resolve(c).catch(p=>({value:p,[Ae]:0})).then(p=>{const[u,f]=Me(p);e.postMessage(Object.assign(Object.assign({},u),{id:n}),f),o==="RELEASE"&&(e.removeEventListener("message",i),Wt(e),ze in t&&typeof t[ze]=="function"&&t[ze]())}).catch(p=>{const[u,f]=Me({value:new TypeError("Unserializable return value"),[Ae]:0});e.postMessage(Object.assign(Object.assign({},u),{id:n}),f)})}),e.start&&e.start()}function Xs(t){return t.constructor.name==="MessagePort"}function Wt(t){Xs(t)&&t.close()}function zt(t,e){const s=new Map;return t.addEventListener("message",function(r){const{data:n}=r;if(!n||!n.id)return;const o=s.get(n.id);if(o)try{o(n)}finally{s.delete(n.id)}}),je(t,s,[],e)}function $e(t){if(t)throw new Error("Proxy has been released and is not useable")}function Ft(t){return Q(t,new Map,{type:"RELEASE"}).then(()=>{Wt(t)})}const ke=new WeakMap,Oe="FinalizationRegistry"in globalThis&&new FinalizationRegistry(t=>{const e=(ke.get(t)||0)-1;ke.set(t,e),e===0&&Ft(t)});function qs(t,e){const s=(ke.get(e)||0)+1;ke.set(e,s),Oe&&Oe.register(t,e,t)}function Gs(t){Oe&&Oe.unregister(t)}function je(t,e,s=[],i=function(){}){let r=!1;const n=new Proxy(i,{get(o,h){if($e(r),h===js)return()=>{Gs(n),Ft(t),e.clear(),r=!0};if(h==="then"){if(s.length===0)return{then:()=>n};const a=Q(t,e,{type:"GET",path:s.map(c=>c.toString())}).then(z);return a.then.bind(a)}return je(t,e,[...s,h])},set(o,h,a){$e(r);const[c,p]=Me(a);return Q(t,e,{type:"SET",path:[...s,h].map(u=>u.toString()),value:c},p).then(z)},apply(o,h,a){$e(r);const c=s[s.length-1];if(c===Fs)return Q(t,e,{type:"ENDPOINT"}).then(z);if(c==="bind")return je(t,e,s.slice(0,-1));const[p,u]=bt(a);return Q(t,e,{type:"APPLY",path:s.map(f=>f.toString()),argumentList:p},u).then(z)},construct(o,h){$e(r);const[a,c]=bt(h);return Q(t,e,{type:"CONSTRUCT",path:s.map(p=>p.toString()),argumentList:a},c).then(z)}});return qs(n,t),n}function Qs(t){return Array.prototype.concat.apply([],t)}function bt(t){const e=t.map(Me);return[e.map(s=>s[0]),Qs(e.map(s=>s[1]))]}const jt=new WeakMap;function Yt(t,e){return jt.set(t,e),t}function Js(t){return Object.assign(t,{[Ut]:!0})}function Me(t){for(const[e,s]of Vt)if(s.canHandle(t)){const[i,r]=s.serialize(t);return[{type:"HANDLER",name:e,value:i},r]}return[{type:"RAW",value:t},jt.get(t)||[]]}function z(t){switch(t.type){case"HANDLER":return Vt.get(t.name).deserialize(t.value);case"RAW":return t.value}}function Q(t,e,s,i){return new Promise(r=>{const n=er();e.set(n,r),t.start&&t.start(),t.postMessage(Object.assign({id:n},s),i)})}function er(){return new Array(4).fill(0).map(()=>Math.floor(Math.random()*Number.MAX_SAFE_INTEGER).toString(16)).join("-")}var tr=Symbol("getEndpoint"),sr=t=>{const e=zt(t);return new Proxy(e,{get(s,i,r){return i===tr?t:Reflect.get(s,i,r)}})};/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const X=st(class extends rt{constructor(t){var e;if(super(t),t.type!==tt.ATTRIBUTE||t.name!=="class"||((e=t.strings)==null?void 0:e.length)>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter((e=>t[e])).join(" ")+" "}update(t,[e]){var i,r;if(this.st===void 0){this.st=new Set,t.strings!==void 0&&(this.nt=new Set(t.strings.join(" ").split(/\s/).filter((n=>n!==""))));for(const n in e)e[n]&&!((i=this.nt)!=null&&i.has(n))&&this.st.add(n);return this.render(e)}const s=t.element.classList;for(const n of this.st)n in e||(s.remove(n),this.st.delete(n));for(const n in e){const o=!!e[n];o===this.st.has(n)||(r=this.nt)!=null&&r.has(n)||(o?(s.add(n),this.st.add(n)):(s.remove(n),this.st.delete(n)))}return U}});var ee,L,te;class Zt{constructor({renderCallback:e}){$(this,ee,!1);$(this,L,null);$(this,te);d(this,L,null),d(this,te,e),this.render=this.render.bind(this)}start(){d(this,ee,!0),d(this,L,requestAnimationFrame(this.render))}stop(){l(this,L)&&cancelAnimationFrame(l(this,L)),d(this,ee,!1)}render(){l(this,te)&&l(this,te).call(this),l(this,ee)&&d(this,L,requestAnimationFrame(this.render))}}ee=new WeakMap,L=new WeakMap,te=new WeakMap;const rr=`// @ts-check\r
// Cannot be in TypeScript yet\r
// See: https://github.com/vitejs/vite/discussions/3804\r
/** @typedef {import('brstm').TrackDescription} TrackDescription */\r
/** @typedef {Array<boolean>} AudioPlayerTrackStates */\r
/**\r
 * @typedef {Object} AudioSourceNodeOptions\r
 * @property {number=} numberOfInputs\r
 * @property {number=} numberOfOutputs\r
 * @property {number=} outputChannelCount\r
 * @property {Record<string, number>=} parameterData\r
 * @property {any=} processorOptions\r
 */\r
\r
/**\r
 * Purpose:\r
 * - All-in-one source node\r
 *\r
 * Features:\r
 * - Buffer can be dynamically updated\r
 *   - Use case: Decode first block, then write here, \r
 *     and can be used for playing already!\r
 *     Afterwards, next blocks can be written and\r
 *     no need to disconnect/reconnect nodes\r
 * - Support buffer looping.\r
 *   - NOTE: currently loop end = buffer end,\r
 *     but support can be added for custom loop end in the future\r
 * - Support seeking to certain time\r
 * - Query accurate playback timestamp\r
 */\r
class AudioSourceNode extends AudioWorkletProcessor {\r
  /**\r
   *\r
   * @param {AudioSourceNodeOptions=} options\r
   */\r
  constructor(options) {\r
    super();\r
    /** @type {Float32Array[][]} segments of multi-channel samples */\r
    this.samples = [options?.processorOptions?.initialSamples];\r
    /** @type {Array<number>} list of offsets, each for each segment in this.samples */\r
    this.samplesOffsets = [0];\r
\r
    /** @type {AudioPlayerTrackStates} */\r
    this.trackStates = options?.processorOptions?.trackStates || {};\r
    /** @type {TrackDescription[]} */\r
    this.trackDescriptions = options?.processorOptions?.trackDescriptions || [];\r
    /** @type {boolean} */\r
    this.shouldLoop = options?.processorOptions?.shouldLoop || true;\r
\r
    /** @type {number} */\r
    this.totalSamples = options?.processorOptions?.totalSamples || 0;\r
    /** @type {number} */\r
    this.sampleRate = options?.processorOptions?.sampleRate || 44100;\r
    /** @type {number} */\r
    this.loopStartSample = options?.processorOptions?.loopStartSample || 0;\r
\r
    /** @type {number} */\r
    this._bufferHead = 0;\r
\r
    this.port.onmessage = (event) => {\r
      switch (event.data.type) {\r
        case 'ADD_SAMPLES': {\r
          const samples = /** @type {Float32Array[]} */ (\r
            event.data.payload.samples\r
          );\r
          const offset = /** @type {number} */ (event.data.payload.offset);\r
\r
          this.samples.push(samples);\r
          this.samplesOffsets.push(offset);\r
          console.log('[AudioSourceNode] ADD_SAMPLES', samples.length, offset);\r
          break;\r
        }\r
        case 'UPDATE_TRACK_STATES': {\r
          this.trackStates = /** @type {AudioPlayerTrackStates} */ (\r
            event.data.payload.trackStates\r
          );\r
          console.log(\r
            '[AudioSourceNode] UPDATE_TRACK_STATES',\r
            this.trackStates\r
          );\r
          break;\r
        }\r
        case 'SEEK': {\r
          const playbackTimeInS = /** @type {number} */ (\r
            event.data.payload.playbackTimeInS\r
          );\r
          this._bufferHead = Math.floor(playbackTimeInS * this.sampleRate);\r
          console.log('[AudioSourceNode] SEEK', playbackTimeInS);\r
          break;\r
        }\r
        case 'UPDATE_SHOULD_LOOP': {\r
          this.shouldLoop = /** @type {boolean} */ (\r
            event.data.payload.shouldLoop\r
          );\r
          console.log('[AudioSourceNode] UPDATE_SHOULD_LOOP', this.shouldLoop);\r
          break;\r
        }\r
        case 'TIMESTAMP_QUERY': {\r
          this.port.postMessage({\r
            type: 'TIMESTAMP_REPLY',\r
            payload: {\r
              timestamp: this._bufferHead / this.sampleRate,\r
            },\r
          });\r
          break;\r
        }\r
      }\r
    };\r
  }\r
\r
  /**\r
   *\r
   * @param {number} s sample index\r
   * @returns {number} segment index\r
   */\r
  getSegmentIndex(s) {\r
    // https://en.wikipedia.org/wiki/Binary_search_algorithm#Alternative_procedure\r
    let l = 0,\r
      r = this.samplesOffsets.length - 1;\r
    while (l !== r) {\r
      let mid = Math.ceil((l + r) / 2);\r
      if (this.samplesOffsets[mid] > s) {\r
        r = mid - 1;\r
      } else {\r
        l = mid;\r
      }\r
    }\r
    return l;\r
  }\r
\r
  /**\r
   *\r
   * @param {Array<Array<Float32Array>>} _inputs\r
   * @param {Array<Array<Float32Array>>} outputs\r
   * @param {Object} _parameters\r
   * @returns {boolean}\r
   */\r
  process(_inputs, outputs, _parameters) {\r
    const output = outputs[0];\r
    if (!output || !output.length || !output[0].length) {\r
      return false;\r
    }\r
    let absoluteSampleIndex = this._bufferHead;\r
\r
    for (let s = 0; s < output[0].length; s++) {\r
      if (absoluteSampleIndex >= this.totalSamples) {\r
        // We've reached the end, just output 0\r
        output[0][s] = 0;\r
        output[1][s] = 0;\r
        continue;\r
      }\r
      // Our samples are distributed in segments\r
      const i = this.getSegmentIndex(absoluteSampleIndex);\r
\r
      const segmentOffset = this.samplesOffsets[i];\r
      const segment = this.samples[i];\r
      const segmentSampleIndex = absoluteSampleIndex - segmentOffset;\r
\r
      // Mixing tracks, basically summing all active tracks together\r
      let sums = [0, 0];\r
      for (\r
        let trackIndex = 0, channelIndex = 0;\r
        trackIndex < this.trackStates.length;\r
        trackIndex++\r
      ) {\r
        // Not all tracks have 2 channels, must read from track descriptions\r
        const trackChannelCount =\r
          this.trackDescriptions[trackIndex].numberChannels;\r
\r
        if (this.trackStates[trackIndex]) {\r
          const finalOddTrackChannelCountIndex =\r
            trackChannelCount - (trackChannelCount % 2);\r
\r
          // Distribute left-right for first (N - (N % 2))\r
          for (let tc = 0; tc < finalOddTrackChannelCountIndex; tc++) {\r
            sums[tc % 2] += segment[channelIndex + tc][segmentSampleIndex];\r
          }\r
\r
          // Put the final odd track into both left and right output\r
          if (trackChannelCount % 2 === 1) {\r
            sums[0] +=\r
              segment[channelIndex + finalOddTrackChannelCountIndex][\r
                segmentSampleIndex\r
              ];\r
            sums[1] +=\r
              segment[channelIndex + finalOddTrackChannelCountIndex][\r
                segmentSampleIndex\r
              ];\r
          }\r
        }\r
        channelIndex += trackChannelCount;\r
      }\r
\r
      output[0][s] = clamp(sums[0], -1, 1);\r
      output[1][s] = clamp(sums[1], -1, 1);\r
\r
      absoluteSampleIndex += 1;\r
      if (absoluteSampleIndex >= this.totalSamples) {\r
        if (this.shouldLoop) {\r
          absoluteSampleIndex = this.loopStartSample;\r
          this.port.postMessage({\r
            type: 'BUFFER_LOOPED',\r
          });\r
        } else {\r
          this.port.postMessage({\r
            type: 'BUFFER_ENDED',\r
          });\r
        }\r
      }\r
    }\r
\r
    this._bufferHead = absoluteSampleIndex;\r
    return true;\r
  }\r
}\r
\r
/**\r
 *\r
 * @param {number} value\r
 * @param {number} min\r
 * @param {number} max\r
 * @returns {number}\r
 */\r
function clamp(value, min, max) {\r
  return value <= min ? min : value >= max ? max : value;\r
}\r
\r
registerProcessor('audio-source-processor', AudioSourceNode);\r
`;var v,S,g,P,j,D,I,k,N,M,q,Ye,Kt;class ir{constructor(e){$(this,q);$(this,v);$(this,S);$(this,g);$(this,P);$(this,j);$(this,D);$(this,I);$(this,k);$(this,N);$(this,M);this.metadata=null,d(this,v,null),d(this,S,[]),d(this,g,null),d(this,P,null),d(this,j,0),d(this,D,!1),d(this,I,!0),d(this,k,!1),d(this,N,0),d(this,M,null),this.options=e,this.init()}async init(e){if(e){if(this.metadata=e,d(this,v,new AudioContext({sampleRate:e.sampleRate})),l(this,v).audioWorklet){const s=new Blob([rr],{type:"text/javascript"}),i=URL.createObjectURL(s);try{await l(this,v).audioWorklet.addModule(i)}finally{URL.revokeObjectURL(i)}}d(this,M,new Zt({renderCallback:be(this,q,Kt).bind(this)}))}else this.metadata=null,d(this,v,null),d(this,M,null);if(d(this,S,[!0]),this.metadata&&this.metadata.numberTracks>1){d(this,S,[]);for(let s=0;s<this.metadata.numberTracks;s++)s===0?l(this,S).push(!0):l(this,S).push(!1)}d(this,g,null),d(this,P,null),d(this,j,0),d(this,D,!0),d(this,I,!1),d(this,k,!1),d(this,N,1)}async destroy(){await this.pause(),this.init()}async start(){if(!this.metadata||!l(this,v))return;const{totalSamples:e,sampleRate:s}=this.metadata,i=e/s,r=Math.min(i,3),n=r*s;console.time("getSamples");const o=await this.options.decodeSamples(0,n);console.timeEnd("getSamples"),be(this,q,Ye).call(this,o,0);const h=[];for(let a=r;a<i;a+=10)a+10<i?h.push({offset:a,size:10}):h.push({offset:a,size:i-a});(async()=>{for(const a of h){console.time("getSamples");const c=await this.options.decodeSamples(a.offset*s,a.size*s);console.timeEnd("getSamples"),be(this,q,Ye).call(this,c,a.offset*s)}})()}initPlayback(e){if(!this.metadata||!l(this,v)||l(this,N)==null)return;const{loopStartSample:s,totalSamples:i,sampleRate:r,trackDescriptions:n}=this.metadata;d(this,g,new AudioWorkletNode(l(this,v),"audio-source-processor",{numberOfInputs:0,numberOfOutputs:1,outputChannelCount:[2],processorOptions:{initialSamples:e,loopStartSample:s,totalSamples:i,sampleRate:r,shouldLoop:l(this,D),trackDescriptions:n,trackStates:l(this,S)}})),l(this,g).port&&(l(this,g).port.addEventListener("message",o=>{switch(o.data.type){case"BUFFER_LOOPED":{console.log("[AudioPlayer]",o.data.type);break}case"BUFFER_ENDED":{console.log("[AudioPlayer]",o.data.type),this.pause(),d(this,I,!0);break}case"TIMESTAMP_REPLY":{d(this,j,o.data.payload.timestamp);break}}}),l(this,g).port.start()),d(this,P,l(this,v).createGain()),l(this,P).gain.value=l(this,N),l(this,g).connect(l(this,P)),l(this,P).connect(l(this,v).destination),d(this,I,!1)}async seek(e){l(this,v)&&(l(this,g)&&l(this,g).port.postMessage({type:"SEEK",payload:{playbackTimeInS:e}}),l(this,k)||await this.play())}async play(){var e;l(this,k)||!l(this,v)||(d(this,k,!0),(e=l(this,M))==null||e.start(),this.options.onPlay(),await l(this,v).resume(),l(this,I)&&this.seek(0))}async pause(){var e;!l(this,k)||!l(this,v)||(d(this,k,!1),(e=l(this,M))==null||e.stop(),this.options.onPause(),await l(this,v).suspend())}async setTrackStates(e){d(this,S,e),l(this,g)&&l(this,g).port.postMessage({type:"UPDATE_TRACK_STATES",payload:{trackStates:l(this,S)}})}async setVolume(e){d(this,N,e),l(this,P)&&(l(this,P).gain.value=e)}setLoop(e){d(this,D,e),l(this,g)&&l(this,g).port.postMessage({type:"UPDATE_SHOULD_LOOP",payload:{shouldLoop:l(this,D)}})}getCurrrentPlaybackTime(){return l(this,g)?l(this,j):0}}v=new WeakMap,S=new WeakMap,g=new WeakMap,P=new WeakMap,j=new WeakMap,D=new WeakMap,I=new WeakMap,k=new WeakMap,N=new WeakMap,M=new WeakMap,q=new WeakSet,Ye=function(e,s=0){var i;!this.metadata||!l(this,v)||(s===0?(this.initPlayback(e),(i=l(this,M))==null||i.start(),d(this,k,!0),this.options.onPlay()):l(this,g)&&l(this,g).port.postMessage({type:"ADD_SAMPLES",payload:{samples:e,offset:s}},e.map(r=>r.buffer)))},Kt=function(){l(this,g)&&l(this,g).port.postMessage({type:"TIMESTAMP_QUERY"})};var nr=Object.defineProperty,or=Object.getOwnPropertyDescriptor,Xt=t=>{throw TypeError(t)},x=(t,e,s,i)=>{for(var r=i>1?void 0:i?or(e,s):e,n=t.length-1,o;n>=0;n--)(o=t[n])&&(r=(i?o(e,s,r):o(r))||r);return i&&r&&nr(e,s,r),r},ar=(t,e,s)=>e.has(t)||Xt("Cannot "+s),lr=(t,e,s)=>e.has(t)?Xt("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,s),C=(t,e,s)=>(ar(t,e,"access private method"),s),b,fe,qt,Gt,it,Qt,Jt,es,ts,ss,rs;let y=class extends E{constructor(){super(...arguments),lr(this,b),this.playPauseIcon="play",this.loop="on",this.volume=1,this.muted=!1,this.progressMax=0,this.progressValue=0,this.timeDisplayMax=0,this.timeDisplayValue=0,this.tracksCount=1,this.tracksActive=[!0],this.disabled=!0,this.fileDraggingOver=!1,this.trackTitle="",this.errorMessage="",this.audioPlayer=null,this.workerInstance=sr(new Worker(new URL("/nikku/assets/worker-CCV0hI0x.js",import.meta.url),{})),this.timer=new Zt({renderCallback:()=>{if(!this.audioPlayer)return;const t=this.audioPlayer.getCurrrentPlaybackTime();this.progressValue=t,this.timeDisplayValue=t}})}render(){return O`
      <div
        id="error"
        class=${X({hidden:!this.errorMessage})}
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
            @tracksActiveChange=${C(this,b,Qt)}
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
            @progressValueChange=${C(this,b,es)}
          ></controls-progress>
        </div>
        <label id="controls-select-file-container">
          <input
            type="file"
            id="controls-select-file"
            accept=".brstm"
            @change=${C(this,b,Gt)}
          />
          <span id="controls-select-file-custom"></span>
        </label>

        <div id="controls-play-pause">
          <controls-play-pause
            ?disabled=${this.disabled}
            mode=${this.playPauseIcon}
            @playPauseClick=${C(this,b,Jt)}
          ></controls-play-pause>
        </div>
        <div id="controls-others">
          <controls-loop
            ?disabled=${this.disabled}
            mode=${this.loop}
            @loopClick=${C(this,b,ts)}
          ></controls-loop>
          <controls-volume
            ?disabled=${this.disabled}
            ?muted=${this.muted}
            volume=${this.volume}
            @mutedChange=${C(this,b,ss)}
            @volumeChange=${C(this,b,rs)}
          ></controls-volume>
        </div>
      </main>
      <div
        id="drag-and-drop-overlay"
        class=${X({hidden:!this.fileDraggingOver})}
      >
        Drop BRSTM file to start playback
      </div>
    `}firstUpdated(){window.addEventListener("dragover",t=>{t.preventDefault(),this.fileDraggingOver=!0}),window.addEventListener("dragend",t=>{this.fileDraggingOver=!1}),window.addEventListener("dragleave",t=>{this.fileDraggingOver=!1}),window.addEventListener("drop",t=>{if(t.preventDefault(),this.fileDraggingOver=!1,!t.dataTransfer||!t.dataTransfer.items||!t.dataTransfer.items[0]||t.dataTransfer.items[0].kind!=="file"){C(this,b,fe).call(this,new Error("No file read"));return}const e=t.dataTransfer.items[0].getAsFile();if(!e){C(this,b,fe).call(this,new Error("No file read"));return}is(e).then(C(this,b,it).bind(this))})}};b=new WeakSet;fe=function(t){this.errorMessage=t.message+(t.stack?`
`+t.stack:"")};qt=function(){this.errorMessage=""};Gt=function(t){const e=t.target.files;if(!e||!e.length){C(this,b,fe).call(this,new Error("No file read"));return}const s=e[0];is(s).then(C(this,b,it).bind(this))};it=async function({buffer:t,file:e}){var s;if(C(this,b,qt).call(this),!(!t||!(t instanceof ArrayBuffer))){e.name&&(this.trackTitle=e.name);try{await this.workerInstance.init(Yt(t,[t]));const i=await this.workerInstance.getMetadata();if(this.audioPlayer?await this.audioPlayer.destroy():this.audioPlayer=new ir({onPlay:()=>{this.playPauseIcon="pause",this.timer.start()},onPause:()=>{this.playPauseIcon="play",this.timer.stop()},decodeSamples:async(o,h)=>await this.workerInstance.getSamples(o,h)||[]}),!i)throw new Error("metadata is undefined");await this.audioPlayer.init(i),await this.audioPlayer.start();const r=i.totalSamples/i.sampleRate,n=i.numberTracks;this.muted?this.audioPlayer.setVolume(0):this.audioPlayer.setVolume(this.volume),this.playPauseIcon="pause",this.progressMax=r,this.timeDisplayMax=r,this.tracksCount=n,this.tracksActive=new Array(n).fill(!0).map((o,h)=>h===0),this.disabled=!1,(s=this.audioPlayer)==null||s.play()}catch(i){C(this,b,fe).call(this,i)}}};Qt=function(t){var s;const e=t.detail.active;this.tracksActive=e,(s=this.audioPlayer)==null||s.setTrackStates(e)};Jt=function(t){var s,i;const e=t.detail.mode;this.playPauseIcon=e,e==="play"?(s=this.audioPlayer)==null||s.pause():e==="pause"&&((i=this.audioPlayer)==null||i.play())};es=function(t){var s;const e=t.detail.value;this.progressValue=e,this.timeDisplayValue=e,(s=this.audioPlayer)==null||s.seek(e)};ts=function(t){var s,i;const e=t.detail.mode;this.loop=e,e==="on"?(s=this.audioPlayer)==null||s.setLoop(!0):e==="off"&&((i=this.audioPlayer)==null||i.setLoop(!1))};ss=function(t){var s,i;const e=t.detail.muted;this.muted=e,e?(s=this.audioPlayer)==null||s.setVolume(0):(i=this.audioPlayer)==null||i.setVolume(this.volume)};rs=function(t){var s;const e=t.detail.volume;this.volume=e,this.muted=!1,(s=this.audioPlayer)==null||s.setVolume(e)};y.styles=B`
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
      grid-template-columns: 2fr 80px 1fr 1fr;
      grid-template-rows: 20px 15px 24px 80px auto;
      row-gap: 10px;
      column-gap: 2rem;
      margin-bottom: 10px;
    }
    #track-title {
      grid-column: 1 / span 3;
      grid-row: 1;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    #controls-time-display {
      grid-column: 4;
      grid-row: 1;
    }
    #controls-progress {
      grid-column: 1 / span 4;
      grid-row: 2;
    }
    #controls-select-file-container {
      grid-column: 1 / span 4;
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
      grid-column: 3 / span 2;
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
  `;x([w()],y.prototype,"playPauseIcon",2);x([w()],y.prototype,"loop",2);x([w()],y.prototype,"volume",2);x([w()],y.prototype,"muted",2);x([w()],y.prototype,"progressMax",2);x([w()],y.prototype,"progressValue",2);x([w()],y.prototype,"timeDisplayMax",2);x([w()],y.prototype,"timeDisplayValue",2);x([w()],y.prototype,"tracksCount",2);x([w()],y.prototype,"tracksActive",2);x([w()],y.prototype,"disabled",2);x([w()],y.prototype,"fileDraggingOver",2);x([w()],y.prototype,"trackTitle",2);x([w()],y.prototype,"errorMessage",2);y=x([V("nikku-main")],y);function is(t){return new Promise(e=>{const s=new FileReader;s.addEventListener("loadend",i=>{const r=s.result;e({buffer:r,file:t})}),s.readAsArrayBuffer(t)})}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class Ze extends rt{constructor(e){if(super(e),this.it=m,e.type!==tt.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(e){if(e===m||e==null)return this._t=void 0,this.it=e;if(e===U)return e;if(typeof e!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(e===this.it)return this._t;this.it=e;const s=[e];return s.raw=s,this._t={_$litType$:this.constructor.resultType,strings:s,values:[]}}}Ze.directiveName="unsafeHTML",Ze.resultType=1;const me=st(Ze),hr=`<svg width="100" height="100" viewBox="0 0 100 100" fill="#198813" xmlns="http://www.w3.org/2000/svg">\r
<path d="M77.9375 48.2609C79.2874 49.0274 79.2874 50.9726 77.9375 51.7391L38.2376 74.2841C36.9043 75.0413 35.25 74.0783 35.25 72.545L35.25 27.455C35.25 25.9217 36.9044 24.9587 38.2376 25.7159L77.9375 48.2609Z" />\r
</svg>\r
`,dr=`<svg width="100" height="100" viewBox="0 0 100 100" fill="#198813" xmlns="http://www.w3.org/2000/svg">\r
<rect x="27" y="28" width="16" height="45" rx="2" />\r
<rect x="58" y="28" width="15" height="45" rx="2" />\r
</svg>\r
`;var cr=Object.defineProperty,ur=Object.getOwnPropertyDescriptor,ns=t=>{throw TypeError(t)},nt=(t,e,s,i)=>{for(var r=i>1?void 0:i?ur(e,s):e,n=t.length-1,o;n>=0;n--)(o=t[n])&&(r=(i?o(e,s,r):o(r))||r);return i&&r&&cr(e,s,r),r},pr=(t,e,s)=>e.has(t)||ns("Cannot "+s),fr=(t,e,s)=>e.has(t)?ns("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,s),mr=(t,e,s)=>(pr(t,e,"access private method"),s),Ke,os;let ge=class extends E{constructor(){super(...arguments),fr(this,Ke),this.disabled=!1,this.mode="play"}render(){return O`<button
      class=${X({button:!0,disabled:this.disabled})}
      ?disabled=${this.disabled}
      @click=${mr(this,Ke,os)}
    >
      ${this.mode==="play"?me(hr):me(dr)}
    </button>`}};Ke=new WeakSet;os=function(){if(this.disabled)return;const t=this.mode==="play"?"pause":"play";this.dispatchEvent(new CustomEvent("playPauseClick",{detail:{mode:t}})),this.mode=t};ge.styles=B`
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
  `;nt([_({type:Boolean})],ge.prototype,"disabled",2);nt([_({type:String})],ge.prototype,"mode",2);ge=nt([V("controls-play-pause")],ge);var gr=Object.defineProperty,vr=Object.getOwnPropertyDescriptor,Le=(t,e,s,i)=>{for(var r=i>1?void 0:i?vr(e,s):e,n=t.length-1,o;n>=0;n--)(o=t[n])&&(r=(i?o(e,s,r):o(r))||r);return i&&r&&gr(e,s,r),r};let re=class extends E{constructor(){super(...arguments),this.active=[],this.count=0,this.disabled=!1}render(){return O`
      <div
        id="container"
        class=${X({hidden:this.count===1||this.disabled})}
      >
        Active tracks:
        <ol id="list">
          ${Array(this.count).fill(0).map((t,e)=>O`<li>
                <label>
                  <input
                    type="checkbox"
                    ?checked="${this.active[e]}"
                    @input=${s=>{const i=s.target.checked,r=[...this.active];r[e]=i,this.active=r,this.dispatchEvent(new CustomEvent("tracksActiveChange",{detail:{active:r}}))}}
                  />
                  Track ${e+1}
                </label>
              </li>`)}
        </ol>
      </div>
    `}};re.styles=B`
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
  `;Le([_({type:Array})],re.prototype,"active",2);Le([_({type:Number})],re.prototype,"count",2);Le([_({type:Boolean})],re.prototype,"disabled",2);re=Le([V("controls-tracks")],re);var yr=Object.defineProperty,_r=Object.getOwnPropertyDescriptor,De=(t,e,s,i)=>{for(var r=i>1?void 0:i?_r(e,s):e,n=t.length-1,o;n>=0;n--)(o=t[n])&&(r=(i?o(e,s,r):o(r))||r);return i&&r&&yr(e,s,r),r};let ie=class extends E{constructor(){super(...arguments),this.disabled=!1,this.value=0,this.max=0}render(){return O` <div class="progress-time-display">
      <div class="time" id="current">${$t(this.value)}</div>
      <div class="separator">/</div>
      <div class="time" id="total">${$t(this.max)}</div>
    </div>`}};ie.styles=B`
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
  `;De([_({type:Boolean})],ie.prototype,"disabled",2);De([_({type:Number})],ie.prototype,"value",2);De([_({type:Number})],ie.prototype,"max",2);ie=De([V("controls-time-display")],ie);function $t(t){const e=wt(Math.floor(t/60)),s=wt(Math.floor(t%60));return`${e}:${s}`}function wt(t){return t<10?`0${t}`:t}var br=Object.defineProperty,$r=Object.getOwnPropertyDescriptor,as=t=>{throw TypeError(t)},Ie=(t,e,s,i)=>{for(var r=i>1?void 0:i?$r(e,s):e,n=t.length-1,o;n>=0;n--)(o=t[n])&&(r=(i?o(e,s,r):o(r))||r);return i&&r&&br(e,s,r),r},ls=(t,e,s)=>e.has(t)||as("Cannot "+s),xt=(t,e,s)=>(ls(t,e,"read from private field"),s?s.call(t):e.get(t)),wr=(t,e,s)=>e.has(t)?as("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,s),At=(t,e,s,i)=>(ls(t,e,"write to private field"),e.set(t,s),s),J;let ne=class extends E{constructor(){super(...arguments),this.disabled=!1,this.value=0,this.max=0,wr(this,J,!1),this._cachedProgressBarOffsetLeft=null,this._cachedProgressBarClientWidth=null,this.progressBar=Y(),this.progressActive=Y(),this.progressIndicator=Y(),this.updateProgressFromEvent=t=>{this.refreshCachedValues();let e=0;t instanceof MouseEvent?e=t.clientX:t instanceof TouchEvent&&(e=t.touches[0].clientX);const s=Math.min(1,Math.max(0,(e-(this._cachedProgressBarOffsetLeft??0))/(this._cachedProgressBarClientWidth??1)))*this.max;this.dispatchEvent(new CustomEvent("progressValueChange",{detail:{value:s}})),this.value=s},this.handleDraggingStart=t=>{this.disabled||xt(this,J)||(At(this,J,!0),this.updateProgressFromEvent(t))},this.handleDraggingMove=t=>{this.disabled||!xt(this,J)||this.updateProgressFromEvent(t)},this.handleDraggingEnd=t=>{this.disabled||At(this,J,!1)},this.handleWindowResize=()=>{this._cachedProgressBarOffsetLeft=null,this._cachedProgressBarClientWidth=null,this.refreshCachedValues()}}get percentage(){return this.max<=0?0:this.value/this.max}render(){return O`
      <div class="progress-bar-container">
        <div
          class=${X({"progress-bar":!0,disabled:this.disabled})}
          ${Z(this.progressBar)}
        >
          <div class="progress-background"></div>
          <div class="progress-active" ${Z(this.progressActive)}></div>
          <div class="progress-indicator" ${Z(this.progressIndicator)}></div>
        </div>
      </div>
    `}updated(t){t.has("value")&&this.updateStyles()}updateStyles(){this.progressIndicator.value&&(this.progressIndicator.value.style.transform=`translateX(calc(${this.percentage*(this._cachedProgressBarClientWidth??0)}px - 50%))`),this.progressActive.value&&(this.progressActive.value.style.transform=`scaleX(${this.percentage})`)}refreshCachedValues(){var t,e;this._cachedProgressBarOffsetLeft||(this._cachedProgressBarOffsetLeft=((t=this.progressBar.value)==null?void 0:t.offsetLeft)??0),(!this._cachedProgressBarClientWidth||this._cachedProgressBarClientWidth===1)&&(this._cachedProgressBarClientWidth=((e=this.progressBar.value)==null?void 0:e.clientWidth)??1),this.updateStyles()}firstUpdated(){var t,e;(t=this.progressBar.value)==null||t.addEventListener("mousedown",this.handleDraggingStart,{passive:!0}),document==null||document.addEventListener("mousemove",this.handleDraggingMove,{passive:!0}),document==null||document.addEventListener("mouseup",this.handleDraggingEnd,{passive:!0}),(e=this.progressBar.value)==null||e.addEventListener("touchstart",this.handleDraggingStart,{passive:!0}),document==null||document.addEventListener("touchmove",this.handleDraggingMove,{passive:!0}),document==null||document.addEventListener("touchend",this.handleDraggingEnd,{passive:!0}),window.addEventListener("resize",this.handleWindowResize),this.refreshCachedValues()}disconnectedCallback(){var t,e;(t=this.progressBar.value)==null||t.removeEventListener("mousedown",this.handleDraggingStart),document==null||document.removeEventListener("mousemove",this.handleDraggingMove),document==null||document.removeEventListener("mouseup",this.handleDraggingEnd),(e=this.progressBar.value)==null||e.removeEventListener("touchstart",this.handleDraggingStart),document==null||document.removeEventListener("touchmove",this.handleDraggingMove),document==null||document.removeEventListener("touchend",this.handleDraggingEnd),window.removeEventListener("resize",this.handleWindowResize)}};J=new WeakMap;ne.styles=B`
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
  `;Ie([_({type:Boolean})],ne.prototype,"disabled",2);Ie([_({type:Number})],ne.prototype,"value",2);Ie([_({type:Number})],ne.prototype,"max",2);ne=Ie([V("controls-progress")],ne);const xr=`<svg width="100" height="100" viewBox="0 0 100 100" fill="#198813" xmlns="http://www.w3.org/2000/svg">\r
<path fill-rule="evenodd" clip-rule="evenodd" d="M37.5858 38C37.851 38 38.1054 37.8946 38.2929 37.7071L48.2929 27.7071C48.9229 27.0771 50 27.5233 50 28.4142V71.5858C50 72.4767 48.9229 72.9228 48.2929 72.2929L38.2929 62.2929C38.1054 62.1054 37.851 62 37.5858 62H21C20.4477 62 20 61.5523 20 61V39C20 38.4477 20.4477 38 21 38H37.5858Z"/>\r
<path fill-rule="evenodd" clip-rule="evenodd" d="M71.9382 50.0662C71.7795 42.8723 68.0938 35.4875 61.0359 30.0266C60.5991 29.6887 60.4988 29.0641 60.8236 28.6175L63.1763 25.3825C63.5012 24.9359 64.1276 24.8362 64.5659 25.1722C72.9864 31.628 77.7327 40.6844 77.9368 49.9338C78.1425 59.2585 73.72 68.4296 64.4895 74.9305C64.038 75.2486 63.4157 75.1236 63.1094 74.6641L60.8906 71.3359C60.5842 70.8764 60.71 70.2565 61.16 69.9364C68.7821 64.5159 72.0959 57.2151 71.9382 50.0662Z"/>\r
<path fill-rule="evenodd" clip-rule="evenodd" d="M89.375 50C89.375 35.887 83.3874 22.0191 71.7151 14.0769C71.2585 13.7662 71.1219 13.1482 71.4201 12.6834L73.5799 9.31661C73.8781 8.85175 74.4987 8.71651 74.9565 9.0254C88.6709 18.2782 95.375 34.2625 95.375 50C95.375 65.7375 88.6709 81.7218 74.9565 90.9746C74.4987 91.2835 73.8781 91.1482 73.5799 90.6834L71.4201 87.3166C71.1219 86.8518 71.2585 86.2338 71.7151 85.9231C83.3874 77.9809 89.375 64.113 89.375 50Z"/>\r
</svg>\r
`,Ar=`<svg width="100" height="100" viewBox="0 0 100 100" fill="#198813" xmlns="http://www.w3.org/2000/svg">\r
<rect x="81.5937" y="36.1014" width="5.02197" height="34.2892" rx="1" transform="rotate(45 81.5937 36.1014)"/>\r
<rect x="85.1447" y="60.3475" width="5.02197" height="34.2892" rx="1" transform="rotate(135 85.1447 60.3475)"/>\r
<path fill-rule="evenodd" clip-rule="evenodd" d="M37.5858 38C37.851 38 38.1054 37.8946 38.2929 37.7071L48.2929 27.7071C48.9229 27.0771 50 27.5233 50 28.4142V71.5858C50 72.4767 48.9229 72.9228 48.2929 72.2929L38.2929 62.2929C38.1054 62.1053 37.851 62 37.5858 62H21C20.4477 62 20 61.5523 20 61V39C20 38.4477 20.4477 38 21 38L37.5858 38Z"/>\r
</svg>\r
`;var Cr=Object.defineProperty,Er=Object.getOwnPropertyDescriptor,hs=t=>{throw TypeError(t)},Ne=(t,e,s,i)=>{for(var r=i>1?void 0:i?Er(e,s):e,n=t.length-1,o;n>=0;n--)(o=t[n])&&(r=(i?o(e,s,r):o(r))||r);return i&&r&&Cr(e,s,r),r},ot=(t,e,s)=>e.has(t)||hs("Cannot "+s),Ct=(t,e,s)=>(ot(t,e,"read from private field"),s?s.call(t):e.get(t)),Et=(t,e,s)=>e.has(t)?hs("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,s),Fe=(t,e,s,i)=>(ot(t,e,"write to private field"),e.set(t,s),s),Sr=(t,e,s)=>(ot(t,e,"access private method"),s),W,Xe,ds;let oe=class extends E{constructor(){super(...arguments),Et(this,Xe),this.disabled=!1,this.muted=!1,this.volume=1,Et(this,W,!1),this._cachedVolumeBarOffsetLeft=null,this._cachedVolumeBarClientWidth=null,this.volumeBarContainer=Y(),this.volumeFill=Y(),this.volumeIndicator=Y(),this.updateVolumeFromEvent=t=>{this.refreshCachedValues();let e=0;t instanceof MouseEvent?e=t.clientX:t instanceof TouchEvent&&(e=t.touches[0].clientX);const s=Math.min(1,Math.max(0,(e-(this._cachedVolumeBarOffsetLeft??0))/(this._cachedVolumeBarClientWidth??1)));this.volume=s,this.dispatchEvent(new CustomEvent("volumeChange",{detail:{volume:s}}))},this.handleDraggingStart=t=>{this.disabled||Ct(this,W)||(Fe(this,W,!0),this.updateVolumeFromEvent(t))},this.handleDraggingMove=t=>{this.disabled||!Ct(this,W)||this.updateVolumeFromEvent(t)},this.handleDraggingEnd=t=>{this.disabled||Fe(this,W,!1)},this.handleWindowResize=()=>{this._cachedVolumeBarOffsetLeft=null,this._cachedVolumeBarClientWidth=null,this.refreshCachedValues()}}render(){return O`<div class="volume-container">
      <div class="volume-icon-container" @click=${Sr(this,Xe,ds)}>
        ${this.muted?me(Ar):me(xr)}
      </div>
      <div
        class=${X({"volume-bar-container":!0,disabled:this.disabled})}
        ${Z(this.volumeBarContainer)}
      >
        <div class="volume-bar">
          <div class="volume-background"></div>
          <div class="volume-fill" ${Z(this.volumeFill)}></div>
          <div class="volume-indicator" ${Z(this.volumeIndicator)}></div>
        </div>
      </div>
    </div>`}updateStyles(){this.volumeIndicator.value&&(this.volumeIndicator.value.style.transform=this.muted?"":`translateX(calc(${this.volume*(this._cachedVolumeBarClientWidth??0)}px - 50%))`),this.volumeFill.value&&(this.volumeFill.value.style.transform=this.muted?"scaleX(0)":`scaleX(${this.volume})`)}refreshCachedValues(){var t,e;this._cachedVolumeBarOffsetLeft||(this._cachedVolumeBarOffsetLeft=((t=this.volumeBarContainer.value)==null?void 0:t.offsetLeft)??0),(!this._cachedVolumeBarClientWidth||this._cachedVolumeBarClientWidth===1)&&(this._cachedVolumeBarClientWidth=((e=this.volumeBarContainer.value)==null?void 0:e.clientWidth)??1),this.updateStyles()}updated(t){(t.has("muted")||t.has("volume"))&&this.updateStyles()}firstUpdated(){var t,e;Fe(this,W,!1),(t=this.volumeBarContainer.value)==null||t.addEventListener("mousedown",this.handleDraggingStart,{passive:!0}),document==null||document.addEventListener("mousemove",this.handleDraggingMove,{passive:!0}),document==null||document.addEventListener("mouseup",this.handleDraggingEnd,{passive:!0}),(e=this.volumeBarContainer.value)==null||e.addEventListener("touchstart",this.handleDraggingStart,{passive:!0}),document==null||document.addEventListener("touchmove",this.handleDraggingMove,{passive:!0}),document==null||document.addEventListener("touchend",this.handleDraggingEnd,{passive:!0}),window.addEventListener("resize",this.handleWindowResize),this.refreshCachedValues()}disconnectedCallback(){var t,e;(t=this.volumeBarContainer.value)==null||t.removeEventListener("mousedown",this.handleDraggingStart),document==null||document.removeEventListener("mousemove",this.handleDraggingMove),document==null||document.removeEventListener("mouseup",this.handleDraggingEnd),(e=this.volumeBarContainer.value)==null||e.removeEventListener("touchstart",this.handleDraggingStart),document==null||document.removeEventListener("touchmove",this.handleDraggingMove),document==null||document.removeEventListener("touchend",this.handleDraggingEnd),window.removeEventListener("resize",this.handleWindowResize)}};W=new WeakMap;Xe=new WeakSet;ds=function(){const t=!this.muted;this.muted=t,this.dispatchEvent(new CustomEvent("mutedChange",{detail:{muted:t}}))};oe.styles=B`
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
  `;Ne([_({type:Boolean})],oe.prototype,"disabled",2);Ne([_({type:Boolean})],oe.prototype,"muted",2);Ne([_({type:Number})],oe.prototype,"volume",2);oe=Ne([V("controls-volume")],oe);const Pr=`<svg width="100" height="100" viewBox="0 0 100 100" fill="#198813" xmlns="http://www.w3.org/2000/svg">\r
<path d="M20 38C20 29.5 26.5 20 38 20L62 20C72 20 80 28 80 38L80 39L70 39C70 39 70 42.5 70 38C70 33.5 66.5 30 62 30C57.5 30 42.5 30 38 30C33.5 30 30 33.5 30 38C30 42.5 30 41 30 41L20 41L20 38Z"/>\r
<path d="M74.5 54L60.2106 39L88.7894 39L74.5 54Z"/>\r
<path d="M79 61C79 69.5 72.5 79 61 79L37 79C27 79 19 71 19 61L19 60L29 60C29 60 29 56.5 29 61C29 65.5 32.5 69 37 69C41.5 69 56.5 69 61 69C65.5 69 69 65.5 69 61C69 56.5 69 58 69 58L79 58L79 61Z"/>\r
<path d="M24.5 45L38.7894 60H10.2106L24.5 45Z"/>\r
</svg>\r
`;var kr=Object.defineProperty,Or=Object.getOwnPropertyDescriptor,cs=t=>{throw TypeError(t)},at=(t,e,s,i)=>{for(var r=i>1?void 0:i?Or(e,s):e,n=t.length-1,o;n>=0;n--)(o=t[n])&&(r=(i?o(e,s,r):o(r))||r);return i&&r&&kr(e,s,r),r},Mr=(t,e,s)=>e.has(t)||cs("Cannot "+s),Tr=(t,e,s)=>e.has(t)?cs("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,s),Lr=(t,e,s)=>(Mr(t,e,"access private method"),s),qe,us;let ve=class extends E{constructor(){super(...arguments),Tr(this,qe),this.disabled=!1,this.mode="on"}render(){return O`<button
      class=${X({on:this.mode==="on",off:this.mode==="off",disabled:this.disabled,button:!0})}
      @click="${Lr(this,qe,us)}"
    >
      ${me(Pr)}
    </button>`}};qe=new WeakSet;us=function(){if(this.disabled)return;const t=this.mode==="on"?"off":"on";this.dispatchEvent(new CustomEvent("loopClick",{detail:{mode:t}})),this.mode=t};ve.styles=B`
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
  `;at([_({type:Boolean})],ve.prototype,"disabled",2);at([_({type:String})],ve.prototype,"mode",2);ve=at([V("controls-loop")],ve);
