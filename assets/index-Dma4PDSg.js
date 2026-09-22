var fe=e=>{throw TypeError(e)};var It=(e,t,s)=>t.has(e)||fe("Cannot "+s);var a=(e,t,s)=>(It(e,t,"read from private field"),s?s.call(e):t.get(e)),x=(e,t,s)=>t.has(e)?fe("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,s),d=(e,t,s,r)=>(It(e,t,"write to private field"),r?r.call(e,s):t.set(e,s),s),Ft=(e,t,s)=>(It(e,t,"access private method"),s);var Ut=(e,t,s,r)=>({set _(i){d(e,t,i,s)},get _(){return a(e,t,r)}});(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function s(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerPolicy&&(n.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?n.credentials="include":i.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function r(i){if(i.ep)return;i.ep=!0;const n=s(i);fetch(i.href,n)}})();/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const bt=globalThis,te=bt.ShadowRoot&&(bt.ShadyCSS===void 0||bt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ee=Symbol(),me=new WeakMap;let Oe=class{constructor(t,s,r){if(this._$cssResult$=!0,r!==ee)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=s}get styleSheet(){let t=this.o;const s=this.t;if(te&&t===void 0){const r=s!==void 0&&s.length===1;r&&(t=me.get(s)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&me.set(s,t))}return t}toString(){return this.cssText}};const _s=e=>new Oe(typeof e=="string"?e:e+"",void 0,ee),z=(e,...t)=>{const s=e.length===1?e[0]:t.reduce(((r,i,n)=>r+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[n+1]),e[0]);return new Oe(s,e,ee)},$s=(e,t)=>{if(te)e.adoptedStyleSheets=t.map((s=>s instanceof CSSStyleSheet?s:s.styleSheet));else for(const s of t){const r=document.createElement("style"),i=bt.litNonce;i!==void 0&&r.setAttribute("nonce",i),r.textContent=s.cssText,e.appendChild(r)}},ge=te?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let s="";for(const r of t.cssRules)s+=r.cssText;return _s(s)})(e):e;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:ws,defineProperty:xs,getOwnPropertyDescriptor:ks,getOwnPropertyNames:As,getOwnPropertySymbols:Ss,getPrototypeOf:Cs}=Object,H=globalThis,ye=H.trustedTypes,Ps=ye?ye.emptyScript:"",Ht=H.reactiveElementPolyfillSupport,at=(e,t)=>e,xt={toAttribute(e,t){switch(t){case Boolean:e=e?Ps:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let s=e;switch(t){case Boolean:s=e!==null;break;case Number:s=e===null?null:Number(e);break;case Object:case Array:try{s=JSON.parse(e)}catch{s=null}}return s}},se=(e,t)=>!ws(e,t),ve={attribute:!0,type:String,converter:xt,reflect:!1,hasChanged:se};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),H.litPropertyMetadata??(H.litPropertyMetadata=new WeakMap);class K extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,s=ve){if(s.state&&(s.attribute=!1),this._$Ei(),this.elementProperties.set(t,s),!s.noAccessor){const r=Symbol(),i=this.getPropertyDescriptor(t,r,s);i!==void 0&&xs(this.prototype,t,i)}}static getPropertyDescriptor(t,s,r){const{get:i,set:n}=ks(this.prototype,t)??{get(){return this[s]},set(o){this[s]=o}};return{get(){return i==null?void 0:i.call(this)},set(o){const l=i==null?void 0:i.call(this);n.call(this,o),this.requestUpdate(t,l,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??ve}static _$Ei(){if(this.hasOwnProperty(at("elementProperties")))return;const t=Cs(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(at("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(at("properties"))){const s=this.properties,r=[...As(s),...Ss(s)];for(const i of r)this.createProperty(i,s[i])}const t=this[Symbol.metadata];if(t!==null){const s=litPropertyMetadata.get(t);if(s!==void 0)for(const[r,i]of s)this.elementProperties.set(r,i)}this._$Eh=new Map;for(const[s,r]of this.elementProperties){const i=this._$Eu(s,r);i!==void 0&&this._$Eh.set(i,s)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const s=[];if(Array.isArray(t)){const r=new Set(t.flat(1/0).reverse());for(const i of r)s.unshift(ge(i))}else t!==void 0&&s.push(ge(t));return s}static _$Eu(t,s){const r=s.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise((s=>this.enableUpdating=s)),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach((s=>s(this)))}addController(t){var s;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((s=t.hostConnected)==null||s.call(t))}removeController(t){var s;(s=this._$EO)==null||s.delete(t)}_$E_(){const t=new Map,s=this.constructor.elementProperties;for(const r of s.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return $s(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach((s=>{var r;return(r=s.hostConnected)==null?void 0:r.call(s)}))}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach((s=>{var r;return(r=s.hostDisconnected)==null?void 0:r.call(s)}))}attributeChangedCallback(t,s,r){this._$AK(t,r)}_$EC(t,s){var n;const r=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,r);if(i!==void 0&&r.reflect===!0){const o=(((n=r.converter)==null?void 0:n.toAttribute)!==void 0?r.converter:xt).toAttribute(s,r.type);this._$Em=t,o==null?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,s){var n;const r=this.constructor,i=r._$Eh.get(t);if(i!==void 0&&this._$Em!==i){const o=r.getPropertyOptions(i),l=typeof o.converter=="function"?{fromAttribute:o.converter}:((n=o.converter)==null?void 0:n.fromAttribute)!==void 0?o.converter:xt;this._$Em=i,this[i]=l.fromAttribute(s,o.type),this._$Em=null}}requestUpdate(t,s,r){if(t!==void 0){if(r??(r=this.constructor.getPropertyOptions(t)),!(r.hasChanged??se)(this[t],s))return;this.P(t,s,r)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,s,r){this._$AL.has(t)||this._$AL.set(t,s),r.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(s){Promise.reject(s)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var r;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[n,o]of i)o.wrapped!==!0||this._$AL.has(n)||this[n]===void 0||this.P(n,this[n],o)}let t=!1;const s=this._$AL;try{t=this.shouldUpdate(s),t?(this.willUpdate(s),(r=this._$EO)==null||r.forEach((i=>{var n;return(n=i.hostUpdate)==null?void 0:n.call(i)})),this.update(s)):this._$EU()}catch(i){throw t=!1,this._$EU(),i}t&&this._$AE(s)}willUpdate(t){}_$AE(t){var s;(s=this._$EO)==null||s.forEach((r=>{var i;return(i=r.hostUpdated)==null?void 0:i.call(r)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach((s=>this._$EC(s,this[s])))),this._$EU()}updated(t){}firstUpdated(t){}}K.elementStyles=[],K.shadowRootOptions={mode:"open"},K[at("elementProperties")]=new Map,K[at("finalized")]=new Map,Ht==null||Ht({ReactiveElement:K}),(H.reactiveElementVersions??(H.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const lt=globalThis,kt=lt.trustedTypes,be=kt?kt.createPolicy("lit-html",{createHTML:e=>e}):void 0,Le="$lit$",F=`lit$${Math.random().toFixed(9).slice(2)}$`,De="?"+F,Es=`<${De}>`,q=document,dt=()=>q.createComment(""),ct=e=>e===null||typeof e!="object"&&typeof e!="function",re=Array.isArray,Ts=e=>re(e)||typeof(e==null?void 0:e[Symbol.iterator])=="function",Vt=`[ 	
\f\r]`,ot=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_e=/-->/g,$e=/>/g,B=RegExp(`>|${Vt}(?:([^\\s"'>=/]+)(${Vt}*=${Vt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),we=/'/g,xe=/"/g,Re=/^(?:script|style|textarea|title)$/i,Ms=e=>(t,...s)=>({_$litType$:e,strings:t,values:s}),k=Ms(1),V=Symbol.for("lit-noChange"),b=Symbol.for("lit-nothing"),ke=new WeakMap,Y=q.createTreeWalker(q,129);function Ne(e,t){if(!re(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return be!==void 0?be.createHTML(t):t}const Os=(e,t)=>{const s=e.length-1,r=[];let i,n=t===2?"<svg>":t===3?"<math>":"",o=ot;for(let l=0;l<s;l++){const h=e[l];let c,m,f=-1,y=0;for(;y<h.length&&(o.lastIndex=y,m=o.exec(h),m!==null);)y=o.lastIndex,o===ot?m[1]==="!--"?o=_e:m[1]!==void 0?o=$e:m[2]!==void 0?(Re.test(m[2])&&(i=RegExp("</"+m[2],"g")),o=B):m[3]!==void 0&&(o=B):o===B?m[0]===">"?(o=i??ot,f=-1):m[1]===void 0?f=-2:(f=o.lastIndex-m[2].length,c=m[1],o=m[3]===void 0?B:m[3]==='"'?xe:we):o===xe||o===we?o=B:o===_e||o===$e?o=ot:(o=B,i=void 0);const S=o===B&&e[l+1].startsWith("/>")?" ":"";n+=o===ot?h+Es:f>=0?(r.push(c),h.slice(0,f)+Le+h.slice(f)+F+S):h+F+(f===-2?l:S)}return[Ne(e,n+(e[s]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),r]};class pt{constructor({strings:t,_$litType$:s},r){let i;this.parts=[];let n=0,o=0;const l=t.length-1,h=this.parts,[c,m]=Os(t,s);if(this.el=pt.createElement(c,r),Y.currentNode=this.el.content,s===2||s===3){const f=this.el.content.firstChild;f.replaceWith(...f.childNodes)}for(;(i=Y.nextNode())!==null&&h.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(const f of i.getAttributeNames())if(f.endsWith(Le)){const y=m[o++],S=i.getAttribute(f).split(F),yt=/([.?@])?(.*)/.exec(y);h.push({type:1,index:n,name:yt[2],strings:S,ctor:yt[1]==="."?Ds:yt[1]==="?"?Rs:yt[1]==="@"?Ns:Mt}),i.removeAttribute(f)}else f.startsWith(F)&&(h.push({type:6,index:n}),i.removeAttribute(f));if(Re.test(i.tagName)){const f=i.textContent.split(F),y=f.length-1;if(y>0){i.textContent=kt?kt.emptyScript:"";for(let S=0;S<y;S++)i.append(f[S],dt()),Y.nextNode(),h.push({type:2,index:++n});i.append(f[y],dt())}}}else if(i.nodeType===8)if(i.data===De)h.push({type:2,index:n});else{let f=-1;for(;(f=i.data.indexOf(F,f+1))!==-1;)h.push({type:7,index:n}),f+=F.length-1}n++}}static createElement(t,s){const r=q.createElement("template");return r.innerHTML=t,r}}function X(e,t,s=e,r){var o,l;if(t===V)return t;let i=r!==void 0?(o=s.o)==null?void 0:o[r]:s.l;const n=ct(t)?void 0:t._$litDirective$;return(i==null?void 0:i.constructor)!==n&&((l=i==null?void 0:i._$AO)==null||l.call(i,!1),n===void 0?i=void 0:(i=new n(e),i._$AT(e,s,r)),r!==void 0?(s.o??(s.o=[]))[r]=i:s.l=i),i!==void 0&&(t=X(e,i._$AS(e,t.values),i,r)),t}class Ls{constructor(t,s){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=s}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:s},parts:r}=this._$AD,i=((t==null?void 0:t.creationScope)??q).importNode(s,!0);Y.currentNode=i;let n=Y.nextNode(),o=0,l=0,h=r[0];for(;h!==void 0;){if(o===h.index){let c;h.type===2?c=new gt(n,n.nextSibling,this,t):h.type===1?c=new h.ctor(n,h.name,h.strings,this,t):h.type===6&&(c=new Is(n,this,t)),this._$AV.push(c),h=r[++l]}o!==(h==null?void 0:h.index)&&(n=Y.nextNode(),o++)}return Y.currentNode=q,i}p(t){let s=0;for(const r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,s),s+=r.strings.length-2):r._$AI(t[s])),s++}}class gt{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this.v}constructor(t,s,r,i){this.type=2,this._$AH=b,this._$AN=void 0,this._$AA=t,this._$AB=s,this._$AM=r,this.options=i,this.v=(i==null?void 0:i.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const s=this._$AM;return s!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=s.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,s=this){t=X(this,t,s),ct(t)?t===b||t==null||t===""?(this._$AH!==b&&this._$AR(),this._$AH=b):t!==this._$AH&&t!==V&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Ts(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==b&&ct(this._$AH)?this._$AA.nextSibling.data=t:this.T(q.createTextNode(t)),this._$AH=t}$(t){var n;const{values:s,_$litType$:r}=t,i=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=pt.createElement(Ne(r.h,r.h[0]),this.options)),r);if(((n=this._$AH)==null?void 0:n._$AD)===i)this._$AH.p(s);else{const o=new Ls(i,this),l=o.u(this.options);o.p(s),this.T(l),this._$AH=o}}_$AC(t){let s=ke.get(t.strings);return s===void 0&&ke.set(t.strings,s=new pt(t)),s}k(t){re(this._$AH)||(this._$AH=[],this._$AR());const s=this._$AH;let r,i=0;for(const n of t)i===s.length?s.push(r=new gt(this.O(dt()),this.O(dt()),this,this.options)):r=s[i],r._$AI(n),i++;i<s.length&&(this._$AR(r&&r._$AB.nextSibling,i),s.length=i)}_$AR(t=this._$AA.nextSibling,s){var r;for((r=this._$AP)==null?void 0:r.call(this,!1,!0,s);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var s;this._$AM===void 0&&(this.v=t,(s=this._$AP)==null||s.call(this,t))}}class Mt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,s,r,i,n){this.type=1,this._$AH=b,this._$AN=void 0,this.element=t,this.name=s,this._$AM=i,this.options=n,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=b}_$AI(t,s=this,r,i){const n=this.strings;let o=!1;if(n===void 0)t=X(this,t,s,0),o=!ct(t)||t!==this._$AH&&t!==V,o&&(this._$AH=t);else{const l=t;let h,c;for(t=n[0],h=0;h<n.length-1;h++)c=X(this,l[r+h],s,h),c===V&&(c=this._$AH[h]),o||(o=!ct(c)||c!==this._$AH[h]),c===b?t=b:t!==b&&(t+=(c??"")+n[h+1]),this._$AH[h]=c}o&&!i&&this.j(t)}j(t){t===b?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Ds extends Mt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===b?void 0:t}}class Rs extends Mt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==b)}}class Ns extends Mt{constructor(t,s,r,i,n){super(t,s,r,i,n),this.type=5}_$AI(t,s=this){if((t=X(this,t,s,0)??b)===V)return;const r=this._$AH,i=t===b&&r!==b||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,n=t!==b&&(r===b||i);i&&this.element.removeEventListener(this.name,this,r),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var s;typeof this._$AH=="function"?this._$AH.call(((s=this.options)==null?void 0:s.host)??this.element,t):this._$AH.handleEvent(t)}}class Is{constructor(t,s,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=s,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){X(this,t)}}const zt=lt.litHtmlPolyfillSupport;zt==null||zt(pt,gt),(lt.litHtmlVersions??(lt.litHtmlVersions=[])).push("3.2.0");const Fs=(e,t,s)=>{const r=(s==null?void 0:s.renderBefore)??t;let i=r._$litPart$;if(i===void 0){const n=(s==null?void 0:s.renderBefore)??null;r._$litPart$=i=new gt(t.insertBefore(dt(),n),n,void 0,s??{})}return i._$AI(e),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class E extends K{constructor(){super(...arguments),this.renderOptions={host:this},this.o=void 0}createRenderRoot(){var s;const t=super.createRenderRoot();return(s=this.renderOptions).renderBefore??(s.renderBefore=t.firstChild),t}update(t){const s=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this.o=Fs(s,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this.o)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.o)==null||t.setConnected(!1)}render(){return V}}var Me;E._$litElement$=!0,E.finalized=!0,(Me=globalThis.litElementHydrateSupport)==null||Me.call(globalThis,{LitElement:E});const jt=globalThis.litElementPolyfillSupport;jt==null||jt({LitElement:E});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const j=e=>(t,s)=>{s!==void 0?s.addInitializer((()=>{customElements.define(e,t)})):customElements.define(e,t)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Us={attribute:!0,type:String,converter:xt,reflect:!1,hasChanged:se},Hs=(e=Us,t,s)=>{const{kind:r,metadata:i}=s;let n=globalThis.litPropertyMetadata.get(i);if(n===void 0&&globalThis.litPropertyMetadata.set(i,n=new Map),n.set(s.name,e),r==="accessor"){const{name:o}=s;return{set(l){const h=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,h,e)},init(l){return l!==void 0&&this.P(o,void 0,e),l}}}if(r==="setter"){const{name:o}=s;return function(l){const h=this[o];t.call(this,l),this.requestUpdate(o,h,e)}}throw Error("Unsupported decorator location: "+r)};function A(e){return(t,s)=>typeof s=="object"?Hs(e,t,s):((r,i,n)=>{const o=i.hasOwnProperty(n);return i.constructor.createProperty(n,o?{...r,wrapped:!0}:r),o?Object.getOwnPropertyDescriptor(i,n):void 0})(e,t,s)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function w(e){return A({...e,state:!0,attribute:!1})}/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Vs=e=>e.strings===void 0;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ie={ATTRIBUTE:1,CHILD:2},ne=e=>(...t)=>({_$litDirective$:e,values:t});class oe{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,s,r){this.t=t,this._$AM=s,this.i=r}_$AS(t,s){return this.update(t,s)}update(t,s){return this.render(...s)}}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ht=(e,t)=>{var r;const s=e._$AN;if(s===void 0)return!1;for(const i of s)(r=i._$AO)==null||r.call(i,t,!1),ht(i,t);return!0},At=e=>{let t,s;do{if((t=e._$AM)===void 0)break;s=t._$AN,s.delete(e),e=t}while((s==null?void 0:s.size)===0)},Ie=e=>{for(let t;t=e._$AM;e=t){let s=t._$AN;if(s===void 0)t._$AN=s=new Set;else if(s.has(e))break;s.add(e),Bs(t)}};function zs(e){this._$AN!==void 0?(At(this),this._$AM=e,Ie(this)):this._$AM=e}function js(e,t=!1,s=0){const r=this._$AH,i=this._$AN;if(i!==void 0&&i.size!==0)if(t)if(Array.isArray(r))for(let n=s;n<r.length;n++)ht(r[n],!1),At(r[n]);else r!=null&&(ht(r,!1),At(r));else ht(this,e)}const Bs=e=>{e.type==ie.CHILD&&(e._$AP??(e._$AP=js),e._$AQ??(e._$AQ=zs))};class Ws extends oe{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,s,r){super._$AT(t,s,r),Ie(this),this.isConnected=t._$AU}_$AO(t,s=!0){var r,i;t!==this.isConnected&&(this.isConnected=t,t?(r=this.reconnected)==null||r.call(this):(i=this.disconnected)==null||i.call(this)),s&&(ht(this,t),At(this))}setValue(t){if(Vs(this.t))this.t._$AI(t,this);else{const s=[...this.t._$AH];s[this.i]=t,this.t._$AI(s,this,0)}}disconnected(){}reconnected(){}}/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ys=()=>new Gs;class Gs{}const Bt=new WeakMap,Zs=ne(class extends Ws{render(e){return b}update(e,[t]){var r;const s=t!==this.Y;return s&&this.Y!==void 0&&this.rt(void 0),(s||this.lt!==this.ct)&&(this.Y=t,this.ht=(r=e.options)==null?void 0:r.host,this.rt(this.ct=e.element)),b}rt(e){if(this.isConnected||(e=void 0),typeof this.Y=="function"){const t=this.ht??globalThis;let s=Bt.get(t);s===void 0&&(s=new WeakMap,Bt.set(t,s)),s.get(this.Y)!==void 0&&this.Y.call(this.ht,void 0),s.set(this.Y,e),e!==void 0&&this.Y.call(this.ht,e)}else this.Y.value=e}get lt(){var e,t;return typeof this.Y=="function"?(e=Bt.get(this.ht??globalThis))==null?void 0:e.get(this.Y):(t=this.Y)==null?void 0:t.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});var qs=Object.getOwnPropertyDescriptor,Fe=e=>{throw TypeError(e)},Ks=(e,t,s,r)=>{for(var i=r>1?void 0:r?qs(t,s):t,n=e.length-1,o;n>=0;n--)(o=e[n])&&(i=o(i)||i);return i},Qs=(e,t,s)=>t.has(e)||Fe("Cannot "+s),Js=(e,t,s)=>t.has(e)?Fe("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,s),Ae=(e,t,s)=>(Qs(e,t,"access private method"),s),_t,Ue,He;let Yt=class extends E{constructor(){super(...arguments),Js(this,_t),this.dialog=Ys(),this.isDialogSupported=!!self.HTMLDialogElement,this.explanations=["BRSTM is a file format that contains audio data that's being used for some Nintendo consoles. One of the differences with the usual audio format (MP3, etc) is that this format can contain a loop point, making it suitable for usage in games.","BRSTM file is not included in the repository."]}render(){return this.isDialogSupported?k`
      <button
        type="button"
        id="help"
        aria-label="About BRSTM"
        aria-haspopup="dialog"
        @click=${Ae(this,_t,Ue)}
        title="Click to open explanation"
        ><slot></slot
      ></button>
      <dialog
        id="brstm-explanation"
        aria-labelledby="help-title"
        ${Zs(this.dialog)}
      >
        <h2 id="help-title">About BRSTM</h2>
        ${this.explanations.map(e=>k`<p>${e}</p>`)}

        <button type="button" autofocus @click=${Ae(this,_t,He)}>Close</button>
      </dialog>
    `:k`<details><summary><slot></slot></summary>
        ${this.explanations.map(e=>k`<p>${e}</p>`)}
      </details>`}};_t=new WeakSet;Ue=function(){var e;(e=this.dialog.value)==null||e.showModal()};He=function(){var e;(e=this.dialog.value)==null||e.close()};Yt.styles=z`
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
  `;Yt=Ks([j("nikku-help")],Yt);/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Ve=Symbol("Comlink.proxy"),Xs=Symbol("Comlink.endpoint"),tr=Symbol("Comlink.releaseProxy"),Wt=Symbol("Comlink.finalizer"),$t=Symbol("Comlink.thrown"),ze=e=>typeof e=="object"&&e!==null||typeof e=="function",er={canHandle:e=>ze(e)&&e[Ve],serialize(e){const{port1:t,port2:s}=new MessageChannel;return Be(e,t),[s,[s]]},deserialize(e){return e.start(),Ye(e)}},sr={canHandle:e=>ze(e)&&$t in e,serialize({value:e}){let t;return e instanceof Error?t={isError:!0,value:{message:e.message,name:e.name,stack:e.stack}}:t={isError:!1,value:e},[t,[]]},deserialize(e){throw e.isError?Object.assign(new Error(e.value.message),e.value):e.value}},je=new Map([["proxy",er],["throw",sr]]);function rr(e,t){for(const s of e)if(t===s||s==="*"||s instanceof RegExp&&s.test(t))return!0;return!1}function Be(e,t=globalThis,s=["*"]){t.addEventListener("message",function r(i){if(!i||!i.data)return;if(!rr(s,i.origin)){console.warn(`Invalid origin '${i.origin}' for comlink proxy`);return}const{id:n,type:o,path:l}=Object.assign({path:[]},i.data),h=(i.data.argumentList||[]).map(W);let c;try{const m=l.slice(0,-1).reduce((y,S)=>y[S],e),f=l.reduce((y,S)=>y[S],e);switch(o){case"GET":c=f;break;case"SET":m[l.slice(-1)[0]]=W(i.data.value),c=!0;break;case"APPLY":c=f.apply(m,h);break;case"CONSTRUCT":{const y=new f(...h);c=lr(y)}break;case"ENDPOINT":{const{port1:y,port2:S}=new MessageChannel;Be(e,S),c=qe(y,[y])}break;case"RELEASE":c=void 0;break;default:return}}catch(m){c={value:m,[$t]:0}}Promise.resolve(c).catch(m=>({value:m,[$t]:0})).then(m=>{const[f,y]=Pt(m);t.postMessage(Object.assign(Object.assign({},f),{id:n}),y),o==="RELEASE"&&(t.removeEventListener("message",r),We(t),Wt in e&&typeof e[Wt]=="function"&&e[Wt]())}).catch(m=>{const[f,y]=Pt({value:new TypeError("Unserializable return value"),[$t]:0});t.postMessage(Object.assign(Object.assign({},f),{id:n}),y)})}),t.start&&t.start()}function ir(e){return e.constructor.name==="MessagePort"}function We(e){ir(e)&&e.close()}function Ye(e,t){const s=new Map;return e.addEventListener("message",function(i){const{data:n}=i;if(!n||!n.id)return;const o=s.get(n.id);if(o)try{o(n)}finally{s.delete(n.id)}}),Gt(e,s,[],t)}function vt(e){if(e)throw new Error("Proxy has been released and is not useable")}function Ge(e){return Q(e,new Map,{type:"RELEASE"}).then(()=>{We(e)})}const St=new WeakMap,Ct="FinalizationRegistry"in globalThis&&new FinalizationRegistry(e=>{const t=(St.get(e)||0)-1;St.set(e,t),t===0&&Ge(e)});function nr(e,t){const s=(St.get(t)||0)+1;St.set(t,s),Ct&&Ct.register(e,t,e)}function or(e){Ct&&Ct.unregister(e)}function Gt(e,t,s=[],r=function(){}){let i=!1;const n=new Proxy(r,{get(o,l){if(vt(i),l===tr)return()=>{or(n),Ge(e),t.clear(),i=!0};if(l==="then"){if(s.length===0)return{then:()=>n};const h=Q(e,t,{type:"GET",path:s.map(c=>c.toString())}).then(W);return h.then.bind(h)}return Gt(e,t,[...s,l])},set(o,l,h){vt(i);const[c,m]=Pt(h);return Q(e,t,{type:"SET",path:[...s,l].map(f=>f.toString()),value:c},m).then(W)},apply(o,l,h){vt(i);const c=s[s.length-1];if(c===Xs)return Q(e,t,{type:"ENDPOINT"}).then(W);if(c==="bind")return Gt(e,t,s.slice(0,-1));const[m,f]=Se(h);return Q(e,t,{type:"APPLY",path:s.map(y=>y.toString()),argumentList:m},f).then(W)},construct(o,l){vt(i);const[h,c]=Se(l);return Q(e,t,{type:"CONSTRUCT",path:s.map(m=>m.toString()),argumentList:h},c).then(W)}});return nr(n,e),n}function ar(e){return Array.prototype.concat.apply([],e)}function Se(e){const t=e.map(Pt);return[t.map(s=>s[0]),ar(t.map(s=>s[1]))]}const Ze=new WeakMap;function qe(e,t){return Ze.set(e,t),e}function lr(e){return Object.assign(e,{[Ve]:!0})}function Pt(e){for(const[t,s]of je)if(s.canHandle(e)){const[r,i]=s.serialize(e);return[{type:"HANDLER",name:t,value:r},i]}return[{type:"RAW",value:e},Ze.get(e)||[]]}function W(e){switch(e.type){case"HANDLER":return je.get(e.name).deserialize(e.value);case"RAW":return e.value}}function Q(e,t,s,r){return new Promise(i=>{const n=hr();t.set(n,i),e.start&&e.start(),e.postMessage(Object.assign({id:n},s),r)})}function hr(){return new Array(4).fill(0).map(()=>Math.floor(Math.random()*Number.MAX_SAFE_INTEGER).toString(16)).join("-")}var dr=Symbol("getEndpoint"),cr=e=>{const t=Ye(e);return new Proxy(t,{get(s,r,i){return r===dr?e:Reflect.get(s,r,i)}})};/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const G=ne(class extends oe{constructor(e){var t;if(super(e),e.type!==ie.ATTRIBUTE||e.name!=="class"||((t=e.strings)==null?void 0:t.length)>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return" "+Object.keys(e).filter((t=>e[t])).join(" ")+" "}update(e,[t]){var r,i;if(this.st===void 0){this.st=new Set,e.strings!==void 0&&(this.nt=new Set(e.strings.join(" ").split(/\s/).filter((n=>n!==""))));for(const n in t)t[n]&&!((r=this.nt)!=null&&r.has(n))&&this.st.add(n);return this.render(t)}const s=e.element.classList;for(const n of this.st)n in t||(s.remove(n),this.st.delete(n));for(const n in t){const o=!!t[n];o===this.st.has(n)||(i=this.nt)!=null&&i.has(n)||(o?(s.add(n),this.st.add(n)):(s.remove(n),this.st.delete(n)))}return V}}),pr=`// @ts-check\r
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
`,ur=3e3;var g,T,v,C,M,O,D,L,P,R,N,U,mt,Zt;class fr{constructor(t){x(this,mt);x(this,g);x(this,T);x(this,v);x(this,C);x(this,M);x(this,O);x(this,D);x(this,L);x(this,P);x(this,R);x(this,N);x(this,U);this.metadata=null,d(this,g,null),d(this,T,[]),d(this,v,null),d(this,C,null),d(this,M,0),d(this,O,0),d(this,D,!1),d(this,L,!0),d(this,P,!1),d(this,R,0),d(this,N,0),d(this,U,0),this.options=t,this.init()}async init(t){var s;if(t){if(this.metadata=t,d(this,g,new AudioContext({sampleRate:t.sampleRate})),await a(this,g).suspend(),a(this,g).audioWorklet){const r=new Blob([pr],{type:"text/javascript"}),i=URL.createObjectURL(r);try{await a(this,g).audioWorklet.addModule(i)}finally{URL.revokeObjectURL(i)}}}else this.metadata=null,d(this,g,null);if(d(this,T,[!0]),this.metadata&&this.metadata.numberTracks>1){d(this,T,[]);for(let r=0;r<this.metadata.numberTracks;r++)r===0?a(this,T).push(!0):a(this,T).push(!1)}d(this,v,null),d(this,C,null),d(this,M,0),d(this,O,((s=a(this,g))==null?void 0:s.currentTime)??0),d(this,N,0),d(this,D,!0),d(this,L,!1),d(this,P,!1),d(this,U,1)}async destroy(){var t,s,r;Ut(this,R)._++,this.options.onPause(),(t=a(this,v))==null||t.disconnect(),(s=a(this,v))==null||s.port.close(),(r=a(this,C))==null||r.disconnect(),a(this,g)&&a(this,g).state!=="closed"&&await a(this,g).close(),await this.init()}async start(){if(!this.metadata||!a(this,g))return;const t=a(this,R),{totalSamples:s,sampleRate:r}=this.metadata,i=s/r,n=Math.min(i,3),o=n*r;console.time("getSamples");const l=await this.options.decodeSamples(0,o);if(console.timeEnd("getSamples"),t!==a(this,R))return;Ft(this,mt,Zt).call(this,l,0);const h=[];for(let c=n;c<i;c+=10)c+10<i?h.push({offset:c,size:10}):h.push({offset:c,size:i-c});(async()=>{for(const c of h){if(t!==a(this,R))return;console.time("getSamples");const m=await this.options.decodeSamples(c.offset*r,c.size*r);if(console.timeEnd("getSamples"),t!==a(this,R))return;Ft(this,mt,Zt).call(this,m,c.offset*r)}})()}initPlayback(t){if(!this.metadata||!a(this,g)||a(this,U)==null)return;const{loopStartSample:s,totalSamples:r,sampleRate:i,trackDescriptions:n}=this.metadata;d(this,v,new AudioWorkletNode(a(this,g),"audio-source-processor",{numberOfInputs:0,numberOfOutputs:1,outputChannelCount:[2],processorOptions:{initialSamples:t,loopStartSample:s,totalSamples:r,sampleRate:i,shouldLoop:a(this,D),trackDescriptions:n,trackStates:a(this,T)}}));const o=a(this,v);a(this,v).port&&(a(this,v).port.addEventListener("message",l=>{var h,c,m;if(o===a(this,v))switch(l.data.type){case"BUFFER_LOOPED":{console.log("[AudioPlayer]",l.data.type);break}case"BUFFER_ENDED":{if(l.data.payload.seekVersion!==a(this,N))break;console.log("[AudioPlayer]",l.data.type),d(this,M,r/i),d(this,O,((h=a(this,g))==null?void 0:h.currentTime)??0),d(this,L,!0),this.pause().then(()=>{var f,y;return(y=(f=this.options).onEnded)==null?void 0:y.call(f)});break}case"TIMESTAMP_REPLY":{if(l.data.payload.seekVersion!==a(this,N))break;d(this,M,l.data.payload.timestamp),d(this,O,l.data.payload.contextTime),(m=(c=this.options).onPosition)==null||m.call(c);break}}}),a(this,v).port.start()),d(this,C,a(this,g).createGain()),a(this,C).gain.value=a(this,U),a(this,v).connect(a(this,C)),a(this,C).connect(a(this,g).destination),d(this,L,!1)}async seek(t,s=!0){var i,n;if(!a(this,g)||!this.metadata||!Number.isFinite(t))return;const r=this.metadata.totalSamples/this.metadata.sampleRate;t=Math.max(0,Math.min(r,t)),Ut(this,N)._++,d(this,M,t),d(this,O,a(this,g).currentTime),d(this,L,t>=r),a(this,v)&&a(this,v).port.postMessage({type:"SEEK",payload:{playbackTimeInS:t,seekVersion:a(this,N)}}),(n=(i=this.options).onPosition)==null||n.call(i),s&&!a(this,P)&&await this.play()}async play(){if(a(this,P)||!a(this,g))return;const t=a(this,g);a(this,L)&&await this.seek(0,!1);let s,r=!1;try{r=await Promise.race([t.resume().then(()=>!0),new Promise(i=>{s=setTimeout(()=>i(!1),ur)})])}catch(i){if(t!==a(this,g))return;throw i}finally{s!==void 0&&clearTimeout(s)}if(!(t!==a(this,g)||a(this,P))){if(!r||t.state!=="running")throw new Error("Audio playback did not start. Tap Play to try again.");d(this,P,!0),this.options.onPlay()}}async pause(){var s,r;if(!a(this,P)||!a(this,g))return;const t=a(this,g);await t.suspend(),t===a(this,g)&&(d(this,M,this.getCurrrentPlaybackTime()),d(this,O,t.currentTime),d(this,P,!1),this.options.onPause(),(r=(s=this.options).onPosition)==null||r.call(s))}async setTrackStates(t){d(this,T,t),a(this,v)&&a(this,v).port.postMessage({type:"UPDATE_TRACK_STATES",payload:{trackStates:a(this,T)}})}async setVolume(t){d(this,U,t),a(this,C)&&(a(this,C).gain.value=t)}setLoop(t){d(this,D,t),a(this,v)&&a(this,v).port.postMessage({type:"UPDATE_SHOULD_LOOP",payload:{shouldLoop:a(this,D)}})}getCurrrentPlaybackTime(){if(!a(this,v))return 0;if(!this.metadata||!a(this,g))return a(this,M);const t=this.metadata.totalSamples/this.metadata.sampleRate,s=a(this,P)?Math.max(0,a(this,g).currentTime-a(this,O)):0;let r=a(this,M)+s;const i=this.metadata.loopStartSample/this.metadata.sampleRate;return a(this,D)&&!a(this,L)&&r>=t&&t>i&&(r=i+(r-t)%(t-i)),Math.max(0,Math.min(t,r))}}g=new WeakMap,T=new WeakMap,v=new WeakMap,C=new WeakMap,M=new WeakMap,O=new WeakMap,D=new WeakMap,L=new WeakMap,P=new WeakMap,R=new WeakMap,N=new WeakMap,U=new WeakMap,mt=new WeakSet,Zt=function(t,s=0){!this.metadata||!a(this,g)||(s===0?this.initPlayback(t):a(this,v)&&a(this,v).port.postMessage({type:"ADD_SAMPLES",payload:{samples:t,offset:s}},t.map(r=>r.buffer)))};async function mr(e){const t=Array.from(e).filter(i=>i.kind==="file").map(i=>{var o,l,h;const n=i;return{handle:((o=n.getAsFileSystemHandle)==null?void 0:o.call(n))??null,entry:((l=n.getAsEntry)==null?void 0:l.call(n))??((h=n.webkitGetAsEntry)==null?void 0:h.call(n))??null,file:i.getAsFile()}}),s=[],r=[];for(const i of t){let n=!1;if(i.handle)try{const o=await i.handle;if(o){const l=[];await Ke(o,o.name,l),s.push(...l),o.kind==="directory"&&r.push(o.name),n=!0}}catch{}!n&&i.entry&&(i.entry.isDirectory&&r.push(i.entry.name),await Qe(i.entry,i.entry.name,s),n=!0),!n&&i.file&&s.push({file:i.file,relativePath:i.file.name})}return{files:s,folderName:r.length===1?r[0]:r.length>1?"Dropped folders":null,preserveFolderRoots:r.length>1}}async function Ke(e,t,s){if(e.kind==="file"){if(!e.getFile)throw new Error("Could not read dropped file");s.push({file:await e.getFile(),relativePath:t});return}if(!e.values)throw new Error("Could not read dropped folder");for await(const r of e.values())await Ke(r,`${t}/${r.name}`,s)}async function Qe(e,t,s){if(e.isFile){if(!e.file)throw new Error("Could not read dropped file");const i=await new Promise((n,o)=>e.file(n,o));s.push({file:i,relativePath:t});return}if(!e.isDirectory||!e.createReader)return;const r=e.createReader();for(;;){const i=await new Promise((n,o)=>r.readEntries(n,o));if(!i.length)return;for(const n of i)await Qe(n,`${t}/${n.name}`,s)}}var Z,I,J;class gr{constructor({renderCallback:t}){x(this,Z,!1);x(this,I,null);x(this,J);d(this,I,null),d(this,J,t),this.render=this.render.bind(this)}start(){a(this,Z)||(d(this,Z,!0),d(this,I,requestAnimationFrame(this.render)))}stop(){a(this,I)&&cancelAnimationFrame(a(this,I)),d(this,I,null),d(this,Z,!1)}render(){a(this,J)&&a(this,J).call(this),a(this,Z)&&d(this,I,requestAnimationFrame(this.render))}}Z=new WeakMap,I=new WeakMap,J=new WeakMap;var yr=Object.defineProperty,vr=Object.getOwnPropertyDescriptor,Je=e=>{throw TypeError(e)},$=(e,t,s,r)=>{for(var i=r>1?void 0:r?vr(t,s):t,n=e.length-1,o;n>=0;n--)(o=e[n])&&(i=(r?o(t,s,i):o(i))||i);return r&&i&&yr(t,s,i),i},br=(e,t,s)=>t.has(e)||Je("Cannot "+s),_r=(e,t,s)=>t.has(e)?Je("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,s),u=(e,t,s)=>(br(e,t,"access private method"),s),p,Et,qt,Xe,ts,ae,es,tt,Ot,ss,rs,le,is,he,de,nt,ns,os,ce,as,ls,hs,ds;let _=class extends E{constructor(){super(...arguments),_r(this,p),this.playPauseIcon="play",this.loop="on",this.volume=1,this.muted=!1,this.progressMax=0,this.progressValue=0,this.timeDisplayMax=0,this.timeDisplayValue=0,this.tracksCount=1,this.tracksActive=[!0],this.disabled=!0,this.fileDraggingOver=!1,this.trackTitle="",this.errorMessage="",this.folderFiles=[],this.folderName="",this.selectedFile=null,this.currentFile=null,this.loading=!1,this.audioPlayer=null,this.folderPaths=new WeakMap,this.preserveFolderRoots=!1,this.selectionGeneration=0,this.loadingFinished=Promise.resolve(),this.finishLoading=null,this.workerInstance=cr(new Worker(new URL("/nikku/assets/worker-BbnNAK_n.js",import.meta.url),{})),this.timer=new gr({renderCallback:()=>{if(!this.audioPlayer)return;const e=this.audioPlayer.getCurrrentPlaybackTime();this.progressValue=e,this.timeDisplayValue=e}})}render(){var e;return k`
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
            @progressValueChange=${u(this,p,as)}
          ></controls-progress>
        </div>
        <div id="controls-select-sources">
          <label class=${G({"source-picker":!0,loading:this.loading})}>
            <input
              type="file"
              aria-label="Select file"
              accept=".brstm,.bfstm"
              ?disabled=${this.loading}
              @change=${u(this,p,ss)}
            />
            <span aria-hidden="true">Select file…</span>
          </label>
          <label class=${G({"source-picker":!0,loading:this.loading})}>
            <input type="file" webkitdirectory multiple
              aria-label="Select folder"
              ?disabled=${this.loading}
              @change=${u(this,p,rs)} />
            <span aria-hidden="true">Select folder…</span>
          </label>
        </div>

        <div id="controls-play-pause">
          <controls-play-pause
            ?disabled=${this.disabled}
            mode=${this.playPauseIcon}
            @playPauseClick=${u(this,p,os)}
          ></controls-play-pause>
        </div>
        <div id="controls-others">
          <controls-loop
            ?disabled=${this.disabled}
            mode=${this.loop}
            @loopClick=${u(this,p,ls)}
          ></controls-loop>
          <controls-volume
            ?disabled=${this.disabled}
            ?muted=${this.muted}
            volume=${this.volume}
            @mutedChange=${u(this,p,hs)}
            @volumeChange=${u(this,p,ds)}
          ></controls-volume>
        </div>
        <div id="controls-tracks">
          <controls-tracks
            ?disabled=${this.disabled}
            count=${this.tracksCount}
            .active=${this.tracksActive}
            @tracksActiveChange=${u(this,p,ns)}
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
                  <li class=${G({selected:t===this.selectedFile,current:t===this.currentFile})}>
                    <button class="folder-item"
                      aria-label=${`Play ${u(this,p,qt).call(this,t)}`}
                      aria-current=${t===this.currentFile?"true":"false"}
                      ?disabled=${this.loading}
                      @click=${()=>u(this,p,ts).call(this,t)}>
                      <span class="file-path">${u(this,p,qt).call(this,t)}</span>
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
        class=${G({hidden:!this.fileDraggingOver})}
      >
        Drop BRSTM or BFSTM files or a folder
      </div>
    `}firstUpdated(){window.addEventListener("dragover",e=>{e.preventDefault(),this.fileDraggingOver=!0}),window.addEventListener("dragend",e=>{this.fileDraggingOver=!1}),window.addEventListener("dragleave",e=>{this.fileDraggingOver=!1}),window.addEventListener("drop",e=>{var s,r;e.preventDefault(),this.fileDraggingOver=!1;const t=++this.selectionGeneration;if(!((r=(s=e.dataTransfer)==null?void 0:s.items)!=null&&r.length)){u(this,p,tt).call(this,new Error("No file read"));return}u(this,p,es).call(this,mr(e.dataTransfer.items),t)})}};p=new WeakSet;Et=function(e){return this.folderPaths.get(e)||e.webkitRelativePath||e.name};qt=function(e){const t=u(this,p,Et).call(this,e).split("/");return!this.preserveFolderRoots&&t.length>1?t.slice(1).join("/"):t.join("/")};Xe=async function(e){var r;if(!this.currentFile||this.loading)return;const t=this.folderFiles.indexOf(this.currentFile),s=t>=0?this.folderFiles[t+e]:void 0;s&&(this.selectedFile=s,await u(this,p,nt).call(this,s),await this.updateComplete,(r=u(this,p,ae).call(this,s))==null||r.scrollIntoView({block:"nearest"}))};ts=async function(e){if(this.loading)return;this.selectionGeneration++,this.selectedFile=e,await u(this,p,nt).call(this,e),await this.updateComplete;const t=u(this,p,ae).call(this,e);t==null||t.scrollIntoView({block:"nearest"}),t==null||t.focus()};ae=function(e){const t=this.folderFiles.indexOf(e);if(!(t<0))return this.renderRoot.querySelectorAll(".folder-item")[t]};es=async function(e,t){try{const s=await e;if(t!==this.selectionGeneration||(await this.loadingFinished,t!==this.selectionGeneration))return;s.folderName?await u(this,p,le).call(this,s.files,s.folderName,s.preserveFolderRoots):s.files[0]?await u(this,p,nt).call(this,s.files[0].file):u(this,p,tt).call(this,new Error("No file read"))}catch(s){t===this.selectionGeneration&&u(this,p,tt).call(this,s)}};tt=function(e){this.errorMessage=e.message,console.error(e)};Ot=function(){this.errorMessage=""};ss=function(e){const t=e.target,s=t.files;if(!s||!s.length)return;this.selectionGeneration++;const r=s[0];t.value="",u(this,p,nt).call(this,r).finally(()=>t.focus())};rs=function(e){const t=e.target,s=Array.from(t.files||[]);if(!s.length)return;this.selectionGeneration++;const r=s[0].webkitRelativePath.split("/")[0]||"Selected folder",i=s.map(n=>({file:n,relativePath:n.webkitRelativePath||n.name}));t.value="",u(this,p,le).call(this,i,r).finally(()=>t.focus())};le=async function(e,t,s=!1){this.folderPaths=new WeakMap;for(const{file:r,relativePath:i}of e)this.folderPaths.set(r,i);this.preserveFolderRoots=s,this.folderName=t,this.folderFiles=e.map(({file:r})=>r).filter(r=>/\.(brstm|bfstm)$/i.test(r.name)).sort((r,i)=>u(this,p,Et).call(this,r).localeCompare(u(this,p,Et).call(this,i),void 0,{numeric:!0})),this.selectedFile=this.folderFiles[0]||null,this.selectedFile?await u(this,p,nt).call(this,this.selectedFile):await u(this,p,is).call(this)};is=async function(){var e;if(!this.loading){u(this,p,Ot).call(this),u(this,p,he).call(this),this.disabled=!0,this.currentFile=null,this.trackTitle="";try{await((e=this.audioPlayer)==null?void 0:e.destroy()),this.progressValue=0,this.progressMax=0,this.timeDisplayValue=0,this.timeDisplayMax=0,this.playPauseIcon="play",this.timer.stop()}finally{u(this,p,de).call(this)}}};he=function(){this.loading=!0,this.loadingFinished=new Promise(e=>{this.finishLoading=e})};de=function(){var e;this.loading=!1,(e=this.finishLoading)==null||e.call(this),this.finishLoading=null};nt=async function(e){var t;if(!this.loading){this.folderFiles.includes(e)||(this.folderFiles=[],this.folderName="",this.selectedFile=null,this.folderPaths=new WeakMap,this.preserveFolderRoots=!1),u(this,p,he).call(this),this.disabled=!0,u(this,p,Ot).call(this),this.currentFile=null,this.trackTitle="";try{this.audioPlayer&&await this.audioPlayer.destroy(),this.progressValue=0,this.progressMax=0,this.timeDisplayValue=0,this.timeDisplayMax=0;const s=await e.arrayBuffer();await this.workerInstance.init(qe(s,[s]));const r=await this.workerInstance.getMetadata();if(this.audioPlayer||(this.audioPlayer=new fr({onPlay:()=>{this.playPauseIcon="pause",this.timer.start()},onPause:()=>{this.playPauseIcon="play",this.timer.stop()},onEnded:()=>u(this,p,Xe).call(this,1),onPosition:()=>{var o;if(this.playPauseIcon==="play"){const l=((o=this.audioPlayer)==null?void 0:o.getCurrrentPlaybackTime())??0;this.progressValue=l,this.timeDisplayValue=l}},decodeSamples:async(o,l)=>await this.workerInstance.getSamples(o,l)||[]})),!r)throw new Error("metadata is undefined");await this.audioPlayer.init(r),this.audioPlayer.setLoop(this.loop==="on"),await this.audioPlayer.setVolume(this.muted?0:this.volume),await this.audioPlayer.start();const i=r.totalSamples/r.sampleRate,n=r.numberTracks;this.playPauseIcon="play",this.progressMax=i,this.timeDisplayMax=i,this.tracksCount=n,this.tracksActive=new Array(n).fill(!0).map((o,l)=>l===0),this.disabled=!1,this.trackTitle=e.name,this.currentFile=e,u(this,p,ce).call(this)}catch(s){this.disabled=!0,await((t=this.audioPlayer)==null?void 0:t.destroy()),this.currentFile=null,this.trackTitle="",u(this,p,tt).call(this,s)}finally{u(this,p,de).call(this)}}};ns=function(e){var s;const t=e.detail.active;this.tracksActive=t,(s=this.audioPlayer)==null||s.setTrackStates(t)};os=function(e){var s;const t=e.detail.mode;t==="play"?(s=this.audioPlayer)==null||s.pause():t==="pause"&&u(this,p,ce).call(this)};ce=async function(){var e;try{await((e=this.audioPlayer)==null?void 0:e.play()),u(this,p,Ot).call(this)}catch(t){this.playPauseIcon="play",this.timer.stop(),u(this,p,tt).call(this,t)}};as=function(e){var s;const t=e.detail.value;this.progressValue=t,this.timeDisplayValue=t,(s=this.audioPlayer)==null||s.seek(t)};ls=function(e){var s,r;const t=e.detail.mode;this.loop=t,t==="on"?(s=this.audioPlayer)==null||s.setLoop(!0):t==="off"&&((r=this.audioPlayer)==null||r.setLoop(!1))};hs=function(e){var s,r;const t=e.detail.muted;this.muted=t,t?(s=this.audioPlayer)==null||s.setVolume(0):(r=this.audioPlayer)==null||r.setVolume(this.volume)};ds=function(e){var s;const t=e.detail.volume;this.volume=t,this.muted=!1,(s=this.audioPlayer)==null||s.setVolume(t)};_.styles=z`
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
  `;$([w()],_.prototype,"playPauseIcon",2);$([w()],_.prototype,"loop",2);$([w()],_.prototype,"volume",2);$([w()],_.prototype,"muted",2);$([w()],_.prototype,"progressMax",2);$([w()],_.prototype,"progressValue",2);$([w()],_.prototype,"timeDisplayMax",2);$([w()],_.prototype,"timeDisplayValue",2);$([w()],_.prototype,"tracksCount",2);$([w()],_.prototype,"tracksActive",2);$([w()],_.prototype,"disabled",2);$([w()],_.prototype,"fileDraggingOver",2);$([w()],_.prototype,"trackTitle",2);$([w()],_.prototype,"errorMessage",2);$([w()],_.prototype,"folderFiles",2);$([w()],_.prototype,"folderName",2);$([w()],_.prototype,"selectedFile",2);$([w()],_.prototype,"currentFile",2);$([w()],_.prototype,"loading",2);_=$([j("nikku-main")],_);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class Kt extends oe{constructor(t){if(super(t),this.it=b,t.type!==ie.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(t){if(t===b||t==null)return this._t=void 0,this.it=t;if(t===V)return t;if(typeof t!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(t===this.it)return this._t;this.it=t;const s=[t];return s.raw=s,this._t={_$litType$:this.constructor.resultType,strings:s,values:[]}}}Kt.directiveName="unsafeHTML",Kt.resultType=1;const Tt=ne(Kt),$r=`<svg width="100" height="100" viewBox="0 0 100 100" fill="#198813" xmlns="http://www.w3.org/2000/svg">\r
<path d="M77.9375 48.2609C79.2874 49.0274 79.2874 50.9726 77.9375 51.7391L38.2376 74.2841C36.9043 75.0413 35.25 74.0783 35.25 72.545L35.25 27.455C35.25 25.9217 36.9044 24.9587 38.2376 25.7159L77.9375 48.2609Z" />\r
</svg>\r
`,wr=`<svg width="100" height="100" viewBox="0 0 100 100" fill="#198813" xmlns="http://www.w3.org/2000/svg">\r
<rect x="27" y="28" width="16" height="45" rx="2" />\r
<rect x="58" y="28" width="15" height="45" rx="2" />\r
</svg>\r
`;var xr=Object.defineProperty,kr=Object.getOwnPropertyDescriptor,cs=e=>{throw TypeError(e)},pe=(e,t,s,r)=>{for(var i=r>1?void 0:r?kr(t,s):t,n=e.length-1,o;n>=0;n--)(o=e[n])&&(i=(r?o(t,s,i):o(i))||i);return r&&i&&xr(t,s,i),i},Ar=(e,t,s)=>t.has(e)||cs("Cannot "+s),Sr=(e,t,s)=>t.has(e)?cs("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,s),Cr=(e,t,s)=>(Ar(e,t,"access private method"),s),Qt,ps;let ut=class extends E{constructor(){super(...arguments),Sr(this,Qt),this.disabled=!1,this.mode="play"}render(){return k`<button
      class=${G({button:!0,disabled:this.disabled})}
      type="button"
      aria-label=${this.mode==="play"?"Play":"Pause"}
      ?disabled=${this.disabled}
      @click=${Cr(this,Qt,ps)}
    >
      <span aria-hidden="true">${this.mode==="play"?Tt($r):Tt(wr)}</span>
    </button>`}};Qt=new WeakSet;ps=function(){if(this.disabled)return;const e=this.mode==="play"?"pause":"play";this.dispatchEvent(new CustomEvent("playPauseClick",{detail:{mode:e}}))};ut.styles=z`
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
  `;pe([A({type:Boolean})],ut.prototype,"disabled",2);pe([A({type:String})],ut.prototype,"mode",2);ut=pe([j("controls-play-pause")],ut);var Pr=Object.defineProperty,Er=Object.getOwnPropertyDescriptor,Lt=(e,t,s,r)=>{for(var i=r>1?void 0:r?Er(t,s):t,n=e.length-1,o;n>=0;n--)(o=e[n])&&(i=(r?o(t,s,i):o(i))||i);return r&&i&&Pr(t,s,i),i};let et=class extends E{constructor(){super(...arguments),this.active=[],this.count=0,this.disabled=!1}render(){return k`
      <div
        id="container"
        role="group"
        aria-label="Active audio tracks"
        class=${G({hidden:this.count===1||this.disabled})}
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
    `}};et.styles=z`
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
  `;Lt([A({type:Array})],et.prototype,"active",2);Lt([A({type:Number})],et.prototype,"count",2);Lt([A({type:Boolean})],et.prototype,"disabled",2);et=Lt([j("controls-tracks")],et);var Tr=Object.defineProperty,Mr=Object.getOwnPropertyDescriptor,Dt=(e,t,s,r)=>{for(var i=r>1?void 0:r?Mr(t,s):t,n=e.length-1,o;n>=0;n--)(o=e[n])&&(i=(r?o(t,s,i):o(i))||i);return r&&i&&Tr(t,s,i),i};let st=class extends E{constructor(){super(...arguments),this.disabled=!1,this.value=0,this.max=0}render(){return k` <div class="progress-time-display" role="group" aria-label="Playback time">
      <div class="time" id="current"><span class="sr-only">Elapsed </span>${Ce(this.value)}</div>
      <div class="separator" aria-hidden="true">/</div>
      <div class="time" id="total"><span class="sr-only">Duration </span>${Ce(this.max)}</div>
    </div>`}};st.styles=z`
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
  `;Dt([A({type:Boolean})],st.prototype,"disabled",2);Dt([A({type:Number})],st.prototype,"value",2);Dt([A({type:Number})],st.prototype,"max",2);st=Dt([j("controls-time-display")],st);function Ce(e){const t=Pe(Math.floor(e/60)),s=Pe(Math.floor(e%60));return`${t}:${s}`}function Pe(e){return e<10?`0${e}`:e}var Or=Object.defineProperty,Lr=Object.getOwnPropertyDescriptor,us=e=>{throw TypeError(e)},Rt=(e,t,s,r)=>{for(var i=r>1?void 0:r?Lr(t,s):t,n=e.length-1,o;n>=0;n--)(o=e[n])&&(i=(r?o(t,s,i):o(i))||i);return r&&i&&Or(t,s,i),i},Dr=(e,t,s)=>t.has(e)||us("Cannot "+s),Rr=(e,t,s)=>t.has(e)?us("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,s),Nr=(e,t,s)=>(Dr(e,t,"access private method"),s),Jt,fs;let rt=class extends E{constructor(){super(...arguments),Rr(this,Jt),this.disabled=!1,this.value=0,this.max=0}render(){return k`<input
      type="range"
      aria-label="Playback position"
      aria-valuetext=${`${Ee(this.value)} of ${Ee(this.max)}`}
      min="0"
      max=${this.max}
      step="any"
      .value=${String(this.value)}
      style=${`--progress: ${this.max>0?Math.max(0,Math.min(100,this.value/this.max*100)):0}%`}
      ?disabled=${this.disabled||this.max<=0}
      @input=${Nr(this,Jt,fs)}
    />`}};Jt=new WeakSet;fs=function(e){this.disabled||this.max<=0||(this.value=Number(e.target.value),this.dispatchEvent(new CustomEvent("progressValueChange",{detail:{value:this.value}})))};rt.styles=z`
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
  `;Rt([A({type:Boolean})],rt.prototype,"disabled",2);Rt([A({type:Number})],rt.prototype,"value",2);Rt([A({type:Number})],rt.prototype,"max",2);rt=Rt([j("controls-progress")],rt);function Ee(e){const t=Math.max(0,Math.floor(e)),s=Math.floor(t/60),r=t%60;return`${s} minute${s===1?"":"s"} ${r} second${r===1?"":"s"}`}const Ir=`<svg width="100" height="100" viewBox="0 0 100 100" fill="#198813" xmlns="http://www.w3.org/2000/svg">\r
<path fill-rule="evenodd" clip-rule="evenodd" d="M37.5858 38C37.851 38 38.1054 37.8946 38.2929 37.7071L48.2929 27.7071C48.9229 27.0771 50 27.5233 50 28.4142V71.5858C50 72.4767 48.9229 72.9228 48.2929 72.2929L38.2929 62.2929C38.1054 62.1054 37.851 62 37.5858 62H21C20.4477 62 20 61.5523 20 61V39C20 38.4477 20.4477 38 21 38H37.5858Z"/>\r
<path fill-rule="evenodd" clip-rule="evenodd" d="M71.9382 50.0662C71.7795 42.8723 68.0938 35.4875 61.0359 30.0266C60.5991 29.6887 60.4988 29.0641 60.8236 28.6175L63.1763 25.3825C63.5012 24.9359 64.1276 24.8362 64.5659 25.1722C72.9864 31.628 77.7327 40.6844 77.9368 49.9338C78.1425 59.2585 73.72 68.4296 64.4895 74.9305C64.038 75.2486 63.4157 75.1236 63.1094 74.6641L60.8906 71.3359C60.5842 70.8764 60.71 70.2565 61.16 69.9364C68.7821 64.5159 72.0959 57.2151 71.9382 50.0662Z"/>\r
<path fill-rule="evenodd" clip-rule="evenodd" d="M89.375 50C89.375 35.887 83.3874 22.0191 71.7151 14.0769C71.2585 13.7662 71.1219 13.1482 71.4201 12.6834L73.5799 9.31661C73.8781 8.85175 74.4987 8.71651 74.9565 9.0254C88.6709 18.2782 95.375 34.2625 95.375 50C95.375 65.7375 88.6709 81.7218 74.9565 90.9746C74.4987 91.2835 73.8781 91.1482 73.5799 90.6834L71.4201 87.3166C71.1219 86.8518 71.2585 86.2338 71.7151 85.9231C83.3874 77.9809 89.375 64.113 89.375 50Z"/>\r
</svg>\r
`,Fr=`<svg width="100" height="100" viewBox="0 0 100 100" fill="#198813" xmlns="http://www.w3.org/2000/svg">\r
<rect x="81.5937" y="36.1014" width="5.02197" height="34.2892" rx="1" transform="rotate(45 81.5937 36.1014)"/>\r
<rect x="85.1447" y="60.3475" width="5.02197" height="34.2892" rx="1" transform="rotate(135 85.1447 60.3475)"/>\r
<path fill-rule="evenodd" clip-rule="evenodd" d="M37.5858 38C37.851 38 38.1054 37.8946 38.2929 37.7071L48.2929 27.7071C48.9229 27.0771 50 27.5233 50 28.4142V71.5858C50 72.4767 48.9229 72.9228 48.2929 72.2929L38.2929 62.2929C38.1054 62.1053 37.851 62 37.5858 62H21C20.4477 62 20 61.5523 20 61V39C20 38.4477 20.4477 38 21 38L37.5858 38Z"/>\r
</svg>\r
`;var Ur=Object.defineProperty,Hr=Object.getOwnPropertyDescriptor,ms=e=>{throw TypeError(e)},Nt=(e,t,s,r)=>{for(var i=r>1?void 0:r?Hr(t,s):t,n=e.length-1,o;n>=0;n--)(o=e[n])&&(i=(r?o(t,s,i):o(i))||i);return r&&i&&Ur(t,s,i),i},Vr=(e,t,s)=>t.has(e)||ms("Cannot "+s),zr=(e,t,s)=>t.has(e)?ms("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,s),Te=(e,t,s)=>(Vr(e,t,"access private method"),s),wt,gs,ys;let it=class extends E{constructor(){super(...arguments),zr(this,wt),this.disabled=!1,this.muted=!1,this.volume=1}render(){return k`<div class="volume-container">
      <button type="button" aria-label=${this.muted?"Unmute":"Mute"} aria-pressed=${this.muted}
        ?disabled=${this.disabled} @click=${Te(this,wt,gs)}>
        <span aria-hidden="true">${Tt(this.muted?Fr:Ir)}</span>
      </button>
      <input type="range" aria-label="Volume"
        aria-valuetext=${`${Math.round(this.volume*100)}%${this.muted?", muted":""}`}
        min="0" max="100" step="1"
        .value=${String(Math.round(this.volume*100))}
        style=${`--volume: ${this.muted?0:Math.round(this.volume*100)}%`}
        ?disabled=${this.disabled} @input=${Te(this,wt,ys)} />
    </div>`}};wt=new WeakSet;gs=function(){this.disabled||(this.muted=!this.muted,this.dispatchEvent(new CustomEvent("mutedChange",{detail:{muted:this.muted}})))};ys=function(e){this.disabled||(this.volume=Number(e.target.value)/100,this.muted=!1,this.dispatchEvent(new CustomEvent("volumeChange",{detail:{volume:this.volume}})))};it.styles=z`
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
  `;Nt([A({type:Boolean})],it.prototype,"disabled",2);Nt([A({type:Boolean})],it.prototype,"muted",2);Nt([A({type:Number})],it.prototype,"volume",2);it=Nt([j("controls-volume")],it);const jr=`<svg width="100" height="100" viewBox="0 0 100 100" fill="#198813" xmlns="http://www.w3.org/2000/svg">\r
<path d="M20 38C20 29.5 26.5 20 38 20L62 20C72 20 80 28 80 38L80 39L70 39C70 39 70 42.5 70 38C70 33.5 66.5 30 62 30C57.5 30 42.5 30 38 30C33.5 30 30 33.5 30 38C30 42.5 30 41 30 41L20 41L20 38Z"/>\r
<path d="M74.5 54L60.2106 39L88.7894 39L74.5 54Z"/>\r
<path d="M79 61C79 69.5 72.5 79 61 79L37 79C27 79 19 71 19 61L19 60L29 60C29 60 29 56.5 29 61C29 65.5 32.5 69 37 69C41.5 69 56.5 69 61 69C65.5 69 69 65.5 69 61C69 56.5 69 58 69 58L79 58L79 61Z"/>\r
<path d="M24.5 45L38.7894 60H10.2106L24.5 45Z"/>\r
</svg>\r
`;var Br=Object.defineProperty,Wr=Object.getOwnPropertyDescriptor,vs=e=>{throw TypeError(e)},ue=(e,t,s,r)=>{for(var i=r>1?void 0:r?Wr(t,s):t,n=e.length-1,o;n>=0;n--)(o=e[n])&&(i=(r?o(t,s,i):o(i))||i);return r&&i&&Br(t,s,i),i},Yr=(e,t,s)=>t.has(e)||vs("Cannot "+s),Gr=(e,t,s)=>t.has(e)?vs("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,s),Zr=(e,t,s)=>(Yr(e,t,"access private method"),s),Xt,bs;let ft=class extends E{constructor(){super(...arguments),Gr(this,Xt),this.disabled=!1,this.mode="on"}render(){return k`<button
      class=${G({on:this.mode==="on",off:this.mode==="off",disabled:this.disabled,button:!0})}
      type="button"
      aria-label="Loop"
      aria-pressed=${this.mode==="on"}
      ?disabled=${this.disabled}
      @click=${Zr(this,Xt,bs)}
    >
      <span aria-hidden="true">${Tt(jr)}</span>
    </button>`}};Xt=new WeakSet;bs=function(){if(this.disabled)return;const e=this.mode==="on"?"off":"on";this.dispatchEvent(new CustomEvent("loopClick",{detail:{mode:e}})),this.mode=e};ft.styles=z`
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
  `;ue([A({type:Boolean})],ft.prototype,"disabled",2);ue([A({type:String})],ft.prototype,"mode",2);ft=ue([j("controls-loop")],ft);
