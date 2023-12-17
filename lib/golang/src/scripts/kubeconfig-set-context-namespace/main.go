// This program can be used to set the context and namespace in the users kubeconfig.
//
// Algorithmic overview:
// - Find the output file:
//   - First part of KUBECONFIG=
//   - Default to ~/.kube/config
//
// - Read the config
//
// - Replace the dev context with a new value that references the context and namespace passed on the command line
//
// - Write the config back to the output file
//
// This should work for a multipart KUBECONFIG= (expected value like ~/.kube/config:~/src/axioscode/axios/devops/kubeconfig),
// and also for an empty (or unset) KUBECONFIG=, such that the output file will be ~/.kube/config
//
// Note: kubectx/kubens cannot be used since we have a multipart KUBECONFIG= and kubens doesn't support that
// See https://github.com/ahmetb/kubectx/issues/211
package main

import (
	"log/slog"
	"os"
	"os/user"
	path "path/filepath"
	"strings"

	"github.com/lmittmann/tint"
	flag "github.com/spf13/pflag"
	"k8s.io/client-go/tools/clientcmd"
	"k8s.io/client-go/tools/clientcmd/api"
)

func main() {

	var cluster = "stage-hornex"
	var namespace string

	flag.StringVar(&namespace, "namespace", "", "Kubernetes namespace to set")
	flag.Parse()

	slog.SetDefault(
		slog.New(
			tint.NewHandler(
				os.Stdout,
				&tint.Options{ReplaceAttr: filterTimeAttr},
			),
		),
	)

	// Check flags
	if namespace == "" {
		slog.Error("--namespace is required")
		os.Exit(1)
	}

	// If KUBECONFIG= is set, use the first path from the list (works like PATH=)
	var outputFile = strings.Split(os.Getenv("KUBECONFIG"), ":")[0]

	// default to ~/.kube/config
	if outputFile == "" {
		user, err := user.Current()
		if err != nil {
			slog.Error("Failed to get users home directory", "error", err)
			os.Exit(1)
		}
		outputFile = path.Join(user.HomeDir, ".kube", "config")
	}

	logger := slog.With("config", outputFile)

	// ensure config exists (but might be empty)
	if _, err := os.Stat(outputFile); os.IsNotExist(err) {
		if err := os.MkdirAll(path.Dir(outputFile), 0755); err != nil {
			slog.Error("Failed to create kubeconfig directory", "error", err)
			os.Exit(1)
		}

		if _, err := os.Create(outputFile); err != nil {
			slog.Error("Failed to create empty kubeconfig", "error", err)
			os.Exit(1)
		}
	}

	// read config
	config, err := clientcmd.LoadFromFile(outputFile)
	if err != nil {
		logger.With("Failed to load kubeconfig", "error", err)
		os.Exit(1)
	}

	// Upsert a context named dev, with the namespace and staging cluster/user set
	config.Contexts["dev"] = &api.Context{
		Cluster:   cluster,
		AuthInfo:  cluster,
		Namespace: namespace,
	}

	// set current context
	config.CurrentContext = "dev"

	// write config
	if err := clientcmd.WriteToFile(*config, outputFile); err != nil {
		slog.Error("Error writing config", "error", err)
		os.Exit(1)
	}

	logger.Info("Kubeconfig Updated", "namespace", namespace)
}

func filterTimeAttr(groups []string, a slog.Attr) slog.Attr {
	if a.Key == slog.TimeKey && len(groups) == 0 {
		// Remove the Time attr since we get that from promtail/loki
		return slog.Attr{}
	}
	return a
}
