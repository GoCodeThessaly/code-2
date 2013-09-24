$(function(){
  $(document).foundation();

  var Note = Backbone.Model.extend({
    defaults: {
      color: 'transparent'
    },
    validate: function(attrs, options) {
      var errors = [];
      if (attrs.title == '') {
        errors.push("Title can't be blank!");
      }
      if (attrs.text == '') {
        errors.push("Body can't be blank!");
      }
      if (errors.length > 0) {
        return errors;
      }
    }
  });

  var NotesCollection = Backbone.Collection.extend({
    model: Note,
    url: '/notes'
  });

  var notes = new NotesCollection;

  var NoteView = Backbone.View.extend({
    tagName: 'tr',
    attributes: function() {
      return {style: 'background-color: ' + this.model.get('color')};
    },
    tpl: Mustache.compile($('#noteTpl').html()),
    events: {
      'click .view': function(e) {
        e.preventDefault();
        appRouter.navigate('/notes/' + this.model.get('id'), {trigger: true});
      },
      'click .edit': function(e) {
        e.preventDefault();
        appRouter.navigate('/notes/' + this.model.get('id') + '/edit', {trigger: true});
      },
      'click .delete': function(e) {
        e.preventDefault();
        this.model.destroy();
      }
    },
    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
      this.listenTo(this.model, 'change:color', function() {
        this.$el.css('background-color', this.model.get('color'));
      });
    },
    render: function() {
      this.$el.html(this.tpl(this.model.attributes));
      return this;
    },
  });

  var NotesRootView = Backbone.View.extend({
    el: document.body,
    events: {
      'submit #newNoteForm': 'createNote',
      'click button.cancel': 'cancelModal'
    },
    initialize: function() {
      this.listenTo(notes, 'add', this.addOne);
      var tbl = $('table[data-prefetch]');
      if (tbl.length > 0) {
        // bootstrap the collection
        notes.set(tbl.data('prefetch'));
      }
    },
    createNote: function(e) {
      e.preventDefault();
      // or use backbone-forms
      var serializedForm = $(e.target).serializeArray();
      var attrs = _.reduce(serializedForm, function(memo, obj) {
        memo[obj.name] = obj.value;
        return memo;
      }, {});
      var note = new Note(attrs, {collection: notes});
      $(e.target).find('.errors').remove();
      if (note.save()) {
        notes.push(note);
        $(e.target).find('input, textarea').val(''); // clear form
        $(e.target).closest('.reveal-modal').foundation('reveal', 'close'); // close the modal
      } else {
        $(e.target).prepend(Mustache.render($('#errorTpl').html(), {errors: note.validationError}));
      }
    },
    cancelModal: function(e) {
      e.preventDefault();
      $(e.target).closest('.reveal-modal').foundation('reveal', 'close');
      appRouter.navigate('/notes', {update: true});
    },
    addOne: function(note) {
      var view = new NoteView({model: note});
      this.$('table tbody').append(view.render().el);
      this.$('table').show();
      this.$('.db-empty').hide();
    }
  });

  var NoteEditView = Backbone.View.extend({
    el: document.getElementById('editNoteModal'),
    tpl: Mustache.compile($('#editNoteTpl').html()),
    events: {
      'submit #editNoteForm': 'editNote',
      // 'click button.cancel': 'cancelModal'
    },
    initialize: function() {
      this.$el.html(this.tpl(this.model.attributes));
      this.$el.foundation('reveal', 'open');
    },
    editNote: function(e) {
      e.preventDefault();
      var serializedForm = $(e.target).serializeArray();
      var attrs = _.reduce(serializedForm, function(memo, obj) {
        memo[obj.name] = obj.value;
        return memo;
      }, {});
      note = new Note(attrs);
      $(e.target).find('.errors').remove();
      if (note.isValid()) {
        this.model.set(attrs);
        this.model.save();
        $(e.target).closest('.reveal-modal').foundation('reveal', 'close');
        appRouter.navigate('/notes', {update: true});
      } else {
        $(e.target).prepend(Mustache.render($('#errorTpl').html(), {errors: note.validationError}));
      }
    }
  });

  var NotesRouter = Backbone.Router.extend({
    routes: {
      'notes': 'notesIndex',
      'notes/:id/edit': 'notesEdit'
    },

    notesIndex: function() {
      $('.reveal-modal.open').foundation('reveal', 'close');
    },
    notesEdit: function(id) {
      new NoteEditView({
        model: notes.get(id)
      });
    }
  });

  new NotesRootView;

  appRouter = new NotesRouter;
  Backbone.history.start({pushState: true});
});
