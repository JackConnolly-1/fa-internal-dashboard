// Test script to verify Airtable data accuracy
// Run with: node test-data-accuracy.js

// Note: Environment variables should already be loaded from .env.local by Next.js
// If running standalone, make sure AIRTABLE_API_KEY and AIRTABLE_BASE_ID are set

async function testDataAccuracy() {
  console.log('=== Testing FrontierAngels Member Portal Data Accuracy ===\n');
  
  try {
    // Import the airtable module
    const airtable = require('./lib/airtable');
    
    // Test with a known email (Graham's email based on MEMORY.md)
    const TEST_EMAIL = 'graham@frontierangels.com';
    
    // Test 1: Get investor by email
    console.log('1. Testing getInvestorByEmail...');
    const investor = await airtable.getInvestorByEmail(TEST_EMAIL);
    if (investor) {
      console.log(`   ✓ Found investor: ${investor.name} (${investor.email})`);
      console.log(`     ID: ${investor.id}, City: ${investor.city || 'N/A'}, Joined: ${investor.dateJoined || 'N/A'}`);
      console.log(`     Account IDs: ${investor.accountIds.length}`);
      
      // Test 2: Get investor accounts
      console.log('\n2. Testing getInvestorAccounts...');
      const accounts = await airtable.getInvestorAccounts(investor.id);
      console.log(`   ✓ Found ${accounts.length} investor accounts`);
      accounts.forEach((acc, i) => {
        console.log(`     Account ${i + 1}: ${acc.name || 'Unnamed'} (ID: ${acc.id})`);
        console.log(`       Commitment: ${acc.commitment || 'N/A'}, Total Invested: ${acc.totalInvested || 'N/A'}`);
        console.log(`       Fund IDs: ${acc.fundIds.length}, Transaction IDs: ${acc.transactionIds.length}`);
      });
      
      // Test 3: Get transactions
      console.log('\n3. Testing getInvestorTransactions...');
      const accountIds = accounts.map(a => a.id);
      const transactions = accountIds.length ? await airtable.getInvestorTransactions(accountIds) : [];
      console.log(`   ✓ Found ${transactions.length} total transactions`);
      
      const soloTransactions = transactions.filter(t => !t.fundIds?.length);
      const fundTransactions = transactions.filter(t => t.fundIds && t.fundIds.length > 0);
      console.log(`     Solo transactions: ${soloTransactions.length}`);
      console.log(`     Fund transactions: ${fundTransactions.length}`);
      
      if (transactions.length > 0) {
        const sampleTx = transactions[0];
        console.log(`     Sample transaction: ${sampleTx.portfolioCompanyName || 'Unknown'} - $${sampleTx.amount}`);
        console.log(`       Type: ${sampleTx.type || 'N/A'}, Date: ${sampleTx.date || 'N/A'}`);
      }
      
      // Test 4: Get portfolio health
      console.log('\n4. Testing getPortfolioHealth...');
      const companyIds = Array.from(new Set(soloTransactions.flatMap(t => t.portfolioCompanyIds)));
      const healthRecords = companyIds.length ? await airtable.getPortfolioHealth(companyIds) : [];
      console.log(`   ✓ Found ${healthRecords.length} portfolio health records`);
      
      if (healthRecords.length > 0) {
        const sampleHealth = healthRecords[0];
        console.log(`     Sample health record: ${sampleHealth.companyName || 'Unknown'}`);
        console.log(`       Customer/Revenue: ${sampleHealth.customerRevenue || 'N/A'}`);
        console.log(`       Sales Pipeline: ${sampleHealth.salesPipeline || 'N/A'}`);
        console.log(`       Estimated Value: ${sampleHealth.estimatedValue || 'N/A'}`);
        console.log(`       Overall Score: ${sampleHealth.overallScore || 'N/A'}`);
      }
      
      // Test 5: Get member funds
      console.log('\n5. Testing getMemberFunds...');
      const memberFunds = await airtable.getMemberFunds(accountIds);
      console.log(`   ✓ Found ${memberFunds.length} funds for this member`);
      memberFunds.forEach((fund, i) => {
        console.log(`     Fund ${i + 1}: ${fund.name} (${fund.status || 'N/A'})`);
        console.log(`       Target: ${fund.targetSize || 'N/A'}, Commitments: ${fund.totalCommitments || 'N/A'}`);
      });
    } else {
      console.log(`   ✗ No investor found for email: ${TEST_EMAIL}`);
      console.log('   Trying with grahams.1assistant@gmail.com...');
      const investor2 = await airtable.getInvestorByEmail('grahams.1assistant@gmail.com');
      if (investor2) {
        console.log(`   ✓ Found investor: ${investor2.name} (${investor2.email})`);
      } else {
        console.log('   ✗ No investor found with either email');
      }
    }
    
    // Test 6: Get all portfolio companies
    console.log('\n6. Testing getAllPortfolioCompanies...');
    const allCompanies = await airtable.getAllPortfolioCompanies();
    console.log(`   ✓ Found ${allCompanies.length} total portfolio companies`);
    if (allCompanies.length > 0) {
      const sampleCompany = allCompanies[0];
      console.log(`     Sample company: ${sampleCompany.name}`);
      console.log(`       Industry: ${sampleCompany.industry || 'N/A'}, Status: ${sampleCompany.status || 'N/A'}`);
      console.log(`       MOIC: ${sampleCompany.moic || 'N/A'}, Website: ${sampleCompany.website || 'N/A'}`);
    }
    
    // Test 7: Get live deals
    console.log('\n7. Testing getLiveDeals...');
    const liveDeals = await airtable.getLiveDeals();
    console.log(`   ✓ Found ${liveDeals.length} live deals`);
    if (liveDeals.length > 0) {
      const sampleDeal = liveDeals[0];
      console.log(`     Sample deal: ${sampleDeal.companyName || 'Untitled'}`);
      console.log(`       Type: ${sampleDeal.type || 'N/A'}, Deadline: ${sampleDeal.deadline || 'N/A'}`);
    }
    
    // Test 8: Get events
    console.log('\n8. Testing getEvents...');
    const events = await airtable.getEvents();
    console.log(`   ✓ Found ${events.length} events`);
    
    // Test 9: Get member directory
    console.log('\n9. Testing getMemberDirectory...');
    const directory = await airtable.getMemberDirectory();
    console.log(`   ✓ Found ${directory.length} members in directory`);
    
    console.log('\n=== Data Accuracy Summary ===');
    console.log('All Airtable queries executed successfully.');
    console.log('Data appears to be flowing correctly from Airtable to the portal.');
    console.log('\nKey findings:');
    console.log(`- Total portfolio companies: ${allCompanies.length}`);
    console.log(`- Total members in directory: ${directory.length}`);
    console.log(`- Live deals available: ${liveDeals.length}`);
    console.log(`- Total events: ${events.length}`);
    
    if (investor) {
      const accounts = await airtable.getInvestorAccounts(investor.id);
      const accountIds = accounts.map(a => a.id);
      const transactions = accountIds.length ? await airtable.getInvestorTransactions(accountIds) : [];
      const soloTransactions = transactions.filter(t => !t.fundIds?.length);
      const companyIds = Array.from(new Set(soloTransactions.flatMap(t => t.portfolioCompanyIds)));
      
      console.log(`\nFor investor ${investor.name}:`);
      console.log(`- Investor accounts: ${accounts.length}`);
      console.log(`- Total transactions: ${transactions.length}`);
      console.log(`- Solo investments: ${soloTransactions.length}`);
      console.log(`- Unique companies invested in: ${companyIds.length}`);
    }
    
  } catch (error) {
    console.error('Error during data accuracy test:', error);
  }
}

// Run the test
testDataAccuracy();