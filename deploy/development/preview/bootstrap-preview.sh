#!/usr/bin/env bash
set -euo pipefail
set +x
root=/home/phuclam/.local/share/idea/dev-preview-26
java=/opt/idea/tools/jdk-25.0.4.1+1/bin/java
[[ $(id -un) == phuclam && -t 0 && -t 1 ]] || { echo 'Interactive phuclam SSH console required'; exit 2; }
[[ ! -L $root/runtime.env && $(stat -c '%a:%U' "$root/runtime.env") == 600:phuclam ]] || exit 2
[[ $(sha256sum "$root/server.jar" | cut -d ' ' -f 1) == 48fe98659db3c075b771a90fd0f4fc61f79a01c01cc941114db9a5299a685bde ]] || exit 2
set -a; source "$root/runtime.env"; set +a
[[ $IDEA_DATABASE_NAME == idea_ddm_preview_20261001_26 && $IDEA_DATABASE_APP_USER == idea_ddm_app ]] || exit 2
echo 'Enter each value WITHOUT leading/trailing spaces:'
echo 'UUID: 00000000-0000-4000-8000-000000000026'
echo 'Organization name: IDEA Preview 26'
echo 'Custodian name: Preview Developer'
echo 'Login: preview.dev'
echo 'Then enter and confirm a NEW synthetic test password (not echoed).'
"$java" -Dloader.main=com.idea.ddm.identity.BootstrapOperatorCommand -cp "$root/server.jar" org.springframework.boot.loader.launch.PropertiesLauncher --initialize
state=$("$java" -Dloader.main=com.idea.ddm.identity.BootstrapOperatorCommand -cp "$root/server.jar" org.springframework.boot.loader.launch.PropertiesLauncher --inspect)
[[ $state == BOOTSTRAP_STATE=INITIALIZED ]] || { echo 'Bootstrap not initialized; preview remains unavailable'; exit 1; }
umask 077
touch "$root/provisioned"
chmod 600 "$root/provisioned"
echo 'IDEA_PREVIEW_SETUP_COMPLETE'
