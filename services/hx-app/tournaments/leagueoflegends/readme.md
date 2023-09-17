# League of Legends App

This application inside tournaments is responsible for creating all we need
to run a tournament into riot's platform using their API

## Project structure

- [ ] `usecases/`: defines all the centralized business rules
  - [ ] `<usecase-name>.py/`: define concrete function that will handle a unit of work.
  - [ ] `<usecase-name>_test.py`: define integration tests mocking only the riot api.
- [ ] `tasks.py`: contains all the background tasks and can call usecases methods.
- [ ] `views.py`: contains all the controllers that might call a usecase to process an usecase through HTTP
- [ ] `tests.py`: contains feature tests for views
- [ ] `serializers.py`: works as a HTTP request validator and serialize i/o data for use cases and views
- [ ] `urls.py`: expose api endpoints to admin or to the hx app
