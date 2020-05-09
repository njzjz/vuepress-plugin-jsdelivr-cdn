#!/usr/bin/env bash

git config --global user.name "travis"
git config --global user.name "travis@miantiao.me"

# setup repo
rm -rf $REPO_NAME
git clone https://github.com/$TRAVIS_REPO_SLUG.git
rm -rf $REPO_NAME/dist
cp -rf docs/.vuepress/dist $REPO_NAME

# update repo
cd $REPO_NAME
git add --all
git commit -m "update dist"
git push -f https://$GITHUB_KEY@github.com/$TRAVIS_REPO_SLUG.git HEAD:master

# clean
rm -rf $REPO_NAME