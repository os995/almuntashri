/**
 * وظائف متقدمة لإدارة الدورات والملفات
 * Advanced Functions for Course and File Management
 */

/**
 * دالة لتحميل ملف إلى الخادم
 * @param {File} file - الملف المراد تحميله
 * @param {string} type - نوع الملف (pdf, image, video)
 * @param {function} callback - دالة معالجة النتيجة
 */
function uploadFile(file, type, callback) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    fetch('admin/upload-handler.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showAlert('تم تحميل الملف بنجاح', 'success');
            callback(data);
        } else {
            showAlert(data.message, 'danger');
        }
    })
    .catch(error => {
        console.error('Error uploading file:', error);
        showAlert('خطأ في تحميل الملف', 'danger');
    });
}

/**
 * دالة لإضافة فيديو إلى دورة
 * @param {string} courseId - معرف الدورة
 * @param {string} videoTitle - عنوان الفيديو
 * @param {string} videoUrl - رابط الفيديو
 */
function addVideoToCourse(courseId, videoTitle, videoUrl) {
    readFromFirebase(`courses/${courseId}`, (data) => {
        if (data) {
            const videos = data.videos || {};
            const videoId = uniqid('video_');
            
            videos[videoId] = {
                title: videoTitle,
                url: videoUrl,
                added_at: new Date().toISOString()
            };

            updateFirebase(`courses/${courseId}`, { videos: videos });
        }
    });
}

/**
 * دالة لإضافة ملف إلى دورة
 * @param {string} courseId - معرف الدورة
 * @param {string} fileName - اسم الملف
 * @param {string} fileUrl - رابط الملف
 * @param {string} fileType - نوع الملف (محلول/غير محلول)
 */
function addFileToCourse(courseId, fileName, fileUrl, fileType) {
    readFromFirebase(`courses/${courseId}`, (data) => {
        if (data) {
            const files = data.files || {};
            const fileId = uniqid('file_');
            
            files[fileId] = {
                name: fileName,
                url: fileUrl,
                type: fileType,
                added_at: new Date().toISOString()
            };

            updateFirebase(`courses/${courseId}`, { files: files });
        }
    });
}

/**
 * دالة لإنشاء معرف فريد
 * @returns {string} معرف فريد
 */
function uniqid(prefix = '') {
    return prefix + Date.now() + Math.random().toString(36).substr(2, 9);
}

/**
 * دالة لتحويل رابط YouTube إلى رابط embed
 * @param {string} url - رابط YouTube
 * @returns {string} رابط embed
 */
function getYouTubeEmbedUrl(url) {
    let videoId = '';
    
    if (url.includes('youtube.com/watch?v=')) {
        videoId = url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0];
    }
    
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
}

/**
 * دالة لجلب نتائج الاختبارات
 * @param {function} callback - دالة معالجة النتائج
 */
function getQuizResults(callback) {
    readFromFirebase('quiz_results', (data) => {
        if (data) {
            callback(data);
        } else {
            callback({});
        }
    });
}

/**
 * دالة لحساب إحصائيات الاختبارات
 */
function calculateQuizStats() {
    getQuizResults((results) => {
        let totalAttempts = Object.keys(results).length;
        let totalScore = 0;
        let averagePercentage = 0;

        Object.keys(results).forEach(key => {
            totalScore += results[key].percentage || 0;
        });

        if (totalAttempts > 0) {
            averagePercentage = totalScore / totalAttempts;
        }

        console.log('Quiz Statistics:');
        console.log('Total Attempts:', totalAttempts);
        console.log('Average Percentage:', averagePercentage.toFixed(2) + '%');

        // تحديث عناصر الصفحة
        const statsContainer = document.getElementById('quiz-stats');
        if (statsContainer) {
            statsContainer.innerHTML = `
                <div class="cards-grid">
                    <div class="card">
                        <div class="card-header">
                            <h3>إجمالي المحاولات</h3>
                        </div>
                        <div class="card-body">
                            <p style="font-size: 2rem; text-align: center; color: var(--secondary-color);">
                                ${totalAttempts}
                            </p>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-header">
                            <h3>متوسط النسبة المئوية</h3>
                        </div>
                        <div class="card-body">
                            <p style="font-size: 2rem; text-align: center; color: var(--secondary-color);">
                                ${averagePercentage.toFixed(2)}%
                            </p>
                        </div>
                    </div>
                </div>
            `;
        }
    });
}

/**
 * دالة لإرسال تنبيه للطلاب
 * @param {string} title - عنوان التنبيه
 * @param {string} message - نص التنبيه
 * @param {string} type - نوع التنبيه
 */
function sendBroadcastNotification(title, message, type = 'info') {
    const notification = {
        title: title,
        message: message,
        type: type,
        sent_at: new Date().toISOString(),
        read_by: []
    };

    addToFirebase('notifications', notification);
}

/**
 * دالة لجلب إحصائيات الدورات
 */
function getCourseStats() {
    readFromFirebase('courses', (data) => {
        let stats = {
            total_courses: 0,
            total_videos: 0,
            total_files: 0
        };

        if (data) {
            stats.total_courses = Object.keys(data).length;

            Object.keys(data).forEach(key => {
                const course = data[key];
                stats.total_videos += Object.keys(course.videos || {}).length;
                stats.total_files += Object.keys(course.files || {}).length;
            });
        }

        console.log('Course Statistics:', stats);
        return stats;
    });
}

/**
 * دالة لإنشاء تقرير الطلاب
 */
function generateStudentReport() {
    getQuizResults((results) => {
        let report = [];

        Object.keys(results).forEach(key => {
            const result = results[key];
            report.push({
                quiz_id: result.quizId,
                score: result.score,
                total: result.totalQuestions,
                percentage: result.percentage,
                timestamp: result.timestamp
            });
        });

        // ترتيب التقرير بناءً على التاريخ
        report.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        console.log('Student Report:', report);
        return report;
    });
}

/**
 * دالة لتصدير البيانات إلى CSV
 * @param {array} data - البيانات المراد تصديرها
 * @param {string} filename - اسم الملف
 */
function exportToCSV(data, filename = 'export.csv') {
    if (data.length === 0) {
        alert('لا توجد بيانات للتصدير');
        return;
    }

    // الحصول على رؤوس الأعمدة
    const headers = Object.keys(data[0]);
    
    // إنشاء محتوى CSV
    let csv = headers.join(',') + '\n';
    
    data.forEach(row => {
        const values = headers.map(header => {
            const value = row[header];
            // وضع علامات الاقتباس حول القيم التي تحتوي على فواصل
            return typeof value === 'string' && value.includes(',') 
                ? `"${value}"` 
                : value;
        });
        csv += values.join(',') + '\n';
    });

    // إنشاء blob وتحميل الملف
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * دالة لجدولة الإجراءات
 * @param {function} action - الإجراء المراد تنفيذه
 * @param {number} delay - التأخير بالميلي ثانية
 */
function scheduleAction(action, delay) {
    setTimeout(action, delay);
}

/**
 * دالة لتحديث البيانات بشكل دوري
 * @param {function} updateFunction - دالة التحديث
 * @param {number} interval - الفترة الزمنية بالميلي ثانية
 * @returns {number} معرف الفترة الزمنية
 */
function schedulePeriodicUpdate(updateFunction, interval = 5000) {
    return setInterval(updateFunction, interval);
}

/**
 * دالة لإيقاف التحديث الدوري
 * @param {number} intervalId - معرف الفترة الزمنية
 */
function stopPeriodicUpdate(intervalId) {
    clearInterval(intervalId);
}

/**
 * دالة لإنشاء نسخة احتياطية من البيانات
 */
function backupData() {
    const backup = {};

    readFromFirebase('courses', (data) => {
        backup.courses = data;
    });

    readFromFirebase('quizzes', (data) => {
        backup.quizzes = data;
    });

    readFromFirebase('messages', (data) => {
        backup.messages = data;
    });

    readFromFirebase('notifications', (data) => {
        backup.notifications = data;
    });

    // تحميل النسخة الاحتياطية
    const backupJson = JSON.stringify(backup, null, 2);
    const blob = new Blob([backupJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = `backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
}

/**
 * دالة للبحث عن المحتوى
 * @param {string} query - نص البحث
 * @param {function} callback - دالة معالجة النتائج
 */
function searchContent(query, callback) {
    const results = {
        courses: [],
        quizzes: [],
        messages: []
    };

    readFromFirebase('courses', (data) => {
        if (data) {
            Object.keys(data).forEach(key => {
                const course = data[key];
                if (course.title.toLowerCase().includes(query.toLowerCase()) ||
                    course.description.toLowerCase().includes(query.toLowerCase())) {
                    results.courses.push({ id: key, ...course });
                }
            });
        }
    });

    readFromFirebase('quizzes', (data) => {
        if (data) {
            Object.keys(data).forEach(key => {
                const quiz = data[key];
                if (quiz.title.toLowerCase().includes(query.toLowerCase())) {
                    results.quizzes.push({ id: key, ...quiz });
                }
            });
        }
    });

    callback(results);
}

/**
 * دالة لتحديث ملف تعريف المستخدم
 * @param {string} userId - معرف المستخدم
 * @param {object} profileData - بيانات الملف الشخصي
 */
function updateUserProfile(userId, profileData) {
    writeToFirebase(`users/${userId}/profile`, profileData);
}

/**
 * دالة لجلب ملف تعريف المستخدم
 * @param {string} userId - معرف المستخدم
 * @param {function} callback - دالة معالجة البيانات
 */
function getUserProfile(userId, callback) {
    readFromFirebase(`users/${userId}/profile`, callback);
}

/**
 * دالة لتسجيل نشاط المستخدم
 * @param {string} userId - معرف المستخدم
 * @param {string} activity - وصف النشاط
 */
function logUserActivity(userId, activity) {
    const log = {
        user_id: userId,
        activity: activity,
        timestamp: new Date().toISOString()
    };

    addToFirebase('user_activities', log);
}

/**
 * دالة لجلب سجل النشاط
 * @param {function} callback - دالة معالجة البيانات
 */
function getActivityLog(callback) {
    readFromFirebase('user_activities', callback);
}
