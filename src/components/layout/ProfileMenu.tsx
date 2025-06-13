import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const menuItems = [
  {
    label: "Edit Profile",
    icon: (
      <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a2.1 2.1 0 1 1 2.97 2.97L7.5 19.79l-4 1 1-4 14.362-14.303z" /></svg>
    ),
    onClick: () => {},
  },
  {
    label: "Settings & Privacy",
    icon: (
      <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" /></svg>
    ),
    onClick: () => {},
  },
  {
    label: "Help & Support",
    icon: (
      <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M12 14a4 4 0 1 0-4-4" /></svg>
    ),
    onClick: () => {},
  },
  {
    label: "Display & Accessibility",
    icon: (
      <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m8.485-8.485l-.707.707M4.222 19.778l-.707.707M21 12h-1M4 12H3m16.485-4.485l-.707-.707M4.222 4.222l-.707-.707" /></svg>
    ),
    onClick: () => {},
  },
  {
    label: "Logout",
    icon: (
      <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1" /></svg>
    ),
    onClick: () => {},
  },
];

export const ProfileMenu: React.FC<{ user?: { name: string; avatarUrl?: string } }> = ({ user = { name: "James Aldrino", avatarUrl: undefined } }) => {
  return (
    <div className="flex flex-col items-end w-full">
      <Card className="w-full max-w-xs bg-white/90 shadow-xl border border-gray-200 rounded-2xl">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 pb-4 border-b border-gray-100 mb-4">
            <img
              src={user.avatarUrl || "/window.svg"}
              alt="User avatar"
              className="w-14 h-14 rounded-full border-2 border-gray-200 object-cover"
            />
            <div>
              <div className="font-semibold text-lg text-gray-900">{user.name}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full" aria-label="Online status" />
                <span className="text-xs text-gray-500">Online</span>
              </div>
            </div>
          </div>
          <nav aria-label="Profile menu" className="flex flex-col gap-2">
            {menuItems.map((item, idx) => (
              <button
                key={item.label}
                className="flex items-center w-full gap-3 px-3 py-2 rounded-lg transition hover:bg-gray-100 focus:bg-gray-100 focus:outline-none group"
                tabIndex={0}
                aria-label={item.label}
                onClick={item.onClick}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') item.onClick(); }}
                type="button"
              >
                <span>{item.icon}</span>
                <span className="flex-1 text-left text-gray-800 font-medium text-sm">{item.label}</span>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>
            ))}
          </nav>
        </CardContent>
      </Card>
    </div>
  );
};
