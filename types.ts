
export type ViewState = 'welcome' | 'quiz';

export type InputType = 'options' | 'vehicle-form' | 'location-form' | 'email-input' | 'name-input' | 'phone-input';

export interface QuizOption {
  id: string;
  label: string;
  value: string;
}

export interface QuizQuestion {
  id: string;
  type: InputType;
  text: string;
  subText?: string;
  placeholder?: string;
  disclaimer?: string;
  options?: QuizOption[];
  stepCategory: 'vehicle' | 'coverage' | 'location' | 'quote';
}

export interface ChatMessage {
  id: string;
  type: 'bot' | 'user';
  text?: string;
  questionId?: string;
}

export interface UserResponse {
  questionId: string;
  answerValue: string;
  displayValue?: string; // Text to show in the user's chat bubble
}
