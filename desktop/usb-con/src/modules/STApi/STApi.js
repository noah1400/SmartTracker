
class STApi {

    BASE_URL = 'http://127.0.0.1:8000'
    QL_URL = this.BASE_URL + '/graphql'

    _TOKEN = null

    set token(token) {
        this._TOKEN = token
    }

    constructor(baseurl = this.BASE_URL,
        glURL = this.QL_URL) {
        this.config = {
            baseurl: baseurl,
            glURL: glURL
        }
    }

    getTimeEntriesQueryPart() {
        return `
            timeEntries {
                        id
                        description
                        startTime
                        endTime
                        createdAt
                        updatedAt
                        project {
                            id
                            name
                        }
                    }
        `;
    }

    constructProjectQuery(withTimeEntries = false) {
        let query = `
            query GetAllProjects {
                projects {
                    id
                    name
                    description
                    createdAt
                    updatedAt
                    ${withTimeEntries ? this.getTimeEntriesQueryPart() : ''}
                }
            }
        `;
        return query;
    }

    constructUserTimeEntryQuery() {
        return `
            query GetUserTimeEntries($userId: ID!) {
                user(id: $userId) {
                    id
                    username
                    ${this.getTimeEntriesQueryPart()}
                }
            }
            `;
    }

    constructUserQuery(userId, withTimeEntries = false) {
        let query = `
            query GetUser($userId: ID!) {
                user(id: $userId) {
                    id
                    username
                    email
                    service
                    role
                    createdAt
                    updatedAt
                    ${withTimeEntries ? this.getTimeEntriesQueryPart() : ''}
                }
            }
        `;
        return query;
    }

    configureFetchOptions(query, variables) {
        if (this._TOKEN === null || this._TOKEN === undefined) {
            throw new Error("No token set");
        }
        return {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this._TOKEN}`
            },
            body: JSON.stringify({ query, variables })
        };
    }

    async executeQuery(query, variables) {
        const fetchOptions = this.configureFetchOptions(query, variables);
    
        try {
            const response = await fetch(this.QL_URL, fetchOptions)
            const data = await response.json()
            return data
        } catch (error) {
            console.error('Error fetching query: ', error)
            throw error
        }
    }

    async getAllProjects(withTimeEntries = false) {
        const query = this.constructProjectQuery(withTimeEntries);
        return await this.executeQuery(query, null)
    }

    async getUser(userId, withTimeEntries = false) {
        const query = this.constructUserQuery(userId, withTimeEntries);
        const variables = { userId };
        return await this.executeQuery(query, variables)
    }

    async getTimeEntryForUser(userId) {
        const query = this.constructUserTimeEntryQuery();
        const variables = { userId };
        return await this.executeQuery(query, variables)
    }

}

module.exports = { STApi }