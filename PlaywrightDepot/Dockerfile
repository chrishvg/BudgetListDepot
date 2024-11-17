FROM node:20

RUN apt-get update && apt-get install -y \
    libwoff1 \
    libopus0 \
    libwebp7 \
    libwebpdemux2 \
    libenchant-2-2 \
    libgudev-1.0-0 \
    libsecret-1-0 \
    libhyphen0 \
    libgdk-pixbuf2.0-0 \
    libegl1 \
    libnotify4 \
    libxslt1.1 \
    libevent-2.1-7 \
    libgles2 \
    libvpx7 \
    libxcomposite1 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libepoxy0 \
    libgtk-3-0 \
    libharfbuzz0b \
    libgstreamer-gl1.0-0 \
    libgstreamer-plugins-bad1.0-0 \
    gstreamer1.0-plugins-good \
    gstreamer1.0-plugins-bad \
    xvfb \
    dbus \
    dbus-x11 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npx playwright install chromium

COPY index.mjs ./

EXPOSE 3000

RUN echo '#!/bin/bash\n\
Xvfb :99 -screen 0 1024x768x16 &\n\
export DISPLAY=:99\n\
node index.mjs' > /usr/src/app/start.sh

RUN chmod +x /usr/src/app/start.sh

CMD ["/usr/src/app/start.sh"]