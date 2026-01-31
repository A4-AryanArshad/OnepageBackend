const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// POST /api/bookings - Create a new booking
router.post('/', async (req, res) => {
  try {
    const { name, email, sessionType, preferredDate, preferredTime, message } = req.body;

    // Basic validation
    if (!name || !email || !sessionType || !preferredDate || !preferredTime) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please fill in all required fields' 
      });
    }

    // Create booking
    const booking = new Booking({
      name,
      email,
      sessionType,
      preferredDate,
      preferredTime,
      message: message || ''
    });

    await booking.save();

    res.status(201).json({
      success: true,
      message: 'Booking request received successfully. We will contact you soon.',
      booking: {
        id: booking._id,
        name: booking.name,
        email: booking.email
      }
    });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while processing your booking. Please try again.'
    });
  }
});

// GET /api/bookings - Get all bookings (newest first)
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error('Fetch bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to load bookings right now.',
    });
  }
});

// DELETE /api/bookings/:id - Delete a booking by id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Booking.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    res.json({
      success: true,
      message: 'Booking deleted successfully.',
      id,
    });
  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to delete this booking right now.',
    });
  }
});

module.exports = router;

