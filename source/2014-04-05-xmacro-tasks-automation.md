--- 

    { "tags" : [
        "english"
      , "linux"
      , "opensource"
      , "technology"
      , "tmux"
      , "vim"
      , "xmacro"
      ]
    , "title" : "Tasks Automation with XMacro"
    }

--- 

So it's time to make a more technical post.

If you're looking for `tmux` macros and you use `Xorg`, you will need this tip.

### TL;DR

Install `xmacro`, record some commonly made actions, edit the recorded file to
polish times and actions, make a script to reproduce them again and voilà,
macros for any window manager using `Xorg`, easy to use from vim or tmux.

### The story

I've been playing with linux for many years now, like any typical user, I
started with user friendly distributions, first Mandriva, then Ubuntu, then
Mandriva again, then OpenSUSE, CentOS, Fedora, Arch Linux and now Manjaro,
which is built on top of Arch and has a ready to use Net Edition. Just what I was looking for (check it out [here](http://manjaro.org/get-manjaro/)).

So, while you're in Linux and you get all excited about being able to be very
exquisit with which applications you are going to use (in matter of performance
and low consumption), you'll end up using the terminal **a lot**. That's what I
did, first using _alsamixer_ to control the sound, then _nano_ to edit files,
then _vim_, as well as music players like _mocp_, IRC clients like _irssi_,
email clients like _mutt_, then you begin using _xterm_ instead of any other
fancy gtk terms, then you switch from _Gnome_ to _OpenBox_, to _DWM_, and you
stay with it, because nothing is going to be so fast and simple. Then maybe
you're too lazy to set up a background image each time you're setting up a
machine, or like me, you get so uncomfortable about which image to select that
you prefer to have none, so you ended up just using conky to give it
a fancy style, but keeping things minimal, etc etc... well, the point is that
you start to use the terminal a lot. Fine.

[![My current desktop.](http://i.imgur.com/D4sEE0Q.png)](http://i.imgur.com/D4sEE0Q.png)

Now, every time you open your computer to start working for a project, you
start several terminals, maybe using TMUX, in some of them you run some
applications, like databases, web servers, or your editor; you load your vim
sessions to open all your needed files and then you start working. You do this
some days and eventually you begin to think you want to do that automatically
because it's tedious to be opening the same stuff again and again and again and
again...

For many years, I've encountered persons that have asked me if I knew a way of
scripting tmux to open several terminals and load your programs, or if there
was a way of makign macros with tmux, but I was unable to answer properly, I
said: well, yes, in principle you can start tmux's server and tell it to load
several applications, but it's not an automatical process, I mean, you can't
just record your actions to play them again, you have to make the script and
change it as you want new things to happen. I never explored the possibilities
of that approach, but it looks so cumbersome that everyone I know ended up just
doing things by hand and that's it.

Until now, ladies and gentlemen I present you: _xmacro_.

### [XMacro](http://xmacro.sourceforge.net)

For Arch Linux users, xmacro is available in the AUR: <https://aur.archlinux.org/packages/xmacro>

Essentially, xmacro records your pressed keys and saves them to a file. To run
it, see the line below:

    xmacrorec2 > myrecording

Once you call it, first you'll have to pick a quit-key (`<Esc>` is fine), then
whatever you do will be recorded: moving your mouse, clicking, pressing any
key, etc. Do some stuff, then press the quit-key, and you'll be able to
replicate that behavior with the following command:

    xmacroplay "$DISPLAY" < myrecording

Let's check `myrecording` file to see what we've got. As you'll see below, it
looks very much like the output of `xbindkeys -mk` (after you click some keys
there):

    MotionNotify 949 749
    KeyStrPress Alt_L
    Delay 147
    KeyStrPress 2
    KeyStrRelease 2
    KeyStrRelease Alt_L
    Delay 783
    KeyStrPress Alt_L
    Delay 110
    KeyStrPress 1
    KeyStrRelease 1
    KeyStrRelease Alt_L
    Delay 2351
    MotionNotify 918 536
    ButtonPress 1
    Delay 100
    ButtonRelease 1
    Delay 2396
    MotionNotify 628 378
    ButtonPress 1
    Delay 100
    ButtonRelease 1
    Delay 1593
    KeyStrPress Control_L
    Delay 79
    KeyStrPress c

In the previous code, you see `MotionNotify`, which indicates the position of
the cursor, then I pressed `Alt_L`, waited 147 milliseconds, then pressed `2`,
then released `2`, then released `Alt_L` (`Alt_L+2` sends you to the second
desktop in DWM). The rest of the file consist of the same type of actions. As
you see is easy to edit (just remember to keep it clean of empty lines, empty
lines produce errors). If you want to reproduce that again, but going to the
third desktop instead, yo could change `KeyStrPress 2` and `KeyStrRelease 2`
for `KeyStrPress 3` and `KeyStrRelease 3` respectively.

Fair enough, you now know a way of recording and replaying macros in X, and
it's also very easy to edit. Now let's make it more practical.

### A use-case

Let's define a use-case:

>   I, as a user, want to be able to open a new tab in tmux, and to cd to the
>   directory in which my current active file in vim is located.

To follow the process as I'm going to do, you'll need to have changed the
behavior of tmux to work like vim, to do so, you'll need to add the following
lines to your `.tmux.conf`:

    # vim keys
    set-window-option -g mode-keys vi
    bind-key -t vi-copy 'v' begin-selection
    bind-key -t vi-copy 'y' copy-selection
    bind-key h select-pane -L
    bind-key j select-pane -D
    bind-key k select-pane -U
    bind-key l select-pane -R

I'm also using the default `<Ctrl+b>` behavior of tmux, so make sure you
**DON'T** have lines like the followings in your `~/.tmux.conf`:

    unbind C-b
    set -g prefix C-a
    bind C-a send-prefix

So, how would you answer the use-case we stated? you could, for example, expand
your current path with vim, typing `:!# %:p:h` and then pressing tab:

    :!# %:p:h
    <Tab>
    :!# /home/youruser/your/path/
    <Smile>

Then, as the use-case states, we're in tmux, so we can select that text
pressing `<Ctrl+b>[`, it will stop rendering the terminal and let you
move/select/etc over the rendered text, but starting from the point your cursor
was before pressing those keys. So, as we set it to work like vim, now we can
press `0` to go to the beginning of the line, then press `4l` to move to the
beginning of the path, then press `v` to start the selection, then press `$` to
go to the end of the line and now press `y` to copy the text to tmux's buffer.
Finally press `<Ctrl+c>` to get out of tmux's special behavior.

Now, we press `<Ctrl+b>c` to open a new tab, in which we write `cd ` and we
paste tmux's buffer with `<Ctrl+]>`. That way we complete the use-case.

As you see, it's a complex process, even if you have done it so many times you
can do it without thinking, it requires lots of key presses and it's
error-prone, because you can miss keys and end up doing something else.

So let's automate it!

### Automating the use-case

First, let's make a directory at home to store our macros, let's call it
`~/.xmacros`.

An easy (but wrong) way of doing this automation is to call `xmacrorec2 >
~/.xmacros/vim_tmux_cd_newtab.macro` (you can change the file name if you want)
from another window (or terminal), then switch to the one where you have tmux
and vim, then do the process above, then we press the quit-key. Now, each time
you want to do it, you'll have to switch to another window/terminal and run
`xmacroplay` on it. This is not the preferred way, right? what if we make it
possible from vim directly? Let's try to run this from vim.

First, let's edit `vim_tmux_cd_newtab.macro` to remove the window switching,
just remove some of the first lines, they look like this:

    KeyStrPress Alt_L
    KeyStrPress 1
    KeyStrRelease 1
    KeyStrRelease Alt_L

(That was how I switch desktops).

You can also eliminate all the lines with `Delay`. Make sure it is exactly what
you want to go to the next steps. The one that I'm using is the following:
<https://gist.github.com/9997147>

If you try calling `xmacroplay` from vim, make sure to call it as follows:

    :exec "!xmacroplay \"$DISPLAY\" < ~/.xmacros/vim_tmux_cd_newtab.macro &"

Otherwise it will probably crash. (the key points are `"$DISPLAY"` and the last `&`).

That is a way, you'll probably prefer to set it in a mapping, but as the
command is in double quotes, imagine trying to call another of your macros,
you'll need to write it manually instead of being able to press tab until you
reach your preferred.

Instead, we could make a bash script and add it to your `$PATH`, that way
you'll be able to call it from vim and complete the paths with `<Tab>`, just
like we completed `%:h`.

This bash script is very simple, here's my approach, I call it `run_xmacro`:

    (cd ~/; xmacroplay "$DISPLAY" < $1 > /dev/null 2>&1 &)

To use this script, be sure you give it execution rights with: `chmod +x`, then
you can make a mapping to call it, put this at your `.vimrc` or in the file
where you put the mappings (I use `~/.vim/plugin/mappings.vim`);

    nmap <Tab>m :!run_xmacro ~/.xmacros/

(I use `<Tab>` a lot, so `<Tab>m` is the first thing that came to mind, change
it to fit your needs.)

Ok, so we're done! Now just press `<Tab>m`, the command will appear in vim,
then you'll be able to press tab again and loop over all your xmacros! Click on
one and it will run flawlessly.

Done, if you need any help please ping me
@[sadasant](https://twitter.com/sadasant). (Just request to follow, if I forget
to accept, send me an email).
