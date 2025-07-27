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
  const [businessFiles, setBusinessFiles] = useState([
    { id: 1, name: 'Q3_Sales_Report.pdf', type: 'report', size: '245 KB', date: '2025-07-20' },
    { id: 2, name: 'Customer_Database.xlsx', type: 'database', size: '1.2 MB', date: '2025-07-19' },
    { id: 3, name: 'Insurance_Forms_Template.pdf', type: 'template', size: '890 KB', date: '2025-07-18' }
  ]);
  const [generatedForms, setGeneratedForms] = useState([]);
  const [todaysTasks, setTodaysTasks] = useState([
    { id: 1, task: 'Follow up with Johnson family - auto quote', priority: 'high', completed: false },
    { id: 2, task: 'Process Smith homeowners application', priority: 'medium', completed: false },
    { id: 3, task: 'Review Q3 sales numbers', priority: 'low', completed: true }
  ]);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const businessStats = {
    monthlyPolicies: 47,
    monthlyRevenue: '$23,500',
    activeClients: 342,
    pendingQuotes: 12,
    thisWeekAppointments: 8
  };

  const quickActions = [
    { id: 1, title: 'Generate Auto Insurance Form', icon: '🚗', action: 'generate_auto_form' },
    { id: 2, title: 'Find Customer Info', icon: '👤', action: 'find_customer' },
    { id: 3, title: 'Create Weekly Report', icon: '📊', action: 'weekly_report' },
    { id: 4, title: 'Schedule Follow-up', icon: '📅', action: 'schedule_followup' },
    { id: 5, title: 'Process New Lead', icon: '⭐', action: 'process_lead' },
    { id: 6, title: 'Upload Documents', icon: '📁', action: 'upload_docs' }
  ];

  const recentCustomers = [
    { name: 'John Smith', policy: 'Auto + Home', lastContact: '2025-07-19', status: 'Active' },
    { name: 'Sarah Johnson', policy: 'Auto', lastContact: '2025-07-18', status: 'Quote Pending' },
    { name: 'Mike Davis', policy: 'Commercial', lastContact: '2025-07-17', status: 'Active' },
    { name: 'Lisa Wilson', policy: 'Home', lastContact: '2025-07-16', status: 'Renewal Due' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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

    // Simple demo responses for now
    setTimeout(() => {
      const responses = [
        "I'd be happy to help with that! Let me pull up the relevant information and get that processed for you right away.",
        "Perfect! I can handle that task efficiently. Based on your request, I'll generate the appropriate documentation and have it ready for download.",
        "Excellent choice! I'll search through your business data and customer information to find exactly what you need.",
        "Great! I can automate that process for you. This will save you significant time on paperwork and administrative tasks."
      ];
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date()
      }]);

      // Auto-generate forms when requested
      if (inputMessage.toLowerCase().includes('form') || inputMessage.toLowerCase().includes('application')) {
        const formType = inputMessage.toLowerCase().includes('auto') ? 'Auto Insurance' : 
                         inputMessage.toLowerCase().includes('home') ? 'Homeowners' : 'Insurance';
        
        const newForm = {
          id: Date.now(),
          name: `${formType} Application - ${new Date().toLocaleDateString()}`,
          type: formType.toLowerCase().replace(' ', '_'),
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString(),
          content: `${formType} Application Form\nGenerated for: AIP Best Rate\nDate: ${new Date().toLocaleDateString()}\nTime: ${new Date().toLocaleTimeString()}\n\nThis form has been automatically filled out and is ready for use.`
        };
        setGeneratedForms(prev => [...prev, newForm]);
      }

      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickAction = (action) => {
    const actionMap = {
      'generate_auto_form': 'Generate a new auto insurance application form for a customer',
      'find_customer': 'Find information for customer John Smith',
      'weekly_report': 'Create this week\'s sales and performance report',
      'schedule_followup': 'Schedule a follow-up with pending quote customers',
      'process_lead': 'Help me process a new insurance lead',
      'upload_docs': 'I need to upload and organize business documents'
    };
    
    setInputMessage(actionMap[action] || action);
  };

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    
    for (const file of files) {
      const newFile = {
        id: Date.now() + Math.random(),
        name: file.name,
        type: file.type.includes('pdf') ? 'document' : file.type.includes('excel') ? 'spreadsheet' : 'file',
        size: `${(file.size / 1024).toFixed(1)} KB`,
        date: new Date().toISOString().split('T')[0]
      };
      setBusinessFiles(prev => [...prev, newFile]);
    }
    
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: `I've successfully uploaded ${files.length} file(s) to your business documents. They're now searchable and I can help you work with the content.`,
      timestamp: new Date()
    }]);
  };

  const downloadForm = (form) => {
    const element = document.createElement('a');
    const file = new Blob([form.content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${form.name.replace(/[^a-z0-9]/gi, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const toggleTask = (taskId) => {
    setTodaysTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
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
          
          {/* Quick Actions */}
          <div style={{ 
            background: 'white', 
            borderRadius: '16px', 
            padding: '20px', 
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>Quick Actions</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => handleQuickAction(action.action)}
                  style={{ 
                    padding: '15px 12px',
                    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textAlign: 'center',
                    fontSize: '11px',
                    fontWeight: '500',
                    color: '#374151'
                  }}
                >
                  <div style={{ fontSize: '20px', marginBottom: '8px' }}>{action.icon}</div>
                  {action.title}
                </button>
              ))}
            </div>
          </div>

          {/* Today's Tasks */}
          <div style={{ 
            background: 'white', 
            borderRadius: '16px', 
            padding: '20px', 
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>Today's Tasks</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {todaysTasks.map((task) => (
                <div key={task.id} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px',
                  padding: '12px',
                  background: task.completed ? '#f0fdf4' : '#fefefe',
                  borderRadius: '8px',
                  border: `1px solid ${task.completed ? '#bbf7d0' : '#f3f4f6'}`
                }}>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      fontSize: '13px', 
                      color: task.completed ? '#6b7280' : '#374151',
                      textDecoration: task.completed ? 'line-through' : 'none'
                    }}>
                      {task.task}
                    </div>
                    <div style={{ 
                      fontSize: '11px', 
                      color: task.priority === 'high' ? '#dc2626' : task.priority === 'medium' ? '#f59e0b' : '#10b981',
                      fontWeight: '500'
                    }}>
                      {task.priority} priority
                    </div>
                  </div>
                </div>
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
            padding: '20px',
            borderBottom: '1px solid rgba(255,255,255,0.2)'
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
                  display: 'flex',
                  gap: '12px',
                  flexDirection: message.role === 'user' ? 'row-reverse' : 'row'
                }}>
                  <div style={{ 
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: message.role === 'user' ? '#667eea' : '#f1f5f9',
                    color: message.role === 'user' ? 'white' : '#374151',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    flexShrink: 0
                  }}>
                    {message.role === 'user' ? '👤' : '🤖'}
                  </div>
                  
                  <div style={{ 
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
              </div>
            ))}
            
            {isLoading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ 
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: '#f1f5f9',
                    color: '#374151',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px'
                  }}>
                    🤖
                  </div>
                  <div style={{ 
                    padding: '16px 20px',
                    borderRadius: '16px',
                    background: 'white',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                  }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#667eea' }}></div>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#667eea' }}></div>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#667eea' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={{ padding: '20px', borderTop: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                multiple
                style={{ display: 'none' }}
              />
              
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{ 
                  padding: '12px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '18px'
                }}
                title="Upload files"
              >
                📎
              </button>
              
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
          
          {/* Recent Customers */}
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

          {/* Business Files */}
          <div style={{ 
            background: 'white', 
            borderRadius: '16px', 
            padding: '20px', 
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>Business Files</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {businessFiles.slice(0, 5).map((file) => (
                <div key={file.id} style={{ 
                  padding: '10px',
                  background: '#fafbfc',
                  borderRadius: '6px',
                  border: '1px solid #f1f5f9'
                }}>
                  <div style={{ fontSize: '13px', fontWeight: '500', color: '#1f2937', marginBottom: '2px' }}>
                    📄 {file.name}
                  </div>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>
                    {file.size} • {file.date}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Generated Forms */}
          {generatedForms.length > 0 && (
            <div style={{ 
              background: 'white', 
              borderRadius: '16px', 
              padding: '20px', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>Generated Forms</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {generatedForms.slice(-3).map((form) => (
                  <div key={form.id} style={{ 
                    padding: '10px',
                    background: '#f0fdf4',
                    borderRadius: '6px',
                    border: '1px solid #bbf7d0'
                  }}>
                    <div style={{ fontSize: '13px', fontWeight: '500', color: '#1f2937', marginBottom: '2px' }}>
                      📋 {form.name}
                    </div>
                    <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '6px' }}>
                      {form.date} • {form.time}
                    </div>
                    <button
                      onClick={() => downloadForm(form)}
                      style={{ 
                        fontSize: '11px',
                        padding: '4px 8px',
                        background: '#059669',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
