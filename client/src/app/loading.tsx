import { Progress } from "@/components/ui/progress";

export default function Component() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[#f0f0f0] to-[#e0e0e0] dark:from-[#1a1a1a] dark:to-[#121212]">
      <div className="flex flex-col items-center justify-center space-y-8">
        <div className="relative h-20 w-20 animate-pulse">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#4b5563] to-[#6b7280] dark:from-[#9ca3af] dark:to-[#d1d5db]" />
          <div className="absolute inset-1 rounded-full bg-gradient-to-br from-[#f0f0f0] to-[#e0e0e0] dark:from-[#1a1a1a] dark:to-[#121212]" />
          <div className="animate-morph absolute inset-2 rounded-full bg-gradient-to-br from-[#4b5563] to-[#6b7280] dark:from-[#9ca3af] dark:to-[#d1d5db]" />
        </div>
        <div className="w-full max-w-md">
          <Progress
            value={50}
            className="h-2 rounded-full bg-gradient-to-br from-[#4b5563] to-[#6b7280] dark:from-[#9ca3af] dark:to-[#d1d5db]"
          />
        </div>
      </div>
    </div>
  );
}
