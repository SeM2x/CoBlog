# Authentication API

The Authentication API allows users to create an account, sign in, and handle authentication logic in the CoBlog platform. It supports user registration and sign-in, ensuring that user data is properly stored and secured.

---

## **POST /api/auth/create_account**

### **Description**
This route allows a new user to create an account on the platform. It requires basic user information such as email, password, and username. The route will check if the provided email and username are already taken, ensuring that each user has unique credentials.

### **Request Body**
The request body must contain the following fields:

```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "password": "string",
  "username": "string"
}
```

### **Response**

- Success (201)

```json
{
  "status": "success",
  "message": "User created"
}
```

- Error (400)

```json
{
  "status": "error",
  "message": "Name, email, and password are required"
}
```
This error occurs if any of the required fields (email, password, username) are missing.

- Error (409)

```json
{
  "status": "error",
  "message": "User already exists"
}
```
This error occurs if the provided email is already associated with an existing user.

- Error (409)

```json
{
  "status": "error",
  "message": "Username already exists"
}
```
This error occurs if the provided username is already taken by another user.

- Error (500)

```json
{
  "status": "error",
  "message": "something went wrong"
}
```
A generic error occurs in case of server failure.



## **POST /api/auth/create_account**

### **Description**

This route allows users to sign in to their account using their email and password. If the credentials are correct, a JWT token is generated for the user, enabling them to access protected resources.

### **Request Body**
The request body must contain the following fields:

```json
{
  "email": "string",
  "password": "string"
}
```

### **Request**

- Sucess (200)

```json
{
  "status": "success",
  "message": "Authentication successful",
  "token": "JWT_TOKEN",
  "data": {}
}
```
The user has been successfully authenticated.
The data field contains the user data
A JWT token is returned, which can be used for further authenticated requests.
The response contains the user's profile data 

- Error (400):

```json
{
  "status": "error",
  "message": "Email and Password is required"
}
```
This error occurs if either the email or password is missing from the request body.

- Error(404):

```json
{
  "status": "error",
  "message": "User not yet exist, Try Signing up"
}
```
This error occurs if the provided email is not found in the database, indicating that the user is not registered.

- Error (404):
```json
{
  "status": "error",
  "message": "Email or Password incorrect"
}
```

This error occurs if the password or email is incorrect

- Error (500):

```json
{
  "status": "error",
  "message": "something went wrong"
}
```
A generic error occurs in case of server failure.


# User API

The User API allows you to fetch information about a user, either for your own profile or for another user. This endpoint checks user relationships (such as followers or following) and returns relevant information.

---

## **GET /api/users/:id**

### **Description**
This route allows you to retrieve the details of a user based on their unique user ID. It also checks the relationship of the requesting user with the target user (whether they follow the target user, are followed by the target user, or are not related). If the user exists, their profile information is returned, excluding sensitive details like the password.

### **Route Parameters**
- `id` (string) - The unique identifier (ObjectId) of the user whose profile information is being requested.

### **Response**

- **Success (200)**:
  ```json
  {
    "status": "success",
    "data": {
      "id": "USER_ID",
      "firstName": "USER_FIRST_NAME",
      "lastName": "USER_LAST_NAME",
      "email": "USER_EMAIL",
      "username": "USER_USERNAME",
      "followerCount": 10,
      "followingCount": 5,
      "postCount": 3,
      "relationship": "follows you"
    }
  }
    ```
The response contains the user's profile information 

The relationship field indicates the relationship between the user making the request and the requested user (id):

"me": The user is requesting their own profile.
"follows you": The requesting user follows the target user.
"following": The requesting user is being followed by the target user.
null: There is no direct relationship between the two users.


- Error (404):

```json

{
  "status": "error",
  "message": "User not found"
}
```
This error occurs if the user with the provided id does not exist in the database.
