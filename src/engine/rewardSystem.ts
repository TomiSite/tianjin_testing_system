// 奖励系统
import type { Badge, UserProgress } from '../data/types';

// 徽章定义
export const badges: Badge[] = [
  {
    id: 'fraction_master',
    name: '分数小达人',
    description: '分数题全对 10 次',
    icon: '🏆',
    condition: (progress) => {
      // 简化判断：正确次数达到 10 次
      return progress.correctCount >= 10;
    },
  },
  {
    id: 'geometry_master',
    name: '几何大师',
    description: '几何题正确率 90% 以上',
    icon: '📐',
    condition: (progress) => {
      if (progress.answeredCount < 10) return false;
      const accuracy = (progress.correctCount / progress.answeredCount) * 100;
      return accuracy >= 90;
    },
  },
  {
    id: 'speed_calculator',
    name: '计算神速',
    description: '在规定时间内完成 20 题',
    icon: '⚡',
    condition: (progress) => {
      // 检查是否有连续 20 题平均用时小于 30 秒
      if (progress.records.length < 20) return false;
      const recentRecords = progress.records.slice(-20);
      const avgTime = recentRecords.reduce((sum, r) => sum + r.answerTime, 0) / 20;
      return avgTime < 30;
    },
  },
  {
    id: 'first_blood',
    name: '初出茅庐',
    description: '完成第一道题',
    icon: '🌱',
    condition: (progress) => progress.answeredCount >= 1,
  },
  {
    id: 'persistent',
    name: '坚持不懈',
    description: '累计答题 50 道',
    icon: '💪',
    condition: (progress) => progress.answeredCount >= 50,
  },
  {
    id: 'streak_5',
    name: '连胜高手',
    description: '连续正确 5 次',
    icon: '🔥',
    condition: (progress) => progress.streak >= 5,
  },
  {
    id: 'streak_10',
    name: '不败战神',
    description: '连续正确 10 次',
    icon: '👑',
    condition: (progress) => progress.streak >= 10,
  },
  {
    id: 'game_unlocked',
    name: '游戏达人',
    description: '首次解锁游戏时间',
    icon: '🎮',
    condition: (progress) => progress.gameTimeEarned >= 5,
  },
];

// 检查并更新徽章
export const checkBadges = (progress: UserProgress): string[] => {
  const newBadges: string[] = [];
  for (const badge of badges) {
    if (!progress.badges.includes(badge.id) && badge.condition(progress)) {
      newBadges.push(badge.id);
    }
  }
  return newBadges;
};

// 计算游戏时间奖励
export const calculateGameTimeReward = (correctCount: number): number => {
  // 每答对 10 道题获得 5 分钟游戏时间
  const blocks = Math.floor(correctCount / 10);
  return blocks * 5;
};

// 更新用户进度
export const updateProgress = (
  progress: UserProgress,
  pointsEarned: number,
  isCorrect: boolean
): { newProgress: UserProgress; newBadges: string[]; gameTimeEarned: number } => {
  const previousCorrectCount = progress.correctCount;
  const newCorrectCount = isCorrect ? progress.correctCount + 1 : progress.correctCount;

  // 计算游戏时间奖励（基于答对题数）
  const newGameTime = calculateGameTimeReward(newCorrectCount);
  const earnedGameTime = newGameTime - calculateGameTimeReward(previousCorrectCount);

  // 检查新徽章
  const tempProgress = {
    ...progress,
    answeredCount: progress.answeredCount + 1,
    correctCount: newCorrectCount,
    streak: isCorrect ? progress.streak + 1 : 0,
  };

  const newBadges = checkBadges(tempProgress);

  // 返回新的 progress 对象
  const newProgress: UserProgress = {
    ...progress,
    answeredCount: progress.answeredCount + 1,
    totalPoints: progress.totalPoints + pointsEarned,
    correctCount: newCorrectCount,
    streak: isCorrect ? progress.streak + 1 : 0,
    gameTimeEarned: progress.gameTimeEarned + earnedGameTime,
    badges: [...progress.badges, ...newBadges],
    records: [...progress.records],
  };

  return {
    newProgress,
    newBadges,
    gameTimeEarned: earnedGameTime,
  };
};

// 本地存储管理
const STORAGE_KEY = 'math_learning_progress';

export const saveProgress = (progress: UserProgress): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
};

export const loadProgress = (): UserProgress | null => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return null;
  try {
    return JSON.parse(saved);
  } catch {
    return null;
  }
};

export const clearProgress = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
