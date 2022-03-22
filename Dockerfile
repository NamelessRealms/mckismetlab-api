FROM node:16 AS BUILD

# Add package file
COPY package.json ./
COPY yarn.lock ./

# Install dependencies
RUN yarn --frozen-lockfile

# Copy source
COPY src ./src
COPY tsconfig.json ./tsconfig.json
COPY types.d.ts ./types.d.ts

# Build tsc
RUN tsc

# remove development dependencies
RUN npm prune --production

# Start production image build
FROM node:16-alpine

# copy from build image
COPY --from=BUILD /dist ./dist
COPY --from=BUILD /node_modules ./node_modules

# Copy static files
COPY src/public dist/public
COPY src/views dist/views

# Add env
ENV NODE_ENV=production

CMD ["node", "dist/index.js"]