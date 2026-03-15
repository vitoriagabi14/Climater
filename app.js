/* =====================================================
   app.js — ClimaTrend
   Lógica principal: API de clima, geolocalização, roupas, Shopee
   ===================================================== */

/* ─────────────────────────────────────────
   1. CONFIGURAÇÃO DA API
   ───────────────────────────────────────── */

// ⚠️ Substitua pela sua chave gratuita: https://openweathermap.org/api
const API_KEY = "7f870a385dab27d5784b8d97dac288ac";
const API_BASE = "https://api.openweathermap.org/data/2.5/weather";


/* ─────────────────────────────────────────
   2. BANCO DE DADOS DE ROUPAS
   ───────────────────────────────────────── */

const clothesDB = {

  verycold: {
    label: "🥶 Muito Frio — menos de 10°C",
    tip: "Temperatura baixíssima! Use camadas: base térmica, suéter grosso e um casaco impermeável por cima. Proteja mãos, pescoço e orelhas com luvas, cachecol e touca.",
    items: [
      { emoji: "🧥", name: "Casaco grosso" },
      { emoji: "🧣", name: "Cachecol" },
      { emoji: "🧤", name: "Luvas" },
      { emoji: "🧢", name: "Touca" },
      { emoji: "🧸", name: "Base térmica" },
      { emoji: "👢", name: "Bota fechada" },
    ],
    img: "https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=800&q=80",
    imgLabel: "Look inverno intenso",
    shopee: [
      { icon: "🧥", name: "Casacos de Inverno",    query: "casaco+inverno+frio" },
      { icon: "🧣", name: "Cachecóis e Toucas",    query: "cachecol+touca+inverno" },
      { icon: "🧸", name: "Roupas Térmicas",        query: "roupa+termica+frio" },
      { icon: "👢", name: "Botas Impermeáveis",     query: "bota+impermeavel+frio" },
    ],
  },

  cold: {
    label: "🌨️ Frio — entre 10 e 17°C",
    tip: "Clima frio com possibilidade de vento. Aposte em calça jeans ou moletom, camiseta de manga longa e jaqueta. Tênis fechado é a escolha certa.",
    items: [
      { emoji: "🧥", name: "Jaqueta" },
      { emoji: "👖", name: "Calça jeans" },
      { emoji: "👕", name: "Manga longa" },
      { emoji: "🧦", name: "Meia grossa" },
      { emoji: "👟", name: "Tênis fechado" },
      { emoji: "🧤", name: "Luvas leves" },
    ],
    img: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&q=80",
    imgLabel: "Look outono / frio",
    shopee: [
      { icon: "🧥", name: "Jaquetas e Moletons",    query: "jaqueta+moletom+outono" },
      { icon: "👖", name: "Calças Jeans",            query: "calca+jeans+feminina+masculina" },
      { icon: "👕", name: "Camisetas Manga Longa",   query: "camiseta+manga+longa" },
      { icon: "👟", name: "Tênis Fechados",          query: "tenis+fechado+masculino+feminino" },
    ],
  },

  mild: {
    label: "🌤️ Ameno — entre 18 e 24°C",
    tip: "Temperatura agradável! Camiseta leve, calça ou bermuda e tênis já resolvem o dia. Se sair à noite, leve uma blusa extra.",
    items: [
      { emoji: "👕", name: "Camiseta leve" },
      { emoji: "👖", name: "Calça/Bermuda" },
      { emoji: "👟", name: "Tênis casual" },
      { emoji: "🕶️", name: "Óculos de sol" },
      { emoji: "🎒", name: "Mochila" },
      { emoji: "🧴", name: "Protetor solar" },
    ],
    img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
    imgLabel: "Look casual / primavera",
    shopee: [
      { icon: "👕", name: "Camisetas Casuais",       query: "camiseta+casual+primavera" },
      { icon: "👖", name: "Bermudas e Calças Leves", query: "bermuda+calca+leve+verao" },
      { icon: "👟", name: "Tênis Esportivos",        query: "tenis+esportivo+casual" },
      { icon: "🕶️", name: "Óculos e Acessórios",   query: "oculos+sol+bone+acessorios" },
    ],
  },

  hot: {
    label: "☀️ Quente — entre 25 e 32°C",
    tip: "Calor! Use tecidos leves como linho, algodão e dry-fit. Regatas, shorts e sandálias são ótimas pedidas. Use protetor solar FPS 50 e beba bastante água.",
    items: [
      { emoji: "🩱", name: "Regata" },
      { emoji: "🩳", name: "Shorts" },
      { emoji: "🩴", name: "Sandália" },
      { emoji: "🧴", name: "Protetor solar" },
      { emoji: "🕶️", name: "Óculos escuros" },
      { emoji: "🧢", name: "Boné / chapéu" },
    ],
    img: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80",
    imgLabel: "Look verão",
    shopee: [
      { icon: "🩱", name: "Regatas e Tops",           query: "regata+top+verao+feminino" },
      { icon: "🩳", name: "Shorts e Saias Leves",     query: "shorts+saia+leve+verao" },
      { icon: "🩴", name: "Sandálias e Chinelos",     query: "sandalia+chinelo+verao" },
      { icon: "🧢", name: "Bonés e Chapéus",          query: "chapeu+bone+praia+sol" },
    ],
  },

  veryhot: {
    label: "🔥 Muito Quente — acima de 32°C",
    tip: "Calor intenso! Use o mínimo de roupa possível com tecidos respiráveis. Protetor FPS 70+, chapéu de aba larga e muita hidratação são essenciais.",
    items: [
      { emoji: "🩱", name: "Top / Cropped" },
      { emoji: "🩳", name: "Short bem leve" },
      { emoji: "🩴", name: "Havaianas" },
      { emoji: "🧴", name: "FPS 70+" },
      { emoji: "👒", name: "Chapéu aba larga" },
      { emoji: "💧", name: "Garrafa de água" },
    ],
    img: "https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?w=800&q=80",
    imgLabel: "Look calor intenso",
    shopee: [
      { icon: "👙", name: "Biquínis e Maiôs",          query: "biquini+maio+praia" },
      { icon: "🩳", name: "Shorts Dry-fit",            query: "shorts+dry+fit+esporte" },
      { icon: "🩴", name: "Havaianas e Sandálias",     query: "havaianas+sandalia+praia" },
      { icon: "👒", name: "Chapéu e Óculos UV",        query: "chapeu+sol+protetor+uv" },
    ],
  },

  rainy: {
    label: "🌧️ Chuva — prepare-se!",
    tip: "Tem chuva! Use roupas impermeáveis ou que sequem rápido. Guarda-chuva é indispensável. Uma capa de chuva ou jaqueta corta-vento salva o look.",
    items: [
      { emoji: "🌂", name: "Guarda-chuva" },
      { emoji: "🧥", name: "Capa de chuva" },
      { emoji: "👢", name: "Bota impermeável" },
      { emoji: "👖", name: "Calça comprida" },
      { emoji: "👕", name: "Blusa seca-rápido" },
      { emoji: "🎒", name: "Mochila impermeável" },
    ],
    img: "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=800&q=80",
    imgLabel: "Look para dias chuvosos",
    shopee: [
      { icon: "🌂", name: "Guarda-chuvas e Capas",     query: "guarda+chuva+capa+chuva" },
      { icon: "👢", name: "Botas e Galochas",          query: "bota+galocha+impermeavel+chuva" },
      { icon: "🎒", name: "Mochilas Impermeáveis",     query: "mochila+impermeavel+chuva" },
      { icon: "🧥", name: "Jaquetas Corta-vento",      query: "jaqueta+corta+vento+impermeavel" },
    ],
  },
};


/* ─────────────────────────────────────────
   3. FUNÇÕES AUXILIARES
   ───────────────────────────────────────── */

// Escolhe o perfil de roupa com base na temperatura e condição do tempo
function getClimateProfile(temp, weatherId) {
  // IDs 200–599 na API = algum tipo de precipitação (chuva/tempestade/garoa)
  if (weatherId >= 200 && weatherId < 600) return clothesDB.rainy;
  if (temp < 10) return clothesDB.verycold;
  if (temp < 18) return clothesDB.cold;
  if (temp < 25) return clothesDB.mild;
  if (temp < 33) return clothesDB.hot;
  return clothesDB.veryhot;
}

// Retorna o emoji correspondente ao estado do tempo
function getWeatherEmoji(id) {
  if (id >= 200 && id < 300) return "⛈️";
  if (id >= 300 && id < 400) return "🌦️";
  if (id >= 500 && id < 600) return "🌧️";
  if (id >= 600 && id < 700) return "❄️";
  if (id >= 700 && id < 800) return "🌫️";
  if (id === 800)             return "☀️";
  if (id === 801)             return "🌤️";
  if (id <= 804)              return "⛅";
  return "🌡️";
}

// Atualiza a cor da faixa de perfil climático
function updateClimateStrip(weatherId) {
  const strip = document.getElementById("climate-strip");
  if (weatherId >= 200 && weatherId < 600) {
    strip.style.background = "linear-gradient(90deg, rgba(0,180,216,0.15), rgba(0,180,216,0.03))";
    strip.style.borderColor = "rgba(0,180,216,0.3)";
    strip.style.color = "#48cae4";
  } else {
    strip.style.background = "";
    strip.style.borderColor = "";
    strip.style.color = "";
  }
}


/* ─────────────────────────────────────────
   4. CONTROLE DE UI
   ───────────────────────────────────────── */

function showError(msg) {
  const box = document.getElementById("error-box");
  document.getElementById("error-msg").textContent = msg;
  box.style.display = "flex"; // usa flex para alinhar ícone + texto
  document.getElementById("weather-section").style.display = "none";
}

function hideError() {
  document.getElementById("error-box").style.display = "none";
}

function setLoading(state) {
  document.getElementById("loading").style.display     = state ? "block" : "none";
  document.getElementById("search-btn").disabled       = state;
  document.getElementById("geo-btn").disabled          = state;
}


/* ─────────────────────────────────────────
   5. BUSCA E RENDERIZAÇÃO
   ───────────────────────────────────────── */

// Faz a requisição HTTP para a API e renderiza o resultado
async function fetchWeather(url) {
  hideError();
  setLoading(true);
  document.getElementById("weather-section").style.display = "none";

  try {
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 401) throw new Error("Chave de API inválida. Substitua API_KEY no app.js.");
      if (response.status === 404) throw new Error("Cidade não encontrada. Tente: 'Fortaleza, BR'");
      throw new Error("Erro na requisição: código " + response.status);
    }

    const data = await response.json();
    renderWeather(data);

  } catch (error) {
    showError(error.message);
  } finally {
    setLoading(false);
  }
}

// Preenche o HTML com os dados retornados pela API
function renderWeather(data) {
  const temp      = Math.round(data.main.temp);
  const feels     = Math.round(data.main.feels_like);
  const humid     = data.main.humidity;
  const windKmh   = Math.round(data.wind.speed * 3.6); // m/s → km/h
  const clouds    = data.clouds.all;
  const weatherId = data.weather[0].id;
  const desc      = data.weather[0].description;
  const city      = data.name;
  const country   = data.sys.country;

  // Preenche o card do clima
  document.getElementById("w-city").textContent    = city;
  document.getElementById("w-country").textContent = country + " · agora";
  document.getElementById("w-icon").textContent    = getWeatherEmoji(weatherId);
  document.getElementById("w-temp").textContent    = temp;
  document.getElementById("w-feels").textContent   = feels;
  document.getElementById("w-desc").textContent    = desc;
  document.getElementById("w-humid").textContent   = humid + "%";
  document.getElementById("w-wind").textContent    = windKmh;
  document.getElementById("w-clouds").textContent  = clouds;

  // Escolhe o perfil de roupas e preenche a seção
  const profile = getClimateProfile(temp, weatherId);
  document.getElementById("climate-badge").textContent    = profile.label;
  document.getElementById("clothes-tip").textContent      = profile.tip;
  document.getElementById("outfit-img").src               = profile.img;
  document.getElementById("outfit-img-label").textContent = profile.imgLabel;

  // Gera os cards de peças de roupa via innerHTML + template literals
  document.getElementById("clothes-grid").innerHTML = profile.items
    .map(item => `
      <div class="clothes-item">
        <span class="item-emoji">${item.emoji}</span>
        <span class="item-name">${item.name}</span>
      </div>
    `)
    .join("");

  // Gera os links para a Shopee (URL de busca com a query do produto)
  document.getElementById("shopee-links").innerHTML = profile.shopee
    .map(s => `
      <a
        class="shopee-link"
        href="https://shopee.com.br/search?keyword=${s.query}"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span class="shopee-link-icon">${s.icon}</span>
        <div class="shopee-link-text">
          <strong>${s.name}</strong>
          <span>Ver ofertas na Shopee</span>
        </div>
      </a>
    `)
    .join("");

  // Exibe a seção e rola até ela
  document.getElementById("weather-section").style.display = "block";
  document.getElementById("weather-section").scrollIntoView({ behavior: "smooth", block: "start" });

  // Ajusta cor da faixa de perfil
  updateClimateStrip(weatherId);
}


/* ─────────────────────────────────────────
   6. BUSCA POR CIDADE (campo de texto)
   ───────────────────────────────────────── */

function searchByCity() {
  const city = document.getElementById("city-input").value.trim();
  if (!city) { showError("Digite o nome de uma cidade."); return; }
  const url = `${API_BASE}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=pt_br`;
  fetchWeather(url);
}


/* ─────────────────────────────────────────
   7. BUSCA POR GEOLOCALIZAÇÃO (GPS)

   ⚠️ IMPORTANTE — Por que a geolocalização pode falhar?
   ──────────────────────────────────────────────────────
   A API navigator.geolocation só funciona em:
     ✅ HTTPS  (ex: site publicado, localhost com certificado)
     ✅ localhost (http://localhost)
     ❌ file:// (abrindo o arquivo direto no navegador)

   Se você estiver abrindo o index.html clicando duas vezes
   no arquivo, o navegador usa file:// e BLOQUEIA o GPS.

   SOLUÇÃO para testar localmente:
     → Use a extensão "Live Server" no VS Code (recomendado)
       Instale e clique em "Go Live" — abre em http://localhost
     → Ou use: python -m http.server 5500 no terminal

   Como fallback, se o GPS falhar, usamos a API gratuita
   ipapi.co que detecta localização pelo IP do usuário.
   ───────────────────────────────────────────────────────
   ───────────────────────────────────────── */

async function searchByGeo() {
  hideError();
  setLoading(true);

  // ── PASSO 1: tenta GPS nativo do navegador ──
  // Funciona em: localhost, HTTPS. NÃO funciona em file://
  if (navigator.geolocation) {
    console.log("🛰️ Tentando GPS do navegador...");

    // Envolve o callback em uma Promise para poder usar await
    const gpsResult = await new Promise(function(resolve) {
      navigator.geolocation.getCurrentPosition(
        function(pos) {
          console.log("✅ GPS OK:", pos.coords.latitude, pos.coords.longitude);
          resolve({ ok: true, lat: pos.coords.latitude, lon: pos.coords.longitude });
        },
        function(err) {
          // Códigos de erro: 1=PERMISSION_DENIED, 2=UNAVAILABLE, 3=TIMEOUT
          console.warn("❌ GPS falhou. Código:", err.code, "| Motivo:", err.message);
          resolve({ ok: false, code: err.code });
        },
        { timeout: 8000, maximumAge: 60000 }
      );
    });

    // GPS funcionou: busca clima pelas coordenadas exatas
    if (gpsResult.ok) {
      const url = `${API_BASE}?lat=${gpsResult.lat}&lon=${gpsResult.lon}&appid=${API_KEY}&units=metric&lang=pt_br`;
      fetchWeather(url);
      return;
    }
  } else {
    console.warn("❌ navigator.geolocation não existe neste navegador.");
  }

  // ── PASSO 2: fallback por IP (cascata de 3 APIs) ──
  // Quando o GPS não funciona, detectamos a cidade pelo IP.
  // Tentamos 3 serviços diferentes — se um falhar, tenta o próximo.
  console.log("🌐 GPS indisponível. Tentando detectar localização por IP...");
  await fallbackByIP();
}

/**
 * Detecta cidade pelo IP usando 3 APIs em cascata.
 * Se a primeira falhar (rate limit, CORS, erro), tenta a segunda, depois a terceira.
 *
 * APIs usadas (todas gratuitas, sem chave):
 *   1. ip-api.com      — mais confiável, sem CORS
 *   2. ipwho.is        — alternativa rápida
 *   3. freeipapi.com   — terceira opção de segurança
 */
async function fallbackByIP() {

  // Lista de APIs de geolocalização por IP para tentar em ordem
  const ipApis = [
    {
      url:    "http://ip-api.com/json/?fields=city,countryCode,status",
      parse:  function(d) { return d.status === "success" ? { city: d.city, country: d.countryCode } : null; }
    },
    {
      url:    "https://ipwho.is/",
      parse:  function(d) { return d.success ? { city: d.city, country: d.country_code } : null; }
    },
    {
      url:    "https://freeipapi.com/api/json",
      parse:  function(d) { return d.cityName ? { city: d.cityName, country: d.countryCode } : null; }
    }
  ];

  for (let i = 0; i < ipApis.length; i++) {
    const api = ipApis[i];
    try {
      console.log(`🌐 Tentando API de IP #${i + 1}: ${api.url}`);
      const res  = await fetch(api.url);
      const data = await res.json();
      const loc  = api.parse(data);

      if (loc && loc.city) {
        console.log(`✅ Localização detectada por IP: ${loc.city}, ${loc.country}`);
        const url = `${API_BASE}?q=${encodeURIComponent(loc.city + "," + loc.country)}&appid=${API_KEY}&units=metric&lang=pt_br`;
        fetchWeather(url);
        return; // sucesso — sai da função
      }
    } catch (err) {
      console.warn(`❌ API de IP #${i + 1} falhou:`, err.message);
    }
  }

  // Todas as 3 APIs falharam
  setLoading(false);
  showError("Não foi possível detectar sua localização automaticamente. Por favor, digite o nome da sua cidade no campo acima.");
}


/* ─────────────────────────────────────────
   8. EVENTOS DO DOM
   ───────────────────────────────────────── */

// Busca ao pressionar Enter
document.getElementById("city-input").addEventListener("keydown", function(e) {
  if (e.key === "Enter") searchByCity();
});


/* ─────────────────────────────────────────
   9. PWA — SERVICE WORKER E INSTALAÇÃO
   ───────────────────────────────────────── */

// Registra o Service Worker (cache offline)
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js")
    .then(() => console.log("✅ Service Worker registrado"))
    .catch(err => console.warn("SW não registrado:", err));
}

// ── PWA: captura o evento de instalação ──
// O evento beforeinstallprompt só dispara quando:
//   1. O site está em http://localhost ou HTTPS
//   2. O manifest.json está configurado corretamente
//   3. O Service Worker está registrado e ativo
//   4. O usuário ainda NÃO instalou o app
//   5. O usuário interagiu com a página (clique, scroll)
// Quando tudo isso se cumpre, o Chrome mostra nosso banner customizado.
let deferredPrompt = null;

window.addEventListener("beforeinstallprompt", function(e) {
  // Impede o mini-banner automático do Chrome de aparecer
  e.preventDefault();
  deferredPrompt = e;

  // Exibe nosso banner customizado na parte inferior da tela
  document.getElementById("install-banner").classList.remove("hidden");

  console.log("✅ PWA: ClimaRoupa pronto para instalar");
});

// Quando o app for instalado com sucesso, esconde o banner
window.addEventListener("appinstalled", function() {
  deferredPrompt = null;
  document.getElementById("install-banner").classList.add("hidden");
  console.log("✅ PWA: ClimaRoupa instalado com sucesso!");
});

/**
 * Abre o diálogo nativo de instalação do Chrome/Edge.
 * Chamada pelo botão "Instalar" no banner inferior.
 */
async function installPWA() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log("Instalação:", outcome);
    deferredPrompt = null;
    document.getElementById("install-banner").classList.add("hidden");
  }
}