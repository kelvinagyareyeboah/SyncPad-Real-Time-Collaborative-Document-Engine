"use client";

import { ReactNode, useEffect, useState } from "react";
import { LiveblocksProvider, RoomProvider, ClientSideSuspense } from "@liveblocks/react/suspense";
import { useParams } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { FullscreenLoader } from "@/components/fullscreen-loader";
import { NamePrompt } from "@/components/name-prompt";
import { useLocalUser } from "@/hooks/use-local-user";
import { getDocuments } from "./action";
import { LEFT_MARGIN_DEFAULT, RIGHT_MARGIN_DEFAULT } from "@/constants/margins";
import { toast } from "sonner";

export function Room({ children }: { children: ReactNode }) {
  const params = useParams();
  const documentId = params.documentId as Id<"documents">;
  const [user, setName] = useLocalUser();
  const [ready, setReady] = useState(false);

  const joinAsViewer = useMutation(api.members.joinAsViewer);

  useEffect(() => {
    if (!user) return;

    // Auto-join as viewer when opening a shared link
    joinAsViewer({ documentId, userId: user.id, userName: user.name })
      .then(() => setReady(true))
      .catch(() => {
        toast.error("Could not join document");
        setReady(true); // still proceed — liveblocks auth will deny if truly unauthorized
      });
  }, [user, documentId, joinAsViewer]);

  if (!user) return <NamePrompt onConfirm={setName} />;
  if (!ready) return <FullscreenLoader label="Joining room..." />;

  return (
    <LiveblocksProvider
      throttle={16}
      authEndpoint={async () => {
        const response = await fetch("/api/liveblocks-auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ room: documentId, userId: user.id, userName: user.name }),
        });
        return response.json();
      }}
      resolveUsers={({ userIds }) =>
        userIds.map((id) => ({
          id,
          name: id === user.id ? user.name : id,
          avatar: "",
          color: "",
        }))
      }
      resolveMentionSuggestions={({ text }) =>
        text ? [user.id] : [user.id]
      }
      resolveRoomsInfo={async ({ roomIds }) => {
        const documents = await getDocuments(roomIds as Id<"documents">[]);
        return documents.map((d) => ({ id: d.id, name: d.name }));
      }}
    >
      <RoomProvider
        id={documentId}
        initialStorage={{ leftMargin: LEFT_MARGIN_DEFAULT, rightMargin: RIGHT_MARGIN_DEFAULT }}
      >
        <ClientSideSuspense fallback={<FullscreenLoader label="Room loading..." />}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
