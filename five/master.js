const { fork } = require('child_process');

function restart(mod) {
    let child = fork(mod);

    child.on('exit', function (code) {
        if (code != 0) {
            restart(mod);
        }
    });
}

restart('./server');