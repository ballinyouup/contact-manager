const urlBase = '/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
let selectedContactId = 0;

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function doRegister()
{
	userId = 0;
	firstName = "";
	lastName = "";

	let registerFirstName = document.getElementById("registerFirstName").value.trim();
	let registerLastName = document.getElementById("registerLastName").value.trim();
	let login = document.getElementById("registerName").value.trim();
	let password = document.getElementById("registerPassword").value;

	document.getElementById("registerResult").innerHTML = "";

	if (registerFirstName === "" || registerLastName === "" || login === "" || password === "")
	{
		document.getElementById("registerResult").innerHTML = "All registration fields are required";
		return;
	}

	let tmp = {firstName:registerFirstName,lastName:registerLastName,login:login,password:password};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/Register.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				let jsonObject = JSON.parse(xhr.responseText);

				if (jsonObject.error && jsonObject.error.length > 0)
				{
					document.getElementById("registerResult").innerHTML = jsonObject.error;
					return;
				}

				userId = jsonObject.id;
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
				window.location.href = "contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("registerResult").innerHTML = err.message;
	}
}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addContact()
{
	let contact = getContactFormValues();
	document.getElementById("contactSaveResult").innerHTML = "";

	if (!validateContact(contact))
	{
		return;
	}

	contact.userId = userId;
	let jsonPayload = JSON.stringify(contact);

	let url = urlBase + '/AddContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse(xhr.responseText);
				if (jsonObject.error && jsonObject.error.length > 0)
				{
					document.getElementById("contactSaveResult").innerHTML = jsonObject.error;
					return;
				}

				clearContactForm();
				document.getElementById("contactSaveResult").innerHTML = "Contact has been added";
				searchContacts();
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSaveResult").innerHTML = err.message;
	}
	
}

function updateContact()
{
	if (selectedContactId < 1)
	{
		document.getElementById("contactSaveResult").innerHTML = "Select a contact to edit first";
		return;
	}

	let contact = getContactFormValues();
	document.getElementById("contactSaveResult").innerHTML = "";

	if (!validateContact(contact))
	{
		return;
	}

	contact.id = selectedContactId;
	contact.userId = userId;
	let jsonPayload = JSON.stringify(contact);

	let url = urlBase + '/UpdateContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				let jsonObject = JSON.parse(xhr.responseText);
				if (jsonObject.error && jsonObject.error.length > 0)
				{
					document.getElementById("contactSaveResult").innerHTML = jsonObject.error;
					return;
				}

				clearContactForm();
				document.getElementById("contactSaveResult").innerHTML = "Contact has been updated";
				searchContacts();
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSaveResult").innerHTML = err.message;
	}
}

function deleteContact(contactId)
{
	let tmp = {id:contactId,userId:userId};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/DeleteContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				let jsonObject = JSON.parse(xhr.responseText);
				if (jsonObject.error && jsonObject.error.length > 0)
				{
					document.getElementById("contactSearchResult").innerHTML = jsonObject.error;
					return;
				}

				if (selectedContactId === contactId)
				{
					clearContactForm();
				}
				document.getElementById("contactSearchResult").innerHTML = "Contact has been deleted";
				searchContacts();
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
}

function searchContacts()
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("contactSearchResult").innerHTML = "";

	let tmp = {search:srch,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchContacts.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				renderContacts(jsonObject.results || []);

				if (jsonObject.error && jsonObject.error.length > 0)
				{
					document.getElementById("contactSearchResult").innerHTML = jsonObject.error;
				}
				else if (!jsonObject.results || jsonObject.results.length === 0)
				{
					document.getElementById("contactSearchResult").innerHTML = "No contacts found";
				}
				else
				{
					document.getElementById("contactSearchResult").innerHTML = jsonObject.results.length + " contact(s) retrieved";
				}
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
	
}

function getContactFormValues()
{
	return {
		firstName:document.getElementById("contactFirstName").value.trim(),
		lastName:document.getElementById("contactLastName").value.trim(),
		phone:document.getElementById("contactPhone").value.trim(),
		email:document.getElementById("contactEmail").value.trim()
	};
}

function validateContact(contact)
{
	if (contact.firstName === "" || contact.lastName === "")
	{
		document.getElementById("contactSaveResult").innerHTML = "First name and last name are required";
		return false;
	}
	return true;
}

function clearContactForm()
{
	selectedContactId = 0;
	document.getElementById("contactFirstName").value = "";
	document.getElementById("contactLastName").value = "";
	document.getElementById("contactPhone").value = "";
	document.getElementById("contactEmail").value = "";
	document.getElementById("addContactButton").style.display = "inline-block";
	document.getElementById("updateContactButton").style.display = "none";
	document.getElementById("cancelEditButton").style.display = "none";
}

function selectContact(contact)
{
	selectedContactId = contact.id;
	document.getElementById("contactFirstName").value = contact.firstName;
	document.getElementById("contactLastName").value = contact.lastName;
	document.getElementById("contactPhone").value = contact.phone;
	document.getElementById("contactEmail").value = contact.email;
	document.getElementById("contactSaveResult").innerHTML = "";
	document.getElementById("addContactButton").style.display = "none";
	document.getElementById("updateContactButton").style.display = "inline-block";
	document.getElementById("cancelEditButton").style.display = "inline-block";
}

function renderContacts(contacts)
{
	let tableBody = document.getElementById("contactTableBody");
	tableBody.innerHTML = "";

	for (let i = 0; i < contacts.length; i++)
	{
		let contact = contacts[i];
		let row = document.createElement("tr");

		row.innerHTML =
			"<td>" + escapeHtml(contact.firstName) + "</td>" +
			"<td>" + escapeHtml(contact.lastName) + "</td>" +
			"<td>" + escapeHtml(contact.phone) + "</td>" +
			"<td>" + escapeHtml(contact.email) + "</td>";

		let actions = document.createElement("td");
		let editButton = document.createElement("button");
		editButton.type = "button";
		editButton.className = "smallButton";
		editButton.innerHTML = "Edit";
		editButton.onclick = function() { selectContact(contact); };

		let deleteButton = document.createElement("button");
		deleteButton.type = "button";
		deleteButton.className = "smallButton dangerButton";
		deleteButton.innerHTML = "Delete";
		deleteButton.onclick = function() { deleteContact(contact.id); };

		actions.appendChild(editButton);
		actions.appendChild(deleteButton);
		row.appendChild(actions);
		tableBody.appendChild(row);
	}
}

function escapeHtml(value)
{
	return String(value || "")
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}
