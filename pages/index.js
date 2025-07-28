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
            content: "You are Clint's professional business assistant for AIP Best Rate insurance company. Help with insurance forms, customer management, and daily business tasks."
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
    console.log('API Response:', data);
    
    // OpenAI response format
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
