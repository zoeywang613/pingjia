// 意图识别和处理模块
const IntentTypes = {
    OPTIMIZE_IMAGE: 'optimize_image',
    OPTIMIZE_CONTENT: 'optimize_content',
    CHAT: 'chat',
    OPTIMIZE_REVIEW: 'optimize_review'
};

// 商品描述相关的关键词
const REVIEW_KEYWORDS = [
    // 美食相关
    '好吃', '难吃', '味道', '口感', '分量', '食材', '新鲜',
    '火锅', '餐厅', '菜品', '食物', '美食', '小吃', '甜点',
    '饭店', '烧烤', '外卖', '堂食', '饮品', '奶茶',
    '咸', '甜', '辣', '酸', '鲜', '香', '脆', '嫩', '软', '硬',

    // 店铺相关
    '店铺', '商家', '门店', '实体店', '旗舰店', '专卖店', '直营店',
    '服务', '态度', '环境', '装修', '卫生', '整洁', '氛围',
    '位置', '交通', '停车', '营业时间', '生意',

    // 服装相关
    '衣服', '裤子', '鞋子', '包包', '配饰', '首饰', '手表',
    '尺码', '面料', '材质', '做工', '款式', '设计', '版型',
    '时尚', '潮流', '百搭', '舒适', '合身', '修身',

    // 价格相关
    '价格', '价位', '便宜', '贵', '实惠', '划算', '性价比',
    '优惠', '折扣', '促销', '特价', '性价比',

    // 品质相关
    '品质', '质量', '档次', '等级', '水平', '档位', '规格',
    '正品', '假货', '真假', '品牌', '名牌', '高端', '奢侈',

    // 包装相关
    '包装', '外观', '颜色', '款式', '设计', '样式', '造型',
    '精美', '简约', '豪华', '精致', '高档',

    // 体验感受
    '体验', '感受', '感觉', '印象', '评价', '点评', '推荐',
    '差', '一般', '还行', '不错', '很棒', '优秀', '糟糕',
    '满意', '失望', '惊喜', '后悔', '喜欢', '讨厌', '期待',
    '下次', '再来', '回购', '复购', '推荐', '安利',

    // 物流相关
    '发货', '收货', '快递', '配送', '物流', '送货', '到货',
    '包装', '防护', '完整', '损坏', '破损',

    // 服务相关
    '售前', '售后', '客服', '服务态度', '解决', '处理', '退换',
    '退款', '换货', '维修', '保修', '保养'
];

// 意图识别函数
async function detectIntent(input) {
    let intent;
    
    // 检查是否是图片输入
    if (input instanceof File && input.type.startsWith('image/')) {
        intent = IntentTypes.OPTIMIZE_IMAGE;
        console.log('✨ 意图识别结果：优化图片');
        return intent;
    }

    // 检查是否包含商品描述关键词
    const hasReviewKeyword = REVIEW_KEYWORDS.some(keyword => input.includes(keyword));
    
    if (hasReviewKeyword) {
        console.log('✨ 意图识别结果：优化评价（通过关键词匹配）');
        intent = IntentTypes.OPTIMIZE_REVIEW;
        return intent;
    }

    // 检查是否明确要求优化评价
    if (input.includes('评价') || input.includes('点评') || 
        input.includes('帮我优化') || input.includes('生成评价')) {
        console.log('✨ 意图识别结果：优化评价（通过明确指令）');
        intent = IntentTypes.OPTIMIZE_REVIEW;
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
    const currentIntent = await detectIntent(input);

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
        case IntentTypes.OPTIMIZE_REVIEW:
            response = await callWenxinAPI(input, {
                system: "你是一个专业的评价助手。请根据用户描述，生成100字左右的一个真实、自然的评价。"
            });
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
    console.log('处理用户输入...'); // 调试日志
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
    console.log('处理文件上传...'); // 调试日志
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

// 添加生成评价的辅助函数
async function generatePositiveReview(input, keywords) {
    // 商品描述词组
    const descriptions = {
        quality: ['质量很好', '品质出众', '用料讲究', '做工精细', '用料上乘', '品质优良'],
        appearance: ['外观漂亮', '设计时尚', '颜值很高', '外形美观', '款式新颖'],
        experience: ['使用体验好', '操作方便', '体验感极佳', '用起来很舒服', '使用感很好'],
        service: ['服务周到', '客服很专业', '售后无忧', '服务很贴心', '客服响应快'],
        price: ['性价比高', '价格实惠', '很划算', '价位合理', '物超所值'],
        packaging: ['包装精美', '包装严实', '包装很用心', '包装完好', '包装很专业'],
        delivery: ['送货快', '物流给力', '配送及时', '发货速度快', '很快就收到了']
    };

    // 生成评价主体
    const info = extractProductInfo(input, keywords);
    const mainPoints = [];
    
    // 从用户输入提取关键信息
    mainPoints.push(info.details);
    if (info.highlights) {
        mainPoints.push(info.highlights);
    }
    
    // 随机添加2-3个其他描述
    const categories = Object.keys(descriptions);
    while (mainPoints.length < 4) {
        const category = categories[Math.floor(Math.random() * categories.length)];
        const description = descriptions[category][Math.floor(Math.random() * descriptions[category].length)];
        if (!mainPoints.includes(description)) {
            mainPoints.push(description);
        }
    }

    // 生成开头
    const openings = [
        `这款${info.productType}真的很不错！`,
        `非常满意这次购买的${info.productType}。`,
        `很开心入手了这款${info.productType}。`,
        `这个${info.productType}真的超出预期！`
    ];

    // 生成结尾
    const endings = [
        '总的来说非常满意，推荐给大家！',
        '整体体验很好，值得购买！',
        '真心推荐这款产品，不会让你失望的！',
        '非常满意这次的选择，以后还会回购！'
    ];

    // 组合评价
    const review = [
        openings[Math.floor(Math.random() * openings.length)],
        mainPoints.join('，'),
        endings[Math.floor(Math.random() * endings.length)]
    ].join('');

    return review;
}

async function generateNegativeReview(input, keywords) {
    // 商品问题描述词组
    const problems = {
        quality: ['质量一般', '做工粗糙', '用料太差', '不够耐用', '容易损坏'],
        appearance: ['外观一般', '款式过时', '外形不够美观', '设计不够好', '做工不精致'],
        experience: ['使用体验差', '操作不便', '体验感不好', '用着不舒服', '使用感差'],
        service: ['服务态度差', '客服不专业', '售后不理想', '服务不到位', '客服响应慢'],
        price: ['性价比低', '价格偏高', '不太划算', '价位不合理', '不值这个价'],
        packaging: ['包装简陋', '包装不严实', '包装太随意', '包装有损坏', '包装不专业'],
        defects: ['有瑕疵', '有问题', '不够完善', '有缺陷', '有故障']
    };

    // 生成评价主体
    const info = extractProductInfo(input, keywords);
    const mainPoints = [];
    
    // 从用户输入提取关键信息
    mainPoints.push(info.details);
    if (info.highlights) {
        mainPoints.push(info.highlights);
    }
    
    // 随机添加2-3个其他问题描述
    const categories = Object.keys(problems);
    while (mainPoints.length < 4) {
        const category = categories[Math.floor(Math.random() * categories.length)];
        const problem = problems[category][Math.floor(Math.random() * problems[category].length)];
        if (!mainPoints.includes(problem)) {
            mainPoints.push(problem);
        }
    }

    // 生成开头
    const openings = [
        `对这款${info.productType}不太满意。`,
        `这次购买的${info.productType}体验很差。`,
        `不推荐购买这款${info.productType}。`,
        `这个${info.productType}让人很失望。`
    ];

    // 生成结尾
    const endings = [
        '总的来说不推荐购买，建议慎重考虑。',
        '希望商家能够改进产品质量。',
        '不建议购买，还是选择其他产品比较好。',
        '整体来说性价比不高，不太推荐。'
    ];

    // 组合评价
    const review = [
        openings[Math.floor(Math.random() * openings.length)],
        mainPoints.join('，'),
        endings[Math.floor(Math.random() * endings.length)]
    ].join('');

    return review;
}

async function generateNeutralReview(input, keywords) {
    // 中性描述词组
    const descriptions = {
        quality: ['质量一般', '品质中规中矩', '做工还行', '用料一般', '品质还可以'],
        appearance: ['外观普通', '设计中规中矩', '颜值一般', '外形还行', '款式简单'],
        experience: ['使用体验一般', '操作还行', '体验感中等', '用着还行', '使用感一般'],
        service: ['服务一般', '客服还行', '售后中规中矩', '服务态度还可以', '客服一般'],
        price: ['性价比一般', '价格中等', '价位还行', '价格适中', '性价比中等'],
        packaging: ['包装一般', '包装中规中矩', '包装还行', '包装简单', '包装普通'],
        overall: ['总体一般', '整体中规中矩', '没有特别惊喜', '中规中矩', '表现一般']
    };

    // 生成评价主体
    const info = extractProductInfo(input, keywords);
    const mainPoints = [];
    
    // 从用户输入提取关键信息
    mainPoints.push(info.details);
    if (info.highlights) {
        mainPoints.push(info.highlights);
    }
    
    // 随机添加2-3个其他描述
    const categories = Object.keys(descriptions);
    while (mainPoints.length < 4) {
        const category = categories[Math.floor(Math.random() * categories.length)];
        const description = descriptions[category][Math.floor(Math.random() * descriptions[category].length)];
        if (!mainPoints.includes(description)) {
            mainPoints.push(description);
        }
    }

    // 生成开头
    const openings = [
        `这款${info.productType}总体来说中规中矩。`,
        `对这个${info.productType}的评价比较中肯。`,
        `这个${info.productType}整体表现一般。`,
        `对这款${info.productType}没有特别的惊喜或失望。`
    ];

    // 生成结尾
    const endings = [
        '仁者见仁智者见智，建议根据个人需求选择。',
        '可以考虑购买，但建议货比三家。',
        '如果预算合适可以考虑，但也可以看看其他选择。',
        '总的来说中规中矩，适合要求不高的朋友。'
    ];

    // 组合评价
    const review = [
        openings[Math.floor(Math.random() * openings.length)],
        mainPoints.join('，'),
        endings[Math.floor(Math.random() * endings.length)]
    ].join('');

    return review;
}

function extractProductInfo(input, keywords) {
    // 提取商品类型
    let productType = '商品';
    const productKeywords = ['商品', '产品', '东西', '物品'];
    for (const keyword of keywords) {
        if (!productKeywords.includes(keyword)) {
            productType = keyword;
            break;
        }
    }

    // 提取细节描述
    let details = [];
    const detailWords = input.split(/[,，.。!！?？]/);
    detailWords.forEach(word => {
        if (word.length > 2 && !details.includes(word)) {
            details.push(word.trim());
        }
    });

    // 提取亮点/问题
    let highlights = [];
    keywords.forEach(keyword => {
        const index = input.indexOf(keyword);
        if (index !== -1) {
            const surrounding = input.substring(Math.max(0, index - 10), Math.min(input.length, index + 10));
            if (!highlights.includes(surrounding)) {
                highlights.push(surrounding.trim());
            }
        }
    });

    return {
        productType: productType,
        details: details.length > 0 ? details[Math.floor(Math.random() * details.length)] : '各方面表现',
        highlights: highlights.length > 0 ? highlights[Math.floor(Math.random() * highlights.length)] : '使用体验'
    };
}

// 获取文心一言访问令牌
let currentAccessToken = null;
let tokenExpireTime = 0;
async function getAccessToken() {
    try {
        console.log('正在获取访问令牌...');
        const response = await fetch('http://localhost:3000/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`获取令牌失败: ${response.status}`);
        }
        
        const data = await response.json();
        if (!data.access_token) {
            throw new Error('获取令牌失败: 返回数据中没有access_token');
        }
        
        console.log('成功获取访问令牌');
        return data.access_token;
    } catch (error) {
        console.error('获取访问令牌失败:', error);
        throw error;
    }
}

// 调用文心API
async function callWenxinAPI(input, options = {}) {
    try {
        console.log('准备调用文心API...');
        const accessToken = await getAccessToken();
        if (!accessToken) {
            throw new Error('无法获取访问令牌');
        }
        
        const messages = [];
        
        // system提示放在开头，作为assistant的消息
        if (options.system) {
            messages.push({
                role: 'assistant',
                content: options.system
            });
            
            // 添加一个空的用户确认消息
            messages.push({
                role: 'user',
                content: '好的，我明白了。'
            });
        }

        // 用户实际输入放在最后
        messages.push({
            role: 'user',
            content: input
        });

        console.log('发送请求到文心API...');
        console.log('请求内容:', { messages });
        
        const response = await fetch('http://localhost:3000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                accessToken,
                messages
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API请求失败: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        if (!data.result) {
            throw new Error('API响应中没有result字段');
        }
        
        console.log('成功获取API响应:', data);
        return data.result;
    } catch (error) {
        console.error('调用文心API失败:', error);
        throw error;
    }
}

// 处理用户输入
async function handleUserInput() {
    console.log('处理用户输入...'); // 调试日志
    const input = document.getElementById('user-input').value.trim();
    if (!input) {
        console.log('输入为空，不处理');
        return;
    }

    console.log('用户输入:', input); // 调试日志

    // 清空输入框
    document.getElementById('user-input').value = '';

    // 添加用户消息到聊天框
    addMessage('user', input);

    try {
        // 识别意图
        const intent = await detectIntent(input);
        console.log('识别到的意图:', intent);

        let response;
        if (intent === 'optimize_review') {
            // 评价优化意图
            response = await callWenxinAPI(input, {
                system: "你是一个专业的评价助手。请根据用户描述，生成一个100字左右的真实、自然的评价。"
            });
        } else {
            // 闲聊意图
            response = await callWenxinAPI(input, {
                system: "你是一个温暖、友好的助手。在与用户聊天过程中，请提醒他们可以'描述商品'，让你来帮助他们优化商品评价，或者提醒他们上传图片，你可以帮他们优化图片。"
            });
        }

        // 添加助手回复到聊天框
        addMessage('assistant', response);

    } catch (error) {
        console.error('处理用户输入时发生错误:', error);
        addMessage('assistant', '抱歉，发生了一些错误，请稍后再试。');
    }
}

// 处理图片上传
async function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    try {
        console.log('处理图片上传...'); // 调试日志
        
        // 显示原始图片
        displayUserImage(file);
        
        // 优化图片
        const optimizedImage = await enhanceImage(file);
        if (optimizedImage) {
            // 显示优化后的图片
            displayOptimizedImage(optimizedImage);
            
            // 提示用户
            addMessage('assistant', '我已经帮你优化了图片的效果，你可以继续添加评价内容，我来帮你生成一个精美的评价。');
        }
    } catch (error) {
        console.error('处理图片时发生错误:', error);
        addMessage('assistant', '抱歉，处理图片时出现了问题，请稍后再试。');
    }
}

// 图片美化函数
async function enhanceImage(file) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // 设置画布大小
                canvas.width = img.width;
                canvas.height = img.height;
                
                // 绘制原始图片
                ctx.drawImage(img, 0, 0);
                
                // 应用图像处理
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;
                
                // 增强对比度和饱和度
                for (let i = 0; i < data.length; i += 4) {
                    // 提高对比度
                    data[i] = data[i] * 1.2;     // R
                    data[i + 1] = data[i + 1] * 1.2; // G
                    data[i + 2] = data[i + 2] * 1.2; // B
                    
                    // 确保值在0-255范围内
                    data[i] = Math.min(255, Math.max(0, data[i]));
                    data[i + 1] = Math.min(255, Math.max(0, data[i + 1]));
                    data[i + 2] = Math.min(255, Math.max(0, data[i + 2]));
                }
                
                // 将处理后的图像数据放回画布
                ctx.putImageData(imageData, 0, 0);
                
                // 转换为base64格式
                const optimizedImageUrl = canvas.toDataURL('image/jpeg', 0.9);
                resolve(optimizedImageUrl);
            } catch (error) {
                reject(error);
            }
        };
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
    });
}

// 显示优化后的图片
function displayOptimizedImage(imageUrl) {
    console.log('显示优化后的图片...'); // 调试日志
    const chatContainer = document.querySelector('.chat-container');
    if (!chatContainer) {
        console.error('找不到聊天容器元素');
        return;
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = 'message assistant';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    const img = document.createElement('img');
    img.src = imageUrl;
    img.className = 'message-image';
    contentDiv.appendChild(img);
    
    const avatarImg = document.createElement('img');
    avatarImg.src = './images/bot-avatar.png';
    avatarImg.className = 'assistant-avatar';
    avatarImg.alt = 'Assistant Avatar';
    
    messageDiv.appendChild(contentDiv);
    messageDiv.appendChild(avatarImg);
    
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// 显示用户上传的图片
function displayUserImage(file) {
    console.log('显示用户上传的图片...'); // 调试日志
    const chatContainer = document.querySelector('.chat-container');
    if (!chatContainer) {
        console.error('找不到聊天容器元素');
        return;
    }

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

// 初始化事件监听器
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM 已加载，初始化事件监听器...'); // 调试日志

    // 上传按钮点击事件
    const uploadButton = document.getElementById('upload-button');
    const uploadInput = document.getElementById('upload-image');
    if (uploadButton && uploadInput) {
        console.log('找到上传按钮和输入框，添加事件监听器');
        uploadButton.addEventListener('click', () => {
            uploadInput.click();
        });
        uploadInput.addEventListener('change', handleImageUpload);
    } else {
        console.error('未找到上传按钮或输入框');
    }

    // 发送按钮点击事件
    const sendButton = document.getElementById('send-button');
    if (sendButton) {
        console.log('找到发送按钮，添加事件监听器');
        sendButton.addEventListener('click', async () => {
            await handleUserInput();
        });
    } else {
        console.error('未找到发送按钮');
    }

    // 输入框回车事件
    const userInput = document.getElementById('user-input');
    if (userInput) {
        console.log('找到输入框，添加事件监听器');
        userInput.addEventListener('keypress', async function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                await handleUserInput();
            }
        });
    } else {
        console.error('未找到输入框');
    }
});

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

// 添加消息到聊天框
function addMessage(type, content) {
    const messageContainer = document.querySelector('.chat-container');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';

    if (typeof content === 'string') {
        contentDiv.textContent = content;
    } else if (content instanceof HTMLImageElement) {
        contentDiv.appendChild(content);
    }

    // 如果是助手消息，添加操作按钮
    if (type === 'assistant') {
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'message-actions';

        // 复制按钮
        const copyBtn = document.createElement('button');
        copyBtn.className = 'action-button copy-btn';
        copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
        copyBtn.onclick = () => copyMessage(content);

        // 分享按钮
        const shareBtn = document.createElement('button');
        shareBtn.className = 'action-button share-btn';
        shareBtn.innerHTML = '<i class="fas fa-share"></i>';
        shareBtn.onclick = () => shareMessage(content);

        // 发布按钮
        const publishBtn = document.createElement('button');
        publishBtn.className = 'action-button publish-btn';
        publishBtn.innerHTML = '<i class="fas fa-paper-plane"></i>';
        publishBtn.onclick = () => {
            showTooltip('已发布到附近的评价广场');
        };

        actionsDiv.appendChild(copyBtn);
        actionsDiv.appendChild(shareBtn);
        actionsDiv.appendChild(publishBtn);
        contentDiv.appendChild(actionsDiv);
    }

    // 添加头像
    const avatarImg = document.createElement('img');
    if (type === 'user') {
        avatarImg.src = './images/avatar-placeholder.png';
        avatarImg.className = 'user-avatar';
        avatarImg.alt = 'User Avatar';
    } else {
        avatarImg.src = './images/bot-avatar.png';
        avatarImg.className = 'assistant-avatar';
        avatarImg.alt = 'Assistant Avatar';
    }

    messageDiv.appendChild(contentDiv);
    messageDiv.appendChild(avatarImg);
    
    messageContainer.appendChild(messageDiv);
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

// 复制消息内容
async function copyMessage(content) {
    let textToCopy;
    
    if (typeof content === 'string') {
        textToCopy = content;
    } else if (content instanceof HTMLImageElement) {
        try {
            const blob = await fetch(content.src).then(r => r.blob());
            await navigator.clipboard.write([
                new ClipboardItem({
                    [blob.type]: blob
                })
            ]);
            showTooltip('图片已复制到剪贴板');
            return;
        } catch (err) {
            console.error('复制图片失败:', err);
            showTooltip('复制图片失败');
            return;
        }
    }

    try {
        await navigator.clipboard.writeText(textToCopy);
        showTooltip('文本已复制到剪贴板');
    } catch (err) {
        console.error('复制文本失败:', err);
        showTooltip('复制失败');
    }
}

// 分享消息内容
async function shareMessage(content) {
    let shareData = {
        title: '商品评价助手',
        text: typeof content === 'string' ? content : '分享一张图片',
    };

    if (content instanceof HTMLImageElement) {
        try {
            const blob = await fetch(content.src).then(r => r.blob());
            shareData.files = [
                new File([blob], 'shared-image.png', { type: blob.type })
            ];
        } catch (err) {
            console.error('准备分享图片失败:', err);
        }
    }

    try {
        await navigator.share(shareData);
        showTooltip('分享成功');
    } catch (err) {
        console.error('分享失败:', err);
        if (err.name === 'AbortError') {
            // 用户取消分享
            return;
        }
        showTooltip('分享失败');
    }
}

// 显示提示信息
function showTooltip(message) {
    let tooltip = document.querySelector('.copy-tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.className = 'copy-tooltip';
        document.body.appendChild(tooltip);
    }

    tooltip.textContent = message;
    tooltip.style.left = '50%';
    tooltip.style.top = '50%';
    tooltip.style.transform = 'translate(-50%, -50%)';
    tooltip.classList.add('show');

    setTimeout(() => {
        tooltip.classList.remove('show');
    }, 2000);
}