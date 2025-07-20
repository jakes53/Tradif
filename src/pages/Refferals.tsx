import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Users, BarChart, DollarSign } from "lucide-react";

export default function Referrals() {
  const [userId, setUserId] = useState("");
  const [referralLink, setReferralLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [withdrawMsg, setWithdrawMsg] = useState("");
  const [referralStats, setReferralStats] = useState({
    totalReferrals: 0,
    points: 0,
    fiatBalance: 0,
    activeTraders: 0,
  });
  const [withdrawAmount, setWithdrawAmount] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      setUserId(user.id);
      setReferralLink(`${window.location.origin}/create-account?ref=${user.id}`);

      const { data, error } = await supabase
        .from("profiles")
        .select("ref_points, active_traders, fiat_balance, total_refs")
        .eq("id", user.id)
        .single();

      if (!error && data) {
        setReferralStats({
          totalReferrals: data.total_refs || 0,
          points: data.ref_points || 0,
          fiatBalance: data.fiat_balance || 0,
          activeTraders: data.active_traders || 0,
        });
      }
    };

    fetchUserData();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWithdraw = async () => {
    const pointsToWithdraw = parseInt(withdrawAmount);
    if (isNaN(pointsToWithdraw) || pointsToWithdraw < 1000) {
      setWithdrawMsg("You need at least 1000 points to withdraw.");
      return;
    }
    if (pointsToWithdraw > referralStats.points) {
      setWithdrawMsg("Insufficient points.");
      return;
    }

    const dollars = Math.floor(pointsToWithdraw / 500);
    const leftoverPoints = referralStats.points - pointsToWithdraw;
    const newFiat = referralStats.fiatBalance + dollars;

    const { error } = await supabase
      .from("profiles")
      .update({
        fiat_balance: newFiat,
        ref_points: leftoverPoints,
      })
      .eq("id", userId);

    if (!error) {
      setReferralStats((prev) => ({
        ...prev,
        fiatBalance: newFiat,
        points: leftoverPoints,
      }));
      setWithdrawMsg(`Successfully converted ${pointsToWithdraw} points → $${dollars}`);
      setWithdrawAmount("");
      setTimeout(() => setWithdrawMsg(""), 3000);
    } else {
      setWithdrawMsg("Withdrawal failed. Try again.");
    }
  };

  return (
    <div className="p-6 text-white space-y-10 bg-[#0f172a] min-h-screen">
      <h1 className="text-3xl font-bold">🎁 Referral Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <SummaryCard
          icon={<Users size={28} className="text-green-500" />}
          title="Total Referrals"
          value={referralStats.totalReferrals}
          subText="Linked signups"
          change=""
          linkText="View details"
          color="green"
        />
        <SummaryCard
          icon={<BarChart size={28} className="text-blue-500" />}
          title="Active Traders"
          value={referralStats.activeTraders}
          subText="Referrals who traded"
          change=""
          linkText="View details"
          color="blue"
        />
        <SummaryCard
          icon={<DollarSign size={28} className="text-yellow-400" />}
          title="Points Earned"
          value={referralStats.points}
          subText="500 points = $1"
          change=""
          linkText="View details"
          color="yellow"
        />
      </div>

      {/* Referral Link */}
      <div className="bg-[#1e293b] p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-2">Your Referral Link</h2>
        <div className="flex gap-2">
          <Input value={referralLink} readOnly className="bg-slate-800 text-white" />
          <Button onClick={handleCopy} variant="outline" className="text-gray-500 flex items-center gap-1">
            {copied ? "Copied!" : <><Copy size={18} /> Copy</>}
          </Button>
        </div>
      </div>

      {/* Withdraw Points */}
      <div className="bg-[#1e293b] p-6 rounded-xl space-y-4">
        <h2 className="text-lg font-bold">Withdraw Referral Points</h2>
        <p className="text-sm text-slate-400">Each 500 points = $1. You need minimum 1000 points to withdraw.</p>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Withdraw points" 
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            className="max-w-[150px] text-gray-500"
          />
          <Button onClick={handleWithdraw}>Withdraw</Button>
        </div>
        {withdrawMsg && <p className="text-sm text-green-400">{withdrawMsg}</p>}
      </div>

      {/* How it Works */}
      <div className="mt-10 space-y-6">
        <h2 className="text-2xl font-bold text-center">📘 How It Works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              step: "1",
              title: "Share Your Link",
              points: ["Use social media", "Send via email or message", "Paste anywhere"],
            },
            {
              step: "2",
              title: "Friends Sign Up",
              points: ["They use your link", "Account is created", "Ref count increases"],
            },
            {
              step: "3",
              title: "You Earn Points",
              points: ["Signup earns 100 points", "Each trade gives 10% commission", "Withdraw to fiat"],
            },
          ].map(({ step, title, points }) => (
            <div key={step} className="bg-[#1e293b] p-6 rounded-xl">
              <div className="text-2xl font-bold text-yellow-400">{step}</div>
              <h3 className="text-lg font-semibold mt-2 mb-1">{title}</h3>
              <ul className="text-sm text-slate-300 list-disc list-inside space-y-1">
                {points.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Rewards Structure */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-6 text-center">🎯 Rewards Structure</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <RewardCard points={100} title="Signup Bonus" description="Your referral signs up" tag="Instant" color="text-green-500" />
          <RewardCard points={250} title="First Trade" description="Referral makes any trade" tag="Bonus" color="text-blue-400" />
          <RewardCard points={500} title="Trade Volume $100" description="Referral trades $100 total" tag="Milestone" color="text-purple-400" />
          <RewardCard points={1000} title="Withdrawable Tier" description="Minimum points to convert" tag="To Fiat" color="text-yellow-400" />
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-10 text-center text-sm text-yellow-400 bg-[#1e293b] p-4 rounded-lg">
  ⚠️ You can earn from a maximum of <strong>5 direct downlines</strong>. Additional referrals beyond this limit will not generate extra rewards.<br className="hidden md:block" />
  📈 User count and points update automatically as your uplines and downlines execute trades, generating commissions.<br className="hidden md:block" />
  🎯 Keep referring and encouraging trading activity. Signup bonuses and trade commissions combined will help you reach the required <strong>1000 points</strong> needed to withdraw.<br className="hidden md:block" />
  🚀 Maximize your earning potential by growing and engaging your network actively!
</div>

    </div>
  );
}

function SummaryCard({ icon, title, value, subText, change, linkText, color }) {
  return (
    <div className="bg-[#1e293b] rounded-xl p-6">
      <div className="mb-2">{icon}</div>
      <h3 className="text-2xl font-bold">{value}</h3>
      <p className={`text-sm text-${color}-400`}>{change}</p>
      <p className="text-sm text-slate-400 mt-1">{title}</p>
      <div className="border-t border-slate-700 mt-4 pt-2 text-sm flex justify-between items-center">
        <span className="text-green-400">{subText}</span>
        {linkText && <a className={`text-${color}-400 hover:underline cursor-pointer`}>{linkText}</a>}
      </div>
    </div>
  );
}

function RewardCard({ points, title, description, tag, color }) {
  return (
    <div className="bg-[#1e293b] rounded-xl p-6 space-y-2">
      <div className={`text-3xl font-bold ${color}`}>
        {points} <span className="text-lg text-slate-400">points</span>
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-slate-300">{description}</p>
      <p className={`text-sm font-medium ${color}`}>{tag} →</p>
    </div>
  );
}

