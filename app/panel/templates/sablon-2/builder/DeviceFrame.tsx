'use client';

import { ReactNode } from 'react';
import { DeviceMode } from './types';

export const MOBILE_PREVIEW_WIDTH = 375;

export default function DeviceFrame({ device, children }: { device: DeviceMode; children: ReactNode }) {
  if (device === 'mobile') {
    return (
      <div className="flex h-full min-h-0 justify-center overflow-hidden bg-slate-200">
        <div
          className="flex h-full min-h-0 flex-col overflow-hidden border-x border-gray-300 bg-white shadow-xl"
          style={{ width: MOBILE_PREVIEW_WIDTH, maxWidth: '100%' }}
        >
          <div className="flex h-6 shrink-0 items-center justify-center border-b border-gray-200 bg-gray-50">
            <div className="h-1 w-12 rounded-full bg-gray-300" />
          </div>
          <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full min-h-0 overflow-hidden bg-slate-100">
      {children}
    </div>
  );
}
