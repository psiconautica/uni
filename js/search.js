(function() {
  function displaySearchResults(results, store) {
    var searchResults = document.getElementById('search-results');

    if (results.length) { // Are there any results?
      var appendString = '';

    for (var i = 0; i < results.length; i++) {  // Iterate over the results
      var item = store[results[i].ref];
      appendString += '<li style="width: 100%;" class="mix item trama-' + item.category + ' trama-' + item.type + '" data-published-date="' + item.date + '"><div class="content"><a href="/uni' + item.url + '"><h3 class="mono-space header">' + item.title + '</h3></a>';
      appendString += '<b class="mono-space">' +  item.category + '</b> / ';
      appendString += '<b class="mono-space">' + item.type + '</b>';
      appendString += '<p class="description">' + item.meta + '</p>';
      appendString += '<a class="mono-space" target="_blank" href="' + item.author_url + '" >via ' + item.author + '</a></div></li>';
    }

      searchResults.innerHTML = appendString;
    } else {
      searchResults.innerHTML = '<div class="no-result mono-space"><b>Búsqueda sin resultados</b></div>';
    }
  }

  function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');

    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');

      if (pair[0] === variable) {
        return decodeURIComponent(pair[1].replace(/\+/g, '%20'));
      }
    }
  }

  var searchTerm = getQueryVariable('query');

  if (searchTerm) {
    document.getElementById('search-box').setAttribute("value", searchTerm);

    // Initalize lunr with the fields it will be searching on. I've given title
    // a boost of 10 to indicate matches on this field are more important.
    var idx = lunr(function () {
      this.field('id');
      this.field('title', { boost: 10 });
      this.field('author');
      this.field('author_url');
      this.field('type');
      this.field('meta');
      this.field('tags');
      this.field('date');
      this.field('element');
      this.field('category');
      this.field('content');
    });

    for (var key in window.store) { // Add the data to lunr
      idx.add({
        'id': key,
        'title': window.store[key].title,
        'author': window.store[key].author,
        'author_url': window.store[key].author_url,
        'type': window.store[key].type,
        'meta': window.store[key].meta,
        'tags': window.store[key].tags,
        'date': window.store[key].date,
        'element': window.store[key].element,
        'category': window.store[key].category,
        'content': window.store[key].content
      });

      var results = idx.search(searchTerm); // Get lunr to perform a search
      displaySearchResults(results, window.store); // We'll write this in the next section
    }
  }
})();