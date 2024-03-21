import React, { useCallback, useEffect, useRef, useState } from 'react';
import s from './App.module.css';
import isPointInCircle from './utils/isPointInCircle';
import getMousePos from './utils/getMousePosition';
import { ballsIsMoving } from './utils/ballsIsMoving';
import BallMenu from './components/BallMenu/BallMenu';
import Billiard from './components/Billiard/Billiard';

function App() {
  return (
    <div className={s.app}>
      <div className={s.background}>
        <Billiard />
      </div>
    </div>
  );
}

export default App;
