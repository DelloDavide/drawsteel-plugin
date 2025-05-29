import sdk from '@owlbear-rodeo/sdk'

const { register } = sdk

register("drawsteel-extension").then((context) => {
  const panel = document.createElement("div")
  panel.style.padding = "1rem"
  panel.innerHTML = `
    <h2>Draw Steel Abilities</h2>
    <label>User ID:</label><br>
    <input id="userId" type="text" /><br>
    <label>Ability Name:</label><br>
    <input id="abilityName" type="text" /><br><br>
    <button id="fetchBtn">Fetch Ability</button>
    <pre id="output">---</pre>
  `
  document.body.appendChild(panel)

  document.getElementById("fetchBtn").onclick = async () => {
    const userId = document.getElementById("userId").value.trim()
    const name = document.getElementById("abilityName").value.trim()
    const url = `https://cf5a18ec-3686-4dfb-a4a2-199dd8d060b7-00-zoytalpggzg7.janeway.repl.co/api/ability?user_id=${userId}&name=${encodeURIComponent(name)}`
    
    try {
      const res = await fetch(url)
      const data = await res.json()
      document.getElementById("output").textContent = JSON.stringify(data, null, 2)
    } catch (e) {
      document.getElementById("output").textContent = "Errore nella richiesta"
    }
  }
})
