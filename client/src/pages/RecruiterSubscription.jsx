import React, { useState, useEffect } from 'react';
import './UserDashboard.css'; // Reusing existing dashboard styles

function RecruiterSubscription() {
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  const fetchSubscriptionData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/recruiter/subscription`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSubscriptionData(data);
      } else {
        // Fallback mock data
        setSubscriptionData(generateMockSubscriptionData());
      }
    } catch (error) {
      console.error('Error fetching subscription data:', error);
      setSubscriptionData(generateMockSubscriptionData());
    } finally {
      setLoading(false);
    }
  };

  const generateMockSubscriptionData = () => {
    return {
      currentPlan: {
        name: 'Free',
        creditsRemaining: 5,
        totalCredits: 10,
        validUntil: '2024-02-15',
        features: ['10 Profile Views', 'Basic Search', 'Email Support']
      },
      plans: [
        {
          id: 'free',
          name: 'Free',
          price: 0,
          credits: 10,
          duration: '30 days',
          features: [
            '10 Profile Views per month',
            'Basic candidate search',
            'Email support',
            'Standard filters'
          ],
          popular: false
        },
        {
          id: 'basic',
          name: 'Basic',
          price: 2999,
          credits: 50,
          duration: '30 days',
          features: [
            '50 Profile Views per month',
            'Advanced candidate search',
            'Priority email support',
            'Advanced filters',
            'Download resumes',
            'Contact candidates'
          ],
          popular: false
        },
        {
          id: 'professional',
          name: 'Professional',
          price: 7999,
          credits: 150,
          duration: '30 days',
          features: [
            '150 Profile Views per month',
            'Premium candidate search',
            'Phone & email support',
            'All search filters',
            'Unlimited resume downloads',
            'Direct candidate contact',
            'Job posting credits (3)',
            'Analytics dashboard'
          ],
          popular: true
        },
        {
          id: 'enterprise',
          name: 'Enterprise',
          price: 15999,
          credits: 500,
          duration: '30 days',
          features: [
            '500 Profile Views per month',
            'AI-powered candidate matching',
            'Dedicated account manager',
            'Custom search filters',
            'Bulk operations',
            'API access',
            'Unlimited job postings',
            'Advanced analytics',
            'Team collaboration tools'
          ],
          popular: false
        }
      ],
      creditPacks: [
        {
          id: 'pack_25',
          credits: 25,
          price: 1499,
          savings: 0
        },
        {
          id: 'pack_50',
          credits: 50,
          price: 2799,
          savings: 200
        },
        {
          id: 'pack_100',
          credits: 100,
          price: 4999,
          savings: 1000
        },
        {
          id: 'pack_250',
          credits: 250,
          price: 11999,
          savings: 3500
        }
      ]
    };
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
  };

  const handleUpgrade = async (planId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/recruiter/upgrade-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ planId })
      });

      if (response.ok) {
        const data = await response.json();
        // Redirect to payment gateway or show success
        if (data.paymentUrl) {
          window.location.href = data.paymentUrl;
        } else {
          if (window.showPopup) {
            window.showPopup('Plan upgraded successfully!', 'success');
          }
          fetchSubscriptionData();
        }
      }
    } catch (error) {
      console.error('Error upgrading plan:', error);
      if (window.showPopup) {
        window.showPopup('Error upgrading plan', 'error');
      }
    }
  };

  const handleBuyCredits = async (packId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/recruiter/buy-credits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ packId })
      });

      if (response.ok) {
        const data = await response.json();
        // Redirect to payment gateway or show success
        if (data.paymentUrl) {
          window.location.href = data.paymentUrl;
        } else {
          if (window.showPopup) {
            window.showPopup('Credits purchased successfully!', 'success');
          }
          fetchSubscriptionData();
        }
      }
    } catch (error) {
      console.error('Error buying credits:', error);
      if (window.showPopup) {
        window.showPopup('Error purchasing credits', 'error');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading subscription details...</div>;
  }

  return (
    <div className="user-dashboard">
      {/* Current Plan Header */}
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Credits & Subscription</h1>
          <p>Manage your recruitment plan and credits</p>
        </div>
        
        <div className="stats-overview">
          <div className="stat-item">
            <div className="stat-number">{subscriptionData.currentPlan.name}</div>
            <div className="stat-label">Current Plan</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{subscriptionData.currentPlan.creditsRemaining}</div>
            <div className="stat-label">Credits Left</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{subscriptionData.currentPlan.totalCredits}</div>
            <div className="stat-label">Total Credits</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">
              {new Date(subscriptionData.currentPlan.validUntil).toLocaleDateString()}
            </div>
            <div className="stat-label">Valid Until</div>
          </div>
        </div>
      </div>

      {/* Current Plan Details */}
      <div className="current-plan-section">
        <div className="status-bars">
          <h2>Current Plan Usage</h2>
          <div className="status-bar-container">
            <div className="status-bar">
              <div className="bar-label">Credits Used</div>
              <div className="bar">
                <div 
                  className="bar-fill approved" 
                  style={{ 
                    width: `${((subscriptionData.currentPlan.totalCredits - subscriptionData.currentPlan.creditsRemaining) / subscriptionData.currentPlan.totalCredits) * 100}%` 
                  }}
                ></div>
              </div>
              <div className="bar-percentage">
                {subscriptionData.currentPlan.totalCredits - subscriptionData.currentPlan.creditsRemaining}/{subscriptionData.currentPlan.totalCredits}
              </div>
            </div>
          </div>
          
          <div className="current-plan-features">
            <h3>Current Plan Features</h3>
            <ul>
              {subscriptionData.currentPlan.features.map((feature, index) => (
                <li key={index}>
                  <i className="ri-check-line"></i>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Subscription Plans */}
      <div className="subscription-plans">
        <h2>Upgrade Your Plan</h2>
        <div className="plans-grid">
          {subscriptionData.plans.map(plan => (
            <div 
              key={plan.id} 
              className={`plan-card ${plan.popular ? 'popular' : ''} ${subscriptionData.currentPlan.name.toLowerCase() === plan.name.toLowerCase() ? 'current' : ''}`}
            >
              {plan.popular && <div className="popular-badge">Most Popular</div>}
              {subscriptionData.currentPlan.name.toLowerCase() === plan.name.toLowerCase() && (
                <div className="current-badge">Current Plan</div>
              )}
              
              <div className="plan-header">
                <h3>{plan.name}</h3>
                <div className="plan-price">
                  {plan.price === 0 ? (
                    <span className="price">Free</span>
                  ) : (
                    <>
                      <span className="currency">₹</span>
                      <span className="price">{plan.price.toLocaleString()}</span>
                      <span className="duration">/{plan.duration}</span>
                    </>
                  )}
                </div>
                <div className="plan-credits">
                  {plan.credits} Profile Views
                </div>
              </div>
              
              <div className="plan-features">
                <ul>
                  {plan.features.map((feature, index) => (
                    <li key={index}>
                      <i className="ri-check-line"></i>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="plan-action">
                {subscriptionData.currentPlan.name.toLowerCase() === plan.name.toLowerCase() ? (
                  <button className="plan-btn current" disabled>
                    Current Plan
                  </button>
                ) : (
                  <button 
                    className={`plan-btn ${plan.popular ? 'popular' : ''}`}
                    onClick={() => handleUpgrade(plan.id)}
                  >
                    {plan.price === 0 ? 'Downgrade' : 'Upgrade'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Credit Packs */}
      <div className="credit-packs">
        <h2>Buy Additional Credits</h2>
        <p>Need more profile views? Purchase additional credits without changing your plan.</p>
        
        <div className="credit-packs-grid">
          {subscriptionData.creditPacks.map(pack => (
            <div key={pack.id} className="credit-pack-card">
              <div className="pack-header">
                <div className="pack-credits">{pack.credits}</div>
                <div className="pack-label">Credits</div>
              </div>
              
              <div className="pack-price">
                <span className="currency">₹</span>
                <span className="price">{pack.price.toLocaleString()}</span>
              </div>
              
              {pack.savings > 0 && (
                <div className="pack-savings">
                  Save ₹{pack.savings}
                </div>
              )}
              
              <div className="pack-per-credit">
                ₹{Math.round(pack.price / pack.credits)} per credit
              </div>
              
              <button 
                className="buy-credits-btn"
                onClick={() => handleBuyCredits(pack.id)}
              >
                Buy Credits
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Usage Tips */}
      <div className="usage-tips">
        <h2>How Credits Work</h2>
        <div className="tips-grid">
          <div className="tip-card">
            <i className="ri-eye-line"></i>
            <h3>Profile Views</h3>
            <p>1 credit = 1 candidate profile view with full details</p>
          </div>
          <div className="tip-card">
            <i className="ri-download-line"></i>
            <h3>Resume Downloads</h3>
            <p>Download resumes at no extra cost with paid plans</p>
          </div>
          <div className="tip-card">
            <i className="ri-message-line"></i>
            <h3>Contact Candidates</h3>
            <p>Direct contact features included in all paid plans</p>
          </div>
          <div className="tip-card">
            <i className="ri-refresh-line"></i>
            <h3>Monthly Renewal</h3>
            <p>Credits reset every month based on your plan</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecruiterSubscription;