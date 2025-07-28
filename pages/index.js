import { useState } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Welcome to AIP Best Rate! I\'m Clint\'s AI business assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [
        { role: "user", content: "You are Clint's business assistant for AIP Best Rate Insurance. Help with insurance tasks, forms, and business operations." },
        { role: "user", content: inputMessage }
      ]
    })
  });

  const data = await response.json();
  
  // Handle both success and fallback responses
  let responseText = '';
  if (data.content && data.content[0] && data.content[0].text) {
    responseText = data.content[0].text;
  } else if (data.fallbackResponse && data.fallbackResponse.content[0]) {
    responseText = data.fallbackResponse.content[0].text;
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
    content: 'I\'m here to help with your insurance business tasks! What would you like me to assist you with?',
    timestamp: new Date()
  }]);
}
    
    setIsLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', padding: '20px', fontFamily: 'system-ui' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1>AIP Best Rate - Business Assistant</h1>
        
        <div style={{ height: '400px', border: '1px solid #ccc', padding: '20px', overflowY: 'auto', marginBottom: '20px' }}>
          {messages.map((message, index) => (
            <div key={index} style={{ marginBottom: '15px', padding: '10px', background: message.role === 'user' ? '#e3f2fd' : '#f5f5f5', borderRadius: '8px' }}>
              <strong>{message.role === 'user' ? 'You' : 'AI Assistant'}:</strong>
              <p style={{ margin: '5px 0' }}>{message.content}</p>
            </div>
          ))}
          {isLoading && <div>AI is thinking...</div>}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask about insurance, forms, customers..."
            style={{ flex: 1, padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
          <button 
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            style={{ padding: '10px 20px', background: '#2196f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
