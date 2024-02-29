import { unstable_noStore as noStore } from "next/cache";
import { CreatePost } from "@/app/_components/create-post";
import AutenticationButton from "@/app/_components/AuthenticationButton";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import Image from "next/image";
import HomePageImage from "@/public/home_logo_final.svg";

export default async function Home() {
  noStore();
  const hello = await api.post.hello.query({ text: "from tRPC" });
  const session = await getServerAuthSession();

  return (
    <main className="flex min-h-screen flex-col bg-white text-slate-800 md:items-center md:justify-center">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 md:py-16">
        <div className="flex flex-col-reverse xl:flex-row md:flex-wrap ">
          <div className="mt-4 flex flex-col justify-center">
            <h1 className="flex items-center justify-center text-5xl font-extrabold tracking-tight md:text-[5rem]">
              Our House
            </h1>
            <div className="mt-4 flex flex-col items-center justify-center text-lg">
              <p>Your one stop shop</p>
              <p>to organise your home</p>
              <div className="mt-4 flex w-full justify-center">
                <AutenticationButton />
              </div>
            </div>
          </div>
          <div className="mt-8 flex items-center  justify-center">
            <Image
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              src={HomePageImage}
              alt={"Home page image"}
              className=" w-5/6"
            />
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
