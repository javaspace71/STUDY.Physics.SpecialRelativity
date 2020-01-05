/*
InertialFrames version 1.0.0-alpha
STUDY.Physics.SpecialRelativity/InertialFrames
Physics case studies: Special Relativity: Inertial Frames

Copyright (C) 2020 Julio P. Di Egidio (http://julio.diegidio.name)
InertialFrames is part of the STUDY.Physics.SpecialRelativity collection
(see https://github.com/jp-diegidio/STUDY.Physics.SpecialRelativity).
InertialFrames is released under the terms of the GNU-GPLv3 license.
As usual, NO WARRANTY OF ANY KIND is implied.
*/

(function ($global, $ko) {
	"use strict";

	$global.app = $global.app || {};

	// requires:
	var $common = $global.nan.common;

	function Control(model, options) {
		var CYCLE_TIME = model.CYCLE_TIME;

		var STATE = model.STATE;

		var _timeStep, _timerInterval;

		var _timer = new $common.SimpleTimer(onTimer);

		model.timeMul.subscribe(CHANGE_TIMER);
		model.timeFreq.subscribe(CHANGE_TIMER);

		function CHANGE_TIMER() {
			var tm = model.timeMul(),
				tf = model.timeFreq();

			_timeStep = tm / tf;
			_timerInterval = 1000 / tf;

			if (_timer.stop()) {
				_timer.start(_timerInterval);
			}
		}

		function NEXT_TIME(t) {
			t = (t + _timeStep) % CYCLE_TIME;

			// NOTE: Rounding to ms due to FP errors:
			return Math.round(t * 1000) / 1000;
		}

		function onTimer() {
			var t = model.time();

			model.setTime(NEXT_TIME(t));
		}

		function canStart() {
			return model.state() === STATE.STOPPED;
		}

		function canStop() {
			return model.state() === STATE.RUNNING;
		}

		function canReset() {
			return model.state() !== STATE.BOOTING;
		}

		function start() {
			model.start();

			_timer.start(_timerInterval);
		}

		function stop() {
			_timer.stop();

			model.stop();
		}

		function reset(hard) {
			_timer.stop();

			model.reset(hard);
		}

		function init() {
			model.init();
		}

		this.setTimeMul = model.setTimeMul;
		this.setTimeFreq = model.setTimeFreq;
		this.setSpeed = model.setSpeed;
		this.setTime = model.setTime;

		this.canStart = new $ko.pureComputed(canStart);
		this.canStop = new $ko.pureComputed(canStop);
		this.canReset = new $ko.pureComputed(canReset);

		this.start = function () { if (canStart()) { start(); } };
		this.stop = function () { if (canStop()) { stop(); } };
		this.reset = function (hard) { if (canReset()) { reset(hard); } };

		this.init = function () { init(); };
	}

	$global.app.Control = Control;
})(window, ko);
