# car2Park_server_2

To put server to sleep, enter the cmd

>heroku ps:scale web = 0

in the directory car2Park_server_2

***

To wake_up server, enter the cmd

> heroku ps:scale web = 1

in the directory car2Park_server_2

***

To push code to heroku

> git push heroku master

in the directory car2Park_server_2


## Server-Side Design

<p align="center">
  <img src="https://github.com/Foobar-Consulting-Ltd/car2Park_server_2/blob/master/readme_images/Server-Side%20Design.png" height="400" width="600">
</p>

### Distinguished components used in route calculation
- ParkingspotGrid responsible for binning C2G parking spots in a lookup table. Able to ‘short-list’ parking spots by their approximate distance from destination.
- GmapsAccess responsible for obtaining distance matrix for short-listed parking spots.
- RouteRequestHandler applies the spot ranking algorithm and formats results for the response message.
### Elaborated authentication scheme called by app as middleware
- AuthenticationHandler class manages the user database and generates access tokens.
- Validation sends a user a verification email, and triggers token validation on response.
- Login request handler parses login details from POST body and returns access token.

## Access Token Request Sequence Diagram

<p align="center">
  <img src="https://github.com/Foobar-Consulting-Ltd/car2Park_server_2/blob/master/readme_images/Access%20Token%20Request%20Sequence.png" height="400" width="600">
</p>



