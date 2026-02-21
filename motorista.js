$(document).ready(function () {
    // 1. INICIALIZAÇÃO DO MAPA NO CENTRO DO REINO
    var map = L.map('map', { scrollWheelZoom: false }).setView([-23.4866, -46.3487], 16);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
    
    var marcadorReal = null;
    var enviadoAoCastelo = false;

    // 2. VIGILÂNCIA DO POSICIONAMENTO
    const watcher = navigator.geolocation.watchPosition(pos => {
        const latRaw = pos.coords.latitude;
        const longRaw = pos.coords.longitude;
        const precisao = pos.coords.accuracy;

        // Atualiza ou cria o Pin (o marcador é a nossa autoridade máxima)
        if (!marcadorReal) {
            marcadorReal = L.marker([latRaw, longRaw]).addTo(map);
        } else {
            marcadorReal.setLatLng([latRaw, longRaw]);
        }
        
        map.setView([latRaw, longRaw], 18);
        marcadorReal.bindPopup(`<b>Vossa localização foi detectada!</b><br>Precisão: ${precisao.toFixed(1)}m`).openPopup();

        // 3. O ENVIO DA VERDADE VISUAL (Apenas se a precisão for digna e o pin estiver fixo)
        if (precisao <= 25 && !enviadoAoCastelo) {
            enviadoAoCastelo = true; 

            // Extraímos as coordenadas DIRETAMENTE do marcador que Vossa Majestade vê
            const coordenadaDoPin = marcadorReal.getLatLng();
            
            const dados = {
                lat: coordenadaDoPin.lat.toString().replace('.', ','),
                long: coordenadaDoPin.lng.toString().replace('.', ','),
                precisao: precisao.toString().replace('.', ','),
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
                console.log("✅ A verdade do Pin foi enviada com vírgulas, Majestade!");
                navigator.geolocation.clearWatch(watcher); // Missão cumprida, cessa a vigilância
            })
            .catch(erro => console.error("❌ Houve uma rebelião no envio:", erro));
        }

    }, err => {
        console.error("⚠️ O GPS hesitou diante da Vossa presença.", err.message);
    }, {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 30000
    });
});
