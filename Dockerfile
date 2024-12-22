FROM nginx:alpine

# 创建工作目录
WORKDIR /usr/share/nginx/html

# 复制项目文件
COPY . .

# 设置正确的文件权限
RUN chmod -R 755 /usr/share/nginx/html

# 创建 nginx 配置
RUN echo 'server { \
    listen 80; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg)$ { \
        expires 30d; \
        add_header Cache-Control "public, no-transform"; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]