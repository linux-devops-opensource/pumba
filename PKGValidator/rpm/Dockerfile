FROM registry.redhat.io/rhel7:7.9

WORKDIR /software/
COPY package.json .
RUN curl -sL https://rpm.nodesource.com/setup_14.x | bash - && \
    yum install -y nodejs-14.15.3 --disablerepo=* --enablerepo=nodesource && \
    yum install -y file --disablerepo=* --enablerepo=rhel-7-server-rpms && \
    yum clean all && \
    npm i && \
    mkdir ./rpms4test
COPY index.js .

CMD [ "node", "index.js" ]