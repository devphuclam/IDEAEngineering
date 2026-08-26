# Optional container image definition for the workspace CLI.
# Unused in V1 (Azure-free local workflow); kept as a placeholder per FR-018
# (managed execution stays disabled until an approved credential exists).

FROM node:24-bookworm-slim AS runtime
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY src/ ./src/
ENTRYPOINT ["node", "./src/cli/index.ts"]