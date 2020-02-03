export interface FormEvent<T extends EventTarget> extends Event {
	readonly target: T
}
