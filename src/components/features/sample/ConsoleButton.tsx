'use client';
import React from 'react';
import { Button } from '@/components/atoms/samples/Button';

export const ConsoleButton = () => {
  return (
    <div>
      <p>ConsoleButtonです</p>
      <Button
        onClick={() => console.log('ボタンがクリックされました')}
        label="ボタン"
        variant="primary"
      />
    </div>
  );
};
