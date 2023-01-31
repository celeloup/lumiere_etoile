# 💫 Lumière d’Étoile

### Table of contents
[Introduction](#introduction)  
[Usage](#usage)  
[How it works](#how-it-works)  
[Ressources](#ressources)  
[To do](#to-do)  
[The product](#the-product)  

## Introduction

Lumière d'Étoile is a tool I made and use to generate ***beautiful and unique illuminated maps of the stars***. Input a date, time and geographical coordinates and it will generate what the sky would look like on this particular date and place.

This repository is just *a snippet of the full project* that remains private as it is a commercialised product. You can [find out more about it](#the-product) below.

## Usage

You can test the [map generator here](#) but if you wish, you can run it locally with the web server of your choice. I usually go for python.

```jsx
python3 -m http.server
```

## How it works

1. Get a set of stars data and their position (declination and right ascension and magnitude)
2. Get a date, time and position as input
3. Transform the date and time into julian date and sideral time
4. Transform the julian date, sideral time, observation position, and coordinates of a star into horizontal coordinates of this star and its screen position
5. Display all the stars and their constellations

This is mostly lots of maths and it might not be the most accurate map but it gives out a nice result.

## Ressources

- [*Calculs astronomiques a l'usage des amateurs*](https://boutique.saf-astronomie.fr/produit/calculs-astronomiques/) by Jean MEUUS as my main source for all the math related things
- [The Hipparcos Main Catalogue](http://vizier.u-strasbg.fr/cgi-bin/VizieR?-source=I/239/hip_main) to source the star data. I don't use any star with an apparent magnitude superior than 6 (the limit at which an object is visible in the sky).
- [Stellarium](https://github.com/Stellarium/stellarium), an open source planetarium for the constellation data
- [p5.js](https://p5js.org/), a cool and simple JS library to draw on canvas

## To do

- [x] Add the sun
- [x] Add the moon
- [x] Add moon phases
- [x] Add planets
- [ ] Add the milky way
- [ ] Add other sets of constellations

## The product

Lumière d'Étoile is actually more than just a star map generator, it is an illuminated map to display the stars of a special day. From the generated data, I create beautiful prints that I cut using a laser cutting machine and place it in a frame with LED lights inside. That way, the map gets illuminated from the push of a button and transform our map into something magical.

Perfect for birthday or anniversary gifts or any occasion to celebrate a special moment. If you want one or have any question, feel free to contact me on twitter.
