# surfy

TS convention 2017 guide bot.

## Develop

To get started developing the bot:

- install dependencies with `yarn install`
- start a local mongodb instance with `yarn start-mongo`. The instance listens
  on port `27017`, and reads/writes data from/to the `.mongodb` subdirectory of
  the current working directory (_note_: the first time you run the command, the
  mongo binary will be downloaded, so it might take a while)

Then you can either:

- `yarn dev`: starts the service, restarts it on code changes
- `yarn test`: runs tests
- `yarn test -- --watch`: runs tests, re-runs them on code changes
- `yarn lint`: runs the code linter

## Run

To run the service, simply run `yarn start`.

You can check the health status of the service via `GET /health`: the server
will return a `200` if the service is in a healthy status, a `503` otherwise.
The (json) body of the response contains details about the health status. When a
valid `access_token` is provided in the request querystring, more status details
are returned.

## Configure

The following environment variables can be used to configure the server:

> General server configurations

* `NODE_ENV` (defaults to `development`)
* `LOG_LEVEL` (defaults to `info`)
* `HOSTNAME` (defaults to `localhost`)
* `PORT` (defaults to `3000`): network port to attach to
* `HEALTH_ROUTE_ACCESS_TOKEN`: the token that allows getting the detailed health
  status of the service

> Bot configurations

* `MONGODB_URL` (defaults to `mongodb://localhost:27017/dev`): url of a mongodb
  instance (or an Azure Documentdb instance supporting the mongodb protocol)
* `LUIS_RECOGNIZER_URLS` (required): a JSON array of LUIS urls (we don't use a
  comma-separated list since urls could contain commas). Example:
  `["https://westus.api.cognitive.microsoft.com/..."]`
* `FACEBOOK_PAGE_ID`: the id of the Facebook Page associated to the bot
* `FACEBOOK_PAGE_ACCESS_TOKEN`: the Messenger access token for the Facebook Page
  associated to the bot
* `MICROSOFT_APP_ID`: the Microsoft App id associated to the Botframework bot
* `MICROSOFT_APP_PASSWORD`: the Microsoft App password associated to the
  Botframework bot
* `SPELL_CHECK_API_URL` (required): Azure spell check endpoint with mode and mkt
  params (?mode=spell&mkt=it-it)
* `SPELL_CHECK_API_KEY` (required): Azure spell check api key
* `JWT_SECRET`: base64-encoded jwt secret, defaults to
  `btoa("secret") === "c2VjcmV0"`
* `WEATHER_API_KEY`: API key for https://openweathermap.org/
* `WEATHER_API_URL`: url of the openweathermap api

**Note:** when running the service with `yarn dev` you can supply the above
environment variables by writing them in the `.env` file
([syntax](https://github.com/motdotla/dotenv)). If it doesn't exist, an empty
`.env` file is created after running `yarn install`.
