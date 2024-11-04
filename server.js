require('dotenv').config(); // .env 파일에서 환경 변수 불러오기
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Visit = require(path.join(__dirname, 'models', 'Visit')); // IP 저장 모델 가져오기
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB 연결
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB에 성공적으로 연결되었습니다.'))
    .catch((error) => console.error('MongoDB 연결 중 오류 발생:', error));

// 프록시 신뢰 설정 (IP 추출을 위한 설정)
app.set('trust proxy', true);

// 기본 라우트 - 방문자 IP 저장
app.get('/', async (req, res) => {
    try {
        // 수동으로 IP를 쿼리 매개변수로 입력받고, 없으면 자동 추출
        const ipAddress = req.query.ip || 
                          req.headers['x-forwarded-for']?.split(",")[0].trim() || 
                          req.socket.remoteAddress;

        console.log(`Detected IP Address: ${ipAddress}`);

        const visit = new Visit({ ip: ipAddress });
        const savedVisit = await visit.save();
        console.log('방문자 IP 저장 완료:', savedVisit);

        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    } catch (error) {
        console.error('IP 저장 중 오류 발생:', error);
        res.status(500).send('서버에 문제가 발생했습니다.');
    }
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
