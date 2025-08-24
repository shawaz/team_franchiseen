import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirect to tasks page as the default home page
  redirect('/admin/home/tasks');
}