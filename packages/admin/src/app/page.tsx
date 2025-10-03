import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect root to admin dashboard (which will check auth)
  redirect('/admin/dashboard');
}
