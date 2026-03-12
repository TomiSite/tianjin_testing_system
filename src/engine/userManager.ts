// 用户管理
import type { UserProgress } from '../data/types';

export interface UserInfo {
  id: string;
  name: string;
  createdAt: number;
  avatar: string;
}

export interface UserData {
  user: UserInfo;
  progress: UserProgress;
}

// 本地存储管理
const STORAGE_PREFIX = 'math_learning_';
const USERS_KEY = `${STORAGE_PREFIX}users`;
const CURRENT_USER_KEY = `${STORAGE_PREFIX}current_user`;

// 头像列表
const AVATARS = ['🐼', '🐨', '🐯', '🦁', '🦊', '🐸', '🐵', '🦄', '🐝', '🐞'];

// 获取所有用户
export const getAllUsers = (): UserData[] => {
  const saved = localStorage.getItem(USERS_KEY);
  if (!saved) return [];
  try {
    return JSON.parse(saved);
  } catch {
    return [];
  }
};

// 保存所有用户
export const saveAllUsers = (users: UserData[]): void => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// 获取当前用户
export const getCurrentUserId = (): string | null => {
  return localStorage.getItem(CURRENT_USER_KEY);
};

// 设置当前用户
export const setCurrentUserId = (userId: string): void => {
  localStorage.setItem(CURRENT_USER_KEY, userId);
};

// 创建新用户
export const createUser = (name: string): UserData => {
  const users = getAllUsers();
  const id = `user_${Date.now()}`;
  const avatar = AVATARS[users.length % AVATARS.length];

  const newUser: UserData = {
    user: {
      id,
      name,
      createdAt: Date.now(),
      avatar,
    },
    progress: {
      totalPoints: 0,
      answeredCount: 0,
      correctCount: 0,
      records: [],
      gameTimeEarned: 0,
      gameTimeUsed: 0,
      badges: [],
      lastAnswerTime: 0,
      streak: 0,
    },
  };

  users.push(newUser);
  saveAllUsers(users);
  setCurrentUserId(id);

  return newUser;
};

// 获取当前用户数据
export const getCurrentUserData = (): UserData | null => {
  const currentId = getCurrentUserId();
  if (!currentId) return null;

  const users = getAllUsers();
  return users.find(u => u.user.id === currentId) || null;
};

// 更新当前用户进度
export const updateCurrentUserProgress = (progress: UserProgress): void => {
  const currentId = getCurrentUserId();
  if (!currentId) return;

  const users = getAllUsers();
  const index = users.findIndex(u => u.user.id === currentId);
  if (index >= 0) {
    users[index].progress = progress;
    saveAllUsers(users);
  }
};

// 删除用户
export const deleteUser = (userId: string): void => {
  const users = getAllUsers();
  const filtered = users.filter(u => u.user.id !== userId);
  saveAllUsers(filtered);

  if (getCurrentUserId() === userId) {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

// 获取排行榜（按积分排序）
export const getLeaderboard = (): (UserData & { rank: number })[] => {
  const users = getAllUsers();
  const sorted = users
    .filter(u => u.progress.answeredCount > 0) // 只显示答过题的用户
    .sort((a, b) => {
      // 优先按积分排序，积分相同按正确率
      if (b.progress.totalPoints !== a.progress.totalPoints) {
        return b.progress.totalPoints - a.progress.totalPoints;
      }
      const accuracyA = a.progress.answeredCount > 0
        ? a.progress.correctCount / a.progress.answeredCount
        : 0;
      const accuracyB = b.progress.answeredCount > 0
        ? b.progress.correctCount / b.progress.answeredCount
        : 0;
      return accuracyB - accuracyA;
    });

  return sorted.map((user, index) => ({
    ...user,
    rank: index + 1,
  }));
};

// 获取用户排名
export const getUserRank = (userId: string): number => {
  const leaderboard = getLeaderboard();
  const user = leaderboard.find(u => u.user.id === userId);
  return user?.rank || 0;
};

// 清除当前用户的答题记录
export const clearCurrentUserRecords = (): UserProgress | null => {
  const currentId = getCurrentUserId();
  if (!currentId) return null;

  const users = getAllUsers();
  const index = users.findIndex(u => u.user.id === currentId);
  if (index >= 0) {
    // 保留用户信息和徽章，只清除答题记录
    const newProgress: UserProgress = {
      totalPoints: 0,
      answeredCount: 0,
      correctCount: 0,
      records: [],
      gameTimeEarned: users[index].progress.gameTimeEarned, // 保留已获得的游戏时间
      gameTimeUsed: 0,
      badges: users[index].progress.badges, // 保留徽章
      lastAnswerTime: 0,
      streak: 0,
    };
    users[index].progress = newProgress;
    saveAllUsers(users);
    return newProgress;
  }
  return null;
};
