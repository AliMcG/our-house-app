import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import { CreatePost } from "@/app/_components/create-post";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import Image from "next/image";
import HomePageImage from "@/public/home_logo_final.svg";

export default async function Home() {
  noStore();
  const hello = await api.post.hello.query({ text: "from tRPC" });
  const session = await getServerAuthSession();

  return (
    <main className="flex min-h-screen flex-col md:items-center md:justify-center bg-white text-slate-800">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 md:py-16">
        <div className="flex flex-col md:flex-row md:flex-wrap ">
          <div className="flex flex-col justify-center">
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
              Our House
            </h1>
            <div className="mt-4 text-lg">
              <p>Your one stop shop</p>
              <p>to organise your home</p>
            </div>
          </div>

          <Image
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            src={HomePageImage}
            alt={"Home page image"}
            className="md:h-96 w-3/6"
          />
          <div className="flex items-center justify-center md:w-36 mt-8">
            <Link
              href={session ? "/api/auth/signout" : "/api/auth/signin"}
              className="flex  items-center w-3/6 md:w-full  justify-center rounded-lg bg-[#b372f0] px-5 py-3 font-semibold text-white no-underline transition hover:bg-[#cdacec]"
            >
              {session ? "Sign out" : "Sign in"}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

async function CrudShowcase() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  return (
    <div className="w-full max-w-xs">
      <CreatePost />
    </div>
  );
}
