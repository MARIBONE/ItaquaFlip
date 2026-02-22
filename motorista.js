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
__________________________________________________________________________________________________________________________________________________________________

const G_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwR9v9vbrc1b2EVRi09LBfBOor64ORWA2oG-hv5CEyOmljYfLPRfQjOwB2_dTHv3tXCbQ/exec"; // Cole o URL da implementação aqui

function enviarParaSheets(pos) {
  const dados = {
    lat: pos.coords.latitude,
    lon: pos.coords.longitude,
    accuracy: pos.coords.accuracy
  };

  fetch(G_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors", // Necessário para evitar erros de CORS com Apps Script
    cache: "no-cache",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados)
  })
  .then(() => alert("Localização guardada no Sheets!"))
  .catch(err => console.error("Erro ao enviar:", err));
}

// Chamar a geolocalização (precisa de clique do user)
navigator.geolocation.getCurrentPosition(enviarParaSheets, console.error, {enableHighAccuracy: true});
