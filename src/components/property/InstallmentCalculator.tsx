'use client';

import { useState } from 'react';

interface InstallmentCalculatorProps {
  totalPrice: number;
}

export default function InstallmentCalculator({ totalPrice }: InstallmentCalculatorProps) {
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [years, setYears] = useState(5);
  const [interestRate, setInterestRate] = useState(0);

  const downPayment = (totalPrice * downPaymentPercent) / 100;
  const remaining = totalPrice - downPayment;
  const months = years * 12;
  const monthlyRate = interestRate / 100 / 12;
  const monthlyPayment =
    interestRate > 0
      ? (remaining * (monthlyRate * Math.pow(1 + monthlyRate, months))) /
        (Math.pow(1 + monthlyRate, months) - 1)
      : remaining / months;
  const totalPaid = downPayment + monthlyPayment * months;

  return (
    <div className="bg-white rounded-xl border p-6">
      <h2 className="text-xl font-bold text-navy mb-4">حاسبة التقسيط</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm text-gray mb-1">نسبة المقدم %</label>
          <input
            type="number"
            min="0"
            max="90"
            value={downPaymentPercent}
            onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
            className="w-full px-4 py-2 rounded-lg border"
          />
        </div>
        <div>
          <label className="block text-sm text-gray mb-1">عدد السنوات</label>
          <input
            type="number"
            min="1"
            max="20"
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full px-4 py-2 rounded-lg border"
          />
        </div>
        <div>
          <label className="block text-sm text-gray mb-1">معدل الفائدة السنوي %</label>
          <input
            type="number"
            min="0"
            step="0.5"
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full px-4 py-2 rounded-lg border"
          />
        </div>
      </div>
      <div className="border-t pt-4 space-y-2">
        <p className="flex justify-between">
          <span className="text-gray">المقدم:</span>
          <span className="font-semibold">{downPayment.toLocaleString('ar-EG')} جنيه</span>
        </p>
        <p className="flex justify-between">
          <span className="text-gray">القسط الشهري:</span>
          <span className="font-semibold text-gold">
            {Math.round(monthlyPayment).toLocaleString('ar-EG')} جنيه
          </span>
        </p>
        <p className="flex justify-between">
          <span className="text-gray">إجمالي المدفوع:</span>
          <span className="font-semibold">{Math.round(totalPaid).toLocaleString('ar-EG')} جنيه</span>
        </p>
      </div>
    </div>
  );
}
