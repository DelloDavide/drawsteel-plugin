import{register as l}from"@owlbear-rodeo/sdk";(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))o(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const n of t.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&o(n)}).observe(document,{childList:!0,subtree:!0});function i(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function o(e){if(e.ep)return;e.ep=!0;const t=i(e);fetch(e.href,t)}})();l("drawsteel-extension").then(async c=>{const r=document.createElement("div");r.style.padding="1rem",r.innerHTML=`
    <h2>Draw Steel Abilities</h2>
    <label>User ID:</label><br>
    <input id="userId" type="text" /><br>
    <label>Ability Name:</label><br>
    <input id="abilityName" type="text" /><br><br>
    <button id="fetchBtn">Fetch Ability</button>
    <pre id="output">---</pre>
  `,document.body.appendChild(r),document.getElementById("fetchBtn").onclick=async()=>{const i=document.getElementById("userId").value.trim(),o=document.getElementById("abilityName").value.trim(),e=`https://cf5a18ec-3686-4dfb-a4a2-199dd8d060b7-00-zoytalpggzg7.janeway.repl.co/api/ability?user_id=${i}&name=${encodeURIComponent(o)}`;try{const n=await(await fetch(e)).json();document.getElementById("output").textContent=JSON.stringify(n,null,2)}catch{document.getElementById("output").textContent="Errore nella richiesta"}}});
