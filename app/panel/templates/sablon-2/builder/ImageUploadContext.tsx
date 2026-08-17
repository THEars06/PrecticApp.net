'use client';

import { createContext, ReactNode, useCallback, useContext, useState } from 'react';
import ImageCropModal from '../../components/ImageCropModal';

type CropRequest = {
  file: File;
  defaultAspect?: number;
  lockAspect?: boolean;
  onComplete: (url: string, width: number, height: number) => void;
  onCancel?: () => void;
};

type ImageUploadContextValue = {
  requestCrop: (request: CropRequest) => void;
};

const ImageUploadContext = createContext<ImageUploadContextValue | null>(null);

export function ImageUploadProvider({ children }: { children: ReactNode }) {
  const [cropRequest, setCropRequest] = useState<CropRequest | null>(null);

  const requestCrop = useCallback((request: CropRequest) => {
    setCropRequest(request);
  }, []);

  const close = useCallback(() => {
    setCropRequest((current) => {
      current?.onCancel?.();
      return null;
    });
  }, []);

  return (
    <ImageUploadContext.Provider value={{ requestCrop }}>
      {children}
      {cropRequest ? (
        <ImageCropModal
          file={cropRequest.file}
          defaultAspect={cropRequest.defaultAspect}
          lockAspect={cropRequest.lockAspect}
          onClose={close}
          onComplete={(url, width, height) => {
            cropRequest.onComplete(url, width, height);
            close();
          }}
        />
      ) : null}
    </ImageUploadContext.Provider>
  );
}

export function useImageUpload() {
  const ctx = useContext(ImageUploadContext);
  if (!ctx) throw new Error('useImageUpload must be used within ImageUploadProvider');
  return ctx;
}
