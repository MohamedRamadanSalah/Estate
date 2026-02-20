import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PropertiesList from '@/components/properties/PropertiesList';
import PropertiesFilter from '@/components/properties/PropertiesFilter';

export const dynamic = 'force-dynamic';

export default function PropertiesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-5 md:py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-navy mb-4 md:mb-6">كل الوحدات العقارية</h1>
          <div className="flex flex-col lg:flex-row gap-5 md:gap-8">
            <aside className="lg:w-72 shrink-0">
              <PropertiesFilter />
            </aside>
            <div className="flex-1">
              <PropertiesList />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
