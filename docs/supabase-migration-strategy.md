# Supabase Migration Strategy

## Overview

This document outlines the comprehensive strategy for migrating from Convex to Supabase to enhance financial operations, improve scalability, and provide better integration with traditional financial systems.

## Why Migrate to Supabase?

### Current Convex Limitations
- Limited complex financial query capabilities
- No native SQL support for complex reporting
- Restricted integration with financial APIs
- Limited backup and disaster recovery options
- No built-in row-level security for financial data

### Supabase Advantages
- Full PostgreSQL database with advanced financial functions
- Row-level security (RLS) for sensitive financial data
- Real-time subscriptions with better performance
- Native integration with financial APIs and webhooks
- Advanced backup and point-in-time recovery
- Better compliance with financial regulations (SOX, PCI DSS)
- Built-in authentication with fine-grained permissions
- Edge functions for complex financial calculations

## Migration Phases

### Phase 1: Infrastructure Setup (Week 1-2)
1. **Supabase Project Setup**
   - Create production and staging environments
   - Configure database settings for financial workloads
   - Set up SSL certificates and security configurations

2. **Schema Design**
   - Design PostgreSQL schema based on current Convex tables
   - Add financial-specific constraints and triggers
   - Implement audit trails for all financial transactions

3. **Security Configuration**
   - Set up Row-Level Security (RLS) policies
   - Configure authentication providers
   - Implement role-based access control (RBAC)

### Phase 2: Core Data Migration (Week 3-4)
1. **Data Export from Convex**
   - Export all existing data in JSON format
   - Validate data integrity and completeness
   - Create data transformation scripts

2. **Schema Migration**
   - Create PostgreSQL tables with proper constraints
   - Set up indexes for optimal query performance
   - Implement foreign key relationships

3. **Data Import to Supabase**
   - Transform and import data in batches
   - Validate data integrity post-import
   - Set up data synchronization during transition

### Phase 3: Application Layer Migration (Week 5-8)
1. **API Layer Replacement**
   - Replace Convex queries with Supabase queries
   - Implement new financial calculation functions
   - Add advanced reporting capabilities

2. **Real-time Features**
   - Migrate real-time subscriptions to Supabase
   - Implement WebSocket connections for live updates
   - Add real-time financial dashboards

3. **Authentication Migration**
   - Migrate user authentication to Supabase Auth
   - Implement new permission system
   - Add multi-factor authentication (MFA)

### Phase 4: Advanced Features (Week 9-12)
1. **Financial Integrations**
   - Integrate with banking APIs
   - Add payment processor webhooks
   - Implement automated reconciliation

2. **Compliance and Auditing**
   - Add comprehensive audit logging
   - Implement data retention policies
   - Add compliance reporting features

3. **Performance Optimization**
   - Optimize database queries and indexes
   - Implement caching strategies
   - Add database monitoring and alerting

## Schema Mapping

### Current Convex Tables → Supabase Tables

```sql
-- Users table with enhanced security
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  image_url TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Businesses table with financial metadata
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES users(id),
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  industry_id UUID REFERENCES industries(id),
  currency TEXT DEFAULT 'USD',
  tax_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enhanced franchise table
CREATE TABLE franchises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id),
  owner_id UUID REFERENCES users(id),
  building TEXT NOT NULL,
  location_address TEXT NOT NULL,
  total_investment DECIMAL(15,2) NOT NULL,
  total_shares INTEGER NOT NULL,
  status TEXT DEFAULT 'Pending Approval',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Financial tracking
  funding_deadline TIMESTAMPTZ,
  launch_date TIMESTAMPTZ,
  monthly_revenue DECIMAL(15,2) DEFAULT 0,
  monthly_expenses DECIMAL(15,2) DEFAULT 0,
  
  -- Audit fields
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMPTZ,
  rejected_by UUID REFERENCES users(id),
  rejected_at TIMESTAMPTZ,
  rejection_reason TEXT
);

-- Enhanced escrow system
CREATE TABLE escrow_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  franchise_id UUID REFERENCES franchises(id),
  user_id UUID REFERENCES users(id),
  amount DECIMAL(15,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'held',
  stage TEXT DEFAULT 'pending_approval',
  
  -- Blockchain integration
  payment_signature TEXT,
  wallet_address TEXT,
  
  -- Timing
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  released_at TIMESTAMPTZ,
  refunded_at TIMESTAMPTZ,
  
  -- Audit trail
  processed_by UUID REFERENCES users(id),
  admin_notes TEXT,
  refund_reason TEXT
);

-- FRC Token system
CREATE TABLE frc_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  franchise_id UUID REFERENCES franchises(id) UNIQUE,
  token_mint TEXT UNIQUE NOT NULL,
  token_symbol TEXT UNIQUE NOT NULL,
  token_name TEXT NOT NULL,
  total_supply BIGINT NOT NULL,
  circulating_supply BIGINT DEFAULT 0,
  token_price DECIMAL(10,4) DEFAULT 1.0,
  
  -- Financial metrics
  total_revenue DECIMAL(15,2) DEFAULT 0,
  total_expenses DECIMAL(15,2) DEFAULT 0,
  net_profit DECIMAL(15,2) DEFAULT 0,
  
  -- Blockchain data
  contract_address TEXT,
  creation_signature TEXT NOT NULL,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Financial transactions with enhanced tracking
CREATE TABLE financial_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  franchise_id UUID REFERENCES franchises(id),
  user_id UUID REFERENCES users(id),
  
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  
  transaction_date TIMESTAMPTZ NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Verification
  is_verified BOOLEAN DEFAULT FALSE,
  verification_method TEXT,
  blockchain_signature TEXT,
  receipt_url TEXT,
  
  -- Approval workflow
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMPTZ,
  rejection_reason TEXT,
  
  -- FRC token integration
  frc_tokens_issued INTEGER DEFAULT 0,
  
  -- Metadata
  tags TEXT[],
  notes TEXT
);
```

## Data Migration Scripts

### Export Script (Convex)
```javascript
// convex/migrations/export-data.js
import { query } from "./_generated/server";

export const exportAllData = query({
  handler: async (ctx) => {
    const tables = [
      'users', 'businesses', 'franchise', 'shares', 
      'escrow', 'frcTokens', 'financialTransactions'
    ];
    
    const exportData = {};
    
    for (const table of tables) {
      exportData[table] = await ctx.db.query(table).collect();
    }
    
    return exportData;
  }
});
```

### Import Script (Supabase)
```sql
-- Migration script for importing Convex data
CREATE OR REPLACE FUNCTION import_convex_data(data JSONB)
RETURNS TEXT AS $$
DECLARE
  record_count INTEGER := 0;
BEGIN
  -- Import users
  INSERT INTO users (clerk_id, email, name, image_url, created_at)
  SELECT 
    (value->>'tokenIdentifier')::TEXT,
    (value->>'email')::TEXT,
    (value->>'name')::TEXT,
    (value->>'imageUrl')::TEXT,
    to_timestamp((value->>'_creationTime')::BIGINT / 1000)
  FROM jsonb_array_elements(data->'users') AS value;
  
  GET DIAGNOSTICS record_count = ROW_COUNT;
  
  RETURN format('Successfully imported %s records', record_count);
END;
$$ LANGUAGE plpgsql;
```

## Risk Mitigation

### Data Integrity
- Implement comprehensive data validation
- Create rollback procedures for each migration step
- Maintain parallel systems during transition period

### Downtime Minimization
- Use blue-green deployment strategy
- Implement real-time data synchronization
- Plan migration during low-traffic periods

### Testing Strategy
- Create comprehensive test suite for all financial operations
- Perform load testing with production-like data
- Validate all calculations and business logic

## Timeline and Milestones

### Week 1-2: Infrastructure
- [ ] Supabase project setup
- [ ] Schema design and review
- [ ] Security configuration

### Week 3-4: Data Migration
- [ ] Data export from Convex
- [ ] Schema creation in Supabase
- [ ] Data import and validation

### Week 5-8: Application Migration
- [ ] API layer replacement
- [ ] Real-time features migration
- [ ] Authentication system migration

### Week 9-12: Advanced Features
- [ ] Financial integrations
- [ ] Compliance features
- [ ] Performance optimization

## Success Metrics

- Zero data loss during migration
- <1 second response time for financial queries
- 99.9% uptime during transition
- All financial calculations match exactly
- Successful integration with external financial APIs

## Rollback Plan

1. **Immediate Rollback**: Switch DNS back to Convex-based system
2. **Data Rollback**: Restore from pre-migration Convex backup
3. **Gradual Rollback**: Migrate critical functions back to Convex
4. **Full Rollback**: Complete system restoration with data sync

## Post-Migration Benefits

- Enhanced financial reporting capabilities
- Better compliance with financial regulations
- Improved scalability for large transaction volumes
- Advanced security features for sensitive financial data
- Better integration with external financial systems
- Comprehensive audit trails for all financial operations

## Conclusion

This migration strategy provides a comprehensive roadmap for transitioning from Convex to Supabase while maintaining system reliability and data integrity. The phased approach minimizes risk while maximizing the benefits of the new platform.
