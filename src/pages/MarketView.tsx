import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "@supabase/auth-helpers-react";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, TrendingDown, Repeat } from "lucide-react";
import { Polygon } from "recharts";

const TOKEN_FEE_RATE = 0.05;

const MarketView = () => {
  const [globalData, setGlobalData] = useState({
    marketCap: 0,
    volume: 0,
    btcDominance: 0,
    activeCoins: 0,
  });

  const [tokens, setTokens] = useState<any[]>([]);
  const [customPrices, setCustomPrices] = useState({ polygon: 0, worldcoin: 0, pi: 0 });
  const [balances, setBalances] = useState<any>({
    fiat: 0, btc: 0, eth: 0, usdt: 0, usdc: 0, xrp: 0,
    polygon: 0, sol:0, worldcoin: 0, pi: 0, doge: 0, trx: 0, steth: 0,
  });

  const [selectedBuy, setSelectedBuy] = useState("btc");
  const [selectedSell, setSelectedSell] = useState("btc");
  const [swapFrom, setSwapFrom] = useState("btc");
  const [swapTo, setSwapTo] = useState("eth");

  const [buyUsd, setBuyUsd] = useState("");
  const [sellAmt, setSellAmt] = useState("");
  const [swapAmt, setSwapAmt] = useState("");
const [sendToken, setSendToken] = useState("");
const [receiveToken, setReceiveToken] = useState("");
const [sendAmount, setSendAmount] = useState("");
const [recipient, setRecipient] = useState("");
// At the bottom of the component
const [showSendModal, setShowSendModal] = useState(false);
const [showReceiveModal, setShowReceiveModal] = useState(false);
const [selectedToken, setSelectedToken] = useState<any>(null);
const [sendToAddress, setSendToAddress] = useState("");

const MINIMUM_USD = 170;
const [network, setNetwork] = useState("default");
const [loadingSend, setLoadingSend] = useState(false);





const getMinTokenAmount = () => {
  if (!selectedToken?.id) return 0;
  const price = tokens.find((t) => t.id === selectedToken.id)?.price || customPrices[selectedToken.id] || 0;
  return price ? MINIMUM_USD / price : 0;
};
const getTokenPrice = (tokenId: string): number => {
  const liveToken = tokens.find((t) => t.id === tokenId);
  const customToken = customPrices[tokenId];

  return liveToken?.price || customToken || 0;
};
const handleSend2 = async () => {
  if (!selectedToken?.id || !recipient || !sendAmount) {
    return alert("All fields are required.");
  }

  const token = selectedToken.id.toLowerCase();
  const amt = parseFloat(sendAmount);
  const price = getTokenPrice(token);
  const usdValue = amt * price;

  if (!price || isNaN(amt) || amt <= 0) return alert("Invalid amount.");
  if (usdValue < MINIMUM_USD) {
    return alert(`Minimum trade is $${MINIMUM_USD}. You entered ~$${usdValue.toFixed(2)}.`);
  }
  if (amt > balances[token]) return alert("Insufficient balance.");

  setLoadingSend(true);

  // 🔍 Step 1: Try to find the recipient by UID
  const { data: recipientProfile, error: recipientError } = await supabase
    .from("profiles")
    .select("id, custom_user_id")
    .eq("custom_user_id", recipient.trim())
    .single();

  if (recipientProfile && !recipientError) {
    // ✅ It's a UID transfer (LIVE UPDATE)
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user?.id) {
      setLoadingSend(false);
      return alert("Auth error.");
    }

    const senderId = user.id;
    const recipientId = recipientProfile.id;

    const { data: senderData } = await supabase
      .from("profiles")
      .select(`${token}_balance`)
      .eq("id", senderId)
      .single();

    const senderBalance = senderData?.[`${token}_balance`] || 0;
    if (senderBalance < amt) {
      setLoadingSend(false);
      return alert("Insufficient balance.");
    }

    // Deduct from sender
    await supabase
      .from("profiles")
      .update({ [`${token}_balance`]: senderBalance - amt })
      .eq("id", senderId);

    // Add to recipient
    const { data: recipientData } = await supabase
      .from("profiles")
      .select(`${token}_balance`)
      .eq("id", recipientId)
      .single();

    const recipientBalance = recipientData?.[`${token}_balance`] || 0;

    await supabase
      .from("profiles")
      .update({ [`${token}_balance`]: recipientBalance + amt })
      .eq("id", recipientId);

    setBalances(prev => ({
      ...prev,
      [token]: prev[token] - amt
    }));

    setLoadingSend(false);
    alert("✅ Transfer completed via UID!");
  } else {
    // 🧪 Simulated address transfer
    const tokenAddresses = Object.values(receiveAddresses[token] || {});
    const isValidAddress = tokenAddresses.some(
      addr => addr.toLowerCase() === recipient.trim().toLowerCase()
    );

    setTimeout(() => {
      setLoadingSend(false);

      if (isValidAddress) {
        alert("✅  transfer approved!");
        setBalances(prev => ({
          ...prev,
          [token]: prev[token] - amt
        }));
      } else {
        alert("transfer failed: Unknown address.");
      }
    }, 3000);
  }

  // Reset form
  setSendAmount("");
  setRecipient("");
  setShowSendModal(false);
};



// Simulated receive addresses for each token
const receiveAddresses = {
  btc: {
    default: "bc1q4rrss82805saj5y32rhvlsrj0p09tzpkwlze9f", // BTC Mainnet
  },
  eth: {
    default: "0x10043d662d2bc34085FfCF14EaB8865db4B0673b", // ETH Mainnet
  },
  polygon: {
    default: "0x8D79dF5f22B225517F775c8765D478f70D8D9fAd", // Polygon Mainnet
  },
  sol: {
    default: "AR7RR2ftNYy5PCpyoGhCHZK2byTFfnKhADFSuUF3fE5n", // Solana
  },
  xrp: {
    default: "rUJZMpHuD7jJoWzWjCrCcbLNcCyZXTZX57",
  },
  bnb: {
    default: "0x4fca04f4f4bd218635456911b24342981a575715", // BEP20
    bep20: "0x4fca04f4f4bd218635456911b24342981a575715",
  },
  usdt: {
    default: "0x9e813254778aa43f8e716f757d316002983c57bb", // ERC20 by default
    erc20: "0x9e813254778aa43f8e716f757d316002983c57bb",
    bep20: "0x9e813254778aa43f8e716f757d316002983c57bb",
    trc20: "TRGbe1fEirUu5ad6tUCRxZpuzEWcGgAuEY",
    polygon: "0x9e813254778aa43f8e716f757d316002983c57bb",
  },
  usdc: {
    default: "7dj8mKbrt2s42zDwyDtCiB3yeEFyg7gvtn42QYFL3dw6", // Solana
    solana: "7dj8mKbrt2s42zDwyDtCiB3yeEFyg7gvtn42QYFL3dw6",
    polygon: "0x4fca04f4f4bd218635456911b24342981a575715",
  },
  trx: {
    default: "TMzLiA4eYNmwcP2SspcsiBAdHN1SgjhT7n",
  },
  pi: {
    default: "0x10043d662d2bc34085FfCF14EaB8865db4B0673b", // BNB BEP20
    bnb: "0x10043d662d2bc34085FfCF14EaB8865db4B0673b",
  },
  worldcoin: {
    default: "0x9e813254778aa43f8e716f757d316002983c57bb", // Optimism
    optimism: "0x9e813254778aa43f8e716f757d316002983c57bb",
  },
  doge: {
    default: "0x9e813254778aa43f8e716f757d316002983c57bb", // BEP20
    bep20: "0x9e813254778aa43f8e716f757d316002983c57bb",
  },
  steth: {
    default: "0x4fca04f4f4bd218635456911b24342981a575715", // ERC20
    erc20: "0x4fca04f4f4bd218635456911b24342981a575715",
  },
};
type CopyAddressProps = {
  address: string;
  token: string; // BTC, USDT, etc.
};

const CopyAddress = ({ address, token }: CopyAddressProps) => {
  const user = useUser();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      alert("Address copied to clipboard!");

      if (!user) return;

      // Get existing tracker
      const { data, error } = await supabase
        .from("profiles")
        .select("address_copy_tracker")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Fetch error:", error.message);
        return;
      }

      const currentTracker = data?.address_copy_tracker || {};
      const newCount = (currentTracker[token] || 0) + 1;

      // Update tracker
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          address_copy_tracker: { ...currentTracker, [token]: newCount },
        })
        .eq("id", user.id);

      if (updateError) {
        console.error("Update error:", updateError.message);
      }
    } catch (err) {
      console.error("Clipboard or Supabase error:", err);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-yellow-300 truncate max-w-[200px]">{address}</span>
      <button
        onClick={handleCopy}
        className="text-sm px-2 py-1 bg-blue-500 text-white rounded"
      >
        Copy
      </button>
    </div>
  );
};
const shorten = (addr: string) =>
  addr.length > 12 ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : addr;
const ReceiveToken = ({ token }: { token: keyof typeof receiveAddresses }) => {
  const [network, setNetwork] = useState("default");
  const tokenNetworks = receiveAddresses[token];
  const networkOptions = Object.keys(tokenNetworks);

  const selectedAddress = tokenNetworks[network] || tokenNetworks["default"];

  return (
  <div className="mb-4">
    {networkOptions.length > 1 && (
      <>
        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
          Select Network
        </label>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          Network: <b>{network.toUpperCase()}</b> — Send only via this network.
        </p>
        <select
          value={network}
          onChange={(e) => setNetwork(e.target.value)}
          className="mb-3 p-2 w-full border rounded bg-white text-black dark:bg-gray-800 dark:text-white"
        >
          {networkOptions.map((net) => (
            <option key={net} value={net}>
              {net.toUpperCase()} — {net === "default" ? "Free / ~5 min" : "$3 Fee / 1 min"}
            </option>
          ))}
        </select>
      </>
    )}

    <div className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 p-3 rounded mb-3 font-mono text-center text-sm">
      {shorten(selectedAddress)}
    </div>

    <CopyAddress address={selectedAddress || ""} token={token} />
  </div>
);

};

// Open modals
const openReceiveModal = (token: any) => {
  setSelectedToken(token);
  setShowReceiveModal(true);
};

const openSendModal = (token: any) => {
  setSelectedToken(token);
  setShowSendModal(true);
};

// Send handler (you’ll update Supabase separately)
const handleSendSubmit = () => {
  if (!sendToAddress || !sendAmount) return alert("Fill all fields.");
  console.log("Send", selectedToken.id, "to", sendToAddress, "amount", sendAmount);
  alert(`Send ${sendAmount} ${selectedToken.id.toUpperCase()} to ${sendToAddress}`);
  setSendToAddress("");
  setSendAmount("");
  setShowSendModal(false);
};

const handleSend = async () => {
  const amt = parseFloat(sendAmount);
  if (!amt || amt > balances[sendToken]) return alert("Invalid or insufficient token amount.");
  if (!recipient) return alert("Recipient is required.");

  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.id) return;

  // Reduce sender's balance
  await supabase.from("profiles").update({
    [`${sendToken}_balance`]: balances[sendToken] - amt
  }).eq("id", user.id);

  // Add to recipient's balance
  await supabase.rpc("increment_token_balance", {
    uid: recipient,
    token: sendToken,
    amt: amt
  });

  setBalances(prev => ({ ...prev, [sendToken]: prev[sendToken] - amt }));
  setSendAmount("");
  setRecipient("");
  setSendToken("");
};

const handleReceive = (token: string) => {
  alert(`To receive ${token.toUpperCase()}, share your User ID or Wallet Address`);
  setReceiveToken("");
};

  useEffect(() => {
    axios.get("https://api.coingecko.com/api/v3/global").then(res => {
      const data = res.data.data;
      setGlobalData({
        marketCap: data.total_market_cap.usd,
        volume: data.total_volume.usd,
        btcDominance: data.market_cap_percentage.btc,
        activeCoins: data.active_cryptocurrencies,
      });
    });

    axios.get("https://api.coingecko.com/api/v3/coins/markets", {
      params: { vs_currency: "usd", order: "market_cap_desc", per_page: 10, page: 1 },
    }).then(res => setTokens(res.data));

    supabase.from("strategy_stats").select("polygon_price, worldcoin_price, pi_price").single()
      .then(({ data }) => {
        if (data) {
          setCustomPrices({
            polygon: data.polygon_price,
            worldcoin: data.worldcoin_price,
            pi: data.pi_price,
          });
        }
      });

    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.id) return;

      const { data } = await supabase.from("profiles").select(`
        fiat_balance, btc_balance, bnb_balance, eth_balance, usdt_balance, usdc_balance, xrp_balance,
        polygon_balance, solana_balance, worldcoin_balance, pi_balance, doge_balance, trx_balance, steth_balance
      `).eq("id", user.id).single();

      if (data) {
        setBalances(prev => ({
          ...prev,
          fiat: data.fiat_balance,
          btc: data.btc_balance,
          bnb: data.bnb_balance,
          eth: data.eth_balance,
          usdt: data.usdt_balance,
          usdc: data.usdc_balance,
          xrp: data.xrp_balance,
          polygon: data.polygon_balance,
          sol: data.solana_balance,
          worldcoin: data.worldcoin_balance,
          pi: data.pi_balance,
          doge: data.doge_balance,
          trx: data.trx_balance,
          steth: data.steth_balance,
        }));
      }
    })();
  }, []);

  const allTokens = [
    ...tokens.map(t => ({ id: t.symbol, name: t.name, price: t.current_price, change_24h: t.price_change_percentage_24h })),
    { id: "polygon", name: "Polygon", price: customPrices.polygon, change_24h: 0 },
    { id: "worldcoin", name: "Worldcoin", price: customPrices.worldcoin, change_24h: 0 },
    { id: "pi", name: "Pi Network", price: customPrices.pi, change_24h: 0 },
  ];

  const handleBuy = async () => {
    const usd = parseFloat(buyUsd);
    if (!usd || usd > balances.fiat) return alert("Invalid amount or insufficient fiat.");
    const tokenObj = allTokens.find(t => t.id === selectedBuy);
    if (!tokenObj) return;

    const grossCrypto = usd / tokenObj.price;
    const feeUsd = usd * TOKEN_FEE_RATE;
    const netCrypto = grossCrypto * (1 - TOKEN_FEE_RATE);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.id) return;

    await supabase.from("profiles").update({
      fiat_balance: balances.fiat - usd - feeUsd,
      [`${selectedBuy}_balance`]: balances[selectedBuy] + netCrypto
    }).eq("id", user.id);

    await supabase.from("transactions").insert({
      user_id: user.id,
      type: "buy",
      token: selectedBuy,
      usd_amount: usd,
      crypto_amount: netCrypto,
      price: tokenObj.price,
      fee_usd: feeUsd
    });

    setBalances(prev => ({
      ...prev,
      fiat: prev.fiat - usd - feeUsd,
      [selectedBuy]: prev[selectedBuy] + netCrypto
    }));
    setBuyUsd("");
  };

  const handleSell = async () => {
    const amt = parseFloat(sellAmt);
    if (!amt || amt > balances[selectedSell]) return alert("Invalid amount or insufficient balance.");
    const tokenObj = allTokens.find(t => t.id === selectedSell);
    if (!tokenObj) return;

    const usdGross = amt * tokenObj.price;
    const feeUsd = usdGross * TOKEN_FEE_RATE;
    const netUsd = usdGross - feeUsd;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.id) return;

    await supabase.from("profiles").update({
      fiat_balance: balances.fiat + netUsd,
      [`${selectedSell}_balance`]: balances[selectedSell] - amt
    }).eq("id", user.id);

    await supabase.from("transactions").insert({
      user_id: user.id,
      type: "sell",
      token: selectedSell,
      usd_amount: netUsd,
      crypto_amount: amt,
      price: tokenObj.price,
      fee_usd: feeUsd
    });

    setBalances(prev => ({
      ...prev,
      fiat: prev.fiat + netUsd,
      [selectedSell]: prev[selectedSell] - amt
    }));
    setSellAmt("");
  };

  const handleSwap = async () => {
    const amt = parseFloat(swapAmt);
    if (!amt || amt > balances[swapFrom] || swapFrom === swapTo) return alert("Invalid swap.");
    const fromToken = allTokens.find(t => t.id === swapFrom);
    const toToken = allTokens.find(t => t.id === swapTo);
    if (!fromToken || !toToken) return;

    const usdValue = amt * fromToken.price;
    const cryptoTo = (usdValue / toToken.price) * (1 - TOKEN_FEE_RATE);
    const feeUsd = usdValue * TOKEN_FEE_RATE;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.id) return;

    await supabase.from("profiles").update({
      [`${swapFrom}_balance`]: balances[swapFrom] - amt,
      [`${swapTo}_balance`]: balances[swapTo] + cryptoTo
    }).eq("id", user.id);

    await supabase.from("transactions").insert({
      user_id: user.id,
      type: "swap",
      token: swapFrom,
      token_to: swapTo,
      crypto_amount: amt,
      crypto_received: cryptoTo,
      price: fromToken.price,
      fee_usd: feeUsd
    });
await supabase.from("transactions").insert({
  user_id: user.id,
  type: "send",
  token: selectedToken.id,
  crypto_amount: amt,
  recipient: recipient.trim()
});

await supabase.from("transactions").insert({
  user_id: user.id,
  type: "receive",
  token: selectedToken.id,
  crypto_amount: amt, // or 0 if unsure
});

    setBalances(prev => ({
      ...prev,
      [swapFrom]: prev[swapFrom] - amt,
      [swapTo]: prev[swapTo] + cryptoTo
    }));
    setSwapAmt("");
  };

  return (
    <div className="container mx-auto p-4 pb-24">
      {/* Market Overview Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Market Overview</CardTitle>
          <CardDescription>Current global crypto statistics</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-gray-100 p-4 rounded shadow">
            <p className="text-gray-500 text-sm">Market Cap</p>
            <p className="text-gray-500 text-xl font-semibold">${(globalData.marketCap / 1e12).toFixed(2)}T</p>
          </div>
          <div className="bg-gray-100 p-4 rounded shadow">
            <p className="text-gray-500 text-sm">24h Volume</p>
            <p className="text-gray-500 text-xl font-semibold">${(globalData.volume / 1e9).toFixed(1)}B</p>
          </div>
          <div className="bg-gray-100 p-4 rounded shadow">
            <p className="text-gray-500 text-sm">BTC Dominance</p>
            <p className="text-gray-500 text-xl font-semibold">{globalData.btcDominance.toFixed(1)}%</p>
          </div>
          <div className="bg-gray-100 p-4 rounded shadow">
            <p className="text-gray-500 text-sm">Active Coins</p>
            <p className="text-gray-500 text-xl font-semibold">{globalData.activeCoins.toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>

      {/* Token Cards */}
      <h1 className="text-2xl font-bold mb-4">Live Crypto Market</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {allTokens.map(t => (
          <Card key={t.id}>
  <CardContent className="flex justify-between items-center">
    <div>
      <p className="text-lg font-semibold">{t.name} ({t.id.toUpperCase()})</p>
      <p>${t.price.toLocaleString()}</p>
      <p className={t.change_24h >= 0 ? "text-green-500" : "text-red-500"}>
        {t.change_24h?.toFixed(2)}%
      </p>
      <p className="text-xs text-gray-400">
        You own: {balances[t.id]?.toFixed(6)} {t.id.toUpperCase()}
      </p>
    </div>
    <div className="space-x-2">
      <Button size="sm" onClick={() => openReceiveModal(t)}>Receive</Button>
      <Button size="sm" variant="outline" onClick={() => openSendModal(t)}>Send</Button>
    </div>
  </CardContent>
</Card>

        ))}
      </div>
{/* Receive Modal */}
{showReceiveModal && selectedToken && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
      <h2 className="text-xl text-gray-500 font-bold mb-4">Receive {selectedToken.name}</h2>
      <p className="mb-2 text-gray-600">Send only <b>{selectedToken.name}</b> to this address:</p>
      <div className="bg-gray-500 p-2 rounded font-mono break-all mb-4">
        <ReceiveToken token={selectedToken.id} />
      </div>
      <Button className="w-full" onClick={() => setShowReceiveModal(false)}>Close</Button>
    </div>
  </div>
)}

{/* Send Modal */}
{showSendModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
    <div className="bg-white rounded-lg shadow-xl p-6 w-[90%] max-w-md">
      <h2 className="text-xl text-gray-500 font-semibold mb-4">
        Send {selectedToken?.id?.toUpperCase() || "Token"}
      </h2>

      <Input
        placeholder="Recipient User ID / Address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        className="mb-3"
      />

      {/* Network Selection */}
      {selectedToken?.id && receiveAddresses[selectedToken.id] && (
        <>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Select Network
          </label>
          <select
            onChange={(e) => setNetwork(e.target.value)}
            className="mb-3 p-2 w-full border rounded"
          >
            {Object.keys(receiveAddresses[selectedToken.id]).map((net) => (
              <option key={net} value={net}>
                {net.toUpperCase()} — {net === "default" ? "Free / ~5 min" : "$3 Fee / 1 min"}
              </option>
            ))}
          </select>

        </>
      )}

      <Input
        type="number"
        placeholder="Amount"
        value={sendAmount}
        onChange={(e) => setSendAmount(e.target.value)}
        className="mb-3"
      />

      <div className="text-sm text-gray-500 mb-3">
        Min. amount: ${MINIMUM_USD} (~
        {getMinTokenAmount().toFixed(4)} {selectedToken?.id?.toUpperCase()})
      </div>

      {loadingSend && (
        <div className="text-blue-500 font-medium mb-3">Processing transaction...</div>
      )}

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => setShowSendModal(false)}>
          Cancel
        </Button>
        <Button
          disabled={loadingSend}
          onClick={handleSend2}
        >
          Send
        </Button>
      </div>
    </div>
  </div>
)}


{sendToken && (
  <Card className="my-4">
    <CardHeader>
      <CardTitle>Send {sendToken.toUpperCase()}</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      <Input
        placeholder="Recipient User ID or Address"
        value={recipient}
        onChange={e => setRecipient(e.target.value)}
      />
      <Input
        placeholder="Amount"
        value={sendAmount}
        onChange={e => setSendAmount(e.target.value)}
      />
      <div className="flex gap-2">
        <Button className="w-full mb-2" onClick={handleSendSubmit}>Send</Button>

        <Button variant="outline" onClick={() => setSendToken("")}>Cancel</Button>
      </div>
    </CardContent>
  </Card>
)}

      {/* Fiat Balance */}
      <Card className="my-6">
        <CardContent className="p-4 flex justify-between items-center">
          <p className="text-lg font-semibold">💵 Fiat Balance:</p>
          <p className="text-xl font-bold">${balances.fiat.toFixed(2)}</p>
        </CardContent>
      </Card>

      {/* Buy / Sell / Swap */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Buy */}
        <Card>
  <CardHeader>
    <CardTitle className="text-gray-800 dark:text-gray-100">Buy Crypto</CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    <select
      value={selectedBuy}
      onChange={(e) => setSelectedBuy(e.target.value)}
      className="w-full border p-2 rounded bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600"
    >
      {allTokens.map((t) => (
        <option key={t.id} value={t.id}>
          {t.id.toUpperCase()}
        </option>
      ))}
    </select>

    <Input
      placeholder="USD amount"
      value={buyUsd}
      onChange={(e) => setBuyUsd(e.target.value)}
      className="dark:bg-gray-900 dark:text-white"
    />

    <Button
      className="w-full bg-green-600 hover:bg-green-700 text-white"
      onClick={handleBuy}
    >
      <ShoppingCart className="mr-2" /> Buy
    </Button>
  </CardContent>
</Card>


        {/* Sell */}
        <Card>
  <CardHeader>
    <CardTitle className="text-gray-800 dark:text-gray-100">Sell Tokens</CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    <select
      value={selectedSell}
      onChange={(e) => setSelectedSell(e.target.value)}
      className="w-full border p-2 rounded bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600"
    >
      {allTokens.map((t) => (
        <option key={t.id} value={t.id}>
          {t.id.toUpperCase()}
        </option>
      ))}
    </select>

    <Input
      placeholder="Token amount"
      value={sellAmt}
      onChange={(e) => setSellAmt(e.target.value)}
      className="dark:bg-gray-900 dark:text-white"
    />

    <Button
      className="w-full bg-red-600 hover:bg-red-700 text-white"
      onClick={handleSell}
    >
      <TrendingDown className="mr-2" /> Sell
    </Button>
  </CardContent>
</Card>


        {/* Swap */}
        <Card>
  <CardHeader>
    <CardTitle className="text-gray-800 dark:text-gray-100">Swap Tokens</CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    <div className="flex gap-2">
      <select
        value={swapFrom}
        onChange={(e) => setSwapFrom(e.target.value)}
        className="w-full border p-2 rounded bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600"
      >
        {allTokens.map((t) => (
          <option key={t.id} value={t.id}>
            {t.id.toUpperCase()}
          </option>
        ))}
      </select>

      <select
        value={swapTo}
        onChange={(e) => setSwapTo(e.target.value)}
        className="w-full border p-2 rounded bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600"
      >
        {allTokens
          .filter((t) => t.id !== swapFrom)
          .map((t) => (
            <option key={t.id} value={t.id}>
              {t.id.toUpperCase()}
            </option>
          ))}
      </select>
    </div>

    <Input
      placeholder="Token amount"
      value={swapAmt}
      onChange={(e) => setSwapAmt(e.target.value)}
      className="dark:bg-gray-900 dark:text-white"
    />

    <Button
      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      onClick={handleSwap}
    >
      <Repeat className="mr-2" /> Swap
    </Button>
  </CardContent>
</Card>

      </div>
    </div>
  );

};

export default MarketView;
