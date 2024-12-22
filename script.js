// 意图识别和处理模块
const IntentTypes = {
    OPTIMIZE_IMAGE: 'optimize_image',
    OPTIMIZE_CONTENT: 'optimize_content',
    CHAT: 'chat'
};

// 意图识别函数
function detectIntent(input) {
    let intent;
    
    // 检查是否是图片输入
    if (input instanceof File && input.type.startsWith('image/')) {
        intent = IntentTypes.OPTIMIZE_IMAGE;
        console.log('✨ 意图识别结果：优化图片');
        return intent;
    }

    // 检查是否是商品描述相关文案
    const productKeywords = [
        // 基础商品关键词
        '商品', '产品', '价格', '规格', '材质', '尺寸', '重量',
        '描述', '特点', '功能', '用途', '包装', '售后',
        '优惠', '促销', '折扣', '活动', '库存', '发货',
        '品牌', '型号', '颜色', '款式', '系列', '好吃', '美味',

        // 食品相关关键词
        '口感', '味道', '新鲜', '食材', '配料', '调味', '香味',
        '咸淡', '辣度', '甜度', '酸甜', '鲜美', '可口', '美食',
        '菜品', '餐点', '份量', '食量', '饱腹', '营养', '健康',
        '特色', '招牌', '推荐', '人气', '必点', '主食', '小吃',

        // 服装相关关键词
        '面料', '版型', '剪裁', '做工', '缝线', '褶皱', '弹性',
        '修身', '宽松', '时尚', '百搭', '搭配', '潮流', '经典',
        '休闲', '正装', '季节', '保暖', '透气', '舒适', '质地',
        '领口', '袖长', '裤长', '尺码', '洗涤', '褪色', '起球',

        // 店铺环境相关关键词
        '店铺', '商家', '门店', '装修', '布局', '陈设', '氛围',
        '整洁', '干净', '明亮', '温馨', '舒适', '宽敞', '拥挤',
        '通风', '采光', '空调', '座位', '停车', '位置', '交通',
        '服务', '态度', '效率', '专业', '热情', '周到', '体验',

        // 景点相关关键词
        '景区', '景点', '风景', '景色', '自然', '人文', '历史',
        '文化', '古迹', '建筑', '园林', '公园', '广场', '街道',
        '拍照', '打卡', '游玩', '休闲', '娱乐', '观光', '旅游',
        '门票', '客流', '淡旺季', '开放', '封闭', '维护', '设施',

        // 用户感受相关关键词
        '喜欢', '满意', '失望', '惊喜', '期待', '不错', '一般',
        '很棒', '完美', '糟糕', '差劲', '推荐', '不推荐', '后悔',
        '好评', '差评', '享受', '舒服',
        '不舒服', '满足', '失落', '惊艳', '震撼', '感动', '失望',
        '值得', '不值', '划算', '亏了', '超赞', '难受', '舒心',
        '放心', '担心', '纠结', '犹豫', '后悔', '庆幸', '遗憾'
    ];

    const matchedKeywords = productKeywords.filter(keyword => input.includes(keyword));
    if (matchedKeywords.length > 0) {
        intent = IntentTypes.OPTIMIZE_CONTENT;
        console.log('✨ 意图识别结果：优化商品描述');
        console.log('📝 匹配到的关键词：', matchedKeywords.join(', '));
        return intent;
    }

    // 默认为闲聊意图
    intent = IntentTypes.CHAT;
    console.log('✨ 意图识别结果：闲聊');
    return intent;
}

// 处理不同意图的响应
async function handleIntent(input) {
    console.log('🎯 开始处理意图：', detectIntent(input));
    console.log('📥 用户输入：', input instanceof File ? '图片文件' : input);
    
    let response;
    const currentIntent = detectIntent(input);

    // 关键词列表
    const productKeywords = [
        '商品', '产品', '价格', '规格', '材质', '尺寸', '重量',
        '描述', '特点', '功能', '用途', '包装', '售后',
        '口感', '味道', '新鲜', '食材', '配料', '调味', '香味',
        '面料', '版型', '剪裁', '做工', '舒适', '质地'
    ];

    // 只有在处理文本输入时才进行关键词匹配
    const matchedKeywords = typeof input === 'string' 
        ? productKeywords.filter(keyword => input.includes(keyword))
        : [];
    
    switch (currentIntent) {
        case IntentTypes.OPTIMIZE_IMAGE:
            response = {
                type: 'text',
                content: '我来帮你优化这张图片，让它更吸引人，你可以和我简单说说，你觉得这个商品怎么样呢？'
            };
            break;
        case IntentTypes.OPTIMIZE_CONTENT:
            // 分析用户输入中的关键词
            const sentimentKeywords = {
                positive: ['喜欢', '满意', '惊喜', '很棒', '完美', '好评', '享受', '舒服', '超赞', '值得', '划算'],
                negative: ['失望', '糟糕', '差劲', '不推荐', '差评', '不舒服', '难受', '不值', '亏了']
            };

            // 检测情感倾向
            const hasPositive = sentimentKeywords.positive.some(keyword => input.includes(keyword));
            const hasNegative = sentimentKeywords.negative.some(keyword => input.includes(keyword));
            
            // 根据用户输入的关键词和情感倾向生成评价
            let generatedReview = '';
            
            if (hasPositive) {
                generatedReview = await generatePositiveReview(input, matchedKeywords);
            } else if (hasNegative) {
                generatedReview = await generateNegativeReview(input, matchedKeywords);
            } else {
                generatedReview = await generateNeutralReview(input, matchedKeywords);
            }

            response = {
                type: 'text',
                content: `根据你的描述，我帮你生成了以下评价：\n\n${generatedReview}\n\n`
            };
            break;
        case IntentTypes.CHAT:
            const chatResponses = [
                "哈哈，聊天时间到！我可是一个很会说话的小助手呢~ 要不要让我帮你写个评价？",
                "今天心情不错？来跟我聊聊你最近买到的好东西吧！",
                "看起来你想找人聊天呢！作为一个评价小助手，我可是对各种商品都很了解的~",
                "休息一下也好，不过既然遇到了我，不如让我帮你写个精彩的评价？",
                "我不仅会写评价，还会陪你聊天呢！说说看，最近有什么想分享的？",
                "要不要听听我的购物小建议？或者让我帮你写个评价？",
                "看来你想找人聊天啊！正好我最擅长和人类交流了，特别是关于购物体验~",
                "闲聊时间！不过我得提醒你，我可是个评价小能手，有需要随时找我！",
                "嘿~发现你心情不错！要不要分享一下你最近的购物心得？",
                "作为一个AI助手，我最喜欢听人类分享购物故事啦！有什么有趣的经历吗？"
            ];
            
            response = {
                type: 'text',
                content: chatResponses[Math.floor(Math.random() * chatResponses.length)]
            };
            break;
        default:
            response = {
                type: 'text',
                content: '抱歉，我不太理解你的意思。'
            };
    }
    
    console.log('💬 响应内容：', response.content);
    return response;
}

// 处理用户输入的主函数
async function processUserInput(input) {
    let response;
    
    if (input instanceof File) {
        try {
            // 美化图片
            const enhancedImageBlob = await enhanceImage(input);
            const enhancedImageUrl = URL.createObjectURL(enhancedImageBlob);
            
            response = {
                type: 'image',
                content: enhancedImageUrl,
                message: '我已经帮你美化了这张图片，现在让我来帮你生成评价。你可以告诉我，你觉得这个商品怎么样呢？'
            };
        } catch (error) {
            console.error('图片处理失败:', error);
            response = {
                type: 'text',
                content: '抱歉，图片处理失败了。请确保上传的是有效的图片文件。'
            };
        }
    } else {
        // 处理文本输入
        response = await handleIntent(input);
    }
    
    // 显示响应
    if (response) {
        displayResponse(response);
    }
}

// 处理图片的函数
async function processImage(imageFile) {
    try {
        // 美化图片
        const enhancedImageBlob = await enhanceImage(imageFile);
        
        // 创建美化后图片的 URL
        const enhancedImageUrl = URL.createObjectURL(enhancedImageBlob);
        
        // 显示美化后的图片作为助手回复
        const response = {
            type: 'image',
            content: enhancedImageUrl,
            message: '我已经帮你美化了这张图片，现在让我来帮你生成评价。你可以告诉我，你觉得这个商品怎么样呢？'
        };
        
        displayResponse(response);
        
        // 返回处理后的响应
        return response;
    } catch (error) {
        console.error('图片处理失败:', error);
        return {
            type: 'text',
            content: '抱歉，图片处理失败了。请确保上传的是有效的图片文件。'
        };
    }
}

// 处理文件上传
async function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        try {
            // 显示用户上传的原始图片
            displayUserImage(file);
            
            // 处理图片并显示结果
            await processImage(file);
            
            // 清除文件输入，允许重复上传相同的文件
            event.target.value = '';
        } catch (error) {
            console.error('处理图片时出错：', error);
            displayResponse({
                type: 'text',
                content: '抱歉，处理图片时出现了问题。请稍后重试。'
            });
        }
    }
}

// GPT API 调用函数
async function callGPTAPI(prompt) {
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.openaiApiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{
                    role: 'system',
                    content: '你是一个专业的美食点评助手，擅长生成真实、生动、有说服力的美食评价。'
                }, {
                    role: 'user',
                    content: prompt
                }],
                temperature: 0.7,
                max_tokens: 500
            })
        });

        const data = await response.json();
        if (data.choices && data.choices[0]) {
            return data.choices[0].message.content;
        } else {
            throw new Error('No response from GPT');
        }
    } catch (error) {
        console.error('GPT API 调用失败:', error);
        return null;
    }
}

// 修改生成评价的函数
async function generatePositiveReview(input, keywords) {
    const prompt = `请根据以下信息生成一个正面的美食评价。
    商品信息：${input}
    关键词：${keywords.join(', ')}
    要求：
    1. 评价要真实、生动、有感染力
    2. 突出食物的特色和亮点
    3. 描述要具体，包含感官体验
    4. 语气要自然，像真实顾客的评价
    5. 字数在100-150字之间`;

    const gptResponse = await callGPTAPI(prompt);
    return gptResponse || '抱歉，评价生成失败，请稍后重试。';
}

async function generateNegativeReview(input, keywords) {
    const prompt = `请根据以下信息生成一个中肯的建议性评价。
    商品信息：${input}
    关键词：${keywords.join(', ')}
    要求：
    1. 评价要客观、理性，不过分苛刻
    2. 指出需要改进的地方，但语气要委婉
    3. 给出具体的改进建议
    4. 也要提到值得肯定的方面
    5. 字数在100-150字之间`;

    const gptResponse = await callGPTAPI(prompt);
    return gptResponse || '抱歉，评价生成失败，请稍后重试。';
}

async function generateNeutralReview(input, keywords) {
    const prompt = `请根据以下信息生成一个中立的美食评价。
    商品信息：${input}
    关键词：${keywords.join(', ')}
    要求：
    1. 评价要客观、全面
    2. 同时描述优点和不足
    3. 提供个性化的建议
    4. 适合什么样的人群
    5. 字数在100-150字之间`;

    const gptResponse = await callGPTAPI(prompt);
    return gptResponse || '抱歉，评价生成失败，请稍后重试。';
}

// 模块切换函数
function switchModule(targetModuleId) {
    // 获取所有模块
    const modules = document.querySelectorAll('.module');
    
    // 隐藏所有模块
    modules.forEach(module => {
        module.classList.add('hidden');
    });
    
    // 显示目标模块
    const targetModule = document.getElementById(targetModuleId);
    if (targetModule) {
        targetModule.classList.remove('hidden');
    }
}

// 发送消息的函数
async function sendMessage() {
    const userInput = document.getElementById('user-input');
    const input = userInput.value.trim();
    
    if (input) {
        // 显示用户消息
        displayUserMessage(input);
        userInput.value = '';
        
        // 处理用户输入
        await processUserInput(input);
    }
}

// 处理文件上传
async function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        try {
            // 显示用户上传的原始图片
            displayUserImage(file);
            
            // 处理图片并显示结果
            await processImage(file);
            
            // 清除文件输入，允许重复上传相同的文件
            event.target.value = '';
        } catch (error) {
            console.error('处理图片时出错：', error);
            displayResponse({
                type: 'text',
                content: '抱歉，处理图片时出现了问题。请稍后重试。'
            });
        }
    }
}

// 初始化事件监听器
document.addEventListener('DOMContentLoaded', function() {
    // 发送按钮点击事件
    document.getElementById('send-button').addEventListener('click', sendMessage);
    
    // 输入框回车事件
    document.getElementById('user-input').addEventListener('keypress', async function(e) {
        if (e.key === 'Enter') {
            await sendMessage();
        }
    });
    
    // 文件上传事件
    document.getElementById('upload-image').addEventListener('change', handleFileUpload);
});

// 显示响应的函数
function displayResponse(response) {
    const chatBox = document.querySelector('.chat-container');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message assistant';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';

    if (response.type === 'image') {
        // 创建图片元素
        const img = document.createElement('img');
        img.src = response.content;
        img.className = 'response-image';
        img.style.maxWidth = '100%';
        img.style.borderRadius = '8px';
        contentDiv.appendChild(img);

        // 如果有附带消息，添加消息文本
        if (response.message) {
            const messageText = document.createElement('p');
            messageText.textContent = response.message;
            messageText.style.marginTop = '8px';
            contentDiv.appendChild(messageText);
        }
    } else {
        // 处理文本消息，支持换行
        const textLines = response.content.split('\n');
        textLines.forEach((line, index) => {
            if (index > 0) {
                contentDiv.appendChild(document.createElement('br'));
            }
            contentDiv.appendChild(document.createTextNode(line));
        });
    }

    // 添加助手头像
    const assistantAvatar = document.createElement('img');
    assistantAvatar.src = './images/assistant-avatar.png';
    assistantAvatar.className = 'assistant-avatar';
    assistantAvatar.alt = 'Assistant Avatar';

    messageDiv.appendChild(contentDiv);
    messageDiv.appendChild(assistantAvatar);
    
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// 显示用户消息的函数
function displayUserMessage(input) {
    const chatContainer = document.querySelector('.chat-container');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = input;
    
    const avatarImg = document.createElement('img');
    avatarImg.src = './images/avatar-placeholder.png';
    avatarImg.className = 'user-avatar';
    avatarImg.alt = 'User Avatar';
    
    messageDiv.appendChild(contentDiv);
    messageDiv.appendChild(avatarImg);
    
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// 显示用户上传的图片
function displayUserImage(file) {
    const chatContainer = document.querySelector('.chat-container');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    img.className = 'message-image';
    contentDiv.appendChild(img);
    
    const avatarImg = document.createElement('img');
    avatarImg.src = './images/avatar-placeholder.png';
    avatarImg.className = 'user-avatar';
    avatarImg.alt = 'User Avatar';
    
    messageDiv.appendChild(contentDiv);
    messageDiv.appendChild(avatarImg);
    
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// 图片美化函数
async function enhanceImage(file) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            // 创建 canvas
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // 设置 canvas 尺寸
            canvas.width = img.width;
            canvas.height = img.height;
            
            // 绘制原始图片
            ctx.drawImage(img, 0, 0);
            
            // 获取图片数据
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            
            // 应用图片增强效果
            for (let i = 0; i < data.length; i += 4) {
                // 提取 RGB 值
                let r = data[i];
                let g = data[i + 1];
                let b = data[i + 2];

                // 计算亮度
                const brightness = (r + g + b) / 3;
                
                // 增加亮度 (1.2 = 增加 20%)
                r *= 1.2;
                g *= 1.2;
                b *= 1.2;
                
                // 增加对比度
                const factor = 1.4; // 对比度因子
                r = factor * (r - 128) + 128;
                g = factor * (g - 128) + 128;
                b = factor * (b - 128) + 128;

                // 增加饱和度
                const saturationFactor = 1.3; // 饱和度增加30%
                const avg = (r + g + b) / 3;
                r = avg + (r - avg) * saturationFactor;
                g = avg + (g - avg) * saturationFactor;
                b = avg + (b - avg) * saturationFactor;

                // 简单的锐化效果
                if (i > 0 && i < data.length - 4) {
                    const prevBrightness = (data[i - 4] + data[i - 3] + data[i - 2]) / 3;
                    if (Math.abs(brightness - prevBrightness) > 10) {
                        r *= 1.2;
                        g *= 1.2;
                        b *= 1.2;
                    }
                }
                
                // 确保值在 0-255 范围内
                data[i] = Math.min(255, Math.max(0, r));
                data[i + 1] = Math.min(255, Math.max(0, g));
                data[i + 2] = Math.min(255, Math.max(0, b));
            }
            
            // 将处理后的数据放回 canvas
            ctx.putImageData(imageData, 0, 0);
            
            // 转换为 Blob，使用较高的质量设置
            canvas.toBlob((blob) => {
                resolve(blob);
            }, 'image/jpeg', 0.98); // 提高质量到98%
        };
        
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
    });
}