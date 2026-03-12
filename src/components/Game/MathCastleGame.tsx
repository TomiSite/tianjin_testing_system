import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

interface MathCastleGameProps {
  gameTime: number;
  onGameEnd: () => void;
}

interface CustomScene extends Phaser.Scene {
  player?: Phaser.GameObjects.Ellipse;
  cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  gems?: Phaser.GameObjects.Ellipse[];
  gemCount?: number;
  gemText?: Phaser.GameObjects.Text;
}

export const MathCastleGame: React.FC<MathCastleGameProps> = ({
  gameTime,
  onGameEnd,
}) => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 倒计时
    const remainingTime = Math.floor(gameTime * 60); // 转换为秒
    localStorage.setItem('gameEndTime', String(Date.now() + remainingTime * 1000));

    // 配置游戏
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: containerRef.current,
      backgroundColor: '#1a1a2e',
      scene: {
        preload: preload,
        create: create,
        update: update,
      },
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false,
        },
      },
    };

    gameRef.current = new Phaser.Game(config);

    return () => {
      gameRef.current?.destroy(true);
    };
  }, [gameTime]);

  return (
    <div className="game-container">
      <div ref={containerRef} />
      <div className="game-ui">
        <button onClick={onGameEnd} className="exit-btn">
          退出游戏
        </button>
      </div>
    </div>
  );
};

// Phaser 场景函数
function preload(this: Phaser.Scene) {
  // 这里可以加载游戏素材
}

function create(this: CustomScene) {
  // 创建城堡背景
  this.add.rectangle(400, 300, 800, 600, 0x1a1a2e);

  // 创建城堡轮廓
  const castle = this.add.rectangle(400, 400, 600, 300, 0x4a3728);
  castle.setStrokeStyle(4, 0xffd700);

  // 创建玩家角色（用圆形代替）
  const player = this.add.ellipse(100, 450, 40, 40, 0x00ff00);
  this.physics.add.existing(player);

  // 添加文字说明
  const title = this.add.text(400, 100, '数学城堡冒险', {
    fontSize: '32px',
    color: '#ffd700',
    fontStyle: 'bold',
  });
  title.setOrigin(0.5);

  const instruction = this.add.text(400, 150, '使用方向键移动角色', {
    fontSize: '18px',
    color: '#ffffff',
  });
  instruction.setOrigin(0.5);

  // 添加控制器
  const cursors = this.input.keyboard?.createCursorKeys();

  // 保存玩家引用以便在 update 中访问
  this.player = player;
  this.cursors = cursors;

  // 创建宝石
  const gems: Phaser.GameObjects.Ellipse[] = [];
  for (let i = 0; i < 5; i++) {
    const gem = this.add.ellipse(
      200 + i * 100,
      200 + Math.sin(i) * 50,
      20,
      20,
      0xff00ff
    );
    this.physics.add.existing(gem);
    gems.push(gem);
  }
  this.gems = gems;
  this.gemCount = 0;

  // 添加宝石计数文字
  this.gemText = this.add.text(20, 20, '宝石：0/5', {
    fontSize: '20px',
    color: '#ffd700',
  });
}

function update(this: CustomScene) {
  const player = this.player;
  const cursors = this.cursors;
  const gems = this.gems;
  const gemText = this.gemText;

  if (!player || !cursors || !player.body) return;

  const body = player.body as Phaser.Physics.Arcade.Body;

  // 玩家移动
  const speed = 5;
  if (cursors.left?.isDown) {
    body.setVelocityX(-speed);
  } else if (cursors.right?.isDown) {
    body.setVelocityX(speed);
  } else {
    body.setVelocityX(0);
  }

  if (cursors.up?.isDown) {
    body.setVelocityY(-speed);
  } else if (cursors.down?.isDown) {
    body.setVelocityY(speed);
  } else {
    body.setVelocityY(0);
  }

  // 边界检测
  player.x = Phaser.Math.Clamp(player.x, 20, 780);
  player.y = Phaser.Math.Clamp(player.y, 20, 580);

  // 检测宝石收集
  if (gems) {
    for (let i = gems.length - 1; i >= 0; i--) {
      const gem = gems[i];
      const dist = Phaser.Math.Distance.Between(player.x, player.y, gem.x, gem.y);

      if (dist < 30) {
        gem.destroy();
        gems.splice(i, 1);
        this.gemCount = (this.gemCount || 0) + 1;

        if (gemText) {
          gemText.setText(`宝石：${this.gemCount}/5`);
        }

        if (this.gemCount === 5) {
          // 收集所有宝石，显示胜利文字
          const victoryText = this.add.text(400, 500, '恭喜你！收集了所有宝石！', {
            fontSize: '24px',
            color: '#00ff00',
            fontStyle: 'bold',
          });
          victoryText.setOrigin(0.5);
        }
      }
    }
  }
}

export default MathCastleGame;
