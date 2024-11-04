const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
    ip: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Visit', visitSchema);