import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [language, setLanguage] = useState("en");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [bio, setBio] = useState("I own a crypto.");
  const [currency, setCurrency] = useState("USD");
  const [autoApprove, setAutoApprove] = useState(true);
  const [withdrawMethod, setWithdrawMethod] = useState("both");

  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select(
          "username, language, two_factor_enabled, bio, currency, auto_approve, withdraw_method"
        )
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching settings:", error);
        return;
      }

      setUsername(data.username || "");
      setLanguage(data.language || "en");
      setTwoFactorEnabled(data.two_factor_enabled || false);
      setBio(data.bio || "I own a crypto.");
      setCurrency(data.currency || "USD");
      setAutoApprove(data.auto_approve ?? true);
      setWithdrawMethod(data.withdraw_method || "both");

      setLoading(false);
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        username,
        language,
        two_factor_enabled: twoFactorEnabled,
        bio,
        currency,
        auto_approve: autoApprove,
        withdraw_method: withdrawMethod,
      })
      .eq("id", user.id);

    if (error) {
      alert("Failed to update settings");
      console.error(error);
    } else {
      alert("Settings saved successfully");
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword) return alert("Enter a new password.");

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      console.error(error);
      alert("Password update failed");
    } else {
      alert("Password updated!");
      setNewPassword("");
    }
  };

  if (loading) return <div className="text-white p-6">Loading settings...</div>;

  return (
    <div className="p-6 text-white bg-neutral-900 min-h-screen space-y-8">
      <h2 className="text-3xl font-bold">Account Settings</h2>
      <p className="text-neutral-400">Manage your preferences and security here.</p>

      <div className="bg-neutral-800 p-6 rounded-xl border border-neutral-700 space-y-4">
        <h3 className="text-xl font-semibold">Preferences</h3>

        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="p-3 w-full rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder:text-neutral-400 focus:ring-2 focus:ring-yellow-500"
        />

        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Short Bio"
          className="p-3 w-full rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder:text-neutral-400 focus:ring-2 focus:ring-yellow-500 resize-none"
        />

        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="p-3 w-full rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:ring-2 focus:ring-yellow-500"
        >
          <option value="en">English</option>
  <option value="fr">French</option>
  <option value="zh">Chinese</option>
  <option value="es">Spanish</option>
  <option value="de">German</option>
  <option value="ar">Arabic</option>
  <option value="ru">Russian</option>
  <option value="pt">Portuguese</option>
  <option value="ja">Japanese</option>
        </select>

        <label className="block text-sm font-medium text-white mb-1">Display Currency</label>
<select
  value={currency}
  onChange={(e) => setCurrency(e.target.value)}
  className="p-3 w-full rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:ring-2 focus:ring-yellow-500"
>
  <option value="USD">USD – $ (US Dollar)</option>
  <option value="EUR">EUR – € (Euro)</option>
  <option value="GBP">GBP – £ (British Pound)</option>
  <option value="JPY">JPY – ¥ (Japanese Yen)</option>
  <option value="CHF">CHF – ₣ (Swiss Franc)</option>
  <option value="CAD">CAD – C$ (Canadian Dollar)</option>
  <option value="AUD">AUD – A$ (Australian Dollar)</option>
  <option value="SGD">SGD – S$ (Singapore Dollar)</option>
  <option value="SEK">SEK – kr (Swedish Krona)</option>
  <option value="NZD">NZD – NZ$ (New Zealand Dollar)</option>
</select>


        <select
          value={withdrawMethod}
          onChange={(e) => setWithdrawMethod(e.target.value)}
          className="p-3 w-full rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:ring-2 focus:ring-yellow-500"
        >
          <option value="crypto">Crypto Only</option>
          <option value="fiat">Fiat Only</option>
          <option value="both">Both Crypto & Fiat</option>
        </select>

        <label className="flex items-center space-x-2 text-sm">
          <input
            type="checkbox"
            checked={autoApprove}
            onChange={() => setAutoApprove(!autoApprove)}
            className="accent-yellow-400"
          />
          <span>Auto Approve Withdrawals</span>
        </label>

        <label className="flex items-center space-x-2 text-sm">
          <input
            type="checkbox"
            checked={twoFactorEnabled}
            onChange={() => setTwoFactorEnabled(!twoFactorEnabled)}
            className="accent-yellow-400"
          />
          <span>Enable 2FA</span>
        </label>

        <button
          onClick={handleSave}
          className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-4 py-2 rounded-lg transition"
        >
          Save Settings
        </button>
      </div>

      <div className="bg-neutral-800 p-6 rounded-xl border border-neutral-700 space-y-4">
        <h3 className="text-xl font-semibold">Security</h3>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New Password"
          className="p-3 w-full rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder:text-neutral-400 focus:ring-2 focus:ring-yellow-500"
        />
        <button
          onClick={handleChangePassword}
          className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-4 py-2 rounded-lg transition"
        >
          Update Password
        </button>
      </div>
    </div>
  );
};

export default Settings;
