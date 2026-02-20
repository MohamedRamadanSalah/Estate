'use client';

import { useState } from 'react';

interface City {
  id: number;
  nameAr: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
}

interface Governorate {
  id: number;
  nameAr: string;
  slug: string;
  cities: City[];
}

interface Props {
  governorates: Governorate[];
}

export default function CitiesManager({ governorates: initial }: Props) {
  const [governorates, setGovernorates] = useState(initial);
  const [newCity, setNewCity] = useState({ nameAr: '', governorateId: '' });
  const [loading, setLoading] = useState(false);

  const handleAddCity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCity.nameAr || !newCity.governorateId) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/cities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nameAr: newCity.nameAr,
          governorateId: parseInt(newCity.governorateId),
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const city = await res.json();
      setGovernorates((prev) =>
        prev.map((g) =>
          g.id === city.governorateId
            ? { ...g, cities: [...g.cities, city] }
            : g
        )
      );
      setNewCity({ nameAr: '', governorateId: '' });
    } catch (err) {
      alert('فشل: ' + String(err));
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (city: City) => {
    try {
      const res = await fetch(`/api/admin/cities/${city.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !city.isActive }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setGovernorates((prev) =>
        prev.map((g) => ({
          ...g,
          cities: g.cities.map((c) => (c.id === city.id ? updated : c)),
        }))
      );
    } catch {
      alert('فشل التحديث');
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleAddCity} className="bg-white rounded-xl shadow-lg p-6 max-w-md">
        <h2 className="text-lg font-bold text-navy mb-4">إضافة مدينة جديدة</h2>
        <div className="flex gap-2">
          <input
            value={newCity.nameAr}
            onChange={(e) => setNewCity({ ...newCity, nameAr: e.target.value })}
            placeholder="اسم المدينة"
            required
            className="flex-1 px-4 py-2 rounded-lg border"
          />
          <select
            value={newCity.governorateId}
            onChange={(e) => setNewCity({ ...newCity, governorateId: e.target.value })}
            required
            className="px-4 py-2 rounded-lg border"
          >
            <option value="">المحافظة</option>
            {governorates.map((g) => (
              <option key={g.id} value={g.id}>{g.nameAr}</option>
            ))}
          </select>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-gold text-navy rounded-lg hover:bg-copper"
          >
            إضافة
          </button>
        </div>
      </form>

      <div className="space-y-6">
        {governorates.map((gov) => (
          <div key={gov.id} className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-navy mb-4">{gov.nameAr}</h2>
            <ul className="space-y-2">
              {gov.cities.map((city) => (
                <li
                  key={city.id}
                  className={`flex justify-between items-center py-2 px-4 rounded-lg ${
                    city.isActive ? 'bg-gray-50' : 'bg-gray-200 opacity-60'
                  }`}
                >
                  <span>{city.nameAr}</span>
                  <button
                    onClick={() => toggleActive(city)}
                    type="button"
                    className={`px-3 py-1 rounded text-sm ${
                      city.isActive ? 'bg-success/20 text-success' : 'bg-gray-400 text-white'
                    }`}
                  >
                    {city.isActive ? 'نشط' : 'غير نشط'}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
