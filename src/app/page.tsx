import React from 'react';
import { Button } from "@/components/ui/button";
import { UserButton, auth } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowRight, LogIn } from "lucide-react";
import FileUpload from "@/components/FileUpload";
import { checkSubscription } from "@/lib/subscription";
import SubscriptionButton from "@/components/SubscriptionButton";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import Image from 'next/image';

export default async function Home() {
  const { userId } = await auth();
  const isAuth = !!userId;
  const isPro = await checkSubscription();
  let firstChat;
  if (userId) {
    firstChat = await db.select().from(chats).where(eq(chats.userId, userId));
    if (firstChat) {
      firstChat = firstChat[0];
    }
  }

  console.log("isAuth: ", isAuth)
  console.log("userId:", userId) 

  return (
    // <div className="w-screen min-h-screen bg-gradient-to-r from-rose-100 to-teal-100 flex justify-center items-center p-4">
    <div className="w-screen min-h-screen bg-gradient-to-r from-blue-200 to-green-200 flex flex-col justify-start items-center pt-20 p-4">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-2">SciSimp - Science Simplified</h1>
        <div className='flex justify-center'>
        <UserButton afterSignOutUrl="/" />
        </div>
        <div className="inline-block relative mb-2" style={{ width: '400px', height: 'auto' }}>
          <Image
            src="/images/SciSimp_logo.png"
            alt="SciSimp Logo"
            width={400}
            height={400} // Adjust the height as needed
            layout = "intrinsic"
          />
        </div>

        <h2 className="text-3xl font-semibold mb-4">Chat about your scientific documents with your AI study buddy</h2>
        
        <div className="flex flex-col items-center">

        <p className="max-w-xl mt-4 text-lg text-slate-600 mb-4">
            Made with ❤️ for students, researchers, and professionals to instantly answer questions and understand research with AI.
          </p>

          {isAuth && firstChat && (
            <>
              <Link href={`/chat/${firstChat.id}`}>
                <Button className="mb-3">
                  View My Chats
                </Button>
              </Link>
              <SubscriptionButton isPro={isPro} />
            </>
          )}

          {isAuth ? (
            <div className="mt-4"> {/* Add space above FileUpload */}
            <FileUpload/>
          </div>
          ) : (
            <Link href="/sign-in">
              <Button className="mt-8">
                Count me in! <LogIn className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          )}
        </div>
        <div className="mt-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">See Our App in Action</h2>
        <Image
          src="/images/SciSimp_working.png" // Ensure the path is correct
          alt="App Demo"
          width={800} // Adjust as necessary
          height={400}
          layout="intrinsic"
        />
      </div>
      </div>
    </div>
  );
}
