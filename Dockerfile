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


VOLUME ["/var/lib/clamav"]


WORKDIR /app

COPY  . /app
RUN  npm install 


# Copy supervisor config
COPY  ./configs/supervisord.conf /etc/supervisor/conf.d/supervisord-nodejs.conf
EXPOSE 4000
CMD  ["/usr/bin/supervisord", "-n"]