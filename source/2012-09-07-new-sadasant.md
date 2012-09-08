{ "tags" : [
    "sadasant"
  , "programming"
  , "javascript"
  , "php"
  , "english"
  , "opensource"
  ]
, "title" : "New Sadasant"
}

--- content ---

Hello!

This year has been one of the most interesting experiences ever,
fluctuations of emotions, success and failures, love and
stress, moreover, a general evolution to my understanding
of things, including many edits to my website.

The changes went from a very simple blog system
that used JSON and Dropbox, to a plain html site,
to a fully ajax site with a slide-down big image
at the cover. I liked to have pictures of good moments
at the home page.

The styles reminded dark, I remember having it all white
in the 2010 - 2011, but for me it was more comfortable
to have a dark desktop (
[0](http://sadasant.deviantart.com/art/Desktop0002-181479401),
[1](http://sadasant.deviantart.com/art/Arch-Linux-182995278),
[2](http://sadasant.deviantart.com/art/Fulgur-03-205170452),
[3](http://sadasant.deviantart.com/art/My-desktop-for-the-2012-325841169)
). My family thought my eyes were going to
melt because of the contrasts between white fonts and
black backgrounds, but I believe is the opposite,
I mean look at you, you're staring a screen full of
little light bulbs, white means they're all
turned on, think on how the image of the screen
remains after you close your eyes, bam!

Anyway, as months went through, I became
more and more like an evangelist of new technologies
at the university, I started to train some teams,
to speak more in front of more than 50 persons,
weekly, to sleep less and to do more, and so on.

You have to dress accordingly to the environment,
I mean, your impression is a way of expression,
what are you expecting to say?  
(Says the guy that almost always wears black).

I needed a site to express my self constantly and fluently.

So I met [Jekyll](http://wiki.github.com/mojombo/jekyll/),
and it was dev-love at the first view-source. I even thought
I could do something similar, more ajaxy,
more how I liked things to be.

After some nights of work, I did this blog.

# Features

-   A single infinite stream of posts.
-   Responsive design.
-   Simple mobile adaptability.
-   No-reload, bookmarkable and SEO friendly browsing.
-   Most used tags (at the left) and tags search.
-   Source files are written in JSON and Markdown.
-   No database needed.

# PHP

As I'm mainly a JavaScript developer and I use to talk a lot
about JS and Node, it might appear odd to some of my friends
or knowns that I decided making this website with _PHP_.

Well, the main reason is that I want to keep a hook with my
[parents](http://tecnosoluciones.com/)' hosting/cloud platform.
It is well known that PHP is highly used among the population of
programmers around the world, but I believe Venezuela is a special case,
since, for example, 3 of our fellows are working at the
[core of CakePHP](http://www.cakedc.com/team).

But, anyway, the good thing is that PHP is easy to use,
and it's specially good for processing hypertext (indeed),
which is great.

# No database

The blog has a [compiler script](https://github.com/sadasant/sadasant/blob/master/admin/digest.php)
that parses all the new source files at /feed/ and re-generates
the JSONs tags and the final HTML files. I didn't want comments
or likes, so I didn't see the point of using a database.  
The less dependencies, the better.

# JavaScript

Here comes the fun part (I'm so mean with other languages).
I've been using my little practices to build my own
general-use JavaScript library.
The latest version is called **Shade** and it has the next features:

-   a typeOf function to fix the silly typeof operator.
-   Browser-side harmless database with localStorage.
-   A fast DOM elements finder.
-   Cross-browser class and events helpers.
-   Simple ajax API.

Check the code [here](https://github.com/sadasant/sadasant/blob/master/js/Shade.js),
or download the minified version [here](http://sadasant.com/js/Shade.min.js).

# Open Source

[The source of this blog is entirely free and open](https://github.com/sadasant/sadasant)
, go check it! It wont byte you ;)

Thanks for your time.
