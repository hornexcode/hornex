FROM python:3.10.5-bullseye as base

RUN apt-get update && apt-get upgrade --yes postgresql-client

ENV \
  PIP_DEFAULT_TIMEOUT=100 \
  PIP_DISABLE_PIP_VERSION_CHECK=on \
  PIP_NO_CACHE_DIR=on \
  POETRY_HOME=/usr/local/bin \
  POETRY_NO_INTERACTION=true \
  POETRY_VERSION=1.3.2 \
  POETRY_VIRTUALENVS_IN_PROJECT=true \
  # PROMETHEUS_MULTIPROC_DIR=/tmp/prometheus_multiproc_dir \
  PYTHONDONTWRITEBYTECODE=1 \
  PYTHONUNBUFFERED=1

# RUN mkdir --mode=777 ${PROMETHEUS_MULTIPROC_DIR}

ENTRYPOINT ["./docker-entry.sh"]

RUN pip install "poetry==${POETRY_VERSION}"

# -------------------------------------------------------------------------------
# Used for development in Tilt
FROM base as development

WORKDIR /src/

ENV \
  PATH=/src/.venv/bin:${PATH} \
  GIT_COMMIT=dev \
  PIP_NO_CACHE_DIR=off \
  SENTRY_RELEASE=dev \
  GUNICORN_RELOAD=true \
  CELERY_RELOAD=true

RUN ln -s /src/static /static

# psqlrc copy relies on base assumption that user is root
COPY services/platform-api-content/psqlrc /root/.psqlrc
COPY services/platform-api-content /src/

# -------------------------------------------------------------------------------
# Runtime prod/stage/etc
FROM base as production

WORKDIR /app/

ENV PATH=/app/.venv/bin:${PATH}

COPY services/platform-api-content/pyproject.toml services/platform-api-content/poetry.lock /app/
RUN poetry install --only=main

# psqlrc copy relies on base assumption that user is root
COPY services/platform-api-content/psqlrc /root/.psqlrc
COPY services/platform-api-content /app/

RUN mv ./static /static

ARG GIT_COMMIT=local
ENV GIT_COMMIT=${GIT_COMMIT}
ENV SENTRY_RELEASE=${GIT_COMMIT}
