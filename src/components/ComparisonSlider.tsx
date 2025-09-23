'use client';

import React, { useEffect } from 'react';
import { ReactCompareSlider, ReactCompareSliderImage, useReactCompareSliderRef } from 'react-compare-slider';

interface ComparisonSliderProps {
  beforeImage: string;
  afterImage: string;
  className?: string;
}

export default function ComparisonSlider({ beforeImage, afterImage, className = '' }: ComparisonSliderProps) {
  const reactCompareSliderRef = useReactCompareSliderRef();

  React.useEffect(() => {
    const fireTransition = async () => {
      await new Promise(resolve => setTimeout(() => {
        reactCompareSliderRef.current?.setPosition(90);
        resolve(true);
      }, 750));
      await new Promise(resolve => setTimeout(() => {
        reactCompareSliderRef.current?.setPosition(10);
        resolve(true);
      }, 750));
      await new Promise(resolve => setTimeout(() => {
        reactCompareSliderRef.current?.setPosition(50);
        resolve(true);
      }, 750));
    };
    fireTransition();
  }, []);

  return (
    <div className={`relative ${className}`}>
      <ReactCompareSlider
        ref={reactCompareSliderRef}
        itemOne={
          <ReactCompareSliderImage
            src={beforeImage}
            alt="Before"
          />
        }
        itemTwo={
          <ReactCompareSliderImage
            src={afterImage}
            alt="After"
            style={{
              filter: 'saturate(1.25) contrast(1.1) drop-shadow(2px 4px 6px black)'
            }}
          />
        }
        style={{
          width: '100%',
          height: '100%'
        }}
        transition="1s ease-out"
        changePositionOnHover={false}
        onlyHandleDraggable={true}
      />
    </div>
  );
}
