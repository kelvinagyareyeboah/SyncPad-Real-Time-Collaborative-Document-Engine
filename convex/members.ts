import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getMembers = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, { documentId }) => {
    return ctx.db
      .query("members")
      .withIndex("by_document_id", (q) => q.eq("documentId", documentId))
      .collect();
  },
});

export const getMemberRole = query({
  args: { documentId: v.id("documents"), userId: v.string() },
  handler: async (ctx, { documentId, userId }) => {
    const member = await ctx.db
      .query("members")
      .withIndex("by_document_and_user", (q) =>
        q.eq("documentId", documentId).eq("userId", userId)
      )
      .unique();
    return member?.role ?? null;
  },
});

// Called when a user opens a document link for the first time
export const joinAsViewer = mutation({
  args: {
    documentId: v.id("documents"),
    userId: v.string(),
    userName: v.string(),
  },
  handler: async (ctx, { documentId, userId, userName }) => {
    const document = await ctx.db.get(documentId);
    if (!document) throw new ConvexError("Document not found");

    // Already a member — just return
    const existing = await ctx.db
      .query("members")
      .withIndex("by_document_and_user", (q) =>
        q.eq("documentId", documentId).eq("userId", userId)
      )
      .unique();

    if (existing) return existing.role;

    await ctx.db.insert("members", {
      documentId,
      userId,
      userName,
      role: "viewer",
    });

    return "viewer";
  },
});

export const updateRole = mutation({
  args: {
    documentId: v.id("documents"),
    requesterId: v.string(),
    targetUserId: v.string(),
    role: v.union(v.literal("editor"), v.literal("viewer")),
  },
  handler: async (ctx, { documentId, requesterId, targetUserId, role }) => {
    // Only the owner can change roles
    const requester = await ctx.db
      .query("members")
      .withIndex("by_document_and_user", (q) =>
        q.eq("documentId", documentId).eq("userId", requesterId)
      )
      .unique();

    if (!requester || requester.role !== "owner") {
      throw new ConvexError("Only the owner can change roles");
    }

    const target = await ctx.db
      .query("members")
      .withIndex("by_document_and_user", (q) =>
        q.eq("documentId", documentId).eq("userId", targetUserId)
      )
      .unique();

    if (!target) throw new ConvexError("Member not found");
    if (target.role === "owner") throw new ConvexError("Cannot change owner role");

    await ctx.db.patch(target._id, { role });
  },
});

export const removeMember = mutation({
  args: {
    documentId: v.id("documents"),
    requesterId: v.string(),
    targetUserId: v.string(),
  },
  handler: async (ctx, { documentId, requesterId, targetUserId }) => {
    const requester = await ctx.db
      .query("members")
      .withIndex("by_document_and_user", (q) =>
        q.eq("documentId", documentId).eq("userId", requesterId)
      )
      .unique();

    if (!requester || requester.role !== "owner") {
      throw new ConvexError("Only the owner can remove members");
    }

    const target = await ctx.db
      .query("members")
      .withIndex("by_document_and_user", (q) =>
        q.eq("documentId", documentId).eq("userId", targetUserId)
      )
      .unique();

    if (!target) throw new ConvexError("Member not found");
    if (target.role === "owner") throw new ConvexError("Cannot remove owner");

    await ctx.db.delete(target._id);
  },
});
