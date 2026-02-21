$(document).ready(function () {
    // 1. INICIALIZAÇÃO DO MAPA
    var map = L.map('map', { scrollWheelZoom: false }).setView([-23.4866, -46.3487], 16);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
    
    var marcadorReal = null;
    var enviadoAoCastelo = false; // Garante um único envio por sessão

    // 2. VIGILÂNCIA CONSTANTE (WATCH POSITION)
    const watcher = navigator.geolocation.watchPosition(pos => {
        const lat = pos.coords.latitude;
        const long = pos.coords.longitude;
        const precisao = pos.coords.accuracy;

        // Atualiza o mapa visualmente para o Rei
        if (!marcadorReal) {
            marcadorReal = L.marker([lat, long]).addTo(map);
        } else {
            marcadorReal.setLatLng([lat, long]);
        }
        map.setView([lat, long], 18);
        marcadorReal.bindPopup(`<b>Precisão Real: ${precisao.toFixed(1)}m</b>`).openPopup();

        // 3. O FILTRO DE ELITE: Só envia se a precisão for menor que 20 metros
        if (precisao <= 20 && !enviadoAoCastelo) {
            enviadoAoCastelo = true; // Marca como enviado para não repetir
            
            const dados = {
                lat: lat,
                long: long,
                precisao: precisao,
                timestamp: new Date().toLocaleString("pt-BR")
            };

            fetch('https://script.google.com/macros/s/AKfycbwxiNFyhwQh_B0e2efWkC6k8hWiJuzpJOPrcu2bv1qbXEVmGc6cakSPbIY90_0sR1EnAA/exec', {
                method: 'POST',
                mode: 'no-cors',
                cache: 'no-cache',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            })
            .then(() => {
                console.log("✅ Coordenada real entregue ao Castelo!");
                navigator.geolocation.clearWatch(watcher); // Cessa a vigilância para poupar energia
            })
            .catch(erro => console.error("❌ Erro na cavalaria:", erro));
        }

    }, err => {
        console.error("⚠️ Súdito rebelde negou o GPS.", err.message);
    }, {
        enableHighAccuracy: true, // Exige o uso do GPS do Reino
        maximumAge: 0,
        timeout: 30000
    });
});
