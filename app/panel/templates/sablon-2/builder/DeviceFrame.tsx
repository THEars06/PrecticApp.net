'use client';

import { ReactNode } from 'react';
import { DeviceMode } from './types';

export default function DeviceFrame({ device, children }: { device: DeviceMode; children: ReactNode }) {
  return (
    <div className="h-full min-h-0 overflow-hidden bg-slate-100">
      <div className={device === 'mobile' ? 'mx-auto h-full min-h-0 max-w-[375px] overflow-hidden border-x border-gray-300 bg-white' : 'h-full min-h-0 overflow-hidden'}>
        {children}
      </div>
    </div>
  );
}
