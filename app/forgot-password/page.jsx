'use client'
import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const Page = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const router = useRouter();

  const onSubmit = async (data) => {
    try {
        const res = await axios.get(`/api/send-reset-code?email=${data.email}`);

      if (res.data.success) {
        localStorage.setItem('resetEmail', data.email);
        router.push('/verify-code');
      } else {
        alert(res.data.message || 'Something went wrong.');
      }
    } catch (err) {
      alert('No account found with this email.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-xl font-semibold mb-4 text-center">Forgot Password</h2>

        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Enter your email:
        </label>
        <input
          type="email"
          id="email"
          {...register('email', { required: 'Email is required' })}
          className="w-full border border-gray-300 p-2 rounded mb-2"
        />
        {errors.email && <p className="text-red-600 text-sm mb-2">{errors.email.message}</p>}

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
        >
          Get Code
        </button>
      </form>
    </div>
  );
};

export default Page;
