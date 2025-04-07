# import json
# from googletrans import Translator
# import time

# # تهيئة المترجم
# translator = Translator()

# # تحديد مسارات الملفات
# input_file_path = r'C:\Users\mina-\Desktop\hany\DB(without-id)\tasbe7naDBARb.json'
# output_file_path = r'C:\Users\mina-\Desktop\hany\DB(without-id)\translated_tesp7naENG.json'

# # قراءة ملف JSON
# with open(input_file_path, 'r', encoding='utf-8') as file:
#     data = json.load(file)

# # فتح ملف الخرج في وضع الكتابة
# with open(output_file_path, 'w', encoding='utf-8') as file:
#     file.write('[\n')  # كتابة بداية القائمة في ملف JSON

#     # ترجمة النصوص وكتابة كل عنصر بعد ترجمته مباشرة
#     start_time = time.time()
#     for i, item in enumerate(data):
#         if i % 100 == 0:
#             elapsed_time = time.time() - start_time
#             print(f"Translating item {i + 1} of {len(data)}... Elapsed time: {elapsed_time:.2f} seconds")

#         if 'title' in item:
#             item['title'] = translator.translate(item['title'], src='ar', dest='en').text
#         if 'chorus' in item:
#             item['chorus'] = [translator.translate(chorus, src='ar', dest='en').text for chorus in item['chorus']]
#         if 'verses' in item:
#             item['verses'] = [[translator.translate(verse, src='ar', dest='en').text for verse in verse_group] for verse_group in item['verses']]

#         # كتابة العنصر المترجم في ملف الخرج
#         json.dump(item, file, ensure_ascii=False, indent=4)
        
#         # إضافة فاصلة بعد كل عنصر ما عدا الأخير
#         if i < len(data) - 1:
#             file.write(',\n')
    
#     file.write('\n]')  # كتابة نهاية القائمة في ملف JSON

#     total_time = time.time() - start_time
#     print(f"Translation completed in {total_time:.2f} seconds")

# import json
# from googletrans import Translator

# # تهيئة المترجم
# translator = Translator()

# # تحديد مسارات الملفات
# input_file_path = r'C:\Users\mina-\Desktop\hany\DB(with-id)\tasbe7naDBRbWithSongID.json'
# output_file_path = r'C:\Users\mina-\Desktop\hany\DB(without-id)\translated_tesp7naENG.json'

# # قراءة ملف JSON
# with open(input_file_path, 'r', encoding='utf-8') as file:
#     data = json.load(file)

# # فتح ملف الخرج في وضع الكتابة
# with open(output_file_path, 'w', encoding='utf-8') as file:
#     file.write('[\n')  # كتابة بداية القائمة في ملف JSON

#     # ترجمة النصوص وكتابة كل عنصر بعد ترجمته مباشرة
#     for i, item in enumerate(data):
#         song_id = item.get('songID')
#         print(f"Processing item {i + 1} with songID: {song_id}")  # Print songID for debugging
#         if song_id and 1 <= song_id <= 25:
#             print(f"Translating item with songID: {song_id}")  # Print songID for debugging
#             if 'title' in item:
#                 item['title'] = translator.translate(item['title'], src='ar', dest='en').text
#             if 'chorus' in item:
#                 item['chorus'] = [translator.translate(chorus, src='ar', dest='en').text for chorus in item['chorus']]
#             if 'verses' in item:
#                 item['verses'] = [[translator.translate(verse, src='ar', dest='en').text for verse in verse_group] for verse_group in item['verses']]

#             # كتابة العنصر المترجم في ملف الخرج
#             json.dump(item, file, ensure_ascii=False, indent=4)
            
#             # إضافة فاصلة بعد كل عنصر ما عدا الأخير
#             if i < len(data) - 1:
#                 file.write(',\n')

#     file.write('\n]')  # كتابة نهاية القائمة في ملف JSON

# print("تمت الترجمة وحفظ الملف بنجاح")

import json
from googletrans import Translator
import time
import shutil

# تهيئة المترجم
translator = Translator()

# تحديد مسارات الملفات
input_file_path = r'C:\Users\mina-\Desktop\hany\DB(without-id)\tasbe7naDBARb.json'
output_file_path = r'C:\Users\mina-\Desktop\hany\DB(without-id)\translated_tesp7naENG.json'
temp_output_file_path = r'C:\Users\mina-\Desktop\hany\DB(without-id)\temp_translated_tesp7naENG.json'

# قراءة المحتوى السابق إذا كان موجودًا
try:
    with open(output_file_path, 'r', encoding='utf-8') as file:
        existing_data = json.load(file)
except FileNotFoundError:
    existing_data = []

# جمع تفاصيل النطاق المطلوب من المستخدم
start_song_id = int(input("Enter the start song ID: "))
end_song_id = int(input("Enter the end song ID: "))

# قراءة ملف JSON
with open(input_file_path, 'r', encoding='utf-8') as file:
    data = json.load(file)

# فتح ملف الخرج في وضع الكتابة المؤقتة
with open(temp_output_file_path, 'w', encoding='utf-8') as file:
    # إضافة البيانات الموجودة مسبقًا إلى الملف المؤقت
    for existing_item in existing_data:
        json.dump(existing_item, file, ensure_ascii=False, indent=4)
        file.write(',\n')

    # ترجمة النصوص وكتابة كل عنصر بعد ترجمته مباشرة
    for i, item in enumerate(data):
        song_id = item.get('songID')
        if song_id is not None and start_song_id <= song_id <= end_song_id:
            if 'title' in item:
                item['title'] = translator.translate(item['title'], src='ar', dest='en').text
            if 'chorus' in item:
                item['chorus'] = [translator.translate(chorus, src='ar', dest='en').text for chorus in item['chorus']]
            if 'verses' in item:
                item['verses'] = [[translator.translate(verse, src='ar', dest='en').text for verse in verse_group] for verse_group in item['verses']]

            # كتابة العنصر المترجم في ملف الخرج المؤقت
            json.dump(item, file, ensure_ascii=False, indent=4)
            file.write(',\n')

# نقل الملف المؤقت إلى الملف النهائي
shutil.move(temp_output_file_path, output_file_path)

print("تمت الترجمة وحفظ الملف بنجاح")
