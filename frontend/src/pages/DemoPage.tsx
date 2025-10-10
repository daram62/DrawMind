import { useState } from 'react';
import { Button, Input, Card, LoadingSpinner, Modal } from '../components/ui';
import { useToast } from '../hooks/useToast';
import Toast from '../components/ui/Toast';

function DemoPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const { toasts, removeToast, success, error, warning, info } = useToast();

  return (
    <div className="space-y-8">
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>

      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          UI 컴포넌트 데모
        </h1>
        <p className="text-gray-600">
          구축된 모든 UI 컴포넌트를 확인해보세요
        </p>
      </div>

      {/* Buttons */}
      <Card>
        <Card.Header>
          <Card.Title>Buttons</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="success">Success</Button>
              <Button variant="danger">Danger</Button>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button loading>Loading</Button>
              <Button disabled>Disabled</Button>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Inputs */}
      <Card>
        <Card.Header>
          <Card.Title>Inputs</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="space-y-4 max-w-md">
            <Input
              label="기본 입력"
              placeholder="텍스트를 입력하세요"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Input
              label="에러 상태"
              placeholder="이메일을 입력하세요"
              error="올바른 이메일 형식이 아닙니다"
            />
            <Input
              label="도움말 포함"
              placeholder="비밀번호"
              type="password"
              helperText="최소 8자 이상 입력하세요"
            />
            <Input
              label="비활성화"
              placeholder="수정 불가"
              disabled
              value="비활성화된 입력"
            />
          </div>
        </Card.Content>
      </Card>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card padding="md">
          <Card.Header>
            <Card.Title>기본 카드</Card.Title>
          </Card.Header>
          <Card.Content>
            <p className="text-gray-600">
              이것은 기본 카드 컴포넌트입니다.
            </p>
          </Card.Content>
        </Card>

        <Card padding="md" hover>
          <Card.Header>
            <Card.Title>호버 효과</Card.Title>
          </Card.Header>
          <Card.Content>
            <p className="text-gray-600">
              마우스를 올려보세요!
            </p>
          </Card.Content>
        </Card>

        <Card padding="lg" className="bg-gradient-to-br from-blue-50 to-indigo-50">
          <Card.Header>
            <Card.Title>커스텀 스타일</Card.Title>
          </Card.Header>
          <Card.Content>
            <p className="text-gray-600">
              그라데이션 배경이 적용되었습니다.
            </p>
          </Card.Content>
        </Card>
      </div>

      {/* Loading Spinner */}
      <Card>
        <Card.Header>
          <Card.Title>Loading Spinners</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="flex items-center gap-8">
            <div className="text-center">
              <LoadingSpinner size="sm" />
              <p className="mt-2 text-sm text-gray-600">Small</p>
            </div>
            <div className="text-center">
              <LoadingSpinner size="md" />
              <p className="mt-2 text-sm text-gray-600">Medium</p>
            </div>
            <div className="text-center">
              <LoadingSpinner size="lg" />
              <p className="mt-2 text-sm text-gray-600">Large</p>
            </div>
            <div className="text-center">
              <LoadingSpinner size="md" text="로딩 중..." />
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Modal & Toast */}
      <Card>
        <Card.Header>
          <Card.Title>Modal & Toast</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-3">Modal 열기:</p>
              <Button onClick={() => setIsModalOpen(true)}>
                모달 열기
              </Button>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-3">Toast 알림:</p>
              <div className="flex flex-wrap gap-2">
                <Button variant="success" size="sm" onClick={() => success('성공 메시지입니다!')}>
                  Success
                </Button>
                <Button variant="danger" size="sm" onClick={() => error('에러가 발생했습니다!')}>
                  Error
                </Button>
                <Button variant="secondary" size="sm" onClick={() => warning('경고 메시지입니다!')}>
                  Warning
                </Button>
                <Button variant="primary" size="sm" onClick={() => info('정보 메시지입니다!')}>
                  Info
                </Button>
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Modal Component */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="예제 모달"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            이것은 모달 컴포넌트의 예제입니다. ESC 키를 누르거나 배경을 클릭하면 닫힙니다.
          </p>
          <Input
            label="모달 내부 입력"
            placeholder="여기에 입력하세요"
          />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              취소
            </Button>
            <Button variant="primary" onClick={() => {
              setIsModalOpen(false);
              success('모달에서 확인을 눌렀습니다!');
            }}>
              확인
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default DemoPage;
