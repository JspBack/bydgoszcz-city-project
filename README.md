# bydgoszc-city-project

**Environment files**

- There's an `example.env` in the repo root. Copy or rename it to `.env` when running services locally or when using Docker Compose.

**Quick start — Local (no Docker)**

Backend

1. Open a terminal and go to the backend folder:

```bash
cd backend
```

2. (Optional but recommended) create and activate a virtual environment, then install dependencies:

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

3. Copy the example environment file and run the app:

```bash
cp ../example.env .env
python3 app.py
```

Frontend (development)

1. Open a terminal and go to the frontend app:

```bash
cd frontend/web-mobile
```

2. Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Open the frontend URL shown by the dev server (usually `http://localhost:5173` for Vite-based projects).

**Quick start — Docker Compose**

If you prefer Docker, the repository includes a `docker-compose.yaml` at the project root. From the repo root run:

```bash
cp example.env .env
docker-compose up --build
```

This will build and start the services defined in the compose file. Check the compose file for service names and ports.
