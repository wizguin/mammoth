# Mammoth
Pre-CPIP server emulator.

## Docker Installation

Recommended setup for production usage.

https://github.com/wizguin/mammoth-docker

## Local Installation

These instructions will get you a copy of the project up and running on your local machine for development purposes.

### Prerequisites
* git
* Node >= 20.6.0
* MySQL
* Redis

### Installation

1. Clone this repository.

```console
git clone https://github.com/wizguin/mammoth
```

2. Install node dependencies.

```console
cd ./mammoth
npm install
```

3. Copy .env.example to .env and update DATABASE_URL.

```console
DATABASE_URL=mysql://username:password@localhost:3306/mammoth
```

4. Apply database migrations.

```console
npx prisma migrate dev
```

### Usage

* Running packages in dev mode.

```console
npm run dev
```

* Building packages.

```console
npm run build
```

* Starting packages.

```console
npm run start
```

* Eslint.

```console
npm run eslint
npm run eslint:fix
```

## Disclaimer

This project is intended for personal use only.
