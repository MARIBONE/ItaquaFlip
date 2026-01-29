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



const URL_API_REAL = "https://script.google.com/macros/s/AKfycbydhd7VBgUuUampnOMg3tBcJs0SUwlqdYgrz3vjaerkIhiKmWtO56ChbgZHxT4HhHpkZQ/exec"; 
let ultimaLat = null;
let ultimaLng = null;

// Função para enviar os dados ao Trono
function enviarParaPlanilha(lat, lng) {
    fetch(URL_API_REAL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat: lat, lng: lng })
    });
    console.log("Coordenada enviada por decreto real!");
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

// Função de cálculo de distância
function calcularDistanciaImperial(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
