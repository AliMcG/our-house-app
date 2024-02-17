# Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## Initail set up

- clone the repo
- copy the `.env.example` and rename `.env`
- in the new `.env` file generate `NEXTAUTH_SECRET=""` using the command in the file. 
- update the `GOOGLE_CLIENT_ID=""` and `GOOGLE_CLIENT_SECRET=""`
- run the command `npm run db:push` to generate the prisma client
- run the command `npm run dev` to check everything is working.

## Working with type-script

To help catch type errors in this repo the helper script has been added to the `package.json`
- `npm run type-check`

This script will check and print out in the terminal any type errors in the code base.

Please do this beofre pushing to production as the build will fail if there are any uncaught type errors in the code.


## Resources

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

### Notes

- [Prisma and MongoDB](https://www.prisma.io/docs/orm/overview/databases/mongodb)

## Learn More

- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorial
