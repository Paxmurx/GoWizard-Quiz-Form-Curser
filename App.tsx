
import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import WelcomeScreen from './components/WelcomeScreen';
import QuizInterface from './components/QuizInterface';
import Footer from './components/Footer';
import { ViewState, QuizQuestion } from './types';

// New Question Set
const QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    type: 'vehicle-form',
    text: "What is the year, make & model of your vehicle?",
    stepCategory: 'vehicle',
  },
  {
    id: 'q2',
    type: 'options',
    text: "Roughly, how many miles are on the vehicle?",
    stepCategory: 'vehicle',
    options: [
      { id: 'lt100', label: 'Less than 100k', value: '<100k' },
      { id: '100-140', label: '100-140k', value: '100-140k' },
      { id: '140-200', label: '140-200k', value: '140-200k' },
      { id: 'gt200', label: 'More than 200k', value: '>200k' }
    ]
  },
  {
    id: 'q3',
    type: 'options',
    text: "How soon do you want your new auto warranty?",
    stepCategory: 'coverage',
    options: [
      { id: 'asap', label: 'As soon as possible', value: 'asap' },
      { id: '1-2w', label: '1-2 weeks', value: '1-2w' },
      { id: '3-4w', label: '3-4 weeks', value: '3-4w' },
      { id: '4w+', label: '4+ weeks', value: '4w+' },
      { id: 'unsure', label: 'Unsure', value: 'unsure' }
    ]
  },
  {
    id: 'q4',
    type: 'location-form',
    text: "What state do you live in?",
    subText: "Your ZIP code ensures quotes are as accurate as possible for your area",
    stepCategory: 'location',
  },
  {
    id: 'q5',
    type: 'email-input',
    text: "What's your Email Address?",
    subText: "You will receive a copy of your quote via Email. We only pass your Email Address onto your match.",
    placeholder: "example@email.com",
    stepCategory: 'quote',
  },
  {
    id: 'q6',
    type: 'name-input',
    text: "What's your Full Name?",
    placeholder: "John Doe",
    stepCategory: 'quote',
  },
  {
    id: 'q7',
    type: 'phone-input',
    text: "What's your Phone Number",
    placeholder: "(512) 494-9400",
    stepCategory: 'quote',
    disclaimer: `Your privacy is important to us. You direct and authorize Marketing VF Ltd, its subsidiaries, and <a href="https://www2.mvfglobal.com/privacypolicy/b649e" target="_blank">related brands</a>, (collectively, “MVF”) to disclose your contact information (including health data, if provided) to up to <a class="supplier-list-link external-supplier-list-link" data-toggle="modal" data-target="#consentedSuppliersModal-9f800eea-749a-6c44-e2ab-6151af6871d7" style="text-decoration: underline; color: inherit; cursor: pointer; display: table-row;"> 4 supplier(s) (or associated parties) </a> of Auto Protection Plans. By providing a wireless or residential phone number on this form, you agree that MVF and these 4 suppliers or associated parties may make telemarketing, other calls, and send text (including automated calls and messages) and OTT messages like WhatsApp about your request and other products/services to you at the number you supplied. These calls and texts may be made using autodialer or prerecorded voice technology. You also agree that all calls to you may be recorded. Standard message and data rates from your mobile network provider may apply. Your consent is not a condition of any purchase. By providing your phone number and completing the form, you are agreeing to MVF’s <a href="https://www2.mvfglobal.com/terms_of_use/5da7f" target="_blank">Terms of Use</a>, including understanding that disputes between you and MVF will be arbitrated. You have certain rights in relation to your personal data, see our <a data-statement-anchor="privacy-policy" href="https://www2.mvfglobal.com/privacypolicy/b649e" target="_blank" style="display: table-row;">Privacy Policy</a> for further information.`
  }
];

function App() {
  const [currentView, setCurrentView] = useState<ViewState>('welcome');

  return (
    <div className="flex flex-col min-h-screen bg-white text-brand-dark overflow-x-hidden">
      <main className="flex-grow flex flex-col">
        <AnimatePresence mode="wait">
          {currentView === 'welcome' && (
            <WelcomeScreen key="welcome" onStart={() => setCurrentView('quiz')} />
          )}
          {currentView === 'quiz' && (
            <QuizInterface key="quiz" questions={QUESTIONS} />
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

export default App;
