import { useState } from 'react';
import TopBar from '@/components/layout/TopBar';
import ComponentsSidebar from '@/components/layout/ComponentsSidebar';
import { components, componentCategories, categoryLabels } from '@/config/components.config';
import GettingStarted from '@/components/sections/GettingStarted';
import TextSection from '@/components/sections/TextSection';
import CardsSection from '@/components/sections/CardsSection';
import ButtonsSection from '@/components/sections/ButtonsSection';
import ImagesSection from '@/components/sections/ImagesSection';
import ScrollSection from '@/components/sections/ScrollSection';
import LoadersSection from '@/components/sections/LoadersSection';
import CursorSection from '@/components/sections/CursorSection';
import BackgroundsSection from '@/components/sections/BackgroundsSection';

const ComponentsPage = () => {
  const [search, setSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: '#060608' }}>
      <TopBar
        search={search}
        onSearchChange={setSearch}
        placeholder="Search components..."
        rightText={`${components.length} components`}
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <ComponentsSidebar
        items={components}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="lg:ml-[220px] pt-12">
        <main className="max-w-5xl mx-auto px-8 pb-24 pt-8">
          <GettingStarted />
          <TextSection />
          <CardsSection />
          <ButtonsSection />
          <ImagesSection />
          <ScrollSection />
          <LoadersSection />
          <CursorSection />
          <BackgroundsSection />
        </main>
      </div>
    </div>
  );
};

export default ComponentsPage;
