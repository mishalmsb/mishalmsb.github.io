<?php
// configurate notification subject and email address here
// to change notification message please see 'fetchNotificationBody' function
define('NOTIFICATION_SUBJECT', 'Savvy: Contact form notification');
define('NOTIFICATION_EMAIL_ADDRESS', ''); // for example: 'your.email@host.com'

// complete your smtp settings here
define('SMTP_SCHEME', 'ssl');
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 465);
define('SMTP_USER', '');
define('SMTP_PASSWORD', '');

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
		require __DIR__ . '/vendor/autoload.php'; //lib/swift_required.php

		// Create the Transport
		$transport = Swift_SmtpTransport::newInstance(SMTP_HOST, SMTP_PORT, SMTP_SCHEME)
			->setUsername(SMTP_USER)
			->setPassword(SMTP_PASSWORD);
		$mailer = Swift_Mailer::newInstance($transport);

		// Create a message
		$message = Swift_Message::newInstance(NOTIFICATION_SUBJECT)
			//->setFrom(array('john@doe.com' => 'John Doe'))
			->setTo(array(NOTIFICATION_EMAIL_ADDRESS))
			->setBody(fetchNotificationBody($emailData));

		$type = $message->getHeaders()->get('Content-Type');
		$type->setValue('text/html');
		$type->setParameter('charset', 'utf-8');

		$message->getHeaders()->get('MIME-Version')->setValue('1.0');

		if (!empty($emailData['email'])) {
			$message->getHeaders()->addTextHeader('Reply-To', strip_tags($emailData['email']));
		}

		if ($mailer->send($message)) {
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
