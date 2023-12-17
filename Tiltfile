# Build Docker image
#   Tilt will automatically associate image builds with the resource(s)
#   that reference them (e.g. via Kubernetes or Docker Compose YAML).
#
#   More info: https://docs.tilt.dev/api.html#api.docker_build
#
# docker_build('registry.example.com/my-image',
#              context='.',
#              # (Optional) Use a custom Dockerfile path
#              dockerfile='./deploy/app.dockerfile',
#              # (Optional) Filter the paths used in the build
#              only=['./app'],
#              # (Recommended) Updating a running container in-place
#              # https://docs.tilt.dev/live_update_reference.html
#              live_update=[
#                 # Sync files from host to container
#                 sync('./app', '/src/'),
#                 # Execute commands inside the container when certain
#                 # paths change
#                 run('/src/codegen.sh', trigger=['./app/api'])
#              ]
# )


# Apply Kubernetes manifests
#   Tilt will build & push any necessary images, re-deploying your
#   resources as they change.
#
#   More info: https://docs.tilt.dev/api.html#api.k8s_yaml
#
# k8s_yaml(['k8s/deployment.yaml', 'k8s/service.yaml'])


# Customize a Kubernetes resource
#   By default, Kubernetes resource names are automatically assigned
#   based on objects in the YAML manifests, e.g. Deployment name.
#
#   Tilt strives for sane defaults, so calling k8s_resource is
#   optional, and you only need to pass the arguments you want to
#   override.
#
#   More info: https://docs.tilt.dev/api.html#api.k8s_resource
#
# k8s_resource('my-deployment',
#              # map one or more local ports to ports on your Pod
#              port_forwards=['5000:8080'],
#              # change whether the resource is started by default
#              auto_init=False,
#              # control whether the resource automatically updates
#              trigger_mode=TRIGGER_MODE_MANUAL
# )


# Run local commands
#   Local commands can be helpful for one-time tasks like installing
#   project prerequisites. They can also manage long-lived processes
#   for non-containerized services or dependencies.
#
#   More info: https://docs.tilt.dev/local_resource.html
#
# local_resource('install-helm',
#                cmd='which helm > /dev/null || brew install helm',
#                # `cmd_bat`, when present, is used instead of `cmd` on Windows.
#                cmd_bat=[
#                    'powershell.exe',
#                    '-Noninteractive',
#                    '-Command',
#                    '& {if (!(Get-Command helm -ErrorAction SilentlyContinue)) {scoop install helm}}'
#                ]
# )


# Extensions are open-source, pre-packaged functions that extend Tilt
#
#   More info: https://github.com/tilt-dev/tilt-extensions
#
load("ext://git_resource", "git_checkout")


# Organize logic into functions
#   Tiltfiles are written in Starlark, a Python-inspired language, so
#   you can use functions, conditionals, loops, and more.
#
#   More info: https://docs.tilt.dev/tiltfile_concepts.html
#


# Edit your Tiltfile without restarting Tilt
#   While running `tilt up`, Tilt watches the Tiltfile on disk and
#   automatically re-evaluates it on change.
#
#   To see it in action, try uncommenting the following line with
#   Tilt running.
# tilt_demo()


def main():
    """
    Read tilt_config.yaml
    For each service:
        - build and push a docker image
        - build and apply kubernetes manifests for the service
        - follow logs of the service
        - monitor source files for changes and (where possible) live update the running service
    """

    # configure tilt
    allow_k8s_contexts("dev")
    secret_settings(disable_scrub=True)

    config_file = "tilt_config.yaml"
    if not os.path.exists(config_file):
        local("go run ./lib/golang/src/scripts/update-tilt-config/main.go")
    config = read_yaml(config_file)

    options = {
        "debug": config.get("services", {}).get("debug", {}),
        "dev_build": {},
        "image_ref": "684903586616.dkr.ecr.us-east-1.amazonaws.com/hornexcode/dev-{}",
        "namespace": get_namespace(),
        "platform": "linux/amd64",
        "repo_root": os.getcwd(),
        # "tilt_local_database": str(
        #     not config.get("options", {}).get("shared-database", True)
        # ).lower(),
        "tilt_local_database": False,
    }

    hornex_api(options)


def hornex_api(options):
    """
    Build hornex-api
    """
    name = "hornex-api"
    service_path = "services/{}".format(name)
    dockerfile = "{}/Dockerfile".format(service_path)
    install_triggers = ["pyproject.toml", "poetry.lock"]

    docker_build_options = {
        "ref": options["image_ref"].format(name),
        "context": ".",
        "dockerfile": dockerfile,
        "extra_tag": "{}:tilt-latest".format(name),
        "only": [service_path],
        "platform": options["platform"],
        "ignore": [
            "{}/.db".format(service_path),
            "{}/.es".format(service_path),
        ],
    }

    # if options["dev_build"].get(name):
    docker_build_options.update(
        {
            "target": "development",
            "live_update": [
                fall_back_on("{}/docker-entry.sh".format(service_path)),
                sync(service_path, "/src/"),
                run(
                    "poetry install --sync",
                    trigger=[
                        ("{}/{}".format(service_path, f)) for f in install_triggers
                    ],
                ),
                run("/bin/kill -s SIGHUP 1"),
            ],
        }
    )

    default_registry(
        "684903586616.dkr.ecr.us-east-1.amazonaws.com",
        single_name="dev/dev-{}".format(name),
    )

    docker_build(**docker_build_options)

    watch_file(dockerfile)

    # manifests = helmfile(name, options)
    # _, rest = filter_yaml(
    #     manifests,
    #     api_version="batch/v1",
    #     kind="CronJob",
    #     name="platform-api-content-run-scheduled-tasks",
    # )
    # _, rest = filter_yaml(
    #     rest,
    #     api_version="batch/v1",
    #     kind="CronJob",
    #     name="platform-api-content-run-cdm-scheduled-tasks",
    # )
    # _, rest = filter_yaml(
    #     rest,
    #     api_version="batch/v1",
    #     kind="Job",
    #     labels={"axios.com/helm-hook": "db-migrate"},
    # )
    # k8s_yaml(rest)
    k8s_yaml("{}/k8s/spec.yaml".format(service_path))

    k8s_resource(
        name,
        labels=["services"],
        links=[
            link(
                "https://{namespace}-hornex-api.hornexcode.com".format(**options),
                name,
            )
        ],
    )

    k8s_resource(name, labels=["services"])


###################################################################################################
# helmfile functions


def helmfile(name, options):
    """
    Generate kubernetes manifests for a service in the monorepo
    """
    watch_file("services/{}/env/dev.env".format(name))
    watch_file("services/{}/helm/spec.yaml".format(name))

    cmd = (
        "REPOSITORIES_ROOT={repo_root}/.. "
        + "REPOSITORIES=hornex/services/{name}=latest "
        + "TILT_LOCAL_DATABASE={tilt_local_database} "
        + "helmfile "
        + "--file={repo_root}/../infra-chart/spec/helmfile.yaml "
        + "--namespace={namespace} "
        + "template"
    ).format(
        name=name,
        **options,
    )
    manifests = local(cmd, quiet=True)
    _, rest = filter_yaml(
        manifests,
        api_version="batch/v1",
        kind="Job",
        labels={"hornex.gg/helm-hook": "db-migrate"},
    )
    return rest


def helmfile_polyrepo(name, options):
    """
    Generate kubernetes manifests for a service in another repo
    """
    src = "{}/../{}".format(options["repo_root"], name)
    spec = "{}/spec.yaml".format(src)
    helmfile = "{}/../infra-chart/spec/helmfile.yaml".format(options["repo_root"])

    watch_file(spec)
    watch_file(helmfile)

    cmd = (
        "REPOSITORIES_ROOT={repo_root}/.. "
        + "REPOSITORIES={name}=latest "
        + "TILT_LOCAL_DATABASE={tilt_local_database} "
        + "SPEC_PATH={spec} "
        + "helmfile "
        + "--file={file} "
        + "--namespace={namespace} "
        + "template"
    ).format(
        name=name,
        spec=spec,
        file=helmfile,
        **options,
    )

    manifests = local(cmd, quiet=True)
    _, rest = filter_yaml(
        manifests,
        api_version="batch/v1",
        kind="Job",
        labels={"axios.com/helm-hook": "db-migrate"},
    )
    return rest


###################################################################################################
# helpers


def get_env(name, help):
    """
    Return the valueof an environment variable, missing variables are fatal
    """
    value = os.getenv(name, "").strip()
    if not value:
        fail("{name} not set: {help}".format(name=name, help=help))
    return value


def get_namespace():
    """
    Get or calculate dev namesapce name based on AWS username
    """
    if os.getenv("AXIOS_TILT_FORCE_REMOTE_NAMESPACE", False):
        ns = os.getenv("AXIOS_TILT_REMOTE_NAMESPACE", None)
    else:
        username = str(
            local(
                "aws sts get-caller-identity | jq -r .Arn | cut -d / -f 2", quiet=True
            )
        ).strip()
        ns = "dev-{}".format(username)
    return ns


main()
