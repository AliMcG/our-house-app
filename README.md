## Initail set up

- clone the repo
- copy the `.env.example` and rename `.env`
- in the new `.env` file generate `NEXTAUTH_SECRET=""` using the command in the file. 
- update the `GOOGLE_CLIENT_ID=""` and `GOOGLE_CLIENT_SECRET=""`
- run the command `npm run db:push` to generate the prisma client
- run the command `npm run dev` to check everything is working.

## Working with type-script and eslint

To help catch type errors in this repo the helper script has been added to the `package.json`
- `npm run type-check`

This script will check and print out in the terminal any type errors in the code base.
- `npm run lint`

This script will check and print out in the terminal any lint errors in the code base.


Please do this before pushing to production as the build will fail if there are any uncaught type or lint errors in the code.


## Resources

If you are not familiar with the different technologies used in this project, please refer to the respective docs. 

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

### Notes

- [Prisma and MongoDB](https://www.prisma.io/docs/orm/overview/databases/mongodb)

### Vscode extensions
- Jest - makes running Jest unit tests in vscode easy.
- Prisma - Adds syntax highlighting to schema files
- Todo Tree - Adds highlight to all // TODO comments and create a tree for tree traversal in the side menu of vscode
- Code Spell Checker - checks the code and comments for spelling mistakes

## Deployed on Vercal

The site is live with Google Auth at https://our-house-app.vercel.app/

## Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.