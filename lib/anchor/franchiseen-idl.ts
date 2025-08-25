export type FranchiseenChain = {
  "version": "0.1.0",
  "name": "franchiseen_chain",
  "instructions": [
    {
      "name": "initializePlatform",
      "accounts": [
        {
          "name": "platform",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "platformFeeBps",
          "type": "u16"
        }
      ]
    },
    {
      "name": "createBusiness",
      "accounts": [
        {
          "name": "business",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "slug",
          "type": "string"
        },
        {
          "name": "industry",
          "type": "string"
        },
        {
          "name": "category",
          "type": "string"
        }
      ]
    },
    {
      "name": "createFranchise",
      "accounts": [
        {
          "name": "franchise",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "business",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "franchiseTokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "slug",
          "type": "string"
        },
        {
          "name": "locationAddress",
          "type": "string"
        },
        {
          "name": "buildingName",
          "type": "string"
        },
        {
          "name": "carpetArea",
          "type": "u32"
        },
        {
          "name": "costPerArea",
          "type": "u64"
        },
        {
          "name": "totalShares",
          "type": "u32"
        }
      ]
    },
    {
      "name": "investInFranchise",
      "accounts": [
        {
          "name": "franchise",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "franchiseTokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "investorTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "franchiseVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "platformVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "platform",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "investor",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "sharesToBuy",
          "type": "u32"
        }
      ]
    },
    {
      "name": "distributeRevenue",
      "accounts": [
        {
          "name": "franchise",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "totalRevenue",
          "type": "u64"
        }
      ]
    },
    {
      "name": "claimDividends",
      "accounts": [
        {
          "name": "franchise",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "investorTokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "franchiseVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "investor",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": []
    },
    {
      "name": "updateFranchiseStatus",
      "accounts": [
        {
          "name": "franchise",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "newStatus",
          "type": {
            "defined": "FranchiseStatus"
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "platform",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "platformFeeBps",
            "type": "u16"
          },
          {
            "name": "totalFranchises",
            "type": "u32"
          },
          {
            "name": "totalVolume",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "business",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "slug",
            "type": "string"
          },
          {
            "name": "industry",
            "type": "string"
          },
          {
            "name": "category",
            "type": "string"
          },
          {
            "name": "verificationTier",
            "type": {
              "defined": "VerificationTier"
            }
          },
          {
            "name": "totalFranchises",
            "type": "u32"
          },
          {
            "name": "totalInvestment",
            "type": "u64"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "franchise",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "business",
            "type": "publicKey"
          },
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "slug",
            "type": "string"
          },
          {
            "name": "locationAddress",
            "type": "string"
          },
          {
            "name": "buildingName",
            "type": "string"
          },
          {
            "name": "carpetArea",
            "type": "u32"
          },
          {
            "name": "costPerArea",
            "type": "u64"
          },
          {
            "name": "totalInvestment",
            "type": "u64"
          },
          {
            "name": "totalShares",
            "type": "u32"
          },
          {
            "name": "soldShares",
            "type": "u32"
          },
          {
            "name": "totalRaised",
            "type": "u64"
          },
          {
            "name": "capitalRecovered",
            "type": "u64"
          },
          {
            "name": "totalRevenue",
            "type": "u64"
          },
          {
            "name": "pendingDividends",
            "type": "u64"
          },
          {
            "name": "status",
            "type": {
              "defined": "FranchiseStatus"
            }
          },
          {
            "name": "tokenMint",
            "type": "publicKey"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "lastPayout",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "FranchiseStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Funding"
          },
          {
            "name": "Launching"
          },
          {
            "name": "Active"
          },
          {
            "name": "Paused"
          },
          {
            "name": "Closed"
          }
        ]
      }
    },
    {
      "name": "VerificationTier",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Unverified"
          },
          {
            "name": "Basic"
          },
          {
            "name": "Full"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "NameTooLong",
      "msg": "Name too long"
    },
    {
      "code": 6001,
      "name": "SlugTooLong",
      "msg": "Slug too long"
    },
    {
      "code": 6002,
      "name": "AddressTooLong",
      "msg": "Address too long"
    },
    {
      "code": 6003,
      "name": "InvalidShares",
      "msg": "Invalid shares amount"
    },
    {
      "code": 6004,
      "name": "InvalidArea",
      "msg": "Invalid area"
    },
    {
      "code": 6005,
      "name": "NotFunding",
      "msg": "Franchise not in funding status"
    },
    {
      "code": 6006,
      "name": "InsufficientShares",
      "msg": "Insufficient shares available"
    },
    {
      "code": 6007,
      "name": "NotActive",
      "msg": "Franchise not active"
    },
    {
      "code": 6008,
      "name": "InvalidAmount",
      "msg": "Invalid amount"
    },
    {
      "code": 6009,
      "name": "NoDividends",
      "msg": "No dividends available"
    },
    {
      "code": 6010,
      "name": "Unauthorized",
      "msg": "Unauthorized"
    }
  ]
};

export const IDL: FranchiseenChain = {
  "version": "0.1.0",
  "name": "franchiseen_chain",
  "instructions": [
    {
      "name": "initializePlatform",
      "accounts": [
        {
          "name": "platform",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "platformFeeBps",
          "type": "u16"
        }
      ]
    },
    {
      "name": "createBusiness",
      "accounts": [
        {
          "name": "business",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "slug",
          "type": "string"
        },
        {
          "name": "industry",
          "type": "string"
        },
        {
          "name": "category",
          "type": "string"
        }
      ]
    },
    {
      "name": "createFranchise",
      "accounts": [
        {
          "name": "franchise",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "business",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "franchiseTokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "slug",
          "type": "string"
        },
        {
          "name": "locationAddress",
          "type": "string"
        },
        {
          "name": "buildingName",
          "type": "string"
        },
        {
          "name": "carpetArea",
          "type": "u32"
        },
        {
          "name": "costPerArea",
          "type": "u64"
        },
        {
          "name": "totalShares",
          "type": "u32"
        }
      ]
    },
    {
      "name": "investInFranchise",
      "accounts": [
        {
          "name": "franchise",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "franchiseTokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "investorTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "franchiseVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "platformVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "platform",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "investor",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "sharesToBuy",
          "type": "u32"
        }
      ]
    },
    {
      "name": "distributeRevenue",
      "accounts": [
        {
          "name": "franchise",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "totalRevenue",
          "type": "u64"
        }
      ]
    },
    {
      "name": "claimDividends",
      "accounts": [
        {
          "name": "franchise",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "investorTokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "franchiseVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "investor",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": []
    },
    {
      "name": "updateFranchiseStatus",
      "accounts": [
        {
          "name": "franchise",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "newStatus",
          "type": {
            "defined": "FranchiseStatus"
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "platform",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "platformFeeBps",
            "type": "u16"
          },
          {
            "name": "totalFranchises",
            "type": "u32"
          },
          {
            "name": "totalVolume",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "business",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "slug",
            "type": "string"
          },
          {
            "name": "industry",
            "type": "string"
          },
          {
            "name": "category",
            "type": "string"
          },
          {
            "name": "verificationTier",
            "type": {
              "defined": "VerificationTier"
            }
          },
          {
            "name": "totalFranchises",
            "type": "u32"
          },
          {
            "name": "totalInvestment",
            "type": "u64"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "franchise",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "business",
            "type": "publicKey"
          },
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "slug",
            "type": "string"
          },
          {
            "name": "locationAddress",
            "type": "string"
          },
          {
            "name": "buildingName",
            "type": "string"
          },
          {
            "name": "carpetArea",
            "type": "u32"
          },
          {
            "name": "costPerArea",
            "type": "u64"
          },
          {
            "name": "totalInvestment",
            "type": "u64"
          },
          {
            "name": "totalShares",
            "type": "u32"
          },
          {
            "name": "soldShares",
            "type": "u32"
          },
          {
            "name": "totalRaised",
            "type": "u64"
          },
          {
            "name": "capitalRecovered",
            "type": "u64"
          },
          {
            "name": "totalRevenue",
            "type": "u64"
          },
          {
            "name": "pendingDividends",
            "type": "u64"
          },
          {
            "name": "status",
            "type": {
              "defined": "FranchiseStatus"
            }
          },
          {
            "name": "tokenMint",
            "type": "publicKey"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "lastPayout",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "FranchiseStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Funding"
          },
          {
            "name": "Launching"
          },
          {
            "name": "Active"
          },
          {
            "name": "Paused"
          },
          {
            "name": "Closed"
          }
        ]
      }
    },
    {
      "name": "VerificationTier",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Unverified"
          },
          {
            "name": "Basic"
          },
          {
            "name": "Full"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "NameTooLong",
      "msg": "Name too long"
    },
    {
      "code": 6001,
      "name": "SlugTooLong",
      "msg": "Slug too long"
    },
    {
      "code": 6002,
      "name": "AddressTooLong",
      "msg": "Address too long"
    },
    {
      "code": 6003,
      "name": "InvalidShares",
      "msg": "Invalid shares amount"
    },
    {
      "code": 6004,
      "name": "InvalidArea",
      "msg": "Invalid area"
    },
    {
      "code": 6005,
      "name": "NotFunding",
      "msg": "Franchise not in funding status"
    },
    {
      "code": 6006,
      "name": "InsufficientShares",
      "msg": "Insufficient shares available"
    },
    {
      "code": 6007,
      "name": "NotActive",
      "msg": "Franchise not active"
    },
    {
      "code": 6008,
      "name": "InvalidAmount",
      "msg": "Invalid amount"
    },
    {
      "code": 6009,
      "name": "NoDividends",
      "msg": "No dividends available"
    },
    {
      "code": 6010,
      "name": "Unauthorized",
      "msg": "Unauthorized"
    }
  ]
};


