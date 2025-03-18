from telegram import Update, ReplyKeyboardMarkup, KeyboardButton
from telegram.ext import Updater, CommandHandler, MessageHandler, Filters, CallbackContext

# استبدل برمز التوكن الخاص بك
BOT_TOKEN = "YOUR_BOT_TOKEN"

def start(update: Update, context: CallbackContext) -> None:
    # إرسال زر لطلب رقم الهاتف
    keyboard = [
        [KeyboardButton("مشاركة رقم الهاتف", request_contact=True)]
    ]
    reply_markup = ReplyKeyboardMarkup(keyboard)
    update.message.reply_text("مرحبًا! هل تريد مشاركة رقم هاتفك؟", reply_markup=reply_markup)

def handle_contact(update: Update, context: CallbackContext) -> None:
    # التعامل مع رقم الهاتف المرسل من المستخدم
    contact = update.message.contact
    phone_number = contact.phone_number

    # إرسال رابط الموقع بعد الحصول على رقم الهاتف
    site_link = "https://forumeyedestruction.github.io/forumeyedestruction/"  # استبدل برابط الموقع الخاص بك
    update.message.reply_text(f"شكرًا على مشاركة رقم هاتفك! يمكنك زيارة موقعنا عبر الرابط: {site_link}")

    # إرسال رسالة مع رابط للموقع إلى تيليجرام، إذا كنت ترغب في ذلك
    chat_id = update.message.chat.id
    context.bot.send_message(chat_id, f"رابط الموقع: {site_link}")

def main():
    updater = Updater(BOT_TOKEN)

    dp = updater.dispatcher
    dp.add_handler(CommandHandler("start", start))
    dp.add_handler(MessageHandler(Filters.contact, handle_contact))

    updater.start_polling()
    updater.idle()

if __name__ == '__main__':
    main()
