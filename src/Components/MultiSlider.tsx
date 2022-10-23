import React, { useCallback, useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import "./MultiSlider.css";

export interface SliderProps {
	min: number,
	max: number,
	onChange: (min: number, max: number) => void,
	labelFn?: (value: number) => string,
}

const MultiRangeSlider = ({ min, max, onChange, labelFn }: SliderProps) => {
	if (!labelFn) {
		labelFn = (_val) => '';
	}
	const [minVal, setMinVal] = useState<number>(min);
	const [maxVal, setMaxVal] = useState<number>(max);
	const minValRef = useRef<number>(min);
	const maxValRef = useRef<number>(max);
	const range = useRef<HTMLInputElement | null>(null);

	// Convert to percentage
	const getPercent = useCallback(
		(value) => Math.round(((value - min) / (max - min)) * 100),
		[min, max]
	);

	// Set width of the range to decrease from the left side
	useEffect(() => {
		const minPercent = getPercent(minVal);
		const maxPercent = getPercent(maxValRef.current);

		if (range.current) {

			range.current.style.left = `${minPercent}%`;
			range.current.style.width = `${maxPercent - minPercent}%`;
		}
	}, [minVal, getPercent]);

	// Set width of the range to decrease from the right side
	useEffect(() => {
		const minPercent = getPercent(minValRef.current);
		const maxPercent = getPercent(maxVal);

		if (range.current) {
			range.current.style.width = `${maxPercent - minPercent}%`;
		}
	}, [maxVal, getPercent]);

	// Get min and max values when their state changes
	useEffect(() => {
		onChange(minVal, maxVal);
	}, [minVal, maxVal, onChange]);

	return (
		<span className="container">
			<input
				type="range"
				min={min}
				max={max}
				value={minVal}
				onChange={(event) => {
					const value = Math.min(Number(event.target.value), maxVal - 1);
					setMinVal(value);
					minValRef.current = value;
				}}
				className="thumb thumb--left"
				style={{ zIndex: (minVal > max - 100) ? "5" : undefined }}
			/>
			<input
				type="range"
				min={min}
				max={max}
				value={maxVal}
				onChange={(event) => {
					const value = Math.max(Number(event.target.value), minVal + 1);
					setMaxVal(value);
					maxValRef.current = value;
				}}
				className="thumb thumb--right"
			/>

			<span className="slider">
				<span className="slider__left-input">
					<input type="number" value={minVal} onChange={(event) => {
						const value = Math.max(Math.min(Number(event.target.value), maxVal - 1), min);
						setMinVal(value);
						minValRef.current = value;
					}}/>
				</span>
				<span className="slider__right-input">
					<input type="number" value={maxVal} onChange={(event) => {
						const value = Math.min(Math.max(Number(event.target.value), minVal + 1), max);
						setMaxVal(value);
						maxValRef.current = value;
					}}/>
				</span>
				<span className="slider__track" />
				<span ref={range} className="slider__range" />
				<span className="slider__left-value">
					{labelFn(minVal)}
				</span>
				<span className="slider__right-value">
					{labelFn(maxVal)}
				</span>
			</span>
		</span>
	);
};

MultiRangeSlider.propTypes = {
	min: PropTypes.number.isRequired,
	max: PropTypes.number.isRequired,
	onChange: PropTypes.func.isRequired
};

export default MultiRangeSlider;
