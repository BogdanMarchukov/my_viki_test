<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest



## Description
Тестовое задание "Another Knowelege Base"
Для запуска приложения конфоги не требуются они захардкожены в src/common/config/configuration  

### Создал два docker-compose файла
 -  docker-compose.db.yaml для запуска базы данных
 -  docker-compose.yaml для полного запуска, сборка приложения + база данных

### Api документация swagger  
http://localhost:3000/api


## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# local run
$ docker-compose -f docker-compose.db.yaml up -d
$ npm run start

# watch mode
$ docker-compose -f docker-compose.db.yaml up -d
$ npm run start:dev

# full run
$ docker-compose -f docker-compose.yaml up -d
```

## Run tests

```bash
# e2e tests
$ npm run test

```

