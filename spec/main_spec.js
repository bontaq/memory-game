$(function() {
  describe("init", function() {
    it("creates 20 boxes", function() {
      expect(window.view.boxes().length).toBe(20);
    });

    it("creates 2 of each 'color'", function() {
      var numBoxes = window.view.boxes().length,
          numUnique = _.chain(window.view.boxes())
            .map(function(box) {
              return box.color();
            })
            .uniq()
            .value()
            .length;
      expect(numUnique).toBe(numBoxes / 2);
    });
  });

  describe("memoryViewModel", function() {
    beforeEach(function() {
      // little bit ugly, but we want to start with a clean slate
      window.view.boxes([]);
      _.times(10, function(i) {
        var color = randomColor();
        _.times(2, function() {
          view.boxes.push(new boxViewModel(color));
        });
      });
      view.boxes(_.shuffle(view.boxes()));
    });

    it("has a score that defaults to 0", function() {
      expect(window.view.score()).toBe(0);
    });

    it("has 20 boxes", function() {
      expect(window.view.boxes().length).toBe(20);
    });

    it("marks a box as selected on click", function() {
      var box = window.view.boxes()[0];
      window.view.selectBox(box);
      expect(box.selected()).toBe(true);
    });

    it("sets last selected to the box clicked", function() {
      var box = window.view.boxes()[0];
      window.view.selectBox(box);
      expect(window.view.lastSelected()).toBe(box);
      expect(box.selected()).toBe(true);
    });

    it("unselects the last box if the color is wrong", function() {
      var boxes = window.view.boxes(),
          box_a = boxes[0],
          box_b = boxes[1];
      window.view.selectBox(box_a);
      window.view.selectBox(box_b);
      expect(box_a.selected()).toBe(false);
    });

    it("does not mark a box won if you selected the same box twice", function() {
      var box = window.view.boxes()[0];
      window.view.selectBox(box);
      window.view.selectBox(box);
      expect(box.isWon()).toBe(false);
    });

    it("increases the score by one if the color is correct", function() {
      window.view.score(0);
      box_a = window.view.boxes()[0];
      box_b = window.view.boxes()[1];
      box_b.color(box_a.color());
      window.view.selectBox(box_a);
      window.view.selectBox(box_b);
      expect(window.view.score()).toBe(1);
    });

    it("decreases the score by one if the color is wrong", function() {
      window.view.score(0);
      box_a = window.view.boxes()[0];
      box_b = window.view.boxes()[1];
      box_b.color('fakeColor!');
      window.view.score(1);
      window.view.selectBox(box_a);
      window.view.selectBox(box_b);
      expect(window.view.score()).toBe(0);
    });

    it("does not decrease the score if last selected was a win", function() {
      window.view.score(0);
      box_a = window.view.boxes()[0];
      box_b = window.view.boxes()[1];
      box_b.color(box_a.color());
      window.view.selectBox(box_a);
      window.view.selectBox(box_b);
      expect(window.view.score()).toBe(1);
      box_c = window.view.boxes()[2];
      window.view.selectBox(box_c);
      expect(window.view.score()).toBe(1);
    });

    describe("gameWon", function() {
      it("is true when all boxes are won", function() {
        _.map(window.view.boxes(), function(box) {
          box.isWon(true);
          box.selected(true);
        });
        expect(window.view.gameWon()).toBe(true);
      });

      it("is false if any boxes remamin unwon", function() {
        _.map(window.view.boxes(), function(box) {
          box.isWon(true);
          box.selected(true);
        });
        var box = window.view.boxes()[0];
        box.isWon(false);
        box.selected(false);
        expect(window.view.gameWon()).toBe(false);
      });
    });
  });
});
