import { spawn, SpawnOptionsWithoutStdio } from 'child_process';

export interface ImplementShell {
    id: string
    command: string
    args: string[]
    options?: SpawnOptionsWithoutStdio,
    callback?: (type: string, data: string) => void
}

export interface ShellParameter {
    sid: string
    id: string
    command: string
    args: string[]
}

const PrimaryKey = {}

export function kill(id: string) {
    PrimaryKey[id].kill()
}


export function implementShell({ id, command, args, options, callback }: ImplementShell) {

    if (!(command === 'yarn' || command === 'npm')) {
        callback('close', '非法指令，程序已退出。')
        return
    }

    if (process.platform === 'win32') {
        command += '.cmd'
    }
    const Shell = spawn(command, args, options);

    PrimaryKey[id] = Shell

    Shell.stdout.on('data', (data) => {
        callback('stdout', data)
    });


    Shell.stderr.on('data', (data) => {
        callback('stderr', data)
    });

    Shell.on('close', (code) => {
        callback('close', '子进程执行完毕，程序已退出。')
    });

    Shell.on('error', (data) => {
        console.log(data);
    })

}
