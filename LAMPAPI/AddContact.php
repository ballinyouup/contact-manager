<?php
	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Methods: POST, OPTIONS");
	header("Access-Control-Allow-Headers: Content-Type");

	if ($_SERVER["REQUEST_METHOD"] === "OPTIONS")
	{
		exit();
	}

	$inData = getRequestInfo();

	$userId = (int)($inData["userId"] ?? 0);
	$firstName = trim($inData["firstName"] ?? "");
	$lastName = trim($inData["lastName"] ?? "");
	$phone = trim($inData["phone"] ?? "");
	$email = trim($inData["email"] ?? "");

	if ($userId < 1 || $firstName === "" || $lastName === "")
	{
		returnWithError("User ID, first name, and last name are required");
		exit();
	}

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error)
	{
		returnWithError($conn->connect_error);
	}
	else
	{
		$stmt = $conn->prepare("INSERT INTO Contacts (FirstName, LastName, Phone, Email, UserID) VALUES (?, ?, ?, ?, ?)");
		if (!$stmt)
		{
			returnWithError($conn->error);
			$conn->close();
			exit();
		}

		$stmt->bind_param("ssssi", $firstName, $lastName, $phone, $email, $userId);

		if ($stmt->execute())
		{
			returnWithInfo($conn->insert_id);
		}
		else
		{
			returnWithError($stmt->error);
		}

		$stmt->close();
		$conn->close();
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents("php://input"), true);
	}

	function sendResultInfoAsJson($obj)
	{
		header("Content-type: application/json");
		echo json_encode($obj);
	}

	function returnWithError($err)
	{
		sendResultInfoAsJson(array("id" => 0, "error" => $err));
	}

	function returnWithInfo($id)
	{
		sendResultInfoAsJson(array("id" => (int)$id, "error" => ""));
	}
?>
