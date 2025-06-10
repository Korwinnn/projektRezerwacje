const express = require('express');
const mysql = require('mysql2/promise');
const router = express.Router();

// Konfiguracja bazy - ZMIEŃ NA SWOJE DANE!
const dbConfig = {
  host: 'localhost',
  user: 'root',          // Twoja nazwa użytkownika MySQL
  password: '',          // Twoje hasło MySQL  
  database: 'fryzjer_db' // Nazwa bazy danych
};

// POST - tworzenie rezerwacji
router.post('/', async (req, res) => {
  try {
    const { serviceId, stylistId, date, time, customerName, customerPhone, customerEmail } = req.body;
    
    if (!serviceId || !stylistId || !date || !time || !customerName || !customerPhone || !customerEmail) {
      return res.status(400).json({ message: 'Wszystkie pola są wymagane' });
    }

    const connection = await mysql.createConnection(dbConfig);
    
    // Sprawdź czy termin nie jest zajęty
    const [existing] = await connection.execute(
      'SELECT id FROM bookings WHERE stylist_id = ? AND booking_date = ? AND booking_time = ?',
      [stylistId, date, time]
    );

    if (existing.length > 0) {
      await connection.end();
      return res.status(400).json({ message: 'Ten termin jest już zajęty' });
    }

    // Wstaw rezerwację
    const [result] = await connection.execute(
      `INSERT INTO bookings (service_id, stylist_id, booking_date, booking_time, 
       customer_name, customer_phone, customer_email) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [serviceId, stylistId, date, time, customerName, customerPhone, customerEmail]
    );

    await connection.end();

    res.status(201).json({
      message: 'Rezerwacja utworzona!',
      bookingId: result.insertId
    });

  } catch (error) {
    console.error('Błąd:', error);
    res.status(500).json({ message: 'Błąd serwera: ' + error.message });
  }
});

// GET - pobierz rezerwacje
router.get('/', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [bookings] = await connection.execute('SELECT * FROM bookings ORDER BY booking_date, booking_time');
    await connection.end();
    res.json(bookings);
  } catch (error) {
    console.error('Błąd:', error);
    res.status(500).json({ message: 'Błąd serwera: ' + error.message });
  }
});

module.exports = router;