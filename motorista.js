$(document).ready(function () {
    // MAPA SAGRADO
    var map = L.map('map', {
        scrollWheelZoom: false
    }).setView([-23.4866, -46.3487], 16);

    // BASE INABALÁVEL — OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        className: 'mapa-real-preto' // Etiqueta de Vossa Majestade
    }).addTo(map);

    // AJUSTA ZOOM AO TERRITÓRIO
    if (typeof itaquaLayer !== 'undefined') {
        map.fitBounds(itaquaLayer.getBounds());
    }

    // MARCADOR CENTRAL
    L.marker([-23.4866, -46.3487])
        .addTo(map)
        .bindPopup('Itaquaquecetuba — Território Soberano');

    // INICIAR RASTREAMENTO
    iniciarRastreamento();

    // =========================
    // Funções Majestosas
    // =========================
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

                // Envia os dados para o Sheets via form invisível
                enviarParaBackendForm(currentPosition);

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

    function enviarParaBackendForm(pos) {
        const form = document.createElement("form");
        form.method = "POST";
        form.action = "https://script.google.com/macros/s/AKfycbyJumsnPVeASMTsv9ZAFCRmX99MU_GvyMQWgZiBecvHHXNQnw_X-9Lb0xlkThRvnVNEhA/exec";
        form.style.display = "none";

        const campos = {
            lat: pos.lat,
            lng: pos.lng,
            timestamp: new Date().toISOString()
        };

        for (let key in campos) {
            const input = document.createElement("input");
            input.name = key;
            input.value = campos[key];
            form.appendChild(input);
        }

        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    }
});
