function t(t,e,i,o){var n,s=arguments.length,r=s<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(n=t[a])&&(r=(s<3?n(r):s>3?n(e,i,r):n(e,i))||r);return s>3&&r&&Object.defineProperty(e,i,r),r}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,o=Symbol(),n=new WeakMap;let s=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==o)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=n.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&n.set(e,t))}return t}toString(){return this.cssText}};const r=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,o)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[o+1],t[0]);return new s(i,t,o)},a=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new s("string"==typeof t?t:t+"",void 0,o))(e)})(t):t,{is:c,defineProperty:l,getOwnPropertyDescriptor:h,getOwnPropertyNames:d,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,_=globalThis,m=_.trustedTypes,f=m?m.emptyScript:"",g=_.reactiveElementPolyfillSupport,v=(t,e)=>t,b={toAttribute(t,e){switch(e){case Boolean:t=t?f:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},y=(t,e)=>!c(t,e),$={attribute:!0,type:String,converter:b,reflect:!1,useDefault:!1,hasChanged:y};Symbol.metadata??=Symbol("metadata"),_.litPropertyMetadata??=new WeakMap;let w=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=$){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),o=this.getPropertyDescriptor(t,i,e);void 0!==o&&l(this.prototype,t,o)}}static getPropertyDescriptor(t,e,i){const{get:o,set:n}=h(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:o,set(e){const s=o?.call(this);n?.call(this,e),this.requestUpdate(t,s,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??$}static _$Ei(){if(this.hasOwnProperty(v("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(v("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(v("properties"))){const t=this.properties,e=[...d(t),...p(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,o)=>{if(i)t.adoptedStyleSheets=o.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of o){const o=document.createElement("style"),n=e.litNonce;void 0!==n&&o.setAttribute("nonce",n),o.textContent=i.cssText,t.appendChild(o)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,i);if(void 0!==o&&!0===i.reflect){const n=(void 0!==i.converter?.toAttribute?i.converter:b).toAttribute(e,i.type);this._$Em=t,null==n?this.removeAttribute(o):this.setAttribute(o,n),this._$Em=null}}_$AK(t,e){const i=this.constructor,o=i._$Eh.get(t);if(void 0!==o&&this._$Em!==o){const t=i.getPropertyOptions(o),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:b;this._$Em=o;const s=n.fromAttribute(e,t.type);this[o]=s??this._$Ej?.get(o)??s,this._$Em=null}}requestUpdate(t,e,i,o=!1,n){if(void 0!==t){const s=this.constructor;if(!1===o&&(n=this[t]),i??=s.getPropertyOptions(t),!((i.hasChanged??y)(n,e)||i.useDefault&&i.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(s._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:o,wrapped:n},s){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,s??e??this[t]),!0!==n||void 0!==s)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===o&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,o=this[e];!0!==t||this._$AL.has(e)||void 0===o||this.C(e,void 0,i,o)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[v("elementProperties")]=new Map,w[v("finalized")]=new Map,g?.({ReactiveElement:w}),(_.reactiveElementVersions??=[]).push("2.1.2");const x=globalThis,A=t=>t,E=x.trustedTypes,S=E?E.createPolicy("lit-html",{createHTML:t=>t}):void 0,C="$lit$",P=`lit$${Math.random().toFixed(9).slice(2)}$`,T="?"+P,k=`<${T}>`,M=document,O=()=>M.createComment(""),z=t=>null===t||"object"!=typeof t&&"function"!=typeof t,U=Array.isArray,N="[ \t\n\f\r]",R=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,D=/-->/g,H=/>/g,I=RegExp(`>|${N}(?:([^\\s"'>=/]+)(${N}*=${N}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),q=/'/g,L=/"/g,j=/^(?:script|style|textarea|title)$/i,V=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),B=Symbol.for("lit-noChange"),F=Symbol.for("lit-nothing"),W=new WeakMap,K=M.createTreeWalker(M,129);function J(t,e){if(!U(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(e):e}const Z=(t,e)=>{const i=t.length-1,o=[];let n,s=2===e?"<svg>":3===e?"<math>":"",r=R;for(let e=0;e<i;e++){const i=t[e];let a,c,l=-1,h=0;for(;h<i.length&&(r.lastIndex=h,c=r.exec(i),null!==c);)h=r.lastIndex,r===R?"!--"===c[1]?r=D:void 0!==c[1]?r=H:void 0!==c[2]?(j.test(c[2])&&(n=RegExp("</"+c[2],"g")),r=I):void 0!==c[3]&&(r=I):r===I?">"===c[0]?(r=n??R,l=-1):void 0===c[1]?l=-2:(l=r.lastIndex-c[2].length,a=c[1],r=void 0===c[3]?I:'"'===c[3]?L:q):r===L||r===q?r=I:r===D||r===H?r=R:(r=I,n=void 0);const d=r===I&&t[e+1].startsWith("/>")?" ":"";s+=r===R?i+k:l>=0?(o.push(a),i.slice(0,l)+C+i.slice(l)+P+d):i+P+(-2===l?e:d)}return[J(t,s+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),o]};class G{constructor({strings:t,_$litType$:e},i){let o;this.parts=[];let n=0,s=0;const r=t.length-1,a=this.parts,[c,l]=Z(t,e);if(this.el=G.createElement(c,i),K.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(o=K.nextNode())&&a.length<r;){if(1===o.nodeType){if(o.hasAttributes())for(const t of o.getAttributeNames())if(t.endsWith(C)){const e=l[s++],i=o.getAttribute(t).split(P),r=/([.?@])?(.*)/.exec(e);a.push({type:1,index:n,name:r[2],strings:i,ctor:"."===r[1]?et:"?"===r[1]?it:"@"===r[1]?ot:tt}),o.removeAttribute(t)}else t.startsWith(P)&&(a.push({type:6,index:n}),o.removeAttribute(t));if(j.test(o.tagName)){const t=o.textContent.split(P),e=t.length-1;if(e>0){o.textContent=E?E.emptyScript:"";for(let i=0;i<e;i++)o.append(t[i],O()),K.nextNode(),a.push({type:2,index:++n});o.append(t[e],O())}}}else if(8===o.nodeType)if(o.data===T)a.push({type:2,index:n});else{let t=-1;for(;-1!==(t=o.data.indexOf(P,t+1));)a.push({type:7,index:n}),t+=P.length-1}n++}}static createElement(t,e){const i=M.createElement("template");return i.innerHTML=t,i}}function Q(t,e,i=t,o){if(e===B)return e;let n=void 0!==o?i._$Co?.[o]:i._$Cl;const s=z(e)?void 0:e._$litDirective$;return n?.constructor!==s&&(n?._$AO?.(!1),void 0===s?n=void 0:(n=new s(t),n._$AT(t,i,o)),void 0!==o?(i._$Co??=[])[o]=n:i._$Cl=n),void 0!==n&&(e=Q(t,n._$AS(t,e.values),n,o)),e}class X{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,o=(t?.creationScope??M).importNode(e,!0);K.currentNode=o;let n=K.nextNode(),s=0,r=0,a=i[0];for(;void 0!==a;){if(s===a.index){let e;2===a.type?e=new Y(n,n.nextSibling,this,t):1===a.type?e=new a.ctor(n,a.name,a.strings,this,t):6===a.type&&(e=new nt(n,this,t)),this._$AV.push(e),a=i[++r]}s!==a?.index&&(n=K.nextNode(),s++)}return K.currentNode=M,o}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class Y{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,o){this.type=2,this._$AH=F,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Q(this,t,e),z(t)?t===F||null==t||""===t?(this._$AH!==F&&this._$AR(),this._$AH=F):t!==this._$AH&&t!==B&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>U(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==F&&z(this._$AH)?this._$AA.nextSibling.data=t:this.T(M.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,o="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=G.createElement(J(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===o)this._$AH.p(e);else{const t=new X(o,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=W.get(t.strings);return void 0===e&&W.set(t.strings,e=new G(t)),e}k(t){U(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,o=0;for(const n of t)o===e.length?e.push(i=new Y(this.O(O()),this.O(O()),this,this.options)):i=e[o],i._$AI(n),o++;o<e.length&&(this._$AR(i&&i._$AB.nextSibling,o),e.length=o)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=A(t).nextSibling;A(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class tt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,o,n){this.type=1,this._$AH=F,this._$AN=void 0,this.element=t,this.name=e,this._$AM=o,this.options=n,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=F}_$AI(t,e=this,i,o){const n=this.strings;let s=!1;if(void 0===n)t=Q(this,t,e,0),s=!z(t)||t!==this._$AH&&t!==B,s&&(this._$AH=t);else{const o=t;let r,a;for(t=n[0],r=0;r<n.length-1;r++)a=Q(this,o[i+r],e,r),a===B&&(a=this._$AH[r]),s||=!z(a)||a!==this._$AH[r],a===F?t=F:t!==F&&(t+=(a??"")+n[r+1]),this._$AH[r]=a}s&&!o&&this.j(t)}j(t){t===F?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class et extends tt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===F?void 0:t}}class it extends tt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==F)}}class ot extends tt{constructor(t,e,i,o,n){super(t,e,i,o,n),this.type=5}_$AI(t,e=this){if((t=Q(this,t,e,0)??F)===B)return;const i=this._$AH,o=t===F&&i!==F||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,n=t!==F&&(i===F||o);o&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class nt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Q(this,t)}}const st=x.litHtmlPolyfillSupport;st?.(G,Y),(x.litHtmlVersions??=[]).push("3.3.2");const rt=globalThis;class at extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const o=i?.renderBefore??e;let n=o._$litPart$;if(void 0===n){const t=i?.renderBefore??null;o._$litPart$=n=new Y(e.insertBefore(O(),t),t,void 0,i??{})}return n._$AI(t),n})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return B}}at._$litElement$=!0,at.finalized=!0,rt.litElementHydrateSupport?.({LitElement:at});const ct=rt.litElementPolyfillSupport;ct?.({LitElement:at}),(rt.litElementVersions??=[]).push("4.2.2");const lt=t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},ht={attribute:!0,type:String,converter:b,reflect:!1,hasChanged:y},dt=(t=ht,e,i)=>{const{kind:o,metadata:n}=i;let s=globalThis.litPropertyMetadata.get(n);if(void 0===s&&globalThis.litPropertyMetadata.set(n,s=new Map),"setter"===o&&((t=Object.create(t)).wrapped=!0),s.set(i.name,t),"accessor"===o){const{name:o}=i;return{set(i){const n=e.get.call(this);e.set.call(this,i),this.requestUpdate(o,n,t,!0,i)},init(e){return void 0!==e&&this.C(o,void 0,t,e),e}}}if("setter"===o){const{name:o}=i;return function(i){const n=this[o];e.call(this,i),this.requestUpdate(o,n,t,!0,i)}}throw Error("Unsupported decorator location: "+o)};function pt(t){return(e,i)=>"object"==typeof i?dt(t,e,i):((t,e,i)=>{const o=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),o?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}function ut(t){return pt({...t,state:!0,attribute:!1})}const _t=["switch","light","input_boolean","fan","siren","humidifier","media_player"];let mt=class extends at{constructor(){super(...arguments),this._allowedConfigKeys=new Set(["entity","action","revert_to","durations","name","icon","show_remaining","allow_custom_duration","confirm_cancel","tap_behavior","long_press_action","theme.popup_title","theme.button_format"])}setConfig(t){this._config=t}_parseDurations(t){const e=String(t??"").trim();if(!e)return{error:"Durations must contain 1 to 8 unique positive integers."};const i=e.split(",").map(t=>t.trim()).filter(t=>t.length>0);if(i.length<1||i.length>8)return{error:"Durations must contain 1 to 8 unique positive integers."};const o=[],n=new Set;for(const t of i){const e=Number(t);if(!Number.isInteger(e)||e<=0)return{error:"Each duration must be a positive integer."};if(n.has(e))return{error:"Durations must be unique."};n.add(e),o.push(e)}return{value:o}}_setConfigValue(t,e){if(!this._allowedConfigKeys.has(t))return void console.warn(`switch-for-time-card-editor: ignoring unsupported config key "${t}"`);const i={...this._config};if("durations"===t){const t=this._parseDurations(String(e??""));if(t.error)return void(this._durationsError=t.error);this._durationsError=void 0,i.durations=t.value}else if("action"===t){"media_player"===(i.entity||"").split(".")[0]&&"toggle"===e?(console.warn('switch-for-time-card-editor: media_player does not support toggle, using "on"'),i.action="on"):i.action=e}else if("entity"===t){i.entity=e;"media_player"===(i.entity||"").split(".")[0]&&"toggle"===i.action&&(i.action="on")}else"theme.popup_title"===t?i.theme={...i.theme||{},popup_title:e}:"theme.button_format"===t?i.theme={...i.theme||{},button_format:e}:i[t]=e;this._config=i,this._fireEvent("config-changed",{config:this._config})}_valueChanged(t){if(!this._config||!this.hass)return;const e=t.target,i=e.configValue,o=t.detail?.value??e.value;i&&this._setConfigValue(i,o)}_checkboxChanged(t,e){const i=e.target;this._setConfigValue(t,i.checked)}_fireEvent(t,e){const i=new CustomEvent(t,{detail:e,bubbles:!0,composed:!0});this.dispatchEvent(i)}render(){if(!this.hass||!this._config)return V``;const t=this._config.durations?.join(", ")||"",e="media_player"===(this._config.entity||"").split(".")[0];return V`
      <div class="card-config">
        <div class="option">
          <label>
            Entity (required)
            <input
              type="text"
              .value=${this._config.entity||""}
              .configValue=${"entity"}
              @input=${this._valueChanged}
              placeholder="switch.living_room_lamp"
            />
          </label>
          <div class="hint">
            Must be a switch, light, input_boolean, fan, siren, humidifier, or media_player
          </div>
        </div>

        <div class="option">
          <label>
            Action
            <select .value=${this._config.action||"toggle"} .configValue=${"action"} @change=${this._valueChanged}>
              <option value="on">On</option>
              <option value="off">Off</option>
              ${e?"":V`<option value="toggle">Toggle</option>`}
            </select>
          </label>
        </div>

        <div class="option">
          <label>
            Revert to
            <select
              .value=${this._config.revert_to||"previous"}
              .configValue=${"revert_to"}
              @change=${this._valueChanged}
            >
              <option value="previous">Previous state</option>
              <option value="on">On</option>
              <option value="off">Off</option>
              <option value="none">None (leave as-is)</option>
            </select>
          </label>
        </div>

        <div class="option">
          <label>
            Durations (minutes, required)
            <input
              type="text"
              .value=${t}
              .configValue=${"durations"}
              @input=${this._valueChanged}
              placeholder="10, 20, 30, 40"
            />
          </label>
          <div class="hint">Comma-separated list of minutes (1-8 durations)</div>
          ${this._durationsError?V`<div class="error">${this._durationsError}</div>`:""}
        </div>

        <div class="option">
          <label>
            Name (optional)
            <input
              type="text"
              .value=${this._config.name||""}
              .configValue=${"name"}
              @input=${this._valueChanged}
              placeholder="Override entity name"
            />
          </label>
        </div>

        <div class="option">
          <label>
            Icon (optional)
            <input
              type="text"
              .value=${this._config.icon||""}
              .configValue=${"icon"}
              @input=${this._valueChanged}
              placeholder="mdi:lamp"
            />
          </label>
        </div>

        <div class="option checkbox">
          <label>
            <input
              type="checkbox"
              .checked=${this._config.show_remaining??!0}
              .configValue=${"show_remaining"}
              @change=${t=>this._checkboxChanged("show_remaining",t)}
            />
            Show remaining time
          </label>
        </div>

        <div class="option checkbox">
          <label>
            <input
              type="checkbox"
              .checked=${this._config.allow_custom_duration||!1}
              .configValue=${"allow_custom_duration"}
              @change=${t=>this._checkboxChanged("allow_custom_duration",t)}
            />
            Allow custom duration
          </label>
        </div>

        <div class="option checkbox">
          <label>
            <input
              type="checkbox"
              .checked=${this._config.confirm_cancel||!1}
              .configValue=${"confirm_cancel"}
              @change=${t=>this._checkboxChanged("confirm_cancel",t)}
            />
            Confirm before cancel
          </label>
        </div>

        <div class="option">
          <label>
            Tap behavior
            <select
              .value=${this._config.tap_behavior||"popup"}
              .configValue=${"tap_behavior"}
              @change=${this._valueChanged}
            >
              <option value="popup">Show popup</option>
              <option value="immediate">Immediate (use first duration)</option>
            </select>
          </label>
        </div>

        <div class="option">
          <label>
            Long press action
            <select
              .value=${this._config.long_press_action||"cancel"}
              .configValue=${"long_press_action"}
              @change=${this._valueChanged}
            >
              <option value="none">None</option>
              <option value="cancel">Cancel timer</option>
            </select>
          </label>
        </div>

        <div class="section-header">Theme</div>

        <div class="option">
          <label>
            Popup title template
            <input
              type="text"
              .value=${this._config.theme?.popup_title||""}
              .configValue=${"theme.popup_title"}
              @input=${this._valueChanged}
              placeholder="Turn {action} for…"
            />
          </label>
          <div class="hint">Placeholders: {action}, {entity}, {name}</div>
        </div>

        <div class="option">
          <label>
            Button format template
            <input
              type="text"
              .value=${this._config.theme?.button_format||""}
              .configValue=${"theme.button_format"}
              @input=${this._valueChanged}
              placeholder="{minutes} min"
            />
          </label>
          <div class="hint">Placeholder: {minutes}</div>
        </div>
      </div>
    `}static get styles(){return r`
      .card-config {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 16px;
      }

      .option {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .option.checkbox {
        flex-direction: row;
        align-items: center;
      }

      .option.checkbox label {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      label {
        font-size: 14px;
        font-weight: 500;
        color: var(--primary-text-color);
      }

      input[type='text'],
      input[type='number'],
      select {
        padding: 8px;
        border: 1px solid var(--divider-color);
        border-radius: 4px;
        background: var(--card-background-color);
        color: var(--primary-text-color);
        font-size: 14px;
      }

      input[type='checkbox'] {
        width: 20px;
        height: 20px;
      }

      .hint {
        font-size: 12px;
        color: var(--secondary-text-color);
        font-style: italic;
      }

      .error {
        font-size: 12px;
        color: var(--error-color, #db4437);
      }

      .section-header {
        font-size: 16px;
        font-weight: bold;
        color: var(--primary-text-color);
        margin-top: 8px;
        padding-bottom: 4px;
        border-bottom: 1px solid var(--divider-color);
      }
    `}};t([pt({attribute:!1})],mt.prototype,"hass",void 0),t([ut()],mt.prototype,"_config",void 0),t([ut()],mt.prototype,"_durationsError",void 0),mt=t([lt("switch-for-time-card-editor")],mt);const ft={en:{common:{cancel:"Cancel",confirm:"Confirm"},card:{default_popup_title:"Turn {action} for…",default_button_format:"{minutes} min",timer_started:"Timer started: {duration} min",timer_cancelled:"Timer cancelled",timer_finished:"Timer finished",all_slots_in_use:"All switch-for-time slots are in use",custom_duration:"Custom duration",enter_minutes:"Enter minutes (1-1440)",remaining:"Remaining"},editor:{entity:"Entity",entity_required:"Entity is required",entity_invalid_domain:"Entity must be a switch, light, input_boolean, fan, siren, humidifier, or media_player",action:"Action",action_on:"On",action_off:"Off",action_toggle:"Toggle",revert_to:"Revert to",revert_previous:"Previous state",revert_on:"On",revert_off:"Off",revert_none:"None (leave as-is)",durations:"Durations (minutes)",durations_required:"At least one duration is required",durations_max:"Maximum 8 durations allowed",durations_positive:"Durations must be positive numbers",name:"Name (optional)",icon:"Icon (optional)",show_remaining:"Show remaining time",allow_custom_duration:"Allow custom duration",confirm_cancel:"Confirm before cancel",tap_behavior:"Tap behavior",tap_popup:"Show popup",tap_immediate:"Immediate (use first duration)",long_press_action:"Long press action",long_press_none:"None",long_press_cancel:"Cancel timer",theme_popup_title:"Popup title template",theme_button_format:"Button format template",durations_unique:"Durations must be unique integers",action_invalid_media_player:"Media player only supports on/off actions"},popup:{cancel_timer:"Cancel Timer",replace_timer:"Replace Timer",extend_timer:"Extend Timer",confirm_cancel_title:"Cancel Timer?",confirm_cancel_message:"Are you sure you want to cancel this timer?"}},fr:{common:{cancel:"Annuler",confirm:"Confirmer"},card:{default_popup_title:"Allumer {action} pendant…",default_button_format:"{minutes} min",timer_started:"Minuterie démarrée : {duration} min",timer_cancelled:"Minuterie annulée",timer_finished:"Minuterie terminée",all_slots_in_use:"Tous les emplacements de minuterie sont utilisés",custom_duration:"Durée personnalisée",enter_minutes:"Entrez les minutes (1-1440)",remaining:"Restant"},editor:{entity:"Entité",entity_required:"L'entité est requise",entity_invalid_domain:"L'entité doit être un switch, light, input_boolean, fan, siren, humidifier ou media_player",action:"Action",action_on:"Allumer",action_off:"Éteindre",action_toggle:"Basculer",revert_to:"Revenir à",revert_previous:"État précédent",revert_on:"Allumé",revert_off:"Éteint",revert_none:"Aucun (laisser tel quel)",durations:"Durées (minutes)",durations_required:"Au moins une durée est requise",durations_max:"Maximum 8 durées autorisées",durations_positive:"Les durées doivent être des nombres positifs",name:"Nom (optionnel)",icon:"Icône (optionnel)",show_remaining:"Afficher le temps restant",allow_custom_duration:"Autoriser une durée personnalisée",confirm_cancel:"Confirmer avant d'annuler",tap_behavior:"Comportement au toucher",tap_popup:"Afficher la popup",tap_immediate:"Immédiat (utiliser la première durée)",long_press_action:"Action de pression longue",long_press_none:"Aucune",long_press_cancel:"Annuler la minuterie",theme_popup_title:"Modèle de titre de popup",theme_button_format:"Modèle de format de bouton",durations_unique:"Les durées doivent être des entiers uniques",action_invalid_media_player:"Media player prend uniquement les actions allumer/éteindre"},popup:{cancel_timer:"Annuler la minuterie",replace_timer:"Remplacer la minuterie",extend_timer:"Prolonger la minuterie",confirm_cancel_title:"Annuler la minuterie ?",confirm_cancel_message:"Êtes-vous sûr de vouloir annuler cette minuterie ?"}}};console.info("%c SWITCH-FOR-TIME-CARD %c 1.0.0 ","color: white; background: #0288d1; font-weight: bold;","color: #0288d1; background: white; font-weight: bold;");let gt=class extends at{constructor(){super(...arguments),this._showPopup=!1,this._showCustomDuration=!1,this._customDuration=30,this._remainingSeconds=0,this._popupMode="select",this._confirmCancelPending=!1,this._unsubscribeEvents=[],this._selectionMode="start"}static async getConfigElement(){return document.createElement("switch-for-time-card-editor")}static getStubConfig(){return{type:"custom:switch-for-time-card",entity:"",action:"toggle",revert_to:"previous",durations:[10,20,30]}}setConfig(t){if(!t.entity)throw new Error(this._localize("editor.entity_required"));const e=t.entity.split(".")[0];if(!_t.includes(e))throw new Error(this._localize("editor.entity_invalid_domain"));if(!t.durations||0===t.durations.length)throw new Error(this._localize("editor.durations_required"));if(t.durations.length>8)throw new Error(this._localize("editor.durations_max"));if(t.durations.some(t=>"number"!=typeof t||!Number.isInteger(t)||t<=0))throw new Error(this._localize("editor.durations_positive"));if(new Set(t.durations).size!==t.durations.length)throw new Error(this._localize("editor.durations_unique"));if("media_player"===e&&"toggle"===t.action)throw new Error(this._localize("editor.action_invalid_media_player"));this._config={action:"toggle",revert_to:"previous",show_remaining:!0,allow_custom_duration:!1,confirm_cancel:!1,tap_behavior:"popup",long_press_action:"cancel",...t}}getCardSize(){return 1}connectedCallback(){super.connectedCallback(),this._config?.entity&&this._subscribeToEvents(),this._startUpdateLoop()}disconnectedCallback(){super.disconnectedCallback(),this._stopUpdateLoop(),this._unsubscribeFromEvents()}updated(t){super.updated(t),t.has("hass")&&this.hass&&this._updateTimerState(),t.has("_config")&&this.hass&&this.isConnected&&this._config?.entity&&(this._subscribeToEvents(),this._updateTimerState())}async _subscribeToEvents(){if(this.hass&&this._config?.entity){this._unsubscribeFromEvents();try{const t=await this.hass.connection.subscribeEvents(t=>{const e=t.data?.entity_id;e===this._config?.entity&&this._updateTimerState()},"switch_for_time_started");this._unsubscribeEvents.push(t);const e=await this.hass.connection.subscribeEvents(t=>{const e=t.data?.entity_id;e===this._config?.entity&&(this._timerState=void 0,this._remainingSeconds=0)},"switch_for_time_finished");this._unsubscribeEvents.push(e);const i=await this.hass.connection.subscribeEvents(t=>{const e=t.data?.entity_id;e===this._config?.entity&&(this._timerState=void 0,this._remainingSeconds=0)},"switch_for_time_cancelled");this._unsubscribeEvents.push(i)}catch(t){console.error("Failed to subscribe to events:",t)}}}_unsubscribeFromEvents(){for(const t of this._unsubscribeEvents)t();this._unsubscribeEvents=[]}_updateTimerState(){if(!this._config?.entity)return;const t=this.hass?.states["input_text.switch_for_time_state"]||this.hass?.states["sensor.switch_for_time_state"];if(t)try{const e=JSON.parse(t.state)[this._config.entity];e?(this._timerState=e,this._updateRemainingTime()):(this._timerState=void 0,this._remainingSeconds=0)}catch(t){this._timerState=void 0,this._remainingSeconds=0}}_updateRemainingTime(){if(!this._timerState)return void(this._remainingSeconds=0);const t=new Date(this._timerState.ends_at),e=new Date,i=t.getTime()-e.getTime();this._remainingSeconds=Math.max(0,Math.floor(i/1e3))}_startUpdateLoop(){this._updateInterval=window.setInterval(()=>{this._timerState&&this._updateRemainingTime()},1e3)}_stopUpdateLoop(){this._updateInterval&&(clearInterval(this._updateInterval),this._updateInterval=void 0)}_handleTap(){this._confirmCancelPending=!1,this._timerState?(this._popupMode="active",this._showPopup=!0):"immediate"===this._config.tap_behavior&&this._config.durations.length>0?(this._selectionMode="start",this._startTimer(this._config.durations[0])):(this._selectionMode="start",this._popupMode="select",this._showPopup=!0)}_handleLongPress(){"cancel"===this._config.long_press_action&&this._timerState?this._config.confirm_cancel?(this._confirmCancelPending=!0,this._popupMode="active",this._showPopup=!0):this._cancelTimer():this._timerState||this._fireEvent("hass-more-info",{entityId:this._config.entity})}async _startTimer(t,e=!1){try{const i={entity_id:this._config.entity,action:this._config.action,duration_minutes:t,revert_to:this._config.revert_to,cancel_existing:!e};e&&this._timerState&&(i.duration_minutes=t+Math.ceil(this._remainingSeconds/60)),this._hasIntegrationBackend()?await this.hass.callService("switch_for_time","start",i):await this.hass.callService("script","switch_for_time",i),this._handleClosePopup(),this._showToast(this._localize("card.timer_started").replace("{duration}",t.toString()))}catch(t){console.error("Failed to start timer:",t)}}async _cancelTimer(){try{this._hasIntegrationBackend()?await this.hass.callService("switch_for_time","cancel",{entity_id:this._config.entity}):await this.hass.callService("script","switch_for_time_cancel",{entity_id:this._config.entity}),this._handleClosePopup(),this._showToast(this._localize("card.timer_cancelled"))}catch(t){console.error("Failed to cancel timer:",t)}}_hasIntegrationBackend(){return Boolean(this.hass?.services?.switch_for_time?.start)}_handleClosePopup(){this._showPopup=!1,this._showCustomDuration=!1,this._popupMode="select",this._selectionMode="start",this._confirmCancelPending=!1}_showToast(t){this._fireEvent("hass-notification",{message:t})}_fireEvent(t,e){const i=new CustomEvent(t,{detail:e,bubbles:!0,composed:!0});this.dispatchEvent(i)}_localize(t){const e=(this.hass?.locale?.language||"en").replace(/_/g,"-").toLowerCase(),i=e.split("-")[0],o=ft[e]||ft[i]||ft.en,n=t.split(".");let s=o;for(const t of n)if(s=s?.[t],void 0===s)break;return s||t}_formatTime(t){return`${Math.floor(t/60)}:${(t%60).toString().padStart(2,"0")}`}_getEntityName(){if(this._config.name)return this._config.name;const t=this.hass?.states[this._config.entity];return t?.attributes?.friendly_name||this._config.entity}_getEntityIcon(){if(this._config.icon)return this._config.icon;const t=this.hass?.states[this._config.entity];return t?.attributes?.icon||"mdi:power"}_getEntityState(){const t=this.hass?.states[this._config.entity];return t?.state||"unknown"}_renderPopupTitle(){return(this._config.theme?.popup_title||this._localize("card.default_popup_title")).replace("{action}",this._config.action||"toggle").replace("{entity}",this._config.entity).replace("{name}",this._getEntityName())}_renderButtonLabel(t){return(this._config.theme?.button_format||this._localize("card.default_button_format")).replace("{minutes}",t.toString())}render(){return this._config&&this.hass?V`
      <ha-card @click=${this._handleTap} @long-press=${this._handleLongPress}>
        <div class="card-content">
          <div class="entity-row">
            <div class="icon-container">
              <ha-icon
                .icon=${this._getEntityIcon()}
                class=${this._timerState?"active":""}
              ></ha-icon>
            </div>
            <div class="info">
              <div class="name">${this._getEntityName()}</div>
              <div class="state">
                ${this._timerState&&this._config.show_remaining?V`${this._formatTime(this._remainingSeconds)}`:this._getEntityState()}
              </div>
            </div>
          </div>
        </div>
      </ha-card>

      ${this._showPopup?this._renderPopup():""}
    `:V``}_renderPopup(){return V`
      <div class="popup-overlay" @click=${this._handleClosePopup}>
        <div class="popup-content" @click=${t=>t.stopPropagation()}>
          <div class="popup-header">
            <h3>${this._renderPopupTitle()}</h3>
            <button class="close-button" @click=${this._handleClosePopup}>×</button>
          </div>

          ${"active"===this._popupMode?this._renderActivePopup():this._renderSelectPopup()}
        </div>
      </div>
    `}_renderSelectPopup(){return V`
      <div class="popup-body">
        <div class="duration-buttons">
          ${this._config.durations.map(t=>V`
              <button
                class="duration-button"
                @click=${()=>this._startTimer(t,"extend"===this._selectionMode)}
              >
                ${this._renderButtonLabel(t)}
              </button>
            `)}
        </div>

        ${this._config.allow_custom_duration?V`
              <div class="custom-duration">
                ${this._showCustomDuration?V`
                      <input
                        type="number"
                        min="1"
                        max="1440"
                        .value=${this._customDuration.toString()}
                        @input=${t=>this._customDuration=parseInt(t.target.value)||30}
                        placeholder=${this._localize("card.enter_minutes")}
                      />
                      <button
                        @click=${()=>this._startTimer(this._customDuration,"extend"===this._selectionMode)}
                      >
                        ${this._localize("common.confirm")}
                      </button>
                    `:V`
                      <button
                        class="custom-button"
                        @click=${()=>this._showCustomDuration=!0}
                      >
                        + ${this._localize("card.custom_duration")}
                      </button>
                    `}
              </div>
            `:""}

        <button class="cancel-button" @click=${this._handleClosePopup}>
          ${this._localize("common.cancel")}
        </button>
      </div>
    `}_renderActivePopup(){return V`
      <div class="popup-body">
        ${this._confirmCancelPending?V`
              <div class="timer-info">
                <div class="timer-label">${this._localize("popup.confirm_cancel_title")}</div>
                <div class="timer-label">${this._localize("popup.confirm_cancel_message")}</div>
              </div>
            `:V`
              <div class="timer-info">
                <div class="timer-remaining">${this._formatTime(this._remainingSeconds)}</div>
                <div class="timer-label">${this._localize("card.remaining")}</div>
              </div>
            `}

        <div class="action-buttons">
          <button
            class="action-button"
            @click=${()=>{!this._config.confirm_cancel||this._confirmCancelPending?this._cancelTimer():this._confirmCancelPending=!0}}
          >
            ${this._localize("popup.cancel_timer")}
          </button>
          <button
            class="action-button"
            @click=${()=>{this._selectionMode="replace",this._confirmCancelPending=!1,this._popupMode="select"}}
          >
            ${this._localize("popup.replace_timer")}
          </button>
          <button
            class="action-button"
            @click=${()=>{this._selectionMode="extend",this._confirmCancelPending=!1,this._popupMode="select"}}
          >
            ${this._localize("popup.extend_timer")}
          </button>
        </div>
      </div>
    `}static get styles(){return r`
      :host {
        display: block;
      }

      ha-card {
        cursor: pointer;
        user-select: none;
      }

      .card-content {
        padding: 16px;
      }

      .entity-row {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .icon-container {
        flex-shrink: 0;
      }

      ha-icon {
        width: 40px;
        height: 40px;
        color: var(--state-icon-color);
      }

      ha-icon.active {
        color: var(--state-icon-active-color, var(--paper-item-icon-active-color));
        animation: pulse 2s infinite;
      }

      @keyframes pulse {
        0%,
        100% {
          opacity: 1;
        }
        50% {
          opacity: 0.5;
        }
      }

      .info {
        flex: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .name {
        font-size: 16px;
        color: var(--primary-text-color);
      }

      .state {
        font-size: 14px;
        color: var(--secondary-text-color);
      }

      .popup-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999;
      }

      .popup-content {
        background: var(--card-background-color, white);
        border-radius: 8px;
        padding: 24px;
        max-width: 400px;
        width: 90%;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      }

      .popup-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }

      .popup-header h3 {
        margin: 0;
        font-size: 20px;
        color: var(--primary-text-color);
      }

      .close-button {
        background: none;
        border: none;
        font-size: 32px;
        cursor: pointer;
        color: var(--secondary-text-color);
        padding: 0;
        width: 32px;
        height: 32px;
        line-height: 32px;
      }

      .popup-body {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .duration-buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .duration-button {
        flex: 1;
        min-width: 80px;
        padding: 12px 16px;
        border: 1px solid var(--divider-color);
        border-radius: 20px;
        background: var(--card-background-color);
        color: var(--primary-text-color);
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .duration-button:hover {
        background: var(--primary-color);
        color: white;
      }

      .custom-duration {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      .custom-duration input {
        flex: 1;
        padding: 8px;
        border: 1px solid var(--divider-color);
        border-radius: 4px;
        background: var(--card-background-color);
        color: var(--primary-text-color);
      }

      .custom-button {
        width: 100%;
        padding: 12px;
        border: 1px dashed var(--divider-color);
        border-radius: 20px;
        background: none;
        color: var(--secondary-text-color);
        cursor: pointer;
      }

      .cancel-button,
      .action-button {
        padding: 12px;
        border: none;
        border-radius: 4px;
        background: var(--primary-color);
        color: white;
        font-size: 14px;
        cursor: pointer;
      }

      .action-button {
        background: var(--card-background-color);
        color: var(--primary-text-color);
        border: 1px solid var(--divider-color);
      }

      .timer-info {
        text-align: center;
        padding: 24px;
      }

      .timer-remaining {
        font-size: 48px;
        font-weight: bold;
        color: var(--primary-color);
      }

      .timer-label {
        font-size: 14px;
        color: var(--secondary-text-color);
        margin-top: 8px;
      }

      .action-buttons {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
    `}};t([pt({attribute:!1})],gt.prototype,"hass",void 0),t([ut()],gt.prototype,"_config",void 0),t([ut()],gt.prototype,"_timerState",void 0),t([ut()],gt.prototype,"_showPopup",void 0),t([ut()],gt.prototype,"_showCustomDuration",void 0),t([ut()],gt.prototype,"_customDuration",void 0),t([ut()],gt.prototype,"_remainingSeconds",void 0),t([ut()],gt.prototype,"_popupMode",void 0),t([ut()],gt.prototype,"_confirmCancelPending",void 0),gt=t([lt("switch-for-time-card")],gt),window.customCards=window.customCards||[],window.customCards.push({type:"switch-for-time-card",name:"Switch For Time",description:"Tap an entity, pick a duration, auto-revert."});export{gt as SwitchForTimeCard};
