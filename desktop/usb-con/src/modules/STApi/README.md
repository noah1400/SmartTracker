
# Usage

```javascript
const { STAuth } = require("stauth");
const { STApi } = require("stapi");
const stAuthInstance = new STAuth();

stAuthInstance.init()

  await stAuthInstance.login("admin", "admin")
    .then(async (result) => {

      console.log(result)
      const stApiInstance = new STApi()
      stApiInstance.token = stAuthInstance.token

      const user = await stApiInstance.getUser("1").catch((err) => {
        console.error(err)
      })
      console.log(JSON.stringify(user, null, 2))
    })
    .catch((err) => {
      console.error(err)
    })
```
