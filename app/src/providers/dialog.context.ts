declare global {
    interface Window {
        ipc?: { invoke: (channel: string, data?: unknown) => Promise<unknown> };
    }
}

export async function showSaveFileDialog(): Promise<string> {
    if (window.ipc) {
        return (await window.ipc.invoke('open-file-saver')) as string;
    }
    return 'test.parax';
}

export async function showOpenFileDialog(): Promise<string> {
    if (window.ipc) {
        return (await window.ipc.invoke('open-file-opener')) as string;
    }
    return 'test.parax';
}
