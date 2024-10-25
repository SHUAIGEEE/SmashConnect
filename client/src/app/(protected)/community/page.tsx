/**
 * Community Page
 * Page Title: "Community Forum"
 * Subheading: "Engage in discussions and connect with other players"
 */

/**
 * Threads Page (List of threads within the community):
 * Page Title: "Discussion Threads"
 * Subheading: "Explore various topics and join the conversation"
 */

import { Breadcrumbs } from "@/components/breadcrumbs";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import PostCard from "@/components/community/post-card";
import { Puzzle } from "lucide-react";
import Link from "next/link";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Community", link: "/community" }
];

export default async function Reviews() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="flex items-start justify-between">
        <Heading
          title="Community Forum"
          description="Engage in discussions and connect with other players!"
        />
      </div>

      <Separator />

      <div className="flex flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md text-center">
          <Puzzle className="mx-auto h-12 w-12 text-primary" />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Coming Soon
          </h1>
          <p className="mt-4 text-muted-foreground">
            This feature is currently in development. Check back soon for
            updates.
          </p>
          <div className="mt-6">
            <Link
              href="#"
              className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              prefetch={false}
            >
              Go to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
