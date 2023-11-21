# Welcome to Tilt!
#   To get you started as quickly as possible, we have created a
#   starter Tiltfile for you.
#
#   Uncomment, modify, and delete any commands as needed for your
#   project's configuration.


# Output diagnostic messages
#   You can print log messages, warnings, and fatal errors, which will
#   appear in the (Tiltfile) resource in the web UI. Tiltfiles support
#   multiline strings and common string operations such as formatting.
#
#   More info: https://docs.tilt.dev/api.html#api.warn
print(
    """
-----------------------------------------------------------------
✨ Hello Tilt! This appears in the (Tiltfile) pane whenever Tilt
   evaluates this file.
-----------------------------------------------------------------
""".strip()
)
warn(
    "ℹ️ Open {tiltfile_path} in your favorite editor to get started.".format(
        tiltfile_path=config.main_path
    )
)


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
def tilt_demo():
    # Tilt provides many useful portable built-ins
    # https://docs.tilt.dev/api.html#modules.os.path.exists
    if os.path.exists("tilt-avatars/Tiltfile"):
        # It's possible to load other Tiltfiles to further organize
        # your logic in large projects
        # https://docs.tilt.dev/multiple_repos.html
        load_dynamic("tilt-avatars/Tiltfile")
    watch_file("tilt-avatars/Tiltfile")
    git_checkout(
        "https://github.com/tilt-dev/tilt-avatars.git", checkout_dir="tilt-avatars"
    )


# Edit your Tiltfile without restarting Tilt
#   While running `tilt up`, Tilt watches the Tiltfile on disk and
#   automatically re-evaluates it on change.
#
#   To see it in action, try uncommenting the following line with
#   Tilt running.
# tilt_demo()


def main():
    options = {
        "debug": config.get("services", {}).get("debug", {}),
        "dev_build": {},
        "image_ref": "148400639408.dkr.ecr.us-east-1.amazonaws.com/axioscode/dev-{}",
        "namespace": get_namespace(),
        "github_packages_token": get_env(
            "GITHUB_PACKAGES_TOKEN",
            "See https://inside.axioscode.tools/_/docs/getting-started/credentials/#github-packages-token",
        ),
        "platform": "linux/amd64",
        "repo_root": os.getcwd(),
        "tilt_local_database": str(
            not config.get("options", {}).get("shared-database", True)
        ).lower(),
    }


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

    if options["dev_build"].get(name):
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

    docker_build(**docker_build_options)

    watch_file(dockerfile)
