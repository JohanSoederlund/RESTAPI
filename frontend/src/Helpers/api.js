

/**
 * POST to register or login
 */
async function registerOrLogin(user){
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

/**
 * Add article to database
 */
async function postJournal(token, article){
    let url = "journal";
    let response = await fetch("http://localhost:3001/"+url, {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': token
    },
        body: JSON.stringify({article: article})
    });
    return await response.json();
}

/**
 * Get one complete journal with articles
 */
async function getJournal(token){
    let url = "journal";
    let response = await fetch("http://localhost:3001/"+url, {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': token
    }
    });
    return await response.json();
}

module.exports = {
    registerOrLogin,
    getJournal,
    postJournal
}
