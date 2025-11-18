#!/usr/bin/env bash

# Exit on error
set -o errexit

bundle install
bundle exec rails assets:precompile
bundle exec rails assets:clean

# 無料プランの場合はここにdb:migrateを含める
# bundle exec rails db:migrate