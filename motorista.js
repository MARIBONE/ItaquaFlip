$(document).ready(function () {
    // MAPA DO TERRITÓRIO REAL
    var map = L.map('map', {
        scrollWheelZoom: false
    }).setView([-23.4866, -46.3487], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
    }).addTo(map);

/ Função para enviar dados para o Google Sheets
function enviarDadosParaGoogleSheets(dados) {
    const url = new URL('https://script.google.com/macros/s/AKfycbzn5ZlIImjgl-98ECy2bruU7ZU30Er2SUpl8FKdVCizG6mcTDaQUl2T9mghQkizXePD2Q/exec');
    url.search = new URLSearchParams(dados).toString();

    fetch(url, {
        method: 'GET',
    }).then(response => response.text())
    .then(result => {
        console.log('Dados enviados com sucesso:', result);
    })
    .catch(error => {
        console.error('Erro ao enviar dados:', error);
    });
}

// Função para coletar dados
function coletarDados() {
    function formatarDataHora() {
        let data = new Date();
        // Ajuste para o Horário de Brasília (UTC-3)
        data.setHours(data.getHours() - 3);

        let dia = String(data.getDate()).padStart(2, '0');
        let mes = String(data.getMonth() + 1).padStart(2, '0');
        let ano = data.getFullYear();
        let hora = String(data.getHours()).padStart(2, '0');
        let minuto = String(data.getMinutes()).padStart(2, '0');
        let segundo = String(data.getSeconds()).padStart(2, '0');

        let dataFormatada = `${dia}-${mes}-${ano}`;
        let horaFormatada = `${hora}:${minuto}:${segundo}`;

        return {
            data: dataFormatada,
            hora: horaFormatada
        };
    }

    function obterSistemaOperacional(userAgent) {
        if (/Windows NT 10.0/.test(userAgent)) return 'Windows 10';
        if (/Windows NT 6.3/.test(userAgent)) return 'Windows 8.1';
        if (/Windows NT 6.2/.test(userAgent)) return 'Windows 8';
        if (/Windows NT 6.1/.test(userAgent)) return 'Windows 7';
        if (/Macintosh/.test(userAgent)) return 'Mac OS';
        if (/Android/.test(userAgent)) return 'Android';
        if (/iPad|iPhone/.test(userAgent)) return 'iOS';
        if (/Linux/.test(userAgent)) return 'Linux';
        return 'Desconhecido';
    }

    function obterNavegador(userAgent) {
        if (/Edg/.test(userAgent)) return 'Edge';
        if (/Chrome/.test(userAgent) && !/Edg/.test(userAgent)) return 'Chrome';
        if (/Firefox/.test(userAgent)) return 'Firefox';
        if (/Safari/.test(userAgent) && !/Chrome/.test(userAgent)) return 'Safari';
        if (/MSIE|Trident/.test(userAgent)) return 'Internet Explorer';
        return 'Desconhecido';
    }

    // Nota: A identificação exata da marca do dispositivo não está disponível diretamente no navegador.
    function obterMarcaDoDispositivo(userAgent) {
        if (/Android/.test(userAgent)) return 'Android';
        if (/iPhone/.test(userAgent)) return 'iPhone';
        if (/iPad/.test(userAgent)) return 'iPad';
        if (/Windows/.test(userAgent)) return 'Windows PC';
        return 'Desconhecido';
    }

    let dataHora = formatarDataHora();
    let userAgent = navigator.userAgent;
    let sistemaOperacional = obterSistemaOperacional(userAgent);
    let navegador = obterNavegador(userAgent);
    let marcaDispositivo = obterMarcaDoDispositivo(userAgent);
    let resolucao = `${window.screen.width}x${window.screen.height}`; // Resolução da tela

    let dados = {
        pagina: window.location.pathname,
        data: dataHora.data,
        hora: dataHora.hora,
        ip: 'IP não disponível', // O IP não pode ser obtido diretamente do cliente por motivos de segurança.
        dispositivo: marcaDispositivo,
        sistemaOperacional: sistemaOperacional,
        navegador: navegador,
        resolucao: resolucao
    };

    console.log(dados); // Adicione este log para depuração

    return dados;
}

// Adicione um evento para garantir que o código seja executado após o carregamento do DOM
document.addEventListener('DOMContentLoaded', (event) => {
    let dados = coletarDados();
    enviarDadosParaGoogleSheets(dados);
});
