
allow_k8s_contexts("k3d-hornex")

def main():
    hornex_api()

def hornex_api(options):
    name = "hornex-api"
    service_path = "services/{}".format(name)
    dockerfile = "{}/Dockerfile".format(service_path)
    install_triggers = ["pyproject.toml", "poetry.lock"]

    docker_build(
        ref=name,
        context=".",
        dockerfile=dockerfile,
        only=[service_path],
    )

    watch_file(dockerfile)

main
