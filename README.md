<div align="center">
	<img src="public/favicon.svg" alt="Netools logo" width="60" height="60" />
	<h1>Netools</h1>
	<p><strong>Networking Tools, All in One Place.</strong></p>
</div>

Netools is a free, open-source collection of network utilities that run directly in your browser. There is no backend and no account, every tool runs entirely on your device, so the data you type never leaves your machine.

## What's inside

| Section | Tools |
| --- | --- |
| **Development** | Network Diagram Canvas, Curl Builder, JWT Encoder/Decoder, URL Encoder/Decoder, HTTP Status Codes |
| **IPv4** | Subnet Calculator, Subnet Creator, Address Converter (decimal/binary/hex/octal) |
| **TLDR** | Simplified, example-driven manuals for commands: arp, curl, dig, ftp, ip, iperf3, iw, mtr, nc, networkctl, nmap, ping, route, rsync, scp, sftp, ss, ssh, tcpdump, traceroute and wget |

## Self-hosting

Netools is a static site, shipped as a single Docker image served by nginx. You do not need Node, pnpm or a build step - just a machine with Docker.

The image is published on Docker Hub as [`jayexdesigns/netools`](https://hub.docker.com/r/jayexdesigns/netools) and updated automatically on every push to `main`. It is multi-arch (`linux/amd64`, `linux/arm64` and `linux/arm/v7`), so it runs on x86-64 servers as well as 64-bit and 32-bit Raspberry Pis - Docker automatically pulls the variant matching your machine.

### Run with `docker run`

```bash
docker run -d \
	--name netools \
	--restart unless-stopped \
	-p 80:80 \
	jayexdesigns/netools:latest
```

Then open <http://localhost>. Change `80` to any host port you like; the container always listens on port 80 internally.

### Run with Docker Compose

Create a `docker-compose.yml`:

```yaml
services:
  netools:
    image: 'jayexdesigns/netools:latest'
    container_name: netools
    restart: unless-stopped
    ports:
      - '80:80'
```

Then start it:

```bash
docker compose up -d
```

The app is now served on port 80 of your machine. To update to a newer release later, run `docker compose pull && docker compose up -d`.

### Behind a reverse proxy

The container only serves static files over plain HTTP, so put it behind your existing reverse proxy (Caddy, nginx, Traefik...) to add TLS. No path rewriting is needed: the app is served from `/` and handles its own client-side routing.

## Development

Prerequisites: [Node.js 24](https://nodejs.org) and [pnpm 12](https://pnpm.io) (`npm install --global pnpm@12`).

```bash
git clone https://github.com/JayexDesigns/netools.git
cd netools
pnpm install
pnpm run dev	# start the dev server on http://localhost:5173
```

### Scripts

| Script | What it does |
| --- | --- |
| `pnpm run dev` | Start the Vite dev server with hot reload |
| `pnpm run build` | Type-check with `tsc -b` and build the production bundle into `dist/` |
| `pnpm run preview` | Serve the production build locally |
| `pnpm run lint` | Lint everything with oxlint |
| `pnpm run test` | Run the Vitest suite once (`pnpm run test:watch` for watch mode) |

### Project layout

```
src/
  components/   shared components (shadcn/ui lives in components/ui)
  data/         static catalogues (tools, HTTP status codes)
  lib/          pure logic (IPv4 math, JWT, curl builder, diagram model...)
  pages/        route components (landing + one file per tool)
  router.tsx    route tree, every tool page code-split
tests/          Vitest suites mirroring src/ (library tests on node, UI tests on jsdom)
```

## Deployment

The [Deploy workflow](.github/workflows/deploy.yml) runs on every push to `main` (and on `v*` tags). It first verifies the app (build, lint, test), then:

- **GitHub Pages** - publishes the static bundle, built with the `/<repo>/` base path, to `https://jayexdesigns.github.io/netools/`.
- **Docker Hub** - builds and pushes the multi-platform `jayexdesigns/netools` image (`linux/amd64`, `linux/arm64`, `linux/arm/v7`) tagged `latest`, `main`, the semver of `v*` tags and the commit SHA.

One-time setup:

1. Settings → Pages → Source: **GitHub Actions**.
2. Repository **variables** (Settings → Secrets and variables → Actions → Variables): `DOCKERHUB_USERNAME` and `DOCKERHUB_REPO` (the image name on Docker Hub, e.g. `netools`).
3. Repository **secret**: `DOCKERHUB_TOKEN` (a Docker Hub access token).
