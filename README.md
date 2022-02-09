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
