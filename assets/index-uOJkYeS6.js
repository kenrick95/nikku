var le=e=>{throw TypeError(e)};var It=(e,t,s)=>t.has(e)||le("Cannot "+s);var a=(e,t,s)=>(It(e,t,"read from private field"),s?s.call(e):t.get(e)),w=(e,t,s)=>t.has(e)?le("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,s),d=(e,t,s,r)=>(It(e,t,"write to private field"),r?r.call(e,s):t.set(e,s),s),Nt=(e,t,s)=>(It(e,t,"access private method"),s);var Rt=(e,t,s,r)=>({set _(i){d(e,t,i,s)},get _(){return a(e,t,r)}});(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function s(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerPolicy&&(n.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?n.credentials="include":i.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function r(i){if(i.ep)return;i.ep=!0;const n=s(i);fetch(i.href,n)}})();/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const vt=globalThis,Qt=vt.ShadowRoot&&(vt.ShadyCSS===void 0||vt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Jt=Symbol(),he=new WeakMap;let Se=class{constructor(t,s,r){if(this._$cssResult$=!0,r!==Jt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=s}get styleSheet(){let t=this.o;const s=this.t;if(Qt&&t===void 0){const r=s!==void 0&&s.length===1;r&&(t=he.get(s)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&he.set(s,t))}return t}toString(){return this.cssText}};const cs=e=>new Se(typeof e=="string"?e:e+"",void 0,Jt),z=(e,...t)=>{const s=e.length===1?e[0]:t.reduce(((r,i,n)=>r+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[n+1]),e[0]);return new Se(s,e,Jt)},ps=(e,t)=>{if(Qt)e.adoptedStyleSheets=t.map((s=>s instanceof CSSStyleSheet?s:s.styleSheet));else for(const s of t){const r=document.createElement("style"),i=vt.litNonce;i!==void 0&&r.setAttribute("nonce",i),r.textContent=s.cssText,e.appendChild(r)}},de=Qt?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let s="";for(const r of t.cssRules)s+=r.cssText;return cs(s)})(e):e;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:us,defineProperty:ms,getOwnPropertyDescriptor:fs,getOwnPropertyNames:gs,getOwnPropertySymbols:ys,getPrototypeOf:vs}=Object,V=globalThis,ce=V.trustedTypes,bs=ce?ce.emptyScript:"",Ut=V.reactiveElementPolyfillSupport,ot=(e,t)=>e,xt={toAttribute(e,t){switch(t){case Boolean:e=e?bs:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let s=e;switch(t){case Boolean:s=e!==null;break;case Number:s=e===null?null:Number(e);break;case Object:case Array:try{s=JSON.parse(e)}catch{s=null}}return s}},Xt=(e,t)=>!us(e,t),pe={attribute:!0,type:String,converter:xt,reflect:!1,hasChanged:Xt};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),V.litPropertyMetadata??(V.litPropertyMetadata=new WeakMap);class G extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,s=pe){if(s.state&&(s.attribute=!1),this._$Ei(),this.elementProperties.set(t,s),!s.noAccessor){const r=Symbol(),i=this.getPropertyDescriptor(t,r,s);i!==void 0&&ms(this.prototype,t,i)}}static getPropertyDescriptor(t,s,r){const{get:i,set:n}=fs(this.prototype,t)??{get(){return this[s]},set(o){this[s]=o}};return{get(){return i==null?void 0:i.call(this)},set(o){const h=i==null?void 0:i.call(this);n.call(this,o),this.requestUpdate(t,h,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??pe}static _$Ei(){if(this.hasOwnProperty(ot("elementProperties")))return;const t=vs(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(ot("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ot("properties"))){const s=this.properties,r=[...gs(s),...ys(s)];for(const i of r)this.createProperty(i,s[i])}const t=this[Symbol.metadata];if(t!==null){const s=litPropertyMetadata.get(t);if(s!==void 0)for(const[r,i]of s)this.elementProperties.set(r,i)}this._$Eh=new Map;for(const[s,r]of this.elementProperties){const i=this._$Eu(s,r);i!==void 0&&this._$Eh.set(i,s)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const s=[];if(Array.isArray(t)){const r=new Set(t.flat(1/0).reverse());for(const i of r)s.unshift(de(i))}else t!==void 0&&s.push(de(t));return s}static _$Eu(t,s){const r=s.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise((s=>this.enableUpdating=s)),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach((s=>s(this)))}addController(t){var s;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((s=t.hostConnected)==null||s.call(t))}removeController(t){var s;(s=this._$EO)==null||s.delete(t)}_$E_(){const t=new Map,s=this.constructor.elementProperties;for(const r of s.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ps(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach((s=>{var r;return(r=s.hostConnected)==null?void 0:r.call(s)}))}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach((s=>{var r;return(r=s.hostDisconnected)==null?void 0:r.call(s)}))}attributeChangedCallback(t,s,r){this._$AK(t,r)}_$EC(t,s){var n;const r=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,r);if(i!==void 0&&r.reflect===!0){const o=(((n=r.converter)==null?void 0:n.toAttribute)!==void 0?r.converter:xt).toAttribute(s,r.type);this._$Em=t,o==null?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,s){var n;const r=this.constructor,i=r._$Eh.get(t);if(i!==void 0&&this._$Em!==i){const o=r.getPropertyOptions(i),h=typeof o.converter=="function"?{fromAttribute:o.converter}:((n=o.converter)==null?void 0:n.fromAttribute)!==void 0?o.converter:xt;this._$Em=i,this[i]=h.fromAttribute(s,o.type),this._$Em=null}}requestUpdate(t,s,r){if(t!==void 0){if(r??(r=this.constructor.getPropertyOptions(t)),!(r.hasChanged??Xt)(this[t],s))return;this.P(t,s,r)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,s,r){this._$AL.has(t)||this._$AL.set(t,s),r.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(s){Promise.reject(s)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var r;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[n,o]of i)o.wrapped!==!0||this._$AL.has(n)||this[n]===void 0||this.P(n,this[n],o)}let t=!1;const s=this._$AL;try{t=this.shouldUpdate(s),t?(this.willUpdate(s),(r=this._$EO)==null||r.forEach((i=>{var n;return(n=i.hostUpdate)==null?void 0:n.call(i)})),this.update(s)):this._$EU()}catch(i){throw t=!1,this._$EU(),i}t&&this._$AE(s)}willUpdate(t){}_$AE(t){var s;(s=this._$EO)==null||s.forEach((r=>{var i;return(i=r.hostUpdated)==null?void 0:i.call(r)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach((s=>this._$EC(s,this[s])))),this._$EU()}updated(t){}firstUpdated(t){}}G.elementStyles=[],G.shadowRootOptions={mode:"open"},G[ot("elementProperties")]=new Map,G[ot("finalized")]=new Map,Ut==null||Ut({ReactiveElement:G}),(V.reactiveElementVersions??(V.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const at=globalThis,wt=at.trustedTypes,ue=wt?wt.createPolicy("lit-html",{createHTML:e=>e}):void 0,Ce="$lit$",U=`lit$${Math.random().toFixed(9).slice(2)}$`,Pe="?"+U,$s=`<${Pe}>`,K=document,ht=()=>K.createComment(""),dt=e=>e===null||typeof e!="object"&&typeof e!="function",te=Array.isArray,_s=e=>te(e)||typeof(e==null?void 0:e[Symbol.iterator])=="function",Ft=`[ 	
\f\r]`,nt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,me=/-->/g,fe=/>/g,B=RegExp(`>|${Ft}(?:([^\\s"'>=/]+)(${Ft}*=${Ft}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ge=/'/g,ye=/"/g,Ee=/^(?:script|style|textarea|title)$/i,xs=e=>(t,...s)=>({_$litType$:e,strings:t,values:s}),k=xs(1),H=Symbol.for("lit-noChange"),b=Symbol.for("lit-nothing"),ve=new WeakMap,Y=K.createTreeWalker(K,129);function Te(e,t){if(!te(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return ue!==void 0?ue.createHTML(t):t}const ws=(e,t)=>{const s=e.length-1,r=[];let i,n=t===2?"<svg>":t===3?"<math>":"",o=nt;for(let h=0;h<s;h++){const l=e[h];let c,u,p=-1,f=0;for(;f<l.length&&(o.lastIndex=f,u=o.exec(l),u!==null);)f=o.lastIndex,o===nt?u[1]==="!--"?o=me:u[1]!==void 0?o=fe:u[2]!==void 0?(Ee.test(u[2])&&(i=RegExp("</"+u[2],"g")),o=B):u[3]!==void 0&&(o=B):o===B?u[0]===">"?(o=i??nt,p=-1):u[1]===void 0?p=-2:(p=o.lastIndex-u[2].length,c=u[1],o=u[3]===void 0?B:u[3]==='"'?ye:ge):o===ye||o===ge?o=B:o===me||o===fe?o=nt:(o=B,i=void 0);const S=o===B&&e[h+1].startsWith("/>")?" ":"";n+=o===nt?l+$s:p>=0?(r.push(c),l.slice(0,p)+Ce+l.slice(p)+U+S):l+U+(p===-2?h:S)}return[Te(e,n+(e[s]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),r]};class ct{constructor({strings:t,_$litType$:s},r){let i;this.parts=[];let n=0,o=0;const h=t.length-1,l=this.parts,[c,u]=ws(t,s);if(this.el=ct.createElement(c,r),Y.currentNode=this.el.content,s===2||s===3){const p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(i=Y.nextNode())!==null&&l.length<h;){if(i.nodeType===1){if(i.hasAttributes())for(const p of i.getAttributeNames())if(p.endsWith(Ce)){const f=u[o++],S=i.getAttribute(p).split(U),gt=/([.?@])?(.*)/.exec(f);l.push({type:1,index:n,name:gt[2],strings:S,ctor:gt[1]==="."?As:gt[1]==="?"?Ss:gt[1]==="@"?Cs:Tt}),i.removeAttribute(p)}else p.startsWith(U)&&(l.push({type:6,index:n}),i.removeAttribute(p));if(Ee.test(i.tagName)){const p=i.textContent.split(U),f=p.length-1;if(f>0){i.textContent=wt?wt.emptyScript:"";for(let S=0;S<f;S++)i.append(p[S],ht()),Y.nextNode(),l.push({type:2,index:++n});i.append(p[f],ht())}}}else if(i.nodeType===8)if(i.data===Pe)l.push({type:2,index:n});else{let p=-1;for(;(p=i.data.indexOf(U,p+1))!==-1;)l.push({type:7,index:n}),p+=U.length-1}n++}}static createElement(t,s){const r=K.createElement("template");return r.innerHTML=t,r}}function X(e,t,s=e,r){var o,h;if(t===H)return t;let i=r!==void 0?(o=s.o)==null?void 0:o[r]:s.l;const n=dt(t)?void 0:t._$litDirective$;return(i==null?void 0:i.constructor)!==n&&((h=i==null?void 0:i._$AO)==null||h.call(i,!1),n===void 0?i=void 0:(i=new n(e),i._$AT(e,s,r)),r!==void 0?(s.o??(s.o=[]))[r]=i:s.l=i),i!==void 0&&(t=X(e,i._$AS(e,t.values),i,r)),t}class ks{constructor(t,s){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=s}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:s},parts:r}=this._$AD,i=((t==null?void 0:t.creationScope)??K).importNode(s,!0);Y.currentNode=i;let n=Y.nextNode(),o=0,h=0,l=r[0];for(;l!==void 0;){if(o===l.index){let c;l.type===2?c=new ft(n,n.nextSibling,this,t):l.type===1?c=new l.ctor(n,l.name,l.strings,this,t):l.type===6&&(c=new Ps(n,this,t)),this._$AV.push(c),l=r[++h]}o!==(l==null?void 0:l.index)&&(n=Y.nextNode(),o++)}return Y.currentNode=K,i}p(t){let s=0;for(const r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,s),s+=r.strings.length-2):r._$AI(t[s])),s++}}class ft{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this.v}constructor(t,s,r,i){this.type=2,this._$AH=b,this._$AN=void 0,this._$AA=t,this._$AB=s,this._$AM=r,this.options=i,this.v=(i==null?void 0:i.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const s=this._$AM;return s!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=s.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,s=this){t=X(this,t,s),dt(t)?t===b||t==null||t===""?(this._$AH!==b&&this._$AR(),this._$AH=b):t!==this._$AH&&t!==H&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):_s(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==b&&dt(this._$AH)?this._$AA.nextSibling.data=t:this.T(K.createTextNode(t)),this._$AH=t}$(t){var n;const{values:s,_$litType$:r}=t,i=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=ct.createElement(Te(r.h,r.h[0]),this.options)),r);if(((n=this._$AH)==null?void 0:n._$AD)===i)this._$AH.p(s);else{const o=new ks(i,this),h=o.u(this.options);o.p(s),this.T(h),this._$AH=o}}_$AC(t){let s=ve.get(t.strings);return s===void 0&&ve.set(t.strings,s=new ct(t)),s}k(t){te(this._$AH)||(this._$AH=[],this._$AR());const s=this._$AH;let r,i=0;for(const n of t)i===s.length?s.push(r=new ft(this.O(ht()),this.O(ht()),this,this.options)):r=s[i],r._$AI(n),i++;i<s.length&&(this._$AR(r&&r._$AB.nextSibling,i),s.length=i)}_$AR(t=this._$AA.nextSibling,s){var r;for((r=this._$AP)==null?void 0:r.call(this,!1,!0,s);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var s;this._$AM===void 0&&(this.v=t,(s=this._$AP)==null||s.call(this,t))}}class Tt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,s,r,i,n){this.type=1,this._$AH=b,this._$AN=void 0,this.element=t,this.name=s,this._$AM=i,this.options=n,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=b}_$AI(t,s=this,r,i){const n=this.strings;let o=!1;if(n===void 0)t=X(this,t,s,0),o=!dt(t)||t!==this._$AH&&t!==H,o&&(this._$AH=t);else{const h=t;let l,c;for(t=n[0],l=0;l<n.length-1;l++)c=X(this,h[r+l],s,l),c===H&&(c=this._$AH[l]),o||(o=!dt(c)||c!==this._$AH[l]),c===b?t=b:t!==b&&(t+=(c??"")+n[l+1]),this._$AH[l]=c}o&&!i&&this.j(t)}j(t){t===b?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class As extends Tt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===b?void 0:t}}class Ss extends Tt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==b)}}class Cs extends Tt{constructor(t,s,r,i,n){super(t,s,r,i,n),this.type=5}_$AI(t,s=this){if((t=X(this,t,s,0)??b)===H)return;const r=this._$AH,i=t===b&&r!==b||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,n=t!==b&&(r===b||i);i&&this.element.removeEventListener(this.name,this,r),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var s;typeof this._$AH=="function"?this._$AH.call(((s=this.options)==null?void 0:s.host)??this.element,t):this._$AH.handleEvent(t)}}class Ps{constructor(t,s,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=s,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){X(this,t)}}const Vt=at.litHtmlPolyfillSupport;Vt==null||Vt(ct,ft),(at.litHtmlVersions??(at.litHtmlVersions=[])).push("3.2.0");const Es=(e,t,s)=>{const r=(s==null?void 0:s.renderBefore)??t;let i=r._$litPart$;if(i===void 0){const n=(s==null?void 0:s.renderBefore)??null;r._$litPart$=i=new ft(t.insertBefore(ht(),n),n,void 0,s??{})}return i._$AI(e),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class P extends G{constructor(){super(...arguments),this.renderOptions={host:this},this.o=void 0}createRenderRoot(){var s;const t=super.createRenderRoot();return(s=this.renderOptions).renderBefore??(s.renderBefore=t.firstChild),t}update(t){const s=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this.o=Es(s,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this.o)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.o)==null||t.setConnected(!1)}render(){return H}}var Ae;P._$litElement$=!0,P.finalized=!0,(Ae=globalThis.litElementHydrateSupport)==null||Ae.call(globalThis,{LitElement:P});const Ht=globalThis.litElementPolyfillSupport;Ht==null||Ht({LitElement:P});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const j=e=>(t,s)=>{s!==void 0?s.addInitializer((()=>{customElements.define(e,t)})):customElements.define(e,t)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ts={attribute:!0,type:String,converter:xt,reflect:!1,hasChanged:Xt},Ms=(e=Ts,t,s)=>{const{kind:r,metadata:i}=s;let n=globalThis.litPropertyMetadata.get(i);if(n===void 0&&globalThis.litPropertyMetadata.set(i,n=new Map),n.set(s.name,e),r==="accessor"){const{name:o}=s;return{set(h){const l=t.get.call(this);t.set.call(this,h),this.requestUpdate(o,l,e)},init(h){return h!==void 0&&this.P(o,void 0,e),h}}}if(r==="setter"){const{name:o}=s;return function(h){const l=this[o];t.call(this,h),this.requestUpdate(o,l,e)}}throw Error("Unsupported decorator location: "+r)};function A(e){return(t,s)=>typeof s=="object"?Ms(e,t,s):((r,i,n)=>{const o=i.hasOwnProperty(n);return i.constructor.createProperty(n,o?{...r,wrapped:!0}:r),o?Object.getOwnPropertyDescriptor(i,n):void 0})(e,t,s)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function x(e){return A({...e,state:!0,attribute:!1})}/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Os=e=>e.strings===void 0;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ee={ATTRIBUTE:1,CHILD:2},se=e=>(...t)=>({_$litDirective$:e,values:t});class re{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,s,r){this.t=t,this._$AM=s,this.i=r}_$AS(t,s){return this.update(t,s)}update(t,s){return this.render(...s)}}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const lt=(e,t)=>{var r;const s=e._$AN;if(s===void 0)return!1;for(const i of s)(r=i._$AO)==null||r.call(i,t,!1),lt(i,t);return!0},kt=e=>{let t,s;do{if((t=e._$AM)===void 0)break;s=t._$AN,s.delete(e),e=t}while((s==null?void 0:s.size)===0)},Me=e=>{for(let t;t=e._$AM;e=t){let s=t._$AN;if(s===void 0)t._$AN=s=new Set;else if(s.has(e))break;s.add(e),Is(t)}};function Ls(e){this._$AN!==void 0?(kt(this),this._$AM=e,Me(this)):this._$AM=e}function Ds(e,t=!1,s=0){const r=this._$AH,i=this._$AN;if(i!==void 0&&i.size!==0)if(t)if(Array.isArray(r))for(let n=s;n<r.length;n++)lt(r[n],!1),kt(r[n]);else r!=null&&(lt(r,!1),kt(r));else lt(this,e)}const Is=e=>{e.type==ee.CHILD&&(e._$AP??(e._$AP=Ds),e._$AQ??(e._$AQ=Ls))};class Ns extends re{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,s,r){super._$AT(t,s,r),Me(this),this.isConnected=t._$AU}_$AO(t,s=!0){var r,i;t!==this.isConnected&&(this.isConnected=t,t?(r=this.reconnected)==null||r.call(this):(i=this.disconnected)==null||i.call(this)),s&&(lt(this,t),kt(this))}setValue(t){if(Os(this.t))this.t._$AI(t,this);else{const s=[...this.t._$AH];s[this.i]=t,this.t._$AI(s,this,0)}}disconnected(){}reconnected(){}}/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Rs=()=>new Us;class Us{}const zt=new WeakMap,Fs=se(class extends Ns{render(e){return b}update(e,[t]){var r;const s=t!==this.Y;return s&&this.Y!==void 0&&this.rt(void 0),(s||this.lt!==this.ct)&&(this.Y=t,this.ht=(r=e.options)==null?void 0:r.host,this.rt(this.ct=e.element)),b}rt(e){if(this.isConnected||(e=void 0),typeof this.Y=="function"){const t=this.ht??globalThis;let s=zt.get(t);s===void 0&&(s=new WeakMap,zt.set(t,s)),s.get(this.Y)!==void 0&&this.Y.call(this.ht,void 0),s.set(this.Y,e),e!==void 0&&this.Y.call(this.ht,e)}else this.Y.value=e}get lt(){var e,t;return typeof this.Y=="function"?(e=zt.get(this.ht??globalThis))==null?void 0:e.get(this.Y):(t=this.Y)==null?void 0:t.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});var Vs=Object.getOwnPropertyDescriptor,Oe=e=>{throw TypeError(e)},Hs=(e,t,s,r)=>{for(var i=r>1?void 0:r?Vs(t,s):t,n=e.length-1,o;n>=0;n--)(o=e[n])&&(i=o(i)||i);return i},zs=(e,t,s)=>t.has(e)||Oe("Cannot "+s),js=(e,t,s)=>t.has(e)?Oe("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,s),be=(e,t,s)=>(zs(e,t,"access private method"),s),bt,Le,De;let Bt=class extends P{constructor(){super(...arguments),js(this,bt),this.dialog=Rs(),this.isDialogSupported=!!self.HTMLDialogElement,this.explanations=["BRSTM is a file format that contains audio data that's being used for some Nintendo consoles. One of the differences with the usual audio format (MP3, etc) is that this format can contain a loop point, making it suitable for usage in games.","BRSTM file is not included in the repository."]}render(){return this.isDialogSupported?k`
      <button
        type="button"
        id="help"
        aria-label="About BRSTM"
        aria-haspopup="dialog"
        @click=${be(this,bt,Le)}
        title="Click to open explanation"
        ><slot></slot
      ></button>
      <dialog
        id="brstm-explanation"
        aria-labelledby="help-title"
        ${Fs(this.dialog)}
      >
        <h2 id="help-title">About BRSTM</h2>
        ${this.explanations.map(e=>k`<p>${e}</p>`)}

        <button type="button" autofocus @click=${be(this,bt,De)}>Close</button>
      </dialog>
    `:k`<details><summary><slot></slot></summary>
        ${this.explanations.map(e=>k`<p>${e}</p>`)}
      </details>`}};bt=new WeakSet;Le=function(){var e;(e=this.dialog.value)==null||e.showModal()};De=function(){var e;(e=this.dialog.value)==null||e.close()};Bt.styles=z`
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
      font: inherit;
      color: inherit;
      background: transparent;
      padding: 0 2px;
      min-width: 0;
      min-height: 28px;
      outline: none;
      text-decoration: underline;
    }
    button:focus-visible, #help:focus-visible, summary:focus-visible {
      outline: 2px solid var(--primary-dark);
      outline-offset: 2px;
    }
    details { display: inline-block; }
    #help:hover {
      cursor: help;
    }
    button {
      box-sizing: border-box;
      border-radius: 5px;
      color: var(--primary-dark);
      background-color: var(--primary-lightest-2);
      outline-color: currentColor;

      min-width: 4rem;
      min-height: 2rem;
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
  `;Bt=Hs([j("nikku-help")],Bt);/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Ie=Symbol("Comlink.proxy"),Bs=Symbol("Comlink.endpoint"),Ws=Symbol("Comlink.releaseProxy"),jt=Symbol("Comlink.finalizer"),$t=Symbol("Comlink.thrown"),Ne=e=>typeof e=="object"&&e!==null||typeof e=="function",Ys={canHandle:e=>Ne(e)&&e[Ie],serialize(e){const{port1:t,port2:s}=new MessageChannel;return Ue(e,t),[s,[s]]},deserialize(e){return e.start(),Ve(e)}},Zs={canHandle:e=>Ne(e)&&$t in e,serialize({value:e}){let t;return e instanceof Error?t={isError:!0,value:{message:e.message,name:e.name,stack:e.stack}}:t={isError:!1,value:e},[t,[]]},deserialize(e){throw e.isError?Object.assign(new Error(e.value.message),e.value):e.value}},Re=new Map([["proxy",Ys],["throw",Zs]]);function qs(e,t){for(const s of e)if(t===s||s==="*"||s instanceof RegExp&&s.test(t))return!0;return!1}function Ue(e,t=globalThis,s=["*"]){t.addEventListener("message",function r(i){if(!i||!i.data)return;if(!qs(s,i.origin)){console.warn(`Invalid origin '${i.origin}' for comlink proxy`);return}const{id:n,type:o,path:h}=Object.assign({path:[]},i.data),l=(i.data.argumentList||[]).map(W);let c;try{const u=h.slice(0,-1).reduce((f,S)=>f[S],e),p=h.reduce((f,S)=>f[S],e);switch(o){case"GET":c=p;break;case"SET":u[h.slice(-1)[0]]=W(i.data.value),c=!0;break;case"APPLY":c=p.apply(u,l);break;case"CONSTRUCT":{const f=new p(...l);c=Xs(f)}break;case"ENDPOINT":{const{port1:f,port2:S}=new MessageChannel;Ue(e,S),c=je(f,[f])}break;case"RELEASE":c=void 0;break;default:return}}catch(u){c={value:u,[$t]:0}}Promise.resolve(c).catch(u=>({value:u,[$t]:0})).then(u=>{const[p,f]=Ct(u);t.postMessage(Object.assign(Object.assign({},p),{id:n}),f),o==="RELEASE"&&(t.removeEventListener("message",r),Fe(t),jt in e&&typeof e[jt]=="function"&&e[jt]())}).catch(u=>{const[p,f]=Ct({value:new TypeError("Unserializable return value"),[$t]:0});t.postMessage(Object.assign(Object.assign({},p),{id:n}),f)})}),t.start&&t.start()}function Ks(e){return e.constructor.name==="MessagePort"}function Fe(e){Ks(e)&&e.close()}function Ve(e,t){const s=new Map;return e.addEventListener("message",function(i){const{data:n}=i;if(!n||!n.id)return;const o=s.get(n.id);if(o)try{o(n)}finally{s.delete(n.id)}}),Wt(e,s,[],t)}function yt(e){if(e)throw new Error("Proxy has been released and is not useable")}function He(e){return Q(e,new Map,{type:"RELEASE"}).then(()=>{Fe(e)})}const At=new WeakMap,St="FinalizationRegistry"in globalThis&&new FinalizationRegistry(e=>{const t=(At.get(e)||0)-1;At.set(e,t),t===0&&He(e)});function Gs(e,t){const s=(At.get(t)||0)+1;At.set(t,s),St&&St.register(e,t,e)}function Qs(e){St&&St.unregister(e)}function Wt(e,t,s=[],r=function(){}){let i=!1;const n=new Proxy(r,{get(o,h){if(yt(i),h===Ws)return()=>{Qs(n),He(e),t.clear(),i=!0};if(h==="then"){if(s.length===0)return{then:()=>n};const l=Q(e,t,{type:"GET",path:s.map(c=>c.toString())}).then(W);return l.then.bind(l)}return Wt(e,t,[...s,h])},set(o,h,l){yt(i);const[c,u]=Ct(l);return Q(e,t,{type:"SET",path:[...s,h].map(p=>p.toString()),value:c},u).then(W)},apply(o,h,l){yt(i);const c=s[s.length-1];if(c===Bs)return Q(e,t,{type:"ENDPOINT"}).then(W);if(c==="bind")return Wt(e,t,s.slice(0,-1));const[u,p]=$e(l);return Q(e,t,{type:"APPLY",path:s.map(f=>f.toString()),argumentList:u},p).then(W)},construct(o,h){yt(i);const[l,c]=$e(h);return Q(e,t,{type:"CONSTRUCT",path:s.map(u=>u.toString()),argumentList:l},c).then(W)}});return Gs(n,e),n}function Js(e){return Array.prototype.concat.apply([],e)}function $e(e){const t=e.map(Ct);return[t.map(s=>s[0]),Js(t.map(s=>s[1]))]}const ze=new WeakMap;function je(e,t){return ze.set(e,t),e}function Xs(e){return Object.assign(e,{[Ie]:!0})}function Ct(e){for(const[t,s]of Re)if(s.canHandle(e)){const[r,i]=s.serialize(e);return[{type:"HANDLER",name:t,value:r},i]}return[{type:"RAW",value:e},ze.get(e)||[]]}function W(e){switch(e.type){case"HANDLER":return Re.get(e.name).deserialize(e.value);case"RAW":return e.value}}function Q(e,t,s,r){return new Promise(i=>{const n=tr();t.set(n,i),e.start&&e.start(),e.postMessage(Object.assign({id:n},s),r)})}function tr(){return new Array(4).fill(0).map(()=>Math.floor(Math.random()*Number.MAX_SAFE_INTEGER).toString(16)).join("-")}var er=Symbol("getEndpoint"),sr=e=>{const t=Ve(e);return new Proxy(t,{get(s,r,i){return r===er?e:Reflect.get(s,r,i)}})};/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Z=se(class extends re{constructor(e){var t;if(super(e),e.type!==ee.ATTRIBUTE||e.name!=="class"||((t=e.strings)==null?void 0:t.length)>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return" "+Object.keys(e).filter((t=>e[t])).join(" ")+" "}update(e,[t]){var r,i;if(this.st===void 0){this.st=new Set,e.strings!==void 0&&(this.nt=new Set(e.strings.join(" ").split(/\s/).filter((n=>n!==""))));for(const n in t)t[n]&&!((r=this.nt)!=null&&r.has(n))&&this.st.add(n);return this.render(t)}const s=e.element.classList;for(const n of this.st)n in t||(s.remove(n),this.st.delete(n));for(const n in t){const o=!!t[n];o===this.st.has(n)||(i=this.nt)!=null&&i.has(n)||(o?(s.add(n),this.st.add(n)):(s.remove(n),this.st.delete(n)))}return H}}),rr=`// @ts-check\r
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
    /** @type {TrackDescription[]} */
    this.trackDescriptions = options?.processorOptions?.trackDescriptions || [];
    /** @type {Array<Array<number>>} */
    this.trackChannelIndices = [];
    let channelIndex = 0;
    for (const trackDescription of this.trackDescriptions) {
      this.trackChannelIndices.push(
        trackDescription.channelIndices ||
          Array.from(
            { length: trackDescription.numberChannels },
            (_, trackChannelIndex) => channelIndex + trackChannelIndex
          )
      );
      channelIndex += trackDescription.numberChannels;
    }
    /** @type {boolean} */
    this.shouldLoop = options?.processorOptions?.shouldLoop ?? true;
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
    this._framesSinceTimestamp = 0;\r
    this._seekVersion = 0;\r
    this._endedReported = false;\r
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
          this._seekVersion = event.data.payload.seekVersion;\r
          this._endedReported = false;\r
          this.reportPosition();\r
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
          this.reportPosition();\r
          break;\r
        }\r
      }\r
    };\r
  }\r
\r
  /** @param {number} contextTime */\r
  reportPosition(contextTime = currentTime) {\r
    this._framesSinceTimestamp = 0;\r
    this.port.postMessage({\r
      type: 'TIMESTAMP_REPLY',\r
      payload: {\r
        timestamp: this._bufferHead / this.sampleRate,\r
        contextTime,\r
        seekVersion: this._seekVersion,\r
      },\r
    });\r
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
    let didLoop = false;\r
    if (absoluteSampleIndex >= this.totalSamples && this.shouldLoop && this.totalSamples > 0) {\r
      absoluteSampleIndex = this.loopStartSample;\r
      didLoop = true;\r
    }\r
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
      for (let trackIndex = 0; trackIndex < this.trackStates.length; trackIndex++) {
        // Not all tracks have 2 channels, must read from track descriptions
        const trackDescription = this.trackDescriptions[trackIndex];
        const trackChannelCount = trackDescription.numberChannels;
        const trackChannelIndices = this.trackChannelIndices[trackIndex];
\r
        if (this.trackStates[trackIndex]) {\r
          const finalOddTrackChannelCountIndex =\r
            trackChannelCount - (trackChannelCount % 2);\r
\r
          // Distribute left-right for first (N - (N % 2))\r
          for (let tc = 0; tc < finalOddTrackChannelCountIndex; tc++) {\r
            sums[tc % 2] +=\r
              segment[trackChannelIndices[tc]][segmentSampleIndex];\r
          }\r
\r
          // Put the final odd track into both left and right output\r
          if (trackChannelCount % 2 === 1) {\r
            sums[0] +=\r
              segment[trackChannelIndices[finalOddTrackChannelCountIndex]][\r
                segmentSampleIndex\r
              ];\r
            sums[1] +=\r
              segment[trackChannelIndices[finalOddTrackChannelCountIndex]][\r
                segmentSampleIndex\r
              ];\r
          }\r
        }\r
      }
\r
      output[0][s] = clamp(sums[0], -1, 1);\r
      output[1][s] = clamp(sums[1], -1, 1);\r
\r
      absoluteSampleIndex += 1;\r
      if (absoluteSampleIndex >= this.totalSamples) {\r
        if (this.shouldLoop) {\r
          absoluteSampleIndex = this.loopStartSample;\r
          didLoop = true;\r
        }\r
      }\r
    }\r
\r
    this._bufferHead = absoluteSampleIndex;\r
    this._framesSinceTimestamp += output[0].length;\r
    const ended = absoluteSampleIndex >= this.totalSamples && !this.shouldLoop;\r
    if (didLoop || (ended && !this._endedReported) || this._framesSinceTimestamp >= this.sampleRate / 4) {\r
      this.reportPosition(currentTime + output[0].length / this.sampleRate);\r
    }\r
    if (ended && !this._endedReported) {\r
      this.port.postMessage({\r
        type: 'BUFFER_ENDED',\r
        payload: { seekVersion: this._seekVersion },\r
      });\r
    }\r
    this._endedReported = ended;\r
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
`;var m,E,y,C,T,O,D,L,M,I,N,F,mt,Yt;class ir{constructor(t){w(this,mt);w(this,m);w(this,E);w(this,y);w(this,C);w(this,T);w(this,O);w(this,D);w(this,L);w(this,M);w(this,I);w(this,N);w(this,F);this.metadata=null,d(this,m,null),d(this,E,[]),d(this,y,null),d(this,C,null),d(this,T,0),d(this,O,0),d(this,D,!1),d(this,L,!0),d(this,M,!1),d(this,I,0),d(this,N,0),d(this,F,0),this.options=t,this.init()}async init(t){var s;if(t){if(this.metadata=t,d(this,m,new AudioContext({sampleRate:t.sampleRate})),await a(this,m).suspend(),a(this,m).audioWorklet){const r=new Blob([rr],{type:"text/javascript"}),i=URL.createObjectURL(r);try{await a(this,m).audioWorklet.addModule(i)}finally{URL.revokeObjectURL(i)}}}else this.metadata=null,d(this,m,null);if(d(this,E,[!0]),this.metadata&&this.metadata.numberTracks>1){d(this,E,[]);for(let r=0;r<this.metadata.numberTracks;r++)r===0?a(this,E).push(!0):a(this,E).push(!1)}d(this,y,null),d(this,C,null),d(this,T,0),d(this,O,((s=a(this,m))==null?void 0:s.currentTime)??0),d(this,N,0),d(this,D,!0),d(this,L,!1),d(this,M,!1),d(this,F,1)}async destroy(){var t,s,r;Rt(this,I)._++,this.options.onPause(),(t=a(this,y))==null||t.disconnect(),(s=a(this,y))==null||s.port.close(),(r=a(this,C))==null||r.disconnect(),a(this,m)&&a(this,m).state!=="closed"&&await a(this,m).close(),await this.init()}async start(){if(!this.metadata||!a(this,m))return;const t=a(this,I),{totalSamples:s,sampleRate:r}=this.metadata,i=s/r,n=Math.min(i,3),o=n*r;console.time("getSamples");const h=await this.options.decodeSamples(0,o);if(console.timeEnd("getSamples"),t!==a(this,I))return;Nt(this,mt,Yt).call(this,h,0);const l=[];for(let c=n;c<i;c+=10)c+10<i?l.push({offset:c,size:10}):l.push({offset:c,size:i-c});(async()=>{for(const c of l){if(t!==a(this,I))return;console.time("getSamples");const u=await this.options.decodeSamples(c.offset*r,c.size*r);if(console.timeEnd("getSamples"),t!==a(this,I))return;Nt(this,mt,Yt).call(this,u,c.offset*r)}})()}initPlayback(t){if(!this.metadata||!a(this,m)||a(this,F)==null)return;const{loopStartSample:s,totalSamples:r,sampleRate:i,trackDescriptions:n}=this.metadata;d(this,y,new AudioWorkletNode(a(this,m),"audio-source-processor",{numberOfInputs:0,numberOfOutputs:1,outputChannelCount:[2],processorOptions:{initialSamples:t,loopStartSample:s,totalSamples:r,sampleRate:i,shouldLoop:a(this,D),trackDescriptions:n,trackStates:a(this,E)}}));const o=a(this,y);a(this,y).port&&(a(this,y).port.addEventListener("message",h=>{var l,c,u;if(o===a(this,y))switch(h.data.type){case"BUFFER_LOOPED":{console.log("[AudioPlayer]",h.data.type);break}case"BUFFER_ENDED":{if(h.data.payload.seekVersion!==a(this,N))break;console.log("[AudioPlayer]",h.data.type),d(this,T,r/i),d(this,O,((l=a(this,m))==null?void 0:l.currentTime)??0),d(this,L,!0),this.pause().then(()=>{var p,f;return(f=(p=this.options).onEnded)==null?void 0:f.call(p)});break}case"TIMESTAMP_REPLY":{if(h.data.payload.seekVersion!==a(this,N))break;d(this,T,h.data.payload.timestamp),d(this,O,h.data.payload.contextTime),(u=(c=this.options).onPosition)==null||u.call(c);break}}}),a(this,y).port.start()),d(this,C,a(this,m).createGain()),a(this,C).gain.value=a(this,F),a(this,y).connect(a(this,C)),a(this,C).connect(a(this,m).destination),d(this,L,!1)}async seek(t,s=!0){var i,n;if(!a(this,m)||!this.metadata||!Number.isFinite(t))return;const r=this.metadata.totalSamples/this.metadata.sampleRate;t=Math.max(0,Math.min(r,t)),Rt(this,N)._++,d(this,T,t),d(this,O,a(this,m).currentTime),d(this,L,t>=r),a(this,y)&&a(this,y).port.postMessage({type:"SEEK",payload:{playbackTimeInS:t,seekVersion:a(this,N)}}),(n=(i=this.options).onPosition)==null||n.call(i),s&&!a(this,M)&&await this.play()}async play(){if(a(this,M)||!a(this,m))return;const t=a(this,m);a(this,L)&&await this.seek(0,!1),await t.resume(),t===a(this,m)&&(d(this,M,!0),this.options.onPlay())}async pause(){var s,r;if(!a(this,M)||!a(this,m))return;const t=a(this,m);await t.suspend(),t===a(this,m)&&(d(this,T,this.getCurrrentPlaybackTime()),d(this,O,t.currentTime),d(this,M,!1),this.options.onPause(),(r=(s=this.options).onPosition)==null||r.call(s))}async setTrackStates(t){d(this,E,t),a(this,y)&&a(this,y).port.postMessage({type:"UPDATE_TRACK_STATES",payload:{trackStates:a(this,E)}})}async setVolume(t){d(this,F,t),a(this,C)&&(a(this,C).gain.value=t)}setLoop(t){d(this,D,t),a(this,y)&&a(this,y).port.postMessage({type:"UPDATE_SHOULD_LOOP",payload:{shouldLoop:a(this,D)}})}getCurrrentPlaybackTime(){if(!a(this,y))return 0;if(!this.metadata||!a(this,m))return a(this,T);const t=this.metadata.totalSamples/this.metadata.sampleRate,s=a(this,M)?Math.max(0,a(this,m).currentTime-a(this,O)):0;let r=a(this,T)+s;const i=this.metadata.loopStartSample/this.metadata.sampleRate;return a(this,D)&&!a(this,L)&&r>=t&&t>i&&(r=i+(r-t)%(t-i)),Math.max(0,Math.min(t,r))}}m=new WeakMap,E=new WeakMap,y=new WeakMap,C=new WeakMap,T=new WeakMap,O=new WeakMap,D=new WeakMap,L=new WeakMap,M=new WeakMap,I=new WeakMap,N=new WeakMap,F=new WeakMap,mt=new WeakSet,Yt=function(t,s=0){!this.metadata||!a(this,m)||(s===0?this.initPlayback(t):a(this,y)&&a(this,y).port.postMessage({type:"ADD_SAMPLES",payload:{samples:t,offset:s}},t.map(r=>r.buffer)))};var q,R,J;class nr{constructor({renderCallback:t}){w(this,q,!1);w(this,R,null);w(this,J);d(this,R,null),d(this,J,t),this.render=this.render.bind(this)}start(){a(this,q)||(d(this,q,!0),d(this,R,requestAnimationFrame(this.render)))}stop(){a(this,R)&&cancelAnimationFrame(a(this,R)),d(this,R,null),d(this,q,!1)}render(){a(this,J)&&a(this,J).call(this),a(this,q)&&d(this,R,requestAnimationFrame(this.render))}}q=new WeakMap,R=new WeakMap,J=new WeakMap;var or=Object.defineProperty,ar=Object.getOwnPropertyDescriptor,Be=e=>{throw TypeError(e)},_=(e,t,s,r)=>{for(var i=r>1?void 0:r?ar(t,s):t,n=e.length-1,o;n>=0;n--)(o=e[n])&&(i=(r?o(t,s,i):o(i))||i);return r&&i&&or(t,s,i),i},lr=(e,t,s)=>t.has(e)||Be("Cannot "+s),hr=(e,t,s)=>t.has(e)?Be("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,s),v=(e,t,s)=>(lr(e,t,"access private method"),s),g,We,Ye,ie,Pt,ne,Ze,qe,Ke,it,Ge,Qe,Je,Xe,ts,es;let $=class extends P{constructor(){super(...arguments),hr(this,g),this.playPauseIcon="play",this.loop="on",this.volume=1,this.muted=!1,this.progressMax=0,this.progressValue=0,this.timeDisplayMax=0,this.timeDisplayValue=0,this.tracksCount=1,this.tracksActive=[!0],this.disabled=!0,this.fileDraggingOver=!1,this.trackTitle="",this.errorMessage="",this.folderFiles=[],this.folderName="",this.selectedFile=null,this.currentFile=null,this.loading=!1,this.audioPlayer=null,this.workerInstance=sr(new Worker(new URL("/nikku/assets/worker-BbnNAK_n.js",import.meta.url),{})),this.timer=new nr({renderCallback:()=>{if(!this.audioPlayer)return;const e=this.audioPlayer.getCurrrentPlaybackTime();this.progressValue=e,this.timeDisplayValue=e}})}render(){var e;return k`
      <div
        id="error"
        class=${this.errorMessage?"has-error":""}
        role="alert"
        aria-atomic="true"
      >
        ${this.errorMessage}
      </div>
      <main aria-label="Audio player" aria-busy=${this.loading}>
      <div id="main">
        <div id="track-title" title=${this.loading?"Loading audio":this.trackTitle}>${this.loading?`Loading ${((e=this.selectedFile)==null?void 0:e.name)||"audio"}…`:this.trackTitle}</div>
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
            @progressValueChange=${v(this,g,Je)}
          ></controls-progress>
        </div>
        <div id="controls-select-sources">
          <label class=${Z({"source-picker":!0,loading:this.loading})}>
            <input
              type="file"
              aria-label="Select file"
              accept=".brstm,.bfstm"
              ?disabled=${this.loading}
              @change=${v(this,g,Ze)}
            />
            <span aria-hidden="true">Select file…</span>
          </label>
          <label class=${Z({"source-picker":!0,loading:this.loading})}>
            <input type="file" webkitdirectory multiple
              aria-label="Select folder"
              ?disabled=${this.loading}
              @change=${v(this,g,qe)} />
            <span aria-hidden="true">Select folder…</span>
          </label>
        </div>

        <div id="controls-play-pause">
          <controls-play-pause
            ?disabled=${this.disabled}
            mode=${this.playPauseIcon}
            @playPauseClick=${v(this,g,Qe)}
          ></controls-play-pause>
        </div>
        <div id="controls-others">
          <controls-loop
            ?disabled=${this.disabled}
            mode=${this.loop}
            @loopClick=${v(this,g,Xe)}
          ></controls-loop>
          <controls-volume
            ?disabled=${this.disabled}
            ?muted=${this.muted}
            volume=${this.volume}
            @mutedChange=${v(this,g,ts)}
            @volumeChange=${v(this,g,es)}
          ></controls-volume>
        </div>
        <div id="controls-tracks">
          <controls-tracks
            ?disabled=${this.disabled}
            count=${this.tracksCount}
            .active=${this.tracksActive}
            @tracksActiveChange=${v(this,g,Ge)}
          ></controls-tracks>
        </div>
      </div>
      ${this.folderName?k`
        <section id="folder-view" aria-labelledby="folder-title">
          <div class="folder-heading">
            <h2 id="folder-title">${this.folderName}</h2>
            <span class="file-count" role="status" aria-atomic="true">${this.folderFiles.length} ${this.folderFiles.length===1?"file":"files"}</span>
          </div>
          ${this.folderFiles.length?k`
              <ul>
                ${this.folderFiles.map(t=>k`
                  <li class=${Z({selected:t===this.selectedFile,current:t===this.currentFile})}>
                    <button class="folder-item"
                      aria-label=${`Play ${t.webkitRelativePath.split("/").slice(1).join("/")||t.name}`}
                      aria-current=${t===this.currentFile?"true":"false"}
                      ?disabled=${this.loading}
                      @click=${()=>v(this,g,Ye).call(this,t)}>
                      <span class="file-path">${t.webkitRelativePath.split("/").slice(1).join("/")||t.name}</span>
                      ${t===this.currentFile?k`<span class="current-label">${this.playPauseIcon==="pause"?"Playing":"Current"}</span>`:""}
                    </button>
                  </li>
                `)}
              </ul>
          `:k`<p role="status">No BRSTM or BFSTM files found in this folder.</p>`}
        </section>
      `:""}
      <p class="sr-only" role="status" aria-atomic="true">${this.loading?"Loading audio…":this.currentFile?`${this.playPauseIcon==="pause"?"Playing":"Paused"}: ${this.trackTitle}`:""}</p>
      </main>
      <div
        id="drag-and-drop-overlay"
        class=${Z({hidden:!this.fileDraggingOver})}
      >
        Drop BRSTM or BFSTM file to start playback
      </div>
    `}firstUpdated(){window.addEventListener("dragover",e=>{e.preventDefault(),this.fileDraggingOver=!0}),window.addEventListener("dragend",e=>{this.fileDraggingOver=!1}),window.addEventListener("dragleave",e=>{this.fileDraggingOver=!1}),window.addEventListener("drop",e=>{if(e.preventDefault(),this.fileDraggingOver=!1,!e.dataTransfer||!e.dataTransfer.items||!e.dataTransfer.items[0]||e.dataTransfer.items[0].kind!=="file"){v(this,g,Pt).call(this,new Error("No file read"));return}const t=e.dataTransfer.items[0].getAsFile();if(!t){v(this,g,Pt).call(this,new Error("No file read"));return}v(this,g,it).call(this,t)})}};g=new WeakSet;We=async function(e){var r;if(!this.currentFile||this.loading)return;const t=this.folderFiles.indexOf(this.currentFile),s=t>=0?this.folderFiles[t+e]:void 0;s&&(this.selectedFile=s,await v(this,g,it).call(this,s),await this.updateComplete,(r=v(this,g,ie).call(this,s))==null||r.scrollIntoView({block:"nearest"}))};Ye=async function(e){if(this.loading)return;this.selectedFile=e,await v(this,g,it).call(this,e),await this.updateComplete;const t=v(this,g,ie).call(this,e);t==null||t.scrollIntoView({block:"nearest"}),t==null||t.focus()};ie=function(e){const t=this.folderFiles.indexOf(e);if(!(t<0))return this.renderRoot.querySelectorAll(".folder-item")[t]};Pt=function(e){this.errorMessage=e.message,console.error(e)};ne=function(){this.errorMessage=""};Ze=function(e){const t=e.target,s=t.files;if(!s||!s.length)return;const r=s[0];t.value="",v(this,g,it).call(this,r).finally(()=>t.focus())};qe=function(e){const t=e.target,s=Array.from(t.files||[]);s.length&&(this.folderName=s[0].webkitRelativePath.split("/")[0]||"Selected folder",this.folderFiles=s.filter(r=>/\.(brstm|bfstm)$/i.test(r.name)).sort((r,i)=>r.webkitRelativePath.localeCompare(i.webkitRelativePath,void 0,{numeric:!0})),this.selectedFile=this.folderFiles[0]||null,t.value="",this.selectedFile?v(this,g,it).call(this,this.selectedFile).finally(()=>t.focus()):v(this,g,Ke).call(this).finally(()=>t.focus()))};Ke=async function(){var e;if(!this.loading){v(this,g,ne).call(this),this.loading=!0,this.disabled=!0,this.currentFile=null,this.trackTitle="";try{await((e=this.audioPlayer)==null?void 0:e.destroy()),this.progressValue=0,this.progressMax=0,this.timeDisplayValue=0,this.timeDisplayMax=0,this.playPauseIcon="play",this.timer.stop()}finally{this.loading=!1}}};it=async function(e){var t;if(!this.loading){this.folderFiles.includes(e)||(this.folderFiles=[],this.folderName="",this.selectedFile=null),this.loading=!0,this.disabled=!0,v(this,g,ne).call(this),this.currentFile=null,this.trackTitle="";try{this.audioPlayer&&await this.audioPlayer.destroy(),this.progressValue=0,this.progressMax=0,this.timeDisplayValue=0,this.timeDisplayMax=0;const s=await e.arrayBuffer();await this.workerInstance.init(je(s,[s]));const r=await this.workerInstance.getMetadata();if(this.audioPlayer||(this.audioPlayer=new ir({onPlay:()=>{this.playPauseIcon="pause",this.timer.start()},onPause:()=>{this.playPauseIcon="play",this.timer.stop()},onEnded:()=>v(this,g,We).call(this,1),onPosition:()=>{var o;if(this.playPauseIcon==="play"){const h=((o=this.audioPlayer)==null?void 0:o.getCurrrentPlaybackTime())??0;this.progressValue=h,this.timeDisplayValue=h}},decodeSamples:async(o,h)=>await this.workerInstance.getSamples(o,h)||[]})),!r)throw new Error("metadata is undefined");await this.audioPlayer.init(r),this.audioPlayer.setLoop(this.loop==="on"),await this.audioPlayer.setVolume(this.muted?0:this.volume),await this.audioPlayer.start();const i=r.totalSamples/r.sampleRate,n=r.numberTracks;this.playPauseIcon="play",this.progressMax=i,this.timeDisplayMax=i,this.tracksCount=n,this.tracksActive=new Array(n).fill(!0).map((o,h)=>h===0),await this.audioPlayer.play(),this.disabled=!1,this.trackTitle=e.name,this.currentFile=e}catch(s){this.disabled=!0,await((t=this.audioPlayer)==null?void 0:t.destroy()),this.currentFile=null,this.trackTitle="",v(this,g,Pt).call(this,s)}finally{this.loading=!1}}};Ge=function(e){var s;const t=e.detail.active;this.tracksActive=t,(s=this.audioPlayer)==null||s.setTrackStates(t)};Qe=function(e){var s,r;const t=e.detail.mode;this.playPauseIcon=t,t==="play"?(s=this.audioPlayer)==null||s.pause():t==="pause"&&((r=this.audioPlayer)==null||r.play())};Je=function(e){var s;const t=e.detail.value;this.progressValue=t,this.timeDisplayValue=t,(s=this.audioPlayer)==null||s.seek(t)};Xe=function(e){var s,r;const t=e.detail.mode;this.loop=t,t==="on"?(s=this.audioPlayer)==null||s.setLoop(!0):t==="off"&&((r=this.audioPlayer)==null||r.setLoop(!1))};ts=function(e){var s,r;const t=e.detail.muted;this.muted=t,t?(s=this.audioPlayer)==null||s.setVolume(0):(r=this.audioPlayer)==null||r.setVolume(this.volume)};es=function(e){var s;const t=e.detail.volume;this.volume=t,this.muted=!1,(s=this.audioPlayer)==null||s.setVolume(t)};$.styles=z`
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip-path: inset(50%);
      white-space: nowrap;
    }
    #folder-view {
      margin-top: 1.5rem;
      border: 1px solid var(--primary-light);
      border-radius: 8px;
      background: var(--white-lighter);
      overflow: hidden;
    }
    .folder-heading {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      padding: 0.65rem 0.85rem;
      background: var(--primary-lightest-2);
    }
    .folder-heading h2 {
      min-width: 0;
      margin: 0;
      overflow-wrap: anywhere;
      font-size: 0.9rem;
    }
    #folder-view button {
      font: inherit;
      color: var(--main-text-color);
      cursor: pointer;
    }
    #folder-view button:focus-visible {
      outline: 2px solid var(--primary-dark);
      outline-offset: -2px;
    }
    #folder-view button:disabled, #folder-view button[aria-disabled='true'] {
      opacity: 0.5;
      cursor: default;
    }
    .file-path {
      overflow-wrap: anywhere;
    }
    .file-count {
      color: var(--primary-dark);
      font-size: 12px;
      white-space: nowrap;
    }
    #folder-view ul {
      list-style: none;
      margin: 0;
      padding: 0;
      max-height: 20rem;
      overflow: auto;
      border-top: 1px solid var(--primary-light);
    }
    #folder-view li {
      display: flex;
      align-items: stretch;
      border-left: 3px solid transparent;
      border-bottom: 1px solid var(--primary-lightest-2);
    }
    #folder-view li:last-child {
      border-bottom: 0;
    }
    #folder-view li:hover, #folder-view li.selected {
      background: var(--primary-lightest-2);
    }
    #folder-view li.current {
      border-left-color: var(--primary-dark);
    }
    #folder-view .folder-item {
      min-width: 0;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      text-align: left;
      background: transparent;
      border: 0;
      border-radius: 0;
      padding: 0.65rem 0.75rem;
    }
    .current-label {
      font-size: 12px;
      flex-shrink: 0;
      color: var(--primary-dark);
    }
    #error {
      padding: 0.6rem;
      margin-top: 0.6rem;
      margin-bottom: 0.6rem;
      color: var(--error-color);
      overflow-wrap: anywhere;
      border: 1px solid currentColor;
      padding: 0.6rem;
    }
    #error:not(.has-error) {
      padding: 0;
      border: 0;
      margin: 0;
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
    #controls-select-sources {
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
        grid-template-columns: minmax(0, 1fr) 80px minmax(0, 1fr);
        grid-template-rows: 20px 20px 15px 24px 80px auto;
        column-gap: 0.75rem;
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
      #controls-select-sources {
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
    #controls-select-sources {
      display: flex;
      gap: 0.5rem;
    }
    .source-picker {
      position: relative;
      display: inline-block;
      cursor: pointer;
      width: 80px;
    }
    .source-picker:last-child {
      width: 94px;
    }
    .source-picker.loading {
      opacity: 0.55;
      cursor: wait;
    }
    .source-picker > input {
      margin: 0;
      opacity: 0;
      height: 24px;
      width: 100%;
      cursor: inherit;
    }
    .source-picker > span {
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
    .source-picker:hover > span {
      background-color: var(--primary-lightest-1);
    }

    .source-picker:focus-within {
      outline: 2px solid var(--primary-dark);
      outline-offset: 2px;
      border-radius: 5px;
    }

    @media (prefers-color-scheme: dark) {
      .source-picker > span {
        color: var(--main-text-color);
      }
    }
  `;_([x()],$.prototype,"playPauseIcon",2);_([x()],$.prototype,"loop",2);_([x()],$.prototype,"volume",2);_([x()],$.prototype,"muted",2);_([x()],$.prototype,"progressMax",2);_([x()],$.prototype,"progressValue",2);_([x()],$.prototype,"timeDisplayMax",2);_([x()],$.prototype,"timeDisplayValue",2);_([x()],$.prototype,"tracksCount",2);_([x()],$.prototype,"tracksActive",2);_([x()],$.prototype,"disabled",2);_([x()],$.prototype,"fileDraggingOver",2);_([x()],$.prototype,"trackTitle",2);_([x()],$.prototype,"errorMessage",2);_([x()],$.prototype,"folderFiles",2);_([x()],$.prototype,"folderName",2);_([x()],$.prototype,"selectedFile",2);_([x()],$.prototype,"currentFile",2);_([x()],$.prototype,"loading",2);$=_([j("nikku-main")],$);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class Zt extends re{constructor(t){if(super(t),this.it=b,t.type!==ee.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(t){if(t===b||t==null)return this._t=void 0,this.it=t;if(t===H)return t;if(typeof t!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(t===this.it)return this._t;this.it=t;const s=[t];return s.raw=s,this._t={_$litType$:this.constructor.resultType,strings:s,values:[]}}}Zt.directiveName="unsafeHTML",Zt.resultType=1;const Et=se(Zt),dr=`<svg width="100" height="100" viewBox="0 0 100 100" fill="#198813" xmlns="http://www.w3.org/2000/svg">\r
<path d="M77.9375 48.2609C79.2874 49.0274 79.2874 50.9726 77.9375 51.7391L38.2376 74.2841C36.9043 75.0413 35.25 74.0783 35.25 72.545L35.25 27.455C35.25 25.9217 36.9044 24.9587 38.2376 25.7159L77.9375 48.2609Z" />\r
</svg>\r
`,cr=`<svg width="100" height="100" viewBox="0 0 100 100" fill="#198813" xmlns="http://www.w3.org/2000/svg">\r
<rect x="27" y="28" width="16" height="45" rx="2" />\r
<rect x="58" y="28" width="15" height="45" rx="2" />\r
</svg>\r
`;var pr=Object.defineProperty,ur=Object.getOwnPropertyDescriptor,ss=e=>{throw TypeError(e)},oe=(e,t,s,r)=>{for(var i=r>1?void 0:r?ur(t,s):t,n=e.length-1,o;n>=0;n--)(o=e[n])&&(i=(r?o(t,s,i):o(i))||i);return r&&i&&pr(t,s,i),i},mr=(e,t,s)=>t.has(e)||ss("Cannot "+s),fr=(e,t,s)=>t.has(e)?ss("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,s),gr=(e,t,s)=>(mr(e,t,"access private method"),s),qt,rs;let pt=class extends P{constructor(){super(...arguments),fr(this,qt),this.disabled=!1,this.mode="play"}render(){return k`<button
      class=${Z({button:!0,disabled:this.disabled})}
      type="button"
      aria-label=${this.mode==="play"?"Play":"Pause"}
      ?disabled=${this.disabled}
      @click=${gr(this,qt,rs)}
    >
      <span aria-hidden="true">${this.mode==="play"?Et(dr):Et(cr)}</span>
    </button>`}};qt=new WeakSet;rs=function(){if(this.disabled)return;const e=this.mode==="play"?"pause":"play";this.dispatchEvent(new CustomEvent("playPauseClick",{detail:{mode:e}})),this.mode=e};pt.styles=z`
    .button {
      all: initial;
      width: 80px;
      height: 80px;
      border-radius: 40px;
    }
    .button:focus-visible {
      outline: 2px solid var(--primary-dark);
      outline-offset: 3px;
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
  `;oe([A({type:Boolean})],pt.prototype,"disabled",2);oe([A({type:String})],pt.prototype,"mode",2);pt=oe([j("controls-play-pause")],pt);var yr=Object.defineProperty,vr=Object.getOwnPropertyDescriptor,Mt=(e,t,s,r)=>{for(var i=r>1?void 0:r?vr(t,s):t,n=e.length-1,o;n>=0;n--)(o=e[n])&&(i=(r?o(t,s,i):o(i))||i);return r&&i&&yr(t,s,i),i};let tt=class extends P{constructor(){super(...arguments),this.active=[],this.count=0,this.disabled=!1}render(){return k`
      <div
        id="container"
        role="group"
        aria-label="Active audio tracks"
        class=${Z({hidden:this.count===1||this.disabled})}
      >
        Active tracks:
        <ol id="list">
          ${Array(this.count).fill(0).map((e,t)=>k`<li>
                <label>
                  <input
                    type="checkbox"
                    .checked=${this.active[t]}
                    ?disabled=${this.disabled}
                    @input=${s=>{const r=s.target.checked,i=[...this.active];i[t]=r,this.active=i,this.dispatchEvent(new CustomEvent("tracksActiveChange",{detail:{active:i}}))}}
                  />
                  Track ${t+1}
                </label>
              </li>`)}
        </ol>
      </div>
    `}};tt.styles=z`
    .hidden {
      display: none;
    }
    #list {
      list-style: none;
      padding-left: 0;
      margin-top: 6px;
      user-select: none;
    }
    label {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      min-height: 28px;
      cursor: pointer;
    }
    input:focus-visible {
      outline: 2px solid var(--primary-dark);
      outline-offset: 2px;
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
      content: '✔';
      position: absolute;
      left: 2px;
      top: 0;
      font-size: 12px;
      line-height: 13px;
      color: var(--primary-darker);
    }
  `;Mt([A({type:Array})],tt.prototype,"active",2);Mt([A({type:Number})],tt.prototype,"count",2);Mt([A({type:Boolean})],tt.prototype,"disabled",2);tt=Mt([j("controls-tracks")],tt);var br=Object.defineProperty,$r=Object.getOwnPropertyDescriptor,Ot=(e,t,s,r)=>{for(var i=r>1?void 0:r?$r(t,s):t,n=e.length-1,o;n>=0;n--)(o=e[n])&&(i=(r?o(t,s,i):o(i))||i);return r&&i&&br(t,s,i),i};let et=class extends P{constructor(){super(...arguments),this.disabled=!1,this.value=0,this.max=0}render(){return k` <div class="progress-time-display" role="group" aria-label="Playback time">
      <div class="time" id="current"><span class="sr-only">Elapsed </span>${_e(this.value)}</div>
      <div class="separator" aria-hidden="true">/</div>
      <div class="time" id="total"><span class="sr-only">Duration </span>${_e(this.max)}</div>
    </div>`}};et.styles=z`
    .progress-time-display {
      display: flex;
      justify-content: flex-end;
    }
    .separator {
      margin-inline-start: 4px;
      margin-inline-end: 4px;
    }
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      overflow: hidden;
      clip-path: inset(50%);
      white-space: nowrap;
    }
    .time {
      min-width: 3em;
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
  `;Ot([A({type:Boolean})],et.prototype,"disabled",2);Ot([A({type:Number})],et.prototype,"value",2);Ot([A({type:Number})],et.prototype,"max",2);et=Ot([j("controls-time-display")],et);function _e(e){const t=xe(Math.floor(e/60)),s=xe(Math.floor(e%60));return`${t}:${s}`}function xe(e){return e<10?`0${e}`:e}var _r=Object.defineProperty,xr=Object.getOwnPropertyDescriptor,is=e=>{throw TypeError(e)},Lt=(e,t,s,r)=>{for(var i=r>1?void 0:r?xr(t,s):t,n=e.length-1,o;n>=0;n--)(o=e[n])&&(i=(r?o(t,s,i):o(i))||i);return r&&i&&_r(t,s,i),i},wr=(e,t,s)=>t.has(e)||is("Cannot "+s),kr=(e,t,s)=>t.has(e)?is("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,s),Ar=(e,t,s)=>(wr(e,t,"access private method"),s),Kt,ns;let st=class extends P{constructor(){super(...arguments),kr(this,Kt),this.disabled=!1,this.value=0,this.max=0}render(){return k`<input
      type="range"
      aria-label="Playback position"
      aria-valuetext=${`${we(this.value)} of ${we(this.max)}`}
      min="0"
      max=${this.max}
      step="any"
      .value=${String(this.value)}
      style=${`--progress: ${this.max>0?Math.max(0,Math.min(100,this.value/this.max*100)):0}%`}
      ?disabled=${this.disabled||this.max<=0}
      @input=${Ar(this,Kt,ns)}
    />`}};Kt=new WeakSet;ns=function(e){this.disabled||this.max<=0||(this.value=Number(e.target.value),this.dispatchEvent(new CustomEvent("progressValueChange",{detail:{value:this.value}})))};st.styles=z`
    :host {
      display: block;
      height: 15px;
    }
    input {
      appearance: none;
      display: block;
      box-sizing: border-box;
      width: 100%;
      height: 24px;
      margin: -4.5px 0 0;
      background: transparent;
      cursor: pointer;
    }
    input::-webkit-slider-runnable-track {
      height: 4px;
      border-radius: 2px;
      background: linear-gradient(to right, var(--primary) 0 var(--progress), #e0e4e8 var(--progress) 100%);
    }
    input::-webkit-slider-thumb {
      appearance: none;
      width: 15px;
      height: 15px;
      margin-top: -5.5px;
      border: 0;
      border-radius: 50%;
      background: var(--primary);
    }
    input::-moz-range-track {
      height: 4px;
      border: 0;
      border-radius: 2px;
      background: #e0e4e8;
    }
    input::-moz-range-progress {
      height: 4px;
      border-radius: 2px;
      background: var(--primary);
    }
    input::-moz-range-thumb {
      width: 15px;
      height: 15px;
      border: 0;
      border-radius: 50%;
      background: var(--primary);
    }
    input:focus-visible {
      outline: 2px solid var(--primary-dark);
      outline-offset: 2px;
    }
    input:disabled { opacity: 1; cursor: not-allowed; }
  `;Lt([A({type:Boolean})],st.prototype,"disabled",2);Lt([A({type:Number})],st.prototype,"value",2);Lt([A({type:Number})],st.prototype,"max",2);st=Lt([j("controls-progress")],st);function we(e){const t=Math.max(0,Math.floor(e)),s=Math.floor(t/60),r=t%60;return`${s} minute${s===1?"":"s"} ${r} second${r===1?"":"s"}`}const Sr=`<svg width="100" height="100" viewBox="0 0 100 100" fill="#198813" xmlns="http://www.w3.org/2000/svg">\r
<path fill-rule="evenodd" clip-rule="evenodd" d="M37.5858 38C37.851 38 38.1054 37.8946 38.2929 37.7071L48.2929 27.7071C48.9229 27.0771 50 27.5233 50 28.4142V71.5858C50 72.4767 48.9229 72.9228 48.2929 72.2929L38.2929 62.2929C38.1054 62.1054 37.851 62 37.5858 62H21C20.4477 62 20 61.5523 20 61V39C20 38.4477 20.4477 38 21 38H37.5858Z"/>\r
<path fill-rule="evenodd" clip-rule="evenodd" d="M71.9382 50.0662C71.7795 42.8723 68.0938 35.4875 61.0359 30.0266C60.5991 29.6887 60.4988 29.0641 60.8236 28.6175L63.1763 25.3825C63.5012 24.9359 64.1276 24.8362 64.5659 25.1722C72.9864 31.628 77.7327 40.6844 77.9368 49.9338C78.1425 59.2585 73.72 68.4296 64.4895 74.9305C64.038 75.2486 63.4157 75.1236 63.1094 74.6641L60.8906 71.3359C60.5842 70.8764 60.71 70.2565 61.16 69.9364C68.7821 64.5159 72.0959 57.2151 71.9382 50.0662Z"/>\r
<path fill-rule="evenodd" clip-rule="evenodd" d="M89.375 50C89.375 35.887 83.3874 22.0191 71.7151 14.0769C71.2585 13.7662 71.1219 13.1482 71.4201 12.6834L73.5799 9.31661C73.8781 8.85175 74.4987 8.71651 74.9565 9.0254C88.6709 18.2782 95.375 34.2625 95.375 50C95.375 65.7375 88.6709 81.7218 74.9565 90.9746C74.4987 91.2835 73.8781 91.1482 73.5799 90.6834L71.4201 87.3166C71.1219 86.8518 71.2585 86.2338 71.7151 85.9231C83.3874 77.9809 89.375 64.113 89.375 50Z"/>\r
</svg>\r
`,Cr=`<svg width="100" height="100" viewBox="0 0 100 100" fill="#198813" xmlns="http://www.w3.org/2000/svg">\r
<rect x="81.5937" y="36.1014" width="5.02197" height="34.2892" rx="1" transform="rotate(45 81.5937 36.1014)"/>\r
<rect x="85.1447" y="60.3475" width="5.02197" height="34.2892" rx="1" transform="rotate(135 85.1447 60.3475)"/>\r
<path fill-rule="evenodd" clip-rule="evenodd" d="M37.5858 38C37.851 38 38.1054 37.8946 38.2929 37.7071L48.2929 27.7071C48.9229 27.0771 50 27.5233 50 28.4142V71.5858C50 72.4767 48.9229 72.9228 48.2929 72.2929L38.2929 62.2929C38.1054 62.1053 37.851 62 37.5858 62H21C20.4477 62 20 61.5523 20 61V39C20 38.4477 20.4477 38 21 38L37.5858 38Z"/>\r
</svg>\r
`;var Pr=Object.defineProperty,Er=Object.getOwnPropertyDescriptor,os=e=>{throw TypeError(e)},Dt=(e,t,s,r)=>{for(var i=r>1?void 0:r?Er(t,s):t,n=e.length-1,o;n>=0;n--)(o=e[n])&&(i=(r?o(t,s,i):o(i))||i);return r&&i&&Pr(t,s,i),i},Tr=(e,t,s)=>t.has(e)||os("Cannot "+s),Mr=(e,t,s)=>t.has(e)?os("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,s),ke=(e,t,s)=>(Tr(e,t,"access private method"),s),_t,as,ls;let rt=class extends P{constructor(){super(...arguments),Mr(this,_t),this.disabled=!1,this.muted=!1,this.volume=1}render(){return k`<div class="volume-container">
      <button type="button" aria-label=${this.muted?"Unmute":"Mute"} aria-pressed=${this.muted}
        ?disabled=${this.disabled} @click=${ke(this,_t,as)}>
        <span aria-hidden="true">${Et(this.muted?Cr:Sr)}</span>
      </button>
      <input type="range" aria-label="Volume"
        aria-valuetext=${`${Math.round(this.volume*100)}%${this.muted?", muted":""}`}
        min="0" max="100" step="1"
        .value=${String(Math.round(this.volume*100))}
        style=${`--volume: ${this.muted?0:Math.round(this.volume*100)}%`}
        ?disabled=${this.disabled} @input=${ke(this,_t,ls)} />
    </div>`}};_t=new WeakSet;as=function(){this.disabled||(this.muted=!this.muted,this.dispatchEvent(new CustomEvent("mutedChange",{detail:{muted:this.muted}})))};ls=function(e){this.disabled||(this.volume=Number(e.target.value)/100,this.muted=!1,this.dispatchEvent(new CustomEvent("volumeChange",{detail:{volume:this.volume}})))};rt.styles=z`
    .volume-container { display: flex; align-items: center; gap: 8px; }
    button {
      all: initial;
      width: 40px;
      height: 40px;
      border-radius: 20px;
      cursor: pointer;
    }
    button:disabled { cursor: not-allowed; }
    svg { width: 100%; height: 100%; }
    input {
      appearance: none;
      width: 100px;
      height: 24px;
      margin: 0;
      background: transparent;
      cursor: pointer;
    }
    input::-webkit-slider-runnable-track {
      height: 2px;
      border-radius: 1px;
      background: linear-gradient(to right, var(--primary) 0 var(--volume), #e0e4e8 var(--volume) 100%);
    }
    input::-webkit-slider-thumb {
      appearance: none;
      width: 10px;
      height: 10px;
      margin-top: -4px;
      border: 0;
      border-radius: 50%;
      background: var(--primary);
    }
    input::-moz-range-track {
      height: 2px;
      border: 0;
      border-radius: 1px;
      background: #e0e4e8;
    }
    input::-moz-range-progress {
      height: 2px;
      border-radius: 1px;
      background: var(--primary);
    }
    input::-moz-range-thumb {
      width: 10px;
      height: 10px;
      border: 0;
      border-radius: 50%;
      background: var(--primary);
    }
    input:disabled { opacity: 1; cursor: not-allowed; }
    button:focus-visible, input:focus-visible {
      outline: 2px solid var(--primary-dark);
      outline-offset: 2px;
    }
  `;Dt([A({type:Boolean})],rt.prototype,"disabled",2);Dt([A({type:Boolean})],rt.prototype,"muted",2);Dt([A({type:Number})],rt.prototype,"volume",2);rt=Dt([j("controls-volume")],rt);const Or=`<svg width="100" height="100" viewBox="0 0 100 100" fill="#198813" xmlns="http://www.w3.org/2000/svg">\r
<path d="M20 38C20 29.5 26.5 20 38 20L62 20C72 20 80 28 80 38L80 39L70 39C70 39 70 42.5 70 38C70 33.5 66.5 30 62 30C57.5 30 42.5 30 38 30C33.5 30 30 33.5 30 38C30 42.5 30 41 30 41L20 41L20 38Z"/>\r
<path d="M74.5 54L60.2106 39L88.7894 39L74.5 54Z"/>\r
<path d="M79 61C79 69.5 72.5 79 61 79L37 79C27 79 19 71 19 61L19 60L29 60C29 60 29 56.5 29 61C29 65.5 32.5 69 37 69C41.5 69 56.5 69 61 69C65.5 69 69 65.5 69 61C69 56.5 69 58 69 58L79 58L79 61Z"/>\r
<path d="M24.5 45L38.7894 60H10.2106L24.5 45Z"/>\r
</svg>\r
`;var Lr=Object.defineProperty,Dr=Object.getOwnPropertyDescriptor,hs=e=>{throw TypeError(e)},ae=(e,t,s,r)=>{for(var i=r>1?void 0:r?Dr(t,s):t,n=e.length-1,o;n>=0;n--)(o=e[n])&&(i=(r?o(t,s,i):o(i))||i);return r&&i&&Lr(t,s,i),i},Ir=(e,t,s)=>t.has(e)||hs("Cannot "+s),Nr=(e,t,s)=>t.has(e)?hs("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,s),Rr=(e,t,s)=>(Ir(e,t,"access private method"),s),Gt,ds;let ut=class extends P{constructor(){super(...arguments),Nr(this,Gt),this.disabled=!1,this.mode="on"}render(){return k`<button
      class=${Z({on:this.mode==="on",off:this.mode==="off",disabled:this.disabled,button:!0})}
      type="button"
      aria-label="Loop"
      aria-pressed=${this.mode==="on"}
      ?disabled=${this.disabled}
      @click=${Rr(this,Gt,ds)}
    >
      <span aria-hidden="true">${Et(Or)}</span>
    </button>`}};Gt=new WeakSet;ds=function(){if(this.disabled)return;const e=this.mode==="on"?"off":"on";this.dispatchEvent(new CustomEvent("loopClick",{detail:{mode:e}})),this.mode=e};ut.styles=z`
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
    .button:focus-visible {
      outline: 2px solid var(--primary-dark);
      outline-offset: 3px;
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
    .button.off svg {
      fill: var(--main-text-color);
      opacity: 0.55;
    }
    .button.disabled:hover {
      cursor: not-allowed;
    }
  `;ae([A({type:Boolean})],ut.prototype,"disabled",2);ae([A({type:String})],ut.prototype,"mode",2);ut=ae([j("controls-loop")],ut);
