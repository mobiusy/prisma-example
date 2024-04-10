## Nestjs + Prisma ORM + pkg 打包 + Docker部署

### 安装

```bash
yarn install
```

### 添加.env文件

```
DATABASE_URL="postgresql://{user}:{password}@{db ip}:{db port}/prisma-example?schema=public"
```
根据自己的数据库配置修改


### 容器启动

```bash
docker-compose up -d --build
```

启动成功后会启动两个容器，prisma-example不使用pkg打包，prisma-example-pkg使用pkg打包。