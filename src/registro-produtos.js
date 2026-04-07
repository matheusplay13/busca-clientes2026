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
        <span style="font-weight: 600;">${usuarioLogado.nome}</span> 
        <button onclick="fazerLogout()" style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); color: white; border: none; padding: 0.3rem 0.8rem; border-radius: 12px; margin-left: 1rem; cursor: pointer; font-size: 0.9rem;">Sair</button>
      </div>
    `;
  } else {
    userInfo.innerHTML = `
      <div style="background: rgba(255,255,255,0.1); padding: 0.5rem 1rem; border-radius: 20px; display: inline-block;">
        <span style="opacity: 0.8;">Registro de Produtos</span>
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

// Carregar produtos do localStorage
function carregarProdutos() {
  const produtos = JSON.parse(localStorage.getItem('produtos') || '[]');
  return produtos;
}

// Mostrar todos os produtos na tabela
function mostrarTodosProdutos() {
  const produtos = carregarProdutos();
  atualizarEstatisticas(produtos);
  exibirProdutosNaTabela(produtos);
}

// Atualizar estatísticas
function atualizarEstatisticas(produtos) {
  // Total de produtos
  document.getElementById('totalProdutos').textContent = produtos.length;
  
  // Total em estoque
  const totalEstoque = produtos.reduce((sum, produto) => sum + (produto.quantidade || 0), 0);
  document.getElementById('totalEstoque').textContent = totalEstoque;
  
  // Valor total
  const valorTotal = produtos.reduce((sum, produto) => sum + ((produto.preco || 0) * (produto.quantidade || 0)), 0);
  document.getElementById('valorTotal').textContent = `R$ ${valorTotal.toFixed(2)}`;
  
  // Estoque baixo
  const estoqueBaixo = produtos.filter(p => (p.quantidade || 0) < 5).length;
  document.getElementById('estoqueBaixo').textContent = estoqueBaixo;
}

// Exibir produtos na tabela
function exibirProdutosNaTabela(produtos) {
  const tbody = document.getElementById('tabelaProdutos');
  
  if (produtos.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; padding: 3rem;">
          <div class="empty-state">
            <span style="font-size: 3rem;">No Products</span>
            <p>Nenhum produto cadastrado ainda.</p>
            <button class="btn-cadastrar" onclick="irParaCadastroProdutos()">
              Cadastrar Primeiro Produto
            </button>
          </div>
        </td>
      </tr>
    `;
    return;
  }
  
  tbody.innerHTML = produtos.map(produto => {
    const quantidade = produto.quantidade || 0;
    const status = getStatusEstoque(quantidade);
    
    return `
      <tr>
        <td>
          <span class="produto-id">${produto.id_produto || 'N/A'}</span>
        </td>
        <td>
          <div class="produto-info">
            <strong>${produto.nome_produto || 'Sem nome'}</strong>
            <small>${produto.descricao || 'Sem descrição'}</small>
          </div>
        </td>
        <td>
          <span class="categoria-badge">${getNomeCategoria(produto.categoria)}</span>
        </td>
        <td>
          <span class="quantidade ${status.class}">${quantidade}</span>
        </td>
        <td>
          <span class="preco">R$ ${(produto.preco || 0).toFixed(2)}</span>
        </td>
        <td>
          <span class="localizacao">${produto.localizacao || 'Não informada'}</span>
        </td>
        <td>
          <span class="status-badge ${status.class}">${status.text}</span>
        </td>
        <td>
          <div class="acoes-tabela">
            <button class="btn-small btn-editar" onclick="editarProduto('${produto.id_produto}')" title="Editar">
              Editar
            </button>
            <button class="btn-small btn-repor" onclick="reporEstoque('${produto.id_produto}')" title="Repor Estoque">
              Repor
            </button>
            <button class="btn-small btn-excluir" onclick="excluirProduto('${produto.id_produto}')" title="Excluir">
              Excluir
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// Obter status do estoque
function getStatusEstoque(quantidade) {
  if (quantidade === 0) {
    return { text: 'Esgotado', class: 'status-critical' };
  } else if (quantidade < 3) {
    return { text: 'Crítico', class: 'status-critical' };
  } else if (quantidade < 5) {
    return { text: 'Baixo', class: 'status-warning' };
  } else if (quantidade < 20) {
    return { text: 'Normal', class: 'status-normal' };
  } else {
    return { text: 'Alto', class: 'status-good' };
  }
}

// Obter nome da categoria
function getNomeCategoria(categoria) {
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
  return nomes[categoria] || categoria || 'Não definida';
}

// Filtrar produtos
function filtrarProdutos() {
  const produtos = carregarProdutos();
  const busca = document.getElementById('buscaProduto').value.toLowerCase();
  const categoria = document.getElementById('filtroCategoria').value;
  const estoque = document.getElementById('filtroEstoque').value;
  
  let produtosFiltrados = produtos;
  
  // Filtro por busca
  if (busca) {
    produtosFiltrados = produtosFiltrados.filter(produto => 
      (produto.nome_produto || '').toLowerCase().includes(busca) ||
      (produto.id_produto || '').toLowerCase().includes(busca) ||
      (produto.descricao || '').toLowerCase().includes(busca)
    );
  }
  
  // Filtro por categoria
  if (categoria) {
    produtosFiltrados = produtosFiltrados.filter(produto => produto.categoria === categoria);
  }
  
  // Filtro por estoque
  if (estoque) {
    produtosFiltrados = produtosFiltrados.filter(produto => {
      const quantidade = produto.quantidade || 0;
      switch (estoque) {
        case 'baixo': return quantidade < 5;
        case 'normal': return quantidade >= 5 && quantidade < 20;
        case 'alto': return quantidade >= 20;
        default: return true;
      }
    });
  }
  
  atualizarEstatisticas(produtosFiltrados);
  exibirProdutosNaTabela(produtosFiltrados);
}

// Repor estoque
function reporEstoque(produtoId) {
  const quantidade = prompt('Digite a quantidade a adicionar ao estoque:');
  if (!quantidade || isNaN(quantidade) || quantidade <= 0) {
    alert('Digite uma quantidade válida!');
    return;
  }
  
  const produtos = carregarProdutos();
  const produtoIndex = produtos.findIndex(p => p.id_produto === produtoId);
  
  if (produtoIndex !== -1) {
    produtos[produtoIndex].quantidade += parseInt(quantidade);
    localStorage.setItem('produtos', JSON.stringify(produtos));
    
    alert(`Estoque atualizado: +${quantidade} unidades`);
    mostrarTodosProdutos();
  }
}

// Editar produto
function editarProduto(produtoId) {
  alert('Funcionalidade de edição em desenvolvimento!');
  // Futuro: abrir modal para edição
}

// Excluir produto
function excluirProduto(produtoId) {
  if (!confirm('Tem certeza que deseja excluir este produto?')) {
    return;
  }
  
  const produtos = carregarProdutos();
  const produtosFiltrados = produtos.filter(p => p.id_produto !== produtoId);
  
  localStorage.setItem('produtos', JSON.stringify(produtosFiltrados));
  
  alert('Produto excluído com sucesso!');
  mostrarTodosProdutos();
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

function irParaCadastroProdutos() {
  console.log('Indo para cadastro de produtos...');
  window.location.href = 'produtos.html';
}

function irParaLogin() {
  console.log('Indo para login...');
  window.location.href = 'login.html';
}

function voltarAoInicio() {
  console.log('Voltando ao início...');
  window.location.href = 'home.html';
}

// Adicionar evento de load para verificar usuário logado e carregar produtos
window.addEventListener('load', () => {
  verificarUsuarioLogado();
  mostrarTodosProdutos();
  
  // Adicionar evento de busca em tempo real
  document.getElementById('buscaProduto').addEventListener('input', filtrarProdutos);
  document.getElementById('filtroCategoria').addEventListener('change', filtrarProdutos);
  document.getElementById('filtroEstoque').addEventListener('change', filtrarProdutos);
});
