# Инструкция для AI-агента

## ОС и окружение

- **ОС:** Windows (у автора репозитория; CI может отличаться).
- **Терминал:** PowerShell или Git Bash.
- **Go:** 1.21+ (`go version`).
- **Node.js:** 20+ (`node -v`).

## Сборка и запуск

- Зависимости Go: `go mod download`
- Сборка корня: `go build .`
- TypeScript / публикационный артефакт: `go run ./internal/scripts/buildts` (нужен **pnpm** в PATH; скрипт вызывает `pnpm tsc` и esbuild). Итог в `./npm_dist/`, плюс копирование `bootstrap/tmpls` и `package.json` в `npm_dist` по завершении.
- Установка npm-зависимостей фреймворка: из корня `npm install` или `pnpm i` (в проекте часто pnpm).
- Локальная проверка create: `internal/framework/_typescript/create` — см. `package.json` в этой папке.

## Тесты

- Go: `go test ./...` (на Windows часть пакетов в `kit/` может падать из-за путей/процессов; для изменений фреймворка разумно: `go test ./internal/framework/... ./bootstrap/...`).
- JS/TS: из корня `npx vitest run` или `pnpm vitest run`.
- Строгая проверка типов (как в Makefile): `pnpm tsgo --noEmit --project ./internal/framework/_typescript/vue` и цели `tscheck-*` из `Makefile` (нужен `pnpm`).

## Поддержка Vue.js 3 в Vorma

- Адаптер: `internal/framework/_typescript/vue/` (`VormaRootOutlet`, `VormaLink`, `helpers.ts`, `index.tsx`, `tsconfig.json`).
- Точка входа приложения (bootstrap): `initClient` + `createApp(VormaRootOutlet).mount(getRootEl())` — шаблон `bootstrap/tmpls/frontend_entry_tsx_vue_tmpl.txt`.
- В шаблонах компонентов `{{.Call}}` в `bootstrap/tmpls/frontend_*_tsx_tmpl.txt`: для **Solid** — `()`, для **Vue** — `.value` (рефы из `useLoaderData`), для React/Preact — пусто. Задаётся в `bootstrap/bootstrap.go` в `derived()`.

## Coding guidelines

- Vue: Composition API, JSX с `jsx: "preserve"` и `jsxImportSource: "vue"`, реактивность через `ref` / `computed` / `watch`.
- Паритет с React: импорты типов и хелперов из `vorma/client`; не дублировать типы заглушками в адаптере.
- Go: стиль как в соседних файлах; без лишних рефакторингов вне задачи.
- Не править прикреплённые планы пользователя (`.cursor/plans/…`) без явной просьбы.

## Документирование

- Не добавлять README/доки, если пользователь не просит.
- Комментарии в коде — только там, где без них неочевидно (краевые случаи, инварианты).

## Обновление этого файла

Если агенту приходится много раз заново выяснять одно и то же (команда, версия, особенность Windows), имеет смысл кратко дописать сюда факт.
