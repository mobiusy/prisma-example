FROM node:18.14-slim as builder
LABEL Author="mobiusy"

WORKDIR /build

# ENV PKG_CACHE_PATH /build/.pkg-cache
# RUN mkdir -p ${PKG_CACHE_PATH}/v3.4
# COPY fetched-v18.5.0-linux-x64 ${PKG_CACHE_PATH}/v3.4

RUN yarn config set registry https://registry.npmmirror.com

COPY package.json ./package.json
COPY yarn.lock ./yarn.lock

RUN yarn

COPY ./ ./

RUN yarn prisma generate && yarn build
RUN yarn pkg package.json

FROM node:18.14-slim as prod

LABEL Author="mobiusy"

RUN apt-get update
RUN apt-get install inetutils-ping -y
RUN apt-get install jq -y

# 设置时区
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime  && echo 'Asia/Shanghai' >/etc/timezone

WORKDIR /opt/application

COPY --from=builder /build/package.json ./
# 提取nodejs项目中pakcage.json安装的prisma版本号，然后安装到全局
RUN prismaVersion=$(cat package.json | jq '.dependencies["prisma"]' | sed 's/"//g')
RUN npm install -g prisma@$prismaVersion
# 删除package.json文件
RUN rm -rf package.json

# 将生成的可执行文件copy到当前工作目录下
COPY --from=builder /build/nestjs-prisma-example ./


# 容器启动时执行的命令，类似npm run start
CMD ["./nestjs-prisma-example"]
