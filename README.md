# Aura Academy SMS

This repository contains a full-stack School Management and Bus GPS Tracking system.

## Local development

1. Install dependencies:
   ```bash
   npm run install-all
   ```
2. Build the client:
   ```bash
   npm run build-client
   ```
3. Start the server:
   ```bash
   npm start
   ```
4. Open the app in your browser:
   ```
   http://localhost:5000
   ```

## Docker

Build the container:
```bash
docker build -t aura-academy .
```

Run it:
```bash
docker run -p 5000:5000 aura-academy
```

## Render deployment

This repo includes `render.yaml` so Render can automatically deploy the app from the root repository.

Steps:
1. Push the repo to GitHub.
2. Create a new Web Service on Render.
3. Choose `Docker` as the environment.
4. Point Render to this repository and branch.
5. Render will use `Dockerfile` and build the app.
6. Add the required environment variables:
   - `PORT=5000`
   - `NODE_ENV=production`
   - `MONGODB_URI=<your-mongo-connection-string>`
7. Set up secrets in Render for `MONGODB_URI`.
8. Deploy and visit the public URL provided by Render.

## Fly.io deployment

This repo also includes `fly.toml` for Fly.io.

Steps:
1. Install Fly CLI:
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```
2. Log in:
   ```bash
   fly auth login
   ```
3. Launch or deploy the app from the repo root:
   ```bash
   fly launch --copy-config --name aura-academy-sms --region iad --dockerfile Dockerfile
   ```
4. Set Fly secrets:
   ```bash
   fly secrets set MONGODB_URI="<your-mongo-connection-string>"
   ```
5. Deploy:
   ```bash
   fly deploy
   ```
6. Open the public app URL that Fly provides after deployment.

## Environment variables

The server reads these values:

- `MONGODB_URI` — MongoDB connection string
- `PORT` — server port (default: `5000`)
- `NODE_ENV` — should be `production` in hosted environments
