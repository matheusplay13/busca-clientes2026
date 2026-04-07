function formatarCPF(cpf) {
  cpf = cpf.replace(/\D/g, '');
  cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  return cpf;
}

function formatarTelefone(telefone) {
  telefone = telefone.replace(/\D/g, '');
  if (telefone.length === 11) {
    telefone = telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (telefone.length === 10) {
    telefone = telefone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return telefone;
}

// Máscara para CPF
document.getElementById('cpf').addEventListener('input', function(e) {
  e.target.value = formatarCPF(e.target.value);
});

// Máscara para Telefone
document.getElementById('telefone').addEventListener('input', function(e) {
  e.target.value = formatarTelefone(e.target.value);
});

function cadastrarCliente(event) {
  event.preventDefault();
  
  const resultado = document.getElementById('resultado');
  resultado.innerHTML = '<div class="loading">Cadastrando cliente...</div>';
  
  // Coletar dados do formulário
  const senha = document.getElementById('senha').value;
  const confirmarSenha = document.getElementById('confirmar_senha').value;
  
  // Validar senhas
  if (senha !== confirmarSenha) {
    resultado.innerHTML = '<p class="error">As senhas não coincidem!</p>';
    return;
  }
  
  if (senha.length < 6) {
    resultado.innerHTML = '<p class="error">A senha deve ter pelo menos 6 caracteres!</p>';
    return;
  }
  
  const formData = {
    nome: document.getElementById('nome').value.trim(),
    email: document.getElementById('email').value.trim(),
    senha: senha, // Em produção, deveria ser criptografada
    cpf: document.getElementById('cpf').value.replace(/\D/g, ''),
    telefone: document.getElementById('telefone').value.replace(/\D/g, ''),
    data_nascimento: document.getElementById('data_nascimento').value,
    bairro: document.getElementById('bairro').value.trim(),
    id: Date.now().toString()
  };
  
  // Validações
  if (!formData.nome || formData.nome.length < 3) {
    resultado.innerHTML = '<p class="error">Digite um nome válido (mínimo 3 caracteres).</p>';
    return;
  }
  
  if (formData.cpf.length !== 11) {
    resultado.innerHTML = '<p class="error">Digite um CPF válido com 11 dígitos.</p>';
    return;
  }
  
  if (!formData.email || !formData.email.includes('@')) {
    resultado.innerHTML = '<p class="error">Digite um email válido.</p>';
    return;
  }
  
  console.log('Dados para cadastrar:', formData);
  
  // Salvar usuário no localStorage para login
  try {
    salvarUsuarioLocal(formData);
  } catch (error) {
    resultado.innerHTML = `<p class="error">${error.message}</p>`;
    return;
  }
  
  // Tentar cadastrar na API primeiro
  fetch('http://localhost:3000/clientes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData)
  })
  .then(response => {
    console.log('Status:', response.status);
    if (!response.ok) {
      throw new Error(`Erro ao cadastrar na API. Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log('Cliente cadastrado na API:', data);
    // Salvar também no localStorage como backup
    salvarClienteLocal(formData);
    mostrarSucesso(data || formData);
  })
  .catch(error => {
    console.error('Erro na API, salvando localmente:', error);
    // Se falhar na API, salva no localStorage
    salvarClienteLocal(formData);
    mostrarSucesso(formData);
  });
}

function salvarUsuarioLocal(usuario) {
  // Obter usuários existentes no localStorage
  let usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
  
  // Verificar se email já existe
  if (usuarios.find(u => u.email === usuario.email)) {
    throw new Error('Este email já está cadastrado como usuário!');
  }
  
  // Adicionar novo usuário
  usuarios.push(usuario);
  
  // Salvar no localStorage
  localStorage.setItem('usuarios', JSON.stringify(usuarios));
  console.log('Usuário salvo no localStorage:', usuario);
}

function limparFormulario() {
  document.getElementById('formCadastro').reset();
  document.getElementById('resultado').innerHTML = '';
}

function voltarParaBusca() {
  window.location.href = 'index.html';
}

function salvarClienteLocal(cliente) {
  // Obter clientes existentes no localStorage
  let clientes = JSON.parse(localStorage.getItem('clientes') || '[]');
  
  // Verificar se CPF já existe
  if (clientes.find(c => c.cpf === cliente.cpf)) {
    throw new Error('CPF já cadastrado!');
  }
  
  // Adicionar novo cliente
  clientes.push(cliente);
  
  // Salvar no localStorage
  localStorage.setItem('clientes', JSON.stringify(clientes));
  console.log('Cliente salvo no localStorage:', cliente);
}

function mostrarSucesso(cliente) {
  const resultado = document.getElementById('resultado');
  resultado.innerHTML = `
    <div class="cliente-card" style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; text-align: center;">
      <h2 style="margin-bottom: 1rem;">✅ Cliente Cadastrado com Sucesso!</h2>
      <p><strong>Nome:</strong> ${cliente.nome}</p>
      <p><strong>CPF:</strong> ${formatarCPF(cliente.cpf)}</p>
      <p><strong>Email:</strong> ${cliente.email}</p>
      <p style="margin-top: 1rem;">Agora você pode fazer login com seu email e senha!</p>
      <div style="margin-top: 1rem;">
        <button class="btn-login" onclick="irParaLogin()">Fazer Login</button>
        <button class="btn-voltar" onclick="limparFormulario()">Cadastrar Outro</button>
      </div>
    </div>
  `;
}

function irParaLogin() {
  console.log('Indo para login...');
  window.location.href = 'login.html';
}

function irParaCadastro() {
  console.log('Indo para cadastro...');
  window.location.href = 'cadastro.html';
}

// Função para voltar ao início
function voltarAoInicio() {
  console.log('Voltando ao início...');
  window.location.href = 'home.html';
}
