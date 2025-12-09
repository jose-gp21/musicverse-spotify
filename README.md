# MusicVerse Spotify - Plataforma de Música com Prévia Oficial

Protótipo web simples construído com **Next.js + MongoDB (NoSQL)** para a Proposta 5 da A3:

- Usuário cria perfil
- Escolhe gêneros musicais favoritos
- Favorita músicas
- Recebe recomendações com base nas preferências
- Pode ouvir **prévia oficial (30s)** das músicas via Spotify

## Stack

- Next.js 15 (App Router)
- TypeScript
- TailwindCSS
- MongoDB + Mongoose
- JWT em cookies HttpOnly
- Spotify Web API (client credentials) para buscar `preview_url`

## Configuração

1. Instale dependências:

```bash
npm install
```

2. Copie o arquivo de ambiente:

```bash
cp .env.example .env.local
```

3. Edite `.env.local` com:

- `MONGO_URI` - URI do seu cluster MongoDB
- `JWT_SECRET` - string forte qualquer
- `SPOTIFY_CLIENT_ID` - obtido em https://developer.spotify.com
- `SPOTIFY_CLIENT_SECRET` - obtido em https://developer.spotify.com

## Seed com Spotify

Para popular o banco com bandas, músicas e prévias oficiais:

```bash
npm run spotify:seed
```

O script:

- Conecta no Mongo
- Cria bandas (Arctic Monkeys, The Strokes, Imagine Dragons, Kendrick, Travis, CBJR, Ludmilla, Anitta, Sorriso Maroto, Pixote)
- Busca várias faixas na API do Spotify
- Salva `previewUrl` de cada faixa (quando disponível)

## Rodar o projeto

```bash
npm run dev
```

Acesse: http://localhost:3000

Fluxo:

- `/register` - cria conta e seleciona gêneros
- `/login` - autenticação
- `/dashboard` - recomendações com player de prévia
- `/songs` - catálogo de músicas com player

## Deploy na Vercel

- Suba o projeto para um repositório Git
- Crie o projeto na Vercel apontando para o repo
- Configure as variáveis em **Project Settings > Environment Variables**:
  - `MONGO_URI`
  - `JWT_SECRET`
  - `SPOTIFY_CLIENT_ID`
  - `SPOTIFY_CLIENT_SECRET`
- Faça o deploy.

