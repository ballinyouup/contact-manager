
<?php
	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Methods: POST, OPTIONS");
	header("Access-Control-Allow-Headers: Content-Type");

	if ($_SERVER["REQUEST_METHOD"] === "OPTIONS")
	{
		exit();
	}

	$inData = getRequestInfo();

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error)
	{
		returnWithError($conn->connect_error);
	}
	else
	{
		$stmt = $conn->prepare("SELECT ID, firstName, lastName FROM Users WHERE Login=? AND Password=?");
		$stmt->bind_param("ss", $inData["login"], $inData["password"]);
		$stmt->execute();
		$result = $stmt->get_result();

		if ($row = $result->fetch_assoc())
		{
			returnWithInfo($row["firstName"], $row["lastName"], $row["ID"]);
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
