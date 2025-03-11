var le=e=>{throw TypeError(e)};var Rt=(e,t,s)=>t.has(e)||le("Cannot "+s);var l=(e,t,s)=>(Rt(e,t,"read from private field"),s?s.call(e):t.get(e)),w=(e,t,s)=>t.has(e)?le("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,s),d=(e,t,s,r)=>(Rt(e,t,"write to private field"),r?r.call(e,s):t.set(e,s),s),$t=(e,t,s)=>(Rt(e,t,"access private method"),s);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const n of o.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&r(n)}).observe(document,{childList:!0,subtree:!0});function s(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(i){if(i.ep)return;i.ep=!0;const o=s(i);fetch(i.href,o)}})();/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const bt=globalThis,Gt=bt.ShadowRoot&&(bt.ShadyCSS===void 0||bt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Qt=Symbol(),he=new WeakMap;let Se=class{constructor(t,s,r){if(this._$cssResult$=!0,r!==Qt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=s}get styleSheet(){let t=this.o;const s=this.t;if(Gt&&t===void 0){const r=s!==void 0&&s.length===1;r&&(t=he.get(s)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&he.set(s,t))}return t}toString(){return this.cssText}};const ps=e=>new Se(typeof e=="string"?e:e+"",void 0,Qt),U=(e,...t)=>{const s=e.length===1?e[0]:t.reduce((r,i,o)=>r+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[o+1],e[0]);return new Se(s,e,Qt)},fs=(e,t)=>{if(Gt)e.adoptedStyleSheets=t.map(s=>s instanceof CSSStyleSheet?s:s.styleSheet);else for(const s of t){const r=document.createElement("style"),i=bt.litNonce;i!==void 0&&r.setAttribute("nonce",i),r.textContent=s.cssText,e.appendChild(r)}},de=Gt?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let s="";for(const r of t.cssRules)s+=r.cssText;return ps(s)})(e):e;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:gs,defineProperty:ms,getOwnPropertyDescriptor:vs,getOwnPropertyNames:ys,getOwnPropertySymbols:_s,getPrototypeOf:$s}=Object,R=globalThis,ce=R.trustedTypes,ws=ce?ce.emptyScript:"",Vt=R.reactiveElementPolyfillSupport,lt=(e,t)=>e,Ct={toAttribute(e,t){switch(t){case Boolean:e=e?ws:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let s=e;switch(t){case Boolean:s=e!==null;break;case Number:s=e===null?null:Number(e);break;case Object:case Array:try{s=JSON.parse(e)}catch{s=null}}return s}},Jt=(e,t)=>!gs(e,t),ue={attribute:!0,type:String,converter:Ct,reflect:!1,hasChanged:Jt};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),R.litPropertyMetadata??(R.litPropertyMetadata=new WeakMap);class G extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,s=ue){if(s.state&&(s.attribute=!1),this._$Ei(),this.elementProperties.set(t,s),!s.noAccessor){const r=Symbol(),i=this.getPropertyDescriptor(t,r,s);i!==void 0&&ms(this.prototype,t,i)}}static getPropertyDescriptor(t,s,r){const{get:i,set:o}=vs(this.prototype,t)??{get(){return this[s]},set(n){this[s]=n}};return{get(){return i==null?void 0:i.call(this)},set(n){const h=i==null?void 0:i.call(this);o.call(this,n),this.requestUpdate(t,h,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??ue}static _$Ei(){if(this.hasOwnProperty(lt("elementProperties")))return;const t=$s(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(lt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(lt("properties"))){const s=this.properties,r=[...ys(s),..._s(s)];for(const i of r)this.createProperty(i,s[i])}const t=this[Symbol.metadata];if(t!==null){const s=litPropertyMetadata.get(t);if(s!==void 0)for(const[r,i]of s)this.elementProperties.set(r,i)}this._$Eh=new Map;for(const[s,r]of this.elementProperties){const i=this._$Eu(s,r);i!==void 0&&this._$Eh.set(i,s)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const s=[];if(Array.isArray(t)){const r=new Set(t.flat(1/0).reverse());for(const i of r)s.unshift(de(i))}else t!==void 0&&s.push(de(t));return s}static _$Eu(t,s){const r=s.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(s=>this.enableUpdating=s),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(s=>s(this))}addController(t){var s;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((s=t.hostConnected)==null||s.call(t))}removeController(t){var s;(s=this._$EO)==null||s.delete(t)}_$E_(){const t=new Map,s=this.constructor.elementProperties;for(const r of s.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return fs(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(s=>{var r;return(r=s.hostConnected)==null?void 0:r.call(s)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(s=>{var r;return(r=s.hostDisconnected)==null?void 0:r.call(s)})}attributeChangedCallback(t,s,r){this._$AK(t,r)}_$EC(t,s){var o;const r=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,r);if(i!==void 0&&r.reflect===!0){const n=(((o=r.converter)==null?void 0:o.toAttribute)!==void 0?r.converter:Ct).toAttribute(s,r.type);this._$Em=t,n==null?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(t,s){var o;const r=this.constructor,i=r._$Eh.get(t);if(i!==void 0&&this._$Em!==i){const n=r.getPropertyOptions(i),h=typeof n.converter=="function"?{fromAttribute:n.converter}:((o=n.converter)==null?void 0:o.fromAttribute)!==void 0?n.converter:Ct;this._$Em=i,this[i]=h.fromAttribute(s,n.type),this._$Em=null}}requestUpdate(t,s,r){if(t!==void 0){if(r??(r=this.constructor.getPropertyOptions(t)),!(r.hasChanged??Jt)(this[t],s))return;this.P(t,s,r)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,s,r){this._$AL.has(t)||this._$AL.set(t,s),r.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(s){Promise.reject(s)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var r;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[o,n]of this._$Ep)this[o]=n;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[o,n]of i)n.wrapped!==!0||this._$AL.has(o)||this[o]===void 0||this.P(o,this[o],n)}let t=!1;const s=this._$AL;try{t=this.shouldUpdate(s),t?(this.willUpdate(s),(r=this._$EO)==null||r.forEach(i=>{var o;return(o=i.hostUpdate)==null?void 0:o.call(i)}),this.update(s)):this._$EU()}catch(i){throw t=!1,this._$EU(),i}t&&this._$AE(s)}willUpdate(t){}_$AE(t){var s;(s=this._$EO)==null||s.forEach(r=>{var i;return(i=r.hostUpdated)==null?void 0:i.call(r)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(s=>this._$EC(s,this[s]))),this._$EU()}updated(t){}firstUpdated(t){}}G.elementStyles=[],G.shadowRootOptions={mode:"open"},G[lt("elementProperties")]=new Map,G[lt("finalized")]=new Map,Vt==null||Vt({ReactiveElement:G}),(R.reactiveElementVersions??(R.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ht=globalThis,At=ht.trustedTypes,pe=At?At.createPolicy("lit-html",{createHTML:e=>e}):void 0,ke="$lit$",L=`lit$${Math.random().toFixed(9).slice(2)}$`,Me="?"+L,bs=`<${Me}>`,X=document,ct=()=>X.createComment(""),ut=e=>e===null||typeof e!="object"&&typeof e!="function",te=Array.isArray,xs=e=>te(e)||typeof(e==null?void 0:e[Symbol.iterator])=="function",Ut=`[ 	
\f\r]`,at=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,fe=/-->/g,ge=/>/g,H=RegExp(`>|${Ut}(?:([^\\s"'>=/]+)(${Ut}*=${Ut}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),me=/'/g,ve=/"/g,Oe=/^(?:script|style|textarea|title)$/i,Es=e=>(t,...s)=>({_$litType$:e,strings:t,values:s}),M=Es(1),V=Symbol.for("lit-noChange"),g=Symbol.for("lit-nothing"),ye=new WeakMap,F=X.createTreeWalker(X,129);function Le(e,t){if(!te(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return pe!==void 0?pe.createHTML(t):t}const Cs=(e,t)=>{const s=e.length-1,r=[];let i,o=t===2?"<svg>":t===3?"<math>":"",n=at;for(let h=0;h<s;h++){const a=e[h];let c,p,u=-1,f=0;for(;f<a.length&&(n.lastIndex=f,p=n.exec(a),p!==null);)f=n.lastIndex,n===at?p[1]==="!--"?n=fe:p[1]!==void 0?n=ge:p[2]!==void 0?(Oe.test(p[2])&&(i=RegExp("</"+p[2],"g")),n=H):p[3]!==void 0&&(n=H):n===H?p[0]===">"?(n=i??at,u=-1):p[1]===void 0?u=-2:(u=n.lastIndex-p[2].length,c=p[1],n=p[3]===void 0?H:p[3]==='"'?ve:me):n===ve||n===me?n=H:n===fe||n===ge?n=at:(n=H,i=void 0);const E=n===H&&e[h+1].startsWith("/>")?" ":"";o+=n===at?a+bs:u>=0?(r.push(c),a.slice(0,u)+ke+a.slice(u)+L+E):a+L+(u===-2?h:E)}return[Le(e,o+(e[s]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),r]};class pt{constructor({strings:t,_$litType$:s},r){let i;this.parts=[];let o=0,n=0;const h=t.length-1,a=this.parts,[c,p]=Cs(t,s);if(this.el=pt.createElement(c,r),F.currentNode=this.el.content,s===2||s===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=F.nextNode())!==null&&a.length<h;){if(i.nodeType===1){if(i.hasAttributes())for(const u of i.getAttributeNames())if(u.endsWith(ke)){const f=p[n++],E=i.getAttribute(u).split(L),_t=/([.?@])?(.*)/.exec(f);a.push({type:1,index:o,name:_t[2],strings:E,ctor:_t[1]==="."?Ps:_t[1]==="?"?Ss:_t[1]==="@"?ks:Lt}),i.removeAttribute(u)}else u.startsWith(L)&&(a.push({type:6,index:o}),i.removeAttribute(u));if(Oe.test(i.tagName)){const u=i.textContent.split(L),f=u.length-1;if(f>0){i.textContent=At?At.emptyScript:"";for(let E=0;E<f;E++)i.append(u[E],ct()),F.nextNode(),a.push({type:2,index:++o});i.append(u[f],ct())}}}else if(i.nodeType===8)if(i.data===Me)a.push({type:2,index:o});else{let u=-1;for(;(u=i.data.indexOf(L,u+1))!==-1;)a.push({type:7,index:o}),u+=L.length-1}o++}}static createElement(t,s){const r=X.createElement("template");return r.innerHTML=t,r}}function st(e,t,s=e,r){var n,h;if(t===V)return t;let i=r!==void 0?(n=s.o)==null?void 0:n[r]:s.l;const o=ut(t)?void 0:t._$litDirective$;return(i==null?void 0:i.constructor)!==o&&((h=i==null?void 0:i._$AO)==null||h.call(i,!1),o===void 0?i=void 0:(i=new o(e),i._$AT(e,s,r)),r!==void 0?(s.o??(s.o=[]))[r]=i:s.l=i),i!==void 0&&(t=st(e,i._$AS(e,t.values),i,r)),t}class As{constructor(t,s){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=s}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:s},parts:r}=this._$AD,i=((t==null?void 0:t.creationScope)??X).importNode(s,!0);F.currentNode=i;let o=F.nextNode(),n=0,h=0,a=r[0];for(;a!==void 0;){if(n===a.index){let c;a.type===2?c=new yt(o,o.nextSibling,this,t):a.type===1?c=new a.ctor(o,a.name,a.strings,this,t):a.type===6&&(c=new Ms(o,this,t)),this._$AV.push(c),a=r[++h]}n!==(a==null?void 0:a.index)&&(o=F.nextNode(),n++)}return F.currentNode=X,i}p(t){let s=0;for(const r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,s),s+=r.strings.length-2):r._$AI(t[s])),s++}}class yt{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this.v}constructor(t,s,r,i){this.type=2,this._$AH=g,this._$AN=void 0,this._$AA=t,this._$AB=s,this._$AM=r,this.options=i,this.v=(i==null?void 0:i.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const s=this._$AM;return s!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=s.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,s=this){t=st(this,t,s),ut(t)?t===g||t==null||t===""?(this._$AH!==g&&this._$AR(),this._$AH=g):t!==this._$AH&&t!==V&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):xs(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==g&&ut(this._$AH)?this._$AA.nextSibling.data=t:this.T(X.createTextNode(t)),this._$AH=t}$(t){var o;const{values:s,_$litType$:r}=t,i=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=pt.createElement(Le(r.h,r.h[0]),this.options)),r);if(((o=this._$AH)==null?void 0:o._$AD)===i)this._$AH.p(s);else{const n=new As(i,this),h=n.u(this.options);n.p(s),this.T(h),this._$AH=n}}_$AC(t){let s=ye.get(t.strings);return s===void 0&&ye.set(t.strings,s=new pt(t)),s}k(t){te(this._$AH)||(this._$AH=[],this._$AR());const s=this._$AH;let r,i=0;for(const o of t)i===s.length?s.push(r=new yt(this.O(ct()),this.O(ct()),this,this.options)):r=s[i],r._$AI(o),i++;i<s.length&&(this._$AR(r&&r._$AB.nextSibling,i),s.length=i)}_$AR(t=this._$AA.nextSibling,s){var r;for((r=this._$AP)==null?void 0:r.call(this,!1,!0,s);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var s;this._$AM===void 0&&(this.v=t,(s=this._$AP)==null||s.call(this,t))}}class Lt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,s,r,i,o){this.type=1,this._$AH=g,this._$AN=void 0,this.element=t,this.name=s,this._$AM=i,this.options=o,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=g}_$AI(t,s=this,r,i){const o=this.strings;let n=!1;if(o===void 0)t=st(this,t,s,0),n=!ut(t)||t!==this._$AH&&t!==V,n&&(this._$AH=t);else{const h=t;let a,c;for(t=o[0],a=0;a<o.length-1;a++)c=st(this,h[r+a],s,a),c===V&&(c=this._$AH[a]),n||(n=!ut(c)||c!==this._$AH[a]),c===g?t=g:t!==g&&(t+=(c??"")+o[a+1]),this._$AH[a]=c}n&&!i&&this.j(t)}j(t){t===g?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Ps extends Lt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===g?void 0:t}}class Ss extends Lt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==g)}}class ks extends Lt{constructor(t,s,r,i,o){super(t,s,r,i,o),this.type=5}_$AI(t,s=this){if((t=st(this,t,s,0)??g)===V)return;const r=this._$AH,i=t===g&&r!==g||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,o=t!==g&&(r===g||i);i&&this.element.removeEventListener(this.name,this,r),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var s;typeof this._$AH=="function"?this._$AH.call(((s=this.options)==null?void 0:s.host)??this.element,t):this._$AH.handleEvent(t)}}class Ms{constructor(t,s,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=s,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){st(this,t)}}const It=ht.litHtmlPolyfillSupport;It==null||It(pt,yt),(ht.litHtmlVersions??(ht.litHtmlVersions=[])).push("3.2.0");const Os=(e,t,s)=>{const r=(s==null?void 0:s.renderBefore)??t;let i=r._$litPart$;if(i===void 0){const o=(s==null?void 0:s.renderBefore)??null;r._$litPart$=i=new yt(t.insertBefore(ct(),o),o,void 0,s??{})}return i._$AI(e),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class A extends G{constructor(){super(...arguments),this.renderOptions={host:this},this.o=void 0}createRenderRoot(){var s;const t=super.createRenderRoot();return(s=this.renderOptions).renderBefore??(s.renderBefore=t.firstChild),t}update(t){const s=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this.o=Os(s,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this.o)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.o)==null||t.setConnected(!1)}render(){return V}}var Pe;A._$litElement$=!0,A.finalized=!0,(Pe=globalThis.litElementHydrateSupport)==null||Pe.call(globalThis,{LitElement:A});const Ht=globalThis.litElementPolyfillSupport;Ht==null||Ht({LitElement:A});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const I=e=>(t,s)=>{s!==void 0?s.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ls={attribute:!0,type:String,converter:Ct,reflect:!1,hasChanged:Jt},Ts=(e=Ls,t,s)=>{const{kind:r,metadata:i}=s;let o=globalThis.litPropertyMetadata.get(i);if(o===void 0&&globalThis.litPropertyMetadata.set(i,o=new Map),o.set(s.name,e),r==="accessor"){const{name:n}=s;return{set(h){const a=t.get.call(this);t.set.call(this,h),this.requestUpdate(n,a,e)},init(h){return h!==void 0&&this.P(n,void 0,e),h}}}if(r==="setter"){const{name:n}=s;return function(h){const a=this[n];t.call(this,h),this.requestUpdate(n,a,e)}}throw Error("Unsupported decorator location: "+r)};function _(e){return(t,s)=>typeof s=="object"?Ts(e,t,s):((r,i,o)=>{const n=i.hasOwnProperty(o);return i.constructor.createProperty(o,n?{...r,wrapped:!0}:r),n?Object.getOwnPropertyDescriptor(i,o):void 0})(e,t,s)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function b(e){return _({...e,state:!0,attribute:!1})}/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ds=e=>e.strings===void 0;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ee={ATTRIBUTE:1,CHILD:2},se=e=>(...t)=>({_$litDirective$:e,values:t});class ie{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,s,r){this.t=t,this._$AM=s,this.i=r}_$AS(t,s){return this.update(t,s)}update(t,s){return this.render(...s)}}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const dt=(e,t)=>{var r;const s=e._$AN;if(s===void 0)return!1;for(const i of s)(r=i._$AO)==null||r.call(i,t,!1),dt(i,t);return!0},Pt=e=>{let t,s;do{if((t=e._$AM)===void 0)break;s=t._$AN,s.delete(e),e=t}while((s==null?void 0:s.size)===0)},Te=e=>{for(let t;t=e._$AM;e=t){let s=t._$AN;if(s===void 0)t._$AN=s=new Set;else if(s.has(e))break;s.add(e),Rs(t)}};function Ns(e){this._$AN!==void 0?(Pt(this),this._$AM=e,Te(this)):this._$AM=e}function Bs(e,t=!1,s=0){const r=this._$AH,i=this._$AN;if(i!==void 0&&i.size!==0)if(t)if(Array.isArray(r))for(let o=s;o<r.length;o++)dt(r[o],!1),Pt(r[o]);else r!=null&&(dt(r,!1),Pt(r));else dt(this,e)}const Rs=e=>{e.type==ee.CHILD&&(e._$AP??(e._$AP=Bs),e._$AQ??(e._$AQ=Ns))};class Vs extends ie{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,s,r){super._$AT(t,s,r),Te(this),this.isConnected=t._$AU}_$AO(t,s=!0){var r,i;t!==this.isConnected&&(this.isConnected=t,t?(r=this.reconnected)==null||r.call(this):(i=this.disconnected)==null||i.call(this)),s&&(dt(this,t),Pt(this))}setValue(t){if(Ds(this.t))this.t._$AI(t,this);else{const s=[...this.t._$AH];s[this.i]=t,this.t._$AI(s,this,0)}}disconnected(){}reconnected(){}}/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Y=()=>new Us;class Us{}const Wt=new WeakMap,Z=se(class extends Vs{render(e){return g}update(e,[t]){var r;const s=t!==this.Y;return s&&this.Y!==void 0&&this.rt(void 0),(s||this.lt!==this.ct)&&(this.Y=t,this.ht=(r=e.options)==null?void 0:r.host,this.rt(this.ct=e.element)),g}rt(e){if(this.isConnected||(e=void 0),typeof this.Y=="function"){const t=this.ht??globalThis;let s=Wt.get(t);s===void 0&&(s=new WeakMap,Wt.set(t,s)),s.get(this.Y)!==void 0&&this.Y.call(this.ht,void 0),s.set(this.Y,e),e!==void 0&&this.Y.call(this.ht,e)}else this.Y.value=e}get lt(){var e,t;return typeof this.Y=="function"?(e=Wt.get(this.ht??globalThis))==null?void 0:e.get(this.Y):(t=this.Y)==null?void 0:t.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});var Is=Object.defineProperty,Hs=Object.getOwnPropertyDescriptor,De=e=>{throw TypeError(e)},Ne=(e,t,s,r)=>{for(var i=r>1?void 0:r?Hs(t,s):t,o=e.length-1,n;o>=0;o--)(n=e[o])&&(i=(r?n(t,s,i):n(i))||i);return r&&i&&Is(t,s,i),i},Ws=(e,t,s)=>t.has(e)||De("Cannot "+s),zs=(e,t,s)=>t.has(e)?De("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,s),_e=(e,t,s)=>(Ws(e,t,"access private method"),s),xt,Be,Re;let St=class extends A{constructor(){super(...arguments),zs(this,xt),this.dialogOpen=!1,this.dialog=Y(),this.isDialogSupported=!!self.HTMLDialogElement,this.explanations=["BRSTM is a file format that contains audio data that's being used for some Nintendo consoles. One of the differences with the usual audio format (MP3, etc) is that this format can contain a loop point, making it suitable for usage in games.","BRSTM file is not included in the repository."]}render(){return this.isDialogSupported?M`
      <span
        id="help"
        @click=${_e(this,xt,Be)}
        title="Click to open explanation"
        ><slot></slot
      ></span>
      <dialog
        id="brstm-explanation"
        ?open=${this.dialogOpen}
        ${Z(this.dialog)}
      >
        ${this.explanations.map(e=>M`<p>${e}</p>`)}

        <button @click=${_e(this,xt,Re)}>OK</button>
      </dialog>
    `:M`<span id="help" title=${this.explanations.join(`
`)}
        ><slot></slot>
      </span>`}};xt=new WeakSet;Be=function(){var e;(e=this.dialog.value)==null||e.showModal()};Re=function(){var e;(e=this.dialog.value)==null||e.close()};St.styles=U`
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
  `;Ne([b()],St.prototype,"dialogOpen",2);St=Ne([I("nikku-help")],St);/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Ve=Symbol("Comlink.proxy"),Fs=Symbol("Comlink.endpoint"),js=Symbol("Comlink.releaseProxy"),zt=Symbol("Comlink.finalizer"),Et=Symbol("Comlink.thrown"),Ue=e=>typeof e=="object"&&e!==null||typeof e=="function",Ys={canHandle:e=>Ue(e)&&e[Ve],serialize(e){const{port1:t,port2:s}=new MessageChannel;return He(e,t),[s,[s]]},deserialize(e){return e.start(),ze(e)}},Zs={canHandle:e=>Ue(e)&&Et in e,serialize({value:e}){let t;return e instanceof Error?t={isError:!0,value:{message:e.message,name:e.name,stack:e.stack}}:t={isError:!1,value:e},[t,[]]},deserialize(e){throw e.isError?Object.assign(new Error(e.value.message),e.value):e.value}},Ie=new Map([["proxy",Ys],["throw",Zs]]);function Xs(e,t){for(const s of e)if(t===s||s==="*"||s instanceof RegExp&&s.test(t))return!0;return!1}function He(e,t=globalThis,s=["*"]){t.addEventListener("message",function r(i){if(!i||!i.data)return;if(!Xs(s,i.origin)){console.warn(`Invalid origin '${i.origin}' for comlink proxy`);return}const{id:o,type:n,path:h}=Object.assign({path:[]},i.data),a=(i.data.argumentList||[]).map(z);let c;try{const p=h.slice(0,-1).reduce((f,E)=>f[E],e),u=h.reduce((f,E)=>f[E],e);switch(n){case"GET":c=u;break;case"SET":p[h.slice(-1)[0]]=z(i.data.value),c=!0;break;case"APPLY":c=u.apply(p,a);break;case"CONSTRUCT":{const f=new u(...a);c=Js(f)}break;case"ENDPOINT":{const{port1:f,port2:E}=new MessageChannel;He(e,E),c=Ye(f,[f])}break;case"RELEASE":c=void 0;break;default:return}}catch(p){c={value:p,[Et]:0}}Promise.resolve(c).catch(p=>({value:p,[Et]:0})).then(p=>{const[u,f]=Ot(p);t.postMessage(Object.assign(Object.assign({},u),{id:o}),f),n==="RELEASE"&&(t.removeEventListener("message",r),We(t),zt in e&&typeof e[zt]=="function"&&e[zt]())}).catch(p=>{const[u,f]=Ot({value:new TypeError("Unserializable return value"),[Et]:0});t.postMessage(Object.assign(Object.assign({},u),{id:o}),f)})}),t.start&&t.start()}function qs(e){return e.constructor.name==="MessagePort"}function We(e){qs(e)&&e.close()}function ze(e,t){const s=new Map;return e.addEventListener("message",function(i){const{data:o}=i;if(!o||!o.id)return;const n=s.get(o.id);if(n)try{n(o)}finally{s.delete(o.id)}}),jt(e,s,[],t)}function wt(e){if(e)throw new Error("Proxy has been released and is not useable")}function Fe(e){return Q(e,new Map,{type:"RELEASE"}).then(()=>{We(e)})}const kt=new WeakMap,Mt="FinalizationRegistry"in globalThis&&new FinalizationRegistry(e=>{const t=(kt.get(e)||0)-1;kt.set(e,t),t===0&&Fe(e)});function Ks(e,t){const s=(kt.get(t)||0)+1;kt.set(t,s),Mt&&Mt.register(e,t,e)}function Gs(e){Mt&&Mt.unregister(e)}function jt(e,t,s=[],r=function(){}){let i=!1;const o=new Proxy(r,{get(n,h){if(wt(i),h===js)return()=>{Gs(o),Fe(e),t.clear(),i=!0};if(h==="then"){if(s.length===0)return{then:()=>o};const a=Q(e,t,{type:"GET",path:s.map(c=>c.toString())}).then(z);return a.then.bind(a)}return jt(e,t,[...s,h])},set(n,h,a){wt(i);const[c,p]=Ot(a);return Q(e,t,{type:"SET",path:[...s,h].map(u=>u.toString()),value:c},p).then(z)},apply(n,h,a){wt(i);const c=s[s.length-1];if(c===Fs)return Q(e,t,{type:"ENDPOINT"}).then(z);if(c==="bind")return jt(e,t,s.slice(0,-1));const[p,u]=$e(a);return Q(e,t,{type:"APPLY",path:s.map(f=>f.toString()),argumentList:p},u).then(z)},construct(n,h){wt(i);const[a,c]=$e(h);return Q(e,t,{type:"CONSTRUCT",path:s.map(p=>p.toString()),argumentList:a},c).then(z)}});return Ks(o,e),o}function Qs(e){return Array.prototype.concat.apply([],e)}function $e(e){const t=e.map(Ot);return[t.map(s=>s[0]),Qs(t.map(s=>s[1]))]}const je=new WeakMap;function Ye(e,t){return je.set(e,t),e}function Js(e){return Object.assign(e,{[Ve]:!0})}function Ot(e){for(const[t,s]of Ie)if(s.canHandle(e)){const[r,i]=s.serialize(e);return[{type:"HANDLER",name:t,value:r},i]}return[{type:"RAW",value:e},je.get(e)||[]]}function z(e){switch(e.type){case"HANDLER":return Ie.get(e.name).deserialize(e.value);case"RAW":return e.value}}function Q(e,t,s,r){return new Promise(i=>{const o=ti();t.set(o,i),e.start&&e.start(),e.postMessage(Object.assign({id:o},s),r)})}function ti(){return new Array(4).fill(0).map(()=>Math.floor(Math.random()*Number.MAX_SAFE_INTEGER).toString(16)).join("-")}var ei=Symbol("getEndpoint"),si=e=>{const t=ze(e);return new Proxy(t,{get(s,r,i){return r===ei?e:Reflect.get(s,r,i)}})};/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const q=se(class extends ie{constructor(e){var t;if(super(e),e.type!==ee.ATTRIBUTE||e.name!=="class"||((t=e.strings)==null?void 0:t.length)>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return" "+Object.keys(e).filter(t=>e[t]).join(" ")+" "}update(e,[t]){var r,i;if(this.st===void 0){this.st=new Set,e.strings!==void 0&&(this.nt=new Set(e.strings.join(" ").split(/\s/).filter(o=>o!=="")));for(const o in t)t[o]&&!((r=this.nt)!=null&&r.has(o))&&this.st.add(o);return this.render(t)}const s=e.element.classList;for(const o of this.st)o in t||(s.remove(o),this.st.delete(o));for(const o in t){const n=!!t[o];n===this.st.has(o)||(i=this.nt)!=null&&i.has(o)||(n?(s.add(o),this.st.add(o)):(s.remove(o),this.st.delete(o)))}return V}});var tt,T,et;class Ze{constructor({renderCallback:t}){w(this,tt,!1);w(this,T,null);w(this,et);d(this,T,null),d(this,et,t),this.render=this.render.bind(this)}start(){d(this,tt,!0),d(this,T,requestAnimationFrame(this.render))}stop(){l(this,T)&&cancelAnimationFrame(l(this,T)),d(this,tt,!1)}render(){l(this,et)&&l(this,et).call(this),l(this,tt)&&d(this,T,requestAnimationFrame(this.render))}}tt=new WeakMap,T=new WeakMap,et=new WeakMap;const ii="/nikku/assets/audio-source-jhypmOpT.js";var v,P,m,S,j,D,N,k,B,O,K,Yt,Xe;class ri{constructor(t){w(this,K);w(this,v);w(this,P);w(this,m);w(this,S);w(this,j);w(this,D);w(this,N);w(this,k);w(this,B);w(this,O);this.metadata=null,d(this,v,null),d(this,P,[]),d(this,m,null),d(this,S,null),d(this,j,0),d(this,D,!1),d(this,N,!0),d(this,k,!1),d(this,B,0),d(this,O,null),this.options=t,this.init()}async init(t){if(t?(this.metadata=t,d(this,v,new AudioContext({sampleRate:t.sampleRate})),l(this,v).audioWorklet&&await l(this,v).audioWorklet.addModule(ii),d(this,O,new Ze({renderCallback:$t(this,K,Xe).bind(this)}))):(this.metadata=null,d(this,v,null),d(this,O,null)),d(this,P,[!0]),this.metadata&&this.metadata.numberTracks>1){d(this,P,[]);for(let s=0;s<this.metadata.numberTracks;s++)s===0?l(this,P).push(!0):l(this,P).push(!1)}d(this,m,null),d(this,S,null),d(this,j,0),d(this,D,!0),d(this,N,!1),d(this,k,!1),d(this,B,1)}async destroy(){await this.pause(),this.init()}async start(){if(!this.metadata||!l(this,v))return;const{totalSamples:t,sampleRate:s}=this.metadata,r=t/s,i=Math.min(r,3),o=i*s;console.time("getSamples");const n=await this.options.decodeSamples(0,o);console.timeEnd("getSamples"),$t(this,K,Yt).call(this,n,0);const h=[];for(let a=i;a<r;a+=10)a+10<r?h.push({offset:a,size:10}):h.push({offset:a,size:r-a});(async()=>{for(const a of h){console.time("getSamples");const c=await this.options.decodeSamples(a.offset*s,a.size*s);console.timeEnd("getSamples"),$t(this,K,Yt).call(this,c,a.offset*s)}})()}initPlayback(t){if(!this.metadata||!l(this,v)||l(this,B)==null)return;const{loopStartSample:s,totalSamples:r,sampleRate:i,trackDescriptions:o}=this.metadata;d(this,m,new AudioWorkletNode(l(this,v),"audio-source-processor",{numberOfInputs:0,numberOfOutputs:1,outputChannelCount:[2],processorOptions:{initialSamples:t,loopStartSample:s,totalSamples:r,sampleRate:i,shouldLoop:l(this,D),trackDescriptions:o,trackStates:l(this,P)}})),l(this,m).port&&(l(this,m).port.addEventListener("message",n=>{switch(n.data.type){case"BUFFER_LOOPED":{console.log("[AudioPlayer]",n.data.type);break}case"BUFFER_ENDED":{console.log("[AudioPlayer]",n.data.type),this.pause(),d(this,N,!0);break}case"TIMESTAMP_REPLY":{d(this,j,n.data.payload.timestamp);break}}}),l(this,m).port.start()),d(this,S,l(this,v).createGain()),l(this,S).gain.value=l(this,B),l(this,m).connect(l(this,S)),l(this,S).connect(l(this,v).destination),d(this,N,!1)}async seek(t){l(this,v)&&(l(this,m)&&l(this,m).port.postMessage({type:"SEEK",payload:{playbackTimeInS:t}}),l(this,k)||await this.play())}async play(){var t;l(this,k)||!l(this,v)||(d(this,k,!0),(t=l(this,O))==null||t.start(),this.options.onPlay(),await l(this,v).resume(),l(this,N)&&this.seek(0))}async pause(){var t;!l(this,k)||!l(this,v)||(d(this,k,!1),(t=l(this,O))==null||t.stop(),this.options.onPause(),await l(this,v).suspend())}async setTrackStates(t){d(this,P,t),l(this,m)&&l(this,m).port.postMessage({type:"UPDATE_TRACK_STATES",payload:{trackStates:l(this,P)}})}async setVolume(t){d(this,B,t),l(this,S)&&(l(this,S).gain.value=t)}setLoop(t){d(this,D,t),l(this,m)&&l(this,m).port.postMessage({type:"UPDATE_SHOULD_LOOP",payload:{shouldLoop:l(this,D)}})}getCurrrentPlaybackTime(){return l(this,m)?l(this,j):0}}v=new WeakMap,P=new WeakMap,m=new WeakMap,S=new WeakMap,j=new WeakMap,D=new WeakMap,N=new WeakMap,k=new WeakMap,B=new WeakMap,O=new WeakMap,K=new WeakSet,Yt=function(t,s=0){var r;!this.metadata||!l(this,v)||(s===0?(this.initPlayback(t),(r=l(this,O))==null||r.start(),d(this,k,!0),this.options.onPlay()):l(this,m)&&l(this,m).port.postMessage({type:"ADD_SAMPLES",payload:{samples:t,offset:s}},t.map(i=>i.buffer)))},Xe=function(){l(this,m)&&l(this,m).port.postMessage({type:"TIMESTAMP_QUERY"})};var oi=Object.defineProperty,ni=Object.getOwnPropertyDescriptor,qe=e=>{throw TypeError(e)},x=(e,t,s,r)=>{for(var i=r>1?void 0:r?ni(t,s):t,o=e.length-1,n;o>=0;o--)(n=e[o])&&(i=(r?n(t,s,i):n(i))||i);return r&&i&&oi(t,s,i),i},ai=(e,t,s)=>t.has(e)||qe("Cannot "+s),li=(e,t,s)=>t.has(e)?qe("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,s),C=(e,t,s)=>(ai(e,t,"access private method"),s),$,ft,Ke,Ge,re,Qe,Je,ts,es,ss,is;let y=class extends A{constructor(){super(...arguments),li(this,$),this.playPauseIcon="play",this.loop="on",this.volume=1,this.muted=!1,this.progressMax=0,this.progressValue=0,this.timeDisplayMax=0,this.timeDisplayValue=0,this.tracksCount=1,this.tracksActive=[!0],this.disabled=!0,this.fileDraggingOver=!1,this.trackTitle="",this.errorMessage="",this.audioPlayer=null,this.workerInstance=si(new Worker(new URL("/nikku/assets/worker-CCV0hI0x.js",import.meta.url),{})),this.timer=new Ze({renderCallback:()=>{if(!this.audioPlayer)return;const e=this.audioPlayer.getCurrrentPlaybackTime();this.progressValue=e,this.timeDisplayValue=e}})}render(){return M`
      <div
        id="error"
        class=${q({hidden:!this.errorMessage})}
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
            @tracksActiveChange=${C(this,$,Qe)}
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
            @progressValueChange=${C(this,$,ts)}
          ></controls-progress>
        </div>
        <label id="controls-select-file-container">
          <input
            type="file"
            id="controls-select-file"
            accept=".brstm"
            @change=${C(this,$,Ge)}
          />
          <span id="controls-select-file-custom"></span>
        </label>

        <div id="controls-play-pause">
          <controls-play-pause
            ?disabled=${this.disabled}
            mode=${this.playPauseIcon}
            @playPauseClick=${C(this,$,Je)}
          ></controls-play-pause>
        </div>
        <div id="controls-others">
          <controls-loop
            ?disabled=${this.disabled}
            mode=${this.loop}
            @loopClick=${C(this,$,es)}
          ></controls-loop>
          <controls-volume
            ?disabled=${this.disabled}
            ?muted=${this.muted}
            volume=${this.volume}
            @mutedChange=${C(this,$,ss)}
            @volumeChange=${C(this,$,is)}
          ></controls-volume>
        </div>
      </main>
      <div
        id="drag-and-drop-overlay"
        class=${q({hidden:!this.fileDraggingOver})}
      >
        Drop BRSTM file to start playback
      </div>
    `}firstUpdated(){window.addEventListener("dragover",e=>{e.preventDefault(),this.fileDraggingOver=!0}),window.addEventListener("dragend",e=>{this.fileDraggingOver=!1}),window.addEventListener("dragleave",e=>{this.fileDraggingOver=!1}),window.addEventListener("drop",e=>{if(e.preventDefault(),this.fileDraggingOver=!1,!e.dataTransfer||!e.dataTransfer.items||!e.dataTransfer.items[0]||e.dataTransfer.items[0].kind!=="file"){C(this,$,ft).call(this,new Error("No file read"));return}const t=e.dataTransfer.items[0].getAsFile();if(!t){C(this,$,ft).call(this,new Error("No file read"));return}rs(t).then(C(this,$,re).bind(this))})}};$=new WeakSet;ft=function(e){this.errorMessage=e.message+e.stack};Ke=function(){this.errorMessage=""};Ge=function(e){const t=e.target.files;if(!t||!t.length){C(this,$,ft).call(this,new Error("No file read"));return}const s=t[0];rs(s).then(C(this,$,re).bind(this))};re=async function({buffer:e,file:t}){var s;if(C(this,$,Ke).call(this),!(!e||!(e instanceof ArrayBuffer))){t.name&&(this.trackTitle=t.name);try{await this.workerInstance.init(Ye(e,[e]));const r=await this.workerInstance.getMetadata();if(this.audioPlayer?await this.audioPlayer.destroy():this.audioPlayer=new ri({onPlay:()=>{this.playPauseIcon="pause",this.timer.start()},onPause:()=>{this.playPauseIcon="play",this.timer.stop()},decodeSamples:async(n,h)=>await this.workerInstance.getSamples(n,h)||[]}),!r)throw new Error("metadata is undefined");await this.audioPlayer.init(r),await this.audioPlayer.start();const i=r.totalSamples/r.sampleRate,o=r.numberTracks;this.muted?this.audioPlayer.setVolume(0):this.audioPlayer.setVolume(this.volume),this.playPauseIcon="pause",this.progressMax=i,this.timeDisplayMax=i,this.tracksCount=o,this.tracksActive=new Array(o).fill(!0).map((n,h)=>h===0),this.disabled=!1,(s=this.audioPlayer)==null||s.play()}catch(r){C(this,$,ft).call(this,r)}}};Qe=function(e){var s;const t=e.detail.active;this.tracksActive=t,(s=this.audioPlayer)==null||s.setTrackStates(t)};Je=function(e){var s,r;const t=e.detail.mode;this.playPauseIcon=t,t==="play"?(s=this.audioPlayer)==null||s.pause():t==="pause"&&((r=this.audioPlayer)==null||r.play())};ts=function(e){var s;const t=e.detail.value;this.progressValue=t,this.timeDisplayValue=t,(s=this.audioPlayer)==null||s.seek(t)};es=function(e){var s,r;const t=e.detail.mode;this.loop=t,t==="on"?(s=this.audioPlayer)==null||s.setLoop(!0):t==="off"&&((r=this.audioPlayer)==null||r.setLoop(!1))};ss=function(e){var s,r;const t=e.detail.muted;this.muted=t,t?(s=this.audioPlayer)==null||s.setVolume(0):(r=this.audioPlayer)==null||r.setVolume(this.volume)};is=function(e){var s;const t=e.detail.volume;this.volume=t,this.muted=!1,(s=this.audioPlayer)==null||s.setVolume(t)};y.styles=U`
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
  `;x([b()],y.prototype,"playPauseIcon",2);x([b()],y.prototype,"loop",2);x([b()],y.prototype,"volume",2);x([b()],y.prototype,"muted",2);x([b()],y.prototype,"progressMax",2);x([b()],y.prototype,"progressValue",2);x([b()],y.prototype,"timeDisplayMax",2);x([b()],y.prototype,"timeDisplayValue",2);x([b()],y.prototype,"tracksCount",2);x([b()],y.prototype,"tracksActive",2);x([b()],y.prototype,"disabled",2);x([b()],y.prototype,"fileDraggingOver",2);x([b()],y.prototype,"trackTitle",2);x([b()],y.prototype,"errorMessage",2);y=x([I("nikku-main")],y);function rs(e){return new Promise(t=>{const s=new FileReader;s.addEventListener("loadend",r=>{const i=s.result;t({buffer:i,file:e})}),s.readAsArrayBuffer(e)})}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class Zt extends ie{constructor(t){if(super(t),this.it=g,t.type!==ee.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(t){if(t===g||t==null)return this._t=void 0,this.it=t;if(t===V)return t;if(typeof t!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(t===this.it)return this._t;this.it=t;const s=[t];return s.raw=s,this._t={_$litType$:this.constructor.resultType,strings:s,values:[]}}}Zt.directiveName="unsafeHTML",Zt.resultType=1;const gt=se(Zt),hi=`<svg width="100" height="100" viewBox="0 0 100 100" fill="#198813" xmlns="http://www.w3.org/2000/svg">\r
<path d="M77.9375 48.2609C79.2874 49.0274 79.2874 50.9726 77.9375 51.7391L38.2376 74.2841C36.9043 75.0413 35.25 74.0783 35.25 72.545L35.25 27.455C35.25 25.9217 36.9044 24.9587 38.2376 25.7159L77.9375 48.2609Z" />\r
</svg>\r
`,di=`<svg width="100" height="100" viewBox="0 0 100 100" fill="#198813" xmlns="http://www.w3.org/2000/svg">\r
<rect x="27" y="28" width="16" height="45" rx="2" />\r
<rect x="58" y="28" width="15" height="45" rx="2" />\r
</svg>\r
`;var ci=Object.defineProperty,ui=Object.getOwnPropertyDescriptor,os=e=>{throw TypeError(e)},oe=(e,t,s,r)=>{for(var i=r>1?void 0:r?ui(t,s):t,o=e.length-1,n;o>=0;o--)(n=e[o])&&(i=(r?n(t,s,i):n(i))||i);return r&&i&&ci(t,s,i),i},pi=(e,t,s)=>t.has(e)||os("Cannot "+s),fi=(e,t,s)=>t.has(e)?os("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,s),gi=(e,t,s)=>(pi(e,t,"access private method"),s),Xt,ns;let mt=class extends A{constructor(){super(...arguments),fi(this,Xt),this.disabled=!1,this.mode="play"}render(){return M`<button
      class=${q({button:!0,disabled:this.disabled})}
      ?disabled=${this.disabled}
      @click=${gi(this,Xt,ns)}
    >
      ${this.mode==="play"?gt(hi):gt(di)}
    </button>`}};Xt=new WeakSet;ns=function(){if(this.disabled)return;const e=this.mode==="play"?"pause":"play";this.dispatchEvent(new CustomEvent("playPauseClick",{detail:{mode:e}})),this.mode=e};mt.styles=U`
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
  `;oe([_({type:Boolean})],mt.prototype,"disabled",2);oe([_({type:String})],mt.prototype,"mode",2);mt=oe([I("controls-play-pause")],mt);var mi=Object.defineProperty,vi=Object.getOwnPropertyDescriptor,Tt=(e,t,s,r)=>{for(var i=r>1?void 0:r?vi(t,s):t,o=e.length-1,n;o>=0;o--)(n=e[o])&&(i=(r?n(t,s,i):n(i))||i);return r&&i&&mi(t,s,i),i};let it=class extends A{constructor(){super(...arguments),this.active=[],this.count=0,this.disabled=!1}render(){return M`
      <div
        id="container"
        class=${q({hidden:this.count===1||this.disabled})}
      >
        Active tracks:
        <ol id="list">
          ${Array(this.count).fill(0).map((e,t)=>M`<li>
                <label>
                  <input
                    type="checkbox"
                    ?checked="${this.active[t]}"
                    @input=${s=>{const r=s.target.checked,i=[...this.active];i[t]=r,this.active=i,this.dispatchEvent(new CustomEvent("tracksActiveChange",{detail:{active:i}}))}}
                  />
                  Track ${t+1}
                </label>
              </li>`)}
        </ol>
      </div>
    `}};it.styles=U`
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
  `;Tt([_({type:Array})],it.prototype,"active",2);Tt([_({type:Number})],it.prototype,"count",2);Tt([_({type:Boolean})],it.prototype,"disabled",2);it=Tt([I("controls-tracks")],it);var yi=Object.defineProperty,_i=Object.getOwnPropertyDescriptor,Dt=(e,t,s,r)=>{for(var i=r>1?void 0:r?_i(t,s):t,o=e.length-1,n;o>=0;o--)(n=e[o])&&(i=(r?n(t,s,i):n(i))||i);return r&&i&&yi(t,s,i),i};let rt=class extends A{constructor(){super(...arguments),this.disabled=!1,this.value=0,this.max=0}render(){return M` <div class="progress-time-display">
      <div class="time" id="current">${we(this.value)}</div>
      <div class="separator">/</div>
      <div class="time" id="total">${we(this.max)}</div>
    </div>`}};rt.styles=U`
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
  `;Dt([_({type:Boolean})],rt.prototype,"disabled",2);Dt([_({type:Number})],rt.prototype,"value",2);Dt([_({type:Number})],rt.prototype,"max",2);rt=Dt([I("controls-time-display")],rt);function we(e){const t=be(Math.floor(e/60)),s=be(Math.floor(e%60));return`${t}:${s}`}function be(e){return e<10?`0${e}`:e}var $i=Object.defineProperty,wi=Object.getOwnPropertyDescriptor,as=e=>{throw TypeError(e)},Nt=(e,t,s,r)=>{for(var i=r>1?void 0:r?wi(t,s):t,o=e.length-1,n;o>=0;o--)(n=e[o])&&(i=(r?n(t,s,i):n(i))||i);return r&&i&&$i(t,s,i),i},ls=(e,t,s)=>t.has(e)||as("Cannot "+s),xe=(e,t,s)=>(ls(e,t,"read from private field"),s?s.call(e):t.get(e)),bi=(e,t,s)=>t.has(e)?as("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,s),Ee=(e,t,s,r)=>(ls(e,t,"write to private field"),t.set(e,s),s),J;let ot=class extends A{constructor(){super(...arguments),this.disabled=!1,this.value=0,this.max=0,bi(this,J,!1),this._cachedProgressBarOffsetLeft=null,this._cachedProgressBarClientWidth=null,this.progressBar=Y(),this.progressActive=Y(),this.progressIndicator=Y(),this.updateProgressFromEvent=e=>{this.refreshCachedValues();let t=0;e instanceof MouseEvent?t=e.clientX:e instanceof TouchEvent&&(t=e.touches[0].clientX);const s=Math.min(1,Math.max(0,(t-(this._cachedProgressBarOffsetLeft??0))/(this._cachedProgressBarClientWidth??1)))*this.max;this.dispatchEvent(new CustomEvent("progressValueChange",{detail:{value:s}})),this.value=s},this.handleDraggingStart=e=>{this.disabled||xe(this,J)||(Ee(this,J,!0),this.updateProgressFromEvent(e))},this.handleDraggingMove=e=>{this.disabled||!xe(this,J)||this.updateProgressFromEvent(e)},this.handleDraggingEnd=e=>{this.disabled||Ee(this,J,!1)},this.handleWindowResize=()=>{this._cachedProgressBarOffsetLeft=null,this._cachedProgressBarClientWidth=null,this.refreshCachedValues()}}get percentage(){return this.max<=0?0:this.value/this.max}render(){return M`
      <div class="progress-bar-container">
        <div
          class=${q({"progress-bar":!0,disabled:this.disabled})}
          ${Z(this.progressBar)}
        >
          <div class="progress-background"></div>
          <div class="progress-active" ${Z(this.progressActive)}></div>
          <div class="progress-indicator" ${Z(this.progressIndicator)}></div>
        </div>
      </div>
    `}updated(e){e.has("value")&&this.updateStyles()}updateStyles(){this.progressIndicator.value&&(this.progressIndicator.value.style.transform=`translateX(calc(${this.percentage*(this._cachedProgressBarClientWidth??0)}px - 50%))`),this.progressActive.value&&(this.progressActive.value.style.transform=`scaleX(${this.percentage})`)}refreshCachedValues(){var e,t;this._cachedProgressBarOffsetLeft||(this._cachedProgressBarOffsetLeft=((e=this.progressBar.value)==null?void 0:e.offsetLeft)??0),(!this._cachedProgressBarClientWidth||this._cachedProgressBarClientWidth===1)&&(this._cachedProgressBarClientWidth=((t=this.progressBar.value)==null?void 0:t.clientWidth)??1),this.updateStyles()}firstUpdated(){var e,t;(e=this.progressBar.value)==null||e.addEventListener("mousedown",this.handleDraggingStart,{passive:!0}),document==null||document.addEventListener("mousemove",this.handleDraggingMove,{passive:!0}),document==null||document.addEventListener("mouseup",this.handleDraggingEnd,{passive:!0}),(t=this.progressBar.value)==null||t.addEventListener("touchstart",this.handleDraggingStart,{passive:!0}),document==null||document.addEventListener("touchmove",this.handleDraggingMove,{passive:!0}),document==null||document.addEventListener("touchend",this.handleDraggingEnd,{passive:!0}),window.addEventListener("resize",this.handleWindowResize),this.refreshCachedValues()}disconnectedCallback(){var e,t;(e=this.progressBar.value)==null||e.removeEventListener("mousedown",this.handleDraggingStart),document==null||document.removeEventListener("mousemove",this.handleDraggingMove),document==null||document.removeEventListener("mouseup",this.handleDraggingEnd),(t=this.progressBar.value)==null||t.removeEventListener("touchstart",this.handleDraggingStart),document==null||document.removeEventListener("touchmove",this.handleDraggingMove),document==null||document.removeEventListener("touchend",this.handleDraggingEnd),window.removeEventListener("resize",this.handleWindowResize)}};J=new WeakMap;ot.styles=U`
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
  `;Nt([_({type:Boolean})],ot.prototype,"disabled",2);Nt([_({type:Number})],ot.prototype,"value",2);Nt([_({type:Number})],ot.prototype,"max",2);ot=Nt([I("controls-progress")],ot);const xi=`<svg width="100" height="100" viewBox="0 0 100 100" fill="#198813" xmlns="http://www.w3.org/2000/svg">\r
<path fill-rule="evenodd" clip-rule="evenodd" d="M37.5858 38C37.851 38 38.1054 37.8946 38.2929 37.7071L48.2929 27.7071C48.9229 27.0771 50 27.5233 50 28.4142V71.5858C50 72.4767 48.9229 72.9228 48.2929 72.2929L38.2929 62.2929C38.1054 62.1054 37.851 62 37.5858 62H21C20.4477 62 20 61.5523 20 61V39C20 38.4477 20.4477 38 21 38H37.5858Z"/>\r
<path fill-rule="evenodd" clip-rule="evenodd" d="M71.9382 50.0662C71.7795 42.8723 68.0938 35.4875 61.0359 30.0266C60.5991 29.6887 60.4988 29.0641 60.8236 28.6175L63.1763 25.3825C63.5012 24.9359 64.1276 24.8362 64.5659 25.1722C72.9864 31.628 77.7327 40.6844 77.9368 49.9338C78.1425 59.2585 73.72 68.4296 64.4895 74.9305C64.038 75.2486 63.4157 75.1236 63.1094 74.6641L60.8906 71.3359C60.5842 70.8764 60.71 70.2565 61.16 69.9364C68.7821 64.5159 72.0959 57.2151 71.9382 50.0662Z"/>\r
<path fill-rule="evenodd" clip-rule="evenodd" d="M89.375 50C89.375 35.887 83.3874 22.0191 71.7151 14.0769C71.2585 13.7662 71.1219 13.1482 71.4201 12.6834L73.5799 9.31661C73.8781 8.85175 74.4987 8.71651 74.9565 9.0254C88.6709 18.2782 95.375 34.2625 95.375 50C95.375 65.7375 88.6709 81.7218 74.9565 90.9746C74.4987 91.2835 73.8781 91.1482 73.5799 90.6834L71.4201 87.3166C71.1219 86.8518 71.2585 86.2338 71.7151 85.9231C83.3874 77.9809 89.375 64.113 89.375 50Z"/>\r
</svg>\r
`,Ei=`<svg width="100" height="100" viewBox="0 0 100 100" fill="#198813" xmlns="http://www.w3.org/2000/svg">\r
<rect x="81.5937" y="36.1014" width="5.02197" height="34.2892" rx="1" transform="rotate(45 81.5937 36.1014)"/>\r
<rect x="85.1447" y="60.3475" width="5.02197" height="34.2892" rx="1" transform="rotate(135 85.1447 60.3475)"/>\r
<path fill-rule="evenodd" clip-rule="evenodd" d="M37.5858 38C37.851 38 38.1054 37.8946 38.2929 37.7071L48.2929 27.7071C48.9229 27.0771 50 27.5233 50 28.4142V71.5858C50 72.4767 48.9229 72.9228 48.2929 72.2929L38.2929 62.2929C38.1054 62.1053 37.851 62 37.5858 62H21C20.4477 62 20 61.5523 20 61V39C20 38.4477 20.4477 38 21 38L37.5858 38Z"/>\r
</svg>\r
`;var Ci=Object.defineProperty,Ai=Object.getOwnPropertyDescriptor,hs=e=>{throw TypeError(e)},Bt=(e,t,s,r)=>{for(var i=r>1?void 0:r?Ai(t,s):t,o=e.length-1,n;o>=0;o--)(n=e[o])&&(i=(r?n(t,s,i):n(i))||i);return r&&i&&Ci(t,s,i),i},ne=(e,t,s)=>t.has(e)||hs("Cannot "+s),Ce=(e,t,s)=>(ne(e,t,"read from private field"),s?s.call(e):t.get(e)),Ae=(e,t,s)=>t.has(e)?hs("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,s),Ft=(e,t,s,r)=>(ne(e,t,"write to private field"),t.set(e,s),s),Pi=(e,t,s)=>(ne(e,t,"access private method"),s),W,qt,ds;let nt=class extends A{constructor(){super(...arguments),Ae(this,qt),this.disabled=!1,this.muted=!1,this.volume=1,Ae(this,W,!1),this._cachedVolumeBarOffsetLeft=null,this._cachedVolumeBarClientWidth=null,this.volumeBarContainer=Y(),this.volumeFill=Y(),this.volumeIndicator=Y(),this.updateVolumeFromEvent=e=>{this.refreshCachedValues();let t=0;e instanceof MouseEvent?t=e.clientX:e instanceof TouchEvent&&(t=e.touches[0].clientX);const s=Math.min(1,Math.max(0,(t-(this._cachedVolumeBarOffsetLeft??0))/(this._cachedVolumeBarClientWidth??1)));this.volume=s,this.dispatchEvent(new CustomEvent("volumeChange",{detail:{volume:s}}))},this.handleDraggingStart=e=>{this.disabled||Ce(this,W)||(Ft(this,W,!0),this.updateVolumeFromEvent(e))},this.handleDraggingMove=e=>{this.disabled||!Ce(this,W)||this.updateVolumeFromEvent(e)},this.handleDraggingEnd=e=>{this.disabled||Ft(this,W,!1)},this.handleWindowResize=()=>{this._cachedVolumeBarOffsetLeft=null,this._cachedVolumeBarClientWidth=null,this.refreshCachedValues()}}render(){return M`<div class="volume-container">
      <div class="volume-icon-container" @click=${Pi(this,qt,ds)}>
        ${this.muted?gt(Ei):gt(xi)}
      </div>
      <div
        class=${q({"volume-bar-container":!0,disabled:this.disabled})}
        ${Z(this.volumeBarContainer)}
      >
        <div class="volume-bar">
          <div class="volume-background"></div>
          <div class="volume-fill" ${Z(this.volumeFill)}></div>
          <div class="volume-indicator" ${Z(this.volumeIndicator)}></div>
        </div>
      </div>
    </div>`}updateStyles(){this.volumeIndicator.value&&(this.volumeIndicator.value.style.transform=this.muted?"":`translateX(calc(${this.volume*(this._cachedVolumeBarClientWidth??0)}px - 50%))`),this.volumeFill.value&&(this.volumeFill.value.style.transform=this.muted?"scaleX(0)":`scaleX(${this.volume})`)}refreshCachedValues(){var e,t;this._cachedVolumeBarOffsetLeft||(this._cachedVolumeBarOffsetLeft=((e=this.volumeBarContainer.value)==null?void 0:e.offsetLeft)??0),(!this._cachedVolumeBarClientWidth||this._cachedVolumeBarClientWidth===1)&&(this._cachedVolumeBarClientWidth=((t=this.volumeBarContainer.value)==null?void 0:t.clientWidth)??1),this.updateStyles()}updated(e){(e.has("muted")||e.has("volume"))&&this.updateStyles()}firstUpdated(){var e,t;Ft(this,W,!1),(e=this.volumeBarContainer.value)==null||e.addEventListener("mousedown",this.handleDraggingStart,{passive:!0}),document==null||document.addEventListener("mousemove",this.handleDraggingMove,{passive:!0}),document==null||document.addEventListener("mouseup",this.handleDraggingEnd,{passive:!0}),(t=this.volumeBarContainer.value)==null||t.addEventListener("touchstart",this.handleDraggingStart,{passive:!0}),document==null||document.addEventListener("touchmove",this.handleDraggingMove,{passive:!0}),document==null||document.addEventListener("touchend",this.handleDraggingEnd,{passive:!0}),window.addEventListener("resize",this.handleWindowResize),this.refreshCachedValues()}disconnectedCallback(){var e,t;(e=this.volumeBarContainer.value)==null||e.removeEventListener("mousedown",this.handleDraggingStart),document==null||document.removeEventListener("mousemove",this.handleDraggingMove),document==null||document.removeEventListener("mouseup",this.handleDraggingEnd),(t=this.volumeBarContainer.value)==null||t.removeEventListener("touchstart",this.handleDraggingStart),document==null||document.removeEventListener("touchmove",this.handleDraggingMove),document==null||document.removeEventListener("touchend",this.handleDraggingEnd),window.removeEventListener("resize",this.handleWindowResize)}};W=new WeakMap;qt=new WeakSet;ds=function(){const e=!this.muted;this.muted=e,this.dispatchEvent(new CustomEvent("mutedChange",{detail:{muted:e}}))};nt.styles=U`
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
  `;Bt([_({type:Boolean})],nt.prototype,"disabled",2);Bt([_({type:Boolean})],nt.prototype,"muted",2);Bt([_({type:Number})],nt.prototype,"volume",2);nt=Bt([I("controls-volume")],nt);const Si=`<svg width="100" height="100" viewBox="0 0 100 100" fill="#198813" xmlns="http://www.w3.org/2000/svg">\r
<path d="M20 38C20 29.5 26.5 20 38 20L62 20C72 20 80 28 80 38L80 39L70 39C70 39 70 42.5 70 38C70 33.5 66.5 30 62 30C57.5 30 42.5 30 38 30C33.5 30 30 33.5 30 38C30 42.5 30 41 30 41L20 41L20 38Z"/>\r
<path d="M74.5 54L60.2106 39L88.7894 39L74.5 54Z"/>\r
<path d="M79 61C79 69.5 72.5 79 61 79L37 79C27 79 19 71 19 61L19 60L29 60C29 60 29 56.5 29 61C29 65.5 32.5 69 37 69C41.5 69 56.5 69 61 69C65.5 69 69 65.5 69 61C69 56.5 69 58 69 58L79 58L79 61Z"/>\r
<path d="M24.5 45L38.7894 60H10.2106L24.5 45Z"/>\r
</svg>\r
`;var ki=Object.defineProperty,Mi=Object.getOwnPropertyDescriptor,cs=e=>{throw TypeError(e)},ae=(e,t,s,r)=>{for(var i=r>1?void 0:r?Mi(t,s):t,o=e.length-1,n;o>=0;o--)(n=e[o])&&(i=(r?n(t,s,i):n(i))||i);return r&&i&&ki(t,s,i),i},Oi=(e,t,s)=>t.has(e)||cs("Cannot "+s),Li=(e,t,s)=>t.has(e)?cs("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,s),Ti=(e,t,s)=>(Oi(e,t,"access private method"),s),Kt,us;let vt=class extends A{constructor(){super(...arguments),Li(this,Kt),this.disabled=!1,this.mode="on"}render(){return M`<button
      class=${q({on:this.mode==="on",off:this.mode==="off",disabled:this.disabled,button:!0})}
      @click="${Ti(this,Kt,us)}"
    >
      ${gt(Si)}
    </button>`}};Kt=new WeakSet;us=function(){if(this.disabled)return;const e=this.mode==="on"?"off":"on";this.dispatchEvent(new CustomEvent("loopClick",{detail:{mode:e}})),this.mode=e};vt.styles=U`
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
  `;ae([_({type:Boolean})],vt.prototype,"disabled",2);ae([_({type:String})],vt.prototype,"mode",2);vt=ae([I("controls-loop")],vt);
