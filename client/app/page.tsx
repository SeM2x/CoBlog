import { redirect } from 'next/navigation';

const HomePage = () => {
  return redirect('/dashboard');
};

export default HomePage;
