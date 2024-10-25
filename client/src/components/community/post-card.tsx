import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem
} from "@/components/ui/select";
import { RefreshCw, Heart, Upload, MoreHorizontal } from "lucide-react";

export default function PostCard() {
  return (
    <div className="mx-auto w-full max-w-md overflow-hidden rounded-xl bg-white shadow-md dark:bg-gray-800">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex space-x-4">
          <div>
            <img
              alt="Profile"
              className="rounded-full"
              height="48"
              src="/placeholder.svg"
              width="48"
            />
          </div>
          <div>
            <div className="text-lg font-bold dark:text-white">John Doe</div>
            <div className="text-sm text-gray-500 dark:text-gray-200">
              @johndoe
            </div>
          </div>
        </div>
        <div>
          <Select>
            <SelectTrigger aria-label="Options">
              <MoreHorizontal />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="delete">Delete tweet</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="px-6 py-4">
        <div className="text-sm text-gray-800 dark:text-gray-200">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
          pellentesque id erat at blandit. Donec ullamcorper turpis vitae dolor
          lacinia mollis. Donec at augue eget ipsum porttitor interdum.
        </div>
      </div>
      <div className="flex items-center justify-between space-x-4 border-t border-gray-200 p-4 pt-4 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          <RefreshCw size={16} />
          <Heart size={16} />
          <Upload size={16} />
        </div>
        <div className="flex items-center space-x-4">
          <MoreHorizontal size={16} />
          <svg
            className="h-4 w-4 text-gray-500 dark:text-gray-200"
            fill="none"
            height="24"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
