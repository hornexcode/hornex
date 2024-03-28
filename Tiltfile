allow_k8s_contexts("k3d-hornex")

k8s_yaml(kustomize("kustomize/dev", flags=["--enable-helm"]))

port_forward(local_port=5432, name="postgres")

docker_build(
    ref="hornex-api",
    context="services/hornex-api",
    dockerfile="services/hornex-api/Dockerfile",
    target="development",
    pull=True,
    # container_args=["runsetup"],
    live_update=[
        fall_back_on(
            [
                "services/hornex-api/dev-api.sh",
                "services/hornex-api/pyproject.toml",
                "services/hornex-api/poetry.lock",
            ]
        ),
        sync("services/hornex-api", "/src/"),
        run(
            "poetry install --sync",
            trigger=[
                "services/hornex-api/pyproject.toml",
                "services/hornex-api/poetry.lock",
            ],
        ),
    ],
)

docker_build(
    ref="hornex-web",
    context="services/hornex-web",
    dockerfile="services/hornex-web/Dockerfile",
    pull=True,
    live_update=[
        fall_back_on(
            [
                "services/hornex-web/package.json",
                "services/hornex-web/bun.lockb",
            ]
        ),
        sync("services/hornex-web", "/usr/src/app"),
        run("bun install", trigger=["services/hornex-web/package.json"]),
    ],
)
