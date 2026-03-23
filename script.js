const apiKey = "7f870a385dab27d5784b8d97dac288ac"

// Enter para buscar
document.getElementById("cidade").addEventListener("keydown", function(e){
  if(e.key === "Enter") buscarClima()
})

async function buscarClima(){
  let cidade = document.getElementById("cidade").value.trim()
  if(!cidade) return

  mostrarLoading(true)
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&units=metric&appid=${apiKey}&lang=pt_br`

  try {
    let resposta = await fetch(url)
    let dados = await resposta.json()
    if(dados.cod !== 200) throw new Error("Cidade não encontrada")
    mostrarClima(dados)
  } catch(e) {
    mostrarErro()
  } finally {
    mostrarLoading(false)
  }
}

function usarLocalizacao(){
  mostrarLoading(true)
  navigator.geolocation.getCurrentPosition(async function(pos){
    let lat = pos.coords.latitude
    let lon = pos.coords.longitude
    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}&lang=pt_br`
    try {
      let resposta = await fetch(url)
      let dados = await resposta.json()
      mostrarClima(dados)
    } catch(e) {
      mostrarErro()
    } finally {
      mostrarLoading(false)
    }
  }, function(){
    mostrarLoading(false)
    mostrarErro()
  })
}

function mostrarClima(dados){
  let temp = Math.round(dados.main.temp)
  let sensacao = Math.round(dados.main.feels_like)
  let umidade = dados.main.humidity
  let vento = Math.round(dados.wind.speed * 3.6)
  let desc = dados.weather[0].description

  document.getElementById("local").innerText = dados.name + ", " + dados.sys.country
  document.getElementById("temperatura").innerText = temp
  document.getElementById("sensacao").innerText = sensacao
  document.getElementById("umidade").innerText = umidade
  document.getElementById("vento").innerText = vento
  document.getElementById("descricao").innerText = desc

  let img = document.getElementById("imagemRoupa")
  let dica = document.getElementById("dica")
  let comprar = document.getElementById("comprar")

  let checklist = []

  if(temp <= 15){
    img.src = "./img/frio.png"
    dica.innerText = "Está frio! Capriche nas camadas — casaco, calça e botas são indispensáveis."
    comprar.href = "https://shopee.com.br/search?keyword=casaco%20de%20inverno"
    checklist = [
      "🧥 Casaco ou jaqueta",
      "👖 Calça comprida",
      "🧣 Cachecol ou gola",
      "🧤 Luvas (se necessário)",
      "👢 Sapato fechado ou bota",
      "🧢 Touca (se muito frio)",
      "🌡️ Hidratante para o frio"
    ]
  } else if(temp <= 25){
    img.src = "./img/image-removebg-preview.png"
    dica.innerText = "Clima ameno e agradável! Uma camiseta com calça leve resolve bem o dia."
    comprar.href = "https://shopee.com.br/search?keyword=camiseta"
    checklist = [
      "👕 Camiseta ou camisa leve",
      "👖 Calça jeans ou sarja",
      "👟 Tênis ou sapatilha",
      "🧴 Protetor solar FPS 30+",
      "🕶️ Óculos de sol (pode variar)",
      "💧 Garrafinha de água"
    ]
  } else {
    img.src = "./img/calor.png"
    dica.innerText = "Calor intenso! Aposte em roupas leves e claras. Hidrate-se bastante!"
    comprar.href = "https://shopee.com.br/search?keyword=shorts%20verao"
    checklist = [
      "🩳 Shorts ou bermuda",
      "👕 Regata ou camiseta leve",
      "🩴 Sandália ou chinelo",
      "🧴 Protetor solar FPS 50+",
      "🕶️ Óculos de sol",
      "🧴 Hidratante corporal",
      "💧 Garrafinha de água grande",
      "🧢 Boné ou chapéu"
    ]
  }

  // Preenche checklist
  let ul = document.getElementById("checklist")
  ul.innerHTML = ""
  checklist.forEach(function(item){
    let li = document.createElement("li")
    li.innerHTML = `<span class="check-box"></span><span>${item}</span>`
    li.addEventListener("click", function(){
      li.classList.toggle("checked")
    })
    ul.appendChild(li)
  })

  document.getElementById("erro").classList.add("hidden")
  document.getElementById("resultado").classList.remove("hidden")
}

function mostrarLoading(show){
  let l = document.getElementById("loading")
  let r = document.getElementById("resultado")
  if(show){
    l.classList.remove("hidden")
    r.classList.add("hidden")
    document.getElementById("erro").classList.add("hidden")
  } else {
    l.classList.add("hidden")
  }
}

function mostrarErro(){
  document.getElementById("erro").classList.remove("hidden")
  document.getElementById("resultado").classList.add("hidden")
}

if("serviceWorker" in navigator){
  navigator.serviceWorker.register("service_worker.js")
}