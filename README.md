# Blockchain Price Tracker

This project is a **Blockchain Price Tracker** built using **NestJS**. The application fetches the latest prices for **Ethereum** and **Polygon** using APIs such as **CMC** and stores them in a relational database. The application also provides features like setting price alerts and getting swap rates between cryptocurrencies.

## Table of Contents

- [Setup Instructions](#setup-instructions)
- [Using Swagger UI for Testing](#using-swagger-ui-for-testing)
- [API Usage Examples](#api-usage-examples)
- [Running with Docker](#running-with-docker)
- [Running Migrations](#running-migrations)

## Setup Instructions

### Prerequisites

Before starting, ensure you have the following:

- **Node.js** (v16 or later)
- **npm** or **yarn**
- **MySQL** (or another relational database)
- Docker (optional, for running in containers)

### Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/blockchain-price-tracker.git
    cd blockchain-price-tracker
    ```

2. **Install the dependencies**:
    ```bash
    npm install
    ```

3. **Configure your environment variables** (for email service, database, and any APIs like Moralis or Solscan).

    You can create a `.env` file in the root of the project with variables like:
    ```env
    DATABASE_URL=mysql://username:password@localhost:3306/blockchain_db
    COINMARKETCAP_API_KEY=your_cmc_key
    EMAIL_SERVICE=your_email_service_credentials
    ```

4. **Run migrations** (optional if database schema is set up):
    ```bash
    npm run migration:generate
    npm run migration:run
    ```

### Running with Docker

If you prefer to run the application using Docker, you can use `docker-compose` to set up the containers.

1. **Create a `docker-compose.yml` file** (if not already present in the project):
    ```yaml
    version: '3.8'

    services:
      app:
        build: .
        ports:
          - '3000:3000'
        environment:
          - DATABASE_URL=mysql://username:password@db:3306/blockchain_db
          - COINMARKETCAP_API_KEY=your_moralis_api_key
        depends_on:
          - db
        volumes:
          - .:/app
        command: npm run start:dev

      db:
        image: mysql:8
        environment:
          MYSQL_ROOT_PASSWORD: root
          MYSQL_DATABASE: blockchain_db
        ports:
          - '3306:3306'

    volumes:
      mysql_data:
    ```

2. **Run Docker Compose**:
    ```bash
    docker-compose up --build
    ```

   This command will build and run the containers, and the application will be accessible at `http://localhost:3000`.

## Running Migrations

1. **Generate migrations** (if required to update the database schema):
    ```bash
    npm run migration:generate --name CreatePriceAlertTable
    ```

2. **Run migrations**:
    ```bash
    npm run migration:run
    ```

3. **Exit migrations**:
    ```bash
    npm run migration:exit
    ```

## Running the App

To start the application, you can use the following commands:

- **Development Mode** (watch mode):
    ```bash
    npm run start:dev
    ```

- **Production Mode**:
    ```bash
    npm run start:prod
    ```

## Using Swagger UI for Testing

### Access Swagger UI

After running the application, you can access the Swagger UI at:

