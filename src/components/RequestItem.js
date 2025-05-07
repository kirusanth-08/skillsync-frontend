// components/RequestItem.js - For displaying requests in Profile page
import React from 'react';
import { Link } from 'react-router-dom';

const RequestItem = ({ request, type, onAction }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'accepted': return 'status-accepted';
      case 'rejected': return 'status-rejected';
      default: return '';
    }
  };

  return (
    <div className="request-item">
      <div className="request-header">
        {type === 'received' ? (
          <div className="user-info">
            <img 
              src={request.requester.avatar || '/default-avatar.png'} 
              alt={request.requester.name} 
              className="avatar-small" 
            />
            <span className="user-name">{request.requester.name}</span>
          </div>
        ) : (
          <div className="user-info">
            <img 
              src={request.skill.user.avatar || '/default-avatar.png'} 
              alt={request.skill.user.name} 
              className="avatar-small" 
            />
            <span className="user-name">{request.skill.user.name}</span>
          </div>
        )}
        <div className="request-date">
          <span>Requested on {formatDate(request.createdAt)}</span>
        </div>
      </div>

      <div className="request-content">
        <div className="skill-info">
          <h4>
            <Link to={`/skill/${request.skill._id}`}>{request.skill.title}</Link>
          </h4>
          <span className="skill-category">{request.skill.category.name}</span>
        </div>
        <p className="request-message">{request.message}</p>
      </div>

      <div className="request-footer">
        <div className={`request-status ${getStatusClass(request.status)}`}>
          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
        </div>
        {type === 'received' && request.status === 'pending' && (
          <div className="request-actions">
            <button 
              onClick={() => onAction(request._id, 'accept')} 
              className="btn btn-sm btn-success"
            >
              Accept
            </button>
            <button 
              onClick={() => onAction(request._id, 'reject')} 
              className="btn btn-sm btn-danger"
            >
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestItem;