import { useState, useRef, useEffect } from 'react';

export default function ClintBusinessAssistant() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Good morning, Clint! I\'m your business assistant. I can help you manage customer data, fill out forms, generate reports, and handle daily tasks. What would you like to work on today?',
      timestamp: new Date()
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const businessStats = {
    monthlyPolicies: 47,
    monthlyRevenue: '$23,500',
    activeClients: 342,
    pendingQuotes: 12
  };

  const quickActions = [
    'Generate Auto Insurance Form',
    'Find Customer Info',
    'Create Weekly Report',
    'Schedule Follow-up',
    'Process New Lead',
    'Upload Documents'
  ];

  const recentCustomers = [
    { name: 'John Smith', policy: 'Auto + Home', status: 'Active' },
    { name: 'Sarah Johnson', policy: 'Auto', status: 'Quote Pending' },
    { name: 'Mike Davis', policy: 'Commercial', status: 'Active' },
    { name: 'Lisa Wilson', policy: 'Home', status: 'Renewal Due' }
  ];

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1500,
          messages: [
            { 
              role: "user", 
              content: `You are Clint's personal business assistant for AIP Best Rate Insurance in Shreveport, Louisiana.

BUSINESS CONTEXT:
- Company: AIP Best Rate Insurance Brokerage
- Owner: Clint Johnson
- Location: Shreveport, Louisiana
- Monthly Policies: ${businessStats.monthlyPolicies}
- Monthly Revenue: ${businessStats.monthlyRevenue}
- Active Clients: ${businessStats.activeClients}

RECENT CUSTOMERS:
${recentCustomers.map(c => `- ${c.name}: ${c.policy} (${c.status})`).join('\n')}

CAPABILITIES:
- Help find customer information quickly
- Generate and fill out insurance forms automatically  
- Create business reports and analytics
- Manage daily tasks and follow-ups
- Process new leads and applications
- Organize and search business documents

Respond as Clint's knowledgeable business assistant who understands insurance operations and can help with practical daily tasks.` 
            },
            ...messages.slice(1).map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            { role: "user", content: inputMessage }
          ]
        })
      });

      const data = await response.json();
      
      if (data.content && data.content[0]) {
        const assistantMessage = {
          role: 'assistant',
          content: data.content[0].text,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error('Invalid response format');
      }

    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I encountered a technical issue. Please try again, or if this persists, let me know and I\'ll help troubleshoot.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', padding: '20px 0', boxShadow: '0 2px 20px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ 
              width: '50px', 
              height: '50px', 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
              borderRadius: '12px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: '24px',
              color: 'white',
              fontWeight: 'bold'
            }}>
              AIP
            </div>
            <div>
              <h1 style={{ margin: '0', fontSize: '24px', color: '#1f2937', fontWeight: '700' }}>Business Assistant</h1>
              <p style={{ margin: '0', color: '#6b7280', fontSize: '14px' }}>AIP Best Rate • Shreveport, LA</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ textAlign: 'center', padding: '10px' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937' }}>{businessStats.monthlyPolicies}</div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>This Month</div>
            </div>
            <div style={{ textAlign: 'center', padding: '10px' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#059669' }}>{businessStats.monthlyRevenue}</div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Revenue</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '30px 20px', display: 'grid', gridTemplateColumns: '350px 1fr 300px', gap: '30px' }}>
        
        {/* Left Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ 
            background: 'white', 
            borderRadius: '16px', 
            padding: '20px', 
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>Quick Actions</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => setInputMessage(action)}
                  style={{ 
                    padding: '15px 12px',
                    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    textAlign: 'center',
                    fontSize: '11px',
                    fontWeight: '500',
                    color: '#374151'
                  }}
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div style={{ 
          background: 'white', 
          borderRadius: '16px', 
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          
          {/* Chat Header */}
          <div style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
            color: 'white', 
            padding: '20px'
          }}>
            <h2 style={{ margin: '0', fontSize: '20px', fontWeight: '600' }}>AI Business Assistant</h2>
            <p style={{ margin: '5px 0 0 0', fontSize: '14px', opacity: 0.9 }}>
              Ready to help with forms, customer data, and daily tasks
            </p>
          </div>

          {/* Messages */}
          <div style={{ 
            flex: 1,
            height: '500px',
            overflowY: 'auto', 
            padding: '25px',
            background: '#fafbfc'
          }}>
            {messages.map((message, index) => (
              <div
                key={index}
                style={{ 
                  marginBottom: '20px',
                  display: 'flex',
                  justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div style={{ 
                  maxWidth: '75%',
                  padding: '16px 20px',
                  borderRadius: '16px',
                  background: message.role === 'user' ? '#667eea' : 'white',
                  color: message.role === 'user' ? 'white' : '#374151',
                  boxShadow: message.role === 'assistant' ? '0 2px 10px rgba(0,0,0,0.1)' : 'none',
                  fontSize: '14px',
                  lineHeight: '1.5'
                }}>
                  <div style={{ whiteSpace: 'pre-wrap' }}>{message.content}</div>
                  <div style={{ 
                    fontSize: '11px', 
                    marginTop: '8px',
                    opacity: 0.7
                  }}>
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '20px' }}>
                <div style={{ 
                  padding: '16px 20px',
                  borderRadius: '16px',
                  background: 'white',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}>
                  <div>AI is thinking...</div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={{ padding: '20px', borderTop: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me to generate forms, find customer info, create reports, or help with daily tasks..."
                style={{ 
                  flex: 1,
                  padding: '12px 16px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  resize: 'none',
                  outline: 'none',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  minHeight: '20px'
                }}
                rows={1}
                disabled={isLoading}
              />
              
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                style={{ 
                  padding: '12px 24px',
                  background: isLoading ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                {isLoading ? 'Processing...' : 'Send'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ 
            background: 'white', 
            borderRadius: '16px', 
            padding: '20px', 
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>Recent Customers</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentCustomers.map((customer, index) => (
                <div key={index} style={{ 
                  padding: '12px',
                  background: '#fafbfc',
                  borderRadius: '8px',
                  border: '1px solid #f1f5f9'
                }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>
                    {customer.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                    {customer.policy}
                  </div>
                  <div style={{ 
                    fontSize: '11px', 
                    color: customer.status === 'Active' ? '#059669' : customer.status === 'Quote Pending' ? '#f59e0b' : '#dc2626',
                    fontWeight: '500'
                  }}>
                    {customer.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
