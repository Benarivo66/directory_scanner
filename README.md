# Overview

This program scans through a list of directories and logs the content of the directory and summarizes the result into a small statistics.

The program contains two classes: scanLogger and DirectoryScanner. The scanLogger is introduced into the DirectoryScanner via dependency injection. The DirectoryScanner scans a valid directory while the scanLogger keeps useful data that it eventually prints out.

The program is useful in providing data about a given path. For instance, instead of digging through a complex directory, we can run the program and all relevant files and folders can be shown instantly.

{Provide a link to your YouTube demonstration. It should be a 4-5 minute demo of the software running and a walkthrough of the code. Focus should be on sharing what you learned about the language syntax.}

[Software Demo Video](https://www.loom.com/share/8e2da45e72ed459e9312ac69527f103a?sid=e2f2c977-a773-4b04-805f-c03210de28fe)
# Development Environment
Tools used include: Typescript, NodeJS.
The Typescript was compiled to Javascript.

# To Run the app
Delete the dist and node_modules folders if any
Run the following commands:
- npm install
- npm run build
- npm run start

# Useful Websites

{Make a list of websites that you found helpful in this project}

- [Web Site Name](https://geeksforgeeks.org)
- [Web Site Name](https://nodejs.org)

# Future Work

I could add unit tests with jest and TS Lint.

- Item 1
- Item 2
- Item 3