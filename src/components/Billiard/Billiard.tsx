import React, { useEffect, useRef, useState } from 'react';
import BallMenu from '../BallMenu/BallMenu';
import getMousePos from '../../utils/getMousePosition';
import isPointInCircle from '../../utils/isPointInCircle';
import s from './Billiard.module.css';

const Billiard = () => {
  const [selectedBallIndex, setSelectedBallIndex] = useState<number | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [balls, setBalls] = useState([
    { x: 100, y: 100, dx: 0, dy: 0, radius: 30, color: 'black' },
    { x: 200, y: 200, dx: 0, dy: 0, radius: 30, color: 'black' },
    { x: 150, y: 300, dx: 0, dy: 0, radius: 60, color: 'black' },
    { x: 300, y: 300, dx: 0, dy: 0, radius: 55, color: 'black' },
    { x: 800, y: 400, dx: 0, dy: 0, radius: 50, color: 'black' },
  ]);

  const mouseInfo = { lastX: 0, lastY: 0, lastTimeStamp: 0, speedX: 0, speedY: 0 };

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const drawBall = (
      context: CanvasRenderingContext2D | null | undefined,
      x: number,
      y: number,
      radius: number,
      color: string,
      ballIdx: number,
    ) => {
      if (!context) return;

      //Main circle
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2, false);
      context.fillStyle = color;
      context.fill();
      context.closePath();

      //Decor circle
      context.beginPath();
      context.arc(x, y, radius / 2, 0, Math.PI * 2, false);
      context.fillStyle = 'white';
      context.fill();
      context.closePath();

      //Circle number
      context.beginPath();
      context.font = 'bold 16px Arial';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillStyle = 'black';
      context.fillText(ballIdx.toString(), x, y);
      context.closePath();
    };
    const animate = () => {
      const canvas = canvasRef.current;
      const context = canvas?.getContext('2d');

      if (context) {
        const canvasW = context?.canvas.width;
        const canvasH = context?.canvas.height;
        context?.clearRect(0, 0, canvasW, canvasH);

        balls.forEach((ball, idx) => {
          const { x, y, dx, dy, radius, color } = ball;
          let newDx = dx;
          let newDy = dy;
          drawBall(context, x, y, radius, color, idx + 1);

          if (x >= canvasW - radius || x <= radius) {
            newDx = -dx;
          }

          if (y >= canvasH - radius || y <= radius) {
            newDy = -dy;
          }

          balls[idx].dx = Math.abs(newDx * 0.994) < 0.05 ? 0 : newDx * 0.994;
          balls[idx].dy = Math.abs(newDy * 0.994) < 0.05 ? 0 : newDy * 0.994;
          balls[idx].x = x + newDx;
          balls[idx].y = y + newDy;

          for (let i = 0; i < balls.length; i++) {
            for (let j = i + 1; j < balls.length; j++) {
              const dx = balls[j].x - balls[i].x;
              const dy = balls[j].y - balls[i].y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              const minDistance = balls[i].radius + balls[j].radius;

              if (distance < minDistance) {
                const angle = Math.atan2(dy, dx);
                const targetX = balls[i].x + Math.cos(angle) * minDistance;
                const targetY = balls[i].y + Math.sin(angle) * minDistance;
                const ax = (targetX - balls[j].x) * 0.1;
                const ay = (targetY - balls[j].y) * 0.1;

                balls[i].dx -= ax;
                balls[i].dy -= ay;
                balls[j].dx *= 0.9;
                balls[j].dy *= 0.9;
              }
            }
          }
        });
      }
      const timerId = requestAnimationFrame(animate);
      return timerId;
    };
    const timerId = animate();
    return () => cancelAnimationFrame(timerId);
  }, [balls]);

  const onBallMove = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const mousePos = getMousePos(canvas, e);

    const currentTimeStamp = Date.now();
    const deltaTime = currentTimeStamp - mouseInfo.lastTimeStamp;

    mouseInfo.speedX = (mousePos.x - mouseInfo.lastX) / deltaTime;
    mouseInfo.speedY = (mousePos.y - mouseInfo.lastY) / deltaTime;

    mouseInfo.lastX = mousePos.x;
    mouseInfo.lastY = mousePos.y;
    mouseInfo.lastTimeStamp = currentTimeStamp;
    balls.forEach((ball, idx) => {
      if (
        isPointInCircle({ x: mousePos.x, y: mousePos.y }, { x: ball.x, y: ball.y }, ball.radius)
      ) {
        balls[idx].dx = mouseInfo.speedX;
        balls[idx].dy = mouseInfo.speedY;
      }
    });
  };

  const handleBallClick = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const mousePos = getMousePos(canvas, e);

    const clickedBallIndex = balls.findIndex((ball) => {
      const dx = ball.x - mousePos.x;
      const dy = ball.y - mousePos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance <= ball.radius;
    });

    if (clickedBallIndex !== -1) {
      setSelectedBallIndex(clickedBallIndex);
      setMenuPosition({ x: mousePos.x, y: mousePos.y });
    }
  };

  const handleColorChange = (color: string) => {
    if (selectedBallIndex !== null) {
      const newBalls = [...balls];
      newBalls[selectedBallIndex].color = color;
      setBalls(newBalls);
      setSelectedBallIndex(null);
    }
  };

  return (
    <div>
      <canvas
        onMouseMove={onBallMove}
        onMouseDown={handleBallClick}
        width={1200}
        height={600}
        ref={canvasRef}
        className={s.canvas}></canvas>
      {selectedBallIndex !== null && (
        <BallMenu
          position={{ left: menuPosition.x, top: menuPosition.y }}
          onColorChange={handleColorChange}
        />
      )}
    </div>
  );
};

export default Billiard;
