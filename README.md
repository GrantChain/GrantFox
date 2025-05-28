<p align="center"> <img src="https://github.com/user-attachments/assets/25cfd5b8-e303-4af6-920e-e42d1ac8d418" alt="CLR-S (2)"> </p>

# GigFox

Grants Open Source Platform.

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
    <td align="center">
      <img src="https://github.com/user-attachments/assets/447fd30d-25a6-46b9-9597-b6046581a06c" alt="Owner 1" width="150" />
      <br /><br />
      <strong>Pablo Mora | Product Owner</strong>
      <br /><br />
      <a href="https://github.com/pmora3003" target="_blank">pmora3003</a>
      <br />
      <a href="https://t.me/pablomora3003" target="_blank">Telegram</a>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/927ca8ad-f3ee-40a2-b48c-c3699cc0948c" alt="Owner 1" width="150" />
      <br /><br />
      <strong>Marco Araya | Backend Developer</strong>
      <br /><br />
      <a href="https://github.com/coxmar23" target="_blank">coxmars</a>
      <br />
      <a href="https://t.me/coxmar23" target="_blank">Telegram</a>
    </td>
  </tr>
</table>

---

## Getting Started

Follow the steps below to get started with this project:

## Summary

1. Install npm dependencies.
2. Create a Supabase Database. [Tutorial](https://youtu.be/jA2-IwR0zjk)
3. Prisma Migration. This video works too👆🏼
4. Run the Project.

## Installation

1. Install dependencies:

   ```bash
   npm i
   ```

2. Lint and Format with Biome: (This is to ensure code quality and consistency)

   While Biome automatically lints and formats your staged files before each commit, you can also run these checks manually across the entire project using the following scripts:

   *   To check for linting and formatting issues and apply automatic fixes:
       ```bash
       pnpm biome:fix
       # or
       pnpm biome
       ```
   *   To only check for linting and formatting issues without applying fixes:
       ```bash
       pnpm biome:check
       ```
   *   To only format the code without linting:
       ```bash
       pnpm biome:format
       ```

3. Generate the Prisma Model into Supabase

   ```bash
   npx prisma db push
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

## Environment Variables

Make sure to set up the following environment variable in your `.env` file:

```
# SUPABASE -> Create a Supabase Database and copy the KEYS <-- See the Tutorial Video in Summary Section
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=

# PRISMA <-- See the Tutorial Video in Summary Section
DATABASE_URL=
DIRECT_URL=

# TRUSTLESS WORK  <-- See the Video Below <-- Not necessary yet
NEXT_PUBLIC_API_URL=https://dev.api.trustlesswork.com
NEXT_PUBLIC_API_KEY=
```

### API Key Video

[dApp Trustless Work](https://dapp.trustlesswork.com)

https://github.com/user-attachments/assets/31fd6423-fab8-4dfd-96ac-077cd537cb22

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

## IMPORTANT NOTE: Code Quality and Commit Standards

_This project uses **Biome.js** for code linting and formatting, and **Husky** to enforce code quality and commit message standards._

_Here's how it works:_
*   _**Pre-commit Hook**: Before any commit is finalized, Husky triggers Biome.js to automatically lint and format your **staged files**. If Biome finds issues that it cannot fix automatically, or if there are linting errors, the commit will be prevented. You'll need to resolve these issues before you can commit._
*   _**Commit Message Validation**: After you write your commit message and try to finalize the commit, Husky uses `commitlint` to ensure your message adheres to the [Conventional Commits](https://www.conventionalcommits.org/) standard (e.g., `feat: add new feature`, `fix: resolve bug`). If your commit message is not correctly formatted, the commit will be rejected. You'll need to amend your commit message to meet the standard._

_These integrations help maintain a clean, consistent codebase and a well-structured commit history. If a commit fails due to either of these checks, please review the error messages provided by Biome or commitlint and make the necessary corrections._
