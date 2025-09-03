# Database Setup Instructions

## Overview
This guide will help you set up the franchise database with AED 10 per share pricing and industry/category data.

## What This Setup Does

### 🗑️ **Clears All Existing Data**
- Deletes all users, businesses, franchises, invoices, shares, deals, team data
- Removes existing industries and categories
- **⚠️ WARNING: This is irreversible!**

### 🏗️ **Creates Fresh Data Structure**
- **10 Franchise Industries**: Food & Beverage, Retail, Health & Fitness, Education & Training, Business Services, Personal Services, Home Services, Automotive, Technology, Real Estate
- **65+ Franchise Categories**: Organized by industry (Fast Food, Coffee & Tea, Gym & Fitness, etc.)
- **AED Currency**: All pricing in AED with 10 AED per share
- **Clean Database**: Ready for franchise businesses

## Setup Methods

### Method 1: Admin Web Interface (Recommended)
1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the admin setup page:
   ```
   http://localhost:3000/admin/setup
   ```

3. Click "Clear & Setup Database" button
4. Confirm the warning dialog
5. Wait for completion message

### Method 2: Direct Convex Function Call
1. Open Convex dashboard
2. Go to Functions tab
3. Find `setup:setupFranchiseDatabase`
4. Click "Run" with empty arguments `{}`
5. Check the logs for completion

## After Setup

### ✅ **What You'll Have**
- Clean database with only industries and categories
- 10 franchise industries with proper slugs
- 65+ franchise categories organized by industry
- AED 10 per share pricing structure
- Ready for business registration

### 🚀 **Next Steps**
1. **Create Business Account**: Register a business with industry/category selection
2. **Set Cost Per Area**: Configure AED cost per sq ft for the business
3. **Create Franchise**: Use the CreateFranchiseModal to create franchise locations
4. **Test Investment Flow**: Test the complete franchise investment process

## Database Schema

### Industries Table
```typescript
{
  _id: Id<"industries">,
  name: string,        // "Food & Beverage"
  slug: string,        // "food-beverage"
}
```

### Categories Table
```typescript
{
  _id: Id<"categories">,
  name: string,           // "Fast Food"
  industry_id: Id<"industries">,
  slug: string,           // "fast-food"
}
```

## Sample Data

### Industries (10 total)
- Food & Beverage (`food-beverage`)
- Retail (`retail`)
- Health & Fitness (`health-fitness`)
- Education & Training (`education-training`)
- Business Services (`business-services`)
- Personal Services (`personal-services`)
- Home Services (`home-services`)
- Automotive (`automotive`)
- Technology (`technology`)
- Real Estate (`real-estate`)

### Categories (65+ total)
**Food & Beverage**: Fast Food, Coffee & Tea, Pizza, Ice Cream & Desserts, Healthy Food, Bakery, Casual Dining

**Retail**: Clothing & Apparel, Electronics, Convenience Store, Specialty Retail, Mobile & Accessories, Beauty & Cosmetics

**Health & Fitness**: Gym & Fitness, Yoga & Wellness, Medical Services, Dental Care, Spa & Massage

**Education & Training**: Tutoring, Language Learning, Computer Training, Early Childhood, Test Preparation

**Business Services**: Accounting & Tax, Marketing & Advertising, Printing & Shipping, Consulting, Legal Services

**Personal Services**: Hair & Beauty, Dry Cleaning, Pet Services, Photography, Travel Services

**Home Services**: Cleaning Services, Landscaping, Home Repair, Security Systems, Pest Control

**Automotive**: Car Wash, Auto Repair, Oil Change, Car Rental, Auto Parts

**Technology**: IT Support, Software Development, Digital Marketing, Web Design, Mobile Apps

**Real Estate**: Property Management, Real Estate Agency, Home Inspection, Mortgage Services, Commercial Real Estate

## Verification

After setup, verify the data:

```javascript
// Check industries count
const industries = await ctx.db.query("industries").collect();
console.log(`Industries: ${industries.length}`); // Should be 10

// Check categories count
const categories = await ctx.db.query("categories").collect();
console.log(`Categories: ${categories.length}`); // Should be 65+

// Check other tables are empty
const businesses = await ctx.db.query("businesses").collect();
console.log(`Businesses: ${businesses.length}`); // Should be 0
```

## Troubleshooting

### Setup Fails
- Check Convex connection
- Verify schema is deployed
- Check browser console for errors

### Missing Data
- Re-run the setup function
- Check Convex logs for errors
- Verify all tables were cleared properly

### Schema Errors
- Redeploy Convex schema: `npx convex dev`
- Check for schema validation errors

## Important Notes

- **AED Currency**: All monetary values are in AED (UAE Dirham)
- **Share Price**: Fixed at AED 10 per share
- **Data Loss**: Setup clears ALL existing data
- **Production**: Never run this on production data
- **Backup**: Always backup before running setup

## Support

If you encounter issues:
1. Check the browser console for errors
2. Review Convex function logs
3. Verify schema deployment
4. Ensure proper permissions
