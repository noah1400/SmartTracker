# SmartTracker Module ( Name will change )

## Description
This module facilitates the communication between the desktop application and the server application. It encompasses both authentication processes and data transfer mechanisms.

## Usage

```typescript
import { SmartTracker } from './SmartTracker/SmartTracker';
const ST = SmartTracker.getInstance();
```

The SmartTracker class employs the Singleton design pattern for its implementation. Instantiating the SmartTracker class triggers the initialization of all necessary resources for this class. This process necessitates the readiness of the electron app, as indicated by app.isReady() returning true. The SmartTracker class is designed to automatically wait for the app to be ready asynchronously. It is important to note that the majority of the SmartTracker class methods require the app to be fully prepared. Therefore, it is advisable to avoid immediately invoking methods such as connect at the beginning of a project, as the initialization process might not yet be complete.

### SmartTracker.connect(string, string)

This method establishes a connection to the server using the provided credentials. If a login was previously executed and the credentials were saved on the disk, and the stored token has not expired, SmartTracker will not initiate a login request to the server.
```typescript
ST.connect('admin', 'admin');
```

check workflow


### SmartTracker.disconnect()

This method invokes the logout function of the STAuth module, leading to the deletion of all login data, including the token. It also resets the auto-update settings, disabling them and setting the interval to 5 minutes.
```typescript
ST.disconnect();
```

### SmartTracker.autoUpdate : boolean

When set to true, SmartTracker actively retrieves updates executed on the server and stores all new TimeEntries and Projects in the local database. This process occurs at intervals specified by the `SmartTracker.autoUpdateInterval` value.
```typescript
ST.autoUpdate = true;
```

### SmartTracker.autoUpdateInterval : number

This property defines the interval for automatic updates in milliseconds.
```typescript
ST.autoUpdateInterval = 5 * 60 * 1000; // 5 minutes
```

### SmartTracker.manualUpdate()

This method explicitly initiates an update with the server. By invoking this function, SmartTracker synchronizes with the server, ensuring that any recent changes or updates are reflected in the local data immediately.
```typescript
ST.manualUpdate();
```