import React from 'react';
import { useSession, signOut } from 'next-auth/react';

const Navbar = () => {
  const { data: session, status } = useSession();

  return (
    <nav className='bg-slate-700 w-full h-10'>
      <div className='flex justify-between items-center h-full px-4 text-white'>
        <div className='px-4 md:px-10'>
          &lt;<span className='text-white font-bold'>Secure</span><span className='text-green-700 font-bold'>Vault</span>/&gt;
        </div>

        {status === 'authenticated' && (
          <div className='flex items-center space-x-4'>
            <span>Hello, {session.user.name}</span>
            <button 
              onClick={() => signOut()} 
              className='bg-red-500 px-2 py-1 rounded hover:bg-red-600'
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
