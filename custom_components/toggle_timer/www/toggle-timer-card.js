function t(t,e,i,o){var n,s=arguments.length,r=s<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(n=t[a])&&(r=(s<3?n(r):s>3?n(e,i,r):n(e,i))||r);return s>3&&r&&Object.defineProperty(e,i,r),r}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,o=Symbol(),n=new WeakMap;let s=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==o)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=n.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&n.set(e,t))}return t}toString(){return this.cssText}};const r=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,o)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[o+1],t[0]);return new s(i,t,o)},a=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new s("string"==typeof t?t:t+"",void 0,o))(e)})(t):t,{is:c,defineProperty:l,getOwnPropertyDescriptor:d,getOwnPropertyNames:h,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,_=globalThis,m=_.trustedTypes,g=m?m.emptyScript:"",f=_.reactiveElementPolyfillSupport,v=(t,e)=>t,b={toAttribute(t,e){switch(e){case Boolean:t=t?g:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},y=(t,e)=>!c(t,e),$={attribute:!0,type:String,converter:b,reflect:!1,useDefault:!1,hasChanged:y};Symbol.metadata??=Symbol("metadata"),_.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=$){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),o=this.getPropertyDescriptor(t,i,e);void 0!==o&&l(this.prototype,t,o)}}static getPropertyDescriptor(t,e,i){const{get:o,set:n}=d(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:o,set(e){const s=o?.call(this);n?.call(this,e),this.requestUpdate(t,s,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??$}static _$Ei(){if(this.hasOwnProperty(v("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(v("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(v("properties"))){const t=this.properties,e=[...h(t),...p(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,o)=>{if(i)t.adoptedStyleSheets=o.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of o){const o=document.createElement("style"),n=e.litNonce;void 0!==n&&o.setAttribute("nonce",n),o.textContent=i.cssText,t.appendChild(o)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,i);if(void 0!==o&&!0===i.reflect){const n=(void 0!==i.converter?.toAttribute?i.converter:b).toAttribute(e,i.type);this._$Em=t,null==n?this.removeAttribute(o):this.setAttribute(o,n),this._$Em=null}}_$AK(t,e){const i=this.constructor,o=i._$Eh.get(t);if(void 0!==o&&this._$Em!==o){const t=i.getPropertyOptions(o),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:b;this._$Em=o;const s=n.fromAttribute(e,t.type);this[o]=s??this._$Ej?.get(o)??s,this._$Em=null}}requestUpdate(t,e,i,o=!1,n){if(void 0!==t){const s=this.constructor;if(!1===o&&(n=this[t]),i??=s.getPropertyOptions(t),!((i.hasChanged??y)(n,e)||i.useDefault&&i.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(s._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:o,wrapped:n},s){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,s??e??this[t]),!0!==n||void 0!==s)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===o&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,o=this[e];!0!==t||this._$AL.has(e)||void 0===o||this.C(e,void 0,i,o)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[v("elementProperties")]=new Map,x[v("finalized")]=new Map,f?.({ReactiveElement:x}),(_.reactiveElementVersions??=[]).push("2.1.2");const w=globalThis,S=t=>t,E=w.trustedTypes,A=E?E.createPolicy("lit-html",{createHTML:t=>t}):void 0,C="$lit$",T=`lit$${Math.random().toFixed(9).slice(2)}$`,k="?"+T,P=`<${k}>`,M=document,z=()=>M.createComment(""),D=t=>null===t||"object"!=typeof t&&"function"!=typeof t,R=Array.isArray,O="[ \t\n\f\r]",U=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,L=/-->/g,I=/>/g,N=RegExp(`>|${O}(?:([^\\s"'>=/]+)(${O}*=${O}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),H=/'/g,q=/"/g,j=/^(?:script|style|textarea|title)$/i,B=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),V=Symbol.for("lit-noChange"),F=Symbol.for("lit-nothing"),W=new WeakMap,G=M.createTreeWalker(M,129);function K(t,e){if(!R(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==A?A.createHTML(e):e}const J=(t,e)=>{const i=t.length-1,o=[];let n,s=2===e?"<svg>":3===e?"<math>":"",r=U;for(let e=0;e<i;e++){const i=t[e];let a,c,l=-1,d=0;for(;d<i.length&&(r.lastIndex=d,c=r.exec(i),null!==c);)d=r.lastIndex,r===U?"!--"===c[1]?r=L:void 0!==c[1]?r=I:void 0!==c[2]?(j.test(c[2])&&(n=RegExp("</"+c[2],"g")),r=N):void 0!==c[3]&&(r=N):r===N?">"===c[0]?(r=n??U,l=-1):void 0===c[1]?l=-2:(l=r.lastIndex-c[2].length,a=c[1],r=void 0===c[3]?N:'"'===c[3]?q:H):r===q||r===H?r=N:r===L||r===I?r=U:(r=N,n=void 0);const h=r===N&&t[e+1].startsWith("/>")?" ":"";s+=r===U?i+P:l>=0?(o.push(a),i.slice(0,l)+C+i.slice(l)+T+h):i+T+(-2===l?e:h)}return[K(t,s+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),o]};class Z{constructor({strings:t,_$litType$:e},i){let o;this.parts=[];let n=0,s=0;const r=t.length-1,a=this.parts,[c,l]=J(t,e);if(this.el=Z.createElement(c,i),G.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(o=G.nextNode())&&a.length<r;){if(1===o.nodeType){if(o.hasAttributes())for(const t of o.getAttributeNames())if(t.endsWith(C)){const e=l[s++],i=o.getAttribute(t).split(T),r=/([.?@])?(.*)/.exec(e);a.push({type:1,index:n,name:r[2],strings:i,ctor:"."===r[1]?et:"?"===r[1]?it:"@"===r[1]?ot:tt}),o.removeAttribute(t)}else t.startsWith(T)&&(a.push({type:6,index:n}),o.removeAttribute(t));if(j.test(o.tagName)){const t=o.textContent.split(T),e=t.length-1;if(e>0){o.textContent=E?E.emptyScript:"";for(let i=0;i<e;i++)o.append(t[i],z()),G.nextNode(),a.push({type:2,index:++n});o.append(t[e],z())}}}else if(8===o.nodeType)if(o.data===k)a.push({type:2,index:n});else{let t=-1;for(;-1!==(t=o.data.indexOf(T,t+1));)a.push({type:7,index:n}),t+=T.length-1}n++}}static createElement(t,e){const i=M.createElement("template");return i.innerHTML=t,i}}function Q(t,e,i=t,o){if(e===V)return e;let n=void 0!==o?i._$Co?.[o]:i._$Cl;const s=D(e)?void 0:e._$litDirective$;return n?.constructor!==s&&(n?._$AO?.(!1),void 0===s?n=void 0:(n=new s(t),n._$AT(t,i,o)),void 0!==o?(i._$Co??=[])[o]=n:i._$Cl=n),void 0!==n&&(e=Q(t,n._$AS(t,e.values),n,o)),e}class X{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,o=(t?.creationScope??M).importNode(e,!0);G.currentNode=o;let n=G.nextNode(),s=0,r=0,a=i[0];for(;void 0!==a;){if(s===a.index){let e;2===a.type?e=new Y(n,n.nextSibling,this,t):1===a.type?e=new a.ctor(n,a.name,a.strings,this,t):6===a.type&&(e=new nt(n,this,t)),this._$AV.push(e),a=i[++r]}s!==a?.index&&(n=G.nextNode(),s++)}return G.currentNode=M,o}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class Y{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,o){this.type=2,this._$AH=F,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Q(this,t,e),D(t)?t===F||null==t||""===t?(this._$AH!==F&&this._$AR(),this._$AH=F):t!==this._$AH&&t!==V&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>R(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==F&&D(this._$AH)?this._$AA.nextSibling.data=t:this.T(M.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,o="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=Z.createElement(K(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===o)this._$AH.p(e);else{const t=new X(o,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=W.get(t.strings);return void 0===e&&W.set(t.strings,e=new Z(t)),e}k(t){R(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,o=0;for(const n of t)o===e.length?e.push(i=new Y(this.O(z()),this.O(z()),this,this.options)):i=e[o],i._$AI(n),o++;o<e.length&&(this._$AR(i&&i._$AB.nextSibling,o),e.length=o)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=S(t).nextSibling;S(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class tt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,o,n){this.type=1,this._$AH=F,this._$AN=void 0,this.element=t,this.name=e,this._$AM=o,this.options=n,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=F}_$AI(t,e=this,i,o){const n=this.strings;let s=!1;if(void 0===n)t=Q(this,t,e,0),s=!D(t)||t!==this._$AH&&t!==V,s&&(this._$AH=t);else{const o=t;let r,a;for(t=n[0],r=0;r<n.length-1;r++)a=Q(this,o[i+r],e,r),a===V&&(a=this._$AH[r]),s||=!D(a)||a!==this._$AH[r],a===F?t=F:t!==F&&(t+=(a??"")+n[r+1]),this._$AH[r]=a}s&&!o&&this.j(t)}j(t){t===F?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class et extends tt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===F?void 0:t}}class it extends tt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==F)}}class ot extends tt{constructor(t,e,i,o,n){super(t,e,i,o,n),this.type=5}_$AI(t,e=this){if((t=Q(this,t,e,0)??F)===V)return;const i=this._$AH,o=t===F&&i!==F||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,n=t!==F&&(i===F||o);o&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class nt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Q(this,t)}}const st=w.litHtmlPolyfillSupport;st?.(Z,Y),(w.litHtmlVersions??=[]).push("3.3.2");const rt=globalThis;class at extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const o=i?.renderBefore??e;let n=o._$litPart$;if(void 0===n){const t=i?.renderBefore??null;o._$litPart$=n=new Y(e.insertBefore(z(),t),t,void 0,i??{})}return n._$AI(t),n})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return V}}at._$litElement$=!0,at.finalized=!0,rt.litElementHydrateSupport?.({LitElement:at});const ct=rt.litElementPolyfillSupport;ct?.({LitElement:at}),(rt.litElementVersions??=[]).push("4.2.2");const lt=t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},dt={attribute:!0,type:String,converter:b,reflect:!1,hasChanged:y},ht=(t=dt,e,i)=>{const{kind:o,metadata:n}=i;let s=globalThis.litPropertyMetadata.get(n);if(void 0===s&&globalThis.litPropertyMetadata.set(n,s=new Map),"setter"===o&&((t=Object.create(t)).wrapped=!0),s.set(i.name,t),"accessor"===o){const{name:o}=i;return{set(i){const n=e.get.call(this);e.set.call(this,i),this.requestUpdate(o,n,t,!0,i)},init(e){return void 0!==e&&this.C(o,void 0,t,e),e}}}if("setter"===o){const{name:o}=i;return function(i){const n=this[o];e.call(this,i),this.requestUpdate(o,n,t,!0,i)}}throw Error("Unsupported decorator location: "+o)};function pt(t){return(e,i)=>"object"==typeof i?ht(t,e,i):((t,e,i)=>{const o=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),o?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}function ut(t){return pt({...t,state:!0,attribute:!1})}const _t=["switch","light","input_boolean","fan","siren","humidifier","media_player"];let mt=class extends at{constructor(){super(...arguments),this._allowedConfigKeys=new Set(["entity","action","revert_to","durations","name","icon","show_remaining","allow_custom_duration","confirm_cancel","tap_behavior","long_press_action","theme.popup_title","theme.button_format"])}setConfig(t){this._config=t}_parseDurations(t){const e=String(t??"").trim();if(!e)return{error:"Durations must contain 1 to 8 unique positive integers."};const i=e.split(",").map(t=>t.trim()).filter(t=>t.length>0);if(i.length<1||i.length>8)return{error:"Durations must contain 1 to 8 unique positive integers."};const o=[],n=new Set;for(const t of i){const e=Number(t);if(!Number.isInteger(e)||e<=0)return{error:"Each duration must be a positive integer."};if(n.has(e))return{error:"Durations must be unique."};n.add(e),o.push(e)}return{value:o}}_setConfigValue(t,e){if(!this._allowedConfigKeys.has(t))return void console.warn(`toggle-timer-card-editor: ignoring unsupported config key "${t}"`);const i={...this._config};if("durations"===t){const t=this._parseDurations(String(e??""));if(t.error)return void(this._durationsError=t.error);this._durationsError=void 0,i.durations=t.value}else if("action"===t){"media_player"===(i.entity||"").split(".")[0]&&"toggle"===e?(console.warn('toggle-timer-card-editor: media_player does not support toggle, using "on"'),i.action="on"):i.action=e}else if("entity"===t){i.entity=e;"media_player"===(i.entity||"").split(".")[0]&&"toggle"===i.action&&(i.action="on")}else"theme.popup_title"===t?i.theme={...i.theme||{},popup_title:e}:"theme.button_format"===t?i.theme={...i.theme||{},button_format:e}:i[t]=e;this._config=i,this._fireEvent("config-changed",{config:this._config})}_valueChanged(t){if(!this._config||!this.hass)return;const e=t.target,i=e.configValue,o=t.detail?.value??e.value;i&&this._setConfigValue(i,o)}_checkboxChanged(t,e){const i=e.target;this._setConfigValue(t,i.checked)}_fireEvent(t,e){const i=new CustomEvent(t,{detail:e,bubbles:!0,composed:!0});this.dispatchEvent(i)}render(){if(!this.hass||!this._config)return B``;const t=this._config.durations?.join(", ")||"",e="media_player"===(this._config.entity||"").split(".")[0];return B`
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
              ${e?"":B`<option value="toggle">Toggle</option>`}
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
          ${this._durationsError?B`<div class="error">${this._durationsError}</div>`:""}
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
    `}};t([pt({attribute:!1})],mt.prototype,"hass",void 0),t([ut()],mt.prototype,"_config",void 0),t([ut()],mt.prototype,"_durationsError",void 0),mt=t([lt("toggle-timer-card-editor")],mt);var gt={common:{cancel:"Cancel",confirm:"Confirm"},card:{default_popup_title:"Turn {action} for…",default_button_format:"{minutes} min",timer_started:"Timer started: {duration} min",timer_cancelled:"Timer cancelled",timer_finished:"Timer finished",all_slots_in_use:"All toggle-timer slots are in use",custom_duration:"Custom duration",enter_minutes:"Enter minutes (1-1440)",remaining:"Remaining"},editor:{entity:"Entity",entity_required:"Entity is required",entity_invalid_domain:"Entity must be a switch, light, input_boolean, fan, siren, humidifier, or media_player",action:"Action",action_on:"On",action_off:"Off",action_toggle:"Toggle",revert_to:"Revert to",revert_previous:"Previous state",revert_on:"On",revert_off:"Off",revert_none:"None (leave as-is)",durations:"Durations (minutes)",durations_required:"At least one duration is required",durations_max:"Maximum 8 durations allowed",durations_positive:"Durations must be positive numbers",name:"Name (optional)",icon:"Icon (optional)",show_remaining:"Show remaining time",allow_custom_duration:"Allow custom duration",confirm_cancel:"Confirm before cancel",tap_behavior:"Tap behavior",tap_popup:"Show popup",tap_immediate:"Immediate (use first duration)",long_press_action:"Long press action",long_press_none:"None",long_press_cancel:"Cancel timer",theme_popup_title:"Popup title template",theme_button_format:"Button format template",durations_unique:"Durations must be unique integers",action_invalid_media_player:"Media player only supports on/off actions"},popup:{cancel_timer:"Cancel Timer",replace_timer:"Replace Timer",extend_timer:"Extend Timer",confirm_cancel_title:"Cancel Timer?",confirm_cancel_message:"Are you sure you want to cancel this timer?"}},ft={common:{cancel:"Annuler",confirm:"Confirmer"},card:{default_popup_title:"Allumer {action} pendant…",default_button_format:"{minutes} min",timer_started:"Minuterie démarrée : {duration} min",timer_cancelled:"Minuterie annulée",timer_finished:"Minuterie terminée",all_slots_in_use:"Tous les emplacements de minuterie sont utilisés",custom_duration:"Durée personnalisée",enter_minutes:"Entrez les minutes (1-1440)",remaining:"Restant"},editor:{entity:"Entité",entity_required:"L'entité est requise",entity_invalid_domain:"L'entité doit être un switch, light, input_boolean, fan, siren, humidifier ou media_player",action:"Action",action_on:"Allumer",action_off:"Éteindre",action_toggle:"Basculer",revert_to:"Revenir à",revert_previous:"État précédent",revert_on:"Allumé",revert_off:"Éteint",revert_none:"Aucun (laisser tel quel)",durations:"Durées (minutes)",durations_required:"Au moins une durée est requise",durations_max:"Maximum 8 durées autorisées",durations_positive:"Les durées doivent être des nombres positifs",name:"Nom (optionnel)",icon:"Icône (optionnel)",show_remaining:"Afficher le temps restant",allow_custom_duration:"Autoriser une durée personnalisée",confirm_cancel:"Confirmer avant d'annuler",tap_behavior:"Comportement au toucher",tap_popup:"Afficher la popup",tap_immediate:"Immédiat (utiliser la première durée)",long_press_action:"Action de pression longue",long_press_none:"Aucune",long_press_cancel:"Annuler la minuterie",theme_popup_title:"Modèle de titre de popup",theme_button_format:"Modèle de format de bouton",durations_unique:"Les durées doivent être des entiers uniques",action_invalid_media_player:"Media player prend uniquement les actions allumer/éteindre"},popup:{cancel_timer:"Annuler la minuterie",replace_timer:"Remplacer la minuterie",extend_timer:"Prolonger la minuterie",confirm_cancel_title:"Annuler la minuterie ?",confirm_cancel_message:"Êtes-vous sûr de vouloir annuler cette minuterie ?"}};const vt={en:gt,fr:ft};let bt=class extends at{constructor(){super(...arguments),this._showCustomDuration=!1,this._customDuration=30,this._remainingSeconds=0,this._popupMode="select",this._confirmCancelPending=!1,this._visible=!1,this._selectionMode="start"}open(){this._visible=!0,this._updateTimerState(),this._startUpdateLoop(),this._timerState?this._popupMode="active":(this._selectionMode="start",this._popupMode="select")}close(){this._visible=!1,this._stopUpdateLoop(),this._showCustomDuration=!1,this._popupMode="select",this._selectionMode="start",this._confirmCancelPending=!1}disconnectedCallback(){super.disconnectedCallback(),this._stopUpdateLoop()}_updateTimerState(){if(!this.config?.entity)return;const t=this.hass?.states["input_text.toggle_timer_state"]||this.hass?.states["sensor.toggle_timer_state"];if(t)try{const e=JSON.parse(t.state)[this.config.entity];e?(this._timerState=e,this._updateRemainingTime()):(this._timerState=void 0,this._remainingSeconds=0)}catch(t){this._timerState=void 0,this._remainingSeconds=0}}_updateRemainingTime(){if(!this._timerState)return void(this._remainingSeconds=0);const t=new Date(this._timerState.ends_at),e=new Date,i=t.getTime()-e.getTime();this._remainingSeconds=Math.max(0,Math.floor(i/1e3))}_startUpdateLoop(){this._updateInterval=window.setInterval(()=>{this._timerState&&this._updateRemainingTime()},1e3)}_stopUpdateLoop(){this._updateInterval&&(clearInterval(this._updateInterval),this._updateInterval=void 0)}async _startTimer(t,e=!1){try{const i={entity_id:this.config.entity,action:this.config.action||"toggle",duration_minutes:t,revert_to:this.config.revert_to||"previous",cancel_existing:!e};e&&this._timerState&&(i.duration_minutes=t+Math.ceil(this._remainingSeconds/60)),this._hasIntegrationBackend()?await this.hass.callService("toggle_timer","start",i):await this.hass.callService("script","toggle_timer",i),this.close(),this._showToast(this._localize("card.timer_started").replace("{duration}",t.toString()))}catch(t){console.error("Failed to start timer:",t)}}async _cancelTimer(){try{this._hasIntegrationBackend()?await this.hass.callService("toggle_timer","cancel",{entity_id:this.config.entity}):await this.hass.callService("script","toggle_timer_cancel",{entity_id:this.config.entity}),this.close(),this._showToast(this._localize("card.timer_cancelled"))}catch(t){console.error("Failed to cancel timer:",t)}}_hasIntegrationBackend(){return Boolean(this.hass?.services?.toggle_timer?.start)}_showToast(t){this._fireEvent("hass-notification",{message:t})}_fireEvent(t,e){const i=new CustomEvent(t,{detail:e,bubbles:!0,composed:!0});this.dispatchEvent(i)}_localize(t){const e=(this.hass?.locale?.language||"en").replace(/_/g,"-").toLowerCase(),i=e.split("-")[0],o=vt[e]||vt[i]||vt.en,n=t.split(".");let s=o;for(const t of n)if(s=s?.[t],void 0===s)break;return s||t}_formatTime(t){return`${Math.floor(t/60)}:${(t%60).toString().padStart(2,"0")}`}_getEntityName(){if(this.config.name)return this.config.name;const t=this.hass?.states[this.config.entity];return t?.attributes?.friendly_name||this.config.entity}_renderPopupTitle(){return(this.config.theme?.popup_title||this._localize("card.default_popup_title")).replace("{action}",this.config.action||"toggle").replace("{entity}",this.config.entity).replace("{name}",this._getEntityName())}_renderButtonLabel(t){return(this.config.theme?.button_format||this._localize("card.default_button_format")).replace("{minutes}",t.toString())}render(){return this._visible&&this.config&&this.hass?B`
      <div class="popup-overlay" @click=${()=>this.close()}>
        <div class="popup-content" @click=${t=>t.stopPropagation()}>
          <div class="popup-header">
            <h3>${this._renderPopupTitle()}</h3>
            <button class="close-button" @click=${()=>this.close()}>×</button>
          </div>

          ${"active"===this._popupMode?this._renderActivePopup():this._renderSelectPopup()}
        </div>
      </div>
    `:B``}_renderSelectPopup(){const t=Array.isArray(this.config?.durations)?this.config.durations:[],e=Boolean(this.config?.allow_custom_duration),i=t.length>0;return B`
      <div class="popup-body">
        <div class="duration-buttons">
          ${i?t.map(t=>B`
                  <button
                    class="duration-button"
                    @click=${()=>this._startTimer(t,"extend"===this._selectionMode)}
                  >
                    ${this._renderButtonLabel(t)}
                  </button>
                `):B`<div class="duration-error">
                ${this._localize("card.custom_duration")}
              </div>`}
        </div>

        ${e?B`
              <div class="custom-duration">
                ${this._showCustomDuration?B`
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
                    `:B`
                      <button
                        class="custom-button"
                        @click=${()=>this._showCustomDuration=!0}
                      >
                        + ${this._localize("card.custom_duration")}
                      </button>
                    `}
              </div>
            `:""}

        <button class="cancel-button" @click=${()=>this.close()}>
          ${this._localize("common.cancel")}
        </button>
      </div>
    `}_renderActivePopup(){return B`
      <div class="popup-body">
        ${this._confirmCancelPending?B`
              <div class="timer-info">
                <div class="timer-label">${this._localize("popup.confirm_cancel_title")}</div>
                <div class="timer-label">${this._localize("popup.confirm_cancel_message")}</div>
              </div>
            `:B`
              <div class="timer-info">
                <div class="timer-remaining">${this._formatTime(this._remainingSeconds)}</div>
                <div class="timer-label">${this._localize("card.remaining")}</div>
              </div>
            `}

        <div class="action-buttons">
          <button
            class="action-button"
            @click=${()=>{!this.config.confirm_cancel||this._confirmCancelPending?this._cancelTimer():this._confirmCancelPending=!0}}
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

      .popup-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
      }

      .popup-content {
        background-color: var(--card-background-color, white);
        border-radius: var(--ha-card-border-radius, 12px);
        box-shadow: var(--ha-card-box-shadow, 0 4px 8px rgba(0, 0, 0, 0.1));
        width: 90%;
        max-width: 400px;
        max-height: 80vh;
        overflow-y: auto;
      }

      .popup-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
        border-bottom: 1px solid var(--divider-color, #e0e0e0);
      }

      .popup-header h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 500;
        color: var(--primary-text-color, #212121);
      }

      .close-button {
        background: none;
        border: none;
        font-size: 28px;
        line-height: 1;
        cursor: pointer;
        color: var(--secondary-text-color, #757575);
        padding: 0;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .close-button:hover {
        color: var(--primary-text-color, #212121);
      }

      .popup-body {
        padding: 16px;
      }

      .duration-buttons {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
        gap: 8px;
        margin-bottom: 16px;
      }

      .duration-button {
        background-color: var(--primary-color, #0288d1);
        color: var(--text-primary-color, white);
        border: none;
        border-radius: 8px;
        padding: 12px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.2s;
      }

      .duration-button:hover {
        background-color: var(--dark-primary-color, #0277bd);
      }

      .custom-duration {
        margin-bottom: 16px;
      }

      .custom-duration input {
        width: calc(100% - 100px);
        padding: 8px;
        border: 1px solid var(--divider-color, #e0e0e0);
        border-radius: 4px;
        margin-right: 8px;
      }

      .custom-duration button {
        padding: 8px 16px;
        background-color: var(--primary-color, #0288d1);
        color: var(--text-primary-color, white);
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }

      .custom-button {
        width: 100%;
        padding: 12px;
        background-color: transparent;
        color: var(--primary-color, #0288d1);
        border: 1px solid var(--primary-color, #0288d1);
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
      }

      .cancel-button {
        width: 100%;
        padding: 12px;
        background-color: transparent;
        color: var(--secondary-text-color, #757575);
        border: 1px solid var(--divider-color, #e0e0e0);
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
      }

      .timer-info {
        text-align: center;
        padding: 24px 0;
      }

      .timer-remaining {
        font-size: 48px;
        font-weight: 300;
        color: var(--primary-text-color, #212121);
        margin-bottom: 8px;
      }

      .timer-label {
        font-size: 14px;
        color: var(--secondary-text-color, #757575);
      }

      .action-buttons {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .action-button {
        width: 100%;
        padding: 12px;
        background-color: var(--primary-color, #0288d1);
        color: var(--text-primary-color, white);
        border: none;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
      }

      .action-button:hover {
        background-color: var(--dark-primary-color, #0277bd);
      }
    `}};t([pt({attribute:!1})],bt.prototype,"hass",void 0),t([pt({type:Object})],bt.prototype,"config",void 0),t([ut()],bt.prototype,"_timerState",void 0),t([ut()],bt.prototype,"_showCustomDuration",void 0),t([ut()],bt.prototype,"_customDuration",void 0),t([ut()],bt.prototype,"_remainingSeconds",void 0),t([ut()],bt.prototype,"_popupMode",void 0),t([ut()],bt.prototype,"_confirmCancelPending",void 0),t([ut()],bt.prototype,"_visible",void 0),bt=t([lt("toggle-timer-popup")],bt);let yt=class extends at{constructor(){super(...arguments),this._remainingSeconds=0,this._unsubscribeEvents=[]}connectedCallback(){super.connectedCallback(),this._subscribeToEvents(),this._startUpdateLoop(),this._updateTimerState()}updated(t){(t.has("hass")||t.has("entity"))&&this.isConnected&&(this.hass&&this.entity?this._subscribeToEvents():this._unsubscribeFromEvents(),this._updateTimerState())}disconnectedCallback(){super.disconnectedCallback(),this._stopUpdateLoop(),this._unsubscribeFromEvents()}async _subscribeToEvents(){if(this.hass&&this.entity){this._unsubscribeFromEvents();try{const t=await this.hass.connection.subscribeEvents(t=>{const e=t.data?.entity_id;e===this.entity&&this._updateTimerState()},"toggle_timer_started");this._unsubscribeEvents.push(t);const e=await this.hass.connection.subscribeEvents(t=>{const e=t.data?.entity_id;e===this.entity&&(this._timerState=void 0,this._remainingSeconds=0)},"toggle_timer_finished");this._unsubscribeEvents.push(e);const i=await this.hass.connection.subscribeEvents(t=>{const e=t.data?.entity_id;e===this.entity&&(this._timerState=void 0,this._remainingSeconds=0)},"toggle_timer_cancelled");this._unsubscribeEvents.push(i)}catch(t){console.error("Failed to subscribe to events:",t)}}}_unsubscribeFromEvents(){for(const t of this._unsubscribeEvents)t();this._unsubscribeEvents=[]}_updateTimerState(){if(!this.entity)return;const t=this.hass?.states["input_text.toggle_timer_state"]||this.hass?.states["sensor.toggle_timer_state"];if(t)try{const e=JSON.parse(t.state)[this.entity];e?(this._timerState=e,this._updateRemainingTime()):(this._timerState=void 0,this._remainingSeconds=0)}catch(t){this._timerState=void 0,this._remainingSeconds=0}}_updateRemainingTime(){if(!this._timerState)return void(this._remainingSeconds=0);const t=new Date(this._timerState.ends_at),e=new Date,i=t.getTime()-e.getTime();this._remainingSeconds=Math.max(0,Math.floor(i/1e3))}_startUpdateLoop(){this._updateInterval=window.setInterval(()=>{this._timerState&&this._updateRemainingTime()},1e3)}_stopUpdateLoop(){this._updateInterval&&(clearInterval(this._updateInterval),this._updateInterval=void 0)}_formatTime(t){return`${Math.floor(t/60)}:${(t%60).toString().padStart(2,"0")}`}render(){return this._timerState&&0!==this._remainingSeconds?B`
      <div class="timer-badge">
        <ha-icon icon="mdi:timer-outline"></ha-icon>
        <span class="timer-text">${this._formatTime(this._remainingSeconds)}</span>
      </div>
    `:B``}static get styles(){return r`
      :host {
        position: absolute;
        top: 8px;
        right: 8px;
        z-index: 1;
        pointer-events: none;
      }

      .timer-badge {
        display: flex;
        align-items: center;
        gap: 4px;
        background-color: var(--primary-color, #0288d1);
        color: var(--text-primary-color, white);
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 500;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      }

      ha-icon {
        --mdc-icon-size: 14px;
      }

      .timer-text {
        line-height: 1;
      }
    `}};t([pt({attribute:!1})],yt.prototype,"hass",void 0),t([pt({type:String})],yt.prototype,"entity",void 0),t([ut()],yt.prototype,"_timerState",void 0),t([ut()],yt.prototype,"_remainingSeconds",void 0),yt=t([lt("toggle-timer-badge")],yt);const $t=new Set(["on","off","toggle"]),xt=new Set(["previous","on","off","none"]);console.info("%c TOGGLE-TIMER-ACTION %c Registering global timer action handler ","color: white; background: #0288d1; font-weight: bold;","color: #0288d1; background: white; font-weight: bold;");let wt=class extends at{constructor(){super(...arguments),this._registered=!1,this._handleTimerActionEvent=t=>{console.info("Toggle Timer: Received event",t.type,"with detail:",t.detail);const e=this._extractActionRequest(t);if(!e)return void console.warn("Toggle Timer: Failed to extract action request from event",t.type);const{config:i}=e;if(!i)return void console.warn('toggle-timer-action: missing "config" in event detail');const o=e.hass||this._resolveHass(t);o?(console.info("Toggle Timer: Opening popup for entity",i.entity),window.switchForTimeAction?.(o,i)):console.warn("toggle-timer-action: unable to resolve Home Assistant instance")}}connectedCallback(){super.connectedCallback(),this._registerGlobalHandler()}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("toggle-timer-action",this._handleTimerActionEvent,!0),window.removeEventListener("ll-custom",this._handleTimerActionEvent,!0),document.removeEventListener("toggle-timer-action",this._handleTimerActionEvent,!0),document.removeEventListener("ll-custom",this._handleTimerActionEvent,!0),this._registered=!1}_registerGlobalHandler(){this._registered||(this._registered=!0,window.switchForTimeAction=async(t,e)=>{this._hass=t,this._config=e,this.requestUpdate(),await this.updateComplete;const i=this.shadowRoot?.querySelector("toggle-timer-popup");i&&i.open()},window.addEventListener("toggle-timer-action",this._handleTimerActionEvent,!0),window.addEventListener("ll-custom",this._handleTimerActionEvent,!0),document.addEventListener("toggle-timer-action",this._handleTimerActionEvent,!0),document.addEventListener("ll-custom",this._handleTimerActionEvent,!0),console.info("Toggle Timer: Global timer action handler registered"))}_extractActionRequest(t){const e=t.detail;if("toggle-timer-action"===t.type)return this._normalizeActionRequest(this._isLovelaceCustomEventDetail(e)?void 0:e);if("ll-custom"!==t.type)return;if(!this._isLovelaceCustomEventDetail(e))return;const i="toggle-timer-action"===e?.fire_dom_event?.event?e.fire_dom_event.detail:"toggle-timer-action"===e?.event?e.detail:void 0;return i?this._normalizeActionRequest(i):void 0}_isLovelaceCustomEventDetail(t){return Boolean(t&&"object"==typeof t&&("fire_dom_event"in t||"event"in t&&"detail"in t))}_normalizeActionRequest(t){return t&&"object"==typeof t?"config"in t&&this._isValidTimerPopupConfig(t.config)?{config:t.config,hass:t.hass}:this._isValidTimerPopupConfig(t)?{config:t,hass:t.hass}:{}:{}}_isValidTimerPopupConfig(t){if(!t||"object"!=typeof t)return!1;const e=t;return"string"==typeof e.entity&&e.entity.length>0&&Array.isArray(e.durations)&&e.durations.length>0&&e.durations.length<=8&&e.durations.every(t=>"number"==typeof t&&Number.isInteger(t)&&t>0)&&(void 0===e.action||$t.has(e.action))&&(void 0===e.revert_to||xt.has(e.revert_to))}_resolveHass(t){const e="function"==typeof t.composedPath?t.composedPath():[];for(const t of e){const e=t,i=e.hass;if(i)return i;const o="function"==typeof e.getRootNode?e.getRootNode():void 0,n=o?.hass;if(n)return n}const i=document.querySelector("home-assistant");return i?.hass?i.hass:this._resolveHassFromKnownRoots()}_resolveHassFromKnownRoots(){const t=["home-assistant","hc-main","home-assistant-main","ha-panel-lovelace","hui-root"];for(const e of t){const t=document.querySelector(e),i=this._resolveHassFromElement(t);if(i)return i}}_resolveHassFromElement(t){if(!t)return;if(t.hass)return t.hass;const e=t.shadowRoot;if(!e)return;const i=["home-assistant-main","ha-drawer partial-panel-resolver","app-drawer-layout partial-panel-resolver","partial-panel-resolver","ha-panel-lovelace","hui-root","hc-main"];for(const t of i){const i=e.querySelector(t),o=this._resolveHassFromElement(i);if(o)return o}}render(){return this._hass&&this._config?B`
      <toggle-timer-popup
        .hass=${this._hass}
        .config=${this._config}
      ></toggle-timer-popup>
    `:B``}};function St(){if(document.querySelector("toggle-timer-action-handler"))console.info("Toggle Timer: Action handler already exists in DOM");else{console.info("Toggle Timer: Creating action handler element");const t=document.createElement("toggle-timer-action-handler");document.body.appendChild(t),console.info("Toggle Timer: Action handler element added to DOM")}}t([ut()],wt.prototype,"_hass",void 0),t([ut()],wt.prototype,"_config",void 0),wt=t([lt("toggle-timer-action-handler")],wt),document.body?customElements.whenDefined("toggle-timer-action-handler").then(St):"loading"===document.readyState?document.addEventListener("DOMContentLoaded",()=>{customElements.whenDefined("toggle-timer-action-handler").then(St)}):customElements.whenDefined("toggle-timer-action-handler").then(St),customElements.whenDefined("toggle-timer-action-handler").then(()=>{setTimeout(St,100)});const Et={en:gt,fr:ft};console.info("%c TOGGLE-TIMER-CARD %c 1.2.18 ","color: white; background: #0288d1; font-weight: bold;","color: #0288d1; background: white; font-weight: bold;");let At=class extends at{constructor(){super(...arguments),this._showPopup=!1,this._showCustomDuration=!1,this._customDuration=30,this._remainingSeconds=0,this._popupMode="select",this._confirmCancelPending=!1,this._unsubscribeEvents=[],this._selectionMode="start"}static async getConfigElement(){return document.createElement("toggle-timer-card-editor")}static getStubConfig(){return{type:"custom:toggle-timer-card",entity:"",action:"toggle",revert_to:"previous",durations:[10,20,30]}}setConfig(t){if(!t.entity)throw new Error(this._localize("editor.entity_required"));const e=t.entity.split(".")[0];if(!_t.includes(e))throw new Error(this._localize("editor.entity_invalid_domain"));if(!t.durations||0===t.durations.length)throw new Error(this._localize("editor.durations_required"));if(t.durations.length>8)throw new Error(this._localize("editor.durations_max"));if(t.durations.some(t=>"number"!=typeof t||!Number.isInteger(t)||t<=0))throw new Error(this._localize("editor.durations_positive"));if(new Set(t.durations).size!==t.durations.length)throw new Error(this._localize("editor.durations_unique"));if("media_player"===e&&"toggle"===t.action)throw new Error(this._localize("editor.action_invalid_media_player"));this._config={action:"toggle",revert_to:"previous",show_remaining:!0,allow_custom_duration:!1,confirm_cancel:!1,tap_behavior:"popup",long_press_action:"cancel",...t}}getCardSize(){return 1}connectedCallback(){super.connectedCallback(),this._config?.entity&&this._subscribeToEvents(),this._startUpdateLoop()}disconnectedCallback(){super.disconnectedCallback(),this._stopUpdateLoop(),this._unsubscribeFromEvents()}updated(t){super.updated(t),t.has("hass")&&this.hass&&this._updateTimerState(),t.has("_config")&&this.hass&&this.isConnected&&this._config?.entity&&(this._subscribeToEvents(),this._updateTimerState())}async _subscribeToEvents(){if(this.hass&&this._config?.entity){this._unsubscribeFromEvents();try{const t=await this.hass.connection.subscribeEvents(t=>{const e=t.data?.entity_id;e===this._config?.entity&&this._updateTimerState()},"toggle_timer_started");this._unsubscribeEvents.push(t);const e=await this.hass.connection.subscribeEvents(t=>{const e=t.data?.entity_id;e===this._config?.entity&&(this._timerState=void 0,this._remainingSeconds=0)},"toggle_timer_finished");this._unsubscribeEvents.push(e);const i=await this.hass.connection.subscribeEvents(t=>{const e=t.data?.entity_id;e===this._config?.entity&&(this._timerState=void 0,this._remainingSeconds=0)},"toggle_timer_cancelled");this._unsubscribeEvents.push(i)}catch(t){console.error("Failed to subscribe to events:",t)}}}_unsubscribeFromEvents(){for(const t of this._unsubscribeEvents)t();this._unsubscribeEvents=[]}_updateTimerState(){if(!this._config?.entity)return;const t=this.hass?.states["input_text.toggle_timer_state"]||this.hass?.states["sensor.toggle_timer_state"];if(t)try{const e=JSON.parse(t.state)[this._config.entity];e?(this._timerState=e,this._updateRemainingTime()):(this._timerState=void 0,this._remainingSeconds=0)}catch(t){this._timerState=void 0,this._remainingSeconds=0}}_updateRemainingTime(){if(!this._timerState)return void(this._remainingSeconds=0);const t=new Date(this._timerState.ends_at),e=new Date,i=t.getTime()-e.getTime();this._remainingSeconds=Math.max(0,Math.floor(i/1e3))}_startUpdateLoop(){this._updateInterval=window.setInterval(()=>{this._timerState&&this._updateRemainingTime()},1e3)}_stopUpdateLoop(){this._updateInterval&&(clearInterval(this._updateInterval),this._updateInterval=void 0)}_handleTap(){this._confirmCancelPending=!1,this._timerState?(this._popupMode="active",this._showPopup=!0):"immediate"===this._config.tap_behavior&&this._config.durations.length>0?(this._selectionMode="start",this._startTimer(this._config.durations[0])):(this._selectionMode="start",this._popupMode="select",this._showPopup=!0)}_handleLongPress(){"cancel"===this._config.long_press_action&&this._timerState?this._config.confirm_cancel?(this._confirmCancelPending=!0,this._popupMode="active",this._showPopup=!0):this._cancelTimer():this._timerState||this._fireEvent("hass-more-info",{entityId:this._config.entity})}async _startTimer(t,e=!1){try{const i={entity_id:this._config.entity,action:this._config.action,duration_minutes:t,revert_to:this._config.revert_to,cancel_existing:!e};e&&this._timerState&&(i.duration_minutes=t+Math.ceil(this._remainingSeconds/60)),this._hasIntegrationBackend()?await this.hass.callService("toggle_timer","start",i):await this.hass.callService("script","toggle_timer",i),this._handleClosePopup(),this._showToast(this._localize("card.timer_started").replace("{duration}",t.toString()))}catch(t){console.error("Failed to start timer:",t)}}async _cancelTimer(){try{this._hasIntegrationBackend()?await this.hass.callService("toggle_timer","cancel",{entity_id:this._config.entity}):await this.hass.callService("script","toggle_timer_cancel",{entity_id:this._config.entity}),this._handleClosePopup(),this._showToast(this._localize("card.timer_cancelled"))}catch(t){console.error("Failed to cancel timer:",t)}}_hasIntegrationBackend(){return Boolean(this.hass?.services?.toggle_timer?.start)}_handleClosePopup(){this._showPopup=!1,this._showCustomDuration=!1,this._popupMode="select",this._selectionMode="start",this._confirmCancelPending=!1}_showToast(t){this._fireEvent("hass-notification",{message:t})}_fireEvent(t,e){const i=new CustomEvent(t,{detail:e,bubbles:!0,composed:!0});this.dispatchEvent(i)}_localize(t){const e=(this.hass?.locale?.language||"en").replace(/_/g,"-").toLowerCase(),i=e.split("-")[0],o=Et[e]||Et[i]||Et.en,n=t.split(".");let s=o;for(const t of n)if(s=s?.[t],void 0===s)break;return s||t}_formatTime(t){return`${Math.floor(t/60)}:${(t%60).toString().padStart(2,"0")}`}_getEntityName(){if(this._config.name)return this._config.name;const t=this.hass?.states[this._config.entity];return t?.attributes?.friendly_name||this._config.entity}_getEntityIcon(){if(this._config.icon)return this._config.icon;const t=this.hass?.states[this._config.entity];return t?.attributes?.icon||"mdi:power"}_getEntityState(){const t=this.hass?.states[this._config.entity];return t?.state||"unknown"}_renderPopupTitle(){return(this._config.theme?.popup_title||this._localize("card.default_popup_title")).replace("{action}",this._config.action||"toggle").replace("{entity}",this._config.entity).replace("{name}",this._getEntityName())}_renderButtonLabel(t){return(this._config.theme?.button_format||this._localize("card.default_button_format")).replace("{minutes}",t.toString())}render(){return this._config&&this.hass?B`
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
                ${this._timerState&&this._config.show_remaining?B`${this._formatTime(this._remainingSeconds)}`:this._getEntityState()}
              </div>
            </div>
          </div>
        </div>
      </ha-card>

      ${this._showPopup?this._renderPopup():""}
    `:B``}_renderPopup(){return B`
      <div class="popup-overlay" @click=${this._handleClosePopup}>
        <div class="popup-content" @click=${t=>t.stopPropagation()}>
          <div class="popup-header">
            <h3>${this._renderPopupTitle()}</h3>
            <button class="close-button" @click=${this._handleClosePopup}>×</button>
          </div>

          ${"active"===this._popupMode?this._renderActivePopup():this._renderSelectPopup()}
        </div>
      </div>
    `}_renderSelectPopup(){return B`
      <div class="popup-body">
        <div class="duration-buttons">
          ${this._config.durations.map(t=>B`
              <button
                class="duration-button"
                @click=${()=>this._startTimer(t,"extend"===this._selectionMode)}
              >
                ${this._renderButtonLabel(t)}
              </button>
            `)}
        </div>

        ${this._config.allow_custom_duration?B`
              <div class="custom-duration">
                ${this._showCustomDuration?B`
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
                    `:B`
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
    `}_renderActivePopup(){return B`
      <div class="popup-body">
        ${this._confirmCancelPending?B`
              <div class="timer-info">
                <div class="timer-label">${this._localize("popup.confirm_cancel_title")}</div>
                <div class="timer-label">${this._localize("popup.confirm_cancel_message")}</div>
              </div>
            `:B`
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
    `}};t([pt({attribute:!1})],At.prototype,"hass",void 0),t([ut()],At.prototype,"_config",void 0),t([ut()],At.prototype,"_timerState",void 0),t([ut()],At.prototype,"_showPopup",void 0),t([ut()],At.prototype,"_showCustomDuration",void 0),t([ut()],At.prototype,"_customDuration",void 0),t([ut()],At.prototype,"_remainingSeconds",void 0),t([ut()],At.prototype,"_popupMode",void 0),t([ut()],At.prototype,"_confirmCancelPending",void 0),At=t([lt("toggle-timer-card")],At),window.customCards=window.customCards||[],window.customCards.push({type:"toggle-timer-card",name:"Toggle Timer",description:"Tap an entity, pick a duration, auto-revert."});export{At as ToggleTimerCard};
