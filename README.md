# منصة ClassWithOnline التعليمية

## نظرة عامة
منصة تعليمية متكاملة تقدم دورات تعليمية في اللغة الإنجليزية وشروحات الصف الثالث الثانوي، مع ميزات متقدمة تشمل الفيديوهات التعليمية، أوراق العمل، الاختبارات المحاكاة التفاعلية، ونظام الرسائل والتنبيهات.

## المميزات الرئيسية

### 1. الأقسام الثلاثة
- **STEP**: برنامج تأسيس اللغة الإنجليزية للمبتدئين
- **شروحات الصف الثالث الثانوي**: محتوى تعليمي متقدم للطلاب
- **تأسيس اللغة الإنجليزية**: برنامج شامل بمستويات متعددة

### 2. المحتوى التعليمي
- **فيديوهات تعليمية**: شروح فيديو تفصيلية
- **ملفات PDF**: كتب وملفات تعليمية قابلة للتحميل
- **أوراق عمل**: أوراق عمل محلولة وغير محلولة

### 3. الاختبارات المحاكاة
- اختبارات تفاعلية متعددة الخيارات
- تقييم فوري للإجابات
- حفظ النتائج في قاعدة البيانات

### 4. نظام الرسائل والتنبيهات
- نظام رسائل لتواصل الطلاب مع بعضهم
- تنبيهات فورية للإعلانات المهمة
- واجهة سهلة الاستخدام

### 5. لوحة التحكم
- إدارة شاملة للدورات والاختبارات
- إضافة وتعديل وحذف المحتوى
- عرض الإحصائيات والتحليلات

## البنية التقنية

### التقنيات المستخدمة
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: PHP
- **Database**: Firebase Realtime Database
- **Authentication**: Firebase Authentication

### هيكل المشروع
```
project_edu/
├── index.html                 # الصفحة الرئيسية
├── admin/
│   ├── index.html            # لوحة التحكم
│   └── manage-courses.php    # إدارة المحتوى (API)
├── includes/
│   └── firebase-config.php   # إعدادات Firebase
├── assets/
│   ├── css/
│   │   └── style.css         # أنماط الموقع
│   └── js/
│       └── firebase-app.js   # وظائف Firebase
└── README.md                 # هذا الملف
```

## إعدادات Firebase

تم تكوين الموقع للاتصال بـ Firebase Realtime Database باستخدام البيانات التالية:

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyCqDJvWVMz2blT9P4vrEQQ5CpFAZZBS9Eo",
    authDomain: "classwithonline.firebaseapp.com",
    databaseURL: "https://classwithonline-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "classwithonline",
    storageBucket: "classwithonline.firebasestorage.app",
    messagingSenderId: "253846485060",
    appId: "1:253846485060:web:50287705cd9be34ca0e411",
    measurementId: "G-M9XFLBQZFL"
};
```

## كيفية الاستخدام

### للطلاب

1. **الوصول للموقع**: افتح `index.html` في المتصفح
2. **استكشاف الدورات**: تصفح الأقسام الثلاثة والدورات المتاحة
3. **مشاهدة الفيديوهات**: اضغط على الفيديوهات لمشاهدتها
4. **تحميل الملفات**: حمّل أوراق العمل وملفات PDF
5. **إجراء الاختبارات**: شارك في الاختبارات المحاكاة واحصل على نتائجك فوراً
6. **التواصل**: أرسل رسائل وتفاعل مع الطلاب الآخرين
7. **متابعة التنبيهات**: ابقَ على اطلاع بآخر التحديثات

### للمعلمين/المسؤولين

1. **الدخول لوحة التحكم**: افتح `admin/index.html`
2. **إدارة الدورات**:
   - أضف دورات جديدة بعنوان ووصف ومستوى
   - أضف فيديوهات وملفات لكل دورة
   - عدّل أو احذف الدورات الموجودة

3. **إدارة الاختبارات**:
   - أنشئ اختبارات جديدة
   - أضف أسئلة متعددة الخيارات
   - حدد الإجابات الصحيحة

4. **إدارة التنبيهات**:
   - أرسل تنبيهات للطلاب
   - اختر نوع التنبيه (معلومة، نجاح، تحذير، خطر)

5. **مراقبة الإحصائيات**:
   - عرض عدد الدورات والاختبارات والرسائل والتنبيهات
   - تتبع نشاط الطلاب

## وظائف Firebase

### قراءة البيانات
```javascript
readFromFirebase('courses', (data) => {
    console.log(data);
});
```

### كتابة البيانات
```javascript
writeToFirebase('courses/course1', {
    title: 'Course Title',
    description: 'Course Description'
});
```

### إضافة بيانات جديدة
```javascript
addToFirebase('courses', {
    title: 'New Course',
    description: 'Description'
});
```

### تحديث البيانات
```javascript
updateFirebase('courses/course1', {
    title: 'Updated Title'
});
```

### حذف البيانات
```javascript
deleteFromFirebase('courses/course1');
```

## API Endpoints (PHP)

### الدورات
- `GET /admin/manage-courses.php?action=get_courses` - جلب جميع الدورات
- `GET /admin/manage-courses.php?action=get_course&id=courseId` - جلب دورة معينة
- `POST /admin/manage-courses.php?action=add_course` - إضافة دورة جديدة
- `POST /admin/manage-courses.php?action=update_course` - تحديث دورة
- `POST /admin/manage-courses.php?action=delete_course` - حذف دورة

### الاختبارات
- `GET /admin/manage-courses.php?action=get_quizzes` - جلب جميع الاختبارات
- `POST /admin/manage-courses.php?action=add_quiz` - إضافة اختبار جديد

### الرسائل
- `GET /admin/manage-courses.php?action=get_messages` - جلب جميع الرسائل
- `POST /admin/manage-courses.php?action=add_message` - إضافة رسالة جديدة

### التنبيهات
- `GET /admin/manage-courses.php?action=get_notifications` - جلب جميع التنبيهات
- `POST /admin/manage-courses.php?action=add_notification` - إضافة تنبيه جديد

## التصميم والاستجابة

الموقع مصمم بطريقة **Responsive** ويعمل بكفاءة على:
- أجهزة الكمبيوتر المكتبية
- الأجهزة اللوحية
- الهواتف الذكية

## الألوان والأنماط

تم استخدام نظام ألوان احترافي:
- **اللون الأساسي**: أزرق داكن (#2c3e50)
- **اللون الثانوي**: أزرق فاتح (#3498db)
- **لون النجاح**: أخضر (#27ae60)
- **لون الخطر**: أحمر (#e74c3c)
- **لون التحذير**: برتقالي (#f39c12)

## التوافقية

الموقع متوافق مع:
- Chrome
- Firefox
- Safari
- Edge
- جميع المتصفحات الحديثة

## الأمان

- استخدام Firebase Authentication للتحقق من المستخدمين
- قواعد أمان Firebase لحماية البيانات
- التحقق من صحة المدخلات على الخادم

## التطوير المستقبلي

يمكن إضافة المزيد من الميزات:
- نظام تقييم الطلاب
- شهادات إتمام الدورات
- تقارير تقدم الطلاب
- نظام دفع للدورات المدفوعة
- تطبيق موبايل
- دعم اللغات المتعددة

## الدعم والمساعدة

للحصول على الدعم أو الإبلاغ عن مشاكل:
- تواصل مع فريق التطوير
- راجع التوثيق الكاملة
- اطلب المساعدة من المسؤولين

## الترخيص

جميع الحقوق محفوظة © 2024 ClassWithOnline

---

**ملاحظة**: تأكد من أن لديك اتصال إنترنت نشط للوصول إلى Firebase Realtime Database.
