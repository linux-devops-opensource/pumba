FROM registry.redhat.io/rhel7:7.9

WORKDIR /software/
COPY rhel-7-server-rpms.repo /etc/yum.repos.d/
COPY security ./security/
RUN curl -sL https://rpm.nodesource.com/setup_14.x | bash - && \
    yum install -y nodejs-14.15.3 --disablerepo=* --enablerepo=nodesource && \
    yum install -y file --disablerepo=* --enablerepo=rhel-7-server-rpms-pumba && \
    yum clean all --enablerepo=* && \
    mkdir ./rpms4test
COPY package.json .
RUN npm i
COPY . .

CMD [ "node", "index.js" ]