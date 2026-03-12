import React from 'react';
import type { UserData } from '../../engine/userManager';

interface LeaderboardProps {
  currentUser: { id: string; name: string; avatar: string } | null;
  leaderboard: (UserData & { rank: number })[];
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  currentUser,
  leaderboard,
}) => {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getAccuracy = (progress: UserData['progress']) => {
    if (progress.answeredCount === 0) return 0;
    return Math.round((progress.correctCount / progress.answeredCount) * 100);
  };

  return (
    <div className="leaderboard-container">
      <h2>🏆 排行榜</h2>
      {leaderboard.length === 0 ? (
        <div className="empty-leaderboard">
          <p>还没有用户数据，快来成为第一个吧！</p>
        </div>
      ) : (
        <div className="leaderboard-list">
          {leaderboard.map((item) => {
            const isCurrentUser = currentUser?.id === item.user.id;
            return (
              <div
                key={item.user.id}
                className={`leaderboard-item ${isCurrentUser ? 'current-user-item' : ''}`}
              >
                <div className="rank">
                  <span>{getRankIcon(item.rank)}</span>
                </div>
                <div className="user-info">
                  <span className="avatar">{item.user.avatar}</span>
                  <span className="username">
                    {item.user.name}
                    {isCurrentUser && <span className="me-tag">（我）</span>}
                  </span>
                </div>
                <div className="stats">
                  <span className="points">{item.progress.totalPoints} 分</span>
                  <span className="accuracy">{getAccuracy(item.progress)}% 正确率</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
