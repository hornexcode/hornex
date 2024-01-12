# Kustomize

> [kustomize](https://kustomize.io/) introduces a template-free way to customize application configuration that simplifies the use of off-the-shelf applications.
> Now, built into kubectl as apply -k.

[Reference Documentation](https://kubectl.docs.kubernetes.io/references/kustomize/)

The basic idea is to use overlays and patches (instead of templated text, like `helm`) to customize a base sat of manifests.

In other words you start with a "base" of common manifests, and patch them for the specific need, for example `prod` vs `test`.

The simplest form of a patch is a partial Kubernetes manifest:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: hornex-api
  name: hornex-api
spec:
  replicas: 2
```

Kustomize use the labels to match a previously defined manifest and update it with the other values, in this case setting `replicas` to 2.

## `kustomization.yaml`

The start of a ["kustomization"](https://kubectl.docs.kubernetes.io/references/kustomize/kustomization/) is

## Building

To build (display) a kustomization run:

```shell
kustomize build {path/to/kustomization}
```

To apply a kustomization to a cluster run:

```shell
kubectl apply -k {path/to/kustomization}
```

## Overlays

### base

Common things we might want to apply.
Does not have a root kustomization, since all the parts are optional.

```shell
 ├── cluster
 │   ├── external-secrets
 │   ├── monitoring
 │   │   ├── grafana
 │   │   └── prometheus
 │   │       ├── exporters
 │   │       │   ├── blackbox-exporter
 │   │       │   ├── kube-state-metrics
 │   │       │   └── node-exporter
 │   │       └── server
 │   └── traefik
 └── services
     ├── hornex-api
     └── hornex-web
```

### dev

Use for per-person development namespaces.
Shall not include cluster resources
`dev` namespaces may be contained in the `test` cluster or in local clusters using `k3d`.

```shell
services
├── hornex-api
└── hornex-web
```

### test

Overlays for the `test` cluster and the `test` namespace

```shell
test
 ├── cluster
 └── services
     ├── hornex-api
     └── hornex-web
```

### prod

Overlays for the `prod` cluster and the `prod` namespace

```shell
prod
 ├── cluster
 └── services
     ├── hornex-api
     └── hornex-web
```
