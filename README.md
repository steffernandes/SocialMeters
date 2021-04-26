# SocialMeters
Built by Stephanie Fernandes and Tiago Morreira
 
<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li> 
    <li><a href="#acknowledgements">Libraries used</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project
Social Meters is a mobile app developed in my first semester of the second year of my degree in Design and Technologies of Mobile Apps.

Due to the increase of COVID-19 cases worldwide, we were challenged to create an app to help the population. We noticed that it can be very hard for people to respect social distancing rules so we decided to create an app to gamify social distancing.

We did so by using the user's Bluetooth to measure the distance between other users of the app. We also have a quiz to educate people about the COVID-19.

By maintaining the distance from other people the user will gain points that will be used for the group ranking. We also created our own API with NodeJS

[![Social Meters Screen Shot][product-screenshot]](https://live.staticflickr.com/65535/51141220439_cf3afc74ae_k.jpg)

 

### Built With
 
* [React-native](https://reactnative.dev/) 


<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites
 
* npm
 ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the repo
  ```sh
   git clone https://github.com/steffernandes/SocialMeters.git
   ```
2. Install NPM packages
  ```sh
   npm install
   ```
3. Setup the development environment
  ```sh
   npx react-native start
   npx react-native run-android
   ```

 
<!-- Libraries used -->
## Libraries used
* [React Native Ble Manager](https://github.com/innoveit/react-native-ble-manager)
* [React Native Paper](https://callstack.github.io/react-native-paper/)
* [React Navigation](https://reactnavigation.org/)
* [React Native Network Info](https://www.npmjs.com/package/react-native-network-info)
* [React Native Async Storage](https://github.com/react-native-async-storage/async-storage)

 
[product-screenshot]: https://live.staticflickr.com/65535/51141220439_cf3afc74ae_k.jpg
