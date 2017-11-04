import { ActionReducer, Action } from '@ngrx/store';

import { UNDO_ACTION } from '../actions/undo';

export function undoBehavior(bufferSize = 100) {
	return (rootReducer: ActionReducer<any>): ActionReducer<any> => {
		let executedActions: Array<Action> = [];
		let rootState: any = undefined;
		return (state: any, action: any) => {
			if (action.type === UNDO_ACTION) {
				const index = executedActions.lastIndexOf(action.payload);
				executedActions.splice(index, 1);
				return executedActions.reduce(rootReducer, rootState);
			}
			executedActions.push(action);
			let updatedState = rootReducer(state, action);
			if (executedActions.length === bufferSize + 1) {
				let firstAction = executedActions[0];
				rootState = rootReducer(rootState, firstAction);
				executedActions = executedActions.slice(1, bufferSize + 1);
			}
			return updatedState;
		};
	};
}
