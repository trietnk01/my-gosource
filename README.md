# 1. cd my-gosource

# 2. Press code. to open Vscode

# 3. docker compose -p my-gosource up -d

# 4. docker exec -it mongo_my_gosource /bin/bash

# 5. Enter mongosh -u root -p

# 6. Enter password gosource246357 to login mongo

# 7. Enter use my_gosource;

# 8. Create user for mongo

<!-- db.createUser(
    {
        user: "root",
        pwd: "gosource246357",
        roles: [
            { role : "readWrite", db: "my_gosource" }
        ]
    }
); -->

# 9. Open Navicate restore database named my_gosource.js ./database/my_gosource.js

# 10. Enter http://localhost:3000/admin/login username : nguyenkimdien02@gmail.com - password : 246357
