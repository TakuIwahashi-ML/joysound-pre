'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store';

interface ReduxProvidersProps {
  children: React.ReactNode;
}

// 🎯 **Redux統一版のProvider**
export function ReduxProviders({ children }: ReduxProvidersProps) {
  return <Provider store={store}>{children}</Provider>;
}
