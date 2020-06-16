# User Access application with ng9 and node.js

[![Support Node of LTS](https://img.shields.io/badge/node-LTS-brightgreen.svg)](https://nodejs.org/)

[![alt text][1.1]][1] [![alt text][2.1]][2] [![alt text][6.1]][6]

[1.1]: http://i.imgur.com/tXSoThF.png (gau_x3)
[2.1]: http://i.imgur.com/P3YfQoD.png (GauriKesavaKumar)
[6.1]: http://i.imgur.com/0o48UoR.png (gauriz)

[1]: https://twitter.com/gau_x3
[2]: https://www.facebook.com/GauriKesavaKumar
[6]: http://www.github.com/gauriz

Serving the applicaton :
```javascript
> npm run dev
```

Mongo DB Installation: [Refer](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/)

Create DB on mongo terminal as follows
```javascript
> use user-access
```

Create Collectons 
```javascript
> db.createCollection("users")
> db.createCollection("categories")
> db.createCollection("login_sessions")
```

Import the following categories through compass
```json
[{
  "_id": {
    "$oid": "5ee62b2ac13512360450f19c"
  },
  "code": "U",
  "category": "User"
},{
  "_id": {
    "$oid": "5ee62b42c13512360450f19d"
  },
  "code": "A",
  "category": "Admin"
},{
  "_id": {
    "$oid": "5ee62b4cc13512360450f19e"
  },
  "code": "S",
  "category": "Super Admin"
}]
```

OR Insert corresponding categories through terminal

```javascript
> db.categories.insert({code: "U", category: "User"})
> db.categories.insert({code: "A", category: "Admin"})
> db.categories.insert({code: "S", category: "Super Admin"})
```

Creation of dummy user for usage : 
```json
[{
  "user_name": "admin",
  "first_name": "Admin",
  "last_name": "Admin",
  "gender": "M",
  "country_code": "+91",
  "phone_number": "1234567890",
  "experience_years": "3",
  "image_path": "",
  "email_id": "admin@admin.com",
  "hashed_password": "$2a$10$ASuLZ/WC40hf5d3iCu/stOv.WY0ZvCA5NlY83JXH5XPfLsqzPg4F.",
  "category_code": "U",
  "login_count": 0,
  "supervisor": {
    "id": "",
    "name": ""
  }
}]
```

**Credentials for above mentioned user entry :**
``` username : admin
password: admin ```





-
*Free Software, Hell Yeah!*
