import { Liveblocks } from "@liveblocks/node";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

const liveblocks = new Liveblocks({ secret: process.env.LIVEBLOCKS_SECRET_KEY! });
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: Request) {
  const { room, userId, userName } = await req.json();

  if (!userId || !userName || !room) {
    return new Response("Missing fields", { status: 400 });
  }

  // Look up this user's role for the document
  const role = await convex.query(api.members.getMemberRole, {
    documentId: room as Id<"documents">,
    userId,
  });

  // Unknown visitor — deny until they join
  if (!role) {
    return new Response("Unauthorized", { status: 401 });
  }

  const hue = userId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;

  const session = liveblocks.prepareSession(userId, {
    userInfo: { name: userName, avatar: "", color: `hsl(${hue}, 70%, 55%)` },
  });

  // Viewers can only read — editors and owners get full access
  if (role === "viewer") {
    session.allow(room, session.READ_ACCESS);
  } else {
    session.allow(room, session.FULL_ACCESS);
  }

  const { body, status } = await session.authorize();
  return new Response(body, { status });
}
