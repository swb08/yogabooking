import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const BookingList = ({ bookings, setBookings, setEditingBooking }) => {
  const { user } = useAuth();

  const handleDelete = async (bookingId) => {
    try {
      await axiosInstance.delete(`/api/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setBookings(bookings.filter((booking) => booking._id !== bookingId));
    } catch (error) {
      alert('Failed to delete booking.');
    }
  };

  return (
    <div>
      {bookings.map((booking) => (
        <div key={booking._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
          <h2 className="font-bold">{booking.title}</h2>
          <p>{booking.description}</p>
          <p className="text-sm text-gray-500">Deadline: {new Date(booking.deadline).toLocaleDateString()}</p>
          <div className="mt-2">
            <button
              onClick={() => setEditingBooking(booking)}
              className="mr-2 bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(booking._id)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookingList;
