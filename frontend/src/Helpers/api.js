


async function login(user){
    let result = await fetch("http://localhost:3001/");


    console.log("login");
    console.log(result);
    console.log(result.body);
    return result;
}


module.exports = {
    login
}