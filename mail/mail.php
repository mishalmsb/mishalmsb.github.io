<?php
// configurate notification subject and email address here
// to change notification message please see 'fetchNotificationBody' function
define('NOTIFICATION_SUBJECT', 'Savvy: Contact form notification');
define('NOTIFICATION_EMAIL_ADDRESS', ''); // for example: 'your.email@host.com'

$response = array(
	'success' => false,
	'errors' => array(),
);

try {
	if (!defined('NOTIFICATION_SUBJECT') || !defined('NOTIFICATION_EMAIL_ADDRESS') || !NOTIFICATION_EMAIL_ADDRESS) {
		throw new Exception('Please complete script configuration.');
	}

	$emailData = array(
		'name' => isset($_POST['name']) ? $_POST['name'] : '',
		'email' => isset($_POST['email']) ? $_POST['email'] : '',
		'msg' => isset($_POST['msg']) ? $_POST['msg'] : '',
	);

	// data validation
	foreach ($emailData as $fieldKey => $value) {
		if (empty($value)) {
			$response['errors'][$fieldKey] = 'Please complete all required fields.';
		} elseif ('email' == $fieldKey) {
			if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
				$response['errors'][$fieldKey] = 'Please check your email address.';
			}
		}
	}

	if (empty($response['errors'])) {
		// headers creation
		$headers = array(
			// 'from' => 'From: ',
		);
		if (!empty($emailData['email'])) {
			$headers['reply'] = 'Reply-To: ' . strip_tags($emailData['email']);
		}
		$headers['mime'] = 'MIME-Version: 1.0';
		$headers['contentType'] = 'Content-Type: text/html; charset=utf-8';

		// message text generation
		$notificationText = fetchNotificationBody($emailData);

		if (mail(NOTIFICATION_EMAIL_ADDRESS, NOTIFICATION_SUBJECT, $notificationText, join("\r\n", $headers))) {
			$response['success'] = true;
			$response['message'] = 'Your message was sent successfully. Thanks.';
		} else {
			throw new Exception('Some technical issue with mail sending. Please contact support.');
		}
	}
} catch (Exception $e) {
	$response['errors'][] = $e->getMessage();
}

if (!$response['success']) {
	http_response_code(400);
} elseif (empty($response['errors'])) {
	unset($response['errors']);
}

echo json_encode($response);
exit();

/**
 * Notification text generation function.
 * @param  array  $_data data received from contact form
 * @return string
 */
function fetchNotificationBody(array $_data)
{
	if ($_data) {
		extract($_data);
	}
	ob_start();
?>
	<h2>Contact form notification</h2>
	<div style="margin-bottom:20px">
		<strong>From:</strong> <?php echo htmlentities($name); ?> (<?php echo htmlentities($email); ?>)
	</div>
	<strong>Message:</strong>
	<div style="margin-bottom:20px;padding-left:40px;">
		<?php echo nl2br(htmlentities($msg)); ?>
	</div>
<?php
	return ob_get_clean();
}
