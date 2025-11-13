/* ===================================================================
CÓDIGO JAVASCRIPT - SIMULADOR DE BANCO PRA GUARDAR DINHEIRO IMAGINÁRIO
=================================================================== */
// Variável de tempo passada para simular operações bancárias


// Variáveis principais que armazenam a conta e suas movimentações

let conta = null;
let movimentacoes = [];

/* ------------------------------------------------------------
             Função para obter a data/hora atual
------------------------------------------------------------ */

function obterDataHoraAtual() {
    return new Date();
}

function obterDataHoraFormatada(data) {
    const dataFormatada = data.toLocaleDateString('pt-BR');
    const horaFormatada = data.toLocaleTimeString('pt-BR');
    return `[${dataFormatada} ${horaFormatada}]`;
}

/* ------------------------------------------------------------
        Função para abrir uma nova conta bancária
------------------------------------------------------------ */

function abrirConta() {
    const nome = document.getElementById("nome").value.trim();
    const tipo = document.getElementById("tipoConta").value;
if (nome === "") {
    alert("Obrigatório informar o nome, meu chapinha!");
return;
}

if (tipo == "poupanca") {
    alert("Conta poupança é sujeita á juros mensais ao sacar. Mantenha seu depósito por mais de 30 dias para ganhar juros!");
}

if (tipo == "corrente") {
    alert("Conta corrente não possui juros ao sacar.");
    }
if (tipo == "credito") {
    alert("Cartão de crédito possui limite de crédito pré-aprovado. Utilize com responsabilidade!");
    }
     


// Criação do objeto "conta"
    conta = {
    nomeCliente: nome,
    tipoConta: tipo,
    saldo: 0,
    ativa: true,
    fatura: 0, // para conta crédito
    limite: 2000, // para conta crédito
    dataUltimoDeposito: null // para conta poupança
};
movimentacoes = []; // limpa movimentações anteriores

    // Mensagem de sucesso

    document.getElementById("resConta").innerHTML =
    `✅ Conta <strong>${tipo}</strong> criada com sucesso para
    <strong>${nome}</strong>.`;

// Desabilita campos de abertura e habilita operações

    document.getElementById("nome").disabled = true;
    document.getElementById("tipoConta").disabled = true;
    document.getElementById("btnAbrir").disabled = true;
    habilitarOperacoes(true);

    // Mostra fatura se for conta de crédito
    if (tipo === "credito") {
        mostrarFatura();
    }
    };/* ------------------------------------------------------------
    Função que habilita ou desabilita os botões de operação
------------------------------------------------------------ */

function habilitarOperacoes(estado) {
    document.getElementById("btnDepositar").disabled = !estado;
    document.getElementById("btnSacar").disabled = !estado;
    document.getElementById("btnSaldo").disabled = !estado;
    document.getElementById("btnMov").disabled = !estado;
    document.getElementById("btnEncerrar").disabled = !estado;
    document.getElementById("btnTrocar").disabled = !estado;
}

/* ------------------------------------------------------------
                    Função de depósito
------------------------------------------------------------ */

    function depositar() {
        if (!contaAtiva()) return;
    const valor = parseFloat(prompt("Digite o valor do depósito:"));
    const dataHora = obterDataHoraAtual();
        if (isNaN(valor) || valor <= 0) {
alert("Valor inválido!");
return;
    }
    conta.saldo += valor;

// Registra movimentação com data/hora para poupança
    if (conta.tipoConta === "poupanca") {
        conta.dataUltimoDeposito = dataHora;
    }

    movimentacoes.push(`${obterDataHoraFormatada(dataHora)} Depósito de R$ ${valor.toFixed(2)}`);
        document.getElementById("resOperacoes").innerHTML =
    ` Depósito concluído, feito por ${conta.nomeCliente}, Saldo atual: <strong>R$
    ${conta.saldo.toFixed(2)}</strong>`;
    }

//Função pagar Fatura
    function pagarFatura() {
        if (!contaAtiva()) return;
    const valor = parseFloat(prompt("Digite o valor do pagamento da fatura:"));
        if (isNaN(valor) || valor <= 0) {
    alert("Valor inválido!");
    return;
    }

    // Depósito para conta crédito paga a fatura
    if(conta.tipoConta === "credito" && conta.fatura > 0) {
        conta.fatura -= valor;
        alert(`Depósito de R$ ${valor.toFixed(2)} realizado para pagar a fatura. Fatura atual: R$ ${conta.fatura.toFixed(2)}`);
    }
    else if(conta.fatura <= 0){
        conta.fatura = 0;
        alert(`Não há fatura a ser paga!`)
    }

     // Atualiza fatura se for conta de crédito
    if (conta.tipoConta === "credito") {
        mostrarFatura();
    }
}

function comprar() {
    if (!contaAtiva()) return;
    const valor = parseFloat(prompt("Digite o valor da compra:"));
        if (isNaN(valor) || valor <= 0) {
    alert("Valor inválido!");
    return;
    }
    if(conta.tipoConta === "credito") {
        if (valor > conta.limite - conta.fatura) {
            alert("Limite de crédito insuficiente para esta compra.");
            return;
        }   
        conta.fatura += valor;
        alert(`Compra de R$ ${valor.toFixed(2)} realizada com sucesso! Fatura atual: R$ ${conta.fatura.toFixed(2)}`);
        mostrarFatura();
    }
}
/* ------------------------------------------------------------
                        Função de saque
------------------------------------------------------------ */

    function sacar() {
        if (!contaAtiva()) return;
    const valor = parseFloat(prompt("Digite o valor do saque:"));
        if (isNaN(valor) || valor <= 0) {
        alert("Valor inválido");
    return;
    }
        if (valor > conta.saldo) {
        alert("Saldo insuficiente");
    return;
    }
// Definição dos juros para conta poupança
    let valorFinalSaque = valor;
    let juros = 0;
    let aviso = "";
    const dataSaque = obterDataHoraAtual();

    //Caso a conta seja poupança, verifica se há juros
    if (conta.tipoConta === "poupanca" && conta.dataUltimoDeposito) {
        const MILISSEGUNDOS_EM_30_DIAS = 30 * 24 * 60 * 60 * 1000;
        const diferencaTempo = dataSaque.getTime() - conta.dataUltimoDeposito.getTime();
        const ganhouJuros = diferencaTempo >= MILISSEGUNDOS_EM_30_DIAS;

        //Mensagem ao ganhar juros ou não
        if (ganhouJuros) {
            juros = valor * 0.05;
            valorFinalSaque = valor + juros;
            aviso = `Parabéns! Seu depósito foi feito há mais de 30 dias. Você ganhou juros de 5% (R$ ${juros.toFixed(2)}) sobre o saque.`;
        } else {
            aviso = `Atenção: O saque está sendo feito antes de 30 dias do último depósito. Você NÃO ganhará juros de 5% sobre este saque.`;
        }

        // Sistema de aviso e confirmação
        if (juros > 0) {
            const confirma = confirm(`${aviso}\n\nO valor total a ser debitado será de R$ ${valor.toFixed(2)} (saque) + R$ ${juros.toFixed(2)} (juros) = R$ ${valorFinalSaque.toFixed(2)}.\n\nDeseja continuar com o saque?`);
            if (!confirma) {
                alert("Saque cancelado pelo usuário.");
                return;
            }
        } else {
            const confirma = confirm(`${aviso}\n\nO valor do saque será de R$ ${valor.toFixed(2)} e NÃO haverá juros.\n\nDeseja continuar com o saque mesmo assim?`);
            if (!confirma) {
                alert("Saque cancelado pelo usuário.");
                return;
            }
        }
    }

    conta.saldo -= valorFinalSaque;

// Registra movimentação com data/hora
    let registroMovimentacao = `Saque de R$ ${valor.toFixed(2)}`;
    if (juros > 0) {
        registroMovimentacao += ` (com juros de R$ ${juros.toFixed(2)})`;
    }

    movimentacoes.push(`${obterDataHoraFormatada(dataSaque)} ${registroMovimentacao}`);
        document.getElementById("resOperacoes").innerHTML =
        ` Saque realizado, por ${conta.nomeCliente},  Saldo atual: <strong>R$
    ${conta.saldo.toFixed(2)}</strong>`;
    }

/* ------------------------------------------------------------
            Função para exibir o saldo atual
------------------------------------------------------------ */

    function verSaldo() {
        if (!contaAtiva()) return;
    document.getElementById("resOperacoes").innerHTML =
        `Conta de ${conta.nomeCliente},  Saldo atual de: <strong>R$ ${conta.saldo.toFixed(2)}</strong>, Faltam exatamente ${conta.tipoConta === "poupanca" && conta.dataUltimoDeposito ? Math.max(0, 30 - Math.floor((obterDataHoraAtual() - conta.dataUltimoDeposito) / (1000 * 60 * 60 * 24))) : 'N/A'} dias para ganhar juros no próximo saque.`;
    }

/* ------------------------------------------------------------
    Função para listar todas as movimentações registradas
------------------------------------------------------------ */
    function listarMovimentos() {
        if (!contaAtiva()) return;
        if (movimentacoes.length === 0) {
    document.getElementById("resOperacoes").innerHTML =
        "Nenhuma movimentação registrada no sistema.";
        return;
    }
    // Construção do cabeçalho para melhor exibição;
    const cabecalho = `
    <strong> Cliente: </strong> ${conta.nomeCliente} |
    <strong> Tipo de Conta: </strong> ${conta.tipoConta} 
    <hr> `;
    // Lista de movimentações formatada
        const lista = movimentacoes.join("<br>" );
    document.getElementById("resOperacoes").innerHTML =
        `${cabecalho} <strong>📜 Movimentações:</strong><br> ${lista}`;
    }

/* ------------------------------------------------------------
        Função para encerrar a conta e limpar os dados
------------------------------------------------------------ */

    function encerrarConta() {
        if (!contaAtiva()) return;
    const confirma = confirm("Tem certeza que deseja encerrar sua conta?");
        if (confirma) {
        conta.ativa = false;
    document.getElementById("resOperacoes").innerHTML =
        `Conta de <strong>${conta.nomeCliente}</strong> encerrada.`;

// Reseta campos e interface

    document.getElementById("nome").value = "";
    document.getElementById("tipoConta").value = "corrente";
    document.getElementById("nome").disabled = false;
    document.getElementById("tipoConta").disabled = false;
    document.getElementById("btnAbrir").disabled = false;
    habilitarOperacoes(false);

// Limpa dados da conta e movimentações

    conta = null;
    movimentacoes = [];
    document.getElementById("resConta").innerHTML = "";
    }
}

/* ------------------------------------------------------------
    Função auxiliar que verifica se há conta ativa
------------------------------------------------------------ */

    function contaAtiva() {
        if (!conta || !conta.ativa) {
    alert("Nenhuma conta logada. Logue em sua conta ou crie uma.");
        return false;
    }
        return true;
}

/* ------------------------------------------------------------
    Função que troca de conta.
------------------------------------------------------------ */

function trocarConta() {
    if (conta && conta.ativa) {
    const confirma = confirm("Você tem uma conta ativa. Deseja trocar de conta?");

// Reseta campos e interface
    document.getElementById("nome").value = "";
    document.getElementById("tipoConta").value = "corrente";
    document.getElementById("nome").disabled = false;
    document.getElementById("tipoConta").disabled = false;
    document.getElementById("btnAbrir").disabled = false;

    habilitarOperacoes(false);


        if (!confirma) return;
    }
}
// Função para mostrar a hora atual no sistema
function mostrarHora() {
    const agora = new Date(); // pega data e hora atuais
    const horas = agora.getHours().toString().padStart(2, '0');
    const minutos = agora.getMinutes().toString().padStart(2, '0');
    const segundos = agora.getSeconds().toString().padStart(2, '0');
    const data = agora.toLocaleDateString('pt-BR');

    const horaFormatada = `${horas}:${minutos}:${segundos}`;
    document.getElementById("hora").textContent = horaFormatada, data;
  }

  setInterval(mostrarHora, 1000);

  mostrarHora();

// Área para mostrar a fatura atual da conta crédito
  function mostrarFatura() {
    if (!contaAtiva()) return;
    document.getElementById("resOperacoesCredito").innerHTML =
    `Cliente: <strong>${conta.nomeCliente}</strong><br>
    Tipo de Conta: <strong>${conta.tipoConta}</strong><br>
    Fatura Atual: <strong>R$ ${conta.fatura.toFixed(2)}</strong><br>
    Limite de Crédito: <strong>R$ ${conta.limite.toFixed(2)}</strong>`;
  }
 