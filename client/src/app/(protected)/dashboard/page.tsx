import {
  Card,
  CardContent,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import Link from "next/link";
import { Icons } from "@/components/icons";
import { dashboardCards } from "@/constants/data";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-primary/50 to-primary-foreground/50 py-8 dark:from-primary md:py-16">
      <div className="container px-4 md:px-6">
        <h1 className="text-4xl font-bold tracking-tighter text-primary-foreground sm:text-5xl md:text-6xl">
          SmashConnect
        </h1>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {dashboardCards.map((card, index) => (
            <DashboardCard
              key={index}
              title={card.title}
              description={card.description}
              icon={card.icon}
              href={card.href}
              action={card.action}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const DashboardCard = ({
  title,
  description,
  icon,
  href,
  action
}: {
  title: string;
  description: string;
  icon: string;
  href: string;
  action: string;
}) => {
  const Icon = Icons[icon as keyof typeof Icons];
  return (
    <Card className="flex h-full w-full flex-col">
      <CardContent className="flex flex-grow flex-col items-start justify-between gap-4 p-4">
        <div className="flex aspect-square w-12 items-center justify-center rounded-md bg-muted">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-grow">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <div className="mt-auto">
          <Link
            href={href}
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            prefetch={false}
          >
            {action}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
