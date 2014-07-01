 var Task = function(name) {
            this.name = ko.observable(name);
        };

        Task.prototype.clone = function() {
            return new Task(this.name());
        };

        var ViewModel = function() {
            var self = this;
            self.tasks = ko.observableArray([
                new Task("Work"),
                new Task("Shopping"),
                new Task("Home")
            ]);

            self.newTask = new Task("New Task");

            self.allowNewTask = ko.computed(function() {
               return self.tasks().length < 10;
            });

            self.selectedTask = ko.observable();

            self.clearTask = function(data, event) {
                if (data === self.selectedTask()) {
                    self.selectedTask(null);
                }

                if (data.name() === "") {
                   self.tasks.remove(data);
                }
            };

            self.isTaskSelected = function(task) {
               return task === self.selectedTask();
            };
        };

  
        ko.bindingHandlers.visibleAndSelect = {
            update: function(element, valueAccessor) {
                ko.bindingHandlers.visible.update(element, valueAccessor);
                if (valueAccessor()) {
                    setTimeout(function() {
                        $(element).find("input").focus().select();
                    }, 0);
                }
            }
        };

        ko.applyBindings(new ViewModel());