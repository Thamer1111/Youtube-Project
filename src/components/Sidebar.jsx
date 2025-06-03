import {
  MdHome,
  MdSubscriptions,
  MdVideoLibrary,
  MdHistory,
  MdWatchLater,
  MdThumbUp,
} from 'react-icons/md';
import { BsCollectionPlay } from 'react-icons/bs';

export default function Sidebar() {
  return (
    <div className="bg-black text-white lg:w-48 min-h-screen p-4 space-y-4">
      <div className="space-y-3">
        <SidebarItem icon={<MdHome />} label="Home" />
        <SidebarItem icon={<BsCollectionPlay />} label="Shorts" />
        <SidebarItem icon={<MdSubscriptions />} label="Subscriptions" />
      </div>

      <hr className="border-neutral-800" />

      <div className="space-y-3">
        <SidebarItem icon={<MdVideoLibrary />} label="Library" />
        <SidebarItem icon={<MdHistory />} label="History" />
        <SidebarItem icon={<MdWatchLater />} label="Watch Later" />
        <SidebarItem icon={<MdThumbUp />} label="Liked Videos" />
      </div>
    </div>
  );
}

function SidebarItem({ icon, label }) {
  return (
    <div className="flex items-center gap-3 hover:bg-neutral-800 p-2 rounded cursor-pointer">
      <div className="text-xl">{icon}</div>
      <span className="hidden lg:inline">{label}</span>
    </div>
  );
}
