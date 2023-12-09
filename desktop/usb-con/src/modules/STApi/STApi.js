
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

    constructProjectQuery(withTimeEntries = false) {
        let query = `
            query GetAllProjects {
                projects {
                    id
                    name
                    description
                    createdAt
                    updatedAt
        `;
    
        if (withTimeEntries) {
            query += `
                    timeEntries {
                        id
                        description
                        startTime
                        endTime
                        createdAt
                        updatedAt
                        user {
                            id
                            username
                        }
                    }
            `;
        }
    
        query += `
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
                }
            }
            `;
    }

    configureFetchOptions(query, variables, bearerToken) {
        return {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${bearerToken}`
            },
            body: JSON.stringify({ query, variables })
        };
    }

    async getTimeEntryForUser(userId) {
        const query = this.constructUserTimeEntryQuery();
        const variables = { userId };
        const fetchOptions = this.configureFetchOptions(query, variables, this._TOKEN);
    
        try {
            const response = await fetch(this.QL_URL, fetchOptions)
            const data = await response.json()
            return data
        } catch (error) {
            console.error('Error fetching time entries:', error)
            throw error
        }
    }

    async executeCustomQuery(query, variables) {
        const fetchOptions = this.configureFetchOptions(query, variables, this._TOKEN);
    
        try {
            const response = await fetch(this.QL_URL, fetchOptions)
            const data = await response.json()
            return data
        } catch (error) {
            console.error('Error fetching time entries:', error)
            throw error
        }
    }

    async getAllProjects(withTimeEntries = false) {
        const query = this.constructProjectQuery(withTimeEntries);
        const variables = {};
        const fetchOptions = this.configureFetchOptions(query, variables, this._TOKEN);
    
        try {
            const response = await fetch(this.QL_URL, fetchOptions)
            const data = await response.json()
            return data
        } catch (error) {
            console.error('Error fetching projects:', error)
            throw error
        }
    }

}

module.exports = { STApi }