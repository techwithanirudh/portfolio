#!/bin/bash

set -euo pipefail

# Copy env file
if [[ -f ".env" ]]; then
  echo ".env already exists; skipping copy"
else
  sudo cp .env.example .env
fi

# Install dependencies
pnpm install