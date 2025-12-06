FROM python:slim AS deps

WORKDIR /app

COPY requirements.txt ./

RUN pip3 install -r requirements.txt

FROM alpine:2.7 AS runner

COPY --from=deps /app ./app

RUN apk add --no-cache tini

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["python", "./app/app.py"]