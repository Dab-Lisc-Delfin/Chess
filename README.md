**Steps to Run the Application**


**Clone the Repository:**
```bash
git clone git@github.com:Dab-Lisc-Delfin/Chess.git
cd Chess
```

**Run the Application:**
  ```bash
docker-compose up
   ```

**Acces the application:**

Frontend: Open http://localhost:4200 in your browser to view the Angular frontend.

Backend API: The backend API runs on http://localhost:8080.

**Troubleshooting**
If you encounter issues on the first run, try:

```bash
docker-compose down
docker-compose up --build
```

**HOW TO USE**

If the application starts successfully, open http://localhost:4200/login and log in using one of the available accounts:
```
Login: test  
Password: test
```
```
Login: reks  
Password: reks
```

<img width="822" alt="login" src="https://github.com/user-attachments/assets/042b2f95-cccd-419e-8b2d-fd524132519c">

Alternatively, you can register your own account.


Once logged in, click on CREATE GAME. 

<img width="1438" alt="create-game" src="https://github.com/user-attachments/assets/6488a6c8-864b-4c7f-ac4d-d43cd66896d2">

During the loading screen, you can copy the full game link and share it with a friend, or alternatively, you can share the last part of the link (the game code) with your friend.

<img width="1440" alt="waiting-room" src="https://github.com/user-attachments/assets/1667802e-8738-4172-96b0-83f893fc4cb6">
<img width="218" alt="Screenshot 2024-11-14 at 17 20 03" src="https://github.com/user-attachments/assets/2592e890-5685-4245-aeb4-29f5e855761f">

They can then join the game by clicking JOIN GAME and entering the game code.


<img width="791" alt="join game" src="https://github.com/user-attachments/assets/883e6a99-fb40-4992-88d9-68c6fd51900a">

When the second player connects, the game will automatically start.


<img width="1440" alt="start-game" src="https://github.com/user-attachments/assets/9004198b-1e18-4d49-b96e-51269a71280f">

**HAVE FUN!!:)**




