import { useState, useRef, useEffect } from "react";
import { Send, Mic, AlertCircle, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const API_URL = import.meta.env.VITE_API_URL;

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  metadata?: {
    conditions?: string[];
    urgency?: 'low' | 'medium' | 'high';
    recommendations?: string[];
  };
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hello! I'm your AI health assistant. Please describe your symptoms and I'll help assess them. Remember, this is for informational purposes only and not a substitute for professional medical advice.",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

const sendMessage = async () => {
  if (!inputValue.trim()) return;

  const userMessage: Message = {
    id: Date.now().toString(),
    type: 'user',
    content: inputValue,
    timestamp: new Date()
  };

  setMessages(prev => [...prev, userMessage]);
  setInputValue('');
  setIsTyping(true);

  try {
    const res = await fetch(`${API_URL}/symptom-chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: "test123", message: inputValue }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Chat failed");

    const aiResponse: Message = {
      id: Date.now().toString(),
      type: 'ai',
      content: "Here’s what I found based on your symptoms:",
      timestamp: new Date(),
      metadata: {
        conditions: data.possible_conditions,
        urgency: data.urgency,
        recommendations: data.recommended_actions,
      },
    };

    setMessages(prev => [...prev, aiResponse]);
  } catch (err: any) {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      type: 'ai',
      content: "Error contacting AI service. Please try again.",
      timestamp: new Date()
    }]);
  } finally {
    setIsTyping(false);
  }
};

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col fade-in">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-foreground">Symptom Checker</h1>
        <p className="text-muted-foreground">
          Describe your symptoms for AI-powered health assessment
        </p>
      </div>

      {/* Chat Container */}
      <Card className="flex-1 flex flex-col medical-card">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className="max-w-xs md:max-w-md lg:max-w-lg">
                <div className={message.type === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}>
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                {/* AI Metadata */}
                {message.type === 'ai' && message.metadata && (
                  <div className="mt-3 space-y-2">
                    {/* Urgency Level */}
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(message.metadata.urgency || 'low')}`}>
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {message.metadata.urgency?.toUpperCase()} PRIORITY
                    </div>

                    {/* Possible Conditions */}
                    <Card className="bg-blue-50 border-blue-200">
                      <CardContent className="p-3">
                        <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                          <Activity className="h-4 w-4 mr-1" />
                          Possible Conditions
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {message.metadata.conditions?.map((condition, index) => (
                            <span key={index} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                              {condition}
                            </span>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Recommendations */}
                    <Card className="bg-green-50 border-green-200">
                      <CardContent className="p-3">
                        <h4 className="font-medium text-green-800 mb-2">Recommendations</h4>
                        <ul className="text-sm text-green-700 space-y-1">
                          {message.metadata.recommendations?.map((rec, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-green-500 mr-2">•</span>
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="chat-bubble-ai">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-border p-4">
          <div className="flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe your symptoms..."
              className="flex-1 medical-input"
              disabled={isTyping}
            />
            
            <Button 
              onClick={sendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="medical-button-primary"
            >
              <Send className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="outline"
              className="px-3"
              disabled={isTyping}
            >
              <Mic className="h-4 w-4" />
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground mt-2 text-center">
            This is for informational purposes only. Seek professional medical advice for health concerns.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Chat;