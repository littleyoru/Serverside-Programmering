REST API Info
-------------

- booking of rooms for school lectures


API KEY: 202cb962ac59075b964b07152d234b70

The key should be added as parameter in the url like:
 '?key=202cb962ac59075b964b07152d234b70'  (where the is no other parameter)
 or 
 '&key=202cb962ac59075b964b07152d234b70' (where the are other parameters)

 The key gives permission to use the API.



1. Server runs on locahost:8081
2. http://localhost:8081/rooms will display data about the rooms available
3. http://localhost:8081/users will display data about the users available
4. http://localhost:8081/rooms/bookings will display bookings made in the current day
5. http://localhost:8081/bookings?day=25' will display all bookings made on the 25th of the current month and year
6. http://localhost:8081/add books a room (rooms nr.2 with user nr.2). Needs to be sent as a post request (easy done with Postman).
Body is empty. The data added is hard coded in a sql query. The only way to change booking data is by editing ADDBOOKING in utils.js
