import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const BookingForm = ({ bookings, setBookings, editingBookings, setEditingBooking }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ title: '', description: '', deadline: '' });

  useEffect(() => {
    if (editingBooking) {
      setFormData({
        title: editingBooking.title,
        description: editingBooking.description,
        deadline: editingBooking.deadline,
      });
    } else {
      setFormData({ title: '', description: '', deadline: '' });
    }
  }, [editingBooking]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBooking) {
        const response = await axiosInstance.put(`/api/bookings/${editingBooking._id}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setBookins(bookings.map((booking) => (booking._id === response.data._id ? response.data : booking)));
      } else {
        const response = await axiosInstance.post('/api/bookings', formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setBookings([...bookings, response.data]);
      }
      setEditingBooking(null);
      setFormData({ title: '', description: '', deadline: '' });
    } catch (error) {
      alert('Failed to save booking.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">{editingBooking ? 'Your Form Name: Edit Operation' : 'Your Form Name: Create Operation'}</h1>
      <input
        type="text"
        placeholder="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="date"
        value={formData.deadline}
        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        {editingBooking ? 'Update Button' : 'Create Button'}
      </button>
    </form>
  );
};

export default BookingForm;
