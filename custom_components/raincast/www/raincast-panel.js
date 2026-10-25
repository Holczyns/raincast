var V=globalThis,j=V.ShadowRoot&&(V.ShadyCSS===void 0||V.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,G=Symbol(),bt=new WeakMap,N=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==G)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(j&&t===void 0){let s=e!==void 0&&e.length===1;s&&(t=bt.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&bt.set(e,t))}return t}toString(){return this.cssText}},$t=n=>new N(typeof n=="string"?n:n+"",void 0,G),v=(n,...t)=>{let e=n.length===1?n[0]:t.reduce((s,i,r)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+n[r+1],n[0]);return new N(e,n,G)},xt=(n,t)=>{if(j)n.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let s=document.createElement("style"),i=V.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,n.appendChild(s)}},J=j?n=>n:n=>n instanceof CSSStyleSheet?(t=>{let e="";for(let s of t.cssRules)e+=s.cssText;return $t(e)})(n):n;var{is:te,defineProperty:ee,getOwnPropertyDescriptor:se,getOwnPropertyNames:ie,getOwnPropertySymbols:ne,getPrototypeOf:re}=Object,B=globalThis,_t=B.trustedTypes,ae=_t?_t.emptyScript:"",oe=B.reactiveElementPolyfillSupport,M=(n,t)=>n,X={toAttribute(n,t){switch(t){case Boolean:n=n?ae:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,t){let e=n;switch(t){case Boolean:e=n!==null;break;case Number:e=n===null?null:Number(n);break;case Object:case Array:try{e=JSON.parse(n)}catch{e=null}}return e}},At=(n,t)=>!te(n,t),wt={attribute:!0,type:String,converter:X,reflect:!1,useDefault:!1,hasChanged:At};Symbol.metadata??=Symbol("metadata"),B.litPropertyMetadata??=new WeakMap;var $=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=wt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&ee(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){let{get:i,set:r}=se(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:i,set(o){let c=i?.call(this);r?.call(this,o),this.requestUpdate(t,c,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??wt}static _$Ei(){if(this.hasOwnProperty(M("elementProperties")))return;let t=re(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(M("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(M("properties"))){let e=this.properties,s=[...ie(e),...ne(e)];for(let i of s)this.createProperty(i,e[i])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[e,s]of this.elementProperties){let i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let s=new Set(t.flat(1/0).reverse());for(let i of s)e.unshift(J(i))}else t!==void 0&&e.push(J(t));return e}static _$Eu(t,e){let s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return xt(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){let s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){let r=(s.converter?.toAttribute!==void 0?s.converter:X).toAttribute(e,s.type);this._$Em=t,r==null?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(t,e){let s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){let r=s.getPropertyOptions(i),o=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:X;this._$Em=i;let c=o.fromAttribute(e,r.type);this[i]=c??this._$Ej?.get(i)??c,this._$Em=null}}requestUpdate(t,e,s,i=!1,r){if(t!==void 0){let o=this.constructor;if(i===!1&&(r=this[t]),s??=o.getPropertyOptions(t),!((s.hasChanged??At)(r,e)||s.useDefault&&s.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:r},o){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),r!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,r]of this._$Ep)this[i]=r;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,r]of s){let{wrapped:o}=r,c=this[i];o!==!0||this._$AL.has(i)||c===void 0||this.C(i,void 0,r,c)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};$.elementStyles=[],$.shadowRootOptions={mode:"open"},$[M("elementProperties")]=new Map,$[M("finalized")]=new Map,oe?.({ReactiveElement:$}),(B.reactiveElementVersions??=[]).push("2.1.2");var nt=globalThis,Et=n=>n,K=nt.trustedTypes,zt=K?K.createPolicy("lit-html",{createHTML:n=>n}):void 0,Ht="$lit$",w=`lit$${Math.random().toFixed(9).slice(2)}$`,Lt="?"+w,le=`<${Lt}>`,k=document,O=()=>k.createComment(""),Z=n=>n===null||typeof n!="object"&&typeof n!="function",rt=Array.isArray,de=n=>rt(n)||typeof n?.[Symbol.iterator]=="function",Y=`[ 	
\f\r]`,I=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,kt=/-->/g,St=/>/g,E=RegExp(`>|${Y}(?:([^\\s"'>=/]+)(${Y}*=${Y}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Tt=/'/g,Rt=/"/g,Pt=/^(?:script|style|textarea|title)$/i,at=n=>(t,...e)=>({_$litType$:n,strings:t,values:e}),a=at(1),Te=at(2),Re=at(3),S=Symbol.for("lit-noChange"),p=Symbol.for("lit-nothing"),Ct=new WeakMap,z=k.createTreeWalker(k,129);function Nt(n,t){if(!rt(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return zt!==void 0?zt.createHTML(t):t}var ce=(n,t)=>{let e=n.length-1,s=[],i,r=t===2?"<svg>":t===3?"<math>":"",o=I;for(let c=0;c<e;c++){let l=n[c],d,u,h=-1,f=0;for(;f<l.length&&(o.lastIndex=f,u=o.exec(l),u!==null);)f=o.lastIndex,o===I?u[1]==="!--"?o=kt:u[1]!==void 0?o=St:u[2]!==void 0?(Pt.test(u[2])&&(i=RegExp("</"+u[2],"g")),o=E):u[3]!==void 0&&(o=E):o===E?u[0]===">"?(o=i??I,h=-1):u[1]===void 0?h=-2:(h=o.lastIndex-u[2].length,d=u[1],o=u[3]===void 0?E:u[3]==='"'?Rt:Tt):o===Rt||o===Tt?o=E:o===kt||o===St?o=I:(o=E,i=void 0);let b=o===E&&n[c+1].startsWith("/>")?" ":"";r+=o===I?l+le:h>=0?(s.push(d),l.slice(0,h)+Ht+l.slice(h)+w+b):l+w+(h===-2?c:b)}return[Nt(n,r+(n[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]},U=class n{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let r=0,o=0,c=t.length-1,l=this.parts,[d,u]=ce(t,e);if(this.el=n.createElement(d,s),z.currentNode=this.el.content,e===2||e===3){let h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(i=z.nextNode())!==null&&l.length<c;){if(i.nodeType===1){if(i.hasAttributes())for(let h of i.getAttributeNames())if(h.endsWith(Ht)){let f=u[o++],b=i.getAttribute(h).split(w),_=/([.?@])?(.*)/.exec(f);l.push({type:1,index:r,name:_[2],strings:b,ctor:_[1]==="."?tt:_[1]==="?"?et:_[1]==="@"?st:H}),i.removeAttribute(h)}else h.startsWith(w)&&(l.push({type:6,index:r}),i.removeAttribute(h));if(Pt.test(i.tagName)){let h=i.textContent.split(w),f=h.length-1;if(f>0){i.textContent=K?K.emptyScript:"";for(let b=0;b<f;b++)i.append(h[b],O()),z.nextNode(),l.push({type:2,index:++r});i.append(h[f],O())}}}else if(i.nodeType===8)if(i.data===Lt)l.push({type:2,index:r});else{let h=-1;for(;(h=i.data.indexOf(w,h+1))!==-1;)l.push({type:7,index:r}),h+=w.length-1}r++}}static createElement(t,e){let s=k.createElement("template");return s.innerHTML=t,s}};function C(n,t,e=n,s){if(t===S)return t;let i=s!==void 0?e._$Co?.[s]:e._$Cl,r=Z(t)?void 0:t._$litDirective$;return i?.constructor!==r&&(i?._$AO?.(!1),r===void 0?i=void 0:(i=new r(n),i._$AT(n,e,s)),s!==void 0?(e._$Co??=[])[s]=i:e._$Cl=i),i!==void 0&&(t=C(n,i._$AS(n,t.values),i,s)),t}var Q=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??k).importNode(e,!0);z.currentNode=i;let r=z.nextNode(),o=0,c=0,l=s[0];for(;l!==void 0;){if(o===l.index){let d;l.type===2?d=new W(r,r.nextSibling,this,t):l.type===1?d=new l.ctor(r,l.name,l.strings,this,t):l.type===6&&(d=new it(r,this,t)),this._$AV.push(d),l=s[++c]}o!==l?.index&&(r=z.nextNode(),o++)}return z.currentNode=k,i}p(t){let e=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},W=class n{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=p,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=C(this,t,e),Z(t)?t===p||t==null||t===""?(this._$AH!==p&&this._$AR(),this._$AH=p):t!==this._$AH&&t!==S&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):de(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==p&&Z(this._$AH)?this._$AA.nextSibling.data=t:this.T(k.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=U.createElement(Nt(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{let r=new Q(i,this),o=r.u(this.options);r.p(e),this.T(o),this._$AH=r}}_$AC(t){let e=Ct.get(t.strings);return e===void 0&&Ct.set(t.strings,e=new U(t)),e}k(t){rt(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,s,i=0;for(let r of t)i===e.length?e.push(s=new n(this.O(O()),this.O(O()),this,this.options)):s=e[i],s._$AI(r),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let s=Et(t).nextSibling;Et(t).remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},H=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,r){this.type=1,this._$AH=p,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=r,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=p}_$AI(t,e=this,s,i){let r=this.strings,o=!1;if(r===void 0)t=C(this,t,e,0),o=!Z(t)||t!==this._$AH&&t!==S,o&&(this._$AH=t);else{let c=t,l,d;for(t=r[0],l=0;l<r.length-1;l++)d=C(this,c[s+l],e,l),d===S&&(d=this._$AH[l]),o||=!Z(d)||d!==this._$AH[l],d===p?t=p:t!==p&&(t+=(d??"")+r[l+1]),this._$AH[l]=d}o&&!i&&this.j(t)}j(t){t===p?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},tt=class extends H{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===p?void 0:t}},et=class extends H{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==p)}},st=class extends H{constructor(t,e,s,i,r){super(t,e,s,i,r),this.type=5}_$AI(t,e=this){if((t=C(this,t,e,0)??p)===S)return;let s=this._$AH,i=t===p&&s!==p||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,r=t!==p&&(s===p||i);i&&this.element.removeEventListener(this.name,this,s),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},it=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){C(this,t)}};var he=nt.litHtmlPolyfillSupport;he?.(U,W),(nt.litHtmlVersions??=[]).push("3.3.3");var Mt=(n,t,e)=>{let s=e?.renderBefore??t,i=s._$litPart$;if(i===void 0){let r=e?.renderBefore??null;s._$litPart$=i=new W(t.insertBefore(O(),r),r,void 0,e??{})}return i._$AI(n),i};var ot=globalThis,m=class extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Mt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return S}};m._$litElement$=!0,m.finalized=!0,ot.litElementHydrateSupport?.({LitElement:m});var pe=ot.litElementPolyfillSupport;pe?.({LitElement:m});(ot.litElementVersions??=[]).push("4.2.2");function It(n){return n.callWS({type:"raincast/entries"})}function Ot(n,t,e){return n.callWS({type:"raincast/set_options",entry_id:t,notify_service:e})}function Zt(n,t,e){return n.callWS({type:"raincast/update_sources",entry_id:t,...e})}function Ut(n,t,e){return n.callWS({type:"raincast/add_zone",entry_id:t,...e})}function Wt(n,t,e,s){return n.callWS({type:"raincast/update_zone",entry_id:t,zone_id:e,...s})}function Dt(n,t,e){return n.callWS({type:"raincast/remove_zone",entry_id:t,zone_id:e})}function Ft(n,t){return n.callService("button","press",{entity_id:t})}function D(n){return n.valves.map((t,e)=>n.entities[`duration_${e}`])}function Vt(n){return n.valves.map((t,e)=>n.entities[`max_flow_${e}`])}function lt(n,t){for(let e of n.log){let s=e.zones.find(i=>i.key===t);if(s)return s}}function jt(n,t,e,s){return n.callWS({type:"raincast/run_zone",entry_id:t,zone_id:e,minutes:s})}var ue={loading:"Loading\u2026",no_entry:"No RainCast controller is set up. Add one under Settings \u2192 Devices & services.","tab.home":"Home","tab.history":"History","tab.settings":"Settings","tab.guide":"Guide","home.control_on":"Valve control on","home.dry_run":"Dry run","home.watering":"Watering {zone}","home.valve_ends":"until about {time}","home.next_start":"Next start {day}, {time}","home.planned_now":"{minutes} min due if it started now","home.no_start":"No daily start","home.no_start_hint":"The start is off in the settings; manual runs still work.","home.stop":"Stop","home.run_due":"Water due zones","home.control_needed":"Turn on Valve control in the settings first.","home.weather":"Weather","home.soil":"Soil moisture","home.rain":"Rain forecast","home.not_configured":"not set","home.no_value":"no value","home.weather_hint":"Zones open to the sky are held while a value is above its limit, the line in the middle of the bar.","home.problems":"Problems","status.watering":"Watering","status.due":"Due","status.waiting":"Waiting","status.wet_soil":"Soil wet","status.rain_forecast":"Rain forecast","status.no_duration":"No valve time","status.unknown":"Unknown","zone.last_watered":"Last watered","zone.next_due":"Next due","zone.minutes":"{minutes} min","zone.interval":"Water every","zone.never":"never","zone.days_ago":"{days} days ago","zone.every_days":"every {days} days","zone.water":"Water","zone.last_run_liters":"{liters} l last run","zone.total_liters":"{liters} l in total","zone.flow":"{flow} l/min","zone.time":"Time","zone.max_flow":"Flow limit","zone.max_flow_hint":"A valve whose mean flow goes above its limit is closed and reported, for a broken pipe or sprinkler. 0 turns the check off.","zone.settings":"Settings","zone.manual":"Manual","zone.manual_hint":"Each valve runs for the minutes given, 0 leaves it out. The zone counts as watered only at its own full time.","zone.start":"Start","zone.cancel":"Cancel","zone.name":"Name","zone.valves":"Valves, in the order they run","zone.roofed":"Under a roof","zone.roofed_hint":"The weather does not hold a greenhouse or a covered bed.","zone.new_hint":"A new zone starts with a 3-day interval and 15 minutes per valve; both are changed here afterwards.","zone.edit_hint":"Saving reloads RainCast. A valve added here starts with the zone's starting time.","zone.remove_confirm":"Remove {name}? Its entities are removed; recorded history stays.","problem.valve_unavailable":"A valve has been unavailable for 30 minutes.","problem.valve_not_opened":"A valve did not open in its latest run.","problem.valve_not_closed":"A valve still reports open after the stop command.","problem.no_flow":"A valve was open without water through the meter.","problem.flow_high":"A valve was closed for flow above its limit.","problem.weather_lost":"A weather input has had no value for an hour.","history.runs":"Runs","history.no_runs":"No run yet.","history.watered":"{watered} of {planned} min","history.not_opened":"did not open: {valves}","history.interrupted":"Stopped before the end.","history.no_flow":"no water","history.flow_high":"closed, flow too high","history.weather":"Soil and rain, 7 days","history.valves":"Valves, 7 days","reason.scheduled":"Daily start","reason.manual":"Manual","reason.zone":"Single zone","reason.restart":"Cut off by a restart","mode.before_sunrise":"Before sunrise","mode.at_time":"At a fixed time","mode.off":"Off","src.soil_sensor":"Soil moisture","src.rain_sensor":"Rain forecast","src.water_meter":"Water meter","action.edit":"Edit","action.save":"Save","action.remove":"Remove","action.add_zone":"Add zone","action.add_valve":"Add valve","settings.control_title":"Valves","settings.control":"Valve control","settings.control_hint":"Off: the plan is sent as a dry run and no valve is opened.","settings.control_confirm":"RainCast will open the valves at the daily start. Turn off every other schedule watering the same valves first.","settings.confirm":"Turn on","settings.cancel":"Cancel","settings.schedule":"Daily start","settings.start_mode":"Start","settings.sunrise_offset":"Hours before sunrise","settings.start_time":"Start time","settings.schedule_hint":"Watering before sunrise loses the least water to evaporation and leaves the lawn dry by day.","settings.limits":"Weather limits","settings.soil_max":"Soil limit","settings.rain_max":"Rain limit","settings.limits_hint":"Zones open to the sky are held above these values. Zones under a roof are never held.","settings.sources":"Weather and water","settings.sources_hint":"Without the weather inputs, zones are watered by their intervals alone. The water meter meters every valve and checks its flow.","settings.reload_hint":"Saving reloads RainCast; dates, intervals and valve times are kept.","settings.zones":"Zones","settings.notifications":"Problems and notifications","settings.no_problems":"No problems right now.","settings.notify_service":"Notify service","settings.notify_none":"No notifications","settings.notify_hint":"Receives the day's plan, the end of every run and problems.","settings.entities":"Entities and devices","settings.admin_only":"Only administrators can change settings."},dt="en";function Bt(){return(n,t)=>{let e=ue[n]??n;for(let[s,i]of Object.entries(t??{}))e=e.replace(`{${s}}`,String(i));return e}}function g(n,t=1){return n==null||!Number.isFinite(n)?"\u2013":n.toLocaleString(dt,{minimumFractionDigits:t,maximumFractionDigits:t})}function L(n){return n.toLocaleTimeString(dt,{hour:"2-digit",minute:"2-digit",hourCycle:"h23"})}function F(n){let t=new Date;t.setHours(0,0,0,0);let e=new Date(n);e.setHours(0,0,0,0);let s=Math.round((e.getTime()-t.getTime())/864e5);return s===0?"today":s===1?"tomorrow":s===-1?"yesterday":n.toLocaleDateString(dt,{weekday:"short",day:"numeric",month:"short"})}var y=v`
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
`;var me=["Daily start","Interval","Soil and rain","Plan","Valves one by one","Measured time"],ve=n=>a`<div class="pipeline">${n.map(t=>a`<span class="chip">${t}</span>`)}</div>`,fe=[{icon:"mdi:information-outline",title:"How RainCast works",body:a`
      <p>
        Once a day, a number of hours before sunrise or at a fixed time, RainCast decides which zones need water and waters
        them one valve after another. Only one valve runs at a time, so the water pressure stays the same for every zone.
      </p>
      ${ve(me)}
      <ol>
        <li><b>Interval.</b> A zone is due when its interval has passed since it was last watered, or when it was never watered.</li>
        <li>
          <b>Weather.</b> A due zone open to the sky is held while the soil is wetter than the soil limit or more rain is
          forecast than the rain limit. A zone under a roof is never held.
        </li>
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
    `},{icon:"mdi:weather-partly-rainy",title:"Weather inputs",body:a`
      <p>Both inputs are optional and can be any sensor:</p>
      <ul>
        <li><b>Soil moisture</b> in %, measured or a model value such as Open-Meteo's soil moisture at 3–9 cm.</li>
        <li><b>Rain forecast</b> in mm for the coming day.</li>
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
        ${fe.map((t,e)=>a`
            <details class="card" ?open=${e===0}>
              <summary><ha-icon icon=${t.icon}></ha-icon><span>${t.title}</span></summary>
              <div class="body">${t.body}</div>
            </details>
          `)}
      </div>
    `}static{this.styles=[y,v`
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
    `]}};customElements.get("raincast-guide")??customElements.define("raincast-guide",ct);var Kt;async function qt(n){if(window.loadCardHelpers)return Kt??=window.loadCardHelpers(),(await Kt).createCardElement(n)}function T(n,t){if(!t)return;let e=Number.parseFloat(n.states[t]?.state??"");return Number.isFinite(e)?e:void 0}function P(n,t){return!!t&&n.states[t]?.state==="on"}function x(n,t,e){n.dispatchEvent(new CustomEvent(t,{detail:e,bubbles:!0,composed:!0}))}var Gt=168,ht=class extends m{constructor(){super(...arguments);this.cards=[]}static{this.properties={hass:{attribute:!1},entry:{attribute:!1},localize:{attribute:!1}}}updated(){this.cardsFor!==this.entry&&(this.cardsFor=this.entry,this.buildCards());for(let e of this.cards)e.hass=this.hass}async buildCards(){let e=this.localize,s=[this.entry.sources.soil_sensor,this.entry.sources.rain_sensor].filter(l=>!!l),i=this.entry.zones.flatMap(l=>l.valves),r=[s.length?{type:"history-graph",title:e("history.weather"),hours_to_show:Gt,entities:s}:null,i.length?{type:"history-graph",title:e("history.valves"),hours_to_show:Gt,entities:i}:null].filter(l=>l!==null),o=await Promise.all(r.map(l=>qt(l)));this.cards=o.filter(l=>!!l);let c=this.renderRoot.querySelector(".graphs");if(c){c.replaceChildren(...this.cards);for(let l of this.cards)l.hass=this.hass}}render(){let e=this.localize;return a`
      <div class="layout">
        <section class="card">
          <h2><ha-icon icon="mdi:history"></ha-icon>${e("history.runs")}</h2>
          ${this.entry.log.length?a`<div class="runs">${this.entry.log.map(s=>this.renderRun(s))}</div>`:a`<p class="muted">${e("history.no_runs")}</p>`}
        </section>
        <div class="graphs"></div>
      </div>
    `}renderRun(e){let s=this.localize,i=e.started?new Date(e.started):void 0,r=e.ended?new Date(e.ended):void 0,o=!e.interrupted&&e.zones.every(l=>l.watered),c=i?`${F(i)} ${L(i)}${r?`\u2013${L(r)}`:""}`:"\u2013";return a`
      <div class="run">
        <div class="run-head">
          <ha-icon
            class=${o?"ok":"warn"}
            icon=${o?"mdi:check-circle":"mdi:alert-circle-outline"}
          ></ha-icon>
          <span class="grow">${c}</span>
          <span class="chip">${s(`reason.${e.reason}`)}</span>
        </div>
        ${e.zones.map(l=>a`
            <div class="zone-row">
              <span>${l.name}</span>
              <span class=${l.watered?"":"warn-text"}>
                ${s("history.watered",{watered:g(l.watered_min,0),planned:g(l.planned_min,0)})}
                ${l.liters!==null&&l.liters!==void 0?a` · ${g(l.liters,0)} l`:p}
              </span>
            </div>
            ${(l.valves??[]).map(d=>this.renderValve(d))}
            ${l.not_opened.length?a`<div class="muted small">${s("history.not_opened",{valves:l.not_opened.map(d=>this.hass.states[d]?.attributes.friendly_name??d).join(", ")})}</div>`:p}
          `)}
        ${e.interrupted?a`<div class="muted small">${s("history.interrupted")}</div>`:p}
      </div>
    `}renderValve(e){let s=this.localize,i=[s("zone.minutes",{minutes:g(e.minutes,1)})];return e.liters!==null&&i.push(`${g(e.liters,0)} l`),e.flow!==null&&i.push(s("zone.flow",{flow:g(e.flow,1)})),a`
      <div class="valve-row muted small">
        <span>${this.hass.states[e.entity_id]?.attributes.friendly_name??e.entity_id}</span>
        <span>
          ${e.no_flow?a`<b class="warn-text">${s("history.no_flow")}</b> · `:p}
          ${e.flow_high?a`<b class="warn-text">${s("history.flow_high")}</b> · `:p} ${i.join(" \xB7 ")}
        </span>
      </div>
    `}static{this.styles=[y,v`
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
    `]}};customElements.get("raincast-history")??customElements.define("raincast-history",ht);function A(n,t,e){let s=t?n.states[t]:void 0;if(!s)return a``;let i=Number.parseFloat(s.state),r=Number(s.attributes.step??1),o=Number(s.attributes.min??-1/0),c=Number(s.attributes.max??1/0),l=r<.01?3:r<.1?2:r<1?1:0,d=s.attributes.unit_of_measurement??"",u=h=>{if(!Number.isFinite(h))return;let f=Math.round(Math.max(Math.min(h,c),o)/r)*r;n.callService("number","set_value",{entity_id:t,value:Number(f.toFixed(4))})};return a`
    <div class="number">
      <span class="label">${e}</span>
      <span class="stepper">
        <button class="round mini" ?disabled=${i<=o} @click=${()=>u(i-r)}>−</button>
        <input
          type="number"
          .value=${Number.isFinite(i)?i.toFixed(l):""}
          step=${r}
          min=${o}
          max=${c}
          @change=${h=>u(Number.parseFloat(h.target.value))}
        />
        <button class="round mini" ?disabled=${i>=c} @click=${()=>u(i+r)}>+</button>
        <span class="unit">${d}</span>
      </span>
    </div>
  `}var R=v`
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
  button.text:hover {
    background: var(--secondary-background-color);
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
`;var ge={watering:"water",due:"ok",waiting:"",wet_soil:"warn",rain_forecast:"warn",no_duration:"warn"},ye=["open","opening","on"];function Jt(n){return String(n?.message??n)}var pt=class extends m{static{this.properties={hass:{attribute:!1},entry:{attribute:!1},localize:{attribute:!1},error:{state:!0},manual:{state:!0}}}openManual(t){let e=D(t),s=Object.fromEntries(t.valves.map((i,r)=>[i,T(this.hass,e[r])??0]));this.manual={zoneId:t.id,minutes:s},this.error=void 0}async startManual(t){if(this.manual){this.error=void 0;try{await jt(this.hass,this.entry.entry_id,t.id,this.manual.minutes),this.manual=void 0}catch(e){this.error=Jt(e)}}}async press(t){this.error=void 0;try{await Ft(this.hass,t)}catch(e){this.error=Jt(e)}}name(t){return String(this.hass.states[t]?.attributes.friendly_name??t)}render(){return a`
      <div class="layout">
        <div class="column">${this.renderStatus()} ${this.renderWeather()} ${this.renderProblems()}</div>
        <div class="zones">${this.entry.zones.map(t=>this.renderZone(t))}</div>
      </div>
    `}renderStatus(){let t=this.localize,e=this.entry.entities,s=P(this.hass,e.control),r=this.hass.states[e.running]?.state==="on";return a`
      <section class="card status ${r?"active":""}">
        <div class="headline">
          <ha-icon icon=${r?"mdi:sprinkler-variant":"mdi:calendar-clock"}></ha-icon>
          <div class="grow">${r?this.renderRunning():this.renderNext()}</div>
          <span class="chip ${s?"ok":"warn"}">${t(s?"home.control_on":"home.dry_run")}</span>
        </div>
        ${this.renderPlan()}
        ${this.error?a`<div class="error">${this.error}</div>`:p}
        <div class="actions">
          ${r?a`<button class="text danger" @click=${()=>this.press(e.stop)}>
                <ha-icon icon="mdi:water-off"></ha-icon> ${t("home.stop")}
              </button>`:a`<button
                class="text primary"
                ?disabled=${!s}
                title=${s?"":t("home.control_needed")}
                @click=${()=>this.press(e.run_due)}
              >
                <ha-icon icon="mdi:play"></ha-icon> ${t("home.run_due")}
              </button>`}
        </div>
      </section>
    `}renderRunning(){let t=this.localize,e=this.hass.states[this.entry.entities.running]?.attributes??{},s=e.valve?this.name(e.valve):"",i=e.valve_ends?L(new Date(e.valve_ends)):"";return a`
      <div class="big">${t("home.watering",{zone:e.zone??""})}</div>
      <div class="muted small">${s}${i?` \xB7 ${t("home.valve_ends",{time:i})}`:""}</div>
    `}renderNext(){let t=this.localize,e=this.hass.states[this.entry.entities.next_start]?.state,s=e&&!["unknown","unavailable"].includes(e)?new Date(e):void 0;return s?a`
      <div class="big">${t("home.next_start",{day:F(s),time:L(s)})}</div>
      <div class="muted small">${t("home.planned_now",{minutes:this.hass.states[this.entry.entities.planned]?.state??"0"})}</div>
    `:a`<div class="big">${t("home.no_start")}</div>
        <div class="muted small">${t("home.no_start_hint")}</div>`}renderPlan(){let t=this.localize,e=this.hass.states[this.entry.entities.planned]?.attributes??{},s=e.due??[],i=e.skipped??{};return a`
      <ul class="plan">
        ${s.map(r=>a`<li><ha-icon class="ok" icon="mdi:check-circle"></ha-icon>${r}</li>`)}
        ${Object.entries(i).map(([r,o])=>a`<li class="muted">
              <ha-icon icon="mdi:skip-next-circle-outline"></ha-icon>${r} · ${t(`status.${o}`)}
            </li>`)}
      </ul>
    `}renderWeather(){let t=this.localize,e=this.entry.sources,s=this.entry.entities;return a`
      <section class="card">
        <h2><ha-icon icon="mdi:weather-partly-rainy"></ha-icon>${t("home.weather")}</h2>
        ${this.renderGauge(t("home.soil"),e.soil_sensor,s.soil_max,"%")}
        ${this.renderGauge(t("home.rain"),e.rain_sensor,s.rain_max,"mm")}
        <p class="muted small">${t("home.weather_hint")}</p>
      </section>
    `}renderGauge(t,e,s,i){let r=this.localize;if(!e)return a`<div class="gauge"><span>${t}</span><span class="muted">${r("home.not_configured")}</span></div>`;let o=T(this.hass,e),c=T(this.hass,s),l=o!==void 0&&c!==void 0&&o>c,d=o!==void 0&&c?Math.min(o/(2*c),1):0;return a`
      <div class="gauge">
        <span>${t}</span>
        <span class=${l?"warn-text":""}>
          ${o===void 0?r("home.no_value"):`${g(o,1)} ${i}`}
          <span class="muted small">/ ${g(c,1)} ${i}</span>
        </span>
      </div>
      <div class="bar"><span class=${l?"over":""} style="width: ${d*100}%"></span><i></i></div>
    `}renderProblems(){let t=this.hass.states[this.entry.entities.problem]?.attributes.problems??[];return t.length?a`
      <section class="card problems">
        <h2><ha-icon icon="mdi:alert-circle-outline"></ha-icon>${this.localize("home.problems")}</h2>
        <ul>
          ${t.map(e=>a`<li>${this.localize(`problem.${e}`)}</li>`)}
        </ul>
      </section>
    `:p}renderZone(t){let e=this.localize,s=this.hass.states[t.entities.status],i=s?.state??"unknown",r=this.hass.states[t.entities.last_watered]?.state,o=this.hass.states[t.entities.next_due]?.state,c=T(this.hass,t.entities.interval),l=D(t),d=this.manual?.zoneId===t.id?this.manual:void 0,u=lt(this.entry,t.id);return a`
      <section class="card zone ${i==="watering"?"active":""}">
        <h2>
          <ha-icon icon=${t.roofed?"mdi:greenhouse":"mdi:sprinkler"}></ha-icon>
          <span class="grow">${t.name}</span>
          <span class="chip ${ge[i]??""}">${e(`status.${i}`)}</span>
        </h2>
        <dl>
          <dt>${e("zone.last_watered")}</dt>
          <dd>${this.dateText(r,s?.attributes.days_since)}</dd>
          <dt>${e("zone.next_due")}</dt>
          <dd>${this.dateText(o)}</dd>
          <dt>${e("zone.interval")}</dt>
          <dd>${e("zone.every_days",{days:c??"\u2013"})}</dd>
          ${this.renderWater(t)}
        </dl>
        <div class="valves">
          ${t.valves.map((h,f)=>{let b=ye.includes(this.hass.states[h]?.state??""),_=u?.valves?.find(q=>q.entity_id===h)?.flow;return a`
              <div class="valve">
                <span class="dot ${b?"open":""}" title=${this.hass.states[h]?.state??""}></span>
                <span class="grow">${this.name(h)}</span>
                ${d?a`<input
                        class="text minutes"
                        type="number"
                        min="0"
                        max="240"
                        step="1"
                        .value=${String(d.minutes[h]??0)}
                        @change=${q=>{let yt=Number.parseFloat(q.target.value);this.manual={...d,minutes:{...d.minutes,[h]:Number.isFinite(yt)?Math.max(0,yt):0}}}}
                      /><span class="unit">min</span>`:a`<span class="muted">
                      ${_!=null?a`${e("zone.flow",{flow:g(_,1)})} · `:p}
                      ${e("zone.minutes",{minutes:g(T(this.hass,l[f]),0)})}
                    </span>`}
              </div>
            `})}
        </div>
        ${d?this.renderManualActions(t):this.renderZoneActions(t)}
      </section>
    `}renderWater(t){let e=this.localize;if(!t.entities.water_used)return p;let s=T(this.hass,t.entities.water_used),i=lt(this.entry,t.id)?.liters;return a`
      <dt>${e("zone.water")}</dt>
      <dd>
        ${i!=null?e("zone.last_run_liters",{liters:g(i,0)}):"\u2013"}
        <span class="muted">· ${e("zone.total_liters",{liters:g(s,0)})}</span>
      </dd>
    `}renderZoneActions(t){let e=this.localize;return a`
      <div class="actions">
        <button class="text" @click=${()=>x(this,"raincast-open-zone",t.id)}>
          <ha-icon icon="mdi:cog-outline"></ha-icon> ${e("zone.settings")}
        </button>
        <button class="text primary" @click=${()=>this.openManual(t)}>
          <ha-icon icon="mdi:hand-water"></ha-icon> ${e("zone.manual")}
        </button>
      </div>
    `}renderManualActions(t){let e=this.localize,s=P(this.hass,this.entry.entities.control),i=P(this.hass,this.entry.entities.running),r=Object.values(this.manual?.minutes??{}).some(o=>o>0);return a`
      <p class="muted small">${e(s?"zone.manual_hint":"home.control_needed")}</p>
      <div class="actions">
        <button class="text" @click=${()=>this.manual=void 0}>${e("zone.cancel")}</button>
        <button
          class="text primary"
          ?disabled=${!s||i||!r}
          @click=${()=>this.startManual(t)}
        >
          <ha-icon icon="mdi:play"></ha-icon> ${e("zone.start")}
        </button>
      </div>
    `}dateText(t,e){let s=this.localize;if(!t||["unknown","unavailable"].includes(t))return s("zone.never");let i=new Date(`${t}T00:00:00`),r=F(i);return e==null||e<2?r:`${r} \xB7 ${s("zone.days_ago",{days:e})}`}static{this.styles=[y,R,v`
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
    `]}};customElements.get("raincast-home")??customElements.define("raincast-home",pt);var ut=class extends m{constructor(){super(...arguments);this.domains=[];this.optional=!1}static{this.properties={hass:{attribute:!1},domains:{attribute:!1},deviceClass:{attribute:!1},value:{attribute:!1},optional:{type:Boolean}}}options(){return Object.values(this.hass.states).filter(s=>{let i=this.domains.includes(s.entity_id.split(".")[0]),r=!this.deviceClass||s.attributes.device_class===this.deviceClass;return i&&(r||s.entity_id===this.value)}).map(s=>({id:s.entity_id,name:String(s.attributes.friendly_name??s.entity_id)})).sort((s,i)=>s.name.localeCompare(i.name))}render(){let e=this.options(),s=!this.value||e.some(i=>i.id===this.value);return a`
      <select
        @change=${i=>{let r=i.target.value;x(this,"value-changed",r||null)}}
      >
        ${this.optional||!this.value?a`<option value="" ?selected=${!this.value}>–</option>`:""}
        ${s?"":a`<option value=${this.value} selected>${this.value}</option>`}
        ${e.map(i=>a`<option value=${i.id} ?selected=${i.id===this.value}>${i.name} · ${i.id}</option>`)}
      </select>
    `}static{this.styles=v`
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
  `}};customElements.get("raincast-entity-picker")??customElements.define("raincast-entity-picker",ut);var Xt=[{key:"soil_sensor",label:"src.soil_sensor",domains:["sensor","input_number"]},{key:"rain_sensor",label:"src.rain_sensor",domains:["sensor","input_number"]},{key:"water_meter",label:"src.water_meter",domains:["sensor"],deviceClass:"water"}],be=["valve","switch","input_boolean"],$e=3,xe=15;function Yt(n){return String(n?.message??n)}function Qt(n,t){return t?String(n.states[t]?.attributes.friendly_name??t):"\u2013"}var mt=class extends m{constructor(){super(...arguments);this.saving=!1}static{this.properties={hass:{attribute:!1},entry:{attribute:!1},localize:{attribute:!1},draft:{state:!0},error:{state:!0},saving:{state:!0}}}async save(){if(this.draft){this.saving=!0;try{await Zt(this.hass,this.entry.entry_id,this.draft),this.draft=void 0,x(this,"raincast-entries-changed")}catch(e){this.error=Yt(e)}finally{this.saving=!1}}}render(){let e=this.localize;return a`
      <section class="card">
        <h2>${e("settings.sources")}</h2>
        ${this.draft?this.renderForm():this.renderSummary()}
      </section>
    `}renderSummary(){let e=this.localize;return a`
      <dl>
        ${Xt.map(s=>a`<dt>${e(s.label)}</dt>
            <dd title=${this.entry.sources[s.key]??""}>${Qt(this.hass,this.entry.sources[s.key])}</dd>`)}
      </dl>
      <p class="muted small">${e("settings.sources_hint")}</p>
      <div class="actions">
        <button
          class="text primary"
          @click=${()=>{this.draft={...this.entry.sources},this.error=void 0}}
        >
          ${e("action.edit")}
        </button>
      </div>
    `}renderForm(){let e=this.localize,s=this.draft;return a`
      ${Xt.map(i=>a`
          <div class="field">
            <label>${e(i.label)}</label>
            <raincast-entity-picker
              .hass=${this.hass}
              .domains=${i.domains}
              .deviceClass=${i.deviceClass}
              .value=${s[i.key]}
              optional
              @value-changed=${r=>this.draft={...s,[i.key]:r.detail}}
            ></raincast-entity-picker>
          </div>
        `)}
      <p class="muted small">${e("settings.reload_hint")}</p>
      ${this.error?a`<div class="error">${this.error}</div>`:p}
      <div class="actions">
        <button class="text" @click=${()=>this.draft=void 0}>${e("settings.cancel")}</button>
        <button class="text primary" ?disabled=${this.saving} @click=${this.save}>${e("action.save")}</button>
      </div>
    `}static{this.styles=[y,R,v`
      dl {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 6px 16px;
        margin: 0;
        font-size: 0.9rem;
      }
      dt {
        color: var(--rc-muted);
      }
      dd {
        margin: 0;
        text-align: right;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    `]}},vt=class extends m{constructor(){super(...arguments);this.confirmRemove=!1;this.saving=!1}static{this.properties={hass:{attribute:!1},entry:{attribute:!1},localize:{attribute:!1},focusZone:{attribute:!1},editing:{state:!0},draft:{state:!0},confirmRemove:{state:!0},error:{state:!0},saving:{state:!0}}}startEdit(e){this.editing=e?.id??"new",this.draft={name:e?.name??"",valves:[...e?.valves??[]],roofed:e?.roofed??!1},this.confirmRemove=!1,this.error=void 0}stopEdit(){this.editing=void 0,this.draft=void 0}async run(e){this.saving=!0;try{await e(),this.stopEdit(),x(this,"raincast-entries-changed")}catch(s){this.error=Yt(s)}finally{this.saving=!1}}render(){let e=this.localize;return a`
      <section class="card">
        <h2>${e("settings.zones")}</h2>
        ${this.entry.zones.map(s=>this.editing===s.id?this.renderForm(s):this.renderZone(s))}
        ${this.editing==="new"?this.renderForm():a`<div class="actions">
              <button class="text primary" @click=${()=>this.startEdit()}>+ ${e("action.add_zone")}</button>
            </div>`}
      </section>
    `}updated(e){e.has("focusZone")&&this.focusZone&&this.renderRoot.querySelector(`[data-zone="${this.focusZone}"]`)?.scrollIntoView({behavior:"smooth",block:"center"})}renderZone(e){let s=this.localize,i=D(e),r=Vt(e);return a`
      <div class="zone-block ${e.id===this.focusZone?"focus":""}" data-zone=${e.id}>
        <div class="zone">
          <ha-icon icon=${e.roofed?"mdi:greenhouse":"mdi:sprinkler"}></ha-icon>
          <div class="grow">
            ${e.name}${e.roofed?a` <span class="muted small">· ${s("zone.roofed")}</span>`:p}
          </div>
          <button class="text icon" title=${s("action.edit")} @click=${()=>this.startEdit(e)}>
            <ha-icon icon="mdi:pencil"></ha-icon>
          </button>
        </div>
        ${A(this.hass,e.entities.interval,s("zone.interval"))}
        ${e.valves.map((o,c)=>a`
            <div class="valve-tuning">
              <div class="valve-name">${Qt(this.hass,o)}</div>
              ${A(this.hass,i[c],s("zone.time"))}
              ${A(this.hass,r[c],s("zone.max_flow"))}
            </div>
          `)}
        ${r.some(o=>!!o)?a`<p class="muted small">${s("zone.max_flow_hint")}</p>`:p}
      </div>
    `}renderForm(e){let s=this.localize,i=this.draft,r=i.valves.filter(d=>!!d),o=i.name.trim().length>0&&r.length>0,c=(d,u)=>{let h=[...i.valves];h[d]=u??"",this.draft={...i,valves:h}},l=()=>{let d={...i,valves:r};return this.run(()=>e?Wt(this.hass,this.entry.entry_id,e.id,d):Ut(this.hass,this.entry.entry_id,{...d,interval:$e,duration:xe}))};return a`
      <div class="form">
        <div class="field">
          <label>${s("zone.name")} *</label>
          <input
            class="text"
            .value=${i.name}
            @input=${d=>this.draft={...i,name:d.target.value}}
          />
        </div>
        <label class="check">
          <input
            type="checkbox"
            .checked=${i.roofed}
            @change=${d=>this.draft={...i,roofed:d.target.checked}}
          />
          <span>${s("zone.roofed")}<br /><span class="muted small">${s("zone.roofed_hint")}</span></span>
        </label>
        <div class="field">
          <label>${s("zone.valves")} *</label>
          ${i.valves.map((d,u)=>a`
              <div class="valve-row">
                <raincast-entity-picker
                  .hass=${this.hass}
                  .domains=${be}
                  .value=${d||null}
                  optional
                  @value-changed=${h=>c(u,h.detail)}
                ></raincast-entity-picker>
                <button
                  class="text icon"
                  title=${s("action.remove")}
                  @click=${()=>this.draft={...i,valves:i.valves.filter((h,f)=>f!==u)}}
                >
                  <ha-icon icon="mdi:close"></ha-icon>
                </button>
              </div>
            `)}
          <div>
            <button class="text" @click=${()=>this.draft={...i,valves:[...i.valves,""]}}>
              + ${s("action.add_valve")}
            </button>
          </div>
        </div>
        <p class="muted small">${s(e?"zone.edit_hint":"zone.new_hint")}</p>
        ${this.error?a`<div class="error">${this.error}</div>`:p}
        ${this.confirmRemove&&e?a`<div class="confirm">
              <span>${s("zone.remove_confirm",{name:e.name})}</span>
              <button class="text" @click=${()=>this.confirmRemove=!1}>${s("settings.cancel")}</button>
              <button
                class="text danger"
                @click=${()=>this.run(()=>Dt(this.hass,this.entry.entry_id,e.id))}
              >
                ${s("action.remove")}
              </button>
            </div>`:p}
        <div class="actions">
          ${e?a`<button class="text danger" @click=${()=>this.confirmRemove=!0}>${s("action.remove")}</button>`:p}
          <span class="spacer"></span>
          <button class="text" @click=${()=>this.stopEdit()}>${s("settings.cancel")}</button>
          <button class="text primary" ?disabled=${!o||this.saving} @click=${l}>
            ${s(e?"action.save":"action.add_zone")}
          </button>
        </div>
      </div>
    `}static{this.styles=[y,R,v`
      .zone-block {
        border-bottom: 1px solid var(--divider-color);
        padding: 6px 0 8px;
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
    `]}};customElements.get("raincast-sources-card")??customElements.define("raincast-sources-card",mt);customElements.get("raincast-zones-card")??customElements.define("raincast-zones-card",vt);var _e=["before_sunrise","at_time","off"],ft=class extends m{constructor(){super(...arguments);this.confirming=!1}static{this.properties={hass:{attribute:!1},entry:{attribute:!1},localize:{attribute:!1},focusZone:{attribute:!1},confirming:{state:!0}}}render(){return this.hass.user?.is_admin?a`
      <div class="layout">
        <div class="column">${this.renderControl()} ${this.renderSchedule()} ${this.renderLimits()}</div>
        <div class="column">
          <raincast-zones-card
            .hass=${this.hass}
            .entry=${this.entry}
            .localize=${this.localize}
            .focusZone=${this.focusZone}
          ></raincast-zones-card>
          <raincast-sources-card .hass=${this.hass} .entry=${this.entry} .localize=${this.localize}></raincast-sources-card>
        </div>
        <div class="column">${this.renderNotifications()}</div>
      </div>
      <p class="small">
        <a href="/config/integrations/integration/raincast">${this.localize("settings.entities")}</a>
      </p>
    `:a`<section class="card muted">${this.localize("settings.admin_only")}</section>`}renderToggle(e,s,i,r){return a`
      <div class="toggle-row">
        <div>
          <div>${this.localize(e)}</div>
          <div class="muted small">${this.localize(s)}</div>
        </div>
        <button class="toggle ${i?"on":""}" role="switch" aria-checked=${i} @click=${()=>r(!i)}>
          <span></span>
        </button>
      </div>
    `}renderControl(){let e=this.localize,s=this.entry.entities.control,i=r=>this.hass.callService("switch",r?"turn_on":"turn_off",{entity_id:s});return a`
      <section class="card">
        <h2>${e("settings.control_title")}</h2>
        ${this.renderToggle("settings.control","settings.control_hint",P(this.hass,s),r=>{if(r){this.confirming=!0;return}i(!1)})}
        ${this.confirming?a`<div class="confirm">
              <span>${e("settings.control_confirm")}</span>
              <button class="text" @click=${()=>this.confirming=!1}>${e("settings.cancel")}</button>
              <button
                class="text primary"
                @click=${()=>{this.confirming=!1,i(!0)}}
              >
                ${e("settings.confirm")}
              </button>
            </div>`:p}
      </section>
    `}renderSchedule(){let e=this.localize,s=this.entry.entities,i=this.hass.states[s.start_mode]?.state,r=this.hass.states[s.start_time]?.state??"";return a`
      <section class="card">
        <h2>${e("settings.schedule")}</h2>
        <div class="field">
          <label>${e("settings.start_mode")}</label>
          <select
            @change=${o=>this.hass.callService("select","select_option",{entity_id:s.start_mode,option:o.target.value})}
          >
            ${_e.map(o=>a`<option value=${o} ?selected=${o===i}>${e(`mode.${o}`)}</option>`)}
          </select>
        </div>
        ${i==="before_sunrise"?A(this.hass,s.sunrise_offset,e("settings.sunrise_offset")):p}
        ${i==="at_time"?a`<div class="number">
              <span class="label">${e("settings.start_time")}</span>
              <input
                class="text"
                type="time"
                .value=${r.slice(0,5)}
                @change=${o=>this.hass.callService("time","set_value",{entity_id:s.start_time,time:`${o.target.value}:00`})}
              />
            </div>`:p}
        <p class="muted small">${e("settings.schedule_hint")}</p>
      </section>
    `}renderLimits(){let e=this.localize,s=this.entry.entities;return a`
      <section class="card">
        <h2>${e("settings.limits")}</h2>
        ${A(this.hass,s.soil_max,e("settings.soil_max"))}
        ${A(this.hass,s.rain_max,e("settings.rain_max"))}
        <p class="muted small">${e("settings.limits_hint")}</p>
      </section>
    `}renderNotifications(){let e=this.localize,s=this.hass.states[this.entry.entities.problem]?.attributes.problems??[],i=[...this.entry.notify_services],r=this.entry.notify_service;return r&&!i.includes(r)&&i.unshift(r),a`
      <section class="card">
        <h2>${e("settings.notifications")}</h2>
        ${s.length?a`<ul class="problems">
              ${s.map(o=>a`<li>${e(`problem.${o}`)}</li>`)}
            </ul>`:a`<p class="muted">${e("settings.no_problems")}</p>`}
        <div class="field">
          <label>${e("settings.notify_service")}</label>
          <select
            @change=${async o=>{let c=o.target.value||null;await Ot(this.hass,this.entry.entry_id,c),x(this,"raincast-entries-changed")}}
          >
            <option value="" ?selected=${!r}>${e("settings.notify_none")}</option>
            ${i.map(o=>a`<option value=${o} ?selected=${o===r}>notify.${o}</option>`)}
          </select>
        </div>
        <p class="muted small">${e("settings.notify_hint")}</p>
      </section>
    `}static{this.styles=[y,R,v`
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
    `]}};customElements.get("raincast-settings")??customElements.define("raincast-settings",ft);var we=[{id:"home",label:"tab.home",icon:"mdi:sprinkler-variant"},{id:"history",label:"tab.history",icon:"mdi:chart-line"},{id:"settings",label:"tab.settings",icon:"mdi:tune-variant"},{id:"guide",label:"tab.guide",icon:"mdi:book-open-variant"}],Ae=1500,gt=class extends m{constructor(){super(...arguments);this.narrow=!1;this.tab="home";this.loading=!1;this.localize=Bt();this.openZone=e=>{this.focusZone=e.detail,this.tab="settings"};this.entriesChanged=()=>{window.setTimeout(()=>this.load(),Ae)}}static{this.properties={hass:{attribute:!1},narrow:{type:Boolean},entries:{state:!0},entryId:{state:!0},tab:{state:!0},focusZone:{state:!0},error:{state:!0}}}willUpdate(e){e.has("hass")&&this.hass&&!this.entries&&!this.loading&&this.load();let s=this.entries?.find(r=>r.entry_id===this.entryId),i=s?this.hass.states[s.entities.running]?.state:void 0;this.wasRunning==="on"&&i==="off"&&this.entriesChanged(),this.wasRunning=i}async load(){this.loading=!0;try{this.entries=await It(this.hass),this.entries.some(s=>s.entry_id===this.entryId)||(this.entryId=this.entries[0]?.entry_id),this.error=void 0}catch(e){this.error=String(e?.message??e)}finally{this.loading=!1}}selectTab(e){this.tab=e,this.focusZone=void 0}connectedCallback(){super.connectedCallback(),this.addEventListener("raincast-entries-changed",this.entriesChanged),this.addEventListener("raincast-open-zone",this.openZone),this.hass&&this.load()}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("raincast-entries-changed",this.entriesChanged),this.removeEventListener("raincast-open-zone",this.openZone)}render(){let e=this.entries?.find(s=>s.entry_id===this.entryId);return a`
      <div class="header">
        <div class="toolbar">
          <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
          <div class="title">${e?.title??"RainCast"}</div>
          ${(this.entries?.length??0)>1?a`<select @change=${s=>this.entryId=s.target.value}>
                ${this.entries.map(s=>a`<option value=${s.entry_id} ?selected=${s.entry_id===this.entryId}>${s.title}</option>`)}
              </select>`:p}
        </div>
        <nav>
          ${we.map(s=>a`
              <button class="tab ${s.id===this.tab?"active":""}" @click=${()=>this.selectTab(s.id)}>
                <ha-icon icon=${s.icon}></ha-icon><span>${this.localize(s.label)}</span>
              </button>
            `)}
        </nav>
      </div>
      <main>${this.renderContent(e)}</main>
    `}renderContent(e){if(this.error)return a`<div class="card">${this.error}</div>`;if(!this.entries)return a`<div class="muted">${this.localize("loading")}</div>`;if(!e)return a`<div class="card">${this.localize("no_entry")}</div>`;let s={hass:this.hass,entry:e,localize:this.localize};switch(this.tab){case"history":return a`<raincast-history .hass=${s.hass} .entry=${e} .localize=${s.localize}></raincast-history>`;case"guide":return a`<raincast-guide></raincast-guide>`;case"settings":return a`<raincast-settings
          .hass=${s.hass}
          .entry=${e}
          .localize=${s.localize}
          .focusZone=${this.focusZone}
        ></raincast-settings>`;default:return a`<raincast-home .hass=${s.hass} .entry=${e} .localize=${s.localize}></raincast-home>`}}static{this.styles=[y,v`
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
    `]}};customElements.get("raincast-panel")??customElements.define("raincast-panel",gt);
