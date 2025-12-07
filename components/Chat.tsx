import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, X, Users, Trash2 } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
const SOCKET_URL = 'http://localhost:5000';

interface Message {
  id: number;
  userId: number;
  message: string;
  timestamp: string;
  user: {
    id: number;
    name: string;
    avatar: string;
    role: string;
  };
}

interface ChatProps {
  currentUser: {
    id: number;
    name: string;
    avatar: string;
    role: string;
  };
}

const Chat: React.FC<ChatProps> = ({ currentUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState<number[]>([]);
  const [typingUsers, setTypingUsers] = useState<number[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Connect to Socket.IO
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    // Emit user online status
    newSocket.emit('user:online', currentUser.id);

    // Listen for new messages
    newSocket.on('message:new', (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Listen for online users updates
    newSocket.on('users:online', (userIds: number[]) => {
      setOnlineUsers(userIds);
    });

    // Listen for typing indicators
    newSocket.on('user:typing', (userId: number) => {
      setTypingUsers((prev) => [...prev, userId]);
    });

    newSocket.on('user:stop-typing', (userId: number) => {
      setTypingUsers((prev) => prev.filter((id) => id !== userId));
    });

    // Fetch initial messages
    fetchMessages();

    return () => {
      newSocket.disconnect();
    };
  }, [currentUser.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${API_URL}/messages`);
      if (response.data.success) {
        setMessages(response.data.messages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    socket.emit('message:send', {
      userId: currentUser.id,
      message: newMessage.trim()
    });

    setNewMessage('');
    
    // Stop typing indicator
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    socket.emit('typing:stop', currentUser.id);
  };

  const handleTyping = (value: string) => {
    setNewMessage(value);

    if (!socket) return;

    // Emit typing start
    socket.emit('typing:start', currentUser.id);

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing:stop', currentUser.id);
    }, 1000);
  };

  const handleDeleteMessage = async (messageId: number) => {
    try {
      await axios.delete(`${API_URL}/messages/${messageId}`, {
        data: {
          userId: currentUser.id,
          userRole: currentUser.role
        }
      });
      setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-4 shadow-lg transition-all z-50 flex items-center gap-2"
      >
        <MessageCircle className="w-6 h-6" />
        {!isOpen && messages.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {messages.filter((msg) => msg.userId !== currentUser.id).length > 9 ? '9+' : messages.filter((msg) => msg.userId !== currentUser.id).length}
          </span>
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col z-50">
          {/* Header */}
          <div className="bg-indigo-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <h3 className="font-semibold">Team Chat</h3>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-sm">
                <Users className="w-4 h-4" />
                <span>{onlineUsers.length}</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-indigo-700 p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
            {messages.map((msg) => {
              const isOwn = msg.userId === currentUser.id;
              const isOnline = onlineUsers.includes(msg.user.id);

              return (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={msg.user.avatar}
                      alt={msg.user.name}
                      className="w-8 h-8 rounded-full"
                    />
                    {isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>

                  {/* Message */}
                  <div className={`flex-1 ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-slate-600">
                        {msg.user.name}
                      </span>
                      {msg.user.role === 'ADMIN' && (
                        <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded">
                          Admin
                        </span>
                      )}
                    </div>
                    <div className="flex items-end gap-2">
                      <div
                        className={`mt-1 px-3 py-2 rounded-lg max-w-xs break-words ${
                          isOwn
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white text-slate-800 border border-slate-200'
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                      </div>
                      {(isOwn || currentUser.role === 'ADMIN') && (
                        <button
                          onClick={() => handleDeleteMessage(msg.id)}
                          className="opacity-0 hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded"
                        >
                          <Trash2 className="w-3 h-3 text-red-500" />
                        </button>
                      )}
                    </div>
                    <span className="text-xs text-slate-400 mt-1">
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {typingUsers.filter((id) => id !== currentUser.id).length > 0 && (
              <div className="flex gap-2 items-center text-slate-500 text-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span>Someone is typing...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 bg-white rounded-b-lg">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => handleTyping(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Chat;
