type TListner<T = unknown> = (data?: T) => void;

export class EventEmitter<T extends string> {
    listener: Record<string, TListner[]> = {};

    on<K = unknown>(event: T, fn: TListner<K>) {
        if (!this.listener[event]) this.listener[event] = [fn as TListner];
        else this.listener[event].push(fn as TListner);
    }
    emit(event: T, data?: unknown) {
        const listener = this.listener[event];
        if (listener) this.listener[event]?.forEach((listner) => listner(data));
    }
    off(evnet: T, fn: () => void) {
        const listener = this.listener[evnet];
        if (listener) this.listener[evnet] = listener.filter((listner) => listner !== fn);
    }
    init() {
        this.listener = {};
    }
}
