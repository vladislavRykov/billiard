export const ballsIsMoving = (
  balls: {
    x: number;
    y: number;
    dx: number;
    dy: number;
    radius: number;
    color: string;
  }[],
) => {
  let isBallsMoving = false;
  balls.forEach((ball) => {
    if (ball.dx === 0 && ball.dy === 0) {
      isBallsMoving = true;
    }
  });
  return isBallsMoving;
};
