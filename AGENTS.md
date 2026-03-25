# Инструкция для AI-агента

## ОС и окружение
- **ОС:** Windows
- **Терминал:** PowerShell или Git Bash
- **Go версия:** 1.21+
- **Node.js версия:** 20+

## Команды
- Установка зависимостей Go: `go mod download`
- Установка TypeScript зависимостей: `cd internal/framework/_typescript && npm install`
- Запуск тестов: `go test ./...`

## Что нужно сделать
Добавить поддержку Vue.js 3 во фреймворк Vorma по аналогии с React.

## Структура для Vue
Создать папку `internal/framework/_typescript/vue/` с файлами:
- index.tsx — точка входа
- src/vue.tsx — компонент VormaRootOutlet
- src/link.tsx — компонент VormaLink
- src/helpers.ts — типобезопасные хуки
- tsconfig.json — конфигурация TypeScript для Vue JSX

## Coding Guidelines
- Используй Vue 3 Composition API
- JSX синтаксис с @vue/babel-plugin-jsx
- Реактивность через ref, computed, watch
- Следуй стилю кода из React-реализации