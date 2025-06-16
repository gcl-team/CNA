import { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [theme, setTheme] = useState('light');

  const [messages, setMessages] = useState([
    { id: 1, from: 'bot', text: 'Hello! How can I help you today?', timestamp: '10:00 AM' },
    { id: 2, from: 'user', text: 'Hi, can you tell me a joke?', timestamp: '10:01 AM' },
    { id: 3, from: 'bot', text: 'Sure! Why don’t scientists trust atoms?', timestamp: '10:01 AM' },
    { id: 4, from: 'user', text: 'Hmm, why?', timestamp: '10:02 AM' },
    { id: 5, from: 'bot', text: 'Because they make up everything. 😄', timestamp: '10:02 AM' },
    { id: 6, from: 'user', text: 'Hahaha, give me a photo of cute cat!', timestamp: '10:02 AM' },
    {
      id: 7,
      from: 'bot',
      type: 'image',
      image: 'https://i.imgur.com/rLLg1Nn.jpeg',
      text: 'Here\'s a cat to brighten your day!',
      timestamp: '10:03 AM',
    },
  ]);
  
  const [isBotTyping, setIsBotTyping] = useState(false);

  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech Recognition API not supported in this browser.');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => (prev ? prev + ' ' : '') + transcript);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  useEffect(() => {
    // Handle theme class
    document.body.className = theme;
  }, [theme]);
  
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.start();
      setListening(true);
    }
  };

  const sendMessage = () => {
    if (!input.trim()) return;
  
    const userMessage = {
      id: messages.length + 1,
      from: 'user',
      text: input.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsBotTyping(true);
  
    // Simulate bot reply after 1.5 seconds
    setTimeout(() => {
      const botMessage = {
        id: userMessage.id + 1,
        from: 'bot',
        text: '🤖 This is a simulated reply.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsBotTyping(false);
    }, 1500);
  };
  

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="app-container">
      {false && <Sidebar messages={messages} />}

      <main className="chat-main">
        <header className="chat-header">
          <h1>CNA</h1>
          <button onClick={toggleTheme}>
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </header>

        <div className="messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`message-row ${msg.from}`}>
              <div className={`message-bubble ${msg.from}`}>
                {msg.type === 'image' ? (
                  <>
                    {msg.text && <div className="text">{msg.text}</div>}
                    <img src={msg.image} alt="Bot sent" className="message-image" />
                  </>
                ) : (
                  <div className="text">{msg.text}</div>
                )}
                <div className="timestamp">{msg.timestamp}</div>
              </div>
            </div>
          ))}
          {isBotTyping && (
            <div className="message-row bot">
              <div className="message-bubble bot">
                <div className="text">Bot is typing...</div>
              </div>
            </div>
          )}
        </div>

        <div className="input-area">
          <input
            type="text"
            value={input}
            placeholder={listening ? "Listening..." : "Type your message..."}
            onChange={(e) => setInput(e.target.value)}
          />
          {/* <button type="button" onClick={toggleListening} aria-label="Toggle voice input" className={listening ? 'listening' : ''}>
            {listening ? '🎙️' : '🎤'}
          </button> */}
          <button onClick={sendMessage}>Send</button>
        </div>
      </main>
      
    </div>
  );
}

export default App;
