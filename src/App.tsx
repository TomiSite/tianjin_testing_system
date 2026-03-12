import { useState, useEffect } from 'react';
import { Quiz } from './components/Quiz/Quiz';
import { Dashboard } from './components/Dashboard/Dashboard';
import { UserSelector } from './components/User/UserSelector';
import { Leaderboard } from './components/User/Leaderboard';
import type { Question, UserProgress, QuestionType, GradeLevel, SchoolSemester } from './data/types';
import type { UserInfo } from './engine/userManager';
import { createInitialProgress } from './data/types';
import { quizEngine } from './engine/quizEngine';
import { updateProgress } from './engine/rewardSystem';
import {
  getCurrentUserData,
  getAllUsers,
  createUser,
  setCurrentUserId,
  getLeaderboard,
  updateCurrentUserProgress,
  clearCurrentUserRecords,
} from './engine/userManager';
import './components/User/UserStyles.css';
import './App.css';

type View = 'dashboard' | 'quiz';

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [progress, setProgress] = useState<UserProgress>(createInitialProgress());
  const [startTime, setStartTime] = useState<number>(0);
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null);
  const [users, setUsers] = useState(getAllUsers());
  const [leaderboard, setLeaderboard] = useState(getLeaderboard());
  const [selectedSubject, setSelectedSubject] = useState<QuestionType | 'all'>('all');
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(5); // 默认五年级
  const [selectedSemester, setSelectedSemester] = useState<SchoolSemester | 'all'>('all');

  // 加载当前用户数据
  useEffect(() => {
    const userData = getCurrentUserData();
    if (userData) {
      setCurrentUser(userData.user);
      setProgress(userData.progress);
      quizEngine.loadProgress(userData.progress);
    }
    setUsers(getAllUsers());
    setLeaderboard(getLeaderboard());
  }, []);

  // 切换用户
  const handleSelectUser = (userId: string) => {
    setCurrentUserId(userId);
    const userData = getCurrentUserData();
    if (userData) {
      setCurrentUser(userData.user);
      setProgress(userData.progress);
      quizEngine.loadProgress(userData.progress);
    }
  };

  // 创建用户
  const handleCreateUser = (name: string) => {
    const newUser = createUser(name);
    setCurrentUser(newUser.user);
    setProgress(newUser.progress);
    setUsers(getAllUsers());
    setLeaderboard(getLeaderboard());
  };

  // 开始答题
  const handleStartQuiz = () => {
    if (!currentUser) {
      alert('请先创建或选择用户！');
      return;
    }
    // 根据选择的科目、年级和学期选题
    const question = quizEngine.getNextQuestion(
      selectedSubject !== 'all' ? selectedSubject : undefined,
      selectedGrade,
      selectedSemester !== 'all' ? selectedSemester : undefined
    );
    if (question) {
      setCurrentQuestion(question);
      setStartTime(Date.now());
      setCurrentView('quiz');
    }
  };

  // 切换科目
  const handleSubjectChange = (subject: QuestionType | 'all') => {
    setSelectedSubject(subject);
  };

  // 切换年级
  const handleGradeChange = (grade: GradeLevel) => {
    setSelectedGrade(grade);
    // 如果切换到五年级，重置学期选择
    if (grade === 5) {
      setSelectedSemester('all');
    }
    // 重置科目选择为"全部科目"
    setSelectedSubject('all');
  };

  // 切换学期
  const handleSemesterChange = (semester: SchoolSemester | 'all') => {
    setSelectedSemester(semester);
  };

  // 提交答案
  const handleAnswer = (answer: string) => {
    if (!currentQuestion) return;

    const result = quizEngine.checkAnswer(currentQuestion, answer);
    const answerTime = (Date.now() - startTime) / 1000;
    const record = quizEngine.recordAnswer(
      currentQuestion.id,
      result.isCorrect,
      answerTime
    );

    const { newProgress } = updateProgress(
      progress,
      result.pointsEarned,
      result.isCorrect
    );

    newProgress.records.push(record);
    setProgress(newProgress);

    // 保存到 localStorage
    updateCurrentUserProgress(newProgress);
  };

  // 下一题
  const handleNext = () => {
    const question = quizEngine.getNextQuestion(
      selectedSubject !== 'all' ? selectedSubject : undefined,
      selectedGrade,
      selectedSemester !== 'all' ? selectedSemester : undefined
    );
    if (question) {
      setCurrentQuestion(question);
      setStartTime(Date.now());
    } else {
      setCurrentView('dashboard');
    }
  };

  // 返回 Dashboard
  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  // 清除答题记录
  const handleClearRecords = () => {
    if (!currentUser) {
      alert('请先创建或选择用户！');
      return;
    }
    if (window.confirm('确定要清除答题记录吗？此操作不可恢复！')) {
      const newProgress = clearCurrentUserRecords();
      if (newProgress) {
        setProgress(newProgress);
        quizEngine.loadProgress(newProgress);
        setLeaderboard(getLeaderboard());
        alert('答题记录已清除！');
      }
    }
  };

  return (
    <div className="app">
      <UserSelector
        currentUser={currentUser}
        users={users}
        onSelectUser={handleSelectUser}
        onCreateUser={handleCreateUser}
      />

      {currentView === 'dashboard' && (
        <>
          <Dashboard
            progress={progress}
            user={currentUser}
            selectedSubject={selectedSubject}
            selectedGrade={selectedGrade}
            selectedSemester={selectedSemester}
            onSwitchToQuiz={handleStartQuiz}
            onSubjectChange={handleSubjectChange}
            onGradeChange={handleGradeChange}
            onSemesterChange={handleSemesterChange}
            onClearRecords={handleClearRecords}
          />
          <div style={{ marginTop: '20px' }}>
            <Leaderboard
              currentUser={currentUser}
              leaderboard={leaderboard}
            />
          </div>
        </>
      )}

      {currentView === 'quiz' && currentQuestion && (
        <Quiz
          question={currentQuestion}
          onAnswer={handleAnswer}
          onNext={handleNext}
          currentScore={progress.totalPoints}
          streak={progress.streak}
          answeredCount={progress.answeredCount}
          onBackToDashboard={handleBackToDashboard}
        />
      )}
    </div>
  );
}

export default App;
