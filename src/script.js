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
          throw new Error(`Cliente não encontrado. Status: ${response.status}`);
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
          resultado.innerHTML = '<p class="error">Formato de dados inválido recebido da API.</p>';
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
              <p><strong>Email:</strong> ${cliente.email || 'Não informado'}</p>
              <p><strong>Telefone:</strong> ${cliente.telefone || cliente.fone || 'Não informado'}</p>
              <p><strong>Endereço:</strong> ${cliente.bairro   || cliente.logradouro || 'Não informado'}</p>
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