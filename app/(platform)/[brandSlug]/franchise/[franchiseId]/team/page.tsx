import FranchiseHeader from "@/components/franchise/FranchiseHeader";
import TeamClient from "@/components/franchise/TeamClient";
import React from "react";

async function FranchiseTeamPage() {
  return (
    <div className="min-h-screen">
      <FranchiseHeader />
      <TeamClient />
    </div>
  );
}

export default FranchiseTeamPage;
