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
import sciSimpLogo from '@/public/SciSimp_logo.webp';
import Image from 'next/image'

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
  return (
    <div className="w-screen min-h-screen bg-cover bg-no-repeat bg-fixed">
      <div className="flex flex-col items-center text-center pt-20 pb-40">
        <Image src={sciSimpLogo} alt="SciSimp Logo" className="w-48 h-auto mb-8" />
        <h1 className="text-5xl font-semibold text-gray-800 mb-6">Chat about your scientific documents with your AI study buddy</h1>
        <UserButton afterSignOutUrl="/" />

        {isAuth && firstChat ? (
          <div className="flex justify-center items-center gap-4">
            <Link href={`/chat/${firstChat.id}`}>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out">
                Go to Chats <ArrowRight className="ml-2" />
              </Button>
            </Link>
            <SubscriptionButton isPro={isPro} />
          </div>
        ) : (
          <Link href="/sign-in">
            <Button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out">
              Lessgoo! <LogIn className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        )}

        <p className="max-w-xl mt-4 text-lg text-gray-700">
          Join students, researchers, and professionals to instantly answer questions and understand research with AI.
        </p>

        {isAuth ? (
          <div className="w-full mt-8">
            <FileUpload />
          </div>
        ) : null}
      </div>
    </div>
  );
}
//   return (
//     <div className="w-screen min-h-screen bg-gradient-to-r from-rose-100 to-teal-100">
//       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
//         <div className="flex flex-col items-center text-center">
//           <div className="flex items-center">
//             <h1 className="mr-3 text-5xl font-semibold"> Chat about your scientific documents with your AI study buddy</h1>
//             <UserButton afterSignOutUrl="/" />
//           </div>

//           <div className="flex mt-2">
//             {isAuth && firstChat && (
//               <>
//                 <Link href={`/chat/${firstChat.id}`}>
//                   <Button>
//                     Go to Chats <ArrowRight className="ml-2" />
//                   </Button>
//                 </Link>
//                 <div className="ml-3">
//                   <SubscriptionButton isPro={isPro} />
//                 </div>
//               </>
//             )}
//           </div>

//           <p className="max-w-xl mt-1 text-lg text-slate-600">
//             Join students, researchers and professionals to instantly
//             answer questions and understand research with AI
//           </p>

//           <div className="w-full mt-4">
//             {isAuth ? (
//               <FileUpload />
//             ) : (
//               <Link href="/sign-in">
//                 <Button>
//                   Ok I am in!
//                   <LogIn className="w-4 h-4 ml-2" />
//                 </Button>
//               </Link>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
