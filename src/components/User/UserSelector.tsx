import React, { useState } from 'react';
import type { UserInfo, UserData } from '../../engine/userManager';

interface UserSelectorProps {
  currentUser: UserInfo | null;
  users: UserData[];
  onSelectUser: (userId: string) => void;
  onCreateUser: (name: string) => void;
}

export const UserSelector: React.FC<UserSelectorProps> = ({
  currentUser,
  users,
  onSelectUser,
  onCreateUser,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const handleCreate = () => {
    if (!newUserName.trim()) return;
    onCreateUser(newUserName.trim());
    setNewUserName('');
    setIsCreating(false);
  };

  return (
    <div className="user-selector">
      {currentUser ? (
        <div className="current-user">
          <div className="user-info">
            <span className="avatar">{currentUser.avatar}</span>
            <span className="username">{currentUser.name}</span>
          </div>
          <button
            className="switch-user-btn"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            切换用户
          </button>
          {showDropdown && (
            <div className="user-dropdown">
              <div className="dropdown-header">选择用户</div>
              {users.map(user => (
                <div
                  key={user.user.id}
                  className={`dropdown-item ${currentUser.id === user.user.id ? 'active' : ''}`}
                  onClick={() => {
                    onSelectUser(user.user.id);
                    setShowDropdown(false);
                  }}
                >
                  <span className="avatar">{user.user.avatar}</span>
                  <span className="username">{user.user.name}</span>
                  {currentUser.id === user.user.id && <span className="check">✓</span>}
                </div>
              ))}
              <div
                className="dropdown-item create-new"
                onClick={() => {
                  setIsCreating(true);
                  setShowDropdown(false);
                }}
              >
                <span className="avatar">➕</span>
                <span className="username">新建用户</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="current-user">
          <p style={{ fontSize: '14px', color: '#666' }}>暂无用户</p>
          <button
            className="switch-user-btn"
            onClick={() => setIsCreating(true)}
          >
            创建用户
          </button>
        </div>
      )}

      {isCreating && (
        <div className="create-user-modal">
          <div className="modal-content">
            <h3>创建新用户</h3>
            <input
              type="text"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              placeholder="输入用户名"
              maxLength={10}
              autoFocus
            />
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setIsCreating(false)}>
                取消
              </button>
              <button className="confirm-btn" onClick={handleCreate}>
                创建
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
