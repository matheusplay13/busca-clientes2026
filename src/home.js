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
        <span style="opacity: 0.8;">Visite nosso sistema de gestão</span>
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

// Adicionar evento de load para verificar usuário logado
window.addEventListener('load', verificarUsuarioLogado);
