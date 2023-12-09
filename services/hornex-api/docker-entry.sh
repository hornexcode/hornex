#!/bin/bash

set -Eeuo pipefail

function main() (

  dev_poetry_install

  fix_django_rest_swagger

  # Await Services
  python3 ./wait-for-db.py

  command="${1:-}"

  case "${command}" in

  "setup")
    run_setup
    ;;

  "test-coverage")
    coverage run manage.py test
    coverage report
    ;;

  "celery")
    if [[ "${CELERY_RELOAD:-}" == "true" ]]; then
      exec python3 manage.py celery_dev
    else
      exec celery \
        --app config worker \
        --concurrency="${CELERY_CONCURRENCY:-1}" \
        --loglevel="${CELERY_LOGLEVEL:-debug}" \
        --events
    fi
    ;;

  "")

    if [ -n "${AUTO_MIGRATE:-}" ]; then
      python3 manage.py migrate
    fi
    python3 manage.py collectstatic --no-input

    exec gunicorn --config gunicorn_conf.py config.gunicorn
    ;;

  *)
    # shellcheck disable=SC2068
    python3 manage.py $@
    ;;

  esac

)

function dev_poetry_install() (
  if [[ "${NAMESPACE:-}" == "dev-"* ]]; then
    set -x
    poetry install --sync
  fi
)

function fix_django_rest_swagger() (
  # from: https://github.com/marcgibbons/django-rest-swagger/pull/833/files
  # also see: https://stackoverflow.com/questions/55929472/django-templatesyntaxerror-staticfiles-is-not-a-registered-tag-library
  echo '{"event":"fixing django_rest_swagger", "logger":"docker-entry.sh"}'
  python_dep_location=$(pip show django_rest_swagger | awk 'BEGIN { FS=": " } /Location/ {print $2}')
  sed -i -e 's/staticfiles/static/g' $python_dep_location/rest_framework_swagger/templates/rest_framework_swagger/index.html
)

function run_setup() (
  printf "\n\n"
  echo "Running migrations..."
  echo "====================="
  python3 manage.py migrate

  printf "\n\n"
  echo "Loading fixture data..."
  echo "======================="
  python3 manage.py loaddata 01_admin_data \
    02_sections_and_templates \
    03_bulk_test_data \
    04_newsletters \
    05_bulk_newsletters \
    06_stories_with_embeds \
    07_environment_vars
  echo "Loading mock deep dive data"
  # Since this isn't run through manage.py (in root), we have to make PYTHONPATH explicit so it can import Django modules
  PYTHONPATH="." python3 bin/one-shot/2021/08_deep_dive_data.py
  echo "Loading mock job posting data"
  python3 manage.py gen_mock_job_postings
  echo "Loading mock pro newsletter data"
  python3 manage.py add_mock_pro_nls
  printf "\n\n"
  echo "Creating superuser..."
  echo "(Hit ctrl-C if you don't need or want a super user)"
  echo "====================="
  python3 manage.py createsuperuser

  echo "Done!"

)

main $@
