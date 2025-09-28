const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Joi validation error
  if (err.isJoi) {
    return res.status(400).json({
      message: 'Validation error',
      details: err.details.map(detail => detail.message)
    });
  }

  // MySQL error
  if (err.code) {
    switch (err.code) {
      case 'ER_DUP_ENTRY':
        return res.status(409).json({ message: 'Duplicate entry found' });
      case 'ER_NO_REFERENCED_ROW_2':
        return res.status(400).json({ message: 'Invalid reference' });
      default:
        console.error('MySQL Error:', err);
        return res.status(500).json({ message: 'Database error' });
    }
  }

  // Default error
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error'
  });
};

module.exports = { errorHandler };