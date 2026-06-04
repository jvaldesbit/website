# jcvb.com.co — Sitio personal de Julián Valdés Bello

Portfolio profesional de **Julián Camilo Valdés Bello**, Tech Lead & Arquitecto de Software con 9+ años de experiencia. Disponible en [jcvb.com.co](https://jcvb.com.co).

## Stack

- **Alpine.js 3** — reactividad (modo oscuro, menú mobile, animaciones, contadores)
- **CSS nativo** — sin frameworks de UI
- **Font Awesome 6** — íconos
- **Sin build step** — un solo `index.html` + `assets/css/styles.css`

## Estructura

```
├── index.html          # Todo el sitio
├── assets/
│   ├── css/styles.css  # Estilos
│   ├── images/         # Foto de perfil, favicon, og-image
│   └── jcvb-cv.pdf     # CV descargable
├── sitemap.xml
├── robots.txt
└── deploy.sh           # Script de despliegue
```

## Secciones

| Sección | Descripción |
|---|---|
| Hero | Presentación, stack tecnológico y acciones principales |
| Sobre mí | Áreas de experiencia detalladas |
| Logros | Métricas animadas de impacto |
| Proyectos | Portfolio de proyectos destacados |
| Experiencia | Timeline de carrera profesional |
| Habilidades | Barras de progreso por tecnología |
| Contacto | Formulario con envío directo por WhatsApp |

## Desarrollo local

Abre directamente en el navegador, no requiere servidor:

```bash
open index.html
# o con un servidor local:
python3 -m http.server 8080
```

## Despliegue

```bash
./deploy.sh
```
