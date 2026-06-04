# contact-manager

Personal contact manager for a LAMP stack deployment.

## API files

The `LAMPAPI` directory contains six PHP endpoints:

- `Login.php`
- `Register.php`
- `AddContact.php`
- `SearchContacts.php`
- `UpdateContact.php`
- `DeleteContact.php`

All endpoints accept and return JSON. Contact endpoints require `userId` so each user only accesses their own contacts.

## Contacts table

Expected contact columns:

```sql
CREATE TABLE Contacts (
  ID INT NOT NULL AUTO_INCREMENT,
  FirstName VARCHAR(50) NOT NULL,
  LastName VARCHAR(50) NOT NULL,
  Phone VARCHAR(50),
  Email VARCHAR(100),
  UserID INT NOT NULL,
  PRIMARY KEY (ID)
);
```
