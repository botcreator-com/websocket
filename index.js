const { Worker } = require('worker_threads')

function webSocket(port) {

  const worker = new Worker('./ws/index.js',{workerData:{port:port}});

    worker.on('message',function(data){
     console.log(data);
    });

    worker.on('error', function(error){
     console.log(error)
    });
    worker.on('exit', (code) => {
      if (code !== 0)
        console.log(new Error(`Worker stopped with exit code ${code}`));
    })
}

function bot(port) {

    const worker = new Worker('./bot/index.js',{workerData:{port:port}});
  
      worker.on('message',function(data){
       console.log(data);
      });
  
      worker.on('error', function(error){
       console.log(error)
      });
      worker.on('exit', (code) => {
        if (code !== 0)
          console.log(new Error(`Worker stopped with exit code ${code}`));
      })
  }
  

webSocket(process.argv[2])
bot(process.argv[2])