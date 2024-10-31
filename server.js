const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Visit = require('./models/Visit'); // IP 저장 모델 가져오기
const app = express();
const PORT = 3000;

// MongoDB 연결
mongoose.connect('mongodb+srv://planittour:planittour2024@planittour.4ef6l5q.mongodb.net/?retryWrites=true&w=majority&appName=planittour')
    .then(() => console.log('MongoDB에 성공적으로 연결되었습니다.'))
    .catch((error) => console.error('MongoDB 연결 중 오류 발생:', error));

// Middleware 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// 프록시 신뢰 설정 (IP 추출을 위한 설정)
app.set('trust proxy', true);

// 기본 라우트 - 방문자 IP 저장
app.get('/', async (req, res) => {
    try {
        // IP 주소 추출
        const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null);

        // IP 주소 확인 로그
        console.log(`Detected IP Address: ${ipAddress}`);

        // IP와 방문 시간 데이터 저장
        const visit = new Visit({ ip: ipAddress });
        await visit.save();

        console.log(`방문자 IP: ${ipAddress} - 데이터베이스에 저장되었습니다.`);
    } catch (error) {
        console.error('IP 저장 중 오류 발생:', error);
    }

    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
