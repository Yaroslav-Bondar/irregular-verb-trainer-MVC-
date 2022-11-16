# :open_book: English irregular verb trainer

## Description: 
 Web application for better memorization of irregular English verbs. The program prompts the user to enter the correct version of one of the forms of the    verb. It then validates the entered data and displays the result. It is possible to expand the list of verbs by editing the json file.

## Demo:
  - [View the demo](https://yaroslav-bondar.github.io/irregular-verb-trainer-MVC-/)
  
## How to run the application:
  - clone the repository and run index.html in the root folder

## How to edit the list of verbs:
> **Warning**: It is not recommended to change the structure of the json file with the list of verbs, since the program code is adapted for it.
  - you can edit list of verbs in [/data/data.json](data/data.json)
  - you can also store a list of verbs on a remote server. And get it using Rest Api by sending a Get request. The URL for the request can be specified in [/js/script.js](js/script.js) in the controller call line like:
  
  `/js/script.js`
  
 ``` javascript
 const runApp = new Controller(new Model('data/data.json'), new View());
 ```
the implementation of the GET request is defined in the model method in [/js/script.js](js/script.js):

`/js/script.js`

 ``` javascript
 loadVerbs() {
     return fetch(this.verbsUrl)
         .then(res => res.json())
         .then(verbs => {
             this.verbs = verbs;
             this.statistics.loaded = verbs.length;
             return verbs;
         })
         .catch(error => { throw new Error(error) });/* { (===) or return Promise.reject(error) } */
 }
 ```


## Purposes:
  - When I started learning English irregular verbs, I had paper and a pen. I also wanted to practice writing programs with the MVC pattern, and automate     the process of learning verbs already without paper and pen -). This is how this small but very useful program arose.
  
  - Learning the basics of the MVC design patterns:
    - Model - manages the data of an application
    - View - a visual representation of the model
    - Controller - links the user and the system

  - Practical application of the topics such as:
    - Java Script:   
      - regular expressions
        - creating a RegExp object: literal notation and using a constructor
        - regexp.test(str) method
      - promises
        - promise API: Promise.all
        - async/await
      - working with API using Fetch
        - simple GET request
      - loss of this value
        - using the Function.prototype.bind method
      - creating objects with java script classes
      - form validation
      - work with DOM
    - Layout:
      - responsive/adaptive UI design 
      - desktop-first media queries
      - CSS Flexbox/Grid
      - naming classes according to BEM methodology
    
## Languages: 
  - JavaScript
  - HTML
  - CSS 

## Design pattern: 
  - MVC
 
## Features: 
  - responsive/adaptive UI design
  - storing verbs in json file
  - statistics on answers and loaded verbs
  - user input validation
  
### Thanks:
  - [Build a Simple MVC App From Scratch in JavaScript](https://www.taniarascia.com/javascript-mvc-todo-app/)
  - [Java script book](https://learn.javascript.ru/) 

### Author:
  [Yaroslav Bondar](https://www.linkedin.com/in/yaroslav-bondar-7014a021b/)
