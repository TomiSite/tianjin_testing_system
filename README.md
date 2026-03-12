# 天津 5-6 年级测验系统

一款为天津小学五、六年级学生设计的多学科综合测验系统，支持语文、数学、英语三科学习与练习。

## 📊 项目概况

| 项目 | 数据 |
|------|------|
| 总题库 | 1,575 道题 |
| 支持年级 | 五年级下、六年级上/下 |
| 支持科目 | 语文、数学、英语 |
| 技术栈 | React 19 + TypeScript + Vite 7 |

---

## ✨ 功能特点

### 📚 多学科支持
- **语文**：古诗积累、词语书写、字词理解、病句辨析、修辞手法、文学常识等
- **数学**：小数乘除法、分数运算、方程、几何面积/体积、应用题等
- **英语**：单词认知、基础语法、时态、句型转换、固定搭配等

### 📖 年级与学期
- **五年级下**：324 道语文题 + 300 道英语题 + 351 道数学题
- **六年级上**：100 道语文题 + 100 道英语题 + 100 道数学题
- **六年级下**：100 道语文题 + 100 道英语题 + 100 道数学题

### 🎯 难度分级
- 🥉 **青铜级**：基础概念理解（10 分/题）
- 🥈 **白银级**：常规应用（15 分/题）
- 🥇 **黄金级**：综合运用（20 分/题）
- 💎 **钻石级**：创新思维（25 分/题）

### 🏆 学习激励
- **积分系统**：答对题目获得积分
- **连胜奖励**：连续正确额外加分
- **答题统计**：正确率、答题数量、用时分析
- **学习分析**：知识点掌握情况、薄弱项诊断

### 🎮 游戏化学习
- **数学城堡**：使用方向键控制角色移动
- **收集宝石**：收集 5 颗宝石解锁城堡
- **游戏时间**：通过学习获得游戏时间奖励

### 📱 响应式设计
- 支持桌面端、平板、手机
- 清新简约的视觉设计
- 柔和配色，保护视力
- 触摸优化，移动友好

### 🔒 隐私保护
- 数据存储在本地浏览器
- 无需注册账号
- 支持多用户切换

---

## 🛠️ 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| React | 19.x | 前端框架 |
| TypeScript | 5.9.x | 类型系统 |
| Vite | 7.x | 构建工具 |
| Phaser | 3.x | 游戏引擎 |
| KaTeX | 0.16.x | 数学公式渲染 |

---

## 🚀 快速开始

### 环境要求
- Node.js ≥ 18.x（推荐 20.x LTS）
- npm ≥ 9.x

### 安装依赖
```bash
cd /math-learning
npm install
```

### 开发模式
```bash
npm run dev
```
访问 http://localhost:5173/ 开始使用

### 生产构建
```bash
npm run build
```
构建输出到 `dist/` 目录

### 本地预览
```bash
npm run preview
```

---

## 📁 项目结构

```
tianjin_students_testing_system/
├── src/
│   ├── components/
│   │   ├── Quiz/           # 答题组件
│   │   │   └── Quiz.tsx
│   │   ├── Dashboard/      # 学习面板
│   │   │   └── Dashboard.tsx
│   │   ├── Analysis/       # 学习分析
│   │   │   └── AnalysisPanel.tsx
│   │   ├── Game/           # 游戏组件
│   │   │   └── MathCastleGame.tsx
│   │   └── User/           # 用户组件
│   │       ├── UserSelector.tsx
│   │       ├── Leaderboard.tsx
│   │       └── UserStyles.css
│   ├── data/
│   │   ├── types.ts                    # 类型定义
│   │   ├── index.ts                    # 题库导出
│   │   ├── grade5LowerChinese.ts       # 五年级下语文 (324 题)
│   │   ├── grade5LowerEnglish.ts       # 五年级下英语 (300 题)
│   │   ├── grade5LowerMath.ts          # 五年级下数学 (351 题)
│   │   ├── grade6UpperChinese.ts       # 六年级上语文 (100 题)
│   │   ├── grade6UpperEnglish.ts       # 六年级上英语 (100 题)
│   │   ├── grade6UpperMath.ts          # 六年级上数学 (100 题)
│   │   ├── grade6LowerChinese.ts       # 六年级下语文 (100 题)
│   │   ├── grade6LowerEnglish.ts       # 六年级下英语 (100 题)
│   │   └── grade6LowerMath.ts          # 六年级下数学 (100 题)
│   ├── engine/
│   │   ├── quizEngine.ts     # 出题/判题引擎
│   │   ├── rewardSystem.ts   # 奖励系统
│   │   ├── userManager.ts    # 用户管理
│   │   └── analysisEngine.ts # 分析引擎
│   ├── assets/             # 静态资源
│   ├── App.tsx             # 主应用组件
│   ├── App.css             # 应用样式
│   ├── index.css           # 全局样式
│   └── main.tsx            # 入口文件
├── public/                 # 公共资源
├── dist/                   # 构建输出
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 📖 使用说明

### 1. 创建用户
- 点击右上角头像区域
- 选择「创建新用户」
- 输入用户名并确认

### 2. 选择科目和年级
- 在 Dashboard 选择年级（五年级下/六年级）
- 六年级可选择学期（上册/下册）
- 选择科目（语文/数学/英语/全部）

### 3. 开始答题
- 点击「开始答题」按钮
- 阅读题目，选择答案或输入答案
- 提交后查看答案解析

### 4. 查看学习分析
- 正确率统计
- 知识点掌握情况
- 学习趋势图表

### 5. 切换用户
- 点击当前用户头像
- 选择其他用户或创建新用户

---

## 📊 题库详情

### 五年级下（共 975 题）
| 科目 | 题量 | 知识点示例 |
|------|------|------------|
| 语文 | 324 | 古诗积累、词语书写、病句辨析、修辞手法 |
| 英语 | 300 | 职业单词、基础语法、时态、句型 |
| 数学 | 351 | 小数乘除、分数运算、方程、几何 |

### 六年级上（共 300 题）
| 科目 | 题量 | 知识点示例 |
|------|------|------------|
| 语文 | 100 | 古诗文、阅读理解、基础知识 |
| 英语 | 100 | 词汇、语法、阅读理解 |
| 数学 | 100 | 分数、百分数、几何 |

### 六年级下（共 300 题）
| 科目 | 题量 | 知识点示例 |
|------|------|------------|
| 语文 | 100 | 古诗文、阅读理解、基础知识 |
| 英语 | 100 | 词汇、语法、阅读理解 |
| 数学 | 100 | 综合复习、应用题 |

---

## 🎨 设计特点

### 色彩系统
- 主色调：柔和蓝色系 (#4A90E2)
- 背景色：浅灰白色 (#F8F9FA)
- 文字色：深灰色 (#333333)

### 视觉优化
- 圆角设计 (8px/12px)
- 轻微阴影增强层次
- 柔和过渡动画
- 统一的图标风格

### 响应式断点
- 768px：平板适配
- 480px：手机适配
- 360px：小屏手机适配

---

## 📦 部署

### 本地部署
```bash
npm run build
# 将 dist/ 目录部署到 Web 服务器
```

### Nginx 配置
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/math-learning/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Docker 部署
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
```

---

## 🔧 开发

### 添加新题库
1. 在 `src/data/` 目录创建新的题库文件
2. 遵循 `Question` 接口定义
3. 在 `index.ts` 中导出

### 题目格式
```typescript
{
  id: 'g5l_m_b_001',           // 唯一标识
  type: 'math',                // 科目类型
  difficulty: 'bronze',        // 难度等级
  content: '0.25 × 4 = ( )。',  // 题目内容
  options: ['1', '0.1'],       // 选择题选项
  answer: '1',                 // 正确答案
  explanation: '0.25 × 4 = 1', // 解析
  points: 10,                  // 分值
  knowledgePoint: '小数乘法',  // 知识点
  grade: 5,                    // 年级
  semester: 'lower'            // 学期
}
```

---

## ⚠️ 注意事项

- 数据存储在本地浏览器，清除缓存会丢失进度
- 建议定期导出学习数据备份
- 推荐每天学习时间不超过 60 分钟
- 游戏时间需通过学习获得

---

## 📝 更新日志

### v1.0.0 (2026-03)
- ✅ 新增五年级下语文 324 题
- ✅ 新增五年级下英语 300 题
- ✅ 新增五年级下数学 351 题
- ✅ 新增六年级上下册各 300 题
- ✅ 全新 UI 设计，响应式适配
- ✅ 清除答题记录功能
- ✅ 学习分析面板优化

---

## 📄 许可证

MIT License

---

🤖 Generated with [Claude Code]
