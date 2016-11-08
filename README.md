routrrr
=======
simple routing for the browser

Example Setup
-------------

### Javascript
```javascript
import Routrrr from 'routrrr';

// create an instance
const routrrr = new Routrrr();

// example auth middleware
const auth = function(route) {
  return function(req) {
    return new Promise((resolve, reject) => {
      if (window.authorized) {
        if (route) {
          this.redirect(route, true);
          reject();
        }
        else {
          resolve();
        }
      }
      else {
        if (req.pathname !== '/signin') {
          this.redirect('/signin', true);
          reject();
        }
        else {
          resolve();
        }
      }
    });
  };
};

// setup routes
routrrr
  // add middleware
  .use(req => {
    console.log('use', req.query);
    return Promise.resolve();
  })
  // add basic route
  .get('/', req => {
    console.log('root route', req);
  })
  // add route with middleware
  .get('/home', auth(), req => {
    console.log('home route', req);
  })
  // add route with parameter
  .get('/item/:id', req => {
    console.log('item route', req);
  })
  // add route with parameter in the middle
  .get('/item/:id/edit', req => {
    console.log('edit route', req);
  })
  // add route with optional parameter
  .get('/search/:q?', req => {
    console.log('search route', req);
  })
  // set the default route handler (404)
  .setDefault(req => {
    console.log('fallback route', req);
  })
  // initiate first load
  .load();

// example ajax link setup
document.querySelectorAll('[data-ajax]').forEach(item => {
  item.addEventListener('click', function(e) {
    routrrr.redirect(this.href);
    e.preventDefault();
    return false;
  }, false);
});


```

### .htaccess 

```apacheconf
RewriteEngine On
RewriteBase /

RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME} !-l
RewriteRule ^ index.html [QSA,L]
```


License
-------

[MIT License](LICENSE)
