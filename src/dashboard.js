// Função de logout
function fazerLogout() {
  console.log('Fazendo logout...');
  localStorage.removeItem('usuarioLogado');
  atualizarUserInfo();
  alert('Logout realizado com sucesso!');
  window.location.href = 'login.html';
}

// Atualizar informações do usuário na tela
function atualizarUserInfo() {
  const userInfo = document.getElementById('userInfo');
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');
  
  if (usuarioLogado) {
    userInfo.innerHTML = `
      <div style="background: rgba(255,255,255,0.2); padding: 0.5rem 1rem; border-radius: 20px; display: inline-block;">
        <span style="font-weight: 600;">👤 ${usuarioLogado.nome}</span> 
        <button onclick="fazerLogout()" style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); color: white; border: none; padding: 0.3rem 0.8rem; border-radius: 12px; margin-left: 1rem; cursor: pointer; font-size: 0.9rem;">Sair</button>
      </div>
    `;
  } else {
    userInfo.innerHTML = `
      <div style="background: rgba(255,255,255,0.1); padding: 0.5rem 1rem; border-radius: 20px; display: inline-block;">
        <span style="opacity: 0.8;">Dashboard do Sistema</span>
      </div>
    `;
  }
}

// Verificar login ao carregar a página
function verificarUsuarioLogado() {
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');
  
  if (usuarioLogado) {
    console.log('Usuário já logado:', usuarioLogado.nome);
    atualizarUserInfo();
  } else {
    console.log('Nenhum usuário logado');
    atualizarUserInfo();
  }
}

// Carregar estatísticas do dashboard
function carregarEstatisticas() {
  const clientes = JSON.parse(localStorage.getItem('clientes') || '[]');
  const produtos = JSON.parse(localStorage.getItem('produtos') || '[]');
  
  // Atualizar cards de estatísticas
  document.getElementById('totalClientes').textContent = clientes.length;
  document.getElementById('totalProdutos').textContent = produtos.length;
  
  // Calcular total em estoque
  const totalEstoque = produtos.reduce((sum, produto) => sum + (produto.quantidade || 0), 0);
  document.getElementById('totalEstoque').textContent = totalEstoque;
  
  // Calcular valor total
  const valorTotal = produtos.reduce((sum, produto) => sum + ((produto.preco || 0) * (produto.quantidade || 0)), 0);
  document.getElementById('valorTotal').textContent = `R$ ${valorTotal.toFixed(2)}`;
  
  // Criar gráficos
  criarGraficoCategorias(produtos);
  criarGraficoEstoque(produtos);
  
  // Mostrar produtos com estoque baixo
  verificarEstoqueBaixo(produtos);
  
  // Adicionar atividade recente
  adicionarAtividade('📊', 'Dashboard carregado com sucesso', 'Agora');
}

// Criar gráfico de categorias
function criarGraficoCategorias(produtos) {
  const ctx = document.getElementById('categoriaChart').getContext('2d');
  
  // Contar produtos por categoria
  const categorias = {};
  produtos.forEach(produto => {
    const categoria = produto.categoria || 'outros';
    categorias[categoria] = (categorias[categoria] || 0) + 1;
  });
  
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: Object.keys(categorias).map(cat => {
        const nomes = {
          'eletronicos': 'Eletrônicos',
          'moveis': 'Móveis',
          'roupas': 'Roupas',
          'alimentos': 'Alimentos',
          'livros': 'Livros',
          'brinquedos': 'Brinquedos',
          'esportes': 'Esportes',
          'outros': 'Outros'
        };
        return nomes[cat] || cat;
      }),
      datasets: [{
        data: Object.values(categorias),
        backgroundColor: [
          '#667eea',
          '#764ba2',
          '#f093fb',
          '#4facfe',
          '#43e97b',
          '#fa709a',
          '#fee140',
          '#30cfd0'
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}

// Criar gráfico de estoque
function criarGraficoEstoque(produtos) {
  const ctx = document.getElementById('estoqueChart').getContext('2d');
  
  // Pegar os 10 produtos com mais estoque
  const produtosOrdenados = produtos
    .sort((a, b) => (b.quantidade || 0) - (a.quantidade || 0))
    .slice(0, 10);
  
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: produtosOrdenados.map(p => p.nome_produto || 'Sem nome'),
      datasets: [{
        label: 'Quantidade em Estoque',
        data: produtosOrdenados.map(p => p.quantidade || 0),
        backgroundColor: 'rgba(102, 126, 234, 0.8)',
        borderColor: 'rgba(102, 126, 234, 1)',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });
}

// Verificar produtos com estoque baixo
function verificarEstoqueBaixo(produtos) {
  const tbody = document.getElementById('tabelaEstoqueBaixo');
  const produtosBaixo = produtos.filter(p => (p.quantidade || 0) < 5);
  
  if (produtosBaixo.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; padding: 2rem;">
          ✅ Nenhum produto com estoque baixo no momento.
        </td>
      </tr>
    `;
    return;
  }
  
  tbody.innerHTML = produtosBaixo.map(produto => `
    <tr>
      <td>${produto.id_produto || 'N/A'}</td>
      <td>${produto.nome_produto || 'Sem nome'}</td>
      <td>${produto.quantidade || 0}</td>
      <td>
        <span class="status-badge ${produto.quantidade < 3 ? 'status-critical' : 'status-warning'}">
          ${produto.quantidade < 3 ? '🔴 Crítico' : '🟡 Baixo'}
        </span>
      </td>
      <td>
        <button class="btn-small" onclick="reporEstoque('${produto.id_produto}')">
          📦 Repor
        </button>
      </td>
    </tr>
  `).join('');
}

// Repor estoque de um produto
function reporEstoque(produtoId) {
  const quantidade = prompt('Digite a quantidade a adicionar ao estoque:');
  if (!quantidade || isNaN(quantidade) || quantidade <= 0) {
    alert('Digite uma quantidade válida!');
    return;
  }
  
  const produtos = JSON.parse(localStorage.getItem('produtos') || '[]');
  const produtoIndex = produtos.findIndex(p => p.id_produto === produtoId);
  
  if (produtoIndex !== -1) {
    produtos[produtoIndex].quantidade += parseInt(quantidade);
    localStorage.setItem('produtos', JSON.stringify(produtos));
    
    adicionarAtividade('📦', `Estoque repostido: +${quantidade} unidades`, 'Agora');
    carregarEstatisticas(); // Recarregar dashboard
    
    alert('Estoque atualizado com sucesso!');
  }
}

// Adicionar atividade recente
function adicionarAtividade(icon, texto, tempo) {
  const listaAtividades = document.getElementById('listaAtividades');
  const novaAtividade = document.createElement('div');
  novaAtividade.className = 'activity-item';
  novaAtividade.innerHTML = `
    <div class="activity-icon">${icon}</div>
    <div class="activity-content">
      <p class="activity-text">${texto}</p>
      <span class="activity-time">${tempo}</span>
    </div>
  `;
  
  listaAtividades.insertBefore(novaAtividade, listaAtividades.firstChild);
  
  // Manter apenas as 5 atividades mais recentes
  while (listaAtividades.children.length > 5) {
    listaAtividades.removeChild(listaAtividades.lastChild);
  }
}

// Funções de navegação
function irParaBusca() {
  console.log('Indo para busca de clientes...');
  window.location.href = 'index.html';
}

function irParaCadastro() {
  console.log('Indo para cadastro...');
  window.location.href = 'cadastro.html';
}

function irParaLogin() {
  console.log('Indo para login...');
  window.location.href = 'login.html';
}

function irParaProdutos() {
  console.log('Indo para cadastro de produtos...');
  window.location.href = 'produtos.html';
}

function voltarAoInicio() {
  console.log('Voltando ao início...');
  window.location.href = 'home.html';
}

// Adicionar evento de load para verificar usuário logado e carregar dashboard
window.addEventListener('load', () => {
  verificarUsuarioLogado();
  carregarEstatisticas();
});
