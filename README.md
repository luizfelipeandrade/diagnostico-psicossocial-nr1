# 🧠 Diagnóstico Psicossocial NR-1

Aplicação web desenvolvida para apoiar a realização de avaliações de riscos psicossociais no ambiente de trabalho, permitindo organizar questionários, respostas por setor, resultados e planos de ação.

O projeto foi desenvolvido como um protótipo acadêmico utilizando React e TypeScript, com foco na criação de uma aplicação web estruturada para coleta e organização das informações.

## ✨ Funcionalidades

- 📋 Questionário estruturado para avaliação psicossocial
- 📊 Barra de progresso durante o preenchimento
- 📝 Escala de respostas em formato Likert
- 🏢 Cadastro e gerenciamento das informações da empresa
- 👥 Organização das avaliações por setor
- 📱 Geração de QR Code para acesso ao questionário de cada setor
- 📈 Visualização dos resultados consolidados
- 📄 Geração de relatório da avaliação
- 📋 Geração de plano de ação baseado em 5W2H
- 🌙 Alternância entre tema claro e escuro
- 📱 Interface responsiva

## 🛠️ Tecnologias

- React
- TypeScript
- Vite
- CSS
- QR Code
- JavaScript / TypeScript

## 🏗️ Estrutura do projeto

```
src/
├── assets/
├── components/
├── context/
├── data/
├── hooks/
├── types/
├── utils/
├── App.tsx
├── App.css
├── index.css
└── main.tsx
```
A aplicação utiliza componentes separados para diferentes responsabilidades, além de estruturas específicas para dados, tipos, contexto, hooks e utilitários.

📋 Fluxo da aplicação

Empresa
   ↓
Cadastro das informações
   ↓
Configuração dos setores
   ↓
Questionário
   ↓
Respostas dos colaboradores
   ↓
Consolidação dos resultados
   ↓
Relatório
   ↓
Plano de Ação 5W2H

📱 Questionário por QR Code

Cada setor pode possuir um link específico para o questionário.

O sistema permite gerar um QR Code associado ao setor, facilitando o acesso dos colaboradores ao formulário por dispositivos móveis.

📄 Relatórios

A aplicação permite visualizar os resultados de cada setor e gerar um relatório estruturado contendo informações da empresa, setor avaliado, resultados e recomendações de ação.

📋 Plano de Ação 5W2H

A aplicação também apresenta um plano de ação baseado na metodologia 5W2H, relacionando os resultados obtidos na avaliação com possíveis ações preventivas e de acompanhamento.

🎓 Contexto do projeto

Projeto desenvolvido como protótipo acadêmico para estudo e demonstração de desenvolvimento de aplicações web.

O projeto também foi utilizado como oportunidade para aprofundar conhecimentos em React, TypeScript, organização de componentes, gerenciamento de estado, geração de relatórios e integração de recursos externos.

⚠️ Observação

Este projeto possui finalidade acadêmica e demonstrativa.

Não deve ser interpretado como ferramenta de diagnóstico médico ou como substituto de avaliação realizada por profissionais qualificados.

## 👤 Autor

**Luiz Felipe Andrade**

Desenvolvedor de Software em formação

[GitHub](https://github.com/luizfelipeandrade) • [LinkedIn](https://www.linkedin.com/in/lfandrade)
