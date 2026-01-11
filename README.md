# StaffHub — Sistema de Gestão de Funcionários

O **StaffHub** é um sistema Full Stack de gestão de funcionários desenvolvido com foco em organização interna, controle de acesso e segurança. Seu objetivo é permitir que empresas e equipes tenham uma visão centralizada do seu quadro de colaboradores, com funcionalidades como cadastro, edição, listagem, filtros, dashboards com métricas e permissões baseadas em perfis de usuário.

O sistema possui dois tipos de usuários: **ADMIN** e **VIEWER**, cada um com permissões específicas. Administradores podem cadastrar, editar e remover funcionários, além de gerenciar outros usuários do sistema. Usuários do tipo Viewer têm acesso apenas à visualização das informações e métricas, sem capacidade de alterá-las.

Este projeto foi desenvolvido com boas práticas de arquitetura, autenticação, segurança e organização de código, utilizando **React + Vite + Tailwind** no frontend e **NestJS + Prisma + MySQL + JWT** no backend, formando um ambiente completo de estudo, avaliação e demonstração de habilidades Full Stack.

---

## 🚀 Funcionalidades

### 👤 Autenticação
- Login com JWT
- Sessão persistida no navegador
- Logout
- Controle de rotas protegidas

### 🔐 Controle de Acesso
| Ação | ADMIN | VIEWER |
|---|:---:|:---:|
| Listar Funcionários | ✔ | ✔ |
| Ver detalhes | ✔ | ✔ |
| Criar Funcionário | ✔ | ✘ |
| Editar Funcionário | ✔ | ✘ |
| Deletar Funcionário | ✔ | ✘ |
| Criar Usuários | ✔ | ✘ |
| Listar Usuários | ✔ | ✘ |

### 👥 Gestão de Funcionários
- CRUD completo
- Filtros + busca
- Status (ativo/inativo/afastado)
- Dashboard com métricas
- Charts + estatísticas

---

## 🛠 Tecnologias Utilizadas

### Backend
- Node.js (NestJS)
- Prisma ORM
- MySQL
- JWT + Passport
- bcrypt
- Class-Validator

### Frontend
- React + Vite
- TypeScript
- TailwindCSS
- Axios
- React Router
- Context para autenticação
- Framer Motion

---

## 📂 Estrutura do Projeto

### Backend
```
backend/
 ├─ src/
 │   ├─ auth/
 │   ├─ users/
 │   ├─ employees/
 │   ├─ prisma/
 │   ├─ guards/
 │   ├─ decorators/
 │   └─ main.ts
 └─ prisma/
     └─ schema.prisma
```

### Frontend
```
frontend/
 ├─ src/
 │   ├─ pages/
 │   ├─ components/
 │   ├─ hooks/
 │   ├─ context/
 │   ├─ services/
 │   └─ main.tsx
 └─ index.css
```

---

## ⚙️ Configuração e Instalação

### Pré-requisitos
- Node ≥ 20
- MySQL ≥ 8
- NPM ou Yarn
- Git

---

# 🔧 Backend — Setup

```
cd backend
npm install
```

### Criar banco no MySQL
```
CREATE DATABASE staffhub;
```

### Criar arquivo `.env`
```
DATABASE_URL="mysql://root:SENHA@localhost:3306/staffhub"
JWT_SECRET="algumseguro"
```

### Rodar migrations Prisma
```
npx prisma migrate dev
```

---

### Criar usuário admin inicial

```
POST /users/seed-admin
```

Retorno esperado:
```json
{
  "message": "Admin criado/garantido com sucesso",
  "admin": {
    "email": "admin@admin.com",
    "role": "ADMIN"
  }
}
```

---

### Rodar o backend

```
npm run start:dev
```

Servidor:
```
http://localhost:3000
```

---

# 📡 Endpoints da API

## 🔐 Auth

### POST /auth/login
Request:
```json
{
  "email": "admin@admin.com",
  "password": "admin123"
}
```

Response:
```json
{
  "token": "...",
  "user": {
    "id": 1,
    "email": "admin@admin.com",
    "role": "ADMIN"
  }
}
```

---

## 👤 Users

| Método | Endpoint | Descrição | Permissão |
|---|---|---|---|
| POST | /users/seed-admin | Cria admin | Public |
| GET | /users | Lista usuários | ADMIN |
| POST | /users | Cria usuário | ADMIN |
| PATCH | /users/:id | Edita usuário | ADMIN |

---

## 👥 Employees

| Método | Endpoint | Descrição | Permissão |
|---|---|---|---|
| GET | /employees | Lista funcionários | ALL |
| GET | /employees/:id | Detalhes | ALL |
| POST | /employees | Cria | ADMIN |
| PATCH | /employees/:id | Edita | ADMIN |
| DELETE | /employees/:id | Remove | ADMIN |

---

# 🎨 Frontend — Setup

```
cd frontend
npm install
```

Rodar:
```
npm run dev
```

App em:
```
http://localhost:5173
```

---

# 🖥 Screenshots

### Tela de Login
> ![alt text](./images/image.png)

### Dashboard
> ![alt text](./images/image-1.png)

### Lista de Funcionários (ADMIN)
> ![alt text](./images/image-2.png)

### Cadastro de Funcionário (ADMIN)
> ![alt text](./images/image-3.png)

### Edição de Funcionário (ADMIN)
![alt text](./images/image-4.png)

### Gestão de Usuários (ADMIN)
![alt text](./images/image-5.png)
![alt text](./images/image-6.png)

### Modo Viewer (restrições)
![alt text](./images/image-7.png)
![alt text](./images/image-8.png)

---

# 🔐 Fluxo de Permissões

```
Login → JWT → Role → ADMIN (full) / VIEWER (read-only)
```

---

# 📦 Build de Produção

### Backend
```
npm run build
```

### Frontend
```
npm run build
```

---

# 👤 Autor
Kaique Silva  
Portfólio: https://kaiquemsa.github.io/Portfolio/  
LinkedIn: https://www.linkedin.com/in/kaique-silva-3929b2217/  
Github: https://github.com/kaiquemsa
