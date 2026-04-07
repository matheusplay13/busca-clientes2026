function buscarCliente() {

    const termo = document.getElementById('cliente').value.trim();

    const resultado = document.getElementById('resultado');

  

    if (!termo) {

      resultado.innerHTML = '<p class="error">Digite o CPF do cliente.</p>';

      return;

    }

  

    resultado.innerHTML = '<div class="loading">Buscando cliente...</div>';

  

    // Validação de CPF (apenas números)

    const cpfNumeros = termo.replace(/\D/g, '');

    

    if (cpfNumeros.length !== 11) {

      resultado.innerHTML = '<p class="error">Digite um CPF válido com 11 dígitos.</p>';

      return;

    }

    

    // Usando o endpoint correto da API

    const apiUrl = `http://localhost:3000/clientes/${cpfNumeros}`;

    

    console.log('Tentando URL:', apiUrl);

    

    fetch(apiUrl)

      .then(response => {

        console.log('Status:', response.status);

        

        if (!response.ok) {

          // Se não encontrar na API, buscar no localStorage

          console.log('Não encontrado na API, buscando no localStorage...');

          return buscarNoLocalStorage(cpfNumeros);

        }

        return response.json();

      })

      .then(data => {

        console.log('Dados recebidos:', data);

        

        if (data && (data.nome || data.email)) {

          resultado.innerHTML = `

            <div class="cliente-card">

              

              <p><strong>Nome:</strong> ${data.nome || 'Não informado'}</p>

              <p><strong>CPF:</strong> ${data.cpf || 'Não informado'}</p>

              <p><strong>Email:</strong> ${data.email || 'Não informado'}</p>

              <p><strong>Telefone:</strong> ${data.telefone || data.fone || 'Não informado'}</p>

              <p><strong>Endereço:</strong> ${data.bairro  || data.logradouro || 'Não informado'}</p>

            </div>

          `;

        } else {

          resultado.innerHTML = '<p class="error">Cliente não encontrado.</p>';

        }

      })

      .catch(error => {

        console.error('Erro completo:', error);

        resultado.innerHTML = `

          <p class="error">Erro na comunicação com a API.</p>

          <p style="font-size: 0.9rem; margin-top: 0.5rem;">Detalhes: ${error.message}</p>

          <p style="font-size: 0.8rem; margin-top: 0.5rem;">Verifique se a API está rodando em localhost:3000</p>

        `;

      });

  }



function buscarNoLocalStorage(cpf) {

  const clientes = JSON.parse(localStorage.getItem('clientes') || '[]');

  const cliente = clientes.find(c => c.cpf === cpf);

  

  if (cliente) {

    return Promise.resolve(cliente);

  } else {

    return Promise.reject(new Error('Cliente não encontrado'));

  }

}

  

  function mostrarTodosClientes() {
  const resultado = document.getElementById('resultado');
  
  resultado.innerHTML = '<div class="loading">Carregando todos os clientes...</div>';
  
  // Endpoint correto para listar todos
  const apiUrl = 'http://localhost:3000/clientes';
  
  console.log('Tentando listar clientes...');
  
  fetch(apiUrl)
    .then(response => {
      console.log('Status lista:', response.status);
      if (!response.ok) {
        throw new Error(`Erro ao buscar clientes. Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Dados lista recebidos:', data);
      
      if (Array.isArray(data)) {
        if (data.length === 0) {
          resultado.innerHTML = '<p class="error">Nenhum cliente encontrado.</p>';
          return;
        }
        
        resultado.innerHTML = data.map(cliente => `
          <div class="cliente-card">
            <p><strong>Nome:</strong> ${cliente.nome || 'Não informado'}</p>
            <p><strong>CPF:</strong> ${cliente.cpf || 'Não informado'}</p>
            <p><strong>Telefone:</strong> ${cliente.telefone || cliente.fone || 'Não informado'}</p>
            <p><strong>Endereço:</strong> ${cliente.bairro || cliente.logradouro || 'Não informado'}</p>
          </div>
        `).join('');
      } else {
        resultado.innerHTML = '<p class="error">Formato de dados inválido. Esperado array de clientes.</p>';
      }
    })
    .catch(error => {
      console.error('Erro na lista:', error);
      resultado.innerHTML = `
        <p class="error">Erro ao carregar clientes.</p>
        <p style="font-size: 0.9rem; margin-top: 0.5rem;">Detalhes: ${error.message}</p>
        <p style="font-size: 0.8rem; margin-top: 0.5rem;">Verifique se a API está rodando em localhost:3000</p>
      `;
    });
}

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
        <span style="opacity: 0.8;">Nenhum usuário logado</span>
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

// Função de navegação com múltiplos métodos
function irParaLogin() {
  console.log('=== TESTANDO NAVEGAÇÃO ===');
  console.log('URL atual:', window.location.href);
  console.log('Protocolo:', window.location.protocol);
  console.log('Hostname:', window.location.hostname);
  console.log('Porta:', window.location.port);
  
  // Testar se o arquivo existe
  fetch('login.html', { method: 'HEAD' })
    .then(response => {
      console.log('Status do login.html:', response.status);
      if (response.ok) {
        console.log('Arquivo existe, tentando navegar...');
        
        // Método 1: location.href
        try {
          console.log('Tentando location.href...');
          window.location.href = 'login.html';
          setTimeout(() => {
            if (window.location.href.includes('login.html')) {
              console.log('✅ Navegação funcionou!');
            } else {
              console.log('❌ Método 1 falhou, tentando método 2...');
              // Método 2: location.assign
              window.location.assign('login.html');
            }
          }, 100);
        } catch (error) {
          console.error('Erro método 1:', error);
          // Método 2: location.replace
          window.location.replace('login.html');
        }
      } else {
        console.error('Arquivo login.html não encontrado!');
        alert('Erro: Arquivo login.html não encontrado!');
      }
    })
    .catch(error => {
      console.error('Erro ao verificar arquivo:', error);
      // Tentar navegação direta mesmo assim
      window.location.href = 'login.html';
    });
}

function irParaCadastro() {
  console.log('Indo para cadastro...');
  window.location.href = 'cadastro.html';
}

// Adicionar evento de load para verificar usuário logado
window.addEventListener('load', verificarUsuarioLogado);