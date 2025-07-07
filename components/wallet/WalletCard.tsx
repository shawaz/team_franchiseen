import React from "react";

interface WalletCardProps {
  balance: number;
  userName: string;
  onAddMoney: () => void;
  onWithdraw: () => void;
  className?: string;
}

const WalletCard: React.FC<WalletCardProps> = ({
  balance,
  onAddMoney,
  onWithdraw,
  className,
}) => {
  return (
    <div
      className={`relative w-full mx-auto rounded-2xl bg-gradient-to-tr from-yellow-700 via-yellow-800 to-yellow-900 text-white p-6 overflow-hidden ${className || ""}`}
    >
      {/* Card Brand/Logo */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-lg font-semibold tracking-wide">
          Wallet Balance
        </div>
        <div className="text-xs bg-white/20 px-3 py-1 rounded-full font-medium">
          Virtual Card
        </div>
      </div>
      {/* Balance */}
      <div className="mb-8">
        <div className="text-xs uppercase tracking-wider opacity-80">
          Current Balance
        </div>
        <div className="text-3xl font-bold mt-1">
          ₹{balance.toLocaleString()}
        </div>
      </div>
      {/* User Name and Actions */}
      <div className="flex items-end justify-between">
        {/* <div>
          <div className="text-xs opacity-70 mb-1">Cardholder</div>
          <div className="text-lg font-medium tracking-wide">{userName}</div>
        </div> */}
        <button
          onClick={onAddMoney}
          className="bg-white/90 text-stone-700 font-semibold px-4 py-2 rounded-lg shadow hover:bg-white transition w-full mr-3"
        >
          Add Money
        </button>
        <button
          onClick={onWithdraw}
          className="bg-white/20 text-white font-semibold px-4 py-2 rounded-lg border border-white/30 hover:bg-white/30 transition w-full"
        >
          Withdraw
        </button>
      </div>
      {/* Decorative Circles */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full z-0" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/5 rounded-full z-0" />
    </div>
  );
};

export default WalletCard;
