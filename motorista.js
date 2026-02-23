$(document).ready(function () {

    // MAPA — Base sólida do reino
    var map = L.map('map', {
        scrollWheelZoom: false
    }).setView([-23.4866, -46.3487], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        className: 'mapa-real-preto'
    }).addTo(map);

    // MARCADOR CENTRAL
    L.marker([-23.4866, -46.3487])
        .addTo(map)
        .bindPopup('Itaquaquecetuba — Território Soberano')
        .openPopup();

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
        marker = L.marker([pos.lat, pos.lng]).addTo(map)
            .bindPopup('Motorista Atual')
            .openPopup();
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
            timestamp: new Date().toISOString(),
            status: "online"
        }),
        headers: { "Content-Type": "application/json" }
    })
    .then(resp => resp.json())
    .then(data => console.log("Enviado:", data))
    .catch(err => console.error("Erro envio:", err));
}
