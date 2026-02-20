'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, Phone, MapPin, Clock, Send, CheckCircle2,
  User, Mail, Building2, ChevronLeft, ChevronRight,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MobileTabBar from '@/components/layout/MobileTabBar';
import ScrollProgress from '@/components/ui/ScrollProgress';
import CustomCursor from '@/components/ui/CustomCursor';
import ToastProvider from '@/components/ui/ToastProvider';

const steps = [
  { id: 1, label: 'المعلومات الشخصية' },
  { id: 2, label: 'تفاصيل الاستفسار' },
  { id: 3, label: 'إرسال' },
];

export default function ContactPage() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '201234567890';
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    propertyType: '',
    budget: '',
    message: '',
  });

  const handleChange = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = () => {
    // Build WhatsApp message from form data
    const msg = `مرحباً، أنا ${formData.name}%0A` +
      `${formData.email ? `البريد: ${formData.email}%0A` : ''}` +
      `${formData.phone ? `الهاتف: ${formData.phone}%0A` : ''}` +
      `${formData.propertyType ? `نوع العقار المطلوب: ${formData.propertyType}%0A` : ''}` +
      `${formData.budget ? `الميزانية: ${formData.budget}%0A` : ''}` +
      `${formData.message ? `الرسالة: ${formData.message}` : ''}`;
    window.open(`https://wa.me/${whatsappNumber}?text=${msg}`, '_blank');
    setSubmitted(true);
  };

  const canProceed = step === 1
    ? formData.name.trim().length > 0
    : step === 2
      ? formData.message.trim().length > 0
      : true;

  const inputClasses =
    'w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all';

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <ScrollProgress />
      <CustomCursor />
      <ToastProvider />
      <Navbar />
      <main className="flex-1 pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gold/10 to-copper/10 rounded-full text-gold text-sm font-semibold mb-4">
              <MessageSquare className="w-4 h-4" />
              تواصل معنا
            </span>
            <h1 className="text-3xl md:text-5xl font-bold font-playfair text-navy mb-3">
              نحن هنا لمساعدتك
            </h1>
            <p className="text-gray-500 max-w-lg mx-auto">
              فريقنا مستعد للرد على جميع استفساراتك ومساعدتك في العثور على عقارك المثالي
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact info cards */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              {[
                {
                  icon: Phone,
                  title: 'اتصل بنا',
                  desc: 'متاحون للرد على مكالماتكم',
                  value: whatsappNumber,
                  color: 'from-emerald-500 to-green-600',
                },
                {
                  icon: MapPin,
                  title: 'العنوان',
                  desc: 'القاهرة، مصر',
                  value: 'القاهرة الجديدة - التجمع الخامس',
                  color: 'from-blue-500 to-indigo-600',
                },
                {
                  icon: Clock,
                  title: 'ساعات العمل',
                  desc: 'السبت - الخميس',
                  value: '9:00 صباحاً - 9:00 مساءً',
                  color: 'from-amber-500 to-orange-600',
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shrink-0`}>
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-navy text-sm">{item.title}</h3>
                      <p className="text-xs text-gray-500 mb-1">{item.desc}</p>
                      <p className="text-sm font-semibold text-navy">{item.value}</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Quick WhatsApp CTA */}
              <motion.a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-3 w-full py-4 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                تواصل مباشرة عبر واتساب
              </motion.a>
            </motion.div>

            {/* Multi-step form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100"
            >
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
                      className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5"
                    >
                      <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-navy mb-2">تم إرسال رسالتك!</h3>
                    <p className="text-gray-500 text-sm mb-6">
                      شكراً لتواصلك معنا. سيتم الرد عليك في أقرب وقت ممكن
                    </p>
                    <button
                      onClick={() => { setSubmitted(false); setStep(1); setFormData({ name: '', email: '', phone: '', propertyType: '', budget: '', message: '' }); }}
                      className="text-gold font-semibold text-sm hover:underline"
                    >
                      إرسال رسالة أخرى
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key="form">
                    {/* Progress steps */}
                    <div className="flex items-center justify-center gap-3 mb-8">
                      {steps.map((s, i) => (
                        <div key={s.id} className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                                step >= s.id
                                  ? 'bg-gradient-to-br from-gold to-copper text-navy'
                                  : 'bg-gray-100 text-gray-400'
                              }`}
                            >
                              {step > s.id ? <CheckCircle2 className="w-4 h-4" /> : s.id}
                            </div>
                            <span className={`text-xs hidden sm:inline ${step >= s.id ? 'text-navy font-semibold' : 'text-gray-400'}`}>
                              {s.label}
                            </span>
                          </div>
                          {i < steps.length - 1 && (
                            <div className={`w-12 h-0.5 ${step > s.id ? 'bg-gold' : 'bg-gray-200'}`} />
                          )}
                        </div>
                      ))}
                    </div>

                    <AnimatePresence mode="wait">
                      {step === 1 && (
                        <motion.div
                          key="step1"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-4"
                        >
                          <h3 className="text-lg font-bold text-navy mb-4">المعلومات الشخصية</h3>
                          <div className="floating-label-group">
                            <div className="relative">
                              <User className="absolute right-3 top-3.5 w-4 h-4 text-gray-400" />
                              <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                placeholder="الاسم الكامل *"
                                className={`${inputClasses} pr-10`}
                              />
                            </div>
                          </div>
                          <div className="relative">
                            <Mail className="absolute right-3 top-3.5 w-4 h-4 text-gray-400" />
                            <input
                              type="email"
                              value={formData.email}
                              onChange={(e) => handleChange('email', e.target.value)}
                              placeholder="البريد الإلكتروني (اختياري)"
                              className={`${inputClasses} pr-10`}
                            />
                          </div>
                          <div className="relative">
                            <Phone className="absolute right-3 top-3.5 w-4 h-4 text-gray-400" />
                            <input
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => handleChange('phone', e.target.value)}
                              placeholder="رقم الهاتف (اختياري)"
                              className={`${inputClasses} pr-10`}
                            />
                          </div>
                        </motion.div>
                      )}

                      {step === 2 && (
                        <motion.div
                          key="step2"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-4"
                        >
                          <h3 className="text-lg font-bold text-navy mb-4">تفاصيل الاستفسار</h3>
                          <div className="relative">
                            <Building2 className="absolute right-3 top-3.5 w-4 h-4 text-gray-400" />
                            <select
                              value={formData.propertyType}
                              onChange={(e) => handleChange('propertyType', e.target.value)}
                              className={`${inputClasses} pr-10 appearance-none`}
                            >
                              <option value="">نوع العقار المطلوب</option>
                              <option value="شقة">شقة</option>
                              <option value="فيلا">فيلا</option>
                              <option value="دوبلكس">دوبلكس</option>
                              <option value="بنتهاوس">بنتهاوس</option>
                              <option value="شاليه">شاليه</option>
                              <option value="أرض">أرض</option>
                            </select>
                          </div>
                          <select
                            value={formData.budget}
                            onChange={(e) => handleChange('budget', e.target.value)}
                            className={`${inputClasses} appearance-none`}
                          >
                            <option value="">الميزانية التقريبية</option>
                            <option value="أقل من مليون">أقل من مليون جنيه</option>
                            <option value="1 - 3 مليون">1 - 3 مليون جنيه</option>
                            <option value="3 - 5 مليون">3 - 5 مليون جنيه</option>
                            <option value="5 - 10 مليون">5 - 10 مليون جنيه</option>
                            <option value="أكثر من 10 مليون">أكثر من 10 مليون جنيه</option>
                          </select>
                          <textarea
                            value={formData.message}
                            onChange={(e) => handleChange('message', e.target.value)}
                            placeholder="رسالتك أو استفسارك *"
                            rows={4}
                            className={inputClasses}
                          />
                        </motion.div>
                      )}

                      {step === 3 && (
                        <motion.div
                          key="step3"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-4"
                        >
                          <h3 className="text-lg font-bold text-navy mb-4">مراجعة وإرسال</h3>
                          <div className="bg-cream rounded-xl p-5 space-y-3">
                            {[
                              { label: 'الاسم', value: formData.name },
                              { label: 'البريد', value: formData.email || '-' },
                              { label: 'الهاتف', value: formData.phone || '-' },
                              { label: 'نوع العقار', value: formData.propertyType || '-' },
                              { label: 'الميزانية', value: formData.budget || '-' },
                            ].map((item) => (
                              <div key={item.label} className="flex justify-between text-sm">
                                <span className="text-gray-500">{item.label}</span>
                                <span className="font-semibold text-navy">{item.value}</span>
                              </div>
                            ))}
                            <div className="pt-3 border-t border-gray-200">
                              <p className="text-xs text-gray-500 mb-1">الرسالة</p>
                              <p className="text-sm text-navy">{formData.message}</p>
                            </div>
                          </div>
                          <p className="text-xs text-gray-400 text-center">
                            سيتم فتح واتساب لإرسال رسالتك مباشرة لفريقنا
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Navigation */}
                    <div className="flex justify-between items-center mt-8">
                      {step > 1 ? (
                        <button
                          onClick={() => setStep((s) => s - 1)}
                          className="flex items-center gap-1 text-sm text-gray-500 hover:text-navy transition-colors"
                        >
                          <ChevronRight className="w-4 h-4" />
                          رجوع
                        </button>
                      ) : (
                        <div />
                      )}
                      {step < 3 ? (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setStep((s) => s + 1)}
                          disabled={!canProceed}
                          className="flex items-center gap-1 px-6 py-3 btn-gold-shimmer text-navy font-bold rounded-xl text-sm disabled:opacity-40"
                        >
                          التالي
                          <ChevronLeft className="w-4 h-4" />
                        </motion.button>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleSubmit}
                          className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white font-bold rounded-xl text-sm hover:bg-emerald-600 transition-colors"
                        >
                          <Send className="w-4 h-4" />
                          إرسال عبر واتساب
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
      <MobileTabBar />
    </div>
  );
}
