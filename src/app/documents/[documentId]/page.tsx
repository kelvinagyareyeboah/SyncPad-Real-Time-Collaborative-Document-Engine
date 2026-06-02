import { preloadQuery } from "convex/nextjs";
import { Document } from "./document";
import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";

interface DocumentIdPageProps {
  params: Promise<{ documentId: Id<"documents"> }>;
}

const DocumentIdPage = async ({ params }: DocumentIdPageProps) => {
  const { documentId } = await params;

  const preloadedDocument = await preloadQuery(api.documents.getById, { id: documentId });

  return <Document preloadedDocument={preloadedDocument} />;
};

export default DocumentIdPage;
