// Função principal de login
function fazerLogin(event) {
  event.preventDefault();
  
  const resultado = document.getElementById('resultado');
  resultado.innerHTML = '<div class="loading">Autenticando...</div>';
  
  // Coletar dados do formulário
  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value;
  
  // Validações básicas
  if (!email || !email.includes('@')) {
    resultado.innerHTML = '<p class="error">Digite um email válido.</p>';
    return;
  }
  
  if (!senha || senha.length < 6) {
    resultado.innerHTML = '<p class="error">Digite uma senha com pelo menos 6 caracteres.</p>';
    return;
  }
  
  // Buscar usuários no localStorage
  const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
  const usuario = usuarios.find(u => u.email === email && u.senha === senha);
  
  if (usuario) {
    // Login successful
    localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
    resultado.innerHTML = `
      <div class="cliente-card" style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; text-align: center;">
        <h2 style="margin-bottom: 1rem;">✅ Login Realizado com Sucesso!</h2>
        <p><strong>Bem-vindo(a) ${usuario.nome}!</strong></p>
        <p><strong>Email:</strong> ${usuario.email}</p>
        <button class="btn-login" style="margin-top: 1rem;" onclick="irParaBusca()">Ir para Busca</button>
      </div>
    `;
    
    // Redirecionar após 2 segundos
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 2000);
    
  } else {
    // Login failed
    resultado.innerHTML = `
      <p class="error">Email ou senha incorretos.</p>
      <p style="font-size: 0.9rem; margin-top: 0.5rem;">Deseja se cadastrar?</p>
      <button class="btn-cadastrar" style="margin-top: 0.5rem;" onclick="irParaCadastro()">Fazer Cadastro</button>
    `;
  }
}

// Funções de navegação simples
function irParaCadastro() {
  console.log('Indo para cadastro...');
  window.location.href = 'cadastro.html';
}

function irParaBusca() {
  console.log('Indo para busca...');
  window.location.href = 'index.html';
}

// Verificar se já está logado
function verificarLogin() {
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');
  
  if (usuarioLogado) {
    // Se já está logado, redirecionar para busca
    window.location.href = 'index.html';
  }
}

// Inicializar
document.addEventListener('DOMContentLoaded', verificarLogin);
