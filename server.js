const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// 启用CORS，允许本地开发
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
}));

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// 代理获取访问令牌的请求
app.post('/api/token', async (req, res) => {
    try {
        console.log('收到获取令牌请求');
        const tokenUrl = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${process.env.API_KEY}&client_secret=${process.env.SECRET_KEY}`;
        const response = await fetch(tokenUrl, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        console.log('成功获取令牌');
        res.json(data);
    } catch (error) {
        console.error('获取令牌失败:', error);
        res.status(500).json({ error: '获取访问令牌失败' });
    }
});

// 代理文心API请求
app.post('/api/chat', async (req, res) => {
    try {
        console.log('收到聊天请求，消息内容:', req.body);
        const { accessToken, messages } = req.body;
        const chatUrl = 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions_pro';
        const fullUrl = `${chatUrl}?access_token=${accessToken}`;
        console.log('发送请求到:', fullUrl);
        
        const requestBody = { messages };
        console.log('请求体:', JSON.stringify(requestBody, null, 2));
        
        const response = await fetch(fullUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
            throw new Error(`API返回错误状态码: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API响应:', JSON.stringify(data, null, 2));
        
        if (data.error_code) {
            throw new Error(`API错误: ${data.error_msg || '未知错误'}`);
        }
        
        res.json(data);
    } catch (error) {
        console.error('调用文心API失败:', error);
        res.status(500).json({ 
            error: error.message,
            stack: error.stack
        });
    }
});

app.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}`);
});
