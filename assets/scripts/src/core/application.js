window.ALPHA || (ALPHA = {});

(function($, window, document, undefined) {
	'use strict';

	ALPHA.phases = {
		prime: {
			workout: {
				calories: -300,
				protein: 0.8,
				carbs: [30, 30, 75, 100]
			},

			no_workout: {
				calories: -500,
				protein: 0.7,
				carbs: [0, 0, 0, 50]
			}
		},

		adapt: {
			workout: {
				calories: -200,
				protein: 1,
				carbs: 0.75
			},

			no_workout: {
				calories: -600,
				protein: 0.8,
				carbs: 0.3
			}
		},

		surge: {
			workout: {
				calories: 400,
				protein: 1.5,
				carbs: 1
			},

			no_workout: {
				calories: -200,
				protein: 1.25,
				carbs: 0.5
			}
		},

		complete: {
			workout: {
				calories: 300,
				protein: 1.5,
				carbs: 1
			},

			no_workout: {
				calories: -400,
				protein: 1,
				carbs: 0.25
			}
		}
	};

	ALPHA.vars = {
		$form: $('#alpha-calculator'),
		$phase: $('#phase'),
		$weight: $('#weight'),
		$bodyFat: $('#body-fat')
	};

	ALPHA.init = function() {
		ALPHA.bindEvents();
	};

	ALPHA.bindEvents = function() {
		this.vars.$form.on('submit', this.calculate.bind(this));
	};

	ALPHA.bindReset = function() {
		$('#reset').one('click', this.reset.bind(this));
	};

	ALPHA.calculate = function(e) {
		e.preventDefault();

		// Calculate all the base values
		this.vars.weight = parseFloat(this.vars.$weight.val());
		this.vars.bodyFat = parseFloat(this.vars.$bodyFat.val());
		this.vars.bodyFatPounds = this.vars.weight * (this.vars.bodyFat / 100);
		this.vars.lbm = this.vars.weight - this.vars.bodyFatPounds;
		this.vars.maintenanceCalories = this.getMaintenanceCalories();
		this.vars.calories = this.vars.lbm * this.vars.maintenanceCalories;

		// Calculate the phase specific stuff
		this.vars.phase = this.phases[this.vars.$phase.val()];
		this.vars.days = {
			workout: this.getWorkoutDays(this.vars.phase.workout),
			no_workout: this.getWorkoutDays(this.vars.phase.no_workout)
		};

		this.generateTable();
		this.bindReset();
	};

	ALPHA.getMaintenanceCalories = function() {
		if (this.vars.bodyFat >= 6 && this.vars.bodyFat <= 12) {
			return 17;
		} else if (this.vars.bodyFat >= 12.1 && this.vars.bodyFat <= 15) {
			return 16;
		} else if (this.vars.bodyFat >= 15.1 && this.vars.bodyFat <= 19) {
			return 15;
		} else if (this.vars.bodyFat >= 19.1 && this.vars.bodyFat <= 22) {
			return 14;
		} else if (this.vars.bodyFat >= 22.1 && this.vars.bodyFat <= 100) {
			return 13;
		}
	};

	ALPHA.getWorkoutDays = function(type) {
		var day = {};

		day.calories = this.vars.calories + type.calories;
		day.protein = this.vars.lbm * type.protein;

		// Carbs are sometimes different for each week (prime)
		if (typeof type.carbs === 'object') {
			day.carbs = type.carbs;
			day.fat = [];

			for (var i = 0, length = day.carbs.length; i < length; i++) {
				var calsProteinCarbs = (day.protein + day.carbs[i]) * 4;
				var calsFat = day.calories - calsProteinCarbs;

				day.fat.push(calsFat / 9);
			}
		} else {
			day.carbs = this.vars.lbm * type.carbs;
			day.calsProteinCarbs = (day.protein + day.carbs) * 4;
			day.calsFat = day.calories - day.calsProteinCarbs;
			day.fat = day.calsFat / 9;
		}

		return day;
	};

	ALPHA.generateTable = function() {
		var source = $("#entry-template").html();
		var template = Handlebars.compile(source);
		var context = {
			lbm: this.vars.lbm,
			calories: this.vars.calories,
			workout: this.vars.days.workout,
			no_workout: this.vars.days.no_workout
		};
		var html = template(context);
		var $results = $('<div>', {
			id: 'results',
			'class': 'hide',
			html: html
		});

		this.vars.$form.after($results).slideUp(150, function() {
			$results.delay(150).slideDown(150);
		});
	};

	ALPHA.reset = function(e) {
		e.preventDefault();

		var $results = $('#results');

		$results.slideUp(150, function() {
			this.vars.$form.delay(150).slideDown(150);
			$results.remove();
		}.bind(this));
	};

	Handlebars.registerHelper('round', function(number) {
		return Math.round(number);
	});

	Handlebars.registerHelper('listOrSingle', function(obj) {
		if (typeof obj === 'object') {
			var html = '<ul>';

			for (var i = 0, length = obj.length; i < length; i++) {
				var week = i + 1;
				html += '<li>Week ' + week + ': ' + Math.round(obj[i]) + '</li>';
			}

			html += '</ul>';

			return html;
		} else {
			return Math.round(obj);
		}
	});

})(jQuery, window, document);

$(document).ready(ALPHA.init);