import React, { useState, useEffect } from 'react';
import './RecruiterMessages.css';

function RecruiterMessages() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/recruiter/conversations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations || []);
      } else {
        // Fallback mock data
        setConversations(generateMockConversations());
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setConversations(generateMockConversations());
    } finally {
      setLoading(false);
    }
  };

  const generateMockConversations = () => {
    return [
      {
        id: 1,
        candidateId: 1,
        candidateName: 'John Doe',
        candidatePhoto: null,
        jobRole: 'Frontend Developer',
        lastMessage: 'Thank you for reaching out. I am interested in the position.',
        lastMessageTime: '2024-01-19T10:30:00Z',
        unreadCount: 2,
        isOnline: true
      },
      {
        id: 2,
        candidateId: 2,
        candidateName: 'Jane Smith',
        candidatePhoto: null,
        jobRole: 'Backend Developer',
        lastMessage: 'I have 5 years of experience in Python and Django.',
        lastMessageTime: '2024-01-19T09:15:00Z',
        unreadCount: 0,
        isOnline: false
      },
      {
        id: 3,
        candidateId: 4,
        candidateName: 'Priya Sharma',
        candidatePhoto: null,
        jobRole: 'Frontend Developer',
        lastMessage: 'When can we schedule the interview?',
        lastMessageTime: '2024-01-18T16:45:00Z',
        unreadCount: 1,
        isOnline: true
      }
    ];
  };

  const fetchMessages = async (conversationId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/recruiter/messages/${conversationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      } else {
        // Fallback mock data
        setMessages(generateMockMessages(conversationId));
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages(generateMockMessages(conversationId));
    }
  };

  const generateMockMessages = (conversationId) => {
    const messagesByConversation = {
      1: [
        {
          id: 1,
          senderId: 'recruiter',
          senderName: 'You',
          message: 'Hi John, I came across your profile and I think you would be a great fit for our Senior React Developer position.',
          timestamp: '2024-01-19T09:00:00Z',
          type: 'text'
        },
        {
          id: 2,
          senderId: 1,
          senderName: 'John Doe',
          message: 'Thank you for reaching out. I am interested in the position. Could you please share more details about the role and company?',
          timestamp: '2024-01-19T10:30:00Z',
          type: 'text'
        },
        {
          id: 3,
          senderId: 1,
          senderName: 'John Doe',
          message: 'I have attached my updated resume for your reference.',
          timestamp: '2024-01-19T10:32:00Z',
          type: 'file',
          fileName: 'John_Doe_Resume.pdf'
        }
      ],
      2: [
        {
          id: 4,
          senderId: 'recruiter',
          senderName: 'You',
          message: 'Hello Jane, your backend development experience looks impressive. We have an opening that might interest you.',
          timestamp: '2024-01-19T08:30:00Z',
          type: 'text'
        },
        {
          id: 5,
          senderId: 2,
          senderName: 'Jane Smith',
          message: 'I have 5 years of experience in Python and Django. I am currently looking for new opportunities.',
          timestamp: '2024-01-19T09:15:00Z',
          type: 'text'
        }
      ],
      3: [
        {
          id: 6,
          senderId: 'recruiter',
          senderName: 'You',
          message: 'Hi Priya, I would like to discuss a Frontend Developer position with you.',
          timestamp: '2024-01-18T15:00:00Z',
          type: 'text'
        },
        {
          id: 7,
          senderId: 4,
          senderName: 'Priya Sharma',
          message: 'When can we schedule the interview?',
          timestamp: '2024-01-18T16:45:00Z',
          type: 'text'
        }
      ]
    };
    
    return messagesByConversation[conversationId] || [];
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const messageData = {
      conversationId: selectedConversation.id,
      message: newMessage.trim(),
      type: 'text'
    };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/recruiter/send-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(messageData)
      });

      if (response.ok) {
        const newMsg = {
          id: Date.now(),
          senderId: 'recruiter',
          senderName: 'You',
          message: newMessage.trim(),
          timestamp: new Date().toISOString(),
          type: 'text'
        };
        
        setMessages(prev => [...prev, newMsg]);
        setNewMessage('');
        
        // Update conversation last message
        setConversations(prev => 
          prev.map(conv => 
            conv.id === selectedConversation.id 
              ? { ...conv, lastMessage: newMessage.trim(), lastMessageTime: new Date().toISOString() }
              : conv
          )
        );
      }
    } catch (error) {
      console.error('Error sending message:', error);
      if (window.showPopup) {
        window.showPopup('Error sending message', 'error');
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    } else {
      return date.toLocaleDateString('en-IN', { 
        day: '2-digit', 
        month: 'short' 
      });
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.jobRole.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading messages...</div>;
  }

  return (
    <div className="messages-page">
      <div className="messages-container">
        {/* Conversations Sidebar */}
        <div className="conversations-sidebar">
          <div className="sidebar-header">
            <h2>Messages</h2>
            <div className="search-conversations">
              <i className="ri-search-line"></i>
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="conversations-list">
            {filteredConversations.length > 0 ? (
              filteredConversations.map(conversation => (
                <div
                  key={conversation.id}
                  className={`conversation-item ${selectedConversation?.id === conversation.id ? 'active' : ''}`}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <div className="conversation-avatar">
                    {conversation.candidatePhoto ? (
                      <img src={conversation.candidatePhoto} alt={conversation.candidateName} />
                    ) : (
                      <div className="default-avatar">
                        <i className="ri-user-line"></i>
                      </div>
                    )}
                    {conversation.isOnline && <div className="online-indicator"></div>}
                  </div>
                  
                  <div className="conversation-info">
                    <div className="conversation-header">
                      <h4>{conversation.candidateName}</h4>
                      <span className="message-time">
                        {formatTime(conversation.lastMessageTime)}
                      </span>
                    </div>
                    <p className="job-role">{conversation.jobRole}</p>
                    <p className="last-message">{conversation.lastMessage}</p>
                  </div>
                  
                  {conversation.unreadCount > 0 && (
                    <div className="unread-badge">
                      {conversation.unreadCount}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="no-conversations">
                <i className="ri-message-line"></i>
                <p>No conversations found</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="chat-area">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="chat-header">
                <div className="chat-user-info">
                  <div className="chat-avatar">
                    {selectedConversation.candidatePhoto ? (
                      <img src={selectedConversation.candidatePhoto} alt={selectedConversation.candidateName} />
                    ) : (
                      <div className="default-avatar">
                        <i className="ri-user-line"></i>
                      </div>
                    )}
                    {selectedConversation.isOnline && <div className="online-indicator"></div>}
                  </div>
                  <div className="user-details">
                    <h3>{selectedConversation.candidateName}</h3>
                    <p>{selectedConversation.jobRole}</p>
                  </div>
                </div>
                
                <div className="chat-actions">
                  <button 
                    className="action-btn"
                    onClick={() => window.location.href = `/recruiter/candidate/${selectedConversation.candidateId}`}
                    title="View Profile"
                  >
                    <i className="ri-user-line"></i>
                  </button>
                  <button 
                    className="action-btn"
                    onClick={() => window.location.href = `tel:${selectedConversation.phone || ''}`}
                    title="Call"
                  >
                    <i className="ri-phone-line"></i>
                  </button>
                  <button 
                    className="action-btn"
                    title="More Options"
                  >
                    <i className="ri-more-2-line"></i>
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="messages-container-inner">
                {messages.length > 0 ? (
                  messages.map(message => (
                    <div
                      key={message.id}
                      className={`message ${message.senderId === 'recruiter' ? 'sent' : 'received'}`}
                    >
                      <div className="message-content">
                        {message.type === 'text' ? (
                          <p>{message.message}</p>
                        ) : message.type === 'file' ? (
                          <div className="file-message">
                            <i className="ri-file-line"></i>
                            <span>{message.fileName}</span>
                            <button className="download-btn">
                              <i className="ri-download-line"></i>
                            </button>
                          </div>
                        ) : null}
                        <span className="message-time">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-messages">
                    <i className="ri-chat-3-line"></i>
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className="message-input-container">
                <div className="message-input">
                  <button className="attachment-btn" title="Attach File">
                    <i className="ri-attachment-line"></i>
                  </button>
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    rows="1"
                  />
                  <button 
                    className="send-btn"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                  >
                    <i className="ri-send-plane-line"></i>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="no-chat-selected">
              <i className="ri-chat-3-line"></i>
              <h3>Select a conversation</h3>
              <p>Choose a conversation from the sidebar to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecruiterMessages;