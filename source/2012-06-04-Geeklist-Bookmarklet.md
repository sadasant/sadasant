{ "tags" : [
    "screenshots"
  , "programming"
  , "nodejs"
  , "javascript"
  , "mongodb"
  , "english"
  , "css"
  ]
, "title" : "Geeklist Links and Bookmarklet"
}

--- image_title ---

![Geeklist's Bookmarklet](/images/posts/2012-06-04-Geeklist-Bookmarklet.jpg)

--- content ---

Lasted about 2 months at randoms hours a week making the [Geeklist](http://geekli.st/)'s
links system and bookmarklet, plus another month at random for polishing,
upgrading it to interact with communities and to work with an external
geekit button (unreleased feature).

This piece of software let users share links across the web with a bookmarklet,
like those offered by other social apps (Pinterest, Delicious, e.g.).
When users click it, a modal appears over the current site, with some of the site's
data and some other fields for more customization details,
like the category in which the link will be stored, the title,
description and tags. Once the user have picked their custom preferences,
they can press the **Geekit!** button at the bottom of the modal, with an
option to tweet the link with their twitter accounts. Right after,
a notification will appear in the user's and communities' streams,
linking to a single site per link with more details about the shared
website.

The work was done under the Geeklist's architecture, using [Node.js](http://nodejs.org/),
[MongoDB](http://mongodb.org/) and [jQuery](http://jquery.com/) frameworks,
with libraries such as [Express.js](http://expressjs.com/),
[Stylus](http://learnboost.github.com/stylus/), [Jade](https://github.com/visionmedia/jade),
[Mongoose](http://mongoosejs.com/) and a bunch of jQuery plugins.

## Results:

-   [Geeklist releases the Geekit Bookmarklet](http://blog.geekli.st/post/24454882834/geeklist-releases-the-geekit-tm-bookmarklet-for-links-and).
-   [Card at Geeklist](http://geekli.st/sadasant/i-brought-links-to-geeklist).
-   [Screenshots at imgur.com](http://imgur.com/a/Rq9wr).
