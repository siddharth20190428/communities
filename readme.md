## Zevi Frontend Developer Assignment

This project is referenced with the [requirements](https://documenter.getpostman.com/view/14439156/2s93Jrx5Da) provided by The Internet Folks.
[Live Endpoint](https://communities-7wcy.onrender.com/) to the API.

## User Stories (Features)

- Module: Authentication
  - Feature: User should be able to signup using valid name, email and strong password.
  - Feature: User should be able to signin using valid credentials.
- Module: Community
  - Feature: User should be able to see all communities.
  - Feature: User should be able to create a community.
- Module: Moderation
  - Feature: User should be able to see all community members.
  - Feature: User should be able to add a user as member.
  - Feature: User should be able to remove a member from community.

## API Endpoints

### Role

| Name    | URL               |
| :------ | :---------------- |
| Create  | **POST** /v1/role |
| Get All | **GET** /v1/role  |

### User

| Name    | URL                      |
| :------ | :----------------------- |
| Sign Up | **POST** /v1/auth/signup |
| Sign in | **POST** /v1/auth/signin |
| Get Me  | **GET** /v1/auth/me      |

### Community

| Name                      | URL                               |
| :------------------------ | :-------------------------------- |
| Create                    | **POST** /v1/community            |
| Get All                   | **GET** /v1/community             |
| Get All Community Members | **GET** /v1/community/:id/members |
| Get My Owned Community    | **GET** /v1/community/me/owner    |
| Get My Joined Community   | **GET** /v1/community/me/member   |

### Member

| Name          | URL                    |
| :------------ | :--------------------- |
| Add Member    | **POST**/v1/member     |
| Remove Member | **GET** /v1/member/:id |

### Installation

Use this command to install all the required dependencies.

```bash
npm i
```

### Connection to Mongo

- Create a .env file in the root directory
- Paste the following code

```
MONGO_URI = "mongodb+srv://Test1:testpassword@app.mrlylew.mongodb.net/tif?retryWrites=true&w=majority"
JWT_SECRET = "randomstrongsecret"
```

### Run

Use this command to run the react app

```bash
npm run dev
```
