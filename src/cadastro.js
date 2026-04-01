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
  const formData = {
    nome: document.getElementById('nome').value.trim(),
    cpf: document.getElementById('cpf').value.replace(/\D/g, ''),
    email: document.getElementById('email').value.trim(),
    telefone: document.getElementById('telefone').value.replace(/\D/g, ''),
    data_nascimento: document.getElementById('data_nascimento').value,
    bairro: document.getElementById('bairro').value.trim()
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
  
  // Enviar para API
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
      throw new Error(`Erro ao cadastrar. Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log('Cliente cadastrado:', data);
    resultado.innerHTML = `
      <div class="cliente-card" style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; text-align: center;">
        <h2 style="margin-bottom: 1rem;">✅ Cliente Cadastrado com Sucesso!</h2>
        <p><strong>Nome:</strong> ${data.nome || formData.nome}</p>
        <p><strong>CPF:</strong> ${formatarCPF(data.cpf || formData.cpf)}</p>
        <p><strong>Email:</strong> ${data.email || formData.email}</p>
        <button class="btn-cadastrar" style="margin-top: 1rem;" onclick="limparFormulario()">Cadastrar Outro</button>
      </div>
    `;
  })
  .catch(error => {
    console.error('Erro no cadastro:', error);
    resultado.innerHTML = `
      <p class="error">Erro ao cadastrar cliente.</p>
      <p style="font-size: 0.9rem; margin-top: 0.5rem;">Detalhes: ${error.message}</p>
      <p style="font-size: 0.8rem; margin-top: 0.5rem;">Verifique se a API está rodando em localhost:3000</p>
    `;
  });
}

function limparFormulario() {
  document.getElementById('formCadastro').reset();
  document.getElementById('resultado').innerHTML = '';
}

function voltarParaBusca() {
  window.location.href = 'index.html';
}
