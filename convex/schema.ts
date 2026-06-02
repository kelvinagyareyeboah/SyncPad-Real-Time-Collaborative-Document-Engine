import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  documents: defineTable({
    title: v.string(),
    initialContent: v.optional(v.string()),
    ownerId: v.string(),
    ownerName: v.optional(v.string()),
    roomId: v.optional(v.string()),
    organizationId: v.optional(v.string()),
  })
    .index("by_owner_id", ["ownerId"])
    .index("by_organization_id", ["organizationId"])
    .searchIndex("search_title", {
      searchField: "title",
      filterFields: ["ownerId", "organizationId"],
    }),

  // Access control: who can access which document and at what role
  members: defineTable({
    documentId: v.id("documents"),
    userId: v.string(),
    userName: v.string(),
    role: v.union(v.literal("owner"), v.literal("editor"), v.literal("viewer")),
  })
    .index("by_document_id", ["documentId"])
    .index("by_document_and_user", ["documentId", "userId"]),

  revisions: defineTable({
    documentId: v.id("documents"),
    content: v.string(),
    title: v.string(),
    authorId: v.string(),
    authorName: v.string(),
    authorAvatar: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_document_id", ["documentId"]),
});
