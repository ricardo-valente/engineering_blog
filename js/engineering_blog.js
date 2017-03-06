'use strict';

var $body = $('body');

function fadePage() {
   $body.addClass('js-show');
   $body.find('a:not([target])').on('click', function(){
      $body.removeClass('js-show');
   });
}

function expandSection(trigger, elem, class_name) {
   $body.on('click', trigger, function() {
      $body.find(elem).toggleClass(class_name);
      $body.find(trigger).toggleClass(class_name);
   });

   // $body.on('click', elem, function() {
   //    $body.find(trigger).removeClass(class_name);
   // });
   $body.find('.disable').on('click', function() {
      $body.find(elem).removeClass(class_name);
      $body.find(trigger).removeClass(class_name);
   });
   if ( $body.find(elem).find('h2.icon-close') ) {
      $body.on('click', 'h2.icon-close', function() {
         $body.find(this).closest(elem).toggleClass(class_name);
      });
   }
}

function stickyFooter() {
   var $win_height = $(window).height(),
      $footer_height = $body.find('footer').height(),
      $footer_top = $body.find('footer').offset().top + $footer_height;
   console.log($win_height + ' | ' + $footer_top);

   function stickTheFooter() {
      var $win_height = $(window).height();
      if( $win_height > $footer_top ) {
         $body.find('footer').addClass('js-sticky');
      } else {
         $body.find('footer').removeClass('js-sticky');
      }
   }

   var delay;
   $(window).resize(function() {
      clearTimeout(delay);
      console.log($win_height + ' | ' + $footer_top);
      delay = setTimeout(stickTheFooter, 1);
   });

   stickTheFooter();
}

   function makeSearch() {

      function displaySearchResults(results, store) {
         var searchResults = document.getElementById('search-results');
         // var $search_results = $body.find('#search_results');
         if (results.length) { // Are there any results?
            var appendString = '';
            for (var i = 0; i < results.length; i++) {  // Iterate over the results
               var item = store[results[i].ref],
                  index = i + 1;
               appendString += '<li class="container-fluid pad-50 post-item post-' + index + '">';
               appendString +=    '<div class="container">';
               appendString +=       '<div class="col-xs-12">';
               appendString +=          '<div class="col-xs-12 col-sm-3">';
               appendString +=             '<h4 class="post-date">' + item.date + '</h4>';
               appendString +=             '<h6 class="post-category pad-top-50">' + item.category + '</h6>';
               appendString +=             '<h6 class="post-author pad-top-10">' + item.author + '</h6>';
               appendString +=             '<h6 class="post-meta pad-top-10">' + item.meta + '</h6>';
               appendString +=          '</div>';
               appendString +=          '<div class="col-xs-12 col-sm-9">';
               appendString +=             '<h4 class="post-title">' + item.title + '</h4>';
               appendString +=             '<h5 class="post-excert pad-50">' + item.excerpt + '</h5>';
               appendString +=             '<a class="post-link" href="' + item.url + '">Read more</a>';
               appendString +=          '</div>';
               appendString +=       '</div>';
               appendString +=    '</div>';
               appendString += '</li>';
            }
            searchResults.innerHTML = appendString;
         } else {
            searchResults.innerHTML = '<li class="container-fluid pad-50"><div class="container"><div class="col-xs-12"><h4>No results found</h4></div></div></li>';
         }
         stickyFooter();
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
         document.getElementById('search-box').setAttribute('value', searchTerm);
         var search_query = $body.find('.search-query');
         search_query.html('<span>Results for </span>"' + searchTerm + '"');
         // Initalize lunr with the fields it will be searching on. I've given title
         // a boost of 10 to indicate matches on this field are more important.
         var idx = lunr(function () {
            this.field('id');
            this.field('title', { boost: 10 });
            this.field('date');
            this.field('author');
            this.field('author_meta');
            this.field('meta');
            this.field('category');
            this.field('content');
            this.field('excerpt');
         });
         for (var key in window.store) { // Add the data to lunr
            idx.add({
               'id': key,
               'title': window.store[key].title,
               'date': window.store[key].date,
               'author': window.store[key].author,
               'author_meta': window.store[key].author_meta,
               'meta': window.store[key].meta,
               'category': window.store[key].category,
               'content': window.store[key].content,
               'excerpt': window.store[key].excerpt
            });
            var results = idx.search(searchTerm); // Get lunr to perform a search
            displaySearchResults(results, window.store); // We'll write this in the next section
         }
      }
   }

$(document).ready(function() {

   fadePage();
   expandSection('h3.icon-menu', '.main-nav, .icon-logo', 'js-expanded');
   expandSection('h2.icon-search', '.search', 'js-expanded');
   stickyFooter();
   makeSearch();

});
