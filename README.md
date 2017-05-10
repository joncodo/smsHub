# What does this do?

This app is responsible for managing all the login and messages for zipwhip for the Broadsoft Montreal hackathon for 2017. Zipwhip api docs can be found in the /docs folder. There is a free account you can get for zipwhip if you email them here: https://www.zipwhip.com/freetrial/

This app also stores all the data in a mongoLab database. This includes all messages sent from users to users as well as the phone numbers and names of contacts. We also currently store the hubLoginToken and the session for each zipWhip user.

# Other apps that use this code

[hubJavaStarter](https://github.com/ssaloisbellerose/SMSHub) handles all interactions with the hub api
[SMS-UI](https://github.com/ssaloisbellerose/SMSHub) handles rendering of the ui

# How to create a hub app with this in the dev portal

Coming soon!


# Routes

## GET /test

Description: A url to test if the app is running and working

response:
```
'Hello!'

```

## POST /login

Description: This logs the user into zipwhip and stores their session in the DB. This only needs to be called once per user but it can be called as many times as you wish.

Post Body:
```
{
  username: '5554443333',
  hubLoginToken: 'token',
  password: 'theUserPassword'
}
```

response: 200

## POST /sendMessage

Description: This sends a message from one user to another.

Post Body:
```
{
  from: '5554443333',
  to: '6665558888',
  message: 'Hey buddy!'
}
```

response: 200

## POST /createWebhook

Description: you need to call this to receive any messages. Pass in the url that you want to be called each time a message is received. When that url is called, you will need to read the response property to see the actual message.

Post Body:
```
{
  url: 'https://www.mydomain.com/handleWebhook', //You can call it any route you want
  username: '5554446666', //the phone number of the person you are calling
}
```

response: 200

## GET /getCountForUser?token=hubLoginToken

Description: Returns the number of unread messages for the user. The token is the identifier of the user and it has to be the same hubLoginToken you passed in the /login route.

response: 200, `{count: 11}`

## GET /getMessages?from=5554447777&to=8887774444

Description: Returns all the messages between the two users

response: 200

```
[
    {
        "_id": "59133715e7af9c72ad496c40",
        "from": "8445971754",
        "to": "5062062704",
        "message": "Hello",
        "isRead": false,
        "createdAt": "2017-05-10T15:51:49.457Z"
    },
    {
        "_id": "59134324e7ca8780c5ae89e8",
        "from": "8445971754",
        "to": "5062062704",
        "message": "This is a newer message",
        "isRead": false,
        "createdAt": "2017-05-10T16:43:16.863Z"
    }
]
```

# Data Model

## user

- username (can be phone number)
- session (the zip whip session)
- hubLoginToken
- createdAt

## message

- from (the number the message was sent from)
- to (the number the message was sent to)
- message (the text of the message)
- isRead (has the user viewed the message)
- createdAt

# TODO

- eslint
- tests
- dont hard code the login params
