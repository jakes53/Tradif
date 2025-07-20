import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import Arbitrage from "./pages/Arbitrage";
import MarginTrading from "./pages/MarginTrading";
import SpotTrading from "./pages/SpotTrading";
import CopyTrading from './pages/CopyTrading';
import AmlPolicy from './pages/AmlPolicy';
import Mining from './pages/Mining';
import AboutUs from './pages/AboutUs';
import Careers from "./pages/Careers";
import LegalPrivacy from "./pages/LegalPrivacy";
import PrivacyPolicy from './pages/PrivacyPolicy';
import CookiePolicy from './pages/CookiePolicy';
import TermsOfService from './pages/TermsOfService';
import AdvancedCharting from "./pages/AdvancedCharting";
import ContactSupport from "./pages/ContactSupport";
import FeaturesApp from "./pages/FeaturesApp";
import CreateAccount from './pages/CreateAccount';
import InstantDeposits from './pages/InstantDeposits';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import NotFound from "./pages/NotFound";
import TradeView from "./pages/TradeView";
import MarketView from "./pages/MarketView";
import WalletView from "./pages/WalletView";
import MarketNews from './pages/MarketNews';
import MiningPackages  from './pages/MiningPackages';
import AccountLevelPackages  from './pages/AccountLevelPackages';
import Performance from "./pages/performance";
import MarginDisclaimer from "@/pages/MarginDisclaimer";
import MarginDashboard from "./pages/MarginDashboard";
import Profile  from './pages/Profile';
import Settings  from './pages/Settings';
import Refferals  from './pages/Refferals';
import SupportUser  from './pages/SupportUser';
import CopyStrategy  from './pages/CopyStrategy';
import TransactionFees from './pages/TransactionFees';
import AdvancedTrading from './pages/AdvancedTrading';
import BankSecurity from './pages/BankSecurity';
import { BotLogProvider } from "@/context/BotLogContext";

// Layout
import Navigation from './components/Navigation';
import FaqSection from './components/FaqSection';
import PartnershipSection from './components/PartnershipsSection';

const queryClient = new QueryClient();


const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BotLogProvider> {/* ✅ Wrap app inside */}
        <BrowserRouter>
          <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/arbitrage" element={<Arbitrage />} />
          <Route path="/trading-tools" element={<AdvancedCharting/>} />
          <Route path="/margin" element={<MarginTrading />} />
          <Route path="/spot-trading" element={<SpotTrading />} />
          <Route path="/copy-trading" element={<CopyTrading />} />
          <Route path="/mining" element={<Mining />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/legal" element={<LegalPrivacy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactSupport />} />
          <Route path="/features" element={<FeaturesApp />} />
          <Route path="/deposits" element={<InstantDeposits />} />
          <Route path="/aml" element={<AmlPolicy />} />
          <Route path="/margin-trading" element={<MarginDisclaimer />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/cookies" element={<CookiePolicy />} />
          <Route path="/create" element={<CreateAccount />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/news" element={<MarketNews />} />
          <Route path="/fees" element={<TransactionFees />} />
          <Route path="/tools" element={<AdvancedTrading />} />
          <Route path="/security" element={<BankSecurity />} />


          {/* Authenticated Routes with Navigation */}
          <Route element={<Navigation />}>
            <Route path="/dash" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/trade" element={<TradeView />} />
            <Route path="/market" element={<MarketView />} />
            <Route path="/wallet" element={<WalletView />} />
            <Route path="/referrals" element={<Refferals />} />
            <Route path="/miningpackages" element={<MiningPackages />} />
            <Route path="/levelpackages" element={<AccountLevelPackages />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/strategy" element={<CopyStrategy />} />
            <Route path="/support" element={<SupportUser />} />
            <Route path="/performance" element={<Performance />} />
          <Route path="/margin-dashboard" element={<MarginDashboard />} />
          </Route>

          {/* Catch-all Route */}
          <Route path="*" element={<NotFound />} />
          <Route path="/faq" element={<FaqSection />} />
          <Route path="/partnerships" element={<PartnershipSection />} />
          </Routes>
        </BrowserRouter>
      </BotLogProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App; 