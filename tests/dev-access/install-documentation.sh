#!/usr/bin/env bash
set -euo pipefail
set +x
umask 077
stage=/home/phuclam/idea-api-docs-20261009-53-01
root=/home/phuclam/idea-dev-access-20261009-51-04
[[ $(id -un) == phuclam && $(realpath -e "$stage") == "$stage" && $(realpath -e "$root") == "$root" ]] || exit 3
[[ $(stat -c '%U:%a' "$stage") == phuclam:700 && $(stat -c '%U:%a' "$root") == phuclam:700 ]] || exit 3
cd "$stage"
sha256sum --strict -c install.sha256
[[ $(sha256sum idea-server-documentation.jar | cut -d' ' -f1) == 103b5bc8fa628f7a83e56dfa3393e24b7f29d3d9c7f7e201dc344385da2e0a44 ]] || exit 3
(cd "$root"; sha256sum --strict -c inputs.sha256 >/dev/null)
(cd "$stage/control-candidate"; sha256sum --strict -c inputs.sha256 >/dev/null)
for name in common.sh backend.sh edge.sh nginx-dev.conf nginx-review.conf environment.sh inputs.sha256; do
  [[ -f $root/$name && ! -L $root/$name && -f $stage/control-candidate/$name && ! -L $stage/control-candidate/$name ]] || exit 3
done
for name in edge.sh nginx-dev.conf nginx-review.conf; do cmp -- "$root/$name" "$stage/control-candidate/$name" || exit 3; done
grep -Fx 'jar=/home/phuclam/idea-api-docs-20261009-53-01/idea-server-documentation.jar' "$stage/control-candidate/environment.sh" >/dev/null
grep -Fx 'jar_sha256=103b5bc8fa628f7a83e56dfa3393e24b7f29d3d9c7f7e201dc344385da2e0a44' "$stage/control-candidate/environment.sh" >/dev/null
[[ ! -e $stage/control-predecessor && ! -e $stage/identity-before.private.json ]] || exit 3
mkdir -m 700 "$stage/control-predecessor"
for name in common.sh backend.sh edge.sh nginx-dev.conf nginx-review.conf environment.sh inputs.sha256; do cp -p -- "$root/$name" "$stage/control-predecessor/$name"; done
cp -p -- "$root/edge.state" "$stage/edge-before.state"
credentials=/home/phuclam/.config/idea/f03a-test.env
[[ $(stat -c '%U:%a' "$credentials") == phuclam:600 ]] || exit 3
set -a; . "$credentials"; set +a
snapshot() {
  PGPASSWORD="$IDEA_DATABASE_APP_PASSWORD" psql -X -h 127.0.0.1 -p 5432 -U idea_ddm_app -d idea_ddm_iam_ui_20261007_46 -v ON_ERROR_STOP=1 -Atqc \
    "SET search_path TO iam_ui_c3b8cde44f9a4d1199306c381c12d1bb; SELECT json_build_object(
      'actors',(SELECT json_agg(x ORDER BY actor_id) FROM (SELECT * FROM actor) x),
      'accounts',(SELECT json_agg(x ORDER BY account_id) FROM (SELECT * FROM idea_account) x),
      'logins',(SELECT json_agg(x ORDER BY login_identity_id) FROM
        (SELECT login_identity_id,account_id,login_identifier,normalized_login_identifier,created_at,
          password_verifier IS NOT NULL AS credential_present FROM login_identity) x));"
}
snapshot > "$stage/identity-before.private.json"
phase=unchanged
recover() {
  result=$?
  trap - EXIT INT TERM
  if [[ $result != 0 && $phase != unchanged && $phase != committed ]]; then
    if [[ $phase == starting || $phase == started ]]; then
      if ! bash "$root/backend.sh" stop; then
        echo 'DOCUMENTATION_DEPLOY=FAIL;ROLLBACK=BLOCKED_OWNERSHIP_OR_STOP;NO_UNKNOWN_PROCESS_SIGNALLED=true'
        exit "$result"
      fi
    fi
    # A failed copy before start has no candidate process; restore only these
    # exact owned controls. Preserve all package/snapshot/failure evidence.
    for name in common.sh backend.sh edge.sh nginx-dev.conf nginx-review.conf environment.sh inputs.sha256; do
      cp -p -- "$stage/control-predecessor/$name" "$root/$name" || exit "$result"
    done
    if bash "$root/backend.sh" start; then
      echo 'DOCUMENTATION_DEPLOY=FAIL;PREDECESSOR_RESTORED=true'
    else
      echo 'DOCUMENTATION_DEPLOY=FAIL;PREDECESSOR_RESTART=FAIL'
    fi
  fi
  exit "$result"
}
trap recover EXIT
trap 'exit 130' INT
trap 'exit 143' TERM
bash "$root/backend.sh" stop
phase=stopped
for name in common.sh backend.sh edge.sh nginx-dev.conf nginx-review.conf environment.sh inputs.sha256; do
  cp -- "$stage/control-candidate/$name" "$root/$name"; chmod 600 "$root/$name"
done
phase=starting
bash "$root/backend.sh" start
phase=started
snapshot > "$stage/identity-after.private.json"
cmp -- "$stage/identity-before.private.json" "$stage/identity-after.private.json"
cmp -- "$stage/edge-before.state" "$root/edge.state"
bash "$root/backend.sh" status
bash "$root/edge.sh" status
curl --noproxy '*' --fail --silent --max-time 5 --cacert /home/phuclam/idea-nginx-dev-20261008-49/tls/certificate.pem \
  https://localhost:18448/health/database >/dev/null
unset IDEA_DATABASE_APP_PASSWORD IDEA_DATABASE_MIGRATION_PASSWORD PGPASSWORD
sha256sum --strict -c install.sha256
phase=committed
echo 'DOCUMENTATION_DEPLOY=PASS;IDENTITY_STATE_BYTE_IDENTICAL=true;EDGE_PROCESS_UNCHANGED=true;HTTPS_POSTGRESQL=UP;MIGRATION=NOT_RUN;BOOTSTRAP=NOT_RUN'
