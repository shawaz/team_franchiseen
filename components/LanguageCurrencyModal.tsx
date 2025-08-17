import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import { useSolOnly } from '../contexts/SolOnlyContext';

interface LanguageCurrencyModalProps {
  isOpen: boolean;
  type: 'language' | 'currency' | null;
  onClose: () => void;
}

type Language = {
  code: string;
  label: string;
};

const languages: Language[] = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi' },
  { code: 'es', label: 'Spanish' },
  // Add more as needed
];

export default function LanguageCurrencyModal({ isOpen, type, onClose }: LanguageCurrencyModalProps) {
  const { currency } = useSolOnly();
  const solCurrencies = [currency]; // Only SOL available
  const options = type === 'language' ? languages : solCurrencies;
  const title = type === 'language' ? 'Select Language' : 'Select Currency';

  const handleSelect = () => {
    if (type === 'currency') {
      // SOL is the only currency, no need to change
      console.log('SOL is the only supported currency');
    }
    onClose();
  };

  const isCurrency = (opt: Language | typeof currency): opt is typeof currency => {
    return 'symbol' in opt;
  };

  return (
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative bg-white dark:bg-stone-800 rounded-2xl max-w-sm w-full mx-4 p-6">
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 text-gray-400 dark:text-gray-100 dark:hover:text-gray-500 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
                <Dialog.Title className="text-lg font-semibold dark:text-white/80 text-gray-900 mb-6">
                  {title}
                </Dialog.Title>
                <div className="flex flex-col gap-3">
                  {options.map(opt => (
                    <button
                      key={opt.code}
                      className={`w-full px-4 py-2 rounded-lg border border-stone-200 dark:border-stone-700 
                        ${opt.code === (type === 'currency' ? currency.code : undefined)
                          ? 'bg-primary/10 text-primary border-primary'
                          : 'bg-stone-50 dark:bg-stone-700 hover:bg-yellow-100 dark:hover:bg-yellow-900'
                        } text-left`}
                      onClick={() => handleSelect()}
                    >
                      {type === 'currency' && isCurrency(opt) ? (
                        <span>{opt.symbol} {opt.label}</span>
                      ) : (
                        opt.label
                      )}
                    </button>
                  ))}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 