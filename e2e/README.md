# E2E-тесты (Playwright)

Тесты лежат отдельно от Vitest: запускают **настоящий браузер** и ходят на **уже поднятый** dev-сервер приложения.

## Что проверяется

- `smoke.spec.ts` — ответ `GET /`, отсутствие `error` в консоли и необработанных исключений на странице, наличие `#vorma-root`.
- `navigation.spec.ts` — клики по ссылкам `home` / `links` (как в шаблоне bootstrap). Если навигации нет, тест пропускается.

Базовый URL задаётся переменной **`BASE_URL`** (по умолчанию `http://127.0.0.1:3000`).

---

## Установка и запуск в WSL (Ubuntu)

Код на диске Windows (Cursor), тесты гоняете в WSL — так удобнее, чем ставить браузеры Playwright на Windows-файловую систему.

### 1. Node.js в WSL

```bash
# Версия 22+ (как в create-vorma)
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v
```

### 2. Репозиторий

Два варианта:

**A. Клон внутри WSL** (предпочтительно: быстрее `npm`/`node_modules`):

```bash
cd ~
git clone <ваш-remote> vorma
cd vorma
```

**B. Проект на диске Windows** (`/mnt/c/...`):

```bash
cd /mnt/c/Users/.../vorma
```

Учтите: на `/mnt/c` иногда медленнее; для тяжёлых `npm install` лучше вариант A.

### 3. Зависимости E2E

Из корня репозитория:

```bash
cd e2e
npm install
npx playwright install chromium
```

При необходимости системных библиотек для Chromium:

```bash
npx playwright install-deps chromium
```

### 4. Сборка фронта и dev-сервер

E2E не поднимает сервер сам — его нужно запустить **в другом терминале WSL** (в каталоге **вашего приложения** Vorma, не обязательно этот монорепозиторий).

Пример для сгенерированного приложения:

```bash
cd ~/my-vorma-app
npm run dev
```

Запомните порт (часто `3000` или тот, что вывел Vite/бэкенд).

### 5. Запуск тестов

В первом терминале сервер оставьте работать. Во втором:

```bash
cd ~/vorma/e2e   # путь к клону vorma в WSL
export BASE_URL=http://127.0.0.1:3000   # подставьте свой порт
npm test
```

Отчёт HTML:

```bash
npm run report
```

Интерактивный режим:

```bash
npm run test:ui
```

---

## Если dev-сервер крутится на Windows, а Playwright — в WSL

`127.0.0.1` в WSL — это **не** тот же localhost, что у процесса на Windows. Варианты:

1. **Рекомендуется:** запускать `npm run dev` **тоже в WSL** в каталоге проекта.
2. Или открыть приложение по IP хоста Windows из WSL:

```bash
export HOST=$(grep -m1 nameserver /etc/resolv.conf | awk '{print $2}')
export BASE_URL=http://$HOST:3000
npm test
```

Порт и файрвол должны слушать `0.0.0.0`, если сервер только на Windows.

---

## Переменные окружения

| Переменная   | Описание |
|-------------|----------|
| `BASE_URL`  | Базовый URL приложения (по умолчанию `http://127.0.0.1:3000`) |
| `CI`        | Если задана, включены `forbidOnly` и повторы |

---

## Артефакты

После прогона: `e2e/playwright-report/`, `e2e/test-results/`. Они в `.gitignore`.
