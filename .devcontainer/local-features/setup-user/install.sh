#!/usr/bin/env bash
set -eux

USERNAME=${USERNAME:-"coder"}

if [ "$(id -u)" -ne 0 ]; then
    echo 'Script must be run as root.'
    exit 1
fi

# Ensure the user exists
if ! id "$USERNAME" >/dev/null 2>&1; then
    echo "User '$USERNAME' does not exist. Create it (e.g. via common-utils) before running this script."
    exit 1
fi

USER_HOME=$(getent passwd "$USERNAME" | cut -d: -f6)

# Ensure login shells get the correct PATH if ENV updated it.
rm -f /etc/profile.d/00-restore-env.sh
echo "export PATH=${PATH//$(sh -lc 'echo $PATH')/\$PATH}" > /etc/profile.d/00-restore-env.sh
chmod +x /etc/profile.d/00-restore-env.sh

# ------------------------------------------------------
# Node / NVM setup
# ------------------------------------------------------
NODE_ROOT="${USER_HOME}/nvm"
mkdir -p "$NODE_ROOT"
ln -snf /usr/local/share/nvm "$NODE_ROOT"
NODE_PATH="${NODE_ROOT}/current"
chown -R "${USERNAME}:${USERNAME}" "$NODE_ROOT" || true

# ------------------------------------------------------
# NPM global install setup
# ------------------------------------------------------
NPM_GLOBAL="/usr/local/share/npm-global"

# Ensure npm group exists
if ! getent group npm >/dev/null 2>&1; then
    groupadd -r npm
fi

# Add user to npm group
usermod -aG npm "$USERNAME"

# Cooperative permissions
umask 0002

# Create global npm dir + config
mkdir -p "$NPM_GLOBAL"
touch /usr/local/etc/npmrc

# Ownership and group inheritance
chown "$USERNAME":npm "$NPM_GLOBAL" /usr/local/etc/npmrc
chmod g+s "$NPM_GLOBAL"

# Configure npm prefix (root + user)
npm config -g set prefix "$NPM_GLOBAL"
su "$USERNAME" -c "npm config -g set prefix '$NPM_GLOBAL'"

# Clean npm cache
npm cache clean --force >/dev/null 2>&1

# ------------------------------------------------------
# Docker setup
# ------------------------------------------------------
if getent group docker >/dev/null 2>&1; then
    usermod -aG docker "$USERNAME"
else
    groupadd -r docker
    usermod -aG docker "$USERNAME"
fi

# ------------------------------------------------------
# Coder CLI + code-server
# ------------------------------------------------------
ln -snf /var/tmp/coder/coder-cli/coder /usr/local/bin/coder
ln -snf /var/tmp/coder/code-server/bin/code-server /usr/local/bin/code-server

# ------------------------------------------------------
# sudo secure_path
# ------------------------------------------------------
cat <<EOF >> "/etc/sudoers.d/${USERNAME}"
Defaults secure_path="${NODE_PATH}/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/home/${USERNAME}/.local/bin"
EOF

# ------------------------------------------------------
# aliases
# ------------------------------------------------------
echo "alias cc=\"IS_SANDBOX=1 claude --dangerously-skip-permissions\"" >> "${USER_HOME}/.bashrc"
chown "${USERNAME}:${USERNAME}" "${USER_HOME}/.bashrc"

echo "Done!"
