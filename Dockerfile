FROM node:20

# Install ClamAV and supervisor
RUN  apt-get update && apt-get upgrade
RUN  apt install -y clamav clamav-daemon
RUN  apt install -y wget
RUN  apt install -y supervisor
RUN  apt-get clean 

# Initial update of av databases
RUN  wget -O /var/lib/clamav/main.cvd https://packages.microsoft.com/clamav/main.cvd 
RUN  wget -O /var/lib/clamav/daily.cvd https://packages.microsoft.com/clamav/daily.cvd 
RUN  wget -O /var/lib/clamav/bytecode.cvd https://packages.microsoft.com/clamav/bytecode.cvd
RUN  chown clamav:clamav /var/lib/clamav/*.cvd

# Update Permission
RUN  mkdir /var/run/clamav 
RUN  chown clamav:clamav /var/run/clamav 
RUN  chmod 750 /var/run/clamav

# Configuration update
RUN  sed -i 's/^Foreground .*$/Foreground true/g' /etc/clamav/clamd.conf 
RUN  echo "TCPSocket 3310" >> /etc/clamav/clamd.conf
RUN  sed -i 's/^Foreground .*$/Foreground true/g' /etc/clamav/freshclam.conf

RUN npm i -g pm2
RUN npm i -g node-gyp

RUN pm2 install pm2-logrotate && \
	pm2 set pm2-logrotate:retain 'none' \
	pm2 set pm2-logrotate:compress true \
	pm2 set pm2-logrotate:dateFormat YYYY-MM-DD_HH-mm-ss \
	pm2 set pm2-logrotate:max_size 10G \
	pm2 set pm2-logrotate:rotateInterval '0 */4 * * * ' \
	pm2 set pm2-logrotate:rotateModule true \
	pm2 set pm2-logrotate:workerInterval 30


VOLUME ["/var/lib/clamav"]


WORKDIR /app

COPY  . /app
RUN  npm install 


# Copy supervisor config
COPY  ./configs/supervisord.conf /etc/supervisor/conf.d/supervisord-nodejs.conf
EXPOSE 4000
