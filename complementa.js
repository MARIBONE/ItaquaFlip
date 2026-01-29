 $(document).ready(function () {


// MAPA

var map = L.map('map', {

scrollWheelZoom: false

}).setView([-23.4866, -46.3487], 16);


// O MAPA QUE NUNCA FALHA — BASE SÓLIDA

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {

maxZoom: 19,

className: 'mapa-real-preto' // A etiqueta de Vossa Majestade

}).addTo(map);



// AJUSTA ZOOM AO TERRITÓRIO REAL

map.fitBounds(itaquaLayer.getBounds());


// MARCADOR CENTRAL

L.marker([-23.4866, -46.3487])

.addTo(map)

.bindPopup('Itaquaquecetuba — Território Soberano');


}); 



function enviarPosicao(lat, lng) {
    const url = "https://script.google.com/macros/s/AKfycbycNtfKcsjIWoDFVGQ-53oY7hZW4Qf-YLjCQkGne3OYqsxif8q8gP1x-gou88y8nfWn2Q/exec";
    fetch(url, {
        method: "POST",
        body: JSON.stringify({ lat: lat, lng: lng, motorista: "Súdito 01" })
    });
}


// A URL de Implantação que Vossa Majestade obteve no Google Apps Script
const URL_API_REAL = "https://script.google.com/macros/s/AKfycbycNtfKcsjIWoDFVGQ-53oY7hZW4Qf-YLjCQkGne3OYqsxif8q8gP1x-gou88y8nfWn2Q/exec"; 

let ultimaLat = null;
let ultimaLng = null;

// Função para calcular a distância em metros (Fórmula de Haversine)
function calcularDistanciaImperial(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Raio da Terra em metros
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Função para enviar os dados ao Vosso escriba (Google Sheets)
function enviarParaPlanilha(lat, lng) {
    fetch(URL_API_REAL, {
        method: 'POST',
        mode: 'no-cors', // Necessário para evitar conflitos de CORS com o Google
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            lat: lat,
            lng: lng,
            timestamp: new Date().toISOString()
        })
    });
}

// O Olho Vigilante: Monitora a posição exata
if ("geolocation" in navigator) {
    navigator.geolocation.watchPosition(
        (posicao) => {
            const novaLat = posicao.coords.latitude;
            const novaLng = posicao.coords.longitude;

            // Se for a primeira leitura ou se a distância for maior que 10 metros
            if (ultimaLat === null || calcularDistanciaImperial(ultimaLat, ultimaLng, novaLat, novaLng) >= 10) {
                
                enviarParaPlanilha(novaLat, novaLng);
                
                // Atualiza a última posição conhecida
                ultimaLat = novaLat;
                ultimaLng = novaLng;
                
                console.log("Coordenadas enviadas ao trono: ", novaLat, novaLng);
            }
        },
        (erro) => {
            console.error("Erro ao rastrear nos domínios: ", erro.message);
        },
        {
            enableHighAccuracy: true, // Exige a precisão máxima do GPS
            maximumAge: 0,
            timeout: 5000
        }
    );
} else {
    console.error("Este navegador não suporta a vigilância de Vossa Majestade.");
}
