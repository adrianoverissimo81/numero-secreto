let listaDeNumerosSorteados = [];
let numeroLimite = 10;
let numeroSecreto = gerarNumeroAleatorio();
let tentativas = 1;

function exibirTextoNaTela(tag, texto, callback = null) {
    let campo = document.querySelector(tag);
    if (campo) { // Verifica se o campo existe antes de tentar manipular
        campo.innerHTML = texto;
        let fala = new SpeechSynthesisUtterance(texto);
        fala.lang = 'pt-BR';
        fala.rate = 1.3;
        speechSynthesis.speak(fala);

        fala.onend = function() {
            if (callback && typeof callback === 'function') {
                callback();
            }
        };
    } else {
        console.error(`Elemento com seletor '${tag}' não encontrado.`);
    }
}

function tocarAudio(caminhoDoAudio) {
    let audio = new Audio(caminhoDoAudio);
    audio.play();
}

function exibirMensagemInicial() {
    // ATUALIZADO: Seleciona o h1 diretamente para exibir o título inicial
    exibirTextoNaTela('h1', 'Jogo do número secreto');
    exibirTextoNaTela('p', 'Escolha um número entre 1 e 10');

    // Garante que o gif do esteja escondido e a imagem da pessoa visível no início
    let imagemPessoa = document.getElementById('imagem-pessoa');
    let gifAcertoPequeno = document.getElementById('gif-acerto'); // Corresponde a id="gif-acerto"
    let gifGrandeAcerto = document.getElementById('gif-grande-acerto');

    if (imagemPessoa) imagemPessoa.style.display = 'block';
    if (gifAcertoPequeno) gifAcertoPequeno.style.display = 'none'; // Mostra o gif pequeno
    if (gifGrandeAcerto) gifGrandeAcerto.style.display = 'none'; 
}

// Chame a função para configurar o estado inicial ao carregar a página
exibirMensagemInicial();

function verificarChute() {
    let chuteInput = document.querySelector('.container__input'); // Seleciona o input pela classe
    let chute = chuteInput ? chuteInput.value : ''; // Garante que chuteInput não é null

    if (chute == numeroSecreto) {
        exibirTextoNaTela('h1', 'Acertou!');
        
        let imagemPessoa = document.getElementById('imagem-pessoa');
        let gifAcertoPequeno = document.getElementById('gif-acerto'); // Corresponde a id="gif-acerto"
    let gifGrandeAcerto = document.getElementById('gif-grande-acerto'); 

        if (imagemPessoa) imagemPessoa.style.display = 'none';
        if (gifAcertoPequeno) gifAcertoPequeno.style.display = 'none'; 
        if (gifGrandeAcerto) gifGrandeAcerto.style.display = 'block'; // Mostra o gif grande    

        let palavraTentativa = tentativas > 1 ? 'tentativas' : 'tentativa';
        let mensagemTentativas = `Você descobriu o número secreto com ${tentativas} ${palavraTentativa}!`;
        exibirTextoNaTela('p', mensagemTentativas, function() {
            tocarAudio('audios/mizeravi.mp3'); // Toca o áudio de vitória
        }); 

        document.querySelector('.container__botao').setAttribute('disabled', true); // Desabilita o botão "Chutar"
        document.getElementById('reiniciar').removeAttribute('disabled'); // Habilita o botão "Novo jogo"
    } else {
        if (chute > numeroSecreto) {
            exibirTextoNaTela('p', 'O número secreto é menor');
        } else {
            exibirTextoNaTela('p', 'O número secreto é maior');
        }
        tentativas++;
        limparCampo();
    }
}

function gerarNumeroAleatorio() {
    let numeroEscolhido = parseInt(Math.random() * numeroLimite + 1);
    let quantidadeDeElementosNaLista = listaDeNumerosSorteados.length;

    if (quantidadeDeElementosNaLista == numeroLimite) {
        listaDeNumerosSorteados = [];
    }
    if (listaDeNumerosSorteados.includes(numeroEscolhido)) {
        return gerarNumeroAleatorio();
    } else {
        listaDeNumerosSorteados.push(numeroEscolhido);
        console.log(listaDeNumerosSorteados);
        return numeroEscolhido;
    }
}

function limparCampo() {
    let chute = document.querySelector('.container__input'); // Seleciona o input pela classe
    if (chute) chute.value = '';
}

function reiniciarJogo() {
    numeroSecreto = gerarNumeroAleatorio();
    limparCampo();
    tentativas = 1;
    exibirMensagemInicial(); // Reseta o texto e a visibilidade de imagem/GIF

    document.getElementById('reiniciar').setAttribute('disabled', true);
    document.querySelector('.container__botao').removeAttribute('disabled'); // Reabilita o botão "Chutar"
}

let campoChute = document.querySelector('.container__input');

// 2. Adicionar um ouvinte de evento para 'keydown'
campoChute.addEventListener('keydown', function(event) {
    // 3. Verificar se a tecla pressionada foi "Enter" (código 13 para compatibilidade, ou event.key === 'Enter')
    if (event.key === 'Enter') {
        // 4. Chamar a função verificarChute()
        verificarChute();
        // Opcional: Impedir o comportamento padrão do Enter (como enviar um formulário)
        event.preventDefault(); 
    }
});