<p align="center"> <img src="https://github.com/user-attachments/assets/a66b95c6-b592-4ae5-9080-715c935cd9e8" alt="CLR-S (2)"> </p>

# GigFox

A next-gen freelancing platform leveraging smart escrows via the Trustless Work API to ensure secure, transparent, and efficient transactions between clients and freelancers.

---

# Maintainers | [Telegram](https://t.me/gigifox25)

<table align="center">
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/e245e8af-6f6f-4a0a-a37f-df132e9b4986" alt="Owner 2" width="150" />
      <br /><br />
      <strong>Joel Vargas | Frontend Developer</strong>
      <br /><br />
      <a href="https://github.com/JoelVR17" target="_blank">JoelVR17</a>
      <br />
      <a href="https://t.me/joelvr20" target="_blank">Telegram</a>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/6b97e15f-9954-47d0-81b5-49f83bed5e4b" alt="Owner 1" width="150" />
      <br /><br />
      <strong>Tech Rebel | Product Manager</strong>
      <br /><br />
      <a href="https://github.com/techrebelgit" target="_blank">techrebelgit</a>
      <br />
      <a href="https://t.me/Tech_Rebel" target="_blank">Telegram</a>
    </td>
  </tr>
</table>

---

## Getting Started

Follow the steps below to get started with this project:

## Installation

1. Install dependencies:

   ```bash
   npm i
   ```

2. Format the code using Prettier: (This is for avoid eslint errors)

   ```bash
   npx prettier --write .
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

## Environment Variables

Make sure to set up the following environment variable in your `.env` file:

```

# Branch Main -> v.1 API
# ! OBSOLETE FOR THIS dApp VERSION !
NEXT_PUBLIC_API_URL=https://api.trustlesswork.com

# Branch Develop -> v.2 API
NEXT_PUBLIC_API_URL=https://dev.api.trustlesswork.com

# See API Key Video
NEXT_PUBLIC_API_KEY=

```

### API Key Video

[dApp Trustless Work](https://dapp.trustlesswork.com)

https://github.com/user-attachments/assets/33ea60b7-69b3-456a-afa6-56a7e70eb984

## Wallet Requirements

To use this project, you must have one of the following wallets installed:

- **Freighter**
- **Albedo**
- **xBull**
- **LOBSTR**

These wallets are required to interact with the platform.

### How to use a Wallet

You should use Chrome, Brave or Firefox browser, please install any of the wallets that were listen before.
Important Note: If you're having problems to use Freighter, make sure that you have the wallet in "test net", and also if even you couldn't be able to use because it shows you "Not Available". Try going to: Security > Manage Connected Wallet > Remove the "localhost". If the problem persist, please contact us. This mistake happens for the wallet, not our product.

## IMPORTANT NOTE:

_It's important to note that we are using Husky. This means that when you run a `git push`, Husky will automatically execute `npm run format and npm run lint`. If either of these commands throws an error, the push will not be successful, and you will see a Husky error. When this happens, make sure to resolve any format and lint errors before trying the push again._
