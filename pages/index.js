import { useState } from 'react';
import Papa from 'papaparse';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Good morning, Clint! Welcome to AIP Best Rate Insurance Management System. How can I assist you with your business operations today?',
      timestamp: new Date()
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  // CSV Upload Functions
  const handleFileUpload = async (file) => {
    if (!file || !file.name.endsWith('.csv')) {
      setUploadStatus('Please upload a CSV file');
      return;
    }

    setIsUploading(true);
    setUploadStatus('Processing CSV file...');

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const customers = results.data.map(row => ({
            name: row.name || row.Name || '',
            email: row.email || row.Email || '',
            phone: row.phone || row.Phone || '',
            address: row.address || row.Address || '',
            policy_number: row.policy_number || row['Policy Number'] || '',
            coverage_type: row.coverage_type || row['Coverage Type'] || '',
            premium: row.premium || row.Premium || null,
            status: row.status || row.Status || 'Active',
            notes: row.notes || row.Notes || ''
          }));

          const { data, error } = await supabase
            .from('customers')
            .insert(customers);

          if (error) {
            throw error;
          }

          setUploadStatus(`Successfully uploaded ${customers.length} customers!`);
          setTimeout(() => setUploadStatus(''), 3000);
        } catch (error) {
          console.error('Upload error:', error);
          setUploadStatus(`Upload failed: ${error.message}`);
        }
        setIsUploading(false);
      },
      error: (error) => {
        console.error('CSV parsing error:', error);
        setUploadStatus('Failed to parse CSV file');
        setIsUploading(false);
      }
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: "You are Clint's professional business assistant for AIP Best Rate insurance company."
            },
            {
              role: "user", 
              content: inputMessage
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      let responseText = '';
      if (data.choices && data.choices[0] && data.choices[0].message) {
        responseText = data.choices[0].message.content;
      } else {
        responseText = 'I apologize, but I encountered an issue. Please try again.';
      }
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: responseText,
        timestamp: new Date()
      }]);

    } catch (error) {
      console.error('Frontend error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I apologize, but I encountered an issue. Please try again.',
        timestamp: new Date()
      }]);
    }
    
    setIsLoading(false);
  };

  const quickActions = [
    { label: 'Generate Auto Insurance Form', action: 'Generate an auto insurance form for a new customer' },
    { label: 'Customer Lookup', action: 'Find customer information for John Smith' },
    { label: 'Daily Business Report', action: 'Generate my daily business report' },
    { label: 'Today\'s Tasks', action: 'Show me my tasks for today' },
    { label: 'Policy Management', action: 'Help me with policy management' },
    { label: 'Claims Processing', action: 'I need help processing a claim' }
  ];

  const handleQuickAction = (action) => {
    setInputMessage(action);
    // Auto-send the message
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc',
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
    }}>
      {/* Professional Header */}
      <div style={{
        backgroundColor: '#1e40af',
        color: 'white',
        padding: '1rem 2rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>AIP Best Rate Insurance</h1>
            <p style={{ margin: '0.25rem 0 0 0', opacity: 0.9, fontSize: '0.9rem' }}>Business Management System</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Agent Portal</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{new Date().toLocaleDateString()}</div>
            </div>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#3b82f6',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold'
            }}>
              C
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem', display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem' }}>
        
        {/* Sidebar with CSV Upload */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}>
          
          {/* CSV Upload Section */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            padding: '1.5rem'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#374151', fontSize: '1.1rem', fontWeight: '600' }}>Customer Data Upload</h3>
            
            <div 
              style={{
                border: '2px dashed #d1d5db',
                borderRadius: '8px',
                padding: '2rem',
                textAlign: 'center',
                backgroundColor: isUploading ? '#f9fafb' : '#fafafa',
                cursor: isUploading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s'
              }}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => !isUploading && document.getElementById('csvFile').click()}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📄</div>
              <div style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                {isUploading ? 'Processing...' : 'Drag & drop CSV file here'}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                or click to browse
              </div>
              <input
                id="csvFile"
                type="file"
                accept=".csv"
                style={{ display: 'none' }}
                onChange={handleFileSelect}
                disabled={isUploading}
              />
            </div>
            
            {uploadStatus && (
              <div style={{
                marginTop: '1rem',
                padding: '0.75rem',
                borderRadius: '6px',
                fontSize: '0.85rem',
                backgroundColor: uploadStatus.includes('Success') ? '#dcfce7' : uploadStatus.includes('failed') ? '#fef2f2' : '#fef3c7',
                color: uploadStatus.includes('Success') ? '#166534' : uploadStatus.includes('failed') ? '#dc2626' : '#d97706',
                border: `1px solid ${uploadStatus.includes('Success') ? '#bbf7d0' : uploadStatus.includes('failed') ? '#fecaca' : '#fed7aa'}`
              }}>
                {uploadStatus}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            padding: '1.5rem'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#374151', fontSize: '1.1rem', fontWeight: '600' }}>Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {quickActions.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(item.action)}
                  style={{
                    padding: '0.75rem',
                    backgroundColor: '#f3f4f6',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '0.85rem',
                    color: '#374151',
                    transition: 'all 0.2s',
                    fontFamily: 'inherit'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#e5e7eb';
                    e.target.style.borderColor = '#1e40af';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = '#f3f4f6';
                    e.target.style.borderColor = '#e5e7eb';
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* System Status */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            padding: '1.5rem'
          }}>
            <div style={{ padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '6px', border: '1px solid #bae6fd' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#0369a1', fontSize: '0.9rem' }}>System Status</h4>
              <div style={{ fontSize: '0.8rem', color: '#0369a1' }}>
                <div>✅ All Systems Operational</div>
                <div>✅ Database Connected</div>
                <div>✅ CSV Upload Ready</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Chat Interface */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          height: '600px'
        }}>
          {/* Chat Header */}
          <div style={{
            padding: '1rem 1.5rem',
            borderBottom: '1px solid #e5e7eb',
            backgroundColor: '#fafafa'
          }}>
            <h2 style={{ margin: 0, color: '#374151', fontSize: '1.1rem', fontWeight: '600' }}>AI Business Assistant</h2>
            <p style={{ margin: '0.25rem 0 0 0', color: '#6b7280', fontSize: '0.85rem' }}>Your intelligent assistant for insurance operations</p>
          </div>

          {/* Messages Area */}
          <div style={{ 
            flex: 1, 
            overflowY: 'auto', 
            padding: '1rem',
            backgroundColor: '#fcfcfc'
          }}>
            {messages.map((message, index) => (
              <div key={index} style={{ 
                marginBottom: '1.5rem',
                display: 'flex',
                flexDirection: message.role === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-start',
                gap: '0.75rem'
              }}>
                {/* Avatar */}
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: message.role === 'user' ? '#1e40af' : '#059669',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  flexShrink: 0
                }}>
                  {message.role === 'user' ? 'C' : 'AI'}
                </div>
                
                {/* Message Bubble */}
                <div style={{
                  maxWidth: '70%',
                  padding: '1rem',
                  borderRadius: '12px',
                  backgroundColor: message.role === 'user' ? '#1e40af' : 'white',
                  color: message.role === 'user' ? 'white' : '#374151',
                  border: message.role === 'assistant' ? '1px solid #e5e7eb' : 'none',
                  boxShadow: message.role === 'assistant' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
                }}>
                  <div style={{ 
                    whiteSpace: 'pre-wrap',
                    lineHeight: '1.5',
                    fontSize: '0.9rem'
                  }}>
                    {message.content}
                  </div>
                  <div style={{
                    marginTop: '0.5rem',
                    fontSize: '0.7rem',
                    opacity: 0.7
                  }}>
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem',
                marginBottom: '1rem'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#059669',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}>
                  AI
                </div>
                <div style={{
                  padding: '1rem',
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  color: '#6b7280',
                  fontSize: '0.9rem'
                }}>
                  Processing your request...
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid #e5e7eb',
            backgroundColor: 'white'
          }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message here... (e.g., 'Find customer John Smith', 'Generate auto insurance form')"
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  outline: 'none',
                  fontFamily: 'inherit',
                  backgroundColor: '#fafafa'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#1e40af';
                  e.target.style.backgroundColor = 'white';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.backgroundColor = '#fafafa';
                }}
              />
              <button 
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: !inputMessage.trim() || isLoading ? '#9ca3af' : '#1e40af',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: !inputMessage.trim() || isLoading ? 'not-allowed' : 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  fontFamily: 'inherit',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => {
                  if (!(!inputMessage.trim() || isLoading)) {
                    e.target.style.backgroundColor = '#1d4ed8';
                  }
                }}
                onMouseOut={(e) => {
                  if (!(!inputMessage.trim() || isLoading)) {
                    e.target.style.backgroundColor = '#1e40af';
                  }
                }}
              >
                {isLoading ? 'Processing...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
