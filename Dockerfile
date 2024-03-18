FROM lxsnsn/gitlab-ci-easynp

WORKDIR /app
# copying the same files from working directory
COPY ./src /app/src
COPY ./public /app/public
COPY ./cypress /app/cypress
COPY ./bdd /app/bdd
COPY ./firebase.json /app/firebase.json
COPY ./.firebaserc /app/.firebaserc
COPY ./package.json /app/package.json

