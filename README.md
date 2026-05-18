# Sean O'Reilly Homepage

Personal portfolio site for [seanoreilly.dev](https://seanoreilly.dev), built with Next.js, React, TypeScript, and Tailwind CSS.

The site is intentionally compact: a short professional intro, technology stack, selected projects, and contact links.

## Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Docker / Docker Compose

## Local Development

```sh
npm install
npm run dev
```

The development server runs at [http://localhost:3000](http://localhost:3000) by default.

## Production Build

```sh
npm run build
npm run start
```

## Docker Deployment

The container runs the standalone Next.js server on port `3001`.

```sh
docker compose up -d --build
```
