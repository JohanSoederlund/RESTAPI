import Cookies from 'universal-cookie';
    
/**
 * Cookie management class for setting session token
 */
export default class Cookie {
    constructor () {
       this.cookies = new Cookies();
    }

    async setCookie(token){
        this.cookies.set('token', token, { path: '/' });
    }
    
    getCookie() {
        return this.cookies.get('token');
    }

    removeCookie() {
        this.cookies.remove('token');
    }
}
