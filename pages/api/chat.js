import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const userMessage = req.body.messages?.[1]?.content || req.body.message || "";
    const lowerMessage = userMessage.toLowerCase();
    
    let context = "";
    let customerData = [];
    
    // Check if user is asking about customers
    if (lowerMessage.includes('find') || lowerMessage.includes('search') || lowerMessage.includes('lookup') || lowerMessage.includes('customer')) {
      // Extract potential customer name
      const words = userMessage.split(' ');
      let searchTerm = '';
      
      for (let i = 0; i < words.length; i++) {
        if (['find', 'search', 'lookup'].includes(words[i].toLowerCase()) && words[i + 1]) {
          searchTerm = words.slice(i + 1).join(' ').replace(/[^\w\s]/gi, '');
          break;
        }
      }
      
      if (!searchTerm && lowerMessage.includes('customer')) {
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
            .limit(10);
          
          if (!error && customers && customers.length > 0) {
            customerData = customers;
            context = `CUSTOMER DATABASE SEARCH RESULTS for "${searchTerm}":\n${customers.map(c => 
              `- ${c.name}: Policy ${c.policy_number}, ${c.coverage_type}, $${c.premium}, Status: ${c.status}, Phone: ${c.phone}, Email: ${c.email}`
            ).join('\n')}\n\n`;
          }
        } catch (dbError) {
          console.error('Database error:', dbError);
        }
      }
    }
    
    // Check if user wants a report
    if (lowerMessage.includes('report') || lowerMessage.includes('summary') || lowerMessage.includes('analysis')) {
      try {
        const { data: allCustomers, error } = await supabase
          .from('customers')
          .select('*');
        
        if (!error && allCustomers) {
          const totalCustomers = allCustomers.length;
          const activeCustomers = allCustomers.filter(c => c.status === 'Active').length;
          const totalPremiums = allCustomers.reduce((sum, c) => sum + (parseFloat(c.premium) || 0), 0);
          
          const coverageTypes = {};
          allCustomers.forEach(c => {
            if (c.coverage_type) {
              coverageTypes[c.coverage_type] = (coverageTypes[c.coverage_type] || 0) + 1;
            }
          });
          
          context = `BUSINESS ANALYTICS DATA:
Total Customers: ${totalCustomers}
Active Policies: ${activeCustomers}
Total Premium Revenue: $${totalPremiums.toLocaleString()}
Average Premium: $${totalCustomers > 0 ? (totalPremiums / totalCustomers).toFixed(2) : 0}
Coverage Breakdown: ${Object.entries(coverageTypes).map(([type, count]) => `${type}: ${count}`).join(', ')}

`;
        }
      } catch (dbError) {
        console.error('Database error:', dbError);
      }
    }
    
    // Call OpenAI with context
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are Clint's professional AI assistant for AIP Best Rate Insurance company. You help with customer management, policy information, form generation, and business operations.

${context ? `RELEVANT DATA FROM DATABASE:\n${context}` : ''}

INSTRUCTIONS:
- Always be professional and helpful
- Use the database information provided to give accurate responses
- For customer searches, present the information clearly
- For form generation, use customer data when available
- For reports, use the analytics data provided
- If no relevant data is found, acknowledge it and offer alternative assistance
- Keep responses concise but informative`
          },
          {
            role: 'user',
            content: userMessage
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.status}`);
    }

    const openaiData = await openaiResponse.json();
    const aiResponse = openaiData.choices[0].message.content;

    return res.status(200).json({
      choices: [{
        message: {
          content: aiResponse
        }
      }]
    });

  } catch (error) {
    console.error('API error:', error);
    
    // Fallback response if AI fails
    const fallbackResponse = `I'm having a technical issue right now, but I'm still here to help! 

I can assist you with:
• Customer searches: "Find customer John Smith"
• Form generation: "Generate auto insurance form for Jane Doe" 
• Business reports: "Generate daily business report"
• Policy management and general insurance questions

Please try your request again, or let me know how else I can help with AIP Best Rate Insurance operations.`;

    return res.status(200).json({
      choices: [{
        message: {
          content: fallbackResponse
        }
      }]
    });
  }
}
