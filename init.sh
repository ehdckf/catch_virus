wget -O /var/lib/clamav/main.cvd https://packages.microsoft.com/clamav/main.cvd && \
wget -O /var/lib/clamav/daily.cvd https://packages.microsoft.com/clamav/daily.cvd && \
wget -O /var/lib/clamav/bytecode.cvd https://packages.microsoft.com/clamav/bytecode.cvd && \
pm2 start ecosystem.config.js && \
/usr/bin/supervisord -n