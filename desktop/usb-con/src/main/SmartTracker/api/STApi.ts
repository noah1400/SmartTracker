
class STApi {

    BASE_URL = 'http://127.0.0.1:8000'
    QL_URL = this.BASE_URL + '/graphql'

    _TOKEN: string | null = null
    config: {
        baseurl: string; glURL: string //127.0.0.1:8000'
            
    }

    set token(token: string) {
        this._TOKEN = token
    }

    constructor(baseurl = '',
        glURL = '') {
        if (baseurl === null || baseurl === undefined || baseurl === '') {
            baseurl = this.BASE_URL;
        }
        if (glURL === null || glURL === undefined || glURL === '') {
            glURL = this.QL_URL;
        }
        this.config = {
            baseurl: baseurl,
            glURL: glURL
        }
    }

    // get data query construction

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

    constructUserQuery(withTimeEntries = false) {
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

    // post data query construction

    constructCreateUserMutation() {
        return `
            mutation CreateUser($username: String!, $email: String!, $password: String!, $service: String!, $role: String) {
                createUser(username: $username, email: $email, password: $password, service: $service, role: $role) {
                    id
                    username
                    email
                    service
                    role
                    createdAt
                    updatedAt
                }
            }
        `;
    }

    constructDeleteUserMutation() {
        return `
            mutation DeleteUser($userId: ID!) {
                deleteUser(id: $userId)
            }
        `;
    }

    constructUpdateUserMutation() {
        return `
            mutation UpdateUser($userId: ID!, $username: String, $email: String, $service: String, $role: String) {
                updateUser(id: $userId, username: $username, email: $email, service: $service, role: $role) {
                    id
                    username
                    email
                    service
                    role
                    createdAt
                    updatedAt
                }
            }
        `;
    }

    constructCreateProjectMutation() {
        return `
            mutation CreateProject($name: String!, $description: String) {
                createProject(name: $name, description: $description) {
                    id
                    name
                    description
                    createdAt
                    updatedAt
                }
            }
        `;
    }

    constructUpdateProjectMutation() {
        return `
            mutation UpdateProject($projectId: ID!, $name: String, $description: String) {
                updateProject(id: $projectId, name: $name, description: $description) {
                    id
                    name
                    description
                    createdAt
                    updatedAt
                }
            }
        `;
    }

    constructDeleteProjectMutation() {
        return `
            mutation DeleteProject($projectId: ID!) {
                deleteProject(id: $projectId)
            }
        `;
    }

    constructCreateTimeEntryMutation() {
        return `
            mutation CreateTimeEntry($description: String!, $startTime: String!, $endTime: String!, $userId: ID!, $projectId: ID!) {
                createTimeEntry(description: $description, startTime: $startTime, endTime: $endTime, userId: $userId, projectId: $projectId) {
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
                    project {
                        id
                        name
                    }
                }
            }
        `;
    }

    constructUpdateTimeEntryMutation() {
        return `
            mutation UpdateTimeEntry($timeEntryId: ID!, $description: String, $startTime: String, $endTime: String, $userId: ID, $projectId: ID) {
                updateTimeEntry(id: $timeEntryId, description: $description, startTime: $startTime, endTime: $endTime, userId: $userId, projectId: $projectId) {
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
                    project {
                        id
                        name
                    }
                }
            }
        `;
    }

    constructDeleteTimeEntryMutation() {
        return `
            mutation DeleteTimeEntry($timeEntryId: ID!) {
                deleteTimeEntry(id: $timeEntryId)
            }
        `;
    }

    configureFetchOptions(query: string, variables: any) {
        if (this._TOKEN === null || this._TOKEN === undefined || this._TOKEN === '') {
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

    configureFetchOptionsForPost(data: any) {
        if (this._TOKEN === null || this._TOKEN === undefined) {
            throw new Error("No token set");
        }
        return {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this._TOKEN}`
            },
            body: JSON.stringify(data)
        };
    }

    getFetchURLForGet(data: any) {
        // resturn params part of url
        // using key=value&key=value of data
        let params = "";
        for (const key in data) {
            params += `${key}=${data[key]}&`;
        }
        // remove last &
        params = params.slice(0, -1);
        return {
            options: {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this._TOKEN}`
                }
            },
            params: params
        };
    }

    async executeQuery(query: any, variables: any) {
        const fetchOptions = this.configureFetchOptions(query, variables);

        try {
            const response = await fetch(this.QL_URL, fetchOptions)
            const data = await response.json()
            if (data.errors) {
                throw new Error(data.errors[0].message)
            }
            return data
        } catch (error) {
            console.error('Error fetching query: ', error)
            throw error
        }
    }

    // get data from server

    async getAllProjects(withTimeEntries = false) {
        const query = this.constructProjectQuery(withTimeEntries);
        return await this.executeQuery(query, null)
    }

    async getUser(userId: any, withTimeEntries = false) {
        const query = this.constructUserQuery(withTimeEntries);
        const variables = { userId };
        return await this.executeQuery(query, variables)
    }

    async getTimeEntryForUser(userId: any) {
        const query = this.constructUserTimeEntryQuery();
        const variables = { userId };
        return await this.executeQuery(query, variables)
    }

    // post data to server

    async createUser(username: any, email: any, password: any, service: any, role = 'user') {
        const mutation = this.constructCreateUserMutation();
        const variables = { username, email, password, service, role };
        return await this.executeQuery(mutation, variables);
    }

    async deleteUser(userId: any) {
        const mutation = this.constructDeleteUserMutation();
        const variables = { userId };
        return await this.executeQuery(mutation, variables);
    }

    async updateUser(userId: any, username: any, email: any, service: any, role: any) {
        const mutation = this.constructUpdateUserMutation();
        const variables = { userId, username, email, service, role };
        return await this.executeQuery(mutation, variables);
    }

    async createProject(name: any, description: any) {
        const mutation = this.constructCreateProjectMutation();
        const variables = { name, description };
        return await this.executeQuery(mutation, variables);
    }

    async updateProject(projectId: any, name: any, description: any) {
        const mutation = this.constructUpdateProjectMutation();
        const variables = { projectId, name, description };
        return await this.executeQuery(mutation, variables);
    }

    async deleteProject(projectId: any) {
        const mutation = this.constructDeleteProjectMutation();
        const variables = { projectId };
        return await this.executeQuery(mutation, variables);
    }

    async createTimeEntry(description: any, startTime: any, endTime: any, userId: any, projectId: any) {
        const mutation = this.constructCreateTimeEntryMutation();
        const variables = { description, startTime, endTime, userId, projectId };
        return await this.executeQuery(mutation, variables);
    }

    async updateTimeEntry(timeEntryId: any, description: any, startTime: any, endTime: any, userId: any, projectId: any) {
        const mutation = this.constructUpdateTimeEntryMutation();
        const variables = { timeEntryId, description, startTime, endTime, userId, projectId };
        return await this.executeQuery(mutation, variables);
    }

    async deleteTimeEntry(timeEntryId: any) {
        const mutation = this.constructDeleteTimeEntryMutation();
        const variables = { timeEntryId };
        return await this.executeQuery(mutation, variables);
    }

    async post(endpoint: any, data: any) {
        let fetchOptions = this.configureFetchOptionsForPost(data);

        try {
            const response = await fetch(this.BASE_URL + endpoint, fetchOptions)
            const data = await response.json()
            if (data.errors) {
                throw new Error('Error in response: ', data.errors[0].message)
            }
            return data
        } catch (error) {
            console.error('Error fetching query: ', error)
            throw error
        }
    }

    async get(endpoint: any, data: any) {
        console.log("get data: ", data);
        let fetchOptions = this.getFetchURLForGet(data);

        try {
            const response = await fetch(this.BASE_URL + endpoint + "?" + fetchOptions.params, fetchOptions.options)
            const data = await response.json()
            if (data.errors) {
                console.log("Error in response: ", data.errors[0].message);
                throw new Error('Error in response: ', data.errors[0].message)
            }
            return data
        } catch (error) {
            console.error('Error fetching query: ', error)
            throw error
        }
    }

}

export { STApi }
