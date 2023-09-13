import React from 'react';

export const allowDrop = (ev: React.DragEvent) => {
  ev.preventDefault();
};

export const drag = (ev: React.DragEvent) => {
  ev.dataTransfer.setData('drag_info', ev.currentTarget.id);
};

export const drop = (ev: React.DragEvent) => {
  ev.preventDefault();
  const data = ev.dataTransfer.getData('drag_info');
  const target = ev.currentTarget;
  target.appendChild(document.getElementById(data)!);
};
