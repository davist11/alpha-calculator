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

	ALPHA.calculate = function(e) {
		e.preventDefault();

		// Calculate all the base values
		this.vars.weight = parseInt(this.vars.$weight.val(), 10);
		this.vars.bodyFat = parseInt(this.vars.$bodyFat.val(), 10);
		this.vars.bodyFatPounds = this.vars.weight * (this.vars.bodyFat / 100);
		this.vars.lbm = this.vars.weight - this.vars.bodyFatPounds;
		this.vars.maintenanceCalories = this.getMaintenanceCalories();
		this.vars.calories = this.vars.lbm * this.vars.maintenanceCalories;

		// Calculate the phase specific stuff
		console.log(this.vars);
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

})(jQuery, window, document);

$(document).ready(ALPHA.init);