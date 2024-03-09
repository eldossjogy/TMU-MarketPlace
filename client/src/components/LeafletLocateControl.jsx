import { createControlComponent } from '@react-leaflet/core'
import { useLeafletContext } from '@react-leaflet/core'
import { useMap } from 'react-leaflet'
import L, { Control, Map, DomUtil, DomEvent} from 'leaflet'
import React, { useEffect } from 'react'

const POSITION_CLASSES = {
	bottomleft: 'leaflet-bottom leaflet-left',
	bottomright: 'leaflet-bottom leaflet-right',
	topleft: 'leaflet-top leaflet-left',
	topright: 'leaflet-top leaflet-right',
}

export default function LocateControl({ position, zoom }) {
	const parentMap = useMap()
	const mapZoom = zoom || 0

	const positionClass = (position && POSITION_CLASSES[position]) || POSITION_CLASSES.topright

	const handleLocateClick = (e) => {
		e.stopPropagation();
		console.log(e);
	}
	return (
		<div className={positionClass}>
			<div className='leaflet-control'>
				<button role='button' onClick={(e) => {handleLocateClick(e);}} className='bg-sky-500 p-2 rounded-sm m-2'>
					Locate Me
				</button>
			</div>
		</div>
	)
}




/*
 * @class Control.Zoom
 * @aka L.Control.Zoom
 * @inherits Control
 *
 * A basic zoom control with two buttons (zoom in and zoom out). It is put on the map by default unless you set its [`zoomControl` option](#map-zoomcontrol) to `false`. Extends `Control`.
 */

export var LocateControl2 = Control.extend({
	// @section
	// @aka Control.Zoom options
	options: {
		position: 'topleft',

		// @option zoomInText: String = '<span aria-hidden="true">+</span>'
		// The text set on the 'zoom in' button.
		zoomInText: '<span aria-hidden="true">+</span>',

		// @option zoomInTitle: String = 'Zoom in'
		// The title set on the 'zoom in' button.
		zoomInTitle: 'Zoom in',

		// @option zoomOutText: String = '<span aria-hidden="true">&#x2212;</span>'
		// The text set on the 'zoom out' button.
		zoomOutText: '<span aria-hidden="true">&#x2212;</span>',

		// @option zoomOutTitle: String = 'Zoom out'
		// The title set on the 'zoom out' button.
		zoomOutTitle: 'Zoom out'
	},

	onAdd: function (map) {
		var zoomName = 'leaflet-control-zoom',
		    container = DomUtil.create('div', zoomName + ' leaflet-bar'),
		    options = this.options;

		this._zoomInButton  = this._createButton(options.zoomInText, options.zoomInTitle,
		        zoomName + '-in',  container, this._zoomIn);
		this._zoomOutButton = this._createButton(options.zoomOutText, options.zoomOutTitle,
		        zoomName + '-out', container, this._zoomOut);

		this._updateDisabled();
		map.on('zoomend zoomlevelschange', this._updateDisabled, this);

		return container;
	},

	onRemove: function (map) {
		map.off('zoomend zoomlevelschange', this._updateDisabled, this);
	},

	disable: function () {
		this._disabled = true;
		this._updateDisabled();
		return this;
	},

	enable: function () {
		this._disabled = false;
		this._updateDisabled();
		return this;
	},

	_zoomIn: function (e) {
		if (!this._disabled && this._map._zoom < this._map.getMaxZoom()) {
			this._map.zoomIn(this._map.options.zoomDelta * (e.shiftKey ? 3 : 1));
		}
	},

	_zoomOut: function (e) {
		if (!this._disabled && this._map._zoom > this._map.getMinZoom()) {
			this._map.zoomOut(this._map.options.zoomDelta * (e.shiftKey ? 3 : 1));
		}
	},

	_createButton: function (html, title, className, container, fn) {
		var link = DomUtil.create('a', className, container);
		link.innerHTML = html;
		link.href = '#';
		link.title = title;

		/*
		 * Will force screen readers like VoiceOver to read this as "Zoom in - button"
		 */
		link.setAttribute('role', 'button');
		link.setAttribute('aria-label', title);

		DomEvent.disableClickPropagation(link);
		DomEvent.on(link, 'click', DomEvent.stop);
		DomEvent.on(link, 'click', fn, this);
		DomEvent.on(link, 'click', this._refocusOnMap, this);

		return link;
	},

	_updateDisabled: function () {
		var map = this._map,
		    className = 'leaflet-disabled';

		DomUtil.removeClass(this._zoomInButton, className);
		DomUtil.removeClass(this._zoomOutButton, className);
		this._zoomInButton.setAttribute('aria-disabled', 'false');
		this._zoomOutButton.setAttribute('aria-disabled', 'false');

		if (this._disabled || map._zoom === map.getMinZoom()) {
			DomUtil.addClass(this._zoomOutButton, className);
			this._zoomOutButton.setAttribute('aria-disabled', 'true');
		}
		if (this._disabled || map._zoom === map.getMaxZoom()) {
			DomUtil.addClass(this._zoomInButton, className);
			this._zoomInButton.setAttribute('aria-disabled', 'true');
		}
	}
});

// @namespace Map
// @section Control options
// @option zoomControl: Boolean = true
// Whether a [zoom control](#control-zoom) is added to the map by default.
// Map.mergeOptions({
// 	locateControl: true
// });

// Map.addInitHook(function () {
// 	if (this.options.locateControl) {
// 		// @section Controls
// 		// @property zoomControl: Control.Zoom
// 		// The default zoom control (only available if the
// 		// [`zoomControl` option](#map-zoomcontrol) was `true` when creating the map).
// 		this.locateControl = new LocateControl();
// 		this.addControl(this.locateControl);
// 	}
// });


// export var LocateControl = Control.extend({
// 	options: {
// 		position: 'topRight',
// 	},

	
// 	_locate: function (e) {
// 		if (!this._disabled) {
// 			console.log('Locating');
// 		}
// 	}
// )};
// // @namespace Control.Zoom
// // @factory L.control.zoom(options: Control.Zoom options)
// // Creates a zoom control
// export var locateControl = function (options) {
// 	return new LocateControl(options);
// };