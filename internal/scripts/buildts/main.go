package main

import (
	"fmt"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"strings"

	esbuild "github.com/evanw/esbuild/pkg/api"
	"github.com/vormadev/vorma/kit/executil"
)

var targetDir = "./npm_dist"

func main() {
	if err := os.RemoveAll(targetDir); err != nil {
		log.Fatalf("failed to remove target dir: %v", err)
	}

	if err := os.MkdirAll(targetDir, 0755); err != nil {
		log.Fatalf("failed to create target dir: %v", err)
	}

	buildKit()
	buildClient()
	buildReact()
	buildSolid()
	buildPreact()
	buildVue()
	buildVite()
	buildCreate()

	removeTestFiles()

	if err := copyDir(filepath.Clean("bootstrap/tmpls"), filepath.Clean("npm_dist/bootstrap/tmpls")); err != nil {
		log.Fatalf("copy bootstrap/tmpls: %v", err)
	}
	if err := copyFile(filepath.Clean("package.json"), filepath.Clean("npm_dist/package.json")); err != nil {
		log.Fatalf("copy package.json: %v", err)
	}
	log.Println("bootstrap/tmpls and package.json copied to npm_dist")
}

func buildKit() {
	tsconfig := "./kit/_typescript/tsconfig.json"
	runTSC(tsconfig)
	build("kit", esbuild.BuildOptions{
		Sourcemap:   esbuild.SourceMapLinked,
		Target:      esbuild.ESNext,
		Format:      esbuild.FormatESModule,
		TreeShaking: esbuild.TreeShakingTrue,
		Splitting:   true,
		Write:       true,
		Bundle:      true,
		EntryPoints: []string{
			"./kit/_typescript/converters/converters.ts",
			"./kit/_typescript/cookies/cookies.ts",
			"./kit/_typescript/csrf/csrf.ts",
			"./kit/_typescript/debounce/debounce.ts",
			"./kit/_typescript/fmt/fmt.ts",
			"./kit/_typescript/json/json.ts",
			"./kit/_typescript/listeners/listeners.ts",
			"./kit/_typescript/matcher/register.ts",
			"./kit/_typescript/matcher/find_best_match.ts",
			"./kit/_typescript/matcher/find_nested_matches.ts",
			"./kit/_typescript/theme/theme.ts",
			"./kit/_typescript/url/url.ts",
		},
		External: []string{"vorma"},
		Outdir:   "./npm_dist/kit/_typescript",
		Tsconfig: tsconfig,
	})
}

func buildClient() {
	tsconfig := "./internal/framework/_typescript/client/tsconfig.json"
	runTSC(tsconfig)
	build("client", esbuild.BuildOptions{
		Sourcemap:   esbuild.SourceMapLinked,
		Target:      esbuild.ESNext,
		Format:      esbuild.FormatESModule,
		TreeShaking: esbuild.TreeShakingTrue,
		Splitting:   true,
		Write:       true,
		Bundle:      true,
		EntryPoints: []string{"./internal/framework/_typescript/client/index.ts"},
		External: []string{
			"vorma",
		},
		Outdir:   "./npm_dist/internal/framework/_typescript/client",
		Tsconfig: tsconfig,
	})
}

func buildReact() {
	tsconfig := "./internal/framework/_typescript/react/tsconfig.json"
	runTSC(tsconfig)
	build("react", esbuild.BuildOptions{
		Sourcemap:   esbuild.SourceMapLinked,
		Target:      esbuild.ESNext,
		Format:      esbuild.FormatESModule,
		TreeShaking: esbuild.TreeShakingTrue,
		Splitting:   true,
		Write:       true,
		Bundle:      true,
		EntryPoints: []string{"./internal/framework/_typescript/react/index.tsx"},
		External: []string{
			"vorma",
			"react", "react-dom",
		},
		Outdir:   "./npm_dist/internal/framework/_typescript/react",
		Tsconfig: tsconfig,
	})
}

func buildSolid() {
	runTSC("./internal/framework/_typescript/solid/tsconfig.json")

	// we need babel transforms via esbuild-plugin-solid
	if err := executil.RunCmd("node", "./internal/scripts/buildts/build-solid.mjs"); err != nil {
		log.Fatalf("failed to run build-solid.mjs: %v", err)
	}

	log.Println("solid: esbuild (via node) succeeded")
}

func buildPreact() {
	tsconfig := "./internal/framework/_typescript/preact/tsconfig.json"
	runTSC(tsconfig)
	build("preact", esbuild.BuildOptions{
		Sourcemap:   esbuild.SourceMapLinked,
		Target:      esbuild.ESNext,
		Format:      esbuild.FormatESModule,
		TreeShaking: esbuild.TreeShakingTrue,
		Splitting:   true,
		Write:       true,
		Bundle:      true,
		EntryPoints: []string{"./internal/framework/_typescript/preact/index.tsx"},
		External: []string{
			"vorma",
			"preact", "preact/hooks",
			"@preact/signals",
			"preact/jsx-runtime", "preact/compat", "preact/test-utils",
		},
		Outdir:   "./npm_dist/internal/framework/_typescript/preact",
		Tsconfig: tsconfig,
	})
}

func buildVue() {
	tsconfig := "./internal/framework/_typescript/vue/tsconfig.json"
	runTSC(tsconfig)
	build("vue", esbuild.BuildOptions{
		Sourcemap:   esbuild.SourceMapLinked,
		Target:      esbuild.ESNext,
		Format:      esbuild.FormatESModule,
		TreeShaking: esbuild.TreeShakingTrue,
		Splitting:   true,
		Write:       true,
		Bundle:      true,
		EntryPoints: []string{"./internal/framework/_typescript/vue/index.tsx"},
		External: []string{
			"vorma",
			"vue",
		},
		Outdir:   "./npm_dist/internal/framework/_typescript/vue",
		Tsconfig: tsconfig,
	})
}

func buildVite() {
	tsconfig := "./internal/framework/_typescript/vite/tsconfig.json"
	runTSC(tsconfig)
	build("vite", esbuild.BuildOptions{
		Sourcemap:   esbuild.SourceMapLinked,
		Target:      esbuild.ESNext,
		Format:      esbuild.FormatESModule,
		TreeShaking: esbuild.TreeShakingTrue,
		Splitting:   true,
		Write:       true,
		Bundle:      true,
		EntryPoints: []string{"./internal/framework/_typescript/vite/vite.ts"},
		External: []string{
			"vorma",
			"vite",
		},
		Outdir:   "./npm_dist/internal/framework/_typescript/vite",
		Tsconfig: tsconfig,
	})
}

func buildCreate() {
	tsconfig := "./internal/framework/_typescript/create/tsconfig.json"
	runTSC(tsconfig)
	build("create", esbuild.BuildOptions{
		Sourcemap:   esbuild.SourceMapLinked,
		Target:      esbuild.ESNext,
		Format:      esbuild.FormatESModule,
		TreeShaking: esbuild.TreeShakingTrue,
		Write:       true,
		Bundle:      true,
		EntryPoints: []string{"./internal/framework/_typescript/create/main.ts"},
		External: []string{
			"node:child_process",
			"node:fs",
			"node:os",
			"node:path",
			"node:process",
			"node:readline",
			"node:stream",
			"node:util",
			"node:url",
			"node:tty",
		},
		Outdir:   "./internal/framework/_typescript/create/dist",
		Tsconfig: tsconfig,
	})
}

/////////////////////////////////////////////////////////////////////
/////// Build helpers
/////////////////////////////////////////////////////////////////////

func runTSC(tsConfig string) {
	runTSCWithOpts(tsConfig, "./npm_dist", "./")
}

func runTSCWithOpts(tsConfig, outDir, rootDir string) {
	fmtStr := "pnpm tsc" +
		" --project %s" +
		" --declaration" +
		" --emitDeclarationOnly" +
		" --outDir %s" +
		" --noEmit false" +
		" --rootDir %s" +
		" --sourceMap" +
		" --declarationMap"

	cmdStr := fmt.Sprintf(fmtStr, tsConfig, outDir, rootDir)
	log.Printf("running command: %s", cmdStr)
	fields := strings.Fields(cmdStr)
	cmd := exec.Command(fields[0], fields[1:]...)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	if err := cmd.Run(); err != nil {
		log.Fatalf("failed to run command: %v", err)
	}

	log.Println("tsc succeeded")
}

func build(label string, opts esbuild.BuildOptions) {
	result := esbuild.Build(opts)

	if len(result.Errors) > 0 {
		for _, err := range result.Errors {
			log.Println(fmt.Sprintf("%s:", label), err.Text)
		}
		log.Fatalf("%s: esbuild failed", label)
	}

	if len(result.Warnings) > 0 {
		for _, warn := range result.Warnings {
			log.Println(fmt.Sprintf("%s:", label), warn.Text)
		}
		log.Fatalf("%s: esbuild had warnings", label)
	}

	log.Printf("%s: esbuild succeeded\n", label)
}

func removeTestFiles() {
	err := filepath.Walk(targetDir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		// Remove test files and their source maps
		if strings.Contains(path, ".test.") ||
			strings.Contains(path, ".bench.") {
			return os.Remove(path)
		}

		return nil
	})

	if err != nil {
		log.Fatalf("failed to remove test files: %v", err)
	}

	log.Println("Test files removed successfully")
}

// copyDir recursively copies a directory tree from src to dst using host paths (Windows-safe).
func copyDir(src, dst string) error {
	src = filepath.Clean(src)
	dst = filepath.Clean(dst)

	fi, err := os.Stat(src)
	if err != nil {
		return err
	}
	if !fi.IsDir() {
		return fmt.Errorf("copyDir: %s is not a directory", src)
	}

	return filepath.WalkDir(src, func(path string, d os.DirEntry, err error) error {
		if err != nil {
			return err
		}

		rel, err := filepath.Rel(src, path)
		if err != nil {
			return err
		}
		outPath := filepath.Join(dst, rel)

		if d.IsDir() {
			return os.MkdirAll(outPath, 0755)
		}

		data, err := os.ReadFile(path)
		if err != nil {
			return err
		}
		if err := os.MkdirAll(filepath.Dir(outPath), 0755); err != nil {
			return err
		}
		return os.WriteFile(outPath, data, 0644)
	})
}

func copyFile(src, dst string) error {
	src = filepath.Clean(src)
	dst = filepath.Clean(dst)

	data, err := os.ReadFile(src)
	if err != nil {
		return err
	}
	if err := os.MkdirAll(filepath.Dir(dst), 0755); err != nil {
		return err
	}
	return os.WriteFile(dst, data, 0644)
}
