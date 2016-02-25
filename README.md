# alt-main

Alternative main.

## Why ?

When developing React + webpack apps, it was a practice to structure our apps like this -

```
components/
  One/
    One.js
    One.css
  Two/
    Two.js
    Two.css
```

and our requires came out like this,

```
import One from './components/One/One.js'
```

and if we have `components` under module directories, it still looked long,

```
import One from 'One/One';
```

There wasn't a way to set the default main of a directory to be the one with the same name as that of the directory. It is just enough to say,

```
import One from 'One';
```

Having the default main's name the same as the directory name solves the fuzzy file matching in our IDEs where all the open files in our project will be named `index.js` and it's annoying to find that index.js you'd want to switch to.

One way to solve this is to have a `package.json` with main field in every directory, but that's annoying too.

This is a step to try to make it work by changing the default main - and making it as the second level fallback. So, if you do,

```
import One from 'One';
```

The first try would be `package.json's main`. The default fallback is `index.js`. This project adds a second fallback `<Dir_Name.js>`.
