# Despliegue en VPS — grupocrear.co

Flujo: `push a main` → GitHub Actions construye la imagen Docker → la sube a GHCR →
entra al VPS por SSH → reemplaza el contenedor `grupocrear` (solo escucha en `127.0.0.1:4321`)
→ health check. Nginx del VPS hace de proxy. **No se toca ningún otro sitio.**

## 1. DNS en Spaceship

| Tipo | Host | Valor |
|------|------|-------|
| A    | @    | IP del VPS |
| A    | www  | IP del VPS |

## 2. VPS (una sola vez)

```bash
# Docker (si no está instalado)
docker --version || curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER   # el usuario de deploy debe poder usar docker

# Verificar que el puerto 4321 está libre (si no, elige otro y ver APP_PORT abajo)
sudo ss -ltnp | grep 4321 || echo "libre"

# Sitio nginx NUEVO (no edita los existentes)
sudo cp nginx-grupocrear.conf /etc/nginx/sites-available/grupocrear.co
sudo ln -s /etc/nginx/sites-available/grupocrear.co /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx   # nginx -t valida antes de recargar

# HTTPS (cuando el DNS ya apunte al VPS)
sudo certbot --nginx -d grupocrear.co -d www.grupocrear.co
```

Clave SSH dedicada para GitHub Actions:

```bash
ssh-keygen -t ed25519 -f ~/.ssh/gh_deploy -N "" -C "github-actions-grupocrear"
cat ~/.ssh/gh_deploy.pub >> ~/.ssh/authorized_keys
cat ~/.ssh/gh_deploy   # → secreto VPS_SSH_KEY
```

## 3. Secretos del repo (Settings → Secrets and variables → Actions)

| Secreto | Valor |
|---------|-------|
| `VPS_HOST` | IP del VPS |
| `VPS_USER` | usuario SSH |
| `VPS_SSH_KEY` | clave privada `gh_deploy` completa |
| `VPS_PORT` | (opcional) puerto SSH si no es 22 |
| `GEMINI_API_KEY` | API key de Gemini (chat) |

Variable opcional `APP_PORT` si 4321 está ocupado (y cambia el `proxy_pass` en nginx).

## 4. Desplegar

Push a `main` o *Actions → Deploy a VPS → Run workflow*.
Logs: `docker logs -f grupocrear`.
