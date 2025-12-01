<?php
/**
 * معالج تحميل الملفات والفيديوهات
 * File and Video Upload Handler
 */

header('Content-Type: application/json; charset=utf-8');
require_once '../includes/firebase-config.php';

// مجلد التحميل
$upload_dir = '../uploads/';
if (!is_dir($upload_dir)) {
    mkdir($upload_dir, 0755, true);
}

$response = [
    'success' => false,
    'message' => '',
    'file_url' => ''
];

// معالجة طلب تحميل الملف
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['file'])) {
    $file = $_FILES['file'];
    $file_type = isset($_POST['type']) ? $_POST['type'] : 'file';
    
    // التحقق من وجود الملف
    if ($file['error'] !== UPLOAD_ERR_OK) {
        $response['message'] = 'خطأ في تحميل الملف';
        echo json_encode($response);
        exit;
    }
    
    // التحقق من نوع الملف
    $allowed_types = [
        'pdf' => ['application/pdf'],
        'image' => ['image/jpeg', 'image/png', 'image/gif'],
        'video' => ['video/mp4', 'video/webm', 'video/ogg']
    ];
    
    $file_mime = mime_content_type($file['tmp_name']);
    
    if ($file_type === 'pdf' && $file_mime !== 'application/pdf') {
        $response['message'] = 'يجب أن يكون الملف من نوع PDF';
        echo json_encode($response);
        exit;
    }
    
    // التحقق من حجم الملف (الحد الأقصى 50 MB)
    $max_size = 50 * 1024 * 1024;
    if ($file['size'] > $max_size) {
        $response['message'] = 'حجم الملف كبير جداً (الحد الأقصى 50 MB)';
        echo json_encode($response);
        exit;
    }
    
    // إنشاء اسم فريد للملف
    $file_ext = pathinfo($file['name'], PATHINFO_EXTENSION);
    $file_name = uniqid() . '.' . $file_ext;
    $file_path = $upload_dir . $file_name;
    
    // نقل الملف
    if (move_uploaded_file($file['tmp_name'], $file_path)) {
        $response['success'] = true;
        $response['message'] = 'تم تحميل الملف بنجاح';
        $response['file_url'] = 'uploads/' . $file_name;
        $response['file_name'] = $file['name'];
        $response['file_size'] = $file['size'];
    } else {
        $response['message'] = 'فشل نقل الملف';
    }
} else {
    $response['message'] = 'لم يتم إرسال أي ملف';
}

echo json_encode($response);
?>
