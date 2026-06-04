<?php
	mysqli_report(MYSQLI_REPORT_OFF);

	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Methods: POST, OPTIONS");
	header("Access-Control-Allow-Headers: Content-Type");

	if ($_SERVER["REQUEST_METHOD"] === "OPTIONS")
	{
		exit();
	}

	$inData = getRequestInfo();
	$login = trim($inData["login"] ?? "");
	$password = $inData["password"] ?? "";

	if ($login === "" || $password === "")
	{
		returnWithError("Login and password are required");
		exit();
	}

	$conn = new mysqli("127.0.0.1", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error)
	{
		returnWithError($conn->connect_error);
	}
	else
	{
		$stmt = $conn->prepare("SELECT ID, firstName, lastName FROM Users WHERE Login=? AND Password=?");
		if (!$stmt)
		{
			returnWithError($conn->error);
			$conn->close();
			exit();
		}

		$stmt->bind_param("ss", $login, $password);
		$stmt->execute();
		$stmt->store_result();

		if ($stmt->num_rows > 0)
		{
			$stmt->bind_result($id, $firstName, $lastName);
			$stmt->fetch();
			returnWithInfo($firstName, $lastName, $id);
		}
		else
		{
			returnWithError("No Records Found");
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
		sendResultInfoAsJson(array("id" => 0, "firstName" => "", "lastName" => "", "error" => $err));
	}

	function returnWithInfo($firstName, $lastName, $id)
	{
		sendResultInfoAsJson(array("id" => (int)$id, "firstName" => $firstName, "lastName" => $lastName, "error" => ""));
	}
?>
