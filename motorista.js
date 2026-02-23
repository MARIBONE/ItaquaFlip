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


let marker;
let currentPosition;

function iniciarRastreamento() {
    if (!navigator.geolocation) {
        alert("GPS não disponível");
        return;
    }

    navigator.geolocation.watchPosition(
        function(position) {
            currentPosition = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            atualizarMapa(currentPosition);
            enviarParaBackend(currentPosition);

        },
        function(error) {
            console.error("Erro GPS:", error);
        },
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 10000
        }
    );
}


function atualizarMapa(pos) {
    if (!marker) {
        marker = L.marker([pos.lat, pos.lng]).addTo(map);
        map.setView([pos.lat, pos.lng], 16);
    } else {
        marker.setLatLng([pos.lat, pos.lng]);
    }
}


function enviarParaBackend(pos) {
    fetch("https://script.google.com/macros/s/AKfycbyJumsnPVeASMTsv9ZAFCRmX99MU_GvyMQWgZiBecvHHXNQnw_X-9Lb0xlkThRvnVNEhA/exec", {
        method: "POST",
        body: JSON.stringify({
            lat: pos.lat,
            lng: pos.lng,
            timestamp: new Date().toISOString()
        }),
        headers: { "Content-Type": "application/json" }
    });
}
