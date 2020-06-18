# VisHub - visualizing GitHub events and more.

A information visualization project that tries to visualize some aspects of GitHub, its users and their usage of GitHub.

## Project organization

This project consists of two parts:

1. Design sheets 1 and 5 (Ideation and Realization) created through the use of the [Five Design Sheet methodology][1] 
   * Look inside [./design-sheets](./design-sheets) for more, or...
   * ... directly open [Design sheet 1](./design-sheets/submissions/VisHub-design-sheet1.pdf)
   * ... directly open [Design sheet 5](./design-sheets/submissions/VisHub-design-sheet5.pdf)
2. Implementing the chosen design from sheet 5 in an application
   * The application can be found under [./application](./application)

In this project, students (read: here just me) are getting familiar with the Five Design Sheet methodology in order to learn a more formal design process.
The professor acts as the client for our application.
By creating the design sheets, students (again, just me) are forced to externalize their internal thoughts which makes it easier to discuss the design ideas with their professor.

## How to start

You can start this project via `yarn start` while inside [./application](./application).
This command starts a development server that allows you to play around in the sources and opens a tab in your broswer to "http://localhost:3000" where you view the created web page.

If you are not really interested in running a development server for hot reloading and playing around, you can use `yarn build` to create an optimized production bundle.

After building, you can `cd` into the [./application/build](./application/build) folder and serve the site via your favorite HTTP server.
If you do not know how to do that, here are a few examples:

* Python3: `python3 -m http.server`
* Python2: `python -m SimpleHTTPServer`
* Node/JS: `yarn global add serve && serve -s build`

As there is a considerable amount of JavaScript needed, using a HTTP server that serves the web page locally is the preferred (and currently only supported) variant.

Please read the install.md inside [./application](./application) if you are interested in running or developing this application: [./application/install.md](./application/install.md)

[1]: <https://ieeexplore.ieee.org/abstract/document/7192707> "Sketching Designs Using the Five Design-Sheet Methodology"
