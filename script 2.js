const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const botToken = "7589422040:AAEcOtxCePOEsZTfhYOIZH9WDEqATXOEUH8"; // استبدل هذا بتوكن البوت الخاص بك
const websiteLink = "https://yourwebsite.com"; // استبدل هذا برابط موقعك

const app = express();
app.use(bodyParser.json());

app.post(`/webhook/${botToken}`, async (req, res) => {
    const message = req.body.message;

    if (!message || !message.chat) return res.sendStatus(200);

    const chatId = message.chat.id;

    if (message.text === "/start") {
        await sendRequestPhoneNumber(chatId);
    } else if (message.contact) {
        await sendWebsiteLink(chatId);
    }

    res.sendStatus(200);
});

async function sendRequestPhoneNumber(chatId) {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const messageData = {
        chat_id: chatId,
        text: "📱 قم بمشاركة رقم هاتفك للموافقة على استخدام الخدمة.",
        reply_markup: {
            keyboard: [[{ text: "مشاركة رقم الهاتف", request_contact: true }]],
            one_time_keyboard: true,
            resize_keyboard: true
        }
    };

    await axios.post(url, messageData);
}

async function sendWebsiteLink(chatId) {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const messageData = {
        chat_id: chatId,
        text: `✅ شكراً لك! يمكنك الوصول إلى الموقع من هنا: ${websiteLink}`
    };

    await axios.post(url, messageData);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 السيرفر يعمل على المنفذ ${PORT}`);
});
