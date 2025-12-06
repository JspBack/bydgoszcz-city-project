FROM python:3.11-alpine AS deps

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

FROM deps AS runtime

COPY . .

RUN apk add --no-cache tini

EXPOSE 8000

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["python", "app.py"]
