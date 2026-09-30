#!/bin/sh
set -eu
set +x

case "${1-}" in
  --inspect) ;;
  --initialize)
    if [ ! -t 0 ] || [ ! -t 1 ]; then
      printf '%s\n' 'Interactive operator console required; no initialization attempted.' >&2
      exit 2
    fi ;;
  *) printf '%s\n' 'Use --inspect or --initialize.' >&2; exit 2 ;;
esac
test "$#" = 1 || exit 2
script_dir="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
server_dir="$(CDPATH= cd -- "$script_dir/.." && pwd)"
jar="$server_dir/target/idea-server-0.1.0-SNAPSHOT.jar"
if [ ! -f "$jar" ]; then
  printf '%s\n' 'Build the approved Server source first: cd apps/server && sh ./mvnw -B -DskipTests package' >&2
  exit 2
fi
java_bin=${JAVA_HOME:+"$JAVA_HOME/bin/java"}
java_bin=${java_bin:-java}
exec "$java_bin" -Dloader.main=com.idea.ddm.identity.BootstrapOperatorCommand -cp "$jar" \
  org.springframework.boot.loader.launch.PropertiesLauncher "$1"
