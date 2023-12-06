

class AbstractOAuthService {
    constructor( config ) {
        if (this.constructor === AbstractOAuthService) {
            throw new TypeError('Abstract class "AbstractOAuthService" cannot be instantiated directly');
        }

        if (this.OAuthLogin === undefined) {
            throw new TypeError('Classes extending the abstract class AbstractOAuthService must implement the login method');
        }

        this.config = config;
    }
}