import { ReactNode } from 'react';

// 동화책 버튼
interface StorybookButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'magic';
  className?: string;
}

export const StorybookButton = ({ 
  children, 
  onClick, 
  variant = 'primary',
  className = '' 
}: StorybookButtonProps) => {
  const variants = {
    primary: 'from-fairy-400 to-dream-400',
    secondary: 'from-storybook-peach to-storybook-rose',
    magic: 'from-fairy-500 via-dream-400 to-fairy-500 animate-sparkle',
  };

  return (
    <button
      onClick={onClick}
      className={`storybook-button bg-gradient-to-r ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

// 동화책 입력 필드
interface StorybookInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  icon?: string;
}

export const StorybookInput = ({ 
  placeholder, 
  value, 
  onChange, 
  type = 'text',
  icon 
}: StorybookInputProps) => {
  return (
    <div className="relative">
      {icon && (
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">
          {icon}
        </span>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`storybook-input w-full ${icon ? 'pl-14' : ''}`}
      />
    </div>
  );
};

// 동화책 카드
interface StorybookCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export const StorybookCard = ({ 
  children, 
  className = '',
  hover = true 
}: StorybookCardProps) => {
  return (
    <div className={`storybook-card ${hover ? 'hover:scale-105' : ''} ${className}`}>
      {children}
    </div>
  );
};

// 동화책 제목
interface StorybookTitleProps {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const StorybookTitle = ({ 
  children, 
  size = 'lg',
  className = '' 
}: StorybookTitleProps) => {
  const sizes = {
    sm: 'text-2xl md:text-3xl',
    md: 'text-3xl md:text-4xl',
    lg: 'text-4xl md:text-6xl',
    xl: 'text-5xl md:text-7xl',
  };

  return (
    <h1 className={`storybook-title ${sizes[size]} ${className}`}>
      {children}
    </h1>
  );
};

// 동화책 텍스트
interface StorybookTextProps {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StorybookText = ({ 
  children, 
  size = 'md',
  className = '' 
}: StorybookTextProps) => {
  const sizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
  };

  return (
    <p className={`font-fairy ${sizes[size]} text-gray-700 ${className}`}>
      {children}
    </p>
  );
};

// 마법의 로딩 스피너
export const MagicSpinner = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-4 border-fairy-200"></div>
        <div className="absolute inset-0 rounded-full border-4 border-t-fairy-500 border-r-dream-500 animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center text-3xl animate-sparkle">
          ✨
        </div>
      </div>
    </div>
  );
};

// 동화책 배지
interface StorybookBadgeProps {
  children: ReactNode;
  color?: 'fairy' | 'dream' | 'peach' | 'mint';
}

export const StorybookBadge = ({ children, color = 'fairy' }: StorybookBadgeProps) => {
  const colors = {
    fairy: 'bg-fairy-100 text-fairy-700 border-fairy-300',
    dream: 'bg-dream-100 text-dream-700 border-dream-300',
    peach: 'bg-storybook-peach/30 text-orange-700 border-storybook-peach',
    mint: 'bg-storybook-mint/50 text-green-700 border-green-300',
  };

  return (
    <span className={`inline-block px-4 py-1 rounded-full border-2 font-fairy text-sm ${colors[color]}`}>
      {children}
    </span>
  );
};

// 동화책 모달
interface StorybookModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

export const StorybookModal = ({ isOpen, onClose, children, title }: StorybookModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 배경 오버레이 */}
      <div 
        className="absolute inset-0 bg-fairy-900/20 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* 모달 컨텐츠 */}
      <div className="relative max-w-2xl w-full animate-float">
        <StorybookCard className="max-h-[90vh] overflow-y-auto">
          {title && (
            <div className="mb-6 pb-4 border-b-2 border-storybook-lavender/30">
              <StorybookTitle size="md">{title}</StorybookTitle>
            </div>
          )}
          {children}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-3xl hover:scale-110 transition-transform"
          >
            ✕
          </button>
        </StorybookCard>
      </div>
    </div>
  );
};
