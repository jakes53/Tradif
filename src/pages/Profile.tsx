import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { BadgeCheck, LogOut, User, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        navigate('/');
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, custom_user_id, account_tier, created_at')
        .eq('id', session.user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
      } else {
        setUserData(data);
      }

      setLoading(false);
    };

    fetchProfile();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const renderTierBadge = (tier: number) => {
    let color = 'bg-blue-500';
    let label = 'Tier 1';

    if (tier === 2) {
      color = 'bg-purple-600';
      label = 'Tier 2 - Pro';
    } else if (tier === 3) {
      color = 'bg-yellow-500';
      label = 'Tier 3 - Elite';
    }

    return (
      <span className={`inline-flex items-center gap-1 text-white text-xs font-semibold px-3 py-1 rounded-full ${color}`}>
        <BadgeCheck size={14} />
        {label}
      </span>
    );
  };

  if (loading) {
    return <p className="text-center mt-10">Loading profile...</p>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
        <User size={22} />
        Profile Information
      </h2>

      <div className="mb-4">
        <p className="text-sm text-gray-600">Full Name</p>
        <p className="text-lg font-medium text-gray-900">
          {userData?.first_name} {userData?.last_name}
        </p>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600">User Id</p>
        <p className="text-lg font-medium text-gray-900">{userData?.custom_user_id}</p>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600">Account Type</p>
        {renderTierBadge(userData?.account_tier || 1)}
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600">Cryptocurrency Deposits</p>
        <span className="inline-block text-xs font-medium bg-gray-800 text-white px-3 py-1 rounded-full">
          On-chain Only
        </span>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600">Notifications</p>
        <span className="text-green-600 font-medium text-sm">Enabled</span>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600">Default Currency</p>
        <span className="text-gray-900 font-medium">USD</span>
      </div>

      <div className="mb-6">
        <p className="text-sm text-gray-600">Account Created</p>
        <div className="flex items-center gap-2 text-gray-700 text-sm">
          <Clock size={16} />
          {new Date(userData?.created_at).toLocaleDateString()}
        </div>
      </div>

      <button
        onClick={handleSignOut}
        className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl font-medium flex items-center justify-center gap-2"
      >
        <LogOut size={18} />
        Logout
      </button>
    </div>
  );
};

export default Profile;
