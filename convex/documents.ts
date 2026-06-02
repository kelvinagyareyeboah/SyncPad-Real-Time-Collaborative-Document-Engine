import { ConvexError, v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { mutation, query } from "./_generated/server";

export const getByIds = query({
  args: { ids: v.array(v.id("documents")) },
  handler: async (ctx, { ids }) => {
    const documents = [];
    for (const id of ids) {
      const document = await ctx.db.get(id);
      if (document) {
        documents.push({ id: document._id, name: document.title });
      } else {
        documents.push({ id, name: "[Removed]" });
      }
    }
    return documents;
  },
});

export const create = mutation({
  args: {
    title: v.optional(v.string()),
    initialContent: v.optional(v.string()),
    ownerId: v.string(),
    ownerName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const documentId = await ctx.db.insert("documents", {
      title: args.title ?? "Untitled document",
      ownerId: args.ownerId,
      ownerName: args.ownerName ?? "Unknown",
      initialContent: args.initialContent,
    });

    // Auto-insert owner as a member with owner role
    await ctx.db.insert("members", {
      documentId,
      userId: args.ownerId,
      userName: args.ownerName ?? "Unknown",
      role: "owner",
    });

    return documentId;
  },
});

export const get = query({
  args: {
    paginationOpts: paginationOptsValidator,
    search: v.optional(v.string()),
    userId: v.string(),
  },
  handler: async (ctx, { search, paginationOpts, userId }) => {
    if (search) {
      return ctx.db
        .query("documents")
        .withSearchIndex("search_title", (q) =>
          q.search("title", search).eq("ownerId", userId)
        )
        .paginate(paginationOpts);
    }

    return ctx.db
      .query("documents")
      .withIndex("by_owner_id", (q) => q.eq("ownerId", userId))
      .paginate(paginationOpts);
  },
});

export const removeById = mutation({
  args: { id: v.id("documents"), requesterId: v.string() },
  handler: async (ctx, args) => {
    const document = await ctx.db.get(args.id);
    if (!document) throw new ConvexError("Document not found");
    if (document.ownerId !== args.requesterId) throw new ConvexError("Unauthorized");

    // Delete all members
    const members = await ctx.db
      .query("members")
      .withIndex("by_document_id", (q) => q.eq("documentId", args.id))
      .collect();
    await Promise.all(members.map((m) => ctx.db.delete(m._id)));

    return ctx.db.delete(args.id);
  },
});

export const updateById = mutation({
  args: { id: v.id("documents"), title: v.string() },
  handler: async (ctx, args) => {
    const document = await ctx.db.get(args.id);
    if (!document) throw new ConvexError("Document not found");
    return ctx.db.patch(args.id, { title: args.title });
  },
});

export const getById = query({
  args: { id: v.id("documents") },
  handler: async (ctx, { id }) => {
    const document = await ctx.db.get(id);
    if (!document) throw new ConvexError("Document not found");
    return document;
  },
});
