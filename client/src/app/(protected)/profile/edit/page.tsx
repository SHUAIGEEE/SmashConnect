import { auth } from "@/../auth";
import UserProfileForm from "@/components/users/user-profile-form";
import { Separator } from "@/components/ui/separator";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Heading } from "@/components/ui/heading";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Edit Profile", link: "/profile/edit" }
];

export default async function EditProfile() {
  const session = await auth();

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <Breadcrumbs items={breadcrumbItems} />
      <div className="flex items-start justify-between">
        <Heading
          title="Edit Profile"
          description="Update your personal information and preferences!"
        />
      </div>

      <Separator />

      {session && <UserProfileForm />}
    </div>
  );
}
