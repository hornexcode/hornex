// Merge Tilt configuration default into user config
package main

import (
	"fmt"
	"log"
	"log/slog"
	"os"
	"os/exec"
	"strings"

	"github.com/lmittmann/tint"
	"gopkg.in/yaml.v2"
)

func main() {
	var err error
	var home string
	var config = newConfig()

	slog.SetDefault(
		slog.New(
			tint.NewHandler(
				os.Stdout,
				&tint.Options{ReplaceAttr: filterTimeAttr},
			),
		),
	)

	if home, err = repoRoot(); err != nil {
		slog.Error("Error getting repo root", "error", err)
		os.Exit(1)
	}

	// read default config
	var defaultPath = fmt.Sprintf("%s/devops/default_tilt_config.yaml", home)
	if err = config.read(defaultPath); err != nil {
		slog.Error("Reading default config", "error", err)
		os.Exit(1)
	}

	// read user config
	var userPath = fmt.Sprintf("%s/tilt_config.yaml", home)
	if err = config.readMaybeLegacy(userPath); err != nil && !os.IsNotExist(err) {
		slog.Error("Reading user config", "error", err)
		os.Exit(1)
	}

	// TODO(Nicholas Capo): Remove on or after 2023-08-01
	if v, ok := config.Options["production-build"]; ok {
		slog.Warn("Migrating production-build option")
		for k := range config.Services.ProductionBuild {
			config.Services.ProductionBuild[k] = v
		}
		delete(config.Options, "production-build")
	}

	// write user config
	data, err := config.write(userPath)
	if err != nil {
		slog.Error("Writing user config", "error", err)
		os.Exit(1)
	}
	config.display(data)
}

type Services struct {
	Enabled         map[string]bool `yaml:"enabled"`
	ProductionBuild map[string]bool `yaml:"production-build"` //nolint:tagliatelle
	Debug           map[string]bool `yaml:"debug"`
}

type Config struct {
	Services Services        `yaml:"services"`
	Options  map[string]bool `yaml:"options"`
}

func newConfig() Config {
	return Config{
		Services: Services{
			Enabled:         map[string]bool{},
			ProductionBuild: map[string]bool{},
			Debug:           map[string]bool{},
		},
		Options: map[string]bool{},
	}
}

func (c Config) read(path string) (err error) {
	var data []byte
	if data, err = os.ReadFile(path); err != nil {
		return
	}

	err = yaml.Unmarshal(data, &c)

	return
}

func (c Config) readMaybeLegacy(path string) (err error) {
	var data []byte
	if data, err = os.ReadFile(path); err != nil {
		return
	}

	var lc = newLegacyConfig()
	err = yaml.Unmarshal(data, &lc.c)

	if err == nil {
		c.loadFromLegacy(lc)
	} else {
		err = yaml.Unmarshal(data, &c)
	}

	return
}

func (c Config) loadFromLegacy(lc LegacyConfig) {
	slog.Warn("Converting from legacy configuration format")
	for k, v := range lc.c {
		if k == "production-build" || k == "shared-database" {
			c.Options[k] = v
		} else if strings.HasPrefix(k, "debug-") {
			c.Services.Debug[strings.TrimPrefix(k, "debug-")] = v
		} else {
			c.Services.Enabled[k] = v
		}
	}
}

func (c Config) write(path string) (data []byte, err error) {
	var comment = []byte("# Tilt Configuration (to reset to defaults delete this file and run `yarn up` or `tilt up`)\n\n")

	if data, err = yaml.Marshal(&c); err != nil {
		return
	}

	// write comment and data together
	err = os.WriteFile(path, append(comment, data...), 0600)

	return
}

func (c Config) display(data []byte) {
	log.Println("Tilt Configuration:")
	for _, l := range strings.Split(string(data), "\n") {
		log.Println("  " + l)
	}
}

func repoRoot() (string, error) {
	cmd := exec.Command("git", "rev-parse", "--show-toplevel")
	out, err := cmd.CombinedOutput()
	return strings.TrimSpace(string(out)), err
}

type LegacyConfig struct {
	c map[string]bool
}

func newLegacyConfig() LegacyConfig {
	return LegacyConfig{
		c: map[string]bool{},
	}
}

func filterTimeAttr(groups []string, a slog.Attr) slog.Attr {
	if a.Key == slog.TimeKey && len(groups) == 0 {
		// Remove the Time attr since we get that from promtail/loki
		return slog.Attr{}
	}
	return a
}
