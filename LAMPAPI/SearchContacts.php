<?php
	$inData = getRequestInfo();

	$userId = (int)($inData["userId"] ?? 0);
	$search = "%" . trim($inData["search"] ?? "") . "%";

	if ($userId < 1)
	{
		returnWithError("User ID is required");
		exit();
	}

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error)
	{
		returnWithError($conn->connect_error);
	}
	else
	{
		$stmt = $conn->prepare(
			"SELECT ID, FirstName, LastName, Phone, Email
			FROM Contacts
			WHERE UserID=? AND (FirstName LIKE ? OR LastName LIKE ? OR Phone LIKE ? OR Email LIKE ?)
			ORDER BY LastName, FirstName"
		);
		$stmt->bind_param("issss", $userId, $search, $search, $search, $search);
		$stmt->execute();
		$result = $stmt->get_result();

		$contacts = array();
		while ($row = $result->fetch_assoc())
		{
			$contacts[] = array(
				"id" => (int)$row["ID"],
				"firstName" => $row["FirstName"],
				"lastName" => $row["LastName"],
				"phone" => $row["Phone"],
				"email" => $row["Email"]
			);
		}

		returnWithInfo($contacts);

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
		sendResultInfoAsJson(array("results" => array(), "error" => $err));
	}

	function returnWithInfo($contacts)
	{
		sendResultInfoAsJson(array("results" => $contacts, "error" => ""));
	}
?>
