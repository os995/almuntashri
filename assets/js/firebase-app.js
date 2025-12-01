/**
 * Firebase App Configuration and Functions
 * ملف التفاعل مع Firebase Realtime Database
 */

// Firebase Configuration
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

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

/**
 * دالة لقراءة البيانات من Firebase
 * @param {string} path - المسار في قاعدة البيانات
 * @param {function} callback - دالة معالجة البيانات
 */
function readFromFirebase(path, callback) {
    database.ref(path).on('value', (snapshot) => {
        const data = snapshot.val();
        callback(data);
    });
}

/**
 * دالة لكتابة البيانات إلى Firebase
 * @param {string} path - المسار في قاعدة البيانات
 * @param {object} data - البيانات المراد كتابتها
 */
function writeToFirebase(path, data) {
    return database.ref(path).set(data)
        .then(() => {
            console.log('Data written successfully');
            showAlert('تم حفظ البيانات بنجاح', 'success');
        })
        .catch((error) => {
            console.error('Error writing data:', error);
            showAlert('خطأ في حفظ البيانات', 'danger');
        });
}

/**
 * دالة لإضافة بيانات جديدة إلى Firebase
 * @param {string} path - المسار في قاعدة البيانات
 * @param {object} data - البيانات المراد إضافتها
 */
function addToFirebase(path, data) {
    return database.ref(path).push(data)
        .then((ref) => {
            console.log('Data added with ID:', ref.key);
            showAlert('تمت إضافة البيانات بنجاح', 'success');
            return ref.key;
        })
        .catch((error) => {
            console.error('Error adding data:', error);
            showAlert('خطأ في إضافة البيانات', 'danger');
        });
}

/**
 * دالة لتحديث البيانات في Firebase
 * @param {string} path - المسار في قاعدة البيانات
 * @param {object} updates - التحديثات
 */
function updateFirebase(path, updates) {
    return database.ref(path).update(updates)
        .then(() => {
            console.log('Data updated successfully');
            showAlert('تم تحديث البيانات بنجاح', 'success');
        })
        .catch((error) => {
            console.error('Error updating data:', error);
            showAlert('خطأ في تحديث البيانات', 'danger');
        });
}

/**
 * دالة لحذف البيانات من Firebase
 * @param {string} path - المسار في قاعدة البيانات
 */
function deleteFromFirebase(path) {
    return database.ref(path).remove()
        .then(() => {
            console.log('Data deleted successfully');
            showAlert('تم حذف البيانات بنجاح', 'success');
        })
        .catch((error) => {
            console.error('Error deleting data:', error);
            showAlert('خطأ في حذف البيانات', 'danger');
        });
}

/**
 * دالة لعرض الرسائل (Alerts)
 * @param {string} message - نص الرسالة
 * @param {string} type - نوع الرسالة (success, danger, warning, info)
 */
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    const container = document.querySelector('.content') || document.body;
    container.insertBefore(alertDiv, container.firstChild);
    
    // إزالة الرسالة بعد 5 ثواني
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

/**
 * دالة لتحميل الدورات من Firebase
 */
function loadCourses() {
    readFromFirebase('courses', (data) => {
        if (data) {
            displayCourses(data);
        } else {
            console.log('No courses found');
        }
    });
}

/**
 * دالة لعرض الدورات
 * @param {object} courses - الدورات
 */
function displayCourses(courses) {
    const container = document.getElementById('courses-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    Object.keys(courses).forEach(key => {
        const course = courses[key];
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-header">
                <h3>${course.title}</h3>
            </div>
            <div class="card-body">
                <p>${course.description}</p>
                <p><strong>المستوى:</strong> ${course.level}</p>
            </div>
            <div class="card-footer">
                <button class="btn btn-primary" onclick="viewCourse('${key}')">عرض الدورة</button>
            </div>
        `;
        container.appendChild(card);
    });
}

/**
 * دالة لعرض تفاصيل الدورة
 * @param {string} courseId - معرف الدورة
 */
function viewCourse(courseId) {
    readFromFirebase(`courses/${courseId}`, (data) => {
        if (data) {
            displayCourseDetails(courseId, data);
        }
    });
}

/**
 * دالة لعرض تفاصيل الدورة
 * @param {string} courseId - معرف الدورة
 * @param {object} course - بيانات الدورة
 */
function displayCourseDetails(courseId, course) {
    const container = document.getElementById('course-details');
    if (!container) return;
    
    let html = `
        <h2>${course.title}</h2>
        <p>${course.description}</p>
        <p><strong>المستوى:</strong> ${course.level}</p>
    `;
    
    // عرض الفيديوهات
    if (course.videos) {
        html += '<h3>الفيديوهات</h3><div class="cards-grid">';
        Object.keys(course.videos).forEach(videoKey => {
            const video = course.videos[videoKey];
            html += `
                <div class="card">
                    <div class="card-header">
                        <h4>${video.title}</h4>
                    </div>
                    <div class="card-body">
                        <div class="video-container">
                            <iframe src="${video.url}" allowfullscreen></iframe>
                        </div>
                    </div>
                </div>
            `;
        });
        html += '</div>';
    }
    
    // عرض ملفات PDF
    if (course.files) {
        html += '<h3>الملفات</h3><ul class="file-list">';
        Object.keys(course.files).forEach(fileKey => {
            const file = course.files[fileKey];
            html += `
                <li class="file-item">
                    <span class="file-icon">📄</span>
                    <div class="file-info">
                        <h4>${file.name}</h4>
                        <p>${file.type}</p>
                    </div>
                    <a href="${file.url}" class="btn btn-primary file-download" download>تحميل</a>
                </li>
            `;
        });
        html += '</ul>';
    }
    
    container.innerHTML = html;
}

/**
 * دالة لتحميل الاختبارات من Firebase
 */
function loadQuizzes() {
    readFromFirebase('quizzes', (data) => {
        if (data) {
            displayQuizzes(data);
        }
    });
}

/**
 * دالة لعرض الاختبارات
 * @param {object} quizzes - الاختبارات
 */
function displayQuizzes(quizzes) {
    const container = document.getElementById('quizzes-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    Object.keys(quizzes).forEach(key => {
        const quiz = quizzes[key];
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-header">
                <h3>${quiz.title}</h3>
            </div>
            <div class="card-body">
                <p>${quiz.description}</p>
                <p><strong>عدد الأسئلة:</strong> ${Object.keys(quiz.questions || {}).length}</p>
            </div>
            <div class="card-footer">
                <button class="btn btn-success" onclick="startQuiz('${key}')">ابدأ الاختبار</button>
            </div>
        `;
        container.appendChild(card);
    });
}

/**
 * دالة لبدء الاختبار
 * @param {string} quizId - معرف الاختبار
 */
function startQuiz(quizId) {
    readFromFirebase(`quizzes/${quizId}`, (data) => {
        if (data) {
            displayQuiz(quizId, data);
        }
    });
}

/**
 * دالة لعرض الاختبار
 * @param {string} quizId - معرف الاختبار
 * @param {object} quiz - بيانات الاختبار
 */
function displayQuiz(quizId, quiz) {
    const container = document.getElementById('quiz-container');
    if (!container) return;
    
    let html = `<div class="quiz-container">
        <h2>${quiz.title}</h2>
        <form id="quiz-form">`;
    
    Object.keys(quiz.questions).forEach((qKey, index) => {
        const question = quiz.questions[qKey];
        html += `
            <div class="question">
                <h4>${index + 1}. ${question.text}</h4>
                <ul class="options">
        `;
        
        Object.keys(question.options).forEach(optKey => {
            const option = question.options[optKey];
            html += `
                <li class="option">
                    <input type="radio" name="question_${index}" value="${optKey}" id="opt_${index}_${optKey}">
                    <label for="opt_${index}_${optKey}">${option}</label>
                </li>
            `;
        });
        
        html += `</ul></div>`;
    });
    
    html += `
        <button type="button" class="btn btn-success btn-block" onclick="submitQuiz('${quizId}', '${JSON.stringify(quiz).replace(/'/g, "\\'")}')">
            إرسال الإجابات
        </button>
    </form></div>`;
    
    container.innerHTML = html;
}

/**
 * دالة لإرسال إجابات الاختبار
 * @param {string} quizId - معرف الاختبار
 * @param {string} quizData - بيانات الاختبار
 */
function submitQuiz(quizId, quizData) {
    const quiz = JSON.parse(quizData);
    const form = document.getElementById('quiz-form');
    let score = 0;
    let totalQuestions = Object.keys(quiz.questions).length;
    
    Object.keys(quiz.questions).forEach((qKey, index) => {
        const selectedAnswer = document.querySelector(`input[name="question_${index}"]:checked`);
        if (selectedAnswer && selectedAnswer.value === quiz.questions[qKey].correctAnswer) {
            score++;
        }
    });
    
    const percentage = (score / totalQuestions) * 100;
    const resultDiv = document.createElement('div');
    resultDiv.className = percentage >= 60 ? 'quiz-result' : 'quiz-result error';
    resultDiv.innerHTML = `
        <h3>نتيجة الاختبار</h3>
        <p><strong>النتيجة:</strong> ${score} من ${totalQuestions}</p>
        <p><strong>النسبة المئوية:</strong> ${percentage.toFixed(2)}%</p>
        <p>${percentage >= 60 ? '✓ مبروك! لقد نجحت في الاختبار' : '✗ للأسف، لم تنجح في الاختبار. حاول مرة أخرى'}</p>
    `;
    
    form.replaceWith(resultDiv);
    
    // حفظ النتيجة في Firebase
    const result = {
        quizId: quizId,
        score: score,
        totalQuestions: totalQuestions,
        percentage: percentage,
        timestamp: new Date().toISOString()
    };
    
    addToFirebase('quiz_results', result);
}

/**
 * دالة لتحميل الرسائل
 */
function loadMessages() {
    readFromFirebase('messages', (data) => {
        if (data) {
            displayMessages(data);
        }
    });
}

/**
 * دالة لعرض الرسائل
 * @param {object} messages - الرسائل
 */
function displayMessages(messages) {
    const container = document.getElementById('messages-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    Object.keys(messages).reverse().forEach(key => {
        const message = messages[key];
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message';
        messageDiv.innerHTML = `
            <div class="message-header">
                <span class="message-sender">${message.sender}</span>
                <span class="message-time">${new Date(message.timestamp).toLocaleString('ar-SA')}</span>
            </div>
            <div class="message-body">${message.text}</div>
        `;
        container.appendChild(messageDiv);
    });
}

/**
 * دالة لإرسال رسالة
 */
function sendMessage() {
    const senderInput = document.getElementById('message-sender');
    const textInput = document.getElementById('message-text');
    
    if (!senderInput || !textInput) return;
    
    const sender = senderInput.value.trim();
    const text = textInput.value.trim();
    
    if (!sender || !text) {
        showAlert('يرجى ملء جميع الحقول', 'warning');
        return;
    }
    
    const message = {
        sender: sender,
        text: text,
        timestamp: new Date().toISOString()
    };
    
    addToFirebase('messages', message).then(() => {
        senderInput.value = '';
        textInput.value = '';
        loadMessages();
    });
}

/**
 * دالة لتحميل التنبيهات
 */
function loadNotifications() {
    readFromFirebase('notifications', (data) => {
        if (data) {
            displayNotifications(data);
        }
    });
}

/**
 * دالة لعرض التنبيهات
 * @param {object} notifications - التنبيهات
 */
function displayNotifications(notifications) {
    const container = document.getElementById('notifications-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    Object.keys(notifications).reverse().forEach(key => {
        const notification = notifications[key];
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${notification.type || 'info'}`;
        alertDiv.innerHTML = `
            <strong>${notification.title}</strong><br>
            ${notification.message}
        `;
        container.appendChild(alertDiv);
    });
}

// تحميل البيانات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    loadCourses();
    loadQuizzes();
    loadMessages();
    loadNotifications();
});
