var map; // A autoridade global

$(document).ready(function () {

    // MAPA DO TERRITÓRIO REAL 
    // Removido o 'var' interno para usar a variável global acima
    map = L.map('map', {
        scrollWheelZoom: false
    }).setView([-23.4866, -46.3487], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
    }).addTo(map);

    // Selo de exportação para garantir que o botão "enxergue" o mapa
    window.map = map;

    function capturarLocalizacaoReal() {
        if (!navigator.geolocation) {
            console.error("Alerta Real: Este navegador é indigno e não possui GPS.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            function(position) {
                var lat = position.coords.latitude;
                var lng = position.coords.longitude;

                L.marker([lat, lng])
                    .addTo(map)
                    .bindPopup("Seu Local")
                    .openPopup();

                map.setView([lat, lng], 17);

                const dados = {
                    timestamp: new Date().toISOString(),
                    latitude: lat.toFixed(7),
                    longitude: lng.toFixed(7),
                    precisao: position.coords.accuracy.toFixed(2),
                    status: navigator.onLine ? 'online' : 'offline'
                };

                fetch('https://script.google.com/macros/s/AKfycbzT5KyTliRRNTfSEweSDqfw8soiLZGPqAW-CbYHLO2vVW-cL695G_hsUElzqydUU93FoA/exec', {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dados)
                }).then(() => console.log("Dados enviados ao trono com sucesso."));

            },
            function(error) {
                console.error("Erro na geolocalização imperial.");
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    }

    capturarLocalizacaoReal();
    setInterval(capturarLocalizacaoReal, 100000);
});

// AUTOCOMPLETE (ViaCEP)
const inputRua = document.getElementById('nome');
const listaSugestoes = document.getElementById('ruas-itaqua');
let delayReal;

inputRua.addEventListener('input', () => {
    clearTimeout(delayReal);
    const busca = inputRua.value;
    if (busca.length < 3) return;

    delayReal = setTimeout(async () => {
        const url = `https://viacep.com.br/ws/SP/Itaquaquecetuba/${busca}/json/`;
        try {
            const resposta = await fetch(url);
            const dados = await resposta.json();
            listaSugestoes.innerHTML = ''; 
            if (Array.isArray(dados)) {
                dados.forEach(item => {
                    const opcao = document.createElement('option');
                    opcao.value = `${item.logradouro}, ${item.bairro} - ${item.cep}`;
                    listaSugestoes.appendChild(opcao);
                });
            }
        } catch (erro) {}
    }, 400);
});

// RELÓGIO
function UpdateDateTime() {
    var now = new Date();
    document.getElementById("datetime").innerHTML = now.toLocaleDateString('pt-BR') + '<br>' + 
        now.toLocaleTimeString('pt-BR', { hour12: false });
}
setInterval(UpdateDateTime, 1000);
UpdateDateTime();

// --- FUNÇÃO DO BOTÃO "INICIAR VIAGEM" (CORRIGIDA) ---
async function enviarParaOTrono() {
    const destinoInput = document.getElementById('nome').value;

    if (!destinoInput) {
        alert("Soberano, por favor, indique o destino!");
        return;
    }

    // Busca o mapa global ou o exportado na window
    var mapaReal = window.map || map;

    if (!mapaReal) {
        alert("O mapa ainda não está pronto, Majestade!");
        return;
    }

    navigator.geolocation.getCurrentPosition(async (posicao) => {
        const latOri = posicao.coords.latitude;
        const lonOri = posicao.coords.longitude;

        try {
            const busca = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(destinoInput)}+Itaquaquecetuba&format=json&limit=1`);
            const locais = await busca.json();

            if (locais.length === 0) {
                alert("Majestade, este endereço não foi localizado.");
                return;
            }

            const latDest = locais[0].lat;
            const lonDest = locais[0].lon;

            const urlOSRM = `https://router.project-osrm.org/route/v1/driving/${lonOri},${latOri};${lonDest},${latDest}?overview=full&geometries=geojson`;
            const resRota = await fetch(urlOSRM);
            const dadosRota = await resRota.json();

            if (dadosRota.routes && dadosRota.routes.length > 0) {
                if (window.camadaDaJornada) {
                    mapaReal.removeLayer(window.camadaDaJornada);
                }

                window.camadaDaJornada = L.geoJSON(dadosRota.routes[0].geometry, {
                    style: { color: '#4cbb17', weight: 8, opacity: 0.9 }
                }).addTo(mapaReal);

                mapaReal.fitBounds(window.camadaDaJornada.getBounds());

                L.marker([latDest, lonDest]).addTo(mapaReal)
                    .bindPopup(`<b>Destino Real:</b><br>${destinoInput}`)
                    .openPopup();
            }
        } catch (erro) {
            console.error("Falha na jornada:", erro);
        }
    }, null, { enableHighAccuracy: true });
}
