# CCTV Aggregator

Agrégateur de webcams météo/surf bretonnes sur un seul site public.  
Stack : Vue 3 + Vite + Tailwind CSS (JS uniquement) · nginx · Docker · Cloudflared

## Structure du projet

```
cctv/
├── src/
│   ├── main.js
│   ├── style.css                 # @tailwind directives
│   ├── App.vue
│   ├── config/
│   │   └── cameras.js            # liste des 10 caméras
│   └── components/
│       ├── WebcamGrid.vue        # grille responsive
│       ├── WebcamTile.vue        # tuile individuelle
│       └── IframePlayer.vue      # <iframe> 16:9
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
├── Dockerfile                    # build multi-stage node → nginx
├── docker-compose.yml            # port 8080 loopback uniquement
├── nginx.conf                    # SPA fallback + cache assets
└── .dockerignore
```

## Caméras (10 flux, 2 plateformes)

| ID | Nom | Lieu | Plateforme | URL d'embed |
|----|-----|------|-----------|------------|
| cap-coz | Cap Coz | Fouesnant | Viewsurf | `pv.viewsurf.com/700` |
| beg-meil | Beg-Meil | Fouesnant | Viewsurf | `pv.viewsurf.com/702` |
| ile-saint-nicolas | Île Saint-Nicolas | Glénan | Viewsurf | `pv.viewsurf.com/1350` |
| mousterlin | Pointe de Mousterlin | Fouesnant | Viewsurf | `pv.viewsurf.com/704` |
| pornichet-plage | Plage | Pornichet | Skaping | `skaping.com/pornichet/plage/video` |
| pornichet-surf | Surf | Pornichet | Skaping | `skaping.com/pornichet/plage/surf` |
| saint-colomban-panorama | St-Colomban Panorama | Carnac | Viewsurf | `pv.viewsurf.com/2014?i=NzM4Njp…` |
| saint-colomban-vue2 | St-Colomban Vue centrale | Carnac | Viewsurf | `pv.viewsurf.com/2014?i=NzM4Mjp…` |
| saint-colomban-pointe | St-Colomban Pointe | Carnac | Viewsurf | `pv.viewsurf.com/2014?i=NzM4NDp…` |
| carnac-grande-plage | Grande Plage | Carnac | Viewsurf | `pv.viewsurf.com/1402?i=NTY5NDp…` |

Viewsurf et Skaping sont conçus pour l'intégration iframe : pas de X-Frame-Options, CORS ouvert.  
Aucun proxy backend nécessaire.

## Déploiement VPS

```
Internet → Cloudflare → Cloudflared (tunnel, sur le VPS) → localhost:8080 → conteneur nginx
```

- `docker-compose.yml` bind le port 80 du conteneur sur `127.0.0.1:8080` (jamais exposé publiquement)
- Cloudflared est configuré séparément sur le VPS avec `ingress: url: http://localhost:8080`
- TLS et domaine entièrement gérés par Cloudflare

## Commandes

```bash
# Dev local
npm install
npm run dev

# Build Docker
docker compose build
docker compose up -d

# Logs
docker compose logs -f
```
