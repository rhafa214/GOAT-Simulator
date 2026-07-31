const fs = require('fs');
const path = 'src/components/hub/MainHub.tsx';

const content = `import React from "react";
import { useGameEngine } from "../../engine/GameEngine";
import { motion } from "motion/react";
import {
  Home,
  User,
  Briefcase,
  Shield,
  Calendar,
  Trophy,
  ArrowRightLeft,
  Dumbbell,
  Award,
  BarChart2,
  HeartHandshake,
  Settings,
  Bell,
  LogOut
} from "lucide-react";
import DashboardView from "./DashboardView";
import StatsView from "./StatsView";
import { AttributesView } from "./AttributesView";
import { NewsFeedTab } from "./NewsFeedTab";
import TrainingTab from "./TrainingTab";

export default function MainHub() {
  const { state, dispatch } = useGameEngine();
  const { player, career } = state;
  const [activeTab, setActiveTab] = React.useState("dashboard");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full min-h-screen bg-[#05050A] text-white flex overflow-hidden font-sans"
    >
      {/* Sidebar */}
      <aside className="w-64 flex flex-col shrink-0 bg-[#0B0C10] border-r border-white/5 h-screen sticky top-0">
        {/* Logo */}
        <div className="p-6 mb-2">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black tracking-tight leading-none">
              FOOTBALL<br/>
              <span className="text-red-500">CAREER</span>
            </h1>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex flex-col flex-1 overflow-y-auto custom-scrollbar px-3 gap-1">
          <MenuButton icon={<Home size={18} />} label="Painel" active={activeTab === "dashboard"} onClick={() => setActiveTab("dashboard")} />
          <MenuButton icon={<User size={18} />} label="Jogador" active={activeTab === "atributos"} onClick={() => setActiveTab("atributos")} />
          <MenuButton icon={<Briefcase size={18} />} label="Carreira" />
          <MenuButton icon={<Shield size={18} />} label="Clube" />
          <MenuButton icon={<Calendar size={18} />} label="Calendário" />
          <MenuButton icon={<Trophy size={18} />} label="Competições" />
          <MenuButton icon={<ArrowRightLeft size={18} />} label="Transferências" />
          <MenuButton icon={<Dumbbell size={18} />} label="Treinos" active={activeTab === "treinamento"} onClick={() => setActiveTab("treinamento")} />
          <MenuButton icon={<Award size={18} />} label="Conquistas" />
          <MenuButton icon={<BarChart2 size={18} />} label="Estatísticas" active={activeTab === "estatisticas"} onClick={() => setActiveTab("estatisticas")} />
          <MenuButton icon={<HeartHandshake size={18} />} label="Relacionamentos" />
          <MenuButton icon={<Settings size={18} />} label="Opções" />
        </div>
        
        {/* Bottom Actions */}
        <div className="p-4 mt-auto border-t border-white/5">
          <button
            onClick={() => dispatch({ type: "CHANGE_PHASE", payload: "RETIREMENT" })}
            className="group flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all w-full justify-start text-zinc-500 hover:bg-white/5 hover:text-white"
          >
            <LogOut size={18} className="shrink-0" />
            <span className="text-sm">Aposentar</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-20 flex items-center justify-end px-8 shrink-0">
          <div className="flex items-center gap-6">
            <button className="relative text-zinc-400 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#05050A]"></span>
            </button>
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="text-right">
                <div className="text-sm font-bold text-white leading-tight">{player.name || 'Jogador'}</div>
                <div className="text-xs text-zinc-400 leading-tight">{career.currentClub?.name || 'Agente Livre'}</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-zinc-800 overflow-hidden border border-white/10 flex items-center justify-center">
                {career.currentClub?.logo ? <img src={career.currentClub.logo} alt="Club" className="w-6 h-6 object-contain" referrerPolicy="no-referrer" /> : <User size={20} className="text-zinc-500" />}
              </div>
            </div>
          </div>
        </header>

        {/* Main View */}
        <div className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full max-w-7xl mx-auto"
          >
            {activeTab === "dashboard" && <DashboardView />}
            {activeTab === "estatisticas" && <StatsView />}
            {activeTab === "atributos" && <AttributesView />}
            {activeTab === "treinamento" && <TrainingTab />}
            {activeTab === "noticias" && <NewsFeedTab />}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

function MenuButton({
  icon,
  label,
  active = false,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={\`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all w-full justify-start \${
        active
          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
          : "text-zinc-400 hover:text-white hover:bg-white/5"
      }\`}
    >
      <div className={\`shrink-0 \${active ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"}\`}>
        {icon}
      </div>
      <span className="text-sm">
        {label}
      </span>
    </button>
  );
}
`;

fs.writeFileSync(path, content);
