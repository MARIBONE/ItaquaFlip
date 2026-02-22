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


function sendLocationToSheet(position) {
    const endpoint = "https://script.google.com/macros/s/AKfycbwxiNFyhwQh_B0e2efWkC6k8hWiJuzpJOPrcu2bv1qbXEVmGc6cakSPbIY90_0sR1EnAA/exec";
    const data = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        status: navigator.onLine ? "online" : "offline"
    };

    fetch(endpoint, {
        method: "POST",
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res => console.log("Enviado:", res))
    .catch(err => console.error("Erro ao enviar:", err));
}

function captureGPS() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            sendLocationToSheet,
            err => console.error("Erro de GPS:", err),
            { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
        );
    } else {
        console.error("GPS não suportado");
    }
}

// Opcional: capturar periodicamente a posição
setInterval(captureGPS, 100000); // a cada 100s
