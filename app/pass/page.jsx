"use client";
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSession } from "next-auth/react";
import Navbar from '../component/Navbar';
import axios from 'axios';

const Manager = () => {
  const [passwords, setPasswords] = useState([]);
  const [editId, setEditId] = useState(null);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm();

  useEffect(() => {
    if (!session?.user?.id) return;
    const fetchPasswords = async () => {
      try {
        const response = await axios.get(`/api/info`);
        setPasswords(response.data);
      } catch (err) {
        console.error("Error fetching passwords:", err);
      }
    };
    fetchPasswords();
  }, [session?.user?.id]);

  useEffect(() => {
    if (editId) {
      const pw = passwords.find(p => p.id === editId);
      if (pw) {
        setValue('app', pw.app);
        setValue('username', pw.username);
        setValue('password', pw.password);
      }
    }
  }, [editId, passwords]);

  const onSubmit = async (data) => {
    if (!session?.user?.id) return;

    try {
      const userId = session.user.id;

      if (editId) {
        const response = await axios.put(`api/info/${editId}?userId=${userId}`, data);
        setPasswords(prev => prev.map(p =>
          p.id === editId
            ? { ...response.data, id: response.data.id || editId }
            : p
        ));
      } else {
        const response = await axios.post(`api/info`, { ...data, userId });
        const newPassword = response.data.password;

        setPasswords(prev => [
          ...prev,
          {
            ...newPassword,
            id: newPassword.id
          }
        ]);
      }

      reset();
      setEditId(null);
    } catch (err) {
      console.error("Error saving password:", err.response?.data || err.message);
      alert(`Error: ${err.response?.data?.message || 'Failed to save password'}`);
    }
  };

  const handleDelete = async (id) => {
    if (!session?.user?.id) return;

    try {
      const userId = session.user.id;
      const stringId = id.toString();
      await axios.delete(`api/info/${stringId}?userId=${userId}`);

      setPasswords(prev =>
        prev.filter(item => item.id.toString() !== stringId)
      );
    } catch (err) {
      console.error("Delete Error Details:", {
        error: err,
        response: err.response?.data
      });

      alert(
        err.response?.data?.message ||
        'Failed to delete password. Please try again.'
      );
    }
  };

  const handleEdit = (password) => {
    setEditId(password.id);
  };

  const toggleVisibility = (id) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <>
      <Navbar />
      <div className="py-10 px-4 sm:px-6 md:px-20">
        <div className='flex justify-center items-center'>
          &lt;<span className='text-black font-bold'>Secure</span><span className='text-green-700 font-bold'>Vault</span>/&gt;
        </div>
        <div className='flex justify-center'>
          <span>Your password manager</span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-4xl mx-auto mt-6">
          <div className='w-full'>
            <input
              className='border border-black w-full max-w-2xl rounded-lg text-sm md:text-lg p-2'
              type="text"
              placeholder='Enter website URL'
              {...register("app", { required: "This field is required" })}
            />
            {errors.app && <span className='text-red-500 text-sm'>{errors.app.message}</span>}
          </div>

          <div className='flex flex-col md:flex-row gap-4 mt-4'>
            <input
              className='border border-black w-full md:w-1/2 rounded-lg text-sm md:text-lg p-2'
              type="text"
              placeholder='Enter Username'
              {...register("username", { required: "This field is required" })}
            />
            <input
              className='border border-black w-full md:w-1/2 rounded-lg text-sm md:text-lg p-2'
              type="password"
              placeholder='Enter Password'
              {...register("password", { required: "This field is required" })}
            />
          </div>

          <div className='flex justify-center py-4'>
            <button
              type='submit'
              className='text-black bg-green-500 px-8 py-2 rounded-xl cursor-pointer hover:bg-green-600 md:px-12'
            >
              <span className='material-icons align-middle mr-1'>save</span>
              {editId ? "Update" : "Save"}
            </button>
          </div>

          <div className='font-bold text-center text-lg mt-6'>Your Passwords</div>

          <div className='overflow-x-auto mt-4'>
            <table className='w-full max-w-6xl mx-auto'>
              <thead>
                <tr className='bg-green-800 text-white'>
                  <th className='px-2 py-2'>Site</th>
                  <th className='px-2 py-2'>Username</th>
                  <th className='px-2 py-2'>Password</th>
                  <th className='px-2 py-2'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {passwords.map((password) => (
                  <tr key={password.id} className="text-center">
                    <td className='border-2 border-green-800 px-2 py-2 break-all'>{password.app || "N/A"}</td>
                    <td className='border-2 border-green-800 px-2 py-2 break-all'>{password.username || "N/A"}</td>
                    <td className='border-2 border-green-800 px-2 py-2 break-all'>
                      <div className="flex items-center justify-center gap-2">
                        <span>
                          {visiblePasswords[password.id] ? password.password || "N/A" : "•••••••"}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleVisibility(password.id)}
                          className="text-sm"
                        >
                          {visiblePasswords[password.id] ? "🙈" : "👁️"}
                        </button>
                      </div>
                    </td>
                    <td className='border-2 border-green-800 px-2 py-2'>
                      <div className='flex flex-col md:flex-row justify-center space-y-2 md:space-y-0 md:space-x-2'>
                        <button
                          type='button'
                          onClick={() => handleDelete(password.id)}
                          className='bg-red-500 text-white rounded-lg px-4 py-1'
                        >
                          Delete
                        </button>
                        <button
                          type='button'
                          onClick={() => handleEdit(password)}
                          className='bg-yellow-400 text-black rounded-lg px-6 py-1'
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </form>
      </div>
    </>
  );
};

export default Manager;
