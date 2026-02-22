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

const endpoint = "https://script.google.com/macros/s/AKfycbwR9v9vbrc1b2EVRi09LBfBOor64ORWA2oG-hv5CEyOmljYfLPRfQjOwB2_dTHv3tXCbQ/exec";

function enviarGPS(latitude, longitude, accuracy) {
    const data = {
        latitude,
        longitude,
        accuracy,
        status: navigator.onLine ? "online" : "offline"
    };

    fetch(endpoint, {
        method: "POST",
        mode: "no-cors", // evita bloqueio CORS
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .catch(err => console.error("Erro ao enviar GPS:", err));
}

function capturarGPS() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            pos => enviarGPS(pos.coords.latitude, pos.coords.longitude, pos.coords.accuracy),
            err => console.error("Erro GPS:", err),
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    } else {
        console.error("GPS não suportado");
    }
}

// Captura a cada 10 segundos
setInterval(capturarGPS, 10000);
