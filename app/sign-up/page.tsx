import { AuthPage } from "@/components/auth-page";
import { currentUser } from "@/server/auth";
import { redirect } from "next/navigation";
import {safeReturnPath} from '@/lib/workspace-routes';
export const metadata = { title: "Create account — SiteRadar",robots:{index:false,follow:false},alternates:{canonical:null} };
export default async function SignUp({searchParams}:{searchParams:Promise<{next?:string}>}) {
  const next=safeReturnPath((await searchParams).next);
  if (await currentUser()) redirect(next);
  return <AuthPage signup returnTo={next}/>;
}
