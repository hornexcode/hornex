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
- [x] `db/`
  - [x] `migrations/`: contains database migrations.
  - [ ] `seeds/`: contains file meant to populate basic database values.
- [ ] `internal/`: defines the _core domain_.
  - [ ] `<datastoreN>/`: a concrete _repository_ used by the domain, for example `postgresql`
  - [ ] `http/`: defines HTTP Handlers.
  - [ ] `service/`: orchestrates use cases and manages transactions.
- [x] `pkg/` public API meant to be imported by other Go package.

There are cases where requiring a new bounded context is needed, in those cases the recommendation would be to
define a package like `internal/<bounded-context>` that then should follow the same structure, for example:

- `internal/<bounded-context>/`
  - `internal/<bounded-context>/<datastoreN>`
  - `internal/<bounded-context>/http`
  - `internal/<bounded-context>/service`

## Development Environment

Hornex uses a Development Environment that runs inside a Kubernetes cluster on your local machine.
Currently this uses:

- [`k3d` Cluster](https://k3d.io/v5.6.0/)
- [`tilt`](https://tilt.dev/)

### Initial setup

1. Install Docker
2. Install `git`
3. Clone the `hornex` repo
4. Run `devops/scripts/setup` until successful

## Cluster startup

After doing the initial setup at least once:

1. `yarn up`
2. Visit The [Tilt Web UI](http://localhost:10350/r/(all)/overview) to see status

## Cluster teardown

To delete the cluster and start from scratch:

`yarn down`
