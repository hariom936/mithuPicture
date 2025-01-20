import "reflect-metadata"
import { DataSource } from "typeorm"
import path from "path"
const AppDataSource = new DataSource({
    type: "postgres",
    host: "127.0.0.1",
    port: 5433,
    username: "postgres",
    password: "postgres@1",
    database: "mithuPicture",
    synchronize: false,
    logging: true,
    entities: [path.join(__dirname, '../entity/*.[tj]s')],
    migrations: [path.join(__dirname, '../migration/*.[tj]s')],
    
});
export default AppDataSource;






// typeorm migration:generate  src/migration/CreateUser
// typeorm migration:create src/migration/otp
// AppDataSource.initialize()
//   .then(() => {
//     console.log('Data Source has been initialized!');
//   })
//   .catch((err) => {
//     console.error('Error during Data Source initialization:', err);
//   });