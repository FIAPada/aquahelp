# Aquahelp

Aquahelp é uma aplicação web criada para permitir o reporte de avistamentos de animais marinhos e denúncias de poluição ambiental.

## Arquitetura

A aplicação Aquahelp é composta pelos seguintes componentes:

- **Frontend:** Desenvolvido em NextJS, proporciona uma interface amigável para os usuários reportarem avistamentos e denúncias.
- **Gandalf:** Microserviço de autenticação responsável pela gestão de usuários e autenticação.
- **Snitch:** Microserviço responsável pelo gerenciamento e armazenamento dos relatórios de avistamentos e denúncias.
- **Banco de Dados:** MySQL é utilizado para armazenar os dados da aplicação.
- **MinIO:** Servidor utilizado para armazenamento de imagens enviadas nas reportagens.

## Requisitos

Para rodar a aplicação localmente, é necessário ter instalado:

- Docker
- Docker Compose

## Instruções de Configuração

1. Clone este repositório:
    ```bash
    git clone https://github.com/seu-usuario/aquahelp.git
    cd aquahelp
    ```

2. Inicie a aplicação com Docker Compose:
    ```
    docker compose up
    ```

3. Acesse a aplicação no seu navegador através do endereço:
    ```
    http://localhost:3000
    ```

## Componentes Detalhados

### Frontend (NextJS)

- **Localização:** `frontend/`
- **Descrição:** Interface do usuário para reportar avistamentos de animais marinhos e denúncias de poluição.
- **Comandos principais:**
    - `yarn install`: Instala as dependências do projeto.
    - `yarn dev`: Inicia o servidor de desenvolvimento.

### Gandalf (Autenticação)

- **Localização:** `gandalf/`
- **Descrição:** Microserviço responsável pela autenticação e gestão de usuários.
- **Comandos principais:**
    - `go run main.go`: Inicia o serviço de autenticação.

### Snitch (Reportagens)

- **Localização:** `snitch/`
- **Descrição:** Microserviço responsável pela gestão de reportagens de avistamentos e denúncias.
- **Comandos principais:**
    - `go run main.go`: Inicia o serviço de reportagens.

### Banco de Dados (MySQL)

- **Descrição:** Armazena os dados dos usuários, reportagens e outras informações necessárias para a aplicação.
- **Configuração:** A configuração do banco de dados é definida no arquivo `compose.yaml`.

### MinIO (Armazenamento de Imagens)

- **Descrição:** Utilizado para o armazenamento de imagens enviadas pelos usuários nas reportagens.
- **Configuração:** A configuração do MinIO é definida no arquivo `compose.yaml`.
