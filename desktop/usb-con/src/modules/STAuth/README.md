
# STAuth module

## Description

This module is responsible for the authentication of the user.

## Usage

```javascript
const { STAuth } = require("stauth");
const stauthInstance = new STAuth();

// Ping
const pingResult = await stauthInstance.ping();
// Login
const loginResult = await stauthInstance.login("admin", "admin");
// Ping to protected route
const protectedPingResult = await stauthInstance.protectedPing();
```

## Methods

### ping()

Ping the server.

**Returns:** `Dictionary<string, string>`
**Example:**

```javascript
const pingResult = await stauthInstance.ping();
```

### login(username, password)

Login to the server.

**Parameters:**
    username: `string` - The username of the user.
    password: `string` - The password of the user.

**Returns:** `Dictionary<string, string>`

**Example:**

```javascript
const loginResult = await stauthInstance.login("admin", "admin");
```

### protectedPing()

Ping the server with authentication.

**Returns:** `Dictionary<string, string>`

**Example:**

```javascript
const protectedPingResult = await stauthInstance.protectedPing();
```