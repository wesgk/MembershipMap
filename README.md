# Membership & Map App

## 2016/03/06
## Synopsis

A simple app including:
* login screen
* user signup
* user manager 
* map screen plotting addresses of all users.

## View it live
https://whispering-citadel-54738.herokuapp.com/login

## Motivation
This was an exercise in better organizing my MVC code in Angular & loading Google Maps API.

## Installation
[https://github.com/wesgk/MembershipMap.git](https://github.com/wesgk/MembershipMap.git)

## Resources
* [Google Maps Geocoding API](https://developers.google.com/maps/documentation/geocoding/intro)

## Bugs and Future Changes
* On the account/user-edit page the Google Map (directive) is loading before &amp; after the scope is populated, this is forcing an error prompt even though the map and marker successfully plot.
* Checkboxes on User Map screen should filter map markers: not yet working.
* ngMessagesInclude crashes on initial screen load, prior to $scope content loading.  [Angular Bug Entry](https://github.com/angular/angular/issues/816)

## Contributors
@wesgknight

## License
ISC

