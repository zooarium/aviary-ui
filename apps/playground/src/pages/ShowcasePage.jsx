import React from 'react';
import PrimitivesSection from '../sections/PrimitivesSection';
import LayoutSection from '../sections/LayoutSection';
import DialogsSection from '../sections/DialogsSection';

export default function ShowcasePage() {
  return (
    <div className="container-xl py-4">
      <PrimitivesSection />
      <LayoutSection />
      <DialogsSection />
    </div>
  );
}
