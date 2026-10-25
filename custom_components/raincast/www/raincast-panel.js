var K=globalThis,G=K.ShadowRoot&&(K.ShadyCSS===void 0||K.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Q=Symbol(),$t=new WeakMap,Z=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==Q)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(G&&e===void 0){let s=t!==void 0&&t.length===1;s&&(e=$t.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&$t.set(t,e))}return e}toString(){return this.cssText}},xt=r=>new Z(typeof r=="string"?r:r+"",void 0,Q),f=(r,...e)=>{let t=r.length===1?r[0]:e.reduce((s,n,i)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+r[i+1],r[0]);return new Z(t,r,Q)},zt=(r,e)=>{if(G)r.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let s=document.createElement("style"),n=K.litNonce;n!==void 0&&s.setAttribute("nonce",n),s.textContent=t.cssText,r.appendChild(s)}},tt=G?r=>r:r=>r instanceof CSSStyleSheet?(e=>{let t="";for(let s of e.cssRules)t+=s.cssText;return xt(t)})(r):r;var{is:ae,defineProperty:le,getOwnPropertyDescriptor:ce,getOwnPropertyNames:de,getOwnPropertySymbols:he,getPrototypeOf:ue}=Object,q=globalThis,kt=q.trustedTypes,pe=kt?kt.emptyScript:"",me=q.reactiveElementPolyfillSupport,W=(r,e)=>r,et={toAttribute(r,e){switch(e){case Boolean:r=r?pe:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,e){let t=r;switch(e){case Boolean:t=r!==null;break;case Number:t=r===null?null:Number(r);break;case Object:case Array:try{t=JSON.parse(r)}catch{t=null}}return t}},Et=(r,e)=>!ae(r,e),At={attribute:!0,type:String,converter:et,reflect:!1,useDefault:!1,hasChanged:Et};Symbol.metadata??=Symbol("metadata"),q.litPropertyMetadata??=new WeakMap;var k=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=At){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let s=Symbol(),n=this.getPropertyDescriptor(e,s,t);n!==void 0&&le(this.prototype,e,n)}}static getPropertyDescriptor(e,t,s){let{get:n,set:i}=ce(this.prototype,e)??{get(){return this[t]},set(o){this[t]=o}};return{get:n,set(o){let d=n?.call(this);i?.call(this,o),this.requestUpdate(e,d,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??At}static _$Ei(){if(this.hasOwnProperty(W("elementProperties")))return;let e=ue(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(W("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(W("properties"))){let t=this.properties,s=[...de(t),...he(t)];for(let n of s)this.createProperty(n,t[n])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[s,n]of t)this.elementProperties.set(s,n)}this._$Eh=new Map;for(let[t,s]of this.elementProperties){let n=this._$Eu(t,s);n!==void 0&&this._$Eh.set(n,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let s=new Set(e.flat(1/0).reverse());for(let n of s)t.unshift(tt(n))}else e!==void 0&&t.push(tt(e));return t}static _$Eu(e,t){let s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return zt(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){let s=this.constructor.elementProperties.get(e),n=this.constructor._$Eu(e,s);if(n!==void 0&&s.reflect===!0){let i=(s.converter?.toAttribute!==void 0?s.converter:et).toAttribute(t,s.type);this._$Em=e,i==null?this.removeAttribute(n):this.setAttribute(n,i),this._$Em=null}}_$AK(e,t){let s=this.constructor,n=s._$Eh.get(e);if(n!==void 0&&this._$Em!==n){let i=s.getPropertyOptions(n),o=typeof i.converter=="function"?{fromAttribute:i.converter}:i.converter?.fromAttribute!==void 0?i.converter:et;this._$Em=n;let d=o.fromAttribute(t,i.type);this[n]=d??this._$Ej?.get(n)??d,this._$Em=null}}requestUpdate(e,t,s,n=!1,i){if(e!==void 0){let o=this.constructor;if(n===!1&&(i=this[e]),s??=o.getPropertyOptions(e),!((s.hasChanged??Et)(i,t)||s.useDefault&&s.reflect&&i===this._$Ej?.get(e)&&!this.hasAttribute(o._$Eu(e,s))))return;this.C(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:n,wrapped:i},o){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,o??t??this[e]),i!==!0||o!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),n===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[n,i]of this._$Ep)this[n]=i;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[n,i]of s){let{wrapped:o}=i,d=this[n];o!==!0||this._$AL.has(n)||d===void 0||this.C(n,void 0,i,d)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(t)):this._$EM()}catch(s){throw e=!1,this._$EM(),s}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};k.elementStyles=[],k.shadowRootOptions={mode:"open"},k[W("elementProperties")]=new Map,k[W("finalized")]=new Map,me?.({ReactiveElement:k}),(q.reactiveElementVersions??=[]).push("2.1.2");var lt=globalThis,St=r=>r,Y=lt.trustedTypes,Tt=Y?Y.createPolicy("lit-html",{createHTML:r=>r}):void 0,Nt="$lit$",A=`lit$${Math.random().toFixed(9).slice(2)}$`,Pt="?"+A,ge=`<${Pt}>`,T=document,U=()=>T.createComment(""),D=r=>r===null||typeof r!="object"&&typeof r!="function",ct=Array.isArray,fe=r=>ct(r)||typeof r?.[Symbol.iterator]=="function",st=`[ 	
\f\r]`,I=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Rt=/-->/g,Ct=/>/g,E=RegExp(`>|${st}(?:([^\\s"'>=/]+)(${st}*=${st}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Mt=/'/g,Ht=/"/g,Ot=/^(?:script|style|textarea|title)$/i,dt=r=>(e,...t)=>({_$litType$:r,strings:e,values:t}),a=dt(1),De=dt(2),Fe=dt(3),R=Symbol.for("lit-noChange"),h=Symbol.for("lit-nothing"),Lt=new WeakMap,S=T.createTreeWalker(T,129);function Zt(r,e){if(!ct(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return Tt!==void 0?Tt.createHTML(e):e}var ve=(r,e)=>{let t=r.length-1,s=[],n,i=e===2?"<svg>":e===3?"<math>":"",o=I;for(let d=0;d<t;d++){let c=r[d],l,p,u=-1,w=0;for(;w<c.length&&(o.lastIndex=w,p=o.exec(c),p!==null);)w=o.lastIndex,o===I?p[1]==="!--"?o=Rt:p[1]!==void 0?o=Ct:p[2]!==void 0?(Ot.test(p[2])&&(n=RegExp("</"+p[2],"g")),o=E):p[3]!==void 0&&(o=E):o===E?p[0]===">"?(o=n??I,u=-1):p[1]===void 0?u=-2:(u=o.lastIndex-p[2].length,l=p[1],o=p[3]===void 0?E:p[3]==='"'?Ht:Mt):o===Ht||o===Mt?o=E:o===Rt||o===Ct?o=I:(o=E,n=void 0);let y=o===E&&r[d+1].startsWith("/>")?" ":"";i+=o===I?c+ge:u>=0?(s.push(l),c.slice(0,u)+Nt+c.slice(u)+A+y):c+A+(u===-2?d:y)}return[Zt(r,i+(r[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]},F=class r{constructor({strings:e,_$litType$:t},s){let n;this.parts=[];let i=0,o=0,d=e.length-1,c=this.parts,[l,p]=ve(e,t);if(this.el=r.createElement(l,s),S.currentNode=this.el.content,t===2||t===3){let u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(n=S.nextNode())!==null&&c.length<d;){if(n.nodeType===1){if(n.hasAttributes())for(let u of n.getAttributeNames())if(u.endsWith(Nt)){let w=p[o++],y=n.getAttribute(u).split(A),b=/([.?@])?(.*)/.exec(w);c.push({type:1,index:i,name:b[2],strings:y,ctor:b[1]==="."?it:b[1]==="?"?rt:b[1]==="@"?ot:P}),n.removeAttribute(u)}else u.startsWith(A)&&(c.push({type:6,index:i}),n.removeAttribute(u));if(Ot.test(n.tagName)){let u=n.textContent.split(A),w=u.length-1;if(w>0){n.textContent=Y?Y.emptyScript:"";for(let y=0;y<w;y++)n.append(u[y],U()),S.nextNode(),c.push({type:2,index:++i});n.append(u[w],U())}}}else if(n.nodeType===8)if(n.data===Pt)c.push({type:2,index:i});else{let u=-1;for(;(u=n.data.indexOf(A,u+1))!==-1;)c.push({type:7,index:i}),u+=A.length-1}i++}}static createElement(e,t){let s=T.createElement("template");return s.innerHTML=e,s}};function N(r,e,t=r,s){if(e===R)return e;let n=s!==void 0?t._$Co?.[s]:t._$Cl,i=D(e)?void 0:e._$litDirective$;return n?.constructor!==i&&(n?._$AO?.(!1),i===void 0?n=void 0:(n=new i(r),n._$AT(r,t,s)),s!==void 0?(t._$Co??=[])[s]=n:t._$Cl=n),n!==void 0&&(e=N(r,n._$AS(r,e.values),n,s)),e}var nt=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:s}=this._$AD,n=(e?.creationScope??T).importNode(t,!0);S.currentNode=n;let i=S.nextNode(),o=0,d=0,c=s[0];for(;c!==void 0;){if(o===c.index){let l;c.type===2?l=new V(i,i.nextSibling,this,e):c.type===1?l=new c.ctor(i,c.name,c.strings,this,e):c.type===6&&(l=new at(i,this,e)),this._$AV.push(l),c=s[++d]}o!==c?.index&&(i=S.nextNode(),o++)}return S.currentNode=T,n}p(e){let t=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}},V=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,n){this.type=2,this._$AH=h,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=N(this,e,t),D(e)?e===h||e==null||e===""?(this._$AH!==h&&this._$AR(),this._$AH=h):e!==this._$AH&&e!==R&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):fe(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==h&&D(this._$AH)?this._$AA.nextSibling.data=e:this.T(T.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:s}=e,n=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=F.createElement(Zt(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===n)this._$AH.p(t);else{let i=new nt(n,this),o=i.u(this.options);i.p(t),this.T(o),this._$AH=i}}_$AC(e){let t=Lt.get(e.strings);return t===void 0&&Lt.set(e.strings,t=new F(e)),t}k(e){ct(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,s,n=0;for(let i of e)n===t.length?t.push(s=new r(this.O(U()),this.O(U()),this,this.options)):s=t[n],s._$AI(i),n++;n<t.length&&(this._$AR(s&&s._$AB.nextSibling,n),t.length=n)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let s=St(e).nextSibling;St(e).remove(),e=s}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},P=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,n,i){this.type=1,this._$AH=h,this._$AN=void 0,this.element=e,this.name=t,this._$AM=n,this.options=i,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=h}_$AI(e,t=this,s,n){let i=this.strings,o=!1;if(i===void 0)e=N(this,e,t,0),o=!D(e)||e!==this._$AH&&e!==R,o&&(this._$AH=e);else{let d=e,c,l;for(e=i[0],c=0;c<i.length-1;c++)l=N(this,d[s+c],t,c),l===R&&(l=this._$AH[c]),o||=!D(l)||l!==this._$AH[c],l===h?e=h:e!==h&&(e+=(l??"")+i[c+1]),this._$AH[c]=l}o&&!n&&this.j(e)}j(e){e===h?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},it=class extends P{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===h?void 0:e}},rt=class extends P{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==h)}},ot=class extends P{constructor(e,t,s,n,i){super(e,t,s,n,i),this.type=5}_$AI(e,t=this){if((e=N(this,e,t,0)??h)===R)return;let s=this._$AH,n=e===h&&s!==h||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,i=e!==h&&(s===h||n);n&&this.element.removeEventListener(this.name,this,s),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},at=class{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){N(this,e)}};var we=lt.litHtmlPolyfillSupport;we?.(F,V),(lt.litHtmlVersions??=[]).push("3.3.3");var Wt=(r,e,t)=>{let s=t?.renderBefore??e,n=s._$litPart$;if(n===void 0){let i=t?.renderBefore??null;s._$litPart$=n=new V(e.insertBefore(U(),i),i,void 0,t??{})}return n._$AI(r),n};var ht=globalThis,g=class extends k{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Wt(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return R}};g._$litElement$=!0,g.finalized=!0,ht.litElementHydrateSupport?.({LitElement:g});var ye=ht.litElementPolyfillSupport;ye?.({LitElement:g});(ht.litElementVersions??=[]).push("4.2.2");function It(r){return r.callWS({type:"raincast/entries"})}function Ut(r,e,t){return r.callWS({type:"raincast/set_options",entry_id:e,notify_service:t})}function Dt(r,e,t){return r.callWS({type:"raincast/update_sources",entry_id:e,...t})}function Ft(r,e,t){return r.callWS({type:"raincast/add_zone",entry_id:e,...t})}function J(r,e,t,s){return r.callWS({type:"raincast/update_zone",entry_id:e,zone_id:t,...s})}function Vt(r,e,t){return r.callWS({type:"raincast/remove_zone",entry_id:e,zone_id:t})}function jt(r,e){return r.callService("button","press",{entity_id:e})}function j(r){return r.valves.map((e,t)=>r.entities[`duration_${t}`])}function Bt(r){return r.valves.map((e,t)=>r.entities[`max_flow_${t}`])}function Kt(r,e,t=new Date){let s=t.getMonth()+1;return r<=e?s>=r&&s<=e:s>=r||s<=e}function ut(r,e){for(let t of r.log){let s=t.zones.find(n=>n.key===e);if(s)return s}}function Gt(r,e,t,s){return r.callWS({type:"raincast/run_zone",entry_id:e,zone_id:t,minutes:s})}var be={loading:"Loading\u2026",no_entry:"No RainCast controller is set up. Add one under Settings \u2192 Devices & services.","tab.home":"Home","tab.history":"History","tab.settings":"Settings","tab.guide":"Guide","home.control_on":"Valve control on","home.dry_run":"Dry run","home.watering":"Watering {zone}","home.valve_ends":"until about {time}","home.next_start":"Next start {day}, {time}","home.planned_now":"{minutes} min due if it started now","home.no_start":"No zone has a start","home.automatic_off":"Automatic off","home.automatic_off_title":"Automatic watering is off","home.out_of_season":"Out of season","home.outdoor":"Outdoor","section.watering":"Watering","section.mowing":"Mowing","section.general":"General","section.zones":"Zones","home.next_mowing_at":"Next mowing {day}, {time}","home.automatic_mowing_off":"Automatic mowing is off","home.mower_is":"Mower: {state}","mow.held":"Held","mowcheck.lawn":"Lawn not watered today","mowcheck.dry_lawn":"dry","mowcheck.rain_behind":"No rain for {hours} h","mowcheck.rain_ahead":"No rain within {hours} h","mowcheck.frost":"No frost","home.raining":"raining","home.dry":"dry","home.last_rain":"Last rain","home.next_rain":"Next rain","home.hours_ago":"{hours} h ago","home.in_hours":"in {hours} h","home.no_rain_ahead":"none in the forecast","home.mow_now":"Mow now","mow.mowing":"Mowing","mow.ready":"Ready","mow.frost":"Frost","mow.watering":"Watering","mow.watered":"Watered today","mow.raining":"Raining","mow.rained":"Rained recently","mow.rain_ahead":"Rain ahead","mow.unknown":"Unknown","mowmode.sunrise":"From sunrise","mowmode.sunset":"From sunset","mowmode.at_time":"At a fixed time","mowmode.off":"Off","home.frost_below":"frost below {limit} \xB0C","home.stop":"Stop","home.run_due":"Water due zones","home.control_needed":"Turn on Valve control in the settings first.","home.weather":"Weather","home.rain":"Rain forecast","home.not_configured":"not set","home.no_value":"no value","home.weather_hint":"Zones open to the sky are held while the rain forecast is above its limit, the line in the middle of the bar. Below the frost limit no zone is watered.","home.problems":"Problems","status.watering":"Watering","status.due":"Due","status.waiting":"Waiting","status.frost":"Frost","status.wet_soil":"Soil wet","status.rain_forecast":"Rain forecast","status.no_duration":"No valve time","status.unknown":"Unknown","zone.last_watered":"Last watered","zone.next_due":"Next due","zone.minutes":"{minutes} min","zone.interval":"Water every","zone.never":"never","zone.days_ago":"{days} days ago","zone.every_days":"every {days} days","zone.next_start":"Next start","zone.no_start":"off","zone.soil":"Soil","zone.mower_conflict":"Blocks mowing","zone.mower_conflict_hint":"Watering this zone today keeps the mower in; for zones on the mowed lawn.","zone.start":"Start","zone.start_time":"Start time","zone.sunrise_offset":"Hours before sunrise","zone.soil_max":"Soil limit","zone.soil_sensor":"Soil moisture of this zone","zone.soil_sensor_hint":"Optional, sensor or input number in %. A zone without one does not look at the soil.","zone.water":"Water","zone.last_run_liters":"{liters} l last run","zone.total_liters":"{liters} l in total","zone.flow":"{flow} l/min","zone.time":"Time","zone.max_flow":"Flow limit","zone.max_flow_hint":"A valve whose mean flow goes above its limit is closed and reported, for a broken pipe or sprinkler. 0 turns the check off.","zone.settings":"Settings","zone.manual":"Manual","zone.manual_hint":"Each valve runs for the minutes given, 0 leaves it out. The zone counts as watered only at its own full time.","zone.run_start":"Start","zone.cancel":"Cancel","zone.name":"Name","zone.valves":"Valves, in the order they run","zone.roofed":"Under a roof","zone.roofed_hint":"The rain forecast does not hold a greenhouse or a covered bed; its soil sensor and frost still do.","zone.new_hint":"A new zone starts with a 3-day interval and 15 minutes per valve; both are changed here afterwards.","zone.edit_hint":"Saving reloads RainCast. A valve added here starts with the zone's starting time.","zone.remove_confirm":"Remove {name}? Its entities are removed; recorded history stays.","problem.valve_unavailable":"A valve has been unavailable for 30 minutes.","problem.valve_not_opened":"A valve did not open in its latest run.","problem.valve_not_closed":"A valve still reports open after the stop command.","problem.no_flow":"A valve was open without water through the meter.","problem.flow_high":"A valve was closed for flow above its limit.","problem.weather_lost":"A weather input has had no value for an hour.","history.runs":"Runs","history.no_runs":"No run yet.","history.when":"When","history.kind":"Run","history.zones":"Zones, watered of planned","history.show_all":"Show all {count} runs","history.show_less":"Show the latest only","history.watered":"{watered} of {planned} min","history.not_opened":"did not open: {valves}","history.interrupted":"Stopped before the end.","history.no_flow":"no water","history.flow_high":"closed, flow too high","history.water":"Water per zone, 30 days","history.weather":"Soil and rain, 7 days","history.valves":"Valves, 7 days","reason.scheduled":"Daily start","reason.manual":"Manual","reason.zone":"Single zone","reason.restart":"Cut off by a restart","mode.before_sunrise":"Before sunrise","mode.at_time":"At a fixed time","mode.off":"Off","src.rain_sensor":"Rain forecast","src.water_meter":"Water meter","src.weather":"Weather","src.outdoor_sensor":"Outdoor temperature","src.weather_entity":"Weather forecast","src.mower_group":"Mower","src.mower":"Lawn mower","src.zone_soil":"soil sensor of the zone","src.water":"Water","src.zones":"Zones","src.native":"run time sent with the start","src.open_close":"opened and closed by RainCast","action.edit":"Edit","action.save":"Save","action.remove":"Remove","action.add_zone":"Add zone","action.add_valve":"Add valve","settings.control":"Valve control","settings.control_hint":"Off: the plan is sent as a dry run and no valve is opened.","settings.control_confirm":"RainCast will open the valves at the daily start. Turn off every other schedule watering the same valves first.","settings.confirm":"Turn on","settings.cancel":"Cancel","settings.automatic":"Automatic watering","settings.automatic_hint":"Off: no zone starts by itself and no plan is sent; manual runs still work.","settings.season_start":"Season starts","settings.season_end":"Season ends","settings.season_hint":"Outside the season no zone starts by itself, for example over the winter. Manual runs still work.","settings.watering":"Watering","settings.watering_rules":"When watering waits","settings.mowing":"Mowing","settings.mowing_rules":"When the mower waits","settings.lawn_zones":"Zones on the lawn","settings.lawn_zones_hint":"Watering one of these zones today keeps the mower in. Leave zones off the mowed lawn, such as a greenhouse, switched off.","settings.open_zone":"open to the sky","settings.mower_season_hint":"Outside the season the mower does not start by itself; Mow now still works.","settings.automatic_mowing":"Automatic mowing","settings.automatic_mowing_hint":"Off: the mower does not start by itself; Mow now still works.","settings.mower_start":"Start","settings.mower_offset":"Hours after (\u2212before) the event","settings.dry_hours":"Dry hours after rain","settings.rain_ahead_hours":"Rain ahead hours","settings.mower_hint":"The mower also stays in when a zone that blocks mowing was watered today, and below the frost limit of watering.","settings.rain_max":"Rain limit","settings.frost_min":"Frost limit","settings.limits_hint":"Zones open to the sky are held while more rain is forecast than the rain limit. Below the frost limit no zone starts, roofed or not. Each zone has its own start and soil limit, under Zones.","settings.sources":"Connected entities","settings.sources_hint":"Edit changes the weather inputs and the water meter; valves and soil sensors are changed with the pencil of their zone.","settings.reload_hint":"Saving reloads RainCast; dates, intervals and valve times are kept.","settings.zones":"Zones","settings.notifications":"Problems and notifications","settings.no_problems":"No problems right now.","settings.notify_service":"Notify service","settings.notify_none":"No notifications","settings.notify_hint":"Receives the day's plan, the end of every run and problems.","settings.entities":"Entities and devices","settings.admin_only":"Only administrators can change settings."},C="en";function qt(){return(r,e)=>{let t=be[r]??r;for(let[s,n]of Object.entries(e??{}))t=t.replace(`{${s}}`,String(n));return t}}function m(r,e=1){return r==null||!Number.isFinite(r)?"\u2013":r.toLocaleString(C,{minimumFractionDigits:e,maximumFractionDigits:e})}function M(r){return r.toLocaleTimeString(C,{hour:"2-digit",minute:"2-digit",hourCycle:"h23"})}function O(r){let e=new Date;e.setHours(0,0,0,0);let t=new Date(r);t.setHours(0,0,0,0);let s=Math.round((t.getTime()-e.getTime())/864e5);return s===0?"today":s===1?"tomorrow":s===-1?"yesterday":r.toLocaleDateString(C,{weekday:"short",day:"numeric",month:"short"})}var _=f`
  :host {
    --rc-water: var(--state-valve-open-color, #039be5);
    --rc-warn: var(--warning-color, #ffa600);
    --rc-error: var(--error-color, #db4437);
    --rc-ok: var(--success-color, #43a047);
    --rc-muted: var(--secondary-text-color);
    --rc-radius: var(--ha-card-border-radius, 12px);
    --rc-gap: 16px;
  }

  .card {
    background: var(--ha-card-background, var(--card-background-color, #fff));
    border-radius: var(--rc-radius);
    border: var(--ha-card-border-width, 1px) solid var(--ha-card-border-color, var(--divider-color, #e0e0e0));
    box-shadow: var(--ha-card-box-shadow, none);
    padding: 16px;
    box-sizing: border-box;
    min-width: 0;
  }

  .card h2 {
    margin: 0 0 12px;
    font-size: 1rem;
    font-weight: 500;
    color: var(--primary-text-color);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .muted {
    color: var(--rc-muted);
  }

  .small {
    font-size: 0.85rem;
  }

  .chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 0.8rem;
    background: var(--secondary-background-color, rgba(127, 127, 127, 0.12));
    color: var(--primary-text-color);
    white-space: nowrap;
  }

  .chip.water {
    background: color-mix(in srgb, var(--rc-water) 18%, transparent);
    color: var(--rc-water);
  }

  .chip.ok {
    background: color-mix(in srgb, var(--rc-ok) 18%, transparent);
    color: var(--rc-ok);
  }

  .chip.warn {
    background: color-mix(in srgb, var(--rc-warn) 18%, transparent);
    color: var(--rc-warn);
  }

  button.round {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid var(--divider-color, #e0e0e0);
    background: transparent;
    color: var(--primary-text-color);
    font-size: 1.4rem;
    line-height: 1;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  button.round:hover {
    background: var(--secondary-background-color);
  }

  button.round:disabled {
    opacity: 0.4;
    cursor: default;
  }

  ha-icon {
    --mdc-icon-size: 20px;
  }
`;var _e=["Zone start","Interval","Frost, soil, rain","Plan","Valves one by one","Measured time"],$e=r=>a`<div class="pipeline">${r.map(e=>a`<span class="chip">${e}</span>`)}</div>`,xe=[{icon:"mdi:information-outline",title:"How RainCast works",body:a`
      <p>
        Each zone starts once a day at its own time, a number of hours before sunrise or at a fixed time. RainCast then
        decides whether the zone needs water and waters it one valve after another. Only one valve runs at a time, so the
        water pressure stays the same for every zone: zones starting together run as one, and a start during a run waits
        for it to end.
      </p>
      ${$e(_e)}
      <ol>
        <li><b>Interval.</b> A zone is due when its interval has passed since it was last watered, or when it was never watered.</li>
        <li><b>Frost.</b> Below the frost limit no zone is watered, roofed or not.</li>
        <li>
          <b>Soil.</b> A due zone with a soil sensor is held while its soil is wetter than its soil limit. A zone without
          one does not look at the soil.
        </li>
        <li><b>Rain.</b> A due zone open to the sky is held while more rain is forecast than the rain limit.</li>
        <li><b>Plan.</b> The due zones are sent as a notification at the start, the skipped ones with the reason.</li>
        <li>
          <b>Watering.</b> Each valve runs for its own time. Only the time the valve reports open counts; a zone counts as
          watered at 90 % of its planned time, and only then its date moves on.
        </li>
      </ol>
    `},{icon:"mdi:rocket-launch-outline",title:"First start and taking over",body:a`
      <p>
        After installation <b>Valve control</b> is off: RainCast sends the day's plan as a <i>dry run</i> but opens no valve.
        Compare it for a few days with your current setup.
      </p>
      <p>Taking over:</p>
      <ol>
        <li>
          <b>Turn off every other schedule watering the same valves</b>, including the controller's own programs. Two writers
          on one valve end in runs nobody planned.
        </li>
        <li>Turn on <b>Valve control</b> in the settings and watch the first run on the <b>Home</b> tab.</li>
      </ol>
      <p>Turning control off ends a run in progress and closes its valve.</p>
    `},{icon:"mdi:calendar-range",title:"Season, frost and the main switch",body:a`
      <ul>
        <li>
          <b>Automatic watering</b> is the main switch of the daily starts. Off, no zone starts by itself and no plan is sent;
          manual runs still work.
        </li>
        <li>
          <b>Season.</b> Automatic starts happen only from the first to the last month of the season, so the system rests
          over the winter by itself. A season may run over the new year.
        </li>
        <li>
          <b>Frost.</b> With an outdoor temperature sensor set, no zone is watered by a start or by <i>Water due zones</i>
          while it is below the frost limit, so water does not freeze in pipes and heads. A manual run of one zone is still
          possible.
        </li>
      </ul>
    `},{icon:"mdi:robot-mower-outline",title:"Mower",body:a`
      <p>
        With a lawn mower set, RainCast sends it out at its own start: at a fixed time, or a number of hours after (or
        before) sunrise or sunset, in its own season. October usually still needs mowing when watering no longer does.
      </p>
      <p>The mower stays in, with a notification saying why, when:</p>
      <ul>
        <li>a zone marked <i>Blocks mowing</i> was watered today or is being watered: wet grass sticks to the blades;</li>
        <li>it rains, it rained within the <i>dry hours after rain</i>, or rain is due within the <i>rain ahead hours</i>;</li>
        <li>it freezes.</li>
      </ul>
      <p>
        A zone that is not on the mowed lawn, such as a greenhouse, leaves <i>Blocks mowing</i> off and never keeps the
        mower in. <b>Mow now</b> sends the mower out regardless. A mower not back in its dock within 4 hours is reported
        as a problem.
      </p>
      <p>
        Rain comes from the weather entity: rain now from its condition, the last rain remembered by RainCast, the next
        rain from its hourly forecast. Automatic mowing starts off; turn it on once no other schedule starts the mower.
      </p>
    `},{icon:"mdi:weather-partly-rainy",title:"Weather inputs",body:a`
      <p>All inputs are optional and can be any sensor:</p>
      <ul>
        <li>
          <b>Soil moisture</b> in %, per zone: a sensor or an input number, measured or a model value such as Open-Meteo's
          soil moisture at 3–9 cm. A greenhouse can have its own sensor and limit, the lawn another. A zone without one
          does not look at the soil.
        </li>
        <li><b>Rain forecast</b> in mm for the coming day, for zones open to the sky.</li>
        <li><b>Outdoor temperature</b> for the frost hold.</li>
        <li><b>Weather forecast</b>, a weather entity with an hourly forecast, for rain now, behind and ahead, used by the mower.</li>
      </ul>
      <p>
        Without an input, zones are watered by their intervals alone. When a configured input has no value, RainCast waters
        as if it was not there and reports a problem after an hour, so a dead weather service never stops the garden from
        being watered.
      </p>
    `},{icon:"mdi:water-pump",title:"Water meter",body:a`
      <p>
        With a water meter set (any total water sensor in m³ or L), every valve run is metered and checked while the valve
        is open:
      </p>
      <ul>
        <li>
          <b>Litres and flow.</b> Each valve's litres and mean flow appear in the history, and each zone gets a <i>Water used</i>
          sensor for the water section of the energy dashboard.
        </li>
        <li>
          <b>No water.</b> A valve that reports open while the meter does not move for 2 minutes is reported; its time does
          not count as watering. Usually a closed main valve or no pressure.
        </li>
        <li>
          <b>Flow limit.</b> Each valve can get a limit in l/min. Above it, judged on the mean flow after 3 minutes, the valve
          is closed and reported: a broken pipe or sprinkler. 0 turns the check off. Set it some way above the flow the
          history shows for that valve.
        </li>
      </ul>
      <p>
        A meter shared with the house also counts water used there during a run, which is why early morning suits watering.
        A meter without a reading for 10 minutes is not trusted for the checks. Meter telegrams arrive with a delay, so a
        litre or two can move from one valve to the next.
      </p>
    `},{icon:"mdi:valve",title:"Valves and controllers",body:a`
      <p>
        A valve can be a <code>valve</code>, <code>switch</code> or <code>input_boolean</code> entity. RainCast opens it,
        watches its state every few seconds and closes it at the end.
      </p>
      <ul>
        <li>
          Controllers that end a manual run after their own preset time, such as Orbit B-hyve, are started again with the
          time left, at most ten times.
        </li>
        <li>B-hyve valves get the run time with the start command, so they close by themselves even if Home Assistant stops.</li>
        <li>
          A valve that does not report open within a minute is skipped, the zone is not counted as watered and a problem is
          reported.
        </li>
        <li>
          If Home Assistant restarts during a run, the valves of that run are closed at the next start and the run is not
          resumed.
        </li>
      </ul>
      <p>A valve time of 0 leaves the valve out of the zone without removing it.</p>
    `},{icon:"mdi:hand-back-right-outline",title:"Manual watering",body:a`
      <ul>
        <li><b>Water due zones</b> runs the plan right now, as the daily start would.</li>
        <li>
          <b>Manual</b> on a zone card waters that zone now, regardless of its interval and the weather. Each valve runs for
          the minutes you enter, its own time by default; 0 leaves a valve out.
        </li>
        <li><b>Stop</b> ends the run and closes every valve of the controller.</li>
      </ul>
      <p>
        A manual run moves the zone's last watering date only when its valves ran for at least 90 % of the zone's own time,
        so a short test does not postpone the next watering. Manual runs need Valve control; Stop always works.
      </p>
      <p>The interval and the time of each valve are changed in the settings, under Zones.</p>
    `},{icon:"mdi:alert-circle-outline",title:"Problems and notifications",body:a`
      <p>Problems appear on the Repairs page and, with a notify service set, on your phone:</p>
      <table>
        <tr><th>Problem</th><th>When</th></tr>
        <tr><td>Valve unavailable</td><td>a valve has had no state for 30 minutes</td></tr>
        <tr><td>Valve did not open</td><td>at once, cleared when the valve opens in a later run</td></tr>
        <tr><td>Valve still open</td><td>a valve reports open a minute after the stop command</td></tr>
        <tr><td>No water through the valve</td><td>at once, the meter did not move for 2 minutes of open time</td></tr>
        <tr><td>Flow too high</td><td>at once, the valve is closed; its limit is set per valve</td></tr>
        <tr><td>Weather data lost</td><td>a configured weather input has had no value for an hour</td></tr>
      </table>
      <p>The notify service also receives the day's plan and the end of every run.</p>
    `}],pt=class extends g{render(){return a`
      <div class="guide">
        ${xe.map((e,t)=>a`
            <details class="card" ?open=${t===0}>
              <summary><ha-icon icon=${e.icon}></ha-icon><span>${e.title}</span></summary>
              <div class="body">${e.body}</div>
            </details>
          `)}
      </div>
    `}static{this.styles=[_,f`
      .guide {
        max-width: 860px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      details.card {
        padding: 0;
      }
      summary {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px;
        cursor: pointer;
        font-weight: 500;
        list-style: none;
      }
      summary::-webkit-details-marker {
        display: none;
      }
      summary::after {
        content: "";
        margin-left: auto;
        width: 8px;
        height: 8px;
        border-right: 2px solid var(--rc-muted);
        border-bottom: 2px solid var(--rc-muted);
        transform: rotate(45deg);
        transition: transform 0.2s;
      }
      details[open] summary::after {
        transform: rotate(-135deg);
      }
      summary ha-icon {
        color: var(--primary-color);
      }
      .body {
        padding: 0 16px 16px 48px;
        line-height: 1.55;
      }
      .body p,
      .body ul,
      .body ol {
        margin: 0 0 10px;
      }
      .body li {
        margin-bottom: 6px;
      }
      .pipeline {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin: 8px 0 12px;
      }
      .pipeline .chip:not(:last-child)::after {
        content: "→";
        margin-left: 6px;
        color: var(--rc-muted);
      }
      table {
        border-collapse: collapse;
        width: 100%;
        margin: 4px 0 12px;
        font-size: 0.9rem;
      }
      th,
      td {
        text-align: left;
        padding: 6px 8px;
        border-bottom: 1px solid var(--divider-color);
      }
      th {
        color: var(--rc-muted);
        font-weight: 500;
      }
      @media (max-width: 600px) {
        .body {
          padding-left: 16px;
        }
      }
    `]}};customElements.get("raincast-guide")??customElements.define("raincast-guide",pt);var Yt;async function Jt(r){if(window.loadCardHelpers)return Yt??=window.loadCardHelpers(),(await Yt).createCardElement(r)}function v(r,e){if(!e)return;let t=Number.parseFloat(r.states[e]?.state??"");return Number.isFinite(t)?t:void 0}function $(r,e){return!!e&&r.states[e]?.state==="on"}function z(r,e,t){r.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0}))}var Xt=168,Qt=15,ze=30,mt=class extends g{constructor(){super(...arguments);this.showAll=!1;this.cards=[]}static{this.properties={hass:{attribute:!1},entry:{attribute:!1},localize:{attribute:!1},showAll:{state:!0}}}updated(){this.cardsFor!==this.entry&&(this.cardsFor=this.entry,this.buildCards());for(let t of this.cards)t.hass=this.hass}async buildCards(){let t=this.localize,s=[...this.entry.zones.map(l=>l.soil_sensor),this.entry.sources.rain_sensor].filter(l=>!!l),n=this.entry.zones.flatMap(l=>l.valves),i=this.entry.zones.map(l=>l.entities.water_used?{entity:l.entities.water_used,name:l.name}:null).filter(l=>l!==null),o=[i.length?{type:"statistics-graph",title:t("history.water"),entities:i,stat_types:["change"],chart_type:"bar",period:"day",days_to_show:ze}:null,s.length?{type:"history-graph",title:t("history.weather"),hours_to_show:Xt,entities:s}:null,n.length?{type:"history-graph",title:t("history.valves"),hours_to_show:Xt,entities:n}:null].filter(l=>l!==null),d=await Promise.all(o.map(l=>Jt(l)));this.cards=d.filter(l=>!!l);let c=this.renderRoot.querySelector(".graphs");if(c){c.replaceChildren(...this.cards);for(let l of this.cards)l.hass=this.hass}}render(){let t=this.localize,s=this.showAll?this.entry.log:this.entry.log.slice(0,Qt);return a`
      <div class="graphs"></div>
      <section class="card runs">
        <h2><ha-icon icon="mdi:history"></ha-icon>${t("history.runs")}</h2>
        ${this.entry.log.length?a`
              <table>
                <thead>
                  <tr>
                    <th></th>
                    <th>${t("history.when")}</th>
                    <th>${t("history.kind")}</th>
                    <th>${t("history.zones")}</th>
                  </tr>
                </thead>
                <tbody>
                  ${s.map(n=>this.renderRun(n))}
                </tbody>
              </table>
              ${this.entry.log.length>Qt?a`<div class="actions">
                    <button class="text" @click=${()=>this.showAll=!this.showAll}>
                      ${t(this.showAll?"history.show_less":"history.show_all",{count:this.entry.log.length})}
                    </button>
                  </div>`:h}
            `:a`<p class="muted">${t("history.no_runs")}</p>`}
      </section>
    `}renderRun(t){let s=this.localize,n=t.started?new Date(t.started):void 0,i=t.ended?new Date(t.ended):void 0,o=!t.interrupted&&t.zones.every(c=>c.watered),d=n?`${O(n)} ${M(n)}${i?`\u2013${M(i)}`:""}`:"\u2013";return a`
      <tr>
        <td>
          <ha-icon class=${o?"ok":"warn"} icon=${o?"mdi:check-circle":"mdi:alert-circle-outline"}></ha-icon>
        </td>
        <td class="nowrap">${d}</td>
        <td class="nowrap">${s(`reason.${t.reason}`)}</td>
        <td>
          ${t.zones.map(c=>this.renderZone(c))}
          ${t.interrupted?a`<div class="warn-text small">${s("history.interrupted")}</div>`:h}
        </td>
      </tr>
    `}renderZone(t){let s=this.localize,n=a`
      <span class="zone-name">${t.name}</span>
      <span class=${t.watered?"":"warn-text"}>
        ${s("history.watered",{watered:m(t.watered_min,0),planned:m(t.planned_min,0)})}
        ${t.liters!==null&&t.liters!==void 0?a` · ${m(t.liters,0)} l`:h}
      </span>
    `,i=t.valves??[];return!i.length&&!t.not_opened.length?a`<div class="zone">${n}</div>`:a`
      <details class="zone">
        <summary>${n}</summary>
        ${i.map(o=>this.renderValve(o))}
        ${t.not_opened.length?a`<div class="warn-text small">
              ${s("history.not_opened",{valves:t.not_opened.map(o=>this.friendly(o)).join(", ")})}
            </div>`:h}
      </details>
    `}friendly(t){return String(this.hass.states[t]?.attributes.friendly_name??t)}renderValve(t){let s=this.localize,n=[s("zone.minutes",{minutes:m(t.minutes,1)})];return t.liters!==null&&n.push(`${m(t.liters,0)} l`),t.flow!==null&&n.push(s("zone.flow",{flow:m(t.flow,1)})),a`
      <div class="valve muted small">
        <span>${this.friendly(t.entity_id)}</span>
        <span>
          ${t.no_flow?a`<b class="warn-text">${s("history.no_flow")}</b> · `:h}
          ${t.flow_high?a`<b class="warn-text">${s("history.flow_high")}</b> · `:h} ${n.join(" \xB7 ")}
        </span>
      </div>
    `}static{this.styles=[_,f`
      /* Graphs two by two, the water per zone over the full width; the run log below them. */
      .graphs {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: var(--rc-gap);
        margin-bottom: var(--rc-gap);
      }
      .graphs > :first-child:nth-last-child(odd) {
        grid-column: 1 / -1;
      }
      @media (max-width: 900px) {
        .graphs {
          grid-template-columns: minmax(0, 1fr);
        }
      }
      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.9rem;
      }
      th {
        text-align: left;
        font-weight: 500;
        color: var(--rc-muted);
        padding: 4px 8px;
        border-bottom: 1px solid var(--divider-color);
      }
      td {
        padding: 6px 8px;
        border-bottom: 1px solid var(--divider-color);
        vertical-align: top;
      }
      tr:last-child td {
        border-bottom: none;
      }
      td:first-child,
      th:first-child {
        width: 24px;
        padding-right: 0;
      }
      .nowrap {
        white-space: nowrap;
      }
      .zone {
        margin-bottom: 2px;
      }
      .zone summary,
      div.zone {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        cursor: pointer;
      }
      div.zone {
        cursor: default;
      }
      .zone-name {
        font-weight: 500;
      }
      .valve {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        padding: 2px 0 2px 16px;
      }
      ha-icon {
        --mdc-icon-size: 18px;
      }
      ha-icon.ok {
        color: var(--rc-ok);
      }
      ha-icon.warn {
        color: var(--rc-warn);
      }
      .warn-text {
        color: var(--rc-warn);
      }
    `]}};customElements.get("raincast-history")??customElements.define("raincast-history",mt);function x(r,e,t){let s=e?r.states[e]:void 0;if(!s)return a``;let n=Number.parseFloat(s.state),i=Number(s.attributes.step??1),o=Number(s.attributes.min??-1/0),d=Number(s.attributes.max??1/0),c=i<.01?3:i<.1?2:i<1?1:0,l=s.attributes.unit_of_measurement??"",p=u=>{if(!Number.isFinite(u))return;let w=Math.round(Math.max(Math.min(u,d),o)/i)*i;r.callService("number","set_value",{entity_id:e,value:Number(w.toFixed(4))})};return a`
    <div class="number">
      <span class="label">${t}</span>
      <span class="stepper">
        <button class="round mini" ?disabled=${n<=o} @click=${()=>p(n-i)}>−</button>
        <input
          type="number"
          .value=${Number.isFinite(n)?n.toFixed(c):""}
          step=${i}
          min=${o}
          max=${d}
          @change=${u=>p(Number.parseFloat(u.target.value))}
        />
        <button class="round mini" ?disabled=${n>=d} @click=${()=>p(n+i)}>+</button>
        <span class="unit">${l}</span>
      </span>
    </div>
  `}var H=f`
  .number,
  .toggle-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    padding: 6px 0;
  }
  .label {
    flex: 1;
    min-width: 0;
  }
  .stepper {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .stepper input,
  input.text {
    padding: 4px 6px;
    border: 1px solid var(--divider-color);
    border-radius: 6px;
    background: transparent;
    color: var(--primary-text-color);
    font: inherit;
  }
  .stepper input {
    width: 64px;
    text-align: right;
    -moz-appearance: textfield;
  }
  .stepper input::-webkit-outer-spin-button,
  .stepper input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  .unit {
    width: 56px;
    font-size: 0.8rem;
    color: var(--rc-muted);
  }
  .round.mini {
    width: 28px;
    height: 28px;
    font-size: 1rem;
  }
  button.text {
    border: none;
    background: transparent;
    color: var(--primary-text-color);
    padding: 6px 10px;
    border-radius: 6px;
    cursor: pointer;
    font: inherit;
  }
  button.text:hover:not(:disabled) {
    background: var(--secondary-background-color);
  }
  button.text:disabled {
    opacity: 0.4;
    cursor: default;
  }
  button.text.primary {
    color: var(--primary-color);
    font-weight: 500;
  }
  button.text.danger {
    color: var(--error-color, #db4437);
  }
  .actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 4px;
    margin-top: 8px;
  }
  .error {
    color: var(--error-color, #db4437);
    font-size: 0.85rem;
    margin-top: 6px;
  }
  .field {
    display: grid;
    gap: 4px;
    margin-bottom: 10px;
  }
  .field label {
    font-size: 0.85rem;
    color: var(--rc-muted);
  }
`;var ke={watering:"water",due:"ok",waiting:"",frost:"warn",wet_soil:"warn",rain_forecast:"warn",no_duration:"warn"},Ae=["open","opening","on"];function te(r){return String(r?.message??r)}var gt=class extends g{static{this.properties={hass:{attribute:!1},entry:{attribute:!1},localize:{attribute:!1},error:{state:!0},manual:{state:!0}}}openManual(e){let t=j(e),s=Object.fromEntries(e.valves.map((n,i)=>[n,v(this.hass,t[i])??0]));this.manual={zoneId:e.id,minutes:s},this.error=void 0}async startManual(e){if(this.manual){this.error=void 0;try{await Gt(this.hass,this.entry.entry_id,e.id,this.manual.minutes),this.manual=void 0}catch(t){this.error=te(t)}}}async press(e){this.error=void 0;try{await jt(this.hass,e)}catch(t){this.error=te(t)}}name(e){return String(this.hass.states[e]?.attributes.friendly_name??e)}render(){let e=this.localize,t=!!this.entry.sources.mower&&!!this.entry.entities.mowing;return a`
      ${this.renderProblems()}
      <div class="status-row">${this.renderWatering()} ${t?this.renderMowing():h} ${this.renderWeather()}</div>
      <h1 class="section"><ha-icon icon="mdi:sprinkler"></ha-icon>${e("section.zones")}</h1>
      <div class="zones">${this.entry.zones.map(s=>this.renderZone(s))}</div>
    `}modeChip(e,t,s,n){let i=this.localize;if(!$(this.hass,e))return a`<span class="chip warn">${i("home.automatic_off")}</span>`;let o=v(this.hass,t),d=v(this.hass,s);return o!==void 0&&d!==void 0&&!Kt(o,d)?a`<span class="chip warn">${i("home.out_of_season")}</span>`:n}nextText(e,t,s,n){let i=this.localize,o=e?this.hass.states[e]?.state:void 0,d=o&&!["unknown","unavailable"].includes(o)?new Date(o):void 0;return d?i(t,{day:O(d),time:M(d)}):i($(this.hass,n)?"home.no_start":s)}renderWatering(){let e=this.localize,t=this.entry.entities,s=$(this.hass,t.control),n=this.hass.states[t.running],i=n?.state==="on",o=n?.attributes??{},d=i?a`<span class="chip water">${e("status.watering")}</span>`:this.modeChip(t.automatic,t.season_start,t.season_end,a`<span class="chip ${s?"ok":"warn"}">${e(s?"home.control_on":"home.dry_run")}</span>`),c=o.valve?this.name(o.valve):"",l=o.valve_ends?M(new Date(o.valve_ends)):"";return a`
      <section class="card status ${i?"active":""}">
        <h2>
          <ha-icon icon="mdi:sprinkler-variant"></ha-icon>
          <span class="grow">${e("section.watering")}</span>
          ${d}
        </h2>
        <div class="big">
          ${i?e("home.watering",{zone:o.zone??""}):this.nextText(t.next_start,"home.next_start","home.automatic_off_title",t.automatic)}
        </div>
        <div class="muted small">
          ${i?a`${c}${l?` \xB7 ${e("home.valve_ends",{time:l})}`:""}`:e("home.planned_now",{minutes:this.hass.states[t.planned]?.state??"0"})}
        </div>
        ${this.renderPlan()}
        ${this.error?a`<div class="error">${this.error}</div>`:h}
        <div class="actions">
          ${i?a`<button class="text danger" @click=${()=>this.press(t.stop)}>
                <ha-icon icon="mdi:water-off"></ha-icon> ${e("home.stop")}
              </button>`:a`<button
                class="text primary"
                ?disabled=${!s}
                title=${s?"":e("home.control_needed")}
                @click=${()=>this.press(t.run_due)}
              >
                <ha-icon icon="mdi:play"></ha-icon> ${e("home.run_due")}
              </button>`}
        </div>
      </section>
    `}renderPlan(){let e=this.localize,t=this.hass.states[this.entry.entities.planned]?.attributes??{},s=t.due??[],n=t.skipped??{};return a`
      <ul class="checks">
        ${s.map(i=>this.check(!0,i,e("status.due")))}
        ${Object.entries(n).map(([i,o])=>this.check(!1,i,e(`status.${o}`)))}
      </ul>
    `}check(e,t,s){return a`<li class=${e?"":"muted"}>
      <ha-icon class=${e?"ok":"held"} icon=${e?"mdi:check-circle":"mdi:minus-circle-outline"}></ha-icon>
      <span class="grow">${t}</span><span class="small">${s}</span>
    </li>`}renderMowing(){let e=this.localize,t=this.entry.entities,s=this.entry.sources.mower??"",n=this.hass.states[t.mowing]?.state??"unknown",i=n==="mowing",o=i?a`<span class="chip water">${e("mow.mowing")}</span>`:this.modeChip(t.automatic_mowing,t.mower_season_start,t.mower_season_end,a`<span class="chip ${n==="ready"?"ok":"warn"}">${e(n==="ready"?"mow.ready":"mow.held")}</span>`);return a`
      <section class="card status ${i?"active":""}">
        <h2>
          <ha-icon icon="mdi:robot-mower-outline"></ha-icon>
          <span class="grow">${e("section.mowing")}</span>
          ${o}
        </h2>
        <div class="big">
          ${i?e("mow.mowing"):this.nextText(t.next_mowing,"home.next_mowing_at","home.automatic_mowing_off",t.automatic_mowing)}
        </div>
        <div class="muted small">${e("home.mower_is",{state:this.hass.states[s]?.state??"\u2013"})}</div>
        ${this.renderMowChecks()}
        <div class="actions">
          <button class="text primary" ?disabled=${i} @click=${()=>this.press(t.mow_now)}>
            <ha-icon icon="mdi:play"></ha-icon> ${e("home.mow_now")}
          </button>
        </div>
      </section>
    `}renderMowChecks(){let e=this.localize,t=this.entry.entities,s=this.entry.sources,n=new Date,i=`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}-${String(n.getDate()).padStart(2,"0")}`,d=this.entry.zones.filter(X=>X.mower_conflict).some(X=>this.hass.states[X.entities.last_watered]?.state===i),c=this.hass.states[t.mowing]?.state==="watering",l=$(this.hass,t.raining),p=v(this.hass,t.hours_since_rain),u=v(this.hass,t.hours_to_rain),w=v(this.hass,t.dry_hours)??0,y=v(this.hass,t.rain_ahead_hours)??0,b=v(this.hass,s.outdoor_sensor??void 0),L=v(this.hass,t.frost_min),B=l||p!==void 0&&p<w,ne=u!==void 0&&u<y,ie=b!==void 0&&L!==void 0&&b<L,re=l?e("home.raining"):p===void 0?"\u2013":e("home.hours_ago",{hours:m(p,1)}),oe=u===void 0?e("home.no_rain_ahead"):e("home.in_hours",{hours:m(u,1)});return a`
      <ul class="checks">
        ${this.check(!(d||c),e("mowcheck.lawn"),e(c?"mow.watering":d?"mow.watered":"mowcheck.dry_lawn"))}
        ${s.weather?this.check(!B,e("mowcheck.rain_behind",{hours:m(w,0)}),re):h}
        ${s.weather?this.check(!ne,e("mowcheck.rain_ahead",{hours:m(y,1)}),oe):h}
        ${s.outdoor_sensor?this.check(!ie,e("mowcheck.frost"),b===void 0?"\u2013":`${m(b,1)} \xB0C`):h}
      </ul>
    `}renderWeather(){let e=this.localize,t=this.entry.sources,s=this.entry.entities,n=$(this.hass,s.raining),i=v(this.hass,s.hours_since_rain),o=v(this.hass,s.hours_to_rain);return a`
      <section class="card status">
        <h2>
          <ha-icon icon="mdi:weather-partly-rainy"></ha-icon>
          <span class="grow">${e("home.weather")}</span>
          ${t.weather?a`<span class="chip ${n?"warn":"ok"}">${e(n?"home.raining":"home.dry")}</span>`:h}
        </h2>
        ${this.renderGauge(e("home.rain"),t.rain_sensor,s.rain_max,"mm")}
        ${t.outdoor_sensor?this.renderGauge(e("home.outdoor"),t.outdoor_sensor,s.frost_min,"\xB0C",!0):h}
        ${t.weather?a`
              <div class="gauge">
                <span>${e("home.last_rain")}</span>
                <span>${n?e("home.raining"):i===void 0?"\u2013":e("home.hours_ago",{hours:m(i,1)})}</span>
              </div>
              <div class="gauge">
                <span>${e("home.next_rain")}</span>
                <span>${o===void 0?e("home.no_rain_ahead"):e("home.in_hours",{hours:m(o,1)})}</span>
              </div>
            `:h}
        <p class="muted small">${e("home.weather_hint")}</p>
      </section>
    `}renderGauge(e,t,s,n,i=!1){let o=this.localize;if(!t)return a`<div class="gauge"><span>${e}</span><span class="muted">${o("home.not_configured")}</span></div>`;let d=v(this.hass,t),c=v(this.hass,s),p=d!==void 0&&c!==void 0&&(i?d<c:d>c),u=d!==void 0&&c?Math.min(d/(2*c),1):0;return i?a`
        <div class="gauge">
          <span>${e}</span>
          <span class=${p?"warn-text":""}>
            ${d===void 0?o("home.no_value"):`${m(d,1)} ${n}`}
            <span class="muted small">/ ${o("home.frost_below",{limit:m(c,1)})}</span>
          </span>
        </div>
      `:a`
      <div class="gauge">
        <span>${e}</span>
        <span class=${p?"warn-text":""}>
          ${d===void 0?o("home.no_value"):`${m(d,1)} ${n}`}
          <span class="muted small">/ ${m(c,1)} ${n}</span>
        </span>
      </div>
      <div class="bar"><span class=${p?"over":""} style="width: ${u*100}%"></span><i></i></div>
    `}renderProblems(){let e=this.hass.states[this.entry.entities.problem]?.attributes.problems??[];return e.length?a`
      <section class="card problems">
        <h2><ha-icon icon="mdi:alert-circle-outline"></ha-icon>${this.localize("home.problems")}</h2>
        <ul>
          ${e.map(t=>a`<li>${this.localize(`problem.${t}`)}</li>`)}
        </ul>
      </section>
    `:h}renderZone(e){let t=this.localize,s=this.hass.states[e.entities.status],n=s?.state??"unknown",i=this.hass.states[e.entities.last_watered]?.state,o=this.hass.states[e.entities.next_due]?.state,d=v(this.hass,e.entities.interval),c=j(e),l=this.manual?.zoneId===e.id?this.manual:void 0,p=ut(this.entry,e.id);return a`
      <section class="card zone ${n==="watering"?"active":""}">
        <h2>
          <ha-icon icon=${e.roofed?"mdi:greenhouse":"mdi:sprinkler"}></ha-icon>
          <span class="grow">${e.name}</span>
          <span class="chip ${ke[n]??""}">${t(`status.${n}`)}</span>
        </h2>
        <dl>
          <dt>${t("zone.last_watered")}</dt>
          <dd>${this.dateText(i,s?.attributes.days_since)}</dd>
          <dt>${t("zone.next_due")}</dt>
          <dd>${this.dateText(o)}</dd>
          <dt>${t("zone.next_start")}</dt>
          <dd>${this.startText(e)}</dd>
          <dt>${t("zone.interval")}</dt>
          <dd>${t("zone.every_days",{days:d??"\u2013"})}</dd>
          ${this.renderSoil(e)} ${this.renderWater(e)}
        </dl>
        <div class="valves">
          ${e.valves.map((u,w)=>{let y=Ae.includes(this.hass.states[u]?.state??""),b=p?.valves?.find(L=>L.entity_id===u)?.flow;return a`
              <div class="valve">
                <span class="dot ${y?"open":""}" title=${this.hass.states[u]?.state??""}></span>
                <span class="grow">${this.name(u)}</span>
                ${l?a`<input
                        class="text minutes"
                        type="number"
                        min="0"
                        max="240"
                        step="1"
                        .value=${String(l.minutes[u]??0)}
                        @change=${L=>{let B=Number.parseFloat(L.target.value);this.manual={...l,minutes:{...l.minutes,[u]:Number.isFinite(B)?Math.max(0,B):0}}}}
                      /><span class="unit">min</span>`:a`<span class="muted">
                      ${b!=null?a`${t("zone.flow",{flow:m(b,1)})} · `:h}
                      ${t("zone.minutes",{minutes:m(v(this.hass,c[w]),0)})}
                    </span>`}
              </div>
            `})}
        </div>
        ${l?this.renderManualActions(e):this.renderZoneActions(e)}
      </section>
    `}startText(e){let t=this.hass.states[e.entities.next_start]?.state;if(!t||["unknown","unavailable"].includes(t))return this.localize("zone.no_start");let s=new Date(t);return`${O(s)}, ${M(s)}`}renderSoil(e){let t=this.localize,s=e.soil_sensor;if(!s)return h;let n=v(this.hass,s),i=v(this.hass,e.entities.soil_max),o=n!==void 0&&i!==void 0&&n>i;return a`
      <dt>${t("zone.soil")}</dt>
      <dd>
        <span class=${o?"warn-text":""}>${n===void 0?t("home.no_value"):`${m(n,1)} %`}</span>
        <span class="muted">/ ${m(i,0)} %</span>
      </dd>
    `}renderWater(e){let t=this.localize;if(!e.entities.water_used)return h;let s=v(this.hass,e.entities.water_used),n=ut(this.entry,e.id)?.liters;return a`
      <dt>${t("zone.water")}</dt>
      <dd>
        ${n!=null?t("zone.last_run_liters",{liters:m(n,0)}):"\u2013"}
        <span class="muted">· ${t("zone.total_liters",{liters:m(s,0)})}</span>
      </dd>
    `}renderZoneActions(e){let t=this.localize;return a`
      <div class="actions">
        <button class="text" @click=${()=>z(this,"raincast-open-zone",e.id)}>
          <ha-icon icon="mdi:cog-outline"></ha-icon> ${t("zone.settings")}
        </button>
        <button class="text primary" @click=${()=>this.openManual(e)}>
          <ha-icon icon="mdi:hand-water"></ha-icon> ${t("zone.manual")}
        </button>
      </div>
    `}renderManualActions(e){let t=this.localize,s=$(this.hass,this.entry.entities.control),n=$(this.hass,this.entry.entities.running),i=Object.values(this.manual?.minutes??{}).some(o=>o>0);return a`
      <p class="muted small">${t(s?"zone.manual_hint":"home.control_needed")}</p>
      <div class="actions">
        <button class="text" @click=${()=>this.manual=void 0}>${t("zone.cancel")}</button>
        <button
          class="text primary"
          ?disabled=${!s||n||!i}
          @click=${()=>this.startManual(e)}
        >
          <ha-icon icon="mdi:play"></ha-icon> ${t("zone.run_start")}
        </button>
      </div>
    `}dateText(e,t){let s=this.localize;if(!e||["unknown","unavailable"].includes(e))return s("zone.never");let n=new Date(`${e}T00:00:00`),i=O(n);return t==null||t<2?i:`${i} \xB7 ${s("zone.days_ago",{days:t})}`}static{this.styles=[_,H,f`
      /* Statuses side by side, each the same width; zones below on the same grid. */
      .status-row,
      .zones {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: var(--rc-gap);
        align-items: stretch;
      }
      .zones {
        align-items: start;
      }
      @media (max-width: 1250px) {
        .status-row,
        .zones {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }
      @media (max-width: 760px) {
        .status-row,
        .zones {
          grid-template-columns: minmax(0, 1fr);
        }
      }
      .card.status {
        display: flex;
        flex-direction: column;
      }
      .card.status .actions {
        margin-top: auto;
        padding-top: 8px;
      }
      h1.section {
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 28px 0 12px;
        font-size: 1.1rem;
        font-weight: 500;
      }
      h1.section ha-icon {
        --mdc-icon-size: 22px;
        color: var(--primary-color);
      }
      .problems {
        margin-bottom: var(--rc-gap);
      }
      h1.section {
        margin-top: 28px;
      }
      .card.active {
        border-color: var(--rc-water);
        box-shadow: 0 0 0 1px var(--rc-water);
      }
      .card h2 ha-icon {
        color: var(--rc-water);
      }
      .grow {
        flex: 1;
        min-width: 0;
      }
      .big {
        font-size: 1.15rem;
        font-weight: 500;
      }
      .checks {
        list-style: none;
        margin: 12px 0 0;
        padding: 0;
        display: grid;
        gap: 4px;
      }
      .checks li {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .checks ha-icon {
        --mdc-icon-size: 18px;
      }
      ha-icon.held {
        color: var(--rc-warn);
      }
      ha-icon.ok {
        color: var(--rc-ok);
      }
      .actions button ha-icon {
        --mdc-icon-size: 18px;
      }
      .gauge {
        display: flex;
        justify-content: space-between;
        gap: 8px;
        margin-top: 8px;
      }
      .warn-text {
        color: var(--rc-warn);
        font-weight: 500;
      }
      .bar {
        position: relative;
        height: 6px;
        border-radius: 3px;
        margin: 6px 0 4px;
        background: var(--secondary-background-color, rgba(127, 127, 127, 0.15));
        overflow: hidden;
      }
      .bar span {
        display: block;
        height: 100%;
        background: var(--rc-water);
      }
      .bar span.over {
        background: var(--rc-warn);
      }
      /* The limit sits in the middle of the bar. */
      .bar i {
        position: absolute;
        left: 50%;
        top: 0;
        bottom: 0;
        width: 2px;
        background: var(--primary-text-color);
        opacity: 0.4;
      }
      .problems ul {
        margin: 0;
        padding-left: 20px;
        color: var(--rc-error);
      }
      dl {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 4px 16px;
        margin: 0 0 8px;
        font-size: 0.9rem;
      }
      dt {
        color: var(--rc-muted);
      }
      dd {
        margin: 0;
        text-align: right;
      }
      .valves {
        border-top: 1px solid var(--divider-color);
        margin-top: 6px;
        padding-top: 4px;
      }
      .valve {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .valve {
        padding: 4px 0;
        min-height: 32px;
      }
      input.minutes {
        width: 64px;
        text-align: right;
      }
      .dot {
        flex: none;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: var(--disabled-color, #bdbdbd);
      }
      .dot.open {
        background: var(--rc-water);
        box-shadow: 0 0 0 3px color-mix(in srgb, var(--rc-water) 30%, transparent);
      }
    `]}};customElements.get("raincast-home")??customElements.define("raincast-home",gt);var ft=class extends g{constructor(){super(...arguments);this.domains=[];this.optional=!1}static{this.properties={hass:{attribute:!1},domains:{attribute:!1},deviceClass:{attribute:!1},value:{attribute:!1},optional:{type:Boolean}}}options(){return Object.values(this.hass.states).filter(s=>{let n=this.domains.includes(s.entity_id.split(".")[0]),i=!this.deviceClass||s.attributes.device_class===this.deviceClass;return n&&(i||s.entity_id===this.value)}).map(s=>({id:s.entity_id,name:String(s.attributes.friendly_name??s.entity_id)})).sort((s,n)=>s.name.localeCompare(n.name))}render(){let t=this.options(),s=!this.value||t.some(n=>n.id===this.value);return a`
      <select
        @change=${n=>{let i=n.target.value;z(this,"value-changed",i||null)}}
      >
        ${this.optional||!this.value?a`<option value="" ?selected=${!this.value}>–</option>`:""}
        ${s?"":a`<option value=${this.value} selected>${this.value}</option>`}
        ${t.map(n=>a`<option value=${n.id} ?selected=${n.id===this.value}>${n.name} · ${n.id}</option>`)}
      </select>
    `}static{this.styles=f`
    select {
      width: 100%;
      box-sizing: border-box;
      padding: 6px 8px;
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      background: var(--card-background-color, transparent);
      color: var(--primary-text-color);
      font: inherit;
    }
  `}};customElements.get("raincast-entity-picker")??customElements.define("raincast-entity-picker",ft);var ee=[{title:"src.weather",fields:[{key:"rain_sensor",label:"src.rain_sensor",domains:["sensor","input_number"]},{key:"outdoor_sensor",label:"src.outdoor_sensor",domains:["sensor"],deviceClass:"temperature"},{key:"weather",label:"src.weather_entity",domains:["weather"]}]},{title:"src.water",fields:[{key:"water_meter",label:"src.water_meter",domains:["sensor"],deviceClass:"water"}]},{title:"src.mower_group",fields:[{key:"mower",label:"src.mower",domains:["lawn_mower"]}]}],Ee=ee.flatMap(r=>r.fields),Se=["valve","switch","input_boolean"],Te=["sensor","input_number"],Re=["before_sunrise","at_time","off"],Ce=3,Me=15;function se(r){return String(r?.message??r)}function vt(r,e){return e?String(r.states[e]?.attributes.friendly_name??e):"\u2013"}function He(r,e){let t=r.states[e];if(!t)return"missing";let s=t.attributes.unit_of_measurement,n=Number(t.state),i=t.state!==""&&Number.isFinite(n)?n.toLocaleString(C,{maximumFractionDigits:3}):t.state;return s?`${i} ${s}`:i}var wt=class extends g{constructor(){super(...arguments);this.saving=!1}static{this.properties={hass:{attribute:!1},entry:{attribute:!1},localize:{attribute:!1},draft:{state:!0},error:{state:!0},saving:{state:!0}}}async save(){if(this.draft){this.saving=!0;try{await Dt(this.hass,this.entry.entry_id,this.draft),this.draft=void 0,z(this,"raincast-entries-changed")}catch(t){this.error=se(t)}finally{this.saving=!1}}}render(){let t=this.localize;return a`
      <section class="card">
        <h2>${t("settings.sources")}</h2>
        ${this.draft?this.renderForm():this.renderSummary()}
      </section>
    `}renderSummary(){let t=this.localize;return a`
      ${ee.map(s=>a`
          <h3>${t(s.title)}</h3>
          ${s.fields.map(n=>this.renderEntity(t(n.label),this.entry.sources[n.key]))}
        `)}
      <h3>${t("src.zones")}</h3>
      ${this.entry.zones.map(s=>a`
          <div class="zone-name">${s.name}</div>
          ${s.soil_sensor?this.renderEntity(vt(this.hass,s.soil_sensor),s.soil_sensor,t("src.zone_soil")):h}
          ${s.valves.map(n=>this.renderEntity(vt(this.hass,n),n,t(this.entry.native_valves.includes(n)?"src.native":"src.open_close")))}
        `)}
      <p class="muted small">${t("settings.sources_hint")}</p>
      <div class="actions">
        <button
          class="text primary"
          @click=${()=>{this.draft={...this.entry.sources},this.error=void 0}}
        >
          ${t("action.edit")}
        </button>
      </div>
    `}renderEntity(t,s,n){let i=this.localize,o=!!s&&!this.hass.states[s],d=!!s&&["unavailable","unknown"].includes(this.hass.states[s]?.state??"");return a`
      <div class="entity">
        <div class="grow">
          <div>${t}</div>
          <div class="muted small" title=${s??""}>
            ${s?a`${s}${n?` \xB7 ${n}`:""}`:i("home.not_configured")}
          </div>
        </div>
        ${s?a`<span class="value ${o||d?"bad":""}">${He(this.hass,s)}</span>`:h}
      </div>
    `}renderForm(){let t=this.localize,s=this.draft;return a`
      ${Ee.map(n=>a`
          <div class="field">
            <label>${t(n.label)}</label>
            <raincast-entity-picker
              .hass=${this.hass}
              .domains=${n.domains}
              .deviceClass=${n.deviceClass}
              .value=${s[n.key]}
              optional
              @value-changed=${i=>this.draft={...s,[n.key]:i.detail}}
            ></raincast-entity-picker>
          </div>
        `)}
      <p class="muted small">${t("settings.reload_hint")}</p>
      ${this.error?a`<div class="error">${this.error}</div>`:h}
      <div class="actions">
        <button class="text" @click=${()=>this.draft=void 0}>${t("settings.cancel")}</button>
        <button class="text primary" ?disabled=${this.saving} @click=${this.save}>${t("action.save")}</button>
      </div>
    `}static{this.styles=[_,H,f`
      h3 {
        margin: 12px 0 4px;
        font-size: 0.8rem;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        color: var(--rc-muted);
      }
      h3:first-of-type {
        margin-top: 0;
      }
      .entity {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 4px 0;
      }
      .grow {
        flex: 1;
        min-width: 0;
      }
      .grow .small {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .value {
        white-space: nowrap;
        font-size: 0.9rem;
      }
      .value.bad {
        color: var(--rc-error);
      }
      .zone-name {
        font-size: 0.85rem;
        margin-top: 4px;
      }
      .zone-name ~ .entity {
        padding-left: 12px;
      }
    `]}},yt=class extends g{constructor(){super(...arguments);this.confirmRemove=!1;this.saving=!1}static{this.properties={hass:{attribute:!1},entry:{attribute:!1},localize:{attribute:!1},focusZone:{attribute:!1},editing:{state:!0},draft:{state:!0},confirmRemove:{state:!0},error:{state:!0},saving:{state:!0}}}startEdit(t){this.editing=t?.id??"new",this.draft={name:t?.name??"",valves:[...t?.valves??[]],roofed:t?.roofed??!1,mower_conflict:t?.mower_conflict??!1,soil_sensor:t?.soil_sensor??null},this.confirmRemove=!1,this.error=void 0}stopEdit(){this.editing=void 0,this.draft=void 0}async run(t){this.saving=!0;try{await t(),this.stopEdit(),z(this,"raincast-entries-changed")}catch(s){this.error=se(s)}finally{this.saving=!1}}render(){let t=this.localize,s=!!this.entry.sources.water_meter;return a`
      <section class="card">
        <h2>${t("settings.zones")}</h2>
        ${this.entry.zones.map(n=>this.editing===n.id?this.renderForm(n):this.renderZone(n))}
        ${this.editing==="new"?this.renderForm():a`<div class="actions">
              <button class="text primary" @click=${()=>this.startEdit()}>+ ${t("action.add_zone")}</button>
            </div>`}
        ${s?a`<p class="muted small">${t("zone.max_flow_hint")}</p>`:h}
      </section>
    `}updated(t){t.has("focusZone")&&this.focusZone&&this.renderRoot.querySelector(`[data-zone="${this.focusZone}"]`)?.scrollIntoView({behavior:"smooth",block:"center"})}renderZone(t){let s=this.localize,n=j(t),i=Bt(t);return a`
      <div class="zone-block ${t.id===this.focusZone?"focus":""}" data-zone=${t.id}>
        <div class="zone">
          <ha-icon icon=${t.roofed?"mdi:greenhouse":"mdi:sprinkler"}></ha-icon>
          <div class="grow">
            ${t.name}${t.roofed?a` <span class="muted small">· ${s("zone.roofed")}</span>`:h}
            ${t.mower_conflict?a` <span class="muted small">· ${s("zone.mower_conflict")}</span>`:h}
          </div>
          <button class="text icon" title=${s("action.edit")} @click=${()=>this.startEdit(t)}>
            <ha-icon icon="mdi:pencil"></ha-icon>
          </button>
        </div>
        ${this.renderStart(t)} ${x(this.hass,t.entities.interval,s("zone.interval"))}
        ${x(this.hass,t.entities.soil_max,s("zone.soil_max"))}
        ${t.valves.map((o,d)=>a`
            <div class="valve-tuning">
              <div class="valve-name">${vt(this.hass,o)}</div>
              ${x(this.hass,n[d],s("zone.time"))}
              ${x(this.hass,i[d],s("zone.max_flow"))}
            </div>
          `)}
      </div>
    `}renderStart(t){let s=this.localize,n=this.hass.states[t.entities.start_mode]?.state,i=this.hass.states[t.entities.start_time]?.state??"";return a`
      <div class="number">
        <span class="label">${s("zone.start")}</span>
        <select
          class="start"
          @change=${o=>this.hass.callService("select","select_option",{entity_id:t.entities.start_mode,option:o.target.value})}
        >
          ${Re.map(o=>a`<option value=${o} ?selected=${o===n}>${s(`mode.${o}`)}</option>`)}
        </select>
      </div>
      ${n==="before_sunrise"?x(this.hass,t.entities.sunrise_offset,s("zone.sunrise_offset")):h}
      ${n==="at_time"?a`<div class="number">
            <span class="label">${s("zone.start_time")}</span>
            <input
              class="text"
              type="time"
              .value=${i.slice(0,5)}
              @change=${o=>this.hass.callService("time","set_value",{entity_id:t.entities.start_time,time:`${o.target.value}:00`})}
            />
          </div>`:h}
    `}renderForm(t){let s=this.localize,n=this.draft,i=n.valves.filter(l=>!!l),o=n.name.trim().length>0&&i.length>0,d=(l,p)=>{let u=[...n.valves];u[l]=p??"",this.draft={...n,valves:u}},c=()=>{let l={...n,valves:i};return this.run(()=>t?J(this.hass,this.entry.entry_id,t.id,l):Ft(this.hass,this.entry.entry_id,{...l,interval:Ce,duration:Me}))};return a`
      <div class="form">
        <div class="field">
          <label>${s("zone.name")} *</label>
          <input
            class="text"
            .value=${n.name}
            @input=${l=>this.draft={...n,name:l.target.value}}
          />
        </div>
        <label class="check">
          <input
            type="checkbox"
            .checked=${n.roofed}
            @change=${l=>this.draft={...n,roofed:l.target.checked}}
          />
          <span>${s("zone.roofed")}<br /><span class="muted small">${s("zone.roofed_hint")}</span></span>
        </label>
        <label class="check">
          <input
            type="checkbox"
            .checked=${n.mower_conflict}
            @change=${l=>this.draft={...n,mower_conflict:l.target.checked}}
          />
          <span>${s("zone.mower_conflict")}<br /><span class="muted small">${s("zone.mower_conflict_hint")}</span></span>
        </label>
        <div class="field">
          <label>${s("zone.soil_sensor")}</label>
          <raincast-entity-picker
            .hass=${this.hass}
            .domains=${Te}
            .value=${n.soil_sensor}
            optional
            @value-changed=${l=>this.draft={...n,soil_sensor:l.detail}}
          ></raincast-entity-picker>
          <span class="muted small">${s("zone.soil_sensor_hint")}</span>
        </div>
        <div class="field">
          <label>${s("zone.valves")} *</label>
          ${n.valves.map((l,p)=>a`
              <div class="valve-row">
                <raincast-entity-picker
                  .hass=${this.hass}
                  .domains=${Se}
                  .value=${l||null}
                  optional
                  @value-changed=${u=>d(p,u.detail)}
                ></raincast-entity-picker>
                <button
                  class="text icon"
                  title=${s("action.remove")}
                  @click=${()=>this.draft={...n,valves:n.valves.filter((u,w)=>w!==p)}}
                >
                  <ha-icon icon="mdi:close"></ha-icon>
                </button>
              </div>
            `)}
          <div>
            <button class="text" @click=${()=>this.draft={...n,valves:[...n.valves,""]}}>
              + ${s("action.add_valve")}
            </button>
          </div>
        </div>
        <p class="muted small">${s(t?"zone.edit_hint":"zone.new_hint")}</p>
        ${this.error?a`<div class="error">${this.error}</div>`:h}
        ${this.confirmRemove&&t?a`<div class="confirm">
              <span>${s("zone.remove_confirm",{name:t.name})}</span>
              <button class="text" @click=${()=>this.confirmRemove=!1}>${s("settings.cancel")}</button>
              <button
                class="text danger"
                @click=${()=>this.run(()=>Vt(this.hass,this.entry.entry_id,t.id))}
              >
                ${s("action.remove")}
              </button>
            </div>`:h}
        <div class="actions">
          ${t?a`<button class="text danger" @click=${()=>this.confirmRemove=!0}>${s("action.remove")}</button>`:h}
          <span class="spacer"></span>
          <button class="text" @click=${()=>this.stopEdit()}>${s("settings.cancel")}</button>
          <button class="text primary" ?disabled=${!o||this.saving} @click=${c}>
            ${s(t?"action.save":"action.add_zone")}
          </button>
        </div>
      </div>
    `}static{this.styles=[_,H,f`
      .zone-block {
        border-bottom: 1px solid var(--divider-color);
        padding: 6px 0 8px;
      }
      select.start {
        padding: 4px 6px;
        border: 1px solid var(--divider-color);
        border-radius: 6px;
        background: var(--card-background-color, transparent);
        color: var(--primary-text-color);
        font: inherit;
      }
      .valve-tuning {
        padding-left: 30px;
        margin-top: 4px;
      }
      .valve-name {
        font-size: 0.85rem;
        color: var(--rc-muted);
      }
      .zone-block.focus {
        border: 1px solid var(--primary-color);
        border-radius: 8px;
        padding: 6px 10px 8px;
        margin: 4px -10px;
      }
      .zone {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 4px 0;
        font-weight: 500;
      }
      .zone ha-icon {
        color: var(--rc-muted);
      }
      .grow {
        flex: 1;
        min-width: 0;
      }
      button.icon {
        padding: 4px;
        color: var(--rc-muted);
      }
      .form {
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        padding: 12px;
        margin: 6px 0;
      }
      input.text {
        width: 100%;
        box-sizing: border-box;
        padding: 6px 8px;
      }
      .check {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        margin-bottom: 10px;
        cursor: pointer;
      }
      .valve-row {
        display: flex;
        align-items: center;
        gap: 4px;
      }
      .valve-row raincast-entity-picker {
        flex: 1;
        min-width: 0;
      }
      .spacer {
        flex: 1;
      }
      .confirm {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
        padding: 10px 12px;
        margin: 8px 0;
        border-radius: 8px;
        background: color-mix(in srgb, var(--rc-error) 12%, transparent);
      }
      .confirm span {
        flex: 1;
      }
    `]}};customElements.get("raincast-sources-card")??customElements.define("raincast-sources-card",wt);customElements.get("raincast-zones-card")??customElements.define("raincast-zones-card",yt);var Le=["sunrise","sunset","at_time","off"],Ne=Array.from({length:12},(r,e)=>new Date(2026,e,1).toLocaleDateString(C,{month:"long"})),bt=class extends g{constructor(){super(...arguments);this.confirming=!1}static{this.properties={hass:{attribute:!1},entry:{attribute:!1},localize:{attribute:!1},focusZone:{attribute:!1},confirming:{state:!0}}}render(){if(!this.hass.user?.is_admin)return a`<section class="card muted">${this.localize("settings.admin_only")}</section>`;let t=this.localize,s=!!this.entry.entities.automatic_mowing;return a`
      <h1 class="section"><ha-icon icon="mdi:sprinkler-variant"></ha-icon>${t("section.watering")}</h1>
      <div class="layout">
        <div class="column">${this.renderWatering()} ${this.renderWateringRules()}</div>
        <div class="column wide">
          <raincast-zones-card
            .hass=${this.hass}
            .entry=${this.entry}
            .localize=${this.localize}
            .focusZone=${this.focusZone}
          ></raincast-zones-card>
        </div>
      </div>
      ${s?a`
            <h1 class="section"><ha-icon icon="mdi:robot-mower-outline"></ha-icon>${t("section.mowing")}</h1>
            <div class="layout">
              <div class="column">${this.renderMowing()}</div>
              <div class="column">${this.renderMowingRules()}</div>
              <div class="column">${this.renderLawnZones()}</div>
            </div>
          `:h}
      <h1 class="section"><ha-icon icon="mdi:cog-outline"></ha-icon>${t("section.general")}</h1>
      <div class="layout">
        <div class="column wide">
          <raincast-sources-card .hass=${this.hass} .entry=${this.entry} .localize=${this.localize}></raincast-sources-card>
        </div>
        <div class="column">${this.renderNotifications()}</div>
      </div>
      <p class="small">
        <a href="/config/integrations/integration/raincast">${t("settings.entities")}</a>
      </p>
    `}renderToggle(t,s,n,i){return a`
      <div class="toggle-row">
        <div>
          <div>${this.localize(t)}</div>
          <div class="muted small">${this.localize(s)}</div>
        </div>
        <button class="toggle ${n?"on":""}" role="switch" aria-checked=${n} @click=${()=>i(!n)}>
          <span></span>
        </button>
      </div>
    `}switchTo(t,s){this.hass.callService("switch",s?"turn_on":"turn_off",{entity_id:t})}month(t,s){let n=this.localize;return a`
      <div class="number">
        <span class="label">${n(s)}</span>
        <select
          class="inline"
          @change=${i=>this.hass.callService("select","select_option",{entity_id:t,option:i.target.value})}
        >
          ${Ne.map((i,o)=>a`<option value=${o+1} ?selected=${this.hass.states[t]?.state===String(o+1)}>
                ${i}
              </option>`)}
        </select>
      </div>
    `}renderWatering(){let t=this.localize,s=this.entry.entities;return a`
      <section class="card">
        <h2>${t("settings.watering")}</h2>
        ${this.renderToggle("settings.automatic","settings.automatic_hint",$(this.hass,s.automatic),n=>this.switchTo(s.automatic,n))}
        ${this.renderToggle("settings.control","settings.control_hint",$(this.hass,s.control),n=>{if(n){this.confirming=!0;return}this.switchTo(s.control,!1)})}
        ${this.confirming?a`<div class="confirm">
              <span>${t("settings.control_confirm")}</span>
              <button class="text" @click=${()=>this.confirming=!1}>${t("settings.cancel")}</button>
              <button
                class="text primary"
                @click=${()=>{this.confirming=!1,this.switchTo(s.control,!0)}}
              >
                ${t("settings.confirm")}
              </button>
            </div>`:h}
        <div class="divider"></div>
        ${this.month(s.season_start,"settings.season_start")} ${this.month(s.season_end,"settings.season_end")}
        <p class="muted small">${t("settings.season_hint")}</p>
      </section>
    `}renderWateringRules(){let t=this.localize,s=this.entry.entities;return a`
      <section class="card">
        <h2>${t("settings.watering_rules")}</h2>
        ${x(this.hass,s.rain_max,t("settings.rain_max"))}
        ${x(this.hass,s.frost_min,t("settings.frost_min"))}
        <p class="muted small">${t("settings.limits_hint")}</p>
      </section>
    `}renderMowing(){let t=this.localize,s=this.entry.entities,n=this.hass.states[s.mower_start_mode]?.state,i=this.hass.states[s.mower_start_time]?.state??"";return a`
      <section class="card">
        <h2>${t("settings.mowing")}</h2>
        ${this.renderToggle("settings.automatic_mowing","settings.automatic_mowing_hint",$(this.hass,s.automatic_mowing),o=>this.switchTo(s.automatic_mowing,o))}
        <div class="divider"></div>
        <div class="number">
          <span class="label">${t("settings.mower_start")}</span>
          <select
            class="inline"
            @change=${o=>this.hass.callService("select","select_option",{entity_id:s.mower_start_mode,option:o.target.value})}
          >
            ${Le.map(o=>a`<option value=${o} ?selected=${o===n}>${t(`mowmode.${o}`)}</option>`)}
          </select>
        </div>
        ${n==="sunrise"||n==="sunset"?x(this.hass,s.mower_offset,t("settings.mower_offset")):h}
        ${n==="at_time"?a`<div class="number">
              <span class="label">${t("zone.start_time")}</span>
              <input
                class="text"
                type="time"
                .value=${i.slice(0,5)}
                @change=${o=>this.hass.callService("time","set_value",{entity_id:s.mower_start_time,time:`${o.target.value}:00`})}
              />
            </div>`:h}
        ${this.month(s.mower_season_start,"settings.season_start")}
        ${this.month(s.mower_season_end,"settings.season_end")}
        <p class="muted small">${t("settings.mower_season_hint")}</p>
      </section>
    `}renderMowingRules(){let t=this.localize,s=this.entry.entities;return a`
      <section class="card">
        <h2>${t("settings.mowing_rules")}</h2>
        ${x(this.hass,s.dry_hours,t("settings.dry_hours"))}
        ${x(this.hass,s.rain_ahead_hours,t("settings.rain_ahead_hours"))}
        <p class="muted small">${t("settings.mower_hint")}</p>
      </section>
    `}renderLawnZones(){let t=this.localize;return a`
      <section class="card">
        <h2>${t("settings.lawn_zones")}</h2>
        ${this.entry.zones.map(s=>this.renderToggleText(s.name,t(s.roofed?"zone.roofed":"settings.open_zone"),s.mower_conflict,n=>this.setMowerConflict(s,n)))}
        <p class="muted small">${t("settings.lawn_zones_hint")}</p>
      </section>
    `}async setMowerConflict(t,s){let n={name:t.name,valves:t.valves,roofed:t.roofed,soil_sensor:t.soil_sensor,mower_conflict:s};await J(this.hass,this.entry.entry_id,t.id,n),z(this,"raincast-entries-changed")}renderToggleText(t,s,n,i){return a`
      <div class="toggle-row">
        <div>
          <div>${t}</div>
          <div class="muted small">${s}</div>
        </div>
        <button class="toggle ${n?"on":""}" role="switch" aria-checked=${n} @click=${()=>i(!n)}>
          <span></span>
        </button>
      </div>
    `}renderNotifications(){let t=this.localize,s=this.hass.states[this.entry.entities.problem]?.attributes.problems??[],n=[...this.entry.notify_services],i=this.entry.notify_service;return i&&!n.includes(i)&&n.unshift(i),a`
      <section class="card">
        <h2>${t("settings.notifications")}</h2>
        ${s.length?a`<ul class="problems">
              ${s.map(o=>a`<li>${t(`problem.${o}`)}</li>`)}
            </ul>`:a`<p class="muted">${t("settings.no_problems")}</p>`}
        <div class="field">
          <label>${t("settings.notify_service")}</label>
          <select
            @change=${async o=>{let d=o.target.value||null;await Ut(this.hass,this.entry.entry_id,d),z(this,"raincast-entries-changed")}}
          >
            <option value="" ?selected=${!i}>${t("settings.notify_none")}</option>
            ${n.map(o=>a`<option value=${o} ?selected=${o===i}>notify.${o}</option>`)}
          </select>
        </div>
        <p class="muted small">${t("settings.notify_hint")}</p>
      </section>
    `}static{this.styles=[_,H,f`
      /* Every card has a fixed column, so a card that grows never moves the others. */
      .layout {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: var(--rc-gap);
        align-items: start;
      }
      .column.wide {
        grid-column: span 2;
      }
      h1.section {
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 28px 0 12px;
        font-size: 1.1rem;
        font-weight: 500;
      }
      h1.section:first-child {
        margin-top: 4px;
      }
      h1.section ha-icon {
        --mdc-icon-size: 22px;
        color: var(--primary-color);
      }
      .divider {
        border-top: 1px solid var(--divider-color);
        margin: 8px 0;
      }
      select.inline {
        width: auto;
        min-width: 150px;
      }
      .column {
        display: flex;
        flex-direction: column;
        gap: var(--rc-gap);
        min-width: 0;
      }
      @media (max-width: 1250px) {
        .layout {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        .column.wide {
          grid-column: span 1;
        }
      }
      @media (max-width: 760px) {
        .layout {
          grid-template-columns: minmax(0, 1fr);
        }
      }
      .toggle {
        flex: none;
        width: 44px;
        height: 24px;
        border-radius: 12px;
        border: none;
        padding: 2px;
        cursor: pointer;
        background: var(--disabled-color, #bdbdbd);
        transition: background 0.2s;
      }
      .toggle span {
        display: block;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #fff;
        transition: transform 0.2s;
      }
      .toggle.on {
        background: var(--primary-color);
      }
      .toggle.on span {
        transform: translateX(20px);
      }
      .confirm {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
        padding: 10px 12px;
        margin: 4px 0 8px;
        border-radius: 8px;
        background: color-mix(in srgb, var(--rc-warn) 15%, transparent);
      }
      .confirm span {
        flex: 1;
      }
      a {
        color: var(--primary-color);
      }
      select.month {
        width: auto;
        min-width: 140px;
      }
      select {
        width: 100%;
        box-sizing: border-box;
        padding: 6px 8px;
        border: 1px solid var(--divider-color);
        border-radius: 6px;
        background: var(--card-background-color, transparent);
        color: var(--primary-text-color);
        font: inherit;
      }
      .problems {
        margin: 0 0 10px;
        padding-left: 20px;
        color: var(--rc-error);
      }
    `]}};customElements.get("raincast-settings")??customElements.define("raincast-settings",bt);var Pe=[{id:"home",label:"tab.home",icon:"mdi:sprinkler-variant"},{id:"history",label:"tab.history",icon:"mdi:chart-line"},{id:"settings",label:"tab.settings",icon:"mdi:tune-variant"},{id:"guide",label:"tab.guide",icon:"mdi:book-open-variant"}],Oe=1500,_t=class extends g{constructor(){super(...arguments);this.narrow=!1;this.tab="home";this.loading=!1;this.localize=qt();this.openZone=t=>{this.focusZone=t.detail,this.tab="settings"};this.entriesChanged=()=>{window.setTimeout(()=>this.load(),Oe)}}static{this.properties={hass:{attribute:!1},narrow:{type:Boolean},entries:{state:!0},entryId:{state:!0},tab:{state:!0},focusZone:{state:!0},error:{state:!0}}}willUpdate(t){t.has("hass")&&this.hass&&!this.entries&&!this.loading&&this.load();let s=this.entries?.find(i=>i.entry_id===this.entryId),n=s?this.hass.states[s.entities.running]?.state:void 0;this.wasRunning==="on"&&n==="off"&&this.entriesChanged(),this.wasRunning=n}async load(){this.loading=!0;try{this.entries=await It(this.hass),this.entries.some(s=>s.entry_id===this.entryId)||(this.entryId=this.entries[0]?.entry_id),this.error=void 0}catch(t){this.error=String(t?.message??t)}finally{this.loading=!1}}selectTab(t){this.tab=t,this.focusZone=void 0}connectedCallback(){super.connectedCallback(),this.addEventListener("raincast-entries-changed",this.entriesChanged),this.addEventListener("raincast-open-zone",this.openZone),this.hass&&this.load()}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("raincast-entries-changed",this.entriesChanged),this.removeEventListener("raincast-open-zone",this.openZone)}render(){let t=this.entries?.find(s=>s.entry_id===this.entryId);return a`
      <div class="header">
        <div class="toolbar">
          <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
          <div class="title">${t?.title??"RainCast"}</div>
          ${(this.entries?.length??0)>1?a`<select @change=${s=>this.entryId=s.target.value}>
                ${this.entries.map(s=>a`<option value=${s.entry_id} ?selected=${s.entry_id===this.entryId}>${s.title}</option>`)}
              </select>`:h}
        </div>
        <nav>
          ${Pe.map(s=>a`
              <button class="tab ${s.id===this.tab?"active":""}" @click=${()=>this.selectTab(s.id)}>
                <ha-icon icon=${s.icon}></ha-icon><span>${this.localize(s.label)}</span>
              </button>
            `)}
        </nav>
      </div>
      <main>${this.renderContent(t)}</main>
    `}renderContent(t){if(this.error)return a`<div class="card">${this.error}</div>`;if(!this.entries)return a`<div class="muted">${this.localize("loading")}</div>`;if(!t)return a`<div class="card">${this.localize("no_entry")}</div>`;let s={hass:this.hass,entry:t,localize:this.localize};switch(this.tab){case"history":return a`<raincast-history .hass=${s.hass} .entry=${t} .localize=${s.localize}></raincast-history>`;case"guide":return a`<raincast-guide></raincast-guide>`;case"settings":return a`<raincast-settings
          .hass=${s.hass}
          .entry=${t}
          .localize=${s.localize}
          .focusZone=${this.focusZone}
        ></raincast-settings>`;default:return a`<raincast-home .hass=${s.hass} .entry=${t} .localize=${s.localize}></raincast-home>`}}static{this.styles=[_,f`
      :host {
        display: block;
        min-height: 100vh;
        background: var(--primary-background-color);
        color: var(--primary-text-color);
        font-family: var(--paper-font-body1_-_font-family, inherit);
      }
      .header {
        position: sticky;
        top: 0;
        z-index: 2;
        background: var(--app-header-background-color, var(--primary-background-color));
        color: var(--app-header-text-color, var(--primary-text-color));
        border-bottom: var(--app-header-border-bottom, 1px solid var(--divider-color));
      }
      .toolbar {
        display: flex;
        align-items: center;
        gap: 8px;
        height: 56px;
        padding: 0 12px;
      }
      .title {
        flex: 1;
        font-size: 1.25rem;
      }
      select {
        background: transparent;
        color: inherit;
        border: 1px solid var(--divider-color);
        border-radius: 6px;
        padding: 4px 8px;
      }
      nav {
        display: flex;
        gap: 4px;
        padding: 0 12px;
        overflow-x: auto;
      }
      .tab {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 10px 14px;
        border: none;
        border-bottom: 2px solid transparent;
        background: transparent;
        color: inherit;
        opacity: 0.75;
        cursor: pointer;
        font: inherit;
        white-space: nowrap;
      }
      .tab.active {
        opacity: 1;
        border-bottom-color: var(--primary-color);
        color: var(--primary-color);
      }
      main {
        padding: var(--rc-gap);
        max-width: 1400px;
        margin: 0 auto;
        box-sizing: border-box;
      }
      @media (max-width: 600px) {
        .tab span {
          display: none;
        }
        main {
          padding: 8px;
        }
      }
    `]}};customElements.get("raincast-panel")??customElements.define("raincast-panel",_t);
