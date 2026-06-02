import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createRevision = mutation({
  args: {
    documentId: v.id("documents"),
    content: v.string(),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const document = await ctx.db.get(args.documentId);
    if (!document) throw new ConvexError("Document not found");

    return ctx.db.insert("revisions", {
      documentId: args.documentId,
      content: args.content,
      title: args.title,
      authorId: "demo-user",
      authorName: "Demo User",
      authorAvatar: undefined,
      createdAt: Date.now(),
    });
  },
});

export const getRevisionsByDocId = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const document = await ctx.db.get(args.documentId);
    if (!document) throw new ConvexError("Document not found");

    return ctx.db
      .query("revisions")
      .withIndex("by_document_id", (q) => q.eq("documentId", args.documentId))
      .order("desc")
      .collect();
  },
});

export const updateDocInitialContent = mutation({
  args: {
    documentId: v.id("documents"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const document = await ctx.db.get(args.documentId);
    if (!document) throw new ConvexError("Document not found");
    return ctx.db.patch(args.documentId, { initialContent: args.content });
  },
});
