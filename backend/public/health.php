<?php
http_response_code(200);
header('Content-Type: application/json');
echo json_encode(['success' => true, 'message' => 'PHP is working']);