FROM node:18.14-slim as builder
LABEL Author="mobiusy"

WORKDIR /build

RUN yarn config set registry https://registry.npmmirror.com

COPY package.json ./package.json
COPY yarn.lock ./yarn.lock

RUN yarn

COPY ./ ./

RUN yarn prisma generate && yarn build

FROM node:18.14-slim as prod

LABEL Author="mobiusy"

# 设置时区
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime  && echo 'Asia/Shanghai' >/etc/timezone

WORKDIR /opt/application

# 将生成的可执行文件copy到当前工作目录下
COPY --from=builder /build/dist ./dist
COPY --from=builder /build/node_modules ./node_modules
COPY --from=builder /build/package.json ./package.json


# 容器启动时执行的命令
CMD ["yarn", "start:prod"]
