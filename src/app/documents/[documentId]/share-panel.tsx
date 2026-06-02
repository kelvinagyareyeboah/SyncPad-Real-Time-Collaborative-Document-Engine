"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { Copy, Check, Shield, Eye, X, Users } from "lucide-react";
import { toast } from "sonner";

interface SharePanelProps {
  documentId: Id<"documents">;
  currentUserId: string;
  onClose: () => void;
}

export function SharePanel({ documentId, currentUserId, onClose }: SharePanelProps) {
  const [copied, setCopied] = useState(false);
  const members = useQuery(api.members.getMembers, { documentId });
  const updateRole = useMutation(api.members.updateRole);
  const removeMember = useMutation(api.members.removeMember);

  const currentRole = members?.find((m) => m.userId === currentUserId)?.role;
  const isOwner = currentRole === "owner";

  const inviteLink = typeof window !== "undefined"
    ? `${window.location.origin}/documents/${documentId}`
    : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Link copied to clipboard");
  };

  const handleRoleChange = async (targetUserId: string, role: "editor" | "viewer") => {
    try {
      await updateRole({ documentId, requesterId: currentUserId, targetUserId, role });
      toast.success("Role updated");
    } catch {
      toast.error("Failed to update role");
    }
  };

  const handleRemove = async (targetUserId: string) => {
    try {
      await removeMember({ documentId, requesterId: currentUserId, targetUserId });
      toast.success("Member removed");
    } catch {
      toast.error("Failed to remove member");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <Users className="size-4 text-neutral-700" />
            <h2 className="font-semibold text-neutral-900">Share document</h2>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-700 transition-colors">
            <X className="size-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Invite link */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Invite link</p>
            <div className="flex gap-2">
              <input
                readOnly
                value={inviteLink}
                className="flex-1 px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-600 outline-none truncate"
              />
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-2 bg-black hover:bg-neutral-800 text-white text-xs font-medium rounded-lg transition-colors shrink-0"
              >
                {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <p className="text-xs text-neutral-400">
              Anyone with this link can join as a viewer. You can promote them after.
            </p>
          </div>

          {/* Members list */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Members ({members?.length ?? 0})
            </p>
            <div className="space-y-1 max-h-56 overflow-y-auto">
              {!members ? (
                <p className="text-xs text-neutral-400 py-2">Loading...</p>
              ) : (
                members.map((member) => (
                  <div key={member._id} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-neutral-50">
                    <div className="flex items-center gap-2.5">
                      <div className="size-7 rounded-full bg-black flex items-center justify-center text-white text-xs font-semibold shrink-0">
                        {member.userName[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-900">
                          {member.userName}
                          {member.userId === currentUserId && (
                            <span className="ml-1.5 text-xs text-neutral-400">(you)</span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {member.role === "owner" ? (
                        <span className="flex items-center gap-1 text-xs text-neutral-500 font-medium">
                          <Shield className="size-3" /> Owner
                        </span>
                      ) : isOwner && member.userId !== currentUserId ? (
                        <div className="flex items-center gap-1">
                          <select
                            value={member.role}
                            onChange={(e) => handleRoleChange(member.userId, e.target.value as "editor" | "viewer")}
                            className="text-xs border border-neutral-200 rounded-md px-2 py-1 outline-none bg-white text-neutral-700"
                          >
                            <option value="editor">Editor</option>
                            <option value="viewer">Viewer</option>
                          </select>
                          <button
                            onClick={() => handleRemove(member.userId)}
                            className="p-1 text-neutral-400 hover:text-red-500 transition-colors"
                          >
                            <X className="size-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-neutral-500 capitalize">
                          <Eye className="size-3" /> {member.role}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
