import type { FileStub, Stub, EditingConstraints, Scope, Lesson } from '$lib/types';
import { derived, writable, type Writable } from 'svelte/store';
interface State {
	status: 'initial' | 'select' | 'set' | 'update' | 'switch';
	stubs: Stub[];
}

const { subscribe, set, update }: Writable<State> = writable({
	status: 'initial',
	stubs: [],
	selected: null,
	exercise: {
		initial: [],
		solution: {},
		editing_constraints: {
			create: [],
			remove: []
		},
		scope: { depth: 0, name: '', prefix: '' }
	}
});

export const state = {
	subscribe,
	update_file: (file: FileStub) => {
		update((state) => ({
			...state,
			status: 'update',
			stubs: state.stubs.map((stub) => {
				if (stub.name === file.name) {
					return file;
				}
				return stub;
			}),
			last_updated: file
		}));
	},

	set_stubs: (stubs: Stub[]) => {
		update((state) => ({
			...state,
			status: 'set',
			stubs: stubs ?? state.stubs,
			last_updated: undefined
		}));
	},

	switch_exercise: (lesson: Lesson) => {
		// const solution = { ...exercise.a };
		// const editing_constraints = {
		// 	create: exercise.editing_constraints.create,
		// 	remove: exercise.editing_constraints.remove
		// };

		// // TODO should exercise.a/b be an array in the first place?
		// for (const stub of Object.values(exercise.b)) {
		// 	if (stub.type === 'file' && stub.contents.startsWith('__delete')) {
		// 		// remove file
		// 		if (!editing_constraints.remove.includes(stub.name)) {
		// 			editing_constraints.remove.push(stub.name);
		// 		}
		// 		delete solution[stub.name];
		// 	} else if (stub.name.endsWith('/__delete')) {
		// 		// remove directory
		// 		const parent = stub.name.slice(0, stub.name.lastIndexOf('/'));
		// 		if (!editing_constraints.remove.includes(parent)) {
		// 			editing_constraints.remove.push(parent);
		// 		}
		// 		delete solution[parent];
		// 		for (const k in solution) {
		// 			if (k.startsWith(parent + '/')) {
		// 				delete solution[k];
		// 			}
		// 		}
		// 	} else {
		// 		if (!solution[stub.name] && !editing_constraints.create.includes(stub.name)) {
		// 			editing_constraints.create.push(stub.name);
		// 		}
		// 		solution[stub.name] = exercise.b[stub.name];
		// 	}
		// }

		set({
			status: 'switch',
			stubs: Object.values(lesson.a)
		});
	},

	toggle_completion: () => {
		// update((state) => ({
		// 	...state,
		// 	status: 'set',
		// 	stubs: is_completed(state) ? state.exercise.initial : Object.values(state.exercise.solution),
		// 	last_updated: undefined
		// }));
	},

	select_file: (name: string | null) => {
		update((state) => ({
			...state,
			status: 'select',
			selected: name,
			last_updated: undefined
		}));
	}
};

export const stubs = derived(state, ($state) => $state.stubs);

// export const selected = derived(
// 	state,
// 	($state) =>
// 		/** @type{import('$lib/types').FileStub | undefined} */ $state.stubs.find(
// 			(stub) => stub.name === $state.selected
// 		) ?? null
// );

// export const solution = derived(state, ($state) => $state.exercise.solution);

// export const editing_constraints = derived(state, ($state) => $state.exercise.editing_constraints);

// export const scope = derived(state, ($state) => $state.exercise.scope);

// export const completed = derived(state, is_completed);

// function is_completed($state: State) {
// 	const all_stubs_correct = $state.stubs.every((stub) => {
// 		if (stub.type === 'directory') {
// 			return true;
// 		} else if (stub.type === 'file' && stub.name in $state.exercise.solution) {
// 			const expected = $state.exercise.solution[stub.name];
// 			return expected.type === 'file' && normalise(stub.contents) === normalise(expected.contents);
// 		} else {
// 			return false;
// 		}
// 	});

// 	const stub_names = new Set($state.stubs.map((stub) => stub.name));
// 	const stubs_complete = Object.keys($state.exercise.solution).every((name) =>
// 		stub_names.has(name)
// 	);

// 	return all_stubs_correct && stubs_complete;
// }

// function normalise(code: string) {
// 	// TODO think about more sophisticated normalisation (e.g. truncate multiple newlines)
// 	return code.replace(/\s+/g, ' ').trim();
// }
