import app from "./app";
import environment from './config/env';

app.listen(environment.PORT, () => {
  console.log(`Server is running on port ${environment.PORT}`);
});