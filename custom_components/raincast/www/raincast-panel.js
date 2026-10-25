var j=globalThis,B=j.ShadowRoot&&(j.ShadyCSS===void 0||j.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,J=Symbol(),$t=new WeakMap,O=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==J)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(B&&e===void 0){let s=t!==void 0&&t.length===1;s&&(e=$t.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&$t.set(t,e))}return e}toString(){return this.cssText}},_t=i=>new O(typeof i=="string"?i:i+"",void 0,J),f=(i,...e)=>{let t=i.length===1?i[0]:e.reduce((s,n,r)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+i[r+1],i[0]);return new O(t,i,J)},wt=(i,e)=>{if(B)i.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let s=document.createElement("style"),n=j.litNonce;n!==void 0&&s.setAttribute("nonce",n),s.textContent=t.cssText,i.appendChild(s)}},Y=B?i=>i:i=>i instanceof CSSStyleSheet?(e=>{let t="";for(let s of e.cssRules)t+=s.cssText;return _t(t)})(i):i;var{is:ee,defineProperty:se,getOwnPropertyDescriptor:ne,getOwnPropertyNames:ie,getOwnPropertySymbols:re,getPrototypeOf:ae}=Object,K=globalThis,xt=K.trustedTypes,oe=xt?xt.emptyScript:"",le=K.reactiveElementPolyfillSupport,Z=(i,e)=>i,X={toAttribute(i,e){switch(e){case Boolean:i=i?oe:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,e){let t=i;switch(e){case Boolean:t=i!==null;break;case Number:t=i===null?null:Number(i);break;case Object:case Array:try{t=JSON.parse(i)}catch{t=null}}return t}},zt=(i,e)=>!ee(i,e),At={attribute:!0,type:String,converter:X,reflect:!1,useDefault:!1,hasChanged:zt};Symbol.metadata??=Symbol("metadata"),K.litPropertyMetadata??=new WeakMap;var _=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=At){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let s=Symbol(),n=this.getPropertyDescriptor(e,s,t);n!==void 0&&se(this.prototype,e,n)}}static getPropertyDescriptor(e,t,s){let{get:n,set:r}=ne(this.prototype,e)??{get(){return this[t]},set(o){this[t]=o}};return{get:n,set(o){let c=n?.call(this);r?.call(this,o),this.requestUpdate(e,c,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??At}static _$Ei(){if(this.hasOwnProperty(Z("elementProperties")))return;let e=ae(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(Z("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Z("properties"))){let t=this.properties,s=[...ie(t),...re(t)];for(let n of s)this.createProperty(n,t[n])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[s,n]of t)this.elementProperties.set(s,n)}this._$Eh=new Map;for(let[t,s]of this.elementProperties){let n=this._$Eu(t,s);n!==void 0&&this._$Eh.set(n,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let s=new Set(e.flat(1/0).reverse());for(let n of s)t.unshift(Y(n))}else e!==void 0&&t.push(Y(e));return t}static _$Eu(e,t){let s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return wt(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){let s=this.constructor.elementProperties.get(e),n=this.constructor._$Eu(e,s);if(n!==void 0&&s.reflect===!0){let r=(s.converter?.toAttribute!==void 0?s.converter:X).toAttribute(t,s.type);this._$Em=e,r==null?this.removeAttribute(n):this.setAttribute(n,r),this._$Em=null}}_$AK(e,t){let s=this.constructor,n=s._$Eh.get(e);if(n!==void 0&&this._$Em!==n){let r=s.getPropertyOptions(n),o=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:X;this._$Em=n;let c=o.fromAttribute(t,r.type);this[n]=c??this._$Ej?.get(n)??c,this._$Em=null}}requestUpdate(e,t,s,n=!1,r){if(e!==void 0){let o=this.constructor;if(n===!1&&(r=this[e]),s??=o.getPropertyOptions(e),!((s.hasChanged??zt)(r,t)||s.useDefault&&s.reflect&&r===this._$Ej?.get(e)&&!this.hasAttribute(o._$Eu(e,s))))return;this.C(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:n,wrapped:r},o){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,o??t??this[e]),r!==!0||o!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),n===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[n,r]of this._$Ep)this[n]=r;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[n,r]of s){let{wrapped:o}=r,c=this[n];o!==!0||this._$AL.has(n)||c===void 0||this.C(n,void 0,r,c)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(t)):this._$EM()}catch(s){throw e=!1,this._$EM(),s}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};_.elementStyles=[],_.shadowRootOptions={mode:"open"},_[Z("elementProperties")]=new Map,_[Z("finalized")]=new Map,le?.({ReactiveElement:_}),(K.reactiveElementVersions??=[]).push("2.1.2");var rt=globalThis,Et=i=>i,G=rt.trustedTypes,St=G?G.createPolicy("lit-html",{createHTML:i=>i}):void 0,Lt="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,Pt="?"+E,de=`<${Pt}>`,T=document,U=()=>T.createComment(""),W=i=>i===null||typeof i!="object"&&typeof i!="function",at=Array.isArray,ce=i=>at(i)||typeof i?.[Symbol.iterator]=="function",Q=`[ 	
\f\r]`,I=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,kt=/-->/g,Tt=/>/g,S=RegExp(`>|${Q}(?:([^\\s"'>=/]+)(${Q}*=${Q}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Rt=/'/g,Ct=/"/g,Nt=/^(?:script|style|textarea|title)$/i,ot=i=>(e,...t)=>({_$litType$:i,strings:e,values:t}),a=ot(1),Ne=ot(2),Me=ot(3),R=Symbol.for("lit-noChange"),h=Symbol.for("lit-nothing"),Ht=new WeakMap,k=T.createTreeWalker(T,129);function Mt(i,e){if(!at(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return St!==void 0?St.createHTML(e):e}var he=(i,e)=>{let t=i.length-1,s=[],n,r=e===2?"<svg>":e===3?"<math>":"",o=I;for(let c=0;c<t;c++){let l=i[c],d,u,p=-1,g=0;for(;g<l.length&&(o.lastIndex=g,u=o.exec(l),u!==null);)g=o.lastIndex,o===I?u[1]==="!--"?o=kt:u[1]!==void 0?o=Tt:u[2]!==void 0?(Nt.test(u[2])&&(n=RegExp("</"+u[2],"g")),o=S):u[3]!==void 0&&(o=S):o===S?u[0]===">"?(o=n??I,p=-1):u[1]===void 0?p=-2:(p=o.lastIndex-u[2].length,d=u[1],o=u[3]===void 0?S:u[3]==='"'?Ct:Rt):o===Ct||o===Rt?o=S:o===kt||o===Tt?o=I:(o=S,n=void 0);let $=o===S&&i[c+1].startsWith("/>")?" ":"";r+=o===I?l+de:p>=0?(s.push(d),l.slice(0,p)+Lt+l.slice(p)+E+$):l+E+(p===-2?c:$)}return[Mt(i,r+(i[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]},D=class i{constructor({strings:e,_$litType$:t},s){let n;this.parts=[];let r=0,o=0,c=e.length-1,l=this.parts,[d,u]=he(e,t);if(this.el=i.createElement(d,s),k.currentNode=this.el.content,t===2||t===3){let p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(n=k.nextNode())!==null&&l.length<c;){if(n.nodeType===1){if(n.hasAttributes())for(let p of n.getAttributeNames())if(p.endsWith(Lt)){let g=u[o++],$=n.getAttribute(p).split(E),z=/([.?@])?(.*)/.exec(g);l.push({type:1,index:r,name:z[2],strings:$,ctor:z[1]==="."?et:z[1]==="?"?st:z[1]==="@"?nt:N}),n.removeAttribute(p)}else p.startsWith(E)&&(l.push({type:6,index:r}),n.removeAttribute(p));if(Nt.test(n.tagName)){let p=n.textContent.split(E),g=p.length-1;if(g>0){n.textContent=G?G.emptyScript:"";for(let $=0;$<g;$++)n.append(p[$],U()),k.nextNode(),l.push({type:2,index:++r});n.append(p[g],U())}}}else if(n.nodeType===8)if(n.data===Pt)l.push({type:2,index:r});else{let p=-1;for(;(p=n.data.indexOf(E,p+1))!==-1;)l.push({type:7,index:r}),p+=E.length-1}r++}}static createElement(e,t){let s=T.createElement("template");return s.innerHTML=e,s}};function P(i,e,t=i,s){if(e===R)return e;let n=s!==void 0?t._$Co?.[s]:t._$Cl,r=W(e)?void 0:e._$litDirective$;return n?.constructor!==r&&(n?._$AO?.(!1),r===void 0?n=void 0:(n=new r(i),n._$AT(i,t,s)),s!==void 0?(t._$Co??=[])[s]=n:t._$Cl=n),n!==void 0&&(e=P(i,n._$AS(i,e.values),n,s)),e}var tt=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:s}=this._$AD,n=(e?.creationScope??T).importNode(t,!0);k.currentNode=n;let r=k.nextNode(),o=0,c=0,l=s[0];for(;l!==void 0;){if(o===l.index){let d;l.type===2?d=new F(r,r.nextSibling,this,e):l.type===1?d=new l.ctor(r,l.name,l.strings,this,e):l.type===6&&(d=new it(r,this,e)),this._$AV.push(d),l=s[++c]}o!==l?.index&&(r=k.nextNode(),o++)}return k.currentNode=T,n}p(e){let t=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}},F=class i{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,n){this.type=2,this._$AH=h,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=P(this,e,t),W(e)?e===h||e==null||e===""?(this._$AH!==h&&this._$AR(),this._$AH=h):e!==this._$AH&&e!==R&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):ce(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==h&&W(this._$AH)?this._$AA.nextSibling.data=e:this.T(T.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:s}=e,n=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=D.createElement(Mt(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===n)this._$AH.p(t);else{let r=new tt(n,this),o=r.u(this.options);r.p(t),this.T(o),this._$AH=r}}_$AC(e){let t=Ht.get(e.strings);return t===void 0&&Ht.set(e.strings,t=new D(e)),t}k(e){at(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,s,n=0;for(let r of e)n===t.length?t.push(s=new i(this.O(U()),this.O(U()),this,this.options)):s=t[n],s._$AI(r),n++;n<t.length&&(this._$AR(s&&s._$AB.nextSibling,n),t.length=n)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let s=Et(e).nextSibling;Et(e).remove(),e=s}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},N=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,n,r){this.type=1,this._$AH=h,this._$AN=void 0,this.element=e,this.name=t,this._$AM=n,this.options=r,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=h}_$AI(e,t=this,s,n){let r=this.strings,o=!1;if(r===void 0)e=P(this,e,t,0),o=!W(e)||e!==this._$AH&&e!==R,o&&(this._$AH=e);else{let c=e,l,d;for(e=r[0],l=0;l<r.length-1;l++)d=P(this,c[s+l],t,l),d===R&&(d=this._$AH[l]),o||=!W(d)||d!==this._$AH[l],d===h?e=h:e!==h&&(e+=(d??"")+r[l+1]),this._$AH[l]=d}o&&!n&&this.j(e)}j(e){e===h?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},et=class extends N{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===h?void 0:e}},st=class extends N{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==h)}},nt=class extends N{constructor(e,t,s,n,r){super(e,t,s,n,r),this.type=5}_$AI(e,t=this){if((e=P(this,e,t,0)??h)===R)return;let s=this._$AH,n=e===h&&s!==h||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,r=e!==h&&(s===h||n);n&&this.element.removeEventListener(this.name,this,s),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},it=class{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){P(this,e)}};var pe=rt.litHtmlPolyfillSupport;pe?.(D,F),(rt.litHtmlVersions??=[]).push("3.3.3");var Ot=(i,e,t)=>{let s=t?.renderBefore??e,n=s._$litPart$;if(n===void 0){let r=t?.renderBefore??null;s._$litPart$=n=new F(e.insertBefore(U(),r),r,void 0,t??{})}return n._$AI(i),n};var lt=globalThis,m=class extends _{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Ot(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return R}};m._$litElement$=!0,m.finalized=!0,lt.litElementHydrateSupport?.({LitElement:m});var ue=lt.litElementPolyfillSupport;ue?.({LitElement:m});(lt.litElementVersions??=[]).push("4.2.2");function Zt(i){return i.callWS({type:"raincast/entries"})}function It(i,e,t){return i.callWS({type:"raincast/set_options",entry_id:e,notify_service:t})}function Ut(i,e,t){return i.callWS({type:"raincast/update_sources",entry_id:e,...t})}function Wt(i,e,t){return i.callWS({type:"raincast/add_zone",entry_id:e,...t})}function Dt(i,e,t,s){return i.callWS({type:"raincast/update_zone",entry_id:e,zone_id:t,...s})}function Ft(i,e,t){return i.callWS({type:"raincast/remove_zone",entry_id:e,zone_id:t})}function Vt(i,e){return i.callService("button","press",{entity_id:e})}function V(i){return i.valves.map((e,t)=>i.entities[`duration_${t}`])}function jt(i){return i.valves.map((e,t)=>i.entities[`max_flow_${t}`])}function Bt(i,e,t=new Date){let s=t.getMonth()+1;return i<=e?s>=i&&s<=e:s>=i||s<=e}function dt(i,e){for(let t of i.log){let s=t.zones.find(n=>n.key===e);if(s)return s}}function Kt(i,e,t,s){return i.callWS({type:"raincast/run_zone",entry_id:e,zone_id:t,minutes:s})}var me={loading:"Loading\u2026",no_entry:"No RainCast controller is set up. Add one under Settings \u2192 Devices & services.","tab.home":"Home","tab.history":"History","tab.settings":"Settings","tab.guide":"Guide","home.control_on":"Valve control on","home.dry_run":"Dry run","home.watering":"Watering {zone}","home.valve_ends":"until about {time}","home.next_start":"Next start {day}, {time}","home.planned_now":"{minutes} min due if it started now","home.no_start":"No zone has a start","home.no_start_hint":"Manual runs still work.","home.automatic_off":"Automatic off","home.automatic_off_title":"Automatic watering is off","home.out_of_season":"Out of season","home.outdoor":"Outdoor","home.frost_below":"frost below {limit} \xB0C","home.stop":"Stop","home.run_due":"Water due zones","home.control_needed":"Turn on Valve control in the settings first.","home.weather":"Weather","home.soil":"Soil moisture","home.rain":"Rain forecast","home.not_configured":"not set","home.no_value":"no value","home.weather_hint":"Zones open to the sky are held while the rain forecast is above its limit, the line in the middle of the bar. Below the frost limit no zone is watered.","home.problems":"Problems","status.watering":"Watering","status.due":"Due","status.waiting":"Waiting","status.frost":"Frost","status.wet_soil":"Soil wet","status.rain_forecast":"Rain forecast","status.no_duration":"No valve time","status.unknown":"Unknown","zone.last_watered":"Last watered","zone.next_due":"Next due","zone.minutes":"{minutes} min","zone.interval":"Water every","zone.never":"never","zone.days_ago":"{days} days ago","zone.every_days":"every {days} days","zone.next_start":"Next start","zone.no_start":"off","zone.soil":"Soil","zone.start":"Start","zone.start_time":"Start time","zone.sunrise_offset":"Hours before sunrise","zone.soil_max":"Soil limit","zone.soil_sensor":"Soil moisture of this zone","zone.soil_sensor_hint":"Optional, sensor or input number in %. A zone without one does not look at the soil.","zone.water":"Water","zone.last_run_liters":"{liters} l last run","zone.total_liters":"{liters} l in total","zone.flow":"{flow} l/min","zone.time":"Time","zone.max_flow":"Flow limit","zone.max_flow_hint":"A valve whose mean flow goes above its limit is closed and reported, for a broken pipe or sprinkler. 0 turns the check off.","zone.settings":"Settings","zone.manual":"Manual","zone.manual_hint":"Each valve runs for the minutes given, 0 leaves it out. The zone counts as watered only at its own full time.","zone.run_start":"Start","zone.cancel":"Cancel","zone.name":"Name","zone.valves":"Valves, in the order they run","zone.roofed":"Under a roof","zone.roofed_hint":"The rain forecast does not hold a greenhouse or a covered bed; its soil sensor and frost still do.","zone.new_hint":"A new zone starts with a 3-day interval and 15 minutes per valve; both are changed here afterwards.","zone.edit_hint":"Saving reloads RainCast. A valve added here starts with the zone's starting time.","zone.remove_confirm":"Remove {name}? Its entities are removed; recorded history stays.","problem.valve_unavailable":"A valve has been unavailable for 30 minutes.","problem.valve_not_opened":"A valve did not open in its latest run.","problem.valve_not_closed":"A valve still reports open after the stop command.","problem.no_flow":"A valve was open without water through the meter.","problem.flow_high":"A valve was closed for flow above its limit.","problem.weather_lost":"A weather input has had no value for an hour.","history.runs":"Runs","history.no_runs":"No run yet.","history.watered":"{watered} of {planned} min","history.not_opened":"did not open: {valves}","history.interrupted":"Stopped before the end.","history.no_flow":"no water","history.flow_high":"closed, flow too high","history.water":"Water per zone, 30 days","history.weather":"Soil and rain, 7 days","history.valves":"Valves, 7 days","reason.scheduled":"Daily start","reason.manual":"Manual","reason.zone":"Single zone","reason.restart":"Cut off by a restart","mode.before_sunrise":"Before sunrise","mode.at_time":"At a fixed time","mode.off":"Off","src.rain_sensor":"Rain forecast","src.water_meter":"Water meter","src.weather":"Weather","src.outdoor_sensor":"Outdoor temperature","src.zone_soil":"soil sensor of the zone","src.water":"Water","src.zones":"Zones","src.native":"run time sent with the start","src.open_close":"opened and closed by RainCast","action.edit":"Edit","action.save":"Save","action.remove":"Remove","action.add_zone":"Add zone","action.add_valve":"Add valve","settings.control_title":"Valves","settings.control":"Valve control","settings.control_hint":"Off: the plan is sent as a dry run and no valve is opened.","settings.control_confirm":"RainCast will open the valves at the daily start. Turn off every other schedule watering the same valves first.","settings.confirm":"Turn on","settings.cancel":"Cancel","settings.automatic":"Automatic watering","settings.automatic_hint":"Off: no zone starts by itself and no plan is sent; manual runs still work.","settings.season":"Season and weather","settings.season_start":"Season starts","settings.season_end":"Season ends","settings.season_hint":"Outside the season no zone starts by itself, for example over the winter. Manual runs still work.","settings.rain_max":"Rain limit","settings.frost_min":"Frost limit","settings.limits_hint":"Zones open to the sky are held while more rain is forecast than the rain limit. Below the frost limit no zone starts, roofed or not. Each zone has its own start and soil limit, under Zones.","settings.zone_start_hint":"Watering before sunrise loses the least water to evaporation and leaves the lawn dry by day.","settings.sources":"Connected entities","settings.sources_hint":"Edit changes the weather inputs and the water meter; valves and soil sensors are changed with the pencil of their zone.","settings.reload_hint":"Saving reloads RainCast; dates, intervals and valve times are kept.","settings.zones":"Zones","settings.notifications":"Problems and notifications","settings.no_problems":"No problems right now.","settings.notify_service":"Notify service","settings.notify_none":"No notifications","settings.notify_hint":"Receives the day's plan, the end of every run and problems.","settings.entities":"Entities and devices","settings.admin_only":"Only administrators can change settings."},C="en";function Gt(){return(i,e)=>{let t=me[i]??i;for(let[s,n]of Object.entries(e??{}))t=t.replace(`{${s}}`,String(n));return t}}function v(i,e=1){return i==null||!Number.isFinite(i)?"\u2013":i.toLocaleString(C,{minimumFractionDigits:e,maximumFractionDigits:e})}function H(i){return i.toLocaleTimeString(C,{hour:"2-digit",minute:"2-digit",hourCycle:"h23"})}function M(i){let e=new Date;e.setHours(0,0,0,0);let t=new Date(i);t.setHours(0,0,0,0);let s=Math.round((t.getTime()-e.getTime())/864e5);return s===0?"today":s===1?"tomorrow":s===-1?"yesterday":i.toLocaleDateString(C,{weekday:"short",day:"numeric",month:"short"})}var y=f`
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
`;var fe=["Zone start","Interval","Frost, soil, rain","Plan","Valves one by one","Measured time"],ve=i=>a`<div class="pipeline">${i.map(e=>a`<span class="chip">${e}</span>`)}</div>`,ge=[{icon:"mdi:information-outline",title:"How RainCast works",body:a`
      <p>
        Each zone starts once a day at its own time, a number of hours before sunrise or at a fixed time. RainCast then
        decides whether the zone needs water and waters it one valve after another. Only one valve runs at a time, so the
        water pressure stays the same for every zone: zones starting together run as one, and a start during a run waits
        for it to end.
      </p>
      ${ve(fe)}
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
    `}],ct=class extends m{render(){return a`
      <div class="guide">
        ${ge.map((e,t)=>a`
            <details class="card" ?open=${t===0}>
              <summary><ha-icon icon=${e.icon}></ha-icon><span>${e.title}</span></summary>
              <div class="body">${e.body}</div>
            </details>
          `)}
      </div>
    `}static{this.styles=[y,f`
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
    `]}};customElements.get("raincast-guide")??customElements.define("raincast-guide",ct);var qt;async function Jt(i){if(window.loadCardHelpers)return qt??=window.loadCardHelpers(),(await qt).createCardElement(i)}function b(i,e){if(!e)return;let t=Number.parseFloat(i.states[e]?.state??"");return Number.isFinite(t)?t:void 0}function w(i,e){return!!e&&i.states[e]?.state==="on"}function x(i,e,t){i.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0}))}var Yt=168,ye=30,ht=class extends m{constructor(){super(...arguments);this.cards=[]}static{this.properties={hass:{attribute:!1},entry:{attribute:!1},localize:{attribute:!1}}}updated(){this.cardsFor!==this.entry&&(this.cardsFor=this.entry,this.buildCards());for(let t of this.cards)t.hass=this.hass}async buildCards(){let t=this.localize,s=[...this.entry.zones.map(d=>d.soil_sensor),this.entry.sources.rain_sensor].filter(d=>!!d),n=this.entry.zones.flatMap(d=>d.valves),r=this.entry.zones.map(d=>d.entities.water_used?{entity:d.entities.water_used,name:d.name}:null).filter(d=>d!==null),o=[r.length?{type:"statistics-graph",title:t("history.water"),entities:r,stat_types:["change"],chart_type:"bar",period:"day",days_to_show:ye}:null,s.length?{type:"history-graph",title:t("history.weather"),hours_to_show:Yt,entities:s}:null,n.length?{type:"history-graph",title:t("history.valves"),hours_to_show:Yt,entities:n}:null].filter(d=>d!==null),c=await Promise.all(o.map(d=>Jt(d)));this.cards=c.filter(d=>!!d);let l=this.renderRoot.querySelector(".graphs");if(l){l.replaceChildren(...this.cards);for(let d of this.cards)d.hass=this.hass}}render(){let t=this.localize;return a`
      <div class="layout">
        <section class="card">
          <h2><ha-icon icon="mdi:history"></ha-icon>${t("history.runs")}</h2>
          ${this.entry.log.length?a`<div class="runs">${this.entry.log.map(s=>this.renderRun(s))}</div>`:a`<p class="muted">${t("history.no_runs")}</p>`}
        </section>
        <div class="graphs"></div>
      </div>
    `}renderRun(t){let s=this.localize,n=t.started?new Date(t.started):void 0,r=t.ended?new Date(t.ended):void 0,o=!t.interrupted&&t.zones.every(l=>l.watered),c=n?`${M(n)} ${H(n)}${r?`\u2013${H(r)}`:""}`:"\u2013";return a`
      <div class="run">
        <div class="run-head">
          <ha-icon
            class=${o?"ok":"warn"}
            icon=${o?"mdi:check-circle":"mdi:alert-circle-outline"}
          ></ha-icon>
          <span class="grow">${c}</span>
          <span class="chip">${s(`reason.${t.reason}`)}</span>
        </div>
        ${t.zones.map(l=>a`
            <div class="zone-row">
              <span>${l.name}</span>
              <span class=${l.watered?"":"warn-text"}>
                ${s("history.watered",{watered:v(l.watered_min,0),planned:v(l.planned_min,0)})}
                ${l.liters!==null&&l.liters!==void 0?a` · ${v(l.liters,0)} l`:h}
              </span>
            </div>
            ${(l.valves??[]).map(d=>this.renderValve(d))}
            ${l.not_opened.length?a`<div class="muted small">${s("history.not_opened",{valves:l.not_opened.map(d=>this.hass.states[d]?.attributes.friendly_name??d).join(", ")})}</div>`:h}
          `)}
        ${t.interrupted?a`<div class="muted small">${s("history.interrupted")}</div>`:h}
      </div>
    `}renderValve(t){let s=this.localize,n=[s("zone.minutes",{minutes:v(t.minutes,1)})];return t.liters!==null&&n.push(`${v(t.liters,0)} l`),t.flow!==null&&n.push(s("zone.flow",{flow:v(t.flow,1)})),a`
      <div class="valve-row muted small">
        <span>${this.hass.states[t.entity_id]?.attributes.friendly_name??t.entity_id}</span>
        <span>
          ${t.no_flow?a`<b class="warn-text">${s("history.no_flow")}</b> · `:h}
          ${t.flow_high?a`<b class="warn-text">${s("history.flow_high")}</b> · `:h} ${n.join(" \xB7 ")}
        </span>
      </div>
    `}static{this.styles=[y,f`
      .layout {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
        gap: var(--rc-gap);
        align-items: start;
      }
      .graphs {
        display: flex;
        flex-direction: column;
        gap: var(--rc-gap);
        min-width: 0;
      }
      @media (max-width: 900px) {
        .layout {
          grid-template-columns: minmax(0, 1fr);
        }
      }
      .runs {
        display: grid;
        gap: 10px;
      }
      .run {
        border-bottom: 1px solid var(--divider-color);
        padding-bottom: 10px;
      }
      .run:last-child {
        border-bottom: none;
      }
      .run-head {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 4px;
      }
      .grow {
        flex: 1;
      }
      ha-icon.ok {
        color: var(--rc-ok);
      }
      ha-icon.warn {
        color: var(--rc-warn);
      }
      .zone-row {
        display: flex;
        justify-content: space-between;
        gap: 8px;
        font-size: 0.9rem;
        padding-left: 28px;
      }
      .small {
        padding-left: 28px;
      }
      .warn-text {
        color: var(--rc-warn);
      }
      .valve-row {
        display: flex;
        justify-content: space-between;
        gap: 8px;
        padding-left: 40px;
      }
    `]}};customElements.get("raincast-history")??customElements.define("raincast-history",ht);function A(i,e,t){let s=e?i.states[e]:void 0;if(!s)return a``;let n=Number.parseFloat(s.state),r=Number(s.attributes.step??1),o=Number(s.attributes.min??-1/0),c=Number(s.attributes.max??1/0),l=r<.01?3:r<.1?2:r<1?1:0,d=s.attributes.unit_of_measurement??"",u=p=>{if(!Number.isFinite(p))return;let g=Math.round(Math.max(Math.min(p,c),o)/r)*r;i.callService("number","set_value",{entity_id:e,value:Number(g.toFixed(4))})};return a`
    <div class="number">
      <span class="label">${t}</span>
      <span class="stepper">
        <button class="round mini" ?disabled=${n<=o} @click=${()=>u(n-r)}>−</button>
        <input
          type="number"
          .value=${Number.isFinite(n)?n.toFixed(l):""}
          step=${r}
          min=${o}
          max=${c}
          @change=${p=>u(Number.parseFloat(p.target.value))}
        />
        <button class="round mini" ?disabled=${n>=c} @click=${()=>u(n+r)}>+</button>
        <span class="unit">${d}</span>
      </span>
    </div>
  `}var L=f`
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
`;var be={watering:"water",due:"ok",waiting:"",frost:"warn",wet_soil:"warn",rain_forecast:"warn",no_duration:"warn"},$e=["open","opening","on"];function Xt(i){return String(i?.message??i)}var pt=class extends m{static{this.properties={hass:{attribute:!1},entry:{attribute:!1},localize:{attribute:!1},error:{state:!0},manual:{state:!0}}}openManual(e){let t=V(e),s=Object.fromEntries(e.valves.map((n,r)=>[n,b(this.hass,t[r])??0]));this.manual={zoneId:e.id,minutes:s},this.error=void 0}async startManual(e){if(this.manual){this.error=void 0;try{await Kt(this.hass,this.entry.entry_id,e.id,this.manual.minutes),this.manual=void 0}catch(t){this.error=Xt(t)}}}async press(e){this.error=void 0;try{await Vt(this.hass,e)}catch(t){this.error=Xt(t)}}name(e){return String(this.hass.states[e]?.attributes.friendly_name??e)}render(){return a`
      <div class="layout">
        <div class="column">${this.renderStatus()} ${this.renderWeather()} ${this.renderProblems()}</div>
        <div class="zones">${this.entry.zones.map(e=>this.renderZone(e))}</div>
      </div>
    `}renderStatus(){let e=this.localize,t=this.entry.entities,s=w(this.hass,t.control),r=this.hass.states[t.running]?.state==="on";return a`
      <section class="card status ${r?"active":""}">
        <div class="headline">
          <ha-icon icon=${r?"mdi:sprinkler-variant":"mdi:calendar-clock"}></ha-icon>
          <div class="grow">${r?this.renderRunning():this.renderNext()}</div>
          ${this.renderModeChip(s)}
        </div>
        ${this.renderPlan()}
        ${this.error?a`<div class="error">${this.error}</div>`:h}
        <div class="actions">
          ${r?a`<button class="text danger" @click=${()=>this.press(t.stop)}>
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
    `}renderModeChip(e){let t=this.localize,s=this.entry.entities;if(!w(this.hass,s.automatic))return a`<span class="chip warn">${t("home.automatic_off")}</span>`;let n=b(this.hass,s.season_start),r=b(this.hass,s.season_end);return n!==void 0&&r!==void 0&&!Bt(n,r)?a`<span class="chip warn">${t("home.out_of_season")}</span>`:a`<span class="chip ${e?"ok":"warn"}">${t(e?"home.control_on":"home.dry_run")}</span>`}renderRunning(){let e=this.localize,t=this.hass.states[this.entry.entities.running]?.attributes??{},s=t.valve?this.name(t.valve):"",n=t.valve_ends?H(new Date(t.valve_ends)):"";return a`
      <div class="big">${e("home.watering",{zone:t.zone??""})}</div>
      <div class="muted small">${s}${n?` \xB7 ${e("home.valve_ends",{time:n})}`:""}</div>
    `}renderNext(){let e=this.localize,t=this.hass.states[this.entry.entities.next_start]?.state,s=t&&!["unknown","unavailable"].includes(t)?new Date(t):void 0;if(!s){let n=!w(this.hass,this.entry.entities.automatic);return a`<div class="big">${e(n?"home.automatic_off_title":"home.no_start")}</div>
        <div class="muted small">${e("home.no_start_hint")}</div>`}return a`
      <div class="big">${e("home.next_start",{day:M(s),time:H(s)})}</div>
      <div class="muted small">${e("home.planned_now",{minutes:this.hass.states[this.entry.entities.planned]?.state??"0"})}</div>
    `}renderPlan(){let e=this.localize,t=this.hass.states[this.entry.entities.planned]?.attributes??{},s=t.due??[],n=t.skipped??{};return a`
      <ul class="plan">
        ${s.map(r=>a`<li><ha-icon class="ok" icon="mdi:check-circle"></ha-icon>${r}</li>`)}
        ${Object.entries(n).map(([r,o])=>a`<li class="muted">
              <ha-icon icon="mdi:skip-next-circle-outline"></ha-icon>${r} · ${e(`status.${o}`)}
            </li>`)}
      </ul>
    `}renderWeather(){let e=this.localize,t=this.entry.sources,s=this.entry.entities;return a`
      <section class="card">
        <h2><ha-icon icon="mdi:weather-partly-rainy"></ha-icon>${e("home.weather")}</h2>
        ${this.renderGauge(e("home.rain"),t.rain_sensor,s.rain_max,"mm")}
        ${t.outdoor_sensor?this.renderGauge(e("home.outdoor"),t.outdoor_sensor,s.frost_min,"\xB0C",!0):h}
        <p class="muted small">${e("home.weather_hint")}</p>
      </section>
    `}renderGauge(e,t,s,n,r=!1){let o=this.localize;if(!t)return a`<div class="gauge"><span>${e}</span><span class="muted">${o("home.not_configured")}</span></div>`;let c=b(this.hass,t),l=b(this.hass,s),u=c!==void 0&&l!==void 0&&(r?c<l:c>l),p=c!==void 0&&l?Math.min(c/(2*l),1):0;return r?a`
        <div class="gauge">
          <span>${e}</span>
          <span class=${u?"warn-text":""}>
            ${c===void 0?o("home.no_value"):`${v(c,1)} ${n}`}
            <span class="muted small">/ ${o("home.frost_below",{limit:v(l,1)})}</span>
          </span>
        </div>
      `:a`
      <div class="gauge">
        <span>${e}</span>
        <span class=${u?"warn-text":""}>
          ${c===void 0?o("home.no_value"):`${v(c,1)} ${n}`}
          <span class="muted small">/ ${v(l,1)} ${n}</span>
        </span>
      </div>
      <div class="bar"><span class=${u?"over":""} style="width: ${p*100}%"></span><i></i></div>
    `}renderProblems(){let e=this.hass.states[this.entry.entities.problem]?.attributes.problems??[];return e.length?a`
      <section class="card problems">
        <h2><ha-icon icon="mdi:alert-circle-outline"></ha-icon>${this.localize("home.problems")}</h2>
        <ul>
          ${e.map(t=>a`<li>${this.localize(`problem.${t}`)}</li>`)}
        </ul>
      </section>
    `:h}renderZone(e){let t=this.localize,s=this.hass.states[e.entities.status],n=s?.state??"unknown",r=this.hass.states[e.entities.last_watered]?.state,o=this.hass.states[e.entities.next_due]?.state,c=b(this.hass,e.entities.interval),l=V(e),d=this.manual?.zoneId===e.id?this.manual:void 0,u=dt(this.entry,e.id);return a`
      <section class="card zone ${n==="watering"?"active":""}">
        <h2>
          <ha-icon icon=${e.roofed?"mdi:greenhouse":"mdi:sprinkler"}></ha-icon>
          <span class="grow">${e.name}</span>
          <span class="chip ${be[n]??""}">${t(`status.${n}`)}</span>
        </h2>
        <dl>
          <dt>${t("zone.last_watered")}</dt>
          <dd>${this.dateText(r,s?.attributes.days_since)}</dd>
          <dt>${t("zone.next_due")}</dt>
          <dd>${this.dateText(o)}</dd>
          <dt>${t("zone.next_start")}</dt>
          <dd>${this.startText(e)}</dd>
          <dt>${t("zone.interval")}</dt>
          <dd>${t("zone.every_days",{days:c??"\u2013"})}</dd>
          ${this.renderSoil(e)} ${this.renderWater(e)}
        </dl>
        <div class="valves">
          ${e.valves.map((p,g)=>{let $=$e.includes(this.hass.states[p]?.state??""),z=u?.valves?.find(q=>q.entity_id===p)?.flow;return a`
              <div class="valve">
                <span class="dot ${$?"open":""}" title=${this.hass.states[p]?.state??""}></span>
                <span class="grow">${this.name(p)}</span>
                ${d?a`<input
                        class="text minutes"
                        type="number"
                        min="0"
                        max="240"
                        step="1"
                        .value=${String(d.minutes[p]??0)}
                        @change=${q=>{let bt=Number.parseFloat(q.target.value);this.manual={...d,minutes:{...d.minutes,[p]:Number.isFinite(bt)?Math.max(0,bt):0}}}}
                      /><span class="unit">min</span>`:a`<span class="muted">
                      ${z!=null?a`${t("zone.flow",{flow:v(z,1)})} · `:h}
                      ${t("zone.minutes",{minutes:v(b(this.hass,l[g]),0)})}
                    </span>`}
              </div>
            `})}
        </div>
        ${d?this.renderManualActions(e):this.renderZoneActions(e)}
      </section>
    `}startText(e){let t=this.hass.states[e.entities.next_start]?.state;if(!t||["unknown","unavailable"].includes(t))return this.localize("zone.no_start");let s=new Date(t);return`${M(s)}, ${H(s)}`}renderSoil(e){let t=this.localize,s=e.soil_sensor;if(!s)return h;let n=b(this.hass,s),r=b(this.hass,e.entities.soil_max),o=n!==void 0&&r!==void 0&&n>r;return a`
      <dt>${t("zone.soil")}</dt>
      <dd>
        <span class=${o?"warn-text":""}>${n===void 0?t("home.no_value"):`${v(n,1)} %`}</span>
        <span class="muted">/ ${v(r,0)} %</span>
      </dd>
    `}renderWater(e){let t=this.localize;if(!e.entities.water_used)return h;let s=b(this.hass,e.entities.water_used),n=dt(this.entry,e.id)?.liters;return a`
      <dt>${t("zone.water")}</dt>
      <dd>
        ${n!=null?t("zone.last_run_liters",{liters:v(n,0)}):"\u2013"}
        <span class="muted">· ${t("zone.total_liters",{liters:v(s,0)})}</span>
      </dd>
    `}renderZoneActions(e){let t=this.localize;return a`
      <div class="actions">
        <button class="text" @click=${()=>x(this,"raincast-open-zone",e.id)}>
          <ha-icon icon="mdi:cog-outline"></ha-icon> ${t("zone.settings")}
        </button>
        <button class="text primary" @click=${()=>this.openManual(e)}>
          <ha-icon icon="mdi:hand-water"></ha-icon> ${t("zone.manual")}
        </button>
      </div>
    `}renderManualActions(e){let t=this.localize,s=w(this.hass,this.entry.entities.control),n=w(this.hass,this.entry.entities.running),r=Object.values(this.manual?.minutes??{}).some(o=>o>0);return a`
      <p class="muted small">${t(s?"zone.manual_hint":"home.control_needed")}</p>
      <div class="actions">
        <button class="text" @click=${()=>this.manual=void 0}>${t("zone.cancel")}</button>
        <button
          class="text primary"
          ?disabled=${!s||n||!r}
          @click=${()=>this.startManual(e)}
        >
          <ha-icon icon="mdi:play"></ha-icon> ${t("zone.run_start")}
        </button>
      </div>
    `}dateText(e,t){let s=this.localize;if(!e||["unknown","unavailable"].includes(e))return s("zone.never");let n=new Date(`${e}T00:00:00`),r=M(n);return t==null||t<2?r:`${r} \xB7 ${s("zone.days_ago",{days:t})}`}static{this.styles=[y,L,f`
      .layout {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
        gap: var(--rc-gap);
        align-items: start;
      }
      .column {
        display: flex;
        flex-direction: column;
        gap: var(--rc-gap);
        min-width: 0;
      }
      .zones {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: var(--rc-gap);
        align-items: start;
      }
      @media (max-width: 900px) {
        .layout {
          grid-template-columns: minmax(0, 1fr);
        }
      }
      .card.active {
        border-color: var(--rc-water);
        box-shadow: 0 0 0 1px var(--rc-water);
      }
      .headline {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .headline ha-icon {
        --mdc-icon-size: 32px;
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
      .plan {
        list-style: none;
        margin: 12px 0 0;
        padding: 0;
        display: grid;
        gap: 4px;
      }
      .plan li {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .plan ha-icon {
        --mdc-icon-size: 18px;
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
    `]}};customElements.get("raincast-home")??customElements.define("raincast-home",pt);var ut=class extends m{constructor(){super(...arguments);this.domains=[];this.optional=!1}static{this.properties={hass:{attribute:!1},domains:{attribute:!1},deviceClass:{attribute:!1},value:{attribute:!1},optional:{type:Boolean}}}options(){return Object.values(this.hass.states).filter(s=>{let n=this.domains.includes(s.entity_id.split(".")[0]),r=!this.deviceClass||s.attributes.device_class===this.deviceClass;return n&&(r||s.entity_id===this.value)}).map(s=>({id:s.entity_id,name:String(s.attributes.friendly_name??s.entity_id)})).sort((s,n)=>s.name.localeCompare(n.name))}render(){let t=this.options(),s=!this.value||t.some(n=>n.id===this.value);return a`
      <select
        @change=${n=>{let r=n.target.value;x(this,"value-changed",r||null)}}
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
  `}};customElements.get("raincast-entity-picker")??customElements.define("raincast-entity-picker",ut);var Qt=[{title:"src.weather",fields:[{key:"rain_sensor",label:"src.rain_sensor",domains:["sensor","input_number"]},{key:"outdoor_sensor",label:"src.outdoor_sensor",domains:["sensor"],deviceClass:"temperature"}]},{title:"src.water",fields:[{key:"water_meter",label:"src.water_meter",domains:["sensor"],deviceClass:"water"}]}],_e=Qt.flatMap(i=>i.fields),we=["valve","switch","input_boolean"],xe=["sensor","input_number"],Ae=["before_sunrise","at_time","off"],ze=3,Ee=15;function te(i){return String(i?.message??i)}function mt(i,e){return e?String(i.states[e]?.attributes.friendly_name??e):"\u2013"}function Se(i,e){let t=i.states[e];if(!t)return"missing";let s=t.attributes.unit_of_measurement,n=Number(t.state),r=t.state!==""&&Number.isFinite(n)?n.toLocaleString(C,{maximumFractionDigits:3}):t.state;return s?`${r} ${s}`:r}var ft=class extends m{constructor(){super(...arguments);this.saving=!1}static{this.properties={hass:{attribute:!1},entry:{attribute:!1},localize:{attribute:!1},draft:{state:!0},error:{state:!0},saving:{state:!0}}}async save(){if(this.draft){this.saving=!0;try{await Ut(this.hass,this.entry.entry_id,this.draft),this.draft=void 0,x(this,"raincast-entries-changed")}catch(t){this.error=te(t)}finally{this.saving=!1}}}render(){let t=this.localize;return a`
      <section class="card">
        <h2>${t("settings.sources")}</h2>
        ${this.draft?this.renderForm():this.renderSummary()}
      </section>
    `}renderSummary(){let t=this.localize;return a`
      ${Qt.map(s=>a`
          <h3>${t(s.title)}</h3>
          ${s.fields.map(n=>this.renderEntity(t(n.label),this.entry.sources[n.key]))}
        `)}
      <h3>${t("src.zones")}</h3>
      ${this.entry.zones.map(s=>a`
          <div class="zone-name">${s.name}</div>
          ${s.soil_sensor?this.renderEntity(mt(this.hass,s.soil_sensor),s.soil_sensor,t("src.zone_soil")):h}
          ${s.valves.map(n=>this.renderEntity(mt(this.hass,n),n,t(this.entry.native_valves.includes(n)?"src.native":"src.open_close")))}
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
    `}renderEntity(t,s,n){let r=this.localize,o=!!s&&!this.hass.states[s],c=!!s&&["unavailable","unknown"].includes(this.hass.states[s]?.state??"");return a`
      <div class="entity">
        <div class="grow">
          <div>${t}</div>
          <div class="muted small" title=${s??""}>
            ${s?a`${s}${n?` \xB7 ${n}`:""}`:r("home.not_configured")}
          </div>
        </div>
        ${s?a`<span class="value ${o||c?"bad":""}">${Se(this.hass,s)}</span>`:h}
      </div>
    `}renderForm(){let t=this.localize,s=this.draft;return a`
      ${_e.map(n=>a`
          <div class="field">
            <label>${t(n.label)}</label>
            <raincast-entity-picker
              .hass=${this.hass}
              .domains=${n.domains}
              .deviceClass=${n.deviceClass}
              .value=${s[n.key]}
              optional
              @value-changed=${r=>this.draft={...s,[n.key]:r.detail}}
            ></raincast-entity-picker>
          </div>
        `)}
      <p class="muted small">${t("settings.reload_hint")}</p>
      ${this.error?a`<div class="error">${this.error}</div>`:h}
      <div class="actions">
        <button class="text" @click=${()=>this.draft=void 0}>${t("settings.cancel")}</button>
        <button class="text primary" ?disabled=${this.saving} @click=${this.save}>${t("action.save")}</button>
      </div>
    `}static{this.styles=[y,L,f`
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
    `]}},vt=class extends m{constructor(){super(...arguments);this.confirmRemove=!1;this.saving=!1}static{this.properties={hass:{attribute:!1},entry:{attribute:!1},localize:{attribute:!1},focusZone:{attribute:!1},editing:{state:!0},draft:{state:!0},confirmRemove:{state:!0},error:{state:!0},saving:{state:!0}}}startEdit(t){this.editing=t?.id??"new",this.draft={name:t?.name??"",valves:[...t?.valves??[]],roofed:t?.roofed??!1,soil_sensor:t?.soil_sensor??null},this.confirmRemove=!1,this.error=void 0}stopEdit(){this.editing=void 0,this.draft=void 0}async run(t){this.saving=!0;try{await t(),this.stopEdit(),x(this,"raincast-entries-changed")}catch(s){this.error=te(s)}finally{this.saving=!1}}render(){let t=this.localize,s=!!this.entry.sources.water_meter;return a`
      <section class="card">
        <h2>${t("settings.zones")}</h2>
        ${this.entry.zones.map(n=>this.editing===n.id?this.renderForm(n):this.renderZone(n))}
        ${this.editing==="new"?this.renderForm():a`<div class="actions">
              <button class="text primary" @click=${()=>this.startEdit()}>+ ${t("action.add_zone")}</button>
            </div>`}
        ${s?a`<p class="muted small">${t("zone.max_flow_hint")}</p>`:h}
      </section>
    `}updated(t){t.has("focusZone")&&this.focusZone&&this.renderRoot.querySelector(`[data-zone="${this.focusZone}"]`)?.scrollIntoView({behavior:"smooth",block:"center"})}renderZone(t){let s=this.localize,n=V(t),r=jt(t);return a`
      <div class="zone-block ${t.id===this.focusZone?"focus":""}" data-zone=${t.id}>
        <div class="zone">
          <ha-icon icon=${t.roofed?"mdi:greenhouse":"mdi:sprinkler"}></ha-icon>
          <div class="grow">
            ${t.name}${t.roofed?a` <span class="muted small">· ${s("zone.roofed")}</span>`:h}
          </div>
          <button class="text icon" title=${s("action.edit")} @click=${()=>this.startEdit(t)}>
            <ha-icon icon="mdi:pencil"></ha-icon>
          </button>
        </div>
        ${this.renderStart(t)} ${A(this.hass,t.entities.interval,s("zone.interval"))}
        ${A(this.hass,t.entities.soil_max,s("zone.soil_max"))}
        ${t.valves.map((o,c)=>a`
            <div class="valve-tuning">
              <div class="valve-name">${mt(this.hass,o)}</div>
              ${A(this.hass,n[c],s("zone.time"))}
              ${A(this.hass,r[c],s("zone.max_flow"))}
            </div>
          `)}
      </div>
    `}renderStart(t){let s=this.localize,n=this.hass.states[t.entities.start_mode]?.state,r=this.hass.states[t.entities.start_time]?.state??"";return a`
      <div class="number">
        <span class="label">${s("zone.start")}</span>
        <select
          class="start"
          @change=${o=>this.hass.callService("select","select_option",{entity_id:t.entities.start_mode,option:o.target.value})}
        >
          ${Ae.map(o=>a`<option value=${o} ?selected=${o===n}>${s(`mode.${o}`)}</option>`)}
        </select>
      </div>
      ${n==="before_sunrise"?A(this.hass,t.entities.sunrise_offset,s("zone.sunrise_offset")):h}
      ${n==="at_time"?a`<div class="number">
            <span class="label">${s("zone.start_time")}</span>
            <input
              class="text"
              type="time"
              .value=${r.slice(0,5)}
              @change=${o=>this.hass.callService("time","set_value",{entity_id:t.entities.start_time,time:`${o.target.value}:00`})}
            />
          </div>`:h}
    `}renderForm(t){let s=this.localize,n=this.draft,r=n.valves.filter(d=>!!d),o=n.name.trim().length>0&&r.length>0,c=(d,u)=>{let p=[...n.valves];p[d]=u??"",this.draft={...n,valves:p}},l=()=>{let d={...n,valves:r};return this.run(()=>t?Dt(this.hass,this.entry.entry_id,t.id,d):Wt(this.hass,this.entry.entry_id,{...d,interval:ze,duration:Ee}))};return a`
      <div class="form">
        <div class="field">
          <label>${s("zone.name")} *</label>
          <input
            class="text"
            .value=${n.name}
            @input=${d=>this.draft={...n,name:d.target.value}}
          />
        </div>
        <label class="check">
          <input
            type="checkbox"
            .checked=${n.roofed}
            @change=${d=>this.draft={...n,roofed:d.target.checked}}
          />
          <span>${s("zone.roofed")}<br /><span class="muted small">${s("zone.roofed_hint")}</span></span>
        </label>
        <div class="field">
          <label>${s("zone.soil_sensor")}</label>
          <raincast-entity-picker
            .hass=${this.hass}
            .domains=${xe}
            .value=${n.soil_sensor}
            optional
            @value-changed=${d=>this.draft={...n,soil_sensor:d.detail}}
          ></raincast-entity-picker>
          <span class="muted small">${s("zone.soil_sensor_hint")}</span>
        </div>
        <div class="field">
          <label>${s("zone.valves")} *</label>
          ${n.valves.map((d,u)=>a`
              <div class="valve-row">
                <raincast-entity-picker
                  .hass=${this.hass}
                  .domains=${we}
                  .value=${d||null}
                  optional
                  @value-changed=${p=>c(u,p.detail)}
                ></raincast-entity-picker>
                <button
                  class="text icon"
                  title=${s("action.remove")}
                  @click=${()=>this.draft={...n,valves:n.valves.filter((p,g)=>g!==u)}}
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
                @click=${()=>this.run(()=>Ft(this.hass,this.entry.entry_id,t.id))}
              >
                ${s("action.remove")}
              </button>
            </div>`:h}
        <div class="actions">
          ${t?a`<button class="text danger" @click=${()=>this.confirmRemove=!0}>${s("action.remove")}</button>`:h}
          <span class="spacer"></span>
          <button class="text" @click=${()=>this.stopEdit()}>${s("settings.cancel")}</button>
          <button class="text primary" ?disabled=${!o||this.saving} @click=${l}>
            ${s(t?"action.save":"action.add_zone")}
          </button>
        </div>
      </div>
    `}static{this.styles=[y,L,f`
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
    `]}};customElements.get("raincast-sources-card")??customElements.define("raincast-sources-card",ft);customElements.get("raincast-zones-card")??customElements.define("raincast-zones-card",vt);var ke=Array.from({length:12},(i,e)=>new Date(2026,e,1).toLocaleDateString(C,{month:"long"})),gt=class extends m{constructor(){super(...arguments);this.confirming=!1}static{this.properties={hass:{attribute:!1},entry:{attribute:!1},localize:{attribute:!1},focusZone:{attribute:!1},confirming:{state:!0}}}render(){return this.hass.user?.is_admin?a`
      <div class="layout">
        <div class="column">${this.renderControl()} ${this.renderSeason()}</div>
        <div class="column">
          <raincast-zones-card
            .hass=${this.hass}
            .entry=${this.entry}
            .localize=${this.localize}
            .focusZone=${this.focusZone}
          ></raincast-zones-card>
        </div>
        <div class="column">
          <raincast-sources-card .hass=${this.hass} .entry=${this.entry} .localize=${this.localize}></raincast-sources-card>
          ${this.renderNotifications()}
        </div>
      </div>
      <p class="small">
        <a href="/config/integrations/integration/raincast">${this.localize("settings.entities")}</a>
      </p>
    `:a`<section class="card muted">${this.localize("settings.admin_only")}</section>`}renderToggle(t,s,n,r){return a`
      <div class="toggle-row">
        <div>
          <div>${this.localize(t)}</div>
          <div class="muted small">${this.localize(s)}</div>
        </div>
        <button class="toggle ${n?"on":""}" role="switch" aria-checked=${n} @click=${()=>r(!n)}>
          <span></span>
        </button>
      </div>
    `}renderControl(){let t=this.localize,s=this.entry.entities.control,n=r=>this.hass.callService("switch",r?"turn_on":"turn_off",{entity_id:s});return a`
      <section class="card">
        <h2>${t("settings.control_title")}</h2>
        ${this.renderToggle("settings.control","settings.control_hint",w(this.hass,s),r=>{if(r){this.confirming=!0;return}n(!1)})}
        ${this.confirming?a`<div class="confirm">
              <span>${t("settings.control_confirm")}</span>
              <button class="text" @click=${()=>this.confirming=!1}>${t("settings.cancel")}</button>
              <button
                class="text primary"
                @click=${()=>{this.confirming=!1,n(!0)}}
              >
                ${t("settings.confirm")}
              </button>
            </div>`:h}
        ${this.renderToggle("settings.automatic","settings.automatic_hint",w(this.hass,this.entry.entities.automatic),r=>this.hass.callService("switch",r?"turn_on":"turn_off",{entity_id:this.entry.entities.automatic}))}
      </section>
    `}renderSeason(){let t=this.localize,s=this.entry.entities,n=(r,o)=>a`
      <div class="number">
        <span class="label">${t(o)}</span>
        <select
          class="month"
          @change=${c=>this.hass.callService("select","select_option",{entity_id:r,option:c.target.value})}
        >
          ${ke.map((c,l)=>a`<option value=${l+1} ?selected=${this.hass.states[r]?.state===String(l+1)}>
                ${c}
              </option>`)}
        </select>
      </div>
    `;return a`
      <section class="card">
        <h2>${t("settings.season")}</h2>
        ${n(s.season_start,"settings.season_start")} ${n(s.season_end,"settings.season_end")}
        <p class="muted small">${t("settings.season_hint")}</p>
        ${A(this.hass,s.rain_max,t("settings.rain_max"))}
        ${A(this.hass,s.frost_min,t("settings.frost_min"))}
        <p class="muted small">${t("settings.limits_hint")}</p>
      </section>
    `}renderNotifications(){let t=this.localize,s=this.hass.states[this.entry.entities.problem]?.attributes.problems??[],n=[...this.entry.notify_services],r=this.entry.notify_service;return r&&!n.includes(r)&&n.unshift(r),a`
      <section class="card">
        <h2>${t("settings.notifications")}</h2>
        ${s.length?a`<ul class="problems">
              ${s.map(o=>a`<li>${t(`problem.${o}`)}</li>`)}
            </ul>`:a`<p class="muted">${t("settings.no_problems")}</p>`}
        <div class="field">
          <label>${t("settings.notify_service")}</label>
          <select
            @change=${async o=>{let c=o.target.value||null;await It(this.hass,this.entry.entry_id,c),x(this,"raincast-entries-changed")}}
          >
            <option value="" ?selected=${!r}>${t("settings.notify_none")}</option>
            ${n.map(o=>a`<option value=${o} ?selected=${o===r}>notify.${o}</option>`)}
          </select>
        </div>
        <p class="muted small">${t("settings.notify_hint")}</p>
      </section>
    `}static{this.styles=[y,L,f`
      /* Every card has a fixed column, so a card that grows never moves the others. */
      .layout {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: var(--rc-gap);
        align-items: start;
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
    `]}};customElements.get("raincast-settings")??customElements.define("raincast-settings",gt);var Te=[{id:"home",label:"tab.home",icon:"mdi:sprinkler-variant"},{id:"history",label:"tab.history",icon:"mdi:chart-line"},{id:"settings",label:"tab.settings",icon:"mdi:tune-variant"},{id:"guide",label:"tab.guide",icon:"mdi:book-open-variant"}],Re=1500,yt=class extends m{constructor(){super(...arguments);this.narrow=!1;this.tab="home";this.loading=!1;this.localize=Gt();this.openZone=t=>{this.focusZone=t.detail,this.tab="settings"};this.entriesChanged=()=>{window.setTimeout(()=>this.load(),Re)}}static{this.properties={hass:{attribute:!1},narrow:{type:Boolean},entries:{state:!0},entryId:{state:!0},tab:{state:!0},focusZone:{state:!0},error:{state:!0}}}willUpdate(t){t.has("hass")&&this.hass&&!this.entries&&!this.loading&&this.load();let s=this.entries?.find(r=>r.entry_id===this.entryId),n=s?this.hass.states[s.entities.running]?.state:void 0;this.wasRunning==="on"&&n==="off"&&this.entriesChanged(),this.wasRunning=n}async load(){this.loading=!0;try{this.entries=await Zt(this.hass),this.entries.some(s=>s.entry_id===this.entryId)||(this.entryId=this.entries[0]?.entry_id),this.error=void 0}catch(t){this.error=String(t?.message??t)}finally{this.loading=!1}}selectTab(t){this.tab=t,this.focusZone=void 0}connectedCallback(){super.connectedCallback(),this.addEventListener("raincast-entries-changed",this.entriesChanged),this.addEventListener("raincast-open-zone",this.openZone),this.hass&&this.load()}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("raincast-entries-changed",this.entriesChanged),this.removeEventListener("raincast-open-zone",this.openZone)}render(){let t=this.entries?.find(s=>s.entry_id===this.entryId);return a`
      <div class="header">
        <div class="toolbar">
          <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
          <div class="title">${t?.title??"RainCast"}</div>
          ${(this.entries?.length??0)>1?a`<select @change=${s=>this.entryId=s.target.value}>
                ${this.entries.map(s=>a`<option value=${s.entry_id} ?selected=${s.entry_id===this.entryId}>${s.title}</option>`)}
              </select>`:h}
        </div>
        <nav>
          ${Te.map(s=>a`
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
        ></raincast-settings>`;default:return a`<raincast-home .hass=${s.hass} .entry=${t} .localize=${s.localize}></raincast-home>`}}static{this.styles=[y,f`
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
    `]}};customElements.get("raincast-panel")??customElements.define("raincast-panel",yt);
