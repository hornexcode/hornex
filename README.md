# Hornex
A free cometitive platform for gamers

## Introduction

Welcome! 👋

This is where the magic happens

## Project Structure

Talking specifically about microservices **only**, the structure I like to recommend is the following, everything using `<` and `>` depends on the domain being implemented and the bounded context being defined.

- [ ] `build/`: defines the code used for creating infrastructure as well as docker containers.
  - [ ] `<cloud-providers>/`: define concrete cloud provider.
  - [ ] `<executableN>/`: contains a Dockerfile used for building the binary.
- [ ] `cmd/`
  - [ ] `<primary-server>/`: uses primary database.
  - [ ] `<replica-server>/`: uses readonly databases.
  - [ ] `<binaryN>/`
- [X] `db/`
  - [X] `migrations/`: contains database migrations.
  - [ ] `seeds/`: contains file meant to populate basic database values.
- [ ] `internal/`: defines the _core domain_.
  - [ ] `<datastoreN>/`: a concrete _repository_ used by the domain, for example `postgresql`
  - [ ] `http/`: defines HTTP Handlers.
  - [ ] `service/`: orchestrates use cases and manages transactions.
- [X] `pkg/` public API meant to be imported by other Go package.

There are cases where requiring a new bounded context is needed, in those cases the recommendation would be to
define a package like `internal/<bounded-context>` that then should follow the same structure, for example:

* `internal/<bounded-context>/`
  * `internal/<bounded-context>/<datastoreN>`
  * `internal/<bounded-context>/http`
  * `internal/<bounded-context>/service`