const Booking = require('../models/Booking');

// @desc    Get all bookings for logged-in user
// @route   GET /api/bookings
// @access  Private
const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
};

// @desc    Create a booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const { title, description, deadline } = req.body;

    if (!title || !description || !deadline) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const booking = await Booking.create({
      title,
      description,
      deadline,
      user: req.user._id,
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create booking' });
  }
};

// @desc    Update a booking
// @route   PUT /api/bookings/:id
// @access  Private
const updateBooking = async (req, res) => {
  try {
    const { title, description, deadline } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorised to update this booking' });
    }

    booking.title = title ?? booking.title;
    booking.description = description ?? booking.description;
    booking.deadline = deadline ?? booking.deadline;

    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update booking' });
  }
};

// @desc    Delete a booking
// @route   DELETE /api/bookings/:id
// @access  Private
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorised to delete this booking' });
    }

    await booking.deleteOne();
    res.json({ message: 'Booking removed' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete booking' });
  }
};

module.exports = {
  getBookings,
  createBooking,
  updateBooking,
  deleteBooking,
};
