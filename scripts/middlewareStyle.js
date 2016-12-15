// middleware style

// data => analysisDATA

analyze(data, (err, analysisDATA)=>{
   console.log(analysisDATA);
});

// API
const analyze = (data, response) =>{
    const request = {};
    request.data = data;
    // some parameters
    A1(request, response, ()=>{
       A2(request, response, ()=>{
            const analysisDATA = data.analysis;
            return response(null, analysisDATA);
       });
    });
};

const A1 = (request, response, next)=>{
    if(err){
        return response(err);
    }
    // execute
    next();
}

const A2 = (request, response, next)=>{
    if(err){
        return response(err);
    }
    next();
}

promsieFucntion((request, response)=>{
    return P0(request, response);
})
.then((request, response)=>{
    return P1(request, response);
})
.then((request, response)=>{
    return P2(request, response);
})
.catch((err)=>{
    return response(err);
});

const P0 = (req, res)=>{
    return new Promise((resolve, reject)=>{
        if(err){
            reject();
        } else {
            resolve(res, res);
        }
    });
}