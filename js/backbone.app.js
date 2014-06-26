$(function() {

  var sections = [
    { name: 'about', heading: 'About', body: '<img class="section-image-left" src="images/about_image.jpg" alt=""><p class="text-lg bold">Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Praesent vestibulum molestie lacus. Aenean nonummy hendrerit mauris.</p><p>Phasellus porta. Fusce suscipit varius mi. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nulla dui.</p><p class="text-lg bold">Fusce feugiat malesuada odio. Morbi nunc odio, gravida at, cursus nec, luctus a, lorem.</p><p>Maecenas tristique orci ac sem. Duis ultricies pharetra magna. Donec accumsan malesuada orci. Donec sit amet eros. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Mauris fermentum dictum magna. Sed laoreet aliquam leo. Ut tellus dolor, dapibus eget, elementum vel, cursus eleifend, elit. Aenean auctor wisi et urna. Aliquam erat volutpat. Duis ac turpis. Integer rutrum ante eu lacus. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Praesent vestibulum molestie lacus. Aenean nonummy hendrerit mauris. Phasellus porta. Fusce suscipit varius mi. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nulla dui. Fusce feugiat malesuada odio. Morbi nunc odio, gravida at, cursus nec, luctus a, lorem. Maecenas tristique orci ac sem. Duis ultricies pharetra magna. Donec accumsan malesuada orci. Donec sit amet eros. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Mauris fermentum dictum magna. Sed laoreet aliquam leo. Ut tellus dolor, dapibus eget, elementum vel, cursus eleifend, elit. Praesent vestibulum molestie lacus.</p>' },
    { name: 'contact', heading: 'Contacts', body: '<dl class="dl-contacts"><dt>Address 1:</dt><dd>The Company Name Inc.<br>8901 Marmora Road, Glasgow, D04 89GR.</dd><dt>Telephones:</dt><dd>+1 800 559 6580<br>+1 800 603 6035</dd><dt>Address 2:</dt><dd>The Company Name Inc.<br>9863 - 9867 Mill Road, Cambridge, MG09 99HT.</dd></dl><form class="form-feedback"><div class="form-group"><label>Name</label><input class="form-control" type="text" name="name" required=""></div><div class="form-group"><label>Email</label><input class="form-control" type="email" name="email"></div><div class="form-group"><label>Telephone</label><input class="form-control" type="tel" name="tel"></div><div class="form-group"><label>Comment</label><textarea class="form-control" required=""></textarea></div><button class="btn" type="submit">Submit</button></form>' }
  ];


  var team = [
    { name: 'Tom James', text: 'Praesent vestibulum molestie', image: 'images/person_image_01.jpg' },
    { name: 'Bradley Grosh', text: 'Fusce suscipit varius mi', image: 'images/person_image_02.jpg' },
    { name: 'Tom James', text: 'Praesent vestibulum molestie', image: 'images/person_image_01.jpg' },
    { name: 'Bradley Grosh', text: 'Fusce suscipit varius mi', image: 'images/person_image_02.jpg' }
  ];

  window.App = {
    Models: {},
    Views: {},
    Collections: {},
    Router: {}
  };

  window.tpl = function(id) {
    return $('#' + id).html();
  };

  window.findModel = function(collection, name) {
    return collection.findWhere({ name: name });
  };

  var vent = _.extend({}, Backbone.Events);

  App.Models.Section = Backbone.Model.extend({
    defaults: {
      name    : '',
      heading : '',
      body    : ''
    }
  });

  App.Models.Team = Backbone.Model.extend({
    defaults: {
      name    : '',
      text    : '',
      image   : ''
    }
  });

  App.Collections.Sections = Backbone.Collection.extend({
    model: App.Models.Section
  });

  App.Collections.Team = Backbone.Collection.extend({
    model: App.Models.Team
  });

  var sectionsCollection = new App.Collections.Sections(sections);
  var teamCollection = new App.Collections.Team(team);

  App.Views.Section = Backbone.View.extend({
    className: 'sections',
    template: doT.template(tpl('sectionTpl')),

    initialize: function() {
      this.render();
    },

    render: function() {
      this.$el.html( this.template( this.model.toJSON() ) );
      return this;
    }
  });

  App.Views.Team = Backbone.View.extend({
    template: doT.template(tpl('teamListTpl')),

    initialize: function() {
      this.render();
    },

    render: function() {
      this.$el.html( this.template({ team : this.collection.toJSON() }) );
      return this;
    }
  });

  App.Views.Nav = Backbone.View.extend({
    template: doT.template(tpl('navTpl')),

    render: function() {
      this.$el.html( this.template({ sections : this.collection.toJSON() }) );
      return this;
    }
  });

  App.Views.Page = Backbone.View.extend({
    el: $('#page'),

    initialize: function() {
      vent.on('route:content', this.render, this);

      var navView = new App.Views.Nav({ collection : sectionsCollection });
      $('#header').append(navView.render().el);

      var teamView = new App.Views.Team({ collection : teamCollection });
      $('#team').html(teamView.render().el);
    },

    render: function(other) {
      var model = findModel(sectionsCollection, other);

      if ( model.get('heading') )
        $(document).attr('title', model.get('heading'));

      var sectionView = new App.Views.Section({ model : model });
      $('#contant').html(sectionView.render().el);
    }
  });

  new App.Views.Page;

  App.Router = Backbone.Router.extend({
    routes: {
      '*other'  : 'page'
    },

    page: function(other) {
      if ( !other || !findModel(sectionsCollection, other) )
        other = 'about';

      vent.trigger('route:content', other);
      this.toggleNav(other)
    },

    toggleNav: function(other){
      var $nav = $('#header').find('.nav'),
          $items = $nav.find('a'),
          $current = $items.filter('[href="#'+other+'"]');
      $items.closest('li').removeClass('active');
      $current.closest('li').addClass('active');
    }
  });

  new App.Router();

  Backbone.history.start();

});