# ---------- 1. Base image ----------
FROM node:20-alpine AS builder

# ---------- 2. Set working directory ----------
WORKDIR /app

# ---------- 3. Copy and install dependencies ----------
COPY package*.json ./
RUN npm install

# ---------- 4. Copy source code ----------
COPY . .
# ---------- 5. Generate Prisma Client ----------
RUN npx prisma generate

# ---------- 6. Build Next.js project ----------
RUN npm run build

# ---------- 5. Build Next.js project ----------
RUN npm run build

# ---------- 6. Production image ----------
FROM node:20-alpine AS runner
WORKDIR /app

# copy build output and node_modules from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
# COPY --from=builder /app/public ./public   ← this line is removed
COPY --from=builder /app/prisma ./prisma


# Expose port 3000
EXPOSE 3000

# ---------- 7. Start command ----------
CMD ["npm", "start"]
