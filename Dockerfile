FROM lxsnsn/gitlab-ci-easynp

RUN apt-get update
RUN apt-get install -y telnet 
# to check from the command line if the server is running

# A Dockerfile to test the current CI-CD pipeline

WORKDIR /app
# copying the same files from working directory
COPY ./src /app/src
COPY ./public /app/public

# copying cypress files and configurations files
COPY ./cypress.config.js /app/cypress.config.js
COPY ./cypress /app/cypress

# copying the bdd files (and firebase configurations)
COPY ./bdd /app/bdd
COPY ./firebase.json /app/firebase.json
COPY ./.firebaserc /app/.firebaserc

# copying the package.json file
COPY ./package.json /app/package.json
COPY ./generateBadges.sh /app/generateBadges.sh
