


async function registerOrLogin(user){
    console.log("registerOrLogin");
    let url = (user.register ? "register" : "login")
    let response = await fetch("http://localhost:3001/"+url, {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
        body: JSON.stringify(user)
    });
    return await response.json();
}

async function getProfile(user){
    console.log("getProfile");
    let url = "profile";
    let response = await fetch("http://localhost:3001/"+url, {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': user.token
    }
    });
    return await response.json();
}


module.exports = {
    registerOrLogin,
    getProfile
}

/* 'Bearer '+
,
        body: JSON.stringify(user)
        */