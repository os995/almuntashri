<?php
/**
 * Firebase Configuration
 * إعدادات الاتصال بـ Firebase Realtime Database
 */

// Firebase Configuration
define('FIREBASE_API_KEY', 'AIzaSyCqDJvWVMz2blT9P4vrEQQ5CpFAZZBS9Eo');
define('FIREBASE_AUTH_DOMAIN', 'classwithonline.firebaseapp.com');
define('FIREBASE_DATABASE_URL', 'https://classwithonline-default-rtdb.asia-southeast1.firebasedatabase.app');
define('FIREBASE_PROJECT_ID', 'classwithonline');
define('FIREBASE_STORAGE_BUCKET', 'classwithonline.firebasestorage.app');
define('FIREBASE_MESSAGING_SENDER_ID', '253846485060');
define('FIREBASE_APP_ID', '1:253846485060:web:50287705cd9be34ca0e411');
define('FIREBASE_MEASUREMENT_ID', 'G-M9XFLBQZFL');

// Firebase REST API URL
define('FIREBASE_REST_URL', FIREBASE_DATABASE_URL . '.json');

/**
 * دالة للتفاعل مع Firebase Realtime Database عبر REST API
 * @param string $path المسار في قاعدة البيانات
 * @param string $method الطريقة (GET, POST, PUT, DELETE)
 * @param array $data البيانات المراد إرسالها (اختياري)
 * @return mixed النتيجة
 */
function firebaseRequest($path, $method = 'GET', $data = null) {
    $url = FIREBASE_DATABASE_URL . '/' . trim($path, '/') . '.json';
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    
    if ($data !== null) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode >= 200 && $httpCode < 300) {
        return json_decode($response, true);
    } else {
        return array('error' => 'Request failed with status code: ' . $httpCode);
    }
}

?>
