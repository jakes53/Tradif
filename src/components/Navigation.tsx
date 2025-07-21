import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  Home,
  BarChart3,
  Wallet,
  Settings,
  Bell,
  Users,
  Headset,
  ArrowLeftRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import ThemeToggle from "@/components/ThemeToggle";
import { supabase } from "@/lib/supabaseClient";
import { formatDistanceToNow } from "date-fns";

const Navigation = () => {
  const location = useLocation();
  const isMobile = useIsMobile();

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const { data, error } = await supabase
  .from("strategy_stats")
  .select("send_sms")
  .limit(1)
  .single(); // gets the first row


      if (error) {
        console.error("Failed to fetch notifications:", error.message);
        return;
      }

      if (Array.isArray(data?.send_sms)) {
        setNotifications(data.send_sms.slice(0, 6));
      }
    };

    fetchNotifications();
  }, []);

  const navItems = [
    { path: "/dashboard", icon: <Home size={25} />, label: "Dashboard" },
    { path: "/trade", icon: <ArrowLeftRight size={25} />, label: "Trade" },
    { path: "/market", icon: <BarChart3 size={25} />, label: "Market" },
    { path: "/wallet", icon: <Wallet size={25} />, label: "Wallet" },
    { path: "/referrals", icon: <Users size={25} />, label: "Referrals" },
  ];

  return (
    <>
      <nav className="bg-background text-foreground shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className={`${isMobile ? "pl-0" : "pl-4"} flex items-center`}>
                {isMobile ? (
                  <img
                    src="./tradefiylogo.png"
                    alt="TraDify Logo"
                    className="h-28 w-auto"
                  />
                ) : (
                  <span className="text-xl font-bold">TraDify</span>
                )}
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                    location.pathname === item.path
                      ? "bg-blue-700 text-white"
                      : "text-gray-300 hover:bg-blue-600 hover:text-white"
                  }`}
                >
                  {React.cloneElement(item.icon, {
                    className:
                      location.pathname === item.path
                        ? "text-white"
                        : "text-gray-300",
                  })}
                  <span className="ml-2">{item.label}</span>
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-8 h-8">
                <ThemeToggle />
              </div>

              {/* 🔔 Notifications Bell with Live Dropdown */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-yellow-400"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell size={30} />
                  {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-xs text-white rounded-full px-1.5 py-0.5">
                      {notifications.length}
                    </span>
                  )}
                </Button>
                {showNotifications && (
  <div className="fixed top-20 left-1/2 -translate-x-1/2 sm:absolute sm:top-14 sm:right-2 sm:left-auto sm:translate-x-0 w-[95vw] sm:w-80 max-h-[70vh] overflow-y-auto bg-[#101928] text-white shadow-xl rounded-2xl z-50 p-2 border border-gray-700">

    
    {/* Header */}
    <div className="px-4 py-3 border-b border-gray-700 font-semibold text-sm">
      Notifications
    </div>

    {/* Notification List */}
    {notifications.length > 0 ? (
      notifications.map((msg, idx) => (
        <div
          key={idx}
          className="px-4 py-3 border-b border-gray-800 hover:bg-[#1c293a] transition-all text-sm"
        >
          {msg}
          <div className="text-gray-500 text-xs mt-1">
            {formatDistanceToNow(new Date(), { addSuffix: true })}
          </div>
        </div>
      ))
    ) : (
      <div className="px-4 py-4 text-gray-400 text-sm text-center">
        No notifications yet.
      </div>
    )}

  </div> // 👈 close outer notification dropdown container
)}

              </div>

              <Link to="/settings">
                <Button variant="ghost" size="icon" className="text-cyan-400">
                  <Settings size={30} />
                </Button>
              </Link>

              <Link to="/support">
                <div className="w-8 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                  <Headset size={18} className="text-white" />
                </div>
              </Link>

              <Link to="/profile" className="flex items-center transition-colors">
                {isMobile ? (
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                    <Users size={22} className="text-white" />
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Users size={22} className="text-blue-600" />
                    <span className="text-sm font-semibold text-blue-600">
                      Profile
                    </span>
                  </div>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* 🟢 Mobile Nav */}
        {isMobile && (
          <div className="fixed bottom-0 left-0 right-0 bg-crypto-dark border-t border-gray-700 z-10">
            <div className="flex justify-around items-center py-2">
              {navItems.map((item) => {
                const isTrade = item.path === "/trade";
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex flex-col items-center justify-center transition-all duration-200 ${
                      isTrade
                        ? "absolute -top-10 bg-blue-700 text-white px-4 py-2 rounded-full shadow-md border-2 border-blue-500 z-20"
                        : `px-3 py-3 rounded-md ${
                            isActive
                              ? "text-crypto-bright-teal"
                              : "text-gray-400 hover:text-white drop-shadow-[0_0_6px_rgba(0,255,100,0.4)] brightness-125"
                          }`
                    }`}
                  >
                    {React.cloneElement(item.icon, {
                      size: isTrade ? 28 : 20,
                    })}
                    <span
                      className={`text-xs mt-1 ${
                        isTrade ? "font-bold text-sm" : ""
                      }`}
                    >
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      <main className="pt-4 pb-20">
        <Outlet />
      </main>
    </>
  );
};

export default Navigation;
