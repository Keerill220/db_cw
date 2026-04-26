#!/usr/bin/env bash
# Зупиняє backend і frontend, які були запущені через ./start.sh.
# БД не зачіпається.
set -uo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RUN_DIR="$ROOT_DIR/.run"
BACK_PID="$RUN_DIR/backend.pid"
FRONT_PID="$RUN_DIR/frontend.pid"

stop_one() {
  local name="$1" pid_file="$2"
  if [[ ! -f "$pid_file" ]]; then
    echo "· $name: не запущений (немає $pid_file)"
    return
  fi
  local pid
  pid="$(cat "$pid_file" 2>/dev/null || echo "")"
  if [[ -z "$pid" ]] || ! kill -0 "$pid" 2>/dev/null; then
    echo "· $name: процес вже зупинений"
    rm -f "$pid_file"
    return
  fi
  echo "■ Зупинка $name (PID $pid та дочірні)…"
  # Завершуємо всю групу процесів
  pkill -TERM -P "$pid" 2>/dev/null || true
  kill -TERM "$pid" 2>/dev/null || true
  for _ in {1..10}; do
    kill -0 "$pid" 2>/dev/null || break
    sleep 0.5
  done
  if kill -0 "$pid" 2>/dev/null; then
    echo "  Не зупинилось м'яко — kill -9"
    pkill -KILL -P "$pid" 2>/dev/null || true
    kill -KILL "$pid" 2>/dev/null || true
  fi
  rm -f "$pid_file"
  echo "  ✓ $name зупинено"
}

stop_one "Frontend" "$FRONT_PID"
stop_one "Backend"  "$BACK_PID"

# Підстраховка: вбити будь-що, що тримає наші порти
for port in 5173 5200; do
  pids="$(lsof -ti tcp:"$port" 2>/dev/null || true)"
  if [[ -n "$pids" ]]; then
    echo "■ Звільнення порту $port: $pids"
    kill -TERM $pids 2>/dev/null || true
    sleep 1
    pids="$(lsof -ti tcp:"$port" 2>/dev/null || true)"
    [[ -n "$pids" ]] && kill -KILL $pids 2>/dev/null || true
  fi
done

echo "Готово."
