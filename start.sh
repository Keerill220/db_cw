#!/usr/bin/env bash
# Запускає бекенд (StudioBooking.Api) та фронтенд (Vite) у фоні.
# БД (PostgreSQL) НЕ зачіпається — потрібно щоб PG вже був запущений локально.
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACK_PROJECT="$ROOT_DIR/Back/StudioBooking.Api/StudioBooking.Api.csproj"
FRONT_DIR="$ROOT_DIR/Front"
RUN_DIR="$ROOT_DIR/.run"
BACK_LOG="$RUN_DIR/backend.log"
FRONT_LOG="$RUN_DIR/frontend.log"
BACK_PID="$RUN_DIR/backend.pid"
FRONT_PID="$RUN_DIR/frontend.pid"

BACK_URL="${BACK_URL:-http://localhost:5200}"
FRONT_URL="${FRONT_URL:-http://localhost:5173}"

mkdir -p "$RUN_DIR"

is_running() {
  local pid_file="$1"
  [[ -f "$pid_file" ]] || return 1
  local pid
  pid="$(cat "$pid_file" 2>/dev/null || echo "")"
  [[ -n "$pid" ]] && kill -0 "$pid" 2>/dev/null
}

start_backend() {
  if is_running "$BACK_PID"; then
    echo "▶ Backend вже запущений (PID $(cat "$BACK_PID"))"
    return
  fi
  echo "▶ Запуск backend ($BACK_URL)…"
  ASPNETCORE_ENVIRONMENT=Development \
    nohup dotnet run --project "$BACK_PROJECT" --urls "$BACK_URL" \
      >"$BACK_LOG" 2>&1 &
  echo $! >"$BACK_PID"
  echo "  PID $(cat "$BACK_PID"), лог: $BACK_LOG"
}

start_frontend() {
  if is_running "$FRONT_PID"; then
    echo "▶ Frontend вже запущений (PID $(cat "$FRONT_PID"))"
    return
  fi
  if [[ ! -d "$FRONT_DIR/node_modules" ]]; then
    echo "▶ Встановлення залежностей frontend…"
    (cd "$FRONT_DIR" && npm install)
  fi
  echo "▶ Запуск frontend ($FRONT_URL)…"
  nohup npm --prefix "$FRONT_DIR" run dev -- --host >"$FRONT_LOG" 2>&1 &
  echo $! >"$FRONT_PID"
  echo "  PID $(cat "$FRONT_PID"), лог: $FRONT_LOG"
}

wait_for_url() {
  local url="$1" name="$2" tries=60
  while ((tries-- > 0)); do
    if curl -fsS -o /dev/null "$url" 2>/dev/null; then
      echo "✓ $name готовий: $url"
      return 0
    fi
    sleep 1
  done
  echo "⚠ $name не відповів за відведений час ($url). Дивись логи."
  return 1
}

start_backend
start_frontend

echo ""
echo "Очікування готовності…"
wait_for_url "$BACK_URL/swagger/index.html" "Backend" || true
wait_for_url "$FRONT_URL" "Frontend" || true

echo ""
echo "Готово. Зупинити: ./stop.sh"
echo "  Swagger: $BACK_URL/swagger"
echo "  UI:      $FRONT_URL"
