document.addEventListener('DOMContentLoaded', function () {
    let currentTab = 0;
    showTab(currentTab);

    function showTab(n) {
        const tabs = document.querySelectorAll('.tab');
        tabs.forEach((tab, index) => {
            tab.classList.toggle('active', index === n);
        });
        document.getElementById('prevBtn').style.display = n === 0 ? 'none' : 'inline';
        document.getElementById('nextBtn').textContent = n === (tabs.length - 1) ? 'Enviar' : 'Próximo';
    }

    function nextPrev(n) {
        const tabs = document.querySelectorAll('.tab');
        if (n === 1 && !validateTab()) return false;
        tabs[currentTab].classList.remove('active');
        currentTab += n;
        if (currentTab >= tabs.length) {
            saveForm();
            return false;
        }
        showTab(currentTab);
    }

    function validateTab() {
        const tab = document.querySelectorAll('.tab')[currentTab];
        const inputs = tab.querySelectorAll('input, select, textarea');
        let valid = true;
        inputs.forEach(input => {
            if (!input.checkValidity()) {
                input.classList.add('invalid');
                valid = false;
            } else {
                input.classList.remove('invalid');
            }
        });
        return valid;
    }

    document.getElementById('prevBtn').addEventListener('click', function() {
        nextPrev(-1);
    });

    document.getElementById('nextBtn').addEventListener('click', function() {
        nextPrev(1);
    });

    function saveForm() {
        const form = document.getElementById('formCadastro');
        const nome = form.querySelector('#nome').value.trim();
        const data = form.querySelector('#data').value.trim();
        const localPartida = form.querySelector('#localPartida').value.trim();
        const destino = form.querySelector('#destino').value.trim();
        const tipoLimpeza = form.querySelector('#tipoLimpeza').value;
        const equipamentos = form.querySelector('#equipamentos').value.trim();
        const numParticipantes = form.querySelector('#numParticipantes').value.trim();
        const duracao = form.querySelector('#duracao').value.trim();
        const descricao = form.querySelector('#descricao').value.trim();
        const responsavel = form.querySelector('#responsavel').value.trim();
        const contato = form.querySelector('#contato').value.trim();

        if (validateForm(nome, data, localPartida, destino, tipoLimpeza, equipamentos, numParticipantes, duracao, responsavel, contato)) {
            let viagens = JSON.parse(localStorage.getItem('viagens')) || [];
            const novaViagem = {
                nome,
                data,
                localPartida,
                destino,
                tipoLimpeza,
                equipamentos,
                numParticipantes,
                duracao,
                descricao,
                responsavel,
                contato
            };
            viagens.push(novaViagem);
            localStorage.setItem('viagens', JSON.stringify(viagens));
            showMessage('Viagem cadastrada com sucesso!', 'success');
            form.reset();
            currentTab = 0;
            showTab(currentTab);
            atualizarListaViagens();
            gerarRelatorio();
        }
    }

    function validateForm(nome, data, localPartida, destino, tipoLimpeza, equipamentos, numParticipantes, duracao, responsavel, contato) {
        const feedback = document.getElementById('feedback');
        feedback.innerHTML = '';
        if (!nome || !data || !localPartida || !destino || !tipoLimpeza || !equipamentos || !numParticipantes || !duracao || !responsavel || !contato) {
            showMessage('Por favor, preencha todos os campos obrigatórios.', 'error');
            return false;
        }
        if (!/^[a-zA-Z\sà-úÀ-Ú]*$/.test(nome)) {
            showMessage('Nome da viagem deve conter apenas letras e espaços.', 'error');
            return false;
        }
        if (!/^[a-zA-Z\sà-úÀ-Ú]*$/.test(localPartida)) {
            showMessage('Local de partida deve conter apenas letras e espaços.', 'error');
            return false;
        }
        if (!/^[a-zA-Z\sà-úÀ-Ú]*$/.test(destino)) {
            showMessage('Destino deve conter apenas letras e espaços.', 'error');
            return false;
        }
        if (!/^\d{10,11}$/.test(contato)) {
            showMessage('Contato deve conter apenas números (10 ou 11 dígitos).', 'error');
            return false;
        }
        return true;
    }

    function showMessage(message, type) {
        const feedback = document.getElementById('feedback');
        feedback.textContent = message;
        feedback.className = type;
        feedback.style.display = 'block';
        setTimeout(() => {
            feedback.style.display = 'none';
        }, 3000);
    }

    function atualizarListaViagens() {
        const lista = document.getElementById('listaViagens');
        lista.innerHTML = '';
        let viagens = JSON.parse(localStorage.getItem('viagens')) || [];
        viagens.forEach(viagem => {
            const item = document.createElement('div');
            item.className = 'itemViagem';
            item.innerHTML = `
                <h3>${viagem.nome}</h3>
                <p>Data: ${viagem.data}</p>
                <p>Partida: ${viagem.localPartida}</p>
                <p>Destino: ${viagem.destino}</p>
                <p>Tipo de Limpeza: ${viagem.tipoLimpeza}</p>
                <p>Equipamentos: ${viagem.equipamentos}</p>
                <p>Participantes: ${viagem.numParticipantes}</p>
                <p>Duração: ${viagem.duracao} horas</p>
                <p>Responsável: ${viagem.responsavel}</p>
                <p>Contato: ${viagem.contato}</p>
                <button class="excluir" data-id="${viagem.nome}" aria-label="Excluir viagem"></button>
            `;
            lista.appendChild(item);
        });
    }

    document.getElementById('listaViagens').addEventListener('click', function(event) {
        if (event.target.classList.contains('excluir')) {
            const id = event.target.dataset.id;
            let viagens = JSON.parse(localStorage.getItem('viagens')) || [];
            viagens = viagens.filter(viagem => viagem.nome !== id);
            localStorage.setItem('viagens', JSON.stringify(viagens));
            event.target.parentElement.remove();
            gerarRelatorio();
        }
    });

    document.getElementById('busca').addEventListener('input', function() {
        const termo = this.value.toLowerCase();
        const lista = document.getElementById('listaViagens');
        lista.innerHTML = '';
        const viagens = JSON.parse(localStorage.getItem('viagens')) || [];
        viagens.forEach(viagem => {
            if (viagem.nome.toLowerCase().includes(termo) || viagem.destino.toLowerCase().includes(termo)) {
                const item = document.createElement('div');
                item.className = 'itemViagem';
                item.innerHTML = `
                    <h3>${viagem.nome}</h3>
                    <p>Data: ${viagem.data}</p>
                    <p>Partida: ${viagem.localPartida}</p>
                    <p>Destino: ${viagem.destino}</p>
                    <p>Tipo de Limpeza: ${viagem.tipoLimpeza}</p>
                    <p>Equipamentos: ${viagem.equipamentos}</p>
                    <p>Participantes: ${viagem.numParticipantes}</p>
                    <p>Duração: ${viagem.duracao} horas</p>
                    <p>Responsável: ${viagem.responsavel}</p>
                    <p>Contato: ${viagem.contato}</p>
                    <button class="excluir" data-id="${viagem.nome}" aria-label="Excluir viagem"></button>
                `;
                lista.appendChild(item);
            }
        });
    });

    function gerarRelatorio() {
        let viagens = JSON.parse(localStorage.getItem('viagens')) || [];
        const totalViagens = viagens.length;
        const destinos = {};
        const meses = {};
        viagens.forEach(viagem => {
            destinos[viagem.destino] = (destinos[viagem.destino] || 0) + 1;
            const mes = new Date(viagem.data).getMonth();
            meses[mes] = (meses[mes] || 0) + 1;
        });
        const destinoMaisFrequente = Object.keys(destinos).reduce((a, b) => destinos[a] > destinos[b] ? a : b, '');
        const mesMaisViagens = Object.keys(meses).reduce((a, b) => meses[a] > meses[b] ? a : b, '');

        document.getElementById('totalViagens').textContent = `Total de Viagens: ${totalViagens}`;
        
        gerarGraficoDestinos(destinos);
        gerarGraficoMeses(meses);
        
        mostrarDadosResumo(totalViagens, destinoMaisFrequente, mesMaisViagens);
    }

    let destinosChart;
    let mesesChart;

    function gerarGraficoDestinos(destinos) {
        const ctx = document.getElementById('destinosChart').getContext('2d');
        if (destinosChart) destinosChart.destroy();
        destinosChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(destinos),
                datasets: [{
                    label: 'Número de Viagens',
                    data: Object.values(destinos),
                    backgroundColor: 'rgba(39, 174, 96, 0.2)',
                    borderColor: 'rgba(39, 174, 96, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'Destinos Mais Frequentes'
                    },
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.raw}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    function gerarGraficoMeses(meses) {
        const ctx = document.getElementById('mesesChart').getContext('2d');
        if (mesesChart) mesesChart.destroy();
        mesesChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Object.keys(meses).map(mes => new Date(0, mes).toLocaleString('pt-BR', { month: 'long' })),
                datasets: [{
                    label: 'Número de Viagens',
                    data: Object.values(meses),
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    borderColor: 'rgba(52, 152, 219, 1)',
                    borderWidth: 1,
                    fill: true
                }]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'Viagens por Mês'
                    },
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.raw}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    function mostrarDadosResumo(totalViagens, destinoMaisFrequente, mesMaisViagens) {
        const resumo = document.getElementById('dadosResumo');
        resumo.innerHTML = `
            <p>Total de Viagens: ${totalViagens}</p>
            <p>Destino Mais Frequente: ${destinoMaisFrequente}</p>
            <p>Mês com Mais Viagens: ${mesMaisViagens}</p>
        `;
    }

    document.getElementById('downloadPDF').addEventListener('click', async function() {
        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF('p', 'pt', 'a4');
            const totalViagens = document.getElementById('totalViagens').textContent;
    
            // Cabeçalho sem a imagem do logo
            doc.setFontSize(22);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(40, 78, 120);
            doc.text('Relatório de Viagens', 40, 50);
            doc.setDrawColor(40, 78, 120);
            doc.line(40, 60, 550, 60);
    
            // Total de Viagens
            doc.setFontSize(16);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(0, 0, 0);
            doc.text(totalViagens, 40, 80);
    
            // Gráficos
            const destinosChartElement = document.getElementById('destinosChart');
            const mesesChartElement = document.getElementById('mesesChart');
    
            if (!destinosChartElement || !mesesChartElement) {
                console.error('Elementos de gráfico não encontrados');
                return;
            }
    
            const destinosChartCanvas = await html2canvas(destinosChartElement, { scale: 2 });
            const destinosChartData = destinosChartCanvas.toDataURL('image/png');
            doc.addImage(destinosChartData, 'PNG', 40, 100, 520, 280);
    
            const mesesChartCanvas = await html2canvas(mesesChartElement, { scale: 2 });
            const mesesChartData = mesesChartCanvas.toDataURL('image/png');
            doc.addImage(mesesChartData, 'PNG', 40, 400, 520, 280);
    
            // Informações das Viagens
            let viagens = JSON.parse(localStorage.getItem('viagens')) || [];
            let startY = 700;
            const cellWidth = 140; // Largura da célula ajustada
            const cellHeight = 25; // Altura da célula ajustada
            const cellPadding = 5; // Padding ajustado
            const rowHeight = 20; // Altura da linha ajustada
    
            viagens.forEach((viagem, index) => {
                if (startY + 220 > doc.internal.pageSize.height) {
                    doc.addPage();
                    startY = 50;
                }
                doc.setFontSize(14);
                doc.setFont('helvetica', 'bold');
                doc.text(`Viagem ${index + 1}:`, 40, startY);
                startY += 20;
                
                const tableData = [
                    ['Nome', 'Data', 'Partida', 'Destino'],
                    [viagem.nome, viagem.data, viagem.localPartida, viagem.destino],
                    ['Tipo de Limpeza', 'Equipamentos', 'Participantes', 'Duração'],
                    [viagem.tipoLimpeza, viagem.equipamentos, viagem.numParticipantes, viagem.duracao]
                ];
                drawTable(doc, 40, startY, tableData, cellWidth, cellHeight, cellPadding);
                startY += cellHeight * tableData.length + 20;
    
                doc.setFontSize(12);
                doc.setFont('helvetica', 'normal');
                doc.text('Descrição:', 40, startY);
                startY += 15;
                doc.text(viagem.descricao, 40, startY);
                startY += 20;
    
                doc.text('Responsável:', 40, startY);
                startY += 15;
                doc.text(viagem.responsavel, 40, startY);
                startY += 20;
    
                doc.text('Contato:', 40, startY);
                startY += 15;
                doc.text(viagem.contato, 40, startY);
                startY += rowHeight + 20; // Ajustado para mais espaçamento entre blocos
            });
    
            doc.save('relatorio_viagens.pdf');
        } catch (error) {
            console.error('Erro ao gerar o PDF:', error);
        }
    });
    
    function drawTable(doc, startX, startY, data, cellWidth, cellHeight, cellPadding) {
        doc.setFontSize(12);
        data.forEach((row, rowIndex) => {
            row.forEach((cell, cellIndex) => {
                const x = startX + (cellWidth * cellIndex);
                const y = startY + (cellHeight * rowIndex);
                doc.rect(x, y, cellWidth, cellHeight);
                doc.text(cell, x + cellPadding, y + cellHeight / 2 + 5);
            });
        });
    }

    document.getElementById('atualizarDestinos').addEventListener('click', () => {
        gerarRelatorio();
        const btn = document.getElementById('atualizarDestinos');
        btn.classList.add('rotate');
        setTimeout(() => {
            btn.classList.remove('rotate');
        }, 1000);
    });

    document.getElementById('atualizarMeses').addEventListener('click', () => {
        gerarRelatorio();
        const btn = document.getElementById('atualizarMeses');
        btn.classList.add('rotate');
        setTimeout(() => {
            btn.classList.remove('rotate');
        }, 1000);
    });

    atualizarListaViagens();
    gerarRelatorio();
});
