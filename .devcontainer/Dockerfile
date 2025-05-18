ARG VARIANT=22-bookworm
FROM mcr.microsoft.com/devcontainers/javascript-node:1-${VARIANT}

# Install tslint, typescript. eslint is installed by javascript image
ARG NODE_MODULES="tslint-to-eslint-config typescript"
RUN su node -c "umask 0002 && npm install -g ${NODE_MODULES}" \
    && npm cache clean --force > /dev/null 2>&1

# [Optional] Uncomment this section to install additional OS packages.
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends curl

# [Optional] Uncomment if you want to install an additional version of node using nvm
ARG EXTRA_NODE_VERSION=18
RUN su node -c "source /usr/local/share/nvm/nvm.sh && nvm install ${EXTRA_NODE_VERSION}"

# [Optional] Uncomment if you want to install more global node packages
# RUN su node -c "npm install -g <your-package-list -here>"

# [Optional] Uncomment if you want to install more global package managers
RUN su corepack enable
RUN su corepack install yarn pnpm -g

# [Optional] Uncomment if you want to install bun
RUN su curl -fsSL https://bun.sh/install | bash