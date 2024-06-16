# TuyenSinhApp
## The steps run the project
1. Cloning the project
2. Openning one of projects
3. Reinstalling the libraries: pip install -r requirements.txt
4. Checking database in settings.py and creating an empty database
5. Executing the migrations: python manage.py migrate
5. Dowload ngrok and create domain 
6. Open file "ngrok.exe"
7. Type "ngrok http --domain=your_domain your_port" and Enter
8. Creating an superuser (python manage.py createsuperuser) and accessing admin page to test

## The steps run the project tuyenSinhMobile
1. Executing the command: npm install
2. Checking BASE_URL in config/APIs.js is: "https://your_domain/"
3. Checking client_id and client_secret in component/user/login.js are the same as CLIENT_ID and CLIENT_SECRET in setting.py of TuyenSinhApp
4. Executing the command: npm start
5. Choosing the options to run
