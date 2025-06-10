import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Scissors, Star, Phone, Mail, MapPin, ChevronLeft, ChevronRight, Check } from 'lucide-react';

const HairdresserBooking = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedStylist, setSelectedStylist] = useState(null);
  const [customerData, setCustomerData] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isAnimating, setIsAnimating] = useState(false);

  // Dane salonowe
  const services = [
    { id: 1, name: 'Strzyżenie damskie', price: 80, duration: 45, icon: '✂️' },
    { id: 2, name: 'Strzyżenie męskie', price: 40, duration: 30, icon: '💇‍♂️' },
    { id: 3, name: 'Koloryzacja', price: 150, duration: 120, icon: '🎨' },
    { id: 4, name: 'Modelowanie', price: 60, duration: 60, icon: '💫' },
    { id: 5, name: 'Oczyszczanie twarzy', price: 100, duration: 90, icon: '✨' }
  ];

  const stylists = [
    { id: 1, name: 'Anna Kowalska', speciality: 'Strzyżenie i koloryzacja', rating: 4.9, avatar: '👩‍🦰' },
    { id: 2, name: 'Marta Nowak', speciality: 'Stylizacja i pielęgnacja', rating: 4.8, avatar: '👩‍🦱' },
    { id: 3, name: 'Kasia Wiśniewska', speciality: 'Trendy i metamorfozy', rating: 4.9, avatar: '👩‍🦳' }
  ];

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];

  // Funkcje pomocnicze
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDate = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    
    const days = [];
    
    // Puste komórki na początku
    for (let i = 0; i < startDate; i++) {
      days.push(null);
    }
    
    // Dni miesiąca
    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(year, month, i);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      days.push({
        date: i,
        fullDate: dayDate,
        isToday: dayDate.toDateString() === today.toDateString(),
        isPast: dayDate < today,
        isWeekend: dayDate.getDay() === 0 || dayDate.getDay() === 6
      });
    }
    
    return days;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('pl-PL', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const nextStep = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep(prev => prev + 1);
      setIsAnimating(false);
    }, 150);
  };

  const prevStep = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep(prev => prev - 1);
      setIsAnimating(false);
    }, 150);
  };

  const handleBooking = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceId: selectedService.id,
          stylistId: selectedStylist.id,
          date: selectedDate.toISOString().split('T')[0], // Format YYYY-MM-DD
          time: selectedTime,
          customerName: customerData.name,
          customerPhone: customerData.phone,
          customerEmail: customerData.email
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Rezerwacja utworzona:', result);
        setCurrentStep(6); // Przejdź do potwierdzenia
      } else {
        const error = await response.json();
        alert('Błąd podczas rezerwacji: ' + error.message);
      }
    } catch (error) {
      console.error('Błąd połączenia:', error);
      alert('Błąd połączenia z serwerem');
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return selectedService !== null;
      case 2: return selectedStylist !== null;
      case 3: return selectedDate !== null;
      case 4: return selectedTime !== null;
      case 5: return customerData.name && customerData.phone && customerData.email;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-purple-100">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Scissors className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Beauty Studio
                </h1>
                <p className="text-gray-600 text-sm">Profesjonalna pielęgnacja włosów</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center text-gray-600 text-sm">
                <MapPin className="w-4 h-4 mr-1" />
                ul. Piękna 15, Warszawa
              </div>
              <div className="flex items-center text-gray-600 text-sm mt-1">
                <Phone className="w-4 h-4 mr-1" />
                +48 123 456 789
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b border-purple-100">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  step <= currentStep 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-purple-500 text-white' 
                    : 'border-gray-300 text-gray-400'
                }`}>
                  {step < currentStep ? <Check className="w-5 h-5" /> : step}
                </div>
                {step < 5 && (
                  <div className={`w-16 h-1 mx-2 transition-all duration-300 ${
                    step < currentStep ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-600">
            <span>Usługa</span>
            <span>Fryzjer</span>
            <span>Data</span>
            <span>Godzina</span>
            <span>Dane</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'}`}>
          
          {/* Step 1: Wybór usługi */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Wybierz usługę</h2>
                <p className="text-gray-600">Co dziś dla Ciebie zrobimy?</p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => setSelectedService(service)}
                    className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                      selectedService?.id === service.id
                        ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg'
                        : 'border-gray-200 bg-white hover:border-purple-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-3">{service.icon}</div>
                      <h3 className="font-semibold text-gray-800 mb-2">{service.name}</h3>
                      <div className="flex justify-between items-center text-sm text-gray-600">
                        <span>{service.duration} min</span>
                        <span className="font-semibold text-purple-600">{service.price} zł</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Wybór fryzjera */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Wybierz fryzjera</h2>
                <p className="text-gray-600">Nasi doświadczeni specjaliści</p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                {stylists.map((stylist) => (
                  <div
                    key={stylist.id}
                    onClick={() => setSelectedStylist(stylist)}
                    className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                      selectedStylist?.id === stylist.id
                        ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg'
                        : 'border-gray-200 bg-white hover:border-purple-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-6xl mb-4">{stylist.avatar}</div>
                      <h3 className="font-semibold text-gray-800 mb-1">{stylist.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{stylist.speciality}</p>
                      <div className="flex items-center justify-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm font-semibold text-gray-700">{stylist.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Wybór daty */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Wybierz datę</h2>
                <p className="text-gray-600">Kiedy chcesz umówić wizytę?</p>
              </div>
              
              <div className="bg-white rounded-2xl shadow-lg p-6 max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {currentMonth.toLocaleDateString('pl-PL', { month: 'long', year: 'numeric' })}
                  </h3>
                  <button
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
                
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['Pon', 'Wto', 'Śro', 'Czw', 'Pią', 'Sob', 'Nie'].map(day => (
                    <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-2">
                  {getDaysInMonth(currentMonth).map((day, index) => (
                    <div key={index} className="aspect-square">
                      {day && (
                        <button
                          onClick={() => !day.isPast && setSelectedDate(day.fullDate)}
                          disabled={day.isPast}
                          className={`w-full h-full rounded-xl text-sm font-medium transition-all duration-200 ${
                            day.isPast
                              ? 'text-gray-300 cursor-not-allowed'
                              : selectedDate?.toDateString() === day.fullDate.toDateString()
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                              : day.isToday
                              ? 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                              : day.isWeekend
                              ? 'text-gray-400 hover:bg-gray-100'
                              : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                          }`}
                        >
                          {day.date}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Wybór godziny */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Wybierz godzinę</h2>
                {selectedDate && (
                  <p className="text-gray-600">{formatDate(selectedDate)}</p>
                )}
              </div>
              
              <div className="bg-white rounded-2xl shadow-lg p-6 max-w-3xl mx-auto">
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                        selectedTime === time
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                          : 'bg-gray-50 text-gray-700 hover:bg-purple-50 hover:text-purple-600 border border-gray-200'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Dane kontaktowe */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Twoje dane</h2>
                <p className="text-gray-600">Ostatni krok - podaj swoje dane kontaktowe</p>
              </div>
              
              <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Imię i nazwisko *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={customerData.name}
                        onChange={(e) => setCustomerData({...customerData, name: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Jan Kowalski"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefon *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        value={customerData.phone}
                        onChange={(e) => setCustomerData({...customerData, phone: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="+48 123 456 789"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={customerData.email}
                        onChange={(e) => setCustomerData({...customerData, email: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="jan@example.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Podsumowanie rezerwacji */}
                <div className="mt-8 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                  <h4 className="font-semibold text-gray-800 mb-3">Podsumowanie rezerwacji:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Usługa:</span>
                      <span className="font-medium">{selectedService?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fryzjer:</span>
                      <span className="font-medium">{selectedStylist?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Data:</span>
                      <span className="font-medium">{selectedDate && formatDate(selectedDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Godzina:</span>
                      <span className="font-medium">{selectedTime}</span>
                    </div>
                    <div className="flex justify-between border-t border-purple-200 pt-2 mt-2">
                      <span className="font-semibold">Cena:</span>
                      <span className="font-bold text-purple-600">{selectedService?.price} zł</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Potwierdzenie */}
          {currentStep === 6 && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800">Rezerwacja potwierdzona!</h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Twoja rezerwacja została pomyślnie złożona. Wkrótce otrzymasz SMS-a z potwierdzeniem.
              </p>
              <button
                onClick={() => {
                  setCurrentStep(1);
                  setSelectedService(null);
                  setSelectedStylist(null);
                  setSelectedDate(null);
                  setSelectedTime(null);
                  setCustomerData({ name: '', phone: '', email: '' });
                }}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
              >
                Umów kolejną wizytę
              </button>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        {currentStep < 6 && (
          <div className="flex justify-between mt-12">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Wstecz
            </button>
            
            <button
              onClick={currentStep === 5 ? handleBooking : nextStep}
              disabled={!canProceed()}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                canProceed()
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:scale-105'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {currentStep === 5 ? 'Potwierdź rezerwację' : 'Dalej'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HairdresserBooking;