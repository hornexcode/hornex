.PHONY:run
run:
	poetry run python manage.py runserver

.PHONY:migrations
migrations:
	poetry run python manage.py makemigrations
	
.PHONY:migrate
migrate:
	poetry run python manage.py migrate
	
# args = $(foreach a,$($(subst -,_,$1)_args),$(if $(value $a),$a="$($a)"))

# check_args = files
# docs_serve_args = host port
# release_args = version
# test_args = match

# TASKS = \
#     check \
#     docs-serve \
#     release \
#     test

# .PHONY: $(TASKS)
# $(TASKS):
#     @poetry run duty $@ $(call args,$@)