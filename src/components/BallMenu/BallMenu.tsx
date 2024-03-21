import React from 'react';
import s from './BallMenu.module.css';

const BallMenu: React.FC<{
  onColorChange: (color: string) => void;
  position: { left: number; top: number };
}> = ({ onColorChange, position }) => {
  const handleColorChange = (color: string) => {
    onColorChange(color);
  };
  const colors = ['red', 'green', 'blue'];
  return (
    <div
      className={s.wrapper}
      style={{ position: 'absolute', left: position.left, top: position.top }}>
      {colors.map((color) => (
        <button
          className={s.btn}
          style={{ backgroundColor: color }}
          onClick={() => handleColorChange(color)}>
          {color.charAt(0).toUpperCase() + color.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default BallMenu;
