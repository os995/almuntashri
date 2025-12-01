<?php
/**
 * إدارة الدورات والمحتوى
 * Manage Courses and Content
 */

header('Content-Type: application/json; charset=utf-8');
require_once '../includes/firebase-config.php';

$action = isset($_GET['action']) ? $_GET['action'] : '';
$method = $_SERVER['REQUEST_METHOD'];

// معالجة الطلبات
if ($method === 'GET') {
    if ($action === 'get_courses') {
        getCourses();
    } elseif ($action === 'get_course') {
        getCourse();
    } elseif ($action === 'get_quizzes') {
        getQuizzes();
    } elseif ($action === 'get_messages') {
        getMessages();
    } elseif ($action === 'get_notifications') {
        getNotifications();
    }
} elseif ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if ($action === 'add_course') {
        addCourse($input);
    } elseif ($action === 'update_course') {
        updateCourse($input);
    } elseif ($action === 'delete_course') {
        deleteCourse($input);
    } elseif ($action === 'add_quiz') {
        addQuiz($input);
    } elseif ($action === 'add_message') {
        addMessage($input);
    } elseif ($action === 'add_notification') {
        addNotification($input);
    }
}

/**
 * دالة لجلب جميع الدورات
 */
function getCourses() {
    $courses = firebaseRequest('courses', 'GET');
    echo json_encode($courses);
}

/**
 * دالة لجلب دورة معينة
 */
function getCourse() {
    $courseId = isset($_GET['id']) ? $_GET['id'] : '';
    if (!$courseId) {
        echo json_encode(['error' => 'Course ID is required']);
        return;
    }
    
    $course = firebaseRequest("courses/$courseId", 'GET');
    echo json_encode($course);
}

/**
 * دالة لإضافة دورة جديدة
 */
function addCourse($data) {
    if (!isset($data['title']) || !isset($data['description'])) {
        echo json_encode(['error' => 'Title and description are required']);
        return;
    }
    
    $course = [
        'title' => $data['title'],
        'description' => $data['description'],
        'level' => isset($data['level']) ? $data['level'] : 'Beginner',
        'created_at' => date('Y-m-d H:i:s'),
        'videos' => isset($data['videos']) ? $data['videos'] : [],
        'files' => isset($data['files']) ? $data['files'] : []
    ];
    
    // إنشاء معرف فريد للدورة
    $courseId = uniqid('course_');
    $result = firebaseRequest("courses/$courseId", 'PUT', $course);
    
    echo json_encode([
        'success' => true,
        'message' => 'Course added successfully',
        'course_id' => $courseId,
        'data' => $result
    ]);
}

/**
 * دالة لتحديث دورة
 */
function updateCourse($data) {
    if (!isset($data['id'])) {
        echo json_encode(['error' => 'Course ID is required']);
        return;
    }
    
    $courseId = $data['id'];
    $updates = [];
    
    if (isset($data['title'])) $updates['title'] = $data['title'];
    if (isset($data['description'])) $updates['description'] = $data['description'];
    if (isset($data['level'])) $updates['level'] = $data['level'];
    if (isset($data['videos'])) $updates['videos'] = $data['videos'];
    if (isset($data['files'])) $updates['files'] = $data['files'];
    
    $result = firebaseRequest("courses/$courseId", 'PATCH', $updates);
    
    echo json_encode([
        'success' => true,
        'message' => 'Course updated successfully',
        'data' => $result
    ]);
}

/**
 * دالة لحذف دورة
 */
function deleteCourse($data) {
    if (!isset($data['id'])) {
        echo json_encode(['error' => 'Course ID is required']);
        return;
    }
    
    $courseId = $data['id'];
    $result = firebaseRequest("courses/$courseId", 'DELETE');
    
    echo json_encode([
        'success' => true,
        'message' => 'Course deleted successfully'
    ]);
}

/**
 * دالة لجلب جميع الاختبارات
 */
function getQuizzes() {
    $quizzes = firebaseRequest('quizzes', 'GET');
    echo json_encode($quizzes);
}

/**
 * دالة لإضافة اختبار جديد
 */
function addQuiz($data) {
    if (!isset($data['title']) || !isset($data['questions'])) {
        echo json_encode(['error' => 'Title and questions are required']);
        return;
    }
    
    $quiz = [
        'title' => $data['title'],
        'description' => isset($data['description']) ? $data['description'] : '',
        'questions' => $data['questions'],
        'created_at' => date('Y-m-d H:i:s')
    ];
    
    $quizId = uniqid('quiz_');
    $result = firebaseRequest("quizzes/$quizId", 'PUT', $quiz);
    
    echo json_encode([
        'success' => true,
        'message' => 'Quiz added successfully',
        'quiz_id' => $quizId,
        'data' => $result
    ]);
}

/**
 * دالة لجلب جميع الرسائل
 */
function getMessages() {
    $messages = firebaseRequest('messages', 'GET');
    echo json_encode($messages);
}

/**
 * دالة لإضافة رسالة جديدة
 */
function addMessage($data) {
    if (!isset($data['sender']) || !isset($data['text'])) {
        echo json_encode(['error' => 'Sender and text are required']);
        return;
    }
    
    $message = [
        'sender' => $data['sender'],
        'text' => $data['text'],
        'timestamp' => date('Y-m-d H:i:s')
    ];
    
    $result = firebaseRequest('messages', 'POST', $message);
    
    echo json_encode([
        'success' => true,
        'message' => 'Message added successfully',
        'data' => $result
    ]);
}

/**
 * دالة لجلب جميع التنبيهات
 */
function getNotifications() {
    $notifications = firebaseRequest('notifications', 'GET');
    echo json_encode($notifications);
}

/**
 * دالة لإضافة تنبيه جديد
 */
function addNotification($data) {
    if (!isset($data['title']) || !isset($data['message'])) {
        echo json_encode(['error' => 'Title and message are required']);
        return;
    }
    
    $notification = [
        'title' => $data['title'],
        'message' => $data['message'],
        'type' => isset($data['type']) ? $data['type'] : 'info',
        'timestamp' => date('Y-m-d H:i:s')
    ];
    
    $result = firebaseRequest('notifications', 'POST', $notification);
    
    echo json_encode([
        'success' => true,
        'message' => 'Notification added successfully',
        'data' => $result
    ]);
}

?>
