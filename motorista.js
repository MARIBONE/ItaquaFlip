let map;
let marker;
let currentPosition;

$(document).ready(function () {

    // MAPA — Base sólida
    map = L.map('map', {
        scrollWheelZoom: false
    }).setView([-23.4866, -46.3487], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        className: 'mapa-real-preto'
    }).addTo(map);

    // MARCADOR CENTRAL fixo
    L.marker([-23.4866, -46.3487])
        .addTo(map)
        .bindPopup('Itaquaquecetuba — Território Soberano')
        .openPopup();

    // 🚀 Inicia rastreamento assim que o documento carrega
    iniciarRastreamento();
});



function iniciarRastreamento() {
    if (!navigator.geolocation) {
        alert("GPS não disponível");
        return;
    }

    // ⚡ Solicita permissão GPS e acompanha mudanças
    navigator.geolocation.watchPosition(
        function(position) {
            currentPosition = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            // Atualiza o marker do motorista
            atualizarMapa(currentPosition);

            // Envia para planilha via Apps Script
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
        marker = L.marker([pos.lat, pos.lng])
            .addTo(map)
            .bindPopup('Motorista Atual')
            .openPopup();
        map.setView([pos.lat, pos.lng], 16);
    } else {
        marker.setLatLng([pos.lat, pos.lng]);
    }
}

function enviarParaBackendForm(pos) {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "https://script.google.com/macros/s/AKfycbyJumsnPVeASMTsv9ZAFCRmX99MU_GvyMQWgZiBecvHHXNQnw_X-9Lb0xlkThRvnVNEhA/exec";
    form.style.display = "none";

    // Campos do form
    const latInput = document.createElement("input");
    latInput.name = "lat";
    latInput.value = pos.lat;
    form.appendChild(latInput);

    const lngInput = document.createElement("input");
    lngInput.name = "lng";
    lngInput.value = pos.lng;
    form.appendChild(lngInput);

    const tsInput = document.createElement("input");
    tsInput.name = "timestamp";
    tsInput.value = new Date().toISOString();
    form.appendChild(tsInput);

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
}
