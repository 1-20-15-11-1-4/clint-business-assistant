import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  https://zjytyosnyqctbgrukorx.supabase.co,
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqeXR5b3NueXFjdGJncnVrb3J4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4NzExMTYsImV4cCI6MjA3MDQ0NzExNn0.pKNHmyS23TFuqvbwkLZIClsIZ1RX5nRrAPB-SrvNuJs
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const userMessage = req.body.messages?.[1]?.content || req.body.message || "";
    const lowerMessage = userMessage.toLowerCase();
    
    let response = "";
    
    // Customer lookup functionality
    if (lowerMessage.includes('find') || lowerMessage.includes('search') || lowerMessage.includes('lookup') || lowerMessage.includes('customer')) {
      // Extract potential customer name
      const words = userMessage.split(' ');
      let searchTerm = '';
      
      // Look for names after "find", "search", "lookup"
      for (let i = 0; i < words.length; i++) {
        if (['find', 'search', 'lookup'].includes(words[i].toLowerCase()) && words[i + 1]) {
          searchTerm = words.slice(i + 1).join(' ').replace(/[^\w\s]/gi, '');
          break;
        }
      }
      
      if (!searchTerm && lowerMessage.includes('customer')) {
        // Try to extract any name-like words
        searchTerm = words.find(word => 
          word.length > 2 && 
          word[0] === word[0].toUpperCase() && 
          !['find', 'search', 'lookup', 'customer'].includes(word.toLowerCase())
        ) || '';
      }
      
      if (searchTerm) {
        try {
          const { data: customers, error } = await supabase
            .from('customers')
            .select('*')
            .ilike('name', `%${searchTerm}%`)
            .limit(5);
          
          if (error) throw error;
          
          if (customers && customers.length > 0) {
            response = `Found ${customers.length} customer(s) matching "${searchTerm}":\n\n`;
            customers.forEach((customer, index) => {
              response += `**${index + 1}. ${customer.name}**\n`;
              response += `• Policy #: ${customer.policy_number || 'N/A'}\n`;
              response += `• Phone: ${customer.phone || 'N/A'}\n`;
              response += `• Email: ${customer.email || 'N/A'}\n`;
              response += `• Coverage: ${customer.coverage_type || 'N/A'}\n`;
              response += `• Premium: $${customer.premium || 'N/A'}\n`;
              response += `• Status: ${customer.status || 'N/A'}\n`;
              if (customer.notes) response += `• Notes: ${customer.notes}\n`;
              response += '\n';
            });
          } else {
            response = `No customers found matching "${searchTerm}". Please check the spelling or try a different search term.`;
          }
        } catch (dbError) {
          console.error('Database error:', dbError);
          response = "I'm having trouble accessing the customer database right now. Please try again in a moment.";
        }
      } else {
        response = "Please specify a customer name to search for. For example: 'Find customer John Smith' or 'Search for Jane'.";
      }
    }
    
    // Form generation with customer data
    else if (lowerMessage.includes('form') || lowerMessage.includes('application')) {
      const isAuto = lowerMessage.includes('auto') || lowerMessage.includes('car') || lowerMessage.includes('vehicle');
      
      // Check if customer name is mentioned
      const words = userMessage.split(' ');
      let customerName = '';
      for (let i = 0; i < words.length; i++) {
        if (words[i].length > 2 && words[i][0] === words[i][0].toUpperCase()) {
          customerName = words[i];
          if (words[i + 1] && words[i + 1][0] === words[i + 1][0].toUpperCase()) {
            customerName += ' ' + words[i + 1];
          }
          break;
        }
      }
      
      if (customerName) {
        try {
          const { data: customers, error } = await supabase
            .from('customers')
            .select('*')
            .ilike('name', `%${customerName}%`)
            .limit(1);
          
          if (customers && customers.length > 0) {
            const customer = customers[0];
            response = isAuto ? 
              `**AUTO INSURANCE APPLICATION FORM**\n\nCustomer Information:\n• Name: ${customer.name}\n• Phone: ${customer.phone || '___________'}\n• Email: ${customer.email || '___________'}\n• Address: ${customer.address || '___________'}\n\nVehicle Information:\n• Year/Make/Model: ___________\n• VIN: ___________\n• Current Mileage: ___________\n\nCoverage Options:\n☐ Liability Coverage\n☐ Collision Coverage\n☐ Comprehensive Coverage\n☐ Uninsured Motorist Protection\n\nForm pre-filled with customer data from our records.` :
              `**INSURANCE APPLICATION FORM**\n\nCustomer Information:\n• Name: ${customer.name}\n• Phone: ${customer.phone || '___________'}\n• Email: ${customer.email || '___________'}\n• Address: ${customer.address || '___________'}\n• Current Policy: ${customer.policy_number || 'New Customer'}\n\nForm ready for completion.`;
          } else {
            response = `Customer "${customerName}" not found in database. Would you like me to create a blank form or search for a different customer?`;
          }
        } catch (dbError) {
          response = "I'm having trouble accessing customer data. I'll create a blank form instead.\n\n" + 
            (isAuto ? "**AUTO INSURANCE APPLICATION FORM**\n\nCustomer Information:\n• Name: ___________\n• Date of Birth: ___________\n• Driver's License #: ___________" : "**INSURANCE APPLICATION FORM**\n\nCustomer Information:\n• Name: ___________\n• Phone: ___________\n• Email: ___________");
        }
      } else {
        response = isAuto ? 
          "**AUTO INSURANCE APPLICATION FORM**\n\nCustomer Information:\n• Name: ___________\n• Date of Birth: ___________\n• Driver's License #: ___________\n• Phone: ___________\n• Email: ___________\n\nVehicle Information:\n• Year/Make/Model: ___________\n• VIN: ___________\n• Current Mileage: ___________\n\nTo auto-fill with customer data, specify a name like 'Generate auto form for John Smith'." :
          "I can help generate various insurance forms. Specify the type and customer name for auto-completion, like 'Generate auto insurance form for John Smith'.";
      }
    }
    
    // Report generation with real data
    else if (lowerMessage.includes('report') || lowerMessage.includes('summary') || lowerMessage.includes('analysis')) {
      try {
        const { data: customers, error } = await supabase
          .from('customers')
          .select('*');
        
        if (error) throw error;
        
        const totalCustomers = customers.length;
        const activeCustomers = customers.filter(c => c.status === 'Active').length;
        const totalPremiums = customers.reduce((sum, c) => sum + (parseFloat(c.premium) || 0), 0);
        const avgPremium = totalCustomers > 0 ? (totalPremiums / totalCustomers).toFixed(2) : 0;
        
        const coverageTypes = {};
        customers.forEach(c => {
          if (c.coverage_type) {
            coverageTypes[c.coverage_type] = (coverageTypes[c.coverage_type] || 0) + 1;
          }
        });
        
        response = `**AIP BEST RATE - BUSINESS REPORT**\nGenerated: ${new Date().toLocaleDateString()}\n\n**CUSTOMER OVERVIEW:**\n• Total Customers: ${totalCustomers}\n• Active Policies: ${activeCustomers}\n• Total Premium Revenue: $${totalPremiums.toLocaleString()}\n• Average Premium: $${avgPremium}\n\n**COVERAGE BREAKDOWN:**\n${Object.entries(coverageTypes).map(([type, count]) => `• ${type}: ${count} policies`).join('\n')}\n\n**RECOMMENDATIONS:**\n• Review inactive policies for potential reactivation\n• Focus on customer retention programs\n• Consider premium adjustments based on market analysis`;
      } catch (dbError) {
        response = "I'm having trouble generating the report from our database. Please ensure customer data is properly uploaded and try again.";
      }
    }
    
    // Default response
    else {
      response = `Hello! I'm Clint's AI assistant for AIP Best Rate Insurance. I can help you with:

**CUSTOMER MANAGEMENT:**
• Search customers: "Find customer John Smith"
• Generate reports: "Generate business report"
• Create forms: "Generate auto insurance form for Jane Doe"

**CURRENT CAPABILITIES:**
• Real-time customer database search
• Automated form generation with customer data
• Business analytics and reporting
• Policy management assistance

What would you like me to help you with today?`;
    }

    return res.status(200).json({
      choices: [{
        message: {
          content: response
        }
      }]
    });

  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ 
      error: 'Server error',
      message: error.message
    });
  }
}
