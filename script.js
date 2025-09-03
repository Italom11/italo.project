const tiposCabine = [
    { id: 1, nome: "Cabine Simples", capacidade: 1, preco: 500.00 },
    { id: 2, nome: "Cabine Dupla", capacidade: 2, preco: 900.00 },
    { id: 3, nome: "Cabine Luxo", capacidade: 3, preco: 1500.00 },
    { id: 4, nome: "Suite Familiar", capacidade: 4, preco: 2000.00 },
    { id: 5, nome: "Suite Premium", capacidade: 5, preco: 3000.00 }
];

let todasAsReservas = [];

const tabelaCabinesBody = document.querySelector('#tabela-cabines tbody');
const selectTipoCabine = document.getElementById('tipoCabine');
const formReserva = document.getElementById('form-reserva');
const detalhesReservaDiv = document.getElementById('detalhes-reserva');
const novaReservaBtn = document.getElementById('novaReservaBtn');
const listaTodasReservasUl = document.getElementById('lista-todas-reservas');

function exibirCabines() {
    tabelaCabinesBody.innerHTML = '';
    selectTipoCabine.innerHTML = '<option value="">Selecione...</option>';

    tiposCabine.forEach(cabine => {
        const row = tabelaCabinesBody.insertRow();
        row.insertCell(0).textContent = cabine.id;
        row.insertCell(1).textContent = cabine.nome;
        row.insertCell(2).textContent = `${cabine.capacidade} pessoa(s)`;
        row.insertCell(3).textContent = `R$ ${cabine.preco.toFixed(2)}`;

        const option = document.createElement('option');
        option.value = cabine.id;
        option.textContent = `${cabine.nome} (R$ ${cabine.preco.toFixed(2)} por pessoa)`;
        selectTipoCabine.appendChild(option);
    });
}

function calcularValorReserva(tipoCabineId, qtdPessoas) {
    const cabine = tiposCabine.find(c => c.id === parseInt(tipoCabineId));
    if (!cabine) return 0;
    return cabine.preco * qtdPessoas;
}

function exibirResumoReserva(reserva) {
    const periodoTexto = document.querySelector(`#periodoViagem option[value="${reserva.periodo}"]`).textContent;
    const trajetoTexto = document.querySelector(`#trajetoNavio option[value="${reserva.trajeto}"]`).textContent;
    const tipoCabineNome = tiposCabine.find(c => c.id === reserva.tipoCabineId).nome;

    detalhesReservaDiv.innerHTML = `
        <p><strong>Cliente:</strong> ${reserva.nomeCliente}</p>
        <p><strong>Tipo de Cabine:</strong> ${tipoCabineNome}</p>
        <p><strong>Quantidade de Pessoas:</strong> ${reserva.qtdPessoas}</p>
        <p><strong>Período:</strong> ${periodoTexto}</p>
        <p><strong>Trajeto:</strong> ${trajetoTexto}</p>
        <p><strong>Valor Total:</strong> R$ ${reserva.valorTotal.toFixed(2)}</p>
        ${reserva.descontoLotacao > 0 ? `<p><em>Desconto por Lotação Máxima: R$ ${reserva.descontoLotacao.toFixed(2)}</em></p>` : ''}
        ${reserva.descontoPagamento > 0 ? `<p><em>Desconto por Pagamento (Pix): R$ ${reserva.descontoPagamento.toFixed(2)}</em></p>` : ''}
    `;
    formReserva.style.display = 'none';
    detalhesReservaDiv.style.display = 'block';
    novaReservaBtn.style.display = 'block';
}

function exibirTodasAsReservas() {
    listaTodasReservasUl.innerHTML = '';
    if (todasAsReservas.length === 0) {
        listaTodasReservasUl.innerHTML = '<p>Nenhuma reserva realizada ainda.</p>';
        return;
    }

    todasAsReservas.forEach((reserva, index) => {
        const periodoTexto = document.querySelector(`#periodoViagem option[value="${reserva.periodo}"]`).textContent;
        const trajetoTexto = document.querySelector(`#trajetoNavio option[value="${reserva.trajeto}"]`).textContent;
        const tipoCabineNome = tiposCabine.find(c => c.id === reserva.tipoCabineId).nome;

        const li = document.createElement('li');
        li.innerHTML = `
            <strong>Reserva ${index + 1}:</strong><br>
            Cliente: ${reserva.nomeCliente}<br>
            Tipo: ${tipoCabineNome}<br>
            Pessoas: ${reserva.qtdPessoas}<br>
            Período: ${periodoTexto}<br>
            Trajeto: ${trajetoTexto}<br>
            Valor: R$ ${reserva.valorTotal.toFixed(2)}
        `;
        listaTodasReservasUl.appendChild(li);
    });
}

formReserva.addEventListener('submit', function(event) {
    event.preventDefault();

    const tipoCabineId = parseInt(selectTipoCabine.value);
    const qtdPessoas = parseInt(document.getElementById('qtdPessoas').value);
    const nomeCliente = document.getElementById('nomeCliente').value;
    const periodoViagem = parseInt(document.getElementById('periodoViagem').value);
    const trajetoNavio = parseInt(document.getElementById('trajetoNavio').value);
    const formaPagamento = parseInt(document.getElementById('formaPagamento').value);

    const cabineSelecionada = tiposCabine.find(c => c.id === tipoCabineId);

    if (qtdPessoas > cabineSelecionada.capacidade) {
        alert(`A quantidade de pessoas (${qtdPessoas}) excede a capacidade máxima da ${cabineSelecionada.nome} (${cabineSelecionada.capacidade}).`);
        return;
    }

    let valorBase = calcularValorReserva(tipoCabineId, qtdPessoas);
    let descontoLotacao = 0;
    let descontoPagamento = 0;
    let valorFinal = valorBase;

    if (qtdPessoas === cabineSelecionada.capacidade) {
        descontoLotacao = valorBase * 0.10;
        valorFinal -= descontoLotacao;
        alert("Desconto de 10% aplicado por lotação máxima!");
    }

    if (formaPagamento === 3) {
        descontoPagamento = valorFinal * 0.05;
        valorFinal -= descontoPagamento;
        alert("Desconto de 5% aplicado para pagamento com Pix!");
    }

    const novaReserva = {
        nomeCliente,
        tipoCabineId,
        qtdPessoas,
        periodo: periodoViagem,
        trajeto: trajetoNavio,
        formaPagamento,
        valorTotal: valorFinal,
        descontoLotacao,
        descontoPagamento
    };

    todasAsReservas.push(novaReserva);
    exibirResumoReserva(novaReserva);
    exibirTodasAsReservas();
});

novaReservaBtn.addEventListener('click', function() {
    formReserva.reset();
    formReserva.style.display = 'grid';
    detalhesReservaDiv.style.display = 'none';
    novaReservaBtn.style.display = 'none';
});

document.addEventListener('DOMContentLoaded', () => {
    exibirCabines();
    exibirTodasAsReservas();
});