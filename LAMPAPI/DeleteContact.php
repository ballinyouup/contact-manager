<?php
	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Methods: POST, OPTIONS");
	header("Access-Control-Allow-Headers: Content-Type");

	if ($_SERVER["REQUEST_METHOD"] === "OPTIONS")
	{
		exit();
	}

	$inData = getRequestInfo();

	$contactId = (int)($inData["id"] ?? 0);
	$userId = (int)($inData["userId"] ?? 0);

	if ($contactId < 1 || $userId < 1)
	{
		returnWithError("Contact ID and user ID are required");
		exit();
	}

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error)
	{
		returnWithError($conn->connect_error);
	}
	else
	{
		$stmt = $conn->prepare("DELETE FROM Contacts WHERE ID=? AND UserID=?");
		$stmt->bind_param("ii", $contactId, $userId);
		$stmt->execute();

		if ($stmt->affected_rows > 0)
		{
			returnWithInfo($contactId);
		}
		else
		{
			returnWithError("Contact not found");
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
