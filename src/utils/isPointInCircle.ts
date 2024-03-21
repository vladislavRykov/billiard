function isPointInCircle(
  point: { x: number; y: number },
  circleCenter: { x: number; y: number },
  radius: number,
) {
  // Вычисляем расстояние между точкой и центром окружности
  const distance = Math.sqrt(
    Math.pow(point.x - circleCenter.x, 2) + Math.pow(point.y - circleCenter.y, 2),
  );

  // Точка принадлежит кругу, если расстояние до центра меньше или равно радиусу круга
  return distance <= radius;
}
export default isPointInCircle;
