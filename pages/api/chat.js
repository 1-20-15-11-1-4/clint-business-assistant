export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Smart Demo Mode - Processing request');
    
    // Get the user's message
    const userMessage = req.body.messages?.[1]?.content || req.body.message || "";
    const lowerMessage = userMessage.toLowerCase();
    
    // Smart response logic
    let response = "";
    
    // Insurance Form Generation
    if (lowerMessage.includes('form') || lowerMessage.includes('application')) {
      if (lowerMessage.includes('auto') || lowerMessage.includes('car') || lowerMessage.includes('vehicle')) {
        response = `I'll help you generate an auto insurance form. Here's what I've prepared:

**AUTO INSURANCE APPLICATION FORM**

Customer Information:
${lowerMessage.includes('john smith') ? '• Name: John Smith' : '• Name: [Customer Name]'}
• Date of Birth: ___________
• Driver's License #: ___________
• Phone: ___________
• Email: ___________

Vehicle Information:
• Year/Make/Model: ___________
• VIN: ___________
• Current Mileage: ___________
• Primary Use: Personal/Business/Commute

Coverage Options:
☐ Liability Coverage
☐ Collision Coverage
☐ Comprehensive Coverage
☐ Uninsured Motorist Protection

Would you like me to customize this form further or generate additional documentation?`;
      } else {
        response = `I can help you generate various insurance forms for AIP Best Rate. What type of form do you need?

Available Forms:
• Auto Insurance Applications
• Homeowner's Insurance Forms
• Life Insurance Applications
• Business Insurance Forms
• Claims Processing Forms
• Policy Amendment Forms

Just let me know which type and any specific customer details, and I'll generate a customized form for you.`;
      }
    }
    
    // Customer Management
    else if (lowerMessage.includes('customer') || lowerMessage.includes('client')) {
      if (lowerMessage.includes('find') || lowerMessage.includes('search') || lowerMessage.includes('lookup')) {
        response = `I'm searching our customer database for you...

**CUSTOMER SEARCH RESULTS**
${lowerMessage.includes('john smith') ? `
Found: John Smith
• Policy #: AIP-2024-JS-001
• Coverage: Auto Insurance (Full Coverage)
• Premium: $1,247/year
• Status: Active - Payments Current
• Last Contact: January 15, 2025
• Agent Notes: Excellent customer, on-time payments
• Phone: (555) 123-4567
• Email: john.smith@email.com

Would you like me to pull up policy details or recent activity?` : `
Please provide more specific search criteria:
• Customer name
• Policy number
• Phone number
• Email address

I can then pull up their complete profile and policy information.`}`;
      } else {
        response = `I can help you manage customer accounts. What would you like to do?

**Customer Management Options:**
• Search customer records
• Update contact information
• Review policy status
• Process payments
• Schedule follow-ups
• Generate customer reports
• Create new customer profiles

What specific customer task can I assist you with?`;
      }
    }
    
    // Reports Generation
    else if (lowerMessage.includes('report') || lowerMessage.includes('analysis') || lowerMessage.includes('summary')) {
      response = `I'll generate a business report for you.

**AIP BEST RATE - BUSINESS REPORT**
Generated: ${new Date().toLocaleDateString()}

**SALES SUMMARY (Current Month)**
• New Policies Written: 47
• Total Premium Revenue: $89,340
• Policy Renewals: 156
• Claims Processed: 23
• Customer Satisfaction: 94%

**TOP PERFORMING AREAS:**
• Auto Insurance: 65% of new business
• Customer Retention Rate: 91%
• Average Policy Value: $1,901

**UPCOMING PRIORITIES:**
• Follow up on 12 pending quotes
• Process 8 policy renewals this week
• Schedule customer satisfaction calls

**RECOMMENDATIONS:**
• Focus on homeowner's insurance cross-sell
• Implement referral bonus program
• Update website quote calculator

Would you like me to generate a more detailed report for any specific area?`;
    }
    
    // Daily Tasks & Scheduling
    else if (lowerMessage.includes('task') || lowerMessage.includes('today') || lowerMessage.includes('schedule')) {
      response = `Here's your daily task overview for AIP Best Rate:

**TODAY'S PRIORITIES (${new Date().toLocaleDateString()})**

**URGENT:**
• Call Sarah Johnson - policy renewal due today
• Process claim for Michael Chen (Auto - Claim #2025-001)
• Send quote follow-up to three pending prospects

**SCHEDULED CALLS:**
• 10:00 AM - New customer consultation
• 2:30 PM - Claims review meeting
• 4:00 PM - Policy renewal discussion

**ADMINISTRATIVE:**
• Update customer contact information (4 accounts)
• Generate monthly commission report
• Review and file new applications

**FOLLOW-UPS:**
• Check on yesterday's quote requests
• Confirm appointments for tomorrow

Would you like me to prioritize these tasks or provide more details on any specific item?`;
    }
    
    // General Business Questions
    else if (lowerMessage.includes('policy') || lowerMessage.includes('coverage') || lowerMessage.includes('premium')) {
      response = `I can help you with policy and coverage questions for AIP Best Rate.

**POLICY MANAGEMENT SERVICES:**
• Review current coverage options
• Calculate premium adjustments
• Process policy changes
• Handle coverage additions/deletions
• Manage deductible updates

**COVERAGE TYPES WE OFFER:**
• Auto Insurance (Liability, Full Coverage)
• Homeowner's/Renter's Insurance
• Life Insurance (Term, Whole Life)
• Business Insurance
• Motorcycle/Recreational Vehicle

**CURRENT PROMOTIONS:**
• Multi-policy discount (15% savings)
• Safe driver rewards program
• First-time customer incentives

What specific policy or coverage question can I help you with today?`;
    }
    
    // Default Professional Response
    else {
      response = `Hello! I'm Clint's AI business assistant for AIP Best Rate Insurance. I'm here to help you with:

**DAILY OPERATIONS:**
• Generate insurance forms and applications
• Look up customer information and policies
• Create business reports and summaries
• Manage daily tasks and scheduling
• Process policy changes and updates

**CUSTOMER SERVICE:**
• Handle policy inquiries
• Process claims information
• Generate quotes and proposals
• Schedule appointments
• Follow up on leads

**BUSINESS ANALYSIS:**
• Sales performance reports
• Customer retention analysis
• Revenue summaries
• Market opportunity identification

How can I assist you with your insurance business today? Just ask me about customers, policies, reports, or any specific task you need help with.`;
    }

    // Return in OpenAI format to match frontend expectations
    return res.status(200).json({
      choices: [{
        message: {
          content: response
        }
      }]
    });

  } catch (error) {
    console.error('Demo mode error:', error);
    return res.status(500).json({ 
      error: 'Server error',
      message: error.message
    });
  }
}
