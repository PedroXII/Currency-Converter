# Objetivo do Trabalho

Desenvolver uma API de integração entre sistemas que permita a conversão de moedas com cache local, utilizando a AwesomeAPI como fonte de dados para taxas de câmbio.

# API de Conversão de Moeda com Cache

API REST para conversão de valores entre moedas utilizando a AwesomeAPI com sistema de cache em arquivo JSON.

# Membros do Grupo

| Nome                                 | Matrícula | Função        |
|--------------------------------------|-----------|---------------|
| ILANA DAS NEVES BARBOSA              |  2326948  | Documentadora |
| IONARA DOS SANTOS FERREIRA           |  2326251  | Desenvolvedora|
| MARIA VITÓRIA SAMPAIO DA SILVA       |  2323856  | Testadora     |
| JOAO PEDRO ALMEIDA SANTOS            |  2327071  | Desenvolvedor |
| LUCAS KAUÃ PORTELA DA SILVA NOGUEIRA |  2323857  | Desenvolvedor |
| VIVIAN LEIGH TEIXEIRA SALVI          |  2313542  | Documentadora |

# Descrição Funcional da Solução

A API permite:
- Conversão de valores entre diferentes moedas
- Armazenamento em cache das taxas de câmbio para melhor performance
- Consulta do histórico de taxas armazenadas
- Integração com a AwesomeAPI para dados atualizados

# Arquitetura da API

Express.js: Framework web para Node.js que gerencia as rotas e middlewares
AwesomeAPI: Serviço externo que fornece taxas de câmbio em tempo real
Cache JSON: Sistema de armazenamento local para reduzir chamadas à API externa
Axios: Cliente HTTP para fazer requisições à AwesomeAPI

# Diagrama de Sequência

sequenceDiagram
    participant Cliente
    participant API
    participant Cache
    participant AwesomeAPI

    Cliente->>API: GET /convert?from=USD&to=BRL&amount=100
    API->>Cache: Verificar se taxa está em cache
    Cache-->>API: Retornar taxa (se existir)
    
    alt Taxa não encontrada ou expirada
        API->>AwesomeAPI: Solicitar taxa atual
        AwesomeAPI-->>API: Retornar taxa atual
        API->>Cache: Armazenar nova taxa
    end
    
    API->>API: Calcular valor convertido
    API-->>Cliente: Retornar resposta com valor convertido

# Instruções detalhadas para execução via Postman

Configuração do Postman

1 - Importar a Coleção:
    Abra o Postman
    Clique em "Import" → "File"
    Selecione o arquivo postman/collection.json da pasta do projeto
2 - Configurar Environment (Opcional):
    Crie um novo environment chamado "Currency API"
    Adicione uma variável baseUrl com valor http://localhost:3000
3 - Testar os Endpoints:
    Abra a requisição "Convert Currency" na coleção importada
    Verifique se os parâmetros estão configurados:
        from: USD
        to: BRL
        amount: 100
    Clique em "Send" para executar a requisição

## Exemplos de Testes
    Teste de Conversão Bem-sucedido:
        GET http://localhost:3000/api/convert?from=USD&to=BRL&amount=100
    Teste de Consulta de Taxas:
        GET http://localhost:3000/api/rates
    Teste de Erro (Parâmetros Faltando):
        GET http://localhost:3000/api/convert?from=USD

# Documentação das Rotas da API
    GET /api/convert
    Converte um valor entre moedas.

## Parâmetros Query:

    Parâmetro | Tipo | Obrigatório | Descrição                | Exemplo
    from      |string| Sim         |Código da moeda de origem | USD, EUR, BRL
    to        |string| Sim	       |Código da moeda de destino| BRL, USD, JPY
    amount    |number| Sim         |Valor a ser convertido    | 100, 50.5

## Resposta de Sucesso (200 OK):

    json
    {
    "from": "USD",
    "to": "BRL",
    "amount": 100,
    "converted": 550.50,
    "rate": 5.505,
    "date": "2025-09-12T19:30:00Z",
    "cached": false
    }

## Respostas de Erro:

    400 Bad Request: Parâmetros obrigatórios faltando
    500 Internal Server Error: Erro na comunicação com AwesomeAPI

## GET /api/rates
    Retorna todas as taxas de câmbio armazenadas em cache.
    
### Resposta de Sucesso (200 OK):

json
{
  "USD_BRL": {
    "rate": 5.505,
    "last_updated": "2025-09-12T19:30:00Z"
  },
  "EUR_BRL": {
    "rate": 6.102,
    "last_updated": "2025-09-12T19:25:00Z"
  }
}