# --- Stage 1: Build the React App ---
# Node.js 22 තියෙන Alpine Linux image එක බිල්ඩ් කරන්න පාවිච්චි කරයි (මේකට 'build' කියලා නම දෙනවා)
FROM node:22-alpine AS build

# කන්ටේනර් එක ඇතුලේ වැඩ කරන ෆෝල්ඩරය '/app' විදිහට සෙට් කරයි
WORKDIR /app

# package.json සහ package-lock.json ෆයිල් දෙක කන්ටේනර් එකට කොපි කරයි
COPY package*.json ./

# අවශ්‍ය Node පැකේජ් ටික ඉන්ස්ටෝල් කරයි (npm install වගේමයි, හැබැයි CI/CD වලට වඩා හොඳයි)
RUN npm ci

# අපේ මුළු React කෝඩ් එකම කන්ටේනර් එක ඇතුළට කොපි කරයි
COPY . .

# Production සඳහා React කෝඩ් එක බිල්ඩ් කරයි (මෙතකොට dist ෆෝල්ඩරය හැදේ)
RUN npm run build

# --- Stage 2: Serve the App with Nginx ---
# ඉතා කුඩා Nginx වෙබ් සර්වර් Image එකක් ගනී
FROM nginx:alpine

# අපිට අවශ්‍ය Nginx configuration ෆයිල් එක කොපි කරයි
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 1 වෙනි Stage එකේ (build) හැදුන 'dist' ෆෝල්ඩරයේ තියෙන බිල්ඩ් වුණ ෆයිල් ටික Nginx එකට කොපි කරයි
COPY --from=build /app/dist /usr/share/nginx/html

# කන්ටේනර් එක 80 port එකෙන් දත්ත යවන බව කියයි
EXPOSE 80

# Nginx සර්වර් එක start කරයි (background එකේ නැතුව foreground එකේ දුවන්න දෙයි)
CMD ["nginx", "-g", "daemon off;"]
