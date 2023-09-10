<div align="center">
  <img src="images/logo.png" alt="Logo" height="50">
  <p>The trading exchange of the future</p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li>
      <a href="#license">License</a>
    </li>
  </ol>
</details>

## About The Project

Degenex is a small and concise trading exchange. It aims to allow its users to:

- Track prices and statistics of digital assets in real time
- Deposit and trade digital assets with zero hassle

### Built With

- [![Nx][Nx]][Nx-url]
- [![Next][Next.js]][Next-url]
- [![Nest][Nest.js]][Nest-url]

## Getting started

To get a local copy of the project up and running follow these simple steps:

### Prerequisites

Before setting up the project, install and set up the following dependencies:

- [![Node][NodeJS]][NodeJS-url]
- [![Postgres][Postgres]][Postgres-url]
- [![Redis][Redis]][Redis-url]

Create and set up a developer account for the following cloud service providers. You won't need a paid plan for any of them:

- [Amazon Web Services](https://aws.amazon.com/)
  - SES
  - S3 + Cloudfront
- [Stripe](https://stripe.com)
- [Rapid API](https://rapidapi.com/hub)

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/Drago96/degenex.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Configure the `api` and `client` projects through `.env.local` files.
4. Generate the Prisma type definitions and create/seed the database
   ```sh
   nx run api:prisma:generate
   nx run api:migrate:dev
   nx run api:seed:dev
   ```
5. Start the application
   ```sh
   npm start
   ```
6. Start the Stripe webhook integration
   ```sh
   nx run api:stripe:webhooks
   ```

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

[Nx]: https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white
[Nx-url]: https://nx.dev
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[Nest.js]: https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white
[Nest-url]: https://nestjs.com
[NodeJS]: https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white
[NodeJS-url]: https://nodejs.org/en/download
[Postgres]: https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white
[Postgres-url]: https://www.postgresql.org/download/
[Redis]: https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white
[Redis-url]: https://redis.io/download/
