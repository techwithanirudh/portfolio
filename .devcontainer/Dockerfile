FROM mcr.microsoft.com/devcontainers/typescript-node:22

# [Optional] Uncomment this section to install additional OS packages.
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends curl

# [Optional] Uncomment if you want to install more global node packages
# RUN su node -c "npm install -g <your-package-list -here>"

# [Optional] Uncomment if you want to install more global package managers
RUN corepack enable
RUN corepack install yarn pnpm -g

# [Optional] Uncomment if you want to install bun
RUN curl -fsSL https://bun.sh/install | bash
