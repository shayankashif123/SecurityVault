'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const VerifyCodePage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const router = useRouter();
  const [serverError, setServerError] = useState('');

  const onSubmit = async (data) => {
    const email = localStorage.getItem('resetEmail');

    if (!email) {
      setServerError('Email not found. Please restart the reset process.');
      return;
    }

    try {
      const res = await axios.post('/api/verify-reset-code', {
        email,
        code: data.code,
      });

      if (res.data.success) {
        router.push('/reset-password');
      } else {
        setServerError(res.data.message || 'Invalid or expired code.');
      }
    } catch (err) {
      setServerError('Server error. Try again later.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-xl font-semibold mb-4 text-center">Verify Code</h2>

        <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
          Enter the 6-digit code sent to your email:
        </label>
        <input
          type="text"
          id="code"
          maxLength="6"
          {...register('code', { required: 'Code is required' })}
          className="w-full border border-gray-300 p-2 rounded mb-2"
        />
        {errors.code && <p className="text-red-600 text-sm mb-2">{errors.code.message}</p>}
        {serverError && <p className="text-red-600 text-sm mb-2">{serverError}</p>}

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Verify Code
        </button>
      </form>
    </div>
  );
};

export default VerifyCodePage;
