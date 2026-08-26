FROM node:24-bookworm-slim@sha256:3638d9a6fe4030bd716be989438248074489337ba3275657f93595428be4fc03

ARG DEBIAN_SNAPSHOT=20260803T000000Z
ARG BASH_VERSION=5.2.15-2+b13
ARG CA_CERTIFICATES_VERSION=20230311+deb12u1
ARG GIT_VERSION=1:2.39.5-0+deb12u3

# The slim base has no CA bundle; bootstrap only ca-certificates from the pinned
# snapshot over HTTP, then use HTTPS for every subsequent repository operation.
RUN rm -f /etc/apt/sources.list.d/debian.sources \
    && printf '%s\n' \
        "deb [check-valid-until=no] http://snapshot.debian.org/archive/debian/${DEBIAN_SNAPSHOT} bookworm main" \
        "deb [check-valid-until=no] http://snapshot.debian.org/archive/debian-security/${DEBIAN_SNAPSHOT} bookworm-security main" \
      > /etc/apt/sources.list.d/debian-snapshot.list \
    && apt-get update \
    && apt-get install -y --no-install-recommends "ca-certificates=${CA_CERTIFICATES_VERSION}" \
    && rm -rf /var/lib/apt/lists/* \
    && printf '%s\n' \
        "deb [check-valid-until=no] https://snapshot.debian.org/archive/debian/${DEBIAN_SNAPSHOT} bookworm main" \
        "deb [check-valid-until=no] https://snapshot.debian.org/archive/debian-security/${DEBIAN_SNAPSHOT} bookworm-security main" \
      > /etc/apt/sources.list.d/debian-snapshot.list \
    && apt-get update \
    && apt-get install -y --no-install-recommends \
      "bash=${BASH_VERSION}" \
      "git=${GIT_VERSION}" \
    && rm -rf /var/lib/apt/lists/*

USER node
