import Spinner from '../Spinner';
import Image from 'next/image';

export default function FullScreenLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-stone-900">
      <Image
        src="/logo.svg"
        alt="Brand Logo"
        width={120}
        height={120}
        className="mb-8"
        style={{ objectFit: 'contain' }}
        priority
      />
      <Spinner />
    </div>
  );
} 