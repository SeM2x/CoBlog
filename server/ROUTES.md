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



## **POST /api/auth/sign_in**

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

## **GET /api/users/:id/profile**

### **Description**
This route allows you to retrieve the details of a user based on their unique user ID. It also checks the relationship of the requesting user with the target user (whether they follow the target user, are followed by the target user, or are not related). If the user exists, their profile information is returned.

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

## **PUT /users/:id/follow**

### **Description**
Allows a user to follow another user by adding the target user's ID to the follower's list.

- **Request Parameters**:
  - `id` (path parameter): The ID of the user to be followed.
  
- **Response**:
  - **200 OK**: User followed successfully.
    ```json
    {
      "status": "success",
      "message": "User followed successfully"
    }
    ```
  - **409 Conflict**: If the user tries to follow themselves.
    ```json
    {
      "status": "error",
      "message": "You can't follow yourself"
    }
    ```
  - **404 Not Found**: If the target user does not exist.
    ```json
    {
      "status": "error",
      "message": "User does not exist"
    }
    ```
  - **409 Conflict**: If the user is already following the target user.
    ```json
    {
      "status": "error",
      "message": "You are already following this user"
    }
    ```
  - **500 Internal Server Error**: If an unexpected error occurs during the process.
    ```json
    {
      "status": "error",
      "message": "Something went wrong"
    }
    ```

---

## **PUT /users/:id/unfollow**

### **Description**
 Allows a user to unfollow another user by removing the target user's ID from the follower's list.
- **Request Parameters**:
  - `id` (path parameter): The ID of the user to be unfollowed.
  
- **Response**:
  - **200 OK**: User unfollowed successfully.
    ```json
    {
      "status": "success",
      "message": "User unfollowed successfully"
    }
    ```
  - **409 Conflict**: If the user tries to unfollow themselves.
    ```json
    {
      "status": "error",
      "message": "You can't unfollow yourself"
    }
    ```
  - **404 Not Found**: If the target user does not exist.
    ```json
    {
      "status": "error",
      "message": "User does not exist"
    }
    ```
  - **409 Conflict**: If the user is not currently following the target user.
    ```json
    {
      "status": "error",
      "message": "You are not following this user"
    }
    ```
  - **500 Internal Server Error**: If an unexpected error occurs during the process.
    ```json
    {
      "status": "error",
      "message": "Something went wrong"
    }
    ```

---

## **GET /users/:id/followers**

### **Description**
 Fetches a list of users following the specified user, with pagination support.
- **Request Parameters**:
  - `id` (path parameter): The ID of the user whose followers are to be fetched.

- **Query Parameters**:
  - `cursor` (optional): The starting index for pagination (default: 0).
  - `limit` (optional): The maximum number of followers to fetch (default: 10).
  
- **Response**:
  - **200 OK**: A list of followers for the specified user, including pagination information.
    ```json
    {
      "status": "success",
      "data": [
        {
          "id": "userId1",
          "username": "user1",
          "bio": "Bio of user1"
        },
      ],
      "pageInfo": {
        "cursor": "next cursor valie or null",
        "hasNext": true || false
      }
    }
    ```
  - **404 Not Found**: If the target user does not exist.
    ```json
    {
      "status": "error",
      "message": "User does not exist"
    }
    ```
  - **500 Internal Server Error**: If an unexpected error occurs during the process.
    ```json
    {
      "status": "error",
      "message": "Something went wrong"
    }
    ```

---

## **GET /users/:id/followings**

### **Description**
 Fetches a list of users that the specified user is following, with pagination support.
- **Request Parameters**:
  - `id` (path parameter): The ID of the user whose followings are to be fetched.

- **Query Parameters**:
  - `cursor` (optional): The starting index for pagination (default: 0).
  - `limit` (optional): The maximum number of followings to fetch (default: 10).
  
- **Response**:
  - **200 OK**: A list of users the specified user is following, including pagination information.
    ```json
    {
      "status": "success",
      "data": [
        {
          "id": "userId1",
          "username": "user1",
          "bio": "Bio of user1"
        },
      ],
      "pageInfo": {
        "cursor": "next cursor valie or null",
        "hasNext": true || false
      }
    }
    ```
  - **404 Not Found**: If the target user does not exist.
    ```json
    {
      "status": "error",
      "message": "User does not exist"
    }
    ```
  - **500 Internal Server Error**: If an unexpected error occurs during the process.
    ```json
    {
      "status": "error",
      "message": "Something went wrong"
    }
    ```

---

# Notification Routes API Documentation

## **Get User Notifications**

**GET /notifications/me**

- **Description**: Fetches a list of notifications for the authenticated user, with pagination and optional filtering by read status.

- **Query Parameters**:
  - `cursor` (optional): The starting index for pagination (default: 0).
  - `limit` (optional): The maximum number of notifications to fetch (default: 10).
  - `read` (optional): Filters notifications by read status. Accepts "true", "false", or undefined (default: fetch all notifications).
  
- **Response**:
  - **200 OK**: A list of notifications for the authenticated user, including pagination information.
    ```json
    {
      "status": "success",
      "data": [
        {
          "id": "notificationId1",
          "message": "New follower",
          "read": false,
          "timestamp": "2024-12-22T12:34:56.000Z"
        },
      ],
      "pageInfo": {
        "cursor": 10,
        "hasNext": true
      }
    }
    ```
  - **500 Internal Server Error**: If an unexpected error occurs while fetching notifications.
    ```json
    {
      "status": "error",
      "message": "Something went wrong"
    }
    ```

---

## **Mark Notification as Read or Unread**

**GET /notifications/:id**

- **Description**: Marks a specific notification as read or unread based on the query parameter. Default is "true"
  
- **Request Parameters**:
  - `id` (path parameter): The ID of the notification to be marked.
  
- **Query Parameters**:
  - `read` (optional): If set to "true", the notification is marked as read. If set to "false", the notification is marked as unread. Default is "true" (mark as read).
  
- **Response**:
  - **200 OK**: Successfully marked the notification as read or unread.
    ```json
    {
      "status": "success"
    }
    ```
  - **400 Bad Request**: If the notification ID is missing or invalid.
    ```json
    {
      "status": "error",
      "message": "Notification id missing"
    }
    ```
  - **404 Not Found**: If the notification with the specified ID does not exist.
    ```json
    {
      "status": "error",
      "message": "Notification does not exist"
    }
    ```
  - **500 Internal Server Error**: If an unexpected error occurs while updating the notification.
    ```json
    {
      "status": "error",
      "message": "Something went wrong"
    }
    ```

---


