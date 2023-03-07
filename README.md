# PogChamp
Music player which allows anyone in a room to play a song through a host device
<h1>Info</h1>
<p>PogChamp acts as a source controller for multiple people to queue, play, pause, and skip songs of their choosing</p>
<p>Some upgrades I could plan would be to change how the client receieves information
  In it's current state the client is constantly polling the spotify api, which means if 50 people are connected to a room.
  50 requests are being made every 2.5 seconds. I would change this to web sockets so only the host sends out a get event and gets emmited to the room
</p>

<h1>Tech Stack</h1>
<ul>
  <li>NodeJS</li>
  <li>Express</li>
  <li>React</li>
  <li>MongoDB</li>
</ul>

![Screenshot 2023-03-06 225343](https://user-images.githubusercontent.com/54603983/223347557-028a3af5-eeb8-496d-84e9-7be677fbded6.png)
![Screenshot 2023-03-06 225352](https://user-images.githubusercontent.com/54603983/223347582-7c154161-7568-4860-9753-29255729c462.png)
![Screenshot 2023-03-06 225415](https://user-images.githubusercontent.com/54603983/223347588-1c07eaef-d5c8-4d99-9344-08c93434f692.png)
![Screenshot 2023-03-06 225448](https://user-images.githubusercontent.com/54603983/223347591-0b83e3ce-951f-4420-a7e8-6dbd3ed6e999.png)
![Screenshot 2023-03-06 225506](https://user-images.githubusercontent.com/54603983/223347603-76b59114-9628-48a8-824e-37ad35059ed0.png)
![Screenshot 2023-03-06 225606](https://user-images.githubusercontent.com/54603983/223347608-8843f3e5-e0d2-4bbe-b74d-0ec2ff7f30cc.png)
![Screenshot 2023-03-06 225627](https://user-images.githubusercontent.com/54603983/223347618-7ac23c94-589c-4382-9683-427029b2df8d.png)
