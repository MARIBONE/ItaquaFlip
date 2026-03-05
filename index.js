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
                    .bindPopup("Seu Local")
                    .openPopup();

                map.setView([lat, lng], 17);

                // Envio direto para o Google Sheets via FormData (ou JSON no no-cors)
                const dados = {
                    timestamp: new Date().toISOString(),
                    latitude: lat.toFixed(7),  // Transforma em texto com ponto
                    longitude: lng.toFixed(7), // Transforma em texto com ponto
                    precisao: position.coords.accuracy.toFixed(2),
                    status: navigator.onLine ? 'online' : 'offline'
                };


                fetch('https://script.google.com/macros/s/AKfycbzT5KyTliRRNTfSEweSDqfw8soiLZGPqAW-CbYHLO2vVW-cL695G_hsUElzqydUU93FoA/exec', {
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


const inputRua = document.getElementById('nome');
const listaSugestoes = document.getElementById('ruas-itaqua');
let delayReal;

inputRua.addEventListener('input', () => {
    clearTimeout(delayReal);
    const busca = inputRua.value;

    if (busca.length < 3) return; // Aguardamos 3 letras para precisão cirúrgica

    delayReal = setTimeout(async () => {
        // Consultamos a base oficial para Itaquaquecetuba/SP
        const url = `https://viacep.com.br/ws/SP/Itaquaquecetuba/${busca}/json/`;

        try {
            const resposta = await fetch(url);
            const dados = await resposta.json();

            listaSugestoes.innerHTML = ''; 

            if (Array.isArray(dados)) {
                dados.forEach(item => {
                    // Formatação Imperial: Logradouro, Bairro - CEP
                    const enderecoCompleto = `${item.logradouro}, ${item.bairro} - ${item.cep}`;
                    const opcao = document.createElement('option');
                    opcao.value = enderecoCompleto;
                    listaSugestoes.appendChild(opcao);
                });
            }
        } catch (erro) {
            // Silêncio diante de instabilidades no reino
        }
    }, 400); // Um suspiro real para evitar bloqueios
});


function UpdateDateTime() {
        var now = new Date();
        var formattedDate = now.toLocaleDateString('pt-BR');
        var formattedTime = now.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        });

        document.getElementById("datetime").innerHTML = formattedDate + '<br>' + formattedTime;
      }

      setInterval(UpdateDateTime, 1000);
      UpdateDateTime();


// --- INTEGRAÇÃO REAL DO BOTÃO "INICIAR VIAGEM" ---

async function enviarParaOTrono() {
    const destinoInput = document.getElementById('nome').value;

    if (!destinoInput) {
        alert("Soberano, por favor, indique o destino no campo de busca!");
        return;
    }

    // 1. Capturamos o GPS na hora para garantir precisão total
    navigator.geolocation.getCurrentPosition(async (posicao) => {
        const latOri = posicao.coords.latitude;
        const lonOri = posicao.coords.longitude;

        try {
            // 2. Transformamos o texto do Input em coordenadas (Nominatim)
            // Usamos Itaquaquecetuba como âncora para não sair do reino
            const busca = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(destinoInput)}+Itaquaquecetuba&format=json&limit=1`);
            const locais = await busca.json();

            if (locais.length === 0) {
                alert("Majestade, este local não foi encontrado nos mapas de Itaquá.");
                return;
            }

            const latDest = locais[0].lat;
            const lonDest = locais[0].lon;

            // 3. Consultando o OSRM para traçar a rota real
            const urlOSRM = `https://router.project-osrm.org/route/v1/driving/${lonOri},${latOri};${lonDest},${latDest}?overview=full&geometries=geojson`;
            const resRota = await fetch(urlOSRM);
            const dadosRota = await resRota.json();

            if (dadosRota.routes && dadosRota.routes.length > 0) {
                // Buscamos o mapa que Vossa Majestade já inicializou lá em cima
                // O Leaflet guarda a instância no DOM; vamos acessá-la com elegância
                const mapaReal = document.getElementById('map')._leaflet_map || map; 

                // Limpamos rotas anteriores se existirem
                if (window.camadaDaJornada) {
                    mapaReal.removeLayer(window.camadaDaJornada);
                }

                // 4. Desenhamos a Rota Verde (Cor do ItaquaFlip!)
                window.camadaDaJornada = L.geoJSON(dadosRota.routes[0].geometry, {
                    style: { color: '#4cbb17', weight: 8, opacity: 0.9 }
                }).addTo(mapaReal);

                // Ajustamos a visão para o Rei contemplar todo o trajeto
                mapaReal.fitBounds(window.camadaDaJornada.getBounds());

                // Marcador no Destino
                L.marker([latDest, lonDest]).addTo(mapaReal)
                    .bindPopup(`<b>Destino Real:</b><br>${destinoInput}`)
                    .openPopup();

            } else {
                alert("Os caminhos estão obstruídos, não conseguimos traçar a rota.");
            }

        } catch (erro) {
            console.error("Falha na comunicação imperial:", erro);
            alert("Houve um erro ao consultar os mapas do reino.");
        }
    }, () => {
        alert("Majestade, precisamos que o GPS esteja ativo para traçar a rota!");
    });
}
