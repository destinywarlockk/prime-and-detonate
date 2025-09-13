(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const c of r.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&s(c)}).observe(document,{childList:!0,subtree:!0});function i(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(n){if(n.ep)return;n.ep=!0;const r=i(n);fetch(n.href,r)}})();function Ma(e){let a=e;const i=new Set;return{getState:()=>a,setState(s){const n=typeof s=="function"?s(a):s;a={...a,...n},i.forEach(r=>r(a))},subscribe(s){return i.add(s),()=>i.delete(s)}}}const St="pd_loadout_v2";function Ia(e,a){try{const i=localStorage.getItem(St);if(!i)return console.log("📂 No persisted loadout found"),null;console.log("📂 Loading persisted loadout from:",i);const s=JSON.parse(i);console.log("📊 Parsed loadout data:",s);const n=new Set(e.map(l=>l.id)),r=new Set(a.map(l=>l.id)),c=Array.isArray(s.partySelection)?s.partySelection.filter(l=>typeof l=="string"&&n.has(l)).slice(0,3):[],v={};if(s.selectedByChar&&typeof s.selectedByChar=="object")for(const[l,u]of Object.entries(s.selectedByChar))n.has(l)&&(v[l]=Array.isArray(u)?u.filter(x=>typeof x=="string"&&r.has(x)):[]);console.log("👥 Loaded selectedByChar:",v);for(const l of n)if(!v[l]||v[l].length===0){const u=Ba(l);u.length>0&&(v[l]=u.filter(x=>r.has(x)),console.log(`🎯 Applied default loadout for ${l}:`,v[l]))}const g=typeof s.loadoutActiveIndex=="number"?s.loadoutActiveIndex:0,m=(()=>{const l={};if(s.selectedWeaponByChar&&typeof s.selectedWeaponByChar=="object")for(const[u,x]of Object.entries(s.selectedWeaponByChar))n.has(u)&&typeof x=="string"&&(l[u]=x);return l})(),f=Array.isArray(s.allWeapons)?s.allWeapons:void 0,k={partySelection:c,selectedByChar:v,loadoutActiveIndex:g,selectedWeaponByChar:m,allWeapons:f};return console.log("✅ Final loaded loadout:",k),k}catch(i){return console.error("❌ Failed to load persisted loadout:",i),null}}function Ba(e){return{nova:["basic-attack-kinetic","nova_aoe_suppressive_barrage"],volt:["basic-attack-arc","volt_aoe_static_surge"],ember:["basic-attack-thermal","ember_aoe_emberwave"],shade:["basic-attack-void","shade_aoe_entropy_collapse"]}[e]||[]}function Ea(e){try{const a={partySelection:e.partySelection,selectedByChar:e.selectedByChar,loadoutActiveIndex:e.loadoutActiveIndex,selectedWeaponByChar:e.selectedWeaponByChar,allWeapons:e.allWeapons};console.log("💾 Persisting loadout:",a),localStorage.setItem(St,JSON.stringify(a)),console.log("✅ Loadout persisted successfully")}catch(a){console.error("❌ Failed to persist loadout:",a)}}const At="pd_missions_v1";function La(){try{const e=localStorage.getItem(At);if(!e)return null;const a=JSON.parse(e);return{completed:a!=null&&a.completed&&typeof a.completed=="object"?a.completed:{},current:null}}catch{return null}}function Da(e){try{const a={completed:e.completed};localStorage.setItem(At,JSON.stringify(a))}catch{}}const Pa="modulepreload",Na=function(e){return"/"+e},pt={},Oa=function(a,i,s){let n=Promise.resolve();if(i&&i.length>0){document.getElementsByTagName("link");const c=document.querySelector("meta[property=csp-nonce]"),v=(c==null?void 0:c.nonce)||(c==null?void 0:c.getAttribute("nonce"));n=Promise.allSettled(i.map(g=>{if(g=Na(g),g in pt)return;pt[g]=!0;const m=g.endsWith(".css"),f=m?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${g}"]${f}`))return;const k=document.createElement("link");if(k.rel=m?"stylesheet":Pa,m||(k.as="script"),k.crossOrigin="",k.href=g,v&&k.setAttribute("nonce",v),document.head.appendChild(k),m)return new Promise((l,u)=>{k.addEventListener("load",l),k.addEventListener("error",()=>u(new Error(`Unable to preload CSS for ${g}`)))})}))}function r(c){const v=new Event("vite:preloadError",{cancelable:!0});if(v.payload=c,window.dispatchEvent(v),!v.defaultPrevented)throw c}return n.then(c=>{for(const v of c||[])v.status==="rejected"&&r(v.reason);return a().catch(r)})},Tt="/assets/Accord%20Trooper%20Boss-DDJO-wED.png",$t="/assets/Accord%20Trooper%20Elite-Db9UiL1s.png",Ct="/assets/Accord%20Trooper%20Female1-DSVayjw7.png",Mt="/assets/Accord%20Trooper%20Female2-D8A8_n_q.png",He="/assets/Accord%20Trooper%20Grunt-BbQNY3Dv.png",It="/assets/Accord%20Trooper%20MiniBoss-BHMJnX-A.png",ot="/assets/AccordTrooper_JusticeRunsCold-YPByb84Y.png",Bt="/assets/Boldness-DflM3gJm.png",Et="/assets/EnemyFaction_JusticeRunsCold-C0rKGIAx.png",Lt="/assets/Outlaw%20Scrapper%20Boss-fUZKa8CJ.png",Dt="/assets/Outlaw%20Scrapper%20Elite-CWEg6AFD.png",Ve="/assets/Outlaw%20Scrapper%20Female1-RknBOU1C.png",Pt="/assets/Outlaw%20Scrapper%20Female2-BPzKrXVC.png",Nt="/assets/Outlaw%20Scrapper%20Female3-v6-xnLQn.png",Ot="/assets/Outlaw%20Scrapper%20Female4-IuANChrv.png",Ke="/assets/Outlaw%20Scrapper%20Grunt-DhWHth-W.png",Rt="/assets/Outlaw%20Scrapper%20MiniBoss-CNNuoBhH.png",Pe="/assets/Pyromancer-CC7-XGQf.png",lt="/assets/Shade_JusticeRunsCold-CfJD30Jo.png",Ft="/assets/Syndacite%20Raptor%20Female1-DDqb_fib.png",Ht="/assets/Syndicate%20Raptor%20Boss-Czxp40Yn.png",Vt="/assets/Syndicate%20Raptor%20Elite-DKD_TPs0.png",ct="/assets/Syndicate%20Raptor%20Grunt-DN8lZYLz.png",Wt="/assets/Syndicate%20Raptor%20MiniBoss-B4i-9ro5.png",Ie="/assets/Technomancer-B626Bcsv.png",Ae="/assets/Vanguard-rwFHslqc.png",zt="/assets/Voidborn%20Sentinel%20Boss-DI3BO3NI.png",jt="/assets/Voidborn%20Sentinel%20Elite-DjY73pzB.png",Gt="/assets/Voidborn%20Sentinel%20Grunt-DyMCLAe_.png",qt="/assets/Voidborn%20Sentinel%20MiniBoss-p5dnWzaL.png",Ut="/assets/Voidborn%20Sentinel%20Woman1-va8GlF6F.png",Yt="/assets/Voidborn%20Sentinel%20Woman2-CBtSakC9.png",Kt="/assets/Voidborn%20Sentinel%20Woman3-CmuT5RZA.png",Be="/assets/Voidrunner-2jcVJD0_.png",Jt="/assets/ember_self_control_battle-Th6RrhJN.png",Xt="/assets/ember_self_control_conflict-DRVHh6T3.png",Qt="/assets/ember_self_control_intro-2SPAqthu.png",Zt="/assets/enemyhero-BRk33-ep.png",ea="/assets/nova_altruism_battle-C63KeJjW.png",ta="/assets/nova_altruism_conflict-DRN9Z-qQ.png",aa="/assets/nova_altruism_intro-CVxdZNSn.png",sa="/assets/nova_boldness_battle-lf5r9mSj.png",ia="/assets/nova_boldness_conflict-D2loYck-.png",ra="/assets/nova_boldness_intro-DkHP6aPj.png",na="/assets/shade_empathy_battle-tKiSJUWU.png",oa="/assets/shade_empathy_conflict-GtOjsu-L.png",la="/assets/shade_empathy_intro-CTs7ldsF.png",ca="/assets/volt_adaptability_battle-BcEiy1VX.png",da="/assets/volt_adaptability_conflict-D3ljlxkE.png",pa="/assets/volt_adaptability_intro-B0auBLiE.png";function Ra(e,a,i,s){const n=(()=>{try{const h=Object.assign({"../../assets/images/Accord Trooper Boss.png":Tt,"../../assets/images/Accord Trooper Elite.png":$t,"../../assets/images/Accord Trooper Female1.png":Ct,"../../assets/images/Accord Trooper Female2.png":Mt,"../../assets/images/Accord Trooper Grunt.png":He,"../../assets/images/Accord Trooper MiniBoss.png":It,"../../assets/images/AccordTrooper_JusticeRunsCold.png":ot,"../../assets/images/Boldness.png":Bt,"../../assets/images/EnemyFaction_JusticeRunsCold.png":Et,"../../assets/images/Outlaw Scrapper Boss.png":Lt,"../../assets/images/Outlaw Scrapper Elite.png":Dt,"../../assets/images/Outlaw Scrapper Female1.png":Ve,"../../assets/images/Outlaw Scrapper Female2.png":Pt,"../../assets/images/Outlaw Scrapper Female3.png":Nt,"../../assets/images/Outlaw Scrapper Female4.png":Ot,"../../assets/images/Outlaw Scrapper Grunt.png":Ke,"../../assets/images/Outlaw Scrapper MiniBoss.png":Rt,"../../assets/images/Pyromancer.png":Pe,"../../assets/images/Shade_JusticeRunsCold.png":lt,"../../assets/images/Syndacite Raptor Female1.png":Ft,"../../assets/images/Syndicate Raptor Boss.png":Ht,"../../assets/images/Syndicate Raptor Elite.png":Vt,"../../assets/images/Syndicate Raptor Grunt.png":ct,"../../assets/images/Syndicate Raptor MiniBoss.png":Wt,"../../assets/images/Technomancer.png":Ie,"../../assets/images/Vanguard.png":Ae,"../../assets/images/Voidborn Sentinel Boss.png":zt,"../../assets/images/Voidborn Sentinel Elite.png":jt,"../../assets/images/Voidborn Sentinel Grunt.png":Gt,"../../assets/images/Voidborn Sentinel MiniBoss.png":qt,"../../assets/images/Voidborn Sentinel Woman1.png":Ut,"../../assets/images/Voidborn Sentinel Woman2.png":Yt,"../../assets/images/Voidborn Sentinel Woman3.png":Kt,"../../assets/images/Voidrunner.png":Be,"../../assets/images/ember_self_control_battle.png":Jt,"../../assets/images/ember_self_control_conflict.png":Xt,"../../assets/images/ember_self_control_intro.png":Qt,"../../assets/images/enemyhero.png":Zt,"../../assets/images/nova_altruism_battle.png":ea,"../../assets/images/nova_altruism_conflict.png":ta,"../../assets/images/nova_altruism_intro.png":aa,"../../assets/images/nova_boldness_battle.png":sa,"../../assets/images/nova_boldness_conflict.png":ia,"../../assets/images/nova_boldness_intro.png":ra,"../../assets/images/shade_empathy_battle.png":na,"../../assets/images/shade_empathy_conflict.png":oa,"../../assets/images/shade_empathy_intro.png":la,"../../assets/images/volt_adaptability_battle.png":ca,"../../assets/images/volt_adaptability_conflict.png":da,"../../assets/images/volt_adaptability_intro.png":pa}),V=E=>E.toLowerCase().replace(/[^a-z0-9]/g,""),$={};for(const[E,Q]of Object.entries(h)){const te=E.split("/").pop()||"",T=te.substring(0,te.lastIndexOf("."))||te;T&&($[V(T)]=Q)}return $}catch{return{}}})();e.innerHTML="";const r=document.createElement("div");r.className="dialogue-screen",e.appendChild(r),r.innerHTML=`
    <style id="dialogue-inline-style">.dlg-wrap{display:grid;position:relative;grid-template-rows:auto 1fr auto;height:100dvh;max-width:480px;margin:0 auto;background-color:#0b1220;color:#e5e7eb;background-position:center center;background-repeat:no-repeat;background-size:auto 100dvh}.dlg-bg{position:absolute;inset:0;z-index:0;pointer-events:none}.dlg-bg__layer{position:absolute;inset:0;background-position:center center;background-repeat:no-repeat;background-size:auto 100dvh;opacity:0;transition:opacity 1200ms ease}.dlg-bg__layer.is-visible{opacity:1}.dlg-hud{position:relative;z-index:5;height:60px;display:flex;align-items:center;justify-content:center;border-bottom:1px solid rgba(255,255,255,.08)}.dlg-header{display:flex;align-items:center;justify-content:space-between;width:100%;padding:0 16px;pointer-events:auto}.dlg-stars{font-size:24px;color:#fbbf24}.dlg-skip{display:flex;justify-content:flex-end}.dlg-skip .btn{background:rgba(220,38,38,.2);border:1px solid rgba(220,38,38,.5);color:#fca5a5;font-size:12px;padding:6px 12px;border-radius:6px;font-weight:600;transition:all .2s ease}.dlg-skip .btn:hover{background:rgba(220,38,38,.3);border-color:rgba(220,38,38,.7)}.dlg-scene{position:relative;z-index:1;display:grid;grid-template-columns:1fr 1fr;align-items:end;gap:8px;padding:12px;height:100%}.dlg-char{display:flex;flex-direction:column;align-items:center;gap:6px;opacity:.6;transition:opacity .2s ease;z-index:1}.dlg-char.active{opacity:1}.dlg-char.greyed-out{opacity:0.3;filter:grayscale(80%)}.dlg-portrait{width:120px;height:120px;border-radius:8px;background:rgba(15,23,42,.9);border:1px solid rgba(148,163,184,.25);background-size:cover;background-position:center}.dlg-name{font-size:12px;opacity:.9}.dlg-bubble-row{grid-column:1 / -1;display:flex;gap:8px;align-items:flex-end;justify-content:space-between;padding-bottom:200px}.dlg-bubble-row.center{position:absolute;left:12px;right:12px;bottom:calc(env(safe-area-inset-bottom, 12px) + 240px);top:auto;transform:none;justify-content:center;align-items:center;min-height:0;padding-bottom:0;z-index:2}.dlg-bubble-row.center > div[style*="flex:1"]{display:none}.dlg-bubble-row.left{position:absolute;left:12px;bottom:calc(env(safe-area-inset-bottom, 12px) + 240px);top:auto;transform:none;justify-content:flex-start;align-items:flex-end;min-height:0;padding-bottom:0;z-index:2;width:auto}.dlg-bubble-row.right{position:absolute;right:2px;bottom:calc(env(safe-area-inset-bottom, 12px) + 240px);top:auto;transform:none;justify-content:flex-end;align-items:flex-end;min-height:0;padding-bottom:0;z-index:2;width:auto}.dlg-bubble{max-width:75%;background:rgba(30,41,59,.9);border:1px solid rgba(148,163,184,.25);border-radius:12px;padding:10px}.dlg-bubble.left{align-self:flex-end;max-width:300px}.dlg-bubble.right{align-self:flex-end;background:rgba(51,65,85,.9);max-width:280px;margin-right:4px}.dlg-bubble.narrator{background:linear-gradient(180deg,rgba(30,41,59,.95),rgba(15,23,42,.95));border-color:rgba(250,204,21,.35);box-shadow:0 0 20px rgba(250,204,21,.08) inset,0 4px 24px rgba(0,0,0,.35);max-width:400px}.dlg-bubble.narrator .dlg-text{font-size:16px;line-height:1.3;text-shadow:0 1px 2px rgba(0,0,0,.6)}.dlg-speaker{font-size:11px;font-weight:700;margin-bottom:4px;color:#93c5fd}.dlg-text{font-size:14px;line-height:1.25}.choice-wrap{position:absolute;left:12px;right:12px;bottom:calc(env(safe-area-inset-bottom, 12px) + 200px);display:flex;align-items:flex-end;justify-content:center;background:transparent;pointer-events:none}.choice-card{background:rgba(15,23,42,.95);border:1px solid rgba(148,163,184,.3);border-radius:12px;padding:12px;max-width:420px;width:90%;pointer-events:auto}.choice-title{font-weight:800;margin-bottom:8px}.choice-list{display:flex;flex-direction:column;gap:8px}.choice-list .btn{white-space:normal;word-wrap:break-word;text-align:left;min-height:44px;line-height:1.3;padding:12px}.tap{position:absolute;left:0;right:0;bottom:0;height:50%;opacity:0;z-index:4}#char-left{position:absolute;left:12px;bottom:8px}#char-right{position:absolute;right:12px;bottom:8px}.dlg-final{position:absolute;left:0;right:0;bottom:calc(env(safe-area-inset-bottom, 12px) + 156px);display:flex;align-items:flex-end;justify-content:center;z-index:3}.dlg-final .final-card{display:flex;gap:8px;align-items:center;justify-content:center;background:rgba(15,23,42,.95);border:1px solid rgba(148,163,184,.3);border-radius:12px;padding:12px;backdrop-filter:blur(6px)}</style>
    <div class="dlg-wrap">
      <div class="dlg-bg">
        <div class="dlg-bg__layer" data-bg="a"></div>
        <div class="dlg-bg__layer" data-bg="b"></div>
      </div>
      <div class="dlg-hud" id="hud">
        <div class="dlg-header">
          <div class="dlg-stars" id="header-stars"></div>
          <div class="dlg-skip" id="header-skip"></div>
        </div>
      </div>
      <div class="dlg-scene" id="scene">
        <div class="dlg-char" id="char-left">
          <div class="dlg-portrait" aria-hidden="true"></div>
          <div class="dlg-name" id="name-left"></div>
        </div>
        <div class="dlg-char" id="char-right">
          <div class="dlg-portrait" aria-hidden="true"></div>
          <div class="dlg-name" id="name-right"></div>
        </div>
        <div class="dlg-bubble-row">
          <div class="dlg-bubble left" id="bubble-left">
            <div class="dlg-speaker" id="speaker-left"></div>
            <div class="dlg-text" id="text-left"></div>
          </div>
          <div class="dlg-bubble right" id="bubble-right">
            <div class="dlg-speaker" id="speaker-right"></div>
            <div class="dlg-text" id="text-right"></div>
          </div>
        </div>
      </div>
      <div class="rails" id="rails"></div>
      <div id="choiceWrap" class="choice-wrap" style="display:none">
        <div class="choice-card">
          <div id="choiceTitle" class="choice-title"></div>
          <div id="choiceList" class="choice-list"></div>
        </div>
      </div>

      <div id="tap" class="tap" aria-label="Advance"></div>
    </div>
  `;const c=r.querySelector("#scene"),v=r.querySelector("#bubble-left"),g=r.querySelector("#bubble-right"),m=r.querySelector("#speaker-left"),f=r.querySelector("#speaker-right"),k=r.querySelector("#text-left"),l=r.querySelector("#text-right"),u=r.querySelector("#name-left"),x=r.querySelector("#name-right"),F=r.querySelector("#char-left .dlg-portrait"),P=r.querySelector("#char-right .dlg-portrait"),C=r.querySelector("#rails"),w=r.querySelector("#choiceWrap"),B=r.querySelector("#choiceTitle"),H=r.querySelector("#choiceList"),b=r.querySelector("#header-stars"),N=r.querySelector("#header-skip"),A=r.querySelector("#tap");r.querySelector("#hud"),r.querySelector(".dlg-wrap");function o(h){return new Promise(V=>{const $=new Image;$.onload=()=>{var E;try{const Q=(E=$.decode)==null?void 0:E.call($);Q&&typeof Q.then=="function"?Q.then(()=>V(),()=>V()):V()}catch{V()}},$.onerror=()=>V(),$.src=h})}function y(h){const V=h.querySelector('.dlg-bg [data-bg="a"]'),$=h.querySelector('.dlg-bg [data-bg="b"]');let E=V,Q=$;return{setInitial:S=>{E&&(E.style.backgroundImage=`url('${S}')`,E.classList.add("is-visible"))},setBackground:async S=>{!Q||!E||(await o(S),Q.style.backgroundImage=`url('${S}')`,Q.classList.add("is-visible"),E.classList.remove("is-visible"),[E,Q]=[Q,E])}}}const _=y(r);let q=!1;function L(h){try{const $=h?(Q=>Q.toLowerCase().replace(/[^a-z0-9]/g,""))(h):"",E=$?n[$]:void 0;E&&(q?_.setBackground(E):(_.setInitial(E),q=!0))}catch{}}function Y(...h){for(const V of h)if(V)try{const E=n[(Q=>Q.toLowerCase().replace(/[^a-z0-9]/g,""))(V)];if(E){q?_.setBackground(E):(_.setInitial(E),q=!0);return}}catch{}}function K(){var T;const h=a(),V=((T=h.script[0])==null?void 0:T.scene)||"default",$=h.leftName||"The hero",E={Nova:"Nova rushes into battle without preparation...",Ember:"Ember is caught by surprise, forced to fight...",Shade:"Shade stumbles into combat unprepared...",Volt:"Volt charges forward without strategy...",default:"The hero rushes into battle unprepared..."},Q=E[$]||E.default;i({script:[{scene:V,speaker:"Narrator",side:"center",text:Q,isHandicapMessage:!0}],index:0}),O()}function j(){const h=a(),V=Math.max(0,Math.min(3,h.stars||0)),$="★".repeat(V),E="☆".repeat(3-V);if(b.textContent=`${$}${E}`,!N.querySelector("#battleNowBtn")){N.innerHTML='<button id="battleNowBtn" class="btn btn--secondary">Battle Now</button>';const Q=N.querySelector("#battleNowBtn");Q&&Q.addEventListener("click",K,{passive:!0})}}function O(){var te;j();const h=a(),V=h.script[h.index];if(h.index===0&&h.defaultSceneBg&&L(h.defaultSceneBg),!V){s({stars:h.stars||0,route:"party"});return}const $=(T,S)=>{if(!S)return"";const d=(T||"").trim();if(!d)return S;const R=Z=>Z.replace(/[^a-z0-9]/gi,"").toLowerCase(),W=R(d),ee=S.match(/^([^:]{1,60}):\s*(.*)$/);if(ee){const Z=ee[1];if(R(Z)===W)return ee[2]}return S},E=T=>{if(!T)return!1;const S=T.toLowerCase();return S.includes("syndicate")||S.includes("accord")||S.includes("voidborn")||S.includes("outlaw")||S.includes("enemy faction")||S.includes("captured")},Q=T=>T?T.includes("Syndicate")?"Syndicate":T.includes("Accord")?"Accord":T.includes("Voidborn")?"Voidborn":T.includes("Outlaw")?"Outlaws":T.includes("Enemy Faction")?"Enemy":"":"";u.textContent=h.leftName||"Left",x.textContent=h.rightName||"Right";try{F&&F.setAttribute("style",`${F.getAttribute("style")||""};background-image:${h.leftImgUrl?`url('${h.leftImgUrl}')`:"none"}`),P&&P.setAttribute("style",`${P.getAttribute("style")||""};background-image:${h.rightImgUrl?`url('${h.rightImgUrl}')`:"none"}`)}catch{}if(C&&(C.innerHTML=""),V.type==="choice"){const T=V;w.style.display="";try{A.style.pointerEvents="none"}catch{}try{w.style.pointerEvents="auto",w.style.zIndex="5"}catch{}B.textContent=T.title,B.style.display=T.title?"":"none",H.innerHTML="",T.options.forEach(d=>{var W;const R=document.createElement("button");R.className="btn btn--primary",R.textContent=((W=d.followup)==null?void 0:W.text)||d.label,R.onclick=()=>de(d),H.appendChild(R)}),m.textContent="",k.textContent="",f.textContent="",l.textContent="",v.style.visibility="hidden",g.style.visibility="hidden";const S=T.scene||h.defaultSceneBg||T.title;S&&(c.setAttribute("data-scene",S),Y(T.scene,h.defaultSceneBg,T.title))}else{w.style.display="none";try{w.style.pointerEvents="none",w.style.zIndex=""}catch{}try{A.style.pointerEvents="auto"}catch{}const T=V,S=T.scene||h.defaultSceneBg;S&&(c.setAttribute("data-scene",S),Y(T.scene,h.defaultSceneBg));const d=T.side,R=d==="left",W=d==="right",ee=r.querySelector("#char-left"),Z=r.querySelector("#char-right");ee.classList.toggle("active",!!R),Z.classList.toggle("active",!!W),Z&&h.leftName==="Shade"&&(W?(Z.classList.remove("greyed-out"),Z.classList.add("active")):(Z.classList.add("greyed-out"),Z.classList.remove("active")));const ie=G=>{const X=(G||"").toLowerCase();return X==="left"?h.leftName||"Left":X==="right"?h.rightName||"Right":G||""};if(d==="center"){const G=E(T.speaker),X=r.querySelector(".dlg-bubble-row");if(X.classList.remove("left","right"),X.classList.add("center"),v.style.visibility="",g.style.visibility="hidden",G){v.classList.remove("narrator");const I=Q(T.speaker);m.textContent=I||T.speaker||"",k.textContent=T.text||""}else v.classList.add("narrator"),m.textContent="",k.textContent=T.text||"";f.textContent="",l.textContent=""}else if(d==="left"){const G=r.querySelector(".dlg-bubble-row");G.classList.remove("center","right"),G.classList.add("left"),v.style.visibility="",v.classList.remove("narrator"),g.style.visibility="hidden";const X=ie(T.speaker);m.textContent=X,f.textContent="";const I=T.text||"",U=$(X,I);k.textContent=U,l.textContent=""}else if(d==="right"){const G=r.querySelector(".dlg-bubble-row");G.classList.remove("center","left"),G.classList.add("right"),v.style.visibility="hidden",g.style.visibility="",m.textContent="";const X=ie(T.speaker);f.textContent=X;const I=T.text||"",U=$(X,I);k.textContent="",l.textContent=U;const z=r.querySelector("#char-right");X.toLowerCase().includes("outlaw")&&(z.classList.remove("greyed-out"),z.classList.add("active"))}else if(d==="left"||d==="center"){const G=r.querySelector("#char-right");G&&(((te=r.querySelector(".dlg-speaker-right"))==null?void 0:te.textContent)||"").toLowerCase().includes("outlaw")&&(G.classList.add("greyed-out"),G.classList.remove("active"))}else r.querySelector(".dlg-bubble-row").classList.remove("center","left","right"),v.classList.remove("narrator"),v.style.visibility="hidden",g.style.visibility="hidden",m.textContent="",f.textContent="",k.textContent="",l.textContent="";if(h.index>=h.script.length-1){if(V&&"isHandicapMessage"in V&&V.isHandicapMessage){try{A.style.pointerEvents="auto"}catch{}return}try{A.style.pointerEvents="none"}catch{}C&&(C.innerHTML=""),setTimeout(()=>s({stars:h.stars||0,route:"party"}),250)}}}function de(h){var Q;const V=a(),$=Math.min(3,(V.stars||0)+(h.star?1:0));let E=V.script.slice();if(h.followup){const te=(Q=V.script[V.index])==null?void 0:Q.scene,T={...h.followup,scene:te};E.splice(V.index+1,0,T)}i({stars:$,script:E,index:V.index+1}),O(),h.followup&&setTimeout(()=>{const te=a();te.index===V.index+1&&(i({index:te.index+1}),O())},100)}function se(){const h=a(),V=h.script[h.index];if((V==null?void 0:V.type)!=="choice"){if(V&&"isHandicapMessage"in V&&V.isHandicapMessage){s({stars:0,route:"party",skipDialogue:!0});return}h.index>=h.script.length-1||(i({index:h.index+1}),O())}}A.addEventListener("click",se,{passive:!0});const he=h=>{(h.key===" "||h.key==="Enter"||h.key==="ArrowRight")&&(h.preventDefault(),se())};document.addEventListener("keydown",he);const t=r.querySelector("#char-left"),p=r.querySelector("#char-right"),M=a().leftName==="Shade";return p&&M&&(p.classList.add("greyed-out"),p.classList.remove("active")),t&&(t.classList.remove("greyed-out"),t.classList.add("active")),O(),()=>{document.removeEventListener("keydown",he);try{e.removeChild(r)}catch{}}}const Fa=[{id:"basic-attack-kinetic",name:"Basic Attack",type:"kinetic",role:"prime",baseDamage:12,primesApplied:1,primeType:"weakpoint",allowedClasses:["vanguard"],tags:{prime:!0,primeElement:"kinetic",primeName:"Weakpoint"}},{id:"basic-attack-arc",name:"Basic Attack",type:"arc",role:"prime",baseDamage:12,primesApplied:1,primeType:"overload",allowedClasses:["technomancer"],tags:{prime:!0,primeElement:"arc",primeName:"Overload"}},{id:"basic-attack-thermal",name:"Basic Attack",type:"thermal",role:"prime",baseDamage:12,primesApplied:1,primeType:"burn",allowedClasses:["pyromancer"],tags:{prime:!0,primeElement:"thermal",primeName:"Burn"}},{id:"basic-attack-void",name:"Basic Attack",type:"void",role:"prime",baseDamage:12,primesApplied:1,primeType:"suppress",allowedClasses:["voidrunner"],tags:{prime:!0,primeElement:"void",primeName:"Suppress"}},{id:"rail-shot",name:"Rail Shot",type:"kinetic",role:"detonator",baseDamage:25,detonates:!0,detonationTriggers:["weakpoint","overload","burn","suppress","freeze"],splashFactor:.3,allowedClasses:["vanguard"],tags:{detonator:!0}},{id:"suppressive-burst",name:"Suppressive Burst",type:"kinetic",role:"prime",baseDamage:12,primesApplied:1,primeType:"weakpoint",splashFactor:.4,allowedClasses:["vanguard"],tags:{prime:!0,primeElement:"kinetic",primeName:"Weakpoint"}},{id:"overwatch",name:"Overwatch",type:"kinetic",role:"detonator",baseDamage:18,primesApplied:1,primeType:"weakpoint",detonates:!0,detonationTriggers:["weakpoint","overload","burn","suppress","freeze"],critBonus:1.5,allowedClasses:["vanguard"],tags:{detonator:!0}},{id:"arc-surge",name:"Arc Surge",type:"arc",role:"prime",baseDamage:15,primesApplied:1,primeType:"overload",splashFactor:.5,allowedClasses:["technomancer"],tags:{prime:!0,primeElement:"arc"}},{id:"chain-discharge",name:"Chain Discharge",type:"arc",role:"detonator",baseDamage:20,detonates:!0,detonationTriggers:["overload","suppress"],splashFactor:.6,aoeRadius:2,allowedClasses:["technomancer"],tags:{detonator:!0}},{id:"capacitor-overload",name:"Capacitor Overload",type:"arc",role:"detonator",baseDamage:16,primesApplied:1,primeType:"overload",detonates:!0,detonationTriggers:["overload"],splashFactor:.4,allowedClasses:["technomancer"],tags:{detonator:!0}},{id:"thermal-lance",name:"Thermal Lance",type:"thermal",role:"prime",baseDamage:14,primesApplied:1,primeType:"burn",splashFactor:.3,allowedClasses:["pyromancer"],tags:{prime:!0,primeElement:"thermal"}},{id:"thermal-burst",name:"Thermal Burst",type:"thermal",role:"detonator",baseDamage:22,detonates:!0,detonationTriggers:["burn"],splashFactor:.7,aoeRadius:3,allowedClasses:["pyromancer"],tags:{detonator:!0}},{id:"meltdown-strike",name:"Meltdown Strike",type:"thermal",role:"detonator",baseDamage:19,primesApplied:1,primeType:"burn",detonates:!0,detonationTriggers:["burn"],comboMultiplier:2,allowedClasses:["pyromancer"],tags:{detonator:!0}},{id:"void-suppression",name:"Void Suppression",type:"void",role:"prime",baseDamage:13,primesApplied:1,primeType:"suppress",statusEffects:["turn-delay"],allowedClasses:["voidrunner"],tags:{prime:!0,primeElement:"void"}},{id:"gravity-collapse",name:"Gravity Collapse",type:"void",role:"detonator",baseDamage:24,detonates:!0,detonationTriggers:["suppress"],splashFactor:.5,allowedClasses:["voidrunner"],tags:{detonator:!0}},{id:"singularity-spike",name:"Singularity Spike",type:"void",role:"detonator",baseDamage:17,primesApplied:1,primeType:"suppress",detonates:!0,detonationTriggers:["suppress"],aoeRadius:2,allowedClasses:["voidrunner"],tags:{detonator:!0}},{id:"cryo-grenade",name:"Cryo Grenade",type:"thermal",role:"prime",baseDamage:10,primesApplied:1,primeType:"freeze",splashFactor:.6,statusEffects:["slow"],allowedClasses:["pyromancer"],tags:{prime:!0,primeElement:"thermal"}},{id:"shatter-round",name:"Shatter Round",type:"kinetic",role:"detonator",baseDamage:28,detonates:!0,detonationTriggers:["freeze"],critBonus:2,allowedClasses:["vanguard"],tags:{detonator:!0}},{id:"disruptor-pulse",name:"Disruptor Pulse",type:"arc",role:"detonator",baseDamage:30,detonates:!0,detonationTriggers:["overload","suppress"],splashFactor:.8,aoeRadius:3,allowedClasses:["technomancer"],tags:{detonator:!0}},{id:"incendiary-sweep",name:"Incendiary Sweep",type:"thermal",role:"detonator",baseDamage:26,detonates:!0,detonationTriggers:["burn","weakpoint"],splashFactor:.9,aoeRadius:4,allowedClasses:["pyromancer"],tags:{detonator:!0}},{id:"coordinated-strike",name:"Coordinated Strike",type:"kinetic",role:"detonator",baseDamage:32,detonates:!0,detonationTriggers:["weakpoint","suppress"],splashFactor:.5,comboMultiplier:1.8,allowedClasses:["vanguard"],tags:{detonator:!0}}];function Ha(){return{id:"kinetic-barrier",name:"Kinetic Barrier",type:"kinetic",role:"sustain",baseDamage:0,cooldown:2,allowedClasses:["vanguard"],superCost:10,tags:{sustain:!0}}}function Va(){return{id:"thermal-burst-sustain",name:"Thermal Burst",type:"thermal",role:"sustain",baseDamage:0,cooldown:3,allowedClasses:["pyromancer"],superCost:15,tags:{sustain:!0}}}function Wa(){return{id:"arc-restore",name:"Arc Restore",type:"arc",role:"sustain",baseDamage:0,cooldown:3,allowedClasses:["technomancer"],superCost:12,tags:{sustain:!0}}}function za(){return{id:"void-drain",name:"Void Drain",type:"void",role:"sustain",baseDamage:0,cooldown:2,allowedClasses:["voidrunner"],superCost:6,tags:{sustain:!0}}}function ja(){return{id:"heal",name:"Heal",type:"kinetic",role:"sustain",baseDamage:0,cooldown:1,allowedClasses:["vanguard","technomancer","pyromancer","voidrunner"],superCost:4,tags:{sustain:!0}}}function Ga(){return{id:"barrier",name:"Barrier",type:"arc",role:"sustain",baseDamage:0,cooldown:2,allowedClasses:["vanguard","technomancer","pyromancer","voidrunner"],superCost:6,tags:{sustain:!0}}}function qa(){return{id:"cleanse",name:"Cleanse",type:"void",role:"sustain",baseDamage:0,allowedClasses:["vanguard","technomancer","pyromancer","voidrunner"],superCost:2,tags:{sustain:!0}}}function Ua(){return{id:"guard",name:"Guard",type:"kinetic",role:"sustain",baseDamage:0,cooldown:2,allowedClasses:["vanguard","technomancer","pyromancer","voidrunner"],superCost:0,tags:{sustain:!0}}}const Ya=[{id:"prime-shot",name:"Prime Shot",type:"arc",role:"prime",baseDamage:8,primesApplied:1,primeType:"overload",detonates:!1,allowedClasses:["technomancer","pyromancer","voidrunner"],tags:{prime:!0,primeElement:"arc"}},{id:"kinetic-burst",name:"Kinetic Burst",type:"kinetic",role:"detonator",baseDamage:22,detonates:!0,detonationTriggers:["weakpoint","overload","burn","suppress","freeze"],allowedClasses:["vanguard"],tags:{detonator:!0}},{id:"thermal-bomb",name:"Thermal Bomb",type:"thermal",role:"detonator",baseDamage:16,primesApplied:1,primeType:"burn",detonates:!0,detonationTriggers:["burn"],splashFactor:.5,allowedClasses:["pyromancer"],tags:{detonator:!0}},{id:"arc-lance",name:"Arc Lance",type:"arc",role:"prime",baseDamage:18,primesApplied:1,primeType:"overload",splashFactor:.3,allowedClasses:["technomancer"],tags:{prime:!0,primeElement:"arc"}},{id:"void-lance",name:"Void Lance",type:"void",role:"prime",baseDamage:16,primesApplied:1,primeType:"suppress",splashFactor:.2,allowedClasses:["voidrunner"],tags:{prime:!0,primeElement:"void"}},{id:"ion-mark",name:"Ion Mark",type:"arc",role:"prime",baseDamage:12,primesApplied:1,primeType:"overload",splashFactor:.2,allowedClasses:["vanguard"],tags:{prime:!0,primeElement:"arc"}},{id:"targeting-uplink",name:"Targeting Uplink",type:"kinetic",role:"prime",baseDamage:8,primesApplied:1,primeType:"weakpoint",splashFactor:.3,allowedClasses:["technomancer"],tags:{prime:!0,primeElement:"kinetic",primeName:"Weakpoint"}},{id:"cinder-bind",name:"Cinder Bind",type:"void",role:"prime",baseDamage:12,primesApplied:1,primeType:"suppress",statusEffects:["turn-delay"],allowedClasses:["pyromancer"],tags:{prime:!0,primeElement:"void"}},{id:"shadow-brand",name:"Shadow Brand",type:"kinetic",role:"prime",baseDamage:10,primesApplied:1,primeType:"weakpoint",splashFactor:.25,allowedClasses:["voidrunner"],tags:{prime:!0,primeElement:"kinetic",primeName:"Weakpoint"}},Ha(),Va(),Wa(),za(),ja(),Ga(),qa(),Ua(),{id:"detonator-strike",name:"Detonator Strike",type:"kinetic",role:"detonator",baseDamage:26,detonates:!0,detonationTriggers:["weakpoint","overload","burn","suppress","freeze"],splashFactor:.4,allowedClasses:["vanguard"],tags:{detonator:!0}},{id:"nova_aoe_suppressive_barrage",name:"Suppressive Barrage",type:"kinetic",role:"prime",baseDamage:15,allowedClasses:["vanguard"],tags:{AOE:!0,NoPrimeNoDet:!0},targeting:{mode:"n-random",count:3},riders:["ignore10pctShields"],superCost:40,cooldownTurns:1,grantsSuperOnHit:!1},{id:"volt_aoe_static_surge",name:"Static Surge",type:"arc",role:"prime",baseDamage:12,allowedClasses:["technomancer"],tags:{AOE:!0,ShieldBreaker:!0,NoPrimeNoDet:!0},targeting:{mode:"all"},riders:["doubleVsShields"],superCost:40,cooldownTurns:1,grantsSuperOnHit:!1},{id:"ember_aoe_emberwave",name:"Emberwave",type:"thermal",role:"prime",baseDamage:8,allowedClasses:["pyromancer"],tags:{AOE:!0,Primer:!0},targeting:{mode:"n-random",count:2},primesApplied:1,primeType:"burn",riders:[],superCost:40,cooldownTurns:1,grantsSuperOnHit:!1},{id:"shade_aoe_entropy_collapse",name:"Entropy Collapse",type:"void",role:"detonator",baseDamage:9,allowedClasses:["voidrunner"],tags:{AOE:!0,Detonator:!0,Control:!0},targeting:{mode:"n-random",count:2},detonates:!0,detonationTriggers:["weakpoint","overload","burn","suppress","freeze"],riders:["applySuppressOnDetonate"],superCost:40,cooldownTurns:1,grantsSuperOnHit:!1}],Qe=[...Fa,...Ya],fe=Object.fromEntries(Qe.map(e=>[e.id,e])),at={vanguard:"kinetic-barrier",technomancer:"arc-restore",pyromancer:"thermal-burst-sustain",voidrunner:"void-drain"};function Ka(e){return Qe.filter(a=>a.allowedClasses.includes(e))}const ze=[{id:"none",name:"None",basicMult:.85,basicType:"kinetic"},{id:"sidearm",name:"Sidearm",basicMult:1.3,basicType:"kinetic"},{id:"shock-baton",name:"Shock Baton",basicMult:1.25,basicType:"arc"},{id:"flame-pistol",name:"Flame Pistol",basicMult:1.25,basicType:"thermal"},{id:"void-blade",name:"Void Blade",basicMult:1.25,basicType:"void"},{id:"kinetic-rifle",name:"Kinetic Rifle",basicMult:1.25,basicType:"kinetic"},{id:"heavy-blade",name:"Heavy Blade",totalDamageMult:1.2,basicType:"kinetic"},{id:"det-gauntlet",name:"Detonator Gauntlet",detonationDirectMult:1.25,detonationSplashMult:1.5,basicType:"void"},{id:"shield-emitter",name:"Shield Emitter",maxShBonus:40,basicType:"arc"},{id:"medgel-frame",name:"Medgel Frame",maxHpBonus:40,basicType:"thermal"},{id:"overcharger",name:"Overcharger",superGainMult:1.25,basicType:"arc"}],ma=Object.fromEntries(ze.map(e=>[e.id,e]));function Ja(e,a,i,s,n){let r=null;const c=new Set;function v(){var de;const{roster:o,partySelection:y,maxParty:_,allAbilities:q,selectedByChar:L,loadoutActiveIndex:Y}=a,K=Math.min(Math.max(Y||0,0),Math.max(y.length-1,0)),j=y[K],O=o.find(se=>se.id===j);e.innerHTML=`
      <div class="loadout-screen">
        <div class="loadout-fixed-header">
          <div class="lfh-left">
            <div class="lfh-label">Configure Loadouts</div>
            ${y.length>0&&O?`
              <div class="lfh-name">${O.name} <span class="lfh-class">(<img class="class-icon" src="${f(O.classId)}" alt="${k(O.classId)}" /> ${k(O.classId)})</span></div>
              <div class="lfh-sub">
                ${u(O.abilitySlots,(a.selectedByChar[O.id]||[]).length)}
                <span class="lfh-slots">${(a.selectedByChar[O.id]||[]).length}/${O.abilitySlots} Slots</span>
              </div>
            `:'<div class="lfh-name">No party selected</div>'}
          </div>
          <div class="lfh-right">
            <button id="btnBackToParty" class="btn ghost-btn">Back</button>
          </div>
        </div>

        ${y.length>0&&O?`
          <div class="party-selector" role="tablist" aria-label="Party members">
            ${y.map((se,he)=>{const t=o.find(J=>J.id===se),p=he===K;return`
                <button class="party-chip ${p?"is-active":""}" data-action="select-party-index" data-index="${he}" role="tab" aria-selected="${p}">
                  <span class="chip-name">${t.name}</span>
                  <span class="chip-class"><img class="class-icon" src="${f(t.classId)}" alt="${k(t.classId)}" /> ${k(t.classId)}</span>
                </button>
              `}).join("")}
          </div>

          <div class="ability-assignment">
            ${g(O,L[O.id]||[],q)}
          </div>
        `:`
          <div class="empty-state">
            <p>Please select your party first.</p>
          </div>
        `}

        ${y.length>0&&O?`
          <div class="sticky-footer">
            <div class="footer-left">
              <span class="footer-label">Slots Remaining</span>
              <span class="footer-count">${Math.max(O.abilitySlots-(((de=a.selectedByChar[O.id])==null?void 0:de.length)||0),0)}</span>
            </div>
            <div class="footer-actions">
              <button id="btnStartBattle" class="btn btn--primary big-btn" ${w()?"":"disabled"}>Done</button>
            </div>
          </div>
        `:""}
      </div>
    `,B()}function g(o,y,_){const q=Ka(o.classId),L=y.map(O=>_.find(de=>de.id===O)).filter(Boolean),Y=o.abilitySlots-L.length;L.filter(O=>O.id.startsWith("basic-attack-"));const K=L.filter(O=>O.role==="sustain"),j=L.filter(O=>O.role==="prime"||O.role==="detonator");return`
      <div class="character-ability-section" data-char-id="${o.id}">
        <div class="character-ability-header">
          <div class="cah-left">
            <div class="cah-title">${o.name} <span class="cah-class">(<img class="class-icon" src="${f(o.classId)}" alt="${k(o.classId)}" /> ${k(o.classId)})</span></div>
            <div class="cah-sub">${u(o.abilitySlots,L.length)}</div>
          </div>
          <div class="cah-right"><span class="slots-info">${L.length}/${o.abilitySlots} Slots</span></div>
        </div>
        
        <!-- Weapon Selection -->
        <div class="weapon-selection">
          <h4>Weapon:</h4>
          <div class="weapon-grid">
            ${A(o.id)}
          </div>
        </div>
        
        <!-- Slot Requirements -->
        <div class="slot-requirements">
          <h4>Required Slots:</h4>
          <div class="slot-requirement-list">
            <div class="slot-requirement ${K.length>=1?"is-filled":"is-empty"}">
              <span class="requirement-label">Sustain:</span>
              <span class="requirement-status">${K.length>=1?"✓ Filled":"✗ Empty"}</span>
            </div>
            <div class="slot-requirement ${j.length>=4?"is-filled":"is-empty"}">
              <span class="requirement-label">Offensive (4):</span>
              <span class="requirement-status">${j.length}/4 ${j.length>=4?"✓ Filled":"✗ Incomplete"}</span>
            </div>
          </div>
        </div>
        
        <!-- Selected Abilities -->
        ${L.length>0?`
          <div class="selected-abilities">
            <h4>Selected Abilities:</h4>
            <div class="selected-ability-list">
              ${L.map((O,de)=>{var t;const he=((t=O.tags)==null?void 0:t.AOE)?'<span class="aoe-badge">AOE</span>':"";return`
                  <div class="selected-ability" data-ability-id="${O.id}">
                    <span class="ability-name">${de+1}. ${O.name}</span>
                    ${he}
                    <span class="ability-role ${O.role}">${l(O.role)}</span>
                    <button class="btn-remove" data-action="remove-ability" data-char-id="${o.id}" data-ability-id="${O.id}">×</button>
                  </div>
                `}).join("")}
            </div>
          </div>
        `:""}
        
        <!-- Available Abilities -->
        ${Y>0?`
          <div class="available-abilities">
            <h4>Available Abilities (${Y} slots remaining):</h4>
            <div class="ability-grid ability-grid--mobile">
              ${q.filter(O=>!y.includes(O.id)).map(O=>m(O,o.id)).join("")}
            </div>
          </div>
        `:`
          <div class="no-slots-remaining">
            <p>All ability slots filled for ${o.name}.</p>
          </div>
        `}
      </div>
    `}function m(o,y){var Y;const _=c.has(o.id);x(o),o.splashFactor&&`${Math.round(o.splashFactor*100)}`,o.primesApplied!=null&&`${o.primesApplied}`;const L=((Y=o.tags)==null?void 0:Y.AOE)?'<span class="aoe-badge">AOE</span>':"";return o.role,`
      <div class="ability-card ability-card--mobile ${_?"is-expanded":"is-collapsed"}" data-ability-id="${o.id}" data-char-id="${y}">
        <button class="ability-toggle" data-action="toggle-ability" data-ability-id="${o.id}">
          <div class="ability-left-content">
            <div class="ability-title-row">
              <span class="ability-title">${o.name}</span>
              ${L}
            </div>
            <div class="ability-description">${F(o)}</div>
          </div>
          <div class="ability-right-content">
            <div class="ability-stats">
              ${o.role==="prime"&&o.baseDamage===0?"":`<span class="stat-compact">D ${o.baseDamage}</span>`}
              <span class="stat-compact">CD ${o.cooldownTurns||o.cooldown||0}</span>
              <span class="stat-compact">SP ${o.superCost?`-${o.superCost}`:0}</span>
            </div>
            <button class="btn btn-add-ability-compact" data-action="add-ability" data-ability-id="${o.id}" data-char-id="${y}" aria-label="Add ${o.name}">+</button>
          </div>
        </button>
      </div>
    `}function f(o){return{vanguard:Ae,technomancer:Ie,pyromancer:Pe,voidrunner:Be}[o]}function k(o){return{vanguard:"Vanguard",technomancer:"Technomancer",pyromancer:"Pyromancer",voidrunner:"Voidrunner"}[o]}function l(o){return{prime:"Primer",detonator:"Detonator",sustain:"Sustain"}[o]}function u(o,y){const _=Array.from({length:o},(q,L)=>`<span class="slot-dot ${L<y?"is-filled":""}"></span>`).join("");return`<span class="slot-dots" aria-label="${y} of ${o} slots used">${_}</span>`}function x(o){return o.role==="detonator"?`Best used against primed targets. Pairs well with: ${P(o.type)}`:o.role==="prime"?`Sets up combos. Pairs well with: ${C(o.type)}`:"Detonates existing primes."}function F(o){return o.id==="nova_aoe_suppressive_barrage"?"Area attack: hits 3 random enemies. Ignores 10% of shields. Costs 40 Super.":o.id==="volt_aoe_static_surge"?"Area attack: hits all enemies. Double damage vs shielded targets. Costs 40 Super.":o.id==="ember_aoe_emberwave"?"Area attack: hits 2 random enemies. Applies Burn prime to each. Costs 40 Super.":o.id==="shade_aoe_entropy_collapse"?"Area attack: hits 2 random enemies. Detonates primes for bonus damage + Suppress. Costs 40 Super.":o.role==="detonator"?`Detonates existing primes for bonus damage. Base damage: ${o.baseDamage}`:o.role==="prime"?`Applies ${o.primeType||"prime"} to target. Base damage: ${o.baseDamage}`:o.role==="sustain"?"Defensive ability with special effects.":`Base damage: ${o.baseDamage}`}function P(o){return{kinetic:"Suppressive Burst",arc:"Arc Surge",thermal:"Thermal Lance",void:"Void Suppression"}[o]}function C(o){return{kinetic:"Rail Shot",arc:"Chain Discharge",thermal:"Thermal Burst",void:"Gravity Collapse"}[o]}function w(){const{partySelection:o,selectedByChar:y}=a;return o.length!==3||a.lockedCharacterId&&!o.includes(a.lockedCharacterId)?!1:o.every(_=>{const q=y[_]||[];if(q.length===0)return!1;const L=q.map(j=>a.allAbilities.find(O=>O.id===j)).filter(j=>j!==void 0),Y=L.filter(j=>j.role==="sustain"),K=L.filter(j=>j.role==="prime"||j.role==="detonator");return Y.length===1&&K.length>=1})}function B(){r||(r=o=>{const y=o.target;if(!y)return;const _=y.closest('[data-action="add-ability"]');if(_){const j=_.getAttribute("data-ability-id"),O=_.getAttribute("data-char-id");H(O,j);return}const q=y.closest('[data-action="remove-ability"]');if(q){const j=q.getAttribute("data-ability-id"),O=q.getAttribute("data-char-id");b(O,j);return}const L=y.closest('[data-action="select-weapon"]');if(L){const j=L.getAttribute("data-weapon-id"),O=L.getAttribute("data-char-id");N(O,j);return}const Y=y.closest('[data-action="select-party-index"]');if(Y){const j=Number(Y.getAttribute("data-index"))||0;i(O=>{const de=O.loadout.partySelection.length;de!==0&&(O.loadout.loadoutActiveIndex=Math.min(Math.max(j,0),de-1))}),setTimeout(v,0);return}const K=y.closest('[data-action="toggle-ability"]');if(K){const j=K.getAttribute("data-ability-id");if(j){c.has(j)?c.delete(j):c.add(j);const O=K.closest(".ability-card");O&&O.classList.toggle("is-expanded"),O&&O.classList.toggle("is-collapsed")}return}if(y.id==="btnStartBattle"){w()&&n();return}if(y.id==="btnBackToParty"){s();return}},e.addEventListener("click",r))}function H(o,y){i(_=>{const q=_.loadout.roster.find(se=>se.id===o);if(!q)return;const L=_.loadout.selectedByChar[o]||[];if(L.includes(y))return;const K=_.loadout.allAbilities.find(se=>se.id===y);if(!K)return;console.log(`🔍 Adding ability ${y} (${K.role}) to ${o}`),console.log("📊 Current abilities:",L),console.log(`🎯 Character has ${q.abilitySlots} slots`);const j=[];for(const se of L){const he=_.loadout.allAbilities.find(t=>t.id===se);he&&j.push(he)}const O=j.filter(se=>se.role==="sustain"),de=j.filter(se=>se.role==="prime"||se.role==="detonator");if(console.log(`📈 Current counts - Sustains: ${O.length}, Offensive: ${de.length}`),K.role==="sustain"){if(O.length>=1){console.log(`❌ Cannot add sustain - already have ${O.length}`);return}}else if((K.role==="prime"||K.role==="detonator")&&de.length>=4){console.log(`❌ Cannot add offensive - already have ${de.length}`);return}if(L.length>=q.abilitySlots){console.log(`❌ Cannot add - at slot limit ${L.length}/${q.abilitySlots}`);return}console.log(`✅ Adding ability ${y} to ${o}`),_.loadout.selectedByChar[o]=[...L,y],console.log("📊 New ability list:",_.loadout.selectedByChar[o])})}function b(o,y){i(_=>{const q=_.loadout.selectedByChar[o]||[];_.loadout.selectedByChar[o]=q.filter(L=>L!==y)})}function N(o,y){i(_=>{_.loadout.selectedWeaponByChar||(_.loadout.selectedWeaponByChar={}),_.loadout.selectedWeaponByChar[o]=y}),setTimeout(v,0)}function A(o){var _;const y=((_=a.selectedWeaponByChar)==null?void 0:_[o])||"none";return console.log("Rendering weapon options for char:",o),console.log("Available weapons:",ze),ze.map(q=>{const L=q.id===y,Y=q.basicType||"kinetic",K=`weapon-element weapon-element--${Y}`,j=Y.charAt(0).toUpperCase()+Y.slice(1);return console.log(`Weapon ${q.name}:`,{elementType:Y,elementClass:K,elementName:j}),`
        <button class="weapon-option ${L?"is-selected":""}" 
                data-action="select-weapon" 
                data-char-id="${o}" 
                data-weapon-id="${q.id}">
          <div class="weapon-info">
            <div class="weapon-name">${q.name}</div>
            <div class="weapon-stats">
              ${q.basicMult?`Basic x${q.basicMult.toFixed(2)}`:""}
              ${q.totalDamageMult?`Damage x${q.totalDamageMult.toFixed(2)}`:""}
              ${q.maxHpBonus?`+${q.maxHpBonus} HP`:""}
              ${q.maxShBonus?`+${q.maxShBonus} SH`:""}
              ${q.superGainMult?`Super x${q.superGainMult.toFixed(2)}`:""}
            </div>
          </div>
          <span class="${K}">${j}</span>
        </button>
      `}).join("")}return v(),()=>{r&&(e.removeEventListener("click",r),r=null),e.innerHTML=""}}const dt=new Map,ua=new Map;function ha(e,a){dt.set(e,a),ua.set(e,a.key)}function De(e){return dt.get(e)}function Xa(){dt.clear(),ua.clear()}function Qa(e){const a=e.party[e.activePartyIndex];if(!a)return{dmg:20,reason:"no target"};const i=Math.floor(Math.random()*5)-2;return a.bars.sh>0?{dmg:Math.max(1,26+i),reason:"target has shields"}:{dmg:Math.max(1,18+i),reason:"finishing blow"}}const Ne={Voidborn:{id:"Voidborn",hpMult:1.3,shMult:1,spdMult:.85,dmgMult:1.15,resistVuln:{void:.8,arc:1.2,thermal:1.4,kinetic:1},primeMods:{applyChanceBonus:{suppress:.15,pierce:.1},durationMod:{suppress:1.2}},specials:{regenPerTurn:2}},Syndicate:{id:"Syndicate",hpMult:1,shMult:1.15,spdMult:1.15,dmgMult:1.25,resistVuln:{arc:1,thermal:1,void:1.4,kinetic:1},primeMods:{applyChanceBonus:{overload:.05,burn:.05,suppress:.05}},specials:{counterChance:.1}},Accord:{id:"Accord",hpMult:1.15,shMult:1,spdMult:1,dmgMult:1.2,resistVuln:{kinetic:.9,thermal:1.4,arc:1,void:1},specials:{detonationBonus:.25,reinforcementChance:.1}},Outlaws:{id:"Outlaws",hpMult:.7,shMult:.3,spdMult:1.2,dmgMult:1,resistVuln:{kinetic:1.05,arc:1.4,thermal:1.1,void:1.05},specials:{swarmAura:{radius:3,dmgBonus:.1}}}};function Za(e,a){if(!e)return 1;const i=Ne[e];return i?i.resistVuln[a]??1:1}function es(e,a,i){var n;if(!e||!a||!i)return 0;const s=Ne[e];return((n=s==null?void 0:s.specials)==null?void 0:n.detonationBonus)??0}function ts(e,a){var r;if(!e)return 0;const i=Ne[e],s=(r=i==null?void 0:i.specials)==null?void 0:r.swarmAura;return s&&(a||[]).includes("Swarm")?s.dmgBonus??0:0}const Je={Grunt:{tier:"Grunt",mult:{hp:.5,shields:.6,speed:1.1,damage:.6},ai:{preferPrimers:.1,targetDiscipline:.2,primeResistMod:1},spawnWeight:60,lootTier:"Common",abilitySlots:{primers:1,detonators:0,nukes:1},nameFormat:e=>`${e} Grunt`},Elite:{tier:"Elite",mult:{hp:1.1,shields:1,speed:1,damage:1},ai:{preferDetonation:.2,preferPrimers:.2,targetDiscipline:.5,counterChance:.05,primeResistMod:.95},spawnWeight:30,lootTier:"Uncommon",abilitySlots:{primers:1,detonators:1,nukes:1},nameFormat:e=>`${e} Elite`},Miniboss:{tier:"Miniboss",mult:{hp:1.6,shields:1.3,speed:.95,damage:1.2},ai:{preferDetonation:.35,targetDiscipline:.7,counterChance:.08,primeResistMod:.9},spawnWeight:8,lootTier:"Rare",abilitySlots:{primers:1,detonators:1,nukes:2},nameFormat:e=>`${e} Miniboss`},Boss:{tier:"Boss",mult:{hp:2.64,shields:1.8,speed:1,damage:1.68},ai:{actionPoints:2,preferDetonation:.5,targetDiscipline:.9,counterChance:.12,primeResistMod:.85},spawnWeight:2,lootTier:"Epic",abilitySlots:{primers:1,detonators:2,nukes:2},nameFormat:e=>`${e} Boss`}};function Ge(e,a,i=[]){const s=[];Object.keys(Je).forEach(n=>{var l;const r=Je[n],c=((l=a.roleByTier)==null?void 0:l[n])||ss(n),v=r.nameFormat(a.baseName),g=`${e.toLowerCase()}_${n.toLowerCase()}`,m=[...et(a.pools.primers,r.abilitySlots.primers),...et(a.pools.detonators,r.abilitySlots.detonators),...et(a.pools.nukes,r.abilitySlots.nukes)],f={hp:Math.round(a.baseStats.hp*r.mult.hp),shields:Math.round(a.baseStats.shields*r.mult.shields),speed:Math.round(a.baseStats.speed*r.mult.speed),damage:Math.round(a.baseStats.damage*r.mult.damage)},k={key:g,name:v,faction:e,role:c,baseStats:f,abilities:m,tags:[n]};s.push(k)});for(const n of i.filter(r=>r.faction===e)){const r=s.findIndex(c=>c.key===n.key);r>=0&&(s[r]={...s[r],...n.name?{name:n.name}:{},...n.role?{role:n.role}:{},...n.tags?{tags:[...new Set([...s[r].tags||[],...n.tags])]}:{},...n.baseStats?{baseStats:{...s[r].baseStats,...n.baseStats}}:{},...n.abilities?{abilities:n.abilities}:{}})}return s}function et(e,a){if(a<=0)return[];if(e.length<=a)return e.slice(0,a);const i=e.slice(),s=[];for(;s.length<a&&i.length;)s.push(i.splice(as(i.length),1)[0]);return s}const as=e=>Math.floor(Math.random()*e);function ss(e){return e==="Grunt"?"Minion":e==="Elite"?"Skirmisher":e==="Miniboss"?"Bruiser":"Captain"}const qe={Voidborn:{baseName:"Voidborn Sentinel",baseStats:{hp:96,shields:30,speed:7,damage:16},pools:{primers:[{id:"void_lance",display:"Void Lance",damageType:"void",isPrimer:!0,primeType:"suppress",aiWeight:.5}],detonators:[{id:"entropy_burst",display:"Entropy Burst",damageType:"void",isDetonator:!0,aiWeight:.5}],nukes:[{id:"negentropy_ray",display:"Negentropy Ray",damageType:"void",aiWeight:.4}]},roleByTier:{Boss:"Controller"}},Syndicate:{baseName:"Syndicate Raptor",baseStats:{hp:72,shields:40,speed:10,damage:20},pools:{primers:[{id:"arc_net",display:"Arc Net",damageType:"arc",isPrimer:!0,primeType:"overload",aiWeight:.3}],detonators:[{id:"detpack",display:"DetPack",damageType:"thermal",isDetonator:!0,aiWeight:.2}],nukes:[{id:"smart_shot",display:"Smart Shot",damageType:"kinetic",aiWeight:.5}]}},Accord:{baseName:"Accord Trooper",baseStats:{hp:114,shields:25,speed:8,damage:18},pools:{primers:[{id:"smoke_marker",display:"Smoke Marker",damageType:"kinetic",isPrimer:!0,primeType:"pierce",aiWeight:.3}],detonators:[{id:"focus_fire",display:"Focus Fire",damageType:"kinetic",isDetonator:!0,aiWeight:.4}],nukes:[{id:"rifle_burst",display:"Rifle Burst",damageType:"kinetic",aiWeight:.6}]}},Outlaws:{baseName:"Outlaw Scrapper",baseStats:{hp:42,shields:0,speed:11,damage:10},pools:{primers:[{id:"molotov",display:"Molotov",damageType:"thermal",isPrimer:!0,primeType:"burn",aiWeight:.2}],detonators:[{id:"kick_it",display:"Kick-It",damageType:"kinetic",isDetonator:!0,aiWeight:.2}],nukes:[{id:"rust_blade",display:"Rust Blade",damageType:"kinetic",aiWeight:.8}]}}},Ue=[{key:"voidborn_boss",faction:"Voidborn",tier:"Boss",name:"The Null Archon",baseStats:{hp:120},tags:["StoryBoss"]}],is=[...Ge("Voidborn",qe.Voidborn,Ue),...Ge("Syndicate",qe.Syndicate,Ue),...Ge("Accord",qe.Accord,Ue),...Ge("Outlaws",qe.Outlaws,Ue)],rs=[{key:"voidborn_sentinel",name:"Voidborn Sentinel",faction:"Voidborn",role:"Controller",baseStats:{hp:96,shields:30,speed:7,damage:16},abilities:[{id:"void_lance",display:"Void Lance",damageType:"void",isPrimer:!0,primeType:"suppress",aiWeight:.5},{id:"entropy_burst",display:"Entropy Burst",damageType:"void",isDetonator:!0,aiWeight:.5}],tags:["Debuffer"]},{key:"syndicate_raptor",name:"Syndicate Raptor",faction:"Syndicate",role:"Skirmisher",baseStats:{hp:72,shields:40,speed:10,damage:20},abilities:[{id:"smart_shot",display:"Smart Shot",damageType:"kinetic",aiWeight:.5},{id:"arc_net",display:"Arc Net",damageType:"arc",isPrimer:!0,primeType:"overload",aiWeight:.3},{id:"detpack",display:"DetPack",damageType:"thermal",isDetonator:!0,aiWeight:.2}],tags:["Opportunist"]},{key:"accord_trooper",name:"Accord Trooper",faction:"Accord",role:"Bruiser",baseStats:{hp:114,shields:25,speed:8,damage:18},abilities:[{id:"rifle_burst",display:"Rifle Burst",damageType:"kinetic",aiWeight:.6},{id:"focus_fire",display:"Focus Fire",damageType:"kinetic",isDetonator:!0,aiWeight:.4}],tags:["DetonatorFocus"]},{key:"outlaw_scrapper",name:"Outlaw Scrapper",faction:"Outlaws",role:"Minion",baseStats:{hp:42,shields:0,speed:11,damage:10},abilities:[{id:"rust_blade",display:"Rust Blade",damageType:"kinetic",aiWeight:.8},{id:"molotov",display:"Molotov",damageType:"thermal",isPrimer:!0,primeType:"burn",aiWeight:.2}],tags:["Swarm"]}],Xe=[...is,...rs||[]];function ga(e){const a=Xe.find(n=>n.key===e);if(!a)throw new Error(`Enemy archetype not found: ${e}`);const i=Ne[a.faction],s={hp:Math.round(a.baseStats.hp*i.hpMult),maxHp:Math.round(a.baseStats.hp*i.hpMult),shields:Math.round(a.baseStats.shields*i.shMult),maxShields:Math.round(a.baseStats.shields*i.shMult),speed:Math.round(a.baseStats.speed*i.spdMult),damage:Math.round(a.baseStats.damage*i.dmgMult)};return(a.tags||[]).includes("Grunt")&&(s.shields=0,s.maxShields=0),{key:a.key,name:a.name,faction:a.faction,stats:s,abilities:a.abilities,role:a.role,tags:a.tags}}function ns(e,a){Ne[e.faction];const i=(e.tags||[]).find(l=>l==="Grunt"||l==="Elite"||l==="Miniboss"||l==="Boss"),s=i?Je[i]:void 0,n=e.abilities.filter(l=>l.isDetonator),r=e.abilities.filter(l=>l.isPrimer),c=e.abilities.filter(l=>!l.isPrimer&&!l.isDetonator);if(a.players.filter(l=>l.hp<50).length>0&&Math.random()<.6){const l=Fe(a,2);if(Object.values((l==null?void 0:l.hasPrime)||{}).some(Boolean)&&n.length)return{ability:Se(n),target:l};if(c.length)return{ability:Se(c),target:l};if(r.length)return{ability:Se(r),target:l}}if((a.selfHpPct??1)<.3&&Math.random()<.4){if(r.length)return{ability:Se(r),target:tt(a,2)};if(c.length)return{ability:Se(c),target:Fe(a,2)}}if((a.enemies||[]).filter(l=>l.key!==e.key&&(l.abilities||[]).some(u=>u.isDetonator)).length>0&&r.length&&Math.random()<.5)return{ability:Se(r),target:tt(a,2)};const m=a.players.filter(l=>Object.values(l.hasPrime||{}).some(Boolean));if(n.length&&m.length){const l=os(m);return{ability:Se(n),target:l}}if(e.faction==="Voidborn"&&r.length)return{ability:Se(r),target:tt(a,2)};if(e.faction==="Accord"&&n.length)return{ability:Se(n),target:Fe(a,2)};if(e.faction==="Outlaws")return{ability:Se([...r,...c]),target:Fe(a,2)};let f=ls([...r,...n,...c]);if(s){const l=s.ai.preferDetonation||0,u=s.ai.preferPrimers||0;f=f.map(x=>({...x,aiWeight:(x.aiWeight||.33)+(x.isDetonator?l:0)+(x.isPrimer?u:0)}))}const k=(s==null?void 0:s.ai.targetDiscipline)??0;return{ability:Se(f),target:cs(a,k)}}function Fe(e,a=2){const i=e.players.slice().sort((n,r)=>n.hp-r.hp),s=i.slice(0,Math.min(a,i.length));return s[Math.floor(Math.random()*s.length)]}function tt(e,a=2){const i=e.players.slice().sort((n,r)=>n.shields-r.shields),s=i.slice(0,Math.min(a,i.length));return s[Math.floor(Math.random()*s.length)]}function os(e){return e[Math.floor(Math.random()*e.length)]}function ls(e){return e.map(a=>({...a,aiWeight:a.aiWeight??.33}))}function Se(e){const a=e.reduce((s,n)=>s+(n.aiWeight||0),0)||1;let i=Math.random()*a;for(const s of e)if(i-=s.aiWeight||.1,i<=0)return s;return e[0]}function cs(e,a){const i=Math.max(0,Math.min(1,a??0));return Math.random()<i?Fe(e,2):e.players[Math.floor(Math.random()*e.players.length)]}function Ee(e,a){const i=e.party.find(s=>s.actorId===a);if(i!=null&&i.weaponId)return ma[i.weaponId]}function ba(e){switch(e){case"weakpoint":return"kinetic";case"overload":return"arc";case"burn":return"thermal";case"suppress":return"void";case"freeze":return"thermal";case"pierce":return"kinetic";default:return"kinetic"}}function ds(e){switch(e){case"kinetic":return"weakpoint";case"arc":return"overload";case"thermal":return"burn";case"void":return"suppress";default:return"weakpoint"}}const mt=1.3,ps=.15,st={detonator:1.15,prime:.92},me={l1Cost:100,gainBasic:40,gainDealPer100:16,gainTakePer100:27,gainPrimeSuccess:22,gainDetonateSuccess:31,gainKillShot:36,gainHitPrimed:13,refundDetonate:25,maxGainPerTurn:120,maxGainPerAction:60,maxEnergy:300,l2Cost:200,l3Cost:300,sameTypeDoublePrimeSuperMult:1.35};function ms(e,a,i,s,n,r){let c=0;switch(e){case"basic":c+=me.gainBasic;break;case"prime":c+=me.gainPrimeSuccess;break;case"detonate":c+=me.gainDetonateSuccess;break}return s&&(c+=me.gainKillShot),n&&(c+=me.gainHitPrimed),c+=Math.round(a/100*me.gainDealPer100),c=Math.min(c,me.maxGainPerAction),c=Math.min(c,me.maxGainPerTurn-r),Math.max(0,c)}const ne={healMin:22,healMax:28,barrierAmount:20,barrierHits:2,barrierPhases:1,cleanseShGain:10,guardRedirectPct:.3,guardPhases:1,guardSuperPer50:3,fatiguePenalty:.2,fatigueWindow:3};function fa(e){return Math.max(0,Math.min(me.maxEnergy,Math.round(e)))}function us(e){const a=fa(e);return a>=300?3:a>=200?2:a>=100?1:0}function ke(e,a){return fa((e??0)+a)}function it(e,a){if(!e)return!1;const i=Math.floor(e.superEnergy??0);return a===1?i>=me.l1Cost:a===2?i>=me.l2Cost:i>=me.l3Cost}function hs(e,a){const i=a===1?me.l1Cost:a===2?me.l2Cost:me.l3Cost;return{...e,superEnergy:ke(e.superEnergy,-i)}}function ya(e){return e.enemies[e.targetIndex]}function xa(e){return e.enemies.filter(i=>i.bars.hp>0).length===0}function rt(e){if(e.enemies.filter(n=>n.bars.hp>0).length===0)return-1;if(e.targetIndex<0||e.targetIndex>=e.enemies.length||e.enemies[e.targetIndex].bars.hp<=0)return e.enemies.findIndex(n=>n.bars.hp>0);let i=(e.targetIndex+1)%e.enemies.length,s=0;for(;s<e.enemies.length;){if(e.enemies[i].bars.hp>0)return i;i=(i+1)%e.enemies.length,s++}return e.enemies.findIndex(n=>n.bars.hp>0)}function va(e){const a=e.enemies.length;if(e.enemies.forEach(i=>{i.bars.hp<=0&&!i._deathAnimationState&&(i._deathAnimationState="dying",i._deathAnimationPlayed=!1,i._wasDeadInPreviousRender=!1)}),e.enemies=e.enemies.filter(i=>i.bars.hp<=0?i._deathAnimationState==="dying"?!0:i._deathStartTime&&Date.now()-i._deathStartTime>1500?!1:(i._deathStartTime||(i._deathStartTime=Date.now()),!0):!0),xa(e)&&(e.isOver=!0,console.log("🎯 Engine: Victory condition met - all enemies defeated!")),e.targetIndex>=0&&e.targetIndex<e.enemies.length&&e.enemies[e.targetIndex].bars.hp<=0){const i=rt(e);i!==-1&&(e.targetIndex=i,console.log(`🎯 Auto-targeting: ${e.enemies[e.targetIndex].name}`))}return e.targetIndex>=e.enemies.length&&(e.targetIndex=Math.max(0,e.enemies.length-1)),a-e.enemies.length}function _e(e,a,i){const s={...e,bars:{...e.bars}};let n=Math.min(s.bars.sh,i==="arc"?a*mt:a);s.bars.sh-=n;let r=a-(i==="arc"?n/mt:n);s.bars.sh>0&&(r=0);let c=0;if(r>0){if(i==="void"){const v=r*ps;c+=v,r-=v}c+=r,s.bars.hp=Math.max(0,s.bars.hp-c)}return{defender:s,shLoss:Math.round(n),hpLoss:Math.round(c)}}const ut=2,gs=1.5,bs=.1,fs=2.15,ys=.25,xs=1.2,vs=.9,ht=.8;function Me(e,a,i){const s=Array.isArray(e.primes)?[...e.primes]:[];return s.findIndex(r=>r.element===a)>=0?(s.length>=ut&&(s.sort((r,c)=>r.appliedAt-c.appliedAt),s.shift()),s.push({element:a,source:i,appliedAt:Date.now()}),window.__PD_DEBUG__&&console.log(`[DEBUG] Stacked ${a} prime on ${e.name} (now ${s.length} total primes)`)):(s.length>=ut&&(s.sort((r,c)=>r.appliedAt-c.appliedAt),s.shift()),s.push({element:a,source:i,appliedAt:Date.now()}),window.__PD_DEBUG__&&console.log(`[DEBUG] Applied new ${a} prime on ${e.name} (now ${s.length} total primes)`)),{...e,primes:s}}function nt(e){return!e||e.length===0?"none":e.length===1?"single":e[0].element===e[1].element?"same":"mixed"}function Te(e,a,i,s,n,r,c){var N;const v=Math.round(i.baseDamage*st.detonator),g=nt(a.primes);let m=1,f=0;const k=Math.max(0,Math.min(1,(c==null?void 0:c.hopFactor)??1)),l=(c==null?void 0:c.visited)??new Set;if(l.add(a.id),g==="none"){const A=_e(a,v,i.type);return n.push(`${i.name}: no primes on target → no explosion.`),A.defender}if(g==="single"?(m=gs,f=bs):g==="same"?(m=(c==null?void 0:c.sameMult)??fs,f=ys):(m=xs,f=vs),r){const A=Ee(r,e.id);A!=null&&A.detonationDirectMult&&(m*=A.detonationDirectMult),A!=null&&A.totalDamageMult&&(m*=A.totalDamageMult),A!=null&&A.detonationSplashMult&&(f*=A.detonationSplashMult),(N=r.missionBuff)!=null&&N.detonationSplashMult&&(f*=r.missionBuff.detonationSplashMult)}const u=Math.round(v*m),x=Math.max(0,Math.round(Le(u,i.type,!0,e,a,r))),F=$e(a,i.type);F>1?n.push(`Weakness hit (${i.type}) x${F.toFixed(2)}.`):F<1&&n.push(`Resisted (${i.type}) x${F.toFixed(2)}.`);const P=Math.max(1,Math.round(x*k)),C=_e(a,P,i.type);let w=C.defender;if(f>0){const A=Math.max(1,Math.round(u*f));for(const o of s)if(o.id!==a.id&&o.bars.hp>0){const y=$e(o,i.type),_=Math.max(1,Math.round(A*y)),q=Math.max(1,Math.round(_*k)),L=_e(o,q,i.type),Y=s.findIndex(K=>K.id===o.id);if(Y!==-1){s[Y]=L.defender;const K=(L.shLoss||0)+(L.hpLoss||0);K>0&&n.push(`Splash damage to ${o.name}: ${K} damage (SH: ${L.shLoss||0}, HP: ${L.hpLoss||0})`)}}}w={...w,primes:[]};const B=g==="single"?"single":g==="same"?"same":"mixed",H=B==="mixed"&&m===1?"x1.00":`x${m.toFixed(2)}`,b=C.shLoss+C.hpLoss;if(n.push(`Detonation: ${B} → direct ${H} (${b} damage), splash ${f*100|0}%`),f>0)for(let A=0;A<s.length;A++){const o=s[A];if(!o||o.id===a.id||o.bars.hp<=0)continue;const y=nt(o.primes);if((y==="single"||y==="same"||y==="mixed")&&!l.has(o.id)){n.push(`Chain detonation on ${o.name} (hop factor: ${(k*ht).toFixed(2)}).`);const _=Te(e,o,i,s,n,r,{sameMult:c==null?void 0:c.sameMult,hopFactor:k*ht,visited:l});s[A]=_}}return w}function ws(e,a,i,s){var k,l,u,x,F,P;const n=[];let r={...i};const c=e.enemies.filter(C=>C.bars.hp>0);if(c.length===0)return n.push(`${s.name}: no valid targets.`),{events:n,newTarget:r};let v=[];if(((k=s.targeting)==null?void 0:k.mode)==="all")v=c;else if(((l=s.targeting)==null?void 0:l.mode)==="n-random"){const C=s.targeting.count||1;v=[...c].sort(()=>Math.random()-.5).slice(0,Math.min(C,c.length))}else if(((u=s.targeting)==null?void 0:u.mode)==="n-closest"){const C=s.targeting.count||1;v=c.slice(0,Math.min(C,c.length))}else v=[i];n.push(`${a.name} uses ${s.name} on ${v.length} target${v.length!==1?"s":""}.`);const g=[...e.enemies];let m=0;for(const C of v){const w=g.findIndex(y=>y.id===C.id);if(w===-1)continue;let H=s.baseDamage;const b=Ee(e,a.id);b!=null&&b.totalDamageMult&&(H=Math.round(H*b.totalDamageMult)),H=Math.max(0,Math.round(Le(H,s.type,!1,a,C,e)));const N=$e(C,s.type);if(N>1?n.push(`Weakness hit (${s.type}) x${N.toFixed(2)}.`):N<1&&n.push(`Resisted (${s.type}) x${N.toFixed(2)}.`),H=Math.max(1,Math.round(H*N)),(x=s.riders)!=null&&x.includes("ignore10pctShields")&&C.bars.sh>0){const y=Math.round(C.bars.sh*.1);H+=y,n.push(`${s.name} ignores ${y} shields.`)}(F=s.riders)!=null&&F.includes("doubleVsShields")&&C.bars.sh>0&&(H*=2,n.push(`${s.name} deals double damage vs shields!`));const A=_e(C,H,s.type);g[w]=A.defender;const o=A.shLoss+A.hpLoss;if(m+=o,s.primesApplied&&s.primeType){const y=ba(s.primeType),_=Me(A.defender,y,s.name);g[w]=_,n.push(`${s.name} applied ${s.primeType} to ${C.name}.`)}if(s.detonates&&s.detonationTriggers&&A.defender.primes.some(_=>{const q=ds(_.element);return s.detonationTriggers.includes(q)})){const _=ks(A.defender.primes),q=H+_,L=_e(A.defender,q,s.type);g[w]=L.defender,g[w]={...g[w],primes:[]},(P=s.riders)!=null&&P.includes("applySuppressOnDetonate")&&n.push(`${s.name} detonated primes and applied Suppress to ${C.name}.`),n.push(`${s.name} detonated primes for +${_} bonus damage!`)}}const f=g.findIndex(C=>C.id===i.id);return f!==-1&&(r=g[f]),e.enemies.splice(0,e.enemies.length,...g),n.push(`${s.name} dealt ${m} total damage.`),{events:n,newTarget:r}}function ks(e){return e.length===0?0:e.length===1?30:e.length===2?e[0].element===e[1].element?43:24:0}function _s(e,a,i,s){var f,k,l,u,x,F,P,C;const n=[];let r={...i};if((f=s.tags)!=null&&f.sustain)return n.push(`${a.name} uses ${s.name} (sustain ability).`),{events:n,newTarget:r};if((k=s.tags)!=null&&k.AOE)return ws(e,a,i,s);const c=(l=s.tags)==null?void 0:l.prime,v=(u=s.tags)==null?void 0:u.detonator,g=(x=e.overdriveByMember)==null?void 0:x[a.id],m=Array.isArray(r.primes)&&r.primes.length>0;if(g!=null&&g.active&&g.autoDetonateHits&&m&&!v)r=Te(a,r,s,e.enemies,n,e);else if(!(g!=null&&g.active)&&v)if(Array.isArray(r.primes)&&r.primes.length>0)r=Te(a,r,s,e.enemies,n,e);else{const w=Math.round(s.baseDamage*st.detonator),B=Math.max(0,Math.round(Le(w,s.type,!0,a,r,e))),H=$e(r,s.type);H>1?n.push(`Weakness hit (${s.type}) x${H.toFixed(2)}.`):H<1&&n.push(`Resisted (${s.type}) x${H.toFixed(2)}.`);const b=_e(r,B,s.type);r=b.defender;const N=b.shLoss+b.hpLoss;n.push(`${s.name}: no primes on target → no explosion. Heavy hit: ${w} base → ${B} final — SH −${b.shLoss}, HP −${b.hpLoss} (${N} total).`)}else if(c){const w=((F=s.tags)==null?void 0:F.primeElement)??s.type;if(s.baseDamage>0){const _=Ee(e,a.id);let q=Math.round(s.baseDamage*st.prime);_!=null&&_.totalDamageMult&&(q=Math.round(q*_.totalDamageMult));const L=Math.max(0,Math.round(Le(q,s.type,!1,a,r,e))),Y=$e(r,s.type);Y>1?n.push(`Weakness hit (${s.type}) x${Y.toFixed(2)}.`):Y<1&&n.push(`Resisted (${s.type}) x${Y.toFixed(2)}.`);const K=_e(r,L,s.type);r=K.defender;const j=K.shLoss+K.hpLoss;n.push(`${a.name} used ${s.name} (${q} base → ${L} final) — SH −${K.shLoss}, HP −${K.hpLoss} (${j} total).`)}const B=Array.isArray(r.primes)?r.primes:[],H=new Map;B.forEach(_=>{H.set(_.element,(H.get(_.element)||0)+1)});const b=H.get(w)||0;r=Me(r,w,((P=s.tags)==null?void 0:P.primeName)??s.name);const N=Array.isArray(r.primes)?r.primes:[],A=new Map;N.forEach(_=>{A.set(_.element,(A.get(_.element)||0)+1)});const o=A.get(w)||0,y=(C=s.tags)!=null&&C.primeName?s.tags.primeName:`${w.charAt(0).toUpperCase()}${w.slice(1)} prime`;o>b?o===1?n.push(`${s.name} applied ${y}.`):n.push(`${s.name} stacked ${y} (now ${o}x).`):n.push(`${s.name} refreshed ${y} (${o}x total).`)}else{const w=Ee(e,a.id),B=s.id==="__basic";let H=s.type,b=s.baseDamage;w&&(B&&w.basicMult&&(b=Math.round(b*w.basicMult)),w.totalDamageMult&&(b=Math.round(b*w.totalDamageMult)),B&&w.basicType&&(H=w.basicType));const N=Math.max(0,Math.round(Le(b,H,!1,a,r,e))),A=$e(r,H);A>1?n.push(`Weakness hit (${H}) x${A.toFixed(2)}.`):A<1&&n.push(`Resisted (${H}) x${A.toFixed(2)}.`);const o=_e(r,N,H);r=o.defender;const y=o.shLoss+o.hpLoss;n.push(`${a.name} used ${s.name} (${b} base → ${N} final) — SH −${o.shLoss}, HP −${o.hpLoss} (${y} total).`)}return r.bars.hp<=0&&n.push(`${i.name} is defeated.`),{events:n,newTarget:r}}const we={Vanguard:{L2:{base:42,chainFactor:.6}},Technomancer:{L2:{smallAoE:18,mediumAoE:24},L3:{base:22,forkBonus:.5}},Pyromancer:{L2:{base:16,burstBonusSame:me.sameTypeDoublePrimeSuperMult},L3:{fieldPhases:2,igniteTick:5}},Voidrunner:{L2:{base:28},L3:{base:26}}};function gt(e,a,i){const s=e.party.findIndex(b=>b.actorId===a),n=e.party[s];if(s===-1||!n||n.bars.hp<=0||!it(n,i))return e;const r=e.turn,c=hs(n,i),v=[...e.party];v[s]=c;let g=[...e.enemies];const m=[],f=ya(e)||e.enemies.find(b=>b.bars.hp>0);if(!f)return{...e,party:v};const k=e.enemies.findIndex(b=>b.id===f.id),l={id:c.actorId,name:c.name,bars:c.bars,primes:c.primes},u=(b,N,A)=>{const o=g[b],y=Math.max(0,Math.round(Le(N,A,!1,l,o,e))),_=$e(o,A);_>1?m.push(`Weakness hit (${A}) x${_.toFixed(2)}.`):_<1&&m.push(`Resisted (${A}) x${_.toFixed(2)}.`);const q=_e(o,y,A);return g[b]=q.defender,q},x={...e.enemies[k]},F=nt(x==null?void 0:x.primes),P=F&&F!=="none",C=F==="same",w=F==="mixed";if(c.classId==="vanguard")if(i===1){const b={name:"Adrenal Surge",type:"kinetic",baseDamage:28},N=Te(l,g[k],b,g,m,e);g[k]=N}else if(i===2){const b={name:"Bullet Time",type:"kinetic",baseDamage:we.Vanguard.L2.base},N=Te(l,g[k],b,g,m,e,{sameMult:me.sameTypeDoublePrimeSuperMult});if(g[k]=N,P){const A=g.map((o,y)=>({e:o,i:y})).filter(o=>o.i!==k&&o.e.bars.hp>0);if(A.length>0){const o=A[Math.floor(Math.random()*A.length)].i,y=Math.round(we.Vanguard.L2.base*we.Vanguard.L2.chainFactor),_=u(o,y,"kinetic"),q=_.shLoss+_.hpLoss;m.push(`Bullet Time chains to ${g[o].name}: ${y} base → ${q} total damage (SH: ${_.shLoss}, HP: ${_.hpLoss}).`)}}}else{const b={...e.overdriveByMember||{}};b[c.actorId]={autoDetonateHits:!0,active:!0},e.overdriveByMember=b,w&&m.push("Overdrive bonus: Team speed up (1 turn).")}else if(c.classId==="technomancer")if(i===1){const N=u(k,20,"arc"),A=N.shLoss+N.hpLoss;m.push(`Overload Spike hits ${g[k].name}: 20 base → ${A} total damage (SH: ${N.shLoss}, HP: ${N.hpLoss}).`)}else if(i===2){const b=w?we.Technomancer.L2.mediumAoE:we.Technomancer.L2.smallAoE;g.forEach((N,A)=>{if(g[A].bars.hp>0){const o=u(A,b,"arc");if(A===k){const y=o.shLoss+o.hpLoss;m.push(`Storm Cage hits ${g[A].name}: ${b} base → ${y} total damage (SH: ${o.shLoss}, HP: ${o.hpLoss}).`)}}}),m.push("Storm Cage deployed.")}else{const b=we.Technomancer.L3.base*(C?me.sameTypeDoublePrimeSuperMult:1),N=g.map((A,o)=>o).filter(A=>g[A].bars.hp>0);for(const A of N){const o=u(A,b,"arc");if(A===k){const y=o.shLoss+o.hpLoss;m.push(`Ion Tempest surges through ${g[A].name}: ${b} base → ${y} total damage (SH: ${o.shLoss}, HP: ${o.hpLoss}).`)}}if(w){let o=0;for(let y=0;y<2;y++){const _=g.map((K,j)=>j).filter(K=>g[K].bars.hp>0);if(_.length===0)break;const q=_[Math.floor(Math.random()*_.length)],L=Math.round(b*we.Technomancer.L3.forkBonus),Y=u(q,L,"arc");o+=Y.shLoss+Y.hpLoss}m.push(`Ion Tempest forks through the battlefield: 2 forks, ${o} total fork damage dealt.`)}}else if(c.classId==="pyromancer")if(i===1){g[k]=Me(g[k],"thermal","Ignite");const b=u(k,12,"thermal"),N=b.shLoss+b.hpLoss;m.push(`Ignite burst: 12 base → ${N} total damage (SH: ${b.shLoss}, HP: ${b.hpLoss}).`)}else if(i===2){const b={name:"Solar Flare",type:"thermal",baseDamage:we.Pyromancer.L2.base},N=Te(l,g[k],b,g,m,e,{sameMult:we.Pyromancer.L2.burstBonusSame}),A=Me(N,"thermal","Solar Flare");g[k]=A,g[k]=Me(g[k],"thermal","Solar Flare")}else{const b=we.Pyromancer.L3.fieldPhases;if(e.infernoFieldPhasesLeft=Math.max(e.infernoFieldPhasesLeft||0,b),g.forEach((N,A)=>{g[A].bars.hp>0&&(g[A]=Me(g[A],"thermal","Inferno Field"))}),w){let N=0;g.forEach((A,o)=>{if(g[o].bars.hp>0){const y=u(o,we.Pyromancer.L3.igniteTick,"thermal");N+=y.shLoss+y.hpLoss}}),m.push(`Inferno ignites the ground: ${we.Pyromancer.L3.igniteTick} base damage per enemy, ${N} total damage dealt.`)}m.push("Inferno field established.")}else if(c.classId==="voidrunner")if(i===1){const b={name:"Gravitic Jab",type:"void",baseDamage:18},N=Te(l,g[k],b,g,m,e);g[k]=N}else if(i===2){const b={name:"Event Horizon",type:"void",baseDamage:we.Voidrunner.L2.base},N=Te(l,g[k],b,g,m,e,{sameMult:me.sameTypeDoublePrimeSuperMult});g[k]=N,m.push(`${g[k].name} is Suppressed for 1 turn.`)}else{const b=we.Voidrunner.L3.base;for(let N=0;N<g.length;N++){if(g[N].bars.hp<=0)continue;const A={name:"Singularity",type:"void",baseDamage:b},o=Te(l,g[N],A,g,m,e);g[N]=o}w&&m.push("Singularity shockwave slows enemies for 1 turn.")}const B={...e,enemies:g,party:v};return va(B),{...B,log:[...e.log,...m],turn:r}}function $e(e,a){const i=De(e.id);return i?Za(i.faction,a):1}function Le(e,a,i,s,n,r){let c=e*$e(n,a);const v=De(s.id);if(!v&&(r!=null&&r.missionBuff)&&typeof r.missionBuff.playerDamageMult=="number"&&(c*=r.missionBuff.playerDamageMult),v){const g=Array.isArray(n.primes)&&n.primes.length>0,m=es(v.faction,i,g);if(m>0&&(c*=1+m),r&&v.faction==="Outlaws"){const f=r.enemies.filter(l=>l.id!==s.id&&l.bars.hp>0).map(l=>{var u;return((u=De(l.id))==null?void 0:u.tags)||[]}).flat(),k=ts(v.faction,f);k>0&&(c*=1+k)}}return c}function Ss(e){var d,R,W,ee,Z,ie,re;const a=e.selectedAbilityId;let i=a?fe[a]:void 0;if(!i&&(a==="__basic"||a==="__defend")&&a==="__basic"){const D=Ee(e,(d=e.party[e.activePartyIndex])==null?void 0:d.actorId),G=(D==null?void 0:D.basicType)||"kinetic";i={id:a,name:"Basic Attack",type:G,role:"prime",baseDamage:12,allowedClasses:["vanguard","technomancer","pyromancer","voidrunner"]}}const s=e.party[e.activePartyIndex];if(!s)return e;if(s.bars.hp<=0)return{...e,log:[...e.log,`${s.name} is defeated and cannot act.`]};const n={id:s.actorId,name:s.name,bars:s.bars,primes:s.primes};if(a==="__defend"){const D=at[s.classId],G=D?fe[D]:void 0;if(!G)return e;const I=((e.cooldownsByMember||{})[s.actorId]||{})[G.id]||0,U=Math.floor(s.superEnergy??0),z=Math.floor(G.superCost??0);if(I>0||U<z)return{...e,log:[...e.log,`${s.name} cannot use Defend: ${I>0?`CD ${I}`:""}${I>0&&U<z?" · ":""}${U<z?`Super ${U}/${z}`:""}`.trim()]};i=G}if(!i)return{...e,log:[...e.log,`Action failed: ability '${a||"none"}' not found.`]};if(i.superCost&&i.superCost>0){const D=Math.floor(s.superEnergy??0),G=Math.floor(i.superCost);if(D<G)return{...e,log:[...e.log,`${s.name} cannot use ${i.name}: insufficient Super (${D}/${G}).`]}}const r=!!((R=i.tags)!=null&&R.sustain);let c=ya(e)||e.enemies[0];if(!c&&!r)return{...e,log:[...e.log,"Action failed: no valid target."]};const v=!!((W=i.tags)!=null&&W.sustain);let g=[],m=e;if(v){const D=(i.id==="heal"||i.id==="arc-restore"||i.id==="kinetic-barrier")&&typeof e.selectedAllyIndex=="number"?e.selectedAllyIndex:void 0,G=As(e,s,i,D);g=G.events,m=G.state}const f=e.enemies.map(D=>({id:D.id,sh:D.bars.sh,hp:D.bars.hp,primes:(D.primes||[]).length})),{events:k,newTarget:l}=v?{events:g,newTarget:c}:_s(e,n,c,i);let u=l,x={...s};const F=(ee=i.tags)==null?void 0:ee.prime,P=(Z=i.tags)==null?void 0:Z.detonator,C=i.id==="__basic",w=s.actorId,B={...e.basicStreakByMember||{}},H=B[w]||0;let b=!1;if(C){const D=H+1;if(B[w]=D,D>=2){const G=Ee(e,s.actorId),X=(G==null?void 0:G.basicType)||"kinetic";u=Me(u,X,"Basic Streak"),B[w]=0,k.push(`Basic streak primes ${X.charAt(0).toUpperCase()+X.slice(1)}!`)}b=!0}else B[w]=0;if(F&&(x.superEnergy=ke(x.superEnergy,-3)),P&&(x.superEnergy=ke(x.superEnergy,-6)),v){const D=i.superCost||0;x.superEnergy=ke(x.superEnergy,-D)}i.superCost&&i.superCost>0&&!v&&(x.superEnergy=ke(x.superEnergy,-i.superCost));const N=[...e.enemies],A=N.findIndex(D=>D.id===c.id);let o=!1;A!==-1&&(N[A]=u);let y=0,_=!1;for(let D=0;D<N.length;D++){const G=f[D],X=N[D];if(!G||!X)continue;const I=Math.max(0,G.sh-X.bars.sh),U=Math.max(0,G.hp-X.bars.hp);I+U>0&&(y+=I+U),X.bars.hp<=0&&G.hp>0&&(_=!0),(G.primes||0)>((X.primes||[]).length||0)&&(o=!0)}const q=o,L=((ie=e.superEnergyGainedThisTurn)==null?void 0:ie[s.actorId])||0,K=ms(C?"basic":F?"prime":P&&o?"detonate":"sustain",y,!1,_,q,L),j=((re=Ee(e,s.actorId))==null?void 0:re.superGainMult)??1,O=Math.round(K*j);i.grantsSuperOnHit===!1?O>0&&k.push(`${i.name} grants no Super on hit.`):O>0&&(x.superEnergy=ke(x.superEnergy,O));const de={...e.superEnergyGainedThisTurn||{}};de[s.actorId]=(de[s.actorId]||0)+O;let se={...e.cooldownsByMember||{}};se[w]||(se[w]={}),i.cooldown&&i.cooldown>0&&(se[w]={...se[w],[i.id]:i.cooldown}),i.cooldownTurns&&i.cooldownTurns>0&&(se[w]={...se[w],[i.id]:i.cooldownTurns});const he=v?m:e,p=he.party.map((D,G)=>G===e.activePartyIndex?{...D,bars:{...D.bars},superEnergy:x.superEnergy}:D),J={...he,enemies:N,party:p,cooldownsByMember:se,basicStreakByMember:B,superEnergyGainedThisTurn:de},M={...J.memberTurnCountById||{}},h=s.actorId;if(M[h]=(M[h]||0)+1,J.memberTurnCountById=M,va(J),J.isOver)return{...J,log:[...e.log,...k,"All enemies defeated! Victory!"]};const V=wa(J);if(V.length===0)return{...J,log:[...e.log,...k,"All party members defeated!"],isOver:!0};const $=(J.partyMembersActedThisRound||0)+1,E=V.length;if(console.log(`🎯 Turn System: Member ${s.name} acted. Progress: ${$}/${E}`),$>=E)return console.log("🎯 All party members have acted, passing to enemies"),{...J,partyMembersActedThisRound:0,superEnergyGainedThisTurn:{},log:[...e.log,...k,"All party members have acted. Enemies' turn!"],turn:"enemy"};J.activePartyIndex;const Q=ka(J),te=Q.party.map(D=>({...D,superEnergy:ke(D.superEnergy,-2)})),T={...Q.cooldownsByMember||{}};for(const D of Object.keys(T)){const G=T[D],X={};for(const I of Object.keys(G)){const U=G[I],z=Math.max(0,(U||0)-1);z>0&&(X[I]=z)}T[D]=X}const S=te.map((D,G)=>{if(G!==e.activePartyIndex)return D;let X=D.superEnergy??0;return!F&&!P&&!b&&(X=ke(X,me.gainBasic)),o&&(X=ke(X,me.refundDetonate)),{...D,superEnergy:X}});return{...Q,party:S,cooldownsByMember:T,partyMembersActedThisRound:$,log:[...e.log,...k,`Turn passed to ${Q.party[Q.activePartyIndex].name}.`],turn:"player"}}function bt(e){var p,J,M,h,V,$,E,Q,te,T,S;const a=e.enemies.filter(d=>d.bars.hp>0);if(a.length===0)return e;const i=e._forceEnemyId,s=i?e.enemies.find(d=>d.id===i&&d.bars.hp>0)||a[0]:a[Math.floor(Math.random()*a.length)];let n=De(s.id);if(!n&&s.enemyKey)try{n=ga(s.enemyKey),ha(s.id,n)}catch{}if(!n){const d=Qa(e),R=d.dmg;return Ts(e,s,R,"kinetic",`legacy: ${d.reason}`)}const r=e.party.filter(d=>d.bars.hp>0).map(d=>({id:d.actorId,hp:d.bars.hp,shields:d.bars.sh,hasPrime:{Overload:(d.primes||[]).some(R=>R.element==="arc")||void 0,Burn:(d.primes||[]).some(R=>R.element==="thermal")||void 0,Suppress:(d.primes||[]).some(R=>R.element==="void")||void 0,Pierce:(d.primes||[]).some(R=>R.element==="kinetic")||void 0}})),c=e.enemies.map(d=>De(d.id)).filter(Boolean),v=Math.max(0,Math.min(1,s.bars.hp/Math.max(1,s.maxBars.hp))),g=ns(n,{enemies:c,players:r,selfHpPct:v}),m=g.ability,f=((p=g.target)==null?void 0:p.id)||((J=r[0])==null?void 0:J.id)||((M=e.party[0])==null?void 0:M.actorId),k=e.party.findIndex(d=>d.actorId===f)!==-1?e.party.findIndex(d=>d.actorId===f):e.party.findIndex(d=>d.bars.hp>0),l=e.party[k];if(!l||!n)return e;const u=n.stats.damage,x=m.isDetonator?1.1:1,F=m.damageType.toLowerCase(),P=(l.primes||[]).length>0;let C=Math.round(u*x);C=Math.max(0,Math.round(Le(C,F,!!m.isDetonator,s,{id:l.actorId,name:l.name,bars:l.bars,primes:l.primes},e)));const w=e.guardBuff;let B=C,H=0,b=-1;w&&w.casterId&&w.phasesLeft>0&&(b=e.party.findIndex(d=>d.actorId===w.casterId),b!==-1&&e.party[b].bars.hp>0&&e.party[b].actorId!==l.actorId&&(H=Math.round(C*w.redirectPct),B=Math.max(0,C-H)));const N={id:l.actorId,name:l.name,bars:l.bars,maxBars:{sh:100,hp:100,sp:100},primes:l.primes},A=ft(e,l.actorId,B),o=_e(N,A.rawRemaining,F);yt(e,l.actorId,A.hitConsumed);let y;if(H>0&&b!==-1){const d=e.party[b],R={id:d.actorId,name:d.name,bars:d.bars,maxBars:{sh:100,hp:100,sp:100},primes:d.primes},W=ft(e,d.actorId,H);y=_e(R,W.rawRemaining,F),yt(e,d.actorId,W.hitConsumed)}const _=[],q=[];m.isPrimer&&q.push("Primer"),m.isDetonator&&q.push("Detonator");const L=$e({id:l.actorId,name:l.name,bars:l.bars,primes:l.primes},F);L>1?_.push(`Weakness hit (${F}) x${L.toFixed(2)}.`):L<1&&_.push(`Resisted (${F}) x${L.toFixed(2)}.`);const Y=m.damageType.toUpperCase();if(_.push(`[${n.faction}] ${n.name} uses ${m.display} ${q.length?"["+q.join("+")+"] ":""}[${Y}]: ${C} base.`),m.isDetonator&&P){_.push(`Detonation triggered on ${l.name}.`);try{(V=(h=window.BattleFX)==null?void 0:h.explosion)==null||V.call(h,m.primeType||m.damageType)}catch{}o.defender.primes=[]}if(m.isPrimer){const d=m.primeType?ba(m.primeType):F,R=Me(o.defender,d,m.display);o.defender=R,_.push(`${m.display} applies ${m.primeType||m.damageType} prime to ${l.name}.`);try{(E=($=window.BattleFX)==null?void 0:$.prime)==null||E.call($,m.primeType||m.damageType)}catch{}}if(o.shLoss>0&&_.push(`${l.name}'s shields took ${o.shLoss} damage`),o.hpLoss>0&&_.push(`${l.name} takes ${o.hpLoss} HP damage`),y&&(y.shLoss>0||y.hpLoss>0)&&b!==-1){const d=e.party[b];_.push(`${d.name} guards: takes ${y.shLoss} SH and ${y.hpLoss} HP redirected.`);const R=y.shLoss+y.hpLoss,W=Math.floor(R/50)*ne.guardSuperPer50;if(W>0){const ee={...d,superEnergy:ke(d.superEnergy,W)},Z=[...e.party];Z[b]=ee,e.party=Z,_.push(`${d.name} gains ${W} Super from guarding.`)}}const K=o.shLoss+o.hpLoss;if(K>0){const d=Math.round(K/100*me.gainTakePer100),R={...l,superEnergy:ke(l.superEnergy,d)},W=[...e.party];W[k]=R,e.party=W}const j=[...e.party],O=j[k];if(j[k]={...O,bars:o.defender.bars,primes:o.defender.primes},y&&b!==-1){const d=e.party[b];j[b]={...d,bars:y.defender.bars}}try{const d=e.party[k],R=j[k];if(d&&R&&((Q=window.BattleFX)!=null&&Q.floatDamage)){const W=Math.max(0,d.bars.sh-R.bars.sh),ee=Math.max(0,d.bars.hp-R.bars.hp),ie=document.querySelectorAll(".party-cards .pm-card")[k];if(ie){const re=ie.getBoundingClientRect(),D=re.left+re.width/2,G=re.top+re.height/2,X=(te=document.getElementById("app-wrap"))==null?void 0:te.getBoundingClientRect(),I=X?D-X.left:D,U=X?G-X.top:G,z=(ae,le)=>({x:ae,y:le});W>0&&window.BattleFX.floatDamage(z(I,U),W,{shield:!0}),ee>0&&window.BattleFX.floatDamage(z(I,U-10),ee,{type:m.damageType})}}}catch{}const de=e.enemies.findIndex(d=>d.id===s.id),se=[...e.enemies];if(n.faction==="Voidborn"){const d=(S=(T=Ne.Voidborn)==null?void 0:T.specials)==null?void 0:S.regenPerTurn;{const R=se[de],W=Math.min(R.maxBars.hp,R.bars.hp+d);se[de]={...R,bars:{...R.bars,hp:W}},_.push(`${n.name} regenerates ${d} HP.`)}}if(j.filter(d=>d.bars.hp>0).length===0)return{...e,party:j,enemies:se,log:[...e.log,..._,"All party members defeated!"],isOver:!0};let t={...e,party:j,enemies:se,log:[...e.log,..._],turn:"player"};try{t._forceEnemyId=void 0}catch{}if(t.guardBuff&&t.guardBuff.phasesLeft>0){const d=t.guardBuff.phasesLeft-1;t.guardBuff=d>0?{...t.guardBuff,phasesLeft:d}:void 0}if(t.barriersByMember){const d={};for(const[R,W]of Object.entries(t.barriersByMember)){const ee=((W==null?void 0:W.phasesLeft)??0)-1;W&&ee>0&&W.amountLeft>0&&W.hitsLeft>0&&(d[R]={...W,phasesLeft:ee})}t.barriersByMember=d}if(t.party[t.activePartyIndex].bars.hp<=0){const d=t.party.filter(ee=>ee.bars.hp>0);if(d.length===0)return t.isOver=!0,t;const R=t.partyMembersActedThisRound||0,W=d.length;R>=W?(t.turn="enemy",t.partyMembersActedThisRound=0,t.log.push("All party members have acted. Enemies' turn!")):(t=ka(t),t.log.push(`Turn passed to ${t.party[t.activePartyIndex].name}.`))}return t}function As(e,a,i,s){var F;const n=[],r=a.actorId,c={...e,party:[...e.party]},v=c.party.findIndex(P=>P.actorId===r);if(v===-1)return{state:e,events:n};const g={...c.memberTurnCountById||{}},m={...c.sustainLastUseByMember||{}},f=i.id,k=g[r]||0,l=((F=m[r])==null?void 0:F[f])??-1/0,u=k-l<ne.fatigueWindow,x=u?1-ne.fatiguePenalty:1;if(u&&n.push(`Fatigue −${Math.round(ne.fatiguePenalty*100)}%`),f==="heal"||f==="arc-restore"||f==="thermal-burst-sustain"||f==="void-drain"){const P=Math.round((ne.healMin+Math.random()*(ne.healMax-ne.healMin))*x),C=(f==="heal"||f==="arc-restore")&&typeof s=="number"?Math.max(0,Math.min(c.party.length-1,s)):v,w=c.party[C],B=Math.min(100,w.bars.hp+P);if(c.party[C]={...w,bars:{...w.bars,hp:B}},f==="arc-restore"){const H=Math.round(P*.25),b=Math.min(100,B+H),N=6;c.party[C]={...w,bars:{...w.bars,hp:b},superEnergy:ke(w.superEnergy,N)},n.push(`${w.name} restores ${P+H} HP (${P} base + ${H} bonus) and recovers ${N} Super.`)}else if(f==="thermal-burst-sustain"){const H=Math.round(P*.5);c.party=c.party.map((b,N)=>{const A=Math.min(100,b.bars.hp+(N===v?0:H));return N===v?c.party[v]:{...b,bars:{...b.bars,hp:A}}}),n.push(`${w.name} bursts warmth: allies heal ${H} HP (${P} base × 50% team bonus).`)}else f==="void-drain"?n.push(`${w.name} siphons vitality for ${P} HP (${Math.round(ne.healMin)}-${Math.round(ne.healMax)} base range).`):n.push(`${w.name} heals ${P} HP (${Math.round(ne.healMin)}-${Math.round(ne.healMax)} base range).`)}else if(f==="barrier"){const P=Math.round(ne.barrierAmount*x),C={...c.barriersByMember||{}};C[r]={amountLeft:P,hitsLeft:ne.barrierHits,phasesLeft:ne.barrierPhases},c.barriersByMember=C,n.push(`${a.name} gains a barrier: ${P} absorb pool (${ne.barrierAmount} base), ${ne.barrierHits} hits, ${ne.barrierPhases} phases.`)}else if(f==="kinetic-barrier"){const P=Math.round((ne.barrierAmount+5)*x),C={...c.barriersByMember||{}},w=typeof s=="number"?Math.max(0,Math.min(c.party.length-1,s)):v,B=c.party[w],H=B.actorId;C[H]={amountLeft:P,hitsLeft:ne.barrierHits,phasesLeft:Math.max(1,ne.barrierPhases)},c.barriersByMember=C;const b=Math.round(ne.healMin*.7*x),N=Math.min(100,B.bars.hp+b);c.party[w]={...B,bars:{...B.bars,hp:N}},n.push(`${a.name} grants ${B.name} a kinetic barrier: ${P} absorb pool (${ne.barrierAmount+5} base), ${ne.barrierHits} hits, ${Math.max(1,ne.barrierPhases)} phases, and restores ${b} HP (${Math.round(ne.healMin*.7)} base × 70%).`)}else if(f==="cleanse"){const P=c.party[v],C=(P.primes||[]).filter(H=>!(H.element==="thermal"||H.element==="void")),w=Math.round(ne.cleanseShGain*x),B=Math.min(100,P.bars.sh+w);c.party[v]={...P,bars:{...P.bars,sh:B},primes:C},n.push(`${P.name} cleanses and restores ${w} SH (${ne.cleanseShGain} base).`)}else f==="guard"&&(c.guardBuff={casterId:r,redirectPct:ne.guardRedirectPct,phasesLeft:ne.guardPhases},n.push(`${a.name} guards allies: ${Math.round(ne.guardRedirectPct*100)}% damage redirect, ${ne.guardPhases} phases.`));return m[r]={...m[r]||{},[f]:k},c.sustainLastUseByMember=m,{state:c,events:n}}function ft(e,a,i){var c;const s=(c=e.barriersByMember)==null?void 0:c[a];if(!s||s.amountLeft<=0||s.hitsLeft<=0)return{rawRemaining:i,hitConsumed:!1};const n=Math.min(s.amountLeft,i),r={...e.barriersByMember||{}};return r[a]={...s,amountLeft:s.amountLeft-n},e.barriersByMember=r,{rawRemaining:Math.max(0,i-n),hitConsumed:n>0}}function yt(e,a,i){var n;const s=(n=e.barriersByMember)==null?void 0:n[a];if(!s)return e;if(i){const r={...e.barriersByMember||{}},c=Math.max(0,(s.hitsLeft||0)-1);c<=0||(s.amountLeft||0)<=0?delete r[a]:r[a]={...s,hitsLeft:c},e.barriersByMember=r}return e}function Ts(e,a,i,s,n){const r=e.party.filter(x=>x.bars.hp>0);if(r.length===0)return{...e,log:[...e.log,"All party members defeated!"],isOver:!0};const c=Math.floor(Math.random()*r.length),v=r[c],g={id:v.actorId,name:v.name,bars:v.bars,maxBars:{sh:100,hp:100,sp:100},primes:v.primes},m=_e(g,i,s),f=m.shLoss+m.hpLoss,k=[`${a.name} attacks ${v.name} [${s.toUpperCase()}] (${n}): ${i} base → ${f} total damage!`];m.shLoss>0&&k.push(`${v.name}'s shields absorbed ${m.shLoss} damage`),m.hpLoss>0&&k.push(`${v.name} takes ${m.hpLoss} HP damage`);const l=[...e.party],u=e.party.findIndex(x=>x.actorId===v.actorId);if(u!==-1){const x=(m.shLoss||0)+(m.hpLoss||0),F=Math.round(x/100*me.gainTakePer100),P=e.party[u],C=F>0?{...P,bars:m.defender.bars,superEnergy:ke(P.superEnergy,F)}:{...P,bars:m.defender.bars};l[u]=C}return{...e,party:l,log:[...e.log,...k],turn:"player"}}function $s(e){const{party:a,activePartyIndex:i}=e;let s=i;for(let n=1;n<=a.length;n++){const r=(i+n)%a.length;if(a[r].bars.hp>0){s=r;break}}return s}function wa(e){return e.party.filter(a=>a.bars.hp>0)}function ka(e){const a=$s(e);return a===e.activePartyIndex&&wa(e).length===0?{...e,isOver:!0}:{...e,activePartyIndex:a,selectedAbilityId:void 0}}const Cs={vanguard:Ae,technomancer:Ie,pyromancer:Pe,voidrunner:Be},We=(()=>{try{const e=Object.assign({"../../assets/images/Accord Trooper Boss.png":Tt,"../../assets/images/Accord Trooper Elite.png":$t,"../../assets/images/Accord Trooper Female1.png":Ct,"../../assets/images/Accord Trooper Female2.png":Mt,"../../assets/images/Accord Trooper Grunt.png":He,"../../assets/images/Accord Trooper MiniBoss.png":It,"../../assets/images/AccordTrooper_JusticeRunsCold.png":ot,"../../assets/images/Boldness.png":Bt,"../../assets/images/EnemyFaction_JusticeRunsCold.png":Et,"../../assets/images/Outlaw Scrapper Boss.png":Lt,"../../assets/images/Outlaw Scrapper Elite.png":Dt,"../../assets/images/Outlaw Scrapper Female1.png":Ve,"../../assets/images/Outlaw Scrapper Female2.png":Pt,"../../assets/images/Outlaw Scrapper Female3.png":Nt,"../../assets/images/Outlaw Scrapper Female4.png":Ot,"../../assets/images/Outlaw Scrapper Grunt.png":Ke,"../../assets/images/Outlaw Scrapper MiniBoss.png":Rt,"../../assets/images/Pyromancer.png":Pe,"../../assets/images/Shade_JusticeRunsCold.png":lt,"../../assets/images/Syndacite Raptor Female1.png":Ft,"../../assets/images/Syndicate Raptor Boss.png":Ht,"../../assets/images/Syndicate Raptor Elite.png":Vt,"../../assets/images/Syndicate Raptor Grunt.png":ct,"../../assets/images/Syndicate Raptor MiniBoss.png":Wt,"../../assets/images/Technomancer.png":Ie,"../../assets/images/Vanguard.png":Ae,"../../assets/images/Voidborn Sentinel Boss.png":zt,"../../assets/images/Voidborn Sentinel Elite.png":jt,"../../assets/images/Voidborn Sentinel Grunt.png":Gt,"../../assets/images/Voidborn Sentinel MiniBoss.png":qt,"../../assets/images/Voidborn Sentinel Woman1.png":Ut,"../../assets/images/Voidborn Sentinel Woman2.png":Yt,"../../assets/images/Voidborn Sentinel Woman3.png":Kt,"../../assets/images/Voidrunner.png":Be,"../../assets/images/ember_self_control_battle.png":Jt,"../../assets/images/ember_self_control_conflict.png":Xt,"../../assets/images/ember_self_control_intro.png":Qt,"../../assets/images/enemyhero.png":Zt,"../../assets/images/nova_altruism_battle.png":ea,"../../assets/images/nova_altruism_conflict.png":ta,"../../assets/images/nova_altruism_intro.png":aa,"../../assets/images/nova_boldness_battle.png":sa,"../../assets/images/nova_boldness_conflict.png":ia,"../../assets/images/nova_boldness_intro.png":ra,"../../assets/images/shade_empathy_battle.png":na,"../../assets/images/shade_empathy_conflict.png":oa,"../../assets/images/shade_empathy_intro.png":la,"../../assets/images/volt_adaptability_battle.png":ca,"../../assets/images/volt_adaptability_conflict.png":da,"../../assets/images/volt_adaptability_intro.png":pa}),a=s=>s.toLowerCase().replace(/[^a-z0-9]/g,""),i={};for(const[s,n]of Object.entries(e)){const r=s.split("/").pop()||"",c=r.substring(0,r.lastIndexOf("."))||r;c&&(i[a(c)]=n)}return i}catch{return{}}})();function Ms(e,a){const i=n=>n.toLowerCase().replace(/[^a-z0-9]/g,""),s=[e,a==null?void 0:a.name,a==null?void 0:a.key].filter(Boolean);for(const n of s){const r=i(n);if(We[r])return We[r]}}function Is(e,a,i,s,n,r){var he;const c=()=>{var p;const t=a();return(p=t.currentMission)!=null&&p.victoryText?t.currentMission.victoryText:"The battle is won! Your tactical prowess has secured victory against all odds."},v=t=>{const p=Number(t??0),M=Math.abs(p)>=10?0:1;return Number.isFinite(p)?String(Number(p.toFixed(M))):"0"};try{const t=document.getElementById("app-wrap");t&&((he=window.BattleFX)!=null&&he.bindCanvas)&&window.BattleFX.bindCanvas(t)}catch{}try{const t="battle-mobile-inline";if(!document.getElementById(t)){const p=document.createElement("style");p.id=t,p.textContent=`
         /* Contain layout to viewport width and prevent horizontal scroll */
         .battle-mobile{width:100%;max-width:100vw;margin:0 auto;overflow-x:hidden;position:relative;height:100vh}

         /* Ensure our battle layout doesn't inherit the global grid that forces 280px tracks */
         .battle-mobile .enemy-cards{display:block}
         .battle-mobile .party-cards{display:flex;flex-wrap:nowrap;gap:8px;justify-content:center;padding:2px 0}
         
         /* Ensure proper viewport containment */
         .battle-mobile .app {
           height: 100vh !important;
           height: 100dvh !important;
           overflow: hidden !important;
         }
         
         /* Remove any potential covering bars */
         .battle-mobile .main::after,
         .battle-mobile .main::before {
           display: none !important;
         }
         
         /* Ensure clean layout without overlapping elements */
         .battle-mobile .enemy-row,
         .battle-mobile .party-row,
         .battle-mobile .log,
         .battle-mobile #abilities {
           position: relative !important;
           float: none !important;
           clear: both !important;
         }

         /* Prevent global .big min-width from forcing overflow in the actions row */
         .battle-mobile .big{min-width:0}

         /* Fixed 4×2 Enemy Grid System */
         .battle-mobile .enemy-grid-container {
           display: grid;
           grid-template-rows: repeat(2, 94px);
           gap: 8px;
           height: 188px;
           width: 100%;
           max-width: 368px; /* 4 columns × 80px + 3 gaps × 12px */
           margin: -8px auto 0 auto;
           /* Ensure grid items can span properly */
           grid-auto-flow: dense;
         }
         
         .battle-mobile .enemy-grid-row {
           display: grid;
           grid-template-columns: repeat(4, 80px);
           gap: 12px;
           height: 94px;
           /* Ensure grid items can span properly */
           grid-auto-flow: dense;
         }
         
         .battle-mobile .enemy-grid-slot {
           width: 80px;
           height: 94px;
           display: flex;
           align-items: center;
           justify-content: flex-start;
           /* Debug: subtle border to show grid structure */
           border: 1px solid rgba(148, 163, 184, 0.1);
         }
         
         .battle-mobile .enemy-grid-slot--empty {
           /* Invisible placeholder to maintain grid structure */
         }
         
         .battle-mobile .enemy-grid-slot--occupied {
           /* Invisible placeholder for slots taken by larger enemies */
         }
         
         .battle-mobile .enemy-grid-slot--span-2 {
           grid-column: span 2;
           width: 168px; /* 2 columns + 1 gap */
         }
         
         .battle-mobile .enemy-grid-slot--span-3 {
           grid-column: span 3;
           width: 256px; /* 3 columns + 2 gaps */
         }
         
         /* Enemy card sizing and positioning */
         .battle-mobile .enemy-thumb {
           display: flex;
           background: rgba(15,23,42,.9);
           border: 1px solid rgba(100,116,139,.4);
           border-radius: 8px;
           padding: 3px;
           cursor: pointer;
           box-sizing: border-box;
           height: 94px;
           min-height: 94px;
           transition: all 150ms ease;
           /* Ensure proper grid behavior */
           grid-column: auto;
         }
         
         /* Death animation classes */
         .battle-mobile .enemy-thumb.is-dying {
           animation: enemyDeath 1.2s ease-in-out forwards;
           pointer-events: none;
           cursor: default;
         }
         
         .battle-mobile .enemy-thumb.is-dead {
           opacity: 0.3;
           filter: grayscale(80%) brightness(0.6);
           transform: scale(0.95);
           pointer-events: none;
           cursor: default;
         }
         
         /* Death animation keyframes */
         @keyframes enemyDeath {
           0% {
             transform: scale(1) rotate(0deg);
             opacity: 1;
             filter: grayscale(0%) brightness(1);
           }
           25% {
             transform: scale(1.1) rotate(-2deg);
             opacity: 0.9;
             filter: grayscale(20%) brightness(1.1);
           }
           50% {
             transform: scale(0.9) rotate(2deg);
             opacity: 0.7;
             filter: grayscale(40%) brightness(0.9);
           }
           75% {
             transform: scale(0.8) rotate(-1deg);
             opacity: 0.5;
             filter: grayscale(60%) brightness(0.7);
           }
           100% {
             transform: scale(0.95) rotate(0deg);
             opacity: 0.3;
             filter: grayscale(80%) brightness(0.6);
           }
         }
         
         /* Death particle effects */
         .battle-mobile .enemy-thumb__death-particles {
           position: absolute;
           top: 0;
           left: 0;
           width: 100%;
           height: 100%;
           pointer-events: none;
           z-index: 10;
         }
         
         .battle-mobile .enemy-thumb__death-particle {
           position: absolute;
           width: 4px;
           height: 4px;
           background: rgba(239, 68, 68, 0.8);
           border-radius: 50%;
           animation: deathParticle 0.8s ease-out forwards;
         }
         
         @keyframes deathParticle {
           0% {
             opacity: 1;
             transform: scale(1) translate(0, 0);
           }
           100% {
             opacity: 0;
             transform: scale(0) translate(var(--particle-x), var(--particle-y));
           }
         }
         

         
         /* Element-specific death effects */
         .battle-mobile .enemy-thumb.is-dying.prime-elem--kinetic .enemy-thumb__death-particle {
           background: rgba(148, 163, 184, 0.8);
         }
         
         .battle-mobile .enemy-thumb.is-dying.prime-elem--arc .enemy-thumb__death-particle {
           background: rgba(56, 189, 248, 0.8);
         }
         
         .battle-mobile .enemy-thumb.is-dying.prime-elem--thermal .enemy-thumb__death-particle {
           background: rgba(239, 68, 68, 0.8);
         }
         
         .battle-mobile .enemy-thumb.is-dying.prime-elem--void .enemy-thumb__death-particle {
           background: rgba(168, 85, 247, 0.8);
         }
         
         /* Enhanced death state styling */
         .battle-mobile .enemy-thumb.is-dying {
           z-index: 20;
           box-shadow: 0 0 20px rgba(239, 68, 68, 0.4);
         }
         
         .battle-mobile .enemy-thumb.is-dying.prime-elem--kinetic {
           box-shadow: 0 0 20px rgba(148, 163, 184, 0.4);
         }
         
         .battle-mobile .enemy-thumb.is-dying.prime-elem--arc {
           box-shadow: 0 0 20px rgba(56, 189, 248, 0.4);
         }
         
         .battle-mobile .enemy-thumb.is-dying.prime-elem--thermal {
           box-shadow: 0 0 20px rgba(239, 68, 68, 0.4);
         }
         
         .battle-mobile .enemy-thumb.is-dying.prime-elem--void {
           box-shadow: 0 0 20px rgba(168, 85, 247, 0.4);
         }
         
         /* Disable interactions during death animation */
         .battle-mobile .enemy-thumb.is-dying,
         .battle-mobile .enemy-thumb.is-dead {
           pointer-events: none;
           cursor: default;
         }
         
         /* Auto-targeting highlight effect */
         .battle-mobile .enemy-thumb.auto-targeted {
           animation: autoTargetPulse 0.8s ease-out;
         }
         
         @keyframes autoTargetPulse {
           0% {
             box-shadow: 0 0 0 0 rgba(56, 189, 248, 0.7);
           }
           50% {
             box-shadow: 0 0 0 8px rgba(56, 189, 248, 0.4);
           }
           100% {
             box-shadow: 0 0 0 0 rgba(56, 189, 248, 0);
           }
         }
         
         /* Ensure dying enemies stay visible during animation */
         .battle-mobile .enemy-thumb.is-dying {
           position: relative;
           z-index: 20;
         }
         
         /* Smooth transition for death state changes */
         .battle-mobile .enemy-thumb {
           transition: all 150ms ease, opacity 1.2s ease-in-out, filter 1.2s ease-in-out, transform 1.2s ease-in-out;
         }
         
         .battle-mobile .enemy-thumb--standard {
           width: 80px;
           max-width: 80px;
         }
         
         .battle-mobile .enemy-thumb--miniboss {
           width: 168px; /* 2 columns + 1 gap */
           max-width: 168px;
         }
         
         .battle-mobile .enemy-thumb--boss {
           width: 256px; /* 3 columns + 2 gaps */
           max-width: 256px;
         }
         
         /* Grid slot spanning for larger enemies */
         .battle-mobile .enemy-grid-slot--span-2 {
           grid-column: span 2;
           width: 168px; /* 2 columns + 1 gap */
         }
         
         .battle-mobile .enemy-grid-slot--span-3 {
           grid-column: span 3;
           width: 256px; /* 3 columns + 2 gaps */
         }
         
         /* Ensure grid layout works correctly with spanning */
         
         /* Ensure grid maintains structure even with larger enemies */
         
         /* Responsive adjustments for smaller screens */
         @media (max-width: 400px) {
           .battle-mobile .enemy-grid-container {
             max-width: 100%;
             padding: 0 8px;
           }
           
           .battle-mobile .enemy-grid-row {
             grid-template-columns: repeat(4, 1fr);
             gap: 8px;
           }
           
           .battle-mobile .enemy-grid-slot {
             width: auto;
             min-width: 0;
           }
         }

         .battle-mobile .enemy-thumb.is-selected{outline:2px solid rgba(250,204,21,.8);outline-offset:1px}
         /* Element-colored enemy highlight when primed */
         .battle-mobile .enemy-thumb.has-primes{border-color:rgba(148,163,184,.4)}
         .battle-mobile .enemy-thumb.prime-elem--kinetic{border-color:rgba(148,163,184,.6);box-shadow:0 0 10px rgba(148,163,184,.35),0 0 20px rgba(148,163,184,.2)}
         .battle-mobile .enemy-thumb.prime-elem--arc{border-color:rgba(56,189,248,.6);box-shadow:0 0 10px rgba(56,189,248,.35),0 0 20px rgba(56,189,248,.2)}
         .battle-mobile .enemy-thumb.prime-elem--thermal{border-color:rgba(239,68,68,.6);box-shadow:0 0 10px rgba(239,68,68,.35),0 0 20px rgba(239,68,68,.2)}
         .battle-mobile .enemy-thumb.prime-elem--void{border-color:rgba(168,85,247,.6);box-shadow:0 0 10px rgba(168,85,247,.35),0 0 20px rgba(168,85,247,.2)}
         
         /* Enemy thumb content styling - Icon + SH/HP + Dots Layout */
         .battle-mobile .enemy-thumb__content{display:flex;flex-direction:column;align-items:center;justify-content:space-between;width:100%;height:100%;min-height:100%;padding:4px;box-sizing:border-box}
         .battle-mobile .enemy-thumb__icon{width:40px;height:40px;object-fit:cover;border-radius:4px;margin-bottom:4px;flex-shrink:0;background:rgba(15,23,42,.6);border:1px solid rgba(100,116,139,.3)}
         .battle-mobile .enemy-thumb__simple-layout{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;flex:1;margin-top:2px}
         .battle-mobile .enemy-thumb__stat-line{display:flex;align-items:center;justify-content:center;gap:8px}
         .battle-mobile .enemy-thumb__sh-value{font-size:10px;color:#38bdf8;font-weight:700;font-variant-numeric:tabular-nums}
         .battle-mobile .enemy-thumb__hp-value{display:flex;align-items:center;justify-content:center;gap:2px;font-size:10px;color:#ef4444;font-weight:700;font-variant-numeric:tabular-nums}
         .battle-mobile .enemy-thumb__heart{color:#ef4444;font-size:11px}
         .battle-mobile .enemy-thumb__shield{color:#38bdf8;font-size:11px}
         .battle-mobile .enemy-thumb__primer-dots{display:flex;align-items:center;justify-content:center;gap:6px}
         .battle-mobile .enemy-thumb__slot-dot{width:8px;height:8px;border-radius:50%;border:1px solid rgba(15,23,42,.9);background:white;flex-shrink:0}
         .battle-mobile .enemy-thumb__slot-dot--kinetic{background:rgb(148,163,184)}
         .battle-mobile .enemy-thumb__slot-dot--arc{background:rgb(56,189,248)}
         .battle-mobile .enemy-thumb__slot-dot--thermal{background:rgb(239,68,68)}
         .battle-mobile .enemy-thumb__slot-dot--void{background:rgb(168,85,247)}
         
         /* Grunt layout adjustments */
         .battle-mobile .enemy-thumb__stats-grid--grunt{grid-template-columns:1fr}
         .battle-mobile .enemy-thumb__stats-grid--grunt .enemy-thumb__stat-column:last-child{align-items:center;justify-content:center}

         .battle-mobile .prime-badge{font-size:8px;line-height:1;padding:1px 4px;border-radius:999px;border:1px solid rgba(148,163,184,.35);background:rgba(30,41,59,.6);color:#e5e7eb}
         /* Fixed Battle Footer Styles */
         .battle-footer {
           position: fixed !important;
           bottom: 0 !important;
           left: 0 !important;
           right: 0 !important;
           z-index: 100 !important;
           background: #0b0f1a !important;
           padding: 12px max(12px, env(safe-area-inset-left)) 12px max(12px, env(safe-area-inset-right)) !important;
           padding-bottom: max(12px, calc(12px + env(safe-area-inset-bottom))) !important;
           box-sizing: border-box !important;
           min-height: 60px !important;
           width: 100vw !important;
           max-width: 100vw !important;
           box-shadow: 0 -4px 20px rgba(0,0,0,0.8) !important;
         }

         /* Main content area with proper spacing for fixed footer */
         .main {
           position: relative !important;
           z-index: 1 !important;
           height: calc(100vh - 70px) !important;
           padding-bottom: 60px !important;
           display: block !important;
           overflow: hidden !important;
         }

         /* Fixed positioning for key sections */
         .enemy-row {
           position: relative !important;
           z-index: 10 !important;
           background: rgba(15, 23, 42, 0.95) !important;
           backdrop-filter: blur(8px) !important;
           padding: 8px 8px 6px 8px !important;
           margin: 0 !important;
           border-bottom: 1px solid rgba(148, 163, 184, 0.2) !important;
         }
         
         .party-row {
           position: relative !important;
           z-index: 10 !important;
           background: rgba(15, 23, 42, 0.95) !important;
           backdrop-filter: blur(8px) !important;
           padding: 8px 8px !important;
           margin: 0 !important;
           margin-top: -4px !important;
           margin-bottom: 4px !important;
           border-bottom: 1px solid rgba(148, 163, 184, 0.2) !important;
           min-height: 160px !important;
         }
         
         .log {
           position: relative !important;
           z-index: 10 !important;
           background: rgba(15, 23, 42, 0.95) !important;
           backdrop-filter: blur(8px) !important;
           padding: 6px !important;
           margin: 0 !important;
           margin-top: -8px !important;
           margin-bottom: 8px !important;
         }

         /* Content area styling with proper heights */
         .enemy-cards {
           min-height: 188px !important;
           max-height: 188px !important;
         }
         
         .party-cards {
           min-height: 160px !important;
           max-height: 160px !important;
           padding: 4px 0 !important;
         }
         
         .log-content {
           min-height: 82px !important;
           max-height: 82px !important;
           overflow-y: scroll !important;
           -webkit-overflow-scrolling: touch !important;
           scroll-behavior: smooth !important;
           padding: 3px 0 !important;
           scrollbar-width: thin !important;
           scrollbar-color: rgba(148, 163, 184, 0.6) transparent !important;
         }
         
         .log-content::-webkit-scrollbar {
           width: 8px !important;
         }
         
         .log-content::-webkit-scrollbar-track {
           background: rgba(148, 163, 184, 0.2) !important;
           border-radius: 4px !important;
         }
         
         .log-content::-webkit-scrollbar-thumb {
           background: rgba(148, 163, 184, 0.8) !important;
           border-radius: 4px !important;
         }
         
         .log-content::-webkit-scrollbar-thumb:hover {
           background: rgba(148, 163, 184, 1) !important;
         }
         
         /* Abilities section - container for ability tray */
         #abilities {
           position: relative !important;
           z-index: 5 !important;
           height: 220px !important;
           padding: 6px !important;
           margin: 6px !important;
           margin-top: 4px !important;
           background: rgba(15, 23, 42, 0.8) !important;
           border-radius: 8px !important;
           border: 1px solid rgba(148, 163, 184, 0.2) !important;
           /* Ensure proper sizing for scrolling */
           box-sizing: border-box !important;
           overflow: hidden !important;
         }
         
         /* Ensure abilities container has proper scroll behavior */
         #abilities .ability-tray,
         .ability-tray {
           display: grid !important;
           grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
           grid-auto-rows: 84px !important;
           gap: 8px !important;
           padding: 2px 12px 12px 12px !important;
           height: 220px !important;
           max-height: 220px !important;
           overflow-y: scroll !important;
           -webkit-overflow-scrolling: touch !important;
           scroll-behavior: smooth !important;
           scrollbar-width: thin !important;
           scrollbar-color: rgba(148, 163, 184, 0.3) transparent !important;
           /* Force scrollbar to always be visible for testing */
           overflow-y: scroll !important;
         }
         
         /* Clear separation between log and abilities */
         #log + #abilities {
           margin-top: 8px !important;
         }
         
         /* Ensure abilities are not covered by any other elements */
         #abilities {
           position: relative !important;
           z-index: 5 !important;
           clear: both !important;
         }
         
         .ability-tray::-webkit-scrollbar {
           width: 8px !important;
         }
         
         .ability-tray::-webkit-scrollbar-track {
           background: rgba(148, 163, 184, 0.2) !important;
           border-radius: 4px !important;
         }
         
         .ability-tray::-webkit-scrollbar-thumb {
           background: rgba(148, 163, 184, 0.8) !important;
           border-radius: 4px !important;
         }
         
         .ability-tray::-webkit-scrollbar-thumb:hover {
           background: rgba(148, 163, 184, 1) !important;
         }

         .battle-footer-actions {
           display: grid !important;
           grid-template-columns: 1fr 1fr 1.5fr !important;
           gap: 12px !important;
           align-items: stretch !important;
           width: 100% !important;
         }

         .battle-footer-btn {
           background: transparent !important;
           color: #e2e8f0 !important;
           border: 1px solid #374151 !important;
           border-radius: 8px !important;
           padding: 8px 12px !important;
           font-size: 14px !important;
           font-weight: 600 !important;
           cursor: pointer !important;
           min-height: 36px !important;
           transition: all 0.2s ease !important;
           display: flex !important;
           align-items: center !important;
           justify-content: center !important;
           white-space: nowrap !important;
           user-select: none !important;
         }

         .battle-footer-btn:hover {
           background: rgba(55, 65, 81, 0.5) !important;
           border-color: #4b5563 !important;
           transform: translateY(-1px) !important;
         }

         .battle-footer-btn:active {
           transform: translateY(0) !important;
         }

         .battle-footer-btn--primary {
           background: #3b82f6 !important;
           color: #ffffff !important;
           border-color: #3b82f6 !important;
         }

         .battle-footer-btn--primary:hover {
           background: #2563eb !important;
           border-color: #2563eb !important;
         }

         /* Mobile optimizations for battle footer */
         @media (max-width: 768px) {
           .battle-footer {
             padding: 10px max(10px, env(safe-area-inset-left)) 10px max(10px, env(safe-area-inset-right)) !important;
             padding-bottom: max(10px, calc(10px + env(safe-area-inset-bottom))) !important;
             min-height: 52px !important;
           }
           
           .battle-footer-actions {
             gap: 10px !important;
           }
           
           .battle-footer-btn {
             min-height: 32px !important;
             font-size: 13px !important;
             padding: 6px 10px !important;
           }
           
           /* No sticky positioning needed */
         }

         @media (max-width: 480px) {
           .battle-footer {
             padding: 8px max(8px, env(safe-area-inset-left)) 8px max(8px, env(safe-area-inset-right)) !important;
             padding-bottom: max(8px, calc(8px + env(safe-area-inset-bottom))) !important;
           }
           
           .battle-footer-actions {
             gap: 8px !important;
           }
           
           .battle-footer-btn {
             min-height: 28px !important;
             font-size: 12px !important;
             padding: 5px 8px !important;
           }
           
           /* No sticky positioning needed */
         }

         @media (orientation: landscape) and (max-height: 600px) {
           .battle-footer {
             min-height: 45px !important;
             padding: 6px max(8px, env(safe-area-inset-left)) 6px max(8px, env(safe-area-inset-right)) !important;
             padding-bottom: max(6px, calc(6px + env(safe-area-inset-bottom))) !important;
           }
           
           .battle-footer-btn {
             min-height: 27px !important;
             font-size: 12px !important;
           }
           
           /* No sticky positioning needed */
         }
         .battle-mobile .prime--kinetic{border-color:rgba(148,163,184,.6);background:rgba(30,41,59,.6);color:rgb(148,163,184)}
         .battle-mobile .prime--arc{border-color:rgba(56,189,248,.6);background:rgba(8,47,73,.5);color:rgb(56,189,248)}
         .battle-mobile .prime--thermal{border-color:rgba(239,68,68,.6);background:rgba(69,10,10,.5);color:rgb(239,68,68)}
         .battle-mobile .prime--void{border-color:rgba(168,85,247,.6);background:rgba(59,7,100,.5);color:rgb(168,85,247)}
         .battle-mobile .enemy-thumb__bar{position:relative;height:6px;border-radius:6px;background:rgba(148,163,184,.15);margin:2px 0}
        .battle-mobile .enemy-thumb__bar-fill{position:absolute;left:0;top:0;bottom:0;border-radius:6px;background:linear-gradient(180deg,rgba(148,163,184,.65),rgba(100,116,139,.65))}
        .battle-mobile .enemy-thumb__bar--sh .enemy-thumb__bar-fill{background:linear-gradient(180deg,rgba(56,189,248,.6),rgba(2,132,199,.6))}
        .battle-mobile .enemy-thumb__bar--hp .enemy-thumb__bar-fill{background:linear-gradient(180deg,rgba(248,113,113,.55),rgba(185,28,28,.55))}
        .battle-mobile .enemy-thumb__bar-text{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:9px;color:#f8fafc;text-shadow:0 1px 2px rgba(0,0,0,.8),0 0 2px rgba(0,0,0,.6)}
        
         /* Party member card rendering using consistent layout with party select screen */
         .battle-mobile .party-cards.pm-compact{display:flex;flex-wrap:nowrap;gap:6px;justify-content:center;padding:4px 0}
                   .battle-mobile .party-cards.pm-compact .char-card.battle-char-card{display:flex;flex-direction:column;align-items:center;justify-content:flex-start;padding:6px;border:1px solid rgba(100,116,139,.4);border-radius:8px;background:rgba(15,23,42,.9);width:100px;min-width:100px;height:180px;margin-top:-5px}
         /* Super slot inside card to avoid layout shifts */
         .battle-mobile .pm-super-slot{margin-top:4px;min-height:40px;width:100%}
         .battle-mobile .pm-avatar-wrap{position:relative;width:48px;height:48px}
         .battle-mobile .pm-strip-avatar{width:48px;height:48px;object-fit:cover;border-radius:6px;box-shadow:0 0 12px rgba(148,163,184,.25)}
         /* Super ring removed - yellow buttons provide clear visual feedback */
        .battle-mobile .pm-strip-name{margin-top:4px;font-size:10px;line-height:1.1;text-align:center;max-width:90px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .battle-mobile .pm-strip-status{margin-top:2px;font-size:10px;padding:1px 6px;border-radius:999px}
        .battle-mobile .pm-strip-status--active{background:rgba(34,197,94,.15);color:rgb(34,197,94);border:1px solid rgba(34,197,94,.35)}
        .battle-mobile .pm-strip-status--down{background:rgba(239,68,68,.15);color:rgb(239,68,68);border:1px solid rgba(239,68,68,.35)}
        
        /* Element-specific colors for character elements */
        .battle-mobile .pm-strip-status.pm-element--kinetic{background:rgba(75,85,99,.6);color:#e2e8f0;border-color:rgba(75,85,99,.4)}
        .battle-mobile .pm-strip-status.pm-element--arc{background:rgba(30,64,175,.6);color:#bfdbfe;border-color:rgba(30,64,175,.4)}
        .battle-mobile .pm-strip-status.pm-element--thermal{background:rgba(154,52,18,.6);color:#fed7aa;border-color:rgba(154,52,18,.4)}
        .battle-mobile .pm-strip-status.pm-element--void{background:rgba(88,28,135,.6);color:#c4b5fd;border-color:rgba(88,28,135,.4)}
        .battle-mobile .pm-card.pm-strip.is-turn{outline:2px solid rgba(250,204,21,.6);outline-offset:1px}
         /* Super description box acts as CTA button (in-card) */
         .battle-mobile .pm-super-box{display:block;width:100%;padding:4px 6px;border-radius:6px;background:rgba(234,179,8,.9);color:#000000;font-weight:700;font-size:9px;line-height:1.2;text-align:center;cursor:pointer;border:1px solid rgba(250,204,21,.8);box-shadow:0 2px 10px rgba(250,204,21,.2);white-space:normal}
         .battle-mobile .char-card.battle-char-card.super-l2 .pm-super-box{background:rgba(217,119,6,.9)}
         .battle-mobile .char-card.battle-char-card.super-l3 .pm-super-box{background:rgba(194,65,12,.9)}
         .battle-mobile .pm-super-box:disabled{opacity:.6;cursor:default}
         .battle-mobile .pm-super-box:focus-visible{outline:2px solid rgba(250,204,21,.9);outline-offset:2px}
        .battle-mobile .pm-strip-stats{margin-top:4px;font-size:10px;color:#cbd5e1;text-align:center;white-space:nowrap;width:100%}
        .battle-mobile .pm-stat-mini{display:block}
        .battle-mobile .pm-stat-line{line-height:1}
        .battle-mobile .pm-stat-current{color:#cbd5e1;font-weight:600}
        .battle-mobile .pm-stat-max{color:#64748b;opacity:0.7}
        
         /* Background crossfade stack */
         .battle-mobile{position:relative}
         .battle-mobile .main{position:relative;z-index:1}
         .battle-bg{position:absolute;inset:0;z-index:0;pointer-events:none;overflow:hidden;display:none}
         .battle-bg__layer{position:absolute;inset:0;background-size:cover;background-position:center;background-repeat:no-repeat;opacity:0;transition:opacity .4s ease;will-change:opacity}
         .battle-bg__layer.is-visible{opacity:1}
         @media (prefers-reduced-motion: reduce){
           .battle-bg__layer{transition:none}
         }
         
        /* Heal targeting highlights */
        .battle-mobile .char-card.battle-char-card.is-heal-valid{outline:2px solid rgba(34,197,94,.55);outline-offset:1px}
        .battle-mobile .char-card.battle-char-card.is-heal-selected{outline:3px solid rgba(34,197,94,.95);outline-offset:1px;box-shadow:0 0 12px rgba(34,197,94,.25)}
        .battle-mobile .char-card.battle-char-card.is-heal-invalid{opacity:.55;filter:grayscale(10%)}
        
                 /* Turn indicator glow */
         .battle-mobile .char-card.battle-char-card.is-turn{outline:2px solid rgba(250,204,21,.6);outline-offset:1px;box-shadow:0 0 8px rgba(250,204,21,.3)}
         
         /* Damage shake animation when taking damage */
         .battle-mobile .char-card.battle-char-card.is-taking-damage {
           animation: damageShake 0.6s ease-in-out !important;
           will-change: transform !important;
           z-index: 10 !important;
         }
         
         /* Enemy damage shake animation */
         .battle-mobile .enemy-thumb.is-taking-damage {
           animation: enemyDamageShake 0.4s ease-in-out !important;
           will-change: transform !important;
           z-index: 10 !important;
         }
         
         @keyframes damageShake {
           0%, 100% { transform: translateX(0); }
           10%, 30%, 50%, 70%, 90% { transform: translateX(-3px); }
           20%, 40%, 60%, 80% { transform: translateX(3px); }
         }
         
         @keyframes enemyDamageShake {
           0%, 100% { transform: translateX(0); }
           25%, 75% { transform: translateX(-3px); }
           50% { transform: translateX(3px); }
         }
        
                 /* Ability tray grid items maintain consistent height */
         .battle-mobile .ability-tray > *,
         #abilities .ability-tray > *,
         .ability-tray > * {
           height: 84px !important;
           min-height: 84px !important;
           max-height: 84px !important;
         }
        .battle-mobile .ability{display:flex;flex-direction:column;justify-content:space-between;min-width:0;width:100%;height:84px !important;min-height:84px !important;max-height:84px !important;padding:8px;border-radius:8px;border:1px solid rgba(148,163,184,.25);color:#e5e7eb;background:rgba(30,41,59,.85);cursor:pointer;pointer-events:auto;touch-action:manipulation;user-select:none;box-sizing:border-box;overflow:hidden}
        .battle-mobile .ability .ability-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;flex-shrink:0;gap:6px}
        .battle-mobile .ability .ability-name{font-weight:800;white-space:normal;word-wrap:break-word;line-height:1.2;font-size:11px;flex-shrink:0;padding:1px 0}
        .battle-mobile .ability .ability-role{font-size:10px;opacity:.9;flex-shrink:0;padding:1px 0}
        .battle-mobile .ability .ability-role--primer{background:rgba(16,185,129,0.15);border:1px solid rgba(16,185,129,0.3);border-radius:3px;padding:1px 4px;margin-left:2px}
        .battle-mobile .ability .ability-role--detonator{background:rgba(245,158,11,0.15);border:1px solid rgba(245,158,11,0.3);border-radius:3px;padding:1px 4px;margin-left:2px}
        .battle-mobile .ability .ability-effect{font-size:11px;color:#cbd5e1;flex-shrink:0;margin-bottom:4px;padding:1px 0}
        .battle-mobile .ability.is-selected{outline:2px solid rgba(250,204,21,.7);outline-offset:1px}
        .battle-mobile .ability--kinetic{background:linear-gradient(180deg,rgba(30,41,59,.92),rgba(15,23,42,.92));border-color:rgba(148,163,184,.35)}
        .battle-mobile .ability--arc{background:linear-gradient(180deg,rgba(12,74,110,.55),rgba(8,47,73,.55));border-color:rgba(56,189,248,.35)}
        .battle-mobile .ability--thermal{background:linear-gradient(180deg,rgba(127,29,29,.55),rgba(69,10,10,.55));border-color:rgba(239,68,68,.35)}
        .battle-mobile .ability--void{background:linear-gradient(180deg,rgba(88,28,135,.55),rgba(59,7,100,.55));border-color:rgba(168,85,247,.35)}
        
        /* Weapon element labels - colored badges showing weapon element */
        .battle-mobile .weapon-element {
          display: inline-block;
          font-size: 9px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 12px;
          margin-left: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border: 1px solid;
          box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }
        
        .battle-mobile .weapon-element--kinetic {
          background: rgba(148, 163, 184, 0.8);
          color: #1e293b;
          border-color: rgba(148, 163, 184, 0.6);
        }
        
        .battle-mobile .weapon-element--arc {
          background: rgba(56, 189, 248, 0.8);
          color: #0c4a6e;
          border-color: rgba(56, 189, 248, 0.6);
        }
        
        .battle-mobile .weapon-element--thermal {
          background: rgba(239, 68, 68, 0.8);
          color: #7f1d1d;
          border-color: rgba(239, 68, 68, 0.6);
        }
        
        .battle-mobile .weapon-element--void {
          background: rgba(168, 85, 247, 0.8);
          color: #581c87;
          border-color: rgba(168, 85, 247, 0.6);
        }
        
        /* Weapon selection UI styles */
        .weapon-selection {
          margin: 16px 0;
          padding: 16px;
          background: rgba(15, 23, 42, 0.6);
          border-radius: 8px;
          border: 1px solid rgba(148, 163, 184, 0.2);
        }
        
        .weapon-selection h4 {
          margin: 0 0 12px 0;
          color: #e2e8f0;
          font-size: 14px;
          font-weight: 600;
        }
        
        .weapon-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 8px;
        }
        
        .weapon-option {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          padding: 12px;
          background: rgba(30, 41, 59, 0.8);
          border: 1px solid rgba(148, 163, 184, 0.3);
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }
        
        .weapon-option:hover {
          background: rgba(30, 41, 59, 0.9);
          border-color: rgba(148, 163, 184, 0.5);
          transform: translateY(-1px);
        }
        
        .weapon-option.is-selected {
          background: rgba(59, 130, 246, 0.2);
          border-color: rgba(59, 130, 246, 0.6);
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
        }
        
        .weapon-info {
          margin-bottom: 8px;
        }
        
        .weapon-name {
          font-weight: 600;
          color: #e2e8f0;
          margin-bottom: 4px;
        }
        
        .weapon-stats {
          font-size: 11px;
          color: #94a3b8;
          line-height: 1.3;
        }
        
        .weapon-stats span {
          display: inline-block;
          margin-right: 8px;
        }
        .battle-mobile .ability:disabled{opacity:.6}
        .battle-mobile .ability--basic{background:linear-gradient(180deg,rgba(34,197,94,.3),rgba(21,128,61,.3));border-color:rgba(34,197,94,.55)}
        .battle-mobile .ability--defend{background:linear-gradient(180deg,rgba(96,165,250,.3),rgba(30,64,175,.3));border-color:rgba(59,130,246,.55)}
        
                 /* Ensure all ability buttons are consistently 84px tall */
         .battle-mobile #abilities .ability,
         .battle-mobile .ability-tray .ability,
         .battle-mobile .ability,
         .battle-mobile button.ability {
           height: 84px !important;
           min-height: 84px !important;
           max-height: 84px !important;
         }
        
         /* Centered short divider between enemies and party */
         .battle-mobile .battle-divider{width:25%;height:1px;background:rgba(148,163,184,.15);margin:0 auto;border-radius:999px;position:relative;z-index:5}
         
         /* Proper spacing for sticky layout */
         .battle-mobile .enemy-row{margin-bottom:0}
         .battle-mobile .party-row{margin-bottom:0}
         .battle-mobile .log{margin-bottom:0;margin-top:0 !important}
         .battle-mobile .ability-tray{margin-bottom:0}
         
         /* Content padding for better readability */
         .battle-mobile .enemy-cards{padding:4px 0}
         .battle-mobile .party-cards{padding:4px 0}
         .battle-mobile .log-content{padding:4px 0}
         
         /* Battle result buttons layout */
         .battle-result-buttons{display:flex;gap:12px;justify-content:center;margin-top:24px}
         .battle-result-buttons .btn{min-width:120px}
         

      `,document.head.appendChild(p)}}catch{}const g=t=>{switch(t){case"vanguard":return"KINETIC";case"technomancer":return"ARC";case"pyromancer":return"THERMAL";case"voidrunner":return"VOID";case"shade":return"VOID";case"ember":return"THERMAL";case"nova":return"KINETIC";case"volt":return"ARC";default:return"KINETIC"}},m=(t,p)=>{switch(t){case"vanguard":return p===1?"Shield Bash: Stun & damage":p===2?"Guardian Wall: Protect allies":"Iron Fortress: Team invulnerability";case"technomancer":return p===1?"Overload Spike: Chain lightning":p===2?"Storm Cage: Trap enemies":"Ion Tempest: Massive AOE damage";case"pyromancer":return p===1?"Ignite Burst: Burn & explode":p===2?"Solar Flare: AOE burn":"Inferno Field: Continuous damage";case"voidrunner":return p===1?"Gravitic Jab: Void pierce":p===2?"Event Horizon: Suppress & damage":"Singularity: AOE void damage";case"shade":return p===1?"Shadow Strike: Stealth damage":p===2?"Dark Veil: Hide team":"Abyssal Night: Mass debuff";case"ember":return p===1?"Flame Touch: Burn target":p===2?"Burning Path: Fire trail":"Wildfire: Spread burns";case"nova":return p===1?"Light Burst: Blind enemies":p===2?"Stellar Wind: Push back":"Supernova: Massive explosion";case"volt":return p===1?"Static Shock: Stun target":p===2?"Lightning Arc: Chain damage":"Thunderstorm: AOE shock";default:return p===1?"Super L1: Basic super":p===2?"Super L2: Enhanced super":"Super L3: Ultimate super"}},f=(t,p=!1,J=!1,M)=>{const h={id:t.actorId,name:t.name,role:t.classId,primes:(t.primes||[]).map(d=>({type:d.element.charAt(0).toUpperCase()+d.element.slice(1)})),stats:{sh:{cur:t.bars.sh},hp:{cur:t.bars.hp},sp:{cur:t.bars.sp}}},V=p&&!(M!=null&&M.isEnemyTurn)?"is-turn":"",$=M!=null&&M.isTakingDamage?"is-taking-damage":"",E=M!=null&&M.isHealTargeting?M!=null&&M.isSelectedHeal?"is-heal-selected":M!=null&&M.isValidHeal?"is-heal-valid":"is-heal-invalid":"",Q=t.bars.sh,te=t.bars.hp;t.bars.sp;const T=Math.max(0,Math.min(300,t.superEnergy??0)),S=T>=300?"super-l3":T>=200?"super-l2":T>=100?"super-l1":"";return M!=null&&M.isTakingDamage&&(console.log(`🎯 Rendering ${t.name} with damage class: ${$}`),console.log(`🎯 ${t.name} will get class: "char-card battle-char-card ${V} ${E} ${S} ${$}"`),console.log(`🎯 ${t.name} damageClass value: "${$}"`),console.log(`🎯 ${t.name} opts.isTakingDamage: ${M.isTakingDamage}, opts.isEnemyTurn: ${M.isEnemyTurn}`)),`
      <div class="char-card battle-char-card ${V} ${E} ${S} ${$}" data-actor-id="${h.id}" ${(M==null?void 0:M.index)!==void 0?`data-ally-index="${M.index}"`:""} ${M!=null&&M.invalidReason?`title="${M.invalidReason}"`:""}>
        <div class="pm-avatar-wrap">
          <img class="pm-strip-avatar" src="${Cs[t.classId]}" alt="${h.name}" />
        </div>
        <div class="pm-strip-name">${h.name}</div>
        <div class="pm-strip-status pm-strip-status--${J?"down":"active"} pm-element--${g(t.classId).toLowerCase()}">${J?"DOWN":h.name}</div>
        
        <div class="pm-strip-stats">
          <div class="pm-stat-mini">
            <div class="pm-stat-line">SH: <span class="pm-stat-current">${v(Q)}</span><span class="pm-stat-max">/100</span></div>
          </div>
          <div class="pm-stat-mini" style="margin-top: 4px">
            <div class="pm-stat-line">HP: <span class="pm-stat-current">${v(te)}</span><span class="pm-stat-max">/100</span></div>
          </div>
          <div class="pm-stat-mini" style="margin-top: 4px">
            <div class="pm-stat-line">SUPER: <span class="pm-stat-current">${T}</span><span class="pm-stat-max">/300</span></div>
          </div>
        </div>
        
        <div class="pm-super-slot">
          ${T>=100?`
            <button class="pm-super-box" data-use-super-tier="1" data-actor-id="${t.actorId}" aria-label="Use Super L1" style="font-size: 8px; text-align: center; padding: 3px; font-weight: 600; margin-bottom: 1px;">
              ${m(t.classId,1)}
            </button>
          `:""}
          ${T>=200?`
            <button class="pm-super-box" data-use-super-tier="2" data-actor-id="${t.actorId}" aria-label="Use Super L2" style="font-size: 8px; text-align: center; padding: 3px; font-weight: 600; margin-bottom: 1px;">
              ${m(t.classId,2)}
            </button>
          `:""}
          ${T>=300?`
            <button class="pm-super-box" data-use-super-tier="3" data-actor-id="${t.actorId}" aria-label="Use Super L3" style="font-size: 8px; text-align: center; padding: 3px; font-weight: 600; margin-bottom: 1px;">
              ${m(t.classId,3)}
            </button>
          `:""}
        </div>
      </div>
    `},k=()=>{const t=a(),p={Grunt:[],Elite:[],Miniboss:[],Boss:[]},J=$=>$?$.includes("Boss")?"Boss":$.includes("Miniboss")?"Miniboss":$.includes("Elite")?"Elite":"Grunt":"Grunt";for(let $=0;$<t.enemies.length;$++){const E=t.enemies[$],Q=E.bars.hp<=0,te=De(E.id)||{tags:[]},T=J(te.tags),S=$===t.targetIndex;p[T].push(x(E,$,Q,S))}const M=new Array(8).fill(null),h=($,E=0)=>{for(let Q=E;Q<8;Q++){const te=Math.floor(Q/4),T=Q%4;if(T+$<=4){let S=!0;for(let d=0;d<$;d++)if(M[Q+d]!==null){S=!1;break}if(S)return Q}T+$>4&&(Q=(te+1)*4-1)}return-1};for(const $ of p.Boss){const E=h(3);E!==-1&&(M[E]=$,M[E+1]="",M[E+2]="")}for(const $ of p.Miniboss){const E=h(2);E!==-1&&(M[E]=$,M[E+1]="")}for(const $ of p.Elite){const E=h(1);E!==-1&&(M[E]=$)}for(const $ of p.Grunt){const E=h(1);E!==-1&&(M[E]=$)}const V=[];for(let $=0;$<2;$++){const E=$*4,te=M.slice(E,E+4).map((T,S)=>{if(T===null)return'<div class="enemy-grid-slot enemy-grid-slot--span-3"></div>';if(T==="")return"";{const d=T.includes("enemy-thumb--miniboss");return`<div class="enemy-grid-slot ${T.includes("enemy-thumb--boss")?"enemy-grid-slot--span-3":d?"enemy-grid-slot--span-2":""}">${T}</div>`}}).join("");V.push(`
        <div class="enemy-grid-row">
          ${te}
        </div>
      `)}return`
      <div class="enemy-grid-container">
        ${V.join("")}
      </div>
    `},l=(t,p)=>{const J={Voidborn:"Voidborn Sentinel",Syndicate:"Syndicate Raptor",Accord:"Accord Trooper",Outlaws:"Outlaw Scrapper"},M={Grunt:"Grunt",Elite:"Elite",Miniboss:"MiniBoss",Boss:"Boss"},h=J[t]||"Voidborn Sentinel",V=M[p]||"Grunt",$=`${h} ${V}`,Q=(T=>T.toLowerCase().replace(/[^a-z0-9]/g,""))($);if(We[Q])return We[Q];const te=Ms($);return te||(console.warn(`Could not find enemy icon for: ${$} (normalized: ${Q})`),"")},u=(t,p)=>{const J=[],M=p==="Boss"?8:p==="Miniboss"?6:p==="Elite"?4:2;for(let h=0;h<M;h++){const V=h/M*Math.PI*2,$=20+Math.random()*30,E=Math.cos(V)*$,Q=Math.sin(V)*$;J.push(`
        <div class="enemy-thumb__death-particle" 
             style="--particle-x: ${E}px; --particle-y: ${Q}px; 
                    left: 50%; top: 50%; margin-left: -2px; margin-top: -2px; 
                    animation-delay: ${h*.1}s;"></div>
      `)}return`<div class="enemy-thumb__death-particles">${J.join("")}</div>`},x=(t,p,J=!1,M=!1)=>{var ae,le,ye;t.maxBars.sh>0&&Math.round(t.bars.sh/t.maxBars.sh*100),t.maxBars.hp>0&&Math.round(t.bars.hp/t.maxBars.hp*100);let h="";if(J){const ce=t._deathAnimationState==="dying",oe=t._deathAnimationPlayed===!0,ue=t._wasDeadInPreviousRender===!0;ce&&!oe&&!ue?(h="is-dying",t._deathAnimationPlayed=!0):h="is-dead",t._wasDeadInPreviousRender=!0}else t._wasDeadInPreviousRender=!1;const V=M?"is-selected":"",$=Array.isArray(t.primes)&&t.primes.length>0,E=$?(((ae=t.primes[0])==null?void 0:ae.element)||"").toLowerCase():"",Q=$?`has-primes prime-elem--${E}`:"",te=t._autoTargeted?"auto-targeted":"",T=De(t.id)||{tags:[],faction:"Voidborn"},S=T.tags||[],d=S.includes("Boss")?"Boss":S.includes("Miniboss")?"Miniboss":S.includes("Elite")?"Elite":"Grunt",R=T.faction||"Voidborn",W=l(R,d);let ee="",Z="";d==="Boss"?(ee="enemy-thumb--boss",Z="width: 256px;"):d==="Miniboss"?(ee="enemy-thumb--miniboss",Z="width: 168px;"):(ee="enemy-thumb--standard",Z="width: 80px;");const ie=Array.isArray(t.primes)?t.primes:[],re=((le=ie[0])==null?void 0:le.element)||null,D=((ye=ie[1])==null?void 0:ye.element)||null,G=(ce,oe)=>{if(!oe)return`<div class="enemy-thumb__slot-dot" title="Empty slot ${ce+1}"></div>`;const ue=`enemy-thumb__slot-dot--${oe.toLowerCase()}`,pe=oe.charAt(0).toUpperCase()+oe.slice(1);return`<div class="enemy-thumb__slot-dot ${ue}" title="${pe} prime in slot ${ce+1}"></div>`},X=d!=="Grunt",I=h==="is-dying"?u(t,d):"",U=`
      <img class="enemy-thumb__icon" src="${W}" alt="${R} ${d}" onerror="this.style.display='none'">
      <div class="enemy-thumb__simple-layout">
        <div class="enemy-thumb__stat-line">
          ${X?`<span class="enemy-thumb__sh-value"><span class="enemy-thumb__shield">🛡</span>${v(t.bars.sh)}</span>`:""}
          <span class="enemy-thumb__hp-value">
            <span class="enemy-thumb__heart">♥</span>${v(t.bars.hp)}
          </span>
        </div>
        <div class="enemy-thumb__primer-dots">
          ${G(0,re)}
          ${G(1,D)}
        </div>
      </div>
    `,z=t._isTakingDamage?"is-taking-damage":"";return`
      <button class="enemy-thumb ${h} ${V} ${Q} ${ee} ${te} ${z}" 
        data-enemy-index="${p}" 
        aria-label="${t.name}" 
        aria-pressed="${M}" 
        tabindex="0"
        style="${Z} height: 94px; position: relative;">
        <div class="enemy-thumb__content">
          ${U}
        </div>
        ${I}
      </button>
    `},F=()=>{const t=a(),p=t.party[t.activePartyIndex];if(!p)return"";const J=p.abilityIds.map(S=>fe[S]).filter(Boolean),M=J.find(S=>{var d;return((d=S.tags)==null?void 0:d.sustain)||S.role==="sustain"}),h=J.filter(S=>S.id!==(M==null?void 0:M.id));if(J.length===0)return`
        <div class="no-abilities">
          <div class="no-abilities-message">
            <h3>${p.name} has no abilities equipped</h3>
            <p>Return to loadout to assign abilities to this character.</p>
          </div>
        </div>
      `;const V=(t.cooldownsByMember||{})[p.actorId]||{},$=(()=>{const S=t.selectedAbilityId==="__basic",d=t.party[t.activePartyIndex],R=d==null?void 0:d.weaponId,W=R?ma[R]:void 0,Z=`ability--${(W==null?void 0:W.basicType)??"kinetic"}`;let ie="";if(W!=null&&W.basicType){const re=W.basicType.charAt(0).toUpperCase()+W.basicType.slice(1);ie=`<span class="${`weapon-element weapon-element--${W.basicType}`}">${re}</span>`}return`<button id="AbilityBasic" class="ability ${Z} ${S?"is-selected":""}" data-ability-id="__basic" type="button" role="button" aria-pressed="${S}" aria-label="Attack" style="height: 78px !important; min-height: 78px !important; max-height: 78px !important; display: flex; flex-direction: column; justify-content: space-between;"><div class="ability-header"><span class="ability-name">Attack</span>${ie}</div><div class="ability-effect">Gain Super</div></button>`})(),E=(()=>{const S=t.party[t.activePartyIndex],d=M||(()=>{const X=S?at[S.classId]:void 0;return X?fe[X]:void 0})();if(!d)return'<button class="ability ability--void" type="button" disabled style="height: 78px !important; min-height: 78px !important; max-height: 78px !important; display: flex; flex-direction: column; justify-content: space-between;"><div class="ability-header"><span class="ability-name">Sustain</span><span class="ability-role">Defensive</span></div><div class="ability-effect">None equipped</div></button>';const R=t.selectedAbilityId===d.id,ee=((t.cooldownsByMember||{})[(S==null?void 0:S.actorId)||""]||{})[d.id]||0,Z=Math.floor((S==null?void 0:S.superEnergy)??0),ie=Math.floor((d==null?void 0:d.superCost)??0),re=ee>0||Z<ie,D=`ability--${d.type}`;let G="";return d.id==="heal"?G="Heal (single target).":d.id==="barrier"?G="Gain shields (barrier).":d.id==="cleanse"?G="Cleanse burns/suppress. +SH":d.id==="guard"?G="Guard allies (redirect).":d.id==="kinetic-barrier"?G="Barrier + strong heal (ally).":d.id==="arc-restore"?G="Big heal + Super regen (single).":d.id==="thermal-burst-sustain"?G="AOE heal (allies).":d.id==="void-drain"&&(G="Lifesteal heal (self)."),`<button id="AbilitySustain" class="ability ${D} ${R?"is-selected":""}" data-ability-id="${d.id}" type="button" role="button" aria-pressed="${R}" aria-label="${d.name}" ${re?"disabled":""} style="height: 78px !important; min-height: 78px !important; max-height: 78px !important; display: flex; flex-direction: column; justify-content: space-between;"><div class="ability-header"><span class="ability-name">${d.name}</span><span class="ability-role">Defensive</span></div><div class="ability-effect">${G}</div></button>`})(),Q=h.slice(0,4).map((S,d)=>{var I,U;const R=S.id===t.selectedAbilityId,W=S.role==="detonator"?"det":"prime",ee=V[S.id]||0,Z=!!((I=S.tags)!=null&&I.sustain),ie=(U=S.tags)==null?void 0:U.AOE,re=ie?" [AOE]":"";let D="";const G=t.enemies[t.targetIndex];Array.isArray(G.primes)&&G.primes.length>0,S.role==="detonator"?D="Detonates existing primes.":D="Primes target.",Z&&(S.id==="heal"?D="Heal (single target).":S.id==="barrier"?D="Gain shields (barrier).":S.id==="cleanse"?D="Cleanse burns/suppress. +SH":S.id==="guard"?D="Guard allies (redirect).":S.id==="kinetic-barrier"?D="Barrier + strong heal (ally).":S.id==="arc-restore"?D="Big heal + Super regen (single).":S.id==="thermal-burst-sustain"?D="AOE heal (allies).":S.id==="void-drain"&&(D="Lifesteal heal (self).")),ie&&(S.id==="nova_aoe_suppressive_barrage"?D="Area: 3 random targets. Ignores 10% shields.":S.id==="volt_aoe_static_surge"?D="Area: all targets. Double vs shields.":S.id==="ember_aoe_emberwave"?D="Area: 2 random targets. Applies Burn.":S.id==="shade_aoe_entropy_collapse"&&(D="Area: 2 random targets. Detonates + Suppress.")),t.enemies[t.targetIndex];let X=!0;return(S.role==="prime"||S.role==="detonator")&&(X=!0),`
        <button class="ability ability--${S.type} ${R?"is-selected":""}" 
                data-ability-id="${S.id}" 
                data-role="${W}"
                data-ok="${X}"
                ${!X||ee>0?"disabled":""}
                style="height: 78px !important; min-height: 78px !important; max-height: 78px !important; display: flex; flex-direction: column; justify-content: space-between;">
          <div class="ability-header">
            <span class="ability-name">${S.name}${re}</span>
            <span class="ability-role ability-role--${S.role==="detonator"?"detonator":"primer"}">${S.role==="detonator"?"Detonator":"Primer"}</span>
          </div>
          <div class="ability-effect">${ee>0?`CD ${ee}`:Z?`${D}`:`${D} D ${S.baseDamage}`}</div>
        </button>
      `}).join(""),te=4-h.length,T=Array.from({length:te},(S,d)=>'<button class="ability ability--void" type="button" disabled style="height: 78px !important; min-height: 78px !important; max-height: 78px !important; display: flex; flex-direction: column; justify-content: space-between;"><div class="ability-header"><span class="ability-name">Empty</span><span class="ability-role">Slot</span></div><div class="ability-effect">No ability equipped</div></button>').join("");return`
      <div class="ability-tray">
        ${$}
        ${E}
        ${Q}
        ${T}
      </div>
    `};e.innerHTML=`
    <div class="app battle-mobile h-[100dvh] w-full mx-auto bg-slate-950 text-slate-100 flex flex-col">
      <div class="battle-bg">
        <div class="battle-bg__layer" data-bg="a"></div>
        <div class="battle-bg__layer" data-bg="b"></div>
      </div>
      <div class="main flex-1 overflow-y-auto">
        <!-- Enemy row: compact grid of enemy cards -->
         <div class="enemy-row">
          <div class="enemy-cards text-[11px]"></div>
         </div>
         <div class="battle-divider" role="separator" aria-hidden="true"></div>
        
        <!-- Party strip: horizontal, scrollable -->
         <div class="party-row">
          <div class="party-cards pm-compact"></div>
         </div>
        

        
        <!-- Log: small height, scrollable -->
         <div id="log" class="log">
          <div id="logContent" class="log-content text-[11px] leading-snug"></div>
        </div>
        
        <!-- Abilities: scrollable tray -->
        <div id="abilities"></div>
      </div>

      <!-- Fixed Battle Footer -->
      <div class="battle-footer">
        <div class="battle-footer-actions">
          ${n?'<button class="battle-footer-btn" id="btnReturnToLoadout">Escape</button>':'<button class="battle-footer-btn" id="btnEscape">Escape</button>'}
          <button class="battle-footer-btn" id="btnEnd">End Turn</button>
          <button class="battle-footer-btn battle-footer-btn--primary" id="btnUse">Use</button>
        </div>
      </div>
    </div>
        
        <!-- Victory/Defeat overlay -->
        ${a().isOver?`
          <div class="battle-result-overlay">
            <div class="battle-result">
              <h2>${a().party.filter(t=>t.bars.hp>0).length>0?"Victory!":"Defeat!"}</h2>
              ${a().party.filter(t=>t.bars.hp>0).length>0?`<div class="victory-narrative">
                  <p class="victory-text">${c()}</p>
                </div>`:"<p>All party members have been defeated!</p>"}
              <div class="battle-result-buttons">
                <button class="btn btn--primary" id="btnBattleAgain">Battle Again</button>
                <button class="btn ghost" id="btnMissionSelect">Mission Select</button>
              </div>
            </div>
          </div>
        `:""}
  `;function P(t){return new Promise(p=>{if(!t){p();return}const J=new Image;J.onload=()=>{var M;try{const h=(M=J.decode)==null?void 0:M.call(J);h&&typeof h.then=="function"?h.then(()=>p(),()=>p()):p()}catch{p()}},J.onerror=()=>p(),J.src=t})}function C(t){const p=t.querySelector('.battle-bg [data-bg="a"]'),J=t.querySelector('.battle-bg [data-bg="b"]');let M=p,h=J;return{setInitial:E=>{M&&(M.style.backgroundImage=`url('${E}')`,M.classList.add("is-visible"))},setBackground:async E=>{!h||!M||(await P(E),h.style.backgroundImage=`url('${E}')`,h.classList.add("is-visible"),M.classList.remove("is-visible"),[M,h]=[h,M])}}}const{setInitial:w}=C(e);try{const t=We.enemyhero;t&&w(t)}catch{}const B={log:e.querySelector("#log"),logContent:e.querySelector("#logContent"),abilitiesContainer:e.querySelector("#abilities"),partyCardsContainer:e.querySelector(".party-cards"),enemyCardsContainer:e.querySelector(".enemy-cards"),btnUse:e.querySelector("#btnUse"),btnEnd:e.querySelector("#btnEnd"),btnNextMember:e.querySelector("#btnNextMember"),btnCancelTargeting:e.querySelector("#btnCancelTargeting")};console.log("🔍 CONTAINER SELECTION RESULTS:"),console.log("📝 Log:",!!B.log),console.log("📝 LogContent:",!!B.logContent),console.log("⚔️ Abilities:",!!B.abilitiesContainer),console.log("👥 PartyCards:",!!B.partyCardsContainer),console.log("👹 EnemyCards:",!!B.enemyCardsContainer),console.log("🎮 BtnUse:",!!B.btnUse),console.log("🎮 BtnEnd:",!!B.btnEnd),console.log("🏗️ Root HTML structure check:"),console.log("  - Has #abilities:",!!e.querySelector("#abilities")),console.log("  - Has .party-cards:",!!e.querySelector(".party-cards")),console.log("  - Has .enemy-cards:",!!e.querySelector(".enemy-cards")),console.log("  - Has #btnUse:",!!e.querySelector("#btnUse")),console.log("  - Has #btnEnd:",!!e.querySelector("#btnEnd"));let H=!1;const b=()=>{H||(H=!0,requestAnimationFrame(()=>{H=!1,q()}))},N=typeof s=="function"?s(()=>b()):void 0,A={},o={},y=[],_=t=>{var te,T,S;const p=t.target,J=p.closest(".pm-super-box");if(J){const d=J.getAttribute("data-use-super-tier"),R=J.getAttribute("data-actor-id")||"",W=Math.max(1,Math.min(3,parseInt(d||"1",10))),ee=a(),Z=ee.party.findIndex(ie=>ie.actorId===R);if(Z!==-1){const ie=ee.party[Z];if(it(ie,W)){const re=a(),D=gt(re,R,W);i(D)}}return}const M=p.closest("[data-use-super-l1]"),h=p.closest("[data-use-super-l2]"),V=p.closest("[data-use-super-l3]");if(M||h||V){const d=(M||h||V).getAttribute(M?"data-use-super-l1":h?"data-use-super-l2":"data-use-super-l3"),R=a(),W=R.party.findIndex(ee=>ee.actorId===d);if(W!==-1){const ee=R.party[W],Z=V?3:h?2:1;if(it(ee,Z)){const ie=a(),re=gt(ie,d,Z);i(re)}}return}if(p.id==="btnBattleAgain"&&n){n();return}if(p.id==="btnMissionSelect"&&r){r();return}if(p.id==="btnReturnToLoadout"&&n){n();return}if(p.id==="btnEscape"){r&&r();return}let $=p.closest(".enemy-thumb");if($||($=p.closest(".card")),$){const d=$.getAttribute("data-enemy-index");if(d){const R=parseInt(d,10);Number.isNaN(R)||(a().enemies.forEach(ee=>{ee._isTakingDamage&&(ee._isTakingDamage=!1)}),i({targetIndex:R}))}else{const W=Array.from(e.querySelectorAll(".enemy-cards .enemy-thumb, .enemy-cards .card")).indexOf($);W!==-1&&(a().enemies.forEach(Z=>{Z._isTakingDamage&&(Z._isTakingDamage=!1)}),i({targetIndex:W}))}}const E=p.closest(".char-card");if(E){const d=a(),R=e.querySelectorAll(".char-card"),W=Array.from(R).indexOf(E);if(W!==-1){const ee=d.selectedAbilityId?fe[d.selectedAbilityId]:void 0;if(!!d.isTargetingAlly&&!!d.armedAbilityId&&!!((te=ee==null?void 0:ee.tags)!=null&&te.sustain)&&(ee.id==="heal"||ee.id==="arc-restore")){const ie=d.party[W];ie&&ie.bars.hp>0&&ie.bars.hp<100&&i({selectedAllyIndex:W})}else{const ie=d.party[W];ie&&ie.bars.hp>0&&(d.partyMembersActedThisRound&&W<d.partyMembersActedThisRound||i({activePartyIndex:W}))}}}const Q=p.closest(".ability");if(Q){const d=Q.getAttribute("data-ability-id");if(d){const R=a();if(R.selectedAbilityId!==d){const W=R.party[R.activePartyIndex];if(W){const ee={...R.lastSelectedAbilityByMember||{}};ee[W.actorId]=d;const Z=fe[d];if((T=Z==null?void 0:Z.tags)!=null&&T.sustain&&(Z.id==="heal"||Z.id==="arc-restore"||Z.id==="kinetic-barrier")){const re=R.party.map((D,G)=>({m:D,i:G})).filter(D=>D.m.bars.hp>0&&D.m.bars.hp<100).sort((D,G)=>D.m.bars.hp-G.m.bars.hp)[0];i({selectedAbilityId:d,lastSelectedAbilityByMember:ee,isTargetingAlly:!0,armedAbilityId:d,selectedAllyIndex:re?re.i:void 0})}else i({selectedAbilityId:d,lastSelectedAbilityByMember:ee,isTargetingAlly:!1,armedAbilityId:void 0,selectedAllyIndex:void 0})}else i({selectedAbilityId:d,isTargetingAlly:!1,armedAbilityId:void 0,selectedAllyIndex:void 0})}try{(S=B.btnUse)==null||S.focus()}catch{}}}};e.addEventListener("click",_);const q=()=>{var re,D,G,X;const t=a();console.log(`🎯 RENDER FUNCTION: turn=${t.turn}, party members with damage flags:`),t.party.forEach(I=>{I._isTakingDamage&&console.log(`🎯 ${I.name} has _isTakingDamage=true`)});const p=t.selectedAbilityId?fe[t.selectedAbilityId]:void 0,J=!!t.isTargetingAlly&&!!t.armedAbilityId&&!!((re=p==null?void 0:p.tags)!=null&&re.sustain)&&(p.id==="heal"||p.id==="arc-restore"||p.id==="kinetic-barrier"),M=J?Math.round((ne.healMin+ne.healMax)/2):0;if(B.partyCardsContainer&&t.party&&t.party.length>0){const I=t.party.map((U,z)=>{const ae=U.bars.hp<=0,le=J&&!ae&&U.bars.hp<100,ye=J&&z===(t.selectedAllyIndex??-1),ce=J&&(ae?"Down":U.bars.hp>=100?"Full HP":"")||"",oe=t.turn==="enemy",ue=U._isTakingDamage;return console.log(`🎯 Rendering ${U.name}: turn=${t.turn}, isEnemyTurn=${oe}, _isTakingDamage=${!!U._isTakingDamage}, isTakingDamage=${ue}`),U._isTakingDamage&&console.log(`🎯 ${U.name} has damage flag set!`),U._isTakingDamage&&console.log(`🎯 Calling renderPartyCard for ${U.name}: isEnemyTurn=${oe}, isTakingDamage=${ue}`),f(U,z===t.activePartyIndex,ae,{index:z,isHealTargeting:J,isValidHeal:le,isSelectedHeal:ye,invalidReason:ce,isEnemyTurn:oe,isTakingDamage:ue})}).join("");B.partyCardsContainer.innerHTML=I}try{for(const I of t.party){const U=Math.max(0,Math.min(300,I.superEnergy??0)),z=us(U);o[I.actorId]=U,A[I.actorId]=z}}catch{}if(B.enemyCardsContainer){const I=k();B.enemyCardsContainer.innerHTML=I}const h=t.party[t.activePartyIndex];if(h){if(h.bars.hp<=0){let ae=t.activePartyIndex,le=0;do ae=(ae+1)%t.party.length,le++;while(t.party[ae].bars.hp<=0&&le<t.party.length);if(ae!==t.activePartyIndex&&t.party[ae].bars.hp>0){i({activePartyIndex:ae,selectedAbilityId:void 0});return}}const I=h.abilityIds.map(ae=>fe[ae]).filter(Boolean),U=t.selectedAbilityId==="__basic"||t.selectedAbilityId==="__defend",z=!!I.find(ae=>ae.id===t.selectedAbilityId);if(!t.selectedAbilityId||!z&&!U){const ae=(t.lastSelectedAbilityByMember||{})[h.actorId],ce=ae==="__basic"||ae==="__defend"||I.some(ue=>ue.id===ae)?ae:"__basic",oe={...t.lastSelectedAbilityByMember||{}};oe[h.actorId]=ce,i({selectedAbilityId:ce,lastSelectedAbilityByMember:oe});return}}if(B.abilitiesContainer){const I=F();B.abilitiesContainer.innerHTML=I}let V=!1;try{const I=t.party[t.activePartyIndex];if(I&&t.selectedAbilityId&&t.selectedAbilityId!=="__basic"&&t.selectedAbilityId!=="__defend"){V=(((t.cooldownsByMember||{})[I.actorId]||{})[t.selectedAbilityId]||0)>0;const z=t.selectedAbilityId?fe[t.selectedAbilityId]:void 0;if((D=z==null?void 0:z.tags)!=null&&D.sustain){const ae=Math.floor((I==null?void 0:I.superEnergy)??0),le=Math.floor((z==null?void 0:z.superCost)??0);ae<le&&(V=!0)}}else if(I&&t.selectedAbilityId==="__defend"){const U=at[I.classId],z=fe[U],ae=(t.cooldownsByMember||{})[I.actorId]||{},le=z&&ae[z.id]||0,ye=Math.floor((I==null?void 0:I.superEnergy)??0),ce=Math.floor((z==null?void 0:z.superCost)??0);V=!z||le>0||ye<ce}}catch{}let $=!1;try{if(t.selectedAbilityId==="__defend")$=!0;else if(t.selectedAbilityId&&t.selectedAbilityId!=="__basic"){const I=t.selectedAbilityId?fe[t.selectedAbilityId]:void 0;$=!!((G=I==null?void 0:I.tags)!=null&&G.sustain)}}catch{}const E=t.enemies.some(I=>I&&I.bars.hp>0);!t.enemies[t.targetIndex]||t.enemies[t.targetIndex].bars.hp<=0;const Q=!$,te=!!t.isTargetingAlly&&!!t.armedAbilityId&&!!((X=p==null?void 0:p.tags)!=null&&X.sustain)&&(p.id==="heal"||p.id==="arc-restore"||p.id==="kinetic-barrier"),T=te?typeof t.selectedAllyIndex=="number"&&t.party[t.selectedAllyIndex]&&t.party[t.selectedAllyIndex].bars.hp>0&&t.party[t.selectedAllyIndex].bars.hp<100:!0,S=t.turn!=="player"||t.isOver||!t.selectedAbilityId||V||Q&&!E||!T,d=t.turn!=="player"||t.isOver,R=t.turn!=="player"||t.isOver;B.btnUse.disabled=S,B.btnUse.setAttribute("aria-disabled",String(S)),B.btnEnd.disabled=d,B.btnNextMember&&(B.btnNextMember.disabled=R);try{B.btnCancelTargeting&&(B.btnCancelTargeting.style.display=t.isTargetingAlly?"":"none")}catch{}try{if(te){const I=t.selectedAllyIndex??-1;if(I>=0&&t.party[I]){const U=t.party[I].bars.hp,z=Math.min(100-U,M);B.btnUse.textContent=`Use (+${z})`}else B.btnUse.textContent="Use (Select target)"}else if(p&&p.id==="thermal-burst-sustain"){const I=t.party.filter(U=>U.bars.hp>0);B.btnUse.textContent=`Use (${I.length} allies)`}else B.btnUse.textContent="Use"}catch{}const W=new Set(t.party.map(I=>I.name.toLowerCase())),ee=new Set(t.enemies.map(I=>I.name.toLowerCase())),ie=[...t.log.length>100?t.log.slice(-100):t.log].reverse();B.logContent.innerHTML=ie.map(I=>{let U="row";const z=I.toLowerCase();let ae=!1,le=!1;for(const xe of W)if(z.includes(xe)){ae=!0;break}for(const xe of ee)if(z.includes(xe)){le=!0;break}if(!ae&&(z.startsWith("you ")||z.includes(" you "))&&(ae=!0),!le&&(z.includes(" attacks ")||z.includes(" uses "))&&(le=!0),ae&&le){const xe=Array.from(W).map(ve=>z.indexOf(ve)).filter(ve=>ve>=0).sort((ve,Oe)=>ve-Oe)[0]??1/0,ge=Array.from(ee).map(ve=>z.indexOf(ve)).filter(ve=>ve>=0).sort((ve,Oe)=>ve-Oe)[0]??1/0;xe<ge?le=!1:ae=!1}const ye=z.includes("you deal")||z.includes("sh −")||z.includes("hp −"),ce=z.includes("takes")||z.includes("'s shields took"),oe=z.includes("applied")&&z.includes("prime"),ue=z.includes("detonation"),pe=z.includes("detonation:")||z.includes("explosion");return ae&&(U+=" log-player-action"),le&&(U+=" log-enemy-action"),ye&&(U+=" log-dmg-out"),ce&&(U+=" log-dmg-in"),oe&&(U+=" log-prime"),ue&&(U+=" log-detonate"),pe&&(U+=" log-explode"),(I.includes("Victory")||I.includes("Defeat"))&&(U+=" log-battle-result"),`<div class="${U}">${I}</div>`}).join("")},L=()=>{var p,J,M,h,V,$,E,Q,te,T,S;const t=a();if(t.turn==="player"&&!t.isOver){const d=t.enemies[t.targetIndex];let R=!1;try{if(t.selectedAbilityId==="__defend")R=!0;else if(t.selectedAbilityId&&t.selectedAbilityId!=="__basic"){const ee=t.selectedAbilityId?fe[t.selectedAbilityId]:void 0;R=!!((p=ee==null?void 0:ee.tags)!=null&&p.sustain)}}catch{}const W=t.enemies.some(ee=>ee.bars.hp>0);if(!R&&!W)return;{const ee=!t.selectedAbilityId;let Z=ee?{...t,selectedAbilityId:"__basic"}:t;if(!R&&(!d||d.bars.hp<=0)){const U=t.enemies.findIndex(z=>z.bars.hp>0);U!==-1&&(Z={...Z,targetIndex:U})}Z.selectedAbilityId==="__basic"||Z.selectedAbilityId==="__defend"||!!fe[Z.selectedAbilityId]||(Z={...Z,selectedAbilityId:"__basic"});const re=Z.selectedAbilityId?fe[Z.selectedAbilityId]:void 0;if(re&&!R){const I=Z.enemies[Z.targetIndex],U=Array.isArray(I==null?void 0:I.primes)&&I.primes.length>0;if(re.role==="prime")try{(M=(J=window.BattleFX)==null?void 0:J.prime)==null||M.call(J,String(re.type).charAt(0).toUpperCase()+String(re.type).slice(1))}catch{}else if(re.role==="detonator"){const z=String(re.type).charAt(0).toUpperCase()+String(re.type).slice(1);try{U?(V=(h=window.BattleFX)==null?void 0:h.explosion)==null||V.call(h,z):(E=($=window.BattleFX)==null?void 0:$.detonate)==null||E.call($,z)}catch{}}}const D=Z.targetIndex,G=Z.enemies[D]?{id:Z.enemies[D].id,sh:Z.enemies[D].bars.sh,hp:Z.enemies[D].bars.hp}:void 0;Z.isTargetingAlly&&Z.selectedAllyIndex;const X=Ss(Z);if(X.isTargetingAlly=!1,X.armedAbilityId=void 0,X.selectedAllyIndex=void 0,ee){const I=t.party[t.activePartyIndex];if(I){const U={...t.lastSelectedAbilityByMember||{}};U[I.actorId]="__basic",i({...X,lastSelectedAbilityByMember:U})}else i(X)}else{const I=(((Q=X.log)==null?void 0:Q.length)||0)===(((te=Z.log)==null?void 0:te.length)||0);i(I?{...X,log:[...X.log||[],"Use: action produced no effect."]}:X)}try{const I=G,U=X.enemies[X.targetIndex];if(I&&U&&((T=window.BattleFX)!=null&&T.floatDamage)){const z=Math.max(0,I.sh-U.bars.sh),ae=Math.max(0,I.hp-U.bars.hp);(z>0||ae>0)&&(U._isTakingDamage=!0,console.log(`🎯 Enemy ${U.name} marked as taking damage: SH=${z}, HP=${ae}`),setTimeout(()=>{const ce=a(),oe=ce.enemies[ce.targetIndex];oe&&oe._isTakingDamage&&(oe._isTakingDamage=!1,console.log(`🎯 Enemy ${oe.name} damage flag cleared`),b())},800));let le=e.querySelectorAll(".enemy-cards .enemy-thumb");(!le||le.length===0)&&(le=e.querySelectorAll(".enemy-cards .card"));const ye=le[X.targetIndex];if(ye){const ce=ye.getBoundingClientRect(),oe=ce.left+ce.width/2,ue=ce.top+ce.height/2,pe=(S=document.getElementById("app-wrap"))==null?void 0:S.getBoundingClientRect(),xe=pe?oe-pe.left:oe,ge=pe?ue-pe.top:ue,ve=($a,Ca)=>({x:$a,y:Ca}),Oe={kinetic:"Kinetic",arc:"Arc",thermal:"Thermal",void:"Void"},Ze=X.selectedAbilityId?fe[X.selectedAbilityId]:void 0,Ta=Oe[(Ze==null?void 0:Ze.type)||"kinetic"]||"Kinetic";z>0&&window.BattleFX.floatDamage(ve(xe,ge),z,{shield:!0}),ae>0&&window.BattleFX.floatDamage(ve(xe,ge-10),ae,{type:Ta})}}}catch{}if(X.turn==="enemy"){const I=X.enemies.map(z=>z.id).filter((z,ae)=>X.enemies[ae].bars.hp>0),U=(z,ae)=>{if(z>=I.length){console.log("🎯 End Turn: Enemy turn complete, resetting to player turn");const ce={...ae,turn:"player",partyMembersActedThisRound:0,activePartyIndex:0};return ce.party.forEach(oe=>{oe._isTakingDamage&&(oe._isTakingDamage=!1)}),ce.enemies.forEach(oe=>{oe._isTakingDamage&&(oe._isTakingDamage=!1)}),i(ce)}const le=I[z],ye=setTimeout(()=>{const ce={...ae,_forceEnemyId:le},oe=ae.party.map(pe=>({actorId:pe.actorId,sh:pe.bars.sh,hp:pe.bars.hp})),ue=bt(ce);console.log(`🎯 Checking for damage on ${ue.party.length} party members...`),ue.party.forEach((pe,xe)=>{const ge=oe[xe];console.log(`🎯 ${pe.name}: Before SH=${ge==null?void 0:ge.sh}, HP=${ge==null?void 0:ge.hp} | After SH=${pe.bars.sh}, HP=${pe.bars.hp}`),ge&&(ge.sh>pe.bars.sh||ge.hp>pe.bars.hp)?(pe._isTakingDamage=!0,console.log(`🎯 Party member ${pe.name} marked as taking damage`),console.log(`🎯 Damage details: SH ${ge.sh} -> ${pe.bars.sh}, HP ${ge.hp} -> ${pe.bars.hp}`)):console.log(`🎯 ${pe.name}: No damage detected`)}),console.log(`🎯 Setting state with damage flags, turn=${ue.turn}`),i(ue),setTimeout(()=>{const pe=a();console.log(`🎯 Clearing damage flags, current turn=${pe.turn}`),pe.party.forEach((xe,ge)=>{xe._isTakingDamage&&(xe._isTakingDamage=!1,console.log(`🎯 Party member ${xe.name} damage flag cleared`))}),console.log("🎯 Scheduling render after clearing damage flags"),b()},2e3),ue.isOver||U(z+1,{...ue,turn:"enemy"})},500);y.push(ye)};U(0,X)}}}};B.btnUse.addEventListener("click",L);const Y=()=>{const t=a();if(t.turn==="player"&&!t.isOver){const p=t.enemies.map(M=>M.id).filter((M,h)=>t.enemies[h].bars.hp>0),J=(M,h)=>{if(M>=p.length){const E={...h,turn:"player",partyMembersActedThisRound:0,activePartyIndex:0};return E.party.forEach(Q=>{Q._isTakingDamage&&(Q._isTakingDamage=!1)}),i(E)}const V=p[M],$=setTimeout(()=>{const E={...h,_forceEnemyId:V},Q=h.party.map(T=>({actorId:T.actorId,sh:T.bars.sh,hp:T.bars.hp})),te=bt(E);console.log(`🎯 Checking for damage on ${te.party.length} party members...`),te.party.forEach((T,S)=>{const d=Q[S];console.log(`🎯 ${T.name}: Before SH=${d==null?void 0:d.sh}, HP=${d==null?void 0:d.hp} | After SH=${T.bars.sh}, HP=${T.bars.hp}`),d&&(d.sh>T.bars.sh||d.hp>T.bars.hp)?(T._isTakingDamage=!0,console.log(`🎯 Party member ${T.name} marked as taking damage (End Turn)`),console.log(`🎯 Damage details: SH ${d.sh} -> ${T.bars.sh}, HP ${d.hp} -> ${T.bars.hp}`)):console.log(`🎯 ${T.name}: No damage detected`)}),console.log(`🎯 Setting state with damage flags (End Turn), turn=${te.turn}`),i(te),setTimeout(()=>{const T=a();console.log(`🎯 Clearing damage flags (End Turn), current turn=${T.turn}`),T.party.forEach((S,d)=>{S._isTakingDamage&&(S._isTakingDamage=!1,console.log(`🎯 Party member ${S.name} damage flag cleared (End Turn)`))}),console.log("🎯 Scheduling render after clearing damage flags (End Turn)"),b()},2e3),te.isOver||J(M+1,{...te,turn:"enemy"})},500);y.push($)};J(0,{...t,turn:"enemy"})}};B.btnEnd.addEventListener("click",Y);const K=()=>{const t=a();if(t.turn==="player"&&!t.isOver){let p=t.activePartyIndex,J=0;do p=(p+1)%t.party.length,J++;while(t.party[p].bars.hp<=0&&J<t.party.length);p!==t.activePartyIndex&&t.party[p].bars.hp>0&&i({activePartyIndex:p,selectedAbilityId:void 0})}};B.btnNextMember&&B.btnNextMember.addEventListener("click",K);let j;try{const t=e.querySelector("#btnCancelTargeting");t&&(j=()=>{a().isTargetingAlly&&i({isTargetingAlly:!1,armedAbilityId:void 0,selectedAllyIndex:void 0})},t.addEventListener("click",j))}catch{}b();const O=()=>{const t=a();if(t.targetIndex<0||t.targetIndex>=t.enemies.length||t.enemies[t.targetIndex].bars.hp<=0){const p=rt(t);if(p!==-1&&p!==t.targetIndex){const J=t.targetIndex>=0&&t.targetIndex<t.enemies.length?t.enemies[t.targetIndex].name:"none";t.targetIndex=p;const M=t.enemies[t.targetIndex].name;console.log(`🎯 Auto-targeting: ${J} → ${M}`),t.enemies[t.targetIndex]._autoTargeted=!0,t.log&&t.log.length>0&&t.log.push(`Targeting ${M}`),setTimeout(()=>{var h;(h=t.enemies[t.targetIndex])!=null&&h._autoTargeted&&(t.enemies[t.targetIndex]._autoTargeted=!1)},800)}}},se=setInterval(()=>{const t=a();t.enemies.forEach((p,J)=>{if(p.bars.hp<=0&&p._deathAnimationState==="dying"&&p._deathStartTime&&Date.now()-p._deathStartTime>1500){p._deathAnimationState="completed";const M=J===t.targetIndex;if(t.enemies.splice(J,1),M||t.targetIndex>=t.enemies.length){const h=rt(t);h!==-1?(t.targetIndex=h,console.log(`🎯 UI: Auto-targeting ${t.enemies[t.targetIndex].name} after enemy removal`)):t.targetIndex=Math.max(0,t.enemies.length-1)}}}),xa(t)&&!t.isOver&&(t.isOver=!0,console.log("🎯 Victory! All enemies defeated - mission complete!")),t.enemies.filter(p=>p._deathAnimationState==="dying").length,t.enemies.filter(p=>p.bars.hp<=0).length,t.enemies.filter(p=>p.bars.hp>0).length,O()},100);return()=>{try{typeof N=="function"&&N()}catch{}try{e.removeEventListener("click",_)}catch{}try{B.btnUse.removeEventListener("click",L)}catch{}try{B.btnEnd.removeEventListener("click",Y)}catch{}try{B.btnNextMember&&B.btnNextMember.removeEventListener("click",K)}catch{}try{y.splice(0).forEach(t=>clearTimeout(t))}catch{}try{const t=e.querySelector("#btnCancelTargeting");t&&j&&t.removeEventListener("click",j)}catch{}try{clearInterval(se)}catch{}}}const Bs={vanguard:{label:"Vanguard",short:"KIN",badge:"badge-kin",icon:Ae,description:"Tank with high shield and health. Excels at protecting allies and controlling the battlefield.",abilities:["Shield Bash","Guardian Stance","Rallying Cry","Iron Will"]},technomancer:{label:"Technomancer",short:"ARC",badge:"badge-arc",icon:Ie,description:"Arc damage specialist with crowd control abilities. Manipulates enemies and supports the team.",abilities:["Arc Surge","Static Field","Chain Lightning","Overcharge"]},pyromancer:{label:"Pyromancer",short:"THR",badge:"badge-thr",icon:Pe,description:"Thermal damage dealer with area attacks. Burns through enemy defenses and groups.",abilities:["Flame Burst","Heat Wave","Inferno","Thermal Overload"]},voidrunner:{label:"Voidrunner",short:"VOID",badge:"badge-void",icon:Be,description:"Void damage assassin with mobility. Strikes from shadows and disrupts enemy plans.",abilities:["Void Strike","Shadow Step","Dark Pulse","Void Rift"]}};function Es(e,a,i,s,n){let r=null;const c=()=>a.partySelection.length<a.maxParty,v=l=>a.partySelection.includes(l);function g(l){const u=v(l);if(!(u&&a.lockedCharacterId&&l===a.lockedCharacterId)){if(u){const x=a.partySelection.filter(P=>P!==l),F={...a.selectedByChar};delete F[l],i({partySelection:x,selectedByChar:F})}else if(c()){const x=[...a.partySelection,l],F={...a.selectedByChar,[l]:a.selectedByChar[l]||[]};i({partySelection:x,selectedByChar:F})}}}function m(l){const u=Bs[l.classId],x=v(l.id),F=!x&&!c(),P=a.lockedCharacterId===l.id;return`
      <div class="char-card ${x?"selected":""}" data-pick="${l.id}">
        <div class="char-info">
          <div class="char-icon">
            <img src="${u.icon}" alt="${u.label}" />
          </div>
          <div class="char-name">${l.name}</div>
        </div>
        <div class="char-stats">
          <div class="class-pill">
            <span class="stat">${u.label}</span>
          </div>
          <div class="stat-row">
            <span class="stat element-${u.short.toLowerCase()}">${u.short}</span>
            <span class="stat">SH${l.baseBars.sh}</span>
            <span class="stat">HP${l.baseBars.hp}</span>
          </div>
          <div class="class-description">
            <div class="description-text">${u.description}</div>
          </div>
        </div>
        <div class="card-cta">
          <button class="pick-btn" data-pick="${l.id}" ${F||x&&P?"disabled":""}>
            ${P?"Locked":x?"Remove":"Add"}
          </button>
        </div>
      </div>
    `}function f(){const{roster:l,partySelection:u,maxParty:x}=a,F=l;e.innerHTML=`
      <div class="party-screen mx-auto h-[100dvh] max-w-[100vw] bg-slate-950 text-slate-100 grid grid-rows-[auto_1fr_auto]" style="overflow-x:hidden; width: 100vw; max-width: 100vw;">
        <!-- Header -->
        <header class="h-12 flex items-center justify-between px-2 border-b border-white/10">
          <div></div>
          <div class="text-sm font-semibold">Select Your Party</div>
          <div class="text-xs opacity-80">${u.length}/${x}</div>
        </header>

        <!-- Scrollable content -->
        <main class="overflow-y-auto" style="overflow-x: hidden; margin-top: 5px;">
          <div class="px-2 pt-3 pb-20" style="width: 100%; box-sizing: border-box;">
            <div class="card-grid" style="grid-template-columns: 1fr; width: 100%; box-sizing: border-box; margin-top: 5px;">
              ${F.map(m).join("")}
            </div>
          </div>
        </main>

        <!-- Footer action bar -->
        <footer class="px-2 pb-[env(safe-area-inset-bottom,12px)] pt-2" style="width: 100%; box-sizing: border-box;">
          <div class="sticky-cta" style="position:static; background:transparent; border:0; padding:0; width: 100%; box-sizing: border-box;">
            <div class="flex justify-between">
              <button id="backBtn" class="btn btn-back text-lg px-4 py-2">Back</button>
              <div class="progress text-right">
                ${u.length} selected • Tap a card to add/remove
              </div>
            </div>
            <button class="primary w-full mt-2" id="cfgLoadout" ${u.length===x?"":"disabled"}>
              Configure Loadout
            </button>
          </div>
        </footer>
      </div>
    `,k()}function k(){r||(r=l=>{const u=l.target;if(!u)return;const x=u.closest("[data-pick]");if(x){const F=x.getAttribute("data-pick");F&&g(F);return}if(u.id==="cfgLoadout"){a.partySelection.length===a.maxParty&&(i(F=>{F.loadout.loadoutActiveIndex=0}),s());return}if(u.id==="backBtn"){n&&n();return}},e.addEventListener("click",r))}return f(),()=>{r&&(e.removeEventListener("click",r),r=null),e.innerHTML=""}}const xt={id:"nova_boldness_under_fire",factionFought:"Syndicate",scenes:[{image:"nova_boldness_intro.png",dialogue:[{speaker:"Narrator",position:"narrator",text:"Dockside after midnight: cranes loom like skeletal giants, fog curling between shipping containers. Somewhere above, sodium lights sputter, threatening to die."},{speaker:"Narrator",position:"narrator",text:"Outlaw spotters murmur into throat mics — Syndicate guards rotate off the cargo spine at exactly 00:02. One chance to strike."},{speaker:"Outlaw Lead",position:"right",text:"We move fast or we don't move at all. Your call, Nova."},{speaker:"Nova",position:"left",text:"One shot to hit the spine while they blink. Miss it, and we're tourists with problems."},{speaker:"Outlaw Lead",position:"right",text:"Two routes. Spine corridor is short and straight — fastest to the prize, but their killzone. Roof cranes are slower, safer, but one slip on those cables and we're done."},{speaker:"Nova",position:"left",text:"If we hesitate, they'll double the patrols. And if we wait for the next shift, the cargo will be halfway to Syndicate HQ."}],skillCheck:{description:"Route Choice",choices:[{label:"A",text:"Spine route",result:"pass"},{label:"B",text:"Crane route",result:"fail"},{label:"C",text:"Wait",result:"fail"}]}},{image:"nova_boldness_intro.png",dialogue:[{speaker:"Narrator",position:"narrator",text:"The decision hangs in the air like the fog. Outlaw Lead nods once, sharp and final."},{speaker:"Outlaw Lead",position:"right",text:"Alright then. Slicer, you're on point. Nova, you're our shield."},{speaker:"Outlaw Slicer",position:"right",text:"I can crack their security in under two minutes. But I need a clear window."},{speaker:"Nova",position:"left",text:"You'll get it. Lead, what's our fallback if this goes sideways?"},{speaker:"Outlaw Lead",position:"right",text:"Fallback? We don't have one. That's why we're hitting hard."},{speaker:"Narrator",position:"narrator",text:"Metal creaks overhead as a crane arm swings slowly through the mist. The docks hold their breath."}],skillCheck:{description:"Commitment",choices:[{label:"A",text:"Make it work",result:"pass"},{label:"B",text:"Reconsider cranes",result:"fail"},{label:"C",text:"Need time",result:"fail"}]}},{image:"nova_boldness_conflict.png",dialogue:[{speaker:"Narrator",position:"narrator",text:"Halfway to the target, movement catches Nova's eye — blue visor lights cutting through the mist like slow-moving predators."},{speaker:"Narrator",position:"narrator",text:"Metal boots hit the catwalk in sharp, steady beats. Syndicate patrol, early."},{speaker:"Syndicate Captain",position:"narrator",text:"Drop weapons. Corporate property. On your knees, hands where I can see them."},{speaker:"Nova",position:"left",text:"Corporate hospitality never changes — all orders, no appetizers."},{speaker:"Outlaw Lead",position:"right",text:"They're sighting the slicer. She drops, the lock drops. You block, we live."},{speaker:"Syndicate Captain",position:"narrator",text:"Kneel. Now. Noncompliance triggers lethal protocol."},{speaker:"Nova",position:"left",text:"Funny how lethal protocols always start with aiming at the smallest target."}],skillCheck:{description:"Protect Ally",choices:[{label:"B",text:"Stand down",result:"fail"},{label:"A",text:"Target me",result:"pass"},{label:"C",text:"Run",result:"fail"}]}},{image:"nova_boldness_conflict.png",dialogue:[{speaker:"Narrator",position:"narrator",text:"The Syndicate Captain's visor tilts slightly, processing Nova's defiance."},{speaker:"Syndicate Captain",position:"narrator",text:"You're not the target. Step aside."},{speaker:"Nova",position:"left",text:"I am now. You want the slicer, you go through me."},{speaker:"Outlaw Slicer",position:"right",text:"Thirty seconds. I need thirty seconds."},{speaker:"Syndicate Captain",position:"narrator",text:"Last warning. Corporate property is protected by any means necessary."},{speaker:"Nova",position:"left",text:"Then let's see what your 'means' look like up close."}],skillCheck:{description:"Hold Position",choices:[{label:"A",text:"Hold ground",result:"pass"},{label:"B",text:"Step back",result:"fail"},{label:"C",text:"Charge forward",result:"fail"}]}},{image:"nova_boldness_battle.png",dialogue:[{speaker:"Narrator",position:"narrator",text:"The slicer's voice crackles in comms: frantic, focused — digits racing, the door's security biting back."},{speaker:"Outlaw Lead",position:"right",text:"Door's locked. Buy me ten seconds."},{speaker:"Syndicate Trooper",position:"narrator",text:"One step and you're ash."},{speaker:"Nova",position:"left",text:"You're guarding a dock in a storm, hoping lightning asks permission."},{speaker:"Syndicate Trooper",position:"narrator",text:"Last warning."},{speaker:"Nova",position:"left",text:"Then I'll make my first move the last one I need."}],skillCheck:{description:"Confrontation",choices:[{label:"C",text:"Insult",result:"fail"},{label:"A",text:"Walk away",result:"pass"},{label:"B",text:"Trade",result:"fail"}]}},{image:"nova_boldness_battle.png",dialogue:[{speaker:"Narrator",position:"narrator",text:"Behind Nova, the slicer's fingers fly across the interface. Green lights flicker to life on the security panel."},{speaker:"Outlaw Slicer",position:"right",text:"Got it! Door's opening!"},{speaker:"Syndicate Captain",position:"narrator",text:"All units, breach in progress. Contain and eliminate."},{speaker:"Nova",position:"left",text:"Too late. The prize is ours."},{speaker:"Outlaw Lead",position:"right",text:"Nova, we're clear. Time to go!"},{speaker:"Nova",position:"left",text:"Not yet. They need to understand who they're dealing with."}],skillCheck:{description:"Exit Statement",choices:[{label:"A",text:"Tell me who you are, and I'll remember you. Otherwise, you're just another corporate ghost.",result:"pass"},{label:"B",text:"We'll be back. Count on it.",result:"fail"},{label:"C",text:"Thanks for the hospitality.",result:"fail"}]}}],postBattle:{threePasses:"The Captain clocks Nova's nerve. 'Next time, call a truce line.' A quiet data ping arrives later — a Syndicate routing hint."}},vt={id:"nova_run_toward_the_fire",factionFought:"Syndicate",scenes:[{image:"nova_altruism_intro.png",dialogue:[{speaker:"Narrator",position:"narrator",text:"The tunnel smells of scorched wiring. Smoke curls through cracks in the ceiling, illuminated by stuttering emergency lights."},{speaker:"Accord Rescuer",position:"right",text:"There’s a family trapped under the east platform. The Syndicate’s holding the main concourse as a shield."},{speaker:"Nova",position:"left",text:"They’ll use civilians to slow you down. They always do."},{speaker:"Accord Rescuer",position:"right",text:"We’ve got no safe path in — not without losing people."},{speaker:"Nova",position:"left",text:"So we make one. And we take the hit so they don’t have to."}]},{image:"nova_altruism_intro.png",dialogue:[{speaker:"Accord Rescuer",position:"right",text:"The only clear shot is straight through their patrol sweep."}],skillCheck:{description:"Volunteer for highest risk route",choices:[{label:"A",text:"I’ll draw them. You get the civilians moving.",result:"pass"},{label:"B",text:"We wait for reinforcements.",result:"fail"},{label:"C",text:"We’ll find another way later.",result:"fail"}]}},{image:"nova_altruism_conflict.png",dialogue:[{speaker:"Narrator",position:"narrator",text:"Shapes move in the haze — Syndicate enforcers with rifles up, stepping into overlapping arcs."},{speaker:"Syndicate Lieutenant",position:"narrator",text:"You’re far from home, Nova. Leave the civilians — we just want you."},{speaker:"Nova",position:"left",text:"That’s not how this ends."},{speaker:"Accord Rescuer",position:"right",text:"They’ve cut the escape lane. We need another distraction."}]},{image:"nova_altruism_conflict.png",dialogue:[{speaker:"Accord Rescuer",position:"right",text:"They’ve got me lined up—"}],skillCheck:{description:"Protect ally from sniper fire",choices:[{label:"B",text:"Duck and pray.",result:"fail"},{label:"A",text:"I’ll take the shot. Move now.",result:"pass"},{label:"C",text:"We’re both stuck here until they miss.",result:"fail"}]}},{image:"nova_altruism_conflict.png",dialogue:[{speaker:"Narrator",position:"narrator",text:"More Syndicate reinforcements pour from the concourse, herding civilians into tighter clusters as cover."},{speaker:"Syndicate Lieutenant",position:"narrator",text:"Last warning. Leave them and walk away."},{speaker:"Nova",position:"left",text:"I’d rather fall here than leave them with you."}]},{image:"nova_altruism_conflict.png",dialogue:[{speaker:"Syndicate Lieutenant",position:"narrator",text:"What are you worth to them, I wonder?"}],skillCheck:{description:"Offer yourself as a bargaining chip",choices:[{label:"C",text:"Enough to end you right now.",result:"fail"},{label:"B",text:"You’ll find out the hard way.",result:"fail"},{label:"A",text:"Take me, and you let them go — no harm.",result:"pass"}]}},{image:"nova_altruism_battle.png",dialogue:[{speaker:"Narrator",position:"narrator",text:"The trade is a ruse — as Nova moves toward the Syndicate line, Accord rescuers sweep the civilians out. Then the fighting starts in earnest."}]}],postBattle:{threePasses:"Civilians freed, Accord honors Nova as a ‘shield in motion.’ Syndicate lieutenant files a personal vendetta."}},wt={id:"volt_adapting_to_chaos",factionFought:"Voidborn",scenes:[{image:"volt_adaptability_intro.png",dialogue:[{speaker:"Narrator",position:"narrator",text:"Accord hangar: the scent of ozone lingers in the rafters. Dismantled fighters sit in skeletal rows under scaffolds, while engineers shout clipped orders over the hiss of welding torches."},{speaker:"Accord Engineer",position:"right",text:"Share specs, get access. No specs, no doors."},{speaker:"Volt",position:"left",text:"I'm here for flow, not fences."},{speaker:"Accord Engineer",position:"right",text:"Console's air-gapped. Protocol says no uplinks without clearance. Your badge won't bridge a vacuum."},{speaker:"Volt",position:"left",text:"Then we make a bridge that isn't in the manual. Current always finds a path."},{speaker:"Accord Engineer",position:"right",text:"If you fry my boards, you're paying in hull plating."}],skillCheck:{description:"System Bypass",choices:[{label:"B",text:"Wait for your tech.",result:"fail"},{label:"A",text:"Volt rigs a coil and repurposes a drone battery to jump the service bus. 'Analog bridge, digital win.'",result:"pass"},{label:"C",text:"Kick the panel. It'll open.",result:"fail"}]}},{image:"volt_adaptability_intro.png",dialogue:[{speaker:"Narrator",position:"narrator",text:"The console hums to life, displays flickering through boot sequences. Volt's makeshift bridge pulses with borrowed energy."},{speaker:"Accord Engineer",position:"right",text:"That shouldn't work. The isolation protocols are military-grade."},{speaker:"Volt",position:"left",text:"Military-grade means someone designed it. Someone can redesign it."},{speaker:"Accord Engineer",position:"right",text:"You're not just a tech, are you? You're a system bender."},{speaker:"Volt",position:"left",text:"I adapt. Systems, plans, whatever the situation needs."},{speaker:"Narrator",position:"narrator",text:"A warning light blinks on the console. Something's not right with the power grid."}],skillCheck:{description:"System Analysis",choices:[{label:"A",text:"Power fluctuation. Something's drawing too much current. Let me trace it.",result:"pass"},{label:"B",text:"Probably just a glitch. Let's focus on the main objective.",result:"fail"},{label:"C",text:"Not my problem. The console works.",result:"fail"}]}},{image:"volt_adaptability_conflict.png",dialogue:[{speaker:"Narrator",position:"narrator",text:"The floor tingles underfoot. Blue lightning snakes along gantry rails as the air thins — tools and debris begin to drift in lazy arcs."},{speaker:"Accord Officer",position:"right",text:"Voidborn signature — brace! Lock down the bays!"},{speaker:"Volt",position:"left",text:"Your plan assumed normal physics. Update: physics just quit."},{speaker:"Accord Officer",position:"right",text:"Stick to the plan!"},{speaker:"Volt",position:"left",text:"The plan's already dead. New one: we make the room fight for us, not them."},{speaker:"Accord Engineer",position:"right",text:"Tell me what to reroute and I'll try not to die doing it."}],skillCheck:{description:"Tactical Adaptation",choices:[{label:"C",text:"Charge the rift!",result:"fail"},{label:"A",text:"New plan: ground the gantries, fight in choke points. (Volt flips power routing.)",result:"pass"},{label:"B",text:"We hold position and hope.",result:"fail"}]}},{image:"volt_adaptability_conflict.png",dialogue:[{speaker:"Narrator",position:"narrator",text:"Volt's fingers dance across the console, rerouting power through emergency circuits. The gantry lights flicker and stabilize."},{speaker:"Accord Engineer",position:"right",text:"You're turning our own systems against them. That's... actually brilliant."},{speaker:"Volt",position:"left",text:"When the rules change, you change the rules."},{speaker:"Accord Officer",position:"right",text:"But what if they adapt to our adaptations?"},{speaker:"Volt",position:"left",text:"Then we adapt faster. That's the game."},{speaker:"Narrator",position:"narrator",text:"The air crackles with static as reality itself begins to tear."}],skillCheck:{description:"Maintain Adaptability",choices:[{label:"A",text:"They're learning our patterns. Time to randomize. (Volt scrambles the power grid.)",result:"pass"},{label:"B",text:"Stick with what's working.",result:"fail"},{label:"C",text:"We need to fall back and regroup.",result:"fail"}]}},{image:"volt_adaptability_battle.png",dialogue:[{speaker:"Narrator",position:"narrator",text:"A tear opens in midair — a petaled wound in space, edges rimmed in pale fire. Voices ride the static, layered and out of sync."},{speaker:"Voidborn Acolyte",position:"narrator",text:"Shed the husk. Join the tide."},{speaker:"Accord Engineer",position:"right",text:"If they finish that ritual, the hangar's done. Buy us time to lock the clamps!"},{speaker:"Volt",position:"left",text:"Adapter meets undertow. Let's see if you can dance."},{speaker:"Voidborn Acolyte",position:"narrator",text:"Prove worth."},{speaker:"Volt",position:"left",text:"Close the rift, or lose your harvest. Give me one minute — then you take your pickings."}],skillCheck:{description:"Negotiation",choices:[{label:"A",text:"Close the rift or lose your harvest. Give me one minute — then take your pickings.",result:"pass"},{label:"B",text:"Stand down — we can study this.",result:"fail"},{label:"C",text:"You're delusional.",result:"fail"}]}},{image:"volt_adaptability_battle.png",dialogue:[{speaker:"Narrator",position:"narrator",text:"The Voidborn Acolyte's form shimmers, considering Volt's offer. Reality itself seems to hold its breath."},{speaker:"Voidborn Acolyte",position:"narrator",text:"One minute. But know this: we remember those who bargain with the tide."},{speaker:"Volt",position:"left",text:"And we remember those who keep their word. Engineer, now!"},{speaker:"Accord Engineer",position:"right",text:"Clamps are locked! Power grid is stable!"},{speaker:"Voidborn Acolyte",position:"narrator",text:"Time's up, adapter. What have you built?"},{speaker:"Volt",position:"left",text:"A system that fights back. Welcome to the new rules."}],skillCheck:{description:"Execute Plan",choices:[{label:"A",text:"Activate the modified power grid, turning the hangar into a weapon.",result:"pass"},{label:"B",text:"Try to negotiate for more time.",result:"fail"},{label:"C",text:"Run for cover and hope for the best.",result:"fail"}]}}],postBattle:{threePasses:"The rifts dim. The Acolyte inclines their head: 'Another cycle, adapter.' Accord grants Volt wider access."}},kt={id:"shade_shadows_of_empathy",factionFought:"Voidborn",scenes:[{image:"shade_empathy_intro.png",dialogue:[{speaker:"Narrator",position:"narrator",text:"The shrine breathes like a living cave — bioluminescent threads pulsing faint light across stone ribs while a low tide of whispers rolls and fades."},{speaker:"Voidborn Thrall",position:"narrator",text:"We give so the lost are seen."},{speaker:"Shade",position:"left",text:"Seen and named, or just counted?"},{speaker:"Voidborn Thrall",position:"narrator",text:"Named. Or they drift forever."},{speaker:"Narrator",position:"narrator",text:"A bead chain clicks in the Thrall's hands, each tap a heartbeat trying not to break."},{speaker:"Shade",position:"left",text:"What did the Void take from you?"},{speaker:"Voidborn Thrall",position:"narrator",text:"A sister. Unmoored in a storm. One moment she laughed; the next, she was an echo."}],skillCheck:{description:"Active Listening",choices:[{label:"B",text:"Walk me through the moment she slipped… and what you wish you'd said.",result:"pass"},{label:"A",text:"I'm sorry.",result:"fail"},{label:"C",text:"Not my problem.",result:"fail"}]}},{image:"shade_empathy_intro.png",dialogue:[{speaker:"Narrator",position:"narrator",text:"The Thrall's hands still, the beads silent for the first time. Their eyes meet Shade's, recognition dawning."},{speaker:"Voidborn Thrall",position:"narrator",text:"You... you hear the echoes too, don't you?"},{speaker:"Shade",position:"left",text:"I hear what others miss. It's why I'm here."},{speaker:"Voidborn Thrall",position:"narrator",text:"Then you know why we keep the names. Why we light the candles."},{speaker:"Shade",position:"left",text:"Because forgetting them is a second death."},{speaker:"Narrator",position:"narrator",text:"The shrine's whispers seem to settle, as if acknowledging this moment of understanding."}],skillCheck:{description:"Emotional Connection",choices:[{label:"A",text:"Tell me her name. Let me remember her with you.",result:"pass"},{label:"B",text:"We should focus on the mission.",result:"fail"},{label:"C",text:"That's very touching, but we have work to do.",result:"fail"}]}},{image:"shade_empathy_conflict.png",dialogue:[{speaker:"Narrator",position:"narrator",text:"A hidden cache yawns open; pages of ritual diagrams flutter in the draft. A rough bootprint smears ink across the floor."},{speaker:"Narrator",position:"narrator",text:"Figures lurch from the shadows — Outlaws, grim and hungry, dragging a bound raider who shakes like a trapped wire."},{speaker:"Outlaw (Captured)",position:"right",text:"Don't hand me over. I was just paid to lift pages, that's all."},{speaker:"Shade",position:"left",text:"Pages become leverage. Leverage becomes blood."},{speaker:"Voidborn Thrall",position:"narrator",text:"The rites are not trinkets. They are names, and names are lives."},{speaker:"Shade",position:"left",text:"Then we decide whether this ends a cycle or starts one."}],skillCheck:{description:"Show Mercy",choices:[{label:"A",text:"You walk. Next time, walk wiser.",result:"pass"},{label:"B",text:"You're lucky I'm not the one who caught you.",result:"fail"},{label:"C",text:"You'll pay for what you've done.",result:"fail"}]}},{image:"shade_empathy_conflict.png",dialogue:[{speaker:"Outlaw (Captured)",position:"right",text:"I'll tell you what I know about the Voidborn operation."},{speaker:"Shade",position:"left",text:"Start talking."},{speaker:"Outlaw (Captured)",position:"right",text:"They're using the shrine to channel something. Something that makes people forget who they are."},{speaker:"Shade",position:"left",text:"And you helped them?"},{speaker:"Outlaw (Captured)",position:"right",text:"I needed the credits. But I didn't know what they were really doing."}],skillCheck:{description:"Information Extraction",choices:[{label:"A",text:"Your ignorance doesn't absolve you.",result:"fail"},{label:"B",text:"Help me stop them, and we'll call it even.",result:"pass"},{label:"C",text:"You'll rot in a cell for this.",result:"fail"}]}},{image:"shade_empathy_battle.png",dialogue:[{speaker:"Outlaw Lieutenant",position:"right",text:"Kneel, cloaker. Hand over the cache and the rat you freed."},{speaker:"Shade",position:"left",text:"You've got mouths to feed. So do I. We end this clean."},{speaker:"Voidborn Thrall",position:"narrator",text:"Spare the blood. The stone remembers what we do."},{speaker:"Outlaw Lieutenant",position:"right",text:"Stones don't pay debts."},{speaker:"Shade",position:"left",text:"People do. Let them leave with their names intact, and you keep yours."}],skillCheck:{description:"Preserve Dignity",choices:[{label:"B",text:"Let me pass.",result:"fail"},{label:"A",text:"You've got mouths to feed. So do I. We end this clean.",result:"fail"},{label:"C",text:"Stand your men down. The cache stays; civilians walk. You leave with your name — not a headline.",result:"pass"}]}},{image:"shade_empathy_battle.png",dialogue:[{speaker:"Outlaw (Captured)",position:"right",text:"Lieutenant, this place... it's not what we thought. They're not hoarding wealth, they're preserving memories."},{speaker:"Outlaw Lieutenant",position:"right",text:"Since when do you care about memories?"},{speaker:"Outlaw (Captured)",position:"right",text:"Since someone showed me what it means to be remembered."},{speaker:"Shade",position:"left",text:"Every name matters. Every story counts. Even yours."},{speaker:"Narrator",position:"narrator",text:"The shrine's light seems to pulse in time with the collective heartbeat of those present."}],skillCheck:{description:"De-escalation",choices:[{label:"A",text:"What's your name, Lieutenant? Let me remember you as someone who chose peace.",result:"pass"},{label:"B",text:"You're outnumbered. Surrender now.",result:"fail"},{label:"C",text:"Time's up. Make your choice.",result:"fail"}]}}],postBattle:{threePasses:"The lieutenant grunts respect. 'You fight fair, ghost.' A quiet truce corridor is hinted."}},Ce={id:"justice_runs_cold",name:"Justice Runs Cold",character:"Shade",factionMet:"Accord",factionFought:"Syndicate",lessonTitle:"Justice",flavorText:"Justice doesn’t outsource to convenience — keep civilians safe, take the target clean.",scenes:[{image:"shade_empathy_intro.png",dialogue:[{speaker:"Narrator",position:"narrator",text:"Midnight over Ashenport’s rustbelt. Refineries huff steam; sodium lamps smear the rain into amber veins."},{speaker:"Shade",position:"left",text:"Convoy in sight. Civilian buses… that’s not a screen, it’s bait."},{speaker:"Accord Trooper",position:"right",text:"Brief said one Syndicate lieutenant, three gun trucks. Civilians weren’t part of the math."},{speaker:"Shade",position:"left",text:"They are now. Justice doesn’t outsource to convenience."},{speaker:"Accord Trooper",position:"right",text:"Then we do this your way—clean. Mark targets; I’ll stack shooters on your call."},{speaker:"Narrator",position:"narrator",text:"Down the ridge, black-window buses tuck close to armored escorts, cables snaking from bomb vests to blinking nodes under seats."}],skillCheck:{description:"Recon Under Pressure",choices:[{label:"A",text:"Scouts spot you; forced withdrawal. Lose precise civilian positioning.",result:"fail"},{label:"B",text:"Full layout tagged — detonators under bus floors, lieutenant in third vehicle.",result:"pass"},{label:"C",text:"Convoy accelerates; explosive locations guessed later.",result:"fail"}]}},{image:"shade_empathy_conflict.png",dialogue:[{speaker:"Narrator",position:"narrator",text:"A Syndicate open-channel crackles to life, voice filtered and smug."},{speaker:"Syndicate Lieutenant",position:"narrator",text:"You play at justice, but all I see are cowards hiding behind bombs."},{speaker:"Shade",position:"left",text:"Your games end here."},{speaker:"Accord Trooper",position:"right",text:"Lieutenant’s vehicle peeling off left. Underpass guard rails reinforced—kill zone geometry."},{speaker:"Narrator",position:"narrator",text:"Rain pushes sideways. The escort splits; buses crawl toward the tunnel, hazard lights pulsing like a slow heartbeat."}],skillCheck:{description:"Civilians or Target?",choices:[{label:"A",text:"Escort neutralized; civilians safe; both objectives possible.",result:"pass"},{label:"B",text:"Buses reach kill zone; rescue harder.",result:"fail"},{label:"C",text:"Lieutenant escapes; Syndicate intel lost.",result:"fail"}]}},{image:"shade_empathy_conflict.png",dialogue:[{speaker:"Narrator",position:"narrator",text:"Sirens stutter awake; convoy bunches. Drone-jammers hum overhead."},{speaker:"Accord Trooper",position:"right",text:"Guards wiring human shields to their own vests. Motion triggers; any panic is a spark."},{speaker:"Shade",position:"left",text:"Then we become stillness. I’ll kill the signal; you sell the lie."},{speaker:"Syndicate Lieutenant",position:"narrator",text:"Tick, tock. Justice is heavy — let us help you drop it."},{speaker:"Accord Trooper",position:"right",text:"We can spoof a fuel fire east side, draw their eyes. On your count."}]},{image:"shade_empathy_battle.png",dialogue:[{speaker:"Narrator",position:"narrator",text:"Shade crouches under bus one; condensation drips onto the detonator housings. Guards scan, fingers tight on triggers."}],skillCheck:{description:"Disarming the Trap",choices:[{label:"A",text:"Gunfire erupts; guards fire on civilians.",result:"fail"},{label:"B",text:"Timing slips; one detonator arms — panic spreads.",result:"fail"},{label:"C",text:"Detonators disabled; guards retreat; civilians freed silently.",result:"pass"}]}},{image:"shade_empathy_battle.png",dialogue:[{speaker:"Narrator",position:"narrator",text:"The tunnel blooms white as the fake fire crackles; Shade rises from undercarriage to muzzle flash."},{speaker:"Shade",position:"left",text:"Stand down. Last warning."},{speaker:"Syndicate Lieutenant",position:"narrator",text:"Your principles will be your hesitation… and your downfall."},{speaker:"Accord Trooper",position:"right",text:"Who said she has to?"},{speaker:"Narrator",position:"narrator",text:"Lieutenant bolts; a tire shreds; SUV fishtails into a barrier. Boots scramble, then stillness."}]}],postBattle:{threePasses:"The civilians shuffle into rescue vans under the flicker of emergency lights, their faces pale but alive. The lieutenant lies bound, and the intel is secured — a clean win that leaves the city breathing easier tonight.",oneOrTwoPasses:"An explosion scars the tunnel wall, and the smell of smoke clings to the survivors as they are led to safety. The lieutenant is captured, and fragments of intel are recovered — enough to keep the city’s fragile peace from shattering.",zeroPasses:"Smoke thickens in the underpass, mingling with the wail of sirens and the cold shuffle of survivors. The lieutenant has vanished into the night, and the Syndicate holds the story. The city mourns — but the hunt for justice has only begun."}};function je(e){const a=[],i=(s,n)=>{const r=s.toLowerCase(),c=(n.factionFought||"").toLowerCase(),g={syndicate:["syndicate","syndicate lieutenant","syndicate trooper","syndicate captain"],accord:["accord","accord trooper","accord officer","mech-sergeant"],voidborn:["voidborn","voidborn acolyte","thrall"],outlaws:["outlaw","outlaws","outlaw lieutenant","outlaw lead","outlaw scrapper"]}[c]||[c].filter(Boolean),m=["enemy faction","captured"];return g.some(f=>f&&r.includes(f))||m.some(f=>r.includes(f))};for(const s of e.scenes){const n=(s.image||"").replace(/\.[^.]+$/,"");for(const r of s.dialogue){let c;r.position==="narrator"?c="center":r.position==="left"?c="left":r.position==="right"?i(r.speaker,e)?c="center":c="right":c="left",a.push({scene:n,speaker:r.speaker,side:c,text:r.text,...r.greyedOut?{greyedOut:r.greyedOut}:{}})}if(s.skillCheck){const r=e.id==="nova_run_toward_the_fire";a.push({type:"choice",scene:n,title:r?"":s.skillCheck.description,options:s.skillCheck.choices.map(c=>({label:c.label,star:c.result==="pass",followup:{text:c.text}}))})}}return a}const Ls=[{scene:"scrapyard",speaker:"Narrator",side:"center",text:"The salvage yard reeks of ozone. Rival crews prowl between piles of broken ships."},{scene:"scrapyard",speaker:"Right",side:"right",text:"Nova, you don't last long here by thinking it over. You see a score, you take it."},{scene:"scrapyard",speaker:"Left",side:"left",text:"You mean rushing in blind?"},{type:"choice",scene:"scrapyard",title:"Boldness",options:[{label:"Take the shot",star:!0},{label:"Wait for sure",star:!1},{label:"Probe first",star:!1}]},{scene:"scrapyard",speaker:"Right",side:"right",text:"Perfect timing is a bedtime story. Hesitation gets you left with scraps."},{type:"choice",scene:"scrapyard",title:"Risk Assessment",options:[{label:"Risk for winning",star:!0},{label:"Keep risks low",star:!1},{label:"Balance risk",star:!1}]},{scene:"scrapyard",speaker:"Right",side:"right",text:"Costs don't matter if you're the one holding the prize."},{type:"choice",scene:"scrapyard",title:"Action Choice",options:[{label:"Strike first",star:!0},{label:"Plan first",star:!1},{label:"Set trap",star:!1}]},{scene:"scrapyard",speaker:"Right",side:"right",text:"Looks like you've got some Scrapper spark after all."},{scene:"scrapyard",speaker:"Narrator",side:"center",text:"With dust on her boots, Nova steps toward the fight, ready to hit hard and fast."}],_a={id:"scrap-hesitation",name:"Scrap the Hesitation",script:Ls,isBoss:!1,victoryText:"The rival crews scatter, leaving Nova with the choice salvage. Sometimes the best strategy is to act decisively rather than wait for perfect conditions."},Ds={id:"nova_boldness_under_fire",name:"Boldness Under Fire (Extended)",script:je(xt),isBoss:!1,victoryText:xt.postBattle.threePasses},Ps={id:"nova_run_toward_the_fire",name:"Run at Danger (Extended)",script:je(vt),isBoss:!1,victoryText:vt.postBattle.threePasses},Ns={id:"volt_adapting_to_chaos",name:"Adapting to Chaos (Extended)",script:je(wt),isBoss:!1,victoryText:wt.postBattle.threePasses},Os=[{scene:"ember_self_control_intro",speaker:"Narrator",side:"center",text:"The depot is alive with tension. Massive cylindrical tanks sit in neat rows, each with hazard markings glowing under pulsing red warning lights. Cargo drones zip between the tanks like nervous insects."},{scene:"ember_self_control_intro",speaker:"Syndicate Exec",side:"right",text:"Accord patrols have been sniffing around for three nights. They're building toward a move. I want them spooked before they try anything."},{scene:"ember_self_control_intro",speaker:"Ember",side:"left",text:"Spooked without scratching the tanks? That's a tall order."},{scene:"ember_self_control_intro",speaker:"Syndicate Exec",side:"right",text:"Control, Ember. Make them think they're in danger, but not from us. That's good business."},{scene:"ember_self_control_intro",speaker:"Narrator",side:"center",text:"The Exec leads Ember through a narrow walkway between tanks. Steam hisses from a valve overhead, wrapping the catwalk in ghostly white vapor."},{scene:"ember_self_control_intro",speaker:"Ember",side:"left",text:"Feels like this whole place is holding its breath."},{scene:"ember_self_control_intro",speaker:"Syndicate Exec",side:"right",text:"It is. And you're the one walking around with matches."},{scene:"ember_self_control_intro",speaker:"Narrator",side:"center",text:"Near the control shack, a Syndicate tech leans against a console, visor tilted back, smirk in place. His fingers drum against a thermal scanner."},{scene:"ember_self_control_intro",speaker:"Syndicate Exec",side:"right",text:"This one's always got bright ideas."},{scene:"ember_self_control_intro",speaker:"Syndicate Tech",side:"right",text:"I say light a flash demo. One second of ignition and their sensors go nuts. Accord pulls back, job done."},{scene:"ember_self_control_intro",speaker:"Ember",side:"left",text:"Or we make the news for turning a depot into a crater."},{scene:"ember_self_control_intro",speaker:"Syndicate Tech",side:"right",text:"Come on, Ember. Just a wink of flame—enough to make their hair stand on end."},{scene:"ember_self_control_intro",speaker:"Ember",side:"left",text:"And if that wink turns into a wildfire?"},{scene:"ember_self_control_intro",speaker:"Syndicate Tech",side:"right",text:"Then we know you've still got it."},{type:"choice",scene:"ember_self_control_intro",title:"Fire Safety",options:[{label:"Fake readings",star:!0,followup:{speaker:"Ember",side:"left",text:"Negative. We fake readings, not flames."}},{label:"Tiny spark",star:!1,followup:{speaker:"Ember",side:"left",text:"Just a tiny spark. No harm."}},{label:"Torch yard",star:!1,followup:{speaker:"Ember",side:"left",text:"Let's torch the whole yard."}}]},{scene:"ember_self_control_conflict",speaker:"Narrator",side:"center",text:"A deep, distant whump vibrates through the metal underfoot. The Exec's gaze snaps to the west perimeter."},{scene:"ember_self_control_conflict",speaker:"Syndicate Exec",side:"right",text:"Movement. They're early."},{scene:"ember_self_control_conflict",speaker:"Narrator",side:"center",text:"Sirens erupt. Accord mechs stride into view, alloy plating catching the depot's red glow."},{scene:"ember_self_control_conflict",speaker:"Accord Mech-Sergeant",side:"center",text:"Hands off the depot, Syndicate scum! Step away or be crushed."},{scene:"ember_self_control_conflict",speaker:"Ember",side:"left",text:"Bold entrance. Didn't expect the Accord to show up this far from home turf."},{scene:"ember_self_control_conflict",speaker:"Accord Mech-Sergeant",side:"center",text:"We go where the threat is. And right now, that's you."},{scene:"ember_self_control_conflict",speaker:"Narrator",side:"center",text:"A targeting reticle dances across Ember's chestplate. The ground hums under armored feet settling into firing stance."},{scene:"ember_self_control_conflict",speaker:"Syndicate Exec",side:"right",text:"They fire here, we all burn. Keep your head, Ember."},{scene:"ember_self_control_conflict",speaker:"Ember",side:"left",text:"You really want to test your armor against a depot full of fuel?"},{scene:"ember_self_control_conflict",speaker:"Accord Mech-Sergeant",side:"center",text:"We'll risk it if it stops you."},{scene:"ember_self_control_conflict",speaker:"Syndicate Exec",side:"right",text:"Then you're dumber than I thought."},{scene:"ember_self_control_conflict",speaker:"Accord Mech-Sergeant",side:"center",text:"Last chance. Step away from the tanks."},{type:"choice",scene:"ember_self_control_conflict",title:"Conflict Resolution",options:[{label:"Take it outside",star:!0,followup:{speaker:"Ember",side:"left",text:"You fire here, you vaporize your own district. Let's take this outside the city grid."}},{label:"Leave",star:!1,followup:{speaker:"Ember",side:"left",text:"Alright, alright, we're leaving."}},{label:"Make me",star:!1,followup:{speaker:"Ember",side:"left",text:"Make me."}}]},{scene:"ember_self_control_battle",speaker:"Narrator",side:"center",text:"Above, drones dart into formation. Shadows jitter across the depot. A loose panel clatters in the wind."},{scene:"ember_self_control_battle",speaker:"Syndicate Exec",side:"right",text:"Tank field seven's behind you. One stray shot and we're scrap."},{scene:"ember_self_control_battle",speaker:"Accord Trooper",side:"center",text:"Pyro fraud! All flash, no control. I've seen rookies with steadier hands."},{scene:"ember_self_control_battle",speaker:"Ember",side:"left",text:"That's a brave insult from someone in my blast radius."},{scene:"ember_self_control_battle",speaker:"Accord Trooper",side:"center",text:"Prove me wrong."},{scene:"ember_self_control_battle",speaker:"Narrator",side:"center",text:"Ember's gloves hum with stored heat, the depot's red lights pulsing in time with her heartbeat."},{type:"choice",scene:"ember_self_control_battle",title:"Emotional Control",options:[{label:"Whatever",star:!1,followup:{speaker:"Ember",side:"left",text:"Whatever."}},{label:"Say it again",star:!1,followup:{speaker:"Ember",side:"left",text:"Say that again."}},{label:"Stabilize",star:!0,followup:{speaker:"Ember",side:"left",text:"I'm here to stabilize, not light it up."}}]}],Rs={id:"ember-self_control",name:"Mastering the Flame",script:Os,isBoss:!1,victoryText:"Accord command reopens a secure channel—respect replaces hostility. 'Next time, maybe we talk before we shoot.'"},Fs={id:"shade_shadows_of_empathy",name:"Shadows of Empathy (Extended)",script:je(kt),isBoss:!1,victoryText:kt.postBattle.threePasses},Hs={id:"justice_runs_cold",name:"Justice Runs Cold (Extended)",script:je(Ce),isBoss:!1,victoryText:Ce.postBattle.threePasses},_t=[_a,Rs,Ds,Ps,Ns,Fs,Hs];function Vs(e,a,i,s){e.innerHTML="";const n=document.createElement("div");n.className="missions-screen",e.appendChild(n);function r(g){const m=(g.id||"").toLowerCase(),f=(g.name||"").toLowerCase();if(m.includes("nova")||f.includes("nova")||m==="scrap-hesitation")return{url:Ae,label:"Nova"};if(m.includes("volt")||f.includes("volt"))return{url:Ie,label:"Volt"};if(m.includes("ember")||f.includes("ember"))return{url:Pe,label:"Ember"};if(m.includes("shade")||f.includes("shade")||m==="justice_runs_cold")return{url:Be,label:"Shade"}}function c(){const g=a();n.innerHTML=`
      <style>
        .mission-name { 
          white-space: normal !important; 
          overflow: visible !important; 
          text-overflow: unset !important; 
          word-wrap: break-word;
          line-height: 1.2;
        }
        .mission-card { 
          min-height: auto !important;
          align-items: flex-start !important;
          padding: 16px !important;
        }
        .mission-left { 
          min-width: 0 !important; 
          max-width: none !important;
          flex: 1;
        }
        .mission-meta {
          font-size: 12px;
          opacity: 0.8;
          margin-top: 2px;
        }
      </style>
      <div class="mx-auto h-[100dvh] max-w-[420px] bg-slate-950 text-slate-100 grid grid-rows-[auto_1fr_auto]" style="overflow-x:hidden;">
        <header class="h-10 flex items-center justify-between px-3 border-b border-white/10">
          <button id="backBtn" class="ghost">Back</button>
          <div class="text-sm font-semibold">Select Mission</div>
          <div style="width:48px"></div>
        </header>
        <main class="overflow-y-auto">
          <div class="px-3 pt-3 pb-20">
            <div class="card-grid" style="grid-template-columns: 1fr;">
              ${_t.map(m=>{var u,x;const f=((x=(u=g.completed)==null?void 0:u[m.id])==null?void 0:x.bestStars)??0,k="★".repeat(f)+"☆".repeat(3-f),l=r(m);return`
                  <div class="char-card mission-card" data-mission="${m.id}">
                    ${l?`
                    <div class="char-icon">
                      <img src="${l.url}" alt="${l.label}" />
                    </div>
                    `:""}
                    <div class="char-left mission-left">
                      <div class="char-name mission-name">${m.name}</div>
                      ${l?`<div class="mission-meta">${l.label}</div>`:""}
                      <div class="loadout-sub">${k}</div>
                    </div>
                    <div class="card-cta" style="display:flex;justify-content:flex-end;align-items:center">
                      <button class="pick-btn" data-start="${m.id}">Start</button>
                    </div>
                  </div>
                `}).join("")}
            </div>
          </div>
        </main>
      </div>
    `}function v(g){const m=g.target;if(!m)return;if(m.id==="backBtn"){i();return}const f=m.closest("[data-start]");if(f){const k=f.getAttribute("data-start"),l=_t.find(u=>u.id===k);l&&s(l);return}}return n.addEventListener("click",v,{passive:!0}),c(),()=>{n.removeEventListener("click",v);try{e.removeChild(n)}catch{}}}function Ws(e,a,i){e.innerHTML="";const s=document.createElement("div");s.className="welcome-screen",e.appendChild(s),s.innerHTML=`
    <div class="min-h-[100dvh] w-full grid place-items-center bg-slate-950 text-slate-100">
      <div class="flex flex-col items-center gap-6 p-6">
        <div class="text-5xl font-extrabold tracking-widest">Prime</div>
        <div class="opacity-70">Tactical Prime and Detonate</div>
        <div class="flex flex-col sm:flex-row gap-3 mt-4">
          <button id="welcome-missions" class="big">Mission Select</button>
          <button id="welcome-battle" class="big ghost">Battle</button>
        </div>
      </div>
    </div>
  `;function n(r){const c=r.target;c&&(c.id==="welcome-missions"&&a(),c.id==="welcome-battle"&&i())}return s.addEventListener("click",n,{passive:!0}),()=>{s.removeEventListener("click",n);try{e.removeChild(s)}catch{}}}function zs(e){return e.enemies.flatMap(a=>Array.from({length:a.count},()=>ga(a.key)))}function js(e,a){const i=Xe.filter(r=>r.faction===e);if(i.length===0)return{enemies:[]};const n=Array.from({length:Math.max(0,a)},()=>i[Math.floor(Math.random()*i.length)].key).reduce((r,c)=>(r[c]=(r[c]??0)+1,r),{});return{enemies:Object.entries(n).map(([r,c])=>({key:r,count:c}))}}const Re={Grunt:1,Elite:2,Miniboss:4,Boss:8};function Gs(e,a=10){var m;const i=Array.from(new Set(Xe.map(f=>f.faction))),s=i[Math.floor(Math.random()*i.length)],n=Xe.filter(f=>f.faction===s);if(n.length===0)return{enemies:[]};let r=Math.max(0,Math.floor(e)),c=0;const v={},g={Grunt:n.filter(f=>(f.tags||[]).includes("Grunt")).map(f=>f.key),Elite:n.filter(f=>(f.tags||[]).includes("Elite")).map(f=>f.key),Miniboss:n.filter(f=>(f.tags||[]).includes("Miniboss")).map(f=>f.key),Boss:n.filter(f=>(f.tags||[]).includes("Boss")).map(f=>f.key)};for(;r>0&&c<a;){const f=Object.keys(Re).filter(C=>{var w;return Re[C]<=r&&(((w=g[C])==null?void 0:w.length)||0)>0}).sort((C,w)=>Re[C]-Re[w]);if(f.length===0)break;const k=f.map(C=>Je[C]),l=k.reduce((C,w)=>C+w.spawnWeight,0);let u=Math.random()*l,x=f[0];for(const C of k)if(u-=C.spawnWeight,u<=0){x=C.tier;break}const F=g[x],P=F[Math.floor(Math.random()*F.length)];v[P]=(v[P]??0)+1,c+=1,r-=Re[x]}if(c===0){const f=(m=n[0])==null?void 0:m.key;f&&(v[f]=1)}return{enemies:Object.entries(v).map(([f,k])=>({key:f,count:k}))}}function qs(e,a,i,s){let n=null;const r=l=>{i(u=>{var H,b,N,A;const x=u.loadout.partySelection.map((o,y)=>{var K;const _=u.loadout.roster.find(j=>j.id===o);if(!_)return{actorId:`party-${y}`,defId:o,name:`Character ${y+1}`,classId:"vanguard",bars:{sh:100,hp:100,sp:100},primes:[],abilityIds:[],superEnergy:25};const q=u.loadout.selectedByChar[o]||[],L=((K=u.loadout.selectedWeaponByChar)==null?void 0:K[o])??"none",Y=(u.loadout.allWeapons||ze).find(j=>j.id===L);return{actorId:`party-${y}`,defId:o,name:_.name,classId:_.classId,bars:{sh:_.baseBars.sh+((Y==null?void 0:Y.maxShBonus)??0),hp:_.baseBars.hp+((Y==null?void 0:Y.maxHpBonus)??0),sp:_.baseBars.sp},primes:[],abilityIds:q,superEnergy:25,weaponId:L}});if(!x||x.length===0)return{screen:"loadout"};Xa();let F;if(l!=null&&l.key){const o=Math.max(1,Math.floor(l.count??1));F={enemies:[{key:l.key,count:o}]}}else l!=null&&l.faction?F=js(l.faction,3):F=Gs(8,10);const P=zs(F),C=P.map((o,y)=>{const _=`e${y+1}`;return ha(_,o),{id:_,name:o.name,bars:{sh:o.stats.shields,hp:o.stats.hp,sp:0},maxBars:{sh:o.stats.maxShields,hp:o.stats.maxHp,sp:100},primes:[],enemyKey:o.key}}),w=(b=(H=u.mission)==null?void 0:H.current)==null?void 0:b.missionBuff;let B=["Battle begins!"];if(w&&w.playerDamageMult&&w.playerDamageMult!==1){const o=Math.round((w.playerDamageMult-1)*100);B.push(`Dialogue skipped - Fight begins with disadvantage: ${o}% damage penalty`)}return l!=null&&l.faction||P.length>0&&P[0].faction,{screen:"battle",loadout:{...u.loadout},battle:{party:x,enemies:C,targetIndex:Math.min(1,Math.max(0,C.length-1)),turn:"player",activePartyIndex:0,selectedAbilityId:((N=x[0])==null?void 0:N.abilityIds[0])||void 0,log:B,isOver:!1,cooldownsByMember:{},basicStreakByMember:{},superEnergyGainedThisTurn:{},missionBuff:w,currentMission:(A=u.mission)!=null&&A.current?{id:u.mission.current.id,name:u.mission.current.name,victoryText:u.mission.current.victoryText}:void 0}}})},c=()=>{i(()=>({screen:"party"}))},v=()=>{var x,F;const u=(x=a().mission)==null?void 0:x.current;if(u&&Array.isArray(u.script)&&u.script.length>0){let P="Left",C="NPC",w,B,H,b;if(u.id==="scrap-hesitation"?(P="Nova",C="Scrapper",w=Ae,B=Ve,H="Outlaws",b="Outlaws"):u.id==="nova-boldness"?(P="Nova",C="Outlaw",w=Ae,B=Ve,H="Outlaws",b="Syndicate"):u.id==="volt-adaptability"?(P="Volt",C="Accord Officer",w=Ie,B=He,H="Accord",b="Voidborn"):u.id==="ember-self_control"?(P="Ember",C="Syndicate Exec",w=Pe,B=ct,H="Syndicate",b="Accord"):u.id==="shade-empathy"?(P="Shade",C="Voidborn Thrall",w=Be,B=Ke,H="Outlaws",b="Voidborn"):u.id==="nova_boldness_under_fire"?(P="Nova",C="Outlaw Lead",w=Ae,B=Ve,H="Outlaws",b="Syndicate"):u.id==="nova_run_toward_the_fire"?(P="Nova",C="Accord Rescuer",w=Ae,B=He,H="Accord",b="Syndicate"):u.id==="volt_adapting_to_chaos"?(P="Volt",C="Accord Officer",w=Ie,B=He,H="Accord",b="Voidborn"):u.id==="shade_shadows_of_empathy"?(P="Shade",C="Voidborn Thrall",w=Be,B=Ke,H="Outlaws",b="Voidborn"):u.id==="justice_runs_cold"&&(P="Shade",C="Accord Trooper",w=lt,B=ot,H="Accord",b="Syndicate"),P==="Left"){const A=a();A.loadout.partySelection.length>0&&(P=((F=A.loadout.roster.find(o=>o.id===A.loadout.partySelection[0]))==null?void 0:F.name)||"Left")}C==="NPC"&&(C=b?{Outlaws:"Outlaw",Voidborn:"Voidborn Thrall",Syndicate:"Syndicate Operative",Accord:"Accord Officer"}[b]:"Opponent");const N=u.id==="scrap-hesitation"?"Boldness":void 0;i({screen:"dialogue",dialogue:{script:u.script.slice(),index:0,stars:0,isBossNext:!!u.isBoss,rewardWeaponId:u.rewardWeaponId,leftName:P,rightName:C,leftImgUrl:w,rightImgUrl:B,...N?{defaultSceneBg:N}:{},...H?{allyFaction:H}:{},...b?{enemyFaction:b}:{}}})}else r()},g=l=>{i(u=>{if(typeof l=="function"){const x=l(u);return x&&typeof x=="object"?x.screen==="battle"?(r(),{}):x:{}}return l&&typeof l=="object"&&l.screen==="battle"?(r(),{}):{loadout:{...u.loadout,...l}}})},m=l=>{i(u=>({battle:{...u.battle,...l}}))},f=()=>{const l=a();n&&(n(),n=null),l.screen==="welcome"?n=Ws(e,()=>i(u=>({screen:"missions",lastScreenBeforeMissions:u.screen})),()=>i(()=>({screen:"party"}))):l.screen==="party"?n=Es(e,l.loadout,g,()=>i(()=>({screen:"loadout"})),()=>i(()=>({screen:"welcome"}))):l.screen==="loadout"?l.loadout.partySelection.length>0?Oa(()=>import("./react-loadout-CdRovSNO.js"),[]).then(u=>{a().screen==="loadout"&&(n=u.mountReactLoadout(e,l.loadout,g,c,v))}):n=Ja(e,l.loadout,g,c,v):l.screen==="dialogue"?n=Ra(e,()=>a().dialogue,x=>i(F=>({dialogue:{...F.dialogue,...x}})),x=>{var N,A,o,y,_,q;const F=x.stars||0,P=a(),C=(A=(N=P.mission)==null?void 0:N.current)==null?void 0:A.id,w=(()=>{var K,j;const L=(C||"").toLowerCase(),Y=(((j=(K=P.mission)==null?void 0:K.current)==null?void 0:j.name)||"").toLowerCase();if(L.includes("nova")||Y.includes("nova")||L==="scrap-hesitation")return"nova";if(L.includes("volt")||Y.includes("volt"))return"volt";if(L.includes("ember")||Y.includes("ember"))return"ember";if(L.includes("shade")||Y.includes("shade")||L==="justice_runs_cold")return"shade"})(),B=!!((o=P.dialogue)!=null&&o.isBossNext),H=(y=P.dialogue)==null?void 0:y.rewardWeaponId;let b;if(x.skipDialogue?b={playerDamageMult:.75,detonationSplashMult:1}:b=F>=3?{playerDamageMult:1.1,detonationSplashMult:1.2}:void 0,x.route==="party")i(L=>{const Y=w,K=L.loadout.partySelection.includes(Y||""),j=Y&&!K?[Y,...L.loadout.partySelection].slice(0,L.loadout.maxParty):L.loadout.partySelection;return{screen:"party",loadout:{...L.loadout,lockedCharacterId:Y,partySelection:j}}});else if(x.route==="loadout")i(()=>({screen:"loadout"}));else if(x.route==="battle")if(!((((q=(_=P.loadout)==null?void 0:_.partySelection)==null?void 0:q.length)||0)>0))i(()=>({screen:"loadout"}));else if(C==="scrap-hesitation")r({faction:"Voidborn"});else{try{if(C==="justice_runs_cold"){const Y=F>=3?Ce.postBattle.threePasses:F>=1?Ce.postBattle.oneOrTwoPasses:Ce.postBattle.zeroPasses;i(K=>{var j,O;return{mission:{...K.mission||{completed:{}},current:(j=K.mission)!=null&&j.current?{...K.mission.current,victoryText:Y}:(O=K.mission)==null?void 0:O.current}}})}}catch{}r()}i(L=>{var O,de,se,he,t,p;let Y=((O=L.mission)==null?void 0:O.current)||null;try{if(C==="justice_runs_cold"){const J=F>=3?Ce.postBattle.threePasses:F>=1?Ce.postBattle.oneOrTwoPasses:Ce.postBattle.zeroPasses;Y=Y&&{...Y,victoryText:J}}}catch{}const K=x.route==="party"||x.route==="loadout",j=K&&Y?{...Y,script:[],missionBuff:x.skipDialogue?b:void 0}:K?Y:null;return{mission:{...L.mission||{completed:{}},completed:{...((de=L.mission)==null?void 0:de.completed)||{},...(se=L.mission)!=null&&se.current?{[L.mission.current.id]:{bestStars:Math.max(F,((p=(t=(he=L.mission)==null?void 0:he.completed)==null?void 0:t[L.mission.current.id])==null?void 0:p.bestStars)||0)}}:{}},current:j},...B&&F>=3&&H?{loadout:{...L.loadout,allWeapons:[...L.loadout.allWeapons||[],{id:H,name:H}]}}:{},dialogue:void 0}}),x.route==="battle"&&i(L=>{const Y=[],K=b;if(K&&typeof K.playerDamageMult=="number"&&K.playerDamageMult!==1){const O=Math.round((K.playerDamageMult-1)*100);x.skipDialogue?Y.push(`${O}% damage penalty`):Y.push(`+${O}% damage`)}if(K&&typeof K.detonationSplashMult=="number"&&K.detonationSplashMult!==1){const O=Math.round((K.detonationSplashMult-1)*100);Y.push(`+${O}% detonation splash`)}let j;return x.skipDialogue?j=`Dialogue skipped - Fight begins with disadvantage: ${Y.join(", ")}`:K?j=`Next-fight bonus active: ${Y.join(", ")}`:j="Next-fight bonus not earned.",{battle:{...L.battle,missionBuff:K,log:[...L.battle.log,j]}}})}):l.screen==="battle"?n=Is(e,()=>a().battle,m,x=>s(F=>x(F.battle)),()=>i(()=>({screen:"loadout"})),()=>i(()=>({screen:"missions"}))):l.screen==="missions"&&(n=Vs(e,()=>a().mission,()=>i(u=>({screen:u.lastScreenBeforeMissions||"party",lastScreenBeforeMissions:void 0})),u=>{i(x=>({mission:{...x.mission||{completed:{}},current:u}})),v()}))},k=s(f);return f(),()=>{n&&n(),k()}}const Sa=[{id:"nova",name:"Nova",classId:"vanguard",baseBars:{sh:35,hp:130,sp:0},abilitySlots:5},{id:"volt",name:"Volt",classId:"technomancer",baseBars:{sh:45,hp:105,sp:0},abilitySlots:5},{id:"ember",name:"Ember",classId:"pyromancer",baseBars:{sh:30,hp:115,sp:0},abilitySlots:5},{id:"shade",name:"Shade",classId:"voidrunner",baseBars:{sh:25,hp:110,sp:0},abilitySlots:5}],be=Ia(Sa,Qe),Us=new URLSearchParams(window.location.search),Ys=Us.get("screen")||"welcome",Aa={screen:Ys,loadout:{roster:Sa,partySelection:(be==null?void 0:be.partySelection)??[],maxParty:3,allAbilities:Qe,selectedByChar:(be==null?void 0:be.selectedByChar)??{},loadoutActiveIndex:(be==null?void 0:be.loadoutActiveIndex)??0,allWeapons:(be==null?void 0:be.allWeapons)??ze,selectedWeaponByChar:(be==null?void 0:be.selectedWeaponByChar)??{}},battle:{party:[],enemies:[],targetIndex:0,turn:"player",activePartyIndex:0,selectedAbilityId:void 0,log:["Ready to battle."],isOver:!1,currentMission:void 0,partyMembersActedThisRound:0}},Ks=La();Aa.mission=Ks??{completed:{},current:_a};const Ye=Ma(Aa),Js=document.getElementById("app");qs(Js,Ye.getState,Ye.setState,Ye.subscribe);Ye.subscribe(e=>{try{Ea(e.loadout)}catch{}try{e.mission&&Da(e.mission)}catch{}});export{ze as A,Pe as P,Ie as T,Be as V,Ae as a};
