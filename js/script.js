var boxViewModel = function(color) {
  var self = this;
  self.selected = ko.observable(false);
  self.isWon = ko.observable(false);
  self.color = ko.observable(color);
  self.getColor = ko.computed(function() {
    if (self.isWon() || self.selected() === true) {
      return self.color();
    } else {
      return '';
    }
  }, self);
};

var memoryViewModel = function() {
  var self = this;
  self.score = ko.observable(0);
  self.boxes = ko.observableArray();
  self.lastSelected = ko.observable();

  self._highScore = 0;
  self.highScore = ko.computed(function() {
    if (self.score() > self._highScore) {
      self._highScore = self.score();
    }
    return self._highScore;
  });

  self.isWin = function(box) {
    var lastColor = self.lastSelected() === undefined ?
          undefined : self.lastSelected().color();
    if (box === self.lastSelected() || lastColor !== box.color()) {
      return false;
    } else {
      return true;
    }
  };

  self.selectBox = function(box) {
    if (self.isWin(box)) {
      self.lastSelected().isWon(true);
      box.isWon(true);
      self.score(self.score() + 1);
    } else if (self.lastSelected() !== undefined
               && self.lastSelected().isWon() === false) {
      self.lastSelected().selected(false);
      var score = self.score() > 0 ? self.score() - 1 : 0;
      self.score(score);
    }

    self.lastSelected(box);
    box.selected(true);
  };

  self.reset = function() {
    _.map(self.boxes(), function(box) {
      box.isWon(false);
      box.selected(false);
    });
    self.lastSelected(undefined);
    self.score(0);
  };

  self.gameWon = ko.computed(function() {
    var unwonBoxes = _.filter(self.boxes(), function(box) {
      return box.isWon() === false ? box : false;
    });
    return unwonBoxes.length === 0 ? true : false;
  });
};

function randomColor() {
  return '#'+((1<<24)*(Math.random()+1)|0).toString(16).substr(1);
}

//////////
// init //
//////////

window.view = view = new memoryViewModel();

_.times(10, function(i) {
  var color = randomColor();
  _.times(2, function() {
    view.boxes.push(new boxViewModel(color));
  });
});
view.boxes(_.shuffle(view.boxes()));

$(function() {
  ko.applyBindings(view);
});
