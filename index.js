import { register as d } from "@owlbear-rodeo/sdk";
d("drawsteel-extension").then(async (o) => {
  const t = document.createElement("div");
  t.style.padding = "1rem", t.innerHTML = `
    <h2>Draw Steel Abilities</h2>
    <label>User ID:</label><br>
    <input id="userId" type="text" /><br>
    <label>Ability Name:</label><br>
    <input id="abilityName" type="text" /><br><br>
    <button id="fetchBtn">Fetch Ability</button>
    <pre id="output">---</pre>
  `, document.body.appendChild(t), document.getElementById("fetchBtn").onclick = async () => {
    const e = document.getElementById("userId").value.trim(), n = document.getElementById("abilityName").value.trim(), a = `https://cf5a18ec-3686-4dfb-a4a2-199dd8d060b7-00-zoytalpggzg7.janeway.repl.co/api/ability?user_id=${e}&name=${encodeURIComponent(n)}`;
    try {
      const l = await (await fetch(a)).json();
      document.getElementById("output").textContent = JSON.stringify(l, null, 2);
    } catch {
      document.getElementById("output").textContent = "Errore nella richiesta";
    }
  };
});
