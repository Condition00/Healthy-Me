import { error } from "console";
import { getServerSession } from "next-auth/next"

export async function GET() {
  const session = await getServerSession();
  if(!session?.user) return Response.json({
    error: "Unauthorized"
  }, { status: 401 });
  
  return Response.json({
    message: "Hello World!"
  })
}