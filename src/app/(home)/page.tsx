"use client";

import { usePaginatedQuery } from "convex/react";
import { Navbar } from "./navbar";
import { TemplatesGallery } from "./templates-gallery";
import { DocumentsTable } from "./documents-table";
import { api } from "../../../convex/_generated/api";
import { useSearchParam } from "@/hooks/use-search-param";
import { useLocalUser } from "@/hooks/use-local-user";
import { NamePrompt } from "@/components/name-prompt";

import { Suspense } from "react";

const HomeContent = () => {
  const [search] = useSearchParam();
  const [user, setName] = useLocalUser();

  const { results, status, loadMore } = usePaginatedQuery(
    api.documents.get,
    { search, userId: user?.id ?? "anonymous" },
    { initialNumItems: 5 }
  );

  if (!user) return <NamePrompt onConfirm={setName} />;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-10 h-16 bg-white p-4">
        <Navbar />
      </div>
      <div className="mt-16">
        <TemplatesGallery user={user} />
        <DocumentsTable documents={results} loadMore={loadMore} status={status} />
      </div>
    </div>
  );
};

const Home = () => {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm text-neutral-500">Loading SyncPad...</div>}>
      <HomeContent />
    </Suspense>
  );
};

export default Home;
