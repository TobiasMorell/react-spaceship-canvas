import React, { useRef, useEffect } from 'react';

const CANVAS_EVENT_FUNCTIONS = ['mousemove', 'mousedown', 'mouseup', 'touchdown', 'touchmove', 'touchend'];

const AnimationCanvas = ({ draw, width, height, ...props }) => {
	const canvasRef = useRef(null);

	const fireEventWithMouseCoordinates = event => (e) => {
		e.preventDefault();
		let boundary = canvasRef.current.getBoundingClientRect();

		const clamp = (min, val, max) => Math.max(min, Math.min(val, max));

		let eventCoordinate = e.touches ? e.touches[0] : e;

		// Get (x,y) coordinate of the mouse/touch, cropping to canvas boundaries
		let x = clamp(0, eventCoordinate.clientX - boundary.left, boundary.width);
		let y = clamp(0, eventCoordinate.clientY - boundary.top, boundary.height);
		event(x, y);
	};

	const registerEventFunctions = (canvas, props) => {
		let handlers = {};

		for (let e of CANVAS_EVENT_FUNCTIONS) {
			if (props[e]) {
				const h = fireEventWithMouseCoordinates(props[e]);
				canvas.addEventListener(e, h);
				handlers[e] = h;
			}
		}

		return handlers;
	};

	const removeEventFunctions = (canvas, handlers) => {
		for (let e of CANVAS_EVENT_FUNCTIONS) {
			if (handlers[e]) {
				canvas.removeEventListener(e, handlers[e]);
			}
		}
	};

	useEffect(() => {
		let frameCount = 0;
		let animationId;
		let lastFrame = 0;
		const canvas = canvasRef.current;
		const context = canvas.getContext('2d');

		const eventFunctions = registerEventFunctions(canvas, props);

		const _render = (t) => {
			let deltaTime = t - lastFrame;
			lastFrame = t;
			frameCount++;
			draw(context, frameCount, deltaTime / 1000.0);
			animationId = window.requestAnimationFrame(_render);
		};
		_render();

		return () => {
			removeEventFunctions(canvas, eventFunctions);
			window.cancelAnimationFrame(animationId);
		};
	}, [draw]);

	return <canvas ref={canvasRef} width={width} height={height} />;
};

export default AnimationCanvas;