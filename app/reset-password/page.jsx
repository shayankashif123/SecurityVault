'use client'
import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const ResetPasswordPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const router = useRouter();

  const onSubmit = async (data) => {
    const email = localStorage.getItem('resetEmail');

    if (!email) {
      alert('No email found. Please restart the reset process.');
      return;
    }

    try {
      const res = await axios.post('/api/reset-password', {
        email,
        password: data.password,
      });

      if (res.data.success) {
        localStorage.removeItem('resetEmail');
        alert('Password has been reset successfully.');
        router.push('/'); 
      } else {
        alert(res.data.message || 'Something went wrong.');
      }
    } catch (error) {
      alert('Failed to reset password.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-xl font-semibold mb-4 text-center">Reset Password</h2>

        <label className="block text-sm font-medium text-gray-700 mb-1">
          New Password:
        </label>
        <input
          type="password"
          {...register('password', { required: 'Password is required', minLength: 6 })}
          className="w-full border border-gray-300 p-2 rounded mb-2"
        />
        {errors.password && (
          <p className="text-red-600 text-sm mb-2">{errors.password.message}</p>
        )}

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
