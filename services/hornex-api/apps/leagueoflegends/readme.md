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

--

# https://auth.riotgames.com/authorize?client_id=6bb8a9d1-2dbe-4d1f-b9cb-e4fbade3db54&redirect_uri=https://robin-lasting-magpie.ngrok-free.app/api/v1/riot/webhooks/oauth2/callback&response_type=code&scope=openid+offline_access
