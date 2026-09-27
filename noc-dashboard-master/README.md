# NOC Command Center

Dashboard de monitoramento de conectividade e telemetria de frota, com frontend Vite/React e API Express/SQLite.

## Desenvolvimento local

1. Instale as dependências com `npm install`.
2. Copie `.env.example` para `.env` e ajuste as URLs quando necessário.
3. Inicie o frontend com `npm run dev`.
4. Inicie a API com `node src/backend/server.js`.

## Deploy

Na Vercel, configure o comando `npm run build`, o diretório `dist` e a variável `VITE_API_URL` apontando para a API publicada. No servidor Express, configure `PORT` e `CORS_ORIGIN` com a origem pública do frontend. O frontend revalida os dados a cada 30 segundos.

O banco SQLite local não é persistente em ambientes serverless. Para produção, publique a API em um serviço com armazenamento persistente ou migre o repositório para um banco gerenciado.
