FROM node:16
LABEL maintainer = "Quasi"

# Add package file
COPY package.json ./
COPY yarn.lock ./
COPY build.js ./build.js

# Install node_modulds
RUN yarn install

# Copy source
COPY src ./src
COPY tsconfig.json ./tsconfig.json
COPY types.d.ts ./types.d.ts

# Build dist
RUN yarn buildTsc

# Copy static files
COPY src/public dist/public
COPY src/views dist/views

ENV NODE_ENV=production
CMD ["node", "dist/index.js"]