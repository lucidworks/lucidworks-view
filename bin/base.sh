
if [ -z "$SCRIPT" ]; then echo "SCRIPT not set"; exit 1; fi
if [ -z "$VIEW_HOME" ]; then echo "VIEW_HOME not set"; exit 1; fi

DATEFORMAT="+%Y-%m-%d %H:%M:%SZ"
function output() {
  echo $(date -u "$DATEFORMAT") "$1"
}

function check_vars() {
  if [ -z "$PID_FILE" ]; then echo "PID_FILE not set"; exit 1; fi
  if [ -z "$LOG_DIR" ]; then echo "LOG_DIR not set"; exit 1; fi
}

function do_start() {
  check_vars

  if [ ! -d "$LOG_DIR" ]; then
    output "Missing log dir '$LOG_DIR'; re-creating"
    if ! mkdir -p "$LOG_DIR"; then
      output "failed to create '$LOG_DIR'"
      exit 1
    fi
  fi

  if [ -f "$PID_FILE" ]; then
    pid=`cat "${PID_FILE}"`
    if kill -0 $pid &>/dev/null ; then
      output "process $pid from pid file $PID_FILE is running; not starting"
      return
    fi
  fi

  report_port "Starting"
  nohup "$VIEW_HOME/bin/$SCRIPT" "run" > "$LOG_DIR/run.out" 2>&1 </dev/null &
}

function do_status() {
  check_vars
  if [ -f "$PID_FILE" ]; then
    pid=`cat "${PID_FILE}"`
    if kill -0 $pid &>/dev/null; then
      output "process $pid from pid file $PID_FILE is running"
    else
      output "process $pid from pid file $PID_FILE is not running"
    fi
  else
    output "no pid file $PID_FILE"
  fi
}

function do_stop() {
  check_vars

  if [ ! -f "$PID_FILE" ]; then
    output "no pid file $PID_FILE"
    return
  fi

  pid=`cat "${PID_FILE}"`
  if ! kill -0 $pid &>/dev/null ; then
    output "process $pid from pid file $PID_FILE is not running"
    rm "$PID_FILE"
    return
  fi

  output "Stopping lucidworks-view on port $HTTP_PORT"

  if kill -0 $pid &>/dev/null ; then
    kill $pid
    sleep 5
    if kill -0 $pid &>/dev/null ; then
      output "process $pid from pid file $PID_FILE is still running. Sending KILL signal"
      kill -9 $pid &>/dev/null
      sleep 1
    fi
  fi
  if [ -f "$PID_FILE" ]; then
    rm "$PID_FILE"
  fi
}

function do_usage() {
  echo "Usage: $0 [start, stop, status, restart, run]"
  exit 1
}

function report_port() {
  msg="$1"
  if [ -z "$msg" ]; then
    msg="Running"
  fi
  output "$msg $SERVICE_NAME on port $HTTP_PORT"
}

function write_pid_file() {
    echo $$ > "$PID_FILE"
}

function main() {
  arg="$1"
  cd "$VIEW_HOME"
  if [ "$arg" = "start" ]; then
    do_start
  elif [ "$arg" = "stop" ]; then
    do_stop
  elif [ "$arg" = "restart" ]; then
    do_stop
    sleep 1
    do_start
  elif [ "$arg" = "status" ]; then
    do_status
  elif [ "$arg" = "run" ]; then
    do_run
  elif [ "$arg" = "help" ]; then
    do_usage
  elif [ -z "$arg" ]; then
    do_run
  else
    echo "Unknown action: $arg"
    do_usage
  fi
}
