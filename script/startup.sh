#!/bin/bash

set -e

CURRENT_DIR=$(echo $(cd $(dirname $0) && pwd))
PROJECT_ROOT="${CURRENT_DIR}/.."

if [ -z "${GITHUB_TOKEN}" ]; then
  echo 'please set environment: export GITHUB_TOKEN="your github token"'
  exit 1
fi

if ! [ -e "${HOME}/.npmrc" ]; then
  touch ${HOME}/.npmrc
fi

if ! cat "${HOME}/.npmrc" | grep 'npm.pkg.github.com' > /dev/null; then
  echo "//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}" >> ~/.npmrc
fi

if ! [ -e "${PROJECT_ROOT}/.npmrc" ]; then
  touch ${PROJECT_ROOT}/.npmrc
fi

if ! cat "${PROJECT_ROOT}/.npmrc" | grep 'npm.pkg.github.com' > /dev/null; then
  echo '@pyar6329:registry=https://npm.pkg.github.com' >> "${PROJECT_ROOT}/.npmrc"
fi

cd ${PROJECT_ROOT}
npm install
