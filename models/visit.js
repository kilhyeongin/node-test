// models/Visit.js
const mongoose = require('mongoose');

// IP 주소와 방문 시간을 저장하는 스키마 정의
const visitSchema = new mongoose.Schema({
    ip: { type: String, required: true },
    visitTime: { type: Date, default: Date.now } // 방문 시간 기록
});

// 모델 생성
module.exports = mongoose.model('Visit', visitSchema);
