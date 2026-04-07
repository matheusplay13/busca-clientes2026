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
        <span style="opacity: 0.8;">Nenhum usuário logado</span>
      </div>
    `;
  }
}

// Gerar ID automático para produto
function gerarIDProduto() {
  const data = new Date();
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  const hora = String(data.getHours()).padStart(2, '0');
  const minuto = String(data.getMinutes()).padStart(2, '0');
  const segundo = String(data.getSeconds()).padStart(2, '0');
  const milissegundo = String(data.getMilliseconds()).padStart(3, '0').slice(0, 2);
  
  return `PRD-${ano}${mes}${dia}-${hora}${minuto}${segundo}${milissegundo}`;
}

// Gerar ID ao carregar a página
function carregarIDProduto() {
  const idInput = document.getElementById('id_produto');
  if (idInput) {
    idInput.value = gerarIDProduto();
  }
}

// Verificar login ao carregar a página
function verificarUsuarioLogado() {
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');
  
  if (usuarioLogado) {
    console.log('Usuário já logado:', usuarioLogado.nome);
    atualizarUserInfo();
    carregarIDProduto();
  } else {
    console.log('Nenhum usuário logado, redirecionando...');
    window.location.href = 'login.html';
  }
}

// Função principal de cadastro de produto
function cadastrarProduto(event) {
  event.preventDefault();
  
  const resultado = document.getElementById('resultado');
  const btnCadastrar = document.getElementById('btnCadastrar');
  const btnText = btnCadastrar.querySelector('.btn-text');
  const btnSpinner = btnCadastrar.querySelector('.btn-spinner');
  
  // Ativar animação de rotação
  btnCadastrar.classList.add('loading');
  btnCadastrar.disabled = true;
  btnText.style.display = 'none';
  btnSpinner.style.display = 'inline-block';
  
  // Coletar dados do formulário
  const produtoData = {
    id_produto: document.getElementById('id_produto').value.trim(),
    nome_produto: document.getElementById('nome_produto').value.trim(),
    descricao: document.getElementById('descricao').value.trim(),
    preco: parseFloat(document.getElementById('preco').value),
    quantidade: parseInt(document.getElementById('quantidade').value),
    categoria: document.getElementById('categoria').value,
    localizacao: document.getElementById('localizacao').value.trim(),
    fornecedor: document.getElementById('fornecedor').value.trim(),
    codigo_barras: document.getElementById('codigo_barras').value.trim(),
    data_cadastro: new Date().toISOString(),
    usuario_cadastro: JSON.parse(localStorage.getItem('usuarioLogado') || '{}').nome || 'Sistema'
  };
  
  console.log('Dados do produto:', produtoData);
  
  // Validações básicas
  if (!produtoData.nome_produto) {
    resultado.innerHTML = '<p class="error">Digite o nome do produto.</p>';
    resetarBotao();
    return;
  }
  
  if (!produtoData.preco || produtoData.preco <= 0) {
    resultado.innerHTML = '<p class="error">Digite um preço válido.</p>';
    resetarBotao();
    return;
  }
  
  if (!produtoData.quantidade || produtoData.quantidade < 0) {
    resultado.innerHTML = '<p class="error">Digite uma quantidade válida.</p>';
    resetarBotao();
    return;
  }
  
  if (!produtoData.categoria) {
    resultado.innerHTML = '<p class="error">Selecione uma categoria.</p>';
    resetarBotao();
    return;
  }
  
  if (!produtoData.localizacao) {
    resultado.innerHTML = '<p class="error">Digite a localização do produto.</p>';
    resetarBotao();
    return;
  }
  
  if (!produtoData.fornecedor) {
    resultado.innerHTML = '<p class="error">Digite o nome do fornecedor.</p>';
    resetarBotao();
    return;
  }
  
  // Salvar no localStorage
  let produtos = JSON.parse(localStorage.getItem('produtos') || '[]');
  produtos.push(produtoData);
  localStorage.setItem('produtos', JSON.stringify(produtos));
  
  console.log('Produto salvo:', produtoData);
  
  // Mostrar sucesso
  resultado.innerHTML = `
    <div class="cliente-card" style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; text-align: center;">
      <h2 style="margin-bottom: 1rem;">Produto Cadastrado com Sucesso!</h2>
      <p><strong>ID:</strong> ${produtoData.id_produto}</p>
      <p><strong>Nome:</strong> ${produtoData.nome_produto}</p>
      <p><strong>Descrição:</strong> ${produtoData.descricao}</p>
      <p><strong>Preço:</strong> R$ ${produtoData.preco.toFixed(2)}</p>
      <p><strong>Quantidade:</strong> ${produtoData.quantidade} unidades</p>
      <p><strong>Categoria:</strong> ${produtoData.categoria}</p>
      <p><strong>Localização:</strong> ${produtoData.localizacao}</p>
      <p><strong>Fornecedor:</strong> ${produtoData.fornecedor}</p>
      ${produtoData.codigo_barras ? `<p><strong>Código de Barras:</strong> ${produtoData.codigo_barras}</p>` : ''}
      <p style="margin-top: 1rem;">Produto adicionado ao estoque!</p>
      <div style="margin-top: 1rem;">
        <button class="btn-cadastrar" onclick="limparFormulario()">Cadastrar Outro</button>
        <button class="btn-voltar" onclick="irParaBusca()">Voltar</button>
      </div>
    </div>
  `;
  
  resetarBotao();
  
  // Limpar formulário e gerar novo ID
  document.getElementById('formProduto').reset();
  carregarIDProduto();
}

// Função para resetar o botão
function resetarBotao() {
  const btnCadastrar = document.getElementById('btnCadastrar');
  const btnText = btnCadastrar.querySelector('.btn-text');
  const btnSpinner = btnCadastrar.querySelector('.btn-spinner');
  
  btnCadastrar.classList.remove('loading');
  btnCadastrar.disabled = false;
  btnText.style.display = 'inline-block';
  btnSpinner.style.display = 'none';
}

// Mostrar mensagem de sucesso
function mostrarSucesso(produto) {
  const resultado = document.getElementById('resultado');
  resultado.innerHTML = `
    <div class="cliente-card" style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; text-align: center;">
      <h2 style="margin-bottom: 1rem;">Produto Cadastrado com Sucesso!</h2>
      <p><strong>ID:</strong> ${produto.id_produto}</p>
      <p><strong>Nome:</strong> ${produto.nome_produto}</p>
      <p><strong>Descrição:</strong> ${produto.descricao}</p>
      <p><strong>Preço:</strong> R$ ${produto.preco.toFixed(2)}</p>
      <p><strong>Quantidade:</strong> ${produto.quantidade} unidades</p>
      <p><strong>Categoria:</strong> ${produto.categoria}</p>
      <p><strong>Localização:</strong> ${produto.localizacao}</p>
      <p><strong>Fornecedor:</strong> ${produto.fornecedor}</p>
      ${produto.codigo_barras ? `<p><strong>Código de Barras:</strong> ${produto.codigo_barras}</p>` : ''}
      <p style="margin-top: 1rem;">Produto adicionado ao estoque!</p>
      <div style="margin-top: 1rem;">
        <button class="btn-cadastrar" onclick="limparFormulario()">Cadastrar Outro</button>
        <button class="btn-voltar" onclick="irParaBusca()">Voltar</button>
      </div>
    </div>
  `;
}

// Limpar formulário
function limparFormulario() {
  document.getElementById('formProduto').reset();
  carregarIDProduto();
  document.getElementById('resultado').innerHTML = '';
}

// Funções de navegação
function irParaBusca() {
  window.location.href = 'index.html';
}

// Função para voltar ao início
function voltarAoInicio() {
  console.log('Voltando ao início...');
  window.location.href = 'home.html';
}

// Adicionar evento de load para verificar usuário logado e gerar ID
window.addEventListener('load', verificarUsuarioLogado);
