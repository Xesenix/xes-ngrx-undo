import { ActionReducer } from '@ngrx/store';

import { undoBehavior } from '../../src/middleware/undo-behavior';
import { undo } from '../../src/actions/undo';

type State = { counter: number };

describe('undoBehavior', () => {
	const rootReducer = (state = { counter: 0 }, action) => {
		switch (action.type) {
			case 'INC':
				state = { counter: state.counter + 1 };
				break;
			case 'DEC':
				state = { counter: state.counter - 1 };
				break;
			case 'MULTIPLY':
				state = { counter: state.counter * action.value };
				break;
		}

		return state;
	};
	const incrementAction = { type: 'INC' };
	const decrementAction = { type: 'DEC' };
	const multiplyByTwoAction = { type: 'MULTIPLY', value: 2 };
	const otherAction = { type: 'OTHER' };

	it('should generate ActionReducer', () => {
		const middleware = undoBehavior<State>(10);
		const actionReducer = middleware(rootReducer);

		let state = actionReducer(undefined, otherAction);

		expect(state).toEqual({ counter: 0 });

		state = actionReducer(undefined, incrementAction);

		expect(state).toEqual({ counter: 1 });

		state = actionReducer(state, incrementAction);

		expect(state).toEqual({ counter: 2 });

		state = actionReducer(state, decrementAction);

		expect(state).toEqual({ counter: 1 });

		state = actionReducer(undefined, decrementAction);

		expect(state).toEqual({ counter: -1 });

		state = actionReducer(state, decrementAction);

		expect(state).toEqual({ counter: -2 });

		state = actionReducer(state, incrementAction);

		expect(state).toEqual({ counter: -1 });
	});

	it('should be able to handle more than bufferSize actions', () => {
		const middleware = undoBehavior<State>(10);
		const actionReducer = middleware(rootReducer);
		let state = undefined;

		for (let i = 0; i < 100; i++) {
			state = actionReducer(state, incrementAction);
		}

		expect(state).toEqual({ counter: 100 });
	});

	it('should be able undo actions', () => {
		const middleware = undoBehavior<State>();
		const actionReducer = middleware(rootReducer);
		const undoAction = undo(incrementAction);
		let state = undefined;

		for (let i = 0; i < 10; i++) {
			state = actionReducer(state, incrementAction);
		}

		expect(state).toEqual({ counter: 10 });

		for (let i = 0; i < 5; i++) {
			state = actionReducer(state, undoAction);
		}

		expect(state).toEqual({ counter: 5 });
	});

	it('should be able undo specific type of action', () => {
		const middleware = undoBehavior<State>();
		const actionReducer = middleware(rootReducer);
		const undoAction = undo(multiplyByTwoAction);
		let state = undefined;

		state = actionReducer(state, incrementAction);
		state = actionReducer(state, incrementAction);
		state = actionReducer(state, multiplyByTwoAction);
		state = actionReducer(state, incrementAction);

		expect(state).toEqual({ counter: 5 });

		state = actionReducer(state, undoAction);

		expect(state).toEqual({ counter: 3 });
	});
});
